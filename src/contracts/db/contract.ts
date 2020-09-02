import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ContractType } from './contract-type';
import { LegalEntity } from './legal-entity';
import { Currency } from './currency';
import { ContractStage } from './contract-stage';

/**
 * Договор
 */
@Entity({ name: 'Contract' })
export class Contract {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Номер договора
   */
  @ApiProperty({ example: 'Д-001', description: 'Номер договора' })
  @Column({
    nullable: false,
    unique: true,
  })
  refNumber!: string;

  /**
   * Дата подписания
   */
  @ApiProperty({
    type: String,
    example: '2017-06-07T14:34:08.700Z',
    description: 'Дата договора в виде строки в формате ISO-8601',
  })
  @Column({ nullable: false })
  timestamp!: Date;

  /**
   * Тип договора
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => ContractType,
    { nullable: false },
  )
  type!: ContractType;

  @ApiProperty({ example: 1001, description: 'ID типа договора' })
  @Column({ nullable: false })
  typeId!: number;

  /**
   * Поставщик
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => LegalEntity,
    { nullable: false },
  )
  supplier!: LegalEntity;

  @ApiProperty({ description: 'ID юрлица, явл. поставщиком', example: 1001 })
  @Column({ nullable: false })
  supplierId!: number;

  /**
   * Плательщик
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => LegalEntity,
    { nullable: false },
  )
  payer!: LegalEntity;

  @ApiProperty({ description: 'ID юрлица, явл. плательщиком', example: 1001 })
  @Column({ nullable: false })
  payerId!: number;

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
   * Этапы
   */
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => ContractStage,
    stage => stage.contract,
  )
  stages!: ContractStage[];
}
