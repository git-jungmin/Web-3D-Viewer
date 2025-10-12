import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class CreateUserRequestDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    passwordConfirm: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    // DTO 내에서 추가 검증 로직 작성
    validatePasswords() {
        if (this.password !== this.passwordConfirm) {
            throw new Error('Passwords do not match');
        }
    }
}