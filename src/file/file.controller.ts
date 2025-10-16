// src/file/file.controller.ts
import { Controller, Post, Delete, UploadedFile, UseInterceptors, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-guards-decorators/roles.guard';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('api/file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadFileDto: UploadFileDto,
    ): Promise<UploadFileResponseDto> {
        return await this.fileService.upload(file, uploadFileDto);
    }

    @Delete()
    async deleteFile(@Body() body: DeleteFileDto): Promise<{ message: string }> {
        await this.fileService.deleteFile(body.s3Key);
        return { message: 'File deleted successfully' };
    }
}
