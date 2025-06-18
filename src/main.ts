import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // eslint-disable-next-line prettier/prettier
    })
  );
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
