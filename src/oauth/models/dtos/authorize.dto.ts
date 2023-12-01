import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeDTO {
  @ApiProperty()
  code: string;

  @ApiProperty()
  redirect_uri: string;

  @ApiProperty()
  client_id: string;

  @ApiProperty()
  client_secret: string;

  @ApiProperty()
  grant_type: string;
}