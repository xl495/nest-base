import { DbModule } from '@app/db';
import { User } from '@app/db/schemas/user.schemas';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        const SECERT = configService.get('SECERT');
        return {
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRESIN'),
          },
          secret: SECERT,
        };
      },
      inject: [ConfigService],
    }),
    DbModule.forRoot('MONGO_URI'),
    DbModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule],
})
export class AppModule {}
