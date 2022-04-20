import { HttpException, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/create-wallet.dto';
import { WalletRepository } from './repositories/wallet.repository';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
  ){}

  async createWallet(walletInfo: any) {
    return await this.walletRepository.createWallet(walletInfo);
  }

  async getWalletByUserId(userId: any){
    return await this.walletRepository.getWalletByUserId(userId);
  }

  async transactionWalletAmounds(userId: any, transactionInfo: TransactionDto){
    if(!userId || !transactionInfo.amount || !transactionInfo.walletAdress){
      throw new HttpException("MANDATORY_FIELD_NOT_FOUND", 404);
    }
    if(transactionInfo.amount <= 0){
      throw new HttpException("WRONG_AMOUNT", 400);
    }
    let fee = 0;
    let result = await this.walletRepository.getWalletAmound(userId, transactionInfo.walletAdress);
    if(result.receiverAmount == null){
      throw new HttpException("WALLET_NOT_FOUND", 404);
    }
    if(+result.senderAmount < (fee + transactionInfo.amount)){
      throw new HttpException("NOT_ENOUGHT_FLOWER_IN_WALLET", 400);
    }
    let senderNewAmount = +result.senderAmount - (fee + transactionInfo.amount);
    let receiverNewAmount = +result.receiverAmount + transactionInfo.amount;
    await this.walletRepository.saveNewAmountInTranferWallet(userId, transactionInfo.walletAdress, senderNewAmount, receiverNewAmount);

    return {
      id: bcryptjs.hashSync(bcryptjs.genSaltSync(10)),
      date: new Date(),
      senderEmail : result.senderEmail,
      receiverEmail : result.receiverEmail,
      amount : transactionInfo.amount,
      fee : fee
    };
  }
}
