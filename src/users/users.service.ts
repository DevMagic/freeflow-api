import { Injectable, HttpException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ThreefoldUserDto } from './dtos/threefold-user.dto';
import { UsersCreateBodyDto } from './dtos/users-login-body.dto';
import { UsersLoginResponseDto } from './dtos/users-login-response.dto';
import { Users } from './entities/users.entity';
import * as bcryptjs from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { ValidationUtils } from 'src/auth/validationUtils'
@Injectable()
export class UsersService {

    constructor(
        private readonly authService : AuthService,
        private readonly usersRepository : UsersRepository,
    ){}

    async login(login : string, seedPhrase : string) : Promise<UsersLoginResponseDto> {
        return this.authService.recover(login, seedPhrase);
    }

    async createOrUpdateUser(threefoldUser : ThreefoldUserDto, password? : string) : Promise<Users> {

      let username = threefoldUser.doublename.toLowerCase().replace('.3bot','')
      var getUserByName = await this.usersRepository.getUserByUsername(username);
      var userData : any = {
        username : username,
        email : threefoldUser.email,
        phone : threefoldUser.phone,
        publicKey : threefoldUser.publicKey,
        password : bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
      };

      if (getUserByName) {
        userData.id = getUserByName.id;
      }

      return this.usersRepository.createOrUpdateUser(userData);

    }

    async createUser(userInfo : UsersCreateBodyDto){
      if(!ValidationUtils.isValidEmail(userInfo.email)){
        throw new HttpException('EMAIL_IS_NOT_VALID', 400);
      }
      var getUserByName = await this.usersRepository.getUserByUsername(userInfo.username.toLowerCase());
      if(getUserByName){
        throw new HttpException("USER_ALREADY_EXISTS", 409);
      }
      if(process.env.ENVIRONMENT == "production"){
        await this.authService.register(userInfo)
      }
      var userData : any = {
        username : userInfo.username.toLowerCase(),
        email : userInfo.email,
        password : bcryptjs.hashSync(userInfo.seedPhrase, bcryptjs.genSaltSync(10)),
      };
      await this.usersRepository.createNewUser(userData);
      return; 
    }
    
    //TODO fazer alteração para verificar se usuario existe na threefold
    async checkUserExists(username : string){
      var getUserByName = await this.usersRepository.getUserByUsername(username.toLowerCase());
      if(getUserByName){
        return { message:"USER_ALREADY_EXISTS" };
      }else{
        return { message:"OK" };
      }
    }
}