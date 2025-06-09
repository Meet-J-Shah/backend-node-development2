/* eslint-disable prefer-const */
import { Seeder, Factory } from 'typeorm-seeding';
import { Permission } from '../../api/permission/entities/permission.entity';
import { Role } from '../../api/role/entities/role.entity';
import { DataSource } from 'typeorm';

export default class PermissionSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    const permission = await connection.manager
      .createQueryBuilder(Permission, 'permission')
      .getOne();
    const superAdmin: Role = await connection.manager
      .createQueryBuilder(Role, 'role')
      .where('role.id = :id', { id: 1 })
      .getOne();
    const editor: Role = await connection.manager
      .createQueryBuilder(Role, 'role')
      .where('role.id = :id', { id: 3 })
      .getOne();

    if (!permission) {
      let createdPermissions = await connection
        .createQueryBuilder()
        .insert()
        .into(Permission)
        .values([
          { module: 'Role', action: 'Find All', slug: 'admin::role::findAll' },
          { module: 'Role', action: 'Find One', slug: 'admin::role::findOne' },
          { module: 'Role', action: 'Create', slug: 'admin::role::create' },
          { module: 'Role', action: 'Update', slug: 'admin::role::update' },
          { module: 'Role', action: 'Publish', slug: 'admin::role::publish' },
          {
            module: 'Role',
            action: 'Soft Delete',
            slug: 'admin::role::softDelete',
          },
          {
            module: 'Role',
            action: 'Rallback Delete',
            slug: 'admin::role::rollback',
          },
          {
            module: 'Role',
            action: 'Hard Delete',
            slug: 'admin::role::hardDelete',
          },
          {
            module: 'Role',
            action: 'Add Permission',
            slug: 'admin::role::addPermission',
          },
          {
            module: 'Role',
            action: 'Update Permission',
            slug: 'admin::role::updatePermission',
          },
          {
            module: 'Role',
            action: 'Remove Permission',
            slug: 'admin::role::removePermission',
          },
          {
            module: 'Permission',
            action: 'Find All',
            slug: 'admin::permission::findAll',
          },
          { module: 'User', action: 'Find All', slug: 'admin::user::findAll' },
          { module: 'User', action: 'Find One', slug: 'admin::user::findOne' },
          { module: 'User', action: 'Create', slug: 'admin::user::create' },
          { module: 'User', action: 'Update', slug: 'admin::user::update' },
          { module: 'User', action: 'Publish', slug: 'admin::user::publish' },
          {
            module: 'User',
            action: 'Soft Delete',
            slug: 'admin::user::softDelete',
          },
          {
            module: 'User',
            action: 'Hard Delete',
            slug: 'admin::user::hardDelete',
          },
        ])
        .execute();

      if (createdPermissions?.generatedMaps.length) {
        for (let permissionData of createdPermissions.generatedMaps) {
          await connection
            .createQueryBuilder()
            .relation(Permission, 'roles')
            .of(permissionData.id)
            .add(superAdmin.id);
          if ([11, 12, 13, 14, 15].includes(Number(permissionData.id))) {
            await connection
              .createQueryBuilder()
              .relation(Permission, 'roles')
              .of(permissionData.id)
              .add(editor.id);
          }
        }
      }
    }
    return;
  }
}
