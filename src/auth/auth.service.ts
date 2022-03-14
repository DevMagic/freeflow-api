import { HttpException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ThreefoldLogin } from "@devmagic/threefold_login_ts";
import { Users } from 'src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { UsersLoginResponseDto } from 'src/users/dtos/users-login-response.dto';
import { UsersCreateBodyDto } from 'src/users/dtos/users-login-body.dto';
import { ValidationUtils } from 'src/auth/validationUtils'
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService : UsersService,
    ) {}

  async recover(login : string, seedPhrase : string) : Promise<UsersLoginResponseDto> {

    var threefoldLogin = new ThreefoldLogin(
      process.env.THREEFOLD_BOT_API_URL,
      process.env.PKID_API_URL,
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

  async register(userInfo : UsersCreateBodyDto){

    if(!ValidationUtils.isValidEmail(userInfo.email)){
      throw new HttpException('Email does not exist', 400);
    }

    var threefoldLogin = new ThreefoldLogin(
      process.env.THREEFOLD_BOT_API_URL,
      process.env.PKID_API_URL,
      {
        showWarnings : false
      }
    );

    return await threefoldLogin.register(
      userInfo.username,
      userInfo.email,
      userInfo.seedPhrase,
    );
  }
}
