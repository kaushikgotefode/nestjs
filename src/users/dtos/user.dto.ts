import { Expose } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class UserDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsEmail()
  @Expose()
  email: string;
}
