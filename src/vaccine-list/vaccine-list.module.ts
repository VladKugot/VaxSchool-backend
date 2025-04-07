import { Module } from '@nestjs/common';
import { VaccineListService } from './vaccine-list.service';
import { VaccineListController } from './vaccine-list.controller';
import { DatabaseModule } from '@/database/database.module';
import { vaccineListProviders } from './vaccine-list.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [VaccineListController],
  providers: [VaccineListService, ...vaccineListProviders],
})
export class VaccineListModule {}
