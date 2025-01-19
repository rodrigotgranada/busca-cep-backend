import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Logger } from '../logging/logger.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Realiza login e retorna um token JWT' })
  @ApiBody({
    description: 'Dados de login',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Token retornado.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @Post('login')
  login(@Body() body: { username: string; password: string }): {
    token: string;
  } {
    const { username, password } = body;
    this.logger.log(
      `Tentativa de login para o usuário: ${username}`,
      'AuthController',
    );

    if (!username || !password) {
      this.logger.warn(
        'Credenciais ausentes na tentativa de login',
        'AuthController',
      );
      throw new UnauthorizedException('Credenciais são obrigatórias');
    }

    const token = this.authService.login(username, password);
    this.logger.log(
      `Login bem-sucedido para o usuário: ${username}`,
      'AuthController',
    );
    return { token };
  }

  @ApiOperation({ summary: 'Realiza logout' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido.' })
  @Post('logout')
  logout(@Headers('Authorization') authHeader: string): { message: string } {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Tentativa de logout sem token', 'AuthController');
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    this.authService.logout(token);
    this.logger.log('Logout realizado com sucesso', 'AuthController');
    return { message: 'Logout realizado com sucesso' };
  }
}
