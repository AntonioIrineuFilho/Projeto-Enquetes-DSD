import express from "express";
import { LoginController, RegisterController } from "./controllers";

const server = express();
server.use(express.json());

server.post(
  "/register",
  RegisterController.validate,
  RegisterController.handle
);

server.post("/login", LoginController.validate, LoginController.handle);

export default server;
