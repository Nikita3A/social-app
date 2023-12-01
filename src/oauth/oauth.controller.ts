import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OauthService } from './services/oauth.service';
import { ClientService } from './services/client.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { RequestToken } from './models/dtos/requestToken.dto';
import { AuthorizeDTO } from './models/dtos/authorize.dto';
import { SignInDTO } from 'src/users/models/user.model';

@ApiTags('oauth')
@Controller('oauth')
export class OauthController {
  constructor(
    private oauthService: OauthService,
    private clientService: ClientService,
    private userService: UsersService,
  ) {}

  @Get('authorize')
  // @ApiQuery({ type: AuthorizeDTO })
  // @ApiQuery({ name: 'code', type: String })
  @ApiQuery({ name: 'redirect_uri', type: String })
  @ApiQuery({ name: 'client_id', type: String })
  @ApiQuery({ name: 'client_secret', type: String })
  @ApiQuery({ name: 'grant_type', type: String })
  @ApiQuery({ name: 'state', type: String })

  // @ApiQuery({ name: 'login', type: String })
  // @ApiQuery({ name: 'password', type: String })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Authorize Request' })
  @ApiResponse({ status: 200, description: 'Redirects to the login page' })
  async authorize(@Req() req: Request, @Res() res: Response) {
    const result = await this.oauthService.authorize(req, res);
    res.send(result);
    // return result;
  }

  @Post('token')
  @ApiOperation({ summary: 'Access Token Request' })
  @ApiResponse({ status: 200, description: 'Returns access token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        grant_type: { type: 'string', example: 'authorization_code' },
        code: { type: 'string', example: 'authorization_code' },
        redirect_uri: {
          type: 'string',
          example: 'http://localhost:3000/callback',
        },
        client_id: { type: 'string', example: 'client_id' },
        client_secret: { type: 'string', example: 'client_secret' },
      },
    },
  })
  async token(@Req() req: Request) {
    return this.oauthService.obtainToken(req);
  }

  @Post('signin')
  @ApiBody({ type: SignInDTO })
  async signin(@Body() user: SignInDTO) {
    console.log('fuck yeah');
    
    return this.oauthService.signin(user);
    // @Redirect('authorize');
  }

  @Get('public')
  getPublic() {
    return 'Public area';
  }
}
