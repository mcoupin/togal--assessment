import AppDataSource from "../config";
import { Document, File } from "../entities";

export default class DocumentsService {
  public static async getDocuments(folderId: number): Promise<{
    status: number;
    body: Document[];
  }> {
    const documents = await AppDataSource.getRepository(Document).find({
      where: { folder: { id: folderId } },
      relations: {
        files: true,
      },
    });
    return { status: documents.length === 0 ? 204 : 200, body: documents };
  }

  public static async createDocument(document: Document): Promise<{
    status: number;
    body: Document;
  }> {
    await AppDataSource.getRepository(Document).save(document);
    return { status: 201, body: document };
  }

  public static async addFileToDocument(
    documentId: number,
    fileToAdd: File
  ): Promise<{
    status: number;
    body: Document | string;
  }> {
    const documentToUpdate = await AppDataSource.getRepository(
      Document
    ).findOne({ where: { id: documentId }, relations: { files: true } });
    if (!documentToUpdate) {
      return { status: 204, body: "no document found" };
    }

    documentToUpdate.files.push(fileToAdd);
    await AppDataSource.getRepository(Document).save(documentToUpdate);
    return { status: 200, body: documentToUpdate };
  }
}
