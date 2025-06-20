import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreatePizzaTable1750393788998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pizza',
        columns: [
          {
            name: 'db_name',

            type: 'bigint',

            isPrimary: true,
          },

          {
            name: 'my_id',

            type: 'int',

            isPrimary: true,
          },

          {
            name: 'third_id',

            type: 'char',
            length: '36',

            isPrimary: true,
          },

          {
            name: 'second_id',

            type: 'bigint',

            isPrimary: true,
          },

          {
            name: 'name',

            type: 'varchar',

            length: '255',
            isNullable: false,
          },

          {
            name: 'email',

            type: 'varchar',

            default: "'meet@gmail.com'",

            length: '255',
            isNullable: false,
            isUnique: true,
          },

          {
            name: 'age',

            type: 'int',

            isNullable: true,
          },

          {
            name: 'size',

            type: "enum('SMALL','MEDIUM','LARGE')",

            default: "'MEDIUM'",

            isNullable: true,
          },

          {
            name: 'spice',

            type: "enum('LOW','MILD','HIGH')",

            isNullable: false,
          },

          {
            name: 'owner_id',
            type: 'bigint',
            isNullable: true,
          },

          {
            name: 'created_by_role_id2',
            type: 'bigint',
            isNullable: true,
          },

          {
            name: 'last_edited_by_id',
            type: 'bigint',
            isNullable: true,
          },

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },

          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: true,
          },

          {
            name: 'deleted_by',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign keys
    await queryRunner.createForeignKeys('pizza', [
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['deleted_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),

      new TableForeignKey({
        columnNames: ['created_by_role_id2'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),

      new TableForeignKey({
        columnNames: ['last_edited_by_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    ]);

    // Join tables

    await queryRunner.addColumns('role', [
      new TableColumn({
        name: 'pizza_db_name',

        type: 'bigint',

        isNullable: true,
      }),

      new TableColumn({
        name: 'pizza_my_id',

        type: 'int',

        isNullable: true,
      }),

      new TableColumn({
        name: 'pizza_third_id',

        type: 'char',
        length: '36',

        isNullable: true,
      }),

      new TableColumn({
        name: 'pizza_second_id',

        type: 'bigint',

        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'role',
      new TableForeignKey({
        columnNames: [
          'pizza_db_name',
          'pizza_my_id',
          'pizza_third_id',
          'pizza_second_id',
        ],
        referencedTableName: 'pizza',
        referencedColumnNames: ['db_name', 'my_id', 'third_id', 'second_id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'role_permission_map123',

        columns: [
          {
            name: 'pizza_id',
            type: 'bigint',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_my_id',
            type: 'int',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_third_id',
            type: 'char',

            length: '36',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_second_id',
            type: 'bigint',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'permission_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: [
              'pizza_id',
              'pizza_my_id',
              'pizza_third_id',
              'pizza_second_id',
            ],
            referencedTableName: 'pizza',
            referencedColumnNames: [
              'db_name',
              'my_id',
              'third_id',
              'second_id',
            ],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['permission_id'],
            referencedTableName: 'permission',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'Pizza_related_roles_map',

        columns: [
          {
            name: 'pizza_db_name',

            type: 'bigint',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_my_id',

            type: 'int',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_third_id',

            type: 'char',
            length: '36',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'pizza_second_id',

            type: 'bigint',

            isNullable: false,
            isPrimary: true,
          },

          {
            name: 'role_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: [
              'pizza_db_name',
              'pizza_my_id',
              'pizza_third_id',
              'pizza_second_id',
            ],
            referencedTableName: 'pizza',
            referencedColumnNames: [
              'db_name',
              'my_id',
              'third_id',
              'second_id',
            ],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['role_id'],
            referencedTableName: 'role',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pizza');
  }
}
