-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('CUSTOMER', 'OPERATIONS', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ClaimRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'PROHIBITED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EvidenceKind" AS ENUM ('SUPPLIER_DOCUMENT', 'ORIGIN_DOCUMENT', 'PROCESSING_RECORD', 'LAB_REPORT', 'CERTIFICATION', 'LABEL_ARTWORK', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('REGULAR', 'SALE', 'SUBSCRIPTION', 'WHOLESALE');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PLANNED', 'RECEIVED', 'RELEASED', 'ON_HOLD', 'QUARANTINED', 'EXPIRED', 'RECALLED', 'DEPLETED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIPT', 'RESERVATION', 'RELEASE', 'SALE', 'RETURN', 'TRANSFER', 'ADJUSTMENT', 'DAMAGE', 'HOLD', 'UNHOLD', 'EXPIRY', 'RECALL');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'RELEASED', 'ESCALATED_TO_RECALL');

-- CreateEnum
CREATE TYPE "RecallStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKOUT_STARTED', 'CONVERTED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('COD', 'STRIPE', 'BKASH', 'NAGAD', 'ROCKET', 'BANK_CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('REQUIRES_ACTION', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RECEIVED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_DELIVERY', 'BUNDLE_PRICE');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DiscountTarget" AS ENUM ('ORDER', 'DELIVERY', 'ITEM', 'BUNDLE');

-- CreateEnum
CREATE TYPE "MarketingChannel" AS ENUM ('DIRECT', 'ORGANIC_SEARCH', 'PAID_SEARCH', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'EMAIL', 'SMS', 'PUSH', 'AFFILIATE', 'MARKETPLACE', 'OTHER');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('OPTED_IN', 'OPTED_OUT', 'NOT_SET');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "AttributionModel" AS ENUM ('FIRST_TOUCH', 'LAST_TOUCH', 'LINEAR', 'POSITION_BASED', 'DATA_DRIVEN');

-- CreateEnum
CREATE TYPE "MetricPeriod" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('PROMOTE_PRODUCT', 'CREATE_BUNDLE', 'REDUCE_DISCOUNT', 'INCREASE_DISCOUNT', 'RESTOCK', 'TRANSFER_STOCK', 'MARKDOWN_EXPIRING_STOCK');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('OPEN', 'ACCEPTED', 'DISMISSED', 'EXECUTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExperimentUnit" AS ENUM ('USER', 'SESSION', 'CART');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'APPROVE', 'REJECT', 'HOLD', 'RECALL', 'REFUND');

-- CreateEnum
CREATE TYPE "DataQualitySeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DataQualityStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'WAIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "phone_e164" VARCHAR(20),
    "display_name" VARCHAR(160),
    "preferred_locale" VARCHAR(12) NOT NULL DEFAULT 'bn-BD',
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMPTZ(6),
    "phone_verified_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_identities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "provider_subject" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "ip_hash" CHAR(64),
    "user_agent" VARCHAR(512),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "scope" "RoleScope" NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "granted_by" UUID,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "customer_number" VARCHAR(32) NOT NULL,
    "first_order_at" TIMESTAMPTZ(6),
    "last_order_at" TIMESTAMPTZ(6),
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "lifetime_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "lifetime_gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "acquisition_cost_minor" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'HOME',
    "recipient_name" VARCHAR(160) NOT NULL,
    "phone_e164" VARCHAR(20) NOT NULL,
    "line1" VARCHAR(255) NOT NULL,
    "line2" VARCHAR(255),
    "area" VARCHAR(120),
    "city" VARCHAR(120) NOT NULL,
    "district" VARCHAR(120) NOT NULL,
    "division" VARCHAR(120) NOT NULL,
    "postal_code" VARCHAR(20),
    "country_code" CHAR(2) NOT NULL DEFAULT 'BD',
    "delivery_notes" VARCHAR(500),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "slug" VARCHAR(160) NOT NULL,
    "name_bn" VARCHAR(180) NOT NULL,
    "name_en" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producers" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "story_bn" TEXT,
    "story_en" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "producers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "display_name" VARCHAR(200) NOT NULL,
    "tax_identifier_hash" CHAR(64),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processors" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "processors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_locations" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "code" VARCHAR(48) NOT NULL,
    "name_bn" VARCHAR(180) NOT NULL,
    "name_en" VARCHAR(180) NOT NULL,
    "country_code" CHAR(2) NOT NULL DEFAULT 'BD',
    "division" VARCHAR(120),
    "district" VARCHAR(120),
    "upazila" VARCHAR(120),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "source_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" UUID NOT NULL,
    "processor_id" UUID NOT NULL,
    "source_location_id" UUID NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_documents" (
    "id" UUID NOT NULL,
    "kind" "EvidenceKind" NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "sha256" CHAR(64) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "issued_by" VARCHAR(255),
    "issued_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "contains_sensitive_data" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_verifications" (
    "id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "evidence_document_id" UUID,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "review_notes" TEXT,
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "valid_from" TIMESTAMPTZ(6),
    "valid_until" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "producer_id" UUID,
    "supplier_id" UUID,
    "processor_id" UUID,
    "slug" VARCHAR(180) NOT NULL,
    "product_code" VARCHAR(40) NOT NULL,
    "name_bn" VARCHAR(200) NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "short_description_bn" TEXT,
    "short_description_en" TEXT,
    "description_bn" TEXT,
    "description_en" TEXT,
    "storage_instructions" TEXT,
    "shelf_life_days" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "publish_approved" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "subscription_eligible" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(255),
    "seo_description" VARCHAR(320),
    "seo_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku" VARCHAR(64) NOT NULL,
    "barcode" VARCHAR(64),
    "label" VARCHAR(120) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "net_quantity" DECIMAL(12,3) NOT NULL,
    "tax_rate" DECIMAL(6,5) NOT NULL DEFAULT 0,
    "low_stock_threshold" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "reorder_point" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "reorder_quantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "promotion_id" UUID,
    "type" "PriceType" NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "amount_minor" BIGINT NOT NULL,
    "compare_at_amount_minor" BIGINT,
    "cost_amount_minor" BIGINT,
    "valid_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "product_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_allergen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("product_id","name")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "type" "MediaType" NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "alt_bn" VARCHAR(255),
    "alt_en" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sources" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "source_location_id" UUID NOT NULL,
    "evidence_document_id" UUID,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_claims" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "claim_text_bn" TEXT,
    "claim_text_en" TEXT,
    "risk_level" "ClaimRiskLevel" NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "review_notes" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "claim_id" UUID NOT NULL,
    "evidence_document_id" UUID NOT NULL,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("claim_id","evidence_document_id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "evidence_document_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(200) NOT NULL,
    "certificate_number" VARCHAR(120),
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "valid_from" TIMESTAMPTZ(6),
    "valid_until" TIMESTAMPTZ(6),

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_certifications" (
    "product_id" UUID NOT NULL,
    "certification_id" UUID NOT NULL,

    CONSTRAINT "product_certifications_pkey" PRIMARY KEY ("product_id","certification_id")
);

-- CreateTable
CREATE TABLE "lab_reports" (
    "id" UUID NOT NULL,
    "evidence_document_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "laboratory_name" VARCHAR(200) NOT NULL,
    "report_number" VARCHAR(120) NOT NULL,
    "sampled_at" TIMESTAMPTZ(6),
    "reported_at" TIMESTAMPTZ(6),
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "result_summary" JSONB,

    CONSTRAINT "lab_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "source_location_id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_bins" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "description" TEXT,

    CONSTRAINT "warehouse_bins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_batches" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "supplier_id" UUID,
    "producer_id" UUID,
    "processor_id" UUID,
    "facility_id" UUID,
    "source_location_id" UUID,
    "batch_code" VARCHAR(64) NOT NULL,
    "public_trace_token_hash" CHAR(64) NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'PLANNED',
    "origin_verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "processing_verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "production_date" DATE,
    "processing_date" DATE,
    "packaged_date" DATE,
    "best_before_date" DATE,
    "received_at" TIMESTAMPTZ(6),
    "released_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_levels" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity_on_hand" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantity_reserved" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantity_available" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantity_on_hold" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantity_damaged" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "from_warehouse_id" UUID,
    "to_warehouse_id" UUID,
    "from_batch_id" UUID,
    "to_batch_id" UUID,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "unit_cost_minor" BIGINT,
    "reference_type" VARCHAR(60),
    "reference_id" VARCHAR(100),
    "reason" VARCHAR(500),
    "correlation_id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_reservations" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "cart_item_id" UUID,
    "order_item_id" UUID,
    "quantity" DECIMAL(18,3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_holds" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "HoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recalls" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "public_reference" VARCHAR(64) NOT NULL,
    "status" "RecallStatus" NOT NULL DEFAULT 'DRAFT',
    "reason" TEXT NOT NULL,
    "customer_message_bn" TEXT,
    "customer_message_en" TEXT,
    "started_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),

    CONSTRAINT "recalls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trace_events" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "event_type" VARCHAR(80) NOT NULL,
    "public_visible" BOOLEAN NOT NULL DEFAULT false,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "location_label" VARCHAR(200),
    "details" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trace_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL DEFAULT 'Default',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "wishlist_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("wishlist_id","product_id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "anonymous_token_hash" CHAR(64),
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "subtotal_minor" BIGINT NOT NULL DEFAULT 0,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "delivery_minor" BIGINT NOT NULL DEFAULT 0,
    "tax_minor" BIGINT NOT NULL DEFAULT 0,
    "total_minor" BIGINT NOT NULL DEFAULT 0,
    "last_activity_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkout_started_at" TIMESTAMPTZ(6),
    "abandoned_at" TIMESTAMPTZ(6),
    "converted_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "unit_price_minor" BIGINT NOT NULL,
    "unit_cost_minor" BIGINT,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR(32) NOT NULL,
    "user_id" UUID,
    "source_cart_id" UUID,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "fulfillment_status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "subtotal_minor" BIGINT NOT NULL,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "delivery_minor" BIGINT NOT NULL DEFAULT 0,
    "tax_minor" BIGINT NOT NULL DEFAULT 0,
    "total_minor" BIGINT NOT NULL,
    "cost_of_goods_minor" BIGINT NOT NULL DEFAULT 0,
    "gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "customer_email_snapshot" VARCHAR(320) NOT NULL,
    "customer_phone_snapshot" VARCHAR(20) NOT NULL,
    "delivery_address_snapshot" JSONB NOT NULL,
    "billing_address_snapshot" JSONB,
    "placed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "sku_snapshot" VARCHAR(64) NOT NULL,
    "name_bn_snapshot" VARCHAR(200) NOT NULL,
    "name_en_snapshot" VARCHAR(200) NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "unit_price_minor" BIGINT NOT NULL,
    "unit_cost_minor" BIGINT NOT NULL,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "tax_minor" BIGINT NOT NULL DEFAULT 0,
    "line_total_minor" BIGINT NOT NULL,
    "returned_quantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "refunded_minor" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_batch_allocations" (
    "order_item_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,

    CONSTRAINT "order_batch_allocations_pkey" PRIMARY KEY ("order_item_id","batch_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'REQUIRES_ACTION',
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "amount_minor" BIGINT NOT NULL,
    "provider_reference" VARCHAR(255),
    "provider_payment_method" VARCHAR(80),
    "idempotency_key" VARCHAR(160) NOT NULL,
    "authorized_at" TIMESTAMPTZ(6),
    "captured_at" TIMESTAMPTZ(6),
    "failed_at" TIMESTAMPTZ(6),
    "failure_code" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "shipment_number" VARCHAR(40) NOT NULL,
    "provider" VARCHAR(80),
    "provider_reference" VARCHAR(160),
    "tracking_number" VARCHAR(160),
    "tracking_url" VARCHAR(500),
    "status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "delivery_fee_minor" BIGINT NOT NULL DEFAULT 0,
    "estimated_delivery_at" TIMESTAMPTZ(6),
    "shipped_at" TIMESTAMPTZ(6),
    "delivered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_items" (
    "shipment_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("shipment_id","order_item_id")
);

-- CreateTable
CREATE TABLE "shipment_events" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "status" "FulfillmentStatus" NOT NULL,
    "message" VARCHAR(500),
    "location" VARCHAR(200),
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "provider_data" JSONB,

    CONSTRAINT "shipment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "return_number" VARCHAR(40) NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason_code" VARCHAR(80) NOT NULL,
    "customer_notes" TEXT,
    "resolution_notes" TEXT,
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" UUID NOT NULL,
    "return_request_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "batch_id" UUID,
    "quantity" DECIMAL(18,3) NOT NULL,
    "disposition" VARCHAR(80),
    "condition_notes" TEXT,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "payment_id" UUID,
    "return_request_id" UUID,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "amount_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "reason" VARCHAR(500) NOT NULL,
    "provider_reference" VARCHAR(255),
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_items" (
    "refund_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "amount_minor" BIGINT NOT NULL,
    "quantity" DECIMAL(18,3),

    CONSTRAINT "refund_items_pkey" PRIMARY KEY ("refund_id","order_item_id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "order_item_id" UUID,
    "batch_id" UUID,
    "category" VARCHAR(80) NOT NULL,
    "severity" "DataQualitySeverity" NOT NULL DEFAULT 'WARNING',
    "description" TEXT NOT NULL,
    "status" VARCHAR(40) NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "order_item_id" UUID,
    "rating" INTEGER NOT NULL,
    "quality_rating" INTEGER,
    "packaging_rating" INTEGER,
    "delivery_rating" INTEGER,
    "title" VARCHAR(160),
    "body" TEXT,
    "verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "moderation_status" VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    "therapeutic_claim_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_questions" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "moderation_status" VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_answers" (
    "id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answered_by_id" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "evidence_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
    "percentage" DECIMAL(7,4),
    "amount_minor" BIGINT,
    "bundle_price_minor" BIGINT,
    "max_discount_minor" BIGINT,
    "minimum_order_minor" BIGINT,
    "audience_rules" JSONB,
    "stacking_rules" JSONB,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_products" (
    "promotion_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "promotion_products_pkey" PRIMARY KEY ("promotion_id","product_id")
);

-- CreateTable
CREATE TABLE "promotion_categories" (
    "promotion_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "promotion_categories_pkey" PRIMARY KEY ("promotion_id","category_id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "promotion_id" UUID NOT NULL,
    "code" CITEXT NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "usage_limit_total" INTEGER,
    "usage_limit_per_customer" INTEGER,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" UUID NOT NULL,
    "coupon_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "user_id" UUID,
    "discount_applied_minor" BIGINT NOT NULL,
    "redeemed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discounts" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "promotion_id" UUID,
    "coupon_code" VARCHAR(80),
    "target" "DiscountTarget" NOT NULL,
    "target_id" UUID,
    "amount_minor" BIGINT NOT NULL,

    CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name_bn" VARCHAR(200) NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "fixed_price_minor" BIGINT,
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_items" (
    "bundle_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("bundle_id","product_id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "channel" "MarketingChannel" NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "objective" VARCHAR(160),
    "utm_source" VARCHAR(120),
    "utm_medium" VARCHAR(120),
    "utm_campaign" VARCHAR(160),
    "planned_budget_minor" BIGINT,
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_spend" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "spend_minor" BIGINT NOT NULL,
    "impressions" BIGINT NOT NULL DEFAULT 0,
    "clicks" BIGINT NOT NULL DEFAULT 0,
    "source_ref" VARCHAR(160),

    CONSTRAINT "campaign_spend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'NOT_SET',
    "source" VARCHAR(120) NOT NULL,
    "policy_version" VARCHAR(40) NOT NULL,
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMPTZ(6),

    CONSTRAINT "marketing_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_touchpoints" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "analytics_session_id" UUID,
    "campaign_id" UUID,
    "order_id" UUID,
    "channel" "MarketingChannel" NOT NULL,
    "source" VARCHAR(120),
    "medium" VARCHAR(120),
    "campaign_name" VARCHAR(160),
    "content" VARCHAR(160),
    "term" VARCHAR(160),
    "landing_path" VARCHAR(500),
    "referrer_host" VARCHAR(255),
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marketing_touchpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_credits" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "campaign_id" UUID,
    "touchpoint_id" UUID,
    "model" "AttributionModel" NOT NULL,
    "model_version" VARCHAR(40) NOT NULL,
    "credit_fraction" DECIMAL(8,7) NOT NULL,
    "revenue_minor" BIGINT NOT NULL,
    "gross_profit_minor" BIGINT NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribution_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_deliveries" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "campaign_id" UUID,
    "coupon_id" UUID,
    "channel" "MessageChannel" NOT NULL,
    "template_key" VARCHAR(100) NOT NULL,
    "recipient_hash" CHAR(64) NOT NULL,
    "provider_message_id" VARCHAR(255),
    "status" "MessageStatus" NOT NULL DEFAULT 'QUEUED',
    "sent_at" TIMESTAMPTZ(6),
    "delivered_at" TIMESTAMPTZ(6),
    "opened_at" TIMESTAMPTZ(6),
    "clicked_at" TIMESTAMPTZ(6),
    "conversion_order_id" UUID,
    "conversion_revenue_minor" BIGINT,
    "failure_code" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_segments" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "definition_version" VARCHAR(40) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "audience_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_memberships" (
    "segment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "score" DECIMAL(10,4),
    "entered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "audience_memberships_pkey" PRIMARY KEY ("segment_id","user_id")
);

-- CreateTable
CREATE TABLE "retargeting_lists" (
    "id" UUID NOT NULL,
    "segment_id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "generated_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "retargeting_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retargeting_list_members" (
    "list_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "consent_status" "ConsentStatus" NOT NULL,
    "eligible_at" TIMESTAMPTZ(6) NOT NULL,
    "suppression_reason" VARCHAR(160),

    CONSTRAINT "retargeting_list_members_pkey" PRIMARY KEY ("list_id","user_id")
);

-- CreateTable
CREATE TABLE "recovery_attempts" (
    "id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "user_id" UUID,
    "campaign_id" UUID,
    "message_delivery_id" UUID,
    "channel" "MessageChannel" NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "sent_at" TIMESTAMPTZ(6),
    "recovered_at" TIMESTAMPTZ(6),
    "recovered_order_id" UUID,
    "recovered_revenue_minor" BIGINT,

    CONSTRAINT "recovery_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "anonymous_id_hash" CHAR(64) NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "ended_at" TIMESTAMPTZ(6),
    "landing_path" VARCHAR(500),
    "device_type" VARCHAR(40),
    "browser_family" VARCHAR(80),
    "district" VARCHAR(120),
    "consent_analytics" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "session_id" UUID,
    "user_id" UUID,
    "product_id" UUID,
    "variant_id" UUID,
    "order_id" UUID,
    "campaign_id" UUID,
    "experiment_variant_id" UUID,
    "event_name" VARCHAR(100) NOT NULL,
    "event_version" INTEGER NOT NULL DEFAULT 1,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "properties" JSONB,
    "idempotency_key" VARCHAR(160),

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_product_metrics" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "views" BIGINT NOT NULL DEFAULT 0,
    "add_to_carts" BIGINT NOT NULL DEFAULT 0,
    "units_ordered" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "units_returned" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "net_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "cost_of_goods_minor" BIGINT NOT NULL DEFAULT 0,
    "gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "refund_minor" BIGINT NOT NULL DEFAULT 0,
    "average_inventory_qty" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "inventory_turnover" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "return_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "refund_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "trace_scans" BIGINT NOT NULL DEFAULT 0,
    "trace_conversions" BIGINT NOT NULL DEFAULT 0,
    "low_stock_minutes" INTEGER NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_product_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_business_metrics" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "period" "MetricPeriod" NOT NULL DEFAULT 'DAY',
    "currency" CHAR(3) NOT NULL DEFAULT 'BDT',
    "gross_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "net_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "cost_of_goods_minor" BIGINT NOT NULL DEFAULT 0,
    "gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "operating_cost_minor" BIGINT NOT NULL DEFAULT 0,
    "net_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "orders" BIGINT NOT NULL DEFAULT 0,
    "customers" BIGINT NOT NULL DEFAULT 0,
    "new_customers" BIGINT NOT NULL DEFAULT 0,
    "repeat_customers" BIGINT NOT NULL DEFAULT 0,
    "average_order_value_minor" BIGINT NOT NULL DEFAULT 0,
    "acquisition_cost_minor" BIGINT NOT NULL DEFAULT 0,
    "estimated_lifetime_value_minor" BIGINT NOT NULL DEFAULT 0,
    "repeat_purchase_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "funnel_conversion_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_business_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_channel_metrics" (
    "id" UUID NOT NULL,
    "campaign_id" UUID,
    "date" DATE NOT NULL,
    "channel" "MarketingChannel" NOT NULL,
    "spend_minor" BIGINT NOT NULL DEFAULT 0,
    "attributed_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "attributed_gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "impressions" BIGINT NOT NULL DEFAULT 0,
    "clicks" BIGINT NOT NULL DEFAULT 0,
    "sessions" BIGINT NOT NULL DEFAULT 0,
    "conversions" BIGINT NOT NULL DEFAULT 0,
    "new_customers" BIGINT NOT NULL DEFAULT 0,
    "roi" DECIMAL(14,6) NOT NULL DEFAULT 0,
    "roas" DECIMAL(14,6) NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "daily_channel_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_snapshots" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "segment_key" VARCHAR(100) NOT NULL DEFAULT 'all',
    "sessions" BIGINT NOT NULL DEFAULT 0,
    "product_views" BIGINT NOT NULL DEFAULT 0,
    "add_to_carts" BIGINT NOT NULL DEFAULT 0,
    "checkout_starts" BIGINT NOT NULL DEFAULT 0,
    "purchases" BIGINT NOT NULL DEFAULT 0,
    "cart_abandons" BIGINT NOT NULL DEFAULT 0,
    "checkout_abandons" BIGINT NOT NULL DEFAULT 0,
    "conversion_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "funnel_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_term_daily_metrics" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "normalized_term_hash" CHAR(64) NOT NULL,
    "safe_display_term" VARCHAR(160),
    "searches" BIGINT NOT NULL DEFAULT 0,
    "zero_result_searches" BIGINT NOT NULL DEFAULT 0,
    "result_clicks" BIGINT NOT NULL DEFAULT 0,
    "purchases" BIGINT NOT NULL DEFAULT 0,
    "revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "search_term_daily_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_daily_metrics" (
    "id" UUID NOT NULL,
    "promotion_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "eligible_orders" BIGINT NOT NULL DEFAULT 0,
    "redeemed_orders" BIGINT NOT NULL DEFAULT 0,
    "redemption_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "discount_minor" BIGINT NOT NULL DEFAULT 0,
    "incremental_revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "incremental_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "baseline_units" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "promoted_units" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "discount_depth" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "estimated_elasticity" DECIMAL(12,6),
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "promotion_daily_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_daily_metrics" (
    "id" UUID NOT NULL,
    "bundle_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "views" BIGINT NOT NULL DEFAULT 0,
    "add_to_carts" BIGINT NOT NULL DEFAULT 0,
    "orders" BIGINT NOT NULL DEFAULT 0,
    "units" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "gross_profit_minor" BIGINT NOT NULL DEFAULT 0,
    "attach_rate" DECIMAL(8,7) NOT NULL DEFAULT 0,
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "bundle_daily_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_rfm_snapshots" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "recency_days" INTEGER NOT NULL,
    "frequency_orders" INTEGER NOT NULL,
    "monetary_value_minor" BIGINT NOT NULL,
    "recency_score" INTEGER NOT NULL,
    "frequency_score" INTEGER NOT NULL,
    "monetary_score" INTEGER NOT NULL,
    "segment_key" VARCHAR(80) NOT NULL,
    "predicted_clv_minor" BIGINT,
    "churn_risk" DECIMAL(8,7),
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "customer_rfm_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "cohort_type" VARCHAR(60) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "definition" JSONB NOT NULL,
    "calculation_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohort_members" (
    "cohort_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" DATE NOT NULL,

    CONSTRAINT "cohort_members_pkey" PRIMARY KEY ("cohort_id","user_id")
);

-- CreateTable
CREATE TABLE "cohort_retention" (
    "id" UUID NOT NULL,
    "cohort_id" UUID NOT NULL,
    "period_number" INTEGER NOT NULL,
    "period_unit" "MetricPeriod" NOT NULL,
    "eligible_members" INTEGER NOT NULL,
    "retained_members" INTEGER NOT NULL,
    "retention_rate" DECIMAL(8,7) NOT NULL,
    "revenue_minor" BIGINT NOT NULL DEFAULT 0,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohort_retention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_forecasts" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "forecast_date" DATE NOT NULL,
    "horizon" "MetricPeriod" NOT NULL,
    "predicted_units" DECIMAL(18,3) NOT NULL,
    "predicted_revenue_minor" BIGINT NOT NULL,
    "lower_bound_units" DECIMAL(18,3),
    "upper_bound_units" DECIMAL(18,3),
    "model_name" VARCHAR(100) NOT NULL,
    "model_version" VARCHAR(40) NOT NULL,
    "inputs_as_of" TIMESTAMPTZ(6) NOT NULL,
    "generated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "variant_id" UUID,
    "type" "RecommendationType" NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'OPEN',
    "priority" INTEGER NOT NULL DEFAULT 50,
    "title" VARCHAR(200) NOT NULL,
    "rationale" TEXT NOT NULL,
    "confidence" DECIMAL(8,7),
    "expected_impact_minor" BIGINT,
    "recommended_quantity" DECIMAL(18,3),
    "evidence" JSONB NOT NULL DEFAULT '{}',
    "model_name" VARCHAR(100) NOT NULL,
    "model_version" VARCHAR(40) NOT NULL,
    "generated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "decided_at" TIMESTAMPTZ(6),

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "assignment_unit" "ExperimentUnit" NOT NULL,
    "primary_metric" VARCHAR(100) NOT NULL,
    "guardrail_metrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audience_rules" JSONB,
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_variants" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "allocation" DECIMAL(8,7) NOT NULL,
    "is_control" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB NOT NULL,

    CONSTRAINT "experiment_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_assignments" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "experiment_variant_id" UUID NOT NULL,
    "user_id" UUID,
    "assignment_unit_hash" CHAR(64) NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_metric_results" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "variant_key" VARCHAR(80) NOT NULL,
    "metric_key" VARCHAR(100) NOT NULL,
    "sample_size" BIGINT NOT NULL,
    "value" DECIMAL(18,8) NOT NULL,
    "uplift_vs_control" DECIMAL(18,8),
    "confidence_interval_low" DECIMAL(18,8),
    "confidence_interval_high" DECIMAL(18,8),
    "p_value" DECIMAL(18,12),
    "statistically_significant" BOOLEAN,
    "calculation_version" VARCHAR(40) NOT NULL,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_metric_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "provider_event_id" VARCHAR(255) NOT NULL,
    "event_type" VARCHAR(120) NOT NULL,
    "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload_sha256" CHAR(64) NOT NULL,
    "safe_payload" JSONB,
    "signature_verified_at" TIMESTAMPTZ(6),
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMPTZ(6),
    "last_error_code" VARCHAR(100),

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "scope" VARCHAR(100) NOT NULL,
    "key" VARCHAR(160) NOT NULL,
    "request_hash" CHAR(64) NOT NULL,
    "response_status" INTEGER,
    "response_body" JSONB,
    "resource_type" VARCHAR(80),
    "resource_id" VARCHAR(100),
    "locked_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" "AuditAction" NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "reason" VARCHAR(500),
    "correlation_id" UUID NOT NULL,
    "ip_hash" CHAR(64),
    "user_agent" VARCHAR(512),
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_issues" (
    "id" UUID NOT NULL,
    "rule_key" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "field_path" VARCHAR(200),
    "severity" "DataQualitySeverity" NOT NULL,
    "status" "DataQualityStatus" NOT NULL DEFAULT 'OPEN',
    "message" TEXT NOT NULL,
    "evidence" JSONB,
    "detected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    "resolution_notes" TEXT,

    CONSTRAINT "data_quality_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_e164_key" ON "users"("phone_e164");

-- CreateIndex
CREATE INDEX "users_status_created_at_idx" ON "users"("status", "created_at");

-- CreateIndex
CREATE INDEX "user_identities_user_id_idx" ON "user_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_identities_provider_provider_subject_key" ON "user_identities"("provider", "provider_subject");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_hash_key" ON "auth_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_expires_at_idx" ON "auth_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_user_id_key" ON "customer_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_customer_number_key" ON "customer_profiles"("customer_number");

-- CreateIndex
CREATE INDEX "customer_profiles_last_order_at_idx" ON "customer_profiles"("last_order_at");

-- CreateIndex
CREATE INDEX "addresses_user_id_is_default_idx" ON "addresses"("user_id", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_sort_order_idx" ON "categories"("parent_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "producers_code_key" ON "producers"("code");

-- CreateIndex
CREATE INDEX "producers_verification_status_status_idx" ON "producers"("verification_status", "status");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE INDEX "suppliers_verification_status_status_idx" ON "suppliers"("verification_status", "status");

-- CreateIndex
CREATE UNIQUE INDEX "processors_code_key" ON "processors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "source_locations_code_key" ON "source_locations"("code");

-- CreateIndex
CREATE INDEX "source_locations_division_district_upazila_idx" ON "source_locations"("division", "district", "upazila");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_code_key" ON "facilities"("code");

-- CreateIndex
CREATE INDEX "facilities_processor_id_verification_status_idx" ON "facilities"("processor_id", "verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_documents_storage_key_key" ON "evidence_documents"("storage_key");

-- CreateIndex
CREATE INDEX "evidence_documents_kind_verification_status_expires_at_idx" ON "evidence_documents"("kind", "verification_status", "expires_at");

-- CreateIndex
CREATE INDEX "supplier_verifications_supplier_id_status_valid_until_idx" ON "supplier_verifications"("supplier_id", "status", "valid_until");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE INDEX "products_category_id_status_featured_idx" ON "products"("category_id", "status", "featured");

-- CreateIndex
CREATE INDEX "products_producer_id_supplier_id_idx" ON "products"("producer_id", "supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_barcode_key" ON "product_variants"("barcode");

-- CreateIndex
CREATE INDEX "product_variants_product_id_status_idx" ON "product_variants"("product_id", "status");

-- CreateIndex
CREATE INDEX "product_prices_variant_id_type_valid_from_valid_until_idx" ON "product_prices"("variant_id", "type", "valid_from", "valid_until");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_product_id_key_key" ON "product_attributes"("product_id", "key");

-- CreateIndex
CREATE INDEX "product_media_product_id_sort_order_idx" ON "product_media"("product_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_sources_status_idx" ON "product_sources"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_sources_product_id_source_location_id_key" ON "product_sources"("product_id", "source_location_id");

-- CreateIndex
CREATE INDEX "product_claims_product_id_status_risk_level_idx" ON "product_claims"("product_id", "status", "risk_level");

-- CreateIndex
CREATE INDEX "certifications_status_valid_until_idx" ON "certifications"("status", "valid_until");

-- CreateIndex
CREATE INDEX "lab_reports_batch_id_status_idx" ON "lab_reports"("batch_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_bins_warehouse_id_code_key" ON "warehouse_bins"("warehouse_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_batch_code_key" ON "inventory_batches"("batch_code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_public_trace_token_hash_key" ON "inventory_batches"("public_trace_token_hash");

-- CreateIndex
CREATE INDEX "inventory_batches_variant_id_status_best_before_date_idx" ON "inventory_batches"("variant_id", "status", "best_before_date");

-- CreateIndex
CREATE INDEX "inventory_batches_supplier_id_source_location_id_idx" ON "inventory_batches"("supplier_id", "source_location_id");

-- CreateIndex
CREATE INDEX "inventory_levels_variant_id_quantity_available_idx" ON "inventory_levels"("variant_id", "quantity_available");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_levels_warehouse_id_batch_id_key" ON "inventory_levels"("warehouse_id", "batch_id");

-- CreateIndex
CREATE INDEX "inventory_movements_variant_id_occurred_at_idx" ON "inventory_movements"("variant_id", "occurred_at");

-- CreateIndex
CREATE INDEX "inventory_movements_reference_type_reference_id_idx" ON "inventory_movements"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "stock_reservations_status_expires_at_idx" ON "stock_reservations"("status", "expires_at");

-- CreateIndex
CREATE INDEX "stock_reservations_cart_item_id_order_item_id_idx" ON "stock_reservations"("cart_item_id", "order_item_id");

-- CreateIndex
CREATE INDEX "inventory_holds_status_created_at_idx" ON "inventory_holds"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "recalls_public_reference_key" ON "recalls"("public_reference");

-- CreateIndex
CREATE INDEX "recalls_status_started_at_idx" ON "recalls"("status", "started_at");

-- CreateIndex
CREATE INDEX "trace_events_batch_id_occurred_at_idx" ON "trace_events"("batch_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_name_key" ON "wishlists"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "carts_anonymous_token_hash_key" ON "carts"("anonymous_token_hash");

-- CreateIndex
CREATE INDEX "carts_user_id_status_idx" ON "carts"("user_id", "status");

-- CreateIndex
CREATE INDEX "carts_status_last_activity_at_idx" ON "carts"("status", "last_activity_at");

-- CreateIndex
CREATE INDEX "cart_items_variant_id_idx" ON "cart_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_variant_id_key" ON "cart_items"("cart_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_user_id_placed_at_idx" ON "orders"("user_id", "placed_at");

-- CreateIndex
CREATE INDEX "orders_status_placed_at_idx" ON "orders"("status", "placed_at");

-- CreateIndex
CREATE INDEX "orders_fulfillment_status_placed_at_idx" ON "orders"("fulfillment_status", "placed_at");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");

-- CreateIndex
CREATE INDEX "order_batch_allocations_batch_id_idx" ON "order_batch_allocations"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_reference_key" ON "payments"("provider_reference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");

-- CreateIndex
CREATE INDEX "payments_order_id_status_idx" ON "payments"("order_id", "status");

-- CreateIndex
CREATE INDEX "payments_provider_created_at_idx" ON "payments"("provider", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_shipment_number_key" ON "shipments"("shipment_number");

-- CreateIndex
CREATE INDEX "shipments_order_id_status_idx" ON "shipments"("order_id", "status");

-- CreateIndex
CREATE INDEX "shipments_tracking_number_idx" ON "shipments"("tracking_number");

-- CreateIndex
CREATE INDEX "shipment_events_shipment_id_occurred_at_idx" ON "shipment_events"("shipment_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "return_requests_return_number_key" ON "return_requests"("return_number");

-- CreateIndex
CREATE INDEX "return_requests_order_id_status_idx" ON "return_requests"("order_id", "status");

-- CreateIndex
CREATE INDEX "return_items_batch_id_idx" ON "return_items"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "return_items_return_request_id_order_item_id_key" ON "return_items"("return_request_id", "order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_provider_reference_key" ON "refunds"("provider_reference");

-- CreateIndex
CREATE INDEX "refunds_order_id_status_idx" ON "refunds"("order_id", "status");

-- CreateIndex
CREATE INDEX "complaints_batch_id_status_idx" ON "complaints"("batch_id", "status");

-- CreateIndex
CREATE INDEX "complaints_order_id_status_idx" ON "complaints"("order_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_order_item_id_key" ON "product_reviews"("order_item_id");

-- CreateIndex
CREATE INDEX "product_reviews_product_id_moderation_status_published_at_idx" ON "product_reviews"("product_id", "moderation_status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_product_id_user_id_order_item_id_key" ON "product_reviews"("product_id", "user_id", "order_item_id");

-- CreateIndex
CREATE INDEX "product_questions_product_id_moderation_status_created_at_idx" ON "product_questions"("product_id", "moderation_status", "created_at");

-- CreateIndex
CREATE INDEX "product_answers_question_id_published_at_idx" ON "product_answers"("question_id", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");

-- CreateIndex
CREATE INDEX "promotions_status_starts_at_ends_at_idx" ON "promotions"("status", "starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_promotion_id_status_idx" ON "coupons"("promotion_id", "status");

-- CreateIndex
CREATE INDEX "coupon_redemptions_coupon_id_redeemed_at_idx" ON "coupon_redemptions"("coupon_id", "redeemed_at");

-- CreateIndex
CREATE INDEX "coupon_redemptions_user_id_redeemed_at_idx" ON "coupon_redemptions"("user_id", "redeemed_at");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_redemptions_coupon_id_order_id_key" ON "coupon_redemptions"("coupon_id", "order_id");

-- CreateIndex
CREATE INDEX "order_discounts_order_id_idx" ON "order_discounts"("order_id");

-- CreateIndex
CREATE INDEX "order_discounts_promotion_id_idx" ON "order_discounts"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_code_key" ON "bundles"("code");

-- CreateIndex
CREATE INDEX "bundles_status_starts_at_ends_at_idx" ON "bundles"("status", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "bundle_items_variant_id_idx" ON "bundle_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_code_key" ON "campaigns"("code");

-- CreateIndex
CREATE INDEX "campaigns_channel_status_starts_at_idx" ON "campaigns"("channel", "status", "starts_at");

-- CreateIndex
CREATE INDEX "campaign_spend_date_idx" ON "campaign_spend"("date");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_spend_campaign_id_date_source_ref_key" ON "campaign_spend"("campaign_id", "date", "source_ref");

-- CreateIndex
CREATE INDEX "marketing_consents_channel_status_idx" ON "marketing_consents"("channel", "status");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_consents_user_id_channel_key" ON "marketing_consents"("user_id", "channel");

-- CreateIndex
CREATE INDEX "marketing_touchpoints_user_id_occurred_at_idx" ON "marketing_touchpoints"("user_id", "occurred_at");

-- CreateIndex
CREATE INDEX "marketing_touchpoints_campaign_id_occurred_at_idx" ON "marketing_touchpoints"("campaign_id", "occurred_at");

-- CreateIndex
CREATE INDEX "marketing_touchpoints_order_id_idx" ON "marketing_touchpoints"("order_id");

-- CreateIndex
CREATE INDEX "attribution_credits_campaign_id_model_calculated_at_idx" ON "attribution_credits"("campaign_id", "model", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "attribution_credits_order_id_model_touchpoint_id_key" ON "attribution_credits"("order_id", "model", "touchpoint_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_deliveries_provider_message_id_key" ON "message_deliveries"("provider_message_id");

-- CreateIndex
CREATE INDEX "message_deliveries_campaign_id_channel_status_sent_at_idx" ON "message_deliveries"("campaign_id", "channel", "status", "sent_at");

-- CreateIndex
CREATE INDEX "message_deliveries_user_id_created_at_idx" ON "message_deliveries"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "audience_segments_key_key" ON "audience_segments"("key");

-- CreateIndex
CREATE INDEX "audience_memberships_user_id_idx" ON "audience_memberships"("user_id");

-- CreateIndex
CREATE INDEX "retargeting_lists_channel_status_generated_at_idx" ON "retargeting_lists"("channel", "status", "generated_at");

-- CreateIndex
CREATE INDEX "retargeting_list_members_consent_status_eligible_at_idx" ON "retargeting_list_members"("consent_status", "eligible_at");

-- CreateIndex
CREATE UNIQUE INDEX "recovery_attempts_message_delivery_id_key" ON "recovery_attempts"("message_delivery_id");

-- CreateIndex
CREATE INDEX "recovery_attempts_sent_at_recovered_at_idx" ON "recovery_attempts"("sent_at", "recovered_at");

-- CreateIndex
CREATE UNIQUE INDEX "recovery_attempts_cart_id_channel_attempt_number_key" ON "recovery_attempts"("cart_id", "channel", "attempt_number");

-- CreateIndex
CREATE INDEX "analytics_sessions_user_id_started_at_idx" ON "analytics_sessions"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "analytics_sessions_anonymous_id_hash_started_at_idx" ON "analytics_sessions"("anonymous_id_hash", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_events_idempotency_key_key" ON "analytics_events"("idempotency_key");

-- CreateIndex
CREATE INDEX "analytics_events_event_name_occurred_at_idx" ON "analytics_events"("event_name", "occurred_at");

-- CreateIndex
CREATE INDEX "analytics_events_product_id_occurred_at_idx" ON "analytics_events"("product_id", "occurred_at");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_occurred_at_idx" ON "analytics_events"("user_id", "occurred_at");

-- CreateIndex
CREATE INDEX "analytics_events_campaign_id_occurred_at_idx" ON "analytics_events"("campaign_id", "occurred_at");

-- CreateIndex
CREATE INDEX "daily_product_metrics_date_net_revenue_minor_idx" ON "daily_product_metrics"("date", "net_revenue_minor");

-- CreateIndex
CREATE UNIQUE INDEX "daily_product_metrics_product_id_date_key" ON "daily_product_metrics"("product_id", "date");

-- CreateIndex
CREATE INDEX "daily_business_metrics_period_date_idx" ON "daily_business_metrics"("period", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_business_metrics_date_period_key" ON "daily_business_metrics"("date", "period");

-- CreateIndex
CREATE INDEX "daily_channel_metrics_channel_date_idx" ON "daily_channel_metrics"("channel", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_channel_metrics_date_channel_campaign_id_key" ON "daily_channel_metrics"("date", "channel", "campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "funnel_snapshots_date_segment_key_key" ON "funnel_snapshots"("date", "segment_key");

-- CreateIndex
CREATE INDEX "search_term_daily_metrics_date_searches_idx" ON "search_term_daily_metrics"("date", "searches");

-- CreateIndex
CREATE UNIQUE INDEX "search_term_daily_metrics_date_normalized_term_hash_key" ON "search_term_daily_metrics"("date", "normalized_term_hash");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_daily_metrics_promotion_id_date_key" ON "promotion_daily_metrics"("promotion_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_daily_metrics_bundle_id_date_key" ON "bundle_daily_metrics"("bundle_id", "date");

-- CreateIndex
CREATE INDEX "customer_rfm_snapshots_snapshot_date_segment_key_idx" ON "customer_rfm_snapshots"("snapshot_date", "segment_key");

-- CreateIndex
CREATE UNIQUE INDEX "customer_rfm_snapshots_user_id_snapshot_date_key" ON "customer_rfm_snapshots"("user_id", "snapshot_date");

-- CreateIndex
CREATE UNIQUE INDEX "cohorts_key_key" ON "cohorts"("key");

-- CreateIndex
CREATE INDEX "cohorts_cohort_type_start_date_idx" ON "cohorts"("cohort_type", "start_date");

-- CreateIndex
CREATE INDEX "cohort_members_user_id_idx" ON "cohort_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_retention_cohort_id_period_number_period_unit_key" ON "cohort_retention"("cohort_id", "period_number", "period_unit");

-- CreateIndex
CREATE INDEX "sales_forecasts_forecast_date_horizon_idx" ON "sales_forecasts"("forecast_date", "horizon");

-- CreateIndex
CREATE UNIQUE INDEX "sales_forecasts_product_id_forecast_date_horizon_model_vers_key" ON "sales_forecasts"("product_id", "forecast_date", "horizon", "model_version");

-- CreateIndex
CREATE INDEX "recommendations_status_priority_generated_at_idx" ON "recommendations"("status", "priority", "generated_at");

-- CreateIndex
CREATE INDEX "recommendations_product_id_type_idx" ON "recommendations"("product_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "experiments_key_key" ON "experiments"("key");

-- CreateIndex
CREATE INDEX "experiments_status_starts_at_ends_at_idx" ON "experiments"("status", "starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "experiment_variants_experiment_id_key_key" ON "experiment_variants"("experiment_id", "key");

-- CreateIndex
CREATE INDEX "experiment_assignments_experiment_variant_id_idx" ON "experiment_assignments"("experiment_variant_id");

-- CreateIndex
CREATE INDEX "experiment_assignments_user_id_assigned_at_idx" ON "experiment_assignments"("user_id", "assigned_at");

-- CreateIndex
CREATE UNIQUE INDEX "experiment_assignments_experiment_id_assignment_unit_hash_key" ON "experiment_assignments"("experiment_id", "assignment_unit_hash");

-- CreateIndex
CREATE UNIQUE INDEX "experiment_metric_results_experiment_id_variant_key_metric__key" ON "experiment_metric_results"("experiment_id", "variant_key", "metric_key", "calculation_version");

-- CreateIndex
CREATE INDEX "webhook_events_status_next_attempt_at_idx" ON "webhook_events"("status", "next_attempt_at");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_provider_event_id_key" ON "webhook_events"("provider", "provider_event_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_scope_key_key" ON "idempotency_keys"("scope", "key");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_occurred_at_idx" ON "audit_logs"("entity_type", "entity_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_occurred_at_idx" ON "audit_logs"("actor_user_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

-- CreateIndex
CREATE INDEX "data_quality_issues_status_severity_detected_at_idx" ON "data_quality_issues"("status", "severity", "detected_at");

-- CreateIndex
CREATE INDEX "data_quality_issues_entity_type_entity_id_idx" ON "data_quality_issues"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_locations" ADD CONSTRAINT "source_locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "source_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_processor_id_fkey" FOREIGN KEY ("processor_id") REFERENCES "processors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "source_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_verifications" ADD CONSTRAINT "supplier_verifications_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_verifications" ADD CONSTRAINT "supplier_verifications_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "evidence_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_verifications" ADD CONSTRAINT "supplier_verifications_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_processor_id_fkey" FOREIGN KEY ("processor_id") REFERENCES "processors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sources" ADD CONSTRAINT "product_sources_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sources" ADD CONSTRAINT "product_sources_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "source_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sources" ADD CONSTRAINT "product_sources_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "evidence_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_claims" ADD CONSTRAINT "product_claims_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_claims" ADD CONSTRAINT "product_claims_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "product_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "evidence_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "evidence_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_certifications" ADD CONSTRAINT "product_certifications_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_certifications" ADD CONSTRAINT "product_certifications_certification_id_fkey" FOREIGN KEY ("certification_id") REFERENCES "certifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "evidence_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "source_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_processor_id_fkey" FOREIGN KEY ("processor_id") REFERENCES "processors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "source_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_levels" ADD CONSTRAINT "inventory_levels_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_from_warehouse_id_fkey" FOREIGN KEY ("from_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_to_warehouse_id_fkey" FOREIGN KEY ("to_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_from_batch_id_fkey" FOREIGN KEY ("from_batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_to_batch_id_fkey" FOREIGN KEY ("to_batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_holds" ADD CONSTRAINT "inventory_holds_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_holds" ADD CONSTRAINT "inventory_holds_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_holds" ADD CONSTRAINT "inventory_holds_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recalls" ADD CONSTRAINT "recalls_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trace_events" ADD CONSTRAINT "trace_events_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_source_cart_id_fkey" FOREIGN KEY ("source_cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_batch_allocations" ADD CONSTRAINT "order_batch_allocations_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_batch_allocations" ADD CONSTRAINT "order_batch_allocations_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_items" ADD CONSTRAINT "refund_items_refund_id_fkey" FOREIGN KEY ("refund_id") REFERENCES "refunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund_items" ADD CONSTRAINT "refund_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "product_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_answered_by_id_fkey" FOREIGN KEY ("answered_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_spend" ADD CONSTRAINT "campaign_spend_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_consents" ADD CONSTRAINT "marketing_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_touchpoints" ADD CONSTRAINT "marketing_touchpoints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_touchpoints" ADD CONSTRAINT "marketing_touchpoints_analytics_session_id_fkey" FOREIGN KEY ("analytics_session_id") REFERENCES "analytics_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_touchpoints" ADD CONSTRAINT "marketing_touchpoints_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_touchpoints" ADD CONSTRAINT "marketing_touchpoints_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_credits" ADD CONSTRAINT "attribution_credits_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_credits" ADD CONSTRAINT "attribution_credits_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_credits" ADD CONSTRAINT "attribution_credits_touchpoint_id_fkey" FOREIGN KEY ("touchpoint_id") REFERENCES "marketing_touchpoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deliveries" ADD CONSTRAINT "message_deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deliveries" ADD CONSTRAINT "message_deliveries_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deliveries" ADD CONSTRAINT "message_deliveries_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_deliveries" ADD CONSTRAINT "message_deliveries_conversion_order_id_fkey" FOREIGN KEY ("conversion_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_memberships" ADD CONSTRAINT "audience_memberships_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "audience_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_memberships" ADD CONSTRAINT "audience_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retargeting_lists" ADD CONSTRAINT "retargeting_lists_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "audience_segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retargeting_list_members" ADD CONSTRAINT "retargeting_list_members_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "retargeting_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retargeting_list_members" ADD CONSTRAINT "retargeting_list_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_attempts" ADD CONSTRAINT "recovery_attempts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_attempts" ADD CONSTRAINT "recovery_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_attempts" ADD CONSTRAINT "recovery_attempts_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_attempts" ADD CONSTRAINT "recovery_attempts_message_delivery_id_fkey" FOREIGN KEY ("message_delivery_id") REFERENCES "message_deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_attempts" ADD CONSTRAINT "recovery_attempts_recovered_order_id_fkey" FOREIGN KEY ("recovered_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_sessions" ADD CONSTRAINT "analytics_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "analytics_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_experiment_variant_id_fkey" FOREIGN KEY ("experiment_variant_id") REFERENCES "experiment_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_product_metrics" ADD CONSTRAINT "daily_product_metrics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_channel_metrics" ADD CONSTRAINT "daily_channel_metrics_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_daily_metrics" ADD CONSTRAINT "promotion_daily_metrics_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_daily_metrics" ADD CONSTRAINT "bundle_daily_metrics_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_rfm_snapshots" ADD CONSTRAINT "customer_rfm_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_retention" ADD CONSTRAINT "cohort_retention_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_forecasts" ADD CONSTRAINT "sales_forecasts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_variants" ADD CONSTRAINT "experiment_variants_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_assignments" ADD CONSTRAINT "experiment_assignments_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_assignments" ADD CONSTRAINT "experiment_assignments_experiment_variant_id_fkey" FOREIGN KEY ("experiment_variant_id") REFERENCES "experiment_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_assignments" ADD CONSTRAINT "experiment_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_metric_results" ADD CONSTRAINT "experiment_metric_results_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

