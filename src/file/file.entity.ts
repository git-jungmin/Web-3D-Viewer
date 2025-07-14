// src/file/file.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  s3Key: string;

  @Column()
  s3Url: string;

  @Column({ nullable: true })
  fileType?: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
