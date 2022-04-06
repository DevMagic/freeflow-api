import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Events } from './events.entity';

export enum CollectibleType {
    badge = 'badge',
    ticket = 'ticket'
}

@Entity()
export class Collectibles extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: 'varchar', name: 'event_id' })
    eventId: string;

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