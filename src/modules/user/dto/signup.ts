import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Tên không được bỏ trống.' })
  readonly name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống.' })
  readonly password: string;
}