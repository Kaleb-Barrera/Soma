import { TRPCError } from "@trpc/server";
import type { OauthAccessTokenJSON } from "@clerk/clerk-sdk-node"
import type { classroom_v1 } from "googleapis/build/src/apis/classroom/v1.d.ts"

import { TRPCrouter, protectedProcedure } from "../trpc";

export const classroomRouter = TRPCrouter({
    userLoggedInGroupCheck: protectedProcedure.query(async ({ ctx }) => {
        const { userId } = ctx.auth
        const url = `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_google`
        const token_request = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY!}`
            }
        })

        const token_response = await token_request.json()
        console.log(token_response)

        if (token_response.errors) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Clerk server responded with error: " + token_response })
        }

        const { token } = token_response[0] as OauthAccessTokenJSON
        console.log("Token: " + token)
        console.log()

        const courses_request = await fetch("https://classroom.googleapis.com/v1/courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const courses_response = await courses_request.json()

        const courses: classroom_v1.Schema$Course[] = courses_response.courses

        courses?.forEach((course) => {
            console.log(`${course.id}`)
            console.log(course)
            console.log()
        })
        return courses
    }),
})
