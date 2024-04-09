import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private saltRound = 10;

  hashPassword(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRound);
  }

  comparePassword(plainText: string, hashedPassword: string): Promise<Boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  signToken(payload: Object) {
    return this.jwtService.signAsync(payload);
  }
}