import { Processor, Process } from '@nestjs/bull';
import * as fs from 'fs';
import { Job } from 'bull';
import { execSync } from 'child_process';
import * as ejs from 'ejs';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Processor('generate-queue')
export class GenerateProcessor {
  @Process('generate-crud')
  async handleGenerate(job: Job) {
    console.log('GenerateProcessor received job:', job.id, job.data);

    try {
      const { name, fields } = job.data;
      const className = name.charAt(0).toUpperCase() + name.slice(1);
      const camelName = className.charAt(0).toLowerCase() + className.slice(1);
      const fileName = name.toLowerCase();
      const fileNamePlural = pluralize(fileName);
      const entityName = className;
      const tableName = className;
      const entityFileName = fileName;
      const entityVar = fileName;
      const timestamp = Date.now();
      const constantName = className.toUpperCase(); // <--- add this line
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
        className,
        tableName,
        typeMap,
        timestamp,
        camelName,
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
        // ...any more
      };
      const moduleName = name.toLowerCase();

      const modulePath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'src',
        'api',
        moduleName,
      );

      if (!existsSync(modulePath)) {
        mkdirSync(modulePath, { recursive: true });
        console.log('Created directory:', modulePath);
      }

      const templates = [
        {
          subDir: 'entities',
          fileName: 'module.entity',
          outputName: `${moduleName}.entity.ts`,
        },
        {
          subDir: '',
          fileName: 'module.controller',
          outputName: `${moduleName}.controller.ts`,
        },
        {
          subDir: '',
          fileName: 'module.service',
          outputName: `${moduleName}.service.ts`,
        },
        {
          subDir: '',
          fileName: 'module.module',
          outputName: `${moduleName}.module.ts`,
        },
        {
          subDir: 'dto',
          fileName: 'module.dto',
          outputName: `${moduleName}.dto.ts`,
        },
        {
          subDir: 'constants',
          fileName: 'permission.constant',
          outputName: `permission.constant.ts`,
        },
        {
          subDir: '',
          fileName: 'module.migration',
          outputName: `${timestamp}-create${moduleName}Table.ts`,
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

            const fileName = `${timestamp}-create${moduleName}Table`;
            const className = `Create${name}Table${timestamp}`;

            const importLine = `import { ${className} } from '../db/migrations/${fileName}';`;

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
          const subDirPath = join(modulePath, tpl.subDir);
          if (!existsSync(subDirPath)) {
            mkdirSync(subDirPath, { recursive: true });
            console.log('Created directory:', subDirPath);
          }
          const outputPath = join(subDirPath, tpl.outputName);

          writeFileSync(outputPath, output);
          console.log('Wrote file:', outputPath);
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
        const importPath = `./${moduleName}/${moduleName}.module`;

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
      } catch (err) {
        console.error('Error in updatng api module', err);
      }

      execSync('npm run build');
      execSync('npm run format');
      execSync(
        `npx typeorm-ts-node-commonjs migration:run -d dist/src/data-source.js`,
        {
          stdio: 'inherit',
        },
      );

      // configure the path to add end points

      console.log('Job processed successfully:', job.id);
      return { status: 'done' };
    } catch (err) {
      console.error('Error in GenerateProcessor:', err);
      throw err;
    }
  }
}
function pluralize(str: string) {
  if (str.endsWith('y')) return str.slice(0, -1) + 'ies';
  if (str.endsWith('s')) return str + 'es';
  return str + 's';
}
