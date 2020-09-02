import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Utils } from '../utils';

import { CreateCurrencyDto } from './controllers/dto/currency.create.dto';
import { UpdateCurrencyDto } from './controllers/dto/currency.update.dto';
import { CreateLegalEntityDto } from './controllers/dto/legal-entity.create.dto';
import { UpdateLegalEntityDto } from './controllers/dto/legal-entity.update.dto';
import { CreateContractDto } from './controllers/dto/contract.create.dto';
import { UpdateContractDto } from './controllers/dto/contract.update.dto';
import { CreateContractStageDto } from './controllers/dto/contract-stage.create.dto';
import { UpdateContractStageDto } from './controllers/dto/contract-stage.update.dto';
import { CreateCompDocDto } from './controllers/dto/comp-doc.create.dto';
import { UpdateCompDocDto } from './controllers/dto/comp-doc.update.dto';
import { CreateInvoiceDto } from './controllers/dto/invoice.create.dto';
import { UpdateInvoiceDto } from './controllers/dto/invoice.update.dto';

import { Currency } from './db/currency';
import { LegalEntity } from './db/legal-entity';
import { ContractType } from './db/contract-type';
import { CompletionDocumentType } from './db/document-type';
import { Contract } from './db/contract';
import { ContractStage } from './db/contract-stage';
import { CompletionDocument } from './db/document';
import { Invoice } from './db/invoice';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepo: Repository<ContractType>,
    @InjectRepository(CompletionDocumentType)
    private readonly compDocTypeRepo: Repository<CompletionDocumentType>,
    @InjectRepository(CompletionDocument)
    private readonly compDocRepo: Repository<CompletionDocument>,
    @InjectRepository(LegalEntity)
    private readonly legalEntityRepo: Repository<LegalEntity>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(ContractStage)
    private readonly contractStageRepo: Repository<ContractStage>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async getCurrencies(): Promise<Currency[]> {
    return this.currencyRepo.find();
  }

  async getCurrency(id: number) {
    return this.currencyRepo.findOne({ id });
  }

  async createCurrency(params: CreateCurrencyDto) {
    const { code, digitCode, name } = params;

    const items = await this.currencyRepo.find({
      where: [{ code: code.toUpperCase() }, { digitCode: digitCode }],
    });

    // так-то сработает констрейнт в базе, но наверное лучше показать более внятное сообщение

    if (items.length > 0) {
      throw new Error(
        `Указанный буквенный (или цифровой) код уже используется в других валютах`,
      );
    }

    const currency = new Currency();

    currency.code = code;
    currency.digitCode = digitCode;
    currency.name = name;

    return this.currencyRepo.save(currency);
  }

  async updateCurrency(id: number, params: UpdateCurrencyDto) {
    const { code, digitCode, name } = params;

    const currency = await this.currencyRepo.findOne({ id });
    if (!currency) {
      throw new Error(`Объект не найден`);
    }

    Utils.setEntityProperty(currency, 'code', code);
    Utils.setEntityProperty(currency, 'digitCode', digitCode);
    Utils.setEntityProperty(currency, 'name', name);

    return this.currencyRepo.save(currency);
  }

  async removeCurrency(id: number): Promise<void> {
    await this.currencyRepo.delete(id);
  }

  //////////////////////////

  async getContractTypes() {
    return this.contractTypeRepo.find();
  }

  async getContractType(id: number) {
    return this.contractTypeRepo.findOne({ id });
  }

  ////////////////////////////

  async getCompletionDocumentTypes() {
    return this.compDocTypeRepo.find();
  }

  async getCompletionDocumentType(id: number) {
    return this.compDocTypeRepo.findOne({ id });
  }

  /////////////////////////////

  async getLegalEntities(): Promise<LegalEntity[]> {
    return this.legalEntityRepo.find();
  }

  async getLegalEntity(id: number) {
    return this.legalEntityRepo.findOne({ id });
  }

  async createLegalEntity(params: CreateLegalEntityDto) {
    const { inn, name } = params;

    const le = new LegalEntity();

    le.inn = inn;
    le.name = name;

    return this.legalEntityRepo.save(le);
  }

  async updateLegalEntity(id: number, params: UpdateLegalEntityDto) {
    const { inn, name } = params;

    const le = await this.legalEntityRepo.findOne({ id });
    if (!le) {
      throw new Error(`Объект не найден`);
    }

    Utils.setEntityProperty(le, 'inn', inn);
    Utils.setEntityProperty(le, 'name', name);

    return this.legalEntityRepo.save(le);
  }

  async removeLegalEntity(id: number): Promise<void> {
    await this.legalEntityRepo.delete(id);
  }

  //////////////

  async getContracts() {
    return this.contractRepo.find();
  }

  async getContract(id: number) {
    return this.contractRepo.findOne({ id });
  }

  async createContract(params: CreateContractDto) {
    const {
      refNumber,
      typeId,
      timestamp,
      payerId,
      supplierId,
      currencyId,
    } = params;

    // без проверок всё крякнет по констрейнтам но я люблю понятные error messages

    const type = await this.contractTypeRepo.findOne({ id: typeId });
    if (!type) throw new Error(`Неизвестный тип договора #${typeId}`);

    const supplier = await this.legalEntityRepo.findOne({ id: supplierId });
    if (!supplier)
      throw new Error(`Юрлицо поставщика #${supplierId} не найдено`);

    const payer = await this.legalEntityRepo.findOne({ id: payerId });
    if (!payer) throw new Error(`Юрлицо плательщика #${payerId} не найдено`);

    const currency = await this.currencyRepo.findOne({ id: currencyId });
    if (!currency) throw new Error(`Валюта #${currencyId} не найдена`);

    const c = new Contract();

    c.refNumber = refNumber;
    c.type = type;
    c.timestamp = new Date(timestamp);
    c.payer = payer;
    c.supplier = supplier;
    c.currency = currency;

    return this.contractRepo.save(c);
  }

  async updateContract(id: number, params: UpdateContractDto) {
    const {
      refNumber,
      timestamp,
      currencyId,
      payerId,
      supplierId,
      typeId,
    } = params;

    const c = await this.contractRepo.findOne({ id });
    if (!c) {
      throw new Error(`Объект не найден`);
    }

    Utils.setEntityProperty(c, 'refNumber', refNumber);

    if (timestamp !== undefined) {
      c.timestamp = new Date(timestamp);
    }

    if (typeId !== undefined) {
      const type = await this.contractTypeRepo.findOne({ id: typeId });
      if (!type) throw new Error(`Неизвестный тип договора #${typeId}`);

      c.type = type;
    }

    if (supplierId !== undefined) {
      const supplier = await this.legalEntityRepo.findOne({ id: supplierId });
      if (!supplier)
        throw new Error(`Юрлицо поставщика #${supplierId} не найдено`);

      c.supplier = supplier;
    }

    if (payerId !== undefined) {
      const payer = await this.legalEntityRepo.findOne({ id: payerId });
      if (!payer) throw new Error(`Юрлицо плательщика #${payerId} не найдено`);

      c.payer = payer;
    }

    if (currencyId !== undefined) {
      const currency = await this.currencyRepo.findOne({ id: currencyId });
      if (!currency) throw new Error(`Валюта #${currencyId} не найдена`);

      c.currency = currency;
    }

    return this.contractRepo.save(c);
  }

  async removeContract(id: number): Promise<void> {
    // TODO: посмотреть на зависимости, правильно ругнуться, если есть хвосты
    await this.contractRepo.delete(id);
  }

  ////////

  async getContractStages(contractId: number): Promise<ContractStage[]> {
    return this.contractStageRepo.find({ contractId });
  }

  async getContractStage(stageId: number) {
    return this.contractStageRepo.findOne({ id: stageId });
  }

  async getContractStageInvoices(stageId: number) {
    return this.invoiceRepo.find({ contractStageId: stageId });
  }

  async createContractStage(
    contractId: number,
    params: CreateContractStageDto,
  ): Promise<ContractStage> {
    const contract = await this.contractRepo.findOne({ id: contractId });
    if (!contract) throw new Error(`Cannot find contract #${contractId}`);

    const { refNumber, startTime, endTime, unit, sum, quantity } = params;

    const contractStage = new ContractStage();

    contractStage.contract = contract;
    contractStage.refNumber = refNumber;

    contractStage.startTime = new Date(startTime);
    contractStage.endTime = new Date(endTime);

    if (contractStage.startTime.getTime() > contractStage.endTime.getTime()) {
      throw new Error(`Время начала не должно быть позже времени окончания`);
    }

    contractStage.unit = unit;
    contractStage.quantity = quantity;
    contractStage.sum = sum;

    return this.contractStageRepo.save(contractStage);
  }

  async updateContractStage(stageId: number, params: UpdateContractStageDto) {
    const contractStage = await this.contractStageRepo.findOne({ id: stageId });

    if (!contractStage) {
      throw new Error(`Объект не найден`);
    }

    const { startTime, endTime, quantity, refNumber, sum, unit } = params;

    Utils.setEntityProperty(contractStage, 'refNumber', refNumber);
    Utils.setEntityProperty(contractStage, 'sum', sum);
    Utils.setEntityProperty(contractStage, 'unit', unit);
    Utils.setEntityProperty(contractStage, 'quantity', quantity);

    if (startTime !== undefined) {
      contractStage.startTime = new Date(startTime);
    }

    if (endTime !== undefined) {
      contractStage.endTime = new Date(endTime);
    }

    if (startTime !== undefined || endTime !== undefined) {
      if (contractStage.startTime.getTime() > contractStage.endTime.getTime()) {
        throw new Error(`Время начала не должно быть позже времени окончания`);
      }
    }

    return this.contractStageRepo.save(contractStage);
  }

  async removeContractStage(id: number): Promise<void> {
    // TODO: посмотреть на зависимости, правильно ругнуться, если есть хвосты
    await this.contractStageRepo.delete(id);
  }

  ////////

  async getCompletionDocuments() {
    return this.compDocRepo.find();
  }

  async getCompletionDocument(id: number) {
    return this.compDocRepo.findOne({ id });
  }

  async createCompletionDocument(
    params: CreateCompDocDto,
  ): Promise<CompletionDocument> {
    const { refNumber, typeId, timestamp, currencyId } = params;

    const type = await this.compDocTypeRepo.findOne({ id: typeId });
    if (!type) throw new Error(`Неизвестный тип документа #${typeId}`);

    const currency = await this.currencyRepo.findOne({ id: currencyId });
    if (!currency) throw new Error(`Валюта #${currencyId} не найдена`);

    const cd = new CompletionDocument();

    cd.refNumber = refNumber;
    cd.type = type;
    cd.timestamp = new Date(timestamp);
    cd.currency = currency;

    return this.compDocRepo.save(cd);
  }

  async updateCompletionDocument(id: number, params: UpdateCompDocDto) {
    const { refNumber, timestamp, currencyId, typeId } = params;

    const cd = await this.compDocRepo.findOne({ id });

    if (!cd) {
      throw new Error(`Объект не найден`);
    }

    Utils.setEntityProperty(cd, 'refNumber', refNumber);

    if (timestamp !== undefined) {
      cd.timestamp = new Date(timestamp);
    }

    if (typeId !== undefined) {
      const type = await this.compDocTypeRepo.findOne({ id: typeId });
      if (!type) throw new Error(`Неизвестный тип договора #${typeId}`);

      cd.type = type;
    }

    if (currencyId !== undefined) {
      const currency = await this.currencyRepo.findOne({ id: currencyId });
      if (!currency) throw new Error(`Валюта #${currencyId} не найдена`);

      cd.currency = currency;
    }

    return this.compDocRepo.save(cd);
  }

  async removeCompletionDocument(id: number): Promise<void> {
    // TODO: посмотреть на зависимости, правильно ругнуться, если есть хвосты
    await this.compDocRepo.delete(id);
  }

  ////////////////

  async getInvoices(compDocId: number): Promise<Invoice[]> {
    return this.invoiceRepo.find({ completionDocumentId: compDocId });
  }

  async getInvoice(id: number) {
    return this.invoiceRepo.findOne({ id });
  }

  async createInvoice(
    compDocId: number,
    params: CreateInvoiceDto,
  ): Promise<Invoice> {
    const compDoc = await this.compDocRepo.findOne({ id: compDocId });
    if (!compDoc)
      throw new Error(`Cannot find completion document #${compDocId}`);

    const { timestamp, position, sum, quantity, contractStageId } = params;

    const contractStage = await this.contractStageRepo.findOne({
      id: contractStageId,
    });
    if (!contractStage)
      throw new Error(`Cannot find contract stage #${contractStageId}`);

    const invoice = new Invoice();

    invoice.completionDocument = compDoc;
    invoice.contractStage = contractStage;

    invoice.timestamp = new Date(timestamp);
    invoice.sum = sum;
    invoice.quantity = quantity;
    invoice.position = position;

    return this.invoiceRepo.save(invoice);
  }

  async updateInvoice(invoiceId: number, params: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOne({ id: invoiceId });

    if (!invoice) {
      throw new Error(`Объект не найден`);
    }

    const { timestamp, quantity, sum, position, contractStageId } = params;

    Utils.setEntityProperty(invoice, 'sum', sum);
    Utils.setEntityProperty(invoice, 'position', position);
    Utils.setEntityProperty(invoice, 'quantity', quantity);

    if (timestamp !== undefined) {
      invoice.timestamp = new Date(timestamp);
    }

    if (contractStageId !== undefined) {
      const contractStage = await this.contractStageRepo.findOne({
        id: contractStageId,
      });
      if (!contractStage)
        throw new Error(`Cannot find contract stage #${contractStageId}`);

      invoice.contractStage = contractStage;
    }

    return this.invoiceRepo.save(invoice);
  }

  async removeInvoice(id: number): Promise<void> {
    // TODO: посмотреть на зависимости, правильно ругнуться, если есть хвосты
    await this.invoiceRepo.delete(id);
  }
}
