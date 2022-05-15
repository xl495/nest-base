import { User } from '@app/db/schemas/user.schemas';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from './current-user.decorator';
import { ConfigService } from '@nestjs/config';

export type UserDocument = DocumentType<User>;

@Controller('auth')
@ApiTags('用户')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
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
  @UseGuards(AuthGuard('local'))
  async login(@Body() dto: LoginDto, @CurrentUser() user: UserDocument) {
    return {
      token: this.jwtService.sign({
        id: user._id,
      }),
    };
  }

  @Get('user')
  @ApiOperation({
    summary: '获取个人信息',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async user(@CurrentUser() user: UserDocument) {
    return user;
  }
}
