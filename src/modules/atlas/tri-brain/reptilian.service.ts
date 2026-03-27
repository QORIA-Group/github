import { Injectable } from '@nestjs/common';
import { StructuredLogger } from '../../../common/utils/structured-logger';
import { CognitiveResult, CognitiveTask } from '../../../common/interfaces/cognitive-task.interface';
import { TriBrainLevel } from '../../../common/enums/tri-brain-level.enum';

/**
 * Reptilian Brain (Level 1): Cache & Exact Rules
 *
 * Provides the fastest response path for deterministic, rule-based decisions.
 * Uses in-memory cache and predefined business rules.
 * Zero LLM cost, maximum speed.
 */
@Injectable()
export class ReptilianService {
  private readonly cache = new Map<string, { result: CognitiveResult; expiresAt: number }>();

  constructor(private readonly logger: StructuredLogger) {}

  /**
   * Attempt to resolve a cognitive task using cached results or exact rules.
   * Returns null if this level cannot handle the task.
   */
  async process(task: CognitiveTask): Promise<CognitiveResult | null> {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.buildCacheKey(task);
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      this.logger.logCognitiveDecision(
        'ReptilianService',
        `Cache hit for task ${task.taskId}`,
        {
          task_id: task.taskId,
          task_type: task.type,
          brain_level: TriBrainLevel.REPTILIAN,
          cache_hit: true,
        },
      );

      return {
        ...cached.result,
        processingTimeMs: Date.now() - startTime,
        cached: true,
      };
    }

    // Apply exact rules
    const ruleResult = await this.applyExactRules(task);
    if (ruleResult) {
      const result: CognitiveResult = {
        taskId: task.taskId,
        level: TriBrainLevel.REPTILIAN,
        result: ruleResult,
        causalEvidence: [],
        processingTimeMs: Date.now() - startTime,
        cached: false,
      };

      // Cache the result (TTL: 5 minutes)
      this.cache.set(cacheKey, {
        result,
        expiresAt: Date.now() + 300_000,
      });

      this.logger.logCognitiveDecision(
        'ReptilianService',
        `Rule-based resolution for task ${task.taskId}`,
        {
          task_id: task.taskId,
          task_type: task.type,
          brain_level: TriBrainLevel.REPTILIAN,
          cache_hit: false,
        },
      );

      return result;
    }

    // Cannot handle - escalate to Limbic
    return null;
  }

  /**
   * Apply deterministic business rules.
   * Returns null if no exact rule matches.
   */
  private async applyExactRules(
    task: CognitiveTask,
  ): Promise<Record<string, unknown> | null> {
    // Rule engine placeholder - extend with domain-specific rules
    switch (task.type) {
      case 'threshold_check':
        return this.evaluateThresholdRule(task.payload);
      default:
        return null;
    }
  }

  private evaluateThresholdRule(
    payload: Record<string, unknown>,
  ): Record<string, unknown> | null {
    const value = payload['value'] as number | undefined;
    const threshold = payload['threshold'] as number | undefined;

    if (value === undefined || threshold === undefined) {
      return null;
    }

    return {
      exceeds_threshold: value > threshold,
      value,
      threshold,
      delta: value - threshold,
    };
  }

  private buildCacheKey(task: CognitiveTask): string {
    return `${task.tenantId}:${task.type}:${JSON.stringify(task.payload)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
