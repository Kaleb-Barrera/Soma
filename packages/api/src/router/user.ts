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
    getAllGroups: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const { userId } = await ctx.prisma.user.findUniqueOrThrow({
                where: {
                    userId: input,
                },
            });
            return await ctx.prisma.user.findUniqueOrThrow({
                where: {
                    userId: userId,
                },
                select: {
                    isStudentAt: {
                        include: {
                            subgroup: {
                                include: {
                                    group: {
                                        include: {
                                            teachers: true,
                                        },
                                    },
                                    owners: true,
                                    students: true,
                                },
                            },
                        },
                    },
                    teachesAt: {
                        include: {
                            group: {
                                include: {
                                    teachers: true,
                                    subgroups: {
                                        where: {
                                            owners: {
                                                every: {
                                                    userId: userId,
                                                },
                                            },
                                        },
                                        include: {
                                            students: true,
                                            owners: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    ownsSubgroups: {
                        where: {
                            NOT: {
                                subgroup: {
                                    group: {
                                        teachers: {
                                            every: {
                                                userId: userId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        include: {
                            subgroup: {
                                include: {
                                    students: true,
                                    owners: true,
                                    group: {
                                        include: {
                                            teachers: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }),
});
