import { z } from 'zod';

import { TRPCrouter, protectedProcedure } from '../trpc';
import { type Group } from '@soma/db';

export const groupRouter = TRPCrouter({
    getGroup: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.group.findUniqueOrThrow({
                where: {
                    groupId: input,
                }
            });
        }),
    getGroupsInBulk: protectedProcedure
        .input(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            const groupList: Group[] = [];
            for (const id of input) {
                await ctx.prisma.group
                    .findUnique({ where: { groupId: id } })
                    .then((group) => {
                        if (group) groupList.push(group);
                    });
            }
            return groupList;
        }),
    checkGroupDeletion: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) =>{
            return await ctx.prisma.event.findFirst({
                where: {
                    action: 7,
                    values: {
                        equals: {
                            groupId: input
                        }
                    }
                }
            })
        })
});
