import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organizer } from './entities/organizer.entity';
import { Model } from 'mongoose';
import { CreateOrganizerRequest, OrganizerResponse, PaginateOrganierResponse, PaginationMetadata, PaginationRequest, UpdateOrganizerRequest } from 'src/proto/events-app';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Role, UserResponse, UserServiceClient } from 'src/proto/user-app';
import { reformatPaginationParams } from 'src/utils/pagination-utils';

@Injectable()
export class OrganizerService {

  private userServiceClient: UserServiceClient;

  constructor(
    @InjectModel(Organizer.name) private readonly organizerModel: Model<Organizer>,
    @Inject('USER_MS') private readonly userGrpcClient: ClientGrpc, 
    //This USER_MS client provides access to all gRPC-related methods configured for the microservice.

  ) {}

  onModuleInit() {
      this.userServiceClient = this.userGrpcClient.getService<UserServiceClient>('UserService');
    //The getService method is used to access a specific gRPC service interface defined in the proto file
  }


  async create(data: CreateOrganizerRequest): Promise<OrganizerResponse> {
    const { userId, contactEmail, contactPhone, description } = data;

    // Fetch the user profile from user microservice via gRPC
    const userProfile = await lastValueFrom(this.userServiceClient.findUserById({ id: userId }));
    if (!userProfile)
      throw new NotFoundException("The user with is not found")
    
    // Validate the user’s role MAYBE TODO LATER
    /*
    if (!userProfile.roles.includes(Role.ORGANIZER) {
      throw new BadRequestException(`User with ID ${userId} does not have the organizer role`);
    }
      */

    // Create new organizer
    const newOrganizer = new this.organizerModel({
      userId,
      contactEmail,
      contactPhone,
      description,
    });

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

   async paginateOrganizers(request: PaginationRequest): Promise<PaginateOrganierResponse> {
      const { query, skip, limit, page } = reformatPaginationParams(request);
  
      const [data, total] = await Promise.all([
        this.organizerModel.find(query).skip(skip).limit(limit).exec(),
        this.organizerModel.countDocuments(query),
      ]);
  
      const organizers = data.map((ev) => this.toOrganizerResponse(ev));
  
      const pagination: PaginationMetadata = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      };
  
      return { organizers, pagination };
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