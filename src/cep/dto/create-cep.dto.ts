import { ApiProperty } from '@nestjs/swagger';

export class CreateCepDto {
  @ApiProperty({ description: 'CEP no formato 12345678', example: '96020390' })
  cep!: string;
}
