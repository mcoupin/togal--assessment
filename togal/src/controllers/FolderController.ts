import { BaseContext, Context, ParameterizedContext } from "koa";
import Router from "koa-router";
import { folderService } from "../services";
import { Folder } from "../entities";
import { validate, ValidationError } from "class-validator";

export default class FolderController {
  public static async getFolders(
    ctx: ParameterizedContext<
      BaseContext,
      Router.IRouterParamContext<Context, {}>,
      Folder[]
    >
  ): Promise<void> {
    const { status, body } = await folderService.getFolders();

    ctx.status = status;
    ctx.body = body;
  }

  public static async createFolder(
    ctx: ParameterizedContext<
      BaseContext,
      Router.IRouterParamContext<Context, {}>,
      Folder | ({ [type: string]: string } | undefined)[]
    >
  ): Promise<void> {
    const folderToSave = new Folder();
    folderToSave.id = ctx.request.body.id;
    folderToSave.name = ctx.request.body.name;
    const errors: ValidationError[] = await validate(folderToSave);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors.map((error) => error.constraints);
    } else {
      const { status, body } = await folderService.createFolder(folderToSave);
      ctx.status = status;
      ctx.body = body;
    }
  }
}
