import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingResponse, CreateBookingRequest, CreateEventRequest, EventResponse, UpdateBookingRequest, UpdateEventRequest } from 'src/proto/events-app';
import { Event } from './entities/event.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { OrganizerService } from 'src/organizer/organizer.service';
import { ClubService } from 'src/club/club.service';
import { isValid, parseISO } from 'date-fns';
import { toTimestamp } from 'src/utils/date-utils';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private artistService: ArtistService,
    private organizerService: OrganizerService,
    private clubService: ClubService,
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

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const { name, location, dateStart, dateEnd, artist, organizer, ticketPrice, club } = data;

    // Validate date format and parse dates
    const parsedDateStart = this.validateAndParseDate(dateStart, 'dateStart');
    const parsedDateEnd = this.validateAndParseDate(dateEnd, 'dateEnd');

    // Check date range validity
    if (parsedDateStart >= parsedDateEnd) {
      throw new BadRequestException('Event start date must be before the end date');
    }

    // Ensure organizer exists
    const organizerProfile = await this.organizerService.findOne(organizer);
    if (!organizerProfile) {
      throw new NotFoundException(`Organizer with ID ${organizer} not found`);
    }

    // Ensure all artists exist
    if (artist){
      for (const artistId of artist) {
        const artistExists = await this.artistService.findOne(artistId);
        if (!artistExists) {
          throw new NotFoundException(`Artist with ID ${artistId} not found`);
        }
      }
    }
    // Ensure club exists and check for conflicting events
    if (club) {
      const clubExists = await this.clubService.findOne(club);
      if (!clubExists) {
        throw new NotFoundException(`Club with ID ${club} not found`);
      }

      const hasConflict = await this.hasConflictingEvent(club, parsedDateStart, parsedDateEnd);
      if (hasConflict) {
        throw new ConflictException(`There is already an event scheduled in this club during the specified time range.`);
      }
    }

    // Create the event
    const newEvent = new this.eventModel({
      name,
      location,
      dateStart: parsedDateStart,
      dateEnd: parsedDateEnd,
      artist: artist,
      organizer,
      club,
      ticketPrice,
    });

    const createdEvent = await newEvent.save();
    return createdEvent;
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

  async hasConflictingEvent(clubId: string, dateStart: Date, dateEnd: Date): Promise<boolean> {
    const conflictingEvent = await this.eventModel.findOne({
      club: clubId,
      $or: [
        { dateStart: { $lt: dateEnd, $gte: dateStart } },
        { dateEnd: { $gt: dateStart, $lte: dateEnd } },
        { dateStart: { $lte: dateStart }, dateEnd: { $gte: dateEnd } }
      ],
    });
    return Boolean(conflictingEvent);
  }

  private validateAndParseDate(dateString: string, fieldName: string): Date {
    const parsedDate = parseISO(dateString);
    if (!isValid(parsedDate)) {
      throw new BadRequestException(`Invalid date format for ${fieldName}. Expected ISO format.`);
    }
    return parsedDate;
  }

  private toEventResponse(event: Event): EventResponse {
    return {
      id: event._id.toString(),
      name: event.name,
      location: event.location,
      dateStart: event.dateStart.toISOString(),
      dateEnd: event.dateEnd.toISOString(),
      artist: event.artist?.map((artist: Artist) => artist._id.toString()) || [],  // Map artists to an array of IDs
      organizer: event.organizer?._id.toString(),
      ticketPrice: event.ticketPrice,
      createdAt: toTimestamp(event.createdAt),
      updatedAt: toTimestamp(event.updatedAt),
      club: event.club?._id?.toString(),
    };
  }


}
