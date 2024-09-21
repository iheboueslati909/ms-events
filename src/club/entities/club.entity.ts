import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Event } from 'src/event/entities/event.entity';
import * as mongoose from 'mongoose';

export type ClubDocument = Club & Document;

@Schema()
export class Club {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: false })
  capacity: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  googleMapsLink: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: Event[];
}

export const ClubSchema = SchemaFactory.createForClass(Club);
