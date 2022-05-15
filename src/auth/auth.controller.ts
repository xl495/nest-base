import { User } from '@app/db/schemas/user.schemas';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';

export class RegisterDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

@Controller('auth')
@ApiTags('用户')
export class AuthController {
  constructor(
    @Inject(User.name) private readonly userModel: ReturnModelType<typeof User>,
  ) {}
  @Post('register')
  @ApiOperation({
    summary: '注册',
  })
  async register(@Body() dto: RegisterDto) {
    const { username, password } = dto;
    const user = await this.userModel.create({
      username,
      password,
    });
    return user;
  }

  @Post('login')
  @ApiOperation({
    summary: '登录',
  })
  async login(@Body dto) {
    const user = this.userModel.find();
    return user;
  }

  @Get('user')
  @ApiOperation({
    summary: '获取个人信息',
  })
  async user() {
    return {};
  }
}
