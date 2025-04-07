import { VACINNELIST_REPOSITORY } from "@/utils/constants";
import { VaccineList } from "./entities/vaccine-list.entity";


export const vaccineListProviders = [
  {
    provide: VACINNELIST_REPOSITORY,
    useValue: VaccineList
  }
];