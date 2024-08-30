import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    type: String,
    required: false,
  })
  full_name: string;
}
