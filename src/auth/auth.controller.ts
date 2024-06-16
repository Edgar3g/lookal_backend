import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { 
  ApiBody, 
  ApiTags,
  ApiOkResponse, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { loginDto } from './dto/loginDto';

@Controller()
@ApiTags('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBody({ 
    type: loginDto
  }) 
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
