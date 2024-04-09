import { Body, Controller, Get, Param, Post, Redirect, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UrlService } from './url.service';
import { Url } from './entities/url.entity';
import { ShortUrlDto } from './dto/short-url-dto';
import { RedirectUrlResult } from './interfaces/redirect-url-result';
import { AuthGuard } from '../auth/auth.guard';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(AuthGuard)
  @Post('/short')
  async createShortUrl(@Req() req: Request, @Body() data: ShortUrlDto): Promise<Url> {
    const user = req['user'];
    return this.urlService.createShortUrl(data, user);
  }

  @Get('/:hash')
  @Redirect('/', 301)
  async redirectToOriginalUrl(@Param('hash') hash: string): Promise<RedirectUrlResult> {
    return this.urlService.redirectToOriginalUrl(hash);
  }
}
