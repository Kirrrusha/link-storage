import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
