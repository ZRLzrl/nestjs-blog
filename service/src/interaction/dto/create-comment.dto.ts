import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsString()
  @MinLength(1)
  content!: string;
}
