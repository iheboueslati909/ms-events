import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist } from './entities/artist.entity';
import { CreateArtistRequest, UpdateArtistRequest, ArtistResponse, ArtistListResponse } from '../proto/events-app';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private readonly artistModel: Model<Artist>,
  ) {}

  // Create a new artist
  async create(data: CreateArtistRequest): Promise<ArtistResponse> {
    const newArtist = new this.artistModel(data);
    const savedArtist = await newArtist.save();
    return this.toArtistResponse(savedArtist);
  }

  // Get artist by ID
  async findOne(id: string): Promise<ArtistResponse> {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this.toArtistResponse(artist);
  }

  // Update artist details
  async update(data: UpdateArtistRequest): Promise<ArtistResponse> {
    const id = data.id;
    const updatedArtist = await this.artistModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this.toArtistResponse(updatedArtist);
  }

  // Delete artist by ID
  async delete(id: string): Promise<ArtistResponse> {
    const deletedArtist = await this.artistModel.findByIdAndDelete(id);
    if (!deletedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this.toArtistResponse(deletedArtist);
  }

  async findAll(): Promise<ArtistResponse[]> {
    const artists = await this.artistModel.find();
    return artists.map(artist => this.toArtistResponse(artist));
  }

  async findMany(ids: string[]): Promise<ArtistResponse[]> {
    const artists = await this.artistModel.find({ _id: { $in: ids } });
    return artists.map(artist => this.toArtistResponse(artist));
  }

  // Helper method to map Mongoose document to ArtistResponse
  private toArtistResponse(artist: Artist): ArtistResponse {
    return {
      id: artist._id.toString(),
      name: artist.name,
      bio: artist.bio,
      genres: artist.genres,
      availability: artist.availability,
      socialLinks: artist.socialLinks,
      user: artist.user.toString(),
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    };
  }

}
