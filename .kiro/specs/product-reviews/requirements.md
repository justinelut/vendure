# Product Reviews Plugin - Requirements Document

## Introduction

This feature adds a comprehensive product review and rating system to Vendure. Customers can leave reviews with ratings (1-5 stars), text content, and images. The system includes moderation capabilities, helpful vote tracking, and the ability to import reviews from external platforms like Jumia and AliExpress.

## Glossary

- **Product Review**: A customer's feedback on a product including rating, text, and optional images
- **Rating**: A numerical score from 1 to 5 stars given by a customer
- **Review Image**: Photos uploaded by customers as part of their review
- **Review Status**: The approval state of a review (pending, approved, rejected)
- **Helpful Votes**: Upvotes/downvotes from other customers on review helpfulness
- **Verified Purchase**: Indicates the reviewer actually purchased the product
- **Review Import**: Process of importing reviews from external platforms (Jumia, AliExpress)
- **Product**: The Vendure product entity being reviewed
- **Customer**: The Vendure customer entity who writes reviews

## Requirements

### Requirement 1

**User Story:** As a customer, I want to leave a product review with a rating and text, so that I can share my experience with other shoppers

#### Acceptance Criteria

1. THE System SHALL create a ProductReview entity with fields for rating, title, content, authorName, and authorLocation
2. THE System SHALL validate that rating is between 1 and 5
3. THE System SHALL associate each review with a Product and optionally a Customer
4. THE System SHALL record the creation date and last update date for each review
5. THE System SHALL set new reviews to "pending" status by default

### Requirement 2

**User Story:** As a customer, I want to upload images with my review, so that I can show the product in real-world use

#### Acceptance Criteria

1. THE System SHALL allow customers to upload multiple images per review
2. THE System SHALL store review images as Asset entities
3. THE System SHALL associate review images with the ProductReview entity
4. THE System SHALL support common image formats (JPEG, PNG, WebP)
5. THE System SHALL limit the number of images per review to a configurable maximum

### Requirement 3

**User Story:** As a store administrator, I want to moderate reviews before they appear publicly, so that I can maintain quality standards

#### Acceptance Criteria

1. THE System SHALL provide three review statuses: pending, approved, and rejected
2. THE System SHALL create an Admin API mutation to approve reviews
3. THE System SHALL create an Admin API mutation to reject reviews
4. THE System SHALL only display approved reviews in the Shop API
5. THE System SHALL allow administrators to view all reviews regardless of status

### Requirement 4

**User Story:** As a customer, I want to mark reviews as helpful or not helpful, so that useful reviews are highlighted

#### Acceptance Criteria

1. THE System SHALL track upvotes and downvotes for each review
2. THE System SHALL create a Shop API mutation to vote on review helpfulness
3. THE System SHALL prevent customers from voting multiple times on the same review
4. THE System SHALL calculate and display a helpfulness score for each review
5. THE System SHALL allow customers to change their vote

### Requirement 5

**User Story:** As a customer, I want to see if a reviewer actually purchased the product, so that I can trust the review more

#### Acceptance Criteria

1. THE System SHALL add a "verifiedPurchase" boolean field to ProductReview
2. WHEN a Customer who purchased the product leaves a review, THE System SHALL set verifiedPurchase to true
3. THE System SHALL check order history to verify purchases
4. THE System SHALL display a verified purchase badge in the Shop API response
5. THE System SHALL allow filtering reviews by verified purchase status

### Requirement 6

**User Story:** As a store administrator, I want to import reviews from Jumia, so that I can populate my store with existing reviews

#### Acceptance Criteria

1. THE System SHALL create an Admin API mutation to import reviews from Jumia
2. THE System SHALL accept a product URL or product ID from Jumia
3. THE System SHALL scrape or fetch review data from Jumia including rating, text, author, date, and images
4. THE System SHALL map Jumia reviews to ProductReview entities
5. THE System SHALL handle errors gracefully and report import status

### Requirement 7

**User Story:** As a store administrator, I want to import reviews from AliExpress, so that I can populate my store with existing reviews

#### Acceptance Criteria

1. THE System SHALL create an Admin API mutation to import reviews from AliExpress
2. THE System SHALL accept a product URL or product ID from AliExpress
3. THE System SHALL scrape or fetch review data from AliExpress including rating, text, author, date, and images
4. THE System SHALL map AliExpress reviews to ProductReview entities
5. THE System SHALL handle errors gracefully and report import status

### Requirement 8

**User Story:** As a customer, I want to view all reviews for a product with ratings and images, so that I can make informed purchase decisions

#### Acceptance Criteria

1. THE System SHALL create a Shop API query to fetch reviews for a product
2. THE System SHALL include rating, title, content, author, date, images, and helpful votes in the response
3. THE System SHALL support pagination for review lists
4. THE System SHALL support sorting by date, rating, or helpfulness
5. THE System SHALL support filtering by rating (e.g., only 5-star reviews)

### Requirement 9

**User Story:** As a store administrator, I want to see review statistics for products, so that I can understand customer satisfaction

#### Acceptance Criteria

1. THE System SHALL calculate average rating for each product
2. THE System SHALL calculate rating distribution (count of 1-star, 2-star, etc.)
3. THE System SHALL calculate total review count
4. THE System SHALL expose these statistics via Admin API
5. THE System SHALL update statistics when reviews are approved or rejected

### Requirement 10

**User Story:** As a customer, I want to respond to reviews or ask questions, so that I can engage with other customers

#### Acceptance Criteria

1. THE System SHALL allow adding reply comments to reviews
2. THE System SHALL associate replies with the parent review
3. THE System SHALL display replies nested under the original review
4. THE System SHALL allow store administrators to post official responses
5. THE System SHALL distinguish between customer replies and admin replies
