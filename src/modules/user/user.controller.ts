import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up';
import { SignInDto } from './dto/sign-in';
import { SignInResult } from './interface/sign-in-result';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('/signup')
  async signUp(@Body() user: SignUpDto): Promise<User> {
    return this.userService.signUp(user);
  }

  @Post('/signin')
  async signIn(@Body() user: SignInDto): Promise<SignInResult> {
    return this.userService.signIn(user);
  }
}
