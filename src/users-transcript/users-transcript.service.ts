import { HttpException, Injectable } from '@nestjs/common';
import { CreateUsersTranscriptDto, GetUsersTranciptDto } from './dto/create-users-transcript.dto';
import { UsersTranscriptRepository } from './repositories/users-transcript.repository';
@Injectable()
export class UsersTranscriptService {

  constructor(
    private readonly userTranscriptRepository: UsersTranscriptRepository,
  ){}

  private async createUsersTranscript(userTranscript: any, userId : string) {
    userTranscript.userSenderId = userId;
    return await this.userTranscriptRepository.createNewUsersTranscript(userTranscript);
  }

  async createFlowerExchange(userTranscript: CreateUsersTranscriptDto, userId : string){
    if(!userTranscript.transferAction){
      throw new HttpException("MANDATORY_FIELD_NOT_FOUND", 404);
    }
    if(userId == userTranscript.userReceiverId){
      throw new HttpException("USER_ID_EQUALS_TO_EXCHANGE_USER_ID", 400);
    }
    await this.createUsersTranscript(userTranscript, userId);
    let newUserId = userTranscript.userReceiverId;
    userTranscript.userReceiverId = userId;
    userTranscript.transferAction = 'received'
    return await this.createUsersTranscript(userTranscript, newUserId); 
  }

  async createGratitude(userTranscript: CreateUsersTranscriptDto, userId : string){
    if(!userTranscript.gratitudeType){
      throw new HttpException("MANDATORY_FIELD_NOT_FOUND", 404);
    }
    return await this.createUsersTranscript(userTranscript, userId );
  }

  async createInteractions(userTranscript: CreateUsersTranscriptDto, userId : string){
    return await this.createUsersTranscript(userTranscript, userId );
  }

  async createNetworkUpdates(userTranscript: CreateUsersTranscriptDto, userId : string){
    return await this.createUsersTranscript(userTranscript, userId );
  }

  async createTranscriptByCategory(userTranscript: CreateUsersTranscriptDto, userId : string){

    if(!userId || !userTranscript.category || userTranscript.amount === null){
      throw new HttpException("MANDATORY_FIELD_NOT_FOUND", 404);
    }

    switch(userTranscript.category){
      case'flower_exchange':
        return await this.createFlowerExchange(userTranscript, userId);
      case'interactions':
        return await this.createInteractions(userTranscript, userId);
      case'network_updates':
        return await this.createNetworkUpdates(userTranscript, userId);
      case'gratitude':
        return await this.createGratitude(userTranscript, userId);
      default:
        return;
    }
  }

  async getUsersTranscript(userId : string, filter : string, offset : number){
    let transcripts = await this.userTranscriptRepository.getUsersTranscript(userId, filter, offset)
    transcripts.map(transcript => {
      if(transcript.createdAt){
        transcript.createdAt = this.convertTime(transcript.createdAt)
        transcript.amount = +transcript.amount
      }
    })
    return transcripts;
  }

  convertTime(transcriptDate : any){
    let currentDate = new Date();
    let timeInMinutes = Math.ceil(Math.abs(((currentDate.getTime() - transcriptDate.getTime())/ 1000)/60));
    var units = {
      "y": 24*60*365,
      "m": 24*60*30,
      "w": 24*60*7,
      "d": 24*60,
      "h" : 60,
      "min": 1
    };
  
    var result = '';
  
    for(var name in units) {
      var p =  Math.floor(timeInMinutes/units[name]);
      if(p >= 1) return result += (p + " " + name);
      timeInMinutes %= units[name];
    }
  
  }

  async getUsersTranscriptById(userId : string, transcriptId : string, changeViewed : string){
    if(changeViewed == "1"){
      await this.userTranscriptRepository.changeViewedTranscript(transcriptId);
    }
    let transcript = await this.userTranscriptRepository.getUsersTranscriptById(userId, transcriptId);
    if(!transcript){
      throw new HttpException("TRANSCRIPT_NOT_FOUND", 404);
    }
    if(transcript.amount && transcript.fee){
      transcript.amount = +transcript.amount
      transcript.fee = +transcript.fee
    }
    return transcript;
  }
}
