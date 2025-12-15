# Requirements Document

## Introduction

This feature adds support for digital products (ebooks, online courses, software) to the Vendure e-commerce platform. Digital products are delivered electronically and do not require physical shipping. The system must distinguish between digital and physical products, handle fulfillment differently, and automatically generate download links upon payment completion.

## Glossary

- **Digital Product**: A product delivered electronically (e.g., ebook, software, online course) that does not require physical shipping
- **Physical Product**: A tangible product that requires physical shipping
- **ProductVariant**: A specific variant of a product in Vendure (e.g., different sizes, colors, or formats)
- **ShippingMethod**: A method of delivering products to customers (e.g., standard shipping, express shipping, digital download)
- **FulfillmentHandler**: A component responsible for creating fulfillment records when an order is fulfilled
- **ShippingEligibilityChecker**: A component that determines if a shipping method is applicable to an order
- **ShippingLineAssignmentStrategy**: A component that assigns order lines to appropriate shipping methods
- **OrderProcess**: A component that defines custom behavior during order state transitions
- **CustomField**: An extension field added to Vendure entities to store additional data
- **Order**: A customer's purchase containing one or more order lines
- **OrderLine**: A single line item in an order representing a product variant and quantity
- **Fulfillment**: A record indicating that products have been delivered to the customer

## Requirements

### Requirement 1

**User Story:** As a store administrator, I want to mark product variants as digital products, so that the system can handle them differently from physical products

#### Acceptance Criteria

1. THE System SHALL add a boolean custom field named "isDigital" to the ProductVariant entity
2. THE System SHALL set the default value of the "isDigital" field to false
3. THE System SHALL make the "isDigital" field publicly accessible through the API
4. THE System SHALL display the label "This product is digital" for the "isDigital" field in the admin interface

### Requirement 2

**User Story:** As a store administrator, I want to configure shipping methods specifically for digital products, so that customers can select appropriate delivery options

#### Acceptance Criteria

1. THE System SHALL add a boolean custom field named "digitalFulfilmentOnly" to the ShippingMethod entity
2. THE System SHALL set the default value of the "digitalFulfilmentOnly" field to false
3. THE System SHALL make the "digitalFulfilmentOnly" field publicly accessible through the API
4. THE System SHALL display the label "Digital fulfilment only" for the field in the admin interface

### Requirement 3

**User Story:** As a store administrator, I want to store download URLs for digital products, so that customers can access their purchases

#### Acceptance Criteria

1. THE System SHALL add a string list custom field named "downloadUrls" to the Fulfillment entity
2. THE System SHALL allow the "downloadUrls" field to be nullable
3. THE System SHALL make the "downloadUrls" field publicly accessible through the API
4. THE System SHALL display the label "Urls of any digital purchases" for the field in the admin interface

### Requirement 4

**User Story:** As a customer, I want digital products to be automatically fulfilled when my payment is authorized, so that I can access my purchases immediately

#### Acceptance Criteria

1. WHEN an Order transitions from "ArrangingPayment" to "PaymentAuthorized", THE System SHALL automatically create fulfillment for all digital product order lines
2. WHEN an Order transitions from "ArrangingPayment" to "PaymentSettled", THE System SHALL automatically create fulfillment for all digital product order lines
3. WHEN creating fulfillment for digital products, THE System SHALL use the digital fulfillment handler
4. WHEN creating fulfillment for digital products, THE System SHALL include all order lines where the product variant has "isDigital" set to true

### Requirement 5

**User Story:** As a customer, I want to receive download links for my digital products, so that I can access the content I purchased

#### Acceptance Criteria

1. WHEN the System creates fulfillment for a digital product, THE System SHALL generate a unique download URL for each digital order line
2. WHEN generating download URLs, THE System SHALL store the URLs in the Fulfillment entity's "downloadUrls" custom field
3. THE System SHALL set the fulfillment method to "Digital Fulfillment"
4. THE System SHALL set the tracking code to "DIGITAL" for digital fulfillments

### Requirement 6

**User Story:** As a customer, I want to see only applicable shipping methods during checkout, so that I can select the correct delivery option for my order

#### Acceptance Criteria

1. WHEN an Order contains at least one digital product, THE System SHALL include digital shipping methods in the eligible shipping methods list
2. WHEN an Order contains only physical products, THE System SHALL exclude digital-only shipping methods from the eligible shipping methods list
3. THE System SHALL evaluate shipping eligibility based on the "isDigital" custom field of product variants in the order
4. THE System SHALL allow orders containing both digital and physical products to have multiple shipping methods

### Requirement 7

**User Story:** As a customer, I want digital products to be assigned to digital shipping methods and physical products to physical shipping methods, so that my order is fulfilled correctly

#### Acceptance Criteria

1. WHEN a ShippingMethod has "digitalFulfilmentOnly" set to true, THE System SHALL assign only order lines with digital products to that shipping method
2. WHEN a ShippingMethod has "digitalFulfilmentOnly" set to false, THE System SHALL assign only order lines with physical products to that shipping method
3. THE System SHALL evaluate the "isDigital" custom field on product variants to determine assignment
4. THE System SHALL support multiple shipping lines per order when the order contains both digital and physical products
