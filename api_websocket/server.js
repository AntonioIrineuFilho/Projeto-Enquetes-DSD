import "./models/database.js";
import Chat from "./models/mongo.js";
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

import { router } from "./router.js";
app.use("/", router);

const wsServer = http.createServer(app);
wsServer.listen(8080, "0.0.0.0", () =>
  console.log("Servidor WebSocket rodando na porta 8080")
);

const wss = new WebSocketServer({ server: wsServer });

const clients = new Set();

function broadcast(data) {
  const json = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  }
}

wss.on("connection", async (ws, req) => {
  clients.add(ws);

  const url = new URL(req.url || "", "http://localhost:8080");
  const enqueteId = url.searchParams.get("enquete");
  const user = url.searchParams.get("user");

  if (!enqueteId || !user) {
    ws.send(JSON.stringify({ type: "error", message: "Parâmetros faltando" }));
    ws.close();
    return;
  }

  console.log(`${user} entrou na enquete ${enqueteId}`);

  const historico = await Chat.find({ enqueteId }).sort({ criado_em: 1 });
  ws.send(JSON.stringify({ type: "historico", mensagens: historico }));

  ws.on("message", async (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return ws.send(JSON.stringify({ type: "error", message: "JSON inválido" }));
    }

    if (data.type === "message") {
      const nova = await Chat.create({
        enqueteId,
        usuario: user,
        conteudo: data.message,
      });

      const enviar = {
        type: "new_message",
        mensagem: nova,
      };

      broadcast(enviar);
    }
  });

  ws.on("close", () => {
    console.log(`${user} saiu da enquete ${enqueteId}`);
    clients.delete(ws);
  });
});