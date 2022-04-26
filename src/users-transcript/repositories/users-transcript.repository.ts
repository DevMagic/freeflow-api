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

    let userTranscript = this.query(`SELECT category, amount, gratitude_type, ut.created_at::timestamptz, transfer_action, ut.id, viewed,
                                            sender.username as sender_username, receiver.username as receiver_username,
                                            sender.display_name as sender_display_name, receiver.display_name as receiver_display_name,
                                            receiver.photo_url as receiver_photo_url, sender.photo_url as sender_photo_url
                                    FROM users_transcript ut
                                    INNER JOIN users sender
                                    ON ut.user_sender_id = sender.id
                                    LEFT JOIN users receiver
                                    ON ut.user_receiver_id = receiver.id
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
                                                  sender.photo_url as sender_photo_url, receiver.email as receiver_email,
                                                  receiver.photo_url as receiver_photo_url, sender.username as sender_username, receiver.username as receiver_username
                                           FROM users_transcript ut
                                           INNER JOIN users sender
                                           ON ut.user_sender_id = sender.id
                                           LEFT JOIN users receiver
                                           ON ut.user_receiver_id = receiver.id
                                           WHERE user_sender_id = $1 and ut.id = $2`, params);
    return userTranscript && userTranscript.length ? camelcaseKeys(userTranscript[0]) : null;                        
  }

  async changeViewedTranscript(transcriptId : string){
    return await this.createQueryBuilder()
                     .update(UsersTranscript)
                     .set({ viewed : true})
                     .where("id = :id", { id: transcriptId })
                     .execute();
  }
}
