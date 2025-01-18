import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CepService } from './cep.service';

@ApiTags('cep')
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @ApiOperation({ summary: 'Busca informações de um CEP' })
  @ApiParam({
    name: 'cep',
    description: 'CEP no formato 12345678',
    example: '96020390',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do CEP retornadas com sucesso',
  })
  @ApiResponse({ status: 400, description: 'CEP inválido' })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar informações do CEP',
  })
  @Get(':cep')
  async getCep(@Param('cep') cep: string) {
    return this.cepService.findCep(cep);
  }
}
