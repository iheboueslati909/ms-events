import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist , ArtistSchema } from './entities/artist.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Artist.name, schema:
      ArtistSchema
    }]),
    CommonModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService]
})
export class ArtistModule {}
