CREATE TABLE `products` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(512) NOT NULL,
	`brand` varchar(512) NOT NULL,
	`img` text DEFAULT (''),
	`imgOpenFoodFacts` text DEFAULT (''),
	`dateCreated` timestamp(3) DEFAULT (now()),
	`dateUpdated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProducts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`rating` tinyint NOT NULL,
	`priceRating` tinyint NOT NULL,
	`category` varchar(256) NOT NULL,
	`status` enum('visible','invisible','draft') NOT NULL,
	`dateCreated` timestamp(3) DEFAULT (now()),
	`dateUpdated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `userProducts_id` PRIMARY KEY(`id`)
);
