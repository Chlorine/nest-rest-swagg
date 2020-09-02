import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Currency } from './contracts/db/currency';
import { LegalEntity } from './contracts/db/legal-entity';
import { ContractType } from './contracts/db/contract-type';
import { Contract } from './contracts/db/contract';
import { ContractStage } from './contracts/db/contract-stage';
import { CompletionDocument } from './contracts/db/document';
import { CompletionDocumentType } from './contracts/db/document-type';
import { Invoice } from './contracts/db/invoice';

import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfgSrv: ConfigService) => {
        return {
          type: 'mssql',
          logging: 'all',
          host: cfgSrv.get('SQL_HOST'),
          port: parseInt(cfgSrv.get('SQL_PORT')),
          username: cfgSrv.get('SQL_USERNAME'),
          password: cfgSrv.get('SQL_PASSWORD'),
          database: cfgSrv.get('SQL_DB'),
          entities: [
            Currency,
            LegalEntity,
            ContractType,
            Contract,
            ContractStage,
            CompletionDocument,
            CompletionDocumentType,
            Invoice,
          ],
          synchronize: true,
        };
      },
    }),
    ContractsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
