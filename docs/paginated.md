# Paginated lists


Vendure's list queries follow a set pattern which allows for pagination, filtering & sorting. This guide will demonstrate how
to implement your own paginated list queries.

## API definition​


[​](#api-definition)Let's start with defining the GraphQL schema for our query. In this example, we'll image that we have defined a custom entity to
represent a ProductReview. We want to be able to query a list of reviews in the Admin API. Here's how the schema definition
would look:

[custom entity](/guides/developer-guide/database-entity/)
```
import gql from 'graphql-tag';export const adminApiExtensions = gql`type ProductReview implements Node {  id: ID!  createdAt: DateTime!  updatedAt: DateTime!  product: Product!  productId: ID!  text: String!  rating: Float!}type ProductReviewList implements PaginatedList {  items: [ProductReview!]!  totalItems: Int!}# Generated at run-time by Vendureinput ProductReviewListOptionsextend type Query {   productReviews(options: ProductReviewListOptions): ProductReviewList!}`;

```

Note that we need to follow these conventions:

- The type must implement the Node interface, i.e. it must have an id: ID! field.
- The list type must be named <EntityName>List and must implement the PaginatedList interface.
- The list options input type must be named <EntityName>ListOptions.

Given this schema, at runtime Vendure will automatically generate the ProductReviewListOptions input type, including all the
filtering & sorting fields. This means that we don't need to define the input type ourselves.

## Resolver​


[​](#resolver)Next, we need to define the resolver for the query.

```
import { Args, Query, Resolver } from '@nestjs/graphql';import { Ctx, PaginatedList, RequestContext } from '@vendure/core';import { ProductReview } from '../entities/product-review.entity';import { ProductReviewService } from '../services/product-review.service';@Resolver()export class ProductReviewAdminResolver {    constructor(private productReviewService: ProductReviewService) {}    @Query()    async productReviews(        @Ctx() ctx: RequestContext,        @Args() args: any,    ): Promise<PaginatedList<ProductReview>> {        return this.productReviewService.findAll(ctx, args.options || undefined);    }}
```

## Service​


[​](#service)Finally, we need to implement the findAll() method on the ProductReviewService. Here we will use the
ListQueryBuilder to build the list query. The
ListQueryBuilder will take care of

[ListQueryBuilder](/reference/typescript-api/data-access/list-query-builder/)
```
import { Injectable } from '@nestjs/common';import { InjectConnection } from '@nestjs/typeorm';import { ListQueryBuilder, ListQueryOptions, PaginatedList, RequestContext } from '@vendure/core';import { ProductReview } from '../entities/product-review.entity';@Injectable()export class ProductReviewService {    constructor(        private listQueryBuilder: ListQueryBuilder,    ) {}    findAll(ctx: RequestContext, options?: ListQueryOptions<ProductReview>): Promise<PaginatedList<ProductReview>> {        return this.listQueryBuilder            .build(ProductReview, options, { relations: ['product'], ctx })            .getManyAndCount()            .then(([items, totalItems]) => ({ items, totalItems }));    }}
```

## Usage​


[​](#usage)Given the above parts of the plugin, we can now query the list of reviews in the Admin API:

- Query
- Response

```
query {  productReviews(    options: {      skip: 0      take: 10      sort: {        createdAt: DESC      }      filter: {        rating: {          between: { start: 3, end: 5 }        }      }    }) {    totalItems    items {      id      createdAt      product {        name      }      text      rating    }  }}
```

```
{  "data": {    "productReviews": {      "totalItems": 3,      "items": [        {          "id": "12",          "createdAt": "2023-08-23T12:00:00Z",          "product": {            "name": "Smartphone X"          },          "text": "The best phone I've ever had!",          "rating": 5        },        {          "id": "42",          "createdAt": "2023-08-22T15:30:00Z",          "product": {            "name": "Laptop Y"          },          "text": "Impressive performance and build quality.",          "rating": 4        },        {          "id": "33",          "createdAt": "2023-08-21T09:45:00Z",          "product": {            "name": "Headphones Z"          },          "text": "Decent sound quality but uncomfortable.",          "rating": 3        }      ]    }  }}
```

In the above example, we are querying the first 10 reviews, sorted by createdAt in descending order, and filtered to only
include reviews with a rating between 3 and 5.

## Advanced filtering​


[​](#advanced-filtering)Vendure v2.2.0 introduced the ability to construct complex nested filters on any PaginatedList query. For example, we could
filter the above query to only include reviews for products with a name starting with "Smartphone":

- Query
- Response

```
query {  productReviews(    options: {    skip: 0    take: 10    filter: {      _and: [        { text: { startsWith: "phone" } },        {          _or: [            { rating: { gte: 4 } },            { rating: { eq: 0 } }          ]        }      ]    }    }) {    totalItems    items {      id      createdAt      product {        name      }      text      rating    }  }}
```

```
{  "data": {    "productReviews": {      "totalItems": 3,      "items": [        {          "id": "12",          "createdAt": "2023-08-23T12:00:00Z",          "product": {            "name": "Smartphone X"          },          "text": "The best phone I've ever had!",          "rating": 5        },        {          "id": "42",          "createdAt": "2023-08-22T15:30:00Z",          "product": {            "name": "Smartphone Y"          },          "text": "Not a very good phone at all.",          "rating": 0        }      ]    }  }}
```

In the example above, we are filtering for reviews of products with the word "phone" and a rating of 4 or more,
or a rating of 0. The _and and _or operators can be nested to any depth, allowing for arbitrarily complex filters.

## Filtering by custom properties​


[​](#filtering-by-custom-properties)By default, the ListQueryBuilder will only allow filtering by properties which are defined on the entity itself.
So in the case of the ProductReview, we can filter by rating and text etc., but not by product.name.

However, it is possible to extend your GraphQL type to allow filtering by custom properties. Let's implement filtering
but the product.name property. First, we need to manually add the productName field to
the ProductReviewFilterParameter type:

```
import gql from 'graphql-tag';export const adminApiExtensions = gql`# ... existing definitions from earlier example omittedinput ProductReviewFilterParameter {  productName: StringOperators}`;

```

Next we need to update our ProductReviewService to be able to handle filtering on this new field using the
customPropertyMap option:

[customPropertyMap](/reference/typescript-api/data-access/list-query-builder/#custompropertymap)
```
import { Injectable } from '@nestjs/common';import { InjectConnection } from '@nestjs/typeorm';import { ListQueryBuilder, ListQueryOptions, PaginatedList, RequestContext } from '@vendure/core';import { ProductReview } from '../entities/product-review.entity';@Injectable()export class ProductReviewService {    constructor(        private listQueryBuilder: ListQueryBuilder,    ) {}    findAll(ctx: RequestContext, options?: ListQueryOptions<ProductReview>): Promise<PaginatedList<ProductReview>> {        return this.listQueryBuilder            .build(ProductReview, options, {                relations: ['product'],                ctx,                customPropertyMap: {                    productName: 'product.name',                }            })            .getManyAndCount()            .then(([items, totalItems]) => ({ items, totalItems }));    }}
```

Upon restarting your server, you should now be able to filter by productName:

```
query {  productReviews(    options: {      skip: 0      take: 10      filter: {        productName: {          contains: "phone"        }      }  }) {    totalItems    items {      id      createdAt      product {        name      }      text      rating    }  }}
```