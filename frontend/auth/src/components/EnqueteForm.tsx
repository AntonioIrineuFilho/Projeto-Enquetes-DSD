import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface EnqueteFormProps {
  onCreated: () => void;
}

export default function EnqueteForm({ onCreated }: EnqueteFormProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [choices, setChoices] = useState([""]);

  const addChoice = () => setChoices([...choices, ""]);

  const submit = async () => {
    try {
      const res = await fetch("http://localhost:8000/enquetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, end_date: date, choices }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Erro ao criar enquete");
        return;
      }

      setTitle("");
      setDesc("");
      setDate("");
      setChoices([""]);
      onCreated();
    } catch (error) {
      console.error(error);
      alert("Erro de conexão");
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="space-y-1">
        <CardTitle>Título da Enquete</CardTitle>
        <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="space-y-1">
        <CardTitle>Descrição</CardTitle>
        <Input placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>

      <div className="space-y-1">
        <CardTitle>Data de Encerramento</CardTitle>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <CardTitle className="mb-0 mt-1">Opções de voto</CardTitle>
        <CardDescription className="text-xs mt-1 text-gray-500">
          Adicione as opções que os usuários poderão votar.
        </CardDescription>
        {choices.map((c, i) => (
          <Input
            key={i}
            placeholder={`Opção ${i + 1}`}
            value={c}
            onChange={e => {
              const arr = [...choices];
              arr[i] = e.target.value;
              setChoices(arr);
            }}
          />
        ))}
        <Button variant="secondary" onClick={addChoice}>
          Adicionar opção
        </Button>
      </div>

      <Button className="w-full" onClick={submit}>
        Criar Enquete
      </Button>
    </div>
  );
}