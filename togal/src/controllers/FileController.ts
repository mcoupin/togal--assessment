import { BaseContext, Context, ParameterizedContext } from "koa";
import Router from "koa-router";
import { documentService, fileService } from "../services";
import { Document, File } from "../entities";

export default class FileController {
  public static async uploadFile(
    ctx: ParameterizedContext<
      BaseContext,
      Router.IRouterParamContext<Context, {}>,
      string | { error: string } | Document
    >
  ): Promise<void> {
    const documentId: number = ctx.request.body?.documentId;
    if (!documentId || isNaN(documentId)) {
      ctx.status = 400;
      ctx.body = { error: "documentId must be an integer" };
      return;
    }
    if (!ctx.request.files || !ctx.request.files.file) {
      ctx.status = 400;
      ctx.body = { error: "No file uploaded" };
      return;
    }
    const file = Array.isArray(ctx.request.files?.file)
      ? ctx.request.files!.file[0]
      : ctx.request.files!.file;
    const { fileName, uploadDate, s3Key, fileType } =
      await fileService.uploadFile(file);

    const fileToAdd = FileController.createFileToAdd(
      fileName,
      uploadDate,
      s3Key,
      fileType
    );
    const { status, body } = await documentService.addFileToDocument(
      documentId,
      fileToAdd
    );
    ctx.status = status;
    ctx.body = body;
  }

  private static createFileToAdd(
    fileName: string,
    uploadDate: Date,
    s3key: string,
    fileType: string
  ): File {
    const fileToAdd = new File();
    fileToAdd.name = fileName;
    fileToAdd.uploadDate = uploadDate;
    fileToAdd.s3Key = s3key;
    fileToAdd.type = fileType;
    return fileToAdd;
  }

  public static async downloadFile(
    ctx: ParameterizedContext<
      BaseContext,
      Router.IRouterParamContext<Context, {}>,
      any | { error: string }
    >
  ): Promise<void> {
    const file = await fileService.downloadFile(ctx.params.s3Key as string);
    if (!file) {
      ctx.status = 404;
      ctx.body = { error: "File not found" };
      return;
    }
    ctx.attachment("file");
    ctx.type = file.ContentType || "application/octet-stream";
    ctx.body = file.Body;
  }
}
