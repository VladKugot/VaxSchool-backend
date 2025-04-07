import { News } from './entities/news.entity';
import { NEWS_REPOSITORY } from '@/utils/constants';

export const newsProviders = [
  {
    provide: NEWS_REPOSITORY,
    useValue: News
  }
];