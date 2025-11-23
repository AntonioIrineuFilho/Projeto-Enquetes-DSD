import express from "express";
import { RegisterController } from "./controllers";

const server = express();
server.use(express.json());

server.get("/register", RegisterController.validate, RegisterController.handle);

export default server;
