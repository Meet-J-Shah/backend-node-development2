import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Permission } from '../../api/permission/entities/permission.entity';
import { Role } from '../../api/role/entities/role.entity';
import { pizzaPermissionsConstant } from '../../api/pizza/constants/permission.constant';

export default class Pizza implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const permissionRepo = dataSource.getRepository(Permission);
    const roleRepo = dataSource.getRepository(Role);

    const slugs = Object.values(pizzaPermissionsConstant);

    // Ensure permissions exist
    for (const slug of slugs) {
      const [, module, action] = slug.split('::');
      const exists = await permissionRepo.findOne({ where: { slug } });
      if (!exists) {
        await permissionRepo.insert({
          module,
          action,
          slug,
        });
        console.log(` Inserted permission: ${slug}`);
      }
    }

    // Get "Super Admin" role
    const role = await roleRepo.findOne({ where: { name: 'Super Admin' } });
    if (!role) {
      console.error(' Role "Super Admin" not found!');
      return;
    }

    // Fetch all permission IDs
    const savedPermissions = await permissionRepo.find({
      where: slugs.map((slug) => ({ slug })),
      select: ['id', 'slug'],
    });

    // Link permissions to the Super Admin role (insert-ignore style)
    for (const permission of savedPermissions) {
      await dataSource.query(
        `INSERT IGNORE INTO role_permission_map (role_id, permission_id) VALUES (?, ?)`,
        [role.id, permission.id],
      );
      console.log(` Linked Super Admin with permission: ${permission.slug}`);
    }

    console.log('Completed seeding for Pizza');
  }
}
