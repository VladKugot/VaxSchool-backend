import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { HOSPITAL_REPOSITORY } from '@/utils/constants';
import { HospitalWithDistance } from '@/interface/hospitalWithDistance-interface';

@Injectable()
export class HospitalService {
  constructor(
    @Inject(HOSPITAL_REPOSITORY) private readonly hospitalRepository: typeof Hospital,
  ) {}

  async createHospital(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const { name, address, coordinates_x, coordinates_y } = createHospitalDto;

    const hospital = await this.hospitalRepository.create({
      name,
      address,
      coordinates_x,
      coordinates_y,
    } as Hospital);

    return hospital;
  }

  async getAllHospitals(): Promise<Hospital[]> {
    return await this.hospitalRepository.findAll();
  }

  async getHospital(id: number): Promise<Hospital> {
    const user = await this.hospitalRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      return user;
    } catch (error) {
      throw new BadRequestException('Error getting user');
    }
  }

  async update(id: number, updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    try {
      await hospital.update(updateHospitalDto);
      return hospital;
    } catch (error) {
      throw new BadRequestException('Error updating hospital');
    }
  }

  async remove(id: number): Promise<{ message: string; statusCode: number }> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    try {
      await hospital.destroy();
      return {
        message: "The hospital was successfully deleted",
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Error deleting hospital');
    }
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      throw new BadRequestException('Invalid coordinates provided.');
    }

    const R = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Відстань в кілометрах
  }

  async getNearestHospitals(lat: number, lon: number, limit: number): Promise<HospitalWithDistance[]> {
    try {

      const hospitals = await this.hospitalRepository.findAll();
      console.log(`Retrieved ${hospitals.length} hospitals from the database.`);

      const hospitalsWithDistance = hospitals
        .map(hospital => {
          const { id, name, address, phoneNumber, timeTable, coordinates_x, coordinates_y, createdAt, updatedAt, deletedAt, version } = hospital.get({ plain: true });

          const coordinates_x_num = parseFloat(coordinates_x);
          const coordinates_y_num = parseFloat(coordinates_y);

          if (isNaN(coordinates_x_num) || isNaN(coordinates_y_num)) {
            throw new BadRequestException(`Invalid coordinates for hospital: ${hospital.id}`);
          }

          const distance = this.getDistance(lat, lon, coordinates_x_num, coordinates_y_num);
          console.log(`Distance for hospital ${hospital.id} (${name}): ${distance} km`);

          return { id, name, address, phoneNumber, timeTable, coordinates_x, coordinates_y, createdAt, updatedAt, deletedAt, version, distance };
        })
        .sort((a, b) => a.distance - b.distance) 
        .slice(0, limit); 

      console.log(`Returning ${hospitalsWithDistance.length} nearest hospitals.`);

      return hospitalsWithDistance;
    } catch (error) {
      console.error('Error in getNearestHospitals:', error);
      throw new InternalServerErrorException('An error occurred while processing the request.');
    }
  }
}
