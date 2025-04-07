import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Application port variable
require('dotenv').config();
const PORT = process.env.APP_PORT || 3030;

// START server
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { abortOnError: false }); //TODO: abortOnError only for dev mode

    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    // Set the global prefix for all routes
    app.setGlobalPrefix('api');
    await app.listen(PORT, () => {
      console.log(
        `>>> 🚀🚀🚀 'Learning Platform' server is running on the ${PORT} port.`,
      );
    });
  } catch (e) {
    console.log(">>> 🚫 'Learning Platform' server unknown error: ", e);
    process.exit();
  }
}
bootstrap();