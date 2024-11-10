import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { CommonModule } from 'src/common/common.module';
import { ArtistModule } from 'src/artist/artist.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './entities/event.entity';
import { ClubModule } from 'src/club/club.module';
import { BookingModule } from 'src/booking/booking.module';
import { ConceptModule } from 'src/concept/concept.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Event.name, schema:
        EventSchema
    }]),
    ArtistModule, OrganizerModule, ClubModule, BookingModule, ConceptModule, CommonModule ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
