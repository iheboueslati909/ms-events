import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClubService } from './club.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { ClubResponse, CreateClubRequest, DeleteClubRequest, GetClubByIdRequest, UpdateClubRequest } from 'src/proto/events-app';

@Controller('club')
@Controller()
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  //ADMIN ONLY
  @GrpcMethod('ClubService', 'CreateClub')
  async createClub(data: CreateClubRequest) {
    return this.clubService.create(data);
  }

  @GrpcMethod('ClubService', 'GetAllClubs')
  async getAllClubs() {
    const clubs = await this.clubService.findAll();
    return {clubs}
  }

  @GrpcMethod('ClubService', 'GetClubById')
  async getClubById(data: GetClubByIdRequest): Promise<ClubResponse> {
    return this.clubService.findOne(data.id);
  }

  @GrpcMethod('ClubService', 'UpdateClub')
  async updateClub(data: UpdateClubRequest) {
    return this.clubService.update(data.id, data);
  }

  @GrpcMethod('ClubService', 'DeleteClub')
  async deleteClub(data: DeleteClubRequest) {
    return this.clubService.remove(data.id);
  }
}