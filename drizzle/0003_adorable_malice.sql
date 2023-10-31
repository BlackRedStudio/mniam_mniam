ALTER TABLE `userProducts` RENAME COLUMN `priceRating` TO `price`;--> statement-breakpoint
ALTER TABLE `userProducts` MODIFY COLUMN `price` float NOT NULL;