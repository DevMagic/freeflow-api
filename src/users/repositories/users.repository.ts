import { HttpException, Injectable } from "@nestjs/common";
import { EntityRepository, Repository, UpdateResult, getConnection, ILike } from "typeorm";
import * as camelcaseKeys from 'camelcase-keys';
import { Users } from "../entities/users.entity";

@Injectable()
@EntityRepository(Users)
export class UsersRepository extends Repository<Users>{

    constructor() {
        super();
    }

    async createOrUpdateUser(userData) {
        if (!userData.password && userData.hasOwnProperty('password')) {
            delete userData.password;
        }
        const user = this.create();
        Object.assign(user, userData);
        return await this.save(user);
    }

    async createNewUser(userData){
        const user = this.create();
        Object.assign(user, userData);
        return await this.save(user);
    }

    async getUserByEmail(email: string) : Promise<Users> {
        const user = await this.findOne({
          where: { email },
        });
        return user;
    }

    async getUserByUsername(username: string) : Promise<Users> {
        const user = await this.findOne({
          where: { username },
        });
        return user;
    }

}