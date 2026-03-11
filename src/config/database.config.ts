import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  postgresUrl: process.env.DATABASE_URL ?? '',
  neo4jUri: process.env.NEO4J_URI ?? 'bolt://localhost:7687',
  neo4jUser: process.env.NEO4J_USER ?? 'neo4j',
  neo4jPassword: process.env.NEO4J_PASSWORD ?? '',
}));
