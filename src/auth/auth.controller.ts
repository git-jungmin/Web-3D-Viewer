import { BadRequestException, Body, ConflictException, Controller, HttpStatus, Logger, Post, Res, Get, UseGuards, Req, UnauthorizedException, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { Response } from 'express';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { CreateUserRequestDto } from 'src/user/dto/create-user-request.dto';
import { UsersService } from 'src/user/users.service';
import { Request } from 'express';
import { GoogleAuthGuard } from './custom-guards-decorators/google-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user-role.enum';
import { Roles } from './custom-guards-decorators/roles.decorator';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    private readonly frontendUrl: string;

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {
        this.frontendUrl = process.env.FRONTEND_REDIRECT_URI;
    }

    // Sign-Up
    @Post('/signup')
    async createUser(
        @Body() createUserRequestDto: CreateUserRequestDto
    ): Promise<ApiResponseDto<void>> {
        this.logger.verbose(`Visitor is trying to create a new account with email: ${createUserRequestDto.email}`);

        try {
            await this.usersService.createUser(createUserRequestDto);
            this.logger.verbose(`New account created Successfully`);
            return new ApiResponseDto(true, HttpStatus.CREATED, '회원가입이 완료되었습니다.');
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('회원가입 중 오류가 발생했습니다.');
        }
    }

    // Sign-In
    @Post('/signin')
    async signIn(
        @Body() signInRequestDto: SignInRequestDto,
        @Res() res: Response
    ): Promise<void> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is trying to sign in`);

        try {
            const user = await this.authService.signIn(signInRequestDto);
            
            const jwtToken = await this.authService.generateJwt(user);

            this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${jwtToken}`);

            res.setHeader('Authorization', `Bearer ${jwtToken}`);
            const response = new ApiResponseDto(true, HttpStatus.OK, 'User logged in successfully', { jwtToken });
            res.send(response);
        } catch (error) {
            this.logger.error(`Sign-in failed: ${error.message}`);
            res.status(HttpStatus.UNAUTHORIZED).send(new ApiResponseDto(false, HttpStatus.UNAUTHORIZED, '이메일 또는 비밀번호를 확인해주세요.'));
        }
    }

    @Get('/google/signin')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() 
    : Promise<void> {
        this.logger.verbose(`User is trying to Google social sign-in`);
        // Google 로그인 페이지로 리디렉션 (Passport가 처리)
    }

    @Get('/google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
        this.logger.verbose(`Processing Google authentication callback`);
        if (!req.user) {
            this.logger.error(`Google authentication failed, req.user is null`);
            return res.redirect(`${this.frontendUrl}/auth/sign-in?error=google_auth_failed`);
        }
        try {
            const jwtToken = await this.authService.generateJwt(req.user as User); // User 타입 캐스팅
            this.logger.verbose(`Google authentication successful for user, JWT issued.`);

            // JWT 토큰을 쿼리 파라미터로 프론트엔드 콜백 URL에 추가
            const callbackUrlWithToken = `${this.frontendUrl}/auth/google-callback?jwtToken=Bearer ${jwtToken}`;
            
            // 헤더에 토큰을 담지 않고, 쿼리 파라미터로 리디렉션
            return res.redirect(callbackUrlWithToken);

        } catch (error) {
            this.logger.error(`Error processing Google callback for user: ${req.user ? (req.user as any).id : 'unknown'}`, error.stack);
            return res.redirect(`${this.frontendUrl}/auth/sign-in?error=jwt_generation_failed`);
        }
    }
}