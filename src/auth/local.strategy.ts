import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject } from '@nestjs/common';
import { User } from '@app/db/schemas/user.schemas';
import { ReturnModelType } from '@typegoose/typegoose';
import { compareSync } from 'bcryptjs';

export class LocalStrateggy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(User.name) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userModel
      .findOne({
        username,
      })
      .select('+password');
    if (!user) {
      throw new BadRequestException('用户名不正确!');
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码不正确!');
    }

    return user;
  }
}
