# UseDetailPage


## useDetailPage​


[​](#usedetailpage)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[use-detail-page.ts](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/page/use-detail-page.ts#L238)Status: Developer Preview

This hook is used to create an entity detail page which can read
and update an entity.

Example

```
const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({    queryDocument: paymentMethodDetailDocument,    createDocument: createPaymentMethodDocument,    updateDocument: updatePaymentMethodDocument,    setValuesForUpdate: entity => {        return {            id: entity.id,            enabled: entity.enabled,            name: entity.name,            code: entity.code,            description: entity.description,            checker: entity.checker?.code                ? {                      code: entity.checker?.code,                      arguments: entity.checker?.args,                  }                : null,            handler: entity.handler?.code                ? {                      code: entity.handler?.code,                      arguments: entity.handler?.args,                  }                : null,            translations: entity.translations.map(translation => ({                id: translation.id,                languageCode: translation.languageCode,                name: translation.name,                description: translation.description,            })),            customFields: entity.customFields,        };    },    transformCreateInput: input => {        return {            ...input,            checker: input.checker?.code ? input.checker : undefined,            handler: input.handler,        };    },    params: { id: params.id },    onSuccess: async data => {        toast.success(i18n.t('Successfully updated payment method'));        resetForm();        if (creatingNewEntity) {            await navigate({ to: `../$id`, params: { id: data.id } });        }    },    onError: err => {        toast.error(i18n.t('Failed to update payment method'), {            description: err instanceof Error ? err.message : 'Unknown error',        });    },});
```

```
function useDetailPage<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = keyof ResultOf<T>, VarNameUpdate extends keyof VariablesOf<U> = 'input', VarNameCreate extends keyof VariablesOf<C> = 'input'>(options: DetailPageOptions<T, C, U, EntityField, VarNameCreate, VarNameUpdate>): UseDetailPageResult<T, U, EntityField>
```

Parameters

### options​


[​](#options)[DetailPageOptions](/reference/dashboard/detail-views/use-detail-page#detailpageoptions)
## DetailPageOptions​


[​](#detailpageoptions)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[use-detail-page.ts](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/page/use-detail-page.ts#L46)Options used to configure the result of the useDetailPage hook.

```
interface DetailPageOptions<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = DetailEntityPath<T>, VarNameCreate extends keyof VariablesOf<C> = 'input', VarNameUpdate extends keyof VariablesOf<U> = 'input'> {    pageId?: string;    queryDocument: T;    entityField?: EntityField;    params: {        id: string;    };    entityName?: string;    createDocument?: C;    updateDocument?: U;    setValuesForUpdate: (entity: NonNullable<ResultOf<T>[EntityField]>) => VariablesOf<U>[VarNameUpdate];    transformCreateInput?: (input: VariablesOf<C>[VarNameCreate]) => VariablesOf<C>[VarNameCreate];    transformUpdateInput?: (input: VariablesOf<U>[VarNameUpdate]) => VariablesOf<U>[VarNameUpdate];    onSuccess?: (entity: ResultOf<C>[keyof ResultOf<C>] | ResultOf<U>[keyof ResultOf<U>]) => void;    onError?: (error: unknown) => void;}
```

### pageId​


[​](#pageid)The page id. This is optional, but if provided, it will be used to
identify the page when extending the detail page query

### queryDocument​


[​](#querydocument)The query document to fetch the entity.

### entityField​


[​](#entityfield)The field of the query document that contains the entity.

### params​


[​](#params)The parameters used to identify the entity.

### entityName​


[​](#entityname)The entity type name for custom field configuration lookup.
Required to filter out readonly custom fields before mutations.
If not provided, the function will try to infer it from the query document.

### createDocument​


[​](#createdocument)The document to create the entity.

### updateDocument​


[​](#updatedocument)The document to update the entity.

### setValuesForUpdate​


[​](#setvaluesforupdate)The function to set the values for the update document.

### transformCreateInput​


[​](#transformcreateinput)
### transformUpdateInput​


[​](#transformupdateinput)
### onSuccess​


[​](#onsuccess)The function to call when the update is successful.

### onError​


[​](#onerror)The function to call when the update is successful.

## UseDetailPageResult​


[​](#usedetailpageresult)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[use-detail-page.ts](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/page/use-detail-page.ts#L156)
```
interface UseDetailPageResult<T extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T>> {    form: UseFormReturn<RemoveNullFields<VariablesOf<U>['input']>>;    submitHandler: (event: FormEvent<HTMLFormElement>) => void;    entity?: DetailPageEntity<T, EntityField>;    isPending: boolean;    refreshEntity: () => void;    resetForm: () => void;}
```

### form​


[​](#form)
### submitHandler​


[​](#submithandler)
### entity​


[​](#entity)
### isPending​


[​](#ispending)
### refreshEntity​


[​](#refreshentity)
### resetForm​


[​](#resetform)