import express from "express";
import cors from "cors";
import {
  LoginController,
  RegisterController,
  ValidateTokenController,
} from "./controllers";
import { swaggerMiddleware } from "./lib/swagger";
const server = express();
server.use(express.json());
server.use(cors());
server.use("/docs", ...swaggerMiddleware);

server.post(
  "/register",
  RegisterController.validate,
  RegisterController.handle
);

server.post("/login", LoginController.validate, LoginController.handle);

server.get("/validate-token", ValidateTokenController.handle);

export default server;
