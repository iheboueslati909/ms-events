import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { CommonModule } from 'src/common/common.module';
import { ArtistModule } from 'src/artist/artist.module';
import { OrganizerModule } from 'src/organizer/organizer.module';

@Module({
  imports: [CommonModule, ArtistModule, OrganizerModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
