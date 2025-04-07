export interface HospitalWithDistance {
    id: number;
    name: string;
    address: string;
    coordinates_x: string;
    coordinates_y: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    version: number;
    distance: number;
  }