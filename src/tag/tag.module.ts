import { Module } from '@nestjs/common';
import { TagService } from './TagService';
import { TagController } from './tag.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  // imports: [PassportModule],
  controllers: [TagController],
  providers: [TagService, PrismaService],
})
export class TagModule {}
