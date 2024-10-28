import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateBookingRequest } from 'src/proto/events-app';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @GrpcMethod('BookingService', 'CreateBooking')
  createBooking(data: CreateBookingRequest) {
    return this.bookingService.createBooking(data);
  } 
}
