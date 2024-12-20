import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MusicGenre } from 'src/common/enums/music_genres.enum';

@Schema({ timestamps: true })
export class Artist extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: [String],required: true, enum: MusicGenre, default: [MusicGenre.EDM] })
  genres: MusicGenre[];

  @Prop({ required: true })
  availability: boolean;

  @Prop({ default: [] })
  socialLinks: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now, index: true })
  updatedAt: Date;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
