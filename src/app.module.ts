import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@/database/database.module';
import { HospitalModule } from './hospitals/hospitals.module';
import { VaccineModule } from './vaccines/vaccines.module';
import { PatientsModule } from './patients/patients.module';
import { RecordsModule } from './records/records.module';
import { VaccineListModule } from './vaccine-list/vaccine-list.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [UsersModule, DatabaseModule, HospitalModule, VaccineModule, PatientsModule, RecordsModule, VaccineListModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}