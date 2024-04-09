import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up';
import { SignInResult } from './interface/sign-in-result';
import { SignInDto } from './dto/sign-in';
import { JwtPayload } from './interface/jwt-payload';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService
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

    const isMatchPassword = await this.authService.comparePassword(data.password, user.password);
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

    const payload: JwtPayload = { id: user.id, email: user.email };
    const token = await this.authService.signToken(payload);

    return { token };
  }

  async signUp(data: SignUpDto): Promise<User> {
    const existedUserSameEmail = await this.userRepository.findOne({ where: { email: data.email } });
    if (existedUserSameEmail) {
      throw new BadRequestException('Email đã tồn tại. Vui lòng kiểm tra lại.');
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    return this.userRepository.save({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });
  }
}
