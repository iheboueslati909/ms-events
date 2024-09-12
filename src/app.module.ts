import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { CommonModule } from './common/common.module';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ClubModule } from './club/club.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/events'),
    ArtistModule, CommonModule, EventModule, OrganizerModule, ClubModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
