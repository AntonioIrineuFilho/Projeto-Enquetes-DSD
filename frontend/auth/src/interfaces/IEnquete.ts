import type IChoice from "./IChoice";

export default interface IEnquete {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  choices: {
    ChoicesOutput: IChoice[];
  };
}
