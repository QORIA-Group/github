import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { PulseFlowService } from '../pulseflow/pulseflow.service';
import { ReptilianService } from './tri-brain/reptilian.service';
import { LimbicService } from './tri-brain/limbic.service';
import { NeocortexService } from './tri-brain/neocortex.service';
import { CognitiveResult, CognitiveTask } from '../../common/interfaces/cognitive-task.interface';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TriBrainLevel } from '../../common/enums/tri-brain-level.enum';
import { PulseFlowEventType } from '../../common/enums/pulseflow-event-type.enum';

/**
 * KYRA Cognitive Engine - Tri-Brain Computing(tm) Router
 *
 * Routes cognitive tasks through the three brain levels:
 * 1. Reptilian: Cache & exact rules (fastest, zero cost)
 * 2. Limbic: Lightweight LLM classification (fast, low cost)
 * 3. Neocortex: Deep causal inference via Knowledge Graph (thorough, higher cost)
 *
 * Each level attempts resolution. If it cannot handle the task,
 * it escalates to the next level. This reduces GPU compute costs
 * while maintaining reasoning quality.
 */
@Injectable()
export class KyraService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reptilian: ReptilianService,
    private readonly limbic: LimbicService,
    private readonly neocortex: NeocortexService,
    private readonly pulseflow: PulseFlowService,
    private readonly logger: StructuredLogger,
  ) {}

  /**
   * Submit a cognitive task to the Tri-Brain router.
   * The task cascades through brain levels until resolved.
   */
  async processCognitiveTask(
    tenant: TenantContext,
    taskType: string,
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    const taskId = uuidv4();

    const task: CognitiveTask = {
      taskId,
      tenantId: tenant.tenantId,
      type: taskType,
      payload,
      context: {
        correlationId: tenant.correlationId,
        userId: tenant.userId,
        source: 'api',
        tenantType: tenant.tenantType,
        managedTenantIds: tenant.managedTenantIds,
      },
      createdAt: new Date(),
    };

    // Persist the task
    await this.prisma.executeInTenantContext(tenant.tenantId, async (tx) => {
      await tx.cognitiveTask.create({
        data: {
          id: taskId,
          tenantId: tenant.tenantId,
          userId: tenant.userId,
          taskType,
          payload: payload as Prisma.InputJsonValue,
          status: 'PROCESSING',
          correlationId: tenant.correlationId,
        },
      });
    });

    this.logger.logCognitiveDecision(
      'KyraService',
      `Cognitive task ${taskId} submitted - beginning Tri-Brain routing`,
      {
        task_id: taskId,
        task_type: taskType,
        tenant_id: tenant.tenantId,
      },
    );

    // Tri-Brain Cascade
    const result = await this.triBrainCascade(task);

    // Persist the result
    await this.prisma.executeInTenantContext(tenant.tenantId, async (tx) => {
      await tx.cognitiveTask.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          brainLevel: result.level,
          result: result.result as Prisma.InputJsonValue,
          causalEvidence: result.causalEvidence as unknown as Prisma.InputJsonValue,
          processingTimeMs: result.processingTimeMs,
          completedAt: new Date(),
        },
      });
    });

    // Emit PulseFlow event
    await this.pulseflow.emitEvent(
      tenant,
      PulseFlowEventType.COGNITIVE_TASK_COMPLETED,
      taskId,
      'CognitiveTask',
      {
        task_id: taskId,
        task_type: taskType,
        brain_level: result.level,
        processing_time_ms: result.processingTimeMs,
      },
    );

    this.logger.logCognitiveDecision(
      'KyraService',
      `Cognitive task ${taskId} completed at level ${result.level}`,
      {
        task_id: taskId,
        task_type: taskType,
        brain_level: result.level,
        processing_time_ms: result.processingTimeMs,
        cached: result.cached,
        causal_evidence_count: result.causalEvidence.length,
      },
    );

    return result;
  }

  /**
   * Tri-Brain Computing(tm) cascade algorithm.
   * Attempts each brain level in order. The first level that
   * returns a result wins. If all lightweight levels return null,
   * the Neocortex (deep inference) is the final resolver.
   */
  private async triBrainCascade(task: CognitiveTask): Promise<CognitiveResult> {
    // Level 1: Reptilian (Cache & Rules)
    const reptilianResult = await this.reptilian.process(task);
    if (reptilianResult) {
      return reptilianResult;
    }

    this.logger.log(
      `Task ${task.taskId} escalated from Reptilian to Limbic`,
      'KyraService',
    );

    // Level 2: Limbic (LLM Classification)
    const limbicResult = await this.limbic.process(task);
    if (limbicResult) {
      return limbicResult;
    }

    this.logger.log(
      `Task ${task.taskId} escalated from Limbic to Neocortex`,
      'KyraService',
    );

    // Level 3: Neocortex (Deep Causal Inference - always resolves)
    return this.neocortex.process(task);
  }

  /**
   * Get the processing history for a tenant's cognitive tasks.
   */
  async getTaskHistory(
    tenant: TenantContext,
    limit: number = 20,
  ): Promise<{ tasks: Record<string, unknown>[] }> {
    const tasks = await this.prisma.executeInTenantContext(
      tenant.tenantId,
      async (tx) => {
        return tx.cognitiveTask.findMany({
          where: { tenantId: tenant.tenantId },
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            id: true,
            taskType: true,
            status: true,
            brainLevel: true,
            processingTimeMs: true,
            createdAt: true,
            completedAt: true,
          },
        });
      },
    );

    return { tasks };
  }
}
