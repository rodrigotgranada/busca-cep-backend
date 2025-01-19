import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve retornar um token para login válido', () => {
    const token = service.login('admin', 'password123');
    expect(token).toBeDefined();
  });

  it('deve lançar um erro para login inválido', () => {
    expect(() => service.login('wrongUser', 'wrongPass')).toThrowError(
      'Credenciais inválidas',
    );
  });

  it('deve verificar um token válido', () => {
    const token = service.login('admin', 'password123');
    const payload = service.verifyToken(token);
    expect(payload).toHaveProperty('username', 'admin');
  });

  it('deve lançar um erro para token inválido', () => {
    expect(() => service.verifyToken('invalidToken')).toThrowError(
      'Token inválido ou expirado',
    );
  });
});
