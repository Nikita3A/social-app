import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { from } from 'rxjs';
import { SignUpDTO, SignInDTO } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiBody({ type: SignUpDTO })
  async signup(@Body() user: SignUpDTO) {
    const isUserExist = await this.usersService.findOneByEmail(user.email);
    if (isUserExist)
      throw new HttpException(
        'User with such email already exist',
        HttpStatus.BAD_REQUEST,
      );

    // const userToConfirm = {
    //   email: user.email,
    //   name: user.name,
    // };
    // const tokenForConfirmation = await lastValueFrom(
    //   this.authService.generateJWT(userToConfirm),
    // );
    // const link = await this.mailService.sendUserConfirmation(
    //   userToConfirm,
    //   tokenForConfirmation,
    // );

    // const token = await lastValueFrom(this.authService.generateJWT(user));
    const signedUpUser = await this.authService.signup(user);

    // return { user: signedUpUser, access_token: token, link: link };
    return { user: signedUpUser };
  }

  @Post('signin')
  @ApiBody({ type: SignInDTO })
  async signin(@Body() user: SignInDTO) {
    const isUserExist = await this.usersService.findOneByEmail(user.email);

    if (!isUserExist)
      throw new HttpException(
        'User with such email does not exist',
        HttpStatus.FORBIDDEN,
      );
    if (isUserExist.isEmailVerified == false)
      throw new HttpException('Verify your email', HttpStatus.FORBIDDEN);

    return this.authService.signin(user);
  }

  @Post('refresh')
  @ApiBearerAuth()
  async refreshToken(@Headers('Authorization') authHeader: string) {
    const refreshToken = authHeader.split(' ')[1];
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Custom header',
  })
  logOut(@Headers('Authorization') token: string) {
    return from(this.authService.blackListToken(token));
  }
}
