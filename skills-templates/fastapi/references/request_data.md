# Fastapi - Request Data

**Pages:** 7

---

## Using the Request Directly¶

**URL:** https://fastapi.tiangolo.com/advanced/using-request-directly/

**Contents:**
- Using the Request Directly¶
- Details about the Request object¶
- Use the Request object directly¶
- Request documentation¶

Up to now, you have been declaring the parts of the request that you need with their types.

And by doing so, FastAPI is validating that data, converting it and generating documentation for your API automatically.

But there are situations where you might need to access the Request object directly.

As FastAPI is actually Starlette underneath, with a layer of several tools on top, you can use Starlette's Request object directly when you need to.

It would also mean that if you get data from the Request object directly (for example, read the body) it won't be validated, converted or documented (with OpenAPI, for the automatic API user interface) by FastAPI.

Although any other parameter declared normally (for example, the body with a Pydantic model) would still be validated, converted, annotated, etc.

But there are specific cases where it's useful to get the Request object.

Let's imagine you want to get the client's IP address/host inside of your path operation function.

For that you need to access the request directly.

By declaring a path operation function parameter with the type being the Request FastAPI will know to pass the Request in that parameter.

Note that in this case, we are declaring a path parameter beside the request parameter.

So, the path parameter will be extracted, validated, converted to the specified type and annotated with OpenAPI.

The same way, you can declare any other parameter as normally, and additionally, get the Request too.

You can read more details about the Request object in the official Starlette documentation site.

You could also use from starlette.requests import Request.

FastAPI provides it directly just as a convenience for you, the developer. But it comes directly from Starlette.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI, Request

app = FastAPI()


@app.get("/items/{item_id}")
def read_root(item_id: str, request: Request):
    client_host = request.client.host
    return {"client_host": client_host, "item_id": item_id}
```

---

## Async Tests¶

**URL:** https://fastapi.tiangolo.com/advanced/async-tests/

**Contents:**
- Async Tests¶
- pytest.mark.anyio¶
- HTTPX¶
- Example¶
- Run it¶
- In Detail¶
- Other Asynchronous Function Calls¶

You have already seen how to test your FastAPI applications using the provided TestClient. Up to now, you have only seen how to write synchronous tests, without using async functions.

Being able to use asynchronous functions in your tests could be useful, for example, when you're querying your database asynchronously. Imagine you want to test sending requests to your FastAPI application and then verify that your backend successfully wrote the correct data in the database, while using an async database library.

Let's look at how we can make that work.

If we want to call asynchronous functions in our tests, our test functions have to be asynchronous. AnyIO provides a neat plugin for this, that allows us to specify that some test functions are to be called asynchronously.

Even if your FastAPI application uses normal def functions instead of async def, it is still an async application underneath.

The TestClient does some magic inside to call the asynchronous FastAPI application in your normal def test functions, using standard pytest. But that magic doesn't work anymore when we're using it inside asynchronous functions. By running our tests asynchronously, we can no longer use the TestClient inside our test functions.

The TestClient is based on HTTPX, and luckily, we can use it directly to test the API.

For a simple example, let's consider a file structure similar to the one described in Bigger Applications and Testing:

The file main.py would have:

The file test_main.py would have the tests for main.py, it could look like this now:

You can run your tests as usual via:

The marker @pytest.mark.anyio tells pytest that this test function should be called asynchronously:

Note that the test function is now async def instead of just def as before when using the TestClient.

Then we can create an AsyncClient with the app, and send async requests to it, using await.

This is the equivalent to:

...that we used to make our requests with the TestClient.

Note that we're using async/await with the new AsyncClient - the request is asynchronous.

If your application relies on lifespan events, the AsyncClient won't trigger these events. To ensure they are triggered, use LifespanManager from florimondmanca/asgi-lifespan.

As the testing function is now asynchronous, you can now also call (and await) other async functions apart from sending requests to your FastAPI application in your tests, exactly as you would call them anywhere else in your code.

If you encounter a RuntimeError: Task attached to a different loop when integrating asynchronous function calls in your tests (e.g. when using MongoDB's MotorClient), remember to instantiate objects that need an event loop only within async functions, e.g. an @app.on_event("startup") callback.

**Examples:**

Example 1 (unknown):
```unknown
.
├── app
│   ├── __init__.py
│   ├── main.py
│   └── test_main.py
```

Example 2 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Tomato"}
```

Example 3 (python):
```python
import pytest
from httpx import ASGITransport, AsyncClient

from .main import app


@pytest.mark.anyio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Tomato"}
```

Example 4 (php):
```php
$ pytest

---> 100%
```

---

## UploadFile class¶

**URL:** https://fastapi.tiangolo.com/reference/uploadfile/

**Contents:**
- UploadFile class¶
- fastapi.UploadFile ¶
    - Example¶
  - file instance-attribute ¶
  - filename instance-attribute ¶
  - size instance-attribute ¶
  - headers instance-attribute ¶
  - content_type instance-attribute ¶
  - read async ¶
  - write async ¶

You can define path operation function parameters to be of the type UploadFile to receive files from the request.

You can import it directly from fastapi:

A file uploaded in a request.

Define it as a path operation function (or dependency) parameter.

If you are using a regular def function, you can use the upload_file.file attribute to access the raw standard Python file (blocking, not async), useful and needed for non-async code.

Read more about it in the FastAPI docs for Request Files.

The standard Python file object (non-async).

The original file name.

The size of the file in bytes.

The headers of the request.

The content type of the request, from the headers.

Read some bytes from the file.

To be awaitable, compatible with async, this is run in threadpool.

The number of bytes to read from the file.

TYPE: int DEFAULT: -1

Write some bytes to the file.

You normally wouldn't use this from a file you read in a request.

To be awaitable, compatible with async, this is run in threadpool.

The bytes to write to the file.

Move to a position in the file.

Any next read or write will be done from that position.

To be awaitable, compatible with async, this is run in threadpool.

The position in bytes to seek to in the file.

To be awaitable, compatible with async, this is run in threadpool.

**Examples:**

Example 1 (python):
```python
from fastapi import UploadFile
```

Example 2 (rust):
```rust
UploadFile(file, *, size=None, filename=None, headers=None)
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import FastAPI, File, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}
```

Example 4 (python):
```python
def __init__(
    self,
    file: BinaryIO,
    *,
    size: int | None = None,
    filename: str | None = None,
    headers: Headers | None = None,
) -> None:
    self.filename = filename
    self.file = file
    self.size = size
    self.headers = headers or Headers()

    # Capture max size from SpooledTemporaryFile if one is provided. This slightly speeds up future checks.
    # Note 0 means unlimited mirroring SpooledTemporaryFile's __init__
    self._max_mem_size = getattr(self.file, "_max_size", 0)
```

---

## Request Parameters¶

**URL:** https://fastapi.tiangolo.com/reference/parameters/

**Contents:**
- Request Parameters¶
- fastapi.Query ¶
- fastapi.Path ¶
- fastapi.Body ¶
- fastapi.Cookie ¶
- fastapi.Header ¶
- fastapi.Form ¶
- fastapi.File ¶

Here's the reference information for the request parameters.

These are the special functions that you can put in path operation function parameters or dependency functions with Annotated to get data from the request.

You can import them all directly from fastapi:

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Declare a path parameter for a path operation.

Read more about it in the FastAPI docs for Path Parameters and Numeric Validations.

Default value if the parameter field is not set.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Any DEFAULT: ...

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

When embed is True, the parameter will be expected in a JSON body as a key instead of being the JSON body itself.

This happens automatically when more than one Body parameter is declared.

Read more about it in the FastAPI docs for Body - Multiple Parameters.

TYPE: Union[bool, None] DEFAULT: None

The media type of this parameter field. Changing it would affect the generated OpenAPI, but currently it doesn't affect the parsing of the data.

TYPE: str DEFAULT: 'application/json'

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Automatically convert underscores to hyphens in the parameter field name.

Read more about it in the FastAPI docs for Header Parameters

TYPE: bool DEFAULT: True

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

The media type of this parameter field. Changing it would affect the generated OpenAPI, but currently it doesn't affect the parsing of the data.

TYPE: str DEFAULT: 'application/x-www-form-urlencoded'

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

Default value if the parameter field is not set.

TYPE: Any DEFAULT: Undefined

A callable to generate the default value.

This doesn't affect Path parameters as the value is always required. The parameter is available only for compatibility.

TYPE: Union[Callable[[], Any], None] DEFAULT: _Unset

The media type of this parameter field. Changing it would affect the generated OpenAPI, but currently it doesn't affect the parsing of the data.

TYPE: str DEFAULT: 'multipart/form-data'

An alternative name for the parameter field.

This will be used to extract the data and for the generated OpenAPI. It is particularly useful when you can't use the name you want because it is a Python reserved keyword or similar.

TYPE: Optional[str] DEFAULT: None

Priority of the alias. This affects whether an alias generator is used.

TYPE: Union[int, None] DEFAULT: _Unset

'Whitelist' validation step. The parameter field will be the single one allowed by the alias or set of aliases defined.

TYPE: Union[str, None] DEFAULT: None

'Blacklist' validation step. The vanilla parameter field will be the single one of the alias' or set of aliases' fields and all the other fields will be ignored at serialization time.

TYPE: Union[str, None] DEFAULT: None

Human-readable title.

TYPE: Optional[str] DEFAULT: None

Human-readable description.

TYPE: Optional[str] DEFAULT: None

Greater than. If set, value must be greater than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Greater than or equal. If set, value must be greater than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than. If set, value must be less than this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Less than or equal. If set, value must be less than or equal to this. Only applicable to numbers.

TYPE: Optional[float] DEFAULT: None

Minimum length for strings.

TYPE: Optional[int] DEFAULT: None

Maximum length for strings.

TYPE: Optional[int] DEFAULT: None

RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Deprecated in FastAPI 0.100.0 and Pydantic v2, use pattern instead. RegEx pattern for strings.

TYPE: Optional[str] DEFAULT: None

Parameter field name for discriminating the type in a tagged union.

TYPE: Union[str, None] DEFAULT: None

If True, strict validation is applied to the field.

TYPE: Union[bool, None] DEFAULT: _Unset

Value must be a multiple of this. Only applicable to numbers.

TYPE: Union[float, None] DEFAULT: _Unset

Allow inf, -inf, nan. Only applicable to numbers.

TYPE: Union[bool, None] DEFAULT: _Unset

Maximum number of allow digits for strings.

TYPE: Union[int, None] DEFAULT: _Unset

Maximum number of decimal places allowed for numbers.

TYPE: Union[int, None] DEFAULT: _Unset

Example values for this field.

TYPE: Optional[list[Any]] DEFAULT: None

Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, although still supported. Use examples instead.

TYPE: Optional[Any] DEFAULT: _Unset

OpenAPI-specific examples.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Swagger UI (that provides the /docs interface) has better support for the OpenAPI-specific examples than the JSON Schema examples, that's the main use case for this.

Read more about it in the FastAPI docs for Declare Request Example Data.

TYPE: Optional[dict[str, Example]] DEFAULT: None

Mark this parameter field as deprecated.

It will affect the generated OpenAPI (e.g. visible at /docs).

TYPE: Union[deprecated, str, bool, None] DEFAULT: None

To include (or not) this parameter field in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Any additional JSON schema data.

TYPE: Union[dict[str, Any], None] DEFAULT: None

The extra kwargs is deprecated. Use json_schema_extra instead. Include extra fields used by the JSON Schema.

TYPE: Any DEFAULT: {}

**Examples:**

Example 1 (python):
```python
from fastapi import Body, Cookie, File, Form, Header, Path, Query
```

Example 2 (rust):
```rust
Query(
    default=Undefined,
    *,
    default_factory=_Unset,
    alias=None,
    alias_priority=_Unset,
    validation_alias=None,
    serialization_alias=None,
    title=None,
    description=None,
    gt=None,
    ge=None,
    lt=None,
    le=None,
    min_length=None,
    max_length=None,
    pattern=None,
    regex=None,
    discriminator=None,
    strict=_Unset,
    multiple_of=_Unset,
    allow_inf_nan=_Unset,
    max_digits=_Unset,
    decimal_places=_Unset,
    examples=None,
    example=_Unset,
    openapi_examples=None,
    deprecated=None,
    include_in_schema=True,
    json_schema_extra=None,
    **extra
)
```

Example 3 (python):
```python
def Query(  # noqa: N802
    default: Annotated[
        Any,
        Doc(
            """
            Default value if the parameter field is not set.
            """
        ),
    ] = Undefined,
    *,
    default_factory: Annotated[
        Union[Callable[[], Any], None],
        Doc(
            """
            A callable to generate the default value.

            This doesn't affect `Path` parameters as the value is always required.
            The parameter is available only for compatibility.
            """
        ),
    ] = _Unset,
    alias: Annotated[
        Optional[str],
        Doc(
            """
            An alternative name for the parameter field.

            This will be used to extract the data and for the generated OpenAPI.
            It is particularly useful when you can't use the name you want because it
            is a Python reserved keyword or similar.
            """
        ),
    ] = None,
    alias_priority: Annotated[
        Union[int, None],
        Doc(
            """
            Priority of the alias. This affects whether an alias generator is used.
            """
        ),
    ] = _Unset,
    # TODO: update when deprecating Pydantic v1, import these types
    # validation_alias: str | AliasPath | AliasChoices | None
    validation_alias: Annotated[
        Union[str, None],
        Doc(
            """
            'Whitelist' validation step. The parameter field will be the single one
            allowed by the alias or set of aliases defined.
            """
        ),
    ] = None,
    serialization_alias: Annotated[
        Union[str, None],
        Doc(
            """
            'Blacklist' validation step. The vanilla parameter field will be the
            single one of the alias' or set of aliases' fields and all the other
            fields will be ignored at serialization time.
            """
        ),
    ] = None,
    title: Annotated[
        Optional[str],
        Doc(
            """
            Human-readable title.
            """
        ),
    ] = None,
    description: Annotated[
        Optional[str],
        Doc(
            """
            Human-readable description.
            """
        ),
    ] = None,
    gt: Annotated[
        Optional[float],
        Doc(
            """
            Greater than. If set, value must be greater than this. Only applicable to
            numbers.
            """
        ),
    ] = None,
    ge: Annotated[
        Optional[float],
        Doc(
            """
            Greater than or equal. If set, value must be greater than or equal to
            this. Only applicable to numbers.
            """
        ),
    ] = None,
    lt: Annotated[
        Optional[float],
        Doc(
            """
            Less than. If set, value must be less than this. Only applicable to numbers.
            """
        ),
    ] = None,
    le: Annotated[
        Optional[float],
        Doc(
            """
            Less than or equal. If set, value must be less than or equal to this.
            Only applicable to numbers.
            """
        ),
    ] = None,
    min_length: Annotated[
        Optional[int],
        Doc(
            """
            Minimum length for strings.
            """
        ),
    ] = None,
    max_length: Annotated[
        Optional[int],
        Doc(
            """
            Maximum length for strings.
            """
        ),
    ] = None,
    pattern: Annotated[
        Optional[str],
        Doc(
            """
            RegEx pattern for strings.
            """
        ),
    ] = None,
    regex: Annotated[
        Optional[str],
        Doc(
            """
            RegEx pattern for strings.
            """
        ),
        deprecated(
            "Deprecated in FastAPI 0.100.0 and Pydantic v2, use `pattern` instead."
        ),
    ] = None,
    discriminator: Annotated[
        Union[str, None],
        Doc(
            """
            Parameter field name for discriminating the type in a tagged union.
            """
        ),
    ] = None,
    strict: Annotated[
        Union[bool, None],
        Doc(
            """
            If `True`, strict validation is applied to the field.
            """
        ),
    ] = _Unset,
    multiple_of: Annotated[
        Union[float, None],
        Doc(
            """
            Value must be a multiple of this. Only applicable to numbers.
            """
        ),
    ] = _Unset,
    allow_inf_nan: Annotated[
        Union[bool, None],
        Doc(
            """
            Allow `inf`, `-inf`, `nan`. Only applicable to numbers.
            """
        ),
    ] = _Unset,
    max_digits: Annotated[
        Union[int, None],
        Doc(
            """
            Maximum number of allow digits for strings.
            """
        ),
    ] = _Unset,
    decimal_places: Annotated[
        Union[int, None],
        Doc(
            """
            Maximum number of decimal places allowed for numbers.
            """
        ),
    ] = _Unset,
    examples: Annotated[
        Optional[list[Any]],
        Doc(
            """
            Example values for this field.
            """
        ),
    ] = None,
    example: Annotated[
        Optional[Any],
        deprecated(
            "Deprecated in OpenAPI 3.1.0 that now uses JSON Schema 2020-12, "
            "although still supported. Use examples instead."
        ),
    ] = _Unset,
    openapi_examples: Annotated[
        Optional[dict[str, Example]],
        Doc(
            """
            OpenAPI-specific examples.

            It will be added to the generated OpenAPI (e.g. visible at `/docs`).

            Swagger UI (that provides the `/docs` interface) has better support for the
            OpenAPI-specific examples than the JSON Schema `examples`, that's the main
            use case for this.

            Read more about it in the
            [FastAPI docs for Declare Request Example Data](https://fastapi.tiangolo.com/tutorial/schema-extra-example/#using-the-openapi_examples-parameter).
            """
        ),
    ] = None,
    deprecated: Annotated[
        Union[deprecated, str, bool, None],
        Doc(
            """
            Mark this parameter field as deprecated.

            It will affect the generated OpenAPI (e.g. visible at `/docs`).
            """
        ),
    ] = None,
    include_in_schema: Annotated[
        bool,
        Doc(
            """
            To include (or not) this parameter field in the generated OpenAPI.
            You probably don't need it, but it's available.

            This affects the generated OpenAPI (e.g. visible at `/docs`).
            """
        ),
    ] = True,
    json_schema_extra: Annotated[
        Union[dict[str, Any], None],
        Doc(
            """
            Any additional JSON schema data.
            """
        ),
    ] = None,
    **extra: Annotated[
        Any,
        Doc(
            """
            Include extra fields used by the JSON Schema.
            """
        ),
        deprecated(
            """
            The `extra` kwargs is deprecated. Use `json_schema_extra` instead.
            """
        ),
    ],
) -> Any:
    return params.Query(
        default=default,
        default_factory=default_factory,
        alias=alias,
        alias_priority=alias_priority,
        validation_alias=validation_alias,
        serialization_alias=serialization_alias,
        title=title,
        description=description,
        gt=gt,
        ge=ge,
        lt=lt,
        le=le,
        min_length=min_length,
        max_length=max_length,
        pattern=pattern,
        regex=regex,
        discriminator=discriminator,
        strict=strict,
        multiple_of=multiple_of,
        allow_inf_nan=allow_inf_nan,
        max_digits=max_digits,
        decimal_places=decimal_places,
        example=example,
        examples=examples,
        openapi_examples=openapi_examples,
        deprecated=deprecated,
        include_in_schema=include_in_schema,
        json_schema_extra=json_schema_extra,
        **extra,
    )
```

Example 4 (rust):
```rust
Path(
    default=...,
    *,
    default_factory=_Unset,
    alias=None,
    alias_priority=_Unset,
    validation_alias=None,
    serialization_alias=None,
    title=None,
    description=None,
    gt=None,
    ge=None,
    lt=None,
    le=None,
    min_length=None,
    max_length=None,
    pattern=None,
    regex=None,
    discriminator=None,
    strict=_Unset,
    multiple_of=_Unset,
    allow_inf_nan=_Unset,
    max_digits=_Unset,
    decimal_places=_Unset,
    examples=None,
    example=_Unset,
    openapi_examples=None,
    deprecated=None,
    include_in_schema=True,
    json_schema_extra=None,
    **extra
)
```

---

## Advanced Dependencies¶

**URL:** https://fastapi.tiangolo.com/advanced/advanced-dependencies/

**Contents:**
- Advanced Dependencies¶
- Parameterized dependencies¶
- A "callable" instance¶
- Parameterize the instance¶
- Create an instance¶
- Use the instance as a dependency¶
- Dependencies with yield, HTTPException, except and Background Tasks¶
  - Dependencies with yield and scope¶
  - Dependencies with yield and StreamingResponse, Technical Details¶
    - Use Cases with Early Exit Code¶

All the dependencies we have seen are a fixed function or class.

But there could be cases where you want to be able to set parameters on the dependency, without having to declare many different functions or classes.

Let's imagine that we want to have a dependency that checks if the query parameter q contains some fixed content.

But we want to be able to parameterize that fixed content.

In Python there's a way to make an instance of a class a "callable".

Not the class itself (which is already a callable), but an instance of that class.

To do that, we declare a method __call__:

Prefer to use the Annotated version if possible.

In this case, this __call__ is what FastAPI will use to check for additional parameters and sub-dependencies, and this is what will be called to pass a value to the parameter in your path operation function later.

And now, we can use __init__ to declare the parameters of the instance that we can use to "parameterize" the dependency:

Prefer to use the Annotated version if possible.

In this case, FastAPI won't ever touch or care about __init__, we will use it directly in our code.

We could create an instance of this class with:

Prefer to use the Annotated version if possible.

And that way we are able to "parameterize" our dependency, that now has "bar" inside of it, as the attribute checker.fixed_content.

Then, we could use this checker in a Depends(checker), instead of Depends(FixedContentQueryChecker), because the dependency is the instance, checker, not the class itself.

And when solving the dependency, FastAPI will call this checker like:

...and pass whatever that returns as the value of the dependency in our path operation function as the parameter fixed_content_included:

Prefer to use the Annotated version if possible.

All this might seem contrived. And it might not be very clear how is it useful yet.

These examples are intentionally simple, but show how it all works.

In the chapters about security, there are utility functions that are implemented in this same way.

If you understood all this, you already know how those utility tools for security work underneath.

You most probably don't need these technical details.

These details are useful mainly if you had a FastAPI application older than 0.121.0 and you are facing issues with dependencies with yield.

Dependencies with yield have evolved over time to account for the different use cases and to fix some issues, here's a summary of what has changed.

In version 0.121.0, FastAPI added support for Depends(scope="function") for dependencies with yield.

Using Depends(scope="function"), the exit code after yield is executed right after the path operation function is finished, before the response is sent back to the client.

And when using Depends(scope="request") (the default), the exit code after yield is executed after the response is sent.

You can read more about it in the docs for Dependencies with yield - Early exit and scope.

Before FastAPI 0.118.0, if you used a dependency with yield, it would run the exit code after the path operation function returned but right before sending the response.

The intention was to avoid holding resources for longer than necessary, waiting for the response to travel through the network.

This change also meant that if you returned a StreamingResponse, the exit code of the dependency with yield would have been already run.

For example, if you had a database session in a dependency with yield, the StreamingResponse would not be able to use that session while streaming data because the session would have already been closed in the exit code after yield.

This behavior was reverted in 0.118.0, to make the exit code after yield be executed after the response is sent.

As you will see below, this is very similar to the behavior before version 0.106.0, but with several improvements and bug fixes for corner cases.

There are some use cases with specific conditions that could benefit from the old behavior of running the exit code of dependencies with yield before sending the response.

For example, imagine you have code that uses a database session in a dependency with yield only to verify a user, but the database session is never used again in the path operation function, only in the dependency, and the response takes a long time to be sent, like a StreamingResponse that sends data slowly, but for some reason doesn't use the database.

In this case, the database session would be held until the response is finished being sent, but if you don't use it, then it wouldn't be necessary to hold it.

Here's how it could look like:

The exit code, the automatic closing of the Session in:

...would be run after the the response finishes sending the slow data:

But as generate_stream() doesn't use the database session, it is not really necessary to keep the session open while sending the response.

If you have this specific use case using SQLModel (or SQLAlchemy), you could explicitly close the session after you don't need it anymore:

That way the session would release the database connection, so other requests could use it.

If you have a different use case that needs to exit early from a dependency with yield, please create a GitHub Discussion Question with your specific use case and why you would benefit from having early closing for dependencies with yield.

If there are compelling use cases for early closing in dependencies with yield, I would consider adding a new way to opt in to early closing.

Before FastAPI 0.110.0, if you used a dependency with yield, and then you captured an exception with except in that dependency, and you didn't raise the exception again, the exception would be automatically raised/forwarded to any exception handlers or the internal server error handler.

This was changed in version 0.110.0 to fix unhandled memory consumption from forwarded exceptions without a handler (internal server errors), and to make it consistent with the behavior of regular Python code.

Before FastAPI 0.106.0, raising exceptions after yield was not possible, the exit code in dependencies with yield was executed after the response was sent, so Exception Handlers would have already run.

This was designed this way mainly to allow using the same objects "yielded" by dependencies inside of background tasks, because the exit code would be executed after the background tasks were finished.

This was changed in FastAPI 0.106.0 with the intention to not hold resources while waiting for the response to travel through the network.

Additionally, a background task is normally an independent set of logic that should be handled separately, with its own resources (e.g. its own database connection).

So, this way you will probably have cleaner code.

If you used to rely on this behavior, now you should create the resources for background tasks inside the background task itself, and use internally only data that doesn't depend on the resources of dependencies with yield.

For example, instead of using the same database session, you would create a new database session inside of the background task, and you would obtain the objects from the database using this new session. And then instead of passing the object from the database as a parameter to the background task function, you would pass the ID of that object and then obtain the object again inside the background task function.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


class FixedContentQueryChecker:
    def __init__(self, fixed_content: str):
        self.fixed_content = fixed_content

    def __call__(self, q: str = ""):
        if q:
            return self.fixed_content in q
        return False


checker = FixedContentQueryChecker("bar")


@app.get("/query-checker/")
async def read_query_check(fixed_content_included: Annotated[bool, Depends(checker)]):
    return {"fixed_content_in_query": fixed_content_included}
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI

app = FastAPI()


class FixedContentQueryChecker:
    def __init__(self, fixed_content: str):
        self.fixed_content = fixed_content

    def __call__(self, q: str = ""):
        if q:
            return self.fixed_content in q
        return False


checker = FixedContentQueryChecker("bar")


@app.get("/query-checker/")
async def read_query_check(fixed_content_included: bool = Depends(checker)):
    return {"fixed_content_in_query": fixed_content_included}
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


class FixedContentQueryChecker:
    def __init__(self, fixed_content: str):
        self.fixed_content = fixed_content

    def __call__(self, q: str = ""):
        if q:
            return self.fixed_content in q
        return False


checker = FixedContentQueryChecker("bar")


@app.get("/query-checker/")
async def read_query_check(fixed_content_included: Annotated[bool, Depends(checker)]):
    return {"fixed_content_in_query": fixed_content_included}
```

Example 4 (python):
```python
from fastapi import Depends, FastAPI

app = FastAPI()


class FixedContentQueryChecker:
    def __init__(self, fixed_content: str):
        self.fixed_content = fixed_content

    def __call__(self, q: str = ""):
        if q:
            return self.fixed_content in q
        return False


checker = FixedContentQueryChecker("bar")


@app.get("/query-checker/")
async def read_query_check(fixed_content_included: bool = Depends(checker)):
    return {"fixed_content_in_query": fixed_content_included}
```

---

## Request class¶

**URL:** https://fastapi.tiangolo.com/reference/request/

**Contents:**
- Request class¶
- fastapi.Request ¶
  - scope instance-attribute ¶
  - app property ¶
  - url property ¶
  - base_url property ¶
  - headers property ¶
  - query_params property ¶
  - path_params property ¶
  - cookies property ¶

You can declare a parameter in a path operation function or dependency to be of type Request and then you can access the raw request object directly, without any validation, etc.

You can import it directly from fastapi:

When you want to define dependencies that should be compatible with both HTTP and WebSockets, you can define a parameter that takes an HTTPConnection instead of a Request or a WebSocket.

Bases: HTTPConnection

**Examples:**

Example 1 (python):
```python
from fastapi import Request
```

Example 2 (unknown):
```unknown
Request(scope, receive=empty_receive, send=empty_send)
```

Example 3 (python):
```python
def __init__(self, scope: Scope, receive: Receive = empty_receive, send: Send = empty_send):
    super().__init__(scope)
    assert scope["type"] == "http"
    self._receive = receive
    self._send = send
    self._stream_consumed = False
    self._is_disconnected = False
    self._form = None
```

Example 4 (unknown):
```unknown
scope = scope
```

---

## OpenAPI Webhooks¶

**URL:** https://fastapi.tiangolo.com/advanced/openapi-webhooks/

**Contents:**
- OpenAPI Webhooks¶
- Webhooks steps¶
- Documenting webhooks with FastAPI and OpenAPI¶
- An app with webhooks¶
  - Check the docs¶

There are cases where you want to tell your API users that your app could call their app (sending a request) with some data, normally to notify of some type of event.

This means that instead of the normal process of your users sending requests to your API, it's your API (or your app) that could send requests to their system (to their API, their app).

This is normally called a webhook.

The process normally is that you define in your code what is the message that you will send, the body of the request.

You also define in some way at which moments your app will send those requests or events.

And your users define in some way (for example in a web dashboard somewhere) the URL where your app should send those requests.

All the logic about how to register the URLs for webhooks and the code to actually send those requests is up to you. You write it however you want to in your own code.

With FastAPI, using OpenAPI, you can define the names of these webhooks, the types of HTTP operations that your app can send (e.g. POST, PUT, etc.) and the request bodies that your app would send.

This can make it a lot easier for your users to implement their APIs to receive your webhook requests, they might even be able to autogenerate some of their own API code.

Webhooks are available in OpenAPI 3.1.0 and above, supported by FastAPI 0.99.0 and above.

When you create a FastAPI application, there is a webhooks attribute that you can use to define webhooks, the same way you would define path operations, for example with @app.webhooks.post().

The webhooks that you define will end up in the OpenAPI schema and the automatic docs UI.

The app.webhooks object is actually just an APIRouter, the same type you would use when structuring your app with multiple files.

Notice that with webhooks you are actually not declaring a path (like /items/), the text you pass there is just an identifier of the webhook (the name of the event), for example in @app.webhooks.post("new-subscription"), the webhook name is new-subscription.

This is because it is expected that your users would define the actual URL path where they want to receive the webhook request in some other way (e.g. a web dashboard).

Now you can start your app and go to http://127.0.0.1:8000/docs.

You will see your docs have the normal path operations and now also some webhooks:

**Examples:**

Example 1 (python):
```python
from datetime import datetime

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Subscription(BaseModel):
    username: str
    monthly_fee: float
    start_date: datetime


@app.webhooks.post("new-subscription")
def new_subscription(body: Subscription):
    """
    When a new user subscribes to your service we'll send you a POST request with this
    data to the URL that you register for the event `new-subscription` in the dashboard.
    """


@app.get("/users/")
def read_users():
    return ["Rick", "Morty"]
```

---
