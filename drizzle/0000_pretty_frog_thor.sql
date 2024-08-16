CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exchange` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`products_price_id` text NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`products_price_id`) REFERENCES `products_price`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_details` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`client_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`total_purchase` real NOT NULL,
	`total_sale` real NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_order_detail` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`products_price_id` text NOT NULL,
	`order_detail_id` text NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`products_price_id`) REFERENCES `products_price`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_order_detail_to_order_details` (
	`product_order_detail_id` text NOT NULL,
	`order_detail_id` text NOT NULL,
	PRIMARY KEY(`order_detail_id`, `product_order_detail_id`),
	FOREIGN KEY (`product_order_detail_id`) REFERENCES `product_order_detail`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_detail_id`) REFERENCES `order_details`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products_price` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`purchase_price` real NOT NULL,
	`sales_price` real NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_name_unique` ON `products` (`name`);