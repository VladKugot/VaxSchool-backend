import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VaccineListService } from './vaccine-list.service';
import { CreateVaccineListDto } from './dto/create-vaccine-list.dto';
import { UpdateVaccineListDto } from './dto/update-vaccine-list.dto';

@Controller('vaccine-list')
export class VaccineListController {
  constructor(private readonly vaccineListService: VaccineListService) {}

  @Post()
  create(@Body() createVaccineListDto: CreateVaccineListDto) {
    return this.vaccineListService.create(createVaccineListDto);
  }

  @Get()
  findAll() {
    return this.vaccineListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vaccineListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVaccineListDto: UpdateVaccineListDto) {
    return this.vaccineListService.update(+id, updateVaccineListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaccineListService.remove(+id);
  }
}
