import { Controller } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrganizerRequest, DeleteOrganizerRequest, PaginationRequest, UpdateOrganizerRequest } from 'src/proto/events-app';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  async getOrganizerById(request: { id: string }) {
    return await this.organizerService.findOne(request.id);
  }
  
  @GrpcMethod('OrganizerService', 'CreateOrganizer')
  async createOrganizer(request: CreateOrganizerRequest) {
    return await this.organizerService.create(request);
  }
  
  @GrpcMethod('OrganizerService', 'UpdateOrganizer')
  async updateOrganizer(request: UpdateOrganizerRequest) {
    return await this.organizerService.update(request);
  }
  
  @GrpcMethod('OrganizerService', 'DeleteOrganizer')
  async deleteOrganizer(request: DeleteOrganizerRequest) {
    return await this.organizerService.delete(request.id);
  }
  
  @GrpcMethod('OrganizerService', 'GetAllOrganizers')
  async getAllOrganizers() {
    return await this.organizerService.findAll();
  }
  
  @GrpcMethod('OrganizerService', 'PaginateOrganizers')
  async paginateOrganizers(request: PaginationRequest) {
    return await this.organizerService.paginateOrganizers(request);
  }
}
