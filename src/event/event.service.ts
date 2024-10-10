import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

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
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
