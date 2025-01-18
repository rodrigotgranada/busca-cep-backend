import axios from 'axios';
import { PostmonResponse } from './interfaces/postmon-response.interface';
import { CepResponse } from '../interfaces/cep-response.interface';

export class PostmonProvider {
  private readonly baseURL = 'https://api.postmon.com.br/v1/cep';

  async fetchCep(cep: string): Promise<CepResponse> {
    try {
      const response = await axios.get<PostmonResponse>(
        `${this.baseURL}/${cep}`,
      );

      return {
        cep: response.data.cep,
        state: response.data.estado,
        city: response.data.cidade,
        neighborhood: response.data.bairro,
        street: response.data.logradouro,
        service: 'postmon',
      };
    } catch (error) {
      throw new Error(
        `Erro ao consultar a API Postmon: ${(error as Error).message}`,
      );
    }
  }
}
