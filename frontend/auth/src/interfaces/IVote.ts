export default interface IVote {
  VotePercent: {
    choice: {
      id: string;
      title: string;
      votes: string;
    };
    percent: string;
  }[];
}
