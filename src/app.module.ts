// src/app.module.ts
import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
  ],
})
export class AppModule {}
