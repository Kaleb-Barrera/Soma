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
    updateLocalInfo: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input: userId }) => {
            return await ctx.prisma.event.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    typeId: true,
                    studentEvents: {
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
                        }
                    },
                    teacherEvents: {
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
                    ownerEvents: {
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
                    }
                }
            })
        }),
});
