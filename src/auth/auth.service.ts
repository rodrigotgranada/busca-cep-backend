import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly users = {
    username: 'admin',
    password: 'password123',
  };

  private readonly jwtSecret = 'secretKey';

  private readonly blacklistedTokens: Set<string> = new Set();

  login(username: string, password: string): string {
    this.logger.log(`Verificando credenciais do usuário: ${username}`);
    if (username === this.users.username && password === this.users.password) {
      const token = jwt.sign({ username }, this.jwtSecret, {
        expiresIn: '1h',
      });
      this.logger.log(`Token gerado com sucesso para o usuário: ${username}`);
      return token;
    } else {
      this.logger.warn(`Credenciais inválidas para o usuário: ${username}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  verifyToken(token: string): any {
    this.logger.log('Verificando token recebido');
    if (this.blacklistedTokens.has(token)) {
      this.logger.warn('Token inválido ou expirado');
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Erro desconhecido';
      this.logger.error('Erro ao verificar token', errorMessage);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  logout(token: string): void {
    this.logger.log('Adicionando token à blacklist');
    this.blacklistedTokens.add(token);
  }
}
