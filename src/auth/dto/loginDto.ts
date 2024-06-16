import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class loginDto extends User {
  @ApiProperty({
    example: 'FulanoArroz@xyz.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'qsw242t4@%$GRe',
  })
  @IsString()
  password: string;
}
