# Fastapi - Security

**Pages:** 4

---

## Advanced Security¶

**URL:** https://fastapi.tiangolo.com/advanced/security/

**Contents:**
- Advanced Security¶
- Additional Features¶
- Read the Tutorial first¶

There are some extra features to handle security apart from the ones covered in the Tutorial - User Guide: Security.

The next sections are not necessarily "advanced".

And it's possible that for your use case, the solution is in one of them.

The next sections assume you already read the main Tutorial - User Guide: Security.

They are all based on the same concepts, but allow some extra functionalities.

---

## HTTP Basic Auth¶

**URL:** https://fastapi.tiangolo.com/advanced/security/http-basic-auth/

**Contents:**
- HTTP Basic Auth¶
- Simple HTTP Basic Auth¶
- Check the username¶
  - Timing Attacks¶
    - The time to answer helps the attackers¶
    - A "professional" attack¶
    - Fix it with secrets.compare_digest()¶
  - Return the error¶

For the simplest cases, you can use HTTP Basic Auth.

In HTTP Basic Auth, the application expects a header that contains a username and a password.

If it doesn't receive it, it returns an HTTP 401 "Unauthorized" error.

And returns a header WWW-Authenticate with a value of Basic, and an optional realm parameter.

That tells the browser to show the integrated prompt for a username and password.

Then, when you type that username and password, the browser sends them in the header automatically.

Prefer to use the Annotated version if possible.

When you try to open the URL for the first time (or click the "Execute" button in the docs) the browser will ask you for your username and password:

Here's a more complete example.

Use a dependency to check if the username and password are correct.

For this, use the Python standard module secrets to check the username and password.

secrets.compare_digest() needs to take bytes or a str that only contains ASCII characters (the ones in English), this means it wouldn't work with characters like á, as in Sebastián.

To handle that, we first convert the username and password to bytes encoding them with UTF-8.

Then we can use secrets.compare_digest() to ensure that credentials.username is "stanleyjobson", and that credentials.password is "swordfish".

Prefer to use the Annotated version if possible.

This would be similar to:

But by using the secrets.compare_digest() it will be secure against a type of attacks called "timing attacks".

But what's a "timing attack"?

Let's imagine some attackers are trying to guess the username and password.

And they send a request with a username johndoe and a password love123.

Then the Python code in your application would be equivalent to something like:

But right at the moment Python compares the first j in johndoe to the first s in stanleyjobson, it will return False, because it already knows that those two strings are not the same, thinking that "there's no need to waste more computation comparing the rest of the letters". And your application will say "Incorrect username or password".

But then the attackers try with username stanleyjobsox and password love123.

And your application code does something like:

Python will have to compare the whole stanleyjobso in both stanleyjobsox and stanleyjobson before realizing that both strings are not the same. So it will take some extra microseconds to reply back "Incorrect username or password".

At that point, by noticing that the server took some microseconds longer to send the "Incorrect username or password" response, the attackers will know that they got something right, some of the initial letters were right.

And then they can try again knowing that it's probably something more similar to stanleyjobsox than to johndoe.

Of course, the attackers would not try all this by hand, they would write a program to do it, possibly with thousands or millions of tests per second. And they would get just one extra correct letter at a time.

But doing that, in some minutes or hours the attackers would have guessed the correct username and password, with the "help" of our application, just using the time taken to answer.

But in our code we are actually using secrets.compare_digest().

In short, it will take the same time to compare stanleyjobsox to stanleyjobson than it takes to compare johndoe to stanleyjobson. And the same for the password.

That way, using secrets.compare_digest() in your application code, it will be safe against this whole range of security attacks.

After detecting that the credentials are incorrect, return an HTTPException with a status code 401 (the same returned when no credentials are provided) and add the header WWW-Authenticate to make the browser show the login prompt again:

Prefer to use the Annotated version if possible.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()

security = HTTPBasic()


@app.get("/users/me")
def read_current_user(credentials: Annotated[HTTPBasicCredentials, Depends(security)]):
    return {"username": credentials.username, "password": credentials.password}
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()

security = HTTPBasic()


@app.get("/users/me")
def read_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    return {"username": credentials.username, "password": credentials.password}
```

Example 3 (python):
```python
import secrets
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()

security = HTTPBasic()


def get_current_username(
    credentials: Annotated[HTTPBasicCredentials, Depends(security)],
):
    current_username_bytes = credentials.username.encode("utf8")
    correct_username_bytes = b"stanleyjobson"
    is_correct_username = secrets.compare_digest(
        current_username_bytes, correct_username_bytes
    )
    current_password_bytes = credentials.password.encode("utf8")
    correct_password_bytes = b"swordfish"
    is_correct_password = secrets.compare_digest(
        current_password_bytes, correct_password_bytes
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@app.get("/users/me")
def read_current_user(username: Annotated[str, Depends(get_current_username)]):
    return {"username": username}
```

Example 4 (python):
```python
import secrets

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()

security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    current_username_bytes = credentials.username.encode("utf8")
    correct_username_bytes = b"stanleyjobson"
    is_correct_username = secrets.compare_digest(
        current_username_bytes, correct_username_bytes
    )
    current_password_bytes = credentials.password.encode("utf8")
    correct_password_bytes = b"swordfish"
    is_correct_password = secrets.compare_digest(
        current_password_bytes, correct_password_bytes
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@app.get("/users/me")
def read_current_user(username: str = Depends(get_current_username)):
    return {"username": username}
```

---

## Security Tools¶

**URL:** https://fastapi.tiangolo.com/reference/security/

**Contents:**
- Security Tools¶
- API Key Security Schemes¶
- fastapi.security.APIKeyCookie ¶
    - Usage¶
    - Example¶
  - model instance-attribute ¶
  - scheme_name instance-attribute ¶
  - auto_error instance-attribute ¶
  - make_not_authenticated_error ¶
  - check_api_key ¶

When you need to declare dependencies with OAuth2 scopes you use Security().

But you still need to define what is the dependable, the callable that you pass as a parameter to Depends() or Security().

There are multiple tools that you can use to create those dependables, and they get integrated into OpenAPI so they are shown in the automatic docs UI, they can be used by automatically generated clients and SDKs, etc.

You can import them from fastapi.security:

API key authentication using a cookie.

This defines the name of the cookie that should be provided in the request with the API key and integrates that into the OpenAPI documentation. It extracts the key value sent in the cookie automatically and provides it as the dependency result. But it doesn't define how to set that cookie.

Create an instance object and use that object as the dependency in Depends().

The dependency result will be a string containing the key value.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the cookie is not provided, APIKeyCookie will automatically cancel the request and send the client an error.

If auto_error is set to False, when the cookie is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in a cookie or in an HTTP Bearer token).

TYPE: bool DEFAULT: True

The WWW-Authenticate header is not standardized for API Key authentication but the HTTP specification requires that an error of 401 "Unauthorized" must include a WWW-Authenticate header.

Ref: https://datatracker.ietf.org/doc/html/rfc9110#name-401-unauthorized

For this, this method sends a custom challenge APIKey.

API key authentication using a header.

This defines the name of the header that should be provided in the request with the API key and integrates that into the OpenAPI documentation. It extracts the key value sent in the header automatically and provides it as the dependency result. But it doesn't define how to send that key to the client.

Create an instance object and use that object as the dependency in Depends().

The dependency result will be a string containing the key value.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the header is not provided, APIKeyHeader will automatically cancel the request and send the client an error.

If auto_error is set to False, when the header is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in a header or in an HTTP Bearer token).

TYPE: bool DEFAULT: True

The WWW-Authenticate header is not standardized for API Key authentication but the HTTP specification requires that an error of 401 "Unauthorized" must include a WWW-Authenticate header.

Ref: https://datatracker.ietf.org/doc/html/rfc9110#name-401-unauthorized

For this, this method sends a custom challenge APIKey.

API key authentication using a query parameter.

This defines the name of the query parameter that should be provided in the request with the API key and integrates that into the OpenAPI documentation. It extracts the key value sent in the query parameter automatically and provides it as the dependency result. But it doesn't define how to send that API key to the client.

Create an instance object and use that object as the dependency in Depends().

The dependency result will be a string containing the key value.

Query parameter name.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the query parameter is not provided, APIKeyQuery will automatically cancel the request and send the client an error.

If auto_error is set to False, when the query parameter is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in a query parameter or in an HTTP Bearer token).

TYPE: bool DEFAULT: True

The WWW-Authenticate header is not standardized for API Key authentication but the HTTP specification requires that an error of 401 "Unauthorized" must include a WWW-Authenticate header.

Ref: https://datatracker.ietf.org/doc/html/rfc9110#name-401-unauthorized

For this, this method sends a custom challenge APIKey.

HTTP Basic authentication.

Ref: https://datatracker.ietf.org/doc/html/rfc7617

Create an instance object and use that object as the dependency in Depends().

The dependency result will be an HTTPBasicCredentials object containing the username and the password.

Read more about it in the FastAPI docs for HTTP Basic Auth.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

HTTP Basic authentication realm.

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the HTTP Basic authentication is not provided (a header), HTTPBasic will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Basic authentication is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in HTTP Basic authentication or in an HTTP Bearer token).

TYPE: bool DEFAULT: True

HTTP Bearer token authentication.

Create an instance object and use that object as the dependency in Depends().

The dependency result will be an HTTPAuthorizationCredentials object containing the scheme and the credentials.

TYPE: Optional[str] DEFAULT: None

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the HTTP Bearer token is not provided (in an Authorization header), HTTPBearer will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Bearer token is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in an HTTP Bearer token or in a cookie).

TYPE: bool DEFAULT: True

HTTP Digest authentication.

Warning: this is only a stub to connect the components with OpenAPI in FastAPI, but it doesn't implement the full Digest scheme, you would need to to subclass it and implement it in your code.

Ref: https://datatracker.ietf.org/doc/html/rfc7616

Create an instance object and use that object as the dependency in Depends().

The dependency result will be an HTTPAuthorizationCredentials object containing the scheme and the credentials.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if the HTTP Digest is not provided, HTTPDigest will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Digest is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, in HTTP Digest or in a cookie).

TYPE: bool DEFAULT: True

The HTTP authorization credentials in the result of using HTTPBearer or HTTPDigest in a dependency.

The HTTP authorization header value is split by the first space.

The first part is the scheme, the second part is the credentials.

For example, in an HTTP Bearer token scheme, the client will send a header like:

The HTTP authorization scheme extracted from the header value.

The HTTP authorization credentials extracted from the header value.

The HTTP Basic credentials given as the result of using HTTPBasic in a dependency.

Read more about it in the FastAPI docs for HTTP Basic Auth.

The HTTP Basic username.

The HTTP Basic password.

This is the base class for OAuth2 authentication, an instance of it would be used as a dependency. All other OAuth2 classes inherit from it and customize it for each OAuth2 flow.

You normally would not create a new class inheriting from it but use one of the existing subclasses, and maybe compose them if you want to support multiple flows.

Read more about it in the FastAPI docs for Security.

The dictionary of OAuth2 flows.

TYPE: Union[OAuthFlows, dict[str, dict[str, Any]]] DEFAULT: OAuthFlows()

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if no HTTP Authorization header is provided, required for OAuth2 authentication, it will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Authorization header is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, with OAuth2 or in a cookie).

TYPE: bool DEFAULT: True

The OAuth 2 specification doesn't define the challenge that should be used, because a Bearer token is not really the only option to authenticate.

But declaring any other authentication challenge would be application-specific as it's not defined in the specification.

For practical reasons, this method uses the Bearer challenge by default, as it's probably the most common one.

If you are implementing an OAuth2 authentication scheme other than the provided ones in FastAPI (based on bearer tokens), you might want to override this.

Ref: https://datatracker.ietf.org/doc/html/rfc6749

OAuth2 flow for authentication using a bearer token obtained with an OAuth2 code flow. An instance of it would be used as a dependency.

The URL to obtain the OAuth2 token.

The URL to refresh the token and obtain a new one.

TYPE: Optional[str] DEFAULT: None

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

The OAuth2 scopes that would be required by the path operations that use this dependency.

TYPE: Optional[dict[str, str]] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if no HTTP Authorization header is provided, required for OAuth2 authentication, it will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Authorization header is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, with OAuth2 or in a cookie).

TYPE: bool DEFAULT: True

The OAuth 2 specification doesn't define the challenge that should be used, because a Bearer token is not really the only option to authenticate.

But declaring any other authentication challenge would be application-specific as it's not defined in the specification.

For practical reasons, this method uses the Bearer challenge by default, as it's probably the most common one.

If you are implementing an OAuth2 authentication scheme other than the provided ones in FastAPI (based on bearer tokens), you might want to override this.

Ref: https://datatracker.ietf.org/doc/html/rfc6749

OAuth2 flow for authentication using a bearer token obtained with a password. An instance of it would be used as a dependency.

Read more about it in the FastAPI docs for Simple OAuth2 with Password and Bearer.

The URL to obtain the OAuth2 token. This would be the path operation that has OAuth2PasswordRequestForm as a dependency.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

The OAuth2 scopes that would be required by the path operations that use this dependency.

TYPE: Optional[dict[str, str]] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if no HTTP Authorization header is provided, required for OAuth2 authentication, it will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Authorization header is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, with OAuth2 or in a cookie).

TYPE: bool DEFAULT: True

The URL to refresh the token and obtain a new one.

TYPE: Optional[str] DEFAULT: None

The OAuth 2 specification doesn't define the challenge that should be used, because a Bearer token is not really the only option to authenticate.

But declaring any other authentication challenge would be application-specific as it's not defined in the specification.

For practical reasons, this method uses the Bearer challenge by default, as it's probably the most common one.

If you are implementing an OAuth2 authentication scheme other than the provided ones in FastAPI (based on bearer tokens), you might want to override this.

Ref: https://datatracker.ietf.org/doc/html/rfc6749

This is a dependency class to collect the username and password as form data for an OAuth2 password flow.

The OAuth2 specification dictates that for a password flow the data should be collected using form data (instead of JSON) and that it should have the specific fields username and password.

All the initialization parameters are extracted from the request.

Read more about it in the FastAPI docs for Simple OAuth2 with Password and Bearer.

Note that for OAuth2 the scope items:read is a single scope in an opaque string. You could have custom internal logic to separate it by colon characters (:) or similar, and get the two parts items and read. Many applications do that to group and organize permissions, you could do it as well in your application, just know that that it is application specific, it's not part of the specification.

The OAuth2 spec says it is required and MUST be the fixed string "password". Nevertheless, this dependency class is permissive and allows not passing it. If you want to enforce it, use instead the OAuth2PasswordRequestFormStrict dependency.

TYPE: Union[str, None] DEFAULT: None

username string. The OAuth2 spec requires the exact field name username.

password string. The OAuth2 spec requires the exact field name password.

A single string with actually several scopes separated by spaces. Each scope is also a string.

For example, a single string with:

```python "items:read items:write users:read profile openid" ````

would represent the scopes:

TYPE: str DEFAULT: ''

If there's a client_id, it can be sent as part of the form fields. But the OAuth2 specification recommends sending the client_id and client_secret (if any) using HTTP Basic auth.

TYPE: Union[str, None] DEFAULT: None

If there's a client_password (and a client_id), they can be sent as part of the form fields. But the OAuth2 specification recommends sending the client_id and client_secret (if any) using HTTP Basic auth.

TYPE: Union[str, None] DEFAULT: None

Bases: OAuth2PasswordRequestForm

This is a dependency class to collect the username and password as form data for an OAuth2 password flow.

The OAuth2 specification dictates that for a password flow the data should be collected using form data (instead of JSON) and that it should have the specific fields username and password.

All the initialization parameters are extracted from the request.

The only difference between OAuth2PasswordRequestFormStrict and OAuth2PasswordRequestForm is that OAuth2PasswordRequestFormStrict requires the client to send the form field grant_type with the value "password", which is required in the OAuth2 specification (it seems that for no particular reason), while for OAuth2PasswordRequestForm grant_type is optional.

Read more about it in the FastAPI docs for Simple OAuth2 with Password and Bearer.

Note that for OAuth2 the scope items:read is a single scope in an opaque string. You could have custom internal logic to separate it by colon characters (:) or similar, and get the two parts items and read. Many applications do that to group and organize permissions, you could do it as well in your application, just know that that it is application specific, it's not part of the specification.

This dependency is strict about it. If you want to be permissive, use instead the OAuth2PasswordRequestForm dependency class.

username: username string. The OAuth2 spec requires the exact field name "username". password: password string. The OAuth2 spec requires the exact field name "password". scope: Optional string. Several scopes (each one a string) separated by spaces. E.g. "items:read items:write users:read profile openid" client_id: optional string. OAuth2 recommends sending the client_id and client_secret (if any) using HTTP Basic auth, as: client_id:client_secret client_secret: optional string. OAuth2 recommends sending the client_id and client_secret (if any) using HTTP Basic auth, as: client_id:client_secret

The OAuth2 spec says it is required and MUST be the fixed string "password". This dependency is strict about it. If you want to be permissive, use instead the OAuth2PasswordRequestForm dependency class.

username string. The OAuth2 spec requires the exact field name username.

password string. The OAuth2 spec requires the exact field name password.

A single string with actually several scopes separated by spaces. Each scope is also a string.

For example, a single string with:

```python "items:read items:write users:read profile openid" ````

would represent the scopes:

TYPE: str DEFAULT: ''

If there's a client_id, it can be sent as part of the form fields. But the OAuth2 specification recommends sending the client_id and client_secret (if any) using HTTP Basic auth.

TYPE: Union[str, None] DEFAULT: None

If there's a client_password (and a client_id), they can be sent as part of the form fields. But the OAuth2 specification recommends sending the client_id and client_secret (if any) using HTTP Basic auth.

TYPE: Union[str, None] DEFAULT: None

This is a special class that you can define in a parameter in a dependency to obtain the OAuth2 scopes required by all the dependencies in the same chain.

This way, multiple dependencies can have different scopes, even when used in the same path operation. And with this, you can access all the scopes required in all those dependencies in a single place.

Read more about it in the FastAPI docs for OAuth2 scopes.

This will be filled by FastAPI.

TYPE: Optional[list[str]] DEFAULT: None

The list of all the scopes required by dependencies.

All the scopes required by all the dependencies in a single string separated by spaces, as defined in the OAuth2 specification.

OpenID Connect authentication class. An instance of it would be used as a dependency.

Warning: this is only a stub to connect the components with OpenAPI in FastAPI, but it doesn't implement the full OpenIdConnect scheme, for example, it doesn't use the OpenIDConnect URL. You would need to to subclass it and implement it in your code.

The OpenID Connect URL.

Security scheme name.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

Security scheme description.

It will be included in the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[str] DEFAULT: None

By default, if no HTTP Authorization header is provided, required for OpenID Connect authentication, it will automatically cancel the request and send the client an error.

If auto_error is set to False, when the HTTP Authorization header is not available, instead of erroring out, the dependency result will be None.

This is useful when you want to have optional authentication.

It is also useful when you want to have authentication that can be provided in one of multiple optional ways (for example, with OpenID Connect or in a cookie).

TYPE: bool DEFAULT: True

**Examples:**

Example 1 (sql):
```sql
from fastapi.security import (
    APIKeyCookie,
    APIKeyHeader,
    APIKeyQuery,
    HTTPAuthorizationCredentials,
    HTTPBasic,
    HTTPBasicCredentials,
    HTTPBearer,
    HTTPDigest,
    OAuth2,
    OAuth2AuthorizationCodeBearer,
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    OAuth2PasswordRequestFormStrict,
    OpenIdConnect,
    SecurityScopes,
)
```

Example 2 (rust):
```rust
APIKeyCookie(
    *,
    name,
    scheme_name=None,
    description=None,
    auto_error=True
)
```

Example 3 (python):
```python
from fastapi import Depends, FastAPI
from fastapi.security import APIKeyCookie

app = FastAPI()

cookie_scheme = APIKeyCookie(name="session")


@app.get("/items/")
async def read_items(session: str = Depends(cookie_scheme)):
    return {"session": session}
```

Example 4 (python):
```python
def __init__(
    self,
    *,
    name: Annotated[str, Doc("Cookie name.")],
    scheme_name: Annotated[
        Optional[str],
        Doc(
            """
            Security scheme name.

            It will be included in the generated OpenAPI (e.g. visible at `/docs`).
            """
        ),
    ] = None,
    description: Annotated[
        Optional[str],
        Doc(
            """
            Security scheme description.

            It will be included in the generated OpenAPI (e.g. visible at `/docs`).
            """
        ),
    ] = None,
    auto_error: Annotated[
        bool,
        Doc(
            """
            By default, if the cookie is not provided, `APIKeyCookie` will
            automatically cancel the request and send the client an error.

            If `auto_error` is set to `False`, when the cookie is not available,
            instead of erroring out, the dependency result will be `None`.

            This is useful when you want to have optional authentication.

            It is also useful when you want to have authentication that can be
            provided in one of multiple optional ways (for example, in a cookie or
            in an HTTP Bearer token).
            """
        ),
    ] = True,
):
    super().__init__(
        location=APIKeyIn.cookie,
        name=name,
        scheme_name=scheme_name,
        description=description,
        auto_error=auto_error,
    )
```

---

## OAuth2 scopes¶

**URL:** https://fastapi.tiangolo.com/advanced/security/oauth2-scopes/

**Contents:**
- OAuth2 scopes¶
- OAuth2 scopes and OpenAPI¶
- Global view¶
- OAuth2 Security scheme¶
- JWT token with scopes¶
- Declare scopes in path operations and dependencies¶
- Use SecurityScopes¶
- Use the scopes¶
- Verify the username and data shape¶
- Verify the scopes¶

You can use OAuth2 scopes directly with FastAPI, they are integrated to work seamlessly.

This would allow you to have a more fine-grained permission system, following the OAuth2 standard, integrated into your OpenAPI application (and the API docs).

OAuth2 with scopes is the mechanism used by many big authentication providers, like Facebook, Google, GitHub, Microsoft, X (Twitter), etc. They use it to provide specific permissions to users and applications.

Every time you "log in with" Facebook, Google, GitHub, Microsoft, X (Twitter), that application is using OAuth2 with scopes.

In this section you will see how to manage authentication and authorization with the same OAuth2 with scopes in your FastAPI application.

This is a more or less advanced section. If you are just starting, you can skip it.

You don't necessarily need OAuth2 scopes, and you can handle authentication and authorization however you want.

But OAuth2 with scopes can be nicely integrated into your API (with OpenAPI) and your API docs.

Nevertheless, you still enforce those scopes, or any other security/authorization requirement, however you need, in your code.

In many cases, OAuth2 with scopes can be an overkill.

But if you know you need it, or you are curious, keep reading.

The OAuth2 specification defines "scopes" as a list of strings separated by spaces.

The content of each of these strings can have any format, but should not contain spaces.

These scopes represent "permissions".

In OpenAPI (e.g. the API docs), you can define "security schemes".

When one of these security schemes uses OAuth2, you can also declare and use scopes.

Each "scope" is just a string (without spaces).

They are normally used to declare specific security permissions, for example:

In OAuth2 a "scope" is just a string that declares a specific permission required.

It doesn't matter if it has other characters like : or if it is a URL.

Those details are implementation specific.

For OAuth2 they are just strings.

First, let's quickly see the parts that change from the examples in the main Tutorial - User Guide for OAuth2 with Password (and hashing), Bearer with JWT tokens. Now using OAuth2 scopes:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now let's review those changes step by step.

The first change is that now we are declaring the OAuth2 security scheme with two available scopes, me and items.

The scopes parameter receives a dict with each scope as a key and the description as the value:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Because we are now declaring those scopes, they will show up in the API docs when you log-in/authorize.

And you will be able to select which scopes you want to give access to: me and items.

This is the same mechanism used when you give permissions while logging in with Facebook, Google, GitHub, etc:

Now, modify the token path operation to return the scopes requested.

We are still using the same OAuth2PasswordRequestForm. It includes a property scopes with a list of str, with each scope it received in the request.

And we return the scopes as part of the JWT token.

For simplicity, here we are just adding the scopes received directly to the token.

But in your application, for security, you should make sure you only add the scopes that the user is actually able to have, or the ones you have predefined.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now we declare that the path operation for /users/me/items/ requires the scope items.

For this, we import and use Security from fastapi.

You can use Security to declare dependencies (just like Depends), but Security also receives a parameter scopes with a list of scopes (strings).

In this case, we pass a dependency function get_current_active_user to Security (the same way we would do with Depends).

But we also pass a list of scopes, in this case with just one scope: items (it could have more).

And the dependency function get_current_active_user can also declare sub-dependencies, not only with Depends but also with Security. Declaring its own sub-dependency function (get_current_user), and more scope requirements.

In this case, it requires the scope me (it could require more than one scope).

You don't necessarily need to add different scopes in different places.

We are doing it here to demonstrate how FastAPI handles scopes declared at different levels.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Security is actually a subclass of Depends, and it has just one extra parameter that we'll see later.

But by using Security instead of Depends, FastAPI will know that it can declare security scopes, use them internally, and document the API with OpenAPI.

But when you import Query, Path, Depends, Security and others from fastapi, those are actually functions that return special classes.

Now update the dependency get_current_user.

This is the one used by the dependencies above.

Here's where we are using the same OAuth2 scheme we created before, declaring it as a dependency: oauth2_scheme.

Because this dependency function doesn't have any scope requirements itself, we can use Depends with oauth2_scheme, we don't have to use Security when we don't need to specify security scopes.

We also declare a special parameter of type SecurityScopes, imported from fastapi.security.

This SecurityScopes class is similar to Request (Request was used to get the request object directly).

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The parameter security_scopes will be of type SecurityScopes.

It will have a property scopes with a list containing all the scopes required by itself and all the dependencies that use this as a sub-dependency. That means, all the "dependants"... this might sound confusing, it is explained again later below.

The security_scopes object (of class SecurityScopes) also provides a scope_str attribute with a single string, containing those scopes separated by spaces (we are going to use it).

We create an HTTPException that we can reuse (raise) later at several points.

In this exception, we include the scopes required (if any) as a string separated by spaces (using scope_str). We put that string containing the scopes in the WWW-Authenticate header (this is part of the spec).

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We verify that we get a username, and extract the scopes.

And then we validate that data with the Pydantic model (catching the ValidationError exception), and if we get an error reading the JWT token or validating the data with Pydantic, we raise the HTTPException we created before.

For that, we update the Pydantic model TokenData with a new property scopes.

By validating the data with Pydantic we can make sure that we have, for example, exactly a list of str with the scopes and a str with the username.

Instead of, for example, a dict, or something else, as it could break the application at some point later, making it a security risk.

We also verify that we have a user with that username, and if not, we raise that same exception we created before.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We now verify that all the scopes required, by this dependency and all the dependants (including path operations), are included in the scopes provided in the token received, otherwise raise an HTTPException.

For this, we use security_scopes.scopes, that contains a list with all these scopes as str.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Let's review again this dependency tree and the scopes.

As the get_current_active_user dependency has as a sub-dependency on get_current_user, the scope "me" declared at get_current_active_user will be included in the list of required scopes in the security_scopes.scopes passed to get_current_user.

The path operation itself also declares a scope, "items", so this will also be in the list of security_scopes.scopes passed to get_current_user.

Here's how the hierarchy of dependencies and scopes looks like:

The important and "magic" thing here is that get_current_user will have a different list of scopes to check for each path operation.

All depending on the scopes declared in each path operation and each dependency in the dependency tree for that specific path operation.

You can use SecurityScopes at any point, and in multiple places, it doesn't have to be at the "root" dependency.

It will always have the security scopes declared in the current Security dependencies and all the dependants for that specific path operation and that specific dependency tree.

Because the SecurityScopes will have all the scopes declared by dependants, you can use it to verify that a token has the required scopes in a central dependency function, and then declare different scope requirements in different path operations.

They will be checked independently for each path operation.

If you open the API docs, you can authenticate and specify which scopes you want to authorize.

If you don't select any scope, you will be "authenticated", but when you try to access /users/me/ or /users/me/items/ you will get an error saying that you don't have enough permissions. You will still be able to access /status/.

And if you select the scope me but not the scope items, you will be able to access /users/me/ but not /users/me/items/.

That's what would happen to a third party application that tried to access one of these path operations with a token provided by a user, depending on how many permissions the user gave the application.

In this example we are using the OAuth2 "password" flow.

This is appropriate when we are logging in to our own application, probably with our own frontend.

Because we can trust it to receive the username and password, as we control it.

But if you are building an OAuth2 application that others would connect to (i.e., if you are building an authentication provider equivalent to Facebook, Google, GitHub, etc.) you should use one of the other flows.

The most common is the implicit flow.

The most secure is the code flow, but it's more complex to implement as it requires more steps. As it is more complex, many providers end up suggesting the implicit flow.

It's common that each authentication provider names their flows in a different way, to make it part of their brand.

But in the end, they are implementing the same OAuth2 standard.

FastAPI includes utilities for all these OAuth2 authentication flows in fastapi.security.oauth2.

The same way you can define a list of Depends in the decorator's dependencies parameter (as explained in Dependencies in path operation decorators), you could also use Security with scopes there.

**Examples:**

Example 1 (python):
```python
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, ValidationError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$g2/AV1zwopqUntPKJavBFw$BwpRGDCyUHLvHICnwijyX8ROGoiUPwNKZ7915MeYfCE",
        "disabled": True,
    },
}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    scopes: list[str] = []


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        scope: str = payload.get("scope", "")
        token_scopes = scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_user(
    current_user: Annotated[User, Security(get_current_user, scopes=["me"])],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scope": " ".join(form_data.scopes)},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Security(get_current_active_user, scopes=["items"])],
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@app.get("/status/")
async def read_system_status(current_user: Annotated[User, Depends(get_current_user)]):
    return {"status": "ok"}
```

Example 2 (python):
```python
from datetime import datetime, timedelta, timezone
from typing import Annotated, Union

import jwt
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, ValidationError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$g2/AV1zwopqUntPKJavBFw$BwpRGDCyUHLvHICnwijyX8ROGoiUPwNKZ7915MeYfCE",
        "disabled": True,
    },
}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
    scopes: list[str] = []


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        scope: str = payload.get("scope", "")
        token_scopes = scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_user(
    current_user: Annotated[User, Security(get_current_user, scopes=["me"])],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scope": " ".join(form_data.scopes)},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Security(get_current_active_user, scopes=["items"])],
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@app.get("/status/")
async def read_system_status(current_user: Annotated[User, Depends(get_current_user)]):
    return {"status": "ok"}
```

Example 3 (python):
```python
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, ValidationError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$g2/AV1zwopqUntPKJavBFw$BwpRGDCyUHLvHICnwijyX8ROGoiUPwNKZ7915MeYfCE",
        "disabled": True,
    },
}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    scopes: list[str] = []


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme)
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        scope: str = payload.get("scope", "")
        token_scopes = scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_user(
    current_user: User = Security(get_current_user, scopes=["me"]),
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scope": " ".join(form_data.scopes)},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: User = Security(get_current_active_user, scopes=["items"]),
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@app.get("/status/")
async def read_system_status(current_user: User = Depends(get_current_user)):
    return {"status": "ok"}
```

Example 4 (python):
```python
from datetime import datetime, timedelta, timezone
from typing import Union

import jwt
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, ValidationError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$g2/AV1zwopqUntPKJavBFw$BwpRGDCyUHLvHICnwijyX8ROGoiUPwNKZ7915MeYfCE",
        "disabled": True,
    },
}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
    scopes: list[str] = []


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme)
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        scope: str = payload.get("scope", "")
        token_scopes = scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_user(
    current_user: User = Security(get_current_user, scopes=["me"]),
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scope": " ".join(form_data.scopes)},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: User = Security(get_current_active_user, scopes=["items"]),
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@app.get("/status/")
async def read_system_status(current_user: User = Depends(get_current_user)):
    return {"status": "ok"}
```

---
