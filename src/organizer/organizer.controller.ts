import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrganizerRequest, UpdateOrganizerRequest } from 'src/proto/events-app';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  @Post()
  create(@Body() createOrganizerRequest: CreateOrganizerRequest) {
    return this.organizerService.create(createOrganizerRequest);
  }

  @Get()
  findAll() {
    return this.organizerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizerRequest: UpdateOrganizerRequest) {
    return this.organizerService.update(updateOrganizerRequest);
  }

  @GrpcMethod('OrganizerService', 'CreateOrganizer')
  createOrganizer(data: CreateOrganizerRequest) {
    return this.organizerService.create(data);
  }

  getOrganizerAll(data: any) {
    return this.organizerService.findAll();
  }
}
