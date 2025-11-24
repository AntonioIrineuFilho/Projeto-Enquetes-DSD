import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type IEnquete from "@/interfaces/IEnquete";
import { useAuth } from "@/context/AuthContext";

interface Props {
  enquete: IEnquete;
  votes: any[];
  onClose: () => void;
  onVote: (updatedVotes: any[]) => void;
}

export default function EnqueteDetail({ enquete, votes, onClose, onVote }: Props) {
  const { token } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "warning">("success");

  useEffect(() => {
    const votedEnquetes = JSON.parse(localStorage.getItem("votedEnquetes") || "[]");
    if (votedEnquetes.includes(enquete.id)) {
      setHasVoted(true);
      setAlertMessage("Você já votou nesta enquete. Volte mais tarde!");
      setAlertType("warning");
    }
  }, [enquete.id]);

  const vote = async (choiceId: string) => {
    if (hasVoted) return;
    try {
      await axios.get(
        `http://localhost:3333/votes/${choiceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const resVotes = await axios.get(
        `http://localhost:3333/votes/by-enquete/${enquete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onVote(resVotes.data.votesCountResult.choices);

      const votedEnquetes = JSON.parse(localStorage.getItem("votedEnquetes") || "[]");
      localStorage.setItem("votedEnquetes", JSON.stringify([...votedEnquetes, enquete.id]));

      setHasVoted(true);
      setAlertMessage("Voto computado com sucesso!");
      setAlertType("success");
    } catch (err) {
      console.error(err);
      setAlertMessage("Ocorreu um erro ao registrar seu voto.");
      setAlertType("warning");
    }
  };

  if (!votes) return null;

  return (
    <div className="p-6 border rounded bg-white">
      <p className="text-xs text-gray-400">Fim: {enquete.end_date}</p>

      <ul className="mt-4 space-y-2">
        {votes.VotePercent.map((v) => (
          <li key={v.choice.id} className="flex items-center justify-between">
            <span>{v.choice.title}</span>
            <span>{v.percent}</span>
            <Button className="ml-4" onClick={() => vote(v.choice.id)}>
              Votar 
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}