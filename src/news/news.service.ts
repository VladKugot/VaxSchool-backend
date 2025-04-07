import { Inject, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NEWS_REPOSITORY } from '@/utils/constants';

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_REPOSITORY) private readonly newsRepository: typeof News,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = await this.newsRepository.create(createNewsDto as unknown as News);
    return news;
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.findAll();
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new Error(`News with id ${id} not found`);
    }
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new Error(`News with id ${id} not found`);
    }

    await news.update(updateNewsDto);
    return news;
  }

  async remove(id: number): Promise<void> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new Error(`News with id ${id} not found`);
    }

    await news.destroy();
  }

  async sortByType(type: string) {
    return this.newsRepository.findAll({
      where: { type },
    });
  }
}