import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', minLength: 2, maxLength: 30 })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username!: string;

  @ApiProperty({ description: '密码', minLength: 6, maxLength: 18 })
  @IsString()
  @MinLength(6)
  @MaxLength(18)
  password!: string;
}
