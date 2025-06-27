import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Auth Middlewre !!!!');

    try {
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        throw new BadRequestException('Token is missing');
      }

      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req['user'] = payload;

      next();
    } catch (error: any) {
      throw new BadRequestException({ message: error.message });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
