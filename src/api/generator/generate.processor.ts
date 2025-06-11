import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as ejs from 'ejs';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
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
      const entityFileName = fileName;
      const entityVar = fileName;
      const constantName = className.toUpperCase(); // <--- add this line

      const templateData = {
        name,
        fields,
        className,
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

      console.log('Job processed successfully:', job.id);
      return { status: 'done' };
    } catch (err) {
      console.error('Error in GenerateProcessor:', err);
      throw err;
    }
  }
  // const { name, fields } = job.data;
  // const moduleName = name.toLowerCase();

  // const modulePath = join(__dirname, '..', '..', 'output', moduleName);
  // if (!existsSync(modulePath)) mkdirSync(modulePath, { recursive: true });

  //     for (const tpl of templates) {
  //       const templatePath = join(
  //         __dirname,
  //         'templates',
  //         'module',
  //         tpl.subDir,
  //         `${tpl.fileName}.ejs`,
  //       );
  //       const output = await ejs.renderFile(templatePath, { name, fields });
  //       writeFileSync(join(modulePath, tpl.outputName), output);
  //     }

  //     return { status: 'done' };
  //   }
}
function pluralize(str: string) {
  if (str.endsWith('y')) return str.slice(0, -1) + 'ies';
  if (str.endsWith('s')) return str + 'es';
  return str + 's';
}
