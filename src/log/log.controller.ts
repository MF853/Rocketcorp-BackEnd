import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Controller('logs')
@UseGuards(JwtGuard, RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('recent')
  @Roles(Role.Rh, Role.Admin)
  async getRecentLogs() {
    return this.logService.getRecentLogs();
  }
} 