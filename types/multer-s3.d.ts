declare module "multer-s3" {
  type Callback<T> = (error: Error | null, value?: T) => void;
  type MetadataCallback = (error: Error | null, metadata?: Record<string, unknown>) => void;

  interface Options {
    s3: import("@aws-sdk/client-s3").S3Client;
    bucket:
      | ((req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void)
      | string;
    key?: (req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void;
    acl?:
      | ((req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void)
      | string
      | undefined;
    contentType?: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, mime?: string, stream?: NodeJS.ReadableStream) => void,
    ) => void;
    contentDisposition?:
      | ((req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void)
      | string
      | undefined;
    metadata?: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: MetadataCallback,
    ) => void;
    cacheControl?:
      | ((req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void)
      | string
      | undefined;
    serverSideEncryption?:
      | ((req: Express.Request, file: Express.Multer.File, callback: Callback<string>) => void)
      | string
      | undefined;
  }

  interface S3Storage {
    (options?: Options): import("multer").StorageEngine;
    AUTO_CONTENT_TYPE: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, mime?: string, stream?: NodeJS.ReadableStream) => void,
    ) => void;
    DEFAULT_CONTENT_TYPE: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: Callback<string>,
    ) => void;
  }

  const S3Storage: S3Storage;

  export = S3Storage;
}
