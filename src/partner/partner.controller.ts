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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import e from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerService } from './partner.service';

@Controller('partner')
@ApiBearerAuth()
@ApiTags('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @IsPublic()
  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @IsPublic()
  @Get()
  @ApiOkResponse({
    description: 'Ok papa',
  })
  findAll() {
    return this.partnerService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  @ApiOkResponse({
    description: 'Ok papa',
  })
  findOne(@Param('id') id: string) {
    return this.partnerService.partnerDetail(id);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
  })
  @ApiBody({ type: UpdatePartnerDto })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updatePartner(
    @Param('id') id: string,
    @Body() updatePartner: UpdatePartnerDto,
  ) {
    try {
      return await this.partnerService.update(id, updatePartner);
    } catch (error) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(`Socio não encontrado`);
      } else if (e instanceof ConflictException) {
        throw new ConflictException(``);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while updating the partner.',
        );
      }
    }
  }

  @ApiParam({
    name: 'data',
  })
  @Get('search/:data')
  async findPartnerByData(
    @Param('data') data: string,
  ): Promise<CreatePartnerDto> {
    return this.partnerService.findByData(data);
  }

  @ApiParam({
    name: 'id',
  })
  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    return await this.partnerService.remove(id);
  }
}
