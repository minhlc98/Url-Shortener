import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShortUrlDto } from './dto/short-url-dto';
import { Url } from './entities/url.entity';
import { createHashMD5 } from 'src/utils';
import { RedirectUrlResult } from './interfaces/redirect-url-result';
import { JwtPayload } from '../user/interface/jwt-payload';

@Injectable()
export class UrlService {
  private hashLength: number = 8;
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(data: ShortUrlDto, user: JwtPayload): Promise<Url> {
    const originalUrl = data.originalUrl.trim();
    const hash = createHashMD5(`${user.id}@${originalUrl}`);
    const hashOriginalUrl = createHashMD5(originalUrl);
    const existedUrl = await this.urlRepository.findOneBy({ hash_original_url: hashOriginalUrl, user_id: user.id });
    if (existedUrl) {
      return existedUrl;
    }

    let max_retries: number = 5
    for (let i = 0; i < max_retries; ++i) {
      try {
        const newHash = hash.substring(i, this.hashLength + i);
        await this.urlRepository.insert({
          hash: newHash,
          original_url: originalUrl,
          hash_original_url: hashOriginalUrl,
          user_id: user.id,
        });

        const insertedUrl = await this.urlRepository.findOneBy({ hash: newHash });
        return insertedUrl;
      }
      catch (error) {
        // PG duplicated error code
        if (error.code !== '23505') {
          throw error;
        }
      }
    }

    throw new HttpException('Không thể tạo đường dẫn', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async redirectToOriginalUrl(hash: string): Promise<RedirectUrlResult> {
    if (hash.length !== this.hashLength) {
      throw new NotFoundException('Không tìm thấy đường dẫn.');
    }

    const url = await this.urlRepository.findOneBy({ hash });
    if (!url) {
      throw new NotFoundException('Không tìm thấy đường dẫn.');
    }

    return { url: url.original_url }; 
  }
}
