import { Webhook } from "svix";
import { buffer } from "micro";
import { google } from "googleapis"
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookEvent, OauthAccessTokenJSON } from "@clerk/clerk-sdk-node"

import { prisma } from "@soma/db";
import { trpc } from "@/utils/trpc";

export const config = {
    api: {
        bodyParser: false,
    },
}

const secret: string = process.env.CLERK_WEBHOOK_USER_CREATED!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const payload = (await buffer(req)).toString();
    const headers = req.headers;

    const wh = new Webhook(secret);
    let evt: WebhookEvent
    try {
        evt = wh.verify(payload, headers as any) as any;
    } catch (err) {
        return res.status(401).json({ code: "401" });
    }
    console.log(evt)

    if (evt.type != 'user.created')
        return res.status(400).json({ code: "400" });

    const user_id = evt.data.id;

    const url = `https://api.clerk.com/v1/users/${user_id}/oauth_access_tokens/oauth_google`

    const token_request = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY!}`
        }
    })

    const token_response = await token_request.json()
    console.log(token_response)

    if (token_response.errors) {
        return res.status(400).json({ message: 'Clerk servers responded with an error' })
    }
    
    const { token } = token_response[0] as OauthAccessTokenJSON

    const classroom = google.classroom({ version: 'v1', auth: token })

    const courses_response = await classroom.courses.list()
    const courses = courses_response.data.courses

    courses?.forEach((course) => {
        console.log(`${course.id}, ${course.name}: ${course.descriptionHeading}`)
    })
    

    res.json({ code: "200" });
}
