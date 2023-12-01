import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OauthModel } from '../models/oauth.model';
import * as OAuth2Server from 'oauth2-server';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OauthService {
  oauth: OAuth2Server;

  constructor(
    private oauthModel: OauthModel,
    private readonly usersService: UsersService,
  ) {
    this.oauth = new OAuth2Server({
      model: this.oauthModel, // Pass the instance of OauthModel
      accessTokenLifetime: 60 * 60,
      allowBearerTokensInQueryString: true,
    });
  }

  async obtainToken(req: Request) {
    req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response();
    const result = await this.oauth.token(request, response);

    return result;
  }

  async authorize(req: Request, res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response();
    const redirectUri = request.query.redirect_uri;
    const clientId = request.query.client_id;
    const grantType = request.query.grant_type;
    const state = req.query.state;
    const response_type = req.query.response_type;

    try {
      // Check if the Authorization header is present
      const authorization = request.get('Authorization');
      if (authorization) {
        // Extract the token from the Authorization header
        // const token = authorization.split(' ')[1];
  
        // Validate the token (this will depend on how you're managing tokens)
        // const isValidToken = await this.validateToken(token);
        // if (!isValidToken) {
        //   // If the token is not valid, redirect to the sign-in page
        //   res.redirect('http://localhost:5173/signin');
        //   return;
        // }
      } else {
        // If the Authorization header is not present, redirect to the sign-in page
        res.redirect(
          `http://localhost:5173/signin?redirect_uri=${redirectUri}&client_id=${clientId}&grant_type=${grantType}&state=${state}&response_type=${response_type}`,
        );
        return;
      }

      const code = await this.oauth.authorize(request, response);
      return {
        url: `${code.redirectUris}?code=${code.authorizationCode}`,
      };
    } catch (err) {
      console.log('err:', err);
    }
  }

  async signin(user: any) {
    const emailUser = await this.usersService.findOneByEmail(user.email);

    if (!emailUser) {
      throw new NotFoundException('User not found');
    }

    const match = await bcrypt.compare(user.password, emailUser.password);

    if (!match) {
      throw new BadRequestException('Wrong password');
    }

    const { password: userPassword, ...result } = emailUser;

    if (!result) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    return { message: 'Login successful' };
  }

  // async generateAuthorizationCode(client: Client, user: User): Promise<string> {
  //   // Generate a unique authorization code
  //   const authorizationCode = uuidv4();

  //   // Associate the authorization code with the client and user in your database
  //   // This will depend on how your database and models are set up

  //   return authorizationCode;
  // }
}
