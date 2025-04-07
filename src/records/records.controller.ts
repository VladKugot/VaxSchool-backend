import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { VaccineList } from '@/vaccine-list/entities/vaccine-list.entity';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) { }

  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @Post('user/:patientId/dateOfBirth/:dateOfBirth/synchronize')
  async synchronizeVaccinations(
    @Param('patientId') patientId: string,
    @Param('dateOfBirth') dateOfBirth: string,
  ) {
    const vaccineListData = await VaccineList.findAll();

    return await this.recordsService.synchronizeVaccinations(
      Number(patientId),
      new Date(dateOfBirth),
      vaccineListData, 
    );
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }


  @Get('user/:id/vaccinations')
  async findVaccinationsByUserId(@Param('id') id: string) {
    return await this.recordsService.findByUserId(+id);
  }

  @Get('user/:userId/first-future')
  async getFirstFutureVaccination(@Param('userId') userId: number) {
    return await this.recordsService.getFirstFutureVaccination(userId);
  }

  @Get('user/:userId/last')
  async getLastVaccination(@Param('userId') userId: number) {
    return await this.recordsService.getLastVaccination(userId);
  }

  @Get('user/:userId/future-event')
  async getFutureEvent(@Param('userId') userId: number) {
    return await this.recordsService.getFutureEvent(userId);
  }


  @Get('users/recent-and-upcoming-vaccinations')
async getRecentAndUpcomingVaccinations(@Query('userIds') userIds: string) {
  const ids = userIds.split(',').map(id => Number(id.trim()));
  return await this.recordsService.getRecentAndUpcomingVaccinations(ids);
}

  @Get('user/:userId/year/:year')
  async getVaccineListYear(
    @Param('userId') userId: number,
    @Param('year') year: number) {
    return await this.recordsService.getVaccineListYearShort(userId, year);
  }

  @Get('closest-date/:vaccinationName/:idPatient')
  async findClosestVaccinationDate(
    @Param('vaccinationName') vaccinationName: string, 
    @Param('idPatient') idPatient: string
  ) {
    const closestDate = await this.recordsService.findClosestVaccinationDate(vaccinationName, +idPatient);
  
    if (!closestDate) {
      throw new NotFoundException(`Найближчих записів'${vaccinationName}' не знайдено`);
    }
  
    return closestDate;
  }

}
