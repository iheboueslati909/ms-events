import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponse, CreateBookingRequest, DeleteBookingRequest, GetBookingByIdRequest, UpdateBookingRequest } from 'src/proto/events-app';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @GrpcMethod('BookingService', 'CreateBooking')
  createBooking(data: CreateBookingRequest) {
    return this.bookingService.createBooking(data);
  } 

  @GrpcMethod('BookingService', 'GetAllBookings')
  async getAllBookings() {
    const Bookings = await this.bookingService.findAllBookings();
    return {Bookings}
  }

  @GrpcMethod('BookingService', 'GetBookingById')
  async getBookingById(data: GetBookingByIdRequest): Promise<BookingResponse> {
    return this.bookingService.findOneBooking(data.id);
  }

  @GrpcMethod('BookingService', 'UpdateBooking')
  async updateBooking(data: UpdateBookingRequest) {
    return this.bookingService.updateBooking(data.id, data);
  }

  @GrpcMethod('BookingService', 'DeleteBooking')
  async deleteBooking(data: DeleteBookingRequest) {
    return this.bookingService.removeBooking(data.id);
  }
}
