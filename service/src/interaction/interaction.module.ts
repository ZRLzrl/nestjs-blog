import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Comment } from './entities/comment.entity.js';
import { Like } from './entities/like.entity.js';
import { InteractionController } from './interaction.controller.js';
import { InteractionService } from './interaction.service.js';

@Module({
  imports: [MikroOrmModule.forFeature([Like, Comment])],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
