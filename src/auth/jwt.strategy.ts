import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { User } from '@app/db/schemas/user.schemas';
import { ReturnModelType } from '@typegoose/typegoose';
import { ConfigService } from '@nestjs/config';

type validateData = {
  id: string;
  iat?: number;
  exp?: number;
};

export class JwtStrateggy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(User.name) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECERT'),
    } as StrategyOptions);
  }

  async validate(data: validateData) {
    return await this.userModel.findById(data.id);
  }
}
