import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { ContractStage } from './contract-stage';
import { CompletionDocument } from './document';

/**
 * Фактура
 */
@Entity({ name: 'Invoice' })
export class Invoice {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Документ выполнения
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => CompletionDocument,
    doc => doc.invoices,
    { nullable: false },
  )
  completionDocument!: CompletionDocument;

  @ApiProperty({ example: 1001, description: 'ID документа выполнения' })
  @Column({ nullable: false })
  completionDocumentId!: number;

  /**
   * Этап договора
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => ContractStage,
    cs => cs.invoices,
    { nullable: false },
  )
  contractStage!: ContractStage;

  @ApiProperty({ example: 1001, description: 'ID этапа договора' })
  @Column({ nullable: false })
  contractStageId!: number;

  /**
   * Позиция
   */
  @ApiProperty({ example: 'некоторая_позиция', description: 'Позиция' })
  @Column({
    nullable: false,
  })
  position!: string;

  /**
   * Дата выполнения
   */
  @ApiProperty({
    example: '2017-06-07T14:34:08.700Z',
    description: 'Дата выполнения в виде строки (iso8601)',
  })
  @Column({ nullable: false })
  timestamp!: Date;

  /**
   * Сумма
   */
  @ApiProperty({
    example: 99.98,
    description: 'Сумма',
  })
  @Column({ nullable: false, type: 'money' })
  sum!: number;

  /**
   * Количество
   */
  @ApiProperty({
    example: 4,
    description: 'Количество',
  })
  @Column({ nullable: false })
  quantity!: number;
}
