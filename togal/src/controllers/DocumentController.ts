import { BaseContext, Context, ParameterizedContext } from "koa";
import Router from "koa-router";
import { documentService } from "../services";
import { Document } from "../entities";
import { IsNumberString, validate, ValidationError } from "class-validator";

export default class DocumentController {
  public static async getDocuments(
    ctx: ParameterizedContext<
      BaseContext,
      Router.IRouterParamContext<Context, {}>,
      // type body response
      Document[] | { error: string }
    >
  ): Promise<void> {
    const folderId = parseInt(ctx.params.folderId);
    if (isNaN(folderId)) {
      ctx.status = 400;
      ctx.body = { error: "Folder id must be a number" };
      return;
    }
    const { status, body } = await documentService.getDocuments(folderId);

    ctx.status = status;
    ctx.body = body;
  }

  public static async createDocument(ctx: any): Promise<void> {
    const documentToSave = new Document();
    documentToSave.title = ctx.request.body.title;
    documentToSave.description = ctx.request.body.description;
    documentToSave.folder = ctx.request.body.folder;

    const errors: ValidationError[] = await validate(documentToSave);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors.map((error) => error.constraints);
    } else {
      const { body, status } = await documentService.createDocument(
        documentToSave
      );
      ctx.body = body;
      ctx.status = status;
    }
  }
}
