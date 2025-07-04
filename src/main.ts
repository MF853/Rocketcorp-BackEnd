import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // Cookie parser middleware
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Enable automatic transformation
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    })
  );
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("Rocketcorp API")
    .setDescription("Documentação da API Rocketcorp")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors();

  // 👇 This line is crucial for graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

void bootstrap();
