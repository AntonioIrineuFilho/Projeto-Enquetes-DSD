import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface ChatProps {
  enqueteId: number;
}

interface Mensagem {
  id?: number;
  usuario: string;
  conteudo: string;
  criado_em?: string;
}

interface WSMessage {
  type: string;
  mensagens?: Mensagem[];
  mensagem?: Mensagem;
}

export default function Chat({ enqueteId }: ChatProps) {
  const { username } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [mensagens]);

  useEffect(() => {
    const socket = new WebSocket(`ws://192.168.15.116:8080/?enquete=${enqueteId}&user=${username}`);

    socket.onopen = () => {
      console.log("WebSocket conectado à enquete:", enqueteId);
    };

    socket.onmessage = (event) => {
      const data: WSMessage = JSON.parse(event.data);

      if (data.type === "historico" && data.mensagens) {
        setMensagens(data.mensagens);
      }

      if (data.type === "new_message" && data.mensagem) {
        setMensagens((prev) => [...prev, data.mensagem]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket fechado");
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []); 


  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!ws || !newMessage.trim()) return;

    ws.send(JSON.stringify({ usuario: username, type: "message", message: newMessage }));

    setNewMessage("");
  };
  return (
    <div className="mt-6 border-t pt-4 max-w-[420px]">
      <h1 className="text-lg font-bold mb-1">Chat</h1>
      <p className="text-xs mb-2">{username}, deixe sua opinião sobre a enquete!</p>
      <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50">
        {mensagens.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">{msg.usuario}: </span>
            <span className="break-words">{msg.conteudo}</span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <form onSubmit={sendMessage} className="mt-2 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
