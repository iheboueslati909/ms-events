import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [CommonModule,
    MongooseModule.forFeature([{
      name: Booking.name, schema:
        BookingSchema
    }]), ArtistModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule { }
