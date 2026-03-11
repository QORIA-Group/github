import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Global()
@Module({
  providers: [PrismaService, Neo4jService],
  exports: [PrismaService, Neo4jService],
})
export class DatabaseModule {}
