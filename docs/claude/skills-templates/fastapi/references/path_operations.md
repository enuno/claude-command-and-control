# Fastapi - Path Operations

**Pages:** 5

---

## APIRouter class¶

**URL:** https://fastapi.tiangolo.com/reference/apirouter/

**Contents:**
- APIRouter class¶
- fastapi.APIRouter ¶
    - Example¶
  - websocket ¶
      - Example¶
  - include_router ¶
      - Example¶
  - get ¶
      - Example¶
  - put ¶

Here's the reference information for the APIRouter class, with all its parameters, attributes and methods.

You can import the APIRouter class directly from fastapi:

APIRouter class, used to group path operations, for example to structure an app in multiple files. It would then be included in the FastAPI app, or in another APIRouter (ultimately included in the app).

Read more about it in the FastAPI docs for Bigger Applications - Multiple Files.

An optional path prefix for the router.

TYPE: str DEFAULT: ''

A list of tags to be applied to all the path operations in this router.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to all the path operations in this router.

Read more about it in the FastAPI docs for Bigger Applications - Multiple Files.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

The default response class to be used.

Read more in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Additional responses to be shown in OpenAPI.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Additional Responses in OpenAPI.

And in the FastAPI docs for Bigger Applications.

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

OpenAPI callbacks that should apply to all path operations in this router.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Note: you probably shouldn't use this parameter, it is inherited from Starlette and supported for compatibility.

A list of routes to serve incoming HTTP and WebSocket requests.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Whether to detect and redirect slashes in URLs when the client doesn't use the same format.

TYPE: bool DEFAULT: True

Default function handler for this router. Used to handle 404 Not Found errors.

TYPE: Optional[ASGIApp] DEFAULT: None

Only used internally by FastAPI to handle dependency overrides.

You shouldn't need to use it. It normally points to the FastAPI app object.

TYPE: Optional[Any] DEFAULT: None

Custom route (path operation) class to be used by this router.

Read more about it in the FastAPI docs for Custom Request and APIRoute class.

TYPE: type[APIRoute] DEFAULT: APIRoute

A list of startup event handler functions.

You should instead use the lifespan handlers.

Read more in the FastAPI docs for lifespan.

TYPE: Optional[Sequence[Callable[[], Any]]] DEFAULT: None

A list of shutdown event handler functions.

You should instead use the lifespan handlers.

Read more in the FastAPI docs for lifespan.

TYPE: Optional[Sequence[Callable[[], Any]]] DEFAULT: None

A Lifespan context manager handler. This replaces startup and shutdown functions with a single context manager.

Read more in the FastAPI docs for lifespan.

TYPE: Optional[Lifespan[Any]] DEFAULT: None

Mark all path operations in this router as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[bool] DEFAULT: None

To include (or not) all the path operations in this router in the generated OpenAPI.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Decorate a WebSocket function.

Read more about it in the FastAPI docs for WebSockets.

A name for the WebSocket. Only used internally.

TYPE: Optional[str] DEFAULT: None

A list of dependencies (using Depends()) to be used for this WebSocket.

Read more about it in the FastAPI docs for WebSockets.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

Include another APIRouter in the same current APIRouter.

Read more about it in the FastAPI docs for Bigger Applications.

The APIRouter to include.

An optional path prefix for the router.

TYPE: str DEFAULT: ''

A list of tags to be applied to all the path operations in this router.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to all the path operations in this router.

Read more about it in the FastAPI docs for Bigger Applications - Multiple Files.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

The default response class to be used.

Read more in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Additional responses to be shown in OpenAPI.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Additional Responses in OpenAPI.

And in the FastAPI docs for Bigger Applications.

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

OpenAPI callbacks that should apply to all path operations in this router.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Mark all path operations in this router as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[bool] DEFAULT: None

Include (or not) all the path operations in this router in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP GET operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP PUT operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP POST operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP DELETE operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP OPTIONS operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP HEAD operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP PATCH operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add a path operation using an HTTP TRACE operation.

The URL path to be used for this path operation.

For example, in http://example.com/items, the path is /items.

The type to use for the response.

It could be any valid Pydantic field type. So, it doesn't have to be a Pydantic model, it could be other things, like a list, dict, etc.

Read more about it in the FastAPI docs for Response Model.

TYPE: Any DEFAULT: Default(None)

The default status code to be used for the response.

You could override the status code by returning a response directly.

Read more about it in the FastAPI docs for Response Status Code.

TYPE: Optional[int] DEFAULT: None

A list of tags to be applied to the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[list[Union[str, Enum]]] DEFAULT: None

A list of dependencies (using Depends()) to be applied to the path operation.

Read more about it in the FastAPI docs for Dependencies in path operation decorators.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

A summary for the path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

A description for the path operation.

If not provided, it will be extracted automatically from the docstring of the path operation function.

It can contain Markdown.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[str] DEFAULT: None

The description for the default response.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: str DEFAULT: 'Successful Response'

Additional responses that could be returned by this path operation.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark this path operation as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Custom operation ID to be used by this path operation.

By default, it is generated automatically.

If you provide a custom operation ID, you need to make sure it is unique for the whole API.

You can customize the operation ID generation with the parameter generate_unique_id_function in the FastAPI class.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Optional[str] DEFAULT: None

Configuration passed to Pydantic to include only certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to exclude certain fields in the response data.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: Optional[IncEx] DEFAULT: None

Configuration passed to Pydantic to define if the response model should be serialized by alias when an alias is used.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: True

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that were not set and have their default values. This is different from response_model_exclude_defaults in that if the fields are set, they will be included in the response, even if the value is the same as the default.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should have all the fields, including the ones that have the same value as the default. This is different from response_model_exclude_unset in that if the fields are set but contain the same default values, they will be excluded from the response.

When True, default values are omitted from the response.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Configuration passed to Pydantic to define if the response data should exclude fields set to None.

This is much simpler (less smart) than response_model_exclude_unset and response_model_exclude_defaults. You probably want to use one of those two instead of this one, as those allow returning None values when it makes sense.

Read more about it in the FastAPI docs for Response Model - Return Type.

TYPE: bool DEFAULT: False

Include this path operation in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Response class to be used for this path operation.

This will not be used if you return a response directly.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Name for this path operation. Only used internally.

TYPE: Optional[str] DEFAULT: None

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Extra metadata to be included in the OpenAPI schema for this path operation.

Read more about it in the FastAPI docs for Path Operation Advanced Configuration.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Add an event handler for the router.

on_event is deprecated, use lifespan event handlers instead.

Read more about it in the FastAPI docs for Lifespan Events.

The type of event. startup or shutdown.

**Examples:**

Example 1 (python):
```python
from fastapi import APIRouter
```

Example 2 (rust):
```rust
APIRouter(
    *,
    prefix="",
    tags=None,
    dependencies=None,
    default_response_class=Default(JSONResponse),
    responses=None,
    callbacks=None,
    routes=None,
    redirect_slashes=True,
    default=None,
    dependency_overrides_provider=None,
    route_class=APIRoute,
    on_startup=None,
    on_shutdown=None,
    lifespan=None,
    deprecated=None,
    include_in_schema=True,
    generate_unique_id_function=Default(generate_unique_id)
)
```

Example 3 (python):
```python
from fastapi import APIRouter, FastAPI

app = FastAPI()
router = APIRouter()


@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


app.include_router(router)
```

Example 4 (python):
```python
def __init__(
    self,
    *,
    prefix: Annotated[str, Doc("An optional path prefix for the router.")] = "",
    tags: Annotated[
        Optional[list[Union[str, Enum]]],
        Doc(
            """
            A list of tags to be applied to all the *path operations* in this
            router.

            It will be added to the generated OpenAPI (e.g. visible at `/docs`).

            Read more about it in the
            [FastAPI docs for Path Operation Configuration](https://fastapi.tiangolo.com/tutorial/path-operation-configuration/).
            """
        ),
    ] = None,
    dependencies: Annotated[
        Optional[Sequence[params.Depends]],
        Doc(
            """
            A list of dependencies (using `Depends()`) to be applied to all the
            *path operations* in this router.

            Read more about it in the
            [FastAPI docs for Bigger Applications - Multiple Files](https://fastapi.tiangolo.com/tutorial/bigger-applications/#include-an-apirouter-with-a-custom-prefix-tags-responses-and-dependencies).
            """
        ),
    ] = None,
    default_response_class: Annotated[
        type[Response],
        Doc(
            """
            The default response class to be used.

            Read more in the
            [FastAPI docs for Custom Response - HTML, Stream, File, others](https://fastapi.tiangolo.com/advanced/custom-response/#default-response-class).
            """
        ),
    ] = Default(JSONResponse),
    responses: Annotated[
        Optional[dict[Union[int, str], dict[str, Any]]],
        Doc(
            """
            Additional responses to be shown in OpenAPI.

            It will be added to the generated OpenAPI (e.g. visible at `/docs`).

            Read more about it in the
            [FastAPI docs for Additional Responses in OpenAPI](https://fastapi.tiangolo.com/advanced/additional-responses/).

            And in the
            [FastAPI docs for Bigger Applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/#include-an-apirouter-with-a-custom-prefix-tags-responses-and-dependencies).
            """
        ),
    ] = None,
    callbacks: Annotated[
        Optional[list[BaseRoute]],
        Doc(
            """
            OpenAPI callbacks that should apply to all *path operations* in this
            router.

            It will be added to the generated OpenAPI (e.g. visible at `/docs`).

            Read more about it in the
            [FastAPI docs for OpenAPI Callbacks](https://fastapi.tiangolo.com/advanced/openapi-callbacks/).
            """
        ),
    ] = None,
    routes: Annotated[
        Optional[list[BaseRoute]],
        Doc(
            """
            **Note**: you probably shouldn't use this parameter, it is inherited
            from Starlette and supported for compatibility.

            ---

            A list of routes to serve incoming HTTP and WebSocket requests.
            """
        ),
        deprecated(
            """
            You normally wouldn't use this parameter with FastAPI, it is inherited
            from Starlette and supported for compatibility.

            In FastAPI, you normally would use the *path operation methods*,
            like `router.get()`, `router.post()`, etc.
            """
        ),
    ] = None,
    redirect_slashes: Annotated[
        bool,
        Doc(
            """
            Whether to detect and redirect slashes in URLs when the client doesn't
            use the same format.
            """
        ),
    ] = True,
    default: Annotated[
        Optional[ASGIApp],
        Doc(
            """
            Default function handler for this router. Used to handle
            404 Not Found errors.
            """
        ),
    ] = None,
    dependency_overrides_provider: Annotated[
        Optional[Any],
        Doc(
            """
            Only used internally by FastAPI to handle dependency overrides.

            You shouldn't need to use it. It normally points to the `FastAPI` app
            object.
            """
        ),
    ] = None,
    route_class: Annotated[
        type[APIRoute],
        Doc(
            """
            Custom route (*path operation*) class to be used by this router.

            Read more about it in the
            [FastAPI docs for Custom Request and APIRoute class](https://fastapi.tiangolo.com/how-to/custom-request-and-route/#custom-apiroute-class-in-a-router).
            """
        ),
    ] = APIRoute,
    on_startup: Annotated[
        Optional[Sequence[Callable[[], Any]]],
        Doc(
            """
            A list of startup event handler functions.

            You should instead use the `lifespan` handlers.

            Read more in the [FastAPI docs for `lifespan`](https://fastapi.tiangolo.com/advanced/events/).
            """
        ),
    ] = None,
    on_shutdown: Annotated[
        Optional[Sequence[Callable[[], Any]]],
        Doc(
            """
            A list of shutdown event handler functions.

            You should instead use the `lifespan` handlers.

            Read more in the
            [FastAPI docs for `lifespan`](https://fastapi.tiangolo.com/advanced/events/).
            """
        ),
    ] = None,
    # the generic to Lifespan[AppType] is the type of the top level application
    # which the router cannot know statically, so we use typing.Any
    lifespan: Annotated[
        Optional[Lifespan[Any]],
        Doc(
            """
            A `Lifespan` context manager handler. This replaces `startup` and
            `shutdown` functions with a single context manager.

            Read more in the
            [FastAPI docs for `lifespan`](https://fastapi.tiangolo.com/advanced/events/).
            """
        ),
    ] = None,
    deprecated: Annotated[
        Optional[bool],
        Doc(
            """
            Mark all *path operations* in this router as deprecated.

            It will be added to the generated OpenAPI (e.g. visible at `/docs`).

            Read more about it in the
            [FastAPI docs for Path Operation Configuration](https://fastapi.tiangolo.com/tutorial/path-operation-configuration/).
            """
        ),
    ] = None,
    include_in_schema: Annotated[
        bool,
        Doc(
            """
            To include (or not) all the *path operations* in this router in the
            generated OpenAPI.

            This affects the generated OpenAPI (e.g. visible at `/docs`).

            Read more about it in the
            [FastAPI docs for Query Parameters and String Validations](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/#exclude-parameters-from-openapi).
            """
        ),
    ] = True,
    generate_unique_id_function: Annotated[
        Callable[[APIRoute], str],
        Doc(
            """
            Customize the function used to generate unique IDs for the *path
            operations* shown in the generated OpenAPI.

            This is particularly useful when automatically generating clients or
            SDKs for your API.

            Read more about it in the
            [FastAPI docs about how to Generate Clients](https://fastapi.tiangolo.com/advanced/generate-clients/#custom-generate-unique-id-function).
            """
        ),
    ] = Default(generate_unique_id),
) -> None:
    super().__init__(
        routes=routes,
        redirect_slashes=redirect_slashes,
        default=default,
        on_startup=on_startup,
        on_shutdown=on_shutdown,
        lifespan=lifespan,
    )
    if prefix:
        assert prefix.startswith("/"), "A path prefix must start with '/'"
        assert not prefix.endswith("/"), (
            "A path prefix must not end with '/', as the routes will start with '/'"
        )
    self.prefix = prefix
    self.tags: list[Union[str, Enum]] = tags or []
    self.dependencies = list(dependencies or [])
    self.deprecated = deprecated
    self.include_in_schema = include_in_schema
    self.responses = responses or {}
    self.callbacks = callbacks or []
    self.dependency_overrides_provider = dependency_overrides_provider
    self.route_class = route_class
    self.default_response_class = default_response_class
    self.generate_unique_id_function = generate_unique_id_function
```

---

## Path Operation Advanced Configuration¶

**URL:** https://fastapi.tiangolo.com/advanced/path-operation-advanced-configuration/

**Contents:**
- Path Operation Advanced Configuration¶
- OpenAPI operationId¶
  - Using the path operation function name as the operationId¶
- Exclude from OpenAPI¶
- Advanced description from docstring¶
- Additional Responses¶
- OpenAPI Extra¶
  - OpenAPI Extensions¶
  - Custom OpenAPI path operation schema¶
  - Custom OpenAPI content type¶

If you are not an "expert" in OpenAPI, you probably don't need this.

You can set the OpenAPI operationId to be used in your path operation with the parameter operation_id.

You would have to make sure that it is unique for each operation.

If you want to use your APIs' function names as operationIds, you can iterate over all of them and override each path operation's operation_id using their APIRoute.name.

You should do it after adding all your path operations.

If you manually call app.openapi(), you should update the operationIds before that.

If you do this, you have to make sure each one of your path operation functions has a unique name.

Even if they are in different modules (Python files).

To exclude a path operation from the generated OpenAPI schema (and thus, from the automatic documentation systems), use the parameter include_in_schema and set it to False:

You can limit the lines used from the docstring of a path operation function for OpenAPI.

Adding an \f (an escaped "form feed" character) causes FastAPI to truncate the output used for OpenAPI at this point.

It won't show up in the documentation, but other tools (such as Sphinx) will be able to use the rest.

You probably have seen how to declare the response_model and status_code for a path operation.

That defines the metadata about the main response of a path operation.

You can also declare additional responses with their models, status codes, etc.

There's a whole chapter here in the documentation about it, you can read it at Additional Responses in OpenAPI.

When you declare a path operation in your application, FastAPI automatically generates the relevant metadata about that path operation to be included in the OpenAPI schema.

In the OpenAPI specification it is called the Operation Object.

It has all the information about the path operation and is used to generate the automatic documentation.

It includes the tags, parameters, requestBody, responses, etc.

This path operation-specific OpenAPI schema is normally generated automatically by FastAPI, but you can also extend it.

This is a low level extension point.

If you only need to declare additional responses, a more convenient way to do it is with Additional Responses in OpenAPI.

You can extend the OpenAPI schema for a path operation using the parameter openapi_extra.

This openapi_extra can be helpful, for example, to declare OpenAPI Extensions:

If you open the automatic API docs, your extension will show up at the bottom of the specific path operation.

And if you see the resulting OpenAPI (at /openapi.json in your API), you will see your extension as part of the specific path operation too:

The dictionary in openapi_extra will be deeply merged with the automatically generated OpenAPI schema for the path operation.

So, you could add additional data to the automatically generated schema.

For example, you could decide to read and validate the request with your own code, without using the automatic features of FastAPI with Pydantic, but you could still want to define the request in the OpenAPI schema.

You could do that with openapi_extra:

In this example, we didn't declare any Pydantic model. In fact, the request body is not even parsed as JSON, it is read directly as bytes, and the function magic_data_reader() would be in charge of parsing it in some way.

Nevertheless, we can declare the expected schema for the request body.

Using this same trick, you could use a Pydantic model to define the JSON Schema that is then included in the custom OpenAPI schema section for the path operation.

And you could do this even if the data type in the request is not JSON.

For example, in this application we don't use FastAPI's integrated functionality to extract the JSON Schema from Pydantic models nor the automatic validation for JSON. In fact, we are declaring the request content type as YAML, not JSON:

Nevertheless, although we are not using the default integrated functionality, we are still using a Pydantic model to manually generate the JSON Schema for the data that we want to receive in YAML.

Then we use the request directly, and extract the body as bytes. This means that FastAPI won't even try to parse the request payload as JSON.

And then in our code, we parse that YAML content directly, and then we are again using the same Pydantic model to validate the YAML content:

Here we reuse the same Pydantic model.

But the same way, we could have validated it in some other way.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/", operation_id="some_specific_id_you_define")
async def read_items():
    return [{"item_id": "Foo"}]
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.routing import APIRoute

app = FastAPI()


@app.get("/items/")
async def read_items():
    return [{"item_id": "Foo"}]


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name  # in this case, 'read_items'


use_route_names_as_operation_ids(app)
```

Example 3 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/", include_in_schema=False)
async def read_items():
    return [{"item_id": "Foo"}]
```

Example 4 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()


@app.post("/items/", response_model=Item, summary="Create an item")
async def create_item(item: Item):
    """
    Create an item with all the information:

    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    - **tags**: a set of unique tag strings for this item
    \f
    :param item: User input.
    """
    return item
```

---

## Custom Response Classes - File, HTML, Redirect, Streaming, etc.¶

**URL:** https://fastapi.tiangolo.com/reference/responses/

**Contents:**
- Custom Response Classes - File, HTML, Redirect, Streaming, etc.¶
- FastAPI Responses¶
- fastapi.responses.UJSONResponse ¶
  - charset class-attribute instance-attribute ¶
  - status_code instance-attribute ¶
  - media_type class-attribute instance-attribute ¶
  - body instance-attribute ¶
  - background instance-attribute ¶
  - headers property ¶
  - render ¶

There are several custom response classes you can use to create an instance and return them directly from your path operations.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

You can import them directly from fastapi.responses:

There are a couple of custom FastAPI response classes, you can use them to optimize JSON performance.

JSON response using the high-performance ujson library to serialize data to JSON.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

JSON response using the high-performance orjson library to serialize data to JSON.

Read more about it in the FastAPI docs for Custom Response - HTML, Stream, File, others.

**Examples:**

Example 1 (sql):
```sql
from fastapi.responses import (
    FileResponse,
    HTMLResponse,
    JSONResponse,
    ORJSONResponse,
    PlainTextResponse,
    RedirectResponse,
    Response,
    StreamingResponse,
    UJSONResponse,
)
```

Example 2 (rust):
```rust
UJSONResponse(
    content,
    status_code=200,
    headers=None,
    media_type=None,
    background=None,
)
```

Example 3 (python):
```python
def __init__(
    self,
    content: Any,
    status_code: int = 200,
    headers: Mapping[str, str] | None = None,
    media_type: str | None = None,
    background: BackgroundTask | None = None,
) -> None:
    super().__init__(content, status_code, headers, media_type, background)
```

Example 4 (unknown):
```unknown
charset = 'utf-8'
```

---

## Response class¶

**URL:** https://fastapi.tiangolo.com/reference/response/

**Contents:**
- Response class¶
- fastapi.Response ¶
  - media_type class-attribute instance-attribute ¶
  - charset class-attribute instance-attribute ¶
  - status_code instance-attribute ¶
  - background instance-attribute ¶
  - body instance-attribute ¶
  - headers property ¶
  - render ¶
  - init_headers ¶

You can declare a parameter in a path operation function or dependency to be of type Response and then you can set data for the response like headers or cookies.

You can also use it directly to create an instance of it and return it from your path operations.

You can import it directly from fastapi:

**Examples:**

Example 1 (python):
```python
from fastapi import Response
```

Example 2 (rust):
```rust
Response(
    content=None,
    status_code=200,
    headers=None,
    media_type=None,
    background=None,
)
```

Example 3 (python):
```python
def __init__(
    self,
    content: Any = None,
    status_code: int = 200,
    headers: Mapping[str, str] | None = None,
    media_type: str | None = None,
    background: BackgroundTask | None = None,
) -> None:
    self.status_code = status_code
    if media_type is not None:
        self.media_type = media_type
    self.background = background
    self.body = self.render(content)
    self.init_headers(headers)
```

Example 4 (rust):
```rust
media_type = None
```

---

## Sub Applications - Mounts¶

**URL:** https://fastapi.tiangolo.com/advanced/sub-applications/

**Contents:**
- Sub Applications - Mounts¶
- Mounting a FastAPI application¶
  - Top-level application¶
  - Sub-application¶
  - Mount the sub-application¶
  - Check the automatic API docs¶
  - Technical Details: root_path¶

If you need to have two independent FastAPI applications, with their own independent OpenAPI and their own docs UIs, you can have a main app and "mount" one (or more) sub-application(s).

"Mounting" means adding a completely "independent" application in a specific path, that then takes care of handling everything under that path, with the path operations declared in that sub-application.

First, create the main, top-level, FastAPI application, and its path operations:

Then, create your sub-application, and its path operations.

This sub-application is just another standard FastAPI application, but this is the one that will be "mounted":

In your top-level application, app, mount the sub-application, subapi.

In this case, it will be mounted at the path /subapi:

Now, run the fastapi command with your file:

And open the docs at http://127.0.0.1:8000/docs.

You will see the automatic API docs for the main app, including only its own path operations:

And then, open the docs for the sub-application, at http://127.0.0.1:8000/subapi/docs.

You will see the automatic API docs for the sub-application, including only its own path operations, all under the correct sub-path prefix /subapi:

If you try interacting with any of the two user interfaces, they will work correctly, because the browser will be able to talk to each specific app or sub-app.

When you mount a sub-application as described above, FastAPI will take care of communicating the mount path for the sub-application using a mechanism from the ASGI specification called a root_path.

That way, the sub-application will know to use that path prefix for the docs UI.

And the sub-application could also have its own mounted sub-applications and everything would work correctly, because FastAPI handles all these root_paths automatically.

You will learn more about the root_path and how to use it explicitly in the section about Behind a Proxy.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/app")
def read_main():
    return {"message": "Hello World from main app"}


subapi = FastAPI()


@subapi.get("/sub")
def read_sub():
    return {"message": "Hello World from sub API"}


app.mount("/subapi", subapi)
```

Example 2 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/app")
def read_main():
    return {"message": "Hello World from main app"}


subapi = FastAPI()


@subapi.get("/sub")
def read_sub():
    return {"message": "Hello World from sub API"}


app.mount("/subapi", subapi)
```

Example 3 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/app")
def read_main():
    return {"message": "Hello World from main app"}


subapi = FastAPI()


@subapi.get("/sub")
def read_sub():
    return {"message": "Hello World from sub API"}


app.mount("/subapi", subapi)
```

Example 4 (jsx):
```jsx
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

---
