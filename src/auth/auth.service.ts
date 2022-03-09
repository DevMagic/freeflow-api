import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ThreefoldLogin } from "@devmagic/threefold_login_ts";
import { Users } from 'src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { UsersLoginResponseDto } from 'src/users/dtos/users-login-response.dto';
import * as bcryptjs from 'bcryptjs';

const THREEFOLD_BOT_API_URL_PRODUCTION = "https://login.threefold.me/api";
const PKID_API_URL_PRODUCTION = "https://pkid.jimber.org/v1";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService : UsersService,
    ) {}

  async recover(login : string, seedPhrase : string) : Promise<UsersLoginResponseDto> {

    var threefoldLogin = new ThreefoldLogin(
      THREEFOLD_BOT_API_URL_PRODUCTION,
      PKID_API_URL_PRODUCTION,
      {
        showWarnings : false
      }
    );

    var threefoldUser = await threefoldLogin.recover(login, seedPhrase);

    var user = await this.usersService.createOrUpdateUser(threefoldUser, seedPhrase);

    return {
      id : user.id,
      username : user.username,
      email : user.email,
      token : await this.generateToken(user)
    };

  }

  private async generateToken(user: Users) : Promise<string> {

    const payload: any = {
      id: user.id,
      username : user.username,
      email : user.email,
    };

    return this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
    });
  }
}
