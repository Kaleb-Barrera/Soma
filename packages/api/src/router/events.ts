import { z } from 'zod';

import { TRPCrouter, protectedProcedure } from '../trpc';

export const eventsRouter = TRPCrouter({
    findEvents: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            return await ctx.prisma.event.findMany({
                where: {
                    values: {
                        path: '$.userId',
                        equals: input
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }),
})