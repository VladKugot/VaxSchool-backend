import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { addDays, addMonths, addWeeks, addYears, formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Record } from './entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RECORD_REPOSITORY } from '@/utils/constants';
import { Op, Optional } from 'sequelize';

@Injectable()
export class RecordsService {
  constructor(
    @Inject(RECORD_REPOSITORY) private readonly recordRepository: typeof Record,
  ) { }

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    return await this.recordRepository.create(createRecordDto as Record);
  }

  async findAll(): Promise<Record[]> {
    return await this.recordRepository.findAll();
  }

  async findOne(id: number): Promise<Record> {
    const record = await this.recordRepository.findByPk(id);
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, updateRecordDto: UpdateRecordDto): Promise<Record> {
    const record = await this.findOne(id);
    return await record.update(updateRecordDto);
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await record.destroy();
  }

  async findByUserId(patientId: number): Promise<Record[]> {
    const records = await this.recordRepository.findAll({
      where: { patientId },
    });

    if (!records || records.length === 0) {
      throw new NotFoundException(`No records found for user with id ${patientId}`);
    }

    return records;
  }

  async getFirstFutureVaccination(patientId: number): Promise<{ status: 'pending' | 'done' | 'overdue'; lastVaccination?: Partial<Record> }> {
    const futureVaccination = await this.recordRepository.findOne({
      where: {
        patientId,
        date: {
          [Op.gt]: new Date(),
        },
      },
      order: [['date', 'ASC']],
      attributes: ['status', 'date', 'vaccinationName'],
      raw: true,
    });

    if (futureVaccination) {
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);

      return {
        status: futureVaccination.date <= oneWeekLater ? 'pending' : 'done',
        lastVaccination: futureVaccination,
      };
    }

    const lastVaccination = await this.recordRepository.findOne({
      where: {
        patientId,
        date: {
          [Op.lte]: new Date(),
        },
      },
      order: [['date', 'DESC']],
      attributes: ['status', 'date', 'vaccinationName'],
      raw: true,
    });

    if (lastVaccination) {
      return {
        status: 'overdue',
        lastVaccination: lastVaccination,
      };
    }

    throw new NotFoundException(`No vaccination records found for user with ID ${patientId}`);
  }


  async getLastVaccination(patientId: number): Promise<{ status: 'overdue' | 'done'; lastVaccination?: Partial<Record> }> {
    const vaccinations = await this.recordRepository.findAll({
      where: {
        patientId,
        date: {
          [Op.lte]: new Date(),
        },
      },
      order: [['date', 'DESC']],
      attributes: ['status', 'date', 'vaccinationName'],
    });

    if (vaccinations.length === 0) {
      throw new NotFoundException(`No vaccination found for user with ID ${patientId}`);
    }

    const hasOverdue = vaccinations.some(v => v.status === 'overdue');

    return {
      status: hasOverdue ? 'overdue' : 'done',
      lastVaccination: vaccinations[0],
    };
  }

  async getFutureEvent(patientId: number): Promise<{
    overdue: { date: string; vaccinationName: string }[];
    upcoming: { date: string; vaccinationName: string }[];
  }> {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const vaccinations = await this.recordRepository.findAll({
      where: {
        patientId,
        date: {
          [Op.lte]: nextMonth,
        },
      },
      order: [['date', 'ASC']],
      attributes: ['id', 'date', 'vaccinationName', 'status'],
    });

    const formatDate = (date: Date) =>
      formatDistanceToNow(new Date(date), { addSuffix: true, locale: uk });

    const overdue = vaccinations
      .filter(v => v.status === 'overdue')
      .map(v => ({
        id: v.id,
        date: formatDate(v.date),
        vaccinationName: v.vaccinationName,
      }));

    const upcoming = vaccinations
      .filter(v => new Date(v.date) >= today && v.status === 'Pending')
      .map(v => ({
        id: v.id,
        date: formatDate(v.date),
        vaccinationName: v.vaccinationName,
      }));

    return { overdue, upcoming };
  }

  async getVaccineListYearShort(userId: number, year: number): Promise<{ id: number; date: Date; vaccinationName: string, status: string }[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const records = await this.recordRepository.findAll({
      where: {
        patientId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
      attributes: ['id', 'date', 'vaccinationName', 'status'],
      raw: true,
    });

    if (!records.length) {
      throw new NotFoundException(`No vaccination records found for user ID ${userId} in year ${year}`);
    }

    return records;
  }

  async getVaccineListYear(userId: number, year: number): Promise<Record[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const records = await this.recordRepository.findAll({
      where: {
        patientId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });

    if (!records.length) {
      throw new NotFoundException(`No vaccination records found for user ID ${userId} in year ${year}`);
    }

    return records;
  }

  async getRecentAndUpcomingVaccinations(patientIds: number[]): Promise<Partial<Record>[]> {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 11);

    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 11);

    const vaccinations = await this.recordRepository.findAll({
      where: {
        patientId: {
          [Op.in]: patientIds,
        },
        [Op.or]: [
          { date: { [Op.between]: [oneMonthAgo, today] } },
          { date: { [Op.between]: [today, oneMonthAhead] } },
        ],
      },
      order: [['date', 'DESC']],
      attributes: ['patientId', 'status', 'date', 'vaccinationName'],
    });

    return vaccinations;
  }

  async synchronizeVaccinations(patientId: number, dateOfBirth: Date, vaccineList: any[]) {
    const existingRecords = await this.recordRepository.findAll({
      where: { patientId },
      attributes: ['vaccinationName', 'date'],
      raw: true,
    });

    const existingVaccines = new Map();
    const twoMonthsInMs = 2 * 30 * 24 * 60 * 60 * 1000;
    existingRecords.forEach(record => {
      const vaccinationName = record.vaccinationName;
      const vaccinationDate = new Date(record.date);

      if (!existingVaccines.has(vaccinationName)) {
        existingVaccines.set(vaccinationName, []);
      }

      existingVaccines.get(vaccinationName).push(vaccinationDate);
    });

    const today = new Date();
    const newRecords: any[] = [];

    for (const vaccine of vaccineList) {
      const existingVaccineDates = existingVaccines.get(vaccine.vaccineName) || [];

      let vaccinationDate: Date;

      switch (vaccine.periodUnit) {
        case 'день':
          vaccinationDate = addDays(dateOfBirth, Number(vaccine.periodValue));
          break;
        case 'тиждень':
          vaccinationDate = addWeeks(dateOfBirth, Number(vaccine.periodValue));
          break;
        case 'місяць':
          vaccinationDate = addMonths(dateOfBirth, Number(vaccine.periodValue));
          break;
        case 'рік':
          vaccinationDate = addYears(dateOfBirth, Number(vaccine.periodValue));
          break;
        default:
          vaccinationDate = dateOfBirth;
      }

      if (vaccine.vaccineName === "COVID-19") {
        const isExistingCovid = existingVaccineDates.length > 0;
        if (isExistingCovid) {
          continue;
        }
        vaccinationDate = addMonths(today, 2);
      }

      const isExisting = existingVaccineDates.some((existingDate: Date) => {
        const timeDifference = Math.abs(vaccinationDate.getTime() - existingDate.getTime());
        return timeDifference <= twoMonthsInMs;
      });

      if (isExisting) {
        continue;
      }

      let status = vaccinationDate < today ? 'overdue' : 'pending';

      newRecords.push({
        patientId,
        vaccinationName: vaccine.vaccineName,
        date: vaccinationDate,
        status,
      });

      if (Number(vaccine.frequency) > 0) {
        let nextVaccinationDate = vaccinationDate;

        while (nextVaccinationDate < addYears(today, 15)) {
          if (vaccine.vaccineName === 'Грип') {
            break;
          }

          nextVaccinationDate = addYears(nextVaccinationDate, Number(vaccine.frequency));

          if (nextVaccinationDate > addYears(dateOfBirth, 100)) {
            break;
          }

          const isExistingRepeat = existingVaccineDates.some((existingDate: Date) => {
            const timeDifference = Math.abs(nextVaccinationDate.getTime() - existingDate.getTime());
            return timeDifference <= twoMonthsInMs;
          });

          if (isExistingRepeat) {
            continue;
          }

          status = nextVaccinationDate < today ? 'overdue' : 'pending';
          newRecords.push({
            patientId,
            vaccinationName: vaccine.vaccineName,
            date: nextVaccinationDate,
            status,
          });
        }
      }
    }

    if (newRecords.length > 0) {
      await this.recordRepository.bulkCreate(newRecords as Optional<Record, 'version'>[]);
    }
  }

  async findClosestVaccinationDate(vaccinationName: string, idPatient: number) {
    const existingRecords = await this.recordRepository.findAll({
      where: { vaccinationName, patientId: idPatient },
      attributes: ['date'],
      raw: true,
    });
  
    if (!existingRecords || existingRecords.length === 0) {
      return null;
    }
  
    const today = new Date();
    let closestDate = existingRecords[0].date;
    let closestTimeDiff = Math.abs(new Date(closestDate).getTime() - today.getTime());
  
    for (const record of existingRecords) {
      const recordDate = new Date(record.date);
      const timeDiff = Math.abs(recordDate.getTime() - today.getTime());
  
      if (timeDiff < closestTimeDiff) {
        closestDate = record.date;
        closestTimeDiff = timeDiff;
      }
    }
  
    return closestDate;
  }
  
}

