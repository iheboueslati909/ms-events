import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from 'src/event/entities/event.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Organizer } from 'src/organizer/entities/organizer.entity';
import { EventStatus } from 'src/event/enums/event-status.enum';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: string;

  @Prop({ type: Types.ObjectId, ref: 'ArtistProfile', required: true })
  artist: string;

  @Prop({ type: Types.ObjectId, ref: 'ClientProfile', required: true })
  client: string;

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
