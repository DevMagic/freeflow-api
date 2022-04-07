import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';
  
@Entity()
export class Events extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id : string;

    @Column({ nullable: false, type: 'varchar'})
    title : string;

    @Column({ nullable: true, type: 'varchar' })
    description : string;

    @Column({ nullable: true, type: 'date', name: 'event_date' })
    eventDate : Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}