import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { CompletionDocumentType } from './document-type';
import { Currency } from './currency';
import { Invoice } from './invoice';

/**
 * Документ выполнения
 */
@Entity({ name: 'CompletionDocument' })
export class CompletionDocument {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Номер документа
   */
  @ApiProperty({ example: 'ДВ-001', description: 'Номер документа' })
  @Column({
    nullable: false,
    unique: true,
  })
  refNumber!: string;

  /**
   * Дата (подписания?) документа
   */
  @ApiProperty({
    type: String,
    example: '2017-06-07T14:34:08.700Z',
    description: 'Дата документа в виде строки в формате ISO-8601',
  })
  @Column({ nullable: false })
  timestamp!: Date;

  /**
   * Тип документа
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => CompletionDocumentType,
    { nullable: false },
  )
  type!: CompletionDocumentType;

  @ApiProperty({ example: 1001, description: 'ID типа документа' })
  @Column({ nullable: false })
  typeId!: number;

  /**
   * Валюта
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Currency,
    { nullable: false },
  )
  currency!: Currency;

  @ApiProperty({ description: 'ID валюты', example: 1001 })
  @Column({ nullable: false })
  currencyId!: number;

  /**
   * Фактуры
   */
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Invoice,
    invoice => invoice.completionDocument,
  )
  invoices!: Invoice[];
}
