import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up';
import { SignInResult } from './interface/sign-in-result';
import { SignInDto } from './dto/sign-in';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async signIn(data: SignInDto): Promise<SignInResult> {
    const now = new Date();
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    if (user.login_failed_times >= 5) {
      const allowNextLoginAt = new Date(user.last_login_failed_at);
      allowNextLoginAt.setMinutes(allowNextLoginAt.getMinutes() + 5);

      if (allowNextLoginAt > now) {
        throw new HttpException({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Bạn đã đăng nhập sai quá 5 lần. Xin vui lòng thử lại sau 5 phút.',
        }, 429);
      }
    }

    const isMatchPassword = await bcrypt.compare(data.password, user.password);
    if (!isMatchPassword) {
      await this.userRepository.update(
        user.id,
        {
          login_failed_times: user.login_failed_times + 1,
          last_login_failed_at: now
        }
      );
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    await this.userRepository.update(
      user.id,
      {
        login_failed_times: 0,
        last_login_failed_at: null
      }
    );

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async signUp(data: SignUpDto): Promise<User> {
    const existedUserSameEmail = await this.userRepository.findOne({ where: { email: data.email } });
    if (existedUserSameEmail) {
      throw new BadRequestException('Email đã tồn tại. Vui lòng kiểm tra lại.');
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    return this.userRepository.save({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });
  }
}
