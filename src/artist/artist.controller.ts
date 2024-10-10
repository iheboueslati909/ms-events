import { Controller } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Artist } from './entities/artist.entity';
import { CreateArtistRequest, UpdateArtistRequest, DeleteArtistRequest, GetArtistByIdRequest, ArtistResponse, ArtistListResponse } from '../proto/artist';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @GrpcMethod('ArtistService', 'GetArtistById')
  async findOne(data: GetArtistByIdRequest): Promise<ArtistResponse> {
    const artist = await this.artistService.findOne(data.id);
    return artist;
  }

  @GrpcMethod('ArtistService', 'UpdateArtist')
  async updateArtist(data: UpdateArtistRequest): Promise<ArtistResponse> {
    const updateDataDTO = new UpdateArtistDto();
    const { id, ...updateData } = data;
    Object.assign(updateDataDTO, data); // map the incoming gRPC request data into the DTO
    const updatedArtist = await this.artistService.update(id, updateDataDTO);
    return updatedArtist;
  }

  @GrpcMethod('ArtistService', 'DeleteArtist')
  async deleteArtist(data: DeleteArtistRequest): Promise<ArtistResponse> {
    const deletedArtist = await this.artistService.delete(data.id);
    return deletedArtist;
  }

  @GrpcMethod('ArtistService', 'CreateArtist')
  async createArtist(data: CreateArtistRequest): Promise<ArtistResponse> {
    const newArtist = await this.artistService.create(data);
    return newArtist;
  }

  @GrpcMethod('ArtistService', 'GetAllArtists')
  async findAll(data: Empty): Promise<ArtistListResponse> {
    const artists = await this.artistService.findAll();
    return { artists };
  }
}
