import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Artist } from 'src/artist/entities/artist.entity';
import { Club } from 'src/club/entities/club.entity';
import { Organizer } from 'src/organizer/entities/organizer.entity';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Artist' }] })
  artist: Artist[];

  @Prop({ type: Types.ObjectId, ref: 'Organizer' })
  organizer: Organizer;

  @Prop({ type: Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop({ default: 0 })
  ticketPrice: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now, index: true })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
