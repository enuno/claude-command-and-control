# Fastapi - Database

**Pages:** 3

---

## Return a Response Directly¶

**URL:** https://fastapi.tiangolo.com/advanced/response-directly/

**Contents:**
- Return a Response Directly¶
- Return a Response¶
- Using the jsonable_encoder in a Response¶
- Returning a custom Response¶
- Notes¶

When you create a FastAPI path operation you can normally return any data from it: a dict, a list, a Pydantic model, a database model, etc.

By default, FastAPI would automatically convert that return value to JSON using the jsonable_encoder explained in JSON Compatible Encoder.

Then, behind the scenes, it would put that JSON-compatible data (e.g. a dict) inside of a JSONResponse that would be used to send the response to the client.

But you can return a JSONResponse directly from your path operations.

It might be useful, for example, to return custom headers or cookies.

In fact, you can return any Response or any sub-class of it.

JSONResponse itself is a sub-class of Response.

And when you return a Response, FastAPI will pass it directly.

It won't do any data conversion with Pydantic models, it won't convert the contents to any type, etc.

This gives you a lot of flexibility. You can return any data type, override any data declaration or validation, etc.

Because FastAPI doesn't make any changes to a Response you return, you have to make sure its contents are ready for it.

For example, you cannot put a Pydantic model in a JSONResponse without first converting it to a dict with all the data types (like datetime, UUID, etc) converted to JSON-compatible types.

For those cases, you can use the jsonable_encoder to convert your data before passing it to a response:

You could also use from starlette.responses import JSONResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

The example above shows all the parts you need, but it's not very useful yet, as you could have just returned the item directly, and FastAPI would put it in a JSONResponse for you, converting it to a dict, etc. All that by default.

Now, let's see how you could use that to return a custom response.

Let's say that you want to return an XML response.

You could put your XML content in a string, put that in a Response, and return it:

When you return a Response directly its data is not validated, converted (serialized), or documented automatically.

But you can still document it as described in Additional Responses in OpenAPI.

You can see in later sections how to use/declare these custom Responses while still having automatic data conversion, documentation, etc.

**Examples:**

Example 1 (python):
```python
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class Item(BaseModel):
    title: str
    timestamp: datetime
    description: str | None = None


app = FastAPI()


@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    return JSONResponse(content=json_compatible_item_data)
```

Example 2 (python):
```python
from datetime import datetime
from typing import Union

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class Item(BaseModel):
    title: str
    timestamp: datetime
    description: Union[str, None] = None


app = FastAPI()


@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    return JSONResponse(content=json_compatible_item_data)
```

Example 3 (python):
```python
from fastapi import FastAPI, Response

app = FastAPI()


@app.get("/legacy/")
def get_legacy_data():
    data = """<?xml version="1.0"?>
    <shampoo>
    <Header>
        Apply shampoo here.
    </Header>
    <Body>
        You'll have to use soap here.
    </Body>
    </shampoo>
    """
    return Response(content=data, media_type="application/xml")
```

---

## Response Cookies¶

**URL:** https://fastapi.tiangolo.com/advanced/response-cookies/

**Contents:**
- Response Cookies¶
- Use a Response parameter¶
- Return a Response directly¶
  - More info¶

You can declare a parameter of type Response in your path operation function.

And then you can set cookies in that temporal response object.

And then you can return any object you need, as you normally would (a dict, a database model, etc).

And if you declared a response_model, it will still be used to filter and convert the object you returned.

FastAPI will use that temporal response to extract the cookies (also headers and status code), and will put them in the final response that contains the value you returned, filtered by any response_model.

You can also declare the Response parameter in dependencies, and set cookies (and headers) in them.

You can also create cookies when returning a Response directly in your code.

To do that, you can create a response as described in Return a Response Directly.

Then set Cookies in it, and then return it:

Keep in mind that if you return a response directly instead of using the Response parameter, FastAPI will return it directly.

So, you will have to make sure your data is of the correct type. E.g. it is compatible with JSON, if you are returning a JSONResponse.

And also that you are not sending any data that should have been filtered by a response_model.

You could also use from starlette.responses import Response or from starlette.responses import JSONResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

And as the Response can be used frequently to set headers and cookies, FastAPI also provides it at fastapi.Response.

To see all the available parameters and options, check the documentation in Starlette.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI, Response

app = FastAPI()


@app.post("/cookie-and-object/")
def create_cookie(response: Response):
    response.set_cookie(key="fakesession", value="fake-cookie-session-value")
    return {"message": "Come to the dark side, we have cookies"}
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.post("/cookie/")
def create_cookie():
    content = {"message": "Come to the dark side, we have cookies"}
    response = JSONResponse(content=content)
    response.set_cookie(key="fakesession", value="fake-cookie-session-value")
    return response
```

---

## Response Headers¶

**URL:** https://fastapi.tiangolo.com/advanced/response-headers/

**Contents:**
- Response Headers¶
- Use a Response parameter¶
- Return a Response directly¶
- Custom Headers¶

You can declare a parameter of type Response in your path operation function (as you can do for cookies).

And then you can set headers in that temporal response object.

And then you can return any object you need, as you normally would (a dict, a database model, etc).

And if you declared a response_model, it will still be used to filter and convert the object you returned.

FastAPI will use that temporal response to extract the headers (also cookies and status code), and will put them in the final response that contains the value you returned, filtered by any response_model.

You can also declare the Response parameter in dependencies, and set headers (and cookies) in them.

You can also add headers when you return a Response directly.

Create a response as described in Return a Response Directly and pass the headers as an additional parameter:

You could also use from starlette.responses import Response or from starlette.responses import JSONResponse.

FastAPI provides the same starlette.responses as fastapi.responses just as a convenience for you, the developer. But most of the available responses come directly from Starlette.

And as the Response can be used frequently to set headers and cookies, FastAPI also provides it at fastapi.Response.

Keep in mind that custom proprietary headers can be added using the X- prefix.

But if you have custom headers that you want a client in a browser to be able to see, you need to add them to your CORS configurations (read more in CORS (Cross-Origin Resource Sharing)), using the parameter expose_headers documented in Starlette's CORS docs.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI, Response

app = FastAPI()


@app.get("/headers-and-object/")
def get_headers(response: Response):
    response.headers["X-Cat-Dog"] = "alone in the world"
    return {"message": "Hello World"}
```

Example 2 (python):
```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.get("/headers/")
def get_headers():
    content = {"message": "Hello World"}
    headers = {"X-Cat-Dog": "alone in the world", "Content-Language": "en-US"}
    return JSONResponse(content=content, headers=headers)
```

---
