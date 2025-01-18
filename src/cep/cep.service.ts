import { Injectable } from '@nestjs/common';
import { ViaCepProvider } from './providers/viacep.provider';
import { PostmonProvider } from './providers/postmon.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';
import { CepResponse } from './interfaces/cep-response.interface';

@Injectable()
export class CepService {
  private viaCepProvider = new ViaCepProvider();
  private postmonProvider = new PostmonProvider();
  private brasilApiProvider = new BrasilApiProvider();

  async findCep(
    cep: string,
  ): Promise<{ status: number; message: string; data: CepResponse | null }> {
    if (!/^\d{8}$/.test(cep)) {
      return {
        status: 4,
        message: 'CEP inválido. Deve conter apenas 8 dígitos numéricos.',
        data: null,
      };
    }

    const originalResult = await this.tryProviders(cep);
    if (originalResult) {
      return {
        data: originalResult,
        status: 1,
        message: `CEP verificado: ${cep}, CEP encontrado: ${cep}`,
      };
    }

    const { correctedCep, message } = await this.findCorrectedCep(cep);
    if (correctedCep) {
      return {
        data: correctedCep,
        status: 2,
        message,
      };
    }

    return {
      status: 3,
      message: `CEP não encontrado, mesmo após tentativa de correção.`,
      data: null,
    };
  }

  private async tryProviders(cep: string): Promise<CepResponse | null> {
    try {
      return await this.viaCepProvider.fetchCep(cep);
    } catch {
      try {
        return await this.postmonProvider.fetchCep(cep);
      } catch {
        try {
          return await this.brasilApiProvider.fetchCep(cep);
        } catch {
          return null;
        }
      }
    }
  }

  private async findCorrectedCep(
    cep: string,
  ): Promise<{ correctedCep: CepResponse | null; message: string }> {
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
          };
        }
      }
    }

    return { correctedCep: null, message: '' };
  }
}
