import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async signup(data: SignUpDto): Promise<User> {
    const existedUserSameEmail = await this.usersRepository.findOne({ where: { email: data.email } });
    if (existedUserSameEmail) {
      throw new BadRequestException('Email đã tồn tại. Vui lòng kiểm tra lại.');
    }

    return this.usersRepository.save({
      name: data.name,
      email: data.email,
      password: data.password
    });
  }
}
