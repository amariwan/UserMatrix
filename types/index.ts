import type { Session } from "@prisma/client";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { TFunction } from "i18next";
import type { Redis } from "ioredis";
import type pino from "pino";

import type { ExtendedPrismaClient } from "@/config/database";
import type { DocClient } from "@/utils/docClient";
import type { EmailClient } from "@/utils/email";
import type { JWTClient } from "@/utils/jwt";
import type { SMSClient } from "@/utils/sms";
import type { Storage } from "@/utils/storage";

import type { AccountStatus } from "./graphql";

export interface CurrentUser {
  id: string;
  status: AccountStatus;
  language: string | null;
  roles: string[];
  permissions: string[];
  sessions: Session[];
}

export interface SocketContext {
  currentUser?: CurrentUser | null;
  t: TFunction<"translation" | "error", undefined>;
  prismaClient: ExtendedPrismaClient;
  pubsub: RedisPubSub;
  storage: Storage;
}

export interface AppContext {
  userAgent?: string;
  clientId: string;
  clientIp: string;
  log: pino.Logger<never>;
  currentUser?: CurrentUser | null;
  t: TFunction<"translation" | "error", undefined>;
  prismaClient: ExtendedPrismaClient;
  redisClient: Redis;
  emailClient: EmailClient;
  smsClient: SMSClient;
  jwtClient: JWTClient;
  docClient: DocClient;
  pubsub: RedisPubSub;
  language: string;
  storage: Storage;
}

declare global {
  namespace Express {
    namespace MulterS3 {
      export interface File extends Multer.File {
        bucket: string;
        key: string;
        acl: string;
        contentType: string;
        contentDisposition: null;
        storageClass: string;
        serverSideEncryption: null;
        metadata: JSON;
        location: string;
        etag: string;
      }
    }

    export interface Request {
      context: AppContext;
      file?: MulterS3.File | undefined;
      files?:
        | {
            [fieldname: string]: MulterS3.File[];
          }
        | MulterS3.File[]
        | undefined;
    }
  }
}

export default {};
