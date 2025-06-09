import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id?: string;

  @Column({ type: 'varchar', name: 'name', length: '20', unique: true })
  name: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @Column({
    type: 'boolean',
    name: 'is_admin',
    default: false,
  })
  isAdmin?: boolean = false;

  @Column({ type: 'datetime', name: 'published_at', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date;

  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;

  @Exclude()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy?: User;

  @ManyToMany(() => User, (user: User) => user.id)
  @JoinTable({
    name: 'user_role_map',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  @ManyToMany(() => Permission, (permission: Permission) => permission.id)
  @JoinTable({
    name: 'role_permission_map',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions?: Permission[];

  // static property defining for fields
  static selectFields = {
    id: true,
    name: true,
    description: true,
    isAdmin: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    createdBy: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
    updatedBy: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  } as const;

  // static property defining for relation fields
  static relationalFields = {
    createdBy: true,
    updatedBy: true,
  } as const;
}
