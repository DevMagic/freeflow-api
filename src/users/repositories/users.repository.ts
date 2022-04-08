import { HttpException, Injectable } from "@nestjs/common";
import { EntityRepository, Repository, UpdateResult, getConnection, ILike } from "typeorm";
import * as camelcaseKeys from 'camelcase-keys';
import { Users } from "../entities/users.entity";
import { UpdateUserBodyDto } from '../dtos/users.dto';

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

    async getUserById(userId: string): Promise<Users> {
        return this.findOne({
            where: {
               id: userId 
            },
            relations: ['collectible'],
            select: ['createdAt', 'updatedAt', 'displayName', 'username', 'id', 'collectible']
        })
    }

    async updateUserById(userId: string, body: UpdateUserBodyDto): Promise<Users> {
        await this.update(userId, {
            ...(body.collectibleId && {collectibleId: body.collectibleId}),
            ...(body.displayName && {displayName: body.displayName.substring(0, 60)})
        })

        return this.getUserById(userId)
    }

    async getContractByUserId(userId: string): Promise<Users> {
        return this.findOne({
            where:{
                id: userId
            },
            select: ['collectible', 'id'],
            relations: ['collectible']
        })
    }

}