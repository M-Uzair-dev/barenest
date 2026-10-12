import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesController } from './notes/notes.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsController } from './uploads/uploads.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, NotesController, UploadsController],
  providers: [AppService],
})
export class AppModule {}
