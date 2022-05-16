import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

type ClassType = { new (...args: any[]): any };

@Module({})
export class DbModule {
  static forRoot(envKey: string, options = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'DB_CONNECTION',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const uri = configService.get<string>(envKey, 'MONGO_URI');
          const mongoConnection = mongoose.connection;
          mongoConnection.once('open', function () {
            console.log('数据库连接成功！');
          });
          return mongoose.connect(uri, options);
        },
      },
    ];
    return {
      module: DbModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  static forFeature(modules: ClassType[]): DynamicModule {
    const providers = modules.map((model) => {
      return {
        provide: model.name,
        useFactory: () => getModelForClass(model),
      } as Provider;
    });
    return {
      module: DbModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}
