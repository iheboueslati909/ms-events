import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateOrganizerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly contactEmail: string;

  @IsOptional()
  @IsPhoneNumber(null)
  readonly contactPhone?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
