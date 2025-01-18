import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    if (!username || !password) {
      throw new UnauthorizedException('Credenciais são obrigatórias');
    }
    const token = this.authService.login(username, password);
    return { token };
  }

  @ApiOperation({ summary: 'Realiza logout' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido.' })
  @Post('logout')
  logout(@Headers('Authorization') authHeader: string): { message: string } {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    this.authService.logout(token);
    return { message: 'Logout realizado com sucesso' };
  }
}
