import request from "supertest";
import Koa from "koa";
import Router from "koa-router";
import koaBody from "koa-body";

import { fileController } from "./../../src/controllers";
import { fileService, documentService } from "../../src/services";

// Mock the services
jest.mock("../../src/services/fileService");
jest.mock("../../src/services/documentService");

// Setup Koa server for testing
const app = new Koa();
const router = new Router();
app.use(koaBody());
router.post("/upload", fileController.uploadFile);
router.get("/download/:s3Key", fileController.downloadFile);
app.use(router.routes());

describe("FileController", () => {
  describe("uploadFile", () => {
    it("should return 400 if no file is uploaded", async () => {
      const response = await request(app.callback())
        .post("/upload")
        .send({ documentId: 1 });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "No file uploaded" });
    });

    it("should return 400 if documentId is missing", async () => {
      const mockFile = Buffer.from("test content");
      const response = await request(app.callback())
        .post("/upload")
        .attach("file", mockFile, "testFile.txt")
        .field("documentId", "");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "documentId must be an integer" });
    });

    it("should return 200 and add file to document if valid file and documentId", async () => {
      const mockFile = Buffer.from("test content");
      const mockUploadResponse = {
        fileName: "testFile.txt",
        uploadDate: new Date(),
        s3Key: "s3key",
        fileType: "text/plain",
      };

      const mockDocumentResponse = {
        status: 200,
        body: { success: true, message: "File added to document" },
      };

      // Mock file upload and document services
      (fileService.uploadFile as jest.Mock).mockResolvedValue(
        mockUploadResponse
      );
      (documentService.addFileToDocument as jest.Mock).mockResolvedValue(
        mockDocumentResponse
      );

      const response = await request(app.callback())
        .post("/upload")
        .attach("file", mockFile, "testFile.txt")

        .field("documentId", 1);
      //for some reason the documentId is not being passed to the controller
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "File added to document",
      });
    });
  });

  describe("downloadFile", () => {
    it("should return 404 if file not found in S3", async () => {
      // Mock the download service to return null
      (fileService.downloadFile as jest.Mock).mockResolvedValue(null);

      const response = await request(app.callback()).get("/download/s3key");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "File not found" });
    });

    it("should return the file if found in S3", async () => {
      const mockFile = {
        Body: Buffer.from("file content"),
        ContentType: "text/plain",
      };

      // Mock file download service
      (fileService.downloadFile as jest.Mock).mockResolvedValue(mockFile);

      const response = await request(app.callback()).get("/download/s3key");
      expect(response.status).toBe(200);
      expect(response.type).toBe("text/plain");
      expect(response.text).toBe("file content");
    });
  });
});
