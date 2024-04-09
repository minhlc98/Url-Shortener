import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { AuthService } from './auth.service';
import { ConfigModule } from "@nestjs/config";
config();

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}