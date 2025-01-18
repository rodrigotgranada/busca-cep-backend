import axios from 'axios';
import { ViaCepResponse } from './interfaces/viacep-response.interface';
import { CepResponse } from '../interfaces/cep-response.interface';

export class ViaCepProvider {
  private readonly baseURL = 'https://viacep.com.br/ws';

  async fetchCep(cep: string): Promise<CepResponse> {
    try {
      const response = await axios.get<ViaCepResponse>(
        `${this.baseURL}/${cep}/json/`,
      );
      if (response.data.erro) {
        throw new Error('CEP não encontrado na ViaCEP');
      }

      return {
        cep: response.data.cep,
        state: response.data.uf,
        city: response.data.localidade,
        neighborhood: response.data.bairro,
        street: response.data.logradouro,
        service: 'via-cep',
      };
    } catch (error) {
      throw new Error(
        `Erro ao consultar a API ViaCEP: ${(error as Error).message}`,
      );
    }
  }
}
