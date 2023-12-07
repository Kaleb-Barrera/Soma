import { z } from "zod";
import { google } from "googleapis"
import { TRPCError } from "@trpc/server";
import type { OauthAccessTokenJSON } from "@clerk/clerk-sdk-node"

import { TRPCrouter, protectedProcedure } from "../trpc";

export const classroomRouter = TRPCrouter({
    userLoggedInGroupCheck: protectedProcedure.mutation(async ({ ctx }) => {
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

        const classroom = google.classroom({ version: 'v1', auth: token })

        const courses_response = await classroom.courses.list()
        const courses = courses_response.data.courses

        courses?.forEach((course) => {
            console.log(`${course.id}, ${course.name}: ${course.descriptionHeading}`)
        })
    }),
})
