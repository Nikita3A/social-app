import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.interface';

export class SignInDTO {
    // @IsEmail()
    // @IsString()
    // @MinLength(4)
    @ApiProperty()
    email: string;
  
    // @IsString()
    // @MinLength(4)
    @ApiProperty({
        minimum: 8,
    })
    password: string;
  }
  
export class SignUpDTO {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    name: string;
    // @ApiProperty({
    //     enum: ['admin', 'chiefeditor', 'editor', 'user'],
    //     description: 'The role of a user',
    //     default: 'user',
    // })
    // role: UserRole;
}

export class UpdateUserDTO {
    @ApiProperty()
    password: string;
}
// ADMIN = 'admin',
// CHIEFEDITOR = 'chiefeditor',    
// EDITOR = 'editor',
// USER = 'user'