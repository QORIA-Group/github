import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentTenant } from './decorators/current-tenant.decorator';
import { TenantContext } from '../../../shared/types/tenant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentTenant() ctx: TenantContext) {
    return {
      userId: ctx.userId,
      tenantId: ctx.tenantId,
      tenantType: ctx.tenantType,
      role: ctx.role,
    };
  }
}
