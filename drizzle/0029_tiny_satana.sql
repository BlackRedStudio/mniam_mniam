ALTER TABLE `users` MODIFY COLUMN `camera` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `camera` tinyint NOT NULL DEFAULT 0;