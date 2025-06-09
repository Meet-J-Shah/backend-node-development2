INSERT INTO `boilerplate`.`user`
(`id`, `email`, `password`, `first_name`, `last_name`, `published_at`)
VALUES
(1, "admin@boilerplate.com", "$2b$10$79ElvYGUvP4WT0X6zRrbD.mj.rUaGglYFRFQsGJLePJjv5HAlehOi", "Super", "Admin", "2024-07-12 15:26:33.233574"),
(2, "editor@boilerplate.com", "$2b$10$79ElvYGUvP4WT0X6zRrbD.mj.rUaGglYFRFQsGJLePJjv5HAlehOi", "Editor", "Admin", "2024-07-12 15:26:33.233574");

-- ----------| user role |----------
INSERT INTO `boilerplate`.`user_role_map`(`user_id`, `role_id`) 
VALUES 
(1, 1),
(2, 3); 