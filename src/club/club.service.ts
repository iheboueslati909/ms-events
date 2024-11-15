import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubResponse, CreateClubRequest, UpdateClubRequest } from 'src/proto/events-app';
import { Club } from './entities/club.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toTimestamp } from 'src/utils/date-utils';

@Injectable()
export class ClubService {
  constructor(
    @InjectModel(Club.name) private readonly clubModel: Model<Club>,
  ) {}

  // Create a new club
  async create(data: CreateClubRequest): Promise<ClubResponse> {
    const newClub = new this.clubModel(data);
    const savedClub = await newClub.save();
    return this.toClubResponse(savedClub);
  }

  // Get club by ID
  async findOne(id: string): Promise<ClubResponse> {
    const club = await this.clubModel.findById(id);
    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return this.toClubResponse(club);
  }

  // Update club details
  async update(id: string, data: UpdateClubRequest): Promise<ClubResponse> {
    const updatedClub = await this.clubModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedClub) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return this.toClubResponse(updatedClub);
  }

  // Delete club by ID
  async remove(id: string): Promise<ClubResponse> {
    const deletedClub = await this.clubModel.findByIdAndDelete(id);
    if (!deletedClub) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return this.toClubResponse(deletedClub);
  }

  // Get all clubs
  async findAll(): Promise<ClubResponse[]> {
    const clubs = await this.clubModel.find();
    return clubs.map(club => this.toClubResponse(club));
  }

  // Helper method to map Mongoose document to ClubResponse
  private toClubResponse(club: Club): ClubResponse {
    return {
      id: club._id.toString(),
      name: club.name,
      location: club.location,
      capacity: club.capacity,
      description: club.description,
      googleMapsLink: club.googleMapsLink,
      events: club.events.map(event => event.toString()), // Assuming events are ObjectIds, adjust if needed
      createdAt: club.createdAt.toISOString(),
      updatedAt: club.updatedAt.toISOString()
    };
  }
}