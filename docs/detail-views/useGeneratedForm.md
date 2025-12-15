# UseGeneratedForm


## useGeneratedForm​


[​](#usegeneratedform)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[use-generated-form.tsx](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/form-engine/use-generated-form.tsx#L80)This hook is used to create a form from a document and an entity.
It will create a form with the fields defined in the document's input type.
It will also create a submit handler that will submit the form to the server.

This hook is mostly used internally by the higher-level useDetailPage hook,
but can in some cases be useful to use directly.

[useDetailPage](/reference/dashboard/detail-views/use-detail-page#usedetailpage)Example

```
const { form, submitHandler } = useGeneratedForm({ document: setDraftOrderCustomFieldsDocument, varName: undefined, entity: entity, setValues: entity => {   return {     orderId: entity.id,     input: {       customFields: entity.customFields,     },   }; },});
```

```
function useGeneratedForm<T extends TypedDocumentNode<any, any>, VarName extends keyof VariablesOf<T> | undefined, E extends Record<string, any> = Record<string, any>>(options: GeneratedFormOptions<T, VarName, E>): void
```

Parameters

### options​


[​](#options)[GeneratedFormOptions](/reference/dashboard/detail-views/use-generated-form#generatedformoptions)
## GeneratedFormOptions​


[​](#generatedformoptions)[@vendure/dashboard](https://www.npmjs.com/package/@vendure/dashboard)[use-generated-form.tsx](https://github.com/vendure-ecommerce/vendure/blob/master/packages/dashboard/src/lib/framework/form-engine/use-generated-form.tsx#L20)Options for the useGeneratedForm hook.

```
interface GeneratedFormOptions<T extends TypedDocumentNode<any, any>, VarName extends keyof VariablesOf<T> | undefined = 'input', E extends Record<string, any> = Record<string, any>> {    document?: T;    varName?: VarName;    entity: E | null | undefined;    customFieldConfig?: any[];    setValues: (        entity: NonNullable<E>,    ) => VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>;    onSubmit?: (        values: VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>,    ) => void;}
```

### document​


[​](#document)The document to use to generate the form.

### varName​


[​](#varname)The name of the variable to use in the document.

### entity​


[​](#entity)The entity to use to generate the form.

### customFieldConfig​


[​](#customfieldconfig)
### setValues​


[​](#setvalues)
### onSubmit​


[​](#onsubmit)