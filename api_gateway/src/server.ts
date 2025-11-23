import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import URLS from "./urls";

const server = express();

const authRestApiProxy = createProxyMiddleware({
  target: URLS.AUTH_REST_API,
  changeOrigin: true,
});

server.use("/auth", authRestApiProxy);

export default server;
