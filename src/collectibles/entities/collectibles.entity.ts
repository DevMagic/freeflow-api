import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Events } from './events.entity';
import { Users } from '../../users/entities/users.entity';

export enum CollectibleType {
    badge = 'badge',
    ticket = 'ticket'
}

@Entity()
export class Collectibles extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: 'uuid', name: 'event_id' })
    eventId: string;

    @Column({ nullable: false, type: 'uuid', name: 'user_id' })
    userId: string;

    @OneToOne(type => Users, users => users.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    @ManyToOne(type => Events, events => events.id)
    @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
    event: Events;

    @Column({ name: 'collectible_type', type: 'enum', enum: CollectibleType })
    collectibleType: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}