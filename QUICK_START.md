# Product Reviews Plugin - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
npm install axios cheerio
```

### Step 2: Run Database Migration
```bash
npx vendure migrate
```

### Step 3: Start the Server
```bash
npm run dev
```

## 📝 Test the Implementation

### Test Shop API (Customer Features)

1. **Submit a Review** (requires authentication)
```graphql
mutation {
  submitProductReview(input: {
    productId: "1"
    rating: 5
    title: "Excellent product!"
    content: "This product exceeded my expectations. Highly recommended!"
  }) {
    id
    status
    verifiedPurchase
  }
}
```

2. **View Product Reviews**
```graphql
query {
  productReviews(productId: "1") {
    items {
      id
      rating
      title
      content
      authorName
      verifiedPurchase
      upvotes
      downvotes
    }
    totalItems
  }
}
```

3. **Get Review Statistics**
```graphql
query {
  productReviewStatistics(productId: "1") {
    averageRating
    totalReviews
    ratingDistribution
  }
}
```

4. **Vote on a Review** (requires authentication)
```graphql
mutation {
  voteOnReview(reviewId: "1", vote: UP) {
    id
    upvotes
    downvotes
  }
}
```

### Test Admin API (Admin Features)

1. **View Pending Reviews**
```graphql
query {
  productReviews(options: {
    filter: { status: { eq: "pending" } }
  }) {
    items {
      id
      rating
      title
      content
      status
    }
    totalItems
  }
}
```

2. **Approve a Review**
```graphql
mutation {
  approveProductReview(id: "1") {
    id
    status
  }
}
```

3. **Import Reviews from Jumia**
```graphql
mutation {
  importReviewsFromJumia(
    productId: "1"
    jumiaUrl: "https://www.jumia.com.ng/product-url"
  ) {
    success
    importedCount
    errors
  }
}
```

## 🔍 Verify Installation

Check that all tables were created:
- `product_review`
- `review_vote`
- `review_reply`
- `product_review_images_asset`

Check that Product custom fields were added:
- `customFieldsAveragerating`
- `customFieldsReviewcount`
- `customFieldsRatingdistribution`

## 🎯 Common Use Cases

### 1. Customer Submits Review After Purchase
- Customer logs in
- Navigates to product page
- Submits review with rating and text
- Review status is "pending"
- If customer purchased the product, `verifiedPurchase` is true

### 2. Admin Moderates Reviews
- Admin logs into admin panel
- Views pending reviews
- Approves or rejects reviews
- Product statistics are automatically updated

### 3. Import Existing Reviews
- Admin finds product on Jumia or AliExpress
- Copies product URL
- Uses import mutation with product ID and URL
- Reviews are imported with images
- Reviews are automatically approved

### 4. Customers Vote on Helpful Reviews
- Customer views product reviews
- Clicks upvote or downvote on helpful reviews
- Vote counts are updated
- Customer can change their vote

## 🐛 Troubleshooting

### Migration Fails
- Ensure database is not locked
- Check that vendure.sqlite file exists
- Verify migration file syntax

### Import Fails
- Check that axios and cheerio are installed
- Verify URL format is correct
- Check network connectivity
- Web scraping selectors may need adjustment

### Reviews Not Showing
- Check review status (only "approved" show in Shop API)
- Verify productId is correct
- Check GraphQL query syntax

## 📚 Next Steps

1. Customize web scraping selectors for your target sites
2. Add email notifications for review approval
3. Implement review moderation dashboard
4. Add review analytics and reporting
5. Configure auto-approval for verified purchases
6. Add review rewards/incentives

## 🔗 Resources

- Full documentation: `src/plugins/product-reviews/README.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Vendure docs: https://docs.vendure.io
