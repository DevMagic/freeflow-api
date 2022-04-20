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

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id : string;

  @ManyToOne(type => Users, users => users.id)
  @JoinColumn({name : 'user_id', referencedColumnName: 'id'})
  userId: Users;

  @Column({ name: 'amount', nullable: false, type: 'numeric', default: 0 })
  amount: number;

  @Column({ name: 'wallet_address', nullable: false, type: 'varchar', default: 0 })
  walletAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  email : string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
