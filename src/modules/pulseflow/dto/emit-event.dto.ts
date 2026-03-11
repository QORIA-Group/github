import { IsEnum, IsNotEmpty, IsString, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PulseFlowEventType } from '../../../common/enums/pulseflow-event-type.enum';

export class EmitEventDto {
  @ApiProperty({ enum: PulseFlowEventType })
  @IsEnum(PulseFlowEventType)
  eventType!: PulseFlowEventType;

  @ApiProperty({ description: 'UUID of the aggregate entity' })
  @IsUUID()
  aggregateId!: string;

  @ApiProperty({ description: 'Type of the aggregate (e.g., Lead, User, CSRDIndicator)' })
  @IsString()
  @IsNotEmpty()
  aggregateType!: string;

  @ApiProperty({ description: 'Event payload data' })
  @IsObject()
  payload!: Record<string, unknown>;
}
