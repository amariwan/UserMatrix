import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import numeral from "numeral";

import {
  DEFAULT_USER_PICTURE_SIZE,
  DEFAULT_USER_THUMBNAIL_SIZE,
  MAX_USER_IMAGE_FILE_SIZE_IN_BYTES,
  SUPPORTED_IMAGE_TYPES,
} from "@/constants/limits";
import QueryError from "@/utils/errors/QueryError";
import getImageUrl from "@/utils/getImageUrl";
import uploader from "@/v1/middlewares/fileUploader";

const uploadCurrentUserPicture = (req: Request, res: Response, next: NextFunction) => {
  const upload = uploader({
    supportedMimeTypes: SUPPORTED_IMAGE_TYPES,
    folder: "avatars",
    maxFileSizeInBytes: MAX_USER_IMAGE_FILE_SIZE_IN_BYTES,
  }).single("picture");

  upload(req, res, (err) => {
    const {
      context: { t, prismaClient, currentUser },
      file,
      files,
    } = req;
    (async () => {
      if (err instanceof MulterError) {
        let errorMessage: string | undefined = err.message;

        switch (err.code) {
          case "LIMIT_UNEXPECTED_FILE":
            errorMessage = t("UNSUPPORTED_FILE_TYPE", {
              ns: "error",
              supportedMimeTypes: SUPPORTED_IMAGE_TYPES,
            });
            break;
          case "LIMIT_FILE_SIZE":
            errorMessage = t("FILE_SIZE_EXCEEDED", {
              ns: "error",
              size: numeral(MAX_USER_IMAGE_FILE_SIZE_IN_BYTES).format("0b"),
              types: SUPPORTED_IMAGE_TYPES,
            });
            break;
          case "LIMIT_FILE_COUNT":
            errorMessage = t("FILE_LIMIT_EXCEEDED", {
              ns: "error",
              count: (files?.length ?? 0) as number,
            });
            break;
          default:
            next(new QueryError(t("UPLOAD_FAILED", { ns: "error" })));
            break;
        }
        next(new QueryError(errorMessage));
      } else if (err) {
        next(err);
      } else if (file) {
        const { key, bucket, size, mimetype, fieldname, originalname } = file;

        const oldPicture = await prismaClient.user
          .findUnique({
            where: {
              id: currentUser!.id,
            },
          })
          .avatar();

        if (oldPicture) {
          await prismaClient.file.delete({
            where: {
              key: oldPicture.fileKey,
              bucket: oldPicture.fileBucket,
            },
          });
        }

        const user = await prismaClient.user.update({
          where: {
            id: currentUser!.id,
          },
          data: {
            avatar: {
              create: {
                file: {
                  create: {
                    key,
                    bucket,
                    size,
                    mimetype,
                    fieldname,
                    originalname,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            avatar: {
              include: {
                file: {
                  select: {
                    key: true,
                    bucket: true,
                  },
                },
              },
            },
          },
        });

        res.status(201).json({
          success: true,
          data: {
            user: {
              id: user.id,
              pictureUrl: getImageUrl({
                ...user.avatar!.file,
                edits: {
                  resize: {
                    width: DEFAULT_USER_PICTURE_SIZE,
                    height: DEFAULT_USER_PICTURE_SIZE,
                  },
                },
              }),
              thumbnailUrl: getImageUrl({
                ...user.avatar!.file,
                edits: {
                  resize: {
                    width: DEFAULT_USER_THUMBNAIL_SIZE,
                    height: DEFAULT_USER_THUMBNAIL_SIZE,
                  },
                },
              }),
            },
          },
        });
      } else {
        if (!file) {
          next(new QueryError(t("NO_FILE_TO_UPLOAD", { ns: "error" })));
        } else {
          next(new QueryError(t("UPLOAD_FAILED", { ns: "error" })));
        }
      }
    })();
  });
};

export default uploadCurrentUserPicture;
