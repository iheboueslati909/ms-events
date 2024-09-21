import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly capacity?: number;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
