import { registerAs } from '@nestjs/config';

export const atlasConfig = registerAs('atlas', () => ({
  cacheTtl: parseInt(process.env.ATLAS_CACHE_TTL ?? '300', 10),
  llmEndpoint: process.env.ATLAS_LLM_ENDPOINT ?? '',
  llmApiKey: process.env.ATLAS_LLM_API_KEY ?? '',
  pulseflowChannel: process.env.PULSEFLOW_CHANNEL ?? 'pulseflow_events',
  outboxPollInterval: parseInt(process.env.PULSEFLOW_OUTBOX_POLL_INTERVAL ?? '1000', 10),
}));
