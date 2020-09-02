import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Тип договора
 */
@Entity({ name: 'ContractType' })
export class ContractType {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Наименование типа',
    example: 'Тип Бэ',
  })
  @Column({
    nullable: false,
    unique: true,
  })
  name!: string;
}
