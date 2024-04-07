import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống.' })
  readonly password: string;
}