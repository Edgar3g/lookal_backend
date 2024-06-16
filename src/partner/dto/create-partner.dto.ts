import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'Arian Siala',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  doc: string;

  @ApiProperty({
    example: '222 443 123',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
  @ApiProperty({
    example: 'EssePAgante123',
  })
  @ApiProperty()
  @IsOptional()
  @IsString()
  ref?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  partnerTime: number;
}
