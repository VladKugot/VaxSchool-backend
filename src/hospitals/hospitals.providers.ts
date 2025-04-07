import { Hospital } from './entities/hospital.entity';
import { HOSPITAL_REPOSITORY } from '@/utils/constants';

export const hospitalProviders = [
  {
    provide: HOSPITAL_REPOSITORY,
    useValue: Hospital,
  },
];