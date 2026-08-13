CREATE TABLE `analytics_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`snapshot_type` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`timezone` text DEFAULT 'Asia/Dhaka' NOT NULL,
	`payload_json` text NOT NULL,
	`is_synthetic` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_snapshots_type_period` ON `analytics_snapshots` (`snapshot_type`,`period_end`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_key` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_actor_created` ON `audit_logs` (`actor_key`,`created_at`);--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_paisa` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cart_items_cart_product` ON `cart_items` (`cart_id`,`product_slug`);--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_key` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_carts_customer_status` ON `carts` (`customer_key`,`status`);--> statement-breakpoint
CREATE TABLE `events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`anonymous_id` text,
	`session_id` text,
	`user_key` text,
	`entity_type` text,
	`entity_id` text,
	`properties_json` text DEFAULT '{}' NOT NULL,
	`occurred_at` text NOT NULL,
	`received_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_name_occurred` ON `events` (`event_name`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `idx_events_session_occurred` ON `events` (`session_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`product_name_snapshot` text NOT NULL,
	`sku_snapshot` text NOT NULL,
	`batch_code_snapshot` text,
	`quantity` integer NOT NULL,
	`unit_price_paisa` integer NOT NULL,
	`unit_landed_cost_paisa` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`tracking_code` text NOT NULL,
	`customer_key` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_mobile_masked` text NOT NULL,
	`destination` text NOT NULL,
	`delivery_method` text NOT NULL,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'staging_not_captured' NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`subtotal_paisa` integer NOT NULL,
	`discount_paisa` integer DEFAULT 0 NOT NULL,
	`delivery_paisa` integer DEFAULT 0 NOT NULL,
	`total_paisa` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_tracking_code_unique` ON `orders` (`tracking_code`);--> statement-breakpoint
CREATE INDEX `idx_orders_customer_created` ON `orders` (`customer_key`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_status_created` ON `orders` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `recommendation_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`recommendation_id` text NOT NULL,
	`actor_key` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_recommendation_actions_rec` ON `recommendation_actions` (`recommendation_id`);--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`priority` text NOT NULL,
	`title` text NOT NULL,
	`reason` text NOT NULL,
	`expected_impact` text NOT NULL,
	`confidence` integer NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`is_synthetic` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
