import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSettingTable1724933679903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "setting",
                columns: [
                    {
                        name: "id",
                        type: "bigInt",
                        isPrimary: true,
                        isGenerated: true,
                        generatedType: "STORED",
                        generationStrategy: "increment",
                    },
                    {
                        name: "label",
                        type: "varchar",
                        length: "200",
                    },
                    {
                        name: "key",
                        type: "varchar",
                        length: "200",
                    },
                    {
                        name: "value",
                        type: "varchar",
                        length: "200"
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["file", "string", "number"],
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        isNullable: false,
                        default: 'current_timestamp()',
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        isNullable: true,
                    },
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("setting", true, true);
    }

}
