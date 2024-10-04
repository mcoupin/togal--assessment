import "dotenv/config";
import { DataSource } from "typeorm";
import { Folder, Document, File } from "./entities";
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Folder, Document, File],
  synchronize: true,
  logging: false,
});
AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

export default AppDataSource;
