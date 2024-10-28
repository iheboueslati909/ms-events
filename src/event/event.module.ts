import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { CommonModule } from 'src/common/common.module';
import { ArtistModule } from 'src/artist/artist.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './entities/event.entity';
import { Booking, BookingSchema } from './entities/booking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Event.name, schema:
        EventSchema
    },{
      name: Booking.name, schema:
        BookingSchema
    }]),
    CommonModule, ArtistModule, OrganizerModule,],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
