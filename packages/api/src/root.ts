import { userConnectionsRouter } from "./router/userConnections";
import { classroomRouter } from "./router/classroom"
import { TRPCrouter } from "./trpc";

export const appRouter = TRPCrouter({
    userConnections: userConnectionsRouter,
    classroom: classroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
