ALTER TABLE `products` MODIFY COLUMN `quantity` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `status` varchar(255) DEFAULT 'active' NOT NULL;