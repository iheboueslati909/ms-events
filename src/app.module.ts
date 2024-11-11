import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { CommonModule } from './common/common.module';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ClubModule } from './club/club.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConceptModule } from './concept/concept.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { BookingModule } from './booking/booking.module';

const ENV = process.env.NODE_ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DB_NAME')}`,
      }),
    }),
    ArtistModule, EventModule, OrganizerModule, ClubModule, ConceptModule, BookingModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
