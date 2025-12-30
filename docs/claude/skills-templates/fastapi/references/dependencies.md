# Fastapi - Dependencies

**Pages:** 2

---

## Testing Dependencies with Overrides¶

**URL:** https://fastapi.tiangolo.com/advanced/testing-dependencies/

**Contents:**
- Testing Dependencies with Overrides¶
- Overriding dependencies during testing¶
  - Use cases: external service¶
  - Use the app.dependency_overrides attribute¶

There are some scenarios where you might want to override a dependency during testing.

You don't want the original dependency to run (nor any of the sub-dependencies it might have).

Instead, you want to provide a different dependency that will be used only during tests (possibly only some specific tests), and will provide a value that can be used where the value of the original dependency was used.

An example could be that you have an external authentication provider that you need to call.

You send it a token and it returns an authenticated user.

This provider might be charging you per request, and calling it might take some extra time than if you had a fixed mock user for tests.

You probably want to test the external provider once, but not necessarily call it for every test that runs.

In this case, you can override the dependency that calls that provider, and use a custom dependency that returns a mock user, only for your tests.

For these cases, your FastAPI application has an attribute app.dependency_overrides, it is a simple dict.

To override a dependency for testing, you put as a key the original dependency (a function), and as the value, your dependency override (another function).

And then FastAPI will call that override instead of the original dependency.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You can set a dependency override for a dependency used anywhere in your FastAPI application.

The original dependency could be used in a path operation function, a path operation decorator (when you don't use the return value), a .include_router() call, etc.

FastAPI will still be able to override it.

Then you can reset your overrides (remove them) by setting app.dependency_overrides to be an empty dict:

If you want to override a dependency only during some tests, you can set the override at the beginning of the test (inside the test function) and reset it at the end (at the end of the test function).

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return {"message": "Hello Items!", "params": commons}


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return {"message": "Hello Users!", "params": commons}


client = TestClient(app)


async def override_dependency(q: str | None = None):
    return {"q": q, "skip": 5, "limit": 10}


app.dependency_overrides[common_parameters] = override_dependency


def test_override_in_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": None, "skip": 5, "limit": 10},
    }


def test_override_in_items_with_q():
    response = client.get("/items/?q=foo")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }


def test_override_in_items_with_params():
    response = client.get("/items/?q=foo&skip=100&limit=200")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return {"message": "Hello Items!", "params": commons}


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return {"message": "Hello Users!", "params": commons}


client = TestClient(app)


async def override_dependency(q: Union[str, None] = None):
    return {"q": q, "skip": 5, "limit": 10}


app.dependency_overrides[common_parameters] = override_dependency


def test_override_in_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": None, "skip": 5, "limit": 10},
    }


def test_override_in_items_with_q():
    response = client.get("/items/?q=foo")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }


def test_override_in_items_with_params():
    response = client.get("/items/?q=foo&skip=100&limit=200")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }
```

Example 3 (python):
```python
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return {"message": "Hello Items!", "params": commons}


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return {"message": "Hello Users!", "params": commons}


client = TestClient(app)


async def override_dependency(q: str | None = None):
    return {"q": q, "skip": 5, "limit": 10}


app.dependency_overrides[common_parameters] = override_dependency


def test_override_in_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": None, "skip": 5, "limit": 10},
    }


def test_override_in_items_with_q():
    response = client.get("/items/?q=foo")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }


def test_override_in_items_with_params():
    response = client.get("/items/?q=foo&skip=100&limit=200")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }
```

Example 4 (python):
```python
from typing import Union

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return {"message": "Hello Items!", "params": commons}


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return {"message": "Hello Users!", "params": commons}


client = TestClient(app)


async def override_dependency(q: Union[str, None] = None):
    return {"q": q, "skip": 5, "limit": 10}


app.dependency_overrides[common_parameters] = override_dependency


def test_override_in_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": None, "skip": 5, "limit": 10},
    }


def test_override_in_items_with_q():
    response = client.get("/items/?q=foo")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }


def test_override_in_items_with_params():
    response = client.get("/items/?q=foo&skip=100&limit=200")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello Items!",
        "params": {"q": "foo", "skip": 5, "limit": 10},
    }
```

---

## Dependencies - Depends() and Security()¶

**URL:** https://fastapi.tiangolo.com/reference/dependencies/

**Contents:**
- Dependencies - Depends() and Security()¶
- Depends()¶
- fastapi.Depends ¶
- Security()¶
- fastapi.Security ¶

Dependencies are handled mainly with the special function Depends() that takes a callable.

Here is the reference for it and its parameters.

You can import it directly from fastapi:

Declare a FastAPI dependency.

It takes a single "dependable" callable (like a function).

Don't call it directly, FastAPI will call it for you.

Read more about it in the FastAPI docs for Dependencies.

A "dependable" callable (like a function).

Don't call it directly, FastAPI will call it for you, just pass the object directly.

TYPE: Optional[Callable[..., Any]] DEFAULT: None

By default, after a dependency is called the first time in a request, if the dependency is declared again for the rest of the request (for example if the dependency is needed by several dependencies), the value will be re-used for the rest of the request.

Set use_cache to False to disable this behavior and ensure the dependency is called again (if declared more than once) in the same request.

TYPE: bool DEFAULT: True

Mainly for dependencies with yield, define when the dependency function should start (the code before yield) and when it should end (the code after yield).

TYPE: Union[Literal['function', 'request'], None] DEFAULT: None

For many scenarios, you can handle security (authorization, authentication, etc.) with dependencies, using Depends().

But when you want to also declare OAuth2 scopes, you can use Security() instead of Depends().

You can import Security() directly from fastapi:

Declare a FastAPI Security dependency.

The only difference with a regular dependency is that it can declare OAuth2 scopes that will be integrated with OpenAPI and the automatic UI docs (by default at /docs).

It takes a single "dependable" callable (like a function).

Don't call it directly, FastAPI will call it for you.

Read more about it in the FastAPI docs for Security and in the FastAPI docs for OAuth2 scopes.

A "dependable" callable (like a function).

Don't call it directly, FastAPI will call it for you, just pass the object directly.

TYPE: Optional[Callable[..., Any]] DEFAULT: None

OAuth2 scopes required for the path operation that uses this Security dependency.

The term "scope" comes from the OAuth2 specification, it seems to be intentionally vague and interpretable. It normally refers to permissions, in cases to roles.

These scopes are integrated with OpenAPI (and the API docs at /docs). So they are visible in the OpenAPI specification. )

TYPE: Optional[Sequence[str]] DEFAULT: None

By default, after a dependency is called the first time in a request, if the dependency is declared again for the rest of the request (for example if the dependency is needed by several dependencies), the value will be re-used for the rest of the request.

Set use_cache to False to disable this behavior and ensure the dependency is called again (if declared more than once) in the same request.

TYPE: bool DEFAULT: True

**Examples:**

Example 1 (python):
```python
from fastapi import Depends
```

Example 2 (rust):
```rust
Depends(dependency=None, *, use_cache=True, scope=None)
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

Example 4 (python):
```python
def Depends(  # noqa: N802
    dependency: Annotated[
        Optional[Callable[..., Any]],
        Doc(
            """
            A "dependable" callable (like a function).

            Don't call it directly, FastAPI will call it for you, just pass the object
            directly.
            """
        ),
    ] = None,
    *,
    use_cache: Annotated[
        bool,
        Doc(
            """
            By default, after a dependency is called the first time in a request, if
            the dependency is declared again for the rest of the request (for example
            if the dependency is needed by several dependencies), the value will be
            re-used for the rest of the request.

            Set `use_cache` to `False` to disable this behavior and ensure the
            dependency is called again (if declared more than once) in the same request.
            """
        ),
    ] = True,
    scope: Annotated[
        Union[Literal["function", "request"], None],
        Doc(
            """
            Mainly for dependencies with `yield`, define when the dependency function
            should start (the code before `yield`) and when it should end (the code
            after `yield`).

            * `"function"`: start the dependency before the *path operation function*
                that handles the request, end the dependency after the *path operation
                function* ends, but **before** the response is sent back to the client.
                So, the dependency function will be executed **around** the *path operation
                **function***.
            * `"request"`: start the dependency before the *path operation function*
                that handles the request (similar to when using `"function"`), but end
                **after** the response is sent back to the client. So, the dependency
                function will be executed **around** the **request** and response cycle.
            """
        ),
    ] = None,
) -> Any:
    """
    Declare a FastAPI dependency.

    It takes a single "dependable" callable (like a function).

    Don't call it directly, FastAPI will call it for you.

    Read more about it in the
    [FastAPI docs for Dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/).

    **Example**

    ```python
    from typing import Annotated

    from fastapi import Depends, FastAPI

    app = FastAPI()


    async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
        return {"q": q, "skip": skip, "limit": limit}


    @app.get("/items/")
    async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
        return commons
    ```
    """
    return params.Depends(dependency=dependency, use_cache=use_cache, scope=scope)
```

---
