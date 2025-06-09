INSERT INTO `boilerplate`.`permission`
(`id`, `module`, `action`, `slug`)
VALUES
(1, "Role", "Find All", "admin::role::findAll"),
(2, "Role", "Find One", "admin::role::findOne"),
(3, "Role", "Create", "admin::role::create"),
(4, "Role", "Update", "admin::role::update"),
(5, "Role", "Publish", "admin::role::publish"),
(6, "Role", "Soft Delete", "admin::role::softDelete"),
(7, "Role", "Hard Delete", "admin::role::hardDelete"),
(8, "Role", "Add Permission", "admin::role::addPermission"),
(9, "Role", "Remove Permission", "admin::role::removePermission"),
(10, "Permission", "Find All", "admin::permission::findAll"),
(11, "User", "Find All", "admin::user::findAll"),
(12, "User", "Find One", "admin::user::findOne"),
(13, "User", "Create", "admin::user::create"),
(14, "User", "Update", "admin::user::update"),
(15, "User", "Publish", "admin::user::publish"),
(16, "User", "Soft Delete", "admin::user::softDelete"),
(17, "User", "Hard Delete", "admin::user::hardDelete");

INSERT INTO `boilerplate`.`role_permission_map`
(`role_id`, `permission_id`)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15);