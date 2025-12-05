import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  enqueteId: { type: String, required: true },
  usuario: { type: String, required: true },
  conteudo: { type: String, required: true },
  criado_em: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);