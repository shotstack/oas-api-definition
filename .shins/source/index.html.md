---
title: Shotstack
language_tabs:
  - shell: Curl
  - http: HTTP
  - javascript--nodejs: NodeJS
  - javascript: jQuery
  - php: PHP
  - ruby: Ruby
  - python: Python
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: dracula
headingLevel: 2

---

<h1 id="shotstack">Shotstack v1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

The Shotstack API is a video editing service that allows for the automated creation of videos using JSON. You can configure an edit and POST it to the Shotstack API which will render your video and provide a file location when complete. For more details check https://shotstack.io

Base URLs:

* <a href="https://api.shotstack.io/{version}">https://api.shotstack.io/{version}</a>

    * **version** -  Default: v1

        * v1

        * stage

# Authentication

* API Key (DeveloperKey)
    - Parameter Name: **x-api-key**, in: header. Set the header named below with your provided key for the correct environment (v1 or stage). Include the header in all calls to the API that are secured with a key.

<h1 id="shotstack-endpoints">Endpoints</h1>

## postRender

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
const inputBody = '{
  "timeline": {
    "soundtrack": {
      "src": "string",
      "effect": "fadeIn",
      "volume": 0
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "string"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "title",
              "text": "string",
              "style": "minimal",
              "color": "#ffffff",
              "size": "medium",
              "background": "string",
              "position": "center",
              "offset": {
                "x": -1,
                "y": -1
              }
            },
            "start": 0,
            "length": 0,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": -1,
              "y": -1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "boost",
            "opacity": 0
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "preview",
    "aspectRatio": "16:9",
    "poster": {
      "capture": 0
    },
    "thumbnail": {
      "capture": 0,
      "scale": 0
    }
  },
  "callback": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'x-api-key':'API_KEY'

};

fetch('https://api.shotstack.io/{version}/render',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript
var headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'x-api-key':'API_KEY'

};

$.ajax({
  url: 'https://api.shotstack.io/{version}/render',
  method: 'post',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

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

r = requests.post('https://api.shotstack.io/{version}/render', params={

}, headers = headers)

print r.json()

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

Render the contents of a timeline as a video file.

> Body parameter

```json
{
  "timeline": {
    "soundtrack": {
      "src": "string",
      "effect": "fadeIn",
      "volume": 0
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "string"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "title",
              "text": "string",
              "style": "minimal",
              "color": "#ffffff",
              "size": "medium",
              "background": "string",
              "position": "center",
              "offset": {
                "x": -1,
                "y": -1
              }
            },
            "start": 0,
            "length": 0,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": -1,
              "y": -1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "boost",
            "opacity": 0
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "preview",
    "aspectRatio": "16:9",
    "poster": {
      "capture": 0
    },
    "thumbnail": {
      "capture": 0,
      "scale": 0
    }
  },
  "callback": "string"
}
```

<h3 id="postrender-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Edit](#schemaedit)|true|none|

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

<h3 id="postrender-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[QueuedResponse](#schemaqueuedresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

## getRender

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

```javascript
var headers = {
  'Accept':'application/json',
  'x-api-key':'API_KEY'

};

$.ajax({
  url: 'https://api.shotstack.io/{version}/render/{id}',
  method: 'get',

  headers: headers,
  success: function(data) {
    console.log(JSON.stringify(data));
  }
})

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

r = requests.get('https://api.shotstack.io/{version}/render/{id}', params={

}, headers = headers)

print r.json()

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

<h3 id="getrender-parameters">Parameters</h3>

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
    "created": "2018-05-06T03:33:25.425Z",
    "updated": "2018-05-06T03:33:48.521Z"
  }
}
```

<h3 id="getrender-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RenderResponse](#schemarenderresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
DeveloperKey
</aside>

# Schemas

<h2 id="tocSedit">Edit</h2>

<a id="schemaedit"></a>

```json
{
  "timeline": {
    "soundtrack": {
      "src": "string",
      "effect": "fadeIn",
      "volume": 0
    },
    "background": "#000000",
    "fonts": [
      {
        "src": "string"
      }
    ],
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "title",
              "text": "string",
              "style": "minimal",
              "color": "#ffffff",
              "size": "medium",
              "background": "string",
              "position": "center",
              "offset": {
                "x": -1,
                "y": -1
              }
            },
            "start": 0,
            "length": 0,
            "fit": "crop",
            "scale": 0,
            "position": "center",
            "offset": {
              "x": -1,
              "y": -1
            },
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "boost",
            "opacity": 0
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "preview",
    "aspectRatio": "16:9",
    "poster": {
      "capture": 0
    },
    "thumbnail": {
      "capture": 0,
      "scale": 0
    }
  },
  "callback": "string"
}

```

*An edit defines the content of the video in a timeline and the output format.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeline|[Timeline](#schematimeline)|true|none|A timeline represents the contents of a video edit over time, in seconds. A timeline consists of layers called tracks. Tracks are composed of titles, images or video segments referred to as clips which are placed along the track at specific starting point and lasting for a specific amount of time.|
|output|[Output](#schemaoutput)|true|none|The video output format.|
|callback|string|false|none|An optional webhook callback URL used to receive status notifications when a render completes or fails.|

<h2 id="tocStimeline">Timeline</h2>

<a id="schematimeline"></a>

```json
{
  "soundtrack": {
    "src": "string",
    "effect": "fadeIn",
    "volume": 0
  },
  "background": "#000000",
  "fonts": [
    {
      "src": "string"
    }
  ],
  "tracks": [
    {
      "clips": [
        {
          "asset": {
            "type": "title",
            "text": "string",
            "style": "minimal",
            "color": "#ffffff",
            "size": "medium",
            "background": "string",
            "position": "center",
            "offset": {
              "x": -1,
              "y": -1
            }
          },
          "start": 0,
          "length": 0,
          "fit": "crop",
          "scale": 0,
          "position": "center",
          "offset": {
            "x": -1,
            "y": -1
          },
          "transition": {
            "in": "fade",
            "out": "fade"
          },
          "effect": "zoomIn",
          "filter": "boost",
          "opacity": 0
        }
      ]
    }
  ]
}

```

*A timeline represents the contents of a video edit over time, in seconds. A timeline consists of layers called tracks. Tracks are composed of titles, images or video segments referred to as clips which are placed along the track at specific starting point and lasting for a specific amount of time.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|soundtrack|[Soundtrack](#schemasoundtrack)|false|none|A music or audio soundtrack file in mp3 format.|
|background|string|false|none|A hexadecimal value for the timeline background colour. Defaults to #000000 (black).|
|fonts|[[Font](#schemafont)]|false|none|An array of custom fonts to be downloaded for use by the HTML assets.|
|tracks|[[Track](#schematrack)]|true|none|A timeline consists of an array of tracks, each track containing clips. Tracks are layered on top of each other in the same order they are added to the array with the top most track layered over the top of those below it. Ensure that a track containing titles is the top most track so that it is displayed above videos and images.|

<h2 id="tocSsoundtrack">Soundtrack</h2>

<a id="schemasoundtrack"></a>

```json
{
  "src": "string",
  "effect": "fadeIn",
  "volume": 0
}

```

*A music or audio file in mp3 format that plays for the duration of the rendered video or the length of the audio file, which ever is shortest.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|src|string|true|none|The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.|
|effect|string|false|none|The effect to apply to the audio file|
|volume|number|false|none|Set the volume for the soundtrack between 0 and 1 where 0 is muted and 1 is full volume (defaults to 1).|

#### Enumerated Values

|Property|Value|
|---|---|
|effect|fadeIn|
|effect|fadeOut|
|effect|fadeInFadeOut|

<h2 id="tocStrack">Track</h2>

<a id="schematrack"></a>

```json
{
  "clips": [
    {
      "asset": {
        "type": "title",
        "text": "string",
        "style": "minimal",
        "color": "#ffffff",
        "size": "medium",
        "background": "string",
        "position": "center",
        "offset": {
          "x": -1,
          "y": -1
        }
      },
      "start": 0,
      "length": 0,
      "fit": "crop",
      "scale": 0,
      "position": "center",
      "offset": {
        "x": -1,
        "y": -1
      },
      "transition": {
        "in": "fade",
        "out": "fade"
      },
      "effect": "zoomIn",
      "filter": "boost",
      "opacity": 0
    }
  ]
}

```

*A track contains an array of clips. Tracks are layered on top of each other in the order in the array. The top most track will render on top of those below it.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|clips|[[Clip](#schemaclip)]|true|none|An array of Clips comprising of TitleClip, ImageClip or VideoClip.|

<h2 id="tocSclip">Clip</h2>

<a id="schemaclip"></a>

```json
{
  "asset": {
    "type": "title",
    "text": "string",
    "style": "minimal",
    "color": "#ffffff",
    "size": "medium",
    "background": "string",
    "position": "center",
    "offset": {
      "x": -1,
      "y": -1
    }
  },
  "start": 0,
  "length": 0,
  "fit": "crop",
  "scale": 0,
  "position": "center",
  "offset": {
    "x": -1,
    "y": -1
  },
  "transition": {
    "in": "fade",
    "out": "fade"
  },
  "effect": "zoomIn",
  "filter": "boost",
  "opacity": 0
}

```

*A clip is a container for a specific type of asset, i.e. a title, image, video, audio or html. You use a Clip to define when an asset will display on the timeline, how long it will play for and transitions, filters and effects to apply to it.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|asset|any|true|none|The type of asset to display for the duration of this Clip. Value must be one of <b>TitleAsset</b>, <b>ImageAsset</b>, <b>VideoAsset</b>, <b>HtmlAsset</b>, <b>AudioAsset</b> or <b>LumaAsset</b>|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[TitleAsset](#schematitleasset)|false|none|The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ImageAsset](#schemaimageasset)|false|none|The ImageAsset is used to create video from images. The src must be a publicly accessible URL to an image resource such as a jpg or png file.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[VideoAsset](#schemavideoasset)|false|none|The VideoAsset is used to create video sequences from video files. The src must be a publicly accessible URL to a video resource such as an mp4 file.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[HtmlAsset](#schemahtmlasset)|false|none|The HtmlAsset clip type lets you create text based layout and formatting using HTML and CSS. You can also set the height and width of a bounding box for the HTML content to sit within. Text and elements will wrap within the bounding box.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[AudioAsset](#schemaaudioasset)|false|none|The AudioAsset is used to add sound effects and audio at specific intervals on the timeline. The src must be a publicly accessible URL to an audio resource such  as an mp3 file.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[LumaAsset](#schemalumaasset)|false|none|The LumaAsset is used to create luma matte transitions between other assets. A luma matte is  a grey scale animated video where the black areas are transparent and the white areas solid. The luma matte animation should be provided as an mp4 video file. The src must be a publicly  accessible URL to the file.|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|start|number|true|none|The start position of the Clip on the timeline, in seconds.|
|length|number|true|none|The length, in seconds, the Clip should play for.|
|fit|string|false|none|Set how the asset should be scaled to fit the viewport using one of the following options:    <ul>     <li>`cover` - stretch the asset to fill the viewport without maintaining the aspect ratio.</li>     <li>`contain` - fit the entire asset within the viewport while maintaining the original aspect ratio.</li>     <li>`crop` - scale the asset to fill the viewport while maintaining the aspect ratio. The asset will be cropped if it exceeds the bounds of the viewport.</li>     <li>`none` - preserves the original asset dimensions and does not apply any scaling.</li>   </ul>|
|scale|number|false|none|Scale the asset to a fraction of the viewport size - i.e. setting the scale to 0.5 will scale asset to half the size of the viewport. This is useful for picture-in-picture video and  scaling images such as logos and watermarks.|
|position|string|false|none|Place the asset in one of nine predefined positions of the viewport. This is most effective for when the asset is scaled and you want to position the element to a specific position.|
|offset|[Offset](#schemaoffset)|false|none|Offset the location of the asset relative to it's position on the viewport. The offset distance is relative to the width of the viewport - for example an x offset of 0.5 will move the asset half the viewport width to the right.|
|transition|[Transition](#schematransition)|false|none|In and out transitions for a clip - i.e. fade in and fade out|
|effect|string|false|none|A motion effect to apply to the Clip.|
|filter|string|false|none|A filter effect to apply to the Clip.|
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

<h2 id="tocStitleasset">TitleAsset</h2>

<a id="schematitleasset"></a>

```json
{
  "type": "title",
  "text": "string",
  "style": "minimal",
  "color": "#ffffff",
  "size": "medium",
  "background": "string",
  "position": "center",
  "offset": {
    "x": -1,
    "y": -1
  }
}

```

*The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>title</b> for titles.|
|text|string|true|none|The title text string - i.e. "My Title".|
|style|string|false|none|Uses a preset to apply font properties and styling to the title.|
|color|string|false|none|Set the text color using hexadecimal color notation. Transparency is supported by setting the first two characters of the hex string (opposite to HTML),  i.e. #80ffffff will be white with  50% transparency.|
|size|string|false|none|Set the relative size of the text using predefined sizes from xx-small to xx-large.|
|background|string|false|none|Apply a background color behind the text. Set the text color using hexadecimal color notation. Transparency is supported by setting the first two characters of the hex string (opposite to HTML),  i.e. #80ffffff will be white with 50% transparency.|
|position|string|false|none|Place the title in one of nine predefined positions of the viewport.|
|offset|[Offset](#schemaoffset)|false|none|Offset the location of the title relative to it's position on the screen.|

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

<h2 id="tocSimageasset">ImageAsset</h2>

<a id="schemaimageasset"></a>

```json
{
  "type": "image",
  "src": "string"
}

```

*The ImageAsset is used to create video from images. The src must be a publicly accessible URL to an image resource such as a jpg or png file.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>image</b> for images.|
|src|string|true|none|The image source URL. The URL must be publicly accessible or include credentials.|

<h2 id="tocSvideoasset">VideoAsset</h2>

<a id="schemavideoasset"></a>

```json
{
  "type": "video",
  "src": "string",
  "trim": 0,
  "volume": 0
}

```

*The VideoAsset is used to create video sequences from video files. The src must be a publicly accessible URL to a video resource such as an mp4 file.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>video</b> for videos.|
|src|string|true|none|The video source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the video clip, in seconds (defaults to 0). Videos will start from the in trim point. The video will play until the file ends or the Clip length is reached.|
|volume|number|false|none|Set the volume for the video clip between 0 and 1 where 0 is muted and 1 is full volume (defaults to 0).|

<h2 id="tocShtmlasset">HtmlAsset</h2>

<a id="schemahtmlasset"></a>

```json
{
  "type": "html",
  "html": "<p>Hello <b>World</b></p>",
  "css": "p { color: #ffffff; } b { color: #ffff00; }",
  "width": 400,
  "height": 300,
  "background": "transparent",
  "position": "center"
}

```

*The HtmlAsset clip type lets you create text based layout and formatting using HTML and CSS. You can also set the height and width of a bounding box for the HTML content to sit within. Text and elements will wrap within the bounding box.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>html</b> for HTML.|
|html|string|true|none|The HTML text string.|
|css|string|false|none|The CSS text string to apply styling to the HTML.|
|width|number|false|none|Set the width of the HTML asset bounding box. Text will wrap to fill the bounding box.|
|height|number|false|none|Set the width of the HTML asset bounding box. Text and elements will be masked if they exceed the  height of the bounding box.|
|background|string|false|none|Apply a background color behind the HTML bounding box using. Set the text color using hexadecimal  color notation. Transparency is supported by setting the first two characters of the hex string  (opposite to HTML), i.e. #80ffffff will be white with 50% transparency.|
|position|string|false|none|Place the HTML in one of nine predefined positions within the HTML area.|

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

<h2 id="tocSaudioasset">AudioAsset</h2>

<a id="schemaaudioasset"></a>

```json
{
  "type": "audio",
  "src": "string",
  "trim": 0,
  "volume": 0
}

```

*The AudioAsset is used to add sound effects and audio at specific intervals on the timeline. The src must be a publicly accessible URL to an audio resource such  as an mp3 file.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>audio</b> for audio assets.|
|src|string|true|none|The audio source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the audio clip, in seconds (defaults to 0). Audio will start from the in trim point. The audio will play until the file ends or the Clip length is reached.|
|volume|number|false|none|Set the volume for the audio clip between 0 and 1 where 0 is muted and 1 is full volume (defaults to 1).|

<h2 id="tocSlumaasset">LumaAsset</h2>

<a id="schemalumaasset"></a>

```json
{
  "type": "luma",
  "src": "string",
  "trim": 0
}

```

*The LumaAsset is used to create luma matte transitions between other assets. A luma matte is  a grey scale animated video where the black areas are transparent and the white areas solid. The luma matte animation should be provided as an mp4 video file. The src must be a publicly  accessible URL to the file.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>luma</b> for luma mattes.|
|src|string|true|none|The luma matte video source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the luma video clip, in seconds (defaults to 0). Videos will start from the in trim point. The luma matte video will play until the file ends or the Clip length is reached.|

<h2 id="tocStransition">Transition</h2>

<a id="schematransition"></a>

```json
{
  "in": "fade",
  "out": "fade"
}

```

*In and out transitions for a clip - i.e. fade in and fade out*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|in|string|false|none|The transition in|
|out|string|false|none|The transition out|

#### Enumerated Values

|Property|Value|
|---|---|
|in|fade|
|in|reveal|
|in|wipeLeft|
|in|wipeRight|
|out|fade|
|out|reveal|
|out|wipeLeft|
|out|wipeRight|

<h2 id="tocSfont">Font</h2>

<a id="schemafont"></a>

```json
{
  "src": "string"
}

```

*Download a custom font to use with the HTML asset type, using the font name in the CSS or font tag.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|src|string|true|none|The URL of the font file. The URL must be publicly accessible or include credentials.|

<h2 id="tocSoffset">Offset</h2>

<a id="schemaoffset"></a>

```json
{
  "x": -1,
  "y": -1
}

```

*Offsets the position of an asset horizontally or vertically by a relative distance.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|x|number(float)|false|none|Offset an asset on the horizontal axis (left or right), range varies from -1 to 1. Positive numbers move the asset right, negative left. For all assets except titles the distance moved is relative to the width  of the viewport - i.e. an X offset of 0.5 will move the asset half the  screen width to the right.|
|y|number(float)|false|none|Offset an asset on the vertical axis (up or down), range varies from -1 to 1. Positive numbers move the asset up, negative down. For all assets except titles the distance moved is relative to the height  of the viewport - i.e. an Y offset of 0.5 will move the asset up half the  screen height.|

<h2 id="tocSoutput">Output</h2>

<a id="schemaoutput"></a>

```json
{
  "format": "mp4",
  "resolution": "preview",
  "aspectRatio": "16:9",
  "poster": {
    "capture": 0
  },
  "thumbnail": {
    "capture": 0,
    "scale": 0
  }
}

```

*The video output format.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|format|string|true|none|`mp4` video or animated `gif`|
|resolution|string|true|none|The output resolution of the video. <ul>   <li>`preview` - 512px x 288px @ 15fps</li>   <li>`mobile` - 640px x 360px @ 25fps</li>   <li>`sd` - 1024px x 576px @25fps</li>   <li>`hd` - 1280px x 720px @25fps</li>   <li>`1080` - 1920px x 1080px @25fps</li> </ul>|
|aspectRatio|string|false|none|The aspect ratio (shape) of the video. Useful for social media sites. Options are: <ul>   <li>`16:9` - regular landscape/horizontal aspect ratio (default)</li>   <li>`9:16` - vertical/portrait aspect ratio.</li>   <li>`1:1` - square aspect ratio.</li> </ul>|
|poster|[Poster](#schemaposter)|false|none|Generate a poster image from a specific point on the timeline.|
|thumbnail|[Thumbnail](#schemathumbnail)|false|none|Generate a thumbnail image from a specific point on the timeline.|

#### Enumerated Values

|Property|Value|
|---|---|
|format|mp4|
|format|gif|
|resolution|preview|
|resolution|mobile|
|resolution|sd|
|resolution|hd|
|resolution|1080|
|aspectRatio|16:9|
|aspectRatio|9:16|
|aspectRatio|1:1|

<h2 id="tocSposter">Poster</h2>

<a id="schemaposter"></a>

```json
{
  "capture": 0
}

```

*Generate a poster image for the video at a specific point from the timeline. The poster image size will match the size of the output video.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|capture|number|true|none|The point on the timeline in seconds to capture a single frame to use as the poster image.|

<h2 id="tocSthumbnail">Thumbnail</h2>

<a id="schemathumbnail"></a>

```json
{
  "capture": 0,
  "scale": 0
}

```

*Generate a thumbnail image for the video at a specific point from the timeline.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|capture|number|true|none|The point on the timeline in seconds to capture a single frame to use as the thumbnail image.|
|scale|number|true|none|Scale the thumbnail size to a fraction of the viewport size - i.e. setting the scale to 0.5 will scale  the thumbnail to half the size of the viewport.|

<h2 id="tocSqueuedresponse">QueuedResponse</h2>

<a id="schemaqueuedresponse"></a>

```json
{
  "success": true,
  "message": "string",
  "response": {
    "message": "string",
    "id": "string"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|none|
|message|string|true|none|none|
|response|[QueuedResponseData](#schemaqueuedresponsedata)|true|none|none|

<h2 id="tocSqueuedresponsedata">QueuedResponseData</h2>

<a id="schemaqueuedresponsedata"></a>

```json
{
  "message": "string",
  "id": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|true|none|Success response message|
|id|string|true|none|The id of the render task in UUID format|

<h2 id="tocSrenderresponse">RenderResponse</h2>

<a id="schemarenderresponse"></a>

```json
{
  "success": true,
  "message": "string",
  "response": {
    "status": "queued",
    "id": "string",
    "owner": "string",
    "url": "string",
    "data": {
      "timeline": {
        "soundtrack": {
          "src": "string",
          "effect": "fadeIn",
          "volume": 0
        },
        "background": "#000000",
        "fonts": [
          {
            "src": "string"
          }
        ],
        "tracks": [
          {
            "clips": [
              {
                "asset": {
                  "type": "title",
                  "text": "string",
                  "style": "minimal",
                  "color": "#ffffff",
                  "size": "medium",
                  "background": "string",
                  "position": "center",
                  "offset": {
                    "x": -1,
                    "y": -1
                  }
                },
                "start": 0,
                "length": 0,
                "fit": "crop",
                "scale": 0,
                "position": "center",
                "offset": {
                  "x": -1,
                  "y": -1
                },
                "transition": {
                  "in": "fade",
                  "out": "fade"
                },
                "effect": "zoomIn",
                "filter": "boost",
                "opacity": 0
              }
            ]
          }
        ]
      },
      "output": {
        "format": "mp4",
        "resolution": "preview",
        "aspectRatio": "16:9",
        "poster": {
          "capture": 0
        },
        "thumbnail": {
          "capture": 0,
          "scale": 0
        }
      },
      "callback": "string"
    },
    "created": "string",
    "updated": "string"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|none|
|message|string|true|none|none|
|response|[RenderResponseData](#schemarenderresponsedata)|true|none|none|

<h2 id="tocSrenderresponsedata">RenderResponseData</h2>

<a id="schemarenderresponsedata"></a>

```json
{
  "status": "queued",
  "id": "string",
  "owner": "string",
  "url": "string",
  "data": {
    "timeline": {
      "soundtrack": {
        "src": "string",
        "effect": "fadeIn",
        "volume": 0
      },
      "background": "#000000",
      "fonts": [
        {
          "src": "string"
        }
      ],
      "tracks": [
        {
          "clips": [
            {
              "asset": {
                "type": "title",
                "text": "string",
                "style": "minimal",
                "color": "#ffffff",
                "size": "medium",
                "background": "string",
                "position": "center",
                "offset": {
                  "x": -1,
                  "y": -1
                }
              },
              "start": 0,
              "length": 0,
              "fit": "crop",
              "scale": 0,
              "position": "center",
              "offset": {
                "x": -1,
                "y": -1
              },
              "transition": {
                "in": "fade",
                "out": "fade"
              },
              "effect": "zoomIn",
              "filter": "boost",
              "opacity": 0
            }
          ]
        }
      ]
    },
    "output": {
      "format": "mp4",
      "resolution": "preview",
      "aspectRatio": "16:9",
      "poster": {
        "capture": 0
      },
      "thumbnail": {
        "capture": 0,
        "scale": 0
      }
    },
    "callback": "string"
  },
  "created": "string",
  "updated": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|The status of the render task|
|id|string|true|none|The id of the render task in UUID format|
|owner|string|true|none|The owner id of the render task|
|url|string|false|none|The URL of the final video. This will only be available if status is done.|
|data|[Edit](#schemaedit)|true|none|The timeline and output data to be rendered|
|created|string|true|none|The time the render task was initially queued|
|updated|string|true|none|The time the render status was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|status|queued|
|status|fetching|
|status|rendering|
|status|saving|
|status|done|
|status|failed|

