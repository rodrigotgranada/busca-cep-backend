import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CepService } from './cep.service';
import { CepResponse } from './interfaces/cep-response.interface';

@ApiTags('CEP')
@ApiBearerAuth('access-token')
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
    description: 'Informações do CEP retornadas com sucesso.',
    type: CepResponse,
  })
  @ApiResponse({ status: 400, description: 'CEP inválido.' })
  @ApiResponse({
    status: 404,
    description: 'CEP não encontrado mesmo após correções.',
  })
  @Get(':cep')
  async getCep(@Param('cep') cep: string) {
    return this.cepService.findCep(cep);
  }
}
