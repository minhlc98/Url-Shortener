import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Url]),
  ],
  controllers: [UrlController],
  providers: [UrlService]
})
export class UrlModule {}
