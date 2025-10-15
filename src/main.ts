import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080', // 요청을 허용할 출처
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드
    allowedHeaders: 'Content-Type, Accept, Authorization', // 허용할 HTTP 헤더
    credentials: true, // 자격 증명(쿠키 등)을 포함한 요청 허용
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
