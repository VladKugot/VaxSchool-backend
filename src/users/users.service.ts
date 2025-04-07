import {Injectable, Inject, NotFoundException, BadRequestException} from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from "@/user/dto/update-user.dto";
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '@/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {login, password, isActive } = createUserDto;
    
    const user = await this.userRepository.create({
      login,  
      password, 
      isActive
    } as User);
    
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      return user;
    } catch (error) {
      throw new BadRequestException('Error getting user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      await user.update(updateUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException('Error updating user');
    }
  }

  async remove(id: number): Promise<{ message: string; statusCode: number }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      await user.destroy();
      return {
        message: "The user was successfully deleted",
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }

  public async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.userRepository.update({ password: newPassword }, { where: { id: userId } });
  }
}