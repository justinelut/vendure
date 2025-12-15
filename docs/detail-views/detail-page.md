# DetailPage


## DetailPage​


[​](#detailpage)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[detail-page.tsx](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/page/detail-page.tsx#L147)Auto-generates a detail page with a form based on the provided query and mutation documents.

For more control over the layout, you would use the more low-level Page component.

[Page](/reference/dashboard/page-layout/page#page)
```
function DetailPage<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>>(props: DetailPageProps<T, C, U>): void
```

Parameters

### props​


[​](#props)[DetailPageProps](/reference/dashboard/detail-views/detail-page#detailpageprops)
## DetailPageProps​


[​](#detailpageprops)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[detail-page.tsx](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/page/detail-page.tsx#L43)Props to configure the DetailPage component.

[DetailPage](/reference/dashboard/detail-views/detail-page#detailpage)
```
interface DetailPageProps<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = DetailEntityPath<T>> {    entityName?: string;    pageId: string;    route: AnyRoute;    title: (entity: ResultOf<T>[EntityField]) => string;    queryDocument: T;    createDocument?: C;    updateDocument: U;    setValuesForUpdate: (entity: ResultOf<T>[EntityField]) => VariablesOf<U>['input'];}
```

### entityName​


[​](#entityname)The name of the entity.
If not provided, it will be inferred from the query document.

### pageId​


[​](#pageid)A unique identifier for the page.

### route​


[​](#route)The Tanstack Router route used to navigate to this page.

### title​


[​](#title)The title of the page.

### queryDocument​


[​](#querydocument)The query document used to fetch the entity.

### createDocument​


[​](#createdocument)The mutation document used to create the entity.

### updateDocument​


[​](#updatedocument)The mutation document used to update the entity.

### setValuesForUpdate​


[​](#setvaluesforupdate)A function that sets the values for the update input type based on the entity.