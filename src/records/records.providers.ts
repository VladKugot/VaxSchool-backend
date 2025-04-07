import { Record } from './entities/record.entity';
import { RECORD_REPOSITORY } from '@/utils/constants';

export const recordsProviders = [
  {
    provide: RECORD_REPOSITORY,
    useValue: Record
  }
];