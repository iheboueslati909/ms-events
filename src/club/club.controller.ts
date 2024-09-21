import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.update(+id, updateClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubService.remove(+id);
  }

  @MessagePattern({ cmd: 'POST/EVENTS_API/CLUB/CREATE' })
  createClub(@Payload() createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @MessagePattern({ cmd: 'GET/EVENTS_API/CLUB/ALL'})
  getClubAll(data: any) {
    return this.clubService.findAll();
  }
}
