import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';
  
@Entity()
export class Users extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id : string;

    @Column({ nullable: false, type: 'varchar', unique : true })
    username : string;

    @Column({ nullable: true, type: 'varchar' })
    email : string;

    @Column({ nullable: false, type: 'varchar' })
    password : string;

    @Column({ nullable: true, type: 'varchar' })
    phone : string;

    @Column({ nullable: true, type: 'varchar', name: 'photo_url' })
    photoUrl : string;

    @Column({ nullable: false, type: 'varchar' })
    publicKey : string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}