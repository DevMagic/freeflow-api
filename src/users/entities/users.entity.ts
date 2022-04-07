import { Collectibles } from '../../collectibles/entities/collectibles.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToOne,
    JoinColumn,
} from 'typeorm';
  
@Entity()
export class Users extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id : string;

    @Column({ nullable: false, type: 'varchar', unique : true })
    username : string;

    @Column({ nullable: true, type: 'varchar', name: 'display_name' })
    displayName : string;

    @Column({ nullable: true, type: 'varchar' })
    email : string;

    @Column({ nullable: false, type: 'varchar' })
    password : string;

    @Column({ nullable: true, type: 'varchar' })
    phone : string;

    @Column({ nullable: true, type: 'varchar', name: 'photo_url' })
    photoUrl : string;

    @Column({ nullable: true, type: 'varchar' })
    publicKey : string;

    @Column({ nullable: true, type: 'varchar', name: 'collectible_id'})
    collectibleId: string;

    @OneToOne(type => Collectibles, collectible => collectible.id)
    @JoinColumn({ name: 'collectible_id', referencedColumnName: 'id' })
    collectible: Collectibles;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}