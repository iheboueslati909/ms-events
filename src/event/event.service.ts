import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingResponse, CreateBookingRequest, CreateEventRequest, EventResponse, UpdateBookingRequest, UpdateEventRequest } from 'src/proto/events-app';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>
  ) { }
  /*
    async create(createEventDto: CreateEventDto): Promise<Event> {
      const { dateStart, dateEnd, clubId } = createEventDto;
  
      const overlappingEvents = await this.eventModel.find({
        clubId,
        $or: [
          { dateStart: { $lt: dateEnd, $gte: dateStart } },
          { dateEnd: { $gt: dateStart, $lte: dateEnd } },
          { dateStart: { $lte: dateStart }, dateEnd: { $gte: dateEnd } }
        ]
      });
  
      if (overlappingEvents.length > 0) {
        throw new BadRequestException('An event is already scheduled at this time in this venue.');
      }
  
      const newEvent = new this.eventModel(createEventDto);
      return newEvent.save();
    }*/

  async createEvent(data: CreateEventRequest): Promise<EventResponse> {
    const newEvent = new this.eventModel(data);
    const savedEvent = await newEvent.save();
    return this.toEventResponse(savedEvent);
  }

  async findOneEvent(id: string): Promise<EventResponse> {
    const event = await this.eventModel.findById(id).populate('artist organizer');
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.toEventResponse(event);
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.toEventResponse(updatedEvent);
  }

  async removeEvent(id: string): Promise<EventResponse> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id);
    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.toEventResponse(deletedEvent);
  }

  async findAllEvents(): Promise<EventResponse[]> {
    const events = await this.eventModel.find().populate('artist organizer');
    return events.map(event => this.toEventResponse(event));
  }

  private toEventResponse(event: Event): EventResponse {
    return {
      id: event._id.toString(),
      name: event.name,
      location: event.location,
      dateStart: event.dateStart.toISOString(),
      dateEnd: event.dateEnd.toISOString(),
      artist: event.artist?._id.toString(),
      organizer: event.organizer?._id.toString(),
      ticketPrice: event.ticketPrice,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }


}
