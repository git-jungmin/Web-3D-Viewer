import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignInRequestDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: '비밀번호는 대소문자와 숫자를 포함해야 합니다'
    })
    password: string;

}