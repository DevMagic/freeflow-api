import { HttpException, Injectable } from '@nestjs/common';
import * as bip39 from 'bip39';
import * as sodium from 'libsodium-wrappers';
import { encodeUTF8, decodeBase64, encodeBase64 } from 'tweetnacl-util';
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

import * as Axios from 'axios';
const axios = Axios.default;

@Injectable()
export class CryptoService {

  threeBotApiUrl = "https://login.threefold.me/api";
  pKidUrl = 'https://pkid.jimber.org/v1';

  async checkSeedPhrase(doubleName : string, seedPhrase : string) {
    var keys = await this.generateKeysFromSeedPhrase(seedPhrase);
    var keyPair = await this.generateKeyPairFromSeedPhrase(seedPhrase);
    //var encodedPublicKey = encodeBase64(keyPair.publicKey);
    console.log("publicKey");
    // console.log("privateKey", keyPair.privateKey);

    //var publicKey = this.getEdPkInCurve(keyPair.publicKey);

    //console.log("pk in curve publicKey", publicKey);

    let userInfo = await this.getThreefoldUserInfo(doubleName);

    if (!userInfo) {
      throw new HttpException(`Name was not found.`, 400);
    }

    if (userInfo.publicKey != keys.publicKey) {
      throw new HttpException(`Seed phrase does not match with ${doubleName}`, 400);
    }

    var keyWords = ['email', 'phone', 'identity'];
    var results = {};

    var pKidResult = await this.getPKidDoc("email", keyPair);

    console.log("userInfo", userInfo);
    console.log("pKidResult", pKidResult);

    return userInfo;

    //if (userInfo != pu)
  }

  private verifyPKidData(message : string, encodedPublicKey : Uint8Array) : Uint8Array {
    var signedMessage = decodeBase64(message);
    return sodium.crypto_sign_open(signedMessage, encodedPublicKey);
  }

  async getPKidDoc(keyword : string, keyPair : { 
    publicKey : Uint8Array, 
    privateKey : Uint8Array, 
  }) {
    var publicKeyHex = this.toHexString(keyPair['publicKey']);

    console.log("publicKeyHex", publicKeyHex);
    console.log("PKidDoc Url >>>", `${this.pKidUrl}/documents/${publicKeyHex}/${keyword}`);

    let result = (await axios.get(`${this.pKidUrl}/documents/${publicKeyHex}/${keyword}`, { 
      headers: {
        "Content-type": "application/json",
      }
    })).data;

    var verified = await this.verifyPKidData(result.data, keyPair['publicKey']);
    console.log('VERIFIED!', encodeUTF8(verified));
    var decodedData = JSON.parse(decoder.end(verified));

    console.log("decodedData >>>", decodedData);

    if (decodedData["is_encrypted"] == 0) {
      return {
        "success" : true,
        "data" : decodedData["payload"],
        "verified" : true,
        "data_version" : decodedData["data_version"]
      };
    }

    var decryptedData = await this.decryptPkid(decodedData["payload"], keyPair.publicKey, keyPair.privateKey);
    
    return {
      "success" : true,
      "data" : decryptedData,
      "verified" : true,
      "decrypted" : true,
      "data_version" : decodedData["data_version"]
    };

  }

  decrypt: (
    ecryptedMessage: string,
    nonce: string,
    privateKey: Uint8Array,
    pubkey: Uint8Array
) => string = (
    ecryptedMessage: string,
    nonce: string,
    privateKey: Uint8Array,
    pubkey: Uint8Array
) => {
    const newPrivateKey = sodium.crypto_sign_ed25519_sk_to_curve25519(
        privateKey
    );
    const newPubkey = sodium.crypto_sign_ed25519_pk_to_curve25519(pubkey);
    const decryptedData = sodium.crypto_box_open_easy(
        decodeBase64(ecryptedMessage),
        decodeBase64(nonce),
        newPubkey,
        newPrivateKey
    );
    return encodeUTF8(decryptedData);
};

  private async decryptPkid(cipherText : string, bobPublicKey : Uint8Array, bobPrivateKey : Uint8Array) : Promise<string> {
    console.log("cipherText", cipherText);
    console.log("bobPublicKey", bobPublicKey);
    console.log("bobPrivateKey", bobPrivateKey);
    var cipherEncodedText : Uint8Array = decodeBase64(cipherText);
    var publicKey : Uint8Array = sodium.crypto_sign_ed25519_pk_to_curve25519(bobPublicKey);
    var privateKey : Uint8Array = sodium.crypto_sign_ed25519_pk_to_curve25519(bobPrivateKey);
    var decrypted : Uint8Array = sodium.crypto_box_seal_open(cipherEncodedText, publicKey, privateKey);
    return String.fromCharCode(...decrypted);
  }

  /*

  Map<String, String> requestHeaders = {'Content-type': 'application/json'};

    print('$pKidUrl/documents/${hex.encode(keyPair['publicKey'])}/$key');
    Response res = await http.get(Uri.parse('$pKidUrl/documents/${hex.encode(keyPair['publicKey'])}/$key'),
        headers: requestHeaders);

    Map<String, dynamic> data = jsonDecode(res.body);
    Uint8List verified = await verifyData(data['data'], keyPair['publicKey']);
    Map<String, dynamic> decodedData = jsonDecode(utf8.decode(verified));

    if (decodedData['is_encrypted'] == 0) {
      return {'success': true, 'data': decodedData['payload'], 'verified': true, 'data_version': data['data_version']};
    }

    String decryptedData = await decryptPKid(decodedData['payload'], keyPair['publicKey'], keyPair['privateKey']);

    return {
      'success': true,
      'data': decryptedData,
      'verified': true,
      'decrypted': true,
      'data_version': decodedData['data_version']
    };

  */

    private toHex(input : string) {
      var length = input.length / 2;
      var bytes = new Uint8Array(Math.ceil(length));
    
      for (var i = 0; i < bytes.length; i++) {
        var x = input.substring(i * 2, i * 2 + 2);
        bytes[i] = parseInt(x, 16);
      }
    
      return bytes;
    }

    async generateKeysFromSeedPhrase(seedPhrase : string) : Promise<{ 
      publicKey : string, 
      privateKey : string, 
    }> {
      this.checkSeedLength(seedPhrase);
  
      var entropy : string = bip39.mnemonicToEntropy(seedPhrase);
      //const encodedEntropy = Uint8Array.from(Buffer.from(entropy, 'hex'));
      let result : any = sodium.crypto_sign_seed_keypair(this.toHex(entropy));
      console.log("generateKeysFromSeedPhrase >>>", result);
      
      return { 
        publicKey : encodeBase64(result.publicKey), 
        privateKey : encodeBase64(result.privateKey),
      };
    }

  async generateKeyPairFromSeedPhrase(seedPhrase : string) : Promise<{ 
    publicKey : Uint8Array, 
    privateKey : Uint8Array, 
  }> {
    this.checkSeedLength(seedPhrase);

    var entropy : string = bip39.mnemonicToEntropy(seedPhrase);
    //const encodedEntropy = Uint8Array.from(Buffer.from(entropy, 'hex'));
    let result : any = sodium.crypto_sign_seed_keypair(this.toHex(entropy));
    console.log("generateKeyPairFromSeedPhrase >>>", result);
    
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

  private toHexString(byteArray) : string {
    return Array.from(byteArray, function(byte : any) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
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
