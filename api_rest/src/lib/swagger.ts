import fs from "fs";
import path from "path";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";

const filePath = path.join(__dirname, "openapi.yaml");

const swaggerDocument = yaml.parse(fs.readFileSync(filePath, "utf-8"));

export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
];
