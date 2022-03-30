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
    filterQuery = `user_id = $1 `
    if(offset != null && offset > 0){
      filterOffset = offset * 20;
    }
    if(filter){
      params.push(filter);
      filterQuery += `AND category = $2`
    }

    let userTranscript = this.query(`SELECT category, amount, gratitude_type, created_at, transfer_action,
                                    (SELECT username from users u where u.id = ut.user_id) as username, 
                                    (SELECT username from users u where u.id = ut.exchange_user_id) as exchange_username,
                                    (SELECT photo_url from users u where u.id = ut.exchange_user_id) as photo_url
                                    FROM users_transcript ut
                                    WHERE ${filterQuery}
                                    ORDER by ut.created_at DESC
                                    LIMIT 20  
                                    OFFSET ${filterOffset}`, params);
    return camelcaseKeys(await userTranscript);                        
  }
}