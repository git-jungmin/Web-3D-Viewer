// src/file/file.module.ts
import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FileEntity } from './file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

@Module({
  // imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, S3Service],
})
export class FileModule {}
