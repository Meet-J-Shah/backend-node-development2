import { Pizza } from '../../pizza/entities/pizza.entity';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'email', length: '200' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', name: 'password', length: '255', select: false })
  password: string;

  @Column({ type: 'varchar', name: 'first_name', length: '50' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: '50' })
  lastName: string;

  @Column({ type: 'datetime', name: 'published_at', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // @ManyToOne(() => User, {
  //   cascade: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'created_by' })
  // createdBy?: User;

  // @ManyToOne(() => User, {
  //   cascade: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'updated_by' })
  // updatedBy?: User;

  // @ManyToOne(() => User, {
  //   cascade: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'SET NULL',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'deleted_by' })
  // private deletedBy?: User;

  @ManyToMany(() => Role, (role: Role) => role.id)
  @JoinTable({
    name: 'user_role_map',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  static selectFields = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
  } as const;

  static relationalFields = {
    roles: true,
    createdBy: true,
    updatedBy: true,
    upiza: true,
    pizzaLastEditedBy: true,
  } as const;

  @OneToOne(() => Pizza, (pizza) => pizza.owner)
  upiza: Pizza;

  @OneToOne(() => Pizza, (pizza) => pizza.lastEditedBy)
  pizzaLastEditedBy: Pizza;
}
