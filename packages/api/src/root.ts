import { userRouter } from "./router/user";
import { classroomRouter } from "./router/classroom"
import { TRPCrouter } from "./trpc";

export const appRouter = TRPCrouter({
    user: userRouter,
    classroom: classroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
