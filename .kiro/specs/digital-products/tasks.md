# Implementation Plan

- [x] 1. Create plugin structure and custom fields configuration


  - Create the main plugin file at `src/plugins/digital-products/digital-products.plugin.ts`
  - Import required Vendure modules (PluginCommonModule, VendurePlugin, LanguageCode)
  - Add `isDigital` boolean custom field to ProductVariant entity with default false and public access
  - Add `digitalFulfilmentOnly` boolean custom field to ShippingMethod entity with default false and public access
  - Add `downloadUrls` string list custom field to Fulfillment entity with nullable true and public access
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_



- [ ] 2. Implement digital fulfillment handler
  - Create `src/plugins/digital-products/config/digital-fulfillment-handler.ts`
  - Define FulfillmentHandler with code 'digital-fulfillment' and description
  - Implement `init()` method to inject TransactionalConnection
  - Implement `createFulfillment()` method to fetch OrderLine entities with ProductVariant relations
  - Filter order lines for digital products using `isDigital` custom field
  - Implement `generateDownloadUrl()` function to create placeholder download URLs
  - Return fulfillment data with method 'Digital Fulfillment', tracking code 'DIGITAL', and download URLs
  - Register the handler in plugin's `shippingOptions.fulfillmentHandlers` array


  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Implement shipping eligibility checker


  - Create `src/plugins/digital-products/config/digital-shipping-eligibility-checker.ts`
  - Define ShippingEligibilityChecker with code 'digital-shipping-eligibility-checker'


  - Implement `check()` method to filter order lines for digital products
  - Return true if at least one digital product exists in the order
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 4. Implement shipping line assignment strategy
  - Create `src/plugins/digital-products/config/digital-shipping-line-assignment-strategy.ts`
  - Create class implementing ShippingLineAssignmentStrategy interface
  - Implement `assignShippingLineToOrderLines()` method


  - Check if shipping method has `digitalFulfilmentOnly` custom field set to true
  - Assign only digital product order lines to digital shipping methods
  - Assign only physical product order lines to physical shipping methods
  - Register the strategy in plugin's `shippingOptions.shippingLineAssignmentStrategy` configuration
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Implement digital order process for automatic fulfillment
  - Create `src/plugins/digital-products/config/digital-order-process.ts`


  - Define OrderProcess with `init()` method to inject OrderService
  - Implement `onTransitionEnd()` method to monitor state transitions
  - Check for transitions from 'ArrangingPayment' to 'PaymentAuthorized' or 'PaymentSettled'
  - Filter order lines for digital products using `isDigital` custom field



  - Call `orderService.createFulfillment()` with digital order lines and digital fulfillment handler code
  - Register the order process in plugin's `orderOptions.process` array
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6. Register plugin in Vendure configuration
  - Import DigitalProductsPlugin in `src/vendure-config.ts`
  - Add DigitalProductsPlugin to the plugins array in VendureConfig
  - Verify plugin is properly integrated with existing configuration
  - _Requirements: All requirements depend on plugin registration_

- [ ] 7. Create database migration for custom fields
  - Generate migration using Vendure CLI: `npm run migration:generate digital-products`
  - Review generated migration file to ensure custom fields are correctly added
  - Run migration: `npm run migration:run`
  - Verify custom fields exist in database schema
  - _Requirements: 1.1, 2.1, 3.1_
