ALTER TABLE `products` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `userProducts` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `userProducts` MODIFY COLUMN `productId` varchar(255) NOT NULL;