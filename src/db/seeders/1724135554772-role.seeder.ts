import { Seeder, Factory } from 'typeorm-seeding';
import { Role } from '../../api/role/entities/role.entity';
import { DataSource } from 'typeorm';

export default class RoleSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    console.log('-------IN ROLE SEEDER-------');
    const role = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .getOne();
    if (!role) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values([
          {
            name: 'Super Admin',
            description: 'Top lavel Admin',
            isAdmin: true,
            publishedAt: new Date(),
          },
          {
            name: 'User',
            description: 'Front-end User',
            isAdmin: false,
            publishedAt: new Date(),
          },
          {
            name: 'Editor',
            description: 'Editor User',
            isAdmin: true,
            publishedAt: new Date(),
          },
        ])
        .execute();
    }
    return;
  }
}
