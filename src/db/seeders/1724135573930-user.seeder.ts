/* eslint-disable prefer-const */
import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../../api/user/entities/user.entity';
import { Role } from '../../api/role/entities/role.entity';
import { DataSource } from 'typeorm';

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    const user = await connection.manager
      .createQueryBuilder(User, 'user')
      .getOne();
    const superAdmin: Role = await connection.manager
      .createQueryBuilder(Role, 'role')
      .where('role.id = :id', { id: 1 })
      .getOne();
    const editor: Role = await connection.manager
      .createQueryBuilder(Role, 'role')
      .where('role.id = :id', { id: 3 })
      .getOne();

    if (!user) {
      let superAdminUser = await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            email: 'admin@boilerplate.com',
            password:
              '$2b$10$79ElvYGUvP4WT0X6zRrbD.mj.rUaGglYFRFQsGJLePJjv5HAlehOi',
            firstName: 'Super',
            lastName: 'Admin',
            publishedAt: '2024-07-12 15:26:33.233574',
          },
        ])
        .execute();

      if (superAdmin)
        await connection
          .createQueryBuilder()
          .relation(User, 'roles')
          .of(superAdminUser.identifiers[0].id)
          .add(superAdmin.id);

      let editorUser = await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            email: 'editor@boilerplate.com',
            password:
              '$2b$10$79ElvYGUvP4WT0X6zRrbD.mj.rUaGglYFRFQsGJLePJjv5HAlehOi',
            firstName: 'Editor',
            lastName: 'Admin',
            publishedAt: '2024-07-12 15:26:33.233574',
          },
        ])
        .execute();

      if (editor)
        await connection
          .createQueryBuilder()
          .relation(User, 'roles')
          .of(editorUser.identifiers[0].id)
          .add(editor.id);
    }
    return;
  }
}
