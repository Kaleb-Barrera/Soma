import { userRouter } from './router/user';
import { classroomRouter } from './router/classroom';
import { TRPCrouter } from './trpc';
import { eventsRouter } from './router/events';
import { groupRouter } from './router/group';
import { subgroupRouter } from './router/subgroups';

export const appRouter = TRPCrouter({
    user: userRouter,
    group: groupRouter,
    subgroup: subgroupRouter,
    events: eventsRouter,
    classroom: classroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
