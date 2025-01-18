import axios from 'axios';
import { BrasilApiResponse } from './interfaces/brasilapi-response.interface';
import { CepResponse } from '../interfaces/cep-response.interface';

export class BrasilApiProvider {
  private readonly baseURL = 'https://brasilapi.com.br/api/cep/v1';

  async fetchCep(cep: string): Promise<CepResponse> {
    try {
      const response = await axios.get<BrasilApiResponse>(
        `${this.baseURL}/${cep}`,
      );

      return {
        cep: response.data.cep,
        state: response.data.state,
        city: response.data.city,
        neighborhood: response.data.neighborhood,
        street: response.data.street,
        service: 'brasil-api',
      };
    } catch (error) {
      throw new Error(
        `Erro ao consultar a API BrasilAPI: ${(error as Error).message}`,
      );
    }
  }
}
