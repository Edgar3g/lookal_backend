import { User } from '../entities/user.entity';
import { Role } from '../enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
export class CreateUserDto extends User {
  @IsString()
  @IsOptional()
  id: string;
  @ApiProperty({
    example: 'Fulano Arroz',
  })
  @MinLength(4)
  @IsString()
  name: string;

  @ApiProperty({
    example: 'FulanoArroz@xyz.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'qsw242t4@%$GRe'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '923000999 or +244923000999',
  })
  @IsString()
  @MaxLength(15)
  phone: string;

  @ApiProperty({
    example: 'ADMIN or CLIENT(default)',
  })
  @IsOptional()
  //@IsEnum(Role)
  role: Role;
}