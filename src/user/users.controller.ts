import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, Req, Res, HttpStatus, UseGuards, Request, BadRequestException, Logger, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { RolesGuard } from 'src/auth/custom-guards-decorators/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator';
import { UserRole } from './entities/user-role.enum';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('api/users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @Roles(UserRole.GUEST, UserRole.ADMIN)
    async getUser(
        @Param('id') userId: number
    ): Promise<{ message: string; user: User }> {
        const user = await this.usersService.getUserById(userId);
        return { message: '사용자 조회를 완료했습니다.', user };
    }

    // UPDATE
    @Put(':id')
    @Roles(UserRole.ADMIN)
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserRequestDto: UpdateUserRequestDto
    ): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`Updating user with ID: ${id}`);

        const foundUser = await this.usersService.getUserById(id);
        if (!foundUser) {
            throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }

        try {
            await this.usersService.updateUserById(id, updateUserRequestDto)
            this.logger.verbose(`User with ID: ${id} updated successfully`);
            return new ApiResponseDto(true, HttpStatus.NO_CONTENT, '회원 정보가 성공적으로 수정되었습니다.');
        } catch (error) {
            throw new BadRequestException('회원 정보 수정 중 오류가 발생했습니다.');
        }
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async deleteUser(
        @Param('id') id: number
    ): Promise<ApiResponseDto<void>> {
        await this.usersService.remove(id);
        return new ApiResponseDto(true, HttpStatus.NO_CONTENT, '회원 정보가 성공적으로 삭제되었습니다.');
    }

    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res() response: Response
    ) {
      response.clearCookie('token');
      
      return response.json({ message: '로그아웃 성공' });
    }
}