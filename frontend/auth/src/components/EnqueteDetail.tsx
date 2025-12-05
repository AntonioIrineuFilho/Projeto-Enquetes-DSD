import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import type IEnquete from "@/interfaces/IEnquete";
import { useAuth } from "@/context/AuthContext";
import Chat from "@/components/Chat";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 

interface Props {
  enquete: IEnquete;
  votes: any[];
  usuario: { username: string }; 
  onClose: () => void;
  onVote: (updatedVotes: any[]) => void;
}

export default function EnqueteDetail({ enquete, votes, onClose, onVote, usuario }: Props) {
  const { token } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "warning">("success");

  useEffect(() => {
    const votedEnquetes = JSON.parse(localStorage.getItem("votedEnquetes") || "[]");

    const jaVotou = votedEnquetes.includes(enquete.id);

    setHasVoted(jaVotou);

    if (jaVotou) {
      setAlertMessage("Você já votou nesta enquete.");
      setAlertType("warning");
    } else {
      setAlertMessage(null);
    }
  }, [enquete.id]); 

  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [alertMessage]);


  const vote = async (choiceId: number) => {
    if (hasVoted) return;
    try {
      await axios.get(
        `http://192.168.15.116:3333/votes/${choiceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resVotes = await axios.get(
        `http://192.168.15.116:3333/votes/by-enquete/${enquete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onVote(resVotes.data.votesCountResult.choices);

      const votedEnquetes = JSON.parse(localStorage.getItem("votedEnquetes") || "[]");
      localStorage.setItem("votedEnquetes", JSON.stringify([...votedEnquetes, enquete.id]));

      setHasVoted(true);
      setAlertMessage("Voto computado.");
      setAlertType("success");
    } catch (err) {
      console.error(err);
      setAlertMessage("Ocorreu um erro ao registrar seu voto.");
      setAlertType("warning");
    }
  };

  if (!votes) return null;

  return (
    <>
    {alertMessage && (
    <Alert
      variant={alertType === "warning" ? "destructive" : "default"}
      className="mb-4"
    >
      <AlertTitle>
        {alertType === "warning" ? "Atenção!" : "Sucesso!"}
      </AlertTitle>
      <AlertDescription>{alertMessage}</AlertDescription>
    </Alert>
  )}
    <div className="p-6 border rounded bg-white">
      <p className="text-xs text-gray-400">Fim: {enquete.end_date}</p>

      <ul className="mt-4 space-y-2">
        {votes.VotePercent.map((v) => (
          <li key={v.choice.id} className="flex items-center justify-between">
            <span>{v.choice.title}</span>
            <span>{v.percent}</span>
            <Button className="ml-4 cursor-pointer" onClick={() => vote(Number(v.choice.id))}>
              Votar 
            </Button>
          </li>
        ))}
      </ul>

      <Chat enqueteId={Number(enquete.id)} />
    </div>
    </>
  );
}
