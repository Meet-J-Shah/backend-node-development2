import { Controller, Post, Body } from '@nestjs/common';
import { exec } from 'child_process';

@Controller({ path: 'admin/generate-crud', version: '1' })
export class CrudGeneratorController {
  @Post()
  async generateCrud(@Body() body: { name: string; fields: string[] }) {
    const { name, fields } = body;
    if (!name || !fields?.length) {
      return { message: 'Missing name or fields' };
    }

    const args = fields.join(' ');
    console.log('meer');
    const cmd = `npx ts-node src/scripts/generate-crud.ts ${name} ${args}`;

    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(` Error:\n${stderr}`);
          reject({ message: 'Generation failed', error: stderr });
        } else {
          console.log(` Success:\n${stdout}`);
          resolve({
            message: `CRUD for '${name}' generated successfully.`,
            output: stdout,
          });
        }
      });
    });
  }
}
