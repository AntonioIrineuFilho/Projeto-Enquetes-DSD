import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/enquetes")
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.error("Erro ao conectar no Mongo:", err));
