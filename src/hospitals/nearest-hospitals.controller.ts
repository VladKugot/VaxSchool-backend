import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { HospitalService } from './hospitals.service';
import { HospitalWithDistance } from '@/interface/hospitalWithDistance-interface';

@Controller('hospitalsnearest')
export class NearestHospitalsController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get()
  @HttpCode(200)
  public async getNearestHospitals(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('limit') limit = 5
  ): Promise<HospitalWithDistance[]> {
    console.log('Received lat:', lat, 'lon:', lon, 'limit:', limit);

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      throw new Error('Invalid coordinates');
    }

    try {
      const nearestHospitals = await this.hospitalService.getNearestHospitals(
        parseFloat(lat),
        parseFloat(lon),
        +limit
      );
      return nearestHospitals;
    } catch (error) {
      console.error('Error fetching nearest hospitals:', error);
      throw new Error('Failed to fetch nearest hospitals');
    }
  }
}