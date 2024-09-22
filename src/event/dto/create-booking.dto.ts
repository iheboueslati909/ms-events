import { IsMongoId, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { EventStatus } from '../enums/event-status.enum';

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly event: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly artist: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly client: string;

  @IsDateString()
  @IsNotEmpty()
  readonly bookingDate: string;

  @IsEnum(EventStatus)
  @IsNotEmpty()
  readonly status: EventStatus;
}
