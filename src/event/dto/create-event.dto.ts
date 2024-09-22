import { IsString, IsNotEmpty, IsDateString, IsArray, IsMongoId } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsDateString()
  @IsNotEmpty()
  readonly dateStart: string;

  @IsDateString()
  @IsNotEmpty()
  readonly dateEnd: string;

  @IsMongoId()
  readonly clubId: string;

  @IsArray()
  @IsMongoId({ each: true })
  readonly artistIds: string[];

  @IsMongoId()
  readonly organizerId: string;
}
