import Router from "koa-router";
import {
  folderController,
  documentController,
  fileController,
} from "../controllers";

const router = new Router();

router.get("/folders", folderController.getFolders);

router.post("/folders", folderController.createFolder);

router.get("/documents/:folderId", documentController.getDocuments);

router.post("/documents", documentController.createDocument);

router.post("/files/upload", fileController.uploadFile);

router.get("/files/download/:s3Key", fileController.downloadFile);

export default router;
