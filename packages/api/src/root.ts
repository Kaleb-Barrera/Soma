import { authRouter } from "./router/auth";
import { onStartupRouter } from "./router/onStartup";
import { TRPCrouter } from "./trpc";

export const appRouter = TRPCrouter({
  onStartup: onStartupRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
