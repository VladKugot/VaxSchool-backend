import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { patientsProviders } from './patients.providers';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PatientsController],
  providers: [PatientsService, ...patientsProviders],
  exports: [PatientsService],
})
export class PatientsModule {}