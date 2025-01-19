jest.mock('axios');
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from './cep.service';
import { Logger } from '../logging/logger.service';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CepService (com mockedAxios)', () => {
  let service: CepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CepService>(CepService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar dados de um CEP encontrado no ViaCepProvider', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: '12345678',
        uf: 'SP',
        localidade: 'São Paulo',
        bairro: 'Centro',
        logradouro: 'Rua Exemplo',
      },
    });

    const result = await service.findCep('12345678');
    expect(result.data).toEqual({
      cep: '12345678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      service: 'via-cep',
    });
    expect(result.status).toBe(1);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/12345678/json/',
    );
  });

  it('deve retornar erro para um CEP inválido', async () => {
    const result = await service.findCep('123');
    expect(result.status).toBe(4);
    expect(result.message).toBe(
      'CEP inválido. Deve conter apenas 8 dígitos numéricos.',
    );
    expect(result.data).toBeNull();

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('deve retornar erro quando o CEP não é encontrado em nenhum provedor', async () => {
    mockedAxios.get.mockRejectedValue(new Error('CEP não encontrado'));

    const result = await service.findCep('99999999');
    expect(result.status).toBe(3);
    expect(result.message).toBe(
      'CEP não encontrado, mesmo após tentativa de correção.',
    );
    expect(result.data).toBeNull();

    expect(mockedAxios.get).toHaveBeenCalledTimes(27);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/99999999/json/',
    );
  });

  it('deve aplicar correções ao CEP e retornar o primeiro válido', async () => {
    jest
      .spyOn(service['viaCepProvider'], 'fetchCep')
      .mockRejectedValueOnce(new Error('CEP não encontrado no ViaCep'));

    jest
      .spyOn(service['postmonProvider'], 'fetchCep')
      .mockRejectedValueOnce(new Error('CEP não encontrado no Postmon'))
      .mockResolvedValueOnce({
        cep: '12345990',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Exemplo',
        service: 'postmon',
      });

    const result = await service.findCep('12345999');

    expect(result.data).toEqual({
      cep: '12345990',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua Exemplo',
      service: 'postmon',
    });
    expect(result.status).toBe(2);
    expect(result.message).toBe(
      'CEP verificado: 12345999, CEP encontrado: 12345990',
    );

    expect(service['viaCepProvider'].fetchCep).toHaveBeenCalledTimes(2);
    expect(service['viaCepProvider'].fetchCep).toHaveBeenCalledWith('12345999');
    expect(service['postmonProvider'].fetchCep).toHaveBeenCalledTimes(2);
    expect(service['postmonProvider'].fetchCep).toHaveBeenNthCalledWith(
      1,
      '12345999',
    );
    expect(service['postmonProvider'].fetchCep).toHaveBeenNthCalledWith(
      2,
      '12345990',
    );
  });
});
