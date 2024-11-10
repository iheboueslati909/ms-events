import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Concept, ConceptSchema } from './entities/concept.entity';

@Module({
  imports: [CommonModule,
    MongooseModule.forFeature([{
      name: Concept.name, schema:
      ConceptSchema
    }])
  ],
  controllers: [ConceptController],
  providers: [ConceptService],
  exports: [ConceptService]
})
export class ConceptModule {}
