import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCognitiveTaskDto {
  @ApiProperty({ description: 'Type of cognitive task (e.g., lead_scoring, csrd_analysis)' })
  @IsString()
  @IsNotEmpty()
  taskType!: string;

  @ApiProperty({ description: 'Task payload with domain-specific data' })
  @IsObject()
  payload!: Record<string, unknown>;
}
