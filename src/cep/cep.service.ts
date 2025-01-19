import { Injectable } from '@nestjs/common';
import { ViaCepProvider } from './providers/viacep.provider';
import { PostmonProvider } from './providers/postmon.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';
import { CepResponse } from './interfaces/cep-response.interface';
import { Logger } from '../logging/logger.service';

@Injectable()
export class CepService {
  constructor(private readonly logger: Logger) {}

  private viaCepProvider = new ViaCepProvider();
  private postmonProvider = new PostmonProvider();
  private brasilApiProvider = new BrasilApiProvider();

  async findCep(cep: string): Promise<{
    status: number;
    message: string;
    data: CepResponse | null;
    wasCorrected: boolean;
  }> {
    this.logger.log(`Iniciando busca para o CEP: ${cep}`, 'CepService');

    if (!/^\d{8}$/.test(cep)) {
      this.logger.warn(`CEP inválido: ${cep}`, 'CepService');
      return {
        status: 4,
        message: 'CEP inválido. Deve conter apenas 8 dígitos numéricos.',
        data: null,
        wasCorrected: false,
      };
    }

    const originalResult = await this.tryProviders(cep);
    if (originalResult) {
      this.logger.log(`CEP encontrado: ${cep}`, 'CepService');
      return {
        data: originalResult,
        status: 1,
        message: `CEP verificado: ${cep}, CEP encontrado: ${cep}`,
        wasCorrected: false,
      };
    }

    const { correctedCep, message, wasCorrected } =
      await this.findCorrectedCep(cep);
    if (correctedCep) {
      this.logger.log(
        `Correção aplicada ao CEP: ${cep} -> ${correctedCep.cep}`,
        'CepService',
      );
      return {
        data: correctedCep,
        status: 2,
        message,
        wasCorrected: wasCorrected,
      };
    }

    this.logger.warn(`CEP não encontrado após correções: ${cep}`, 'CepService');
    return {
      status: 3,
      message: `CEP não encontrado, mesmo após tentativa de correção.`,
      data: null,
      wasCorrected: false,
    };
  }

  private async tryProviders(cep: string): Promise<CepResponse | null> {
    this.logger.log(
      `Tentando buscar o CEP: ${cep} nos provedores`,
      'CepService',
    );
    try {
      return await this.viaCepProvider.fetchCep(cep);
    } catch {
      try {
        return await this.postmonProvider.fetchCep(cep);
      } catch {
        try {
          return await this.brasilApiProvider.fetchCep(cep);
        } catch {
          this.logger.error(
            `Falha ao buscar CEP: ${cep} em todos os provedores`,
            '',
            'CepService',
          );
          return null;
        }
      }
    }
  }

  private async findCorrectedCep(cep: string): Promise<{
    correctedCep: CepResponse | null;
    message: string;
    wasCorrected: boolean;
  }> {
    this.logger.log(`Iniciando correção para o CEP: ${cep}`, 'CepService');
    let modifiedCep = cep;

    for (let i = cep.length - 1; i >= 0; i--) {
      if (modifiedCep[i] !== '0') {
        modifiedCep =
          modifiedCep.substring(0, i) + '0' + modifiedCep.substring(i + 1);

        const result = await this.tryProviders(modifiedCep);
        if (result) {
          return {
            correctedCep: result,
            message: `CEP verificado: ${cep}, CEP encontrado: ${modifiedCep}`,
            wasCorrected: true,
          };
        }
      }
    }

    this.logger.warn(
      `Nenhuma correção encontrada para o CEP: ${cep}`,
      'CepService',
    );
    return { correctedCep: null, message: '', wasCorrected: false };
  }
}
