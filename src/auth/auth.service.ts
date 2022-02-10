import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/crypto/crypto.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { encodeUTF8, decodeBase64, encodeBase64 } from 'tweetnacl-util';

@Injectable()
export class AuthService {

  constructor(private readonly cryptoService : CryptoService){}

  seedPhrase = "execute fetch develop endorse away solid verb action tortoise judge wrap kiwi custom rapid husband advance cloud inflict toddler alien install scatter swift gauge";

  async recover() {

    let response = await this.cryptoService.checkSeedPhrase("claudioliv", this.seedPhrase);

    // var keyPair = await this.cryptoService.generateKeyPairFromSeedPhrase(this.seedPhrase);
    // console.log("publicKey", encodeBase64(keyPair.publicKey));
    // // console.log("privateKey", keyPair.privateKey);

    // var publicKey = this.cryptoService.getEdPkInCurve(keyPair.publicKey);

    // console.log("pk in curve publicKey", publicKey);

    // let userInfo = await this.getThreefoldUserInfo("claudioliv");

    // console.log("userInfo", userInfo);

    //if (userInfo != pu)
    //loginThreefold
    //login.threefold.me

    return response;
  }

 
}
