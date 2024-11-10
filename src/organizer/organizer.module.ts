import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Organizer, OrganizerSchema } from './entities/organizer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
    name: Organizer.name, schema:
    OrganizerSchema
  }]),
    CommonModule],
  controllers: [OrganizerController],
  providers: [OrganizerService],
  exports: [OrganizerService]
})
export class OrganizerModule {}
