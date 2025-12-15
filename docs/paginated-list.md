# PaginatedList


## PaginatedList​


[​](#paginatedlist)[@vendure/common](https://www.npmjs.com/package/@vendure/common)[shared-types.ts](https://github.com/vendure-ecommerce/vendure/blob/master/packages/common/src/shared-types.ts#L67)A type describing the shape of a paginated list response. In Vendure, almost all list queries
(products, collections, orders, customers etc) return an object of this type.

```
type PaginatedList<T> = {    items: T[];    totalItems: number;}
```

### items​


[​](#items)
### totalItems​


[​](#totalitems)