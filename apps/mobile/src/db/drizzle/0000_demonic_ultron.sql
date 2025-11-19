CREATE TABLE `networks` (
	`createdAt` text DEFAULT (CURRENT_DATE),
	`endpoint` text NOT NULL,
	`endpointSubscriptions` text,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`updatedAt` text DEFAULT (CURRENT_DATE)
);
