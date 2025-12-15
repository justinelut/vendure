import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductReviews1762877052355 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "product_review" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "productId" integer NOT NULL, "customerId" integer, "rating" integer NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL, "authorName" varchar(255) NOT NULL, "authorLocation" varchar(255), "status" varchar NOT NULL DEFAULT ('pending'), "verifiedPurchase" boolean NOT NULL DEFAULT (0), "upvotes" integer NOT NULL DEFAULT (0), "downvotes" integer NOT NULL DEFAULT (0), "source" varchar NOT NULL DEFAULT ('vendure'), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_06e7335708b5e7870f1eaa608d" ON "product_review" ("productId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fb12b4f7c7cf7728866222259d" ON "product_review" ("status") `, undefined);
        await queryRunner.query(`CREATE TABLE "review_reply" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer, "administratorId" integer, "content" text NOT NULL, "isAdminReply" boolean NOT NULL DEFAULT (0), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "review_vote" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer NOT NULL, "vote" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, CONSTRAINT "UQ_38a9a7046d9321d806f61fdb354" UNIQUE ("reviewId", "customerId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f714bf883874fbd00b52bf1640" ON "review_vote" ("reviewId") `, undefined);
        await queryRunner.query(`CREATE TABLE "product_review_images_asset" ("productReviewId" integer NOT NULL, "assetId" integer NOT NULL, PRIMARY KEY ("productReviewId", "assetId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2b0513002d85239654ee211b44" ON "product_review_images_asset" ("productReviewId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9778b0ed8016853b9947ee93a1" ON "product_review_images_asset" ("assetId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_91a19e6613534949a4ce6e76ff"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "enabled" boolean NOT NULL DEFAULT (1), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "featuredAssetId" integer, "customFieldsAveragerating" double precision DEFAULT (0), "customFieldsReviewcount" integer DEFAULT (0), "customFieldsRatingdistribution" text, CONSTRAINT "FK_91a19e6613534949a4ce6e76ff8" FOREIGN KEY ("featuredAssetId") REFERENCES "asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_product"("createdAt", "updatedAt", "deletedAt", "enabled", "id", "featuredAssetId") SELECT "createdAt", "updatedAt", "deletedAt", "enabled", "id", "featuredAssetId" FROM "product"`, undefined);
        await queryRunner.query(`DROP TABLE "product"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_91a19e6613534949a4ce6e76ff" ON "product" ("featuredAssetId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_06e7335708b5e7870f1eaa608d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fb12b4f7c7cf7728866222259d"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_product_review" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "productId" integer NOT NULL, "customerId" integer, "rating" integer NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL, "authorName" varchar(255) NOT NULL, "authorLocation" varchar(255), "status" varchar NOT NULL DEFAULT ('pending'), "verifiedPurchase" boolean NOT NULL DEFAULT (0), "upvotes" integer NOT NULL DEFAULT (0), "downvotes" integer NOT NULL DEFAULT (0), "source" varchar NOT NULL DEFAULT ('vendure'), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_73994c5bf5e1fa155b6f5237ea2" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_product_review"("createdAt", "updatedAt", "productId", "customerId", "rating", "title", "content", "authorName", "authorLocation", "status", "verifiedPurchase", "upvotes", "downvotes", "source", "id") SELECT "createdAt", "updatedAt", "productId", "customerId", "rating", "title", "content", "authorName", "authorLocation", "status", "verifiedPurchase", "upvotes", "downvotes", "source", "id" FROM "product_review"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_product_review" RENAME TO "product_review"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_06e7335708b5e7870f1eaa608d" ON "product_review" ("productId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fb12b4f7c7cf7728866222259d" ON "product_review" ("status") `, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_review_reply" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer, "administratorId" integer, "content" text NOT NULL, "isAdminReply" boolean NOT NULL DEFAULT (0), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, CONSTRAINT "FK_e1d78d98da06265aa0a85cee5f6" FOREIGN KEY ("reviewId") REFERENCES "product_review" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b1e1424c64e84ddd654d6bb0556" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_452cd5457a32b7eefe23f7b5b34" FOREIGN KEY ("administratorId") REFERENCES "administrator" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_review_reply"("createdAt", "updatedAt", "reviewId", "customerId", "administratorId", "content", "isAdminReply", "id") SELECT "createdAt", "updatedAt", "reviewId", "customerId", "administratorId", "content", "isAdminReply", "id" FROM "review_reply"`, undefined);
        await queryRunner.query(`DROP TABLE "review_reply"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_review_reply" RENAME TO "review_reply"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f714bf883874fbd00b52bf1640"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_review_vote" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer NOT NULL, "vote" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, CONSTRAINT "UQ_38a9a7046d9321d806f61fdb354" UNIQUE ("reviewId", "customerId"), CONSTRAINT "FK_f714bf883874fbd00b52bf16407" FOREIGN KEY ("reviewId") REFERENCES "product_review" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a5ebd912f54fb597a84e7cef9e5" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_review_vote"("createdAt", "updatedAt", "reviewId", "customerId", "vote", "id") SELECT "createdAt", "updatedAt", "reviewId", "customerId", "vote", "id" FROM "review_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "review_vote"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_review_vote" RENAME TO "review_vote"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f714bf883874fbd00b52bf1640" ON "review_vote" ("reviewId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2b0513002d85239654ee211b44"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9778b0ed8016853b9947ee93a1"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_product_review_images_asset" ("productReviewId" integer NOT NULL, "assetId" integer NOT NULL, CONSTRAINT "FK_2b0513002d85239654ee211b440" FOREIGN KEY ("productReviewId") REFERENCES "product_review" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_9778b0ed8016853b9947ee93a1f" FOREIGN KEY ("assetId") REFERENCES "asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("productReviewId", "assetId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_product_review_images_asset"("productReviewId", "assetId") SELECT "productReviewId", "assetId" FROM "product_review_images_asset"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review_images_asset"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_product_review_images_asset" RENAME TO "product_review_images_asset"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2b0513002d85239654ee211b44" ON "product_review_images_asset" ("productReviewId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9778b0ed8016853b9947ee93a1" ON "product_review_images_asset" ("assetId") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_9778b0ed8016853b9947ee93a1"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2b0513002d85239654ee211b44"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review_images_asset" RENAME TO "temporary_product_review_images_asset"`, undefined);
        await queryRunner.query(`CREATE TABLE "product_review_images_asset" ("productReviewId" integer NOT NULL, "assetId" integer NOT NULL, PRIMARY KEY ("productReviewId", "assetId"))`, undefined);
        await queryRunner.query(`INSERT INTO "product_review_images_asset"("productReviewId", "assetId") SELECT "productReviewId", "assetId" FROM "temporary_product_review_images_asset"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_product_review_images_asset"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9778b0ed8016853b9947ee93a1" ON "product_review_images_asset" ("assetId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2b0513002d85239654ee211b44" ON "product_review_images_asset" ("productReviewId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f714bf883874fbd00b52bf1640"`, undefined);
        await queryRunner.query(`ALTER TABLE "review_vote" RENAME TO "temporary_review_vote"`, undefined);
        await queryRunner.query(`CREATE TABLE "review_vote" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer NOT NULL, "vote" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, CONSTRAINT "UQ_38a9a7046d9321d806f61fdb354" UNIQUE ("reviewId", "customerId"))`, undefined);
        await queryRunner.query(`INSERT INTO "review_vote"("createdAt", "updatedAt", "reviewId", "customerId", "vote", "id") SELECT "createdAt", "updatedAt", "reviewId", "customerId", "vote", "id" FROM "temporary_review_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_review_vote"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f714bf883874fbd00b52bf1640" ON "review_vote" ("reviewId") `, undefined);
        await queryRunner.query(`ALTER TABLE "review_reply" RENAME TO "temporary_review_reply"`, undefined);
        await queryRunner.query(`CREATE TABLE "review_reply" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "reviewId" integer NOT NULL, "customerId" integer, "administratorId" integer, "content" text NOT NULL, "isAdminReply" boolean NOT NULL DEFAULT (0), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "review_reply"("createdAt", "updatedAt", "reviewId", "customerId", "administratorId", "content", "isAdminReply", "id") SELECT "createdAt", "updatedAt", "reviewId", "customerId", "administratorId", "content", "isAdminReply", "id" FROM "temporary_review_reply"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_review_reply"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fb12b4f7c7cf7728866222259d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_06e7335708b5e7870f1eaa608d"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" RENAME TO "temporary_product_review"`, undefined);
        await queryRunner.query(`CREATE TABLE "product_review" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "productId" integer NOT NULL, "customerId" integer, "rating" integer NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL, "authorName" varchar(255) NOT NULL, "authorLocation" varchar(255), "status" varchar NOT NULL DEFAULT ('pending'), "verifiedPurchase" boolean NOT NULL DEFAULT (0), "upvotes" integer NOT NULL DEFAULT (0), "downvotes" integer NOT NULL DEFAULT (0), "source" varchar NOT NULL DEFAULT ('vendure'), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "product_review"("createdAt", "updatedAt", "productId", "customerId", "rating", "title", "content", "authorName", "authorLocation", "status", "verifiedPurchase", "upvotes", "downvotes", "source", "id") SELECT "createdAt", "updatedAt", "productId", "customerId", "rating", "title", "content", "authorName", "authorLocation", "status", "verifiedPurchase", "upvotes", "downvotes", "source", "id" FROM "temporary_product_review"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_product_review"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fb12b4f7c7cf7728866222259d" ON "product_review" ("status") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_06e7335708b5e7870f1eaa608d" ON "product_review" ("productId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_91a19e6613534949a4ce6e76ff"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`, undefined);
        await queryRunner.query(`CREATE TABLE "product" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "enabled" boolean NOT NULL DEFAULT (1), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "featuredAssetId" integer, CONSTRAINT "FK_91a19e6613534949a4ce6e76ff8" FOREIGN KEY ("featuredAssetId") REFERENCES "asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "product"("createdAt", "updatedAt", "deletedAt", "enabled", "id", "featuredAssetId") SELECT "createdAt", "updatedAt", "deletedAt", "enabled", "id", "featuredAssetId" FROM "temporary_product"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_product"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_91a19e6613534949a4ce6e76ff" ON "product" ("featuredAssetId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9778b0ed8016853b9947ee93a1"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2b0513002d85239654ee211b44"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review_images_asset"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f714bf883874fbd00b52bf1640"`, undefined);
        await queryRunner.query(`DROP TABLE "review_vote"`, undefined);
        await queryRunner.query(`DROP TABLE "review_reply"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_fb12b4f7c7cf7728866222259d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_06e7335708b5e7870f1eaa608d"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review"`, undefined);
   }

}
