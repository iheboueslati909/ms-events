import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Organizer } from 'src/organizer/entities/organizer.entity';
import { EventStatus } from '../enums/event-status.enum';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Event;

  @Prop({ type: Types.ObjectId, ref: 'ArtistProfile', required: true })
  artist: Artist;

  @Prop({ type: Types.ObjectId, ref: 'ClientProfile', required: true })
  client: Organizer;

  @Prop({ required: true })
  bookingDate: Date;

  @Prop({ default: EventStatus.PENDING, enum: EventStatus, required: true })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now, index: true })
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
