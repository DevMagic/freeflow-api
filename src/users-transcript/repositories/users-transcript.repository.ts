import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UsersTranscript } from '../entities/users-transcript.entity';
import { CreateUsersTranscriptDto } from '../dto/create-users-transcript.dto';

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
    let filterOffset = 0;
    if(offset != null && offset > 0){
      filterOffset = offset * 20;
    }
    let filterQuery = ''
    if(filter){
      filterQuery = `AND category = '${filter}'`
    }
    let userTranscript = this.query(`SELECT category, amount, gratitude_type, created_at, 
                                    (SELECT username from users u where u.id = ut.user_id) as username, 
                                    (SELECT username from users u where u.id = ut.exchange_user_id) as exchangeUsername 
                                    FROM users_transcript ut
                                    WHERE user_id = '${userId}' ${filterQuery}
                                    ORDER by ut.created_at DESC
                                    LIMIT 20  
                                    OFFSET ${filterOffset}`);
    return await userTranscript;                        
  }
}