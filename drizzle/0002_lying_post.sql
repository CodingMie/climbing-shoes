CREATE TABLE `foot_profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`foot_length` integer NOT NULL,
	`foot_width` text NOT NULL,
	`foot_shape` text NOT NULL,
	`arch` text NOT NULL,
	`instep` text NOT NULL,
	`heel` text NOT NULL,
	`bunion` text NOT NULL,
	`street_size` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
