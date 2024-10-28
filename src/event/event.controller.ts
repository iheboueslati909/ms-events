import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookingRequest, CreateEventRequest, DeleteEventRequest, GetEventByIdRequest, UpdateEventRequest } from 'src/proto/events-app';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @GrpcMethod('EventService', 'CreateEvent')
  createEvent(data: CreateEventRequest) {
    return this.eventService.createEvent(data);
  }

  @GrpcMethod('EventService', 'GetEventById')
  getEventById(data: GetEventByIdRequest) {
    return this.eventService.findOneEvent(data.id);
  }

  @GrpcMethod('EventService', 'UpdateEvent')
  updateEvent(data: UpdateEventRequest) {
    return this.eventService.updateEvent(data.id, data);
  }

  @GrpcMethod('EventService', 'DeleteEvent')
  deleteEvent(data: DeleteEventRequest) {
    return this.eventService.removeEvent(data.id);
  }

  @GrpcMethod('EventService', 'GetAllEvents')
  async getAllEvents() {
    const events = await this.eventService.findAllEvents();
    return {events};
  }

  @GrpcMethod('BookingService', 'CreateBooking')
  createBooking(data: CreateBookingRequest) {
    return this.eventService.createBooking(data);
  }
}


