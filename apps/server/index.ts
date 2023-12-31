import express from "express"
import cors from "cors"

import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node"
import {createExpressMiddleware} from "@trpc/server/adapters/express"
import { appRouter, createTRPCContext as createContext } from "@soma/api"

const app = express()

app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json())
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(ClerkExpressWithAuth())

app.use(
    '/api/trpc',
    createExpressMiddleware({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        router: appRouter,
        createContext
    })
)

app.get("/", (req, res) => {    
    res.send("Hello world")
})

app.listen(3000)