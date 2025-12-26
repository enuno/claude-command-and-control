# Fastapi - Other

**Pages:** 32

---

## HTTPConnection class¶

**URL:** https://fastapi.tiangolo.com/reference/httpconnection/

**Contents:**
- HTTPConnection class¶
- fastapi.requests.HTTPConnection ¶
  - scope instance-attribute ¶
  - app property ¶
  - url property ¶
  - base_url property ¶
  - headers property ¶
  - query_params property ¶
  - path_params property ¶
  - cookies property ¶

When you want to define dependencies that should be compatible with both HTTP and WebSockets, you can define a parameter that takes an HTTPConnection instead of a Request or a WebSocket.

You can import it from fastapi.requests:

Bases: Mapping[str, Any]

A base class for incoming HTTP connections, that is used to provide any functionality that is common to both Request and WebSocket.

**Examples:**

Example 1 (sql):
```sql
from fastapi.requests import HTTPConnection
```

Example 2 (rust):
```rust
HTTPConnection(scope, receive=None)
```

Example 3 (python):
```python
def __init__(self, scope: Scope, receive: Receive | None = None) -> None:
    assert scope["type"] in ("http", "websocket")
    self.scope = scope
```

Example 4 (unknown):
```unknown
scope = scope
```

---

## Including WSGI - Flask, Django, others¶

**URL:** https://fastapi.tiangolo.com/advanced/wsgi/

**Contents:**
- Including WSGI - Flask, Django, others¶
- Using WSGIMiddleware¶
- Check it¶

You can mount WSGI applications as you saw with Sub Applications - Mounts, Behind a Proxy.

For that, you can use the WSGIMiddleware and use it to wrap your WSGI application, for example, Flask, Django, etc.

You need to import WSGIMiddleware.

Then wrap the WSGI (e.g. Flask) app with the middleware.

And then mount that under a path.

Now, every request under the path /v1/ will be handled by the Flask application.

And the rest will be handled by FastAPI.

If you run it and go to http://localhost:8000/v1/ you will see the response from Flask:

And if you go to http://localhost:8000/v2 you will see the response from FastAPI:

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, request
from markupsafe import escape

flask_app = Flask(__name__)


@flask_app.route("/")
def flask_main():
    name = request.args.get("name", "World")
    return f"Hello, {escape(name)} from Flask!"


app = FastAPI()


@app.get("/v2")
def read_main():
    return {"message": "Hello World"}


app.mount("/v1", WSGIMiddleware(flask_app))
```

Example 2 (sql):
```sql
Hello, World from Flask!
```

Example 3 (json):
```json
{
    "message": "Hello World"
}
```

---

## Templates¶

**URL:** https://fastapi.tiangolo.com/advanced/templates/

**Contents:**
- Templates¶
- Install dependencies¶
- Using Jinja2Templates¶
- Writing templates¶
  - Template Context Values¶
  - Template url_for Arguments¶
- Templates and static files¶
- More details¶

You can use any template engine you want with FastAPI.

A common choice is Jinja2, the same one used by Flask and other tools.

There are utilities to configure it easily that you can use directly in your FastAPI application (provided by Starlette).

Make sure you create a virtual environment, activate it, and install jinja2:

Before FastAPI 0.108.0, Starlette 0.29.0, the name was the first parameter.

Also, before that, in previous versions, the request object was passed as part of the key-value pairs in the context for Jinja2.

By declaring response_class=HTMLResponse the docs UI will be able to know that the response will be HTML.

You could also use from starlette.templating import Jinja2Templates.

FastAPI provides the same starlette.templating as fastapi.templating just as a convenience for you, the developer. But most of the available responses come directly from Starlette. The same with Request and StaticFiles.

Then you can write a template at templates/item.html with, for example:

In the HTML that contains:

...it will show the id taken from the "context" dict you passed:

For example, with an ID of 42, this would render:

You can also use url_for() inside of the template, it takes as arguments the same arguments that would be used by your path operation function.

So, the section with:

...will generate a link to the same URL that would be handled by the path operation function read_item(id=id).

For example, with an ID of 42, this would render:

You can also use url_for() inside of the template, and use it, for example, with the StaticFiles you mounted with the name="static".

In this example, it would link to a CSS file at static/styles.css with:

And because you are using StaticFiles, that CSS file would be served automatically by your FastAPI application at the URL /static/styles.css.

For more details, including how to test templates, check Starlette's docs on templates.

**Examples:**

Example 1 (php):
```php
$ pip install jinja2

---> 100%
```

Example 2 (python):
```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.get("/items/{id}", response_class=HTMLResponse)
async def read_item(request: Request, id: str):
    return templates.TemplateResponse(
        request=request, name="item.html", context={"id": id}
    )
```

Example 3 (html):
```html
<html>
<head>
    <title>Item Details</title>
    <link href="{{ url_for('static', path='/styles.css') }}" rel="stylesheet">
</head>
<body>
    <h1><a href="{{ url_for('read_item', id=id) }}">Item ID: {{ id }}</a></h1>
</body>
</html>
```

Example 4 (json):
```json
Item ID: {{ id }}
```

---

## Behind a Proxy¶

**URL:** https://fastapi.tiangolo.com/advanced/behind-a-proxy/

**Contents:**
- Behind a Proxy¶
- Proxy Forwarded Headers¶
  - Enable Proxy Forwarded Headers¶
  - Redirects with HTTPS¶
  - How Proxy Forwarded Headers Work¶
- Proxy with a stripped path prefix¶
  - Providing the root_path¶
  - Checking the current root_path¶
  - Setting the root_path in the FastAPI app¶
  - About root_path¶

In many situations, you would use a proxy like Traefik or Nginx in front of your FastAPI app.

These proxies could handle HTTPS certificates and other things.

A proxy in front of your application would normally set some headers on the fly before sending the requests to your server to let the server know that the request was forwarded by the proxy, letting it know the original (public) URL, including the domain, that it is using HTTPS, etc.

The server program (for example Uvicorn via FastAPI CLI) is capable of interpreting these headers, and then passing that information to your application.

But for security, as the server doesn't know it is behind a trusted proxy, it won't interpret those headers.

The proxy headers are:

You can start FastAPI CLI with the CLI Option --forwarded-allow-ips and pass the IP addresses that should be trusted to read those forwarded headers.

If you set it to --forwarded-allow-ips="*" it would trust all the incoming IPs.

If your server is behind a trusted proxy and only the proxy talks to it, this would make it accept whatever is the IP of that proxy.

For example, let's say you define a path operation /items/:

If the client tries to go to /items, by default, it would be redirected to /items/.

But before setting the CLI Option --forwarded-allow-ips it could redirect to http://localhost:8000/items/.

But maybe your application is hosted at https://mysuperapp.com, and the redirection should be to https://mysuperapp.com/items/.

By setting --proxy-headers now FastAPI would be able to redirect to the right location. 😎

If you want to learn more about HTTPS, check the guide About HTTPS.

Here's a visual representation of how the proxy adds forwarded headers between the client and the application server:

The proxy intercepts the original client request and adds the special forwarded headers (X-Forwarded-*) before passing the request to the application server.

These headers preserve information about the original request that would otherwise be lost:

When FastAPI CLI is configured with --forwarded-allow-ips, it trusts these headers and uses them, for example to generate the correct URLs in redirects.

You could have a proxy that adds a path prefix to your application.

In these cases you can use root_path to configure your application.

The root_path is a mechanism provided by the ASGI specification (that FastAPI is built on, through Starlette).

The root_path is used to handle these specific cases.

And it's also used internally when mounting sub-applications.

Having a proxy with a stripped path prefix, in this case, means that you could declare a path at /app in your code, but then, you add a layer on top (the proxy) that would put your FastAPI application under a path like /api/v1.

In this case, the original path /app would actually be served at /api/v1/app.

Even though all your code is written assuming there's just /app.

And the proxy would be "stripping" the path prefix on the fly before transmitting the request to the app server (probably Uvicorn via FastAPI CLI), keeping your application convinced that it is being served at /app, so that you don't have to update all your code to include the prefix /api/v1.

Up to here, everything would work as normally.

But then, when you open the integrated docs UI (the frontend), it would expect to get the OpenAPI schema at /openapi.json, instead of /api/v1/openapi.json.

So, the frontend (that runs in the browser) would try to reach /openapi.json and wouldn't be able to get the OpenAPI schema.

Because we have a proxy with a path prefix of /api/v1 for our app, the frontend needs to fetch the OpenAPI schema at /api/v1/openapi.json.

The IP 0.0.0.0 is commonly used to mean that the program listens on all the IPs available in that machine/server.

The docs UI would also need the OpenAPI schema to declare that this API server is located at /api/v1 (behind the proxy). For example:

In this example, the "Proxy" could be something like Traefik. And the server would be something like FastAPI CLI with Uvicorn, running your FastAPI application.

To achieve this, you can use the command line option --root-path like:

If you use Hypercorn, it also has the option --root-path.

The ASGI specification defines a root_path for this use case.

And the --root-path command line option provides that root_path.

You can get the current root_path used by your application for each request, it is part of the scope dictionary (that's part of the ASGI spec).

Here we are including it in the message just for demonstration purposes.

Then, if you start Uvicorn with:

The response would be something like:

Alternatively, if you don't have a way to provide a command line option like --root-path or equivalent, you can set the root_path parameter when creating your FastAPI app:

Passing the root_path to FastAPI would be the equivalent of passing the --root-path command line option to Uvicorn or Hypercorn.

Keep in mind that the server (Uvicorn) won't use that root_path for anything else than passing it to the app.

But if you go with your browser to http://127.0.0.1:8000/app you will see the normal response:

So, it won't expect to be accessed at http://127.0.0.1:8000/api/v1/app.

Uvicorn will expect the proxy to access Uvicorn at http://127.0.0.1:8000/app, and then it would be the proxy's responsibility to add the extra /api/v1 prefix on top.

Keep in mind that a proxy with stripped path prefix is only one of the ways to configure it.

Probably in many cases the default will be that the proxy doesn't have a stripped path prefix.

In a case like that (without a stripped path prefix), the proxy would listen on something like https://myawesomeapp.com, and then if the browser goes to https://myawesomeapp.com/api/v1/app and your server (e.g. Uvicorn) listens on http://127.0.0.1:8000 the proxy (without a stripped path prefix) would access Uvicorn at the same path: http://127.0.0.1:8000/api/v1/app.

You can easily run the experiment locally with a stripped path prefix using Traefik.

Download Traefik, it's a single binary, you can extract the compressed file and run it directly from the terminal.

Then create a file traefik.toml with:

This tells Traefik to listen on port 9999 and to use another file routes.toml.

We are using port 9999 instead of the standard HTTP port 80 so that you don't have to run it with admin (sudo) privileges.

Now create that other file routes.toml:

This file configures Traefik to use the path prefix /api/v1.

And then Traefik will redirect its requests to your Uvicorn running on http://127.0.0.1:8000.

And now start your app, using the --root-path option:

Now, if you go to the URL with the port for Uvicorn: http://127.0.0.1:8000/app, you will see the normal response:

Notice that even though you are accessing it at http://127.0.0.1:8000/app it shows the root_path of /api/v1, taken from the option --root-path.

And now open the URL with the port for Traefik, including the path prefix: http://127.0.0.1:9999/api/v1/app.

We get the same response:

but this time at the URL with the prefix path provided by the proxy: /api/v1.

Of course, the idea here is that everyone would access the app through the proxy, so the version with the path prefix /api/v1 is the "correct" one.

And the version without the path prefix (http://127.0.0.1:8000/app), provided by Uvicorn directly, would be exclusively for the proxy (Traefik) to access it.

That demonstrates how the Proxy (Traefik) uses the path prefix and how the server (Uvicorn) uses the root_path from the option --root-path.

But here's the fun part. ✨

The "official" way to access the app would be through the proxy with the path prefix that we defined. So, as we would expect, if you try the docs UI served by Uvicorn directly, without the path prefix in the URL, it won't work, because it expects to be accessed through the proxy.

You can check it at http://127.0.0.1:8000/docs:

But if we access the docs UI at the "official" URL using the proxy with port 9999, at /api/v1/docs, it works correctly! 🎉

You can check it at http://127.0.0.1:9999/api/v1/docs:

Right as we wanted it. ✔️

This is because FastAPI uses this root_path to create the default server in OpenAPI with the URL provided by root_path.

This is a more advanced use case. Feel free to skip it.

By default, FastAPI will create a server in the OpenAPI schema with the URL for the root_path.

But you can also provide other alternative servers, for example if you want the same docs UI to interact with both a staging and a production environment.

If you pass a custom list of servers and there's a root_path (because your API lives behind a proxy), FastAPI will insert a "server" with this root_path at the beginning of the list.

Will generate an OpenAPI schema like:

Notice the auto-generated server with a url value of /api/v1, taken from the root_path.

In the docs UI at http://127.0.0.1:9999/api/v1/docs it would look like:

The docs UI will interact with the server that you select.

The servers property in the OpenAPI specification is optional.

If you don't specify the servers parameter and root_path is equal to /, the servers property in the generated OpenAPI schema will be omitted entirely by default, which is the equivalent of a single server with a url value of /.

If you don't want FastAPI to include an automatic server using the root_path, you can use the parameter root_path_in_servers=False:

and then it won't include it in the OpenAPI schema.

If you need to mount a sub-application (as described in Sub Applications - Mounts) while also using a proxy with root_path, you can do it normally, as you would expect.

FastAPI will internally use the root_path smartly, so it will just work. ✨

**Examples:**

Example 1 (jsx):
```jsx
$ fastapi run --forwarded-allow-ips="*"

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Example 2 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/")
def read_items():
    return ["plumbus", "portal gun"]
```

Example 3 (yaml):
```yaml
https://mysuperapp.com/items/
```

Example 4 (jsx):
```jsx
sequenceDiagram
    participant Client
    participant Proxy as Proxy/Load Balancer
    participant Server as FastAPI Server

    Client->>Proxy: HTTPS Request<br/>Host: mysuperapp.com<br/>Path: /items

    Note over Proxy: Proxy adds forwarded headers

    Proxy->>Server: HTTP Request<br/>X-Forwarded-For: [client IP]<br/>X-Forwarded-Proto: https<br/>X-Forwarded-Host: mysuperapp.com<br/>Path: /items

    Note over Server: Server interprets headers<br/>(if --forwarded-allow-ips is set)

    Server->>Proxy: HTTP Response<br/>with correct HTTPS URLs

    Proxy->>Client: HTTPS Response
```

---

## Settings and Environment Variables¶

**URL:** https://fastapi.tiangolo.com/advanced/settings/

**Contents:**
- Settings and Environment Variables¶
- Types and validation¶
- Pydantic Settings¶
  - Install pydantic-settings¶
  - Create the Settings object¶
  - Use the settings¶
  - Run the server¶
- Settings in another module¶
- Settings in a dependency¶
  - The config file¶

In many cases your application could need some external settings or configurations, for example secret keys, database credentials, credentials for email services, etc.

Most of these settings are variable (can change), like database URLs. And many could be sensitive, like secrets.

For this reason it's common to provide them in environment variables that are read by the application.

To understand environment variables you can read Environment Variables.

These environment variables can only handle text strings, as they are external to Python and have to be compatible with other programs and the rest of the system (and even with different operating systems, as Linux, Windows, macOS).

That means that any value read in Python from an environment variable will be a str, and any conversion to a different type or any validation has to be done in code.

Fortunately, Pydantic provides a great utility to handle these settings coming from environment variables with Pydantic: Settings management.

First, make sure you create your virtual environment, activate it, and then install the pydantic-settings package:

It also comes included when you install the all extras with:

Import BaseSettings from Pydantic and create a sub-class, very much like with a Pydantic model.

The same way as with Pydantic models, you declare class attributes with type annotations, and possibly default values.

You can use all the same validation features and tools you use for Pydantic models, like different data types and additional validations with Field().

If you want something quick to copy and paste, don't use this example, use the last one below.

Then, when you create an instance of that Settings class (in this case, in the settings object), Pydantic will read the environment variables in a case-insensitive way, so, an upper-case variable APP_NAME will still be read for the attribute app_name.

Next it will convert and validate the data. So, when you use that settings object, you will have data of the types you declared (e.g. items_per_user will be an int).

Then you can use the new settings object in your application:

Next, you would run the server passing the configurations as environment variables, for example you could set an ADMIN_EMAIL and APP_NAME with:

To set multiple env vars for a single command just separate them with a space, and put them all before the command.

And then the admin_email setting would be set to "deadpool@example.com".

The app_name would be "ChimichangApp".

And the items_per_user would keep its default value of 50.

You could put those settings in another module file as you saw in Bigger Applications - Multiple Files.

For example, you could have a file config.py with:

And then use it in a file main.py:

You would also need a file __init__.py as you saw in Bigger Applications - Multiple Files.

In some occasions it might be useful to provide the settings from a dependency, instead of having a global object with settings that is used everywhere.

This could be especially useful during testing, as it's very easy to override a dependency with your own custom settings.

Coming from the previous example, your config.py file could look like:

Prefer to use the Annotated version if possible.

Notice that now we don't create a default instance settings = Settings().

Now we create a dependency that returns a new config.Settings().

Prefer to use the Annotated version if possible.

We'll discuss the @lru_cache in a bit.

For now you can assume get_settings() is a normal function.

And then we can require it from the path operation function as a dependency and use it anywhere we need it.

Prefer to use the Annotated version if possible.

Then it would be very easy to provide a different settings object during testing by creating a dependency override for get_settings:

Prefer to use the Annotated version if possible.

In the dependency override we set a new value for the admin_email when creating the new Settings object, and then we return that new object.

Then we can test that it is used.

If you have many settings that possibly change a lot, maybe in different environments, it might be useful to put them on a file and then read them from it as if they were environment variables.

This practice is common enough that it has a name, these environment variables are commonly placed in a file .env, and the file is called a "dotenv".

A file starting with a dot (.) is a hidden file in Unix-like systems, like Linux and macOS.

But a dotenv file doesn't really have to have that exact filename.

Pydantic has support for reading from these types of files using an external library. You can read more at Pydantic Settings: Dotenv (.env) support.

For this to work, you need to pip install python-dotenv.

You could have a .env file with:

And then update your config.py with:

Prefer to use the Annotated version if possible.

The model_config attribute is used just for Pydantic configuration. You can read more at Pydantic: Concepts: Configuration.

Here we define the config env_file inside of your Pydantic Settings class, and set the value to the filename with the dotenv file we want to use.

Reading a file from disk is normally a costly (slow) operation, so you probably want to do it only once and then reuse the same settings object, instead of reading it for each request.

But every time we do:

a new Settings object would be created, and at creation it would read the .env file again.

If the dependency function was just like:

we would create that object for each request, and we would be reading the .env file for each request. ⚠️

But as we are using the @lru_cache decorator on top, the Settings object will be created only once, the first time it's called. ✔️

Prefer to use the Annotated version if possible.

Then for any subsequent call of get_settings() in the dependencies for the next requests, instead of executing the internal code of get_settings() and creating a new Settings object, it will return the same object that was returned on the first call, again and again.

@lru_cache modifies the function it decorates to return the same value that was returned the first time, instead of computing it again, executing the code of the function every time.

So, the function below it will be executed once for each combination of arguments. And then the values returned by each of those combinations of arguments will be used again and again whenever the function is called with exactly the same combination of arguments.

For example, if you have a function:

your program could execute like this:

In the case of our dependency get_settings(), the function doesn't even take any arguments, so it always returns the same value.

That way, it behaves almost as if it was just a global variable. But as it uses a dependency function, then we can override it easily for testing.

@lru_cache is part of functools which is part of Python's standard library, you can read more about it in the Python docs for @lru_cache.

You can use Pydantic Settings to handle the settings or configurations for your application, with all the power of Pydantic models.

**Examples:**

Example 1 (php):
```php
$ pip install pydantic-settings
---> 100%
```

Example 2 (php):
```php
$ pip install "fastapi[all]"
---> 100%
```

Example 3 (python):
```python
from fastapi import FastAPI
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50


settings = Settings()
app = FastAPI()


@app.get("/info")
async def info():
    return {
        "app_name": settings.app_name,
        "admin_email": settings.admin_email,
        "items_per_user": settings.items_per_user,
    }
```

Example 4 (python):
```python
from fastapi import FastAPI
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50


settings = Settings()
app = FastAPI()


@app.get("/info")
async def info():
    return {
        "app_name": settings.app_name,
        "admin_email": settings.admin_email,
        "items_per_user": settings.items_per_user,
    }
```

---

## FastAPI class¶

**URL:** https://fastapi.tiangolo.com/reference/fastapi/

**Contents:**
- FastAPI class¶
- fastapi.FastAPI ¶
    - Example¶
  - openapi_version instance-attribute ¶
  - webhooks instance-attribute ¶
  - state instance-attribute ¶
  - dependency_overrides instance-attribute ¶
  - openapi ¶
  - websocket ¶
  - include_router ¶

Here's the reference information for the FastAPI class, with all its parameters, attributes and methods.

You can import the FastAPI class directly from fastapi:

FastAPI app class, the main entrypoint to use FastAPI.

Read more in the FastAPI docs for First Steps.

Boolean indicating if debug tracebacks should be returned on server errors.

Read more in the Starlette docs for Applications.

TYPE: bool DEFAULT: False

Note: you probably shouldn't use this parameter, it is inherited from Starlette and supported for compatibility.

A list of routes to serve incoming HTTP and WebSocket requests.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

The title of the API.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: str DEFAULT: 'FastAPI'

A short summary of the API.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[str] DEFAULT: None

A description of the API. Supports Markdown (using CommonMark syntax).

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: str DEFAULT: ''

The version of the API.

Note This is the version of your application, not the version of the OpenAPI specification nor the version of FastAPI being used.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: str DEFAULT: '0.1.0'

The URL where the OpenAPI schema will be served from.

If you set it to None, no OpenAPI schema will be served publicly, and the default automatic endpoints /docs and /redoc will also be disabled.

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[str] DEFAULT: '/openapi.json'

A list of tags used by OpenAPI, these are the same tags you can set in the path operations, like:

The order of the tags can be used to specify the order shown in tools like Swagger UI, used in the automatic path /docs.

It's not required to specify all the tags used.

The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.

The value of each item is a dict containing:

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[list[dict[str, Any]]] DEFAULT: None

A list of dicts with connectivity information to a target server.

You would use it, for example, if your application is served from different domains and you want to use the same Swagger UI in the browser to interact with each of them (instead of having multiple browser tabs open). Or if you want to leave fixed the possible URLs.

If the servers list is not provided, or is an empty list, the servers property in the generated OpenAPI will be:

Each item in the list is a dict containing:

Read more in the FastAPI docs for Behind a Proxy.

TYPE: Optional[list[dict[str, Union[str, Any]]]] DEFAULT: None

A list of global dependencies, they will be applied to each path operation, including in sub-routers.

Read more about it in the FastAPI docs for Global Dependencies.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

The default response class to be used.

Read more in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

Whether to detect and redirect slashes in URLs when the client doesn't use the same format.

With this app, if a client goes to /items (without a trailing slash), they will be automatically redirected with an HTTP status code of 307 to /items/.

TYPE: bool DEFAULT: True

The path to the automatic interactive API documentation. It is handled in the browser by Swagger UI.

The default URL is /docs. You can disable it by setting it to None.

If openapi_url is set to None, this will be automatically disabled.

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[str] DEFAULT: '/docs'

The path to the alternative automatic interactive API documentation provided by ReDoc.

The default URL is /redoc. You can disable it by setting it to None.

If openapi_url is set to None, this will be automatically disabled.

Read more in the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[str] DEFAULT: '/redoc'

The OAuth2 redirect endpoint for the Swagger UI.

By default it is /docs/oauth2-redirect.

This is only used if you use OAuth2 (with the "Authorize" button) with Swagger UI.

TYPE: Optional[str] DEFAULT: '/docs/oauth2-redirect'

OAuth2 configuration for the Swagger UI, by default shown at /docs.

Read more about the available configuration options in the Swagger UI docs.

TYPE: Optional[dict[str, Any]] DEFAULT: None

List of middleware to be added when creating the application.

In FastAPI you would normally do this with app.add_middleware() instead.

Read more in the FastAPI docs for Middleware.

TYPE: Optional[Sequence[Middleware]] DEFAULT: None

A dictionary with handlers for exceptions.

In FastAPI, you would normally use the decorator @app.exception_handler().

Read more in the FastAPI docs for Handling Errors.

TYPE: Optional[dict[Union[int, type[Exception]], Callable[[Request, Any], Coroutine[Any, Any, Response]]]] DEFAULT: None

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

TYPE: Optional[Lifespan[AppType]] DEFAULT: None

A URL to the Terms of Service for your API.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more at the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[str] DEFAULT: None

A dictionary with the contact information for the exposed API.

It can contain several fields.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more at the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[dict[str, Union[str, Any]]] DEFAULT: None

A dictionary with the license information for the exposed API.

It can contain several fields.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more at the FastAPI docs for Metadata and Docs URLs.

TYPE: Optional[dict[str, Union[str, Any]]] DEFAULT: None

A URL prefix for the OpenAPI URL.

TYPE: str DEFAULT: ''

A path prefix handled by a proxy that is not seen by the application but is seen by external clients, which affects things like Swagger UI.

Read more about it at the FastAPI docs for Behind a Proxy.

TYPE: str DEFAULT: ''

To disable automatically generating the URLs in the servers field in the autogenerated OpenAPI using the root_path.

Read more about it in the FastAPI docs for Behind a Proxy.

TYPE: bool DEFAULT: True

Additional responses to be shown in OpenAPI.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Additional Responses in OpenAPI.

And in the FastAPI docs for Bigger Applications.

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

OpenAPI callbacks that should apply to all path operations.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

Add OpenAPI webhooks. This is similar to callbacks but it doesn't depend on specific path operations.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Note: This is available since OpenAPI 3.1.0, FastAPI 0.99.0.

Read more about it in the FastAPI docs for OpenAPI Webhooks.

TYPE: Optional[APIRouter] DEFAULT: None

Mark all path operations as deprecated. You probably don't need it, but it's available.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Path Operation Configuration.

TYPE: Optional[bool] DEFAULT: None

To include (or not) all the path operations in the generated OpenAPI. You probably don't need it, but it's available.

This affects the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Query Parameters and String Validations.

TYPE: bool DEFAULT: True

Parameters to configure Swagger UI, the autogenerated interactive API documentation (by default at /docs).

Read more about it in the FastAPI docs about how to Configure Swagger UI.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Customize the function used to generate unique IDs for the path operations shown in the generated OpenAPI.

This is particularly useful when automatically generating clients or SDKs for your API.

Read more about it in the FastAPI docs about how to Generate Clients.

TYPE: Callable[[APIRoute], str] DEFAULT: Default(generate_unique_id)

Whether to generate separate OpenAPI schemas for request body and response body when the results would be more precise.

This is particularly useful when automatically generating clients.

For example, if you have a model like:

When Item is used for input, a request body, tags is not required, the client doesn't have to provide it.

But when using Item for output, for a response body, tags is always available because it has a default value, even if it's just an empty list. So, the client should be able to always expect it.

In this case, there would be two different schemas, one for input and another one for output.

TYPE: bool DEFAULT: True

This field allows you to provide additional external documentation links. If provided, it must be a dictionary containing:

TYPE: Optional[dict[str, Any]] DEFAULT: None

Extra keyword arguments to be stored in the app, not used by FastAPI anywhere.

TYPE: Any DEFAULT: {}

The version string of OpenAPI.

FastAPI will generate OpenAPI version 3.1.0, and will output that as the OpenAPI version. But some tools, even though they might be compatible with OpenAPI 3.1.0, might not recognize it as a valid.

So you could override this value to trick those tools into using the generated OpenAPI. Have in mind that this is a hack. But if you avoid using features added in OpenAPI 3.1.0, it might work for your use case.

This is not passed as a parameter to the FastAPI class to avoid giving the false idea that FastAPI would generate a different OpenAPI schema. It is only available as an attribute.

The app.webhooks attribute is an APIRouter with the path operations that will be used just for documentation of webhooks.

Read more about it in the FastAPI docs for OpenAPI Webhooks.

A state object for the application. This is the same object for the entire application, it doesn't change from request to request.

You normally wouldn't use this in FastAPI, for most of the cases you would instead use FastAPI dependencies.

This is simply inherited from Starlette.

Read more about it in the Starlette docs for Applications.

A dictionary with overrides for the dependencies.

Each key is the original dependency callable, and the value is the actual dependency that should be called.

This is for testing, to replace expensive dependencies with testing versions.

Read more about it in the FastAPI docs for Testing Dependencies with Overrides.

Generate the OpenAPI schema of the application. This is called by FastAPI internally.

The first time it is called it stores the result in the attribute app.openapi_schema, and next times it is called, it just returns that same result. To avoid the cost of generating the schema every time.

If you need to modify the generated OpenAPI schema, you could modify it.

Read more in the FastAPI docs for OpenAPI.

Decorate a WebSocket function.

Read more about it in the FastAPI docs for WebSockets.

A name for the WebSocket. Only used internally.

TYPE: Optional[str] DEFAULT: None

A list of dependencies (using Depends()) to be used for this WebSocket.

Read more about it in the FastAPI docs for WebSockets.

TYPE: Optional[Sequence[Depends]] DEFAULT: None

Include an APIRouter in the same app.

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

Additional responses to be shown in OpenAPI.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for Additional Responses in OpenAPI.

And in the FastAPI docs for Bigger Applications.

TYPE: Optional[dict[Union[int, str], dict[str, Any]]] DEFAULT: None

Mark all the path operations in this router as deprecated.

It will be added to the generated OpenAPI (e.g. visible at /docs).

TYPE: Optional[bool] DEFAULT: None

Include (or not) all the path operations in this router in the generated OpenAPI schema.

This affects the generated OpenAPI (e.g. visible at /docs).

TYPE: bool DEFAULT: True

Default response class to be used for the path operations in this router.

Read more in the FastAPI docs for Custom Response - HTML, Stream, File, others.

TYPE: type[Response] DEFAULT: Default(JSONResponse)

List of path operations that will be used as OpenAPI callbacks.

This is only for OpenAPI documentation, the callbacks won't be used directly.

It will be added to the generated OpenAPI (e.g. visible at /docs).

Read more about it in the FastAPI docs for OpenAPI Callbacks.

TYPE: Optional[list[BaseRoute]] DEFAULT: None

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

Add an event handler for the application.

on_event is deprecated, use lifespan event handlers instead.

Read more about it in the FastAPI docs for Lifespan Events.

The type of event. startup or shutdown.

Add a middleware to the application.

Read more about it in the FastAPI docs for Middleware.

The type of middleware. Currently only supports http.

Add an exception handler to the app.

Read more about it in the FastAPI docs for Handling Errors.

The Exception class this would handle, or a status code.

TYPE: Union[int, type[Exception]]

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
```

Example 2 (rust):
```rust
FastAPI(
    *,
    debug=False,
    routes=None,
    title="FastAPI",
    summary=None,
    description="",
    version="0.1.0",
    openapi_url="/openapi.json",
    openapi_tags=None,
    servers=None,
    dependencies=None,
    default_response_class=Default(JSONResponse),
    redirect_slashes=True,
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_oauth2_redirect_url="/docs/oauth2-redirect",
    swagger_ui_init_oauth=None,
    middleware=None,
    exception_handlers=None,
    on_startup=None,
    on_shutdown=None,
    lifespan=None,
    terms_of_service=None,
    contact=None,
    license_info=None,
    openapi_prefix="",
    root_path="",
    root_path_in_servers=True,
    responses=None,
    callbacks=None,
    webhooks=None,
    deprecated=None,
    include_in_schema=True,
    swagger_ui_parameters=None,
    generate_unique_id_function=Default(generate_unique_id),
    separate_input_output_schemas=True,
    openapi_external_docs=None,
    **extra
)
```

Example 3 (python):
```python
from fastapi import FastAPI

app = FastAPI()
```

Example 4 (python):
```python
from fastapi import FastAPI

app = FastAPI(title="ChimichangApp")
```

---

## Encoders - jsonable_encoder¶

**URL:** https://fastapi.tiangolo.com/reference/encoders/

**Contents:**
- Encoders - jsonable_encoder¶
- fastapi.encoders.jsonable_encoder ¶

Convert any object to something that can be encoded in JSON.

This is used internally by FastAPI to make sure anything you return can be encoded as JSON before it is sent to the client.

You can also use it yourself, for example to convert objects before saving them in a database that supports only JSON.

Read more about it in the FastAPI docs for JSON Compatible Encoder.

The input object to convert to JSON.

Pydantic's include parameter, passed to Pydantic models to set the fields to include.

TYPE: Optional[IncEx] DEFAULT: None

Pydantic's exclude parameter, passed to Pydantic models to set the fields to exclude.

TYPE: Optional[IncEx] DEFAULT: None

Pydantic's by_alias parameter, passed to Pydantic models to define if the output should use the alias names (when provided) or the Python attribute names. In an API, if you set an alias, it's probably because you want to use it in the result, so you probably want to leave this set to True.

TYPE: bool DEFAULT: True

Pydantic's exclude_unset parameter, passed to Pydantic models to define if it should exclude from the output the fields that were not explicitly set (and that only had their default values).

TYPE: bool DEFAULT: False

Pydantic's exclude_defaults parameter, passed to Pydantic models to define if it should exclude from the output the fields that had the same default value, even when they were explicitly set.

TYPE: bool DEFAULT: False

Pydantic's exclude_none parameter, passed to Pydantic models to define if it should exclude from the output any fields that have a None value.

TYPE: bool DEFAULT: False

Pydantic's custom_encoder parameter, passed to Pydantic models to define a custom encoder.

TYPE: Optional[dict[Any, Callable[[Any], Any]]] DEFAULT: None

Exclude from the output any fields that start with the name _sa.

This is mainly a hack for compatibility with SQLAlchemy objects, they store internal SQLAlchemy-specific state in attributes named with _sa, and those objects can't (and shouldn't be) serialized to JSON.

TYPE: bool DEFAULT: True

**Examples:**

Example 1 (rust):
```rust
jsonable_encoder(
    obj,
    include=None,
    exclude=None,
    by_alias=True,
    exclude_unset=False,
    exclude_defaults=False,
    exclude_none=False,
    custom_encoder=None,
    sqlalchemy_safe=True,
)
```

Example 2 (typescript):
```typescript
def jsonable_encoder(
    obj: Annotated[
        Any,
        Doc(
            """
            The input object to convert to JSON.
            """
        ),
    ],
    include: Annotated[
        Optional[IncEx],
        Doc(
            """
            Pydantic's `include` parameter, passed to Pydantic models to set the
            fields to include.
            """
        ),
    ] = None,
    exclude: Annotated[
        Optional[IncEx],
        Doc(
            """
            Pydantic's `exclude` parameter, passed to Pydantic models to set the
            fields to exclude.
            """
        ),
    ] = None,
    by_alias: Annotated[
        bool,
        Doc(
            """
            Pydantic's `by_alias` parameter, passed to Pydantic models to define if
            the output should use the alias names (when provided) or the Python
            attribute names. In an API, if you set an alias, it's probably because you
            want to use it in the result, so you probably want to leave this set to
            `True`.
            """
        ),
    ] = True,
    exclude_unset: Annotated[
        bool,
        Doc(
            """
            Pydantic's `exclude_unset` parameter, passed to Pydantic models to define
            if it should exclude from the output the fields that were not explicitly
            set (and that only had their default values).
            """
        ),
    ] = False,
    exclude_defaults: Annotated[
        bool,
        Doc(
            """
            Pydantic's `exclude_defaults` parameter, passed to Pydantic models to define
            if it should exclude from the output the fields that had the same default
            value, even when they were explicitly set.
            """
        ),
    ] = False,
    exclude_none: Annotated[
        bool,
        Doc(
            """
            Pydantic's `exclude_none` parameter, passed to Pydantic models to define
            if it should exclude from the output any fields that have a `None` value.
            """
        ),
    ] = False,
    custom_encoder: Annotated[
        Optional[dict[Any, Callable[[Any], Any]]],
        Doc(
            """
            Pydantic's `custom_encoder` parameter, passed to Pydantic models to define
            a custom encoder.
            """
        ),
    ] = None,
    sqlalchemy_safe: Annotated[
        bool,
        Doc(
            """
            Exclude from the output any fields that start with the name `_sa`.

            This is mainly a hack for compatibility with SQLAlchemy objects, they
            store internal SQLAlchemy-specific state in attributes named with `_sa`,
            and those objects can't (and shouldn't be) serialized to JSON.
            """
        ),
    ] = True,
) -> Any:
    """
    Convert any object to something that can be encoded in JSON.

    This is used internally by FastAPI to make sure anything you return can be
    encoded as JSON before it is sent to the client.

    You can also use it yourself, for example to convert objects before saving them
    in a database that supports only JSON.

    Read more about it in the
    [FastAPI docs for JSON Compatible Encoder](https://fastapi.tiangolo.com/tutorial/encoder/).
    """
    custom_encoder = custom_encoder or {}
    if custom_encoder:
        if type(obj) in custom_encoder:
            return custom_encoder[type(obj)](obj)
        else:
            for encoder_type, encoder_instance in custom_encoder.items():
                if isinstance(obj, encoder_type):
                    return encoder_instance(obj)
    if include is not None and not isinstance(include, (set, dict)):
        include = set(include)
    if exclude is not None and not isinstance(exclude, (set, dict)):
        exclude = set(exclude)
    if isinstance(obj, (BaseModel, may_v1.BaseModel)):
        # TODO: remove when deprecating Pydantic v1
        encoders: dict[Any, Any] = {}
        if isinstance(obj, may_v1.BaseModel):
            encoders = getattr(obj.__config__, "json_encoders", {})
            if custom_encoder:
                encoders = {**encoders, **custom_encoder}
        obj_dict = _model_dump(
            obj,  # type: ignore[arg-type]
            mode="json",
            include=include,
            exclude=exclude,
            by_alias=by_alias,
            exclude_unset=exclude_unset,
            exclude_none=exclude_none,
            exclude_defaults=exclude_defaults,
        )
        if "__root__" in obj_dict:
            obj_dict = obj_dict["__root__"]
        return jsonable_encoder(
            obj_dict,
            exclude_none=exclude_none,
            exclude_defaults=exclude_defaults,
            # TODO: remove when deprecating Pydantic v1
            custom_encoder=encoders,
            sqlalchemy_safe=sqlalchemy_safe,
        )
    if dataclasses.is_dataclass(obj):
        assert not isinstance(obj, type)
        obj_dict = dataclasses.asdict(obj)
        return jsonable_encoder(
            obj_dict,
            include=include,
            exclude=exclude,
            by_alias=by_alias,
            exclude_unset=exclude_unset,
            exclude_defaults=exclude_defaults,
            exclude_none=exclude_none,
            custom_encoder=custom_encoder,
            sqlalchemy_safe=sqlalchemy_safe,
        )
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, PurePath):
        return str(obj)
    if isinstance(obj, (str, int, float, type(None))):
        return obj
    if _is_undefined(obj):
        return None
    if isinstance(obj, dict):
        encoded_dict = {}
        allowed_keys = set(obj.keys())
        if include is not None:
            allowed_keys &= set(include)
        if exclude is not None:
            allowed_keys -= set(exclude)
        for key, value in obj.items():
            if (
                (
                    not sqlalchemy_safe
                    or (not isinstance(key, str))
                    or (not key.startswith("_sa"))
                )
                and (value is not None or not exclude_none)
                and key in allowed_keys
            ):
                encoded_key = jsonable_encoder(
                    key,
                    by_alias=by_alias,
                    exclude_unset=exclude_unset,
                    exclude_none=exclude_none,
                    custom_encoder=custom_encoder,
                    sqlalchemy_safe=sqlalchemy_safe,
                )
                encoded_value = jsonable_encoder(
                    value,
                    by_alias=by_alias,
                    exclude_unset=exclude_unset,
                    exclude_none=exclude_none,
                    custom_encoder=custom_encoder,
                    sqlalchemy_safe=sqlalchemy_safe,
                )
                encoded_dict[encoded_key] = encoded_value
        return encoded_dict
    if isinstance(obj, (list, set, frozenset, GeneratorType, tuple, deque)):
        encoded_list = []
        for item in obj:
            encoded_list.append(
                jsonable_encoder(
                    item,
                    include=include,
                    exclude=exclude,
                    by_alias=by_alias,
                    exclude_unset=exclude_unset,
                    exclude_defaults=exclude_defaults,
                    exclude_none=exclude_none,
                    custom_encoder=custom_encoder,
                    sqlalchemy_safe=sqlalchemy_safe,
                )
            )
        return encoded_list

    if type(obj) in ENCODERS_BY_TYPE:
        return ENCODERS_BY_TYPE[type(obj)](obj)
    for encoder, classes_tuple in encoders_by_class_tuples.items():
        if isinstance(obj, classes_tuple):
            return encoder(obj)

    try:
        data = dict(obj)
    except Exception as e:
        errors: list[Exception] = []
        errors.append(e)
        try:
            data = vars(obj)
        except Exception as e:
            errors.append(e)
            raise ValueError(errors) from e
    return jsonable_encoder(
        data,
        include=include,
        exclude=exclude,
        by_alias=by_alias,
        exclude_unset=exclude_unset,
        exclude_defaults=exclude_defaults,
        exclude_none=exclude_none,
        custom_encoder=custom_encoder,
        sqlalchemy_safe=sqlalchemy_safe,
    )
```

---

## Background Tasks - BackgroundTasks¶

**URL:** https://fastapi.tiangolo.com/reference/background/

**Contents:**
- Background Tasks - BackgroundTasks¶
- fastapi.BackgroundTasks ¶
    - Example¶
  - func instance-attribute ¶
  - args instance-attribute ¶
  - kwargs instance-attribute ¶
  - is_async instance-attribute ¶
  - tasks instance-attribute ¶
  - add_task ¶

You can declare a parameter in a path operation function or dependency function with the type BackgroundTasks, and then you can use it to schedule the execution of background tasks after the response is sent.

You can import it directly from fastapi:

Bases: BackgroundTasks

A collection of background tasks that will be called after a response has been sent to the client.

Read more about it in the FastAPI docs for Background Tasks.

Add a function to be called in the background after the response is sent.

Read more about it in the FastAPI docs for Background Tasks.

The function to call after the response is sent.

It can be a regular def function or an async def function.

TYPE: Callable[P, Any]

**Examples:**

Example 1 (python):
```python
from fastapi import BackgroundTasks
```

Example 2 (rust):
```rust
BackgroundTasks(tasks=None)
```

Example 3 (python):
```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()


def write_notification(email: str, message=""):
    with open("log.txt", mode="w") as email_file:
        content = f"notification for {email}: {message}"
        email_file.write(content)


@app.post("/send-notification/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_notification, email, message="some notification")
    return {"message": "Notification sent in the background"}
```

Example 4 (python):
```python
def __init__(self, tasks: Sequence[BackgroundTask] | None = None):
    self.tasks = list(tasks) if tasks else []
```

---

## Middleware¶

**URL:** https://fastapi.tiangolo.com/reference/middleware/

**Contents:**
- Middleware¶
- fastapi.middleware.cors.CORSMiddleware ¶
  - app instance-attribute ¶
  - allow_origins instance-attribute ¶
  - allow_methods instance-attribute ¶
  - allow_headers instance-attribute ¶
  - allow_all_origins instance-attribute ¶
  - allow_all_headers instance-attribute ¶
  - preflight_explicit_allow_origin instance-attribute ¶
  - allow_origin_regex instance-attribute ¶

There are several middlewares available provided by Starlette directly.

Read more about them in the FastAPI docs for Middleware.

It can be imported from fastapi:

It can be imported from fastapi:

It can be imported from fastapi:

It can be imported from fastapi:

It can be imported from fastapi:

**Examples:**

Example 1 (rust):
```rust
CORSMiddleware(
    app,
    allow_origins=(),
    allow_methods=("GET",),
    allow_headers=(),
    allow_credentials=False,
    allow_origin_regex=None,
    expose_headers=(),
    max_age=600,
)
```

Example 2 (python):
```python
def __init__(
    self,
    app: ASGIApp,
    allow_origins: Sequence[str] = (),
    allow_methods: Sequence[str] = ("GET",),
    allow_headers: Sequence[str] = (),
    allow_credentials: bool = False,
    allow_origin_regex: str | None = None,
    expose_headers: Sequence[str] = (),
    max_age: int = 600,
) -> None:
    if "*" in allow_methods:
        allow_methods = ALL_METHODS

    compiled_allow_origin_regex = None
    if allow_origin_regex is not None:
        compiled_allow_origin_regex = re.compile(allow_origin_regex)

    allow_all_origins = "*" in allow_origins
    allow_all_headers = "*" in allow_headers
    preflight_explicit_allow_origin = not allow_all_origins or allow_credentials

    simple_headers = {}
    if allow_all_origins:
        simple_headers["Access-Control-Allow-Origin"] = "*"
    if allow_credentials:
        simple_headers["Access-Control-Allow-Credentials"] = "true"
    if expose_headers:
        simple_headers["Access-Control-Expose-Headers"] = ", ".join(expose_headers)

    preflight_headers = {}
    if preflight_explicit_allow_origin:
        # The origin value will be set in preflight_response() if it is allowed.
        preflight_headers["Vary"] = "Origin"
    else:
        preflight_headers["Access-Control-Allow-Origin"] = "*"
    preflight_headers.update(
        {
            "Access-Control-Allow-Methods": ", ".join(allow_methods),
            "Access-Control-Max-Age": str(max_age),
        }
    )
    allow_headers = sorted(SAFELISTED_HEADERS | set(allow_headers))
    if allow_headers and not allow_all_headers:
        preflight_headers["Access-Control-Allow-Headers"] = ", ".join(allow_headers)
    if allow_credentials:
        preflight_headers["Access-Control-Allow-Credentials"] = "true"

    self.app = app
    self.allow_origins = allow_origins
    self.allow_methods = allow_methods
    self.allow_headers = [h.lower() for h in allow_headers]
    self.allow_all_origins = allow_all_origins
    self.allow_all_headers = allow_all_headers
    self.preflight_explicit_allow_origin = preflight_explicit_allow_origin
    self.allow_origin_regex = compiled_allow_origin_regex
    self.simple_headers = simple_headers
    self.preflight_headers = preflight_headers
```

Example 3 (unknown):
```unknown
allow_origins = allow_origins
```

Example 4 (unknown):
```unknown
allow_methods = allow_methods
```

---

## WebSockets¶

**URL:** https://fastapi.tiangolo.com/reference/websockets/

**Contents:**
- WebSockets¶
- fastapi.WebSocket ¶
  - scope instance-attribute ¶
  - app property ¶
  - url property ¶
  - base_url property ¶
  - headers property ¶
  - query_params property ¶
  - path_params property ¶
  - cookies property ¶

When defining WebSockets, you normally declare a parameter of type WebSocket and with it you can read data from the client and send data to it.

It is provided directly by Starlette, but you can import it from fastapi:

When you want to define dependencies that should be compatible with both HTTP and WebSockets, you can define a parameter that takes an HTTPConnection instead of a Request or a WebSocket.

Bases: HTTPConnection

Receive ASGI websocket messages, ensuring valid state transitions.

Send ASGI websocket messages, ensuring valid state transitions.

When a client disconnects, a WebSocketDisconnect exception is raised, you can catch it.

You can import it directly form fastapi:

Additional classes for handling WebSockets.

Provided directly by Starlette, but you can import it from fastapi:

**Examples:**

Example 1 (python):
```python
from fastapi import WebSocket
```

Example 2 (unknown):
```unknown
WebSocket(scope, receive, send)
```

Example 3 (python):
```python
def __init__(self, scope: Scope, receive: Receive, send: Send) -> None:
    super().__init__(scope)
    assert scope["type"] == "websocket"
    self._receive = receive
    self._send = send
    self.client_state = WebSocketState.CONNECTING
    self.application_state = WebSocketState.CONNECTING
```

Example 4 (unknown):
```unknown
scope = scope
```

---

## OpenAPI docs¶

**URL:** https://fastapi.tiangolo.com/reference/openapi/docs/

**Contents:**
- OpenAPI docs¶
- fastapi.openapi.docs.get_swagger_ui_html ¶
- fastapi.openapi.docs.get_redoc_html ¶
- fastapi.openapi.docs.get_swagger_ui_oauth2_redirect_html ¶
- fastapi.openapi.docs.swagger_ui_default_parameters module-attribute ¶

Utilities to handle OpenAPI automatic UI documentation, including Swagger UI (by default at /docs) and ReDoc (by default at /redoc).

Generate and return the HTML that loads Swagger UI for the interactive API docs (normally served at /docs).

You would only call this function yourself if you needed to override some parts, for example the URLs to use to load Swagger UI's JavaScript and CSS.

Read more about it in the FastAPI docs for Configure Swagger UI and the FastAPI docs for Custom Docs UI Static Assets (Self-Hosting).

The OpenAPI URL that Swagger UI should load and use.

This is normally done automatically by FastAPI using the default URL /openapi.json.

The HTML <title> content, normally shown in the browser tab.

The URL to use to load the Swagger UI JavaScript.

It is normally set to a CDN URL.

TYPE: str DEFAULT: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js'

The URL to use to load the Swagger UI CSS.

It is normally set to a CDN URL.

TYPE: str DEFAULT: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css'

The URL of the favicon to use. It is normally shown in the browser tab.

TYPE: str DEFAULT: 'https://fastapi.tiangolo.com/img/favicon.png'

The OAuth2 redirect URL, it is normally automatically handled by FastAPI.

TYPE: Optional[str] DEFAULT: None

A dictionary with Swagger UI OAuth2 initialization configurations.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Configuration parameters for Swagger UI.

It defaults to swagger_ui_default_parameters.

TYPE: Optional[dict[str, Any]] DEFAULT: None

Generate and return the HTML response that loads ReDoc for the alternative API docs (normally served at /redoc).

You would only call this function yourself if you needed to override some parts, for example the URLs to use to load ReDoc's JavaScript and CSS.

Read more about it in the FastAPI docs for Custom Docs UI Static Assets (Self-Hosting).

The OpenAPI URL that ReDoc should load and use.

This is normally done automatically by FastAPI using the default URL /openapi.json.

The HTML <title> content, normally shown in the browser tab.

The URL to use to load the ReDoc JavaScript.

It is normally set to a CDN URL.

TYPE: str DEFAULT: 'https://cdn.jsdelivr.net/npm/redoc@2/bundles/redoc.standalone.js'

The URL of the favicon to use. It is normally shown in the browser tab.

TYPE: str DEFAULT: 'https://fastapi.tiangolo.com/img/favicon.png'

Load and use Google Fonts.

TYPE: bool DEFAULT: True

Generate the HTML response with the OAuth2 redirection for Swagger UI.

You normally don't need to use or change this.

Default configurations for Swagger UI.

You can use it as a template to add any other configurations needed.

**Examples:**

Example 1 (rust):
```rust
get_swagger_ui_html(
    *,
    openapi_url,
    title,
    swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
    oauth2_redirect_url=None,
    init_oauth=None,
    swagger_ui_parameters=None
)
```

Example 2 (html):
```html
def get_swagger_ui_html(
    *,
    openapi_url: Annotated[
        str,
        Doc(
            """
            The OpenAPI URL that Swagger UI should load and use.

            This is normally done automatically by FastAPI using the default URL
            `/openapi.json`.
            """
        ),
    ],
    title: Annotated[
        str,
        Doc(
            """
            The HTML `<title>` content, normally shown in the browser tab.
            """
        ),
    ],
    swagger_js_url: Annotated[
        str,
        Doc(
            """
            The URL to use to load the Swagger UI JavaScript.

            It is normally set to a CDN URL.
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    swagger_css_url: Annotated[
        str,
        Doc(
            """
            The URL to use to load the Swagger UI CSS.

            It is normally set to a CDN URL.
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    swagger_favicon_url: Annotated[
        str,
        Doc(
            """
            The URL of the favicon to use. It is normally shown in the browser tab.
            """
        ),
    ] = "https://fastapi.tiangolo.com/img/favicon.png",
    oauth2_redirect_url: Annotated[
        Optional[str],
        Doc(
            """
            The OAuth2 redirect URL, it is normally automatically handled by FastAPI.
            """
        ),
    ] = None,
    init_oauth: Annotated[
        Optional[dict[str, Any]],
        Doc(
            """
            A dictionary with Swagger UI OAuth2 initialization configurations.
            """
        ),
    ] = None,
    swagger_ui_parameters: Annotated[
        Optional[dict[str, Any]],
        Doc(
            """
            Configuration parameters for Swagger UI.

            It defaults to [swagger_ui_default_parameters][fastapi.openapi.docs.swagger_ui_default_parameters].
            """
        ),
    ] = None,
) -> HTMLResponse:
    """
    Generate and return the HTML  that loads Swagger UI for the interactive
    API docs (normally served at `/docs`).

    You would only call this function yourself if you needed to override some parts,
    for example the URLs to use to load Swagger UI's JavaScript and CSS.

    Read more about it in the
    [FastAPI docs for Configure Swagger UI](https://fastapi.tiangolo.com/how-to/configure-swagger-ui/)
    and the [FastAPI docs for Custom Docs UI Static Assets (Self-Hosting)](https://fastapi.tiangolo.com/how-to/custom-docs-ui-assets/).
    """
    current_swagger_ui_parameters = swagger_ui_default_parameters.copy()
    if swagger_ui_parameters:
        current_swagger_ui_parameters.update(swagger_ui_parameters)

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <link type="text/css" rel="stylesheet" href="{swagger_css_url}">
    <link rel="shortcut icon" href="{swagger_favicon_url}">
    <title>{title}</title>
    </head>
    <body>
    <div id="swagger-ui">
    </div>
    <script src="{swagger_js_url}"></script>
    <!-- `SwaggerUIBundle` is now available on the page -->
    <script>
    const ui = SwaggerUIBundle({{
        url: '{openapi_url}',
    """

    for key, value in current_swagger_ui_parameters.items():
        html += f"{json.dumps(key)}: {json.dumps(jsonable_encoder(value))},\n"

    if oauth2_redirect_url:
        html += f"oauth2RedirectUrl: window.location.origin + '{oauth2_redirect_url}',"

    html += """
    presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
    })"""

    if init_oauth:
        html += f"""
        ui.initOAuth({json.dumps(jsonable_encoder(init_oauth))})
        """

    html += """
    </script>
    </body>
    </html>
    """
    return HTMLResponse(html)
```

Example 3 (python):
```python
get_redoc_html(
    *,
    openapi_url,
    title,
    redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@2/bundles/redoc.standalone.js",
    redoc_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
    with_google_fonts=True
)
```

Example 4 (html):
```html
def get_redoc_html(
    *,
    openapi_url: Annotated[
        str,
        Doc(
            """
            The OpenAPI URL that ReDoc should load and use.

            This is normally done automatically by FastAPI using the default URL
            `/openapi.json`.
            """
        ),
    ],
    title: Annotated[
        str,
        Doc(
            """
            The HTML `<title>` content, normally shown in the browser tab.
            """
        ),
    ],
    redoc_js_url: Annotated[
        str,
        Doc(
            """
            The URL to use to load the ReDoc JavaScript.

            It is normally set to a CDN URL.
            """
        ),
    ] = "https://cdn.jsdelivr.net/npm/redoc@2/bundles/redoc.standalone.js",
    redoc_favicon_url: Annotated[
        str,
        Doc(
            """
            The URL of the favicon to use. It is normally shown in the browser tab.
            """
        ),
    ] = "https://fastapi.tiangolo.com/img/favicon.png",
    with_google_fonts: Annotated[
        bool,
        Doc(
            """
            Load and use Google Fonts.
            """
        ),
    ] = True,
) -> HTMLResponse:
    """
    Generate and return the HTML response that loads ReDoc for the alternative
    API docs (normally served at `/redoc`).

    You would only call this function yourself if you needed to override some parts,
    for example the URLs to use to load ReDoc's JavaScript and CSS.

    Read more about it in the
    [FastAPI docs for Custom Docs UI Static Assets (Self-Hosting)](https://fastapi.tiangolo.com/how-to/custom-docs-ui-assets/).
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <title>{title}</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    """
    if with_google_fonts:
        html += """
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    """
    html += f"""
    <link rel="shortcut icon" href="{redoc_favicon_url}">
    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {{
        margin: 0;
        padding: 0;
      }}
    </style>
    </head>
    <body>
    <noscript>
        ReDoc requires Javascript to function. Please enable it to browse the documentation.
    </noscript>
    <redoc spec-url="{openapi_url}"></redoc>
    <script src="{redoc_js_url}"> </script>
    </body>
    </html>
    """
    return HTMLResponse(html)
```

---

## Advanced Middleware¶

**URL:** https://fastapi.tiangolo.com/advanced/middleware/

**Contents:**
- Advanced Middleware¶
- Adding ASGI middlewares¶
- Integrated middlewares¶
- HTTPSRedirectMiddleware¶
- TrustedHostMiddleware¶
- GZipMiddleware¶
- Other middlewares¶

In the main tutorial you read how to add Custom Middleware to your application.

And then you also read how to handle CORS with the CORSMiddleware.

In this section we'll see how to use other middlewares.

As FastAPI is based on Starlette and implements the ASGI specification, you can use any ASGI middleware.

A middleware doesn't have to be made for FastAPI or Starlette to work, as long as it follows the ASGI spec.

In general, ASGI middlewares are classes that expect to receive an ASGI app as the first argument.

So, in the documentation for third-party ASGI middlewares they will probably tell you to do something like:

But FastAPI (actually Starlette) provides a simpler way to do it that makes sure that the internal middlewares handle server errors and custom exception handlers work properly.

For that, you use app.add_middleware() (as in the example for CORS).

app.add_middleware() receives a middleware class as the first argument and any additional arguments to be passed to the middleware.

FastAPI includes several middlewares for common use cases, we'll see next how to use them.

For the next examples, you could also use from starlette.middleware.something import SomethingMiddleware.

FastAPI provides several middlewares in fastapi.middleware just as a convenience for you, the developer. But most of the available middlewares come directly from Starlette.

Enforces that all incoming requests must either be https or wss.

Any incoming request to http or ws will be redirected to the secure scheme instead.

Enforces that all incoming requests have a correctly set Host header, in order to guard against HTTP Host Header attacks.

The following arguments are supported:

If an incoming request does not validate correctly then a 400 response will be sent.

Handles GZip responses for any request that includes "gzip" in the Accept-Encoding header.

The middleware will handle both standard and streaming responses.

The following arguments are supported:

There are many other ASGI middlewares.

To see other available middlewares check Starlette's Middleware docs and the ASGI Awesome List.

**Examples:**

Example 1 (python):
```python
from unicorn import UnicornMiddleware

app = SomeASGIApp()

new_app = UnicornMiddleware(app, some_config="rainbow")
```

Example 2 (python):
```python
from fastapi import FastAPI
from unicorn import UnicornMiddleware

app = FastAPI()

app.add_middleware(UnicornMiddleware, some_config="rainbow")
```

Example 3 (python):
```python
from fastapi import FastAPI
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

app.add_middleware(HTTPSRedirectMiddleware)


@app.get("/")
async def main():
    return {"message": "Hello World"}
```

Example 4 (python):
```python
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["example.com", "*.example.com"]
)


@app.get("/")
async def main():
    return {"message": "Hello World"}
```

---

## OpenAPI¶

**URL:** https://fastapi.tiangolo.com/reference/openapi/

**Contents:**
- OpenAPI¶

There are several utilities to handle OpenAPI.

You normally don't need to use them unless you have a specific advanced use case that requires it.

---

## Status Codes¶

**URL:** https://fastapi.tiangolo.com/reference/status/

**Contents:**
- Status Codes¶
- Example¶
- fastapi.status ¶
  - HTTP_100_CONTINUE module-attribute ¶
  - HTTP_101_SWITCHING_PROTOCOLS module-attribute ¶
  - HTTP_102_PROCESSING module-attribute ¶
  - HTTP_103_EARLY_HINTS module-attribute ¶
  - HTTP_200_OK module-attribute ¶
  - HTTP_201_CREATED module-attribute ¶
  - HTTP_202_ACCEPTED module-attribute ¶

You can import the status module from fastapi:

status is provided directly by Starlette.

It contains a group of named constants (variables) with integer status codes.

It can be convenient to quickly access HTTP (and WebSocket) status codes in your app, using autocompletion for the name without having to remember the integer status codes by memory.

Read more about it in the FastAPI docs about Response Status Code.

HTTP codes See HTTP Status Code Registry: https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml

And RFC 9110 - https://www.rfc-editor.org/rfc/rfc9110

WebSocket codes https://www.iana.org/assignments/websocket/websocket.xml#close-code-number https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent

**Examples:**

Example 1 (python):
```python
from fastapi import status
```

Example 2 (python):
```python
from fastapi import FastAPI, status

app = FastAPI()


@app.get("/items/", status_code=status.HTTP_418_IM_A_TEAPOT)
def read_items():
    return [{"name": "Plumbus"}, {"name": "Portal Gun"}]
```

Example 3 (unknown):
```unknown
HTTP_100_CONTINUE = 100
```

Example 4 (unknown):
```unknown
HTTP_101_SWITCHING_PROTOCOLS = 101
```

---

## Reference¶

**URL:** https://fastapi.tiangolo.com/reference/

**Contents:**
- Reference¶

Here's the reference or code API, the classes, functions, parameters, attributes, and all the FastAPI parts you can use in your applications.

If you want to learn FastAPI you are much better off reading the FastAPI Tutorial.

---

## Additional Status Codes¶

**URL:** https://fastapi.tiangolo.com/advanced/additional-status-codes/

**Contents:**
- Additional Status Codes¶
- Additional status codes¶
- OpenAPI and API docs¶

By default, FastAPI will return the responses using a JSONResponse, putting the content you return from your path operation inside of that JSONResponse.

It will use the default status code or the one you set in your path operation.

If you want to return additional status codes apart from the main one, you can do that by returning a Response directly, like a JSONResponse, and set the additional status code directly.

For example, let's say that you want to have a path operation that allows to update items, and returns HTTP status codes of 200 "OK" when successful.

But you also want it to accept new items. And when the items didn't exist before, it creates them, and returns an HTTP status code of 201 "Created".

To achieve that, import JSONResponse, and return your content there directly, setting the status_code that you want:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

When you return a Response directly, like in the example above, it will be returned directly.

It won't be serialized with a model, etc.

Make sure it has the data you want it to have, and that the values are valid JSON (if you are using JSONResponse).

You could also use from starlette.responses import JSONResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette. The same with status.

If you return additional status codes and responses directly, they won't be included in the OpenAPI schema (the API docs), because FastAPI doesn't have a way to know beforehand what you are going to return.

But you can document that in your code, using: Additional Responses.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Body, FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

items = {"foo": {"name": "Fighters", "size": 6}, "bar": {"name": "Tenders", "size": 3}}


@app.put("/items/{item_id}")
async def upsert_item(
    item_id: str,
    name: Annotated[str | None, Body()] = None,
    size: Annotated[int | None, Body()] = None,
):
    if item_id in items:
        item = items[item_id]
        item["name"] = name
        item["size"] = size
        return item
    else:
        item = {"name": name, "size": size}
        items[item_id] = item
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=item)
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Body, FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

items = {"foo": {"name": "Fighters", "size": 6}, "bar": {"name": "Tenders", "size": 3}}


@app.put("/items/{item_id}")
async def upsert_item(
    item_id: str,
    name: Annotated[Union[str, None], Body()] = None,
    size: Annotated[Union[int, None], Body()] = None,
):
    if item_id in items:
        item = items[item_id]
        item["name"] = name
        item["size"] = size
        return item
    else:
        item = {"name": name, "size": size}
        items[item_id] = item
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=item)
```

Example 3 (python):
```python
from fastapi import Body, FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

items = {"foo": {"name": "Fighters", "size": 6}, "bar": {"name": "Tenders", "size": 3}}


@app.put("/items/{item_id}")
async def upsert_item(
    item_id: str,
    name: str | None = Body(default=None),
    size: int | None = Body(default=None),
):
    if item_id in items:
        item = items[item_id]
        item["name"] = name
        item["size"] = size
        return item
    else:
        item = {"name": name, "size": size}
        items[item_id] = item
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=item)
```

Example 4 (python):
```python
from typing import Union

from fastapi import Body, FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()

items = {"foo": {"name": "Fighters", "size": 6}, "bar": {"name": "Tenders", "size": 3}}


@app.put("/items/{item_id}")
async def upsert_item(
    item_id: str,
    name: Union[str, None] = Body(default=None),
    size: Union[int, None] = Body(default=None),
):
    if item_id in items:
        item = items[item_id]
        item["name"] = name
        item["size"] = size
        return item
    else:
        item = {"name": name, "size": size}
        items[item_id] = item
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=item)
```

---

## Response - Change Status Code¶

**URL:** https://fastapi.tiangolo.com/advanced/response-change-status-code/

**Contents:**
- Response - Change Status Code¶
- Use case¶
- Use a Response parameter¶

You probably read before that you can set a default Response Status Code.

But in some cases you need to return a different status code than the default.

For example, imagine that you want to return an HTTP status code of "OK" 200 by default.

But if the data didn't exist, you want to create it, and return an HTTP status code of "CREATED" 201.

But you still want to be able to filter and convert the data you return with a response_model.

For those cases, you can use a Response parameter.

You can declare a parameter of type Response in your path operation function (as you can do for cookies and headers).

And then you can set the status_code in that temporal response object.

And then you can return any object you need, as you normally would (a dict, a database model, etc).

And if you declared a response_model, it will still be used to filter and convert the object you returned.

FastAPI will use that temporal response to extract the status code (also cookies and headers), and will put them in the final response that contains the value you returned, filtered by any response_model.

You can also declare the Response parameter in dependencies, and set the status code in them. But keep in mind that the last one to be set will win.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI, Response, status

app = FastAPI()

tasks = {"foo": "Listen to the Bar Fighters"}


@app.put("/get-or-create-task/{task_id}", status_code=200)
def get_or_create_task(task_id: str, response: Response):
    if task_id not in tasks:
        tasks[task_id] = "This didn't exist before"
        response.status_code = status.HTTP_201_CREATED
    return tasks[task_id]
```

---

## Lifespan Events¶

**URL:** https://fastapi.tiangolo.com/advanced/events/

**Contents:**
- Lifespan Events¶
- Use Case¶
- Lifespan¶
  - Lifespan function¶
  - Async Context Manager¶
- Alternative Events (deprecated)¶
  - startup event¶
  - shutdown event¶
  - startup and shutdown together¶
- Technical Details¶

You can define logic (code) that should be executed before the application starts up. This means that this code will be executed once, before the application starts receiving requests.

The same way, you can define logic (code) that should be executed when the application is shutting down. In this case, this code will be executed once, after having handled possibly many requests.

Because this code is executed before the application starts taking requests, and right after it finishes handling requests, it covers the whole application lifespan (the word "lifespan" will be important in a second 😉).

This can be very useful for setting up resources that you need to use for the whole app, and that are shared among requests, and/or that you need to clean up afterwards. For example, a database connection pool, or loading a shared machine learning model.

Let's start with an example use case and then see how to solve it with this.

Let's imagine that you have some machine learning models that you want to use to handle requests. 🤖

The same models are shared among requests, so, it's not one model per request, or one per user or something similar.

Let's imagine that loading the model can take quite some time, because it has to read a lot of data from disk. So you don't want to do it for every request.

You could load it at the top level of the module/file, but that would also mean that it would load the model even if you are just running a simple automated test, then that test would be slow because it would have to wait for the model to load before being able to run an independent part of the code.

That's what we'll solve, let's load the model before the requests are handled, but only right before the application starts receiving requests, not while the code is being loaded.

You can define this startup and shutdown logic using the lifespan parameter of the FastAPI app, and a "context manager" (I'll show you what that is in a second).

Let's start with an example and then see it in detail.

We create an async function lifespan() with yield like this:

Here we are simulating the expensive startup operation of loading the model by putting the (fake) model function in the dictionary with machine learning models before the yield. This code will be executed before the application starts taking requests, during the startup.

And then, right after the yield, we unload the model. This code will be executed after the application finishes handling requests, right before the shutdown. This could, for example, release resources like memory or a GPU.

The shutdown would happen when you are stopping the application.

Maybe you need to start a new version, or you just got tired of running it. 🤷

The first thing to notice, is that we are defining an async function with yield. This is very similar to Dependencies with yield.

The first part of the function, before the yield, will be executed before the application starts.

And the part after the yield will be executed after the application has finished.

If you check, the function is decorated with an @asynccontextmanager.

That converts the function into something called an "async context manager".

A context manager in Python is something that you can use in a with statement, for example, open() can be used as a context manager:

In recent versions of Python, there's also an async context manager. You would use it with async with:

When you create a context manager or an async context manager like above, what it does is that, before entering the with block, it will execute the code before the yield, and after exiting the with block, it will execute the code after the yield.

In our code example above, we don't use it directly, but we pass it to FastAPI for it to use it.

The lifespan parameter of the FastAPI app takes an async context manager, so we can pass our new lifespan async context manager to it.

The recommended way to handle the startup and shutdown is using the lifespan parameter of the FastAPI app as described above. If you provide a lifespan parameter, startup and shutdown event handlers will no longer be called. It's all lifespan or all events, not both.

You can probably skip this part.

There's an alternative way to define this logic to be executed during startup and during shutdown.

You can define event handlers (functions) that need to be executed before the application starts up, or when the application is shutting down.

These functions can be declared with async def or normal def.

To add a function that should be run before the application starts, declare it with the event "startup":

In this case, the startup event handler function will initialize the items "database" (just a dict) with some values.

You can add more than one event handler function.

And your application won't start receiving requests until all the startup event handlers have completed.

To add a function that should be run when the application is shutting down, declare it with the event "shutdown":

Here, the shutdown event handler function will write a text line "Application shutdown" to a file log.txt.

In the open() function, the mode="a" means "append", so, the line will be added after whatever is on that file, without overwriting the previous contents.

Notice that in this case we are using a standard Python open() function that interacts with a file.

So, it involves I/O (input/output), that requires "waiting" for things to be written to disk.

But open() doesn't use async and await.

So, we declare the event handler function with standard def instead of async def.

There's a high chance that the logic for your startup and shutdown is connected, you might want to start something and then finish it, acquire a resource and then release it, etc.

Doing that in separated functions that don't share logic or variables together is more difficult as you would need to store values in global variables or similar tricks.

Because of that, it's now recommended to instead use the lifespan as explained above.

Just a technical detail for the curious nerds. 🤓

Underneath, in the ASGI technical specification, this is part of the Lifespan Protocol, and it defines events called startup and shutdown.

You can read more about the Starlette lifespan handlers in Starlette's Lifespan' docs.

Including how to handle lifespan state that can be used in other areas of your code.

🚨 Keep in mind that these lifespan events (startup and shutdown) will only be executed for the main application, not for Sub Applications - Mounts.

**Examples:**

Example 1 (python):
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI


def fake_answer_to_everything_ml_model(x: float):
    return x * 42


ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    ml_models["answer_to_everything"] = fake_answer_to_everything_ml_model
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/predict")
async def predict(x: float):
    result = ml_models["answer_to_everything"](x)
    return {"result": result}
```

Example 2 (python):
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI


def fake_answer_to_everything_ml_model(x: float):
    return x * 42


ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    ml_models["answer_to_everything"] = fake_answer_to_everything_ml_model
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/predict")
async def predict(x: float):
    result = ml_models["answer_to_everything"](x)
    return {"result": result}
```

Example 3 (python):
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI


def fake_answer_to_everything_ml_model(x: float):
    return x * 42


ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    ml_models["answer_to_everything"] = fake_answer_to_everything_ml_model
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/predict")
async def predict(x: float):
    result = ml_models["answer_to_everything"](x)
    return {"result": result}
```

Example 4 (typescript):
```typescript
with open("file.txt") as file:
    file.read()
```

---

## Templating - Jinja2Templates¶

**URL:** https://fastapi.tiangolo.com/reference/templating/

**Contents:**
- Templating - Jinja2Templates¶
- fastapi.templating.Jinja2Templates ¶
  - context_processors instance-attribute ¶
  - env instance-attribute ¶
  - get_template ¶
  - TemplateResponse ¶

You can use the Jinja2Templates class to render Jinja templates.

Read more about it in the FastAPI docs for Templates.

You can import it directly from fastapi.templating:

templates = Jinja2Templates("templates")

return templates.TemplateResponse("index.html", {"request": request})

**Examples:**

Example 1 (sql):
```sql
from fastapi.templating import Jinja2Templates
```

Example 2 (rust):
```rust
Jinja2Templates(
    directory: (
        str | PathLike[str] | Sequence[str | PathLike[str]]
    ),
    *,
    context_processors: (
        list[Callable[[Request], dict[str, Any]]] | None
    ) = None,
    **env_options: Any
)
```

Example 3 (rust):
```rust
Jinja2Templates(
    *,
    env: Environment,
    context_processors: (
        list[Callable[[Request], dict[str, Any]]] | None
    ) = None
)
```

Example 4 (rust):
```rust
Jinja2Templates(
    directory=None,
    *,
    context_processors=None,
    env=None,
    **env_options
)
```

---

## Generating SDKs¶

**URL:** https://fastapi.tiangolo.com/advanced/generate-clients/

**Contents:**
- Generating SDKs¶
- Open Source SDK Generators¶
- SDK Generators from FastAPI Sponsors¶
- Create a TypeScript SDK¶
  - API Docs¶
  - Hey API¶
  - Using the SDK¶
- FastAPI App with Tags¶
  - Generate a TypeScript Client with Tags¶
  - Client Method Names¶

Because FastAPI is based on the OpenAPI specification, its APIs can be described in a standard format that many tools understand.

This makes it easy to generate up-to-date documentation, client libraries (SDKs) in multiple languages, and testing or automation workflows that stay in sync with your code.

In this guide, you'll learn how to generate a TypeScript SDK for your FastAPI backend.

A versatile option is the OpenAPI Generator, which supports many programming languages and can generate SDKs from your OpenAPI specification.

For TypeScript clients, Hey API is a purpose-built solution, providing an optimized experience for the TypeScript ecosystem.

You can discover more SDK generators on OpenAPI.Tools.

FastAPI automatically generates OpenAPI 3.1 specifications, so any tool you use must support this version.

This section highlights venture-backed and company-supported solutions from companies that sponsor FastAPI. These products provide additional features and integrations on top of high-quality generated SDKs.

By ✨ sponsoring FastAPI ✨, these companies help ensure the framework and its ecosystem remain healthy and sustainable.

Their sponsorship also demonstrates a strong commitment to the FastAPI community (you), showing that they care not only about offering a great service but also about supporting a robust and thriving framework, FastAPI. 🙇

For example, you might want to try:

Some of these solutions may also be open source or offer free tiers, so you can try them without a financial commitment. Other commercial SDK generators are available and can be found online. 🤓

Let's start with a simple FastAPI application:

Notice that the path operations define the models they use for request payload and response payload, using the models Item and ResponseMessage.

If you go to /docs, you will see that it has the schemas for the data to be sent in requests and received in responses:

You can see those schemas because they were declared with the models in the app.

That information is available in the app's OpenAPI schema, and then shown in the API docs.

That same information from the models that is included in OpenAPI is what can be used to generate the client code.

Once we have a FastAPI app with the models, we can use Hey API to generate a TypeScript client. The fastest way to do that is via npx.

This will generate a TypeScript SDK in ./src/client.

You can learn how to install @hey-api/openapi-ts and read about the generated output on their website.

Now you can import and use the client code. It could look like this, notice that you get autocompletion for the methods:

You will also get autocompletion for the payload to send:

Notice the autocompletion for name and price, that was defined in the FastAPI application, in the Item model.

You will have inline errors for the data that you send:

The response object will also have autocompletion:

In many cases, your FastAPI app will be bigger, and you will probably use tags to separate different groups of path operations.

For example, you could have a section for items and another section for users, and they could be separated by tags:

If you generate a client for a FastAPI app using tags, it will normally also separate the client code based on the tags.

This way, you will be able to have things ordered and grouped correctly for the client code:

In this case, you have:

Right now, the generated method names like createItemItemsPost don't look very clean:

...that's because the client generator uses the OpenAPI internal operation ID for each path operation.

OpenAPI requires that each operation ID is unique across all the path operations, so FastAPI uses the function name, the path, and the HTTP method/operation to generate that operation ID, because that way it can make sure that the operation IDs are unique.

But I'll show you how to improve that next. 🤓

You can modify the way these operation IDs are generated to make them simpler and have simpler method names in the clients.

In this case, you will have to ensure that each operation ID is unique in some other way.

For example, you could make sure that each path operation has a tag, and then generate the operation ID based on the tag and the path operation name (the function name).

FastAPI uses a unique ID for each path operation, which is used for the operation ID and also for the names of any needed custom models, for requests or responses.

You can customize that function. It takes an APIRoute and outputs a string.

For example, here it is using the first tag (you will probably have only one tag) and the path operation name (the function name).

You can then pass that custom function to FastAPI as the generate_unique_id_function parameter:

Now, if you generate the client again, you will see that it has the improved method names:

As you see, the method names now have the tag and then the function name, now they don't include information from the URL path and the HTTP operation.

The generated code still has some duplicated information.

We already know that this method is related to the items because that word is in the ItemsService (taken from the tag), but we still have the tag name prefixed in the method name too. 😕

We will probably still want to keep it for OpenAPI in general, as that will ensure that the operation IDs are unique.

But for the generated client, we could modify the OpenAPI operation IDs right before generating the clients, just to make those method names nicer and cleaner.

We could download the OpenAPI JSON to a file openapi.json and then we could remove that prefixed tag with a script like this:

With that, the operation IDs would be renamed from things like items-get_items to just get_items, that way the client generator can generate simpler method names.

Since the end result is now in an openapi.json file, you need to update your input location:

After generating the new client, you would now have clean method names, with all the autocompletion, inline errors, etc:

When using the automatically generated clients, you would get autocompletion for:

You would also have inline errors for everything.

And whenever you update the backend code, and regenerate the frontend, it would have any new path operations available as methods, the old ones removed, and any other change would be reflected on the generated code. 🤓

This also means that if something changed, it will be reflected on the client code automatically. And if you build the client, it will error out if you have any mismatch in the data used.

So, you would detect many errors very early in the development cycle instead of having to wait for the errors to show up to your final users in production and then trying to debug where the problem is. ✨

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float


class ResponseMessage(BaseModel):
    message: str


@app.post("/items/", response_model=ResponseMessage)
async def create_item(item: Item):
    return {"message": "item received"}


@app.get("/items/", response_model=list[Item])
async def get_items():
    return [
        {"name": "Plumbus", "price": 3},
        {"name": "Portal Gun", "price": 9001},
    ]
```

Example 2 (python):
```python
npx @hey-api/openapi-ts -i http://localhost:8000/openapi.json -o src/client
```

Example 3 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float


class ResponseMessage(BaseModel):
    message: str


class User(BaseModel):
    username: str
    email: str


@app.post("/items/", response_model=ResponseMessage, tags=["items"])
async def create_item(item: Item):
    return {"message": "Item received"}


@app.get("/items/", response_model=list[Item], tags=["items"])
async def get_items():
    return [
        {"name": "Plumbus", "price": 3},
        {"name": "Portal Gun", "price": 9001},
    ]


@app.post("/users/", response_model=ResponseMessage, tags=["users"])
async def create_user(user: User):
    return {"message": "User received"}
```

Example 4 (css):
```css
ItemsService.createItemItemsPost({name: "Plumbus", price: 5})
```

---

## Static Files - StaticFiles¶

**URL:** https://fastapi.tiangolo.com/reference/staticfiles/

**Contents:**
- Static Files - StaticFiles¶
- fastapi.staticfiles.StaticFiles ¶
  - directory instance-attribute ¶
  - packages instance-attribute ¶
  - all_directories instance-attribute ¶
  - html instance-attribute ¶
  - config_checked instance-attribute ¶
  - follow_symlink instance-attribute ¶
  - get_directories ¶
  - get_path ¶

You can use the StaticFiles class to serve static files, like JavaScript, CSS, images, etc.

Read more about it in the FastAPI docs for Static Files.

You can import it directly from fastapi.staticfiles:

Given directory and packages arguments, return a list of all the directories that should be used for serving static files from.

Given the ASGI scope, return the path string to serve up, with OS specific path separators, and any '..', '.' components removed.

Returns an HTTP response, given the incoming path, method and request headers.

Perform a one-off configuration check that StaticFiles is actually pointed at a directory, so that we can raise loud errors rather than just returning 404 responses.

Given the request and response headers, return True if an HTTP "Not Modified" response could be returned instead.

**Examples:**

Example 1 (sql):
```sql
from fastapi.staticfiles import StaticFiles
```

Example 2 (rust):
```rust
StaticFiles(
    *,
    directory=None,
    packages=None,
    html=False,
    check_dir=True,
    follow_symlink=False
)
```

Example 3 (python):
```python
def __init__(
    self,
    *,
    directory: PathLike | None = None,
    packages: list[str | tuple[str, str]] | None = None,
    html: bool = False,
    check_dir: bool = True,
    follow_symlink: bool = False,
) -> None:
    self.directory = directory
    self.packages = packages
    self.all_directories = self.get_directories(directory, packages)
    self.html = html
    self.config_checked = False
    self.follow_symlink = follow_symlink
    if check_dir and directory is not None and not os.path.isdir(directory):
        raise RuntimeError(f"Directory '{directory}' does not exist")
```

Example 4 (unknown):
```unknown
directory = directory
```

---

## Additional Responses in OpenAPI¶

**URL:** https://fastapi.tiangolo.com/advanced/additional-responses/

**Contents:**
- Additional Responses in OpenAPI¶
- Additional Response with model¶
- Additional media types for the main response¶
- Combining information¶
- Combine predefined responses and custom ones¶
- More information about OpenAPI responses¶

This is a rather advanced topic.

If you are starting with FastAPI, you might not need this.

You can declare additional responses, with additional status codes, media types, descriptions, etc.

Those additional responses will be included in the OpenAPI schema, so they will also appear in the API docs.

But for those additional responses you have to make sure you return a Response like JSONResponse directly, with your status code and content.

You can pass to your path operation decorators a parameter responses.

It receives a dict: the keys are status codes for each response (like 200), and the values are other dicts with the information for each of them.

Each of those response dicts can have a key model, containing a Pydantic model, just like response_model.

FastAPI will take that model, generate its JSON Schema and include it in the correct place in OpenAPI.

For example, to declare another response with a status code 404 and a Pydantic model Message, you can write:

Keep in mind that you have to return the JSONResponse directly.

The model key is not part of OpenAPI.

FastAPI will take the Pydantic model from there, generate the JSON Schema, and put it in the correct place.

The correct place is:

The generated responses in the OpenAPI for this path operation will be:

The schemas are referenced to another place inside the OpenAPI schema:

You can use this same responses parameter to add different media types for the same main response.

For example, you can add an additional media type of image/png, declaring that your path operation can return a JSON object (with media type application/json) or a PNG image:

Notice that you have to return the image using a FileResponse directly.

Unless you specify a different media type explicitly in your responses parameter, FastAPI will assume the response has the same media type as the main response class (default application/json).

But if you have specified a custom response class with None as its media type, FastAPI will use application/json for any additional response that has an associated model.

You can also combine response information from multiple places, including the response_model, status_code, and responses parameters.

You can declare a response_model, using the default status code 200 (or a custom one if you need), and then declare additional information for that same response in responses, directly in the OpenAPI schema.

FastAPI will keep the additional information from responses, and combine it with the JSON Schema from your model.

For example, you can declare a response with a status code 404 that uses a Pydantic model and has a custom description.

And a response with a status code 200 that uses your response_model, but includes a custom example:

It will all be combined and included in your OpenAPI, and shown in the API docs:

You might want to have some predefined responses that apply to many path operations, but you want to combine them with custom responses needed by each path operation.

For those cases, you can use the Python technique of "unpacking" a dict with **dict_to_unpack:

Here, new_dict will contain all the key-value pairs from old_dict plus the new key-value pair:

You can use that technique to reuse some predefined responses in your path operations and combine them with additional custom ones.

To see what exactly you can include in the responses, you can check these sections in the OpenAPI specification:

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class Item(BaseModel):
    id: str
    value: str


class Message(BaseModel):
    message: str


app = FastAPI()


@app.get("/items/{item_id}", response_model=Item, responses={404: {"model": Message}})
async def read_item(item_id: str):
    if item_id == "foo":
        return {"id": "foo", "value": "there goes my hero"}
    return JSONResponse(status_code=404, content={"message": "Item not found"})
```

Example 2 (json):
```json
{
    "responses": {
        "404": {
            "description": "Additional Response",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/Message"
                    }
                }
            }
        },
        "200": {
            "description": "Successful Response",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/Item"
                    }
                }
            }
        },
        "422": {
            "description": "Validation Error",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/HTTPValidationError"
                    }
                }
            }
        }
    }
}
```

Example 3 (json):
```json
{
    "components": {
        "schemas": {
            "Message": {
                "title": "Message",
                "required": [
                    "message"
                ],
                "type": "object",
                "properties": {
                    "message": {
                        "title": "Message",
                        "type": "string"
                    }
                }
            },
            "Item": {
                "title": "Item",
                "required": [
                    "id",
                    "value"
                ],
                "type": "object",
                "properties": {
                    "id": {
                        "title": "Id",
                        "type": "string"
                    },
                    "value": {
                        "title": "Value",
                        "type": "string"
                    }
                }
            },
            "ValidationError": {
                "title": "ValidationError",
                "required": [
                    "loc",
                    "msg",
                    "type"
                ],
                "type": "object",
                "properties": {
                    "loc": {
                        "title": "Location",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "msg": {
                        "title": "Message",
                        "type": "string"
                    },
                    "type": {
                        "title": "Error Type",
                        "type": "string"
                    }
                }
            },
            "HTTPValidationError": {
                "title": "HTTPValidationError",
                "type": "object",
                "properties": {
                    "detail": {
                        "title": "Detail",
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/ValidationError"
                        }
                    }
                }
            }
        }
    }
}
```

Example 4 (python):
```python
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel


class Item(BaseModel):
    id: str
    value: str


app = FastAPI()


@app.get(
    "/items/{item_id}",
    response_model=Item,
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Return the JSON item or an image.",
        }
    },
)
async def read_item(item_id: str, img: bool | None = None):
    if img:
        return FileResponse("image.png", media_type="image/png")
    else:
        return {"id": "foo", "value": "there goes my hero"}
```

---

## OpenAPI Callbacks¶

**URL:** https://fastapi.tiangolo.com/advanced/openapi-callbacks/

**Contents:**
- OpenAPI Callbacks¶
- An app with callbacks¶
- The normal FastAPI app¶
- Documenting the callback¶
- Write the callback documentation code¶
  - Create a callback APIRouter¶
  - Create the callback path operation¶
  - The callback path expression¶
  - Add the callback router¶
  - Check the docs¶

You could create an API with a path operation that could trigger a request to an external API created by someone else (probably the same developer that would be using your API).

The process that happens when your API app calls the external API is named a "callback". Because the software that the external developer wrote sends a request to your API and then your API calls back, sending a request to an external API (that was probably created by the same developer).

In this case, you could want to document how that external API should look like. What path operation it should have, what body it should expect, what response it should return, etc.

Let's see all this with an example.

Imagine you develop an app that allows creating invoices.

These invoices will have an id, title (optional), customer, and total.

The user of your API (an external developer) will create an invoice in your API with a POST request.

Then your API will (let's imagine):

Let's first see how the normal API app would look like before adding the callback.

It will have a path operation that will receive an Invoice body, and a query parameter callback_url that will contain the URL for the callback.

This part is pretty normal, most of the code is probably already familiar to you:

The callback_url query parameter uses a Pydantic Url type.

The only new thing is the callbacks=invoices_callback_router.routes as an argument to the path operation decorator. We'll see what that is next.

The actual callback code will depend heavily on your own API app.

And it will probably vary a lot from one app to the next.

It could be just one or two lines of code, like:

But possibly the most important part of the callback is making sure that your API user (the external developer) implements the external API correctly, according to the data that your API is going to send in the request body of the callback, etc.

So, what we will do next is add the code to document how that external API should look like to receive the callback from your API.

That documentation will show up in the Swagger UI at /docs in your API, and it will let external developers know how to build the external API.

This example doesn't implement the callback itself (that could be just a line of code), only the documentation part.

The actual callback is just an HTTP request.

When implementing the callback yourself, you could use something like HTTPX or Requests.

This code won't be executed in your app, we only need it to document how that external API should look like.

But, you already know how to easily create automatic documentation for an API with FastAPI.

So we are going to use that same knowledge to document how the external API should look like... by creating the path operation(s) that the external API should implement (the ones your API will call).

When writing the code to document a callback, it might be useful to imagine that you are that external developer. And that you are currently implementing the external API, not your API.

Temporarily adopting this point of view (of the external developer) can help you feel like it's more obvious where to put the parameters, the Pydantic model for the body, for the response, etc. for that external API.

First create a new APIRouter that will contain one or more callbacks.

To create the callback path operation use the same APIRouter you created above.

It should look just like a normal FastAPI path operation:

There are 2 main differences from a normal path operation:

The callback path can have an OpenAPI 3 expression that can contain parts of the original request sent to your API.

In this case, it's the str:

So, if your API user (the external developer) sends a request to your API to:

then your API will process the invoice, and at some point later, send a callback request to the callback_url (the external API):

with a JSON body containing something like:

and it would expect a response from that external API with a JSON body like:

Notice how the callback URL used contains the URL received as a query parameter in callback_url (https://www.external.org/events) and also the invoice id from inside of the JSON body (2expen51ve).

At this point you have the callback path operation(s) needed (the one(s) that the external developer should implement in the external API) in the callback router you created above.

Now use the parameter callbacks in your API's path operation decorator to pass the attribute .routes (that's actually just a list of routes/path operations) from that callback router:

Notice that you are not passing the router itself (invoices_callback_router) to callback=, but the attribute .routes, as in invoices_callback_router.routes.

Now you can start your app and go to http://127.0.0.1:8000/docs.

You will see your docs including a "Callbacks" section for your path operation that shows how the external API should look like:

**Examples:**

Example 1 (python):
```python
from fastapi import APIRouter, FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Invoice(BaseModel):
    id: str
    title: str | None = None
    customer: str
    total: float


class InvoiceEvent(BaseModel):
    description: str
    paid: bool


class InvoiceEventReceived(BaseModel):
    ok: bool


invoices_callback_router = APIRouter()


@invoices_callback_router.post(
    "{$callback_url}/invoices/{$request.body.id}", response_model=InvoiceEventReceived
)
def invoice_notification(body: InvoiceEvent):
    pass


@app.post("/invoices/", callbacks=invoices_callback_router.routes)
def create_invoice(invoice: Invoice, callback_url: HttpUrl | None = None):
    """
    Create an invoice.

    This will (let's imagine) let the API user (some external developer) create an
    invoice.

    And this path operation will:

    * Send the invoice to the client.
    * Collect the money from the client.
    * Send a notification back to the API user (the external developer), as a callback.
        * At this point is that the API will somehow send a POST request to the
            external API with the notification of the invoice event
            (e.g. "payment successful").
    """
    # Send the invoice, collect the money, send the notification (the callback)
    return {"msg": "Invoice received"}
```

Example 2 (python):
```python
from typing import Union

from fastapi import APIRouter, FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Invoice(BaseModel):
    id: str
    title: Union[str, None] = None
    customer: str
    total: float


class InvoiceEvent(BaseModel):
    description: str
    paid: bool


class InvoiceEventReceived(BaseModel):
    ok: bool


invoices_callback_router = APIRouter()


@invoices_callback_router.post(
    "{$callback_url}/invoices/{$request.body.id}", response_model=InvoiceEventReceived
)
def invoice_notification(body: InvoiceEvent):
    pass


@app.post("/invoices/", callbacks=invoices_callback_router.routes)
def create_invoice(invoice: Invoice, callback_url: Union[HttpUrl, None] = None):
    """
    Create an invoice.

    This will (let's imagine) let the API user (some external developer) create an
    invoice.

    And this path operation will:

    * Send the invoice to the client.
    * Collect the money from the client.
    * Send a notification back to the API user (the external developer), as a callback.
        * At this point is that the API will somehow send a POST request to the
            external API with the notification of the invoice event
            (e.g. "payment successful").
    """
    # Send the invoice, collect the money, send the notification (the callback)
    return {"msg": "Invoice received"}
```

Example 3 (json):
```json
callback_url = "https://example.com/api/v1/invoices/events/"
httpx.post(callback_url, json={"description": "Invoice paid", "paid": True})
```

Example 4 (python):
```python
from fastapi import APIRouter, FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()


class Invoice(BaseModel):
    id: str
    title: str | None = None
    customer: str
    total: float


class InvoiceEvent(BaseModel):
    description: str
    paid: bool


class InvoiceEventReceived(BaseModel):
    ok: bool


invoices_callback_router = APIRouter()


@invoices_callback_router.post(
    "{$callback_url}/invoices/{$request.body.id}", response_model=InvoiceEventReceived
)
def invoice_notification(body: InvoiceEvent):
    pass


@app.post("/invoices/", callbacks=invoices_callback_router.routes)
def create_invoice(invoice: Invoice, callback_url: HttpUrl | None = None):
    """
    Create an invoice.

    This will (let's imagine) let the API user (some external developer) create an
    invoice.

    And this path operation will:

    * Send the invoice to the client.
    * Collect the money from the client.
    * Send a notification back to the API user (the external developer), as a callback.
        * At this point is that the API will somehow send a POST request to the
            external API with the notification of the invoice event
            (e.g. "payment successful").
    """
    # Send the invoice, collect the money, send the notification (the callback)
    return {"msg": "Invoice received"}
```

---

## Test Client - TestClient¶

**URL:** https://fastapi.tiangolo.com/reference/testclient/

**Contents:**
- Test Client - TestClient¶
- fastapi.testclient.TestClient ¶
  - headers property writable ¶
  - follow_redirects instance-attribute ¶
  - max_redirects instance-attribute ¶
  - is_closed property ¶
  - trust_env property ¶
  - timeout property writable ¶
  - event_hooks property writable ¶
  - auth property writable ¶

You can use the TestClient class to test FastAPI applications without creating an actual HTTP and socket connection, just communicating directly with the FastAPI code.

Read more about it in the FastAPI docs for Testing.

You can import it directly from fastapi.testclient:

HTTP headers to include when sending requests.

Check if the client being closed

Authentication class used when none is passed at the request-level.

See also Authentication.

Base URL to use when sending requests with relative URLs.

Cookie values to include when sending requests.

Query parameters to include in the URL when sending requests.

Build and return a request instance.

See also: Request instances

Alternative to httpx.request() that streams the response body instead of loading it into memory at once.

Parameters: See httpx.request.

See also: Streaming Responses

The request is sent as-is, unmodified.

Typically you'll want to build one with Client.build_request() so that any client-level configuration is merged into the request, but passing an explicit httpx.Request() is supported as well.

See also: Request instances

Close transport and proxies.

**Examples:**

Example 1 (sql):
```sql
from fastapi.testclient import TestClient
```

Example 2 (rust):
```rust
TestClient(
    app,
    base_url="http://testserver",
    raise_server_exceptions=True,
    root_path="",
    backend="asyncio",
    backend_options=None,
    cookies=None,
    headers=None,
    follow_redirects=True,
    client=("testclient", 50000),
)
```

Example 3 (python):
```python
def __init__(
    self,
    app: ASGIApp,
    base_url: str = "http://testserver",
    raise_server_exceptions: bool = True,
    root_path: str = "",
    backend: Literal["asyncio", "trio"] = "asyncio",
    backend_options: dict[str, Any] | None = None,
    cookies: httpx._types.CookieTypes | None = None,
    headers: dict[str, str] | None = None,
    follow_redirects: bool = True,
    client: tuple[str, int] = ("testclient", 50000),
) -> None:
    self.async_backend = _AsyncBackend(backend=backend, backend_options=backend_options or {})
    if _is_asgi3(app):
        asgi_app = app
    else:
        app = cast(ASGI2App, app)  # type: ignore[assignment]
        asgi_app = _WrapASGI2(app)  # type: ignore[arg-type]
    self.app = asgi_app
    self.app_state: dict[str, Any] = {}
    transport = _TestClientTransport(
        self.app,
        portal_factory=self._portal_factory,
        raise_server_exceptions=raise_server_exceptions,
        root_path=root_path,
        app_state=self.app_state,
        client=client,
    )
    if headers is None:
        headers = {}
    headers.setdefault("user-agent", "testclient")
    super().__init__(
        base_url=base_url,
        headers=headers,
        transport=transport,
        follow_redirects=follow_redirects,
        cookies=cookies,
    )
```

Example 4 (unknown):
```unknown
follow_redirects = follow_redirects
```

---

## Testing WebSockets¶

**URL:** https://fastapi.tiangolo.com/advanced/testing-websockets/

**Contents:**
- Testing WebSockets¶

You can use the same TestClient to test WebSockets.

For this, you use the TestClient in a with statement, connecting to the WebSocket:

For more details, check Starlette's documentation for testing WebSockets.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket

app = FastAPI()


@app.get("/")
async def read_main():
    return {"msg": "Hello World"}


@app.websocket("/ws")
async def websocket(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"msg": "Hello WebSocket"})
    await websocket.close()


def test_read_main():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}


def test_websocket():
    client = TestClient(app)
    with client.websocket_connect("/ws") as websocket:
        data = websocket.receive_json()
        assert data == {"msg": "Hello WebSocket"}
```

---

## Using Dataclasses¶

**URL:** https://fastapi.tiangolo.com/advanced/dataclasses/

**Contents:**
- Using Dataclasses¶
- Dataclasses in response_model¶
- Dataclasses in Nested Data Structures¶
- Learn More¶
- Version¶

FastAPI is built on top of Pydantic, and I have been showing you how to use Pydantic models to declare requests and responses.

But FastAPI also supports using dataclasses the same way:

This is still supported thanks to Pydantic, as it has internal support for dataclasses.

So, even with the code above that doesn't use Pydantic explicitly, FastAPI is using Pydantic to convert those standard dataclasses to Pydantic's own flavor of dataclasses.

And of course, it supports the same:

This works the same way as with Pydantic models. And it is actually achieved in the same way underneath, using Pydantic.

Keep in mind that dataclasses can't do everything Pydantic models can do.

So, you might still need to use Pydantic models.

But if you have a bunch of dataclasses laying around, this is a nice trick to use them to power a web API using FastAPI. 🤓

You can also use dataclasses in the response_model parameter:

The dataclass will be automatically converted to a Pydantic dataclass.

This way, its schema will show up in the API docs user interface:

You can also combine dataclasses with other type annotations to make nested data structures.

In some cases, you might still have to use Pydantic's version of dataclasses. For example, if you have errors with the automatically generated API documentation.

In that case, you can simply swap the standard dataclasses with pydantic.dataclasses, which is a drop-in replacement:

We still import field from standard dataclasses.

pydantic.dataclasses is a drop-in replacement for dataclasses.

The Author dataclass includes a list of Item dataclasses.

The Author dataclass is used as the response_model parameter.

You can use other standard type annotations with dataclasses as the request body.

In this case, it's a list of Item dataclasses.

Here we are returning a dictionary that contains items which is a list of dataclasses.

FastAPI is still capable of serializing the data to JSON.

Here the response_model is using a type annotation of a list of Author dataclasses.

Again, you can combine dataclasses with standard type annotations.

Notice that this path operation function uses regular def instead of async def.

As always, in FastAPI you can combine def and async def as needed.

If you need a refresher about when to use which, check out the section "In a hurry?" in the docs about async and await.

This path operation function is not returning dataclasses (although it could), but a list of dictionaries with internal data.

FastAPI will use the response_model parameter (that includes dataclasses) to convert the response.

You can combine dataclasses with other type annotations in many different combinations to form complex data structures.

Check the in-code annotation tips above to see more specific details.

You can also combine dataclasses with other Pydantic models, inherit from them, include them in your own models, etc.

To learn more, check the Pydantic docs about dataclasses.

This is available since FastAPI version 0.67.0. 🔖

**Examples:**

Example 1 (python):
```python
from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class Item:
    name: str
    price: float
    description: str | None = None
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 2 (python):
```python
from dataclasses import dataclass
from typing import Union

from fastapi import FastAPI


@dataclass
class Item:
    name: str
    price: float
    description: Union[str, None] = None
    tax: Union[float, None] = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 3 (python):
```python
from dataclasses import dataclass, field

from fastapi import FastAPI


@dataclass
class Item:
    name: str
    price: float
    tags: list[str] = field(default_factory=list)
    description: str | None = None
    tax: float | None = None


app = FastAPI()


@app.get("/items/next", response_model=Item)
async def read_next_item():
    return {
        "name": "Island In The Moon",
        "price": 12.99,
        "description": "A place to be playin' and havin' fun",
        "tags": ["breater"],
    }
```

Example 4 (python):
```python
from dataclasses import dataclass, field
from typing import Union

from fastapi import FastAPI


@dataclass
class Item:
    name: str
    price: float
    tags: list[str] = field(default_factory=list)
    description: Union[str, None] = None
    tax: Union[float, None] = None


app = FastAPI()


@app.get("/items/next", response_model=Item)
async def read_next_item():
    return {
        "name": "Island In The Moon",
        "price": 12.99,
        "description": "A place to be playin' and havin' fun",
        "tags": ["breater"],
    }
```

---

## Custom Response - HTML, Stream, File, others¶

**URL:** https://fastapi.tiangolo.com/advanced/custom-response/

**Contents:**
- Custom Response - HTML, Stream, File, others¶
- Use ORJSONResponse¶
- HTML Response¶
  - Return a Response¶
  - Document in OpenAPI and override Response¶
    - Return an HTMLResponse directly¶
- Available responses¶
  - Response¶
  - HTMLResponse¶
  - PlainTextResponse¶

By default, FastAPI will return the responses using JSONResponse.

You can override it by returning a Response directly as seen in Return a Response directly.

But if you return a Response directly (or any subclass, like JSONResponse), the data won't be automatically converted (even if you declare a response_model), and the documentation won't be automatically generated (for example, including the specific "media type", in the HTTP header Content-Type as part of the generated OpenAPI).

But you can also declare the Response that you want to be used (e.g. any Response subclass), in the path operation decorator using the response_class parameter.

The contents that you return from your path operation function will be put inside of that Response.

And if that Response has a JSON media type (application/json), like is the case with the JSONResponse and UJSONResponse, the data you return will be automatically converted (and filtered) with any Pydantic response_model that you declared in the path operation decorator.

If you use a response class with no media type, FastAPI will expect your response to have no content, so it will not document the response format in its generated OpenAPI docs.

For example, if you are squeezing performance, you can install and use orjson and set the response to be ORJSONResponse.

Import the Response class (sub-class) you want to use and declare it in the path operation decorator.

For large responses, returning a Response directly is much faster than returning a dictionary.

This is because by default, FastAPI will inspect every item inside and make sure it is serializable as JSON, using the same JSON Compatible Encoder explained in the tutorial. This is what allows you to return arbitrary objects, for example database models.

But if you are certain that the content that you are returning is serializable with JSON, you can pass it directly to the response class and avoid the extra overhead that FastAPI would have by passing your return content through the jsonable_encoder before passing it to the response class.

The parameter response_class will also be used to define the "media type" of the response.

In this case, the HTTP header Content-Type will be set to application/json.

And it will be documented as such in OpenAPI.

The ORJSONResponse is only available in FastAPI, not in Starlette.

To return a response with HTML directly from FastAPI, use HTMLResponse.

The parameter response_class will also be used to define the "media type" of the response.

In this case, the HTTP header Content-Type will be set to text/html.

And it will be documented as such in OpenAPI.

As seen in Return a Response directly, you can also override the response directly in your path operation, by returning it.

The same example from above, returning an HTMLResponse, could look like:

A Response returned directly by your path operation function won't be documented in OpenAPI (for example, the Content-Type won't be documented) and won't be visible in the automatic interactive docs.

Of course, the actual Content-Type header, status code, etc, will come from the Response object you returned.

If you want to override the response from inside of the function but at the same time document the "media type" in OpenAPI, you can use the response_class parameter AND return a Response object.

The response_class will then be used only to document the OpenAPI path operation, but your Response will be used as is.

For example, it could be something like:

In this example, the function generate_html_response() already generates and returns a Response instead of returning the HTML in a str.

By returning the result of calling generate_html_response(), you are already returning a Response that will override the default FastAPI behavior.

But as you passed the HTMLResponse in the response_class too, FastAPI will know how to document it in OpenAPI and the interactive docs as HTML with text/html:

Here are some of the available responses.

Keep in mind that you can use Response to return anything else, or even create a custom sub-class.

You could also use from starlette.responses import HTMLResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

The main Response class, all the other responses inherit from it.

You can return it directly.

It accepts the following parameters:

FastAPI (actually Starlette) will automatically include a Content-Length header. It will also include a Content-Type header, based on the media_type and appending a charset for text types.

Takes some text or bytes and returns an HTML response, as you read above.

Takes some text or bytes and returns a plain text response.

Takes some data and returns an application/json encoded response.

This is the default response used in FastAPI, as you read above.

A fast alternative JSON response using orjson, as you read above.

This requires installing orjson for example with pip install orjson.

An alternative JSON response using ujson.

This requires installing ujson for example with pip install ujson.

ujson is less careful than Python's built-in implementation in how it handles some edge-cases.

It's possible that ORJSONResponse might be a faster alternative.

Returns an HTTP redirect. Uses a 307 status code (Temporary Redirect) by default.

You can return a RedirectResponse directly:

Or you can use it in the response_class parameter:

If you do that, then you can return the URL directly from your path operation function.

In this case, the status_code used will be the default one for the RedirectResponse, which is 307.

You can also use the status_code parameter combined with the response_class parameter:

Takes an async generator or a normal generator/iterator and streams the response body.

If you have a file-like object (e.g. the object returned by open()), you can create a generator function to iterate over that file-like object.

That way, you don't have to read it all first in memory, and you can pass that generator function to the StreamingResponse, and return it.

This includes many libraries to interact with cloud storage, video processing, and others.

This yield from tells the function to iterate over that thing named file_like. And then, for each part iterated, yield that part as coming from this generator function (iterfile).

So, it is a generator function that transfers the "generating" work to something else internally.

By doing it this way, we can put it in a with block, and that way, ensure that the file-like object is closed after finishing.

Notice that here as we are using standard open() that doesn't support async and await, we declare the path operation with normal def.

Asynchronously streams a file as the response.

Takes a different set of arguments to instantiate than the other response types:

File responses will include appropriate Content-Length, Last-Modified and ETag headers.

You can also use the response_class parameter:

In this case, you can return the file path directly from your path operation function.

You can create your own custom response class, inheriting from Response and using it.

For example, let's say that you want to use orjson, but with some custom settings not used in the included ORJSONResponse class.

Let's say you want it to return indented and formatted JSON, so you want to use the orjson option orjson.OPT_INDENT_2.

You could create a CustomORJSONResponse. The main thing you have to do is create a Response.render(content) method that returns the content as bytes:

Now instead of returning:

...this response will return:

Of course, you will probably find much better ways to take advantage of this than formatting JSON. 😉

When creating a FastAPI class instance or an APIRouter you can specify which response class to use by default.

The parameter that defines this is default_response_class.

In the example below, FastAPI will use ORJSONResponse by default, in all path operations, instead of JSONResponse.

You can still override response_class in path operations as before.

You can also declare the media type and many other details in OpenAPI using responses: Additional Responses in OpenAPI.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

app = FastAPI()


@app.get("/items/", response_class=ORJSONResponse)
async def read_items():
    return ORJSONResponse([{"item_id": "Foo"}])
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/items/", response_class=HTMLResponse)
async def read_items():
    return """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """
```

Example 3 (python):
```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/items/")
async def read_items():
    html_content = """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)
```

Example 4 (python):
```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


def generate_html_response():
    html_content = """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/items/", response_class=HTMLResponse)
async def read_items():
    return generate_html_response()
```

---

## Exceptions - HTTPException and WebSocketException¶

**URL:** https://fastapi.tiangolo.com/reference/exceptions/

**Contents:**
- Exceptions - HTTPException and WebSocketException¶
- fastapi.HTTPException ¶
    - Example¶
  - status_code instance-attribute ¶
  - detail instance-attribute ¶
  - headers instance-attribute ¶
- fastapi.WebSocketException ¶
    - Example¶
  - code instance-attribute ¶
  - reason instance-attribute ¶

These are the exceptions that you can raise to show errors to the client.

When you raise an exception, as would happen with normal Python, the rest of the execution is aborted. This way you can raise these exceptions from anywhere in the code to abort a request and show the error to the client.

These exceptions can be imported directly from fastapi:

An HTTP exception you can raise in your own code to show errors to the client.

This is for client errors, invalid authentication, invalid data, etc. Not for server errors in your code.

Read more about it in the FastAPI docs for Handling Errors.

HTTP status code to send to the client.

Any data to be sent to the client in the detail key of the JSON response.

TYPE: Any DEFAULT: None

Any headers to send to the client in the response.

TYPE: Optional[dict[str, str]] DEFAULT: None

Bases: WebSocketException

A WebSocket exception you can raise in your own code to show errors to the client.

This is for client errors, invalid authentication, invalid data, etc. Not for server errors in your code.

Read more about it in the FastAPI docs for WebSockets.

A closing code from the valid codes defined in the specification.

The reason to close the WebSocket connection.

It is UTF-8-encoded data. The interpretation of the reason is up to the application, it is not specified by the WebSocket specification.

It could contain text that could be human-readable or interpretable by the client code, etc.

TYPE: Union[str, None] DEFAULT: None

**Examples:**

Example 1 (python):
```python
from fastapi import HTTPException, WebSocketException
```

Example 2 (rust):
```rust
HTTPException(status_code, detail=None, headers=None)
```

Example 3 (python):
```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

items = {"foo": "The Foo Wrestlers"}


@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

Example 4 (python):
```python
def __init__(
    self,
    status_code: Annotated[
        int,
        Doc(
            """
            HTTP status code to send to the client.
            """
        ),
    ],
    detail: Annotated[
        Any,
        Doc(
            """
            Any data to be sent to the client in the `detail` key of the JSON
            response.
            """
        ),
    ] = None,
    headers: Annotated[
        Optional[dict[str, str]],
        Doc(
            """
            Any headers to send to the client in the response.
            """
        ),
    ] = None,
) -> None:
    super().__init__(status_code=status_code, detail=detail, headers=headers)
```

---

## WebSockets¶

**URL:** https://fastapi.tiangolo.com/advanced/websockets/

**Contents:**
- WebSockets¶
- Install websockets¶
- WebSockets client¶
  - In production¶
- Create a websocket¶
- Await for messages and send messages¶
- Try it¶
- Using Depends and others¶
  - Try the WebSockets with dependencies¶
- Handling disconnections and multiple clients¶

You can use WebSockets with FastAPI.

Make sure you create a virtual environment, activate it, and install websockets (a Python library that makes it easy to use the "WebSocket" protocol):

In your production system, you probably have a frontend created with a modern framework like React, Vue.js or Angular.

And to communicate using WebSockets with your backend you would probably use your frontend's utilities.

Or you might have a native mobile application that communicates with your WebSocket backend directly, in native code.

Or you might have any other way to communicate with the WebSocket endpoint.

But for this example, we'll use a very simple HTML document with some JavaScript, all inside a long string.

This, of course, is not optimal and you wouldn't use it for production.

In production you would have one of the options above.

But it's the simplest way to focus on the server-side of WebSockets and have a working example:

In your FastAPI application, create a websocket:

You could also use from starlette.websockets import WebSocket.

FastAPI provides the same WebSocket directly just as a convenience for you, the developer. But it comes directly from Starlette.

In your WebSocket route you can await for messages and send messages.

You can receive and send binary, text, and JSON data.

If your file is named main.py, run your application with:

Open your browser at http://127.0.0.1:8000.

You will see a simple page like:

You can type messages in the input box, and send them:

And your FastAPI application with WebSockets will respond back:

You can send (and receive) many messages:

And all of them will use the same WebSocket connection.

In WebSocket endpoints you can import from fastapi and use:

They work the same way as for other FastAPI endpoints/path operations:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

As this is a WebSocket it doesn't really make sense to raise an HTTPException, instead we raise a WebSocketException.

You can use a closing code from the valid codes defined in the specification.

If your file is named main.py, run your application with:

Open your browser at http://127.0.0.1:8000.

Notice that the query token will be handled by a dependency.

With that you can connect the WebSocket and then send and receive messages:

When a WebSocket connection is closed, the await websocket.receive_text() will raise a WebSocketDisconnect exception, which you can then catch and handle like in this example.

That will raise the WebSocketDisconnect exception, and all the other clients will receive a message like:

The app above is a minimal and simple example to demonstrate how to handle and broadcast messages to several WebSocket connections.

But keep in mind that, as everything is handled in memory, in a single list, it will only work while the process is running, and will only work with a single process.

If you need something easy to integrate with FastAPI but that is more robust, supported by Redis, PostgreSQL or others, check encode/broadcaster.

To learn more about the options, check Starlette's documentation for:

**Examples:**

Example 1 (php):
```php
$ pip install websockets

---> 100%
```

Example 2 (python):
```python
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

Example 3 (python):
```python
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

Example 4 (python):
```python
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

---

## Advanced User Guide¶

**URL:** https://fastapi.tiangolo.com/advanced/

**Contents:**
- Advanced User Guide¶
- Additional Features¶
- Read the Tutorial first¶

The main Tutorial - User Guide should be enough to give you a tour through all the main features of FastAPI.

In the next sections you will see other options, configurations, and additional features.

The next sections are not necessarily "advanced".

And it's possible that for your use case, the solution is in one of them.

You could still use most of the features in FastAPI with the knowledge from the main Tutorial - User Guide.

And the next sections assume you already read it, and assume that you know those main ideas.

---

## OpenAPI models¶

**URL:** https://fastapi.tiangolo.com/reference/openapi/models/

**Contents:**
- OpenAPI models¶
- fastapi.openapi.models ¶
  - SchemaType module-attribute ¶
  - SchemaOrBool module-attribute ¶
  - SecurityScheme module-attribute ¶
  - BaseModelWithConfig ¶
    - model_config class-attribute instance-attribute ¶
  - Contact ¶
    - name class-attribute instance-attribute ¶
    - url class-attribute instance-attribute ¶

OpenAPI Pydantic models used to generate and validate the generated OpenAPI.

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

Bases: BaseModelWithConfig

**Examples:**

Example 1 (unknown):
```unknown
SchemaType = Literal[
    "array",
    "boolean",
    "integer",
    "null",
    "number",
    "object",
    "string",
]
```

Example 2 (unknown):
```unknown
SchemaOrBool = Union[Schema, bool]
```

Example 3 (unknown):
```unknown
SecurityScheme = Union[
    APIKey, HTTPBase, OAuth2, OpenIdConnect, HTTPBearer
]
```

Example 4 (unknown):
```unknown
model_config = {'extra': 'allow'}
```

---

## Testing Events: lifespan and startup - shutdown¶

**URL:** https://fastapi.tiangolo.com/advanced/testing-events/

**Contents:**
- Testing Events: lifespan and startup - shutdown¶

When you need lifespan to run in your tests, you can use the TestClient with a with statement:

You can read more details about the "Running lifespan in tests in the official Starlette documentation site."

For the deprecated startup and shutdown events, you can use the TestClient as follows:

**Examples:**

Example 1 (python):
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.testclient import TestClient

items = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    items["foo"] = {"name": "Fighters"}
    items["bar"] = {"name": "Tenders"}
    yield
    # clean up items
    items.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/items/{item_id}")
async def read_items(item_id: str):
    return items[item_id]


def test_read_items():
    # Before the lifespan starts, "items" is still empty
    assert items == {}

    with TestClient(app) as client:
        # Inside the "with TestClient" block, the lifespan starts and items added
        assert items == {"foo": {"name": "Fighters"}, "bar": {"name": "Tenders"}}

        response = client.get("/items/foo")
        assert response.status_code == 200
        assert response.json() == {"name": "Fighters"}

        # After the requests is done, the items are still there
        assert items == {"foo": {"name": "Fighters"}, "bar": {"name": "Tenders"}}

    # The end of the "with TestClient" block simulates terminating the app, so
    # the lifespan ends and items are cleaned up
    assert items == {}
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

items = {}


@app.on_event("startup")
async def startup_event():
    items["foo"] = {"name": "Fighters"}
    items["bar"] = {"name": "Tenders"}


@app.get("/items/{item_id}")
async def read_items(item_id: str):
    return items[item_id]


def test_read_items():
    with TestClient(app) as client:
        response = client.get("/items/foo")
        assert response.status_code == 200
        assert response.json() == {"name": "Fighters"}
```

---
