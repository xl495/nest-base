import { ApiProperty } from '@nestjs/swagger';
import { ModelOptions, Prop } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @Prop()
  @ApiProperty({
    description: '用户名',
    example: 'user1',
  })
  username: string;
  @Prop({
    select: false,
    set(val) {
      return val ? hashSync(val, 8) : val;
    },
    get(val) {
      return val;
    },
  })
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  password: string;
}
