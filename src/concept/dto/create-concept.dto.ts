import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MusicGenre } from 'src/common/enums/music_genres.enum';
import { Types } from 'mongoose';

export class CreateConceptDto {
  
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'Events must be an array of event IDs' })
  events?: Types.ObjectId[];  // Array of event IDs (optional for creation)

  @IsNotEmpty({ message: 'Music genre is required' })
  @IsEnum(MusicGenre, { message: 'Music genre must be a valid genre' })
  musicGenre: MusicGenre;  // The main music genre for the concept
}
