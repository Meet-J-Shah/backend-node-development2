import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialTables1724235882063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // created user table
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generatedType: 'STORED',
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'published_at',
            type: 'datetime',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'current_timestamp()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // created role table
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generatedType: 'STORED',
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_admin',
            type: 'boolean',
            default: false,
          },
          {
            name: 'published_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'current_timestamp()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['created_by'],
            name: 'FK_created_by',
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            columnNames: ['updated_by'],
            name: 'FK_updated_by',
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            columnNames: ['deleted_by'],
            name: 'FK_deleted_by',
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
        ],
      }),
      true,
      true,
    );

    // created user_role_map table
    await queryRunner.createTable(
      new Table({
        name: 'user_role_map',
        columns: [
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'role_id',
            type: 'bigInt',
          },
        ],
      }),
      true,
    );

    // add composite primary key
    await queryRunner.createPrimaryKey('user_role_map', ['user_id', 'role_id']);

    // created permission table
    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generatedType: 'STORED',
            generationStrategy: 'increment',
          },
          {
            name: 'module',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '200',
            isUnique: true,
            comment: 'Format :- admin::module::action	',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'current_timestamp()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // created role_permission_map table
    await queryRunner.createTable(
      new Table({
        name: 'role_permission_map',
        columns: [
          {
            name: 'permission_id',
            type: 'bigInt',
          },
          {
            name: 'role_id',
            type: 'bigInt',
          },
        ],
      }),
      true,
    );

    // add composite primary key
    await queryRunner.createPrimaryKey('role_permission_map', [
      'permission_id',
      'role_id',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_role_map', true, true);
    await queryRunner.dropTable('role_permission_map', true, true);
    await queryRunner.dropTable('permission', true, true);
    await queryRunner.dropTable('role', true, true);
    await queryRunner.dropTable('user', true, true);
  }
}
