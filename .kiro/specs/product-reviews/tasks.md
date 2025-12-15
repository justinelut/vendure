# Implementation Plan

- [x] 1. Create database entities for reviews system
  - Create ProductReview entity with all fields (rating, title, content, status, votes, etc.)
  - Create ReviewVote entity with unique constraint on (reviewId, customerId)
  - Create ReviewReply entity for review responses
  - Add custom fields to Product entity for review statistics
  - Create types.ts file with TypeScript declarations for custom fields
  - Register all entities in plugin metadata
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 4.1, 9.1, 9.2, 9.3, 10.1, 10.2_

- [x] 2. Implement ProductReviewService for core review operations
  - Create ProductReviewService class with dependency injection
  - Implement createReview() method with validation and verified purchase check
  - Implement getReviewsForProduct() with pagination, sorting, and filtering
  - Implement approveReview() and rejectReview() methods
  - Implement updateProductStatistics() to calculate averages and distribution
  - Implement checkVerifiedPurchase() to query order history
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 3. Implement ReviewVoteService for helpful voting
  - Create ReviewVoteService class
  - Implement voteOnReview() method to create or update votes
  - Implement getVoteForReview() to retrieve customer's existing vote
  - Update ProductReview upvotes/downvotes counts when votes change
  - Handle vote changes (up to down, down to up)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. Implement Shop API GraphQL schema and resolvers
  - Create api-extensions.ts with Shop API schema (ProductReview type, queries, mutations)
  - Create shop-api.resolver.ts with ProductReviewShopResolver
  - Implement productReviews query with pagination and filtering
  - Implement productReviewStatistics query
  - Implement submitProductReview mutation with image upload support
  - Implement voteOnReview mutation
  - Implement addReviewReply mutation
  - Add permission guards (@Allow decorators)
  - _Requirements: 2.4, 2.5, 4.2, 8.1, 8.2, 8.3, 8.4, 8.5, 10.3, 10.4, 10.5_

- [x] 5. Implement Admin API GraphQL schema and resolvers
  - Create admin-api-extensions.ts with Admin API schema
  - Create admin-api.resolver.ts with ProductReviewAdminResolver
  - Implement productReviews query (all statuses)
  - Implement productReview query (single review)
  - Implement approveProductReview mutation
  - Implement rejectProductReview mutation
  - Implement deleteProductReview mutation
  - Add admin permission guards
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.4_

- [x] 6. Implement ReviewImportService for external platform imports
  - Create ReviewImportService class
  - Install axios and cheerio dependencies for web scraping (MANUAL: Run `npm install axios cheerio`)
  - Implement importFromJumia() method with URL parsing and scraping
  - Implement importFromAliExpress() method with URL parsing and scraping
  - Implement scrapeJumiaReviews() helper to extract review data from HTML
  - Implement scrapeAliExpressReviews() helper to extract review data
  - Implement downloadAndUploadImage() to fetch external images and create Assets
  - Handle errors gracefully and return import summary
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Add import mutations to Admin API
  - Add importReviewsFromJumia mutation to admin-api-extensions.ts
  - Add importReviewsFromAliExpress mutation to admin-api-extensions.ts
  - Implement resolver methods in admin-api.resolver.ts
  - Add ReviewImportResult type to schema
  - Add error handling and validation
  - _Requirements: 6.1, 6.2, 6.5, 7.1, 7.2, 7.5_

- [x] 8. Configure plugin and register all components
  - Update product-reviews.plugin.ts with all entities, services, and resolvers
  - Configure custom fields for Product entity
  - Register Shop API extensions
  - Register Admin API extensions
  - Add plugin options interface for configuration
  - Export plugin with init() method
  - _Requirements: All requirements depend on plugin registration_

- [x] 9. Create and run database migration
  - Generate migration using Vendure CLI: `npx vendure migrate product-reviews`
  - Review generated migration for ProductReview, ReviewVote, ReviewReply entities
  - Review Product custom fields migration
  - Run migration: `npx vendure migrate product-reviews` (MANUAL: Run this command to apply migration)
  - Verify database schema changes
  - _Requirements: 1.1, 1.3, 4.1, 9.1, 10.1_

- [x] 10. Register plugin in Vendure configuration
  - Import ProductReviewsPlugin in vendure-config.ts
  - Add plugin to plugins array with configuration options
  - Set maxImagesPerReview and other options
  - Verify plugin loads without errors
  - _Requirements: All requirements depend on plugin being loaded_
