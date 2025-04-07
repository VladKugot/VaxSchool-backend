import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VaccineService } from './vaccines.service';
import { VaccineController } from './vaccines.controller';
import { DatabaseModule } from '@/database/database.module';
import { vaccineProviders } from './vaccines.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [VaccineController],
    providers: [VaccineService, ...vaccineProviders],
    exports: [VaccineService ],
})
export class VaccineModule {}