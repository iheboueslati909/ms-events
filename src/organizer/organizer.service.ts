import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organizer } from './entities/organizer.entity';
import { Model } from 'mongoose';
import { CreateOrganizerRequest, OrganizerResponse, UpdateOrganizerRequest } from 'src/proto/events-app';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectModel(Organizer.name) private readonly organizerModel: Model<Organizer>,
  ) {}

  async create(data: CreateOrganizerRequest): Promise<OrganizerResponse> {
    const newOrganizer = new this.organizerModel(data);
    const savedOrganizer = await newOrganizer.save();
    return this.toOrganizerResponse(savedOrganizer);
  }

  async findOne(id: string): Promise<OrganizerResponse> {
    const organizer = await this.organizerModel.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }
    return this.toOrganizerResponse(organizer);
  }

  async update(data: UpdateOrganizerRequest): Promise<OrganizerResponse> {
    const { id, ...updateData } = data;
    const updatedOrganizer = await this.organizerModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedOrganizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }
    return this.toOrganizerResponse(updatedOrganizer);
  }

  async delete(id: string): Promise<void> {
    const deletedOrganizer = await this.organizerModel.findByIdAndDelete(id);
    if (!deletedOrganizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }
  }

  async findAll(): Promise<OrganizerResponse[]> {
    const organizers = await this.organizerModel.find();
    return organizers.map(organizer => this.toOrganizerResponse(organizer));
  }

  private toOrganizerResponse(organizer: Organizer): OrganizerResponse {
    return {
      id: organizer._id.toString(),
      userId: organizer.userId,
      contactEmail: organizer.contactEmail,
      contactPhone: organizer.contactPhone,
      description: organizer.description,
    };
  }
}