import AppDataSource from "../config";
import { Folder } from "../entities";

export default class FolderService {
  public static async createFolder(
    folder: Folder
  ): Promise<{ status: number; body: Folder }> {
    await AppDataSource.manager.save(folder);
    return { status: 201, body: folder };
  }

  public static async getFolders(): Promise<{
    status: number;
    body: Folder[];
  }> {
    const folders = await AppDataSource.manager.find(Folder);
    return { status: 200, body: folders };
  }
}
