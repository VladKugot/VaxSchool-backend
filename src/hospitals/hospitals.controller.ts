import { Controller, Get, Post, Body, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { HospitalService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @HttpCode(201)
  public async createHospital(@Body() createHospital: CreateHospitalDto) {
    return await this.hospitalService.createHospital(createHospital);
  }

  @Get()
  @HttpCode(200)
  public async getHospitals(): Promise<Hospital[]> {
    return await this.hospitalService.getAllHospitals();
  }

  @Get(':id')
  @HttpCode(200)
  public async getHospital(@Param('id') id: string): Promise<Hospital> {
    const hospitalId = +id;
    if (isNaN(hospitalId)) {
      throw new Error('Invalid hospital ID');
    }
    return await this.hospitalService.getHospital(hospitalId);
  }

  @Put(':id')
  @HttpCode(200)
  public async update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    return await this.hospitalService.update(+id, updateHospitalDto);
  }

  @Delete(':id')
  @HttpCode(200)
  public async remove(@Param('id') id: string): Promise<{ message: string; statusCode: number }> {
    return await this.hospitalService.remove(+id);
  }
}