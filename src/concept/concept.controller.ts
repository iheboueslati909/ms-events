import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConceptService } from './concept.service';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';

@Controller()
export class ConceptController {
  constructor(private readonly conceptService: ConceptService) {}

  @MessagePattern('createConcept')
  create(@Payload() createConceptDto: CreateConceptDto) {
    return this.conceptService.create(createConceptDto);
  }

  @MessagePattern('findAllConcept')
  findAll() {
    return this.conceptService.findAll();
  }

  @MessagePattern('findOneConcept')
  findOne(@Payload() id: number) {
    return this.conceptService.findOne(id);
  }

  @MessagePattern('updateConcept')
  update(@Payload() updateConceptDto: UpdateConceptDto) {
    return this.conceptService.update(updateConceptDto.id, updateConceptDto);
  }

  @MessagePattern('removeConcept')
  remove(@Payload() id: number) {
    return this.conceptService.remove(id);
  }
}
