---
title: Shotstack v1
language_tabs:
  - shell: Curl
  - http: HTTP
  - javascript--nodejs: NodeJS
  - php: PHP
  - ruby: Ruby
  - python: Python
  - java: Java
  - go: Go
language_clients:
  - shell: ""
  - http: ""
  - javascript--nodejs: ""
  - php: ""
  - ruby: ""
  - python: ""
  - java: ""
  - go: ""
toc_footers: []
includes: []
search: true
highlight_theme: dracula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="shotstack">Shotstack v1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

<p>Shotstack is a video editing service that allows for the automated creation of videos using JSON. You can configure an edit and POST it to the API which will render your video and provide a file location when complete. For more details visit [shotstack.io](https://shotstack.io) or checkout our [getting started](https://shotstack.gitbook.io/docs/guides/getting-started) documentation. </p> <p> There are two main API's, one for editing videos and images (Edit API) and one for managing hosted assets (Serve API). </p> <p> The Edit API base URL is: <b>https://api.shotstack.io/{version}</b> </p> <p> The Serve API base URL is: <b>https://api.shotstack.io/serve/{version}</b> </p>

Base URLs:

* <a href="https://api.shotstack.io/{version}">https://api.shotstack.io/{version}</a>

    * **version** - Set the stage to `v1` for production usage without watermarks. Set to `stage` to use the development sandbox. Default: v1

        * v1

        * stage

* <a href="https://api.shotstack.io/serve/{version}">https://api.shotstack.io/serve/{version}</a>

    * **version** - Set the stage to `v1` for production usage. Set to `stage` to use the development sandbox. Default: v1

        * v1

        * stage

# Authentication

* API Key (DeveloperKey)
    - Parameter Name: **x-api-key**, in: header. Set the **x-api-key** header with your provided key for the correct environment (v1 or stage). Include the header in all calls to the API that are secured with a key.

<h1 id="shotstack-edit">Edit</h1>

## Render Video

<a id="opIdpostRender"></a>

> Code samples

```shell
# You can also use wget
curl -X POST https://api.shotstack.io/{version}/render \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'x-api-key: API_KEY'

```

```http
POST https://api.shotstack.io/{version}/render HTTP/1.1
Host: api.shotstack.io
Content-Type: application/json
Accept: application/json

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "timeline": {
    "soundtrack": {
      "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
      "effect": "fadeIn",
      "volume": 1
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
              "trim": 2,
              "volume": 1,
              "crop": {
                "top": 0.15,
                "bottom": 0.15,
                "left": 0,
                "right": 0
              }
            },
            "start": 2,
            "length": 5,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": 0.1,
              "y": -0.2
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "greyscale",
            "opacity": 1
          }
        ]
      }
    ],
    "cache": true
  },
  "output": {
    "format": "mp4",
    "resolution": "sd",
    "aspectRatio": "16:9",
    "fps": 25,
    "scaleTo": "preview",
    "range": {
      "start": 3,
      "length": 6
    },
    "poster": {
      "capture": 1
    },
    "thumbnail": {
      "capture": 1,
      "scale": 0.3
    }
  },
  "callback": "https://my-server.com/callback.php",
  "disk": "local"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'x-api-key':'API_KEY'
};

fetch('https://api.shotstack.io/{version}/render',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'x-api-key' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.shotstack.io/{version}/render', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'x-api-key' => 'API_KEY'
}

result = RestClient.post 'https://api.shotstack.io/{version}/render',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'x-api-key': 'API_KEY'
}

r = requests.post('https://api.shotstack.io/{version}/render', headers = headers)

print(r.json())

```

```java
URL obj = new URL("https://api.shotstack.io/{version}/render");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "x-api-key": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.shotstack.io/{version}/render", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /render`

Queue and render the contents of a timeline as a video file.

> Body parameter

```json
{
  "timeline": {
    "soundtrack": {
      "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
      "effect": "fadeIn",
      "volume": 1
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
              "trim": 2,
              "volume": 1,
              "crop": {
                "top": 0.15,
                "bottom": 0.15,
                "left": 0,
                "right": 0
              }
            },
            "start": 2,
            "length": 5,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": 0.1,
              "y": -0.2
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "greyscale",
            "opacity": 1
          }
        ]
      }
    ],
    "cache": true
  },
  "output": {
    "format": "mp4",
    "resolution": "sd",
    "aspectRatio": "16:9",
    "fps": 25,
    "scaleTo": "preview",
    "range": {
      "start": 3,
      "length": 6
    },
    "poster": {
      "capture": 1
    },
    "thumbnail": {
      "capture": 1,
      "scale": 0.3
    }
  },
  "callback": "https://my-server.com/callback.php",
  "disk": "local"
}
```

<h3 id="render-video-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Edit](#schemaedit)|true|The video edit specified using JSON.|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Created",
  "response": {
    "message": "Render Successfully Queued",
    "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7"
  }
}
```

<h3 id="render-video-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The queued video details|[QueuedResponse](#schemaqueuedresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

## Get Render Status

<a id="opIdgetRender"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.shotstack.io/{version}/render/{id} \
  -H 'Accept: application/json' \
  -H 'x-api-key: API_KEY'

```

```http
GET https://api.shotstack.io/{version}/render/{id} HTTP/1.1
Host: api.shotstack.io
Accept: application/json

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'x-api-key':'API_KEY'
};

fetch('https://api.shotstack.io/{version}/render/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'x-api-key' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.shotstack.io/{version}/render/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'x-api-key' => 'API_KEY'
}

result = RestClient.get 'https://api.shotstack.io/{version}/render/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'x-api-key': 'API_KEY'
}

r = requests.get('https://api.shotstack.io/{version}/render/{id}', headers = headers)

print(r.json())

```

```java
URL obj = new URL("https://api.shotstack.io/{version}/render/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "x-api-key": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.shotstack.io/{version}/render/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /render/{id}`

Get the rendering status, video url and details of a timeline by ID.

<h3 id="get-render-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The id of the timeline render task in UUID format|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "OK",
  "response": {
    "status": "rendering",
    "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
    "owner": "5ca6hu7s9k",
    "url": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
    "data": {
      "timeline": {
        "soundtrack": {
          "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
          "effect": "fadeInFadeOut"
        },
        "background": "#000000",
        "tracks": [
          {
            "clips": [
              {
                "asset": {
                  "type": "title",
                  "text": "Hello World",
                  "style": "minimal"
                },
                "start": 0,
                "length": 4,
                "transition": {
                  "in": "fade",
                  "out": "fade"
                },
                "effect": "slideRight"
              },
              {
                "asset": {
                  "type": "image",
                  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/my-image.jpg"
                },
                "start": 3,
                "length": 4,
                "effect": "zoomIn",
                "filter": "greyscale"
              }
            ]
          },
          {
            "clips": [
              {
                "asset": {
                  "type": "video",
                  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/my-clip-1.mp4",
                  "trim": 10.5
                },
                "start": 7,
                "length": 4.5
              },
              {
                "asset": {
                  "type": "video",
                  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/my-clip-2.mp4",
                  "volume": 0.5
                },
                "start": 11.5,
                "length": 5,
                "transition": {
                  "out": "wipeLeft"
                }
              }
            ]
          }
        ]
      },
      "output": {
        "format": "mp4",
        "resolution": "sd"
      }
    },
    "created": "2020-10-30T09:42:29.446Z",
    "updated": "2020-10-30T09:42:39.168Z"
  }
}
```

<h3 id="get-render-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|The render status details|[RenderResponse](#schemarenderresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

<h1 id="shotstack-serve">Serve</h1>

## Get Asset

<a id="opIdgetAsset"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.shotstack.io/serve/{version}/assets/{id} \
  -H 'Accept: application/json' \
  -H 'x-api-key: API_KEY'

```

```http
GET https://api.shotstack.io/serve/{version}/assets/{id} HTTP/1.1
Host: api.shotstack.io
Accept: application/json

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'x-api-key':'API_KEY'
};

fetch('https://api.shotstack.io/serve/{version}/assets/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'x-api-key' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.shotstack.io/serve/{version}/assets/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'x-api-key' => 'API_KEY'
}

result = RestClient.get 'https://api.shotstack.io/serve/{version}/assets/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'x-api-key': 'API_KEY'
}

r = requests.get('https://api.shotstack.io/serve/{version}/assets/{id}', headers = headers)

print(r.json())

```

```java
URL obj = new URL("https://api.shotstack.io/serve/{version}/assets/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "x-api-key": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.shotstack.io/serve/{version}/assets/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /assets/{id}`

The Serve API is used to interact with, and delete hosted assets including videos, images, audio files,  thumbnails and poster images. Use this endpoint to fetch an asset by asset id. Note that an asset id is unique for each asset and different from the render id.

<h3 id="get-asset-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The id of the asset in UUID format|

> Example responses

> 200 Response

```json
{
  "response": {
    "data": {
      "type": "asset",
      "attributes": {
        "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
        "owner": "5ca6hu7s9k",
        "region": "au",
        "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
        "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
        "url": "https://cdn.shotstack.io/au/v1/msgtwx8iw6/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
        "status": "ready",
        "created": "2021-05-06T03:33:48.600Z",
        "updated": "2021-05-06T03:33:49.521Z"
      }
    }
  }
}
```

<h3 id="get-asset-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Get asset by asset id|[AssetResponse](#schemaassetresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

## Delete Asset

<a id="opIddeleteAsset"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.shotstack.io/serve/{version}/assets/{id} \
  -H 'x-api-key: API_KEY'

```

```http
DELETE https://api.shotstack.io/serve/{version}/assets/{id} HTTP/1.1
Host: api.shotstack.io

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'x-api-key':'API_KEY'
};

fetch('https://api.shotstack.io/serve/{version}/assets/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'x-api-key' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.shotstack.io/serve/{version}/assets/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'x-api-key' => 'API_KEY'
}

result = RestClient.delete 'https://api.shotstack.io/serve/{version}/assets/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'x-api-key': 'API_KEY'
}

r = requests.delete('https://api.shotstack.io/serve/{version}/assets/{id}', headers = headers)

print(r.json())

```

```java
URL obj = new URL("https://api.shotstack.io/serve/{version}/assets/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "x-api-key": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.shotstack.io/serve/{version}/assets/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /assets/{id}`

Delete an asset by its asset id. If a render creates multiple assets, such as thumbnail and poster images, each asset must be deleted individually by the asset id.

<h3 id="delete-asset-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The id of the asset in UUID format|

<h3 id="delete-asset-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|An empty response signifying the asset has been deleted|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

## Get Asset by Render ID

<a id="opIdgetAssetByRenderId"></a>

> Code samples

```shell
# You can also use wget
curl -X GET https://api.shotstack.io/serve/{version}/assets/render/{id} \
  -H 'Accept: application/json' \
  -H 'x-api-key: API_KEY'

```

```http
GET https://api.shotstack.io/serve/{version}/assets/render/{id} HTTP/1.1
Host: api.shotstack.io
Accept: application/json

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'x-api-key':'API_KEY'
};

fetch('https://api.shotstack.io/serve/{version}/assets/render/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'x-api-key' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.shotstack.io/serve/{version}/assets/render/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'x-api-key' => 'API_KEY'
}

result = RestClient.get 'https://api.shotstack.io/serve/{version}/assets/render/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'x-api-key': 'API_KEY'
}

r = requests.get('https://api.shotstack.io/serve/{version}/assets/render/{id}', headers = headers)

print(r.json())

```

```java
URL obj = new URL("https://api.shotstack.io/serve/{version}/assets/render/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "x-api-key": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.shotstack.io/serve/{version}/assets/render/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /assets/render/{id}`

A render may generate more than one file, such as a video, thumbnail and poster image. When the assets are created the only known id is the render id returned by the original [render request](#render-video), status  request or webhook. This endpoint lets you look up one or more assets by the render id.

<h3 id="get-asset-by-render-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The render id associated with the asset in UUID format|

> Example responses

> 200 Response

```json
{
  "response": {
    "data": [
      {
        "type": "asset",
        "attributes": {
          "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
          "owner": "5ca6hu7s9k",
          "region": "au",
          "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
          "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
          "url": "https://cdn.shotstack.io/au/v1/msgtwx8iw6/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
          "status": "ready",
          "created": "2021-05-06T03:33:48.600Z",
          "updated": "2021-05-06T03:33:49.521Z"
        }
      }
    ]
  }
}
```

<h3 id="get-asset-by-render-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Get one or more assets by render id|[AssetRenderResponse](#schemaassetrenderresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

# Schemas

<h2 id="tocS_Edit">Edit</h2>
<!-- backwards compatibility -->
<a id="schemaedit"></a>
<a id="schema_Edit"></a>
<a id="tocSedit"></a>
<a id="tocsedit"></a>

```json
{
  "timeline": {
    "soundtrack": {
      "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
      "effect": "fadeIn",
      "volume": 1
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
              "trim": 2,
              "volume": 1,
              "crop": {
                "top": 0.15,
                "bottom": 0.15,
                "left": 0,
                "right": 0
              }
            },
            "start": 2,
            "length": 5,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": 0.1,
              "y": -0.2
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "greyscale",
            "opacity": 1
          }
        ]
      }
    ],
    "cache": true
  },
  "output": {
    "format": "mp4",
    "resolution": "sd",
    "aspectRatio": "16:9",
    "fps": 25,
    "scaleTo": "preview",
    "range": {
      "start": 3,
      "length": 6
    },
    "poster": {
      "capture": 1
    },
    "thumbnail": {
      "capture": 1,
      "scale": 0.3
    }
  },
  "callback": "https://my-server.com/callback.php",
  "disk": "local"
}

```

An edit defines the content of the video in a timeline and the output format.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeline|[Timeline](#schematimeline)|true|none|A timeline represents the contents of a video edit over time, in seconds. A timeline consists of layers called tracks. Tracks are composed of titles, images or video segments referred to as clips which are placed along the track at specific starting point and lasting for a specific amount of time.|
|output|[Output](#schemaoutput)|true|none|The output format, render range and type of media to generate.|
|callback|string|false|none|An optional webhook callback URL used to receive status notifications when a render completes or fails. See [webhooks](https://shotstack.gitbook.io/docs/guides/architecting-an-application/webhooks) for  more details.|
|disk|string|false|none|The disk type to use for storing footage and assets for each render. See [disk types](https://shotstack.gitbook.io/docs/guides/architecting-an-application/disk-types) for more details. <ul><br>  <li>`local` - optimised for high speed rendering with up to 512MB storage</li><br>  <li>`mount` - optimised for larger file sizes and longer videos with 5GB for source footage and 512MB for output render</li><br></ul>|

#### Enumerated Values

|Property|Value|
|---|---|
|disk|local|
|disk|mount|

<h2 id="tocS_Timeline">Timeline</h2>
<!-- backwards compatibility -->
<a id="schematimeline"></a>
<a id="schema_Timeline"></a>
<a id="tocStimeline"></a>
<a id="tocstimeline"></a>

```json
{
  "soundtrack": {
    "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
    "effect": "fadeIn",
    "volume": 1
  },
  "background": "#000000",
  "fonts": [
    {
      "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
    }
  ],
  "tracks": [
    {
      "clips": [
        {
          "asset": {
            "type": "video",
            "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
            "trim": 2,
            "volume": 1,
            "crop": {
              "top": 0.15,
              "bottom": 0.15,
              "left": 0,
              "right": 0
            }
          },
          "start": 2,
          "length": 5,
          "fit": "crop",
          "scale": 0,
          "position": "center",
          "offset": {
            "x": 0.1,
            "y": -0.2
          },
          "transition": {
            "in": "fade",
            "out": "fade"
          },
          "effect": "zoomIn",
          "filter": "greyscale",
          "opacity": 1
        }
      ]
    }
  ],
  "cache": true
}

```

A timeline represents the contents of a video edit over time, in seconds. A timeline consists of layers called tracks. Tracks are composed of titles, images or video segments referred to as clips which are placed along the track at specific starting point and lasting for a specific amount of time.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|soundtrack|[Soundtrack](#schemasoundtrack)|false|none|A music or audio soundtrack file in mp3 format.|
|background|string|false|none|A hexadecimal value for the timeline background colour. Defaults to #000000 (black).|
|fonts|[[Font](#schemafont)]|false|none|An array of custom fonts to be downloaded for use by the HTML assets.|
|tracks|[[Track](#schematrack)]|true|none|A timeline consists of an array of tracks, each track containing clips. Tracks are layered on top of each other in the same order they are added to the array with the top most track layered over the top of those below it. Ensure that a track containing titles is the top most track so that it is displayed above videos and images.|
|cache|boolean|false|none|Disable the caching of ingested source footage and assets. See  [caching](https://shotstack.gitbook.io/docs/guides/architecting-an-application/caching) for more details.|

<h2 id="tocS_Soundtrack">Soundtrack</h2>
<!-- backwards compatibility -->
<a id="schemasoundtrack"></a>
<a id="schema_Soundtrack"></a>
<a id="tocSsoundtrack"></a>
<a id="tocssoundtrack"></a>

```json
{
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
  "effect": "fadeIn",
  "volume": 1
}

```

A music or audio file in mp3 format that plays for the duration of the rendered video or the length of the audio file, which ever is shortest.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|src|string|true|none|The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.|
|effect|string|false|none|The effect to apply to the audio file <ul><br>  <li>`fadeIn` - fade volume in only</li><br>  <li>`fadeOut` - fade volume out only</li><br>  <li>`fadeInFadeOut` - fade volume in and out</li><br></ul>|
|volume|number|false|none|Set the volume for the soundtrack between 0 and 1 where 0 is muted and 1 is full volume (defaults to 1).|

#### Enumerated Values

|Property|Value|
|---|---|
|effect|fadeIn|
|effect|fadeOut|
|effect|fadeInFadeOut|

<h2 id="tocS_Track">Track</h2>
<!-- backwards compatibility -->
<a id="schematrack"></a>
<a id="schema_Track"></a>
<a id="tocStrack"></a>
<a id="tocstrack"></a>

```json
{
  "clips": [
    {
      "asset": {
        "type": "video",
        "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
        "trim": 2,
        "volume": 1,
        "crop": {
          "top": 0.15,
          "bottom": 0.15,
          "left": 0,
          "right": 0
        }
      },
      "start": 2,
      "length": 5,
      "fit": "crop",
      "scale": 0,
      "position": "center",
      "offset": {
        "x": 0.1,
        "y": -0.2
      },
      "transition": {
        "in": "fade",
        "out": "fade"
      },
      "effect": "zoomIn",
      "filter": "greyscale",
      "opacity": 1
    }
  ]
}

```

A track contains an array of clips. Tracks are layered on top of each other in the order in the array. The top most track will render on top of those below it.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|clips|[[Clip](#schemaclip)]|true|none|An array of Clips comprising of TitleClip, ImageClip or VideoClip.|

<h2 id="tocS_Clip">Clip</h2>
<!-- backwards compatibility -->
<a id="schemaclip"></a>
<a id="schema_Clip"></a>
<a id="tocSclip"></a>
<a id="tocsclip"></a>

```json
{
  "asset": {
    "type": "video",
    "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
    "trim": 2,
    "volume": 1,
    "crop": {
      "top": 0.15,
      "bottom": 0.15,
      "left": 0,
      "right": 0
    }
  },
  "start": 2,
  "length": 5,
  "fit": "crop",
  "scale": 0,
  "position": "center",
  "offset": {
    "x": 0.1,
    "y": -0.2
  },
  "transition": {
    "in": "fade",
    "out": "fade"
  },
  "effect": "zoomIn",
  "filter": "greyscale",
  "opacity": 1
}

```

A clip is a container for a specific type of asset, i.e. a title, image, video, audio or html. You use a Clip to define when an asset will display on the timeline, how long it will play for and transitions, filters and effects to apply to it.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|asset|any|true|none|The type of asset to display for the duration of this Clip. Value must be one of <b>TitleAsset</b>, <b>ImageAsset</b>, <b>VideoAsset</b>, <b>HtmlAsset</b>, <b>AudioAsset</b> or <b>LumaAsset</b>|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[VideoAsset](#schemavideoasset)|false|none|The VideoAsset is used to create video sequences from video files. The src must be a publicly accessible URL to a video resource such as an mp4 file.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ImageAsset](#schemaimageasset)|false|none|The ImageAsset is used to create video from images. The src must be a publicly accessible URL to an image resource such as a jpg or png file.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[TitleAsset](#schematitleasset)|false|none|The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[HtmlAsset](#schemahtmlasset)|false|none|The HtmlAsset clip type lets you create text based layout and formatting using HTML and CSS. You can also set the height and width of a bounding box for the HTML content to sit within. Text and elements will wrap within the bounding box.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[AudioAsset](#schemaaudioasset)|false|none|The AudioAsset is used to add sound effects and audio at specific intervals on the timeline. The src must be a publicly accessible URL to an audio resource such  as an mp3 file.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[LumaAsset](#schemalumaasset)|false|none|The LumaAsset is used to create luma matte transitions between other assets. A luma matte is  a grey scale animated video where the black areas are transparent and the white areas solid. The luma matte animation should be provided as an mp4 video file. The src must be a publicly  accessible URL to the file.|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|start|number|true|none|The start position of the Clip on the timeline, in seconds.|
|length|number|true|none|The length, in seconds, the Clip should play for.|
|fit|string|false|none|Set how the asset should be scaled to fit the viewport using one of the following options: <br>  <ul><br>    <li>`cover` - stretch the asset to fill the viewport without maintaining the aspect ratio.</li><br>    <li>`contain` - fit the entire asset within the viewport while maintaining the original aspect ratio.</li><br>    <li>`crop` - scale the asset to fill the viewport while maintaining the aspect ratio. The asset will be cropped if it exceeds the bounds of the viewport.</li><br>    <li>`none` - preserves the original asset dimensions and does not apply any scaling.</li><br>  </ul>|
|scale|number|false|none|Scale the asset to a fraction of the viewport size - i.e. setting the scale to 0.5 will scale asset to half the size of the viewport. This is useful for picture-in-picture video and  scaling images such as logos and watermarks.|
|position|string|false|none|Place the asset in one of nine predefined positions of the viewport. This is most effective for when the asset is scaled and you want to position the element to a specific position. <ul><br>  <li>`top` - top (center)</li><br>  <li>`topRight` - top right</li><br>  <li>`right` - right (center)</li><br>  <li>`bottomRight` - bottom right</li><br>  <li>`bottom` - bottom (center)</li><br>  <li>`bottomLeft` - bottom left</li><br>  <li>`left` - left (center)</li><br>  <li>`topLeft` - top left</li><br>  <li>`center` - center</li><br></ul>|
|offset|[Offset](#schemaoffset)|false|none|Offset the location of the asset relative to its position on the viewport. The offset distance is relative to the width of the viewport - for example an x offset of 0.5 will move the asset half the viewport width to the right.|
|transition|[Transition](#schematransition)|false|none|In and out transitions for a clip - i.e. fade in and fade out|
|effect|string|false|none|A motion effect to apply to the Clip. <ul><br>  <li>`zoomIn` - slow zoom in</li><br>  <li>`zoomOut` - slow zoom out</li><br>  <li>`slideLeft` - slow slide (pan) left</li><br>  <li>`slideRight` - slow slide (pan) right</li><br>  <li>`slideUp` - slow slide (pan) up</li><br>  <li>`slideDown` - slow slide (pan) down</li><br></ul>|
|filter|string|false|none|A filter effect to apply to the Clip. <ul><br>  <li>`boost` - boost contrast and saturation</li><br>  <li>`contrast` - increase contrast</li><br>  <li>`darken` - darken the scene</li><br>  <li>`greyscale` - remove colour</li><br>  <li>`lighten` - lighten the scene</li><br>  <li>`muted` - reduce saturation and contrast</li><br>  <li>`invert` - invert colors</li><br></ul>|
|opacity|number|false|none|Sets the opacity of the Clip where 1 is opaque and 0 is transparent.|

#### Enumerated Values

|Property|Value|
|---|---|
|fit|cover|
|fit|contain|
|fit|crop|
|fit|none|
|position|top|
|position|topRight|
|position|right|
|position|bottomRight|
|position|bottom|
|position|bottomLeft|
|position|left|
|position|topLeft|
|position|center|
|effect|zoomIn|
|effect|zoomOut|
|effect|slideLeft|
|effect|slideRight|
|effect|slideUp|
|effect|slideDown|
|filter|boost|
|filter|contrast|
|filter|darken|
|filter|greyscale|
|filter|lighten|
|filter|muted|
|filter|negative|

<h2 id="tocS_VideoAsset">VideoAsset</h2>
<!-- backwards compatibility -->
<a id="schemavideoasset"></a>
<a id="schema_VideoAsset"></a>
<a id="tocSvideoasset"></a>
<a id="tocsvideoasset"></a>

```json
{
  "type": "video",
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
  "trim": 2,
  "volume": 1,
  "crop": {
    "top": 0.15,
    "bottom": 0.15,
    "left": 0,
    "right": 0
  }
}

```

The VideoAsset is used to create video sequences from video files. The src must be a publicly accessible URL to a video resource such as an mp4 file.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `video` for videos.|
|src|string|true|none|The video source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the video clip, in seconds (defaults to 0). Videos will start from the in trim point. The video will play until the file ends or the Clip length is reached.|
|volume|number|false|none|Set the volume for the video clip between 0 and 1 where 0 is muted and 1 is full volume (defaults to 0).|
|crop|[Crop](#schemacrop)|false|none|Crop the sides of an asset by a relative amount. The size of the crop is specified using a scale between 0 and 1, relative to the screen width - i.e a left crop of 0.5 will crop half of the asset from the left, a top crop  of 0.25 will crop the top by quarter of the asset.|

<h2 id="tocS_ImageAsset">ImageAsset</h2>
<!-- backwards compatibility -->
<a id="schemaimageasset"></a>
<a id="schema_ImageAsset"></a>
<a id="tocSimageasset"></a>
<a id="tocsimageasset"></a>

```json
{
  "type": "image",
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/image.jpg",
  "crop": {
    "top": 0.15,
    "bottom": 0.15,
    "left": 0,
    "right": 0
  }
}

```

The ImageAsset is used to create video from images. The src must be a publicly accessible URL to an image resource such as a jpg or png file.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `image` for images.|
|src|string|true|none|The image source URL. The URL must be publicly accessible or include credentials.|
|crop|[Crop](#schemacrop)|false|none|Crop the sides of an asset by a relative amount. The size of the crop is specified using a scale between 0 and 1, relative to the screen width - i.e a left crop of 0.5 will crop half of the asset from the left, a top crop  of 0.25 will crop the top by quarter of the asset.|

<h2 id="tocS_TitleAsset">TitleAsset</h2>
<!-- backwards compatibility -->
<a id="schematitleasset"></a>
<a id="schema_TitleAsset"></a>
<a id="tocStitleasset"></a>
<a id="tocstitleasset"></a>

```json
{
  "type": "title",
  "text": "Hello World",
  "style": "minimal",
  "color": "#ffffff",
  "size": "medium",
  "background": "#000000",
  "position": "center",
  "offset": {
    "x": 0.1,
    "y": -0.2
  }
}

```

The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `title` for titles.|
|text|string|true|none|The title text string - i.e. "My Title".|
|style|string|false|none|Uses a preset to apply font properties and styling to the title. <ul><br>  <li>`minimal`</li><br>  <li>`blockbuster`</li><br>  <li>`vogue`</li><br>  <li>`sketchy`</li><br>  <li>`skinny`</li><br>  <li>`chunk`</li><br>  <li>`chunkLight`</li><br>  <li>`marker`</li><br>  <li>`future`</li><br>  <li>`subtitle`</li><br></ul>|
|color|string|false|none|Set the text color using hexadecimal color notation. Transparency is supported by setting the first two characters of the hex string (opposite to HTML),  i.e. #80ffffff will be white with  50% transparency.|
|size|string|false|none|Set the relative size of the text using predefined sizes from xx-small to xx-large. <ul><br>  <li>`xx-small`</li><br>  <li>`x-small`</li><br>  <li>`small`</li><br>  <li>`medium`</li><br>  <li>`large`</li><br>  <li>`x-large`</li><br>  <li>`xx-large`</li><br></ul>|
|background|string|false|none|Apply a background color behind the text. Set the text color using hexadecimal color notation. Transparency is supported by setting the first two characters of the hex string (opposite to HTML),  i.e. #80ffffff will be white with 50% transparency. Omit to use transparent background.|
|position|string|false|none|Place the title in one of nine predefined positions of the viewport. <ul><br>  <li>`top` - top (center)</li><br>  <li>`topRight` - top right</li><br>  <li>`right` - right (center)</li><br>  <li>`bottomRight` - bottom right</li><br>  <li>`bottom` - bottom (center)</li><br>  <li>`bottomLeft` - bottom left</li><br>  <li>`left` - left (center)</li><br>  <li>`topLeft` - top left</li><br>  <li>`center` - center</li><br></ul>|
|offset|[Offset](#schemaoffset)|false|none|Offset the location of the title relative to its position on the screen.|

#### Enumerated Values

|Property|Value|
|---|---|
|style|minimal|
|style|blockbuster|
|style|vogue|
|style|sketchy|
|style|skinny|
|style|chunk|
|style|chunkLight|
|style|marker|
|style|future|
|style|subtitle|
|size|xx-small|
|size|x-small|
|size|small|
|size|medium|
|size|large|
|size|x-large|
|size|xx-large|
|position|top|
|position|topRight|
|position|right|
|position|bottomRight|
|position|bottom|
|position|bottomLeft|
|position|left|
|position|topLeft|
|position|center|

<h2 id="tocS_HtmlAsset">HtmlAsset</h2>
<!-- backwards compatibility -->
<a id="schemahtmlasset"></a>
<a id="schema_HtmlAsset"></a>
<a id="tocShtmlasset"></a>
<a id="tocshtmlasset"></a>

```json
{
  "type": "html",
  "html": "<p>Hello <b>World</b></p>",
  "css": "p { color: #ffffff; } b { color: #ffff00; }",
  "width": 400,
  "height": 200,
  "background": "transparent",
  "position": "center"
}

```

The HtmlAsset clip type lets you create text based layout and formatting using HTML and CSS. You can also set the height and width of a bounding box for the HTML content to sit within. Text and elements will wrap within the bounding box.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `html` for HTML.|
|html|string|true|none|The HTML text string. See list of [supported HTML tags](https://shotstack.gitbook.io/docs/guides/architecting-an-application/html-support#supported-html-tags).|
|css|string|false|none|The CSS text string to apply styling to the HTML. See list of  [support CSS properties](https://shotstack.gitbook.io/docs/guides/architecting-an-application/html-support#supported-html-tags).|
|width|integer|false|none|Set the width of the HTML asset bounding box in pixels. Text will wrap to fill the bounding box.|
|height|integer|false|none|Set the width of the HTML asset bounding box in pixels. Text and elements will be masked if they exceed the  height of the bounding box.|
|background|string|false|none|Apply a background color behind the HTML bounding box using. Set the text color using hexadecimal  color notation. Transparency is supported by setting the first two characters of the hex string  (opposite to HTML), i.e. #80ffffff will be white with 50% transparency.|
|position|string|false|none|Place the HTML in one of nine predefined positions within the HTML area. <ul><br>  <li>`top` - top (center)</li><br>  <li>`topRight` - top right</li><br>  <li>`right` - right (center)</li><br>  <li>`bottomRight` - bottom right</li><br>  <li>`bottom` - bottom (center)</li><br>  <li>`bottomLeft` - bottom left</li><br>  <li>`left` - left (center)</li><br>  <li>`topLeft` - top left</li><br>  <li>`center` - center</li><br></ul>|

#### Enumerated Values

|Property|Value|
|---|---|
|position|top|
|position|topRight|
|position|right|
|position|bottomRight|
|position|bottom|
|position|bottomLeft|
|position|left|
|position|topLeft|
|position|center|

<h2 id="tocS_AudioAsset">AudioAsset</h2>
<!-- backwards compatibility -->
<a id="schemaaudioasset"></a>
<a id="schema_AudioAsset"></a>
<a id="tocSaudioasset"></a>
<a id="tocsaudioasset"></a>

```json
{
  "type": "audio",
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/sound.mp3",
  "trim": 0,
  "volume": 1,
  "effect": "fadeIn"
}

```

The AudioAsset is used to add sound effects and audio at specific intervals on the timeline. The src must be a publicly accessible URL to an audio resource such  as an mp3 file.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `audio` for audio assets.|
|src|string|true|none|The audio source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the audio clip, in seconds (defaults to 0). Audio will start from the in trim point. The audio will play until the file ends or the Clip length is reached.|
|volume|number|false|none|Set the volume for the audio clip between 0 and 1 where 0 is muted and 1 is full volume (defaults to 1).|
|effect|string|false|none|The effect to apply to the audio asset <ul><br>  <li>`fadeIn` - fade volume in only</li><br>  <li>`fadeOut` - fade volume out only</li><br>  <li>`fadeInFadeOut` - fade volume in and out</li><br></ul>|

#### Enumerated Values

|Property|Value|
|---|---|
|effect|fadeIn|
|effect|fadeOut|
|effect|fadeInFadeOut|

<h2 id="tocS_LumaAsset">LumaAsset</h2>
<!-- backwards compatibility -->
<a id="schemalumaasset"></a>
<a id="schema_LumaAsset"></a>
<a id="tocSlumaasset"></a>
<a id="tocslumaasset"></a>

```json
{
  "type": "luma",
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/mask.mp4",
  "trim": 0
}

```

The LumaAsset is used to create luma matte transitions between other assets. A luma matte is  a grey scale animated video where the black areas are transparent and the white areas solid. The luma matte animation should be provided as an mp4 video file. The src must be a publicly  accessible URL to the file.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to `luma` for luma mattes.|
|src|string|true|none|The luma matte video source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the luma video clip, in seconds (defaults to 0). Videos will start from the in trim point. The luma matte video will play until the file ends or the Clip length is reached.|

<h2 id="tocS_Transition">Transition</h2>
<!-- backwards compatibility -->
<a id="schematransition"></a>
<a id="schema_Transition"></a>
<a id="tocStransition"></a>
<a id="tocstransition"></a>

```json
{
  "in": "fade",
  "out": "fade"
}

```

In and out transitions for a clip - i.e. fade in and fade out

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|in|string|false|none|The transition in. Available transitions are:<br>  <ul><br>    <li>`fade` - fade in</li><br>    <li>`reveal` - reveal from left to right</li><br>    <li>`wipeLeft` - fade across screen to the left</li><br>    <li>`wipeRight` - fade across screen to the right</li><br>    <li>`slideLeft` - move slightly left and fade in</li><br>    <li>`slideRight` - move slightly right and fade in</li><br>    <li>`slideUp` - move slightly up and fade in</li><br>    <li>`slideDown` - move slightly down and fade in</li><br>    <li>`carouselLeft` - slide in from right to left</li><br>    <li>`carouselRight` - slide in from left to right</li><br>    <li>`carouselUp` - slide in from bottom to top</li><br>    <li>`carouselDown` - slide in from top  to bottom</li><br>    <li>`zoom` - fast zoom in</li><br>  </ul>|
|out|string|false|none|The transition out. Available transitions are:<br>  <ul><br>    <li>`fade` - fade out</li><br>    <li>`reveal` - reveal from right to left</li><br>    <li>`wipeLeft` - fade across screen to the left</li><br>    <li>`wipeRight` - fade across screen to the right</li><br>    <li>`slideLeft` - move slightly left and fade out</li><br>    <li>`slideRight` - move slightly right and fade out</li><br>    <li>`slideUp` - move slightly up and fade out</li><br>    <li>`slideDown` - move slightly down and fade out</li><br>    <li>`carouselLeft` - slide out from right to left</li><br>    <li>`carouselRight` - slide out from left to right</li><br>    <li>`carouselUp` - slide out from bottom to top</li><br>    <li>`carouselDown` - slide out from top  to bottom</li><br>    <li>`zoom` - fast zoom out</li><br>  </ul>|

#### Enumerated Values

|Property|Value|
|---|---|
|in|fade|
|in|reveal|
|in|wipeLeft|
|in|wipeRight|
|in|slideLeft|
|in|slideRight|
|in|slideUp|
|in|slideDown|
|in|carouselLeft|
|in|carouselRight|
|in|carouselUp|
|in|carouselDown|
|in|zoom|
|out|fade|
|out|reveal|
|out|wipeLeft|
|out|wipeRight|
|out|slideLeft|
|out|slideRight|
|out|slideUp|
|out|slideDown|
|out|carouselLeft|
|out|carouselRight|
|out|carouselUp|
|out|carouselDown|
|out|zoom|

<h2 id="tocS_Font">Font</h2>
<!-- backwards compatibility -->
<a id="schemafont"></a>
<a id="schema_Font"></a>
<a id="tocSfont"></a>
<a id="tocsfont"></a>

```json
{
  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
}

```

Download a custom font to use with the HTML asset type, using the font name in the CSS or font tag. See our [custom fonts](https://shotstack.io/learn/html-custom-fonts/) getting started guide for more details.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|src|string|true|none|The URL of the font file. The URL must be publicly accessible or include credentials.|

<h2 id="tocS_Offset">Offset</h2>
<!-- backwards compatibility -->
<a id="schemaoffset"></a>
<a id="schema_Offset"></a>
<a id="tocSoffset"></a>
<a id="tocsoffset"></a>

```json
{
  "x": 0.1,
  "y": -0.2
}

```

Offsets the position of an asset horizontally or vertically by a relative distance.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|x|number(float)|false|none|Offset an asset on the horizontal axis (left or right), range varies from -1 to 1. Positive numbers move the asset right, negative left. For all assets except titles the distance moved is relative to the width  of the viewport - i.e. an X offset of 0.5 will move the asset half the  screen width to the right.|
|y|number(float)|false|none|Offset an asset on the vertical axis (up or down), range varies from -1 to 1. Positive numbers move the asset up, negative down. For all assets except titles the distance moved is relative to the height  of the viewport - i.e. an Y offset of 0.5 will move the asset up half the  screen height.|

<h2 id="tocS_Crop">Crop</h2>
<!-- backwards compatibility -->
<a id="schemacrop"></a>
<a id="schema_Crop"></a>
<a id="tocScrop"></a>
<a id="tocscrop"></a>

```json
{
  "top": 0.15,
  "bottom": 0.15,
  "left": 0,
  "right": 0
}

```

Crop the sides of an asset by a relative amount. The size of the crop is specified using a scale between 0 and 1, relative to the screen width - i.e a left crop of 0.5 will crop half of the asset from the left, a top crop  of 0.25 will crop the top by quarter of the asset.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|top|number(float)|false|none|Crop from the top of the asset|
|bottom|number(float)|false|none|Crop from the bottom of the asset|
|left|number(float)|false|none|Crop from the left of the asset|
|right|number(float)|false|none|Crop from the left of the asset|

<h2 id="tocS_Output">Output</h2>
<!-- backwards compatibility -->
<a id="schemaoutput"></a>
<a id="schema_Output"></a>
<a id="tocSoutput"></a>
<a id="tocsoutput"></a>

```json
{
  "format": "mp4",
  "resolution": "sd",
  "aspectRatio": "16:9",
  "fps": 25,
  "scaleTo": "preview",
  "range": {
    "start": 3,
    "length": 6
  },
  "poster": {
    "capture": 1
  },
  "thumbnail": {
    "capture": 1,
    "scale": 0.3
  }
}

```

The output format, render range and type of media to generate.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|format|string|true|none|The output format and type of media file to generate. <ul><br>  <li>`mp4` - mp4 video file</li><br>  <li>`gif` - animated gif</li><br>  <li>`mp3` - mp3 audio file (no video)</li><br></ul>|
|resolution|string|true|none|The output resolution of the video. <ul><br>  <li>`preview` - 512px x 288px @ 15fps</li><br>  <li>`mobile` - 640px x 360px @ 25fps</li><br>  <li>`sd` - 1024px x 576px @ 25fps</li><br>  <li>`hd` - 1280px x 720px @ 25fps</li><br>  <li>`1080` - 1920px x 1080px @ 25fps</li><br></ul>|
|aspectRatio|string|false|none|The aspect ratio (shape) of the video. Useful for social media video. Options are: <ul><br>  <li>`16:9` - regular landscape/horizontal aspect ratio (default)</li><br>  <li>`9:16` - vertical/portrait aspect ratio</li><br>  <li>`1:1` - square aspect ratio</li><br>  <li>`4:5` - short vertical/portrait aspect ratio</li><br></ul>|
|fps|integer|false|none|Override the default frames per second. Useful for when the source footage is recorded at 30fps, i.e. on  mobile devices. Lower frame rates can be used to add cinematic quality (24fps) or to create smaller file size/faster render times or animated gifs (12 or 15fps). Default is 25fps. <ul><br>  <li>`12` - 12fps</li><br>  <li>`15` - 15fps</li><br>  <li>`24` - 24fps</li><br>  <li>`25` - 25fps</li><br>  <li>`30` - 30fps</li><br></ul>|
|scaleTo|string|false|none|Override the resolution and scale the video to render at a different size. When using scaleTo the video should be edited at the resolution dimensions, i.e. use font sizes that look best at HD, then use scaleTo to output the video at SD and the text will be scaled to the correct size. This is useful if you want to create multiple video sizes. <ul><br>  <li>`preview` - 512px x 288px @ 15fps</li><br>  <li>`mobile` - 640px x 360px @ 25fps</li><br>  <li>`sd` - 1024px x 576px @25fps</li><br>  <li>`hd` - 1280px x 720px @25fps</li><br>  <li>`1080` - 1920px x 1080px @25fps</li><br></ul>|
|range|[Range](#schemarange)|false|none|Specify a time range to render, i.e. to render only a portion of a video or audio file. Omit this setting to  export the entire video.|
|poster|[Poster](#schemaposter)|false|none|Generate a poster image from a specific point on the timeline.|
|thumbnail|[Thumbnail](#schemathumbnail)|false|none|Generate a thumbnail image from a specific point on the timeline.|

#### Enumerated Values

|Property|Value|
|---|---|
|format|mp4|
|format|gif|
|format|mp3|
|resolution|preview|
|resolution|mobile|
|resolution|sd|
|resolution|hd|
|resolution|1080|
|aspectRatio|16:9|
|aspectRatio|9:16|
|aspectRatio|1:1|
|aspectRatio|4:5|
|fps|12|
|fps|15|
|fps|24|
|fps|25|
|fps|30|
|scaleTo|preview|
|scaleTo|mobile|
|scaleTo|sd|
|scaleTo|hd|
|scaleTo|1080|

<h2 id="tocS_Range">Range</h2>
<!-- backwards compatibility -->
<a id="schemarange"></a>
<a id="schema_Range"></a>
<a id="tocSrange"></a>
<a id="tocsrange"></a>

```json
{
  "start": 3,
  "length": 6
}

```

Specify a time range to render, i.e. to render only a portion of a video or audio file. Omit this setting to  export the entire video.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|start|number(float)|false|none|The point on the timeline, in seconds, to start the render from - i.e. start at second 3.|
|length|number(float)|false|none|The length of the portion of the video to render - i.e. render 6 seconds of the video.|

<h2 id="tocS_Poster">Poster</h2>
<!-- backwards compatibility -->
<a id="schemaposter"></a>
<a id="schema_Poster"></a>
<a id="tocSposter"></a>
<a id="tocsposter"></a>

```json
{
  "capture": 1
}

```

Generate a poster image for the video at a specific point from the timeline. The poster image size will match the size of the output video.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|capture|number|true|none|The point on the timeline in seconds to capture a single frame to use as the poster image.|

<h2 id="tocS_Thumbnail">Thumbnail</h2>
<!-- backwards compatibility -->
<a id="schemathumbnail"></a>
<a id="schema_Thumbnail"></a>
<a id="tocSthumbnail"></a>
<a id="tocsthumbnail"></a>

```json
{
  "capture": 1,
  "scale": 0.3
}

```

Generate a thumbnail image for the video at a specific point from the timeline.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|capture|number|true|none|The point on the timeline in seconds to capture a single frame to use as the thumbnail image.|
|scale|number|true|none|Scale the thumbnail size to a fraction of the viewport size - i.e. setting the scale to 0.5 will scale  the thumbnail to half the size of the viewport.|

<h2 id="tocS_QueuedResponse">QueuedResponse</h2>
<!-- backwards compatibility -->
<a id="schemaqueuedresponse"></a>
<a id="schema_QueuedResponse"></a>
<a id="tocSqueuedresponse"></a>
<a id="tocsqueuedresponse"></a>

```json
{
  "success": true,
  "message": "Created",
  "response": {
    "message": "Render Successfully Queued",
    "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7"
  }
}

```

The response received after a [render request](#render-video) is submitted. The render task is queued for rendering and a unique render id is returned.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|`true` if successfully queued, else `false`.|
|message|string|true|none|`Created`, `Bad Request` or an error message.|
|response|[QueuedResponseData](#schemaqueuedresponsedata)|true|none|`QueuedResponseData` or an error message.|

<h2 id="tocS_QueuedResponseData">QueuedResponseData</h2>
<!-- backwards compatibility -->
<a id="schemaqueuedresponsedata"></a>
<a id="schema_QueuedResponseData"></a>
<a id="tocSqueuedresponsedata"></a>
<a id="tocsqueuedresponsedata"></a>

```json
{
  "message": "Render Successfully Queued",
  "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7"
}

```

The response data returned with the [QueuedResponse](#tocs_queuedresponse).

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|true|none|Success response message or error details.|
|id|string|true|none|The id of the render task in UUID format.|

<h2 id="tocS_RenderResponse">RenderResponse</h2>
<!-- backwards compatibility -->
<a id="schemarenderresponse"></a>
<a id="schema_RenderResponse"></a>
<a id="tocSrenderresponse"></a>
<a id="tocsrenderresponse"></a>

```json
{
  "success": true,
  "message": "OK",
  "response": {
    "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
    "owner": "5ca6hu7s9k",
    "plan": "basic",
    "status": "done",
    "error": "",
    "duration": 8.5,
    "renderTime": 9433.44,
    "url": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
    "poster": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7-poster.jpg",
    "thumbnail": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7-thumb.jpg",
    "data": {
      "timeline": {
        "soundtrack": {
          "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
          "effect": "fadeIn",
          "volume": 1
        },
        "background": "#000000",
        "fonts": [
          {
            "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
          }
        ],
        "tracks": [
          {
            "clips": [
              {
                "asset": {
                  "type": "video",
                  "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
                  "trim": 2,
                  "volume": 1,
                  "crop": {
                    "top": 0.15,
                    "bottom": 0.15,
                    "left": 0,
                    "right": 0
                  }
                },
                "start": 2,
                "length": 5,
                "fit": "crop",
                "scale": 0,
                "position": "center",
                "offset": {
                  "x": 0.1,
                  "y": -0.2
                },
                "transition": {
                  "in": "fade",
                  "out": "fade"
                },
                "effect": "zoomIn",
                "filter": "greyscale",
                "opacity": 1
              }
            ]
          }
        ],
        "cache": true
      },
      "output": {
        "format": "mp4",
        "resolution": "sd",
        "aspectRatio": "16:9",
        "fps": 25,
        "scaleTo": "preview",
        "range": {
          "start": 3,
          "length": 6
        },
        "poster": {
          "capture": 1
        },
        "thumbnail": {
          "capture": 1,
          "scale": 0.3
        }
      },
      "callback": "https://my-server.com/callback.php",
      "disk": "local"
    },
    "created": "2020-10-30T09:42:29.446Z",
    "updated": "2020-10-30T09:42:39.168Z"
  }
}

```

The response received after a [render status request](#get-render-status) is submitted. The response includes  details about status of a render and the output URL.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|`true` if status available, else `false`.|
|message|string|true|none|`OK` or an error message.|
|response|[RenderResponseData](#schemarenderresponsedata)|true|none|`RenderResponse` or an error message.|

<h2 id="tocS_RenderResponseData">RenderResponseData</h2>
<!-- backwards compatibility -->
<a id="schemarenderresponsedata"></a>
<a id="schema_RenderResponseData"></a>
<a id="tocSrenderresponsedata"></a>
<a id="tocsrenderresponsedata"></a>

```json
{
  "id": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
  "owner": "5ca6hu7s9k",
  "plan": "basic",
  "status": "done",
  "error": "",
  "duration": 8.5,
  "renderTime": 9433.44,
  "url": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
  "poster": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7-poster.jpg",
  "thumbnail": "https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7-thumb.jpg",
  "data": {
    "timeline": {
      "soundtrack": {
        "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/music.mp3",
        "effect": "fadeIn",
        "volume": 1
      },
      "background": "#000000",
      "fonts": [
        {
          "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/open-sans.ttf"
        }
      ],
      "tracks": [
        {
          "clips": [
            {
              "asset": {
                "type": "video",
                "src": "https://s3-ap-northeast-1.amazonaws.com/my-bucket/video.mp4",
                "trim": 2,
                "volume": 1,
                "crop": {
                  "top": 0.15,
                  "bottom": 0.15,
                  "left": 0,
                  "right": 0
                }
              },
              "start": 2,
              "length": 5,
              "fit": "crop",
              "scale": 0,
              "position": "center",
              "offset": {
                "x": 0.1,
                "y": -0.2
              },
              "transition": {
                "in": "fade",
                "out": "fade"
              },
              "effect": "zoomIn",
              "filter": "greyscale",
              "opacity": 1
            }
          ]
        }
      ],
      "cache": true
    },
    "output": {
      "format": "mp4",
      "resolution": "sd",
      "aspectRatio": "16:9",
      "fps": 25,
      "scaleTo": "preview",
      "range": {
        "start": 3,
        "length": 6
      },
      "poster": {
        "capture": 1
      },
      "thumbnail": {
        "capture": 1,
        "scale": 0.3
      }
    },
    "callback": "https://my-server.com/callback.php",
    "disk": "local"
  },
  "created": "2020-10-30T09:42:29.446Z",
  "updated": "2020-10-30T09:42:39.168Z"
}

```

The response data returned with the [RenderResponse](#tocs_renderresponse) including status and URL.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|The id of the render task in UUID format.|
|owner|string|true|none|The owner id of the render task.|
|plan|string|false|none|The customer subscription plan.|
|status|string|true|none|The status of the render task. <ul><br>  <li>`queued` - render is queued waiting to be rendered</li><br>  <li>`fetching` - assets are being fetched</li><br>  <li>`rendering` - the video is being rendered</li><br>  <li>`saving` - the final video is being saved to storage</li><br>  <li>`done` - the video is ready to be downloaded</li><br>  <li>`failed` - there was an error rendering the video</li><br></ul>|
|error|string|false|none|An error message, only displayed if an error occurred.|
|duration|number|false|none|The output video length in seconds.|
|renderTime|number|false|none|The time taken to render the video in milliseconds.|
|url|string|false|none|The URL of the final video. This will only be available if status is done.|
|poster|string|false|none|The URL of the poster image if requested. This will only be available if status is done.|
|thumbnail|string|false|none|The URL of the thumbnail image if requested. This will only be available if status is done.|
|data|[Edit](#schemaedit)|true|none|The timeline and output data to be rendered.|
|created|string|true|none|The time the render task was initially queued.|
|updated|string|true|none|The time the render status was last updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|status|queued|
|status|fetching|
|status|rendering|
|status|saving|
|status|done|
|status|failed|

<h2 id="tocS_AssetResponse">AssetResponse</h2>
<!-- backwards compatibility -->
<a id="schemaassetresponse"></a>
<a id="schema_AssetResponse"></a>
<a id="tocSassetresponse"></a>
<a id="tocsassetresponse"></a>

```json
{
  "data": {
    "type": "asset",
    "attributes": {
      "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
      "owner": "5ca6hu7s9k",
      "region": "au",
      "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
      "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
      "url": "https://cdn.shotstack.io/au/v1/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
      "status": "ready",
      "created": "2021-06-30T09:42:29.446Z",
      "updated": "2021-06-30T09:42:30.168Z"
    }
  }
}

```

The response returned by the Serve API [get asset](#get-asset) request. Includes details of a hosted video, image, audio file, thumbnail or poster image. The response follows the [json:api](https://jsonapi.org/) specification.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|data|[AssetResponseData](#schemaassetresponsedata)|false|none|An asset resource.|

<h2 id="tocS_AssetRenderResponse">AssetRenderResponse</h2>
<!-- backwards compatibility -->
<a id="schemaassetrenderresponse"></a>
<a id="schema_AssetRenderResponse"></a>
<a id="tocSassetrenderresponse"></a>
<a id="tocsassetrenderresponse"></a>

```json
{
  "data": [
    {
      "type": "asset",
      "attributes": {
        "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
        "owner": "5ca6hu7s9k",
        "region": "au",
        "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
        "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
        "url": "https://cdn.shotstack.io/au/v1/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
        "status": "ready",
        "created": "2021-06-30T09:42:29.446Z",
        "updated": "2021-06-30T09:42:30.168Z"
      }
    }
  ]
}

```

The response returned by the Serve API [get asset by render id](#get-asset-by-render-id) request. The response  is an array of asset resources, including video, image, audio, thumbnail and poster image. The response follows  the [json:api](https://jsonapi.org/) specification.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|data|[[AssetResponseData](#schemaassetresponsedata)]|false|none|An array of asset resources grouped by render id.|

<h2 id="tocS_AssetResponseData">AssetResponseData</h2>
<!-- backwards compatibility -->
<a id="schemaassetresponsedata"></a>
<a id="schema_AssetResponseData"></a>
<a id="tocSassetresponsedata"></a>
<a id="tocsassetresponsedata"></a>

```json
{
  "type": "asset",
  "attributes": {
    "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
    "owner": "5ca6hu7s9k",
    "region": "au",
    "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
    "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
    "url": "https://cdn.shotstack.io/au/v1/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
    "status": "ready",
    "created": "2021-06-30T09:42:29.446Z",
    "updated": "2021-06-30T09:42:30.168Z"
  }
}

```

The type of resource (an asset) and attributes of the asset.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|false|none|The type of resource, in this case it is an assets.|
|attributes|[AssetResponseAttributes](#schemaassetresponseattributes)|false|none|The asset attributes including render id, url, filename, file size, etc...|

<h2 id="tocS_AssetResponseAttributes">AssetResponseAttributes</h2>
<!-- backwards compatibility -->
<a id="schemaassetresponseattributes"></a>
<a id="schema_AssetResponseAttributes"></a>
<a id="tocSassetresponseattributes"></a>
<a id="tocsassetresponseattributes"></a>

```json
{
  "id": "a4482cbf-e321-42a2-ac8b-947d26886840",
  "owner": "5ca6hu7s9k",
  "region": "au",
  "renderId": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7",
  "filename": "2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
  "url": "https://cdn.shotstack.io/au/v1/5ca6hu7s9k/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7.mp4",
  "status": "ready",
  "created": "2021-06-30T09:42:29.446Z",
  "updated": "2021-06-30T09:42:30.168Z"
}

```

The list of asset attributes and their values.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|The unique id of the hosted asset in UUID format.|
|owner|string|false|none|The owner id of the render task.|
|region|string|false|none|The region the asset is hosted, currently only `au` (Australia).|
|renderId|string|false|none|The original render id that created the asset in UUID format. Multiple assets can share the same render id.|
|filename|string|false|none|The asset file name.|
|url|string|false|none|The asset file name.|
|status|string|false|none|The status of the asset. <ul><br>  <li>`importing` - the asset is being copied to the hosting service</li><br>  <li>`ready` - the asset is ready to be served to users</li><br>  <li>`failed` - the asset failed to copy or delete</li><br>  <li>`deleted` - the asset has been deleted</li><br></ul>|
|created|string|false|none|The time the asset was created.|
|updated|string|false|none|The time the asset status was last updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|status|importing|
|status|ready|
|status|failed|
|status|deleted|

