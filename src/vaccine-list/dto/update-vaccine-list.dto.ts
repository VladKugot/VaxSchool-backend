import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccineListDto } from './create-vaccine-list.dto';

export class UpdateVaccineListDto extends PartialType(CreateVaccineListDto) {}
