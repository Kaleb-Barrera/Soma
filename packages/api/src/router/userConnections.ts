import { z } from "zod";

import { TRPCrouter, protectedProcedure } from "../trpc";

export const userConnectionsRouter = TRPCrouter({
    getAllGroups: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUniqueOrThrow({
            where: {
                userId: ctx.auth.userId.slice(4)
            },
            select: {
                
            }
        })
    }),
    getLastMessage: protectedProcedure
        .input(
            z.string()
        )
        .query(({ ctx, input }) => {
            return ctx.prisma.message.findFirst({
                where: {
                    groupId: input
                },
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ]
            })
        }),
})
