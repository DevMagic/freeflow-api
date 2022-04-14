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
import { CollectibleType } from '../enums/collectibles.enum';

@Entity()
export class Collectibles extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: 'uuid', name: 'event_id' })
    eventId: string;

    @Column({ nullable: false, type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ nullable: false, type: 'varchar', name: 'author_name' })
    authorName: string;

    @Column({ nullable: false, type: 'varchar', name: 'qr_code_image_url' })
    qrCodeImageUrl: string;

    @Column({ nullable: false, type: 'varchar', name: 'contract_address' })
    contractAddress: string;

    @Column({ nullable: false, type: 'numeric', name: 'token_id' })
    tokenId: number;

    @ManyToOne(type => Users, users => users.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    @ManyToOne(type => Events, events => events.id)
    @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
    event: Events;

    @Column({ name: 'collectible_type', type: 'enum', enum: CollectibleType })
    collectibleType: string;

    @Column({ nullable: true, type: 'varchar', name: 'image_url' })
    imageUrl : string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}