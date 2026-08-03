CREATE TABLE `brand` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo` text,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brand_name_unique` ON `brand` (`name`);--> statement-breakpoint
CREATE TABLE `shoe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_id` integer NOT NULL,
	`model` text NOT NULL,
	`variant` text,
	`price` integer NOT NULL,
	`scenarios` text NOT NULL,
	`stiffness` text NOT NULL,
	`width` text NOT NULL,
	`level` text NOT NULL,
	`downturn` text NOT NULL,
	`closure` text NOT NULL,
	`material` text,
	`images` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`submitted_by` text,
	`reviewed_by` text,
	`reject_reason` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brand`(`id`) ON UPDATE no action ON DELETE no action
);
