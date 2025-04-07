import { Controller, Get, Post, Body, Param, Delete, HttpCode, Put, Query } from '@nestjs/common';
import { VaccineService } from './vaccines.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { Vaccine } from './entities/vaccine.entity';

@Controller('vaccines')
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) { }

  @Post()
  @HttpCode(201)
  public async createVaccine(@Body() createVaccineDto: CreateVaccineDto) {
    return await this.vaccineService.createVaccine(createVaccineDto);
  }

  @Get('all')
  @HttpCode(200)
  public async getAllVaccines(): Promise<Vaccine[]> {
    return await this.vaccineService.getAllVaccines();
  }

  @Get(':id')
  @HttpCode(200)
  public async getVaccine(@Param('id') id: string): Promise<Vaccine | Vaccine[] | string[]> {
    if (id === 'types') {
      return await this.vaccineService.getVaccineTypes();
    }

    const vaccineId = +id;
    if (isNaN(vaccineId)) {
      throw new Error('Invalid vaccine ID');
    }

    return await this.vaccineService.getVaccine(vaccineId);
  }

  @Put(':id')
  @HttpCode(200)
  public async update(@Param('id') id: string, @Body() updateVaccineDto: UpdateVaccineDto): Promise<Vaccine> {
    return await this.vaccineService.update(+id, updateVaccineDto);
  }

  @Delete(':id')
  @HttpCode(200)
  public async remove(@Param('id') id: string): Promise<{ message: string; statusCode: number }> {
    return await this.vaccineService.remove(+id);
  }

  @Get()
  @HttpCode(200)
  public async getVaccines(@Query('type') type?: string): Promise<Vaccine[]> {
    console.log('Received type parameter:', type);
    if (type) {
      return await this.vaccineService.getVaccinesByType(type);
    }
    return await this.vaccineService.getAllVaccines();
  }

  @Get('types')
  @HttpCode(200)
  public async getVaccineTypes(): Promise<string[]> {
    return await this.vaccineService.getVaccineTypes();
  }

  @Get('types/:index')
  @HttpCode(200)
  public async getVaccineTypeByIndex(@Param('index') index: string): Promise<string> {
    const indexNumber = parseInt(index, 10);

    if (isNaN(indexNumber)) {
      throw new Error('Invalid index');
    }

    const vaccineTypes = await this.vaccineService.getVaccineTypes();

    if (indexNumber < 0 || indexNumber >= vaccineTypes.length) {
      throw new Error('Index out of bounds');
    }

    return vaccineTypes[indexNumber];
  }
}
