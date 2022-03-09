import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ThreefoldUserDto } from './dtos/threefold-user.dto';
import { UsersLoginResponseDto } from './dtos/users-login-response.dto';
import { Users } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';

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

      var getUserByName = await this.usersRepository.getUserByUsername(threefoldUser.doublename);
      
      var userData : any = {
        username : threefoldUser.doublename,
        email : threefoldUser.email,
        phone : threefoldUser.phone,
        publicKey : threefoldUser.publicKey,
        password : password ?? "",
      };

      if (getUserByName) {
        userData.id = getUserByName.id;
      }

      return this.usersRepository.createOrUpdateUser(userData);

    }

}
