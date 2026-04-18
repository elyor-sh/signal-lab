import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RunScenarioDto } from './run-scenario.dto';
import { ScenarioService } from './scenario.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenarioController {
  constructor(private readonly scenarios: ScenarioService) {}

  @Post('run')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Scenario was executed' })
  run(@Body() dto: RunScenarioDto) {
    return this.scenarios.run(dto);
  }

  @Get('runs')
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Latest scenario runs' })
  latest(@Query('limit') limit?: string) {
    const parsedLimit = Number.parseInt(limit ?? '', 10);
    return this.scenarios.latest(Number.isFinite(parsedLimit) ? parsedLimit : 20);
  }
}
