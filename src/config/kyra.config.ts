import { registerAs } from '@nestjs/config';

export const kyraConfig = registerAs('kyra', () => ({
  cacheTtl: parseInt(process.env.KYRA_CACHE_TTL ?? '300', 10),
  llmEndpoint: process.env.KYRA_LLM_ENDPOINT ?? '',
  llmApiKey: process.env.KYRA_LLM_API_KEY ?? '',
  pulseflowChannel: process.env.PULSEFLOW_CHANNEL ?? 'pulseflow_events',
  outboxPollInterval: parseInt(process.env.PULSEFLOW_OUTBOX_POLL_INTERVAL ?? '1000', 10),
}));
