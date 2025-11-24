import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface EnqueteFormProps {
  onCreated: () => void;
}

interface IChoice {
  title: string;
}

export default function EnqueteForm({ onCreated }: EnqueteFormProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [choices, setChoices] = useState<IChoice[]>([]);

  const addChoice = () => setChoices([...choices, { title: "" }]);

  const submit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3333/enquetes",
        {
          title,
          description: desc,
          end_date: date,
          choices,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 201) {
        const err = res.data();
        alert(err.message || "Erro ao criar enquete");
        return;
      }

      setTitle("");
      setDesc("");
      setDate("");
      setChoices([]);
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
        <Input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <CardTitle>Descrição</CardTitle>
        <Input
          placeholder="Descrição"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <CardTitle>Data de Encerramento</CardTitle>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
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
            value={c.title}
            onChange={(e) => {
              const arr = [...choices];
              arr[i].title = e.target.value;
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
