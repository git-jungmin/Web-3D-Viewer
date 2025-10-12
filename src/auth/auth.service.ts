import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/users.service';
import { UserRole } from 'src/user/entities/user-role.enum';
import { CreateGoogleUserRequestDto } from 'src/user/dto/create-google-user-request.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly googleClientId: string;

    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) {
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    }

    // Sign-In
    async signIn(
        signInRequestDto: SignInRequestDto
    ): Promise<User> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is signing in`);

        const { email, password } = signInRequestDto;

        try {
            const existingUser = await this.userService.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }

            this.logger.verbose(`User with email: ${signInRequestDto.email} found`);
            return existingUser;
        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`);
            throw error;
        }
    }

    async findOrCreateGoogleUser(googleProfile: { email: string, name: string }): Promise<User | null> {
        this.logger.verbose(`User with G-mail: ${googleProfile.email} is trying to sign in`);
        const { email, name } = googleProfile;

        let existingUser = await this.userService.findUserByEmail(email).catch(() => null);

        if (!existingUser) {
            this.logger.verbose(`User with email: ${email} not found, creating new user with Google profile`);
            const createGoogleUserRequestDto: CreateGoogleUserRequestDto = {
                email,
                username: name || email.split('@')[0],
                role: UserRole.GUEST,
            };
            await this.userService.createUserByGoogle(createGoogleUserRequestDto);
            existingUser = await this.userService.findUserByEmail(email);
            this.logger.verbose(`New user with google email: ${email} created successfully`);
        }
        this.logger.verbose(`User with G-mail: ${email} found`);
        return existingUser;
    }

    async generateJwt(user: User): Promise<string> {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        return await this.jwtService.sign(payload);
    }
}