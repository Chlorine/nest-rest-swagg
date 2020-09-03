import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Упрощённый пользователь системы
 */
@Entity({ name: 'UserInfo' })
export class User {
  @ApiProperty({ example: 1001, description: 'Идентификатор объекта' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'admin',
    description: 'Имя пользователя',
  })
  @Column({
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({ nullable: false })
  password!: string;
}
