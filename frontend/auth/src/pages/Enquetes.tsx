import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import EnqueteForm from "../components/EnqueteForm";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import type IEnquete from "@/interfaces/IEnquete";
import type IListEnqueteDTO from "@/interfaces/IListEnqueteDTO";
import { Pagination } from "rsuite";
import EnqueteDetail from "../components/EnqueteDetail";
import { LogOut } from "lucide-react"; 

interface IPagination {
  page: number;
  limit: number;
}

export default function Enquetes() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 7,
  });
  const [totalEnquetes, setTotalEnquetes] = useState(1);
  const [enquetes, setEnquetes] = useState<IEnquete[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedEnquete, setSelectedEnquete] = useState<IEnquete | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [votes, setVotes] = useState<any[]>([]);


const openEnqueteDetail = async (enquete: IEnquete) => {
  try {
    const resDetail = await axios.get(
      `http://192.168.15.116:3333/enquetes/${enquete.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const resVotes = await axios.get(
      `http://192.168.15.116:3333/votes/by-enquete/${enquete.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedEnquete(resDetail.data.detailEnqueteResult); 
    setVotes(resVotes.data.votesCountResult.choices);
    setIsDetailModalVisible(true);
  } catch (err) {
    console.error(err);
  }
};



  const loadEnquetes = async () => {
    try {
      const res = await axios.get<IListEnqueteDTO>(
        "http://192.168.15.116:3333/enquetes",
        {
          params: {
            page: pagination.page - 1,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 200) throw new Error("Erro ao buscar enquetes");

      setEnquetes(res.data.listEnquetesResult.enquetes.EnqueteOutput);
      setTotalEnquetes(Number(res.data.listEnquetesResult.total_enquetes));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEnquetes();
  }, []);

  useEffect(() => {
    loadEnquetes();
  }, [pagination]);

  const handleCreateEnquete = () => {
    loadEnquetes();
    setIsModalVisible(false);
  };

  if (!token) {
    navigate("/login");
  }

  
  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <>
    <div className="p-8 max-w-3xl mx-auto space-y-6  bg-slate-50">
     <div className="flex items-center justify-between gap-2 px-2 sm:px-0">
  {/* Botão de logout */}
  <Button 
    variant="destructive" 
    onClick={handleLogout} 
    className="flex items-center gap-2 shrink-0"
  >
    <LogOut size={16} /> 
  </Button>

  <h1 className="text-xl font-bold text-center flex-1 truncate">
    Enquetes
  </h1>

  <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
    <DialogTrigger asChild>
      <Button className="cursor-pointer shrink-0">Nova Enquete</Button>
    </DialogTrigger>

    <DialogContent>
      <DialogTitle>Crie uma nova enquete</DialogTitle>
      <EnqueteForm onCreated={handleCreateEnquete} />
    </DialogContent>
  </Dialog>
</div>

     
      <div className="flex flex-col gap-8">
  {enquetes.length === 0 ? (
    <p>Nenhuma enquete encontrada no momento.</p>
  ) : (
    <>
      <ol className="flex flex-col gap-4">
        {enquetes.map((e) => (
          <li
            key={e.id}
            className="p-4 border rounded bg-gray-50 cursor-pointer"
            onClick={() => openEnqueteDetail(e)}
          >
            <h2 className="font-semibold">{e.title}</h2>
            <p className="text-sm text-gray-600">{e.description}</p>
            <p className="text-xs text-gray-400">Fim: {e.end_date}</p>
          </li>
        ))}
      </ol>

      <Pagination
        total={totalEnquetes}
        limit={pagination.limit}
        activePage={pagination.page}
        onChangePage={(page) =>
          setPagination((prev) => ({ ...prev, page }))
        }
        prev
        next
        className="flex items-center justify-center"
      />
    </>
  )}
</div>
 </div>
{selectedEnquete && (
    <Dialog open={isDetailModalVisible} onOpenChange={setIsDetailModalVisible}>
      <DialogContent>
        <DialogHeader> <DialogTitle>{selectedEnquete.title}</DialogTitle> <DialogDescription>{selectedEnquete.description} </DialogDescription> </DialogHeader>
          <EnqueteDetail
          enquete={selectedEnquete}
          votes={votes}
          onClose={() => setIsDetailModalVisible(false)}
          onVote={(updatedVotes) => setVotes(updatedVotes)}
                />
      </DialogContent>
    </Dialog>
)}  
  </>
  );
}
