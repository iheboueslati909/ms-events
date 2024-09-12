import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Artist } from 'src/artist/entities/artist.entity';
import { Organizer } from 'src/organizer/entities/organizer.entity';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'Artist' })
  artist: Artist;

  @Prop({ type: Types.ObjectId, ref: 'Organizer' })
  organizer: Organizer;

  @Prop({ default: 0 })
  ticketPrice: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
