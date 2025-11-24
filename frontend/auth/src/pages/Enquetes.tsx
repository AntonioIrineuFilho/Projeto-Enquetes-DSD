import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EnqueteForm from "../components/EnqueteForm";
import axios from "axios";

export default function Enquetes() {
  const [enquetes, setEnquetes] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadEnquetes = async () => {
    try {
      const res = await axios.get("http://localhost:3333/enquetes");
      if (res.status !== 200) throw new Error("Erro ao buscar enquetes");
      setEnquetes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEnquetes();
  }, []);

  const handleCreateEnquete = () => {
    loadEnquetes();
    setIsModalVisible(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Enquetes</h1>

        <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
          <DialogTrigger asChild>
            <Button>Nova Enquete</Button>
          </DialogTrigger>

          <DialogContent>
            <EnqueteForm onCreated={handleCreateEnquete} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {enquetes.length === 0 ? (
          <p>Nenhuma enquete encontrada no momento.</p>
        ) : (
          enquetes.map((e) => (
            <div key={e.id} className="p-4 border rounded bg-gray-50">
              <h2 className="font-semibold">{e.title}</h2>
              <p className="text-sm text-gray-600">{e.description}</p>
              <p className="text-xs text-gray-400">Fim: {e.end_date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
