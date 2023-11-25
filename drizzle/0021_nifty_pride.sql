ALTER TABLE `userProducts` MODIFY COLUMN `rating` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `userProducts` MODIFY COLUMN `price` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `userProducts` MODIFY COLUMN `price` tinyint NOT NULL DEFAULT 0;