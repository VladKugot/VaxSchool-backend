import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { Vaccine } from './entities/vaccine.entity';
import { VACCINE_REPOSITORY } from '@/utils/constants';

@Injectable()
export class VaccineService {
  constructor(
    @Inject(VACCINE_REPOSITORY) private readonly vaccineRepository: typeof Vaccine,
  ) { }

  async createVaccine(createVaccineDto: CreateVaccineDto): Promise<Vaccine> {
    const { type, name, description } = createVaccineDto;

    const vaccine = await this.vaccineRepository.create({
      type,
      name,
      description,
    } as Vaccine);

    return vaccine;
  }

  async getAllVaccines(): Promise<Vaccine[]> {
    return await this.vaccineRepository.findAll();
  }

  async getVaccine(id: number): Promise<Vaccine> {
    const vaccine = await this.vaccineRepository.findOne({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    try {
      return vaccine;
    } catch (error) {
      throw new BadRequestException('Error getting vaccine');
    }
  }

  async getVaccinesByType(type: string): Promise<Vaccine[]> {
    console.log('Filtering vaccines by type:', type);
    return await this.vaccineRepository.findAll({
      where: { type },
    });
  }

  async update(id: number, updateVaccineDto: UpdateVaccineDto): Promise<Vaccine> {
    const vaccine = await this.vaccineRepository.findOne({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    try {
      await vaccine.update(updateVaccineDto);
      return vaccine;
    } catch (error) {
      throw new BadRequestException('Error updating vaccine');
    }
  }

  async remove(id: number): Promise<{ message: string; statusCode: number }> {
    const vaccine = await this.vaccineRepository.findOne({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    try {
      await vaccine.destroy();
      return {
        message: "The vaccine was successfully deleted",
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Error deleting vaccine');
    }
  }


  async getVaccineTypes(): Promise<string[]> {
    const vaccines = await this.vaccineRepository.findAll({
      attributes: ['type'],
      group: ['type'],
    });

    return vaccines.map(vaccine => vaccine.type);
  }
}
