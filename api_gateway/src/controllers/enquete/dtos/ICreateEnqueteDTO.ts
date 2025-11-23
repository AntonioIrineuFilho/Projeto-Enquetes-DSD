export default interface ICreateEnqueteDTO {
  enquete: {
    title: string;
    description: string;
    end_date: string;
    choices: {
      ChoiceInput: {
        title: string;
      }[];
    };
  };
}
