import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UsersTranscript } from '../entities/users-transcript.entity';
import { CreateUsersTranscriptDto } from '../dto/create-users-transcript.dto';
import * as camelcaseKeys from 'camelcase-keys';
@Injectable()
@EntityRepository(UsersTranscript)
export class UsersTranscriptRepository extends Repository<UsersTranscript>{
  constructor(){
    super();
  }
  
  async createNewUsersTranscript(userTranscriptData : CreateUsersTranscriptDto){
    const userTranscript = this.create();
    Object.assign(userTranscript, userTranscriptData);
    return await this.save(userTranscript);
  }

  async getUsersTranscript( userId : string, filter : string, offset : number){
    let filterOffset = 0,
        params = [],
        filterQuery = '';
    
    params.push(userId);
    filterQuery = `user_sender_id = $1 `
    if(offset != null && offset > 0){
      filterOffset = offset * 20;
    }
    if(filter){
      params.push(filter);
      filterQuery += `AND category = $2`
    }

    let userTranscript = this.query(`SELECT category, amount, gratitude_type, created_at, transfer_action, id, viewed,
                                    (SELECT username from users u where u.id = ut.user_sender_id) as username, 
                                    (SELECT username from users u where u.id = ut.user_receiver_id) as exchange_username,
                                    (SELECT photo_url from users u where u.id = ut.user_receiver_id) as photo_url
                                    FROM users_transcript ut
                                    WHERE ${filterQuery}
                                    ORDER by ut.created_at DESC
                                    LIMIT 20  
                                    OFFSET ${filterOffset}`, params);
    return camelcaseKeys(await userTranscript);                        
  }

  async getUsersTranscriptById( userId : string, transcriptId : string){
    let params = []
    params.push(userId, transcriptId);

    let userTranscript = await this.query(`SELECT amount, ut.created_at as date, fee, sender.email as sender_email,
                                                  sender.photo_url as sender_photo_url, reciver.email as reciver_email,
                                                  reciver.photo_url as reciver_photo_url
                                           FROM users_transcript ut
                                           INNER JOIN users sender
                                           ON ut.user_sender_id = sender.id
                                           LEFT JOIN users reciver
                                           ON ut.user_receiver_id = reciver.id
                                           WHERE user_sender_id = $1 and ut.id = $2`, params);
    return camelcaseKeys(userTranscript[0]);                        
  }

  async changeViewedTranscript(transcriptId : string){
    return await this.createQueryBuilder()
                     .update(UsersTranscript)
                     .set({ viewed : true})
                     .where("id = :id", { id: transcriptId })
                     .execute();
  }
}
