// src/file/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private bucket: string;
    private region: string;

    constructor(private configService: ConfigService) {
        this.region = this.configService.get<string>('AWS_REGION');
        this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');

        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>(
                'AWS_SECRET_ACCESS_KEY',
                ),
            },
        });
    }

    async uploadFile(
        file: Express.Multer.File,
    ): Promise<{ Key: string; Location: string }> {
        const key = `${uuidv4()}${extname(file.originalname)}`;
        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );
        return {
            Key: key,
            Location: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
        };
    }

    async deleteFile(key: string): Promise<void> {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }
}
