import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
console.log('In the script');
type Field = {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
};

const name = process.argv[2];
const rawFields = process.argv.slice(3);

if (!name || rawFields.length === 0) {
  console.error(
    ` Usage: npm run generate:crud user name:string age:number:nullable isActive:boolean:default=true`,
  );
  process.exit(1);
}

const className = name.charAt(0).toUpperCase() + name.slice(1);
const entityPath = `src/${name}/entities`;
const dtoPath = `src/${name}/dto`;
const entityFile = `${className}.entity.ts`;

const typeMap: Record<string, string> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'Date',
};

const dbTypeMap: Record<string, string> = {
  string: 'varchar',
  number: 'int',
  boolean: 'boolean',
  date: 'timestamp',
};

function parseField(raw: string): Field {
  const [name, type, ...rest] = raw.split(':');
  const nullable = rest.includes('nullable');
  const defaultPart = rest.find((x) => x.startsWith('default='));
  const defaultValue = defaultPart?.split('=')[1];
  return { name, type, nullable, defaultValue };
}

const fields = rawFields.map(parseField);

// 1. Generate Resource
execSync(`nest g resource ${name} --no-spec --skip-import`, {
  stdio: 'inherit',
});

// 2. Generate Entity
if (!fs.existsSync(entityPath)) fs.mkdirSync(entityPath, { recursive: true });

const entityLines = fields
  .map((field) => {
    const tsType = typeMap[field.type] || 'string';
    const dbType = dbTypeMap[field.type] || 'varchar';
    const colOptions: string[] = [`type: '${dbType}'`];
    if (field.nullable) colOptions.push('nullable: true');
    if (field.defaultValue !== undefined) {
      const val =
        isNaN(Number(field.defaultValue)) &&
        field.defaultValue !== 'true' &&
        field.defaultValue !== 'false'
          ? `'${field.defaultValue}'`
          : field.defaultValue;
      colOptions.push(`default: ${val}`);
    }

    return `  @Column({ ${colOptions.join(', ')} })\n  ${field.name}${field.nullable ? '?' : ''}: ${tsType};`;
  })
  .join('\n\n');

const entityCode = `
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${className} {
  @PrimaryGeneratedColumn()
  id: number;

${entityLines}
}
`.trim();

fs.writeFileSync(path.join(entityPath, entityFile), entityCode);
console.log(` Entity written to ${entityPath}/${entityFile}`);

// 3. Generate DTOs
if (!fs.existsSync(dtoPath)) fs.mkdirSync(dtoPath, { recursive: true });

const dtoFields = fields
  .map((field) => {
    const tsType = typeMap[field.type] || 'string';
    return `  ${field.name}${field.nullable ? '?' : ''}: ${tsType};`;
  })
  .join('\n');

fs.writeFileSync(
  path.join(dtoPath, `create-${name}.dto.ts`),
  `export class ${className}Dto {\n${dtoFields}\n}`,
);
fs.writeFileSync(
  path.join(dtoPath, `update-${name}.dto.ts`),
  `import { ${className}Dto } from './create-${name}.dto';\n\nexport class Update${className}Dto implements Partial<${className}Dto> {}\n`,
);

console.log(` DTOs written to ${dtoPath}`);

// 4. Generate Migration
execSync(
  `npm run migration:generate -- src/migrations/Create${className}Table`,
  {
    stdio: 'inherit',
  },
);

console.log(
  `🎉 Done! Entity, DTOs, and migration for '${className}' generated.`,
);
