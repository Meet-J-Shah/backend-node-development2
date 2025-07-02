


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
## 📁 Project Structure

```sh
└── backend-node-development2.git/
    ├── README.md
    ├── example.env
    ├── nest-cli.json
    ├── ormconfig.ts
    ├── package.json
    ├── src
    │   ├── api
    │   │   ├── api.module.ts
    │   │   ├── auth
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.module.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── constants
    │   │   │   │   └── message.constant.ts
    │   │   │   └── dto
    │   │   │       └── auth.dto.ts
    │   │   ├── crudGenerator
    │   │   │   ├── crudGenerator.controller.ts
    │   │   │   └── crudGenerator.module.ts
    │   │   ├── generator
    │   │   │   ├── dto
    │   │   │   │   └── generate.dto.ts
    │   │   │   ├── generate.controller.ts
    │   │   │   ├── generate.module.ts
    │   │   │   ├── generate.processor.ts
    │   │   │   ├── generate.service.ts
    │   │   │   └── templates
    │   │   │       ├── dto.ejs
    │   │   │       ├── entity.ejs
    │   │   │       ├── module
    │   │   │       ├── module.ejs
    │   │   │       └── service.ejs
    │   │   ├── permission
    │   │   │   ├── constants
    │   │   │   │   ├── message.constant.ts
    │   │   │   │   └── permission.constant.ts
    │   │   │   ├── dto
    │   │   │   │   └── permission.dto.ts
    │   │   │   ├── entities
    │   │   │   │   └── permission.entity.ts
    │   │   │   ├── permission.controller.ts
    │   │   │   ├── permission.module.ts
    │   │   │   └── permission.service.ts
    │   │   ├── role
    │   │   │   ├── constants
    │   │   │   │   ├── message.constant.ts
    │   │   │   │   └── permission.constant.ts
    │   │   │   ├── dto
    │   │   │   │   └── role.dto.ts
    │   │   │   ├── entities
    │   │   │   │   └── role.entity.ts
    │   │   │   ├── role.controller.ts
    │   │   │   ├── role.module.ts
    │   │   │   └── role.service.ts
    │   │   └── user
    │   │       ├── constants
    │   │       │   ├── message.constant.ts
    │   │       │   └── permission.constant.ts
    │   │       ├── dto
    │   │       │   └── user.dto.ts
    │   │       ├── entities
    │   │       │   └── user.entity.ts
    │   │       ├── user.controller.ts
    │   │       ├── user.module.ts
    │   │       └── user.service.ts
    │   ├── app.module.ts
    │   ├── configs
    │   │   ├── database.config.ts
    │   │   ├── entity.config.ts
    │   │   ├── env.config.ts
    │   │   └── migration.config.ts
    │   ├── data-source.ts
    │   ├── db
    │   │   ├── migrations
    │   │   │   ├── 1724235882063-createInitialTables.ts
    │   │   │   └── 1724933679903-createSettingTable.ts
    │   │   ├── queries
    │   │   │   ├── permission.sql
    │   │   │   ├── role.sql
    │   │   │   └── user.sql
    │   │   └── seeders
    │   │       ├── 1724135554772-role.seeder.ts
    │   │       ├── 1724135573930-user.seeder.ts
    │   │       └── 1724135587689-permission.seeder.ts
    │   ├── decorators
    │   │   ├── adminAuth.decorator.ts
    │   │   ├── permission.decorator.ts
    │   │   └── relationValid.decorator.ts
    │   ├── guards
    │   │   ├── adminAuth.guard.ts
    │   │   └── permissionAuth.guard.ts
    │   ├── interceptors
    │   │   └── apiResponse.interceptor.ts
    │   ├── main.ts
    │   ├── scripts
    │   │   └── generate-crud.ts
    │   ├── utils
    │   │   ├── bcrypt
    │   │   │   ├── bcrypt.module.ts
    │   │   │   └── bcrypt.service.ts
    │   │   ├── global
    │   │   │   ├── dto
    │   │   │   │   └── global.dto.ts
    │   │   │   ├── global.module.ts
    │   │   │   └── global.service.ts
    │   │   ├── jwtToken
    │   │   │   ├── jwtToken.dto.ts
    │   │   │   ├── jwtToken.module.ts
    │   │   │   └── jwtToken.service.ts
    │   │   ├── logger
    │   │   │   └── logger.service.ts
    │   │   ├── model
    │   │   │   ├── dto
    │   │   │   │   └── find-one-model.dto.ts
    │   │   │   ├── model.dto.ts
    │   │   │   ├── model.module.ts
    │   │   │   └── model.service.ts
    │   │   ├── relation-utils.ts
    │   │   └── utils.module.ts
    │   └── validators
    │       ├── allowSubtypes.validator.ts
    │       ├── defaultvalue.validator.ts
    │       ├── passwordVail.validator.ts
    │       └── relationValid.validator.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```


### 📂 Project Index
<details open>
	<summary><b><code>BACKEND-NODE-DEVELOPMENT2.GIT/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/tsconfig.build.json'>tsconfig.build.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/nest-cli.json'>nest-cli.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/package.json'>package.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/ormconfig.ts'>ormconfig.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- src Submodule -->
		<summary><b>src</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/data-source.ts'>data-source.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/app.module.ts'>app.module.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/main.ts'>main.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>configs</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/configs/env.config.ts'>env.config.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/configs/migration.config.ts'>migration.config.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/configs/entity.config.ts'>entity.config.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/configs/database.config.ts'>database.config.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>scripts</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/scripts/generate-crud.ts'>generate-crud.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>interceptors</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/interceptors/apiResponse.interceptor.ts'>apiResponse.interceptor.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>decorators</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/decorators/relationValid.decorator.ts'>relationValid.decorator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/decorators/permission.decorator.ts'>permission.decorator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/decorators/adminAuth.decorator.ts'>adminAuth.decorator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>validators</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/validators/allowSubtypes.validator.ts'>allowSubtypes.validator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/validators/defaultvalue.validator.ts'>defaultvalue.validator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/validators/passwordVail.validator.ts'>passwordVail.validator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/validators/relationValid.validator.ts'>relationValid.validator.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>guards</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/guards/adminAuth.guard.ts'>adminAuth.guard.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/guards/permissionAuth.guard.ts'>permissionAuth.guard.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>utils</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/utils.module.ts'>utils.module.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/relation-utils.ts'>relation-utils.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>model</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/model/model.dto.ts'>model.dto.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/model/model.service.ts'>model.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/model/model.module.ts'>model.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/model/dto/find-one-model.dto.ts'>find-one-model.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>jwtToken</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/jwtToken/jwtToken.service.ts'>jwtToken.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/jwtToken/jwtToken.module.ts'>jwtToken.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/jwtToken/jwtToken.dto.ts'>jwtToken.dto.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>logger</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/logger/logger.service.ts'>logger.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>global</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/global/global.module.ts'>global.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/global/global.service.ts'>global.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/global/dto/global.dto.ts'>global.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>bcrypt</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/bcrypt/bcrypt.module.ts'>bcrypt.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/utils/bcrypt/bcrypt.service.ts'>bcrypt.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>api</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/api.module.ts'>api.module.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>generator</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/generate.processor.ts'>generate.processor.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/generate.controller.ts'>generate.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/generate.service.ts'>generate.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/generate.module.ts'>generate.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>templates</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module.ejs'>module.ejs</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/dto.ejs'>dto.ejs</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/service.ejs'>service.ejs</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/entity.ejs'>entity.ejs</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
									<details>
										<summary><b>module</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/module.migration.ejs'>module.migration.ejs</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/module.service.ejs'>module.service.ejs</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/module.module.ejs'>module.module.ejs</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/updatePermission.seeder.ejs'>updatePermission.seeder.ejs</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/module.controller.ejs'>module.controller.ejs</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
											<details>
												<summary><b>constants</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/constants/permission.constant.ejs'>permission.constant.ejs</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
											<details>
												<summary><b>entities</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/entities/module.entity.ejs'>module.entity.ejs</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
											<details>
												<summary><b>dto</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/templates/module/dto/module.dto.ejs'>module.dto.ejs</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/generator/dto/generate.dto.ts'>generate.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>crudGenerator</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/crudGenerator/crudGenerator.module.ts'>crudGenerator.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/crudGenerator/crudGenerator.controller.ts'>crudGenerator.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>role</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/role.service.ts'>role.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/role.module.ts'>role.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/role.controller.ts'>role.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>constants</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/constants/permission.constant.ts'>permission.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/constants/message.constant.ts'>message.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>entities</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/entities/role.entity.ts'>role.entity.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/role/dto/role.dto.ts'>role.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>auth</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/auth/auth.module.ts'>auth.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/auth/auth.service.ts'>auth.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/auth/auth.controller.ts'>auth.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>constants</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/auth/constants/message.constant.ts'>message.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/auth/dto/auth.dto.ts'>auth.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>permission</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/permission.controller.ts'>permission.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/permission.service.ts'>permission.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/permission.module.ts'>permission.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>constants</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/constants/permission.constant.ts'>permission.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/constants/message.constant.ts'>message.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>entities</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/entities/permission.entity.ts'>permission.entity.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/permission/dto/permission.dto.ts'>permission.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>user</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/user.module.ts'>user.module.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/user.controller.ts'>user.controller.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/user.service.ts'>user.service.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>constants</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/constants/permission.constant.ts'>permission.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/constants/message.constant.ts'>message.constant.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>entities</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/entities/user.entity.ts'>user.entity.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>dto</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/api/user/dto/user.dto.ts'>user.dto.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>db</b></summary>
				<blockquote>
					<details>
						<summary><b>seeders</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/seeders/1724135554772-role.seeder.ts'>1724135554772-role.seeder.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/seeders/1724135587689-permission.seeder.ts'>1724135587689-permission.seeder.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/seeders/1724135573930-user.seeder.ts'>1724135573930-user.seeder.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>queries</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/queries/permission.sql'>permission.sql</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/queries/user.sql'>user.sql</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/queries/role.sql'>role.sql</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>migrations</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/migrations/1724933679903-createSettingTable.ts'>1724933679903-createSettingTable.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/src/db/migrations/1724235882063-createInitialTables.ts'>1724235882063-createInitialTables.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- test Submodule -->
		<summary><b>test</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/test/app.e2e-spec.ts'>app.e2e-spec.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Meet-J-Shah/backend-node-development2.git/blob/master/test/jest-e2e.json'>jest-e2e.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
</details>

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with backend-node-development2.git, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm

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
## 📌 Project Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

## 🔰 Contributing

- **💬 [Join the Discussions](https://github.com/Meet-J-Shah/backend-node-development2.git/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Meet-J-Shah/backend-node-development2.git/issues)**: Submit bugs found or log feature requests for the `backend-node-development2.git` project.
- **💡 [Submit Pull Requests](https://github.com/Meet-J-Shah/backend-node-development2.git/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Meet-J-Shah/backend-node-development2.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Meet-J-Shah/backend-node-development2.git/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Meet-J-Shah/backend-node-development2.git">
   </a>
</p>
</details>

---
---

## 👨‍💻 Author

**Meet Shah**\
[GitHub](https://github.com/meetshah-dev) | [LinkedIn](https://linkedin.com)

---

