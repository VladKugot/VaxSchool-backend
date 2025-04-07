import { Controller, Get, Post, Body, Param, Delete, HttpCode, Put, UnauthorizedException, Patch, Res } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  public async createUser(@Body() createUser: CreateUserDto) {
    return await this.usersService.createUser(createUser);
  }

  @Get()
  @HttpCode(200)
  public async getUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(200)
  public async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUser(+id);
  }

  @Put(':id')
  @HttpCode(200)
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  public async remove(@Param('id') id: string): Promise<{ message: string; statusCode: number }> {
    return await this.usersService.remove(+id);
  }

  @Patch(':id/password/:newPassword')
  @HttpCode(200)
  public async updatePassword(
    @Param('id') id: string,
    @Param('newPassword') newPassword: string,
  ): Promise<{ message: string; statusCode: number }> {
    const userId = +id;
    await this.usersService.updatePassword(userId, newPassword);

    return {
      message: 'Password updated successfully',
      statusCode: 200,
    };
  }

}