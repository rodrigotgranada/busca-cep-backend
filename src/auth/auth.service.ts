import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly users = {
    username: 'admin',
    password: 'password123',
  };

  private readonly jwtSecret = 'secretKey';

  private readonly blacklistedTokens: Set<string> = new Set();

  login(username: string, password: string): string {
    if (username === this.users.username && password === this.users.password) {
      return jwt.sign({ username }, this.jwtSecret, { expiresIn: '1h' });
    } else {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  verifyToken(token: string): any {
    if (this.blacklistedTokens.has(token)) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  logout(token: string): void {
    this.blacklistedTokens.add(token);
  }
}
