import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/profile-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBody({ description: 'Pass the JWT Token' })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUserProfile(@Request() req): Promise<UserProfileDto> {
    const userId: string = req.user.id;
    const userProfile = await this.userService.UserProfile(userId);
    return userProfile;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(e.message);
      } else if (e instanceof ConflictException) {
        throw new ConflictException(e.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while updating the user.',
        );
      }
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @IsPublic()
  @ApiOkResponse({ description: 'User list retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
