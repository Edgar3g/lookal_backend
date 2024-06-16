import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

import { PartnerController } from './partner/partner.controller';
import { PartnerModule } from './partner/partner.module';
import { PartnerService } from './partner/partner.service';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, PartnerModule],
  controllers: [AppController, PartnerController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    PartnerService,
  ],
})
export class AppModule {}
