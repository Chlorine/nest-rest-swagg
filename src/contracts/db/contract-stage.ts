import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Contract } from './contract';
import { Invoice } from './invoice';

/**
 * Этап договора
 */
@Entity({ name: 'ContractStage' })
export class ContractStage {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Договор
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Contract,
    contract => contract.stages,
    { nullable: false },
  )
  contract!: Contract;

  @ApiProperty({ example: 1001, description: 'ID договора' })
  @Column({ nullable: false })
  contractId!: number;

  /**
   * Номер этапа
   */
  @ApiProperty({ example: 'ЭД-0001', description: 'Номер этапа договора' })
  @Column({
    nullable: false,
    unique: true,
  })
  refNumber!: string;

  /**
   * Дата начала
   */
  @ApiProperty({
    example: '2017-06-07T14:34:08.700Z',
    description: 'Дата начала этапа в виде строки (iso8601)',
  })
  @Column({ nullable: false })
  startTime!: Date;

  /**
   * Дата окончания
   */
  @ApiProperty({
    example: '2017-06-07T14:34:08.700Z',
    description: 'Дата окончания этапа в виде строки (iso8601)',
  })
  @Column({ nullable: false })
  endTime!: Date;

  /**
   * Единица измерения (TODO: справочик единиц измерения)
   */
  @ApiProperty({
    example: 'Сажень',
    description: 'Единица измерения',
  })
  @Column({ nullable: false })
  unit!: string;

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

  /**
   * Фактуры
   */
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Invoice,
    invoice => invoice.contractStage,
  )
  invoices!: Invoice[];
}
