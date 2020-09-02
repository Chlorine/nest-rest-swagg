import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Юридическое лицо
 */
@Entity({ name: 'LegalEntity' })
export class LegalEntity {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: '1234567890',
    description: 'ИНН',
  })
  @Column({
    name: 'INN',
    nullable: false,
    unique: true,
  })
  inn!: string;

  @ApiProperty({
    example: 'ООО Взяткодатель',
    description: 'Наименование юридического лица',
  })
  @Column({ nullable: false })
  name!: string;
}
