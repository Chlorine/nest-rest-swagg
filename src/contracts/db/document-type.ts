import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Тип документа выполнения
 */
@Entity({ name: 'CompletionDocumentType' })
export class CompletionDocumentType {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Наименование типа',
    example: 'Тип А',
  })
  @Column({
    nullable: false,
    unique: true,
  })
  name!: string;
}
