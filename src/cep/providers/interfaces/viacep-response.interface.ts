export interface ViaCepResponse {
  cep: string;
  uf: string;
  localidade: string;
  bairro: string;
  logradouro: string;
  erro?: boolean;
}
