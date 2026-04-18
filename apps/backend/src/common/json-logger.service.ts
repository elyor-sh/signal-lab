import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class JsonLogger implements LoggerService {
  log(message: string, context?: string, extra?: Record<string, unknown>) {
    this.write('info', message, context, extra);
  }

  error(message: string, trace?: string, context?: string, extra?: Record<string, unknown>) {
    this.write('error', message, context, { ...extra, trace });
  }

  warn(message: string, context?: string, extra?: Record<string, unknown>) {
    this.write('warn', message, context, extra);
  }

  debug(message: string, context?: string, extra?: Record<string, unknown>) {
    this.write('debug', message, context, extra);
  }

  verbose(message: string, context?: string, extra?: Record<string, unknown>) {
    this.write('verbose', message, context, extra);
  }

  private write(level: LogLevel | 'info', message: string, context?: string, extra?: Record<string, unknown>) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      app: 'signal-lab',
      ...extra,
    };

    const line = JSON.stringify(payload);
    if (level === 'error') {
      process.stderr.write(`${line}\n`);
      return;
    }
    process.stdout.write(`${line}\n`);
  }
}
