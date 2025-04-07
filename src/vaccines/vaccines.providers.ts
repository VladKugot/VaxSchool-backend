// vaccine.providers.ts
import { Vaccine } from './entities/vaccine.entity';
import { VACCINE_REPOSITORY } from '@/utils/constants';

export const vaccineProviders = [
  {
    provide: VACCINE_REPOSITORY,
    useValue: Vaccine,
  },
];
