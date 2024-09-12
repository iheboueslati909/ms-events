import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ArtistModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
