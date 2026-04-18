import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { SCENARIO_TYPES, ScenarioType } from './scenario.types';

export class RunScenarioDto {
  @ApiProperty({ enum: SCENARIO_TYPES })
  @IsIn(SCENARIO_TYPES)
  type!: ScenarioType;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
