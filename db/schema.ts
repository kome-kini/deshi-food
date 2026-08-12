import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(),
  customerKey: text("customer_key").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_carts_customer_status").on(table.customerKey, table.status),
]);

export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey(),
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull(),
  quantity: integer("quantity").notNull(),
  unitPricePaisa: integer("unit_price_paisa").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_cart_items_cart_product").on(table.cartId, table.productSlug),
]);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  trackingCode: text("tracking_code").notNull().unique(),
  customerKey: text("customer_key").notNull(),
  contactName: text("contact_name").notNull(),
  contactMobileMasked: text("contact_mobile_masked").notNull(),
  destination: text("destination").notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("staging_not_captured"),
  status: text("status").notNull().default("confirmed"),
  subtotalPaisa: integer("subtotal_paisa").notNull(),
  discountPaisa: integer("discount_paisa").notNull().default(0),
  deliveryPaisa: integer("delivery_paisa").notNull().default(0),
  totalPaisa: integer("total_paisa").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_orders_customer_created").on(table.customerKey, table.createdAt),
  index("idx_orders_status_created").on(table.status, table.createdAt),
]);

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull(),
  productNameSnapshot: text("product_name_snapshot").notNull(),
  skuSnapshot: text("sku_snapshot").notNull(),
  batchCodeSnapshot: text("batch_code_snapshot"),
  quantity: integer("quantity").notNull(),
  unitPricePaisa: integer("unit_price_paisa").notNull(),
  unitLandedCostPaisa: integer("unit_landed_cost_paisa"),
}, (table) => [index("idx_order_items_order").on(table.orderId)]);

export const analyticsSnapshots = sqliteTable("analytics_snapshots", {
  id: text("id").primaryKey(),
  snapshotType: text("snapshot_type").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  timezone: text("timezone").notNull().default("Asia/Dhaka"),
  payloadJson: text("payload_json").notNull(),
  isSynthetic: integer("is_synthetic", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_analytics_snapshots_type_period").on(table.snapshotType, table.periodEnd),
]);

export const recommendations = sqliteTable("recommendations", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  priority: text("priority").notNull(),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
  expectedImpact: text("expected_impact").notNull(),
  confidence: integer("confidence").notNull(),
  status: text("status").notNull().default("open"),
  isSynthetic: integer("is_synthetic", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const recommendationActions = sqliteTable("recommendation_actions", {
  id: text("id").primaryKey(),
  recommendationId: text("recommendation_id").notNull().references(() => recommendations.id),
  actorKey: text("actor_key").notNull(),
  action: text("action").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_recommendation_actions_rec").on(table.recommendationId)]);

export const events = sqliteTable("events", {
  eventId: text("event_id").primaryKey(),
  eventName: text("event_name").notNull(),
  anonymousId: text("anonymous_id"),
  sessionId: text("session_id"),
  userKey: text("user_key"),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  propertiesJson: text("properties_json").notNull().default("{}"),
  occurredAt: text("occurred_at").notNull(),
  receivedAt: text("received_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_events_name_occurred").on(table.eventName, table.occurredAt),
  index("idx_events_session_occurred").on(table.sessionId, table.occurredAt),
]);

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actorKey: text("actor_key").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_audit_logs_actor_created").on(table.actorKey, table.createdAt)]);
