import { z } from "zod";

import { TRPCrouter, protectedProcedure } from "../trpc";

export const onStartupRouter = TRPCrouter({
    getAllGroups: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUniqueOrThrow({
            where: {
                userId: ctx.auth.userId.slice(4)
            },
            select: {
                ownedGroups: true,
                partakenGroups: true,
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
        })
})
