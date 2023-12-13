CREATE TABLE `tickets` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`subject` varchar(255),
	`message` text DEFAULT (''),
	`attachment` varchar(255),
	`dateCreated` timestamp(3) DEFAULT (now()),
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
