import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, getManager } from 'typeorm';
import * as camelcaseKeys from 'camelcase-keys';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet>{

  constructor(){
    super();
  }

  async createWallet(walletInfo : any){
    const wallet = this.create();
    Object.assign(wallet, walletInfo);
    return await this.save(wallet);
  }

  async getWalletAmound(userSenderId: any, walletAddress : any){
    let result = camelcaseKeys(await this.createQueryBuilder('wallet')
                                        .select(`amount as sender_amount, email as sender_email, created_at`)
                                        .addSelect(subQuery => {
                                          return subQuery
                                          .select("w2.email", "receiver_email")
                                          .from(Wallet ,'w2')
                                          .where(`w2.wallet_address = :walletAddress`, {walletAddress})
                                        }, "receiver_email")
                                        .addSelect(subQuery => {
                                          return subQuery
                                          .select("w2.amount", "receiver_amount")
                                          .from(Wallet ,'w2')
                                          .where(`w2.wallet_address = :walletAddress`, {walletAddress})
                                        }, "receiver_amount")
                                        .where(`wallet.user_id = :userSenderId`, {userSenderId})
                                        .execute());
    return result[0]? result[0] : result
  }

  async saveNewAmountInTranferWallet(userSenderId: any, walletAddress : any ,senderNewAmount : number, reciverNewAmount : number){
    return await getManager().transaction(async transactionalEntityManager =>{
      await transactionalEntityManager.createQueryBuilder()
                                      .update(Wallet)
                                      .set({ amount: senderNewAmount })
                                      .where('user_id = :userSenderId', {userSenderId})
                                      .execute();

      await transactionalEntityManager.createQueryBuilder()
                                      .update(Wallet)
                                      .set({ amount: reciverNewAmount })
                                      .where('wallet_address = :walletAddress', {walletAddress})
                                      .execute();
    });
  }
  
  async getWalletByUserId(userId: any){ 
    return await this.createQueryBuilder('wallet')
                     .where(`wallet.user_id = (:userId)`, { userId })
                     .getOne();
  }
}