import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { DatabaseModule } from '@/database/database.module';
import { recordsProviders } from './records.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RecordsController],
  providers: [RecordsService, ...recordsProviders],
})
export class RecordsModule {}