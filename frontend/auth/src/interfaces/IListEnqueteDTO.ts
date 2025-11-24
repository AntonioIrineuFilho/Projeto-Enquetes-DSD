import type IEnquete from "./IEnquete";

export default interface IListEnqueteDTO {
  listEnquetesResult: {
    enquetes: {
      EnqueteOutput: IEnquete[];
    };
    total_enquetes: string;
  };
}
