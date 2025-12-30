# Fastapi - Getting Started

**Pages:** 48

---

## Cookie Parameter Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/cookie-param-models/

**Contents:**
- Cookie Parameter Models¶
- Cookies with a Pydantic Model¶
- Check the Docs¶
- Forbid Extra Cookies¶
- Summary¶

If you have a group of cookies that are related, you can create a Pydantic model to declare them. 🍪

This would allow you to re-use the model in multiple places and also to declare validations and metadata for all the parameters at once. 😎

This is supported since FastAPI version 0.115.0. 🤓

This same technique applies to Query, Cookie, and Header. 😎

Declare the cookie parameters that you need in a Pydantic model, and then declare the parameter as Cookie:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI will extract the data for each field from the cookies received in the request and give you the Pydantic model you defined.

You can see the defined cookies in the docs UI at /docs:

Have in mind that, as browsers handle cookies in special ways and behind the scenes, they don't easily allow JavaScript to touch them.

If you go to the API docs UI at /docs you will be able to see the documentation for cookies for your path operations.

But even if you fill the data and click "Execute", because the docs UI works with JavaScript, the cookies won't be sent, and you will see an error message as if you didn't write any values.

In some special use cases (probably not very common), you might want to restrict the cookies that you want to receive.

Your API now has the power to control its own cookie consent. 🤪🍪

You can use Pydantic's model configuration to forbid any extra fields:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

If a client tries to send some extra cookies, they will receive an error response.

Poor cookie banners with all their effort to get your consent for the API to reject it. 🍪

For example, if the client tries to send a santa_tracker cookie with a value of good-list-please, the client will receive an error response telling them that the santa_tracker cookie is not allowed:

You can use Pydantic models to declare cookies in FastAPI. 😎

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None


@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None


@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

Example 3 (python):
```python
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None


@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

Example 4 (python):
```python
from typing import Union

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: Union[str, None] = None
    googall_tracker: Union[str, None] = None


@app.get("/items/")
async def read_items(cookies: Cookies = Cookie()):
    return cookies
```

---

## First Steps¶

**URL:** https://fastapi.tiangolo.com/tutorial/first-steps/

**Contents:**
- First Steps¶
  - Check it¶
  - Interactive API docs¶
  - Alternative API docs¶
  - OpenAPI¶
    - "Schema"¶
    - API "schema"¶
    - Data "schema"¶
    - OpenAPI and JSON Schema¶
    - Check the openapi.json¶

The simplest FastAPI file could look like this:

Copy that to a file main.py.

In the output, there's a line with something like:

That line shows the URL where your app is being served, in your local machine.

Open your browser at http://127.0.0.1:8000.

You will see the JSON response as:

Now go to http://127.0.0.1:8000/docs.

You will see the automatic interactive API documentation (provided by Swagger UI):

And now, go to http://127.0.0.1:8000/redoc.

You will see the alternative automatic documentation (provided by ReDoc):

FastAPI generates a "schema" with all your API using the OpenAPI standard for defining APIs.

A "schema" is a definition or description of something. Not the code that implements it, but just an abstract description.

In this case, OpenAPI is a specification that dictates how to define a schema of your API.

This schema definition includes your API paths, the possible parameters they take, etc.

The term "schema" might also refer to the shape of some data, like a JSON content.

In that case, it would mean the JSON attributes, and data types they have, etc.

OpenAPI defines an API schema for your API. And that schema includes definitions (or "schemas") of the data sent and received by your API using JSON Schema, the standard for JSON data schemas.

If you are curious about how the raw OpenAPI schema looks like, FastAPI automatically generates a JSON (schema) with the descriptions of all your API.

You can see it directly at: http://127.0.0.1:8000/openapi.json.

It will show a JSON starting with something like:

The OpenAPI schema is what powers the two interactive documentation systems included.

And there are dozens of alternatives, all based on OpenAPI. You could easily add any of those alternatives to your application built with FastAPI.

You could also use it to generate code automatically, for clients that communicate with your API. For example, frontend, mobile or IoT applications.

You can optionally deploy your FastAPI app to FastAPI Cloud, go and join the waiting list if you haven't. 🚀

If you already have a FastAPI Cloud account (we invited you from the waiting list 😉), you can deploy your application with one command.

Before deploying, make sure you are logged in:

Then deploy your app:

That's it! Now you can access your app at that URL. ✨

FastAPI is a Python class that provides all the functionality for your API.

FastAPI is a class that inherits directly from Starlette.

You can use all the Starlette functionality with FastAPI too.

Here the app variable will be an "instance" of the class FastAPI.

This will be the main point of interaction to create all your API.

"Path" here refers to the last part of the URL starting from the first /.

...the path would be:

A "path" is also commonly called an "endpoint" or a "route".

While building an API, the "path" is the main way to separate "concerns" and "resources".

"Operation" here refers to one of the HTTP "methods".

...and the more exotic ones:

In the HTTP protocol, you can communicate to each path using one (or more) of these "methods".

When building APIs, you normally use these specific HTTP methods to perform a specific action.

So, in OpenAPI, each of the HTTP methods is called an "operation".

We are going to call them "operations" too.

The @app.get("/") tells FastAPI that the function right below is in charge of handling requests that go to:

That @something syntax in Python is called a "decorator".

You put it on top of a function. Like a pretty decorative hat (I guess that's where the term came from).

A "decorator" takes the function below and does something with it.

In our case, this decorator tells FastAPI that the function below corresponds to the path / with an operation get.

It is the "path operation decorator".

You can also use the other operations:

And the more exotic ones:

You are free to use each operation (HTTP method) as you wish.

FastAPI doesn't enforce any specific meaning.

The information here is presented as a guideline, not a requirement.

For example, when using GraphQL you normally perform all the actions using only POST operations.

This is our "path operation function":

This is a Python function.

It will be called by FastAPI whenever it receives a request to the URL "/" using a GET operation.

In this case, it is an async function.

You could also define it as a normal function instead of async def:

If you don't know the difference, check the Async: "In a hurry?".

You can return a dict, list, singular values as str, int, etc.

You can also return Pydantic models (you'll see more about that later).

There are many other objects and models that will be automatically converted to JSON (including ORMs, etc). Try using your favorite ones, it's highly probable that they are already supported.

Deploy your app to FastAPI Cloud with one command: fastapi deploy. 🎉

FastAPI Cloud is built by the same author and team behind FastAPI.

It streamlines the process of building, deploying, and accessing an API with minimal effort.

It brings the same developer experience of building apps with FastAPI to deploying them to the cloud. 🎉

FastAPI Cloud is the primary sponsor and funding provider for the FastAPI and friends open source projects. ✨

FastAPI is open source and based on standards. You can deploy FastAPI apps to any cloud provider you choose.

Follow your cloud provider's guides to deploy FastAPI apps with them. 🤓

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
```

Example 2 (julia):
```julia
$ <font color="#4E9A06">fastapi</font> dev <u style="text-decoration-style:solid">main.py</u>

  <span style="background-color:#009485"><font color="#D3D7CF"> FastAPI </font></span>  Starting development server 🚀

             Searching for package file structure from directories
             with <font color="#3465A4">__init__.py</font> files
             Importing from <font color="#75507B">/home/user/code/</font><font color="#AD7FA8">awesomeapp</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> module </font></span>  🐍 main.py

     <span style="background-color:#007166"><font color="#D3D7CF"> code </font></span>  Importing the FastAPI app object from the module with
             the following code:

             <u style="text-decoration-style:solid">from </u><u style="text-decoration-style:solid"><b>main</b></u><u style="text-decoration-style:solid"> import </u><u style="text-decoration-style:solid"><b>app</b></u>

      <span style="background-color:#007166"><font color="#D3D7CF"> app </font></span>  Using import string: <font color="#3465A4">main:app</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Server started at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font>
   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Documentation at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000/docs</u></font>

      <span style="background-color:#007166"><font color="#D3D7CF"> tip </font></span>  Running in development mode, for production use:
             <b>fastapi run</b>

             Logs:

     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Will watch for changes in these directories:
             <b>[</b><font color="#4E9A06">&apos;/home/user/code/awesomeapp&apos;</font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Uvicorn running on <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font> <b>(</b>Press CTRL+C
             to quit<b>)</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started reloader process <b>[</b><font color="#34E2E2"><b>383138</b></font><b>]</b> using WatchFiles
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started server process <b>[</b><font color="#34E2E2"><b>383153</b></font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Waiting for application startup.
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Application startup complete.
```

Example 3 (yaml):
```yaml
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Example 4 (json):
```json
{"message": "Hello World"}
```

---

## Dependencies with yield¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/

**Contents:**
- Dependencies with yield¶
- A database dependency with yield¶
- A dependency with yield and try¶
- Sub-dependencies with yield¶
- Dependencies with yield and HTTPException¶
- Dependencies with yield and except¶
  - Always raise in Dependencies with yield and except¶
- Execution of dependencies with yield¶
- Early exit and scope¶
  - scope for sub-dependencies¶

FastAPI supports dependencies that do some extra steps after finishing.

To do this, use yield instead of return, and write the extra steps (code) after.

Make sure to use yield one single time per dependency.

Any function that is valid to use with:

would be valid to use as a FastAPI dependency.

In fact, FastAPI uses those two decorators internally.

For example, you could use this to create a database session and close it after finishing.

Only the code prior to and including the yield statement is executed before creating a response:

The yielded value is what is injected into path operations and other dependencies:

The code following the yield statement is executed after the response:

You can use async or regular functions.

FastAPI will do the right thing with each, the same as with normal dependencies.

If you use a try block in a dependency with yield, you'll receive any exception that was thrown when using the dependency.

For example, if some code at some point in the middle, in another dependency or in a path operation, made a database transaction "rollback" or created any other exception, you would receive the exception in your dependency.

So, you can look for that specific exception inside the dependency with except SomeException.

In the same way, you can use finally to make sure the exit steps are executed, no matter if there was an exception or not.

You can have sub-dependencies and "trees" of sub-dependencies of any size and shape, and any or all of them can use yield.

FastAPI will make sure that the "exit code" in each dependency with yield is run in the correct order.

For example, dependency_c can have a dependency on dependency_b, and dependency_b on dependency_a:

Prefer to use the Annotated version if possible.

And all of them can use yield.

In this case dependency_c, to execute its exit code, needs the value from dependency_b (here named dep_b) to still be available.

And, in turn, dependency_b needs the value from dependency_a (here named dep_a) to be available for its exit code.

Prefer to use the Annotated version if possible.

The same way, you could have some dependencies with yield and some other dependencies with return, and have some of those depend on some of the others.

And you could have a single dependency that requires several other dependencies with yield, etc.

You can have any combinations of dependencies that you want.

FastAPI will make sure everything is run in the correct order.

This works thanks to Python's Context Managers.

FastAPI uses them internally to achieve this.

You saw that you can use dependencies with yield and have try blocks that try to execute some code and then run some exit code after finally.

You can also use except to catch the exception that was raised and do something with it.

For example, you can raise a different exception, like HTTPException.

This is a somewhat advanced technique, and in most of the cases you won't really need it, as you can raise exceptions (including HTTPException) from inside of the rest of your application code, for example, in the path operation function.

But it's there for you if you need it. 🤓

Prefer to use the Annotated version if possible.

If you want to catch exceptions and create a custom response based on that, create a Custom Exception Handler.

If you catch an exception using except in a dependency with yield and you don't raise it again (or raise a new exception), FastAPI won't be able to notice there was an exception, the same way that would happen with regular Python:

Prefer to use the Annotated version if possible.

In this case, the client will see an HTTP 500 Internal Server Error response as it should, given that we are not raising an HTTPException or similar, but the server will not have any logs or any other indication of what was the error. 😱

If you catch an exception in a dependency with yield, unless you are raising another HTTPException or similar, you should re-raise the original exception.

You can re-raise the same exception using raise:

Prefer to use the Annotated version if possible.

Now the client will get the same HTTP 500 Internal Server Error response, but the server will have our custom InternalError in the logs. 😎

The sequence of execution is more or less like this diagram. Time flows from top to bottom. And each column is one of the parts interacting or executing code.

Only one response will be sent to the client. It might be one of the error responses or it will be the response from the path operation.

After one of those responses is sent, no other response can be sent.

If you raise any exception in the code from the path operation function, it will be passed to the dependencies with yield, including HTTPException. In most cases you will want to re-raise that same exception or a new one from the dependency with yield to make sure it's properly handled.

Normally the exit code of dependencies with yield is executed after the response is sent to the client.

But if you know that you won't need to use the dependency after returning from the path operation function, you can use Depends(scope="function") to tell FastAPI that it should close the dependency after the path operation function returns, but before the response is sent.

Prefer to use the Annotated version if possible.

Depends() receives a scope parameter that can be:

If not specified and the dependency has yield, it will have a scope of "request" by default.

When you declare a dependency with a scope="request" (the default), any sub-dependency needs to also have a scope of "request".

But a dependency with scope of "function" can have dependencies with scope of "function" and scope of "request".

This is because any dependency needs to be able to run its exit code before the sub-dependencies, as it might need to still use them during its exit code.

Dependencies with yield have evolved over time to cover different use cases and fix some issues.

If you want to see what has changed in different versions of FastAPI, you can read more about it in the advanced guide, in Advanced Dependencies - Dependencies with yield, HTTPException, except and Background Tasks.

"Context Managers" are any of those Python objects that you can use in a with statement.

For example, you can use with to read a file:

Underneath, the open("./somefile.txt") creates an object that is called a "Context Manager".

When the with block finishes, it makes sure to close the file, even if there were exceptions.

When you create a dependency with yield, FastAPI will internally create a context manager for it, and combine it with some other related tools.

This is, more or less, an "advanced" idea.

If you are just starting with FastAPI you might want to skip it for now.

In Python, you can create Context Managers by creating a class with two methods: __enter__() and __exit__().

You can also use them inside of FastAPI dependencies with yield by using with or async with statements inside of the dependency function:

Another way to create a context manager is with:

using them to decorate a function with a single yield.

That's what FastAPI uses internally for dependencies with yield.

But you don't have to use the decorators for FastAPI dependencies (and you shouldn't).

FastAPI will do it for you internally.

**Examples:**

Example 1 (python):
```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

Example 2 (python):
```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

Example 3 (python):
```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

Example 4 (python):
```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

---

## Dependencies¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/

**Contents:**
- Dependencies¶
- What is "Dependency Injection"¶
- First Steps¶
  - Create a dependency, or "dependable"¶
  - Import Depends¶
  - Declare the dependency, in the "dependant"¶
- Share Annotated dependencies¶
- To async or not to async¶
- Integrated with OpenAPI¶
- Simple usage¶

FastAPI has a very powerful but intuitive Dependency Injection system.

It is designed to be very simple to use, and to make it very easy for any developer to integrate other components with FastAPI.

"Dependency Injection" means, in programming, that there is a way for your code (in this case, your path operation functions) to declare things that it requires to work and use: "dependencies".

And then, that system (in this case FastAPI) will take care of doing whatever is needed to provide your code with those needed dependencies ("inject" the dependencies).

This is very useful when you need to:

All these, while minimizing code repetition.

Let's see a very simple example. It will be so simple that it is not very useful, for now.

But this way we can focus on how the Dependency Injection system works.

Let's first focus on the dependency.

It is just a function that can take all the same parameters that a path operation function can take:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

And it has the same shape and structure that all your path operation functions have.

You can think of it as a path operation function without the "decorator" (without the @app.get("/some-path")).

And it can return anything you want.

In this case, this dependency expects:

And then it just returns a dict containing those values.

FastAPI added support for Annotated (and started recommending it) in version 0.95.0.

If you have an older version, you would get errors when trying to use Annotated.

Make sure you Upgrade the FastAPI version to at least 0.95.1 before using Annotated.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The same way you use Body, Query, etc. with your path operation function parameters, use Depends with a new parameter:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Although you use Depends in the parameters of your function the same way you use Body, Query, etc, Depends works a bit differently.

You only give Depends a single parameter.

This parameter must be something like a function.

You don't call it directly (don't add the parenthesis at the end), you just pass it as a parameter to Depends().

And that function takes parameters in the same way that path operation functions do.

You'll see what other "things", apart from functions, can be used as dependencies in the next chapter.

Whenever a new request arrives, FastAPI will take care of:

This way you write shared code once and FastAPI takes care of calling it for your path operations.

Notice that you don't have to create a special class and pass it somewhere to FastAPI to "register" it or anything similar.

You just pass it to Depends and FastAPI knows how to do the rest.

In the examples above, you see that there's a tiny bit of code duplication.

When you need to use the common_parameters() dependency, you have to write the whole parameter with the type annotation and Depends():

But because we are using Annotated, we can store that Annotated value in a variable and use it in multiple places:

This is just standard Python, it's called a "type alias", it's actually not specific to FastAPI.

But because FastAPI is based on the Python standards, including Annotated, you can use this trick in your code. 😎

The dependencies will keep working as expected, and the best part is that the type information will be preserved, which means that your editor will be able to keep providing you with autocompletion, inline errors, etc. The same for other tools like mypy.

This will be especially useful when you use it in a large code base where you use the same dependencies over and over again in many path operations.

As dependencies will also be called by FastAPI (the same as your path operation functions), the same rules apply while defining your functions.

You can use async def or normal def.

And you can declare dependencies with async def inside of normal def path operation functions, or def dependencies inside of async def path operation functions, etc.

It doesn't matter. FastAPI will know what to do.

If you don't know, check the Async: "In a hurry?" section about async and await in the docs.

All the request declarations, validations and requirements of your dependencies (and sub-dependencies) will be integrated in the same OpenAPI schema.

So, the interactive docs will have all the information from these dependencies too:

If you look at it, path operation functions are declared to be used whenever a path and operation matches, and then FastAPI takes care of calling the function with the correct parameters, extracting the data from the request.

Actually, all (or most) of the web frameworks work in this same way.

You never call those functions directly. They are called by your framework (in this case, FastAPI).

With the Dependency Injection system, you can also tell FastAPI that your path operation function also "depends" on something else that should be executed before your path operation function, and FastAPI will take care of executing it and "injecting" the results.

Other common terms for this same idea of "dependency injection" are:

Integrations and "plug-ins" can be built using the Dependency Injection system. But in fact, there is actually no need to create "plug-ins", as by using dependencies it's possible to declare an infinite number of integrations and interactions that become available to your path operation functions.

And dependencies can be created in a very simple and intuitive way that allows you to just import the Python packages you need, and integrate them with your API functions in a couple of lines of code, literally.

You will see examples of this in the next chapters, about relational and NoSQL databases, security, etc.

The simplicity of the dependency injection system makes FastAPI compatible with:

Although the hierarchical dependency injection system is very simple to define and use, it's still very powerful.

You can define dependencies that in turn can define dependencies themselves.

In the end, a hierarchical tree of dependencies is built, and the Dependency Injection system takes care of solving all these dependencies for you (and their sub-dependencies) and providing (injecting) the results at each step.

For example, let's say you have 4 API endpoints (path operations):

then you could add different permission requirements for each of them just with dependencies and sub-dependencies:

All these dependencies, while declaring their requirements, also add parameters, validations, etc. to your path operations.

FastAPI will take care of adding it all to the OpenAPI schema, so that it is shown in the interactive documentation systems.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

Example 3 (python):
```python
from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

Example 4 (python):
```python
from typing import Union

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

---

## Handling Errors¶

**URL:** https://fastapi.tiangolo.com/tutorial/handling-errors/

**Contents:**
- Handling Errors¶
- Use HTTPException¶
  - Import HTTPException¶
  - Raise an HTTPException in your code¶
  - The resulting response¶
- Add custom headers¶
- Install custom exception handlers¶
- Override the default exception handlers¶
  - Override request validation exceptions¶
  - Override the HTTPException error handler¶

There are many situations in which you need to notify an error to a client that is using your API.

This client could be a browser with a frontend, a code from someone else, an IoT device, etc.

You could need to tell the client that:

In these cases, you would normally return an HTTP status code in the range of 400 (from 400 to 499).

This is similar to the 200 HTTP status codes (from 200 to 299). Those "200" status codes mean that somehow there was a "success" in the request.

The status codes in the 400 range mean that there was an error from the client.

Remember all those "404 Not Found" errors (and jokes)?

To return HTTP responses with errors to the client you use HTTPException.

HTTPException is a normal Python exception with additional data relevant for APIs.

Because it's a Python exception, you don't return it, you raise it.

This also means that if you are inside a utility function that you are calling inside of your path operation function, and you raise the HTTPException from inside of that utility function, it won't run the rest of the code in the path operation function, it will terminate that request right away and send the HTTP error from the HTTPException to the client.

The benefit of raising an exception over returning a value will be more evident in the section about Dependencies and Security.

In this example, when the client requests an item by an ID that doesn't exist, raise an exception with a status code of 404:

If the client requests http://example.com/items/foo (an item_id "foo"), that client will receive an HTTP status code of 200, and a JSON response of:

But if the client requests http://example.com/items/bar (a non-existent item_id "bar"), that client will receive an HTTP status code of 404 (the "not found" error), and a JSON response of:

When raising an HTTPException, you can pass any value that can be converted to JSON as the parameter detail, not only str.

You could pass a dict, a list, etc.

They are handled automatically by FastAPI and converted to JSON.

There are some situations in where it's useful to be able to add custom headers to the HTTP error. For example, for some types of security.

You probably won't need to use it directly in your code.

But in case you needed it for an advanced scenario, you can add custom headers:

You can add custom exception handlers with the same exception utilities from Starlette.

Let's say you have a custom exception UnicornException that you (or a library you use) might raise.

And you want to handle this exception globally with FastAPI.

You could add a custom exception handler with @app.exception_handler():

Here, if you request /unicorns/yolo, the path operation will raise a UnicornException.

But it will be handled by the unicorn_exception_handler.

So, you will receive a clean error, with an HTTP status code of 418 and a JSON content of:

You could also use from starlette.requests import Request and from starlette.responses import JSONResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette. The same with Request.

FastAPI has some default exception handlers.

These handlers are in charge of returning the default JSON responses when you raise an HTTPException and when the request has invalid data.

You can override these exception handlers with your own.

When a request contains invalid data, FastAPI internally raises a RequestValidationError.

And it also includes a default exception handler for it.

To override it, import the RequestValidationError and use it with @app.exception_handler(RequestValidationError) to decorate the exception handler.

The exception handler will receive a Request and the exception.

Now, if you go to /items/foo, instead of getting the default JSON error with:

you will get a text version, with:

The same way, you can override the HTTPException handler.

For example, you could want to return a plain text response instead of JSON for these errors:

You could also use from starlette.responses import PlainTextResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

Have in mind that the RequestValidationError contains the information of the file name and line where the validation error happens so that you can show it in your logs with the relevant information if you want to.

But that means that if you just convert it to a string and return that information directly, you could be leaking a bit of information about your system, that's why here the code extracts and shows each error independently.

The RequestValidationError contains the body it received with invalid data.

You could use it while developing your app to log the body and debug it, return it to the user, etc.

Now try sending an invalid item like:

You will receive a response telling you that the data is invalid containing the received body:

FastAPI has its own HTTPException.

And FastAPI's HTTPException error class inherits from Starlette's HTTPException error class.

The only difference is that FastAPI's HTTPException accepts any JSON-able data for the detail field, while Starlette's HTTPException only accepts strings for it.

So, you can keep raising FastAPI's HTTPException as normally in your code.

But when you register an exception handler, you should register it for Starlette's HTTPException.

This way, if any part of Starlette's internal code, or a Starlette extension or plug-in, raises a Starlette HTTPException, your handler will be able to catch and handle it.

In this example, to be able to have both HTTPExceptions in the same code, Starlette's exceptions is renamed to StarletteHTTPException:

If you want to use the exception along with the same default exception handlers from FastAPI, you can import and reuse the default exception handlers from fastapi.exception_handlers:

In this example you are just printing the error with a very expressive message, but you get the idea. You can use the exception and then just reuse the default exception handlers.

**Examples:**

Example 1 (python):
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

Example 2 (python):
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

Example 3 (json):
```json
{
  "item": "The Foo Wrestlers"
}
```

Example 4 (json):
```json
{
  "detail": "Item not found"
}
```

---

## Bigger Applications - Multiple Files¶

**URL:** https://fastapi.tiangolo.com/tutorial/bigger-applications/

**Contents:**
- Bigger Applications - Multiple Files¶
- An example file structure¶
- APIRouter¶
  - Import APIRouter¶
  - Path operations with APIRouter¶
- Dependencies¶
- Another module with APIRouter¶
  - Import the dependencies¶
    - How relative imports work¶
  - Add some custom tags, responses, and dependencies¶

If you are building an application or a web API, it's rarely the case that you can put everything in a single file.

FastAPI provides a convenience tool to structure your application while keeping all the flexibility.

If you come from Flask, this would be the equivalent of Flask's Blueprints.

Let's say you have a file structure like this:

There are several __init__.py files: one in each directory or subdirectory.

This is what allows importing code from one file into another.

For example, in app/main.py you could have a line like:

The same file structure with comments:

Let's say the file dedicated to handling just users is the submodule at /app/routers/users.py.

You want to have the path operations related to your users separated from the rest of the code, to keep it organized.

But it's still part of the same FastAPI application/web API (it's part of the same "Python Package").

You can create the path operations for that module using APIRouter.

You import it and create an "instance" the same way you would with the class FastAPI:

And then you use it to declare your path operations.

Use it the same way you would use the FastAPI class:

You can think of APIRouter as a "mini FastAPI" class.

All the same options are supported.

All the same parameters, responses, dependencies, tags, etc.

In this example, the variable is called router, but you can name it however you want.

We are going to include this APIRouter in the main FastAPI app, but first, let's check the dependencies and another APIRouter.

We see that we are going to need some dependencies used in several places of the application.

So we put them in their own dependencies module (app/dependencies.py).

We will now use a simple dependency to read a custom X-Token header:

Prefer to use the Annotated version if possible.

We are using an invented header to simplify this example.

But in real cases you will get better results using the integrated Security utilities.

Let's say you also have the endpoints dedicated to handling "items" from your application in the module at app/routers/items.py.

You have path operations for:

It's all the same structure as with app/routers/users.py.

But we want to be smarter and simplify the code a bit.

We know all the path operations in this module have the same:

So, instead of adding all that to each path operation, we can add it to the APIRouter.

As the path of each path operation has to start with /, like in:

...the prefix must not include a final /.

So, the prefix in this case is /items.

We can also add a list of tags and extra responses that will be applied to all the path operations included in this router.

And we can add a list of dependencies that will be added to all the path operations in the router and will be executed/solved for each request made to them.

Note that, much like dependencies in path operation decorators, no value will be passed to your path operation function.

The end result is that the item paths are now:

Having dependencies in the APIRouter can be used, for example, to require authentication for a whole group of path operations. Even if the dependencies are not added individually to each one of them.

The prefix, tags, responses, and dependencies parameters are (as in many other cases) just a feature from FastAPI to help you avoid code duplication.

This code lives in the module app.routers.items, the file app/routers/items.py.

And we need to get the dependency function from the module app.dependencies, the file app/dependencies.py.

So we use a relative import with .. for the dependencies:

If you know perfectly how imports work, continue to the next section below.

A single dot ., like in:

But that file doesn't exist, our dependencies are in a file at app/dependencies.py.

Remember how our app/file structure looks like:

The two dots .., like in:

That works correctly! 🎉

The same way, if we had used three dots ..., like in:

That would refer to some package above app/, with its own file __init__.py, etc. But we don't have that. So, that would throw an error in our example. 🚨

But now you know how it works, so you can use relative imports in your own apps no matter how complex they are. 🤓

We are not adding the prefix /items nor the tags=["items"] to each path operation because we added them to the APIRouter.

But we can still add more tags that will be applied to a specific path operation, and also some extra responses specific to that path operation:

This last path operation will have the combination of tags: ["items", "custom"].

And it will also have both responses in the documentation, one for 404 and one for 403.

Now, let's see the module at app/main.py.

Here's where you import and use the class FastAPI.

This will be the main file in your application that ties everything together.

And as most of your logic will now live in its own specific module, the main file will be quite simple.

You import and create a FastAPI class as normally.

And we can even declare global dependencies that will be combined with the dependencies for each APIRouter:

Prefer to use the Annotated version if possible.

Now we import the other submodules that have APIRouters:

Prefer to use the Annotated version if possible.

As the files app/routers/users.py and app/routers/items.py are submodules that are part of the same Python package app, we can use a single dot . to import them using "relative imports".

The module items will have a variable router (items.router). This is the same one we created in the file app/routers/items.py, it's an APIRouter object.

And then we do the same for the module users.

We could also import them like:

The first version is a "relative import":

The second version is an "absolute import":

To learn more about Python Packages and Modules, read the official Python documentation about Modules.

We are importing the submodule items directly, instead of importing just its variable router.

This is because we also have another variable named router in the submodule users.

If we had imported one after the other, like:

the router from users would overwrite the one from items and we wouldn't be able to use them at the same time.

So, to be able to use both of them in the same file, we import the submodules directly:

Prefer to use the Annotated version if possible.

Now, let's include the routers from the submodules users and items:

Prefer to use the Annotated version if possible.

users.router contains the APIRouter inside of the file app/routers/users.py.

And items.router contains the APIRouter inside of the file app/routers/items.py.

With app.include_router() we can add each APIRouter to the main FastAPI application.

It will include all the routes from that router as part of it.

It will actually internally create a path operation for each path operation that was declared in the APIRouter.

So, behind the scenes, it will actually work as if everything was the same single app.

You don't have to worry about performance when including routers.

This will take microseconds and will only happen at startup.

So it won't affect performance. ⚡

Now, let's imagine your organization gave you the app/internal/admin.py file.

It contains an APIRouter with some admin path operations that your organization shares between several projects.

For this example it will be super simple. But let's say that because it is shared with other projects in the organization, we cannot modify it and add a prefix, dependencies, tags, etc. directly to the APIRouter:

But we still want to set a custom prefix when including the APIRouter so that all its path operations start with /admin, we want to secure it with the dependencies we already have for this project, and we want to include tags and responses.

We can declare all that without having to modify the original APIRouter by passing those parameters to app.include_router():

Prefer to use the Annotated version if possible.

That way, the original APIRouter will stay unmodified, so we can still share that same app/internal/admin.py file with other projects in the organization.

The result is that in our app, each of the path operations from the admin module will have:

But that will only affect that APIRouter in our app, not in any other code that uses it.

So, for example, other projects could use the same APIRouter with a different authentication method.

We can also add path operations directly to the FastAPI app.

Here we do it... just to show that we can 🤷:

Prefer to use the Annotated version if possible.

and it will work correctly, together with all the other path operations added with app.include_router().

Very Technical Details

Note: this is a very technical detail that you probably can just skip.

The APIRouters are not "mounted", they are not isolated from the rest of the application.

This is because we want to include their path operations in the OpenAPI schema and the user interfaces.

As we cannot just isolate them and "mount" them independently of the rest, the path operations are "cloned" (re-created), not included directly.

And open the docs at http://127.0.0.1:8000/docs.

You will see the automatic API docs, including the paths from all the submodules, using the correct paths (and prefixes) and the correct tags:

You can also use .include_router() multiple times with the same router using different prefixes.

This could be useful, for example, to expose the same API under different prefixes, e.g. /api/v1 and /api/latest.

This is an advanced usage that you might not really need, but it's there in case you do.

The same way you can include an APIRouter in a FastAPI application, you can include an APIRouter in another APIRouter using:

Make sure you do it before including router in the FastAPI app, so that the path operations from other_router are also included.

**Examples:**

Example 1 (unknown):
```unknown
.
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py
│   └── routers
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   └── internal
│       ├── __init__.py
│       └── admin.py
```

Example 2 (sql):
```sql
from app.routers import items
```

Example 3 (python):
```python
.
├── app                  # "app" is a Python package
│   ├── __init__.py      # this file makes "app" a "Python package"
│   ├── main.py          # "main" module, e.g. import app.main
│   ├── dependencies.py  # "dependencies" module, e.g. import app.dependencies
│   └── routers          # "routers" is a "Python subpackage"
│   │   ├── __init__.py  # makes "routers" a "Python subpackage"
│   │   ├── items.py     # "items" submodule, e.g. import app.routers.items
│   │   └── users.py     # "users" submodule, e.g. import app.routers.users
│   └── internal         # "internal" is a "Python subpackage"
│       ├── __init__.py  # makes "internal" a "Python subpackage"
│       └── admin.py     # "admin" submodule, e.g. import app.internal.admin
```

Example 4 (python):
```python
from fastapi import APIRouter

router = APIRouter()


@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}
```

---

## Testing¶

**URL:** https://fastapi.tiangolo.com/tutorial/testing/

**Contents:**
- Testing¶
- Using TestClient¶
- Separating tests¶
  - FastAPI app file¶
  - Testing file¶
- Testing: extended example¶
  - Extended FastAPI app file¶
  - Extended testing file¶
- Run it¶

Thanks to Starlette, testing FastAPI applications is easy and enjoyable.

It is based on HTTPX, which in turn is designed based on Requests, so it's very familiar and intuitive.

With it, you can use pytest directly with FastAPI.

To use TestClient, first install httpx.

Make sure you create a virtual environment, activate it, and then install it, for example:

Create a TestClient by passing your FastAPI application to it.

Create functions with a name that starts with test_ (this is standard pytest conventions).

Use the TestClient object the same way as you do with httpx.

Write simple assert statements with the standard Python expressions that you need to check (again, standard pytest).

Notice that the testing functions are normal def, not async def.

And the calls to the client are also normal calls, not using await.

This allows you to use pytest directly without complications.

You could also use from starlette.testclient import TestClient.

FastAPI provides the same starlette.testclient as fastapi.testclient just as a convenience for you, the developer. But it comes directly from Starlette.

If you want to call async functions in your tests apart from sending requests to your FastAPI application (e.g. asynchronous database functions), have a look at the Async Tests in the advanced tutorial.

In a real application, you probably would have your tests in a different file.

And your FastAPI application might also be composed of several files/modules, etc.

Let's say you have a file structure as described in Bigger Applications:

In the file main.py you have your FastAPI app:

Then you could have a file test_main.py with your tests. It could live on the same Python package (the same directory with a __init__.py file):

Because this file is in the same package, you can use relative imports to import the object app from the main module (main.py):

...and have the code for the tests just like before.

Now let's extend this example and add more details to see how to test different parts.

Let's continue with the same file structure as before:

Let's say that now the file main.py with your FastAPI app has some other path operations.

It has a GET operation that could return an error.

It has a POST operation that could return several errors.

Both path operations require an X-Token header.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You could then update test_main.py with the extended tests:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Whenever you need the client to pass information in the request and you don't know how to, you can search (Google) how to do it in httpx, or even how to do it with requests, as HTTPX's design is based on Requests' design.

Then you just do the same in your tests.

For more information about how to pass data to the backend (using httpx or the TestClient) check the HTTPX documentation.

Note that the TestClient receives data that can be converted to JSON, not Pydantic models.

If you have a Pydantic model in your test and you want to send its data to the application during testing, you can use the jsonable_encoder described in JSON Compatible Encoder.

After that, you just need to install pytest.

Make sure you create a virtual environment, activate it, and then install it, for example:

It will detect the files and tests automatically, execute them, and report the results back to you.

**Examples:**

Example 1 (unknown):
```unknown
$ pip install httpx
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


@app.get("/")
async def read_main():
    return {"msg": "Hello World"}


client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
```

Example 3 (unknown):
```unknown
.
├── app
│   ├── __init__.py
│   └── main.py
```

Example 4 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def read_main():
    return {"msg": "Hello World"}
```

---

## Response Status Code¶

**URL:** https://fastapi.tiangolo.com/tutorial/response-status-code/

**Contents:**
- Response Status Code¶
- About HTTP status codes¶
- Shortcut to remember the names¶
- Changing the default¶

The same way you can specify a response model, you can also declare the HTTP status code used for the response with the parameter status_code in any of the path operations:

Notice that status_code is a parameter of the "decorator" method (get, post, etc). Not of your path operation function, like all the parameters and body.

The status_code parameter receives a number with the HTTP status code.

status_code can alternatively also receive an IntEnum, such as Python's http.HTTPStatus.

Some response codes (see the next section) indicate that the response does not have a body.

FastAPI knows this, and will produce OpenAPI docs that state there is no response body.

If you already know what HTTP status codes are, skip to the next section.

In HTTP, you send a numeric status code of 3 digits as part of the response.

These status codes have a name associated to recognize them, but the important part is the number.

To know more about each status code and which code is for what, check the MDN documentation about HTTP status codes.

Let's see the previous example again:

201 is the status code for "Created".

But you don't have to memorize what each of these codes mean.

You can use the convenience variables from fastapi.status.

They are just a convenience, they hold the same number, but that way you can use the editor's autocomplete to find them:

You could also use from starlette import status.

FastAPI provides the same starlette.status as fastapi.status just as a convenience for you, the developer. But it comes directly from Starlette.

Later, in the Advanced User Guide, you will see how to return a different status code than the default you are declaring here.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

Example 2 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

Example 3 (python):
```python
from fastapi import FastAPI, status

app = FastAPI()


@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
    return {"name": name}
```

---

## Response Model - Return Type¶

**URL:** https://fastapi.tiangolo.com/tutorial/response-model/

**Contents:**
- Response Model - Return Type¶
- response_model Parameter¶
  - response_model Priority¶
- Return the same input data¶
- Add an output model¶
  - response_model or Return Type¶
- Return Type and Data Filtering¶
  - Type Annotations and Tooling¶
  - FastAPI Data Filtering¶
- See it in the docs¶

You can declare the type used for the response by annotating the path operation function return type.

You can use type annotations the same way you would for input data in function parameters, you can use Pydantic models, lists, dictionaries, scalar values like integers, booleans, etc.

FastAPI will use this return type to:

But most importantly:

There are some cases where you need or want to return some data that is not exactly what the type declares.

For example, you could want to return a dictionary or a database object, but declare it as a Pydantic model. This way the Pydantic model would do all the data documentation, validation, etc. for the object that you returned (e.g. a dictionary or database object).

If you added the return type annotation, tools and editors would complain with a (correct) error telling you that your function is returning a type (e.g. a dict) that is different from what you declared (e.g. a Pydantic model).

In those cases, you can use the path operation decorator parameter response_model instead of the return type.

You can use the response_model parameter in any of the path operations:

Notice that response_model is a parameter of the "decorator" method (get, post, etc). Not of your path operation function, like all the parameters and body.

response_model receives the same type you would declare for a Pydantic model field, so, it can be a Pydantic model, but it can also be, e.g. a list of Pydantic models, like List[Item].

FastAPI will use this response_model to do all the data documentation, validation, etc. and also to convert and filter the output data to its type declaration.

If you have strict type checks in your editor, mypy, etc, you can declare the function return type as Any.

That way you tell the editor that you are intentionally returning anything. But FastAPI will still do the data documentation, validation, filtering, etc. with the response_model.

If you declare both a return type and a response_model, the response_model will take priority and be used by FastAPI.

This way you can add correct type annotations to your functions even when you are returning a type different than the response model, to be used by the editor and tools like mypy. And still you can have FastAPI do the data validation, documentation, etc. using the response_model.

You can also use response_model=None to disable creating a response model for that path operation, you might need to do it if you are adding type annotations for things that are not valid Pydantic fields, you will see an example of that in one of the sections below.

Here we are declaring a UserIn model, it will contain a plaintext password:

To use EmailStr, first install email-validator.

Make sure you create a virtual environment, activate it, and then install it, for example:

And we are using this model to declare our input and the same model to declare our output:

Now, whenever a browser is creating a user with a password, the API will return the same password in the response.

In this case, it might not be a problem, because it's the same user sending the password.

But if we use the same model for another path operation, we could be sending our user's passwords to every client.

Never store the plain password of a user or send it in a response like this, unless you know all the caveats and you know what you are doing.

We can instead create an input model with the plaintext password and an output model without it:

Here, even though our path operation function is returning the same input user that contains the password:

...we declared the response_model to be our model UserOut, that doesn't include the password:

So, FastAPI will take care of filtering out all the data that is not declared in the output model (using Pydantic).

In this case, because the two models are different, if we annotated the function return type as UserOut, the editor and tools would complain that we are returning an invalid type, as those are different classes.

That's why in this example we have to declare it in the response_model parameter.

...but continue reading below to see how to overcome that.

Let's continue from the previous example. We wanted to annotate the function with one type, but we wanted to be able to return from the function something that actually includes more data.

We want FastAPI to keep filtering the data using the response model. So that even though the function returns more data, the response will only include the fields declared in the response model.

In the previous example, because the classes were different, we had to use the response_model parameter. But that also means that we don't get the support from the editor and tools checking the function return type.

But in most of the cases where we need to do something like this, we want the model just to filter/remove some of the data as in this example.

And in those cases, we can use classes and inheritance to take advantage of function type annotations to get better support in the editor and tools, and still get the FastAPI data filtering.

With this, we get tooling support, from editors and mypy as this code is correct in terms of types, but we also get the data filtering from FastAPI.

How does this work? Let's check that out. 🤓

First let's see how editors, mypy and other tools would see this.

BaseUser has the base fields. Then UserIn inherits from BaseUser and adds the password field, so, it will include all the fields from both models.

We annotate the function return type as BaseUser, but we are actually returning a UserIn instance.

The editor, mypy, and other tools won't complain about this because, in typing terms, UserIn is a subclass of BaseUser, which means it's a valid type when what is expected is anything that is a BaseUser.

Now, for FastAPI, it will see the return type and make sure that what you return includes only the fields that are declared in the type.

FastAPI does several things internally with Pydantic to make sure that those same rules of class inheritance are not used for the returned data filtering, otherwise you could end up returning much more data than what you expected.

This way, you can get the best of both worlds: type annotations with tooling support and data filtering.

When you see the automatic docs, you can check that the input model and output model will both have their own JSON Schema:

And both models will be used for the interactive API documentation:

There might be cases where you return something that is not a valid Pydantic field and you annotate it in the function, only to get the support provided by tooling (the editor, mypy, etc).

The most common case would be returning a Response directly as explained later in the advanced docs.

This simple case is handled automatically by FastAPI because the return type annotation is the class (or a subclass of) Response.

And tools will also be happy because both RedirectResponse and JSONResponse are subclasses of Response, so the type annotation is correct.

You can also use a subclass of Response in the type annotation:

This will also work because RedirectResponse is a subclass of Response, and FastAPI will automatically handle this simple case.

But when you return some other arbitrary object that is not a valid Pydantic type (e.g. a database object) and you annotate it like that in the function, FastAPI will try to create a Pydantic response model from that type annotation, and will fail.

The same would happen if you had something like a union between different types where one or more of them are not valid Pydantic types, for example this would fail 💥:

...this fails because the type annotation is not a Pydantic type and is not just a single Response class or subclass, it's a union (any of the two) between a Response and a dict.

Continuing from the example above, you might not want to have the default data validation, documentation, filtering, etc. that is performed by FastAPI.

But you might want to still keep the return type annotation in the function to get the support from tools like editors and type checkers (e.g. mypy).

In this case, you can disable the response model generation by setting response_model=None:

This will make FastAPI skip the response model generation and that way you can have any return type annotations you need without it affecting your FastAPI application. 🤓

Your response model could have default values, like:

but you might want to omit them from the result if they were not actually stored.

For example, if you have models with many optional attributes in a NoSQL database, but you don't want to send very long JSON responses full of default values.

You can set the path operation decorator parameter response_model_exclude_unset=True:

and those default values won't be included in the response, only the values actually set.

So, if you send a request to that path operation for the item with ID foo, the response (not including default values) will be:

as described in the Pydantic docs for exclude_defaults and exclude_none.

But if your data has values for the model's fields with default values, like the item with ID bar:

they will be included in the response.

If the data has the same values as the default ones, like the item with ID baz:

FastAPI is smart enough (actually, Pydantic is smart enough) to realize that, even though description, tax, and tags have the same values as the defaults, they were set explicitly (instead of taken from the defaults).

So, they will be included in the JSON response.

Notice that the default values can be anything, not only None.

They can be a list ([]), a float of 10.5, etc.

You can also use the path operation decorator parameters response_model_include and response_model_exclude.

They take a set of str with the name of the attributes to include (omitting the rest) or to exclude (including the rest).

This can be used as a quick shortcut if you have only one Pydantic model and want to remove some data from the output.

But it is still recommended to use the ideas above, using multiple classes, instead of these parameters.

This is because the JSON Schema generated in your app's OpenAPI (and the docs) will still be the one for the complete model, even if you use response_model_include or response_model_exclude to omit some attributes.

This also applies to response_model_by_alias that works similarly.

The syntax {"name", "description"} creates a set with those two values.

It is equivalent to set(["name", "description"]).

If you forget to use a set and use a list or tuple instead, FastAPI will still convert it to a set and it will work correctly:

Use the path operation decorator's parameter response_model to define response models and especially to ensure private data is filtered out.

Use response_model_exclude_unset to return only the values explicitly set.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.post("/items/")
async def create_item(item: Item) -> Item:
    return item


@app.get("/items/")
async def read_items() -> list[Item]:
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: list[str] = []


@app.post("/items/")
async def create_item(item: Item) -> Item:
    return item


@app.get("/items/")
async def read_items() -> list[Item]:
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]
```

Example 3 (python):
```python
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Any:
    return item


@app.get("/items/", response_model=list[Item])
async def read_items() -> Any:
    return [
        {"name": "Portal Gun", "price": 42.0},
        {"name": "Plumbus", "price": 32.0},
    ]
```

Example 4 (python):
```python
from typing import Any, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: list[str] = []


@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Any:
    return item


@app.get("/items/", response_model=list[Item])
async def read_items() -> Any:
    return [
        {"name": "Portal Gun", "price": 42.0},
        {"name": "Plumbus", "price": 32.0},
    ]
```

---

## Background Tasks¶

**URL:** https://fastapi.tiangolo.com/tutorial/background-tasks/

**Contents:**
- Background Tasks¶
- Using BackgroundTasks¶
- Create a task function¶
- Add the background task¶
- Dependency Injection¶
- Technical Details¶
- Caveat¶
- Recap¶

You can define background tasks to be run after returning a response.

This is useful for operations that need to happen after a request, but that the client doesn't really have to be waiting for the operation to complete before receiving the response.

This includes, for example:

First, import BackgroundTasks and define a parameter in your path operation function with a type declaration of BackgroundTasks:

FastAPI will create the object of type BackgroundTasks for you and pass it as that parameter.

Create a function to be run as the background task.

It is just a standard function that can receive parameters.

It can be an async def or normal def function, FastAPI will know how to handle it correctly.

In this case, the task function will write to a file (simulating sending an email).

And as the write operation doesn't use async and await, we define the function with normal def:

Inside of your path operation function, pass your task function to the background tasks object with the method .add_task():

.add_task() receives as arguments:

Using BackgroundTasks also works with the dependency injection system, you can declare a parameter of type BackgroundTasks at multiple levels: in a path operation function, in a dependency (dependable), in a sub-dependency, etc.

FastAPI knows what to do in each case and how to reuse the same object, so that all the background tasks are merged together and are run in the background afterwards:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

In this example, the messages will be written to the log.txt file after the response is sent.

If there was a query in the request, it will be written to the log in a background task.

And then another background task generated at the path operation function will write a message using the email path parameter.

The class BackgroundTasks comes directly from starlette.background.

It is imported/included directly into FastAPI so that you can import it from fastapi and avoid accidentally importing the alternative BackgroundTask (without the s at the end) from starlette.background.

By only using BackgroundTasks (and not BackgroundTask), it's then possible to use it as a path operation function parameter and have FastAPI handle the rest for you, just like when using the Request object directly.

It's still possible to use BackgroundTask alone in FastAPI, but you have to create the object in your code and return a Starlette Response including it.

You can see more details in Starlette's official docs for Background Tasks.

If you need to perform heavy background computation and you don't necessarily need it to be run by the same process (for example, you don't need to share memory, variables, etc), you might benefit from using other bigger tools like Celery.

They tend to require more complex configurations, a message/job queue manager, like RabbitMQ or Redis, but they allow you to run background tasks in multiple processes, and especially, in multiple servers.

But if you need to access variables and objects from the same FastAPI app, or you need to perform small background tasks (like sending an email notification), you can simply just use BackgroundTasks.

Import and use BackgroundTasks with parameters in path operation functions and dependencies to add background tasks.

**Examples:**

Example 1 (python):
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

Example 2 (python):
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
from typing import Annotated

from fastapi import BackgroundTasks, Depends, FastAPI

app = FastAPI()


def write_log(message: str):
    with open("log.txt", mode="a") as log:
        log.write(message)


def get_query(background_tasks: BackgroundTasks, q: str | None = None):
    if q:
        message = f"found query: {q}\n"
        background_tasks.add_task(write_log, message)
    return q


@app.post("/send-notification/{email}")
async def send_notification(
    email: str, background_tasks: BackgroundTasks, q: Annotated[str, Depends(get_query)]
):
    message = f"message to {email}\n"
    background_tasks.add_task(write_log, message)
    return {"message": "Message sent"}
```

---

## Metadata and Docs URLs¶

**URL:** https://fastapi.tiangolo.com/tutorial/metadata/

**Contents:**
- Metadata and Docs URLs¶
- Metadata for API¶
- License identifier¶
- Metadata for tags¶
  - Create metadata for tags¶
  - Use your tags¶
  - Check the docs¶
  - Order of tags¶
- OpenAPI URL¶
- Docs URLs¶

You can customize several metadata configurations in your FastAPI application.

You can set the following fields that are used in the OpenAPI specification and the automatic API docs UIs:

You can set them as follows:

You can write Markdown in the description field and it will be rendered in the output.

With this configuration, the automatic API docs would look like:

Since OpenAPI 3.1.0 and FastAPI 0.99.0, you can also set the license_info with an identifier instead of a url.

You can also add additional metadata for the different tags used to group your path operations with the parameter openapi_tags.

It takes a list containing one dictionary for each tag.

Each dictionary can contain:

Let's try that in an example with tags for users and items.

Create metadata for your tags and pass it to the openapi_tags parameter:

Notice that you can use Markdown inside of the descriptions, for example "login" will be shown in bold (login) and "fancy" will be shown in italics (fancy).

You don't have to add metadata for all the tags that you use.

Use the tags parameter with your path operations (and APIRouters) to assign them to different tags:

Read more about tags in Path Operation Configuration.

Now, if you check the docs, they will show all the additional metadata:

The order of each tag metadata dictionary also defines the order shown in the docs UI.

For example, even though users would go after items in alphabetical order, it is shown before them, because we added their metadata as the first dictionary in the list.

By default, the OpenAPI schema is served at /openapi.json.

But you can configure it with the parameter openapi_url.

For example, to set it to be served at /api/v1/openapi.json:

If you want to disable the OpenAPI schema completely you can set openapi_url=None, that will also disable the documentation user interfaces that use it.

You can configure the two documentation user interfaces included:

For example, to set Swagger UI to be served at /documentation and disable ReDoc:

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

description = """
ChimichangApp API helps you do awesome stuff. 🚀

## Items

You can **read items**.

## Users

You will be able to:

* **Create users** (_not implemented_).
* **Read users** (_not implemented_).
"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="Deadpool's favorite app. Nuff said.",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Deadpoolio the Amazing",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)


@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

Example 2 (python):
```python
from fastapi import FastAPI

description = """
ChimichangApp API helps you do awesome stuff. 🚀

## Items

You can **read items**.

## Users

You will be able to:

* **Create users** (_not implemented_).
* **Read users** (_not implemented_).
"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="Deadpool's favorite app. Nuff said.",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Deadpoolio the Amazing",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    },
)


@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

Example 3 (python):
```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "items",
        "description": "Manage items. So _fancy_ they have their own docs.",
        "externalDocs": {
            "description": "Items external docs",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)


@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]


@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

Example 4 (python):
```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "items",
        "description": "Manage items. So _fancy_ they have their own docs.",
        "externalDocs": {
            "description": "Items external docs",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)


@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]


@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

---

## Security - First Steps¶

**URL:** https://fastapi.tiangolo.com/tutorial/security/first-steps/

**Contents:**
- Security - First Steps¶
- How it looks¶
- Create main.py¶
- Run it¶
- Check it¶
- The password flow¶
- FastAPI's OAuth2PasswordBearer¶
  - Use it¶
- What it does¶
- Recap¶

Let's imagine that you have your backend API in some domain.

And you have a frontend in another domain or in a different path of the same domain (or in a mobile application).

And you want to have a way for the frontend to authenticate with the backend, using a username and password.

We can use OAuth2 to build that with FastAPI.

But let's save you the time of reading the full long specification just to find those little pieces of information you need.

Let's use the tools provided by FastAPI to handle security.

Let's first just use the code and see how it works, and then we'll come back to understand what's happening.

Copy the example in a file main.py:

Prefer to use the Annotated version if possible.

The python-multipart package is automatically installed with FastAPI when you run the pip install "fastapi[standard]" command.

However, if you use the pip install fastapi command, the python-multipart package is not included by default.

To install it manually, make sure you create a virtual environment, activate it, and then install it with:

This is because OAuth2 uses "form data" for sending the username and password.

Run the example with:

Go to the interactive docs at: http://127.0.0.1:8000/docs.

You will see something like this:

You already have a shiny new "Authorize" button.

And your path operation has a little lock in the top-right corner that you can click.

And if you click it, you have a little authorization form to type a username and password (and other optional fields):

It doesn't matter what you type in the form, it won't work yet. But we'll get there.

This is of course not the frontend for the final users, but it's a great automatic tool to document interactively all your API.

It can be used by the frontend team (that can also be yourself).

It can be used by third party applications and systems.

And it can also be used by yourself, to debug, check and test the same application.

Now let's go back a bit and understand what is all that.

The password "flow" is one of the ways ("flows") defined in OAuth2, to handle security and authentication.

OAuth2 was designed so that the backend or API could be independent of the server that authenticates the user.

But in this case, the same FastAPI application will handle the API and the authentication.

So, let's review it from that simplified point of view:

FastAPI provides several tools, at different levels of abstraction, to implement these security features.

In this example we are going to use OAuth2, with the Password flow, using a Bearer token. We do that using the OAuth2PasswordBearer class.

A "bearer" token is not the only option.

But it's the best one for our use case.

And it might be the best for most use cases, unless you are an OAuth2 expert and know exactly why there's another option that better suits your needs.

In that case, FastAPI also provides you with the tools to build it.

When we create an instance of the OAuth2PasswordBearer class we pass in the tokenUrl parameter. This parameter contains the URL that the client (the frontend running in the user's browser) will use to send the username and password in order to get a token.

Prefer to use the Annotated version if possible.

Here tokenUrl="token" refers to a relative URL token that we haven't created yet. As it's a relative URL, it's equivalent to ./token.

Because we are using a relative URL, if your API was located at https://example.com/, then it would refer to https://example.com/token. But if your API was located at https://example.com/api/v1/, then it would refer to https://example.com/api/v1/token.

Using a relative URL is important to make sure your application keeps working even in an advanced use case like Behind a Proxy.

This parameter doesn't create that endpoint / path operation, but declares that the URL /token will be the one that the client should use to get the token. That information is used in OpenAPI, and then in the interactive API documentation systems.

We will soon also create the actual path operation.

If you are a very strict "Pythonista" you might dislike the style of the parameter name tokenUrl instead of token_url.

That's because it is using the same name as in the OpenAPI spec. So that if you need to investigate more about any of these security schemes you can just copy and paste it to find more information about it.

The oauth2_scheme variable is an instance of OAuth2PasswordBearer, but it is also a "callable".

It could be called as:

So, it can be used with Depends.

Now you can pass that oauth2_scheme in a dependency with Depends.

Prefer to use the Annotated version if possible.

This dependency will provide a str that is assigned to the parameter token of the path operation function.

FastAPI will know that it can use this dependency to define a "security scheme" in the OpenAPI schema (and the automatic API docs).

FastAPI will know that it can use the class OAuth2PasswordBearer (declared in a dependency) to define the security scheme in OpenAPI because it inherits from fastapi.security.oauth2.OAuth2, which in turn inherits from fastapi.security.base.SecurityBase.

All the security utilities that integrate with OpenAPI (and the automatic API docs) inherit from SecurityBase, that's how FastAPI can know how to integrate them in OpenAPI.

It will go and look in the request for that Authorization header, check if the value is Bearer plus some token, and will return the token as a str.

If it doesn't see an Authorization header, or the value doesn't have a Bearer token, it will respond with a 401 status code error (UNAUTHORIZED) directly.

You don't even have to check if the token exists to return an error. You can be sure that if your function is executed, it will have a str in that token.

You can try it already in the interactive docs:

We are not verifying the validity of the token yet, but that's a start already.

So, in just 3 or 4 extra lines, you already have some primitive form of security.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/items/")
async def read_items(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

Example 3 (unknown):
```unknown
$ pip install python-multipart
```

Example 4 (jsx):
```jsx
$ fastapi dev main.py

<span style="color: green;">INFO</span>:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

---

## Body - Updates¶

**URL:** https://fastapi.tiangolo.com/tutorial/body-updates/

**Contents:**
- Body - Updates¶
- Update replacing with PUT¶
  - Warning about replacing¶
- Partial updates with PATCH¶
  - Using Pydantic's exclude_unset parameter¶
  - Using Pydantic's update parameter¶
  - Partial updates recap¶

To update an item you can use the HTTP PUT operation.

You can use the jsonable_encoder to convert the input data to data that can be stored as JSON (e.g. with a NoSQL database). For example, converting datetime to str.

PUT is used to receive data that should replace the existing data.

That means that if you want to update the item bar using PUT with a body containing:

because it doesn't include the already stored attribute "tax": 20.2, the input model would take the default value of "tax": 10.5.

And the data would be saved with that "new" tax of 10.5.

You can also use the HTTP PATCH operation to partially update data.

This means that you can send only the data that you want to update, leaving the rest intact.

PATCH is less commonly used and known than PUT.

And many teams use only PUT, even for partial updates.

You are free to use them however you want, FastAPI doesn't impose any restrictions.

But this guide shows you, more or less, how they are intended to be used.

If you want to receive partial updates, it's very useful to use the parameter exclude_unset in Pydantic's model's .model_dump().

Like item.model_dump(exclude_unset=True).

That would generate a dict with only the data that was set when creating the item model, excluding default values.

Then you can use this to generate a dict with only the data that was set (sent in the request), omitting default values:

Now, you can create a copy of the existing model using .model_copy(), and pass the update parameter with a dict containing the data to update.

Like stored_item_model.model_copy(update=update_data):

In summary, to apply partial updates you would:

You can actually use this same technique with an HTTP PUT operation.

But the example here uses PATCH because it was created for these use cases.

Notice that the input model is still validated.

So, if you want to receive partial updates that can omit all the attributes, you need to have a model with all the attributes marked as optional (with default values or None).

To distinguish from the models with all optional values for updates and models with required values for creation, you can use the ideas described in Extra Models.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    tax: float = 10.5
    tags: list[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    return items[item_id]


@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    update_item_encoded = jsonable_encoder(item)
    items[item_id] = update_item_encoded
    return update_item_encoded
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: Union[str, None] = None
    description: Union[str, None] = None
    price: Union[float, None] = None
    tax: float = 10.5
    tags: list[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    return items[item_id]


@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    update_item_encoded = jsonable_encoder(item)
    items[item_id] = update_item_encoded
    return update_item_encoded
```

Example 3 (json):
```json
{
    "name": "Barz",
    "price": 3,
    "description": None,
}
```

Example 4 (python):
```python
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    tax: float = 10.5
    tags: list[str] = []


items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}


@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    return items[item_id]


@app.patch("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    stored_item_data = items[item_id]
    stored_item_model = Item(**stored_item_data)
    update_data = item.model_dump(exclude_unset=True)
    updated_item = stored_item_model.model_copy(update=update_data)
    items[item_id] = jsonable_encoder(updated_item)
    return updated_item
```

---

## Global Dependencies¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/

**Contents:**
- Global Dependencies¶
- Dependencies for groups of path operations¶

For some types of applications you might want to add dependencies to the whole application.

Similar to the way you can add dependencies to the path operation decorators, you can add them to the FastAPI application.

In that case, they will be applied to all the path operations in the application:

Prefer to use the Annotated version if possible.

And all the ideas in the section about adding dependencies to the path operation decorators still apply, but in this case, to all of the path operations in the app.

Later, when reading about how to structure bigger applications (Bigger Applications - Multiple Files), possibly with multiple files, you will learn how to declare a single dependencies parameter for a group of path operations.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException


async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])


@app.get("/items/")
async def read_items():
    return [{"item": "Portal Gun"}, {"item": "Plumbus"}]


@app.get("/users/")
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI, Header, HTTPException


async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])


@app.get("/items/")
async def read_items():
    return [{"item": "Portal Gun"}, {"item": "Plumbus"}]


@app.get("/users/")
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]
```

---

## CORS (Cross-Origin Resource Sharing)¶

**URL:** https://fastapi.tiangolo.com/tutorial/cors/

**Contents:**
- CORS (Cross-Origin Resource Sharing)¶
- Origin¶
- Steps¶
- Wildcards¶
- Use CORSMiddleware¶
  - CORS preflight requests¶
  - Simple requests¶
- More info¶

CORS or "Cross-Origin Resource Sharing" refers to the situations when a frontend running in a browser has JavaScript code that communicates with a backend, and the backend is in a different "origin" than the frontend.

An origin is the combination of protocol (http, https), domain (myapp.com, localhost, localhost.tiangolo.com), and port (80, 443, 8080).

So, all these are different origins:

Even if they are all in localhost, they use different protocols or ports, so, they are different "origins".

So, let's say you have a frontend running in your browser at http://localhost:8080, and its JavaScript is trying to communicate with a backend running at http://localhost (because we don't specify a port, the browser will assume the default port 80).

Then, the browser will send an HTTP OPTIONS request to the :80-backend, and if the backend sends the appropriate headers authorizing the communication from this different origin (http://localhost:8080) then the :8080-browser will let the JavaScript in the frontend send its request to the :80-backend.

To achieve this, the :80-backend must have a list of "allowed origins".

In this case, the list would have to include http://localhost:8080 for the :8080-frontend to work correctly.

It's also possible to declare the list as "*" (a "wildcard") to say that all are allowed.

But that will only allow certain types of communication, excluding everything that involves credentials: Cookies, Authorization headers like those used with Bearer Tokens, etc.

So, for everything to work correctly, it's better to specify explicitly the allowed origins.

You can configure it in your FastAPI application using the CORSMiddleware.

You can also specify whether your backend allows:

The default parameters used by the CORSMiddleware implementation are restrictive by default, so you'll need to explicitly enable particular origins, methods, or headers, in order for browsers to be permitted to use them in a Cross-Domain context.

The following arguments are supported:

allow_credentials - Indicate that cookies should be supported for cross-origin requests. Defaults to False.

None of allow_origins, allow_methods and allow_headers can be set to ['*'] if allow_credentials is set to True. All of them must be explicitly specified.

expose_headers - Indicate any response headers that should be made accessible to the browser. Defaults to [].

The middleware responds to two particular types of HTTP request...

These are any OPTIONS request with Origin and Access-Control-Request-Method headers.

In this case the middleware will intercept the incoming request and respond with appropriate CORS headers, and either a 200 or 400 response for informational purposes.

Any request with an Origin header. In this case the middleware will pass the request through as normal, but will include appropriate CORS headers on the response.

For more info about CORS, check the Mozilla CORS documentation.

You could also use from starlette.middleware.cors import CORSMiddleware.

FastAPI provides several middlewares in fastapi.middleware just as a convenience for you, the developer. But most of the available middlewares come directly from Starlette.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"message": "Hello World"}
```

---

## Path Parameters¶

**URL:** https://fastapi.tiangolo.com/tutorial/path-params/

**Contents:**
- Path Parameters¶
- Path parameters with types¶
- Data conversion¶
- Data validation¶
- Documentation¶
- Standards-based benefits, alternative documentation¶
- Pydantic¶
- Order matters¶
- Predefined values¶
  - Create an Enum class¶

You can declare path "parameters" or "variables" with the same syntax used by Python format strings:

The value of the path parameter item_id will be passed to your function as the argument item_id.

So, if you run this example and go to http://127.0.0.1:8000/items/foo, you will see a response of:

You can declare the type of a path parameter in the function, using standard Python type annotations:

In this case, item_id is declared to be an int.

This will give you editor support inside of your function, with error checks, completion, etc.

If you run this example and open your browser at http://127.0.0.1:8000/items/3, you will see a response of:

Notice that the value your function received (and returned) is 3, as a Python int, not a string "3".

So, with that type declaration, FastAPI gives you automatic request "parsing".

But if you go to the browser at http://127.0.0.1:8000/items/foo, you will see a nice HTTP error of:

because the path parameter item_id had a value of "foo", which is not an int.

The same error would appear if you provided a float instead of an int, as in: http://127.0.0.1:8000/items/4.2

So, with the same Python type declaration, FastAPI gives you data validation.

Notice that the error also clearly states exactly the point where the validation didn't pass.

This is incredibly helpful while developing and debugging code that interacts with your API.

And when you open your browser at http://127.0.0.1:8000/docs, you will see an automatic, interactive, API documentation like:

Again, just with that same Python type declaration, FastAPI gives you automatic, interactive documentation (integrating Swagger UI).

Notice that the path parameter is declared to be an integer.

And because the generated schema is from the OpenAPI standard, there are many compatible tools.

Because of this, FastAPI itself provides an alternative API documentation (using ReDoc), which you can access at http://127.0.0.1:8000/redoc:

The same way, there are many compatible tools. Including code generation tools for many languages.

All the data validation is performed under the hood by Pydantic, so you get all the benefits from it. And you know you are in good hands.

You can use the same type declarations with str, float, bool and many other complex data types.

Several of these are explored in the next chapters of the tutorial.

When creating path operations, you can find situations where you have a fixed path.

Like /users/me, let's say that it's to get data about the current user.

And then you can also have a path /users/{user_id} to get data about a specific user by some user ID.

Because path operations are evaluated in order, you need to make sure that the path for /users/me is declared before the one for /users/{user_id}:

Otherwise, the path for /users/{user_id} would match also for /users/me, "thinking" that it's receiving a parameter user_id with a value of "me".

Similarly, you cannot redefine a path operation:

The first one will always be used since the path matches first.

If you have a path operation that receives a path parameter, but you want the possible valid path parameter values to be predefined, you can use a standard Python Enum.

Import Enum and create a sub-class that inherits from str and from Enum.

By inheriting from str the API docs will be able to know that the values must be of type string and will be able to render correctly.

Then create class attributes with fixed values, which will be the available valid values:

If you are wondering, "AlexNet", "ResNet", and "LeNet" are just names of Machine Learning models.

Then create a path parameter with a type annotation using the enum class you created (ModelName):

Because the available values for the path parameter are predefined, the interactive docs can show them nicely:

The value of the path parameter will be an enumeration member.

You can compare it with the enumeration member in your created enum ModelName:

You can get the actual value (a str in this case) using model_name.value, or in general, your_enum_member.value:

You could also access the value "lenet" with ModelName.lenet.value.

You can return enum members from your path operation, even nested in a JSON body (e.g. a dict).

They will be converted to their corresponding values (strings in this case) before returning them to the client:

In your client you will get a JSON response like:

Let's say you have a path operation with a path /files/{file_path}.

But you need file_path itself to contain a path, like home/johndoe/myfile.txt.

So, the URL for that file would be something like: /files/home/johndoe/myfile.txt.

OpenAPI doesn't support a way to declare a path parameter to contain a path inside, as that could lead to scenarios that are difficult to test and define.

Nevertheless, you can still do it in FastAPI, using one of the internal tools from Starlette.

And the docs would still work, although not adding any documentation telling that the parameter should contain a path.

Using an option directly from Starlette you can declare a path parameter containing a path using a URL like:

In this case, the name of the parameter is file_path, and the last part, :path, tells it that the parameter should match any path.

So, you can use it with:

You might need the parameter to contain /home/johndoe/myfile.txt, with a leading slash (/).

In that case, the URL would be: /files//home/johndoe/myfile.txt, with a double slash (//) between files and home.

With FastAPI, by using short, intuitive and standard Python type declarations, you get:

And you only have to declare them once.

That's probably the main visible advantage of FastAPI compared to alternative frameworks (apart from the raw performance).

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}
```

Example 2 (json):
```json
{"item_id":"foo"}
```

Example 3 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

Example 4 (json):
```json
{"item_id":3}
```

---

## Header Parameters¶

**URL:** https://fastapi.tiangolo.com/tutorial/header-params/

**Contents:**
- Header Parameters¶
- Import Header¶
- Declare Header parameters¶
- Automatic conversion¶
- Duplicate headers¶
- Recap¶

You can define Header parameters the same way you define Query, Path and Cookie parameters.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Then declare the header parameters using the same structure as with Path, Query and Cookie.

You can define the default value as well as all the extra validation or annotation parameters:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Header is a "sister" class of Path, Query and Cookie. It also inherits from the same common Param class.

But remember that when you import Query, Path, Header, and others from fastapi, those are actually functions that return special classes.

To declare headers, you need to use Header, because otherwise the parameters would be interpreted as query parameters.

Header has a little extra functionality on top of what Path, Query and Cookie provide.

Most of the standard headers are separated by a "hyphen" character, also known as the "minus symbol" (-).

But a variable like user-agent is invalid in Python.

So, by default, Header will convert the parameter names characters from underscore (_) to hyphen (-) to extract and document the headers.

Also, HTTP headers are case-insensitive, so, you can declare them with standard Python style (also known as "snake_case").

So, you can use user_agent as you normally would in Python code, instead of needing to capitalize the first letters as User_Agent or something similar.

If for some reason you need to disable automatic conversion of underscores to hyphens, set the parameter convert_underscores of Header to False:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Before setting convert_underscores to False, bear in mind that some HTTP proxies and servers disallow the usage of headers with underscores.

It is possible to receive duplicate headers. That means, the same header with multiple values.

You can define those cases using a list in the type declaration.

You will receive all the values from the duplicate header as a Python list.

For example, to declare a header of X-Token that can appear more than once, you can write:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

If you communicate with that path operation sending two HTTP headers like:

The response would be like:

Declare headers with Header, using the same common pattern as Query, Path and Cookie.

And don't worry about underscores in your variables, FastAPI will take care of converting them.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: Annotated[Union[str, None], Header()] = None):
    return {"User-Agent": user_agent}
```

Example 3 (python):
```python
from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: str | None = Header(default=None)):
    return {"User-Agent": user_agent}
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(default=None)):
    return {"User-Agent": user_agent}
```

---

## Body - Fields¶

**URL:** https://fastapi.tiangolo.com/tutorial/body-fields/

**Contents:**
- Body - Fields¶
- Import Field¶
- Declare model attributes¶
- Add extra information¶
- Recap¶

The same way you can declare additional validation and metadata in path operation function parameters with Query, Path and Body, you can declare validation and metadata inside of Pydantic models using Pydantic's Field.

First, you have to import it:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Notice that Field is imported directly from pydantic, not from fastapi as are all the rest (Query, Path, Body, etc).

You can then use Field with model attributes:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Field works the same way as Query, Path and Body, it has all the same parameters, etc.

Actually, Query, Path and others you'll see next create objects of subclasses of a common Param class, which is itself a subclass of Pydantic's FieldInfo class.

And Pydantic's Field returns an instance of FieldInfo as well.

Body also returns objects of a subclass of FieldInfo directly. And there are others you will see later that are subclasses of the Body class.

Remember that when you import Query, Path, and others from fastapi, those are actually functions that return special classes.

Notice how each model's attribute with a type, default value and Field has the same structure as a path operation function's parameter, with Field instead of Path, Query and Body.

You can declare extra information in Field, Query, Body, etc. And it will be included in the generated JSON Schema.

You will learn more about adding extra information later in the docs, when learning to declare examples.

Extra keys passed to Field will also be present in the resulting OpenAPI schema for your application. As these keys may not necessarily be part of the OpenAPI specification, some OpenAPI tools, for example the OpenAPI validator, may not work with your generated schema.

You can use Pydantic's Field to declare extra validations and metadata for model attributes.

You can also use the extra keyword arguments to pass additional JSON Schema metadata.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: Union[float, None] = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 3 (python):
```python
from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item = Body(embed=True)):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 4 (python):
```python
from typing import Union

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: Union[float, None] = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item = Body(embed=True)):
    results = {"item_id": item_id, "item": item}
    return results
```

---

## Query Parameters¶

**URL:** https://fastapi.tiangolo.com/tutorial/query-params/

**Contents:**
- Query Parameters¶
- Defaults¶
- Optional parameters¶
- Query parameter type conversion¶
- Multiple path and query parameters¶
- Required query parameters¶

When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.

The query is the set of key-value pairs that go after the ? in a URL, separated by & characters.

For example, in the URL:

...the query parameters are:

As they are part of the URL, they are "naturally" strings.

But when you declare them with Python types (in the example above, as int), they are converted to that type and validated against it.

All the same process that applied for path parameters also applies for query parameters:

As query parameters are not a fixed part of a path, they can be optional and can have default values.

In the example above they have default values of skip=0 and limit=10.

So, going to the URL:

would be the same as going to:

But if you go to, for example:

The parameter values in your function will be:

The same way, you can declare optional query parameters, by setting their default to None:

In this case, the function parameter q will be optional, and will be None by default.

Also notice that FastAPI is smart enough to notice that the path parameter item_id is a path parameter and q is not, so, it's a query parameter.

You can also declare bool types, and they will be converted:

In this case, if you go to:

or any other case variation (uppercase, first letter in uppercase, etc), your function will see the parameter short with a bool value of True. Otherwise as False.

You can declare multiple path parameters and query parameters at the same time, FastAPI knows which is which.

And you don't have to declare them in any specific order.

They will be detected by name:

When you declare a default value for non-path parameters (for now, we have only seen query parameters), then it is not required.

If you don't want to add a specific value but just make it optional, set the default as None.

But when you want to make a query parameter required, you can just not declare any default value:

Here the query parameter needy is a required query parameter of type str.

If you open in your browser a URL like:

...without adding the required parameter needy, you will see an error like:

As needy is a required parameter, you would need to set it in the URL:

And of course, you can define some parameters as required, some as having a default value, and some entirely optional:

In this case, there are 3 query parameters:

You could also use Enums the same way as with Path Parameters.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

Example 2 (yaml):
```yaml
http://127.0.0.1:8000/items/?skip=0&limit=10
```

Example 3 (yaml):
```yaml
http://127.0.0.1:8000/items/
```

Example 4 (yaml):
```yaml
http://127.0.0.1:8000/items/?skip=0&limit=10
```

---

## Header Parameter Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/header-param-models/

**Contents:**
- Header Parameter Models¶
- Header Parameters with a Pydantic Model¶
- Check the Docs¶
- Forbid Extra Headers¶
- Disable Convert Underscores¶
- Summary¶

If you have a group of related header parameters, you can create a Pydantic model to declare them.

This would allow you to re-use the model in multiple places and also to declare validations and metadata for all the parameters at once. 😎

This is supported since FastAPI version 0.115.0. 🤓

Declare the header parameters that you need in a Pydantic model, and then declare the parameter as Header:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI will extract the data for each field from the headers in the request and give you the Pydantic model you defined.

You can see the required headers in the docs UI at /docs:

In some special use cases (probably not very common), you might want to restrict the headers that you want to receive.

You can use Pydantic's model configuration to forbid any extra fields:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

If a client tries to send some extra headers, they will receive an error response.

For example, if the client tries to send a tool header with a value of plumbus, they will receive an error response telling them that the header parameter tool is not allowed:

The same way as with regular header parameters, when you have underscore characters in the parameter names, they are automatically converted to hyphens.

For example, if you have a header parameter save_data in the code, the expected HTTP header will be save-data, and it will show up like that in the docs.

If for some reason you need to disable this automatic conversion, you can do it as well for Pydantic models for header parameters.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Before setting convert_underscores to False, bear in mind that some HTTP proxies and servers disallow the usage of headers with underscores.

You can use Pydantic models to declare headers in FastAPI. 😎

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

Example 3 (python):
```python
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: Union[str, None] = None
    traceparent: Union[str, None] = None
    x_tag: list[str] = []


@app.get("/items/")
async def read_items(headers: CommonHeaders = Header()):
    return headers
```

---

## Debugging¶

**URL:** https://fastapi.tiangolo.com/tutorial/debugging/

**Contents:**
- Debugging¶
- Call uvicorn¶
  - About __name__ == "__main__"¶
    - More details¶
- Run your code with your debugger¶

You can connect the debugger in your editor, for example with Visual Studio Code or PyCharm.

In your FastAPI application, import and run uvicorn directly:

The main purpose of the __name__ == "__main__" is to have some code that is executed when your file is called with:

but is not called when another file imports it, like in:

Let's say your file is named myapp.py.

then the internal variable __name__ in your file, created automatically by Python, will have as value the string "__main__".

This won't happen if you import that module (file).

So, if you have another file importer.py with:

in that case, the automatically created variable __name__ inside of myapp.py will not have the value "__main__".

will not be executed.

For more information, check the official Python docs.

Because you are running the Uvicorn server directly from your code, you can call your Python program (your FastAPI application) directly from the debugger.

For example, in Visual Studio Code, you can:

It will then start the server with your FastAPI code, stop at your breakpoints, etc.

Here's how it might look:

If you use Pycharm, you can:

It will then start the server with your FastAPI code, stop at your breakpoints, etc.

Here's how it might look:

**Examples:**

Example 1 (python):
```python
import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    a = "a"
    b = "b" + a
    return {"hello world": b}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Example 2 (unknown):
```unknown
$ python myapp.py
```

Example 3 (python):
```python
from myapp import app
```

Example 4 (unknown):
```unknown
$ python myapp.py
```

---

## Static Files¶

**URL:** https://fastapi.tiangolo.com/tutorial/static-files/

**Contents:**
- Static Files¶
- Use StaticFiles¶
  - What is "Mounting"¶
- Details¶
- More info¶

You can serve static files automatically from a directory using StaticFiles.

You could also use from starlette.staticfiles import StaticFiles.

FastAPI provides the same starlette.staticfiles as fastapi.staticfiles just as a convenience for you, the developer. But it actually comes directly from Starlette.

"Mounting" means adding a complete "independent" application in a specific path, that then takes care of handling all the sub-paths.

This is different from using an APIRouter as a mounted application is completely independent. The OpenAPI and docs from your main application won't include anything from the mounted application, etc.

You can read more about this in the Advanced User Guide.

The first "/static" refers to the sub-path this "sub-application" will be "mounted" on. So, any path that starts with "/static" will be handled by it.

The directory="static" refers to the name of the directory that contains your static files.

The name="static" gives it a name that can be used internally by FastAPI.

All these parameters can be different than "static", adjust them with the needs and specific details of your own application.

For more details and options check Starlette's docs about Static Files.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
```

---

## Get Current User¶

**URL:** https://fastapi.tiangolo.com/tutorial/security/get-current-user/

**Contents:**
- Get Current User¶
- Create a user model¶
- Create a get_current_user dependency¶
- Get the user¶
- Inject the current user¶
- Other models¶
- Code size¶
- Recap¶

In the previous chapter the security system (which is based on the dependency injection system) was giving the path operation function a token as a str:

Prefer to use the Annotated version if possible.

But that is still not that useful.

Let's make it give us the current user.

First, let's create a Pydantic user model.

The same way we use Pydantic to declare bodies, we can use it anywhere else:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Let's create a dependency get_current_user.

Remember that dependencies can have sub-dependencies?

get_current_user will have a dependency with the same oauth2_scheme we created before.

The same as we were doing before in the path operation directly, our new dependency get_current_user will receive a token as a str from the sub-dependency oauth2_scheme:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

get_current_user will use a (fake) utility function we created, that takes a token as a str and returns our Pydantic User model:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

So now we can use the same Depends with our get_current_user in the path operation:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Notice that we declare the type of current_user as the Pydantic model User.

This will help us inside of the function with all the completion and type checks.

You might remember that request bodies are also declared with Pydantic models.

Here FastAPI won't get confused because you are using Depends.

The way this dependency system is designed allows us to have different dependencies (different "dependables") that all return a User model.

We are not restricted to having only one dependency that can return that type of data.

You can now get the current user directly in the path operation functions and deal with the security mechanisms at the Dependency Injection level, using Depends.

And you can use any model or data for the security requirements (in this case, a Pydantic model User).

But you are not restricted to using some specific data model, class or type.

Do you want to have an id and email and not have any username in your model? Sure. You can use these same tools.

Do you want to just have a str? Or just a dict? Or a database class model instance directly? It all works the same way.

You actually don't have users that log in to your application but robots, bots, or other systems, that have just an access token? Again, it all works the same.

Just use any kind of model, any kind of class, any kind of database that you need for your application. FastAPI has you covered with the dependency injection system.

This example might seem verbose. Keep in mind that we are mixing security, data models, utility functions and path operations in the same file.

But here's the key point.

The security and dependency injection stuff is written once.

And you can make it as complex as you want. And still, have it written only once, in a single place. With all the flexibility.

But you can have thousands of endpoints (path operations) using the same security system.

And all of them (or any portion of them that you want) can take advantage of re-using these dependencies or any other dependencies you create.

And all these thousands of path operations can be as small as 3 lines:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You can now get the current user directly in your path operation function.

We are already halfway there.

We just need to add a path operation for the user/client to actually send the username and password.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/items/")
async def read_items(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


def fake_decode_token(token):
    return User(
        username=token + "fakedecoded", email="john@example.com", full_name="John Doe"
    )


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user


@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
```

Example 4 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


def fake_decode_token(token):
    return User(
        username=token + "fakedecoded", email="john@example.com", full_name="John Doe"
    )


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user


@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
```

---

## Simple OAuth2 with Password and Bearer¶

**URL:** https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/

**Contents:**
- Simple OAuth2 with Password and Bearer¶
- Get the username and password¶
  - scope¶
- Code to get the username and password¶
  - OAuth2PasswordRequestForm¶
  - Use the form data¶
  - Check the password¶
    - Password hashing¶
      - Why use password hashing¶
    - About **user_dict¶

Now let's build from the previous chapter and add the missing parts to have a complete security flow.

We are going to use FastAPI security utilities to get the username and password.

OAuth2 specifies that when using the "password flow" (that we are using) the client/user must send a username and password fields as form data.

And the spec says that the fields have to be named like that. So user-name or email wouldn't work.

But don't worry, you can show it as you wish to your final users in the frontend.

And your database models can use any other names you want.

But for the login path operation, we need to use these names to be compatible with the spec (and be able to, for example, use the integrated API documentation system).

The spec also states that the username and password must be sent as form data (so, no JSON here).

The spec also says that the client can send another form field "scope".

The form field name is scope (in singular), but it is actually a long string with "scopes" separated by spaces.

Each "scope" is just a string (without spaces).

They are normally used to declare specific security permissions, for example:

In OAuth2 a "scope" is just a string that declares a specific permission required.

It doesn't matter if it has other characters like : or if it is a URL.

Those details are implementation specific.

For OAuth2 they are just strings.

Now let's use the utilities provided by FastAPI to handle this.

First, import OAuth2PasswordRequestForm, and use it as a dependency with Depends in the path operation for /token:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

OAuth2PasswordRequestForm is a class dependency that declares a form body with:

The OAuth2 spec actually requires a field grant_type with a fixed value of password, but OAuth2PasswordRequestForm doesn't enforce it.

If you need to enforce it, use OAuth2PasswordRequestFormStrict instead of OAuth2PasswordRequestForm.

The OAuth2PasswordRequestForm is not a special class for FastAPI as is OAuth2PasswordBearer.

OAuth2PasswordBearer makes FastAPI know that it is a security scheme. So it is added that way to OpenAPI.

But OAuth2PasswordRequestForm is just a class dependency that you could have written yourself, or you could have declared Form parameters directly.

But as it's a common use case, it is provided by FastAPI directly, just to make it easier.

The instance of the dependency class OAuth2PasswordRequestForm won't have an attribute scope with the long string separated by spaces, instead, it will have a scopes attribute with the actual list of strings for each scope sent.

We are not using scopes in this example, but the functionality is there if you need it.

Now, get the user data from the (fake) database, using the username from the form field.

If there is no such user, we return an error saying "Incorrect username or password".

For the error, we use the exception HTTPException:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

At this point we have the user data from our database, but we haven't checked the password.

Let's put that data in the Pydantic UserInDB model first.

You should never save plaintext passwords, so, we'll use the (fake) password hashing system.

If the passwords don't match, we return the same error.

"Hashing" means: converting some content (a password in this case) into a sequence of bytes (just a string) that looks like gibberish.

Whenever you pass exactly the same content (exactly the same password) you get exactly the same gibberish.

But you cannot convert from the gibberish back to the password.

If your database is stolen, the thief won't have your users' plaintext passwords, only the hashes.

So, the thief won't be able to try to use those same passwords in another system (as many users use the same password everywhere, this would be dangerous).

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

UserInDB(**user_dict) means:

Pass the keys and values of the user_dict directly as key-value arguments, equivalent to:

For a more complete explanation of **user_dict check back in the documentation for Extra Models.

The response of the token endpoint must be a JSON object.

It should have a token_type. In our case, as we are using "Bearer" tokens, the token type should be "bearer".

And it should have an access_token, with a string containing our access token.

For this simple example, we are going to just be completely insecure and return the same username as the token.

In the next chapter, you will see a real secure implementation, with password hashing and JWT tokens.

But for now, let's focus on the specific details we need.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

By the spec, you should return a JSON with an access_token and a token_type, the same as in this example.

This is something that you have to do yourself in your code, and make sure you use those JSON keys.

It's almost the only thing that you have to remember to do correctly yourself, to be compliant with the specifications.

For the rest, FastAPI handles it for you.

Now we are going to update our dependencies.

We want to get the current_user only if this user is active.

So, we create an additional dependency get_current_active_user that in turn uses get_current_user as a dependency.

Both of these dependencies will just return an HTTP error if the user doesn't exist, or if is inactive.

So, in our endpoint, we will only get a user if the user exists, was correctly authenticated, and is active:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The additional header WWW-Authenticate with value Bearer we are returning here is also part of the spec.

Any HTTP (error) status code 401 "UNAUTHORIZED" is supposed to also return a WWW-Authenticate header.

In the case of bearer tokens (our case), the value of that header should be Bearer.

You can actually skip that extra header and it would still work.

But it's provided here to be compliant with the specifications.

Also, there might be tools that expect and use it (now or in the future) and that might be useful for you or your users, now or in the future.

That's the benefit of standards...

Open the interactive docs: http://127.0.0.1:8000/docs.

Click the "Authorize" button.

After authenticating in the system, you will see it like:

Now use the operation GET with the path /users/me.

You will get your user's data, like:

If you click the lock icon and logout, and then try the same operation again, you will get an HTTP 401 error of:

Now try with an inactive user, authenticate with:

And try to use the operation GET with the path /users/me.

You will get an "Inactive user" error, like:

You now have the tools to implement a complete security system based on username and password for your API.

Using these tools, you can make the security system compatible with any database and with any user or data model.

The only detail missing is that it is not actually "secure" yet.

In the next chapter you'll see how to use a secure password hashing library and JWT tokens.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

app = FastAPI()


def fake_hash_password(password: str):
    return "fakehashed" + password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(fake_users_db, token)
    return user


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

app = FastAPI()


def fake_hash_password(password: str):
    return "fakehashed" + password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(fake_users_db, token)
    return user


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user
```

Example 3 (python):
```python
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

app = FastAPI()


def fake_hash_password(password: str):
    return "fakehashed" + password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(fake_users_db, token)
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
```

Example 4 (python):
```python
from typing import Union

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

app = FastAPI()


def fake_hash_password(password: str):
    return "fakehashed" + password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(fake_users_db, token)
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
```

---

## Request Body¶

**URL:** https://fastapi.tiangolo.com/tutorial/body/

**Contents:**
- Request Body¶
- Import Pydantic's BaseModel¶
- Create your data model¶
- Declare it as a parameter¶
- Results¶
- Automatic docs¶
- Editor support¶
- Use the model¶
- Request body + path parameters¶
- Request body + path + query parameters¶

When you need to send data from a client (let's say, a browser) to your API, you send it as a request body.

A request body is data sent by the client to your API. A response body is the data your API sends to the client.

Your API almost always has to send a response body. But clients don't necessarily need to send request bodies all the time, sometimes they only request a path, maybe with some query parameters, but don't send a body.

To declare a request body, you use Pydantic models with all their power and benefits.

To send data, you should use one of: POST (the more common), PUT, DELETE or PATCH.

Sending a body with a GET request has an undefined behavior in the specifications, nevertheless, it is supported by FastAPI, only for very complex/extreme use cases.

As it is discouraged, the interactive docs with Swagger UI won't show the documentation for the body when using GET, and proxies in the middle might not support it.

First, you need to import BaseModel from pydantic:

Then you declare your data model as a class that inherits from BaseModel.

Use standard Python types for all the attributes:

The same as when declaring query parameters, when a model attribute has a default value, it is not required. Otherwise, it is required. Use None to make it just optional.

For example, this model above declares a JSON "object" (or Python dict) like:

...as description and tax are optional (with a default value of None), this JSON "object" would also be valid:

To add it to your path operation, declare it the same way you declared path and query parameters:

...and declare its type as the model you created, Item.

With just that Python type declaration, FastAPI will:

The JSON Schemas of your models will be part of your OpenAPI generated schema, and will be shown in the interactive API docs:

And will also be used in the API docs inside each path operation that needs them:

In your editor, inside your function you will get type hints and completion everywhere (this wouldn't happen if you received a dict instead of a Pydantic model):

You also get error checks for incorrect type operations:

This is not by chance, the whole framework was built around that design.

And it was thoroughly tested at the design phase, before any implementation, to ensure it would work with all the editors.

There were even some changes to Pydantic itself to support this.

The previous screenshots were taken with Visual Studio Code.

But you would get the same editor support with PyCharm and most of the other Python editors:

If you use PyCharm as your editor, you can use the Pydantic PyCharm Plugin.

It improves editor support for Pydantic models, with:

Inside of the function, you can access all the attributes of the model object directly:

You can declare path parameters and request body at the same time.

FastAPI will recognize that the function parameters that match path parameters should be taken from the path, and that function parameters that are declared to be Pydantic models should be taken from the request body.

You can also declare body, path and query parameters, all at the same time.

FastAPI will recognize each of them and take the data from the correct place.

The function parameters will be recognized as follows:

FastAPI will know that the value of q is not required because of the default value = None.

The str | None (Python 3.10+) or Union in Union[str, None] (Python 3.9+) is not used by FastAPI to determine that the value is not required, it will know it's not required because it has a default value of = None.

But adding the type annotations will allow your editor to give you better support and detect errors.

If you don't want to use Pydantic models, you can also use Body parameters. See the docs for Body - Multiple Parameters: Singular values in body.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 3 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

---

## SQL (Relational) Databases¶

**URL:** https://fastapi.tiangolo.com/tutorial/sql-databases/

**Contents:**
- SQL (Relational) Databases¶
- Install SQLModel¶
- Create the App with a Single Model¶
  - Create Models¶
  - Create an Engine¶
  - Create the Tables¶
  - Create a Session Dependency¶
  - Create Database Tables on Startup¶
  - Create a Hero¶
  - Read Heroes¶

FastAPI doesn't require you to use a SQL (relational) database. But you can use any database that you want.

Here we'll see an example using SQLModel.

SQLModel is built on top of SQLAlchemy and Pydantic. It was made by the same author of FastAPI to be the perfect match for FastAPI applications that need to use SQL databases.

You could use any other SQL or NoSQL database library you want (in some cases called "ORMs"), FastAPI doesn't force you to use anything. 😎

As SQLModel is based on SQLAlchemy, you can easily use any database supported by SQLAlchemy (which makes them also supported by SQLModel), like:

In this example, we'll use SQLite, because it uses a single file and Python has integrated support. So, you can copy this example and run it as is.

Later, for your production application, you might want to use a database server like PostgreSQL.

There is an official project generator with FastAPI and PostgreSQL including a frontend and more tools: https://github.com/fastapi/full-stack-fastapi-template

This is a very simple and short tutorial, if you want to learn about databases in general, about SQL, or more advanced features, go to the SQLModel docs.

First, make sure you create your virtual environment, activate it, and then install sqlmodel:

We'll create the simplest first version of the app with a single SQLModel model first.

Later we'll improve it increasing security and versatility with multiple models below. 🤓

Import SQLModel and create a database model:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The Hero class is very similar to a Pydantic model (in fact, underneath, it actually is a Pydantic model).

There are a few differences:

table=True tells SQLModel that this is a table model, it should represent a table in the SQL database, it's not just a data model (as would be any other regular Pydantic class).

Field(primary_key=True) tells SQLModel that the id is the primary key in the SQL database (you can learn more about SQL primary keys in the SQLModel docs).

Note: We use int | None for the primary key field so that in Python code we can create an object without an id (id=None), assuming the database will generate it when saving. SQLModel understands that the database will provide the id and defines the column as a non-null INTEGER in the database schema. See SQLModel docs on primary keys for details.

Field(index=True) tells SQLModel that it should create a SQL index for this column, that would allow faster lookups in the database when reading data filtered by this column.

SQLModel will know that something declared as str will be a SQL column of type TEXT (or VARCHAR, depending on the database).

A SQLModel engine (underneath it's actually a SQLAlchemy engine) is what holds the connections to the database.

You would have one single engine object for all your code to connect to the same database.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Using check_same_thread=False allows FastAPI to use the same SQLite database in different threads. This is necessary as one single request could use more than one thread (for example in dependencies).

Don't worry, with the way the code is structured, we'll make sure we use a single SQLModel session per request later, this is actually what the check_same_thread is trying to achieve.

We then add a function that uses SQLModel.metadata.create_all(engine) to create the tables for all the table models.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

A Session is what stores the objects in memory and keeps track of any changes needed in the data, then it uses the engine to communicate with the database.

We will create a FastAPI dependency with yield that will provide a new Session for each request. This is what ensures that we use a single session per request. 🤓

Then we create an Annotated dependency SessionDep to simplify the rest of the code that will use this dependency.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We will create the database tables when the application starts.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Here we create the tables on an application startup event.

For production you would probably use a migration script that runs before you start your app. 🤓

SQLModel will have migration utilities wrapping Alembic, but for now, you can use Alembic directly.

Because each SQLModel model is also a Pydantic model, you can use it in the same type annotations that you could use Pydantic models.

For example, if you declare a parameter of type Hero, it will be read from the JSON body.

The same way, you can declare it as the function's return type, and then the shape of the data will show up in the automatic API docs UI.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Here we use the SessionDep dependency (a Session) to add the new Hero to the Session instance, commit the changes to the database, refresh the data in the hero, and then return it.

We can read Heros from the database using a select(). We can include a limit and offset to paginate the results.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We can read a single Hero.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We can also delete a Hero.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Then go to the /docs UI, you will see that FastAPI is using these models to document the API, and it will use them to serialize and validate the data too.

Now let's refactor this app a bit to increase security and versatility.

If you check the previous app, in the UI you can see that, up to now, it lets the client decide the id of the Hero to create. 😱

We shouldn't let that happen, they could overwrite an id we already have assigned in the DB. Deciding the id should be done by the backend or the database, not by the client.

Additionally, we create a secret_name for the hero, but so far, we are returning it everywhere, that's not very secret... 😅

We'll fix these things by adding a few extra models. Here's where SQLModel will shine. ✨

In SQLModel, any model class that has table=True is a table model.

And any model class that doesn't have table=True is a data model, these ones are actually just Pydantic models (with a couple of small extra features). 🤓

With SQLModel, we can use inheritance to avoid duplicating all the fields in all the cases.

Let's start with a HeroBase model that has all the fields that are shared by all the models:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Then let's create Hero, the actual table model, with the extra fields that are not always in the other models:

Because Hero inherits form HeroBase, it also has the fields declared in HeroBase, so all the fields for Hero are:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Next, we create a HeroPublic model, this is the one that will be returned to the clients of the API.

It has the same fields as HeroBase, so it won't include secret_name.

Finally, the identity of our heroes is protected! 🥷

It also re-declares id: int. By doing this, we are making a contract with the API clients, so that they can always expect the id to be there and to be an int (it will never be None).

Having the return model ensure that a value is always available and always int (not None) is very useful for the API clients, they can write much simpler code having this certainty.

Also, automatically generated clients will have simpler interfaces, so that the developers communicating with your API can have a much better time working with your API. 😎

All the fields in HeroPublic are the same as in HeroBase, with id declared as int (not None):

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now we create a HeroCreate model, this is the one that will validate the data from the clients.

It has the same fields as HeroBase, and it also has secret_name.

Now, when the clients create a new hero, they will send the secret_name, it will be stored in the database, but those secret names won't be returned in the API to the clients.

This is how you would handle passwords. Receive them, but don't return them in the API.

You would also hash the values of the passwords before storing them, never store them in plain text.

The fields of HeroCreate are:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We didn't have a way to update a hero in the previous version of the app, but now with multiple models, we can do it. 🎉

The HeroUpdate data model is somewhat special, it has all the same fields that would be needed to create a new hero, but all the fields are optional (they all have a default value). This way, when you update a hero, you can send just the fields that you want to update.

Because all the fields actually change (the type now includes None and they now have a default value of None), we need to re-declare them.

We don't really need to inherit from HeroBase because we are re-declaring all the fields. I'll leave it inheriting just for consistency, but this is not necessary. It's more a matter of personal taste. 🤷

The fields of HeroUpdate are:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now that we have multiple models, we can update the parts of the app that use them.

We receive in the request a HeroCreate data model, and from it, we create a Hero table model.

This new table model Hero will have the fields sent by the client, and will also have an id generated by the database.

Then we return the same table model Hero as is from the function. But as we declare the response_model with the HeroPublic data model, FastAPI will use HeroPublic to validate and serialize the data.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now we use response_model=HeroPublic instead of the return type annotation -> HeroPublic because the value that we are returning is actually not a HeroPublic.

If we had declared -> HeroPublic, your editor and linter would complain (rightfully so) that you are returning a Hero instead of a HeroPublic.

By declaring it in response_model we are telling FastAPI to do its thing, without interfering with the type annotations and the help from your editor and other tools.

We can do the same as before to read Heros, again, we use response_model=list[HeroPublic] to ensure that the data is validated and serialized correctly.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We can read a single hero:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

We can update a hero. For this we use an HTTP PATCH operation.

And in the code, we get a dict with all the data sent by the client, only the data sent by the client, excluding any values that would be there just for being the default values. To do it we use exclude_unset=True. This is the main trick. 🪄

Then we use hero_db.sqlmodel_update(hero_data) to update the hero_db with the data from hero_data.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Deleting a hero stays pretty much the same.

We won't satisfy the desire to refactor everything in this one. 😅

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You can run the app again:

If you go to the /docs API UI, you will see that it is now updated, and it won't expect to receive the id from the client when creating a hero, etc.

You can use SQLModel to interact with a SQL database and simplify the code with data models and table models.

You can learn a lot more at the SQLModel docs, there's a longer mini tutorial on using SQLModel with FastAPI. 🚀

**Examples:**

Example 1 (php):
```php
$ pip install sqlmodel
---> 100%
```

Example 2 (sql):
```sql
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str

# Code below omitted 👇
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/heroes/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero


@app.get("/heroes/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes


@app.get("/heroes/{hero_id}")
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

Example 4 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Hero(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: Union[int, None] = Field(default=None, index=True)
    secret_name: str


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/heroes/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero


@app.get("/heroes/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes


@app.get("/heroes/{hero_id}")
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

---

## Middleware¶

**URL:** https://fastapi.tiangolo.com/tutorial/middleware/

**Contents:**
- Middleware¶
- Create a middleware¶
  - Before and after the response¶
- Multiple middleware execution order¶
- Other middlewares¶

You can add middleware to FastAPI applications.

A "middleware" is a function that works with every request before it is processed by any specific path operation. And also with every response before returning it.

If you have dependencies with yield, the exit code will run after the middleware.

If there were any background tasks (covered in the Background Tasks section, you will see it later), they will run after all the middleware.

To create a middleware you use the decorator @app.middleware("http") on top of a function.

The middleware function receives:

Keep in mind that custom proprietary headers can be added using the X- prefix.

But if you have custom headers that you want a client in a browser to be able to see, you need to add them to your CORS configurations (CORS (Cross-Origin Resource Sharing)) using the parameter expose_headers documented in Starlette's CORS docs.

You could also use from starlette.requests import Request.

FastAPI provides it as a convenience for you, the developer. But it comes directly from Starlette.

You can add code to be run with the request, before any path operation receives it.

And also after the response is generated, before returning it.

For example, you could add a custom header X-Process-Time containing the time in seconds that it took to process the request and generate a response:

Here we use time.perf_counter() instead of time.time() because it can be more precise for these use cases. 🤓

When you add multiple middlewares using either @app.middleware() decorator or app.add_middleware() method, each new middleware wraps the application, forming a stack. The last middleware added is the outermost, and the first is the innermost.

On the request path, the outermost middleware runs first.

On the response path, it runs last.

This results in the following execution order:

Request: MiddlewareB → MiddlewareA → route

Response: route → MiddlewareA → MiddlewareB

This stacking behavior ensures that middlewares are executed in a predictable and controllable order.

You can later read more about other middlewares in the Advanced User Guide: Advanced Middleware.

You will read about how to handle CORS with a middleware in the next section.

**Examples:**

Example 1 (python):
```python
import time

from fastapi import FastAPI, Request

app = FastAPI()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

Example 2 (python):
```python
import time

from fastapi import FastAPI, Request

app = FastAPI()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

Example 3 (unknown):
```unknown
app.add_middleware(MiddlewareA)
app.add_middleware(MiddlewareB)
```

---

## Request Forms and Files¶

**URL:** https://fastapi.tiangolo.com/tutorial/request-forms-and-files/

**Contents:**
- Request Forms and Files¶
- Import File and Form¶
- Define File and Form parameters¶
- Recap¶

You can define files and form fields at the same time using File and Form.

To receive uploaded files and/or form data, first install python-multipart.

Make sure you create a virtual environment, activate it, and then install it, for example:

Prefer to use the Annotated version if possible.

Create file and form parameters the same way you would for Body or Query:

Prefer to use the Annotated version if possible.

The files and form fields will be uploaded as form data and you will receive the files and form fields.

And you can declare some of the files as bytes and some as UploadFile.

You can declare multiple File and Form parameters in a path operation, but you can't also declare Body fields that you expect to receive as JSON, as the request will have the body encoded using multipart/form-data instead of application/json.

This is not a limitation of FastAPI, it's part of the HTTP protocol.

Use File and Form together when you need to receive data and files in the same request.

**Examples:**

Example 1 (unknown):
```unknown
$ pip install python-multipart
```

Example 2 (python):
```python
from typing import Annotated

from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(
    file: Annotated[bytes, File()],
    fileb: Annotated[UploadFile, File()],
    token: Annotated[str, Form()],
):
    return {
        "file_size": len(file),
        "token": token,
        "fileb_content_type": fileb.content_type,
    }
```

Example 3 (python):
```python
from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(
    file: bytes = File(), fileb: UploadFile = File(), token: str = Form()
):
    return {
        "file_size": len(file),
        "token": token,
        "fileb_content_type": fileb.content_type,
    }
```

Example 4 (python):
```python
from typing import Annotated

from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(
    file: Annotated[bytes, File()],
    fileb: Annotated[UploadFile, File()],
    token: Annotated[str, Form()],
):
    return {
        "file_size": len(file),
        "token": token,
        "fileb_content_type": fileb.content_type,
    }
```

---

## Cookie Parameters¶

**URL:** https://fastapi.tiangolo.com/tutorial/cookie-params/

**Contents:**
- Cookie Parameters¶
- Import Cookie¶
- Declare Cookie parameters¶
- Recap¶

You can define Cookie parameters the same way you define Query and Path parameters.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Then declare the cookie parameters using the same structure as with Path and Query.

You can define the default value as well as all the extra validation or annotation parameters:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Cookie is a "sister" class of Path and Query. It also inherits from the same common Param class.

But remember that when you import Query, Path, Cookie and others from fastapi, those are actually functions that return special classes.

To declare cookies, you need to use Cookie, because otherwise the parameters would be interpreted as query parameters.

Have in mind that, as browsers handle cookies in special ways and behind the scenes, they don't easily allow JavaScript to touch them.

If you go to the API docs UI at /docs you will be able to see the documentation for cookies for your path operations.

But even if you fill the data and click "Execute", because the docs UI works with JavaScript, the cookies won't be sent, and you will see an error message as if you didn't write any values.

Declare cookies with Cookie, using the same common pattern as Query and Path.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(ads_id: Annotated[Union[str, None], Cookie()] = None):
    return {"ads_id": ads_id}
```

Example 3 (python):
```python
from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(default=None)):
    return {"ads_id": ads_id}
```

Example 4 (python):
```python
from typing import Union

from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(ads_id: Union[str, None] = Cookie(default=None)):
    return {"ads_id": ads_id}
```

---

## Tutorial - User Guide¶

**URL:** https://fastapi.tiangolo.com/tutorial/

**Contents:**
- Tutorial - User Guide¶
- Run the code¶
- Install FastAPI¶
- Advanced User Guide¶

This tutorial shows you how to use FastAPI with most of its features, step by step.

Each section gradually builds on the previous ones, but it's structured to separate topics, so that you can go directly to any specific one to solve your specific API needs.

It is also built to work as a future reference so you can come back and see exactly what you need.

All the code blocks can be copied and used directly (they are actually tested Python files).

To run any of the examples, copy the code to a file main.py, and start fastapi dev with:

It is HIGHLY encouraged that you write or copy the code, edit it and run it locally.

Using it in your editor is what really shows you the benefits of FastAPI, seeing how little code you have to write, all the type checks, autocompletion, etc.

The first step is to install FastAPI.

Make sure you create a virtual environment, activate it, and then install FastAPI:

When you install with pip install "fastapi[standard]" it comes with some default optional standard dependencies, including fastapi-cloud-cli, which allows you to deploy to FastAPI Cloud.

If you don't want to have those optional dependencies, you can instead install pip install fastapi.

If you want to install the standard dependencies but without the fastapi-cloud-cli, you can install with pip install "fastapi[standard-no-fastapi-cloud-cli]".

There is also an Advanced User Guide that you can read later after this Tutorial - User guide.

The Advanced User Guide builds on this one, uses the same concepts, and teaches you some extra features.

But you should first read the Tutorial - User Guide (what you are reading right now).

It's designed so that you can build a complete application with just the Tutorial - User Guide, and then extend it in different ways, depending on your needs, using some of the additional ideas from the Advanced User Guide.

**Examples:**

Example 1 (julia):
```julia
$ <font color="#4E9A06">fastapi</font> dev <u style="text-decoration-style:solid">main.py</u>

  <span style="background-color:#009485"><font color="#D3D7CF"> FastAPI </font></span>  Starting development server 🚀

             Searching for package file structure from directories
             with <font color="#3465A4">__init__.py</font> files
             Importing from <font color="#75507B">/home/user/code/</font><font color="#AD7FA8">awesomeapp</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> module </font></span>  🐍 main.py

     <span style="background-color:#007166"><font color="#D3D7CF"> code </font></span>  Importing the FastAPI app object from the module with
             the following code:

             <u style="text-decoration-style:solid">from </u><u style="text-decoration-style:solid"><b>main</b></u><u style="text-decoration-style:solid"> import </u><u style="text-decoration-style:solid"><b>app</b></u>

      <span style="background-color:#007166"><font color="#D3D7CF"> app </font></span>  Using import string: <font color="#3465A4">main:app</font>

   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Server started at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font>
   <span style="background-color:#007166"><font color="#D3D7CF"> server </font></span>  Documentation at <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000/docs</u></font>

      <span style="background-color:#007166"><font color="#D3D7CF"> tip </font></span>  Running in development mode, for production use:
             <b>fastapi run</b>

             Logs:

     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Will watch for changes in these directories:
             <b>[</b><font color="#4E9A06">&apos;/home/user/code/awesomeapp&apos;</font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Uvicorn running on <font color="#729FCF"><u style="text-decoration-style:solid">http://127.0.0.1:8000</u></font> <b>(</b>Press CTRL+C
             to quit<b>)</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started reloader process <b>[</b><font color="#34E2E2"><b>383138</b></font><b>]</b> using WatchFiles
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Started server process <b>[</b><font color="#34E2E2"><b>383153</b></font><b>]</b>
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Waiting for application startup.
     <span style="background-color:#007166"><font color="#D3D7CF"> INFO </font></span>  Application startup complete.
```

Example 2 (php):
```php
$ pip install "fastapi[standard]"

---> 100%
```

---

## JSON Compatible Encoder¶

**URL:** https://fastapi.tiangolo.com/tutorial/encoder/

**Contents:**
- JSON Compatible Encoder¶
- Using the jsonable_encoder¶

There are some cases where you might need to convert a data type (like a Pydantic model) to something compatible with JSON (like a dict, list, etc).

For example, if you need to store it in a database.

For that, FastAPI provides a jsonable_encoder() function.

Let's imagine that you have a database fake_db that only receives JSON compatible data.

For example, it doesn't receive datetime objects, as those are not compatible with JSON.

So, a datetime object would have to be converted to a str containing the data in ISO format.

The same way, this database wouldn't receive a Pydantic model (an object with attributes), only a dict.

You can use jsonable_encoder for that.

It receives an object, like a Pydantic model, and returns a JSON compatible version:

In this example, it would convert the Pydantic model to a dict, and the datetime to a str.

The result of calling it is something that can be encoded with the Python standard json.dumps().

It doesn't return a large str containing the data in JSON format (as a string). It returns a Python standard data structure (e.g. a dict) with values and sub-values that are all compatible with JSON.

jsonable_encoder is actually used by FastAPI internally to convert data. But it is useful in many other scenarios.

**Examples:**

Example 1 (python):
```python
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}


class Item(BaseModel):
    title: str
    timestamp: datetime
    description: str | None = None


app = FastAPI()


@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[id] = json_compatible_item_data
```

Example 2 (python):
```python
from datetime import datetime
from typing import Union

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}


class Item(BaseModel):
    title: str
    timestamp: datetime
    description: Union[str, None] = None


app = FastAPI()


@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[id] = json_compatible_item_data
```

---

## Extra Data Types¶

**URL:** https://fastapi.tiangolo.com/tutorial/extra-data-types/

**Contents:**
- Extra Data Types¶
- Other data types¶
- Example¶

Up to now, you have been using common data types, like:

But you can also use more complex data types.

And you will still have the same features as seen up to now:

Here are some of the additional data types you can use:

Here's an example path operation with parameters using some of the above types.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Note that the parameters inside the function have their natural data type, and you can, for example, perform normal date manipulations, like:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

**Examples:**

Example 1 (python):
```python
from datetime import datetime, time, timedelta
from typing import Annotated
from uuid import UUID

from fastapi import Body, FastAPI

app = FastAPI()


@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: Annotated[datetime, Body()],
    end_datetime: Annotated[datetime, Body()],
    process_after: Annotated[timedelta, Body()],
    repeat_at: Annotated[time | None, Body()] = None,
):
    start_process = start_datetime + process_after
    duration = end_datetime - start_process
    return {
        "item_id": item_id,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "process_after": process_after,
        "repeat_at": repeat_at,
        "start_process": start_process,
        "duration": duration,
    }
```

Example 2 (python):
```python
from datetime import datetime, time, timedelta
from typing import Annotated, Union
from uuid import UUID

from fastapi import Body, FastAPI

app = FastAPI()


@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: Annotated[datetime, Body()],
    end_datetime: Annotated[datetime, Body()],
    process_after: Annotated[timedelta, Body()],
    repeat_at: Annotated[Union[time, None], Body()] = None,
):
    start_process = start_datetime + process_after
    duration = end_datetime - start_process
    return {
        "item_id": item_id,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "process_after": process_after,
        "repeat_at": repeat_at,
        "start_process": start_process,
        "duration": duration,
    }
```

Example 3 (python):
```python
from datetime import datetime, time, timedelta
from uuid import UUID

from fastapi import Body, FastAPI

app = FastAPI()


@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: datetime = Body(),
    end_datetime: datetime = Body(),
    process_after: timedelta = Body(),
    repeat_at: time | None = Body(default=None),
):
    start_process = start_datetime + process_after
    duration = end_datetime - start_process
    return {
        "item_id": item_id,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "process_after": process_after,
        "repeat_at": repeat_at,
        "start_process": start_process,
        "duration": duration,
    }
```

Example 4 (python):
```python
from datetime import datetime, time, timedelta
from typing import Union
from uuid import UUID

from fastapi import Body, FastAPI

app = FastAPI()


@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: datetime = Body(),
    end_datetime: datetime = Body(),
    process_after: timedelta = Body(),
    repeat_at: Union[time, None] = Body(default=None),
):
    start_process = start_datetime + process_after
    duration = end_datetime - start_process
    return {
        "item_id": item_id,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "process_after": process_after,
        "repeat_at": repeat_at,
        "start_process": start_process,
        "duration": duration,
    }
```

---

## Classes as Dependencies¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/classes-as-dependencies/

**Contents:**
- Classes as Dependencies¶
- A dict from the previous example¶
- What makes a dependency¶
- Classes as dependencies¶
- Use it¶
- Type annotation vs Depends¶
- Shortcut¶

Before diving deeper into the Dependency Injection system, let's upgrade the previous example.

In the previous example, we were returning a dict from our dependency ("dependable"):

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

But then we get a dict in the parameter commons of the path operation function.

And we know that editors can't provide a lot of support (like completion) for dicts, because they can't know their keys and value types.

Up to now you have seen dependencies declared as functions.

But that's not the only way to declare dependencies (although it would probably be the more common).

The key factor is that a dependency should be a "callable".

A "callable" in Python is anything that Python can "call" like a function.

So, if you have an object something (that might not be a function) and you can "call" it (execute it) like:

then it is a "callable".

You might notice that to create an instance of a Python class, you use that same syntax.

In this case, fluffy is an instance of the class Cat.

And to create fluffy, you are "calling" Cat.

So, a Python class is also a callable.

Then, in FastAPI, you could use a Python class as a dependency.

What FastAPI actually checks is that it is a "callable" (function, class or anything else) and the parameters defined.

If you pass a "callable" as a dependency in FastAPI, it will analyze the parameters for that "callable", and process them in the same way as the parameters for a path operation function. Including sub-dependencies.

That also applies to callables with no parameters at all. The same as it would be for path operation functions with no parameters.

Then, we can change the dependency "dependable" common_parameters from above to the class CommonQueryParams:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Pay attention to the __init__ method used to create the instance of the class:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

...it has the same parameters as our previous common_parameters:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Those parameters are what FastAPI will use to "solve" the dependency.

In both cases, it will have:

In both cases the data will be converted, validated, documented on the OpenAPI schema, etc.

Now you can declare your dependency using this class.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI calls the CommonQueryParams class. This creates an "instance" of that class and the instance will be passed as the parameter commons to your function.

Notice how we write CommonQueryParams twice in the above code:

Prefer to use the Annotated version if possible.

The last CommonQueryParams, in:

...is what FastAPI will actually use to know what is the dependency.

It is from this one that FastAPI will extract the declared parameters and that is what FastAPI will actually call.

In this case, the first CommonQueryParams, in:

Prefer to use the Annotated version if possible.

...doesn't have any special meaning for FastAPI. FastAPI won't use it for data conversion, validation, etc. (as it is using the Depends(CommonQueryParams) for that).

You could actually write just:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

But declaring the type is encouraged as that way your editor will know what will be passed as the parameter commons, and then it can help you with code completion, type checks, etc:

But you see that we are having some code repetition here, writing CommonQueryParams twice:

Prefer to use the Annotated version if possible.

FastAPI provides a shortcut for these cases, in where the dependency is specifically a class that FastAPI will "call" to create an instance of the class itself.

For those specific cases, you can do the following:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You declare the dependency as the type of the parameter, and you use Depends() without any parameter, instead of having to write the full class again inside of Depends(CommonQueryParams).

The same example would then look like:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

...and FastAPI will know what to do.

If that seems more confusing than helpful, disregard it, you don't need it.

It is just a shortcut. Because FastAPI cares about helping you minimize code repetition.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/users/")
async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

Example 3 (python):
```python
from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

Example 4 (python):
```python
from typing import Union

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(
    q: Union[str, None] = None, skip: int = 0, limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons


@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons
```

---

## Sub-dependencies¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/sub-dependencies/

**Contents:**
- Sub-dependencies¶
- First dependency "dependable"¶
- Second dependency, "dependable" and "dependant"¶
- Use the dependency¶
- Using the same dependency multiple times¶
- Recap¶

You can create dependencies that have sub-dependencies.

They can be as deep as you need them to be.

FastAPI will take care of solving them.

You could create a first dependency ("dependable") like:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

It declares an optional query parameter q as a str, and then it just returns it.

This is quite simple (not very useful), but will help us focus on how the sub-dependencies work.

Then you can create another dependency function (a "dependable") that at the same time declares a dependency of its own (so it is a "dependant" too):

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Let's focus on the parameters declared:

Then we can use the dependency with:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Notice that we are only declaring one dependency in the path operation function, the query_or_cookie_extractor.

But FastAPI will know that it has to solve query_extractor first, to pass the results of that to query_or_cookie_extractor while calling it.

If one of your dependencies is declared multiple times for the same path operation, for example, multiple dependencies have a common sub-dependency, FastAPI will know to call that sub-dependency only once per request.

And it will save the returned value in a "cache" and pass it to all the "dependants" that need it in that specific request, instead of calling the dependency multiple times for the same request.

In an advanced scenario where you know you need the dependency to be called at every step (possibly multiple times) in the same request instead of using the "cached" value, you can set the parameter use_cache=False when using Depends:

Prefer to use the Annotated version if possible.

Apart from all the fancy words used here, the Dependency Injection system is quite simple.

Just functions that look the same as the path operation functions.

But still, it is very powerful, and allows you to declare arbitrarily deeply nested dependency "graphs" (trees).

All this might not seem as useful with these simple examples.

But you will see how useful it is in the chapters about security.

And you will also see the amounts of code it will save you.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Cookie, Depends, FastAPI

app = FastAPI()


def query_extractor(q: str | None = None):
    return q


def query_or_cookie_extractor(
    q: Annotated[str, Depends(query_extractor)],
    last_query: Annotated[str | None, Cookie()] = None,
):
    if not q:
        return last_query
    return q


@app.get("/items/")
async def read_query(
    query_or_default: Annotated[str, Depends(query_or_cookie_extractor)],
):
    return {"q_or_cookie": query_or_default}
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import Cookie, Depends, FastAPI

app = FastAPI()


def query_extractor(q: Union[str, None] = None):
    return q


def query_or_cookie_extractor(
    q: Annotated[str, Depends(query_extractor)],
    last_query: Annotated[Union[str, None], Cookie()] = None,
):
    if not q:
        return last_query
    return q


@app.get("/items/")
async def read_query(
    query_or_default: Annotated[str, Depends(query_or_cookie_extractor)],
):
    return {"q_or_cookie": query_or_default}
```

Example 3 (python):
```python
from fastapi import Cookie, Depends, FastAPI

app = FastAPI()


def query_extractor(q: str | None = None):
    return q


def query_or_cookie_extractor(
    q: str = Depends(query_extractor), last_query: str | None = Cookie(default=None)
):
    if not q:
        return last_query
    return q


@app.get("/items/")
async def read_query(query_or_default: str = Depends(query_or_cookie_extractor)):
    return {"q_or_cookie": query_or_default}
```

Example 4 (python):
```python
from typing import Union

from fastapi import Cookie, Depends, FastAPI

app = FastAPI()


def query_extractor(q: Union[str, None] = None):
    return q


def query_or_cookie_extractor(
    q: str = Depends(query_extractor),
    last_query: Union[str, None] = Cookie(default=None),
):
    if not q:
        return last_query
    return q


@app.get("/items/")
async def read_query(query_or_default: str = Depends(query_or_cookie_extractor)):
    return {"q_or_cookie": query_or_default}
```

---

## Dependencies in path operation decorators¶

**URL:** https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/

**Contents:**
- Dependencies in path operation decorators¶
- Add dependencies to the path operation decorator¶
- Dependencies errors and return values¶
  - Dependency requirements¶
  - Raise exceptions¶
  - Return values¶
- Dependencies for a group of path operations¶
- Global Dependencies¶

In some cases you don't really need the return value of a dependency inside your path operation function.

Or the dependency doesn't return a value.

But you still need it to be executed/solved.

For those cases, instead of declaring a path operation function parameter with Depends, you can add a list of dependencies to the path operation decorator.

The path operation decorator receives an optional argument dependencies.

It should be a list of Depends():

Prefer to use the Annotated version if possible.

These dependencies will be executed/solved the same way as normal dependencies. But their value (if they return any) won't be passed to your path operation function.

Some editors check for unused function parameters, and show them as errors.

Using these dependencies in the path operation decorator you can make sure they are executed while avoiding editor/tooling errors.

It might also help avoid confusion for new developers that see an unused parameter in your code and could think it's unnecessary.

In this example we use invented custom headers X-Key and X-Token.

But in real cases, when implementing security, you would get more benefits from using the integrated Security utilities (the next chapter).

You can use the same dependency functions you use normally.

They can declare request requirements (like headers) or other sub-dependencies:

Prefer to use the Annotated version if possible.

These dependencies can raise exceptions, the same as normal dependencies:

Prefer to use the Annotated version if possible.

And they can return values or not, the values won't be used.

So, you can reuse a normal dependency (that returns a value) you already use somewhere else, and even though the value won't be used, the dependency will be executed:

Prefer to use the Annotated version if possible.

Later, when reading about how to structure bigger applications (Bigger Applications - Multiple Files), possibly with multiple files, you will learn how to declare a single dependencies parameter for a group of path operations.

Next we will see how to add dependencies to the whole FastAPI application, so that they apply to each path operation.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()


async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

Example 2 (python):
```python
from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()


async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()


async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

Example 4 (python):
```python
from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()


async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

---

## Form Data¶

**URL:** https://fastapi.tiangolo.com/tutorial/request-forms/

**Contents:**
- Form Data¶
- Import Form¶
- Define Form parameters¶
- About "Form Fields"¶
- Recap¶

When you need to receive form fields instead of JSON, you can use Form.

To use forms, first install python-multipart.

Make sure you create a virtual environment, activate it, and then install it, for example:

Import Form from fastapi:

Prefer to use the Annotated version if possible.

Create form parameters the same way you would for Body or Query:

Prefer to use the Annotated version if possible.

For example, in one of the ways the OAuth2 specification can be used (called "password flow") it is required to send a username and password as form fields.

The spec requires the fields to be exactly named username and password, and to be sent as form fields, not JSON.

With Form you can declare the same configurations as with Body (and Query, Path, Cookie), including validation, examples, an alias (e.g. user-name instead of username), etc.

Form is a class that inherits directly from Body.

To declare form bodies, you need to use Form explicitly, because without it the parameters would be interpreted as query parameters or body (JSON) parameters.

The way HTML forms (<form></form>) sends the data to the server normally uses a "special" encoding for that data, it's different from JSON.

FastAPI will make sure to read that data from the right place instead of JSON.

Data from forms is normally encoded using the "media type" application/x-www-form-urlencoded.

But when the form includes files, it is encoded as multipart/form-data. You'll read about handling files in the next chapter.

If you want to read more about these encodings and form fields, head to the MDN web docs for POST.

You can declare multiple Form parameters in a path operation, but you can't also declare Body fields that you expect to receive as JSON, as the request will have the body encoded using application/x-www-form-urlencoded instead of application/json.

This is not a limitation of FastAPI, it's part of the HTTP protocol.

Use Form to declare form data input parameters.

**Examples:**

Example 1 (unknown):
```unknown
$ pip install python-multipart
```

Example 2 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/login/")
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

Example 3 (python):
```python
from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/login/")
async def login(username: str = Form(), password: str = Form()):
    return {"username": username}
```

Example 4 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/login/")
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

---

## Request Files¶

**URL:** https://fastapi.tiangolo.com/tutorial/request-files/

**Contents:**
- Request Files¶
- Import File¶
- Define File Parameters¶
- File Parameters with UploadFile¶
  - UploadFile¶
- What is "Form Data"¶
- Optional File Upload¶
- UploadFile with Additional Metadata¶
- Multiple File Uploads¶
  - Multiple File Uploads with Additional Metadata¶

You can define files to be uploaded by the client using File.

To receive uploaded files, first install python-multipart.

Make sure you create a virtual environment, activate it, and then install it, for example:

This is because uploaded files are sent as "form data".

Import File and UploadFile from fastapi:

Prefer to use the Annotated version if possible.

Create file parameters the same way you would for Body or Form:

Prefer to use the Annotated version if possible.

File is a class that inherits directly from Form.

But remember that when you import Query, Path, File and others from fastapi, those are actually functions that return special classes.

To declare File bodies, you need to use File, because otherwise the parameters would be interpreted as query parameters or body (JSON) parameters.

The files will be uploaded as "form data".

If you declare the type of your path operation function parameter as bytes, FastAPI will read the file for you and you will receive the contents as bytes.

Keep in mind that this means that the whole contents will be stored in memory. This will work well for small files.

But there are several cases in which you might benefit from using UploadFile.

Define a file parameter with a type of UploadFile:

Prefer to use the Annotated version if possible.

Using UploadFile has several advantages over bytes:

UploadFile has the following attributes:

UploadFile has the following async methods. They all call the corresponding file methods underneath (using the internal SpooledTemporaryFile).

As all these methods are async methods, you need to "await" them.

For example, inside of an async path operation function you can get the contents with:

If you are inside of a normal def path operation function, you can access the UploadFile.file directly, for example:

async Technical Details

When you use the async methods, FastAPI runs the file methods in a threadpool and awaits for them.

Starlette Technical Details

FastAPI's UploadFile inherits directly from Starlette's UploadFile, but adds some necessary parts to make it compatible with Pydantic and the other parts of FastAPI.

The way HTML forms (<form></form>) sends the data to the server normally uses a "special" encoding for that data, it's different from JSON.

FastAPI will make sure to read that data from the right place instead of JSON.

Data from forms is normally encoded using the "media type" application/x-www-form-urlencoded when it doesn't include files.

But when the form includes files, it is encoded as multipart/form-data. If you use File, FastAPI will know it has to get the files from the correct part of the body.

If you want to read more about these encodings and form fields, head to the MDN web docs for POST.

You can declare multiple File and Form parameters in a path operation, but you can't also declare Body fields that you expect to receive as JSON, as the request will have the body encoded using multipart/form-data instead of application/json.

This is not a limitation of FastAPI, it's part of the HTTP protocol.

You can make a file optional by using standard type annotations and setting a default value of None:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You can also use File() with UploadFile, for example, to set additional metadata:

Prefer to use the Annotated version if possible.

It's possible to upload several files at the same time.

They would be associated to the same "form field" sent using "form data".

To use that, declare a list of bytes or UploadFile:

Prefer to use the Annotated version if possible.

You will receive, as declared, a list of bytes or UploadFiles.

You could also use from starlette.responses import HTMLResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

And the same way as before, you can use File() to set additional parameters, even for UploadFile:

Prefer to use the Annotated version if possible.

Use File, bytes, and UploadFile to declare files to be uploaded in the request, sent as form data.

**Examples:**

Example 1 (unknown):
```unknown
$ pip install python-multipart
```

Example 2 (python):
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

Example 3 (python):
```python
from fastapi import FastAPI, File, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(file: bytes = File()):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}
```

Example 4 (python):
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

---

## Query Parameter Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/query-param-models/

**Contents:**
- Query Parameter Models¶
- Query Parameters with a Pydantic Model¶
- Check the Docs¶
- Forbid Extra Query Parameters¶
- Summary¶

If you have a group of query parameters that are related, you can create a Pydantic model to declare them.

This would allow you to re-use the model in multiple places and also to declare validations and metadata for all the parameters at once. 😎

This is supported since FastAPI version 0.115.0. 🤓

Declare the query parameters that you need in a Pydantic model, and then declare the parameter as Query:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI will extract the data for each field from the query parameters in the request and give you the Pydantic model you defined.

You can see the query parameters in the docs UI at /docs:

In some special use cases (probably not very common), you might want to restrict the query parameters that you want to receive.

You can use Pydantic's model configuration to forbid any extra fields:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

If a client tries to send some extra data in the query parameters, they will receive an error response.

For example, if the client tries to send a tool query parameter with a value of plumbus, like:

They will receive an error response telling them that the query parameter tool is not allowed:

You can use Pydantic models to declare query parameters in FastAPI. 😎

Spoiler alert: you can also use Pydantic models to declare cookies and headers, but you will read about that later in the tutorial. 🤫

**Examples:**

Example 1 (python):
```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

Example 2 (python):
```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

Example 3 (python):
```python
from typing import Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

Example 4 (python):
```python
from typing import Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
async def read_items(filter_query: FilterParams = Query()):
    return filter_query
```

---

## Security¶

**URL:** https://fastapi.tiangolo.com/tutorial/security/

**Contents:**
- Security¶
- In a hurry?¶
- OAuth2¶
  - OAuth 1¶
- OpenID Connect¶
  - OpenID (not "OpenID Connect")¶
- OpenAPI¶
- FastAPI utilities¶

There are many ways to handle security, authentication and authorization.

And it normally is a complex and "difficult" topic.

In many frameworks and systems just handling security and authentication takes a big amount of effort and code (in many cases it can be 50% or more of all the code written).

FastAPI provides several tools to help you deal with Security easily, rapidly, in a standard way, without having to study and learn all the security specifications.

But first, let's check some small concepts.

If you don't care about any of these terms and you just need to add security with authentication based on username and password right now, skip to the next chapters.

OAuth2 is a specification that defines several ways to handle authentication and authorization.

It is quite an extensive specification and covers several complex use cases.

It includes ways to authenticate using a "third party".

That's what all the systems with "login with Facebook, Google, X (Twitter), GitHub" use underneath.

There was an OAuth 1, which is very different from OAuth2, and more complex, as it included direct specifications on how to encrypt the communication.

It is not very popular or used nowadays.

OAuth2 doesn't specify how to encrypt the communication, it expects you to have your application served with HTTPS.

In the section about deployment you will see how to set up HTTPS for free, using Traefik and Let's Encrypt.

OpenID Connect is another specification, based on OAuth2.

It just extends OAuth2 specifying some things that are relatively ambiguous in OAuth2, to try to make it more interoperable.

For example, Google login uses OpenID Connect (which underneath uses OAuth2).

But Facebook login doesn't support OpenID Connect. It has its own flavor of OAuth2.

There was also an "OpenID" specification. That tried to solve the same thing as OpenID Connect, but was not based on OAuth2.

So, it was a complete additional system.

It is not very popular or used nowadays.

OpenAPI (previously known as Swagger) is the open specification for building APIs (now part of the Linux Foundation).

FastAPI is based on OpenAPI.

That's what makes it possible to have multiple automatic interactive documentation interfaces, code generation, etc.

OpenAPI has a way to define multiple security "schemes".

By using them, you can take advantage of all these standard-based tools, including these interactive documentation systems.

OpenAPI defines the following security schemes:

Integrating other authentication/authorization providers like Google, Facebook, X (Twitter), GitHub, etc. is also possible and relatively easy.

The most complex problem is building an authentication/authorization provider like those, but FastAPI gives you the tools to do it easily, while doing the heavy lifting for you.

FastAPI provides several tools for each of these security schemes in the fastapi.security module that simplify using these security mechanisms.

In the next chapters you will see how to add security to your API using those tools provided by FastAPI.

And you will also see how it gets automatically integrated into the interactive documentation system.

---

## Body - Nested Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/body-nested-models/

**Contents:**
- Body - Nested Models¶
- List fields¶
- List fields with type parameter¶
  - Declare a list with a type parameter¶
- Set types¶
- Nested Models¶
  - Define a submodel¶
  - Use the submodel as a type¶
- Special types and validation¶
- Attributes with lists of submodels¶

With FastAPI, you can define, validate, document, and use arbitrarily deeply nested models (thanks to Pydantic).

You can define an attribute to be a subtype. For example, a Python list:

This will make tags be a list, although it doesn't declare the type of the elements of the list.

But Python has a specific way to declare lists with internal types, or "type parameters":

To declare types that have type parameters (internal types), like list, dict, tuple, pass the internal type(s) as "type parameters" using square brackets: [ and ]

That's all standard Python syntax for type declarations.

Use that same standard syntax for model attributes with internal types.

So, in our example, we can make tags be specifically a "list of strings":

But then we think about it, and realize that tags shouldn't repeat, they would probably be unique strings.

And Python has a special data type for sets of unique items, the set.

Then we can declare tags as a set of strings:

With this, even if you receive a request with duplicate data, it will be converted to a set of unique items.

And whenever you output that data, even if the source had duplicates, it will be output as a set of unique items.

And it will be annotated / documented accordingly too.

Each attribute of a Pydantic model has a type.

But that type can itself be another Pydantic model.

So, you can declare deeply nested JSON "objects" with specific attribute names, types and validations.

All that, arbitrarily nested.

For example, we can define an Image model:

And then we can use it as the type of an attribute:

This would mean that FastAPI would expect a body similar to:

Again, doing just that declaration, with FastAPI you get:

Apart from normal singular types like str, int, float, etc. you can use more complex singular types that inherit from str.

To see all the options you have, checkout Pydantic's Type Overview. You will see some examples in the next chapter.

For example, as in the Image model we have a url field, we can declare it to be an instance of Pydantic's HttpUrl instead of a str:

The string will be checked to be a valid URL, and documented in JSON Schema / OpenAPI as such.

You can also use Pydantic models as subtypes of list, set, etc.:

This will expect (convert, validate, document, etc.) a JSON body like:

Notice how the images key now has a list of image objects.

You can define arbitrarily deeply nested models:

Notice how Offer has a list of Items, which in turn have an optional list of Images

If the top level value of the JSON body you expect is a JSON array (a Python list), you can declare the type in the parameter of the function, the same as in Pydantic models:

And you get editor support everywhere.

Even for items inside of lists:

You couldn't get this kind of editor support if you were working directly with dict instead of Pydantic models.

But you don't have to worry about them either, incoming dicts are converted automatically and your output is converted automatically to JSON too.

You can also declare a body as a dict with keys of some type and values of some other type.

This way, you don't have to know beforehand what the valid field/attribute names are (as would be the case with Pydantic models).

This would be useful if you want to receive keys that you don't already know.

Another useful case is when you want to have keys of another type (e.g., int).

That's what we are going to see here.

In this case, you would accept any dict as long as it has int keys with float values:

Keep in mind that JSON only supports str as keys.

But Pydantic has automatic data conversion.

This means that, even though your API clients can only send strings as keys, as long as those strings contain pure integers, Pydantic will convert them and validate them.

And the dict you receive as weights will actually have int keys and float values.

With FastAPI you have the maximum flexibility provided by Pydantic models, while keeping your code simple, short and elegant.

But with all the benefits:

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list = []


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: list = []


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 3 (yaml):
```yaml
my_list: list[str]
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
    tags: list[str] = []


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

---

## Form Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/request-form-models/

**Contents:**
- Form Models¶
- Pydantic Models for Forms¶
- Check the Docs¶
- Forbid Extra Form Fields¶
- Summary¶

You can use Pydantic models to declare form fields in FastAPI.

To use forms, first install python-multipart.

Make sure you create a virtual environment, activate it, and then install it, for example:

This is supported since FastAPI version 0.113.0. 🤓

You just need to declare a Pydantic model with the fields you want to receive as form fields, and then declare the parameter as Form:

Prefer to use the Annotated version if possible.

FastAPI will extract the data for each field from the form data in the request and give you the Pydantic model you defined.

You can verify it in the docs UI at /docs:

In some special use cases (probably not very common), you might want to restrict the form fields to only those declared in the Pydantic model. And forbid any extra fields.

This is supported since FastAPI version 0.114.0. 🤓

You can use Pydantic's model configuration to forbid any extra fields:

Prefer to use the Annotated version if possible.

If a client tries to send some extra data, they will receive an error response.

For example, if the client tries to send the form fields:

They will receive an error response telling them that the field extra is not allowed:

You can use Pydantic models to declare form fields in FastAPI. 😎

**Examples:**

Example 1 (unknown):
```unknown
$ pip install python-multipart
```

Example 2 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

Example 3 (python):
```python
from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login(data: FormData = Form()):
    return data
```

Example 4 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str
    model_config = {"extra": "forbid"}


@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

---

## Path Operation Configuration¶

**URL:** https://fastapi.tiangolo.com/tutorial/path-operation-configuration/

**Contents:**
- Path Operation Configuration¶
- Response Status Code¶
- Tags¶
  - Tags with Enums¶
- Summary and description¶
- Description from docstring¶
- Response description¶
- Deprecate a path operation¶
- Recap¶

There are several parameters that you can pass to your path operation decorator to configure it.

Notice that these parameters are passed directly to the path operation decorator, not to your path operation function.

You can define the (HTTP) status_code to be used in the response of your path operation.

You can pass directly the int code, like 404.

But if you don't remember what each number code is for, you can use the shortcut constants in status:

That status code will be used in the response and will be added to the OpenAPI schema.

You could also use from starlette import status.

FastAPI provides the same starlette.status as fastapi.status just as a convenience for you, the developer. But it comes directly from Starlette.

You can add tags to your path operation, pass the parameter tags with a list of str (commonly just one str):

They will be added to the OpenAPI schema and used by the automatic documentation interfaces:

If you have a big application, you might end up accumulating several tags, and you would want to make sure you always use the same tag for related path operations.

In these cases, it could make sense to store the tags in an Enum.

FastAPI supports that the same way as with plain strings:

You can add a summary and description:

As descriptions tend to be long and cover multiple lines, you can declare the path operation description in the function docstring and FastAPI will read it from there.

You can write Markdown in the docstring, it will be interpreted and displayed correctly (taking into account docstring indentation).

It will be used in the interactive docs:

You can specify the response description with the parameter response_description:

Notice that response_description refers specifically to the response, the description refers to the path operation in general.

OpenAPI specifies that each path operation requires a response description.

So, if you don't provide one, FastAPI will automatically generate one of "Successful response".

If you need to mark a path operation as deprecated, but without removing it, pass the parameter deprecated:

It will be clearly marked as deprecated in the interactive docs:

Check how deprecated and non-deprecated path operations look like:

You can configure and add metadata for your path operations easily by passing parameters to the path operation decorators.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI, status
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()


@app.post("/items/", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    return item
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI, status
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: set[str] = set()


@app.post("/items/", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    return item
```

Example 3 (python):
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


@app.post("/items/", response_model=Item, tags=["items"])
async def create_item(item: Item):
    return item


@app.get("/items/", tags=["items"])
async def read_items():
    return [{"name": "Foo", "price": 42}]


@app.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "johndoe"}]
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: set[str] = set()


@app.post("/items/", response_model=Item, tags=["items"])
async def create_item(item: Item):
    return item


@app.get("/items/", tags=["items"])
async def read_items():
    return [{"name": "Foo", "price": 42}]


@app.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "johndoe"}]
```

---

## OAuth2 with Password (and hashing), Bearer with JWT tokens¶

**URL:** https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/

**Contents:**
- OAuth2 with Password (and hashing), Bearer with JWT tokens¶
- About JWT¶
- Install PyJWT¶
- Password hashing¶
  - Why use password hashing¶
- Install pwdlib¶
- Hash and verify the passwords¶
- Handle JWT tokens¶
- Update the dependencies¶
- Update the /token path operation¶

Now that we have all the security flow, let's make the application actually secure, using JWT tokens and secure password hashing.

This code is something you can actually use in your application, save the password hashes in your database, etc.

We are going to start from where we left in the previous chapter and increment it.

JWT means "JSON Web Tokens".

It's a standard to codify a JSON object in a long dense string without spaces. It looks like this:

It is not encrypted, so, anyone could recover the information from the contents.

But it's signed. So, when you receive a token that you emitted, you can verify that you actually emitted it.

That way, you can create a token with an expiration of, let's say, 1 week. And then when the user comes back the next day with the token, you know that user is still logged in to your system.

After a week, the token will be expired and the user will not be authorized and will have to sign in again to get a new token. And if the user (or a third party) tried to modify the token to change the expiration, you would be able to discover it, because the signatures would not match.

If you want to play with JWT tokens and see how they work, check https://jwt.io.

We need to install PyJWT to generate and verify the JWT tokens in Python.

Make sure you create a virtual environment, activate it, and then install pyjwt:

If you are planning to use digital signature algorithms like RSA or ECDSA, you should install the cryptography library dependency pyjwt[crypto].

You can read more about it in the PyJWT Installation docs.

"Hashing" means converting some content (a password in this case) into a sequence of bytes (just a string) that looks like gibberish.

Whenever you pass exactly the same content (exactly the same password) you get exactly the same gibberish.

But you cannot convert from the gibberish back to the password.

If your database is stolen, the thief won't have your users' plaintext passwords, only the hashes.

So, the thief won't be able to try to use that password in another system (as many users use the same password everywhere, this would be dangerous).

pwdlib is a great Python package to handle password hashes.

It supports many secure hashing algorithms and utilities to work with them.

The recommended algorithm is "Argon2".

Make sure you create a virtual environment, activate it, and then install pwdlib with Argon2:

With pwdlib, you could even configure it to be able to read passwords created by Django, a Flask security plug-in or many others.

So, you would be able to, for example, share the same data from a Django application in a database with a FastAPI application. Or gradually migrate a Django application using the same database.

And your users would be able to login from your Django app or from your FastAPI app, at the same time.

Import the tools we need from pwdlib.

Create a PasswordHash instance with recommended settings - it will be used for hashing and verifying passwords.

pwdlib also supports the bcrypt hashing algorithm but does not include legacy algorithms - for working with outdated hashes, it is recommended to use the passlib library.

For example, you could use it to read and verify passwords generated by another system (like Django) but hash any new passwords with a different algorithm like Argon2 or Bcrypt.

And be compatible with all of them at the same time.

Create a utility function to hash a password coming from the user.

And another utility to verify if a received password matches the hash stored.

And another one to authenticate and return a user.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

If you check the new (fake) database fake_users_db, you will see how the hashed password looks like now: "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc".

Import the modules installed.

Create a random secret key that will be used to sign the JWT tokens.

To generate a secure random secret key use the command:

And copy the output to the variable SECRET_KEY (don't use the one in the example).

Create a variable ALGORITHM with the algorithm used to sign the JWT token and set it to "HS256".

Create a variable for the expiration of the token.

Define a Pydantic Model that will be used in the token endpoint for the response.

Create a utility function to generate a new access token.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Update get_current_user to receive the same token as before, but this time, using JWT tokens.

Decode the received token, verify it, and return the current user.

If the token is invalid, return an HTTP error right away.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Create a timedelta with the expiration time of the token.

Create a real JWT access token and return it.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The JWT specification says that there's a key sub, with the subject of the token.

It's optional to use it, but that's where you would put the user's identification, so we are using it here.

JWT might be used for other things apart from identifying a user and allowing them to perform operations directly on your API.

For example, you could identify a "car" or a "blog post".

Then you could add permissions about that entity, like "drive" (for the car) or "edit" (for the blog).

And then, you could give that JWT token to a user (or bot), and they could use it to perform those actions (drive the car, or edit the blog post) without even needing to have an account, just with the JWT token your API generated for that.

Using these ideas, JWT can be used for way more sophisticated scenarios.

In those cases, several of those entities could have the same ID, let's say foo (a user foo, a car foo, and a blog post foo).

So, to avoid ID collisions, when creating the JWT token for the user, you could prefix the value of the sub key, e.g. with username:. So, in this example, the value of sub could have been: username:johndoe.

The important thing to keep in mind is that the sub key should have a unique identifier across the entire application, and it should be a string.

Run the server and go to the docs: http://127.0.0.1:8000/docs.

You'll see the user interface like:

Authorize the application the same way as before.

Using the credentials:

Username: johndoe Password: secret

Notice that nowhere in the code is the plaintext password "secret", we only have the hashed version.

Call the endpoint /users/me/, you will get the response as:

If you open the developer tools, you could see how the data sent only includes the token, the password is only sent in the first request to authenticate the user and get that access token, but not afterwards:

Notice the header Authorization, with a value that starts with Bearer.

OAuth2 has the notion of "scopes".

You can use them to add a specific set of permissions to a JWT token.

Then you can give this token to a user directly or a third party, to interact with your API with a set of restrictions.

You can learn how to use them and how they are integrated into FastAPI later in the Advanced User Guide.

With what you have seen up to now, you can set up a secure FastAPI application using standards like OAuth2 and JWT.

In almost any framework handling the security becomes a rather complex subject quite quickly.

Many packages that simplify it a lot have to make many compromises with the data model, database, and available features. And some of these packages that simplify things too much actually have security flaws underneath.

FastAPI doesn't make any compromise with any database, data model or tool.

It gives you all the flexibility to choose the ones that fit your project the best.

And you can use directly many well maintained and widely used packages like pwdlib and PyJWT, because FastAPI doesn't require any complex mechanisms to integrate external packages.

But it provides you the tools to simplify the process as much as possible without compromising flexibility, robustness, or security.

And you can use and implement secure, standard protocols, like OAuth2 in a relatively simple way.

You can learn more in the Advanced User Guide about how to use OAuth2 "scopes", for a more fine-grained permission system, following these same standards. OAuth2 with scopes is the mechanism used by many big authentication providers, like Facebook, Google, GitHub, Microsoft, X (Twitter), etc. to authorize third party applications to interact with their APIs on behalf of their users.

**Examples:**

Example 1 (unknown):
```unknown
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Example 2 (php):
```php
$ pip install pyjwt

---> 100%
```

Example 3 (php):
```php
$ pip install "pwdlib[argon2]"

---> 100%
```

Example 4 (python):
```python
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel

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
    }
}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]
```

---

## Declare Request Example Data¶

**URL:** https://fastapi.tiangolo.com/tutorial/schema-extra-example/

**Contents:**
- Declare Request Example Data¶
- Extra JSON Schema data in Pydantic models¶
- Field additional arguments¶
- examples in JSON Schema - OpenAPI¶
  - Body with examples¶
  - Example in the docs UI¶
  - Body with multiple examples¶
  - OpenAPI-specific examples¶
  - Using the openapi_examples Parameter¶
  - OpenAPI Examples in the Docs UI¶

You can declare examples of the data your app can receive.

Here are several ways to do it.

You can declare examples for a Pydantic model that will be added to the generated JSON Schema.

That extra info will be added as-is to the output JSON Schema for that model, and it will be used in the API docs.

You can use the attribute model_config that takes a dict as described in Pydantic's docs: Configuration.

You can set "json_schema_extra" with a dict containing any additional data you would like to show up in the generated JSON Schema, including examples.

You could use the same technique to extend the JSON Schema and add your own custom extra info.

For example you could use it to add metadata for a frontend user interface, etc.

OpenAPI 3.1.0 (used since FastAPI 0.99.0) added support for examples, which is part of the JSON Schema standard.

Before that, it only supported the keyword example with a single example. That is still supported by OpenAPI 3.1.0, but is deprecated and is not part of the JSON Schema standard. So you are encouraged to migrate example to examples. 🤓

You can read more at the end of this page.

When using Field() with Pydantic models, you can also declare additional examples:

you can also declare a group of examples with additional information that will be added to their JSON Schemas inside of OpenAPI.

Here we pass examples containing one example of the data expected in Body():

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

With any of the methods above it would look like this in the /docs:

You can of course also pass multiple examples:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

When you do this, the examples will be part of the internal JSON Schema for that body data.

Nevertheless, at the time of writing this, Swagger UI, the tool in charge of showing the docs UI, doesn't support showing multiple examples for the data in JSON Schema. But read below for a workaround.

Since before JSON Schema supported examples OpenAPI had support for a different field also called examples.

This OpenAPI-specific examples goes in another section in the OpenAPI specification. It goes in the details for each path operation, not inside each JSON Schema.

And Swagger UI has supported this particular examples field for a while. So, you can use it to show different examples in the docs UI.

The shape of this OpenAPI-specific field examples is a dict with multiple examples (instead of a list), each with extra information that will be added to OpenAPI too.

This doesn't go inside of each JSON Schema contained in OpenAPI, this goes outside, in the path operation directly.

You can declare the OpenAPI-specific examples in FastAPI with the parameter openapi_examples for:

The keys of the dict identify each example, and each value is another dict.

Each specific example dict in the examples can contain:

You can use it like this:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

With openapi_examples added to Body() the /docs would look like:

If you are already using FastAPI version 0.99.0 or above, you can probably skip these details.

They are more relevant for older versions, before OpenAPI 3.1.0 was available.

You can consider this a brief OpenAPI and JSON Schema history lesson. 🤓

These are very technical details about the standards JSON Schema and OpenAPI.

If the ideas above already work for you, that might be enough, and you probably don't need these details, feel free to skip them.

Before OpenAPI 3.1.0, OpenAPI used an older and modified version of JSON Schema.

JSON Schema didn't have examples, so OpenAPI added its own example field to its own modified version.

OpenAPI also added example and examples fields to other parts of the specification:

This old OpenAPI-specific examples parameter is now openapi_examples since FastAPI 0.103.0.

But then JSON Schema added an examples field to a new version of the specification.

And then the new OpenAPI 3.1.0 was based on the latest version (JSON Schema 2020-12) that included this new field examples.

And now this new examples field takes precedence over the old single (and custom) example field, that is now deprecated.

This new examples field in JSON Schema is just a list of examples, not a dict with extra metadata as in the other places in OpenAPI (described above).

Even after OpenAPI 3.1.0 was released with this new simpler integration with JSON Schema, for a while, Swagger UI, the tool that provides the automatic docs, didn't support OpenAPI 3.1.0 (it does since version 5.0.0 🎉).

Because of that, versions of FastAPI previous to 0.99.0 still used versions of OpenAPI lower than 3.1.0.

When you add examples inside a Pydantic model, using schema_extra or Field(examples=["something"]) that example is added to the JSON Schema for that Pydantic model.

And that JSON Schema of the Pydantic model is included in the OpenAPI of your API, and then it's used in the docs UI.

In versions of FastAPI before 0.99.0 (0.99.0 and above use the newer OpenAPI 3.1.0) when you used example or examples with any of the other utilities (Query(), Body(), etc.) those examples were not added to the JSON Schema that describes that data (not even to OpenAPI's own version of JSON Schema), they were added directly to the path operation declaration in OpenAPI (outside the parts of OpenAPI that use JSON Schema).

But now that FastAPI 0.99.0 and above uses OpenAPI 3.1.0, that uses JSON Schema 2020-12, and Swagger UI 5.0.0 and above, everything is more consistent and the examples are included in JSON Schema.

Now, as Swagger UI didn't support multiple JSON Schema examples (as of 2023-08-26), users didn't have a way to show multiple examples in the docs.

To solve that, FastAPI 0.103.0 added support for declaring the same old OpenAPI-specific examples field with the new parameter openapi_examples. 🤓

I used to say I didn't like history that much... and look at me now giving "tech history" lessons. 😅

In short, upgrade to FastAPI 0.99.0 or above, and things are much simpler, consistent, and intuitive, and you don't have to know all these historic details. 😎

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ]
        }
    }


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ]
        }
    }


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 3 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str = Field(examples=["Foo"])
    description: str | None = Field(default=None, examples=["A very nice Item"])
    price: float = Field(examples=[35.4])
    tax: float | None = Field(default=None, examples=[3.2])


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class Item(BaseModel):
    name: str = Field(examples=["Foo"])
    description: Union[str, None] = Field(default=None, examples=["A very nice Item"])
    price: float = Field(examples=[35.4])
    tax: Union[float, None] = Field(default=None, examples=[3.2])


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

---

## Query Parameters and String Validations¶

**URL:** https://fastapi.tiangolo.com/tutorial/query-params-str-validations/

**Contents:**
- Query Parameters and String Validations¶
- Additional validation¶
  - Import Query and Annotated¶
- Use Annotated in the type for the q parameter¶
- Add Query to Annotated in the q parameter¶
- Alternative (old): Query as the default value¶
  - Query as the default value or in Annotated¶
  - Advantages of Annotated¶
- Add more validations¶
- Add regular expressions¶

FastAPI allows you to declare additional information and validation for your parameters.

Let's take this application as example:

The query parameter q is of type str | None, that means that it's of type str but could also be None, and indeed, the default value is None, so FastAPI will know it's not required.

FastAPI will know that the value of q is not required because of the default value = None.

Having str | None will allow your editor to give you better support and detect errors.

We are going to enforce that even though q is optional, whenever it is provided, its length doesn't exceed 50 characters.

To achieve that, first import:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI added support for Annotated (and started recommending it) in version 0.95.0.

If you have an older version, you would get errors when trying to use Annotated.

Make sure you Upgrade the FastAPI version to at least 0.95.1 before using Annotated.

Remember I told you before that Annotated can be used to add metadata to your parameters in the Python Types Intro?

Now it's the time to use it with FastAPI. 🚀

We had this type annotation:

What we will do is wrap that with Annotated, so it becomes:

Both of those versions mean the same thing, q is a parameter that can be a str or None, and by default, it is None.

Now let's jump to the fun stuff. 🎉

Now that we have this Annotated where we can put more information (in this case some additional validation), add Query inside of Annotated, and set the parameter max_length to 50:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Notice that the default value is still None, so the parameter is still optional.

But now, having Query(max_length=50) inside of Annotated, we are telling FastAPI that we want it to have additional validation for this value, we want it to have maximum 50 characters. 😎

Here we are using Query() because this is a query parameter. Later we will see others like Path(), Body(), Header(), and Cookie(), that also accept the same arguments as Query().

Previous versions of FastAPI (before 0.95.0) required you to use Query as the default value of your parameter, instead of putting it in Annotated, there's a high chance that you will see code using it around, so I'll explain it to you.

For new code and whenever possible, use Annotated as explained above. There are multiple advantages (explained below) and no disadvantages. 🍰

This is how you would use Query() as the default value of your function parameter, setting the parameter max_length to 50:

Prefer to use the Annotated version if possible.

As in this case (without using Annotated) we have to replace the default value None in the function with Query(), we now need to set the default value with the parameter Query(default=None), it serves the same purpose of defining that default value (at least for FastAPI).

...makes the parameter optional, with a default value of None, the same as:

But the Query version declares it explicitly as being a query parameter.

Then, we can pass more parameters to Query. In this case, the max_length parameter that applies to strings:

This will validate the data, show a clear error when the data is not valid, and document the parameter in the OpenAPI schema path operation.

Keep in mind that when using Query inside of Annotated you cannot use the default parameter for Query.

Instead, use the actual default value of the function parameter. Otherwise, it would be inconsistent.

For example, this is not allowed:

...because it's not clear if the default value should be "rick" or "morty".

So, you would use (preferably):

...or in older code bases you will find:

Using Annotated is recommended instead of the default value in function parameters, it is better for multiple reasons. 🤓

The default value of the function parameter is the actual default value, that's more intuitive with Python in general. 😌

You could call that same function in other places without FastAPI, and it would work as expected. If there's a required parameter (without a default value), your editor will let you know with an error, Python will also complain if you run it without passing the required parameter.

When you don't use Annotated and instead use the (old) default value style, if you call that function without FastAPI in other places, you have to remember to pass the arguments to the function for it to work correctly, otherwise the values will be different from what you expect (e.g. QueryInfo or something similar instead of str). And your editor won't complain, and Python won't complain running that function, only when the operations inside error out.

Because Annotated can have more than one metadata annotation, you could now even use the same function with other tools, like Typer. 🚀

You can also add a parameter min_length:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

You can define a regular expression pattern that the parameter should match:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

This specific regular expression pattern checks that the received parameter value:

If you feel lost with all these "regular expression" ideas, don't worry. They are a hard topic for many people. You can still do a lot of stuff without needing regular expressions yet.

Now you know that whenever you need them you can use them in FastAPI.

You can, of course, use default values other than None.

Let's say that you want to declare the q query parameter to have a min_length of 3, and to have a default value of "fixedquery":

Prefer to use the Annotated version if possible.

Having a default value of any type, including None, makes the parameter optional (not required).

When we don't need to declare more validations or metadata, we can make the q query parameter required just by not declaring a default value, like:

But we are now declaring it with Query, for example like:

So, when you need to declare a value as required while using Query, you can simply not declare a default value:

Prefer to use the Annotated version if possible.

You can declare that a parameter can accept None, but that it's still required. This would force clients to send a value, even if the value is None.

To do that, you can declare that None is a valid type but simply do not declare a default value:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

When you define a query parameter explicitly with Query you can also declare it to receive a list of values, or said in another way, to receive multiple values.

For example, to declare a query parameter q that can appear multiple times in the URL, you can write:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Then, with a URL like:

you would receive the multiple q query parameters' values (foo and bar) in a Python list inside your path operation function, in the function parameter q.

So, the response to that URL would be:

To declare a query parameter with a type of list, like in the example above, you need to explicitly use Query, otherwise it would be interpreted as a request body.

The interactive API docs will update accordingly, to allow multiple values:

You can also define a default list of values if none are provided:

Prefer to use the Annotated version if possible.

the default of q will be: ["foo", "bar"] and your response will be:

You can also use list directly instead of list[str]:

Prefer to use the Annotated version if possible.

Keep in mind that in this case, FastAPI won't check the contents of the list.

For example, list[int] would check (and document) that the contents of the list are integers. But list alone wouldn't.

You can add more information about the parameter.

That information will be included in the generated OpenAPI and used by the documentation user interfaces and external tools.

Keep in mind that different tools might have different levels of OpenAPI support.

Some of them might not show all the extra information declared yet, although in most of the cases, the missing feature is already planned for development.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Imagine that you want the parameter to be item-query.

But item-query is not a valid Python variable name.

The closest would be item_query.

But you still need it to be exactly item-query...

Then you can declare an alias, and that alias is what will be used to find the parameter value:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Now let's say you don't like this parameter anymore.

You have to leave it there a while because there are clients using it, but you want the docs to clearly show it as deprecated.

Then pass the parameter deprecated=True to Query:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

The docs will show it like this:

To exclude a query parameter from the generated OpenAPI schema (and thus, from the automatic documentation systems), set the parameter include_in_schema of Query to False:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

There could be cases where you need to do some custom validation that can't be done with the parameters shown above.

In those cases, you can use a custom validator function that is applied after the normal validation (e.g. after validating that the value is a str).

You can achieve that using Pydantic's AfterValidator inside of Annotated.

Pydantic also has BeforeValidator and others. 🤓

For example, this custom validator checks that the item ID starts with isbn- for an ISBN book number or with imdb- for an IMDB movie URL ID:

This is available with Pydantic version 2 or above. 😎

If you need to do any type of validation that requires communicating with any external component, like a database or another API, you should instead use FastAPI Dependencies, you will learn about them later.

These custom validators are for things that can be checked with only the same data provided in the request.

The important point is just using AfterValidator with a function inside Annotated. Feel free to skip this part. 🤸

But if you're curious about this specific code example and you're still entertained, here are some extra details.

Did you notice? a string using value.startswith() can take a tuple, and it will check each value in the tuple:

With data.items() we get an iterable object with tuples containing the key and value for each dictionary item.

We convert this iterable object into a proper list with list(data.items()).

Then with random.choice() we can get a random value from the list, so, we get a tuple with (id, name). It will be something like ("imdb-tt0371724", "The Hitchhiker's Guide to the Galaxy").

Then we assign those two values of the tuple to the variables id and name.

So, if the user didn't provide an item ID, they will still receive a random suggestion.

...we do all this in a single simple line. 🤯 Don't you love Python? 🐍

You can declare additional validations and metadata for your parameters.

Generic validations and metadata:

Validations specific for strings:

Custom validations using AfterValidator.

In these examples you saw how to declare validations for str values.

See the next chapters to learn how to declare validations for other types, like numbers.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(q: str | None = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(q: Union[str, None] = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

Example 3 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: Annotated[str | None, Query(max_length=50)] = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

Example 4 (python):
```python
from typing import Annotated, Union

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(q: Annotated[Union[str, None], Query(max_length=50)] = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

---

## Body - Multiple Parameters¶

**URL:** https://fastapi.tiangolo.com/tutorial/body-multiple-params/

**Contents:**
- Body - Multiple Parameters¶
- Mix Path, Query and body parameters¶
- Multiple body parameters¶
- Singular values in body¶
- Multiple body params and query¶
- Embed a single body parameter¶
- Recap¶

Now that we have seen how to use Path and Query, let's see more advanced uses of request body declarations.

First, of course, you can mix Path, Query and request body parameter declarations freely and FastAPI will know what to do.

And you can also declare body parameters as optional, by setting the default to None:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Notice that, in this case, the item that would be taken from the body is optional. As it has a None default value.

In the previous example, the path operations would expect a JSON body with the attributes of an Item, like:

But you can also declare multiple body parameters, e.g. item and user:

In this case, FastAPI will notice that there is more than one body parameter in the function (there are two parameters that are Pydantic models).

So, it will then use the parameter names as keys (field names) in the body, and expect a body like:

Notice that even though the item was declared the same way as before, it is now expected to be inside of the body with a key item.

FastAPI will do the automatic conversion from the request, so that the parameter item receives its specific content and the same for user.

It will perform the validation of the compound data, and will document it like that for the OpenAPI schema and automatic docs.

The same way there is a Query and Path to define extra data for query and path parameters, FastAPI provides an equivalent Body.

For example, extending the previous model, you could decide that you want to have another key importance in the same body, besides the item and user.

If you declare it as is, because it is a singular value, FastAPI will assume that it is a query parameter.

But you can instruct FastAPI to treat it as another body key using Body:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

In this case, FastAPI will expect a body like:

Again, it will convert the data types, validate, document, etc.

Of course, you can also declare additional query parameters whenever you need, additional to any body parameters.

As, by default, singular values are interpreted as query parameters, you don't have to explicitly add a Query, you can just do:

Or in Python 3.10 and above:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

Body also has all the same extra validation and metadata parameters as Query, Path and others you will see later.

Let's say you only have a single item body parameter from a Pydantic model Item.

By default, FastAPI will then expect its body directly.

But if you want it to expect a JSON with a key item and inside of it the model contents, as it does when you declare extra body parameters, you can use the special Body parameter embed:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

In this case FastAPI will expect a body like:

You can add multiple body parameters to your path operation function, even though a request can only have a single body.

But FastAPI will handle it, give you the correct data in your function, and validate and document the correct schema in the path operation.

You can also declare singular values to be received as part of the body.

And you can instruct FastAPI to embed the body in a key even when there is only a single parameter declared.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: str | None = None,
    item: Item | None = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import FastAPI, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None


@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: Union[str, None] = None,
    item: Union[Item, None] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

Example 3 (python):
```python
from fastapi import FastAPI, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(title="The ID of the item to get", ge=0, le=1000),
    q: str | None = None,
    item: Item | None = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI, Path
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None


@app.put("/items/{item_id}")
async def update_item(
    *,
    item_id: int = Path(title="The ID of the item to get", ge=0, le=1000),
    q: Union[str, None] = None,
    item: Union[Item, None] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

---

## Extra Models¶

**URL:** https://fastapi.tiangolo.com/tutorial/extra-models/

**Contents:**
- Extra Models¶
- Multiple models¶
  - About **user_in.model_dump()¶
    - Pydantic's .model_dump()¶
    - Unpacking a dict¶
    - A Pydantic model from the contents of another¶
    - Unpacking a dict and extra keywords¶
- Reduce duplication¶
- Union or anyOf¶
  - Union in Python 3.10¶

Continuing with the previous example, it will be common to have more than one related model.

This is especially the case for user models, because:

Never store user's plaintext passwords. Always store a "secure hash" that you can then verify.

If you don't know, you will learn what a "password hash" is in the security chapters.

Here's a general idea of how the models could look like with their password fields and the places where they are used:

user_in is a Pydantic model of class UserIn.

Pydantic models have a .model_dump() method that returns a dict with the model's data.

So, if we create a Pydantic object user_in like:

we now have a dict with the data in the variable user_dict (it's a dict instead of a Pydantic model object).

we would get a Python dict with:

If we take a dict like user_dict and pass it to a function (or class) with **user_dict, Python will "unpack" it. It will pass the keys and values of the user_dict directly as key-value arguments.

So, continuing with the user_dict from above, writing:

would result in something equivalent to:

Or more exactly, using user_dict directly, with whatever contents it might have in the future:

As in the example above we got user_dict from user_in.model_dump(), this code:

would be equivalent to:

...because user_in.model_dump() is a dict, and then we make Python "unpack" it by passing it to UserInDB prefixed with **.

So, we get a Pydantic model from the data in another Pydantic model.

And then adding the extra keyword argument hashed_password=hashed_password, like in:

...ends up being like:

The supporting additional functions fake_password_hasher and fake_save_user are just to demo a possible flow of the data, but they of course are not providing any real security.

Reducing code duplication is one of the core ideas in FastAPI.

As code duplication increments the chances of bugs, security issues, code desynchronization issues (when you update in one place but not in the others), etc.

And these models are all sharing a lot of the data and duplicating attribute names and types.

We can declare a UserBase model that serves as a base for our other models. And then we can make subclasses of that model that inherit its attributes (type declarations, validation, etc).

All the data conversion, validation, documentation, etc. will still work as normally.

That way, we can declare just the differences between the models (with plaintext password, with hashed_password and without password):

You can declare a response to be the Union of two or more types, that means, that the response would be any of them.

It will be defined in OpenAPI with anyOf.

To do that, use the standard Python type hint typing.Union:

When defining a Union, include the most specific type first, followed by the less specific type. In the example below, the more specific PlaneItem comes before CarItem in Union[PlaneItem, CarItem].

In this example we pass Union[PlaneItem, CarItem] as the value of the argument response_model.

Because we are passing it as a value to an argument instead of putting it in a type annotation, we have to use Union even in Python 3.10.

If it was in a type annotation we could have used the vertical bar, as:

But if we put that in the assignment response_model=PlaneItem | CarItem we would get an error, because Python would try to perform an invalid operation between PlaneItem and CarItem instead of interpreting that as a type annotation.

The same way, you can declare responses of lists of objects.

For that, use the standard Python typing.List (or just list in Python 3.9 and above):

You can also declare a response using a plain arbitrary dict, declaring just the type of the keys and values, without using a Pydantic model.

This is useful if you don't know the valid field/attribute names (that would be needed for a Pydantic model) beforehand.

In this case, you can use typing.Dict (or just dict in Python 3.9 and above):

Use multiple Pydantic models and inherit freely for each case.

You don't need to have a single data model per entity if that entity must be able to have different "states". As the case with the user "entity" with a state including password, password_hash and no password.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()


class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: str | None = None


class UserOut(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None


class UserInDB(BaseModel):
    username: str
    hashed_password: str
    email: EmailStr
    full_name: str | None = None


def fake_password_hasher(raw_password: str):
    return "supersecret" + raw_password


def fake_save_user(user_in: UserIn):
    hashed_password = fake_password_hasher(user_in.password)
    user_in_db = UserInDB(**user_in.model_dump(), hashed_password=hashed_password)
    print("User saved! ..not really")
    return user_in_db


@app.post("/user/", response_model=UserOut)
async def create_user(user_in: UserIn):
    user_saved = fake_save_user(user_in)
    return user_saved
```

Example 2 (python):
```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()


class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: Union[str, None] = None


class UserOut(BaseModel):
    username: str
    email: EmailStr
    full_name: Union[str, None] = None


class UserInDB(BaseModel):
    username: str
    hashed_password: str
    email: EmailStr
    full_name: Union[str, None] = None


def fake_password_hasher(raw_password: str):
    return "supersecret" + raw_password


def fake_save_user(user_in: UserIn):
    hashed_password = fake_password_hasher(user_in.password)
    user_in_db = UserInDB(**user_in.model_dump(), hashed_password=hashed_password)
    print("User saved! ..not really")
    return user_in_db


@app.post("/user/", response_model=UserOut)
async def create_user(user_in: UserIn):
    user_saved = fake_save_user(user_in)
    return user_saved
```

Example 3 (python):
```python
user_in = UserIn(username="john", password="secret", email="john.doe@example.com")
```

Example 4 (unknown):
```unknown
user_dict = user_in.model_dump()
```

---

## Path Parameters and Numeric Validations¶

**URL:** https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/

**Contents:**
- Path Parameters and Numeric Validations¶
- Import Path¶
- Declare metadata¶
- Order the parameters as you need¶
- Order the parameters as you need, tricks¶
  - Better with Annotated¶
- Number validations: greater than or equal¶
- Number validations: greater than and less than or equal¶
- Number validations: floats, greater than and less than¶
- Recap¶

In the same way that you can declare more validations and metadata for query parameters with Query, you can declare the same type of validations and metadata for path parameters with Path.

First, import Path from fastapi, and import Annotated:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

FastAPI added support for Annotated (and started recommending it) in version 0.95.0.

If you have an older version, you would get errors when trying to use Annotated.

Make sure you Upgrade the FastAPI version to at least 0.95.1 before using Annotated.

You can declare all the same parameters as for Query.

For example, to declare a title metadata value for the path parameter item_id you can type:

Prefer to use the Annotated version if possible.

Prefer to use the Annotated version if possible.

A path parameter is always required as it has to be part of the path. Even if you declared it with None or set a default value, it would not affect anything, it would still be always required.

This is probably not as important or necessary if you use Annotated.

Let's say that you want to declare the query parameter q as a required str.

And you don't need to declare anything else for that parameter, so you don't really need to use Query.

But you still need to use Path for the item_id path parameter. And you don't want to use Annotated for some reason.

Python will complain if you put a value with a "default" before a value that doesn't have a "default".

But you can re-order them, and have the value without a default (the query parameter q) first.

It doesn't matter for FastAPI. It will detect the parameters by their names, types and default declarations (Query, Path, etc), it doesn't care about the order.

So, you can declare your function as:

But keep in mind that if you use Annotated, you won't have this problem, it won't matter as you're not using the function parameter default values for Query() or Path().

Prefer to use the Annotated version if possible.

This is probably not as important or necessary if you use Annotated.

Here's a small trick that can be handy, but you won't need it often.

...Python has a little special syntax for that.

Pass *, as the first parameter of the function.

Python won't do anything with that *, but it will know that all the following parameters should be called as keyword arguments (key-value pairs), also known as kwargs. Even if they don't have a default value.

Keep in mind that if you use Annotated, as you are not using function parameter default values, you won't have this problem, and you probably won't need to use *.

Prefer to use the Annotated version if possible.

With Query and Path (and others you'll see later) you can declare number constraints.

Here, with ge=1, item_id will need to be an integer number "greater than or equal" to 1.

Prefer to use the Annotated version if possible.

The same applies for:

Prefer to use the Annotated version if possible.

Number validations also work for float values.

Here's where it becomes important to be able to declare gt and not just ge. As with it you can require, for example, that a value must be greater than 0, even if it is less than 1.

So, 0.5 would be a valid value. But 0.0 or 0 would not.

Prefer to use the Annotated version if possible.

With Query, Path (and others you haven't seen yet) you can declare metadata and string validations in the same ways as with Query Parameters and String Validations.

And you can also declare numeric validations:

Query, Path, and other classes you will see later are subclasses of a common Param class.

All of them share the same parameters for additional validation and metadata you have seen.

When you import Query, Path and others from fastapi, they are actually functions.

That when called, return instances of classes of the same name.

So, you import Query, which is a function. And when you call it, it returns an instance of a class also named Query.

These functions are there (instead of just using the classes directly) so that your editor doesn't mark errors about their types.

That way you can use your normal editor and coding tools without having to add custom configurations to disregard those errors.

**Examples:**

Example 1 (python):
```python
from typing import Annotated

from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: Annotated[str | None, Query(alias="item-query")] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

Example 2 (python):
```python
from typing import Annotated, Union

from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: Annotated[Union[str, None], Query(alias="item-query")] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

Example 3 (python):
```python
from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(title="The ID of the item to get"),
    q: str | None = Query(default=None, alias="item-query"),
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

Example 4 (python):
```python
from typing import Union

from fastapi import FastAPI, Path, Query

app = FastAPI()


@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(title="The ID of the item to get"),
    q: Union[str, None] = Query(default=None, alias="item-query"),
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

---
