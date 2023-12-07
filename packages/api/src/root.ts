import { authRouter } from "./router/auth";
import { onStartupRouter } from "./router/onStartup";
import { classroomRouter } from "./router/classroom"
import { TRPCrouter } from "./trpc";

export const appRouter = TRPCrouter({
    onStartup: onStartupRouter,
    auth: authRouter,
    classroom: classroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
