import { PartialType } from '@nestjs/swagger';
import { CreateCepDto } from './create-cep.dto';

export class UpdateCepDto extends PartialType(CreateCepDto) {}
