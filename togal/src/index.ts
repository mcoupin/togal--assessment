import Koa from "koa";
import router from "./routes/routes";
import koaBody from "koa-body";
import "reflect-metadata";
import cors from "@koa/cors";
const app = new Koa();
app.use(cors());

// // Middleware for parsing request bodies
app.use(koaBody({ multipart: true }));

// Use the routes
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server1 is running on http://localhost:${PORT}`);
});
