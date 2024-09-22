import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MusicGenre } from 'src/common/enums/music_genres.enum';
import { Event } from 'src/event/entities/event.entity';

@Schema({ timestamps: true })
export class Concept extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  events: Types.ObjectId[];

  @Prop({ type: String, required: true, enum: MusicGenre })
  musicGenre: MusicGenre;
}

export const ConceptSchema = SchemaFactory.createForClass(Concept);
