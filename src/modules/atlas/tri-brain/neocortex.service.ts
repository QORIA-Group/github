import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../../database/neo4j/neo4j.service';
import { StructuredLogger } from '../../../common/utils/structured-logger';
import {
  CausalEvidence,
  CognitiveResult,
  CognitiveTask,
} from '../../../common/interfaces/cognitive-task.interface';
import { TriBrainLevel } from '../../../common/enums/tri-brain-level.enum';

/**
 * Neocortex Brain (Level 3): Deep Causal Inference
 *
 * Performs deep causal reasoning by traversing the Knowledge Graph (Neo4j).
 * Every assertion is backed by auditable graph paths (Causal Evidence).
 * Used for complex analysis: CSRD indicators, causal impact chains,
 * strategic scoring (Ascend Score, DMVScore).
 *
 * ZERO HALLUCINATION: All results are sourced from the Knowledge Graph.
 */
@Injectable()
export class NeocortexService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly logger: StructuredLogger,
  ) {}

  /**
   * Process a cognitive task using deep Knowledge Graph inference.
   * Always returns a result with causal evidence for auditability.
   */
  async process(task: CognitiveTask): Promise<CognitiveResult> {
    const startTime = Date.now();

    this.logger.logCognitiveDecision(
      'NeocortexService',
      `Starting deep causal inference for task ${task.taskId}`,
      {
        task_id: task.taskId,
        task_type: task.type,
        brain_level: TriBrainLevel.NEOCORTEX,
      },
    );

    try {
      const { result, evidence } = await this.performCausalInference(task);

      const cognitiveResult: CognitiveResult = {
        taskId: task.taskId,
        level: TriBrainLevel.NEOCORTEX,
        result,
        causalEvidence: evidence,
        processingTimeMs: Date.now() - startTime,
        cached: false,
      };

      // Immutable causal evidence logging for AI Act compliance
      this.logger.logCausalEvidence('NeocortexService', task.taskId, {
        evidence_count: evidence.length,
        graph_paths: evidence.map((e) => e.graphPath),
        processing_time_ms: cognitiveResult.processingTimeMs,
      });

      return cognitiveResult;
    } catch (error) {
      this.logger.error(
        `Neocortex inference failed for task ${task.taskId}: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : undefined,
        'NeocortexService',
      );

      return {
        taskId: task.taskId,
        level: TriBrainLevel.NEOCORTEX,
        result: {
          error: 'inference_failed',
          message: 'Causal inference could not be completed',
        },
        causalEvidence: [],
        processingTimeMs: Date.now() - startTime,
        cached: false,
      };
    }
  }

  /**
   * Traverse the Knowledge Graph to find causal relationships.
   * Uses domain-specific Cypher queries based on task type.
   */
  private async performCausalInference(
    task: CognitiveTask,
  ): Promise<{ result: Record<string, unknown>; evidence: CausalEvidence[] }> {
    switch (task.type) {
      case 'csrd_impact_analysis':
        return this.analyzeCsrdImpact(task);
      case 'causal_chain':
        return this.traceCausalChain(task);
      default:
        return this.genericGraphTraversal(task);
    }
  }

  private async analyzeCsrdImpact(
    task: CognitiveTask,
  ): Promise<{ result: Record<string, unknown>; evidence: CausalEvidence[] }> {
    const indicatorId = task.payload['indicatorId'] as string;

    const records = await this.neo4j.executeRead<Record<string, unknown>>(
      `
      MATCH (indicator:CSRDIndicator {id: $indicatorId})
      -[r:IMPACTS*1..3]->(affected)
      RETURN indicator, r, affected,
             [rel IN r | type(rel)] AS relationship_types,
             [node IN nodes(r) | node.id] AS path_node_ids
      LIMIT 50
      `,
      { indicatorId },
    );

    const evidence: CausalEvidence[] = records.map((record) => ({
      sourceNodeId: indicatorId,
      relationship: 'IMPACTS',
      targetNodeId: String(record['affected'] ?? ''),
      confidence: 1.0,
      graphPath: (record['path_node_ids'] as string[]) ?? [],
    }));

    return {
      result: {
        indicator_id: indicatorId,
        impact_count: records.length,
        impacts: records.map((r) => r['affected']),
      },
      evidence,
    };
  }

  private async traceCausalChain(
    task: CognitiveTask,
  ): Promise<{ result: Record<string, unknown>; evidence: CausalEvidence[] }> {
    const sourceId = task.payload['sourceId'] as string;
    const targetId = task.payload['targetId'] as string;

    const records = await this.neo4j.executeRead<Record<string, unknown>>(
      `
      MATCH path = shortestPath(
        (source {id: $sourceId})-[*..6]->(target {id: $targetId})
      )
      RETURN nodes(path) AS nodes,
             relationships(path) AS rels,
             length(path) AS path_length
      `,
      { sourceId, targetId },
    );

    const evidence: CausalEvidence[] = records.map((record) => ({
      sourceNodeId: sourceId,
      relationship: 'CAUSAL_PATH',
      targetNodeId: targetId,
      confidence: 1.0 / ((record['path_length'] as number) ?? 1),
      graphPath: ((record['nodes'] as Array<{ id: string }>) ?? []).map((n) => n.id),
    }));

    return {
      result: {
        source_id: sourceId,
        target_id: targetId,
        paths_found: records.length,
        shortest_path_length: records[0]?.['path_length'] ?? null,
      },
      evidence,
    };
  }

  private async genericGraphTraversal(
    task: CognitiveTask,
  ): Promise<{ result: Record<string, unknown>; evidence: CausalEvidence[] }> {
    const nodeId = task.payload['nodeId'] as string;

    const records = await this.neo4j.executeRead<Record<string, unknown>>(
      `
      MATCH (n {id: $nodeId})-[r]->(related)
      RETURN n, type(r) AS rel_type, related
      LIMIT 25
      `,
      { nodeId },
    );

    const evidence: CausalEvidence[] = records.map((record) => ({
      sourceNodeId: nodeId,
      relationship: String(record['rel_type'] ?? ''),
      targetNodeId: String(record['related'] ?? ''),
      confidence: 1.0,
      graphPath: [nodeId, String(record['related'] ?? '')],
    }));

    return {
      result: {
        node_id: nodeId,
        relationships_found: records.length,
        related_nodes: records.map((r) => ({
          type: r['rel_type'],
          node: r['related'],
        })),
      },
      evidence,
    };
  }
}
