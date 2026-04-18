import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { JsonLogger } from './json-logger.service';

@Injectable()
export class SentryService implements OnApplicationShutdown {
  private readonly enabled: boolean;
  private readonly mode: 'remote' | 'local';

  constructor(private readonly logger: JsonLogger) {
    const dsn = process.env.SENTRY_DSN?.trim();
    this.enabled = this.isValidDsn(dsn);
    this.mode = this.enabled ? 'remote' : 'local';
    if (this.enabled) {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV ?? 'development',
        tracesSampleRate: 0,
      });
      this.logger.log('Sentry initialized', 'SentryService', {
        sentryMode: this.mode,
      });
    } else {
      this.logger.warn('Sentry local fallback enabled because SENTRY_DSN is empty or invalid', 'SentryService', {
        sentryMode: this.mode,
      });
    }
  }

  captureException(error: unknown, context?: Record<string, unknown>) {
    if (!this.enabled) {
      this.logger.warn('Sentry local exception capture', 'SentryService', {
        sentryMode: this.mode,
        sentryEvent: 'exception',
        ...this.serializeError(error),
        ...context,
      });
      return;
    }
    const eventId = Sentry.withScope((scope) => {
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          scope.setExtra(key, value);
        }
      }
      return Sentry.captureException(error);
    });
    this.logger.log('Sentry remote exception queued', 'SentryService', {
      sentryMode: this.mode,
      sentryEvent: 'exception',
      sentryEventId: eventId,
      ...context,
    });
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>) {
    if (!this.enabled) {
      this.logger.warn('Sentry local breadcrumb', 'SentryService', {
        sentryMode: this.mode,
        sentryEvent: 'breadcrumb',
        breadcrumbMessage: message,
        ...data,
      });
      return;
    }
    Sentry.addBreadcrumb({
      category: 'scenario',
      level: 'warning',
      message,
      data,
    });
    this.logger.debug('Sentry remote breadcrumb added', 'SentryService', {
      sentryMode: this.mode,
      sentryEvent: 'breadcrumb',
      breadcrumbMessage: message,
      ...data,
    });
  }

  async onApplicationShutdown() {
    if (!this.enabled) {
      return;
    }
    const flushed = await Sentry.flush(2000);
    const log = flushed ? this.logger.log.bind(this.logger) : this.logger.warn.bind(this.logger);
    log('Sentry remote event buffer flushed on shutdown', 'SentryService', {
      sentryMode: this.mode,
      flushed,
    });
  }

  private serializeError(error: unknown) {
    if (error instanceof Error) {
      return {
        errorName: error.name,
        error: error.message,
        trace: error.stack,
      };
    }
    return {
      error: String(error),
    };
  }

  private isValidDsn(dsn?: string) {
    return Boolean(dsn && dsn.startsWith('https://') && dsn.includes('@'));
  }
}
