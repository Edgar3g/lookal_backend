import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'Pepe Guardiola',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Orroh@yeah.hmmm',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '244 9090 909 90',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  password: string;
}
