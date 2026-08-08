DROP INDEX `review_user_shoe_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `review_user_shoe_size_unique` ON `review` (`user_id`,`shoe_id`,`size_delta`);