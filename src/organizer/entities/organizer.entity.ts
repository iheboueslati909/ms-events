import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizerDocument = Organizer & Document;

@Schema()
export class Organizer {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: false })
  contactPhone: string;

  @Prop({ required: false })
  description: string;
}

export const OrganizerSchema = SchemaFactory.createForClass(Organizer);
