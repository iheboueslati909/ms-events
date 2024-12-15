import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventRequest, EventResponse, UpdateEventRequest } from 'src/proto/events-app';
import { Event } from './entities/event.entity';
import { ArtistService } from 'src/artist/artist.service';
import { OrganizerService } from 'src/organizer/organizer.service';
import { ClubService } from 'src/club/club.service';
import { toTimestamp, validateAndParseDates } from 'src/utils/date-utils';
import { BookingService } from 'src/booking/booking.service';
@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private artistService: ArtistService,
    private organizerService: OrganizerService,
    private clubService: ClubService,
    private readonly bookingService: BookingService
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
    const { name, location, dateStart, dateEnd, artist, organizer, ticketPrice, club } = data;
    const { start, end } = validateAndParseDates(dateStart, dateEnd);

    const organizerProfile = await this.organizerService.findOne(organizer);
    if (!organizerProfile) {
      throw new NotFoundException(`Organizer with ID ${organizer} not found`);
    }

    const artistEntities = artist ? await this.artistService.findMany(artist) : [];
    const foundArtistIds = artistEntities.map(artist => artist.id);
    const missingArtists = artist?.filter(artistId => !foundArtistIds.includes(artistId)) || [];
    if (missingArtists.length > 0) {
      throw new NotFoundException(`Artists with IDs [${missingArtists.join(', ')}] not found`);
    }

    let clubEntity = null;
    if (club) {
      clubEntity = await this.clubService.findOne(club);
      if (!clubEntity) {
        throw new NotFoundException(`Club with ID ${club} not found`);
      }

      const hasConflict = await this.hasConflictingEvent(clubEntity._id, start, end);
      if (hasConflict) {
        throw new ConflictException(`There is already an event scheduled in this club during the specified time range.`);
      }
    }

    const newEvent = new this.eventModel({
      name,
      location,
      dateStart: start,
      dateEnd: end,
      artist: artistEntities.map(a => a.id), //assuring the ID will be persisted as strings
      organizer,
      club: clubEntity?._id,
      ticketPrice,
    });

    const createdEvent = await newEvent.save();
    return this.toEventResponse(createdEvent);
  }

  async findOneEvent(id: string): Promise<EventResponse> {
    const event = await this.eventModel.findById(id).populate('artist organizer');
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.toEventResponse(event);
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    const { name, location, dateStart, dateEnd, artist, ticketPrice, club } = data;

    // Validate and parse dates
    const { start, end } = validateAndParseDates(dateStart, dateEnd);
    // Batch fetch artist from service by IDs
    const artistEntities = await this.artistService.findMany(artist);
    const foundArtistIds = artistEntities.map(artist => artist.id);
    const missingArtists = artist.filter(artistId => !foundArtistIds.includes(artistId));
    if (missingArtists.length > 0) {
      throw new NotFoundException(`Artists with IDs [${missingArtists.join(', ')}] not found`);
    }

    // Validate and fetch club entity if provided
    let clubEntity = null;
    if (club) {
      clubEntity = await this.clubService.findOne(club);
      if (!clubEntity) {
        throw new NotFoundException(`Club with ID ${club} not found`);
      }

      // Check for conflicting events in the club during the specified time range
      const conflictingEvent = await this.hasConflictingEvent(clubEntity._id, start, end);
      if (conflictingEvent) {
        throw new ConflictException(`There is already an event scheduled in this club during the specified time range.`);
      }
    }

    // Prepare update data with validated entities
    const updateData: Partial<Event> = {
      name,
      location,
      dateStart: start,
      dateEnd: end,
      artist: artistEntities.map(a => a.id),
      ticketPrice,
      club: clubEntity?._id,
    };

    // Update and return the event
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateData, { new: true });
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
    const events = await this.eventModel.find();
    return events.map(event => this.toEventResponse(event));
  }

  //helpers
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

  private toEventResponse(event: Event): EventResponse {
    return {
      id: event._id.toString(),
      name: event.name,
      location: event.location,
      dateStart: event.dateStart.toISOString(),
      dateEnd: event.dateEnd.toISOString(),
      artist: event.artist?.map((a) => a) || [],  // Map artists to an array of IDs
      organizer: event.organizer,
      ticketPrice: event.ticketPrice,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      club: event.club,
    };
  }


}
