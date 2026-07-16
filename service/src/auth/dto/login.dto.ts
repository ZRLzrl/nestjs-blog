import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  username!: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password!: string;
}
