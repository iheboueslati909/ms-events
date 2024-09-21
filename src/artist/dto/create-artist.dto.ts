import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MusicGenre } from 'src/common/enums/music_genres.enum';
import { Types } from 'mongoose';

export class CreateArtistDto {
  
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @IsArray({ message: 'Genres must be an array of strings' })
  @IsEnum(MusicGenre, { each: true, message: 'Each genre must be a valid music genre' })
  genres: MusicGenre[];

  @IsNotEmpty({ message: 'Availability is required' })
  @IsBoolean({ message: 'Availability must be a boolean' })
  availability: boolean;

  @IsOptional()
  @IsArray({ message: 'Social links must be an array of URLs' })
  @IsUrl({}, { each: true, message: 'Each social link must be a valid URL' })
  socialLinks?: string[];

  @IsNotEmpty({ message: 'User is required' })
  @ValidateNested({ message: 'User must be a valid user ID' })
  @Type(() => Types.ObjectId)
  user: Types.ObjectId;
}
