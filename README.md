


# 🚀 NestJS Auto-CRUD Generator

A powerful **NestJS CRUD code generator** using EJS templates and TypeORM. It automatically generates complete backend modules including entities, services, controllers, DTOs, and migrations based on configuration input.

---

## 📦 Features

- ✅ NestJS modules with:
  - `Entity`, `Service`, `Controller`, `DTO`, `Migration`
- ✅ Advanced TypeORM support:
  - UUID / composite primary keys
  - Soft deletes, timestamps
  - Role-based auditing: `createdBy`, `updatedBy`, `deletedBy`
  - OneToOne, OneToMany, ManyToOne, ManyToMany with full `JoinColumn`/`JoinTable`
- ✅ Configurable via JSON or code
- ✅ Auto-migration generation and execution
- ✅ EJS templating system for full control
- ✅ Enum generation and relation tracking
- ✅ Custom field names, lengths, nullable, unique, default

---

## 🪰 Installation

```bash
npm install
npm install -D ejs ejs-lint
```

---

## ▶️ Usage

### 1. Start Dev Server

```bash
npm run start:dev
```

### 2. Run the Generator

If using Bull queue processor or API:

```ts
// Example: Trigger inside a controller or CLI
this.generateProcessor.handleGenerate({
  name: 'Pizza',
  primaryFields: [
    { name: 'id', dtype: 'uuid', type: 'string' }
  ],
  fields: [
    { name: 'name', type: 'string', dtype: 'varchar', nullable: false },
    { name: 'size', enum: ['SMALL', 'MEDIUM', 'LARGE'], dtype: 'enum' }
  ],
  relations: [
    {
      name: 'owner',
      type: 'ManyToOne',
      target: 'User',
      joinColumn: { name: 'owner_id', referencedColumnName: 'id' }
    }
  ],
  creationConfig: {
    withTimestamps: true,
    withSoftDelete: true,
    operator: true
  }
});
```

> Generated module will be placed at `src/api/pizza/`

---

## ⚙️ CLI Generator Usage (optional)

If you support CLI, add a script like:

```bash
# ./scripts/generate.ts
ts-node src/api/generator/generate.cli.ts --name=Pizza
```

Then run:

```bash
npm run generate Pizza
```

Or define this in `package.json`:

```json
"scripts": {
  "generate": "ts-node src/api/generator/generate.cli.ts"
}
```

---

## 🧹 EJS Template Structure

All templates live in:

```
src/api/generator/templates/module/
```

### Entity (`module.entity.ejs`)

Supports:

- Single/composite primary keys
- UUID detection
- Auto JoinColumns/JoinTables
- Cascade/delete/update behaviors
- Enum support

```ejs
<% if (field.relation) { %>
  @ManyToOne(() => <%= field.relation.target %>)
  @JoinColumn({ name: '<%= field.relation.joinColumn.name %>' })
  <%= field.name %>: <%= field.relation.target %>;
<% } else { %>
  @Column({ name: '<%= snakeCase(field.name) %>', type: '<%= field.dtype %>' })
  <%= field.name %>: <%= field.type %>;
<% } %>
```

---

## 📀 Migrations

Generated in:

```
src/api/<module>/migrations/
```

Run them via:

```bash
npm run migration:generate
npm run migration:run
```

Or programmatically with `DataSource.runMigrations()`.

---

## 🧪 Linting EJS Templates

Install EJS lint:

```bash
npm install -g ejs-lint
```

Run lint:

```bash
ejs-lint src/api/generator/templates/module/entities/module.entity.ejs
```

To debug inside template:

```ejs
<%- JSON.stringify(myObject, null, 2) %>
```

---

## 👤 Role & Permission Support

```ts
@ManyToOne(() => User)
@JoinColumn({ name: 'created_by' })
createdBy: User;

@ManyToMany(() => Role)
@JoinTable({ name: 'user_roles' })
roles: Role[];
```

---

## 💡 Example Output

### Entity Example (Auto-Generated)

```ts
@Entity()
export class Pizza {
  @PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ['SMALL', 'MEDIUM', 'LARGE'] })
  size: 'SMALL' | 'MEDIUM' | 'LARGE';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🛠️ Built With

- [NestJS](https://nestjs.com)
- [TypeORM](https://typeorm.io)
- [EJS Templates](https://ejs.co)
- [BullMQ](https://docs.bullmq.io/)
- [Class-validator](https://github.com/typestack/class-validator)



---

## 👨‍💻 Author

**Meet Shah**\
[GitHub](https://github.com/meetshah-dev) | [LinkedIn](https://linkedin.com)

---

