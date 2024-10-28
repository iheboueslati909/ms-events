import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './entities/club.entity';

@Module({
  imports: [CommonModule,
    MongooseModule.forFeature([{
      name: Club.name, schema:
      ClubSchema
    }])
  ],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [ClubService]
})
export class ClubModule {}
