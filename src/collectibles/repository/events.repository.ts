import { Repository, EntityRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Events } from '../entities/events.entity';


@Injectable()
@EntityRepository(Events)
export class EventsRepository extends Repository<Events>{

    constructor() {
        super();
    }
    

}