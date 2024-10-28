import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingResponse, CreateBookingRequest, CreateEventRequest, EventResponse, UpdateBookingRequest, UpdateEventRequest } from 'src/proto/events-app';
import { Booking } from './entities/booking.entity';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,

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


  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    const newBooking = new this.bookingModel(data);
    const savedBooking = await newBooking.save();
    return this.toBookingResponse(savedBooking);
  }

  async findOneBooking(id: string): Promise<BookingResponse> {
    const booking = await this.bookingModel.findById(id).populate('event artist client');
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.toBookingResponse(booking);
  }

  async updateBooking(id: string, data: UpdateBookingRequest): Promise<BookingResponse> {
    const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.toBookingResponse(updatedBooking);
  }

  async removeBooking(id: string): Promise<BookingResponse> {
    const deletedBooking = await this.bookingModel.findByIdAndDelete(id);
    if (!deletedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.toBookingResponse(deletedBooking);
  }

  async findAllBookings(): Promise<BookingResponse[]> {
    const bookings = await this.bookingModel.find().populate('event artist client');
    return bookings.map(booking => this.toBookingResponse(booking));
  }

  private toBookingResponse(booking: Booking): BookingResponse {
    return {
      id: booking._id.toString(),
      event: booking.event.toString(),
      artist: booking.artist.toString(),
      client: booking.client.toString(),
      bookingDate: booking.bookingDate.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }
}
