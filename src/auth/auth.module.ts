import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../user/entities/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './custom-guards-decorators/roles.guard';
import { UsersModule } from '../user/users.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthGuard } from './custom-guards-decorators/google-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([User]),
        ConfigModule,

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: (configService.get<string>('JWT_EXPIRATION') || '1h') as any, // 일단 as any로 오류 잡았지만, 검토 필요
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        RolesGuard,
        GoogleAuthGuard,
        GoogleStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService, PassportModule, RolesGuard, JwtModule], 
})
export class AuthModule {}