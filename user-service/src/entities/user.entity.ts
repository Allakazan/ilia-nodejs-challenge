import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User first name',
    type: String,
    maxLength: 100,
  })
  @Column({ length: 100 })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
    maxLength: 100,
  })
  @Column({ length: 100 })
  last_name: string;

  @ApiProperty({
    description: 'User email address (unique)',
    type: String,
    maxLength: 200,
    uniqueItems: true,
  })
  @Column({ length: 200, unique: true })
  email: string;

  // Password should not be exposed in API responses ;)
  @Column({ length: 300, select: false })
  password: string;

  @ApiProperty({
    description: 'User account status',
    type: Boolean,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    type: Date,
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    type: Date,
  })
  @UpdateDateColumn()
  updated_at: Date;
}
