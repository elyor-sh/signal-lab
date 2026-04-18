import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JsonLogger } from '../common/json-logger.service';
import { LoggedInternalServerErrorException } from '../common/logged-http-exception';
import { SentryService } from '../common/sentry.service';
import { MetricsService } from '../metrics/metrics.service';
import { PrismaService } from '../prisma/prisma.service';
import { RunScenarioDto } from './run-scenario.dto';
import { ScenarioResponse } from './scenario.types';

@Injectable()
export class ScenarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
    private readonly logger: JsonLogger,
    private readonly sentry: SentryService,
  ) {}

  async run(dto: RunScenarioDto): Promise<ScenarioResponse> {
    const startedAt = Date.now();

    if (dto.type === 'slow_request') {
      await this.sleep(this.randomDelayMs());
    }

    if (dto.type === 'validation_error') {
      const duration = Date.now() - startedAt;
      const run = await this.saveRun({
        type: dto.type,
        status: 'validation_error',
        duration,
        error: 'Validation scenario intentionally failed',
        metadata: { name: dto.name ?? null },
      });
      this.metrics.recordScenario(dto.type, 'validation_error', duration);
      this.sentry.addBreadcrumb('Validation scenario rejected input', {
        scenarioType: dto.type,
        scenarioId: run.id,
      });
      this.logger.warn('Scenario validation error', 'ScenarioService', {
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
        error: run.error,
      });
      throw new BadRequestException('Validation scenario intentionally failed');
    }

    if (dto.type === 'system_error') {
      const duration = Date.now() - startedAt;
      const error = new Error('System scenario intentionally failed');
      const run = await this.saveRun({
        type: dto.type,
        status: 'error',
        duration,
        error: error.message,
        metadata: { name: dto.name ?? null },
      });
      this.metrics.recordScenario(dto.type, 'error', duration);
      this.sentry.captureException(error, {
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
      });
      this.logger.error('Scenario system error', error.stack, 'ScenarioService', {
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
        error: error.message,
      });
      throw new LoggedInternalServerErrorException(error.message);
    }

    if (dto.type === 'teapot') {
      const duration = Date.now() - startedAt;
      const run = await this.saveRun({
        type: dto.type,
        status: 'teapot',
        duration,
        metadata: { easter: true, name: dto.name ?? null },
      });
      this.metrics.recordScenario(dto.type, 'teapot', duration);
      this.logger.warn('Scenario teapot signal', 'ScenarioService', {
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
        signal: 42,
      });
      throw new HttpException(
        {
          id: run.id,
          signal: 42,
          message: "I'm a teapot",
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const duration = Date.now() - startedAt;
    const run = await this.saveRun({
      type: dto.type,
      status: 'completed',
      duration,
      metadata: { name: dto.name ?? null },
    });
    this.metrics.recordScenario(dto.type, 'completed', duration);
    const logLevel = dto.type === 'slow_request' ? 'warn' : 'log';
    this.logger[logLevel](
      dto.type === 'slow_request' ? 'Scenario completed slowly' : 'Scenario completed',
      'ScenarioService',
      {
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
      },
    );

    return {
      id: run.id,
      type: run.type as ScenarioResponse['type'],
      status: run.status,
      duration: run.duration,
      createdAt: run.createdAt,
    };
  }

  async latest(limit = 20) {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 20) : 20;
    return this.prisma.scenarioRun.findMany({
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
    });
  }

  private saveRun(data: {
    type: string;
    status: string;
    duration: number;
    error?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.scenarioRun.create({
      data,
    });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private randomDelayMs() {
    return Math.floor(2000 + Math.random() * 3000);
  }
}
