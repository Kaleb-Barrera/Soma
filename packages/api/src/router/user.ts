import { z } from 'zod';

import { TRPCrouter, protectedProcedure } from '../trpc';
import { type User } from '@soma/db';

export const userRouter = TRPCrouter({
    getUser: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.user.findUniqueOrThrow({
                where: {
                    userId: input,
                },
            });
        }),
    getUserBulk: protectedProcedure
        .input(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            const userList: User[] = [];
            for (const id of input) {
                await ctx.prisma.user
                    .findUnique({ where: { userId: id } })
                    .then((user) => {
                        if (user) userList.push(user);
                    });
            }
            return userList;
        }),
    findEvents: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            return await ctx.prisma.event.findMany({
                where: {
                    values: {
                        equals: {
                            userId: input
                        }
                    }
                }
            })
        }),
});
