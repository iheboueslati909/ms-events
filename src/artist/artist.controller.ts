import { Controller } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Artist } from './entities/artist.entity';
import { CreateArtistRequest, UpdateArtistRequest, DeleteArtistRequest, GetArtistByIdRequest, ArtistResponse, ArtistListResponse } from '../proto/events-app';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @GrpcMethod('ArtistService', 'GetArtistById')
  async GetArtistById(data: GetArtistByIdRequest): Promise<ArtistResponse> {
    const artist = await this.artistService.findOne(data.id);
    return artist;
  }

  @GrpcMethod('ArtistService', 'UpdateArtist')
  async UpdateArtist(data: UpdateArtistRequest): Promise<ArtistResponse> {
    const updatedArtist = await this.artistService.update(data);
    return updatedArtist;
  }

  @GrpcMethod('ArtistService', 'DeleteArtist')
  async DeleteArtist(data: DeleteArtistRequest): Promise<ArtistResponse> {
    const deletedArtist = await this.artistService.delete(data.id);
    return deletedArtist;
  }

  @GrpcMethod('ArtistService', 'CreateArtist')
  async CreateArtist(data: CreateArtistRequest): Promise<ArtistResponse> {
    const newArtist = await this.artistService.create(data);
    return newArtist;
  }

  @GrpcMethod('ArtistService', 'GetAllArtists')
  async GetAllArtists(data: Empty): Promise<ArtistListResponse> {
    const artists = await this.artistService.findAll();
    return { artists };
  }
}
