import { Inject, Injectable } from '@nestjs/common';
import { CreateVaccineListDto } from './dto/create-vaccine-list.dto';
import { UpdateVaccineListDto } from './dto/update-vaccine-list.dto';
import { VACINNELIST_REPOSITORY } from '@/utils/constants';
import { VaccineList } from './entities/vaccine-list.entity';


@Injectable()
export class VaccineListService {
  constructor(
    @Inject(VACINNELIST_REPOSITORY) private readonly vaccineListRepository: typeof VaccineList,
  ) {}

  async create(createVaccineListDto: CreateVaccineListDto) {
    const newVaccine = await this.vaccineListRepository.create(createVaccineListDto as unknown as VaccineList);
    return newVaccine;
  }

  async findAll() {
    return this.vaccineListRepository.findAll();
  }

  async findOne(id: number) {
    const vaccine = await this.vaccineListRepository.findOne({
      where: { id },
    });
    if (!vaccine) {
      return `Vaccine with ID #${id} not found`;
    }
    return vaccine; 
  }

  async update(id: number, updateVaccineListDto: UpdateVaccineListDto) {
    const vaccine = await this.vaccineListRepository.findOne({
      where: { id },
    });

    if (!vaccine) {
      return `Vaccine with ID #${id} not found`;
    }

    await vaccine.update(updateVaccineListDto);
    return vaccine; 
  }

  async remove(id: number) {
    const vaccine = await this.vaccineListRepository.findOne({
      where: { id },
    });

    if (!vaccine) {
      return `Vaccine with ID #${id} not found`;
    }

    await vaccine.destroy();
    return vaccine;
  }
}