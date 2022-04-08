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

import { Users } from 'src/users/entities/users.entity';

enum Category {
  flower_exchange = 'flower_exchange',
  interactions = 'interactions',
  network_updates = 'network_updates',
  gratitude = 'gratitude',
}

enum TransferAction{
  sent = 'sent',
  received = 'received'
}

enum GratitudeType{
  NFT = 'NFT',
  welcome = 'welcome',
  quest = 'quest'
}

@Entity()
export class UsersTranscript {
  @PrimaryGeneratedColumn("uuid")
  id : string;

  @ManyToOne(type => Users, users => users.id)
  @JoinColumn({name : 'user_sender_id', referencedColumnName: 'id'})
  userSenderId: Users;

  @Column({ nullable: false, type: 'enum', enum: Category })
  category: string;

  @Column({ name : 'gratitude_type', nullable: true, type: 'enum', enum: GratitudeType })
  gratitudeType: string;

  @ManyToOne(type => Users, users => users.id)
  @JoinColumn({name : 'user_receiver_id', referencedColumnName: 'id'})
  userReceiverId: Users;

  @Column({ nullable: false, type: 'numeric', default: 0 })
  amount: number;

  @Column({ name : 'hash_id', nullable: true, type: 'enum', enum: GratitudeType })
  hashId: string;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  fee : number;

  @Column({ nullable: true, type: 'boolean', default: false })
  viewed : boolean;

  @Column({name : 'transfer_action', nullable: true, type: 'enum', enum: TransferAction })
  transferAction : string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
