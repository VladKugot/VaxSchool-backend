import { Module } from '@nestjs/common';
import { HospitalService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { hospitalProviders } from './hospitals.providers';
import { DatabaseModule } from '@/database/database.module';
import { NearestHospitalsController } from './nearest-hospitals.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [HospitalsController, NearestHospitalsController],
  providers: [HospitalService, ...hospitalProviders],
})
export class HospitalModule {}
