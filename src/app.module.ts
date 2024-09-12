import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { CommonModule } from './common/common.module';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';

@Module({
  imports: [ArtistModule, CommonModule, EventModule, OrganizerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
