// src/file/file.controller.ts
import { Controller, Post, Delete, UploadedFile, UseInterceptors, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/roles.guard';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ key: string; url: string }> {
        return await this.fileService.upload(file);
    }

    @Delete()
    async deleteFile(@Body() body: DeleteFileDto): Promise<{ message: string }> {
        await this.fileService.deleteFile(body.s3Key);
        return { message: 'File deleted successfully' };
    }
}
