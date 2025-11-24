export default interface IUpdateEnqueteDTO {
  enquete_id: string;
  enquete: {
    title: string;
    description: string;
    end_date: string;
  };
}
