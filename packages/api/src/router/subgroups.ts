import { z } from 'zod';

import { TRPCrouter, protectedProcedure } from '../trpc';
import type { Subgroup } from '@soma/db';

export const subgroupRouter = TRPCrouter({
    getSubgroup: protectedProcedure
        .input(z.object({
            groupId: z.string(),
            subgroupId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.subgroup.findUniqueOrThrow({
                where: {
                    groupId_subgroupId: input
                }
            });
        }),
    getSubgroupsInBulk: protectedProcedure
        .input(z.array(z.object({
            groupId: z.string(),
            subgroupId: z.string()
        })))
        .query(async ({ ctx, input }) => {
            const subgroupList: Subgroup[] = [];
            for (const ids of input) {
                await ctx.prisma.subgroup
                    .findUnique({ where:  { groupId_subgroupId: ids }})
                    .then((subgroup) => {
                        if (subgroup) subgroupList.push(subgroup);
                    });
            }
            return subgroupList;
        }),
    getGroupEvents: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) =>{
            return await ctx.prisma.event.findMany({
                where: {
                    AND: [
                        {
                            values: {
                                path: '$.groupId',
                                equals: input,
                            }
                        },
                        {
                            NOT: {
                                values: {
                                    path: '$.userId',
                                    not: ''
                                }
                            }
                        }
                    ]
                }
            })
        })
});
