import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponse, CreateBookingRequest, UpdateBookingRequest } from 'src/proto/events-app';
import { Booking } from './entities/booking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toTimestamp } from 'src/utils/date-utils';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    private artistService: ArtistService,
  ) { }
  
  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    const { artist, event, startTime, endTime, client, status } = data;
    
    const artists = [artist];
    const artistEntities = artist ? await this.artistService.findMany(artists) : [];
    const foundArtistIds = artistEntities.map(artist => artist.id);
    const missingArtists = artists?.filter(artistId => !foundArtistIds.includes(artistId)) || [];
    if (missingArtists.length > 0) {
      throw new NotFoundException(`Artists with IDs [${missingArtists.join(', ')}] not found`);
    }

    const conflictingBookings = await this.findArtistBookingsByTimeRange(artist, startTime, endTime);
    if (conflictingBookings.length > 0) {
      throw new BadRequestException('The artist has conflicting bookings during the specified time range.');
    }

    const newBooking = new this.bookingModel({
      artist,
      event,
      client,
      bookingStart: new Date(startTime),
      bookingEnd: new Date(endTime),
      status,
    });

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

  async findArtistBookingsByTimeRange(artist: string,startTime: string,
    endTime: string): Promise<Booking[]> {

    return this.bookingModel.find({
      artist,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });
  }

  private toBookingResponse(booking: Booking): BookingResponse {
    return {
      id: booking._id.toString(),
      event: booking.event,
      artist: booking.artist,
      client: booking.client,
      bookingDate: booking.bookingDate.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      startTime: booking.bookingDate.toISOString(),
      endTime: booking.bookingDate.toISOString(),
    };
  }
}
