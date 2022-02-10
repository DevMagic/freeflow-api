import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ThreefoldLogin } from "@devmagic/threefold_login_ts";

const THREEFOLD_BOT_API_URL_PRODUCTION = "https://login.threefold.me/api";
const PKID_API_URL_PRODUCTION = "https://pkid.jimber.org/v1";

@Injectable()
export class AuthService {

  constructor() {}

  async recover(login : string, seedPhrase : string) {

    var threefoldLogin = new ThreefoldLogin(
      THREEFOLD_BOT_API_URL_PRODUCTION,
      PKID_API_URL_PRODUCTION,
      {
        showWarnings : false
      }
    );

    return threefoldLogin.recover(login, seedPhrase);

  }
 
}
