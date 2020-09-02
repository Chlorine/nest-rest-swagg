import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractsService } from './contracts.service';

import { Currency } from './db/currency';
import { Contract } from './db/contract';
import { ContractStage } from './db/contract-stage';
import { ContractType } from './db/contract-type';
import { CompletionDocument } from './db/document';
import { CompletionDocumentType } from './db/document-type';
import { Invoice } from './db/invoice';
import { LegalEntity } from './db/legal-entity';

import { CurrenciesController } from './controllers/currencies.controller';
import { ContractTypesController } from './controllers/contract-types.controller';
import { CompDocTypesController } from './controllers/comp-doc-types.controller';
import { LegalEntitiesController } from './controllers/legal-entities.controller';
import { ContractsController } from './controllers/contracts.controller';
import { ContractStagesController } from './controllers/contract-stages.controller';
import { CompDocController } from './controllers/comp-doc.controller';
import { InvoicesController } from './controllers/invoices.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Currency,
      Contract,
      ContractType,
      ContractStage,
      CompletionDocumentType,
      CompletionDocument,
      Invoice,
      LegalEntity,
    ]),
  ],
  providers: [ContractsService],
  controllers: [
    CurrenciesController,
    ContractTypesController,
    CompDocTypesController,
    LegalEntitiesController,
    ContractsController,
    ContractStagesController,
    CompDocController,
    InvoicesController,
  ],
})
export class ContractsModule {}
