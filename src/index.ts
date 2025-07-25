import "@/config/env";

import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import userAgent from "express-useragent";
import PinoHttp from "pino-http";
import requestip from "request-ip";

import { initializeI18n } from "./config/i18n";
import { initializeSentry } from "./config/sentry";
import createApolloHTTPServer from "./graphql";
import logger from "./utils/logger";
import appContext from "./v1/middlewares/appContext";
import errorHandler from "./v1/middlewares/errorHandler";
import rateLimiter from "./v1/middlewares/rateLimiter";
import v1Router from "./v1/routes";

async function main() {
  const app = express();

  await initializeI18n(app);

  app.use(json());
  app.use(cors<cors.CorsRequest>());
  app.use(
    PinoHttp({
      logger,
    }),
  );
  app.use(userAgent.express());
  app.use(requestip.mw());

  // https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues
  app.set("trust proxy", 1);

  const Sentry = initializeSentry(app);

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  app.use(appContext);
  app.use(rateLimiter); // Rate limiter depends on Context

  app.get("/healthz", (req, res) => res.json({ success: true }));

  app.get("/generate_204", (req, res) => res.status(204).json({ success: true }));

  app.get("/ip", (request, response) => response.send(request.ip));

  const { httpServer, apolloServer } = await createApolloHTTPServer(app);

  app.use("/v1", v1Router);
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => req.context,
    }),
  );

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use(errorHandler);

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: 4000 }, resolve);
    logger.info(`🚀 Server ready at /graphql`);
  });
}

main().catch((e) => {
  logger.error(e as Error);
});
