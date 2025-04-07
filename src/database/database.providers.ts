import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '@/utils/constants';
import { User } from '@/users/entities/user.entity';
import { Hospital } from '@/hospitals/entities/hospital.entity';
import { Vaccine } from '@/vaccines/entities/vaccine.entity';
import { Patient } from '@/patients/entities/patient.entity';
import { Record } from '@/records/entities/record.entity';
import { VaccineList } from '@/vaccine-list/entities/vaccine-list.entity';
import { News } from '@/news/entities/news.entity';

// ============== start CONSTANTS only section

require('dotenv').config();

const { 
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT 
} = process.env;

const MYSQL_DIALECT = "mysql";

// ============== end CONSTANTS only section

export const databaseProviders = [
    {
      provide: SEQUELIZE,
      useFactory: async () => {
        const sequelize = new Sequelize({
          dialect: MYSQL_DIALECT,
          host: DB_HOST,
          port: DB_PORT ? +DB_PORT : 3306, // Should be number
          username: DB_USERNAME,
          password: DB_PASSWORD,
          database: DB_DATABASE,
      });
  
        /**
         * Add Models Here
         * ===============
         */
        sequelize.addModels([
          User, Hospital, Vaccine, Patient, Record, VaccineList, News,
        ]);
  
        //await sequelize.sync({ force: true }); //TODO: only for testing - When your application starts up, this deletes all tables including the data in them, and recreate them from scratch
        await sequelize.sync(); //TODO: This only creates new tables that don’t exist and if an existing table has changed it won’t update it. This is not recommended for production but it is suitable for development
        return sequelize;
      },
    },
  ];