import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Валюта
 */
@Entity({ name: 'CurrencyInfo' })
export class Currency {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'RUB',
    description: 'Трехбуквенный код валюты (ISO 4217)',
  })
  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 3,
  })
  code!: string;

  @ApiProperty({
    example: 643,
    description: 'Трехзначный код валюты (ISO 4217)',
  })
  @Column({ nullable: false, unique: true })
  digitCode!: number;

  @ApiProperty({ example: 'Russian ruble', description: 'Наименование валюты' })
  @Column({ nullable: false })
  name!: string;
}
