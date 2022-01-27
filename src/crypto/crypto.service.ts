import { HttpException, Injectable } from '@nestjs/common';
import * as bip39 from 'bip39';
import * as sodium from 'libsodium-wrappers';
import { encodeUTF8, decodeBase64, encodeBase64 } from 'tweetnacl-util';

import * as Axios from 'axios';
const axios = Axios.default;

@Injectable()
export class CryptoService {

  threeBotApiUrl = "https://login.threefold.me/api";
  pKidUrl = 'https://pkid.jimber.org/v1';

  async checkSeedPhrase(doubleName : string, seedPhrase : string) {
    var keyPair = await this.generateKeyPairFromSeedPhrase(seedPhrase);
    var encodedPublicKey = encodeBase64(keyPair.publicKey);
    console.log("publicKey", );
    // console.log("privateKey", keyPair.privateKey);

    var publicKey = this.getEdPkInCurve(keyPair.publicKey);

    console.log("pk in curve publicKey", publicKey);

    let userInfo = await this.getThreefoldUserInfo(doubleName);

    if (!userInfo) {
      throw new HttpException(`Name was not found.`, 400);
    }

    if (userInfo.publicKey != encodedPublicKey) {
      throw new HttpException(`Seed phrase does not match with ${doubleName}`, 400);
    }

    console.log("userInfo", userInfo);

    return userInfo;

    //if (userInfo != pu)
  }

  async generateKeyPairFromSeedPhrase(seedPhrase : string) : Promise<{ 
    publicKey : Uint8Array, 
    privateKey : Uint8Array, 
  }> {
    this.checkSeedLength(seedPhrase);

    var entropy : string = bip39.mnemonicToEntropy(seedPhrase);
    const encodedEntropy = Uint8Array.from(Buffer.from(entropy, 'hex'));
    let result : any = sodium.crypto_sign_seed_keypair(encodedEntropy);
    
    return { 
      publicKey : result.publicKey, 
      privateKey : result.privateKey,
    };
  }

  getEdPkInCurve(publicKey : Uint8Array) : string {
    const signingKey = sodium.crypto_sign_ed25519_pk_to_curve25519(publicKey);
    return encodeBase64(signingKey);
  }

  private checkSeedLength(seedPhrase  : string) {
    var seedLength = seedPhrase.split(" ").length;
    if (seedLength <= 23) {
      throw new HttpException('Seed phrase is too short', 400);
    } else if (seedLength > 24) {
      throw new HttpException('Seed phrase is too long', 400);
    }
  }

  async getThreefoldUserInfo(doubleName : string) {
    console.log("url >>>", `${this.threeBotApiUrl}/users/${doubleName}`);
    try {
      let result = await axios.get(`${this.threeBotApiUrl}/users/${doubleName}.3bot`, { 
        headers: {
          "Content-type": "application/json",
        }
      });
      return result.data;
    }catch(err) {
        console.log('3bot user info error >>>', err);
      return null;
    }
  }

}
