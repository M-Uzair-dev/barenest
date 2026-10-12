import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './create-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.note.findMany({ orderBy: { id: 'asc' } });
  }

  @Post()
  create(@Body() body: CreateNoteDto) {
    return this.prisma.note.create({
      data: { title: body.title, content: body.content },
    });
  }
}
