// src/file/file.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { S3Service } from './s3.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async upload(file: Express.Multer.File): Promise<FileEntity> {
    const s3Result = await this.s3Service.uploadFile(file);

    const saved = this.fileRepo.create({
      originalName: file.originalname,
      s3Key: s3Result.Key,
      s3Url: s3Result.Location,
      fileType: file.mimetype,
    });

    return this.fileRepo.save(saved);
  }

  async deleteFile(s3Key: string): Promise<void> {
    await this.s3Service.deleteFile(s3Key);
    await this.fileRepo.delete({ s3Key });
  }
}
