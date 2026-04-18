import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { HttpMetricsMiddleware } from './metrics/http-metrics.middleware';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScenarioController } from './scenarios/scenario.controller';
import { ScenarioService } from './scenarios/scenario.service';
import { JsonLogger } from './common/json-logger.service';
import { SentryService } from './common/sentry.service';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController, MetricsController, ScenarioController],
  providers: [
    JsonLogger,
    SentryService,
    MetricsService,
    HttpMetricsMiddleware,
    AllExceptionsFilter,
    ScenarioService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}
