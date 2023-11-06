CREATE TABLE `accounts` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	CONSTRAINT `accounts_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`emailVerified` timestamp(3) DEFAULT (now()),
	`image` varchar(255),
	`dateCreated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(255) NOT NULL,
	`ean` varchar(128) NOT NULL,
	`name` varchar(512) NOT NULL,
	`brand` varchar(512) NOT NULL,
	`quantity` varchar(256) DEFAULT '',
	`img` text NOT NULL,
	`imgOpenFoodFacts` text DEFAULT (''),
	`dateCreated` timestamp(3) DEFAULT (now()),
	`dateUpdated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProducts` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`productId` varchar(255) NOT NULL,
	`rating` tinyint NOT NULL,
	`price` float NOT NULL,
	`category` varchar(256) NOT NULL,
	`status` enum('visible','invisible','draft') NOT NULL,
	`dateCreated` timestamp(3) DEFAULT (now()),
	`dateUpdated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `userProducts_id` PRIMARY KEY(`id`)
);
