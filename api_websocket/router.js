import { Router } from "express";
import Chat from "./models/mongo.js";

export const router = Router();

// Buscar histórico
router.get("/historico/:id", async (req, res) => {
  const id = req.params.id;

  const msgs = await Chat.find({ enqueteId: id }).sort({ criado_em: 1 });

  res.json(msgs);
});

router.post("/message/:id", async (req, res) => {
  const id = req.params.id;
  const { usuario, conteudo } = req.body;

  if (!usuario || !conteudo) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const nova = await Chat.create({
    enqueteId: id,
    usuario,
    conteudo,
  });

  res.json({ status: "ok", message: newMsg });
});
