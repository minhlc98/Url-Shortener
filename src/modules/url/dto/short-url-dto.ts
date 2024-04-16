import { IsNotEmpty, IsUrl } from "class-validator";

export class ShortUrlDto {
  @IsNotEmpty({ message: 'Đường dẫn không được bỏ trống.' })
  @IsUrl({}, { message: 'Đường dẫn không hợp lệ.' })
  readonly originalUrl: string;
}