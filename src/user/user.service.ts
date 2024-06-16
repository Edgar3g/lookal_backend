import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/profile-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enum/user.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { role, ...userData } = createUserDto;

    // Check if user with the given email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new NotFoundException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const data: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
      role: role || Role.CLIENT, // Set a default role if not provided
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
      role: role || Role.CLIENT,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { role, ...userData } = updateUserDto;

    // Check if the user with the given ID exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if the new email conflicts with an existing user's email
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already belongs to another user');
      }
    }
    const data: Prisma.UserUpdateInput = {
      ...userData,
      role: role || existingUser.role,
    };

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      data.password = hashedPassword;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return {
      ...updatedUser,
      password: undefined,
      role: role || existingUser.role,
    };
  }

  async remove(id: string): Promise<string> {
    await this.prisma.user.delete({
      where: { id: id },
    });
    return 'User Removed!';
  }

  async UserProfile(userId: string): Promise<UserProfileDto> {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    return {
      ...userProfile,
      password: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
