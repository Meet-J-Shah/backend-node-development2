import { Processor, Process } from '@nestjs/bull';
import * as fs from 'fs';
import { Job } from 'bull';
import { execSync } from 'child_process';
import * as ejs from 'ejs';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as pluralize from 'pluralize';
import { snakeCase, camelCase, upperFirst } from 'lodash';
@Processor('generate-queue')
export class GenerateProcessor {
  @Process('generate-crud')
  async handleGenerate(job: Job) {
    console.log('GenerateProcessor received job:', job.id, job.data);

    try {
      const { name, fields, creationConfig, primaryFields } = job.data;
      const className = name.charAt(0).toUpperCase() + name.slice(1);
      const camelName = className.charAt(0).toLowerCase() + className.slice(1);
      const fileName = name.toLowerCase();
      const dbTableName = name.toLowerCase();
      const fileNamePlural = pluralize(fileName);
      const entityName = className;
      const tableName = className;
      const entityFileName = fileName;
      const entityVar = fileName;
      const timestamp = Date.now();
      const constantName = className.toUpperCase(); // <--- add this line
      const constantFileName = `${camelName}PermissionsConstant`;
      const typeMap = {
        string: 'varchar',
        number: 'decimal(10,2)',
        boolean: 'tinyint',
        Date: 'timestamp',
        int: 'int',
        float: 'float',
        text: 'text',
        uuid: 'char(36)',
      };

      const templateData = {
        name,
        fields,
        primaryFields,
        className,
        tableName,
        dbTableName,
        typeMap,
        creationConfig,
        timestamp,
        camelName,
        constantFileName,
        fileName,
        fileNamePlural,
        entityName,
        entityFileName,
        entityVar,
        constantName, // <--- add this line
        useBcrypt: false,
        relatedEntityClass: '',
        relatedEntityFileName: '',
        hasRoleRelation: false,
        hasUtilsModule: true,
        hasAuthModule: true,
        pluralize,
        snakeCase,
        // ...any more
      };

      const appPath = join(__dirname, '..', '..', '..', '..', 'src', 'api');

      const modulePath = join(appPath, fileName);

      if (!existsSync(modulePath)) {
        mkdirSync(modulePath, { recursive: true });
        console.log('Created directory:', modulePath);
      }

      const templates = [
        {
          subDir: 'entities',
          fileName: 'module.entity',
          outputName: `${fileName}.entity.ts`,
        },
        {
          subDir: '',
          fileName: 'module.controller',
          outputName: `${fileName}.controller.ts`,
        },
        {
          subDir: '',
          fileName: 'module.service',
          outputName: `${fileName}.service.ts`,
        },
        {
          subDir: '',
          fileName: 'module.module',
          outputName: `${fileName}.module.ts`,
        },
        {
          subDir: 'dto',
          fileName: 'module.dto',
          outputName: `${fileName}.dto.ts`,
        },
        {
          subDir: 'constants',
          fileName: 'permission.constant',
          outputName: `permission.constant.ts`,
        },
        {
          subDir: '',
          fileName: 'module.migration',
          outputName: `${timestamp}-create${fileName}Table.ts`,
        },
        {
          subDir: '',
          fileName: 'updatePermission.seeder',
          outputName: `${timestamp}-updatePermissionsTable.seeder.ts`,
        },
      ];
      for (const tpl of templates) {
        const templatePath = join(
          __dirname,
          'templates',
          'module',
          tpl.subDir,
          `${tpl.fileName}.ejs`,
        );
        console.log('Rendering template:', templatePath);

        try {
          const output = await ejs.renderFile(templatePath, templateData);
          if (tpl.fileName == 'module.migration') {
            console.log('Migration is start');
            const outputPath = join('src', 'db', 'migrations', tpl.outputName);
            writeFileSync(outputPath, output);
            console.log('Wrote file:', outputPath);
            const configPath = join(
              __dirname,
              '..',
              '..',
              '..',
              '..',
              'src',
              'configs',
              'migration.config.ts',
            );

            const fileName2 = `${timestamp}-create${fileName}Table`;
            const className = `Create${name}Table${timestamp}`;

            const importLine = `import { ${className} } from '../db/migrations/${fileName2}';`;

            // Read current config
            let configText = readFileSync(configPath, 'utf-8');

            // Prevent duplicate import
            if (!configText.includes(className)) {
              // Add import line at top
              configText = `${importLine}\n${configText}`;

              // Inject into export default array
              configText = configText.replace(
                /export default\s*\[/,
                `export default [\n  ${className},`,
              );

              // Write back
              writeFileSync(configPath, configText);
              console.log(
                ` Migration class "${className}" added to migration.config.ts`,
              );
            } else {
              console.log(' Migration already exists in config.');
            }
          }
          if (tpl.fileName == 'updatePermission.seeder') {
            console.log('Migration is start');
            const outputPath = join('src', 'db', 'seeders', tpl.outputName);
            writeFileSync(outputPath, output);
            console.log('Wrote file:', outputPath);
          } else {
            const subDirPath = join(modulePath, tpl.subDir);
            if (!existsSync(subDirPath)) {
              mkdirSync(subDirPath, { recursive: true });
              console.log('Created directory:', subDirPath);
            }
            const outputPath = join(subDirPath, tpl.outputName);

            writeFileSync(outputPath, output);
            console.log('Wrote file:', outputPath);
          }
        } catch (err) {
          console.error('Template/render error with', templatePath, err);
        }
      }
      try {
        const path = join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'src',
          'api',
          'api.module.ts',
        );
        let content = fs.readFileSync(path, 'utf-8');

        const className2 = `${className}Module`;
        const importPath = `./${fileName}/${fileName}.module`;

        // Add import line
        if (!content.includes(importPath)) {
          content =
            `import { ${className2} } from '${importPath}';\n` + content;
        }

        // Insert into imports array
        content = content.replace(
          /imports:\s*\[/,
          `imports: [\n    ${className2},`,
        );

        fs.writeFileSync(path, content);

        // change entity config.ts

        const entityPath = join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'src',
          'configs',
          'entity.config.ts',
        );

        let content2 = fs.readFileSync(entityPath, 'utf-8');

        const importLine = `import { ${name} } from '../api/${fileName}/entities/${fileName}.entity';`;
        if (!content2.includes(importLine)) {
          content2 = `${importLine}\n` + content2;
        }

        const exportRegex = /export\s+default\s+\[\s*([\s\S]*?)\s*\];/m;
        const match = exportRegex.exec(content2);
        if (match) {
          const currentEntities = match[1];
          if (!currentEntities.includes(entityName)) {
            const newEntities = currentEntities.trim()
              ? `${currentEntities.trim()},\n  ${entityName}`
              : `  ${entityName}`;
            const newExport = `export default [\n  ${newEntities}\n];`;
            content2 = content2.replace(exportRegex, newExport);
          }
        }

        fs.writeFileSync(entityPath, content2);
      } catch (err) {
        console.error('Error in updating api module', err);
      }
      for (const field of fields) {
        if (
          field.relation &&
          (!field.relation.uniDirectional || field.relation.type == 'OneToMany')
        ) {
          // console.log('mj', field);
          const moduleName = field.relation.target.toLowerCase();
          const relationModulePath = join(
            appPath,
            moduleName,
            'entities',
            `${moduleName}.entity.ts`,
          );
          // console.log(relationModulePath);
          let content = fs.readFileSync(relationModulePath, 'utf-8');

          const importLine = `import { ${name} } from '../../${fileName}/entities/${fileName}.entity';\n`;
          if (!content.includes(name)) {
            content = importLine + content;
          }
          let propertyBlock = '';
          const inverseName =
            field.relation.inverseSide ||
            `${fileName}${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`;
          // 2. Create the property block
          if (field.relation.type == 'OneToOne') {
            propertyBlock = `
            @OneToOne(() => ${name}, (${fileName}) => ${fileName}.${field.name})
          ${inverseName}: ${name};`;
          } else if (field.relation.type == 'OneToMany') {
            let joinColumnBlock = '';
            if (
              field.relation.joinColumn?.name ||
              field.relation.joinColumn?.referencedColumnName
            ) {
              joinColumnBlock = `${JSON.stringify(field.relation.joinColumn, null, 2)}\n`;
            }
            const options: string[] = [];
            if (
              field.relation.cascade !== undefined ||
              field.relation.type !== 'ManyToOne'
            )
              options.push(`cascade: ${field.relation.cascade}`);
            if (field.relation.onDelete)
              options.push(`onDelete: '${field.relation.onDelete}'`);
            if (field.relation.onUpdate)
              options.push(`onUpdate: '${field.relation.onUpdate}'`);
            if (field.relation.nullable !== undefined)
              options.push(`nullable: ${field.relation.nullable}`);
            if (primaryFields && primaryFields.length > 1) {
              const referencedColumns: string[] = [];
              const referencedColumns2: string[] = [];
              const columnBlock = primaryFields
                .map((primaryField) => {
                  referencedColumns.push(primaryField.name);
                  referencedColumns2.push(
                    `${dbTableName}_${primaryField.dbName || snakeCase(primaryField.name)}`,
                  );
                  const columnName = `${dbTableName}_${primaryField.dbName || snakeCase(primaryField.name)}`;
                  let typeBlock;
                  if (primaryField?.dtype === 'uuid') {
                    const lengthblock2 = ', length: 36';
                    const type = 'char';
                    typeBlock = `'${type}' ${lengthblock2} `;
                  } else {
                    typeBlock = `'${primaryField?.dtype || 'bigint'}'`;
                  }
                  const aliasName = `${dbTableName}${upperFirst(camelCase(primaryField.name))}`;
                  const type = primaryField.type || 'string';

                  return `@Column({ name: '${columnName}', type: ${typeBlock}, nullable: true })
            ${aliasName}?: ${type};`;
                })
                .join('\n\n'); // Join multiple column blocks
              let joinColumnsBlock = '';

              referencedColumns.forEach((refCol, index) => {
                joinColumnsBlock += `{ name: '${referencedColumns2[index]}', referencedColumnName: '${refCol}' }`;
                if (index < referencedColumns.length - 1) {
                  joinColumnsBlock += ',\n  ';
                }
              });

              propertyBlock = `@ManyToOne(() => ${name}, (${fileName}) => ${fileName}.${field.name} ${options.length ? `, {\n  ${options.join(',\n  ')}\n}` : ''})
              @JoinColumn([ ${joinColumnsBlock} ]) ${inverseName}: ${name}; ${columnBlock}`;
            } else {
              let typeBlock;
              if (primaryFields[0]?.dtype === 'uuid') {
                const lengthblock2 = ', length: 36';
                const type = 'char';
                typeBlock = `'${type}' ${lengthblock2} `;
              } else {
                typeBlock = `'${primaryFields[0]?.dtype || 'bigint'}'`;
              }
              if (
                field.relation.joinColumn?.referencedColumnName === undefined ||
                field.relation.joinColumn?.referencedColumnName ===
                  primaryFields[0].name
              ) {
              } else {
                let nameBlock = ``;
                if (field.relation.joinColumn?.name) {
                  nameBlock = `name: '${field.relation.joinColumn?.name}',`;
                }
                joinColumnBlock = ` { ${nameBlock}
                    referencedColumnName: '${primaryFields[0]?.name || 'id'}',
                  }`;
              }
              propertyBlock = `@ManyToOne(() => ${name}, (${fileName}) => ${fileName}.${field.name} ${options.length ? `, {\n  ${options.join(',\n  ')}\n}` : ''})
              @JoinColumn( ${joinColumnBlock} ) ${inverseName}: ${name};
              @Column({ name: '${field.relation.joinColumn?.name || snakeCase(field.inverseName) + '_id'}', type: ${typeBlock}, nullable: true })
              ${inverseName}Id?: string;`;
            }
          } else if (field.relation.type == 'ManyToOne') {
            propertyBlock = `
            @OneToMany(() => ${name}, (${fileName}) => ${fileName}.${field.name})
           ${inverseName}: ${name}[];`;
          } else if (field.relation.type == 'ManyToMany') {
            propertyBlock = `
            @ManyToMany(() => ${name}, (${fileName}) => ${fileName}.${field.name})
         ${inverseName}: ${name}[];`;
          } else {
            console.error('Invalid Relation Type');
          }

          const insertIndex = content.lastIndexOf('}');
          content =
            content.slice(0, insertIndex) +
            propertyBlock +
            '\n}' +
            content.slice(insertIndex + 1);

          // Match the relationalFields block
          const match = content.match(
            /static\s+relationalFields\s*=\s*{([\s\S]*?)}\s+as\s+const;/,
          );
          if (!match) {
            const insertIndex = content.lastIndexOf('}');
            const relationalBlock = `\n  static relationalFields = {\n    ${inverseName}: true\n  } as const;\n`;
            content =
              content.slice(0, insertIndex) +
              relationalBlock +
              content.slice(insertIndex);
          } else {
            const fieldsBlock = match[1].trim().replace(/,?\s*$/, '');
            const newRelationalFields = `static relationalFields = {\n  ${fieldsBlock},\n   ${inverseName} : true\n} as const;`;

            content = content.replace(
              /static\s+relationalFields\s*=\s*{[\s\S]*?}\s*as\s+const\s*;/,
              newRelationalFields,
            );
          }

          fs.writeFileSync(relationModulePath, content);
        }
      }
      execSync('npm run build');
      execSync('npm run format');
      execSync(
        `npx typeorm-ts-node-commonjs migration:run -d dist/src/data-source.js`,
        {
          stdio: 'inherit',
        },
      );
      execSync('npm run seed:config');
      execSync('npm run seed:run');

      console.log('Job processed successfully:', job.id);
      await job.moveToCompleted('done', true);
      return { status: 'done' };
    } catch (err) {
      console.error('Error in GenerateProcessor:', err);
      await job.moveToFailed(err);
      throw err;
    }
  }
}
