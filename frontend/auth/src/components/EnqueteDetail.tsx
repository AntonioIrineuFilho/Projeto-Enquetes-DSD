/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import type IEnquete from "@/interfaces/IEnquete";
import { useAuth } from "@/context/AuthContext";
import type IVote from "@/interfaces/IVote";

interface Props {
  enquete: IEnquete;
  votes: IVote;
  onVote: (updatedVotes: IVote) => void;
}

export default function EnqueteDetail({ enquete, votes, onVote }: Props) {
  const { token } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const votedEnquetes = JSON.parse(
      localStorage.getItem("votedEnquetes") || "[]"
    );
    if (votedEnquetes.includes(enquete.id)) {
      setHasVoted(true);
    }
  }, [enquete.id]);

  const handleVote = async (choiceId: string) => {
    if (hasVoted) return;
    try {
      await axios.get(`http://localhost:3333/votes/${choiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resVotes = await axios.get(
        `http://localhost:3333/votes/by-enquete/${enquete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onVote(resVotes.data.votesCountResult.choices);

      const votedEnquetes = JSON.parse(
        localStorage.getItem("votedEnquetes") || "[]"
      );
      localStorage.setItem(
        "votedEnquetes",
        JSON.stringify([...votedEnquetes, enquete.id])
      );

      setHasVoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(votes);

  if (!votes) return <div>Carregando votos...</div>;

  return (
    <div className="p-6 border rounded bg-white">
      <p className="text-xs text-gray-400">Fim: {enquete.end_date}</p>

      <ul className="mt-4 space-y-2">
        {votes.VotePercent.map((v) => (
          <li key={v.choice.id} className="flex items-center justify-between">
            <span>{v.choice.title}</span>
            <span>{v.percent}</span>
            <Button className="ml-4" onClick={() => handleVote(v.choice.id)}>
              Votar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
