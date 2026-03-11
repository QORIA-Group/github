import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

interface StructuredLogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  tenant_id?: string;
  correlation_id?: string;
  data?: Record<string, unknown>;
}

@Injectable({ scope: Scope.TRANSIENT })
export class StructuredLogger extends ConsoleLogger {
  private tenantId?: string;
  private correlationId?: string;

  setTenantContext(tenantId: string, correlationId: string): void {
    this.tenantId = tenantId;
    this.correlationId = correlationId;
  }

  log(message: string, context?: string): void {
    this.writeStructuredLog('INFO', message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    const entry = this.buildEntry('ERROR', message, context);
    if (trace) {
      entry.data = { ...entry.data, trace };
    }
    process.stderr.write(JSON.stringify(entry) + '\n');
  }

  warn(message: string, context?: string): void {
    this.writeStructuredLog('WARN', message, context);
  }

  debug(message: string, context?: string): void {
    this.writeStructuredLog('DEBUG', message, context);
  }

  logCognitiveDecision(
    context: string,
    message: string,
    data: Record<string, unknown>,
  ): void {
    const entry = this.buildEntry('INFO', message, context);
    entry.data = { ...entry.data, cognitive_decision: true, ...data };
    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  logCausalEvidence(
    context: string,
    taskId: string,
    evidence: Record<string, unknown>,
  ): void {
    const entry = this.buildEntry('INFO', `Causal evidence for task ${taskId}`, context);
    entry.data = {
      ...entry.data,
      causal_evidence: true,
      task_id: taskId,
      evidence,
    };
    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  private writeStructuredLog(level: string, message: string, context?: string): void {
    const entry = this.buildEntry(level, message, context);
    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  private buildEntry(level: string, message: string, context?: string): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: context ?? this.context ?? 'Application',
      message,
    };

    if (this.tenantId) {
      entry.tenant_id = this.tenantId;
    }
    if (this.correlationId) {
      entry.correlation_id = this.correlationId;
    }

    return entry;
  }
}
