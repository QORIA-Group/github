import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StructuredLogger } from '../../../common/utils/structured-logger';
import { CognitiveResult, CognitiveTask } from '../../../common/interfaces/cognitive-task.interface';
import { TriBrainLevel } from '../../../common/enums/tri-brain-level.enum';

/**
 * Limbic Brain (Level 2): Lightweight LLM Classification
 *
 * Handles classification and pattern recognition tasks using
 * a lightweight LLM (e.g., Mistral). Used when exact rules
 * cannot resolve the task but deep causal inference is not needed.
 */
@Injectable()
export class LimbicService {
  private readonly llmEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: StructuredLogger,
  ) {
    this.llmEndpoint = this.configService.get<string>('kyra.llmEndpoint', '');
  }

  /**
   * Attempt to resolve a cognitive task using lightweight LLM classification.
   * Returns null if this level cannot handle the task (requires deep inference).
   */
  async process(task: CognitiveTask): Promise<CognitiveResult | null> {
    const startTime = Date.now();

    // Determine if this task is classifiable by a lightweight LLM
    if (!this.isClassifiable(task)) {
      return null;
    }

    try {
      const classification = await this.classify(task);

      const result: CognitiveResult = {
        taskId: task.taskId,
        level: TriBrainLevel.LIMBIC,
        result: classification,
        causalEvidence: [],
        processingTimeMs: Date.now() - startTime,
        cached: false,
      };

      this.logger.logCognitiveDecision(
        'LimbicService',
        `LLM classification completed for task ${task.taskId}`,
        {
          task_id: task.taskId,
          task_type: task.type,
          brain_level: TriBrainLevel.LIMBIC,
          processing_time_ms: result.processingTimeMs,
        },
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Limbic processing failed for task ${task.taskId}: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : undefined,
        'LimbicService',
      );

      // Escalate to Neocortex on failure
      return null;
    }
  }

  /**
   * Check if the task type is suitable for lightweight classification.
   */
  private isClassifiable(task: CognitiveTask): boolean {
    const classifiableTypes = [
      'sentiment_analysis',
      'category_classification',
      'priority_scoring',
      'text_summarization',
    ];
    return classifiableTypes.includes(task.type);
  }

  /**
   * Perform lightweight LLM classification.
   * In production, this calls the sovereign LLM endpoint (Mistral/Aleph Alpha).
   */
  private async classify(
    task: CognitiveTask,
  ): Promise<Record<string, unknown>> {
    // LLM integration placeholder
    // In production: HTTP call to KYRA_LLM_ENDPOINT with structured prompt
    this.logger.log(
      `Classifying task ${task.taskId} of type ${task.type} via LLM`,
      'LimbicService',
    );

    return {
      classification: 'pending_llm_integration',
      task_type: task.type,
      confidence: 0,
      note: 'LLM endpoint integration pending - connect to sovereign LLM (Mistral)',
    };
  }
}
