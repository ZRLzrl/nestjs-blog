import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ description: '密码', minLength: 6, maxLength: 50 })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password!: string;
}
