# Relation Selectors


Relation selector components provide a powerful way to select related entities in your dashboard forms. They support both single and multi-selection modes with built-in search, infinite scroll pagination, and complete TypeScript type safety.

## Features​


[​](#features)- Real-time Search: Debounced search with customizable filters
- Infinite Scroll: Automatic pagination loading 25 items by default
- Single/Multi Select: Easy toggle between selection modes
- Type Safe: Full TypeScript support with generic types
- Customizable: Pass your own GraphQL queries and field mappings
- Accessible: Built with Radix UI primitives

## Components Overview​


[​](#components-overview)The relation selector system consists of three main components:

- RelationSelector: The abstract base component that handles all core functionality
- SingleRelationInput: Convenient wrapper for single entity selection
- MultiRelationInput: Convenient wrapper for multiple entity selection

## Basic Usage​


[​](#basic-usage)
### Single Selection​


[​](#single-selection)
```
import {    SingleRelationInput,    createRelationSelectorConfig,    graphql,    ResultOf,    CustomFormComponentInputProps,} from '@vendure/dashboard';// Define your GraphQL queryconst productListQuery = graphql(`    query GetProductsForSelection($options: ProductListOptions) {        products(options: $options) {            items {                id                name                slug                featuredAsset {                    id                    preview                }            }            totalItems        }    }`);// Create the configurationconst productConfig = createRelationSelectorConfig({    listQuery: productListQuery,    idKey: 'id',    labelKey: 'name',    placeholder: 'Search products...',    buildSearchFilter: (term: string) => ({        name: { contains: term },    }),});export function ProductSelectorComponent({ value, onChange, disabled }: CustomFormComponentInputProps) {    return (        <SingleRelationInput value={value} onChange={onChange} config={productConfig} disabled={disabled} />    );}
```

### Multi Selection​


[​](#multi-selection)
```
import { MultiRelationInput, CustomFormComponentInputProps } from '@vendure/dashboard';export function ProductMultiSelectorComponent({ value, onChange, disabled }: CustomFormComponentInputProps) {    return (        <MultiRelationInput            value={value || []}            onChange={onChange}            config={productConfig} // Same config as above            disabled={disabled}        />    );}
```

## Configuration Options​


[​](#configuration-options)The createRelationSelectorConfig function accepts these options:

```
interface RelationSelectorConfig<T> {    /** The GraphQL query document for fetching items */    listQuery: DocumentNode;    /** The property key for the entity ID */    idKey: keyof T;    /** The property key for the display label (used as fallback when label function not provided) */    labelKey: keyof T;    /** Number of items to load per page (default: 25) */    pageSize?: number;    /** Placeholder text for the search input */    placeholder?: string;    /** Whether to enable multi-select mode */    multiple?: boolean;    /** Custom filter function for search */    buildSearchFilter?: (searchTerm: string) => any;    /** Custom label renderer function for rich display */    label?: (item: T) => React.ReactNode;}
```

## Rich Label Display​


[​](#rich-label-display)The label prop allows you to customize how items are displayed in both the dropdown and selected item chips. This enables rich content like images, badges, and multi-line information.

### Product Selector with Images and Pricing​


[​](#product-selector-with-images-and-pricing)
```
import {    SingleRelationInput,    createRelationSelectorConfig,    graphql,    ResultOf,    CustomFormComponentInputProps,} from '@vendure/dashboard';const productListQuery = graphql(`    query GetProductsWithDetails($options: ProductListOptions) {        products(options: $options) {            items {                id                name                slug                featuredAsset {                    id                    preview                }                variants {                    id                    price                    currencyCode                }            }            totalItems        }    }`);const richProductConfig = createRelationSelectorConfig<    ResultOf<typeof productListQuery>['products']['items'][0]>({    listQuery: productListQuery,    idKey: 'id',    labelKey: 'name', // Used as fallback    placeholder: 'Search products...',    label: product => (        <div className="flex items-center gap-3 py-1">            {product.featuredAsset?.preview && (                <img                    src={product.featuredAsset.preview}                    alt={product.name}                    className="w-10 h-10 rounded object-cover"                />            )}            <div className="flex-1 min-w-0">                <div className="font-medium truncate">{product.name}</div>                <div className="text-sm text-muted-foreground">                    {product.variants[0] && (                        <span>                            {product.variants[0].price / 100} {product.variants[0].currencyCode}                        </span>                    )}                </div>            </div>        </div>    ),    buildSearchFilter: (term: string) => ({        name: { contains: term },    }),});export function RichProductSelectorComponent({ value, onChange, disabled }: CustomFormComponentInputProps) {    return (        <SingleRelationInput            value={value}            onChange={onChange}            config={richProductConfig}            disabled={disabled}        />    );}
```

### Customer Selector with Status Badges​


[​](#customer-selector-with-status-badges)
```
import {    MultiRelationInput,    createRelationSelectorConfig,    graphql,    ResultOf,    CustomFormComponentInputProps,} from '@vendure/dashboard';const customerListQuery = graphql(`    query GetCustomersWithStatus($options: CustomerListOptions) {        customers(options: $options) {            items {                id                firstName                lastName                emailAddress                user {                    verified                    lastLogin                }                orders {                    totalQuantity                }            }            totalItems        }    }`);const customerConfig = createRelationSelectorConfig<    ResultOf<typeof customerListQuery>['customers']['items'][0]>({    listQuery: customerListQuery,    idKey: 'id',    labelKey: 'emailAddress',    placeholder: 'Search customers...',    label: customer => (        <div className="flex items-center justify-between py-1 w-full">            <div className="flex-1 min-w-0">                <div className="font-medium truncate">                    {customer.firstName} {customer.lastName}                </div>                <div className="text-sm text-muted-foreground truncate">{customer.emailAddress}</div>            </div>            <div className="flex items-center gap-2 ml-2">                {customer.user?.verified ? (                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">                        Verified                    </span>                ) : (                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">                        Unverified                    </span>                )}                <span className="text-xs text-muted-foreground">{customer.orders.totalQuantity} orders</span>            </div>        </div>    ),    buildSearchFilter: (term: string) => ({        or: [            { emailAddress: { contains: term } },            { firstName: { contains: term } },            { lastName: { contains: term } },        ],    }),});export function CustomerSelectorWithStatusComponent({    value,    onChange,    disabled,}: CustomFormComponentInputProps) {    return (        <MultiRelationInput            value={value || []}            onChange={onChange}            config={customerConfig}            disabled={disabled}        />    );}
```

## Advanced Examples​


[​](#advanced-examples)
### Custom Entity with Complex Search​


[​](#custom-entity-with-complex-search)
```
import {    SingleRelationInput,    createRelationSelectorConfig,    graphql,    ResultOf,    CustomFormComponentInputProps,} from '@vendure/dashboard';const reviewFragment = graphql(`    fragment ReviewForSelector on ProductReview {        id        title        rating        summary        state        product {            name        }    }`);const reviewListQuery = graphql(    `        query GetReviewsForSelection($options: ProductReviewListOptions) {            productReviews(options: $options) {                items {                    ...ReviewForSelector                }                totalItems            }        }    `,    [reviewFragment],);const reviewConfig = createRelationSelectorConfig<ResultOf<typeof reviewFragment>>({    listQuery: reviewListQuery,    idKey: 'id',    labelKey: 'title',    placeholder: 'Search reviews by title or summary...',    pageSize: 20, // Custom page size    buildSearchFilter: (term: string) => ({        // Search across multiple fields        or: [            { title: { contains: term } },            { summary: { contains: term } },            { product: { name: { contains: term } } },        ],    }),});export function ReviewSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {    return <SingleRelationInput value={value} onChange={onChange} config={reviewConfig} />;}
```

### Asset Selector with Type Filtering​


[​](#asset-selector-with-type-filtering)
```
import {    graphql,    createRelationSelectorConfig,    SingleRelationInput,    CustomFormComponentInputProps,} from '@vendure/dashboard';const assetListQuery = graphql(`    query GetAssetsForSelection($options: AssetListOptions) {        assets(options: $options) {            items {                id                name                preview                type                fileSize            }            totalItems        }    }`);const imageAssetConfig = createRelationSelectorConfig({    listQuery: assetListQuery,    idKey: 'id',    labelKey: 'name',    placeholder: 'Search images...',    buildSearchFilter: (term: string) => ({        and: [            { type: { eq: 'IMAGE' } }, // Only show images            {                or: [{ name: { contains: term } }, { preview: { contains: term } }],            },        ],    }),});export function ImageSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {    return <SingleRelationInput value={value} onChange={onChange} config={imageAssetConfig} />;}
```

### Multi-Select with Status Filtering​


[​](#multi-select-with-status-filtering)
```
import {    MultiRelationInput,    createRelationSelectorConfig,    graphql,    CustomFormComponentInputProps,} from '@vendure/dashboard';const customerListQuery = graphql(`    query GetCustomersForSelection($options: CustomerListOptions) {        customers(options: $options) {            items {                id                firstName                lastName                emailAddress                user {                    verified                }            }            totalItems        }    }`);const activeCustomerConfig = createRelationSelectorConfig({    listQuery: customerListQuery,    idKey: 'id',    labelKey: 'emailAddress',    placeholder: 'Search verified customers...',    pageSize: 30,    buildSearchFilter: (term: string) => ({        and: [            { user: { verified: { eq: true } } }, // Only verified customers            {                or: [                    { emailAddress: { contains: term } },                    { firstName: { contains: term } },                    { lastName: { contains: term } },                ],            },        ],    }),});export function ActiveCustomerSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {    return <MultiRelationInput value={value || []} onChange={onChange} config={activeCustomerConfig} />;}
```

## Registration​


[​](#registration)Register your relation selector components in your dashboard extension:

```
import { defineDashboardExtension } from '@vendure/dashboard';import {    ProductSelectorComponent,    ReviewSelectorComponent,    ImageSelectorComponent,    ActiveCustomerSelectorComponent,} from './components';defineDashboardExtension({    detailForms: [        {            pageId: 'product-detail',            inputs: [                {                    blockId: 'product-form',                    field: 'featuredProductId',                    component: ProductSelectorComponent,                },                {                    blockId: 'product-form',                    field: 'relatedCustomerIds',                    component: ActiveCustomerSelectorComponent,                },            ],        },        {            pageId: 'collection-detail',            inputs: [                {                    blockId: 'collection-form',                    field: 'featuredImageId',                    component: ImageSelectorComponent,                },                {                    blockId: 'collection-form',                    field: 'featuredReviewId',                    component: ReviewSelectorComponent,                },            ],        },    ],});
```

## Built-in Configurations​


[​](#built-in-configurations)The relation selector package includes pre-configured setups for common Vendure entities:

```
import {    productRelationConfig,    customerRelationConfig,    collectionRelationConfig,    SingleRelationInput,    MultiRelationInput,    CustomFormComponentInputProps,} from '@vendure/dashboard';// Use pre-built configurationsexport function QuickProductSelector({ value, onChange }: CustomFormComponentInputProps) {    return <SingleRelationInput value={value} onChange={onChange} config={productRelationConfig} />;}export function QuickCustomerMultiSelector({ value, onChange }: CustomFormComponentInputProps) {    return <MultiRelationInput value={value || []} onChange={onChange} config={customerRelationConfig} />;}
```

## Best Practices​


[​](#best-practices)
### Query Optimization​


[​](#query-optimization)- Select only needed fields: Include only the fields you actually use to improve performance
- Use fragments: Create reusable fragments for consistent data fetching
- Optimize search filters: Use database indexes for the fields you search on

```
// Good: Minimal required fieldsconst productListQuery = graphql(`    query GetProductsForSelection($options: ProductListOptions) {        products(options: $options) {            items {                id                name                # Only include what you need            }            totalItems        }    }`);// Avoid: Over-fetching unnecessary dataconst productListQuery = graphql(`    query GetProductsForSelection($options: ProductListOptions) {        products(options: $options) {            items {                id                name                description                featuredAsset { ... } # Only if you display it                variants { ... }      # Usually not needed for selection                # etc.            }            totalItems        }    }`);

```

### Performance Tips​


[​](#performance-tips)- Appropriate page sizes: Balance between fewer requests and faster initial loads
- Debounced search: The default 300ms debounce prevents excessive API calls
- Caching: Queries are automatically cached by TanStack Query

```
const config = createRelationSelectorConfig({    listQuery: myQuery,    idKey: 'id',    labelKey: 'name',    pageSize: 25, // Good default, adjust based on your data    buildSearchFilter: (term: string) => ({        // Use indexed fields for better performance        name: { contains: term },    }),});
```

### Type Safety​


[​](#type-safety)Leverage TypeScript generics for full type safety:

```
interface MyEntity {    id: string;    title: string;    status: 'ACTIVE' | 'INACTIVE';}const myEntityConfig = createRelationSelectorConfig<MyEntity>({    listQuery: myEntityQuery,    idKey: 'id', // ✅ TypeScript knows this must be a key of MyEntity    labelKey: 'title', // ✅ TypeScript validates this field exists    buildSearchFilter: (term: string) => ({        title: { contains: term }, // ✅ Auto-completion and validation    }),});
```

### Rich Label Design​


[​](#rich-label-design)When using the label prop for custom rendering:

- Keep it simple: Avoid overly complex layouts that might impact performance
- Handle missing data: Always check for optional fields before rendering
- Maintain accessibility: Use proper semantic HTML and alt text for images
- Consider mobile: Ensure labels work well on smaller screens

```
// Good: Simple, robust label designlabel: item => (    <div className="flex items-center gap-2">        {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />}        <div className="flex-1 min-w-0">            <div className="font-medium truncate">{item.name}</div>            {item.status && <div className="text-sm text-muted-foreground">{item.status}</div>}        </div>    </div>);// Avoid: Overly complex layoutslabel: item => (    <div className="complex-grid-layout-with-many-nested-elements">        {/* Too much complexity can hurt performance */}    </div>);
```

## Troubleshooting​


[​](#troubleshooting)
### Common Issues​


[​](#common-issues)1. "Cannot query field X on type Query"

```
Error: Cannot query field "myEntities" on type "Query"
```

Solution: Ensure your GraphQL query field name matches your schema definition exactly.

2. Empty results despite data existing

```
// Problem: Wrong field used for searchbuildSearchFilter: (term: string) => ({    wrongField: { contains: term }, // This field doesn't exist});// Solution: Use correct field namesbuildSearchFilter: (term: string) => ({    name: { contains: term }, // Correct field name});
```

3. TypeScript errors with config

```
// Problem: Missing type parameterconst config = createRelationSelectorConfig({    // TypeScript can't infer the entity type});// Solution: Provide explicit type or use proper typingconst config = createRelationSelectorConfig<MyEntityType>({    // Now TypeScript knows the shape of your entity});
```

### Performance Issues​


[​](#performance-issues)If you experience slow loading:

- Check your GraphQL query: Ensure it's optimized and uses appropriate filters
- Verify database indexes: Make sure searched fields are indexed
- Adjust page size: Try smaller page sizes for faster initial loads
- Optimize buildSearchFilter: Use efficient query patterns

```
// Efficient search filterbuildSearchFilter: (term: string) => ({    name: { contains: term }, // Simple, indexed field});// Less efficientbuildSearchFilter: (term: string) => ({    or: [        { name: { contains: term } },        { description: { contains: term } },        { deepNestedField: { someComplexFilter: term } }, // Avoid deep nesting    ],});
```