import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Organizer, OrganizerSchema } from './entities/organizer.entity';

@Module({
  imports: [CommonModule,
    MongooseModule.forFeature([{
    name: Organizer.name, schema:
    OrganizerSchema
  }])
],
  controllers: [OrganizerController],
  providers: [OrganizerService],
  exports: [OrganizerService],
})
export class OrganizerModule {}
