/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

import { Role } from '../../role/entities/role.entity';

import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class Pizza {
  @PrimaryColumn({ type: 'bigint', name: 'db_name' })
  myName: string;

  @PrimaryColumn({ type: 'bigint', name: 'my_id' })
  myId: number;

  @PrimaryColumn({ type: 'char', length: '36', name: 'third_id' })
  thirdId: string;

  @PrimaryColumn({ type: 'bigint', name: 'second_id' })
  secondId: string;

  @Column({
    type: 'varchar',

    name: 'name',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',

    name: 'email',

    nullable: false,
    unique: true,
    default: 'meet@gmail.com',
  })
  email: string;

  @Column({
    type: 'int',

    name: 'age',

    nullable: true,

    default: 0,
  })
  age: number;

  @Column({
    type: 'enum',
    enum: ['SMALL', 'MEDIUM', 'LARGE'],
    name: 'size',

    nullable: true,

    default: 'MEDIUM',
  })
  size: 'SMALL' | 'MEDIUM' | 'LARGE';

  @Column({
    type: 'enum',
    enum: ['LOW', 'MILD', 'HIGH'],
    name: 'spice',

    nullable: false,
  })
  spice: 'LOW' | 'MILD' | 'HIGH';

  @OneToOne(
    () => User,
    (user) => user.upiza,

    {
      cascade: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id', type: 'bigint', nullable: true })
  ownerId?: string;

  @OneToMany(
    () => Role,
    (role) => role.rolePiza,

    {},
  )
  assignedRoles: Role[];

  @ManyToOne(() => Role, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'created_by_role_id2',
    referencedColumnName: 'id',
  })
  createdByRole: Role;

  @Column({ name: 'created_by_role_id2', type: 'bigint', nullable: true })
  createdByRoleId?: string;

  @ManyToMany(
    () => Permission,
    (permission) => permission.permissionPizza,

    {
      cascade: false,
    },
  )
  @JoinTable({
    name: 'role_permission_map123',
    joinColumn: {
      name: 'pizza_id',
      referencedColumnName: 'myId',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  Pizzapermissions: Permission[];

  @ManyToMany(
    () => Role,
    (role) => role.pizzaRelatedRoles,

    {
      cascade: false,
    },
  )
  @JoinTable()
  relatedRoles: Role[];

  @OneToOne(
    () => User,
    (user) => user.pizzaLastEditedBy,

    {
      cascade: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'last_edited_by_id' })
  lastEditedBy: User;

  @Column({ name: 'last_edited_by_id', type: 'bigint', nullable: true })
  lastEditedById?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

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

  static selectFields = {
    id: true,
    name: true,
    email: true,
    age: true,
    size: true,
    spice: true,

    createdAt: true,
    updatedAt: true,

    createdBy: true,
    updatedBy: true,
    // deletedAt is excluded (excluded by @Exclude())
  } as const;

  static relationalFields = {
    owner: true,
    assignedRoles: true,
    createdByRole: true,
    Pizzapermissions: true,
    relatedRoles: true,
    lastEditedBy: true,

    createdBy: true,
    updatedBy: true,
    deletedBy: true,
  } as const;
}
