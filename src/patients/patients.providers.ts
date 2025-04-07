import { PATIENT_REPOSITORY } from '@/utils/constants';
import { Patient } from './entities/patient.entity';

export const patientsProviders = [
  {
    provide: PATIENT_REPOSITORY,
    useValue: Patient
  }
];