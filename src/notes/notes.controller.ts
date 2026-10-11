import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.note.findMany({ orderBy: { id: 'asc' } });
  }

  @Post()
  create(@Body() body: { title: string; content?: string }) {
    return this.prisma.note.create({
      data: { title: body.title, content: body.content },
    });
  }
}
