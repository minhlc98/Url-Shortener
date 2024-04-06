import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async signup(@Body() user: SignUpDto): Promise<User> {
    return this.userService.signup(user);
  }
}
