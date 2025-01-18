import { ApiProperty } from '@nestjs/swagger';

export class CepResponse {
  @ApiProperty({ example: '96020390', description: 'CEP encontrado' })
  cep!: string;

  @ApiProperty({ example: 'RS', description: 'Estado correspondente ao CEP' })
  state!: string;

  @ApiProperty({
    example: 'Pelotas',
    description: 'Cidade correspondente ao CEP',
  })
  city!: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Bairro correspondente ao CEP',
  })
  neighborhood!: string;

  @ApiProperty({
    example: 'Rua Antônio Cury',
    description: 'Logradouro correspondente ao CEP',
  })
  street!: string;

  @ApiProperty({
    example: 'via-cep',
    description: 'Serviço que forneceu os dados',
  })
  service!: string;
}
