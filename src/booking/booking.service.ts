import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponse, CreateBookingRequest, UpdateBookingRequest } from 'src/proto/events-app';
import { Booking } from './entities/booking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toTimestamp } from 'src/utils/date-utils';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>
  ) { }
  
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
      createdAt: toTimestamp(booking.createdAt),
      updatedAt: toTimestamp(booking.updatedAt)
    };
  }
}
