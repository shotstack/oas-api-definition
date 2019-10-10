---
title: Shotstack
language_tabs: []
toc_footers: []
includes: []
search: true
highlight_theme: dracula
headingLevel: 2

---

<h1 id="shotstack">Shotstack v1</h1>

> Scroll down for example requests and responses.

The Shotstack API is a video editing service that allows for the programatic creation of videos using JSON.

Base URLs:

* <a href="https://api.shotstack.io/{version}">https://api.shotstack.io/{version}</a>

    * **version** -  Default: version

# Authentication

* API Key (DeveloperKey)
    - Parameter Name: **x-api-key**, in: header. Secured using an API developer key as specified.

<h1 id="shotstack-endpoints">Endpoints</h1>

## postRender

<a id="opIdpostRender"></a>

> Code samples

`POST /render`

Render the contents of a timeline as a video file.

> Body parameter

```json
{
  "timeline": {
    "soundtrack": {
      "src": "string",
      "effect": "fadeIn"
    },
    "background": "string",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "title",
              "text": "string",
              "style": "minimal",
              "color": "white",
              "size": "medium",
              "background": "string",
              "position": "center",
              "offset": {
                "x": 0,
                "y": 0
              }
            },
            "start": 0,
            "length": 0,
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "boost"
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "preview"
  }
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
    "message": "Render Successfuly Queued",
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
      "effect": "fadeIn"
    },
    "background": "string",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "title",
              "text": "string",
              "style": "minimal",
              "color": "white",
              "size": "medium",
              "background": "string",
              "position": "center",
              "offset": {
                "x": 0,
                "y": 0
              }
            },
            "start": 0,
            "length": 0,
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn",
            "filter": "boost"
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "preview"
  }
}

```

*An edit defines the content of the video in a timeline and the output format.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeline|[Timeline](#schematimeline)|true|none|A timeline represents the contents of a video edit over time, in seconds. A timeline consists of layers called tracks. Tracks are composed of titles, images or video segments referred to as clips which are placed along the track at specific starting point and lasting for a specific amount of time.|
|output|[Output](#schemaoutput)|true|none|The video output format|

<h2 id="tocStimeline">Timeline</h2>

<a id="schematimeline"></a>

```json
{
  "soundtrack": {
    "src": "string",
    "effect": "fadeIn"
  },
  "background": "string",
  "tracks": [
    {
      "clips": [
        {
          "asset": {
            "type": "title",
            "text": "string",
            "style": "minimal",
            "color": "white",
            "size": "medium",
            "background": "string",
            "position": "center",
            "offset": {
              "x": 0,
              "y": 0
            }
          },
          "start": 0,
          "length": 0,
          "transition": {
            "in": "fade",
            "out": "fade"
          },
          "effect": "zoomIn",
          "filter": "boost"
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
|background|string|false|none|A hexidecimal value for the timeline background colour. Defaults to black (#000000).|
|tracks|[[Track](#schematrack)]|true|none|A timeline consists of an array of tracks, each track containing clips. Tracks are layered on top of each other in the same order they are added to the array with the top most track layered over the top of those below it. Ensure that a track containing titles is the top most track so that it is displayed above videos and images.|

<h2 id="tocSsoundtrack">Soundtrack</h2>

<a id="schemasoundtrack"></a>

```json
{
  "src": "string",
  "effect": "fadeIn"
}

```

*A music or audio file in mp3 format that plays for the duration of the rendered video or the length of the audio file, which ever is shortest.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|src|string|true|none|The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.|
|effect|string|false|none|The effect to apply to the audio file|

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
        "color": "white",
        "size": "medium",
        "background": "string",
        "position": "center",
        "offset": {
          "x": 0,
          "y": 0
        }
      },
      "start": 0,
      "length": 0,
      "transition": {
        "in": "fade",
        "out": "fade"
      },
      "effect": "zoomIn",
      "filter": "boost"
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
    "color": "white",
    "size": "medium",
    "background": "string",
    "position": "center",
    "offset": {
      "x": 0,
      "y": 0
    }
  },
  "start": 0,
  "length": 0,
  "transition": {
    "in": "fade",
    "out": "fade"
  },
  "effect": "zoomIn",
  "filter": "boost"
}

```

*A clip is a container for a specific type of asset, i.e. a title, photo or video. You use a Clip to define when an asset will display on the timeline, how long it will play for and transitions and effects to apply to it.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|asset|any|true|none|The type of asset to display for the duration of this Clip. Value must be one of <b>TitleAsset</b>, <b>ImageAsset</b> or <b>VideoAsset</b>.|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[TitleAsset](#schematitleasset)|false|none|The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ImageAsset](#schemaimageasset)|false|none|The ImageAsset is used to create video from images. The src must be a publicly accesible URL to an image resource such as a jpg or png file.|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[VideoAsset](#schemavideoasset)|false|none|The VideoAsset is used to create video sequences from video files. The src must be a publicly accesible URL to a video resource such as an mp4 file. The in and out attributes of the parent Clip let you trim the video file by setting the start and end point to use.|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|start|number|true|none|The start position of the Clip on the timeline, in seconds.|
|length|number|true|none|The length, in seconds, the Clip should play for.|
|transition|[Transition](#schematransition)|false|none|In and out transitions for a clip - i.e. fade in and fade out|
|effect|string|false|none|A motion effect to apply to the Clip.|
|filter|string|false|none|A filter effect to apply to the Clip.|

#### Enumerated Values

|Property|Value|
|---|---|
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
  "color": "white",
  "size": "medium",
  "background": "string",
  "position": "center",
  "offset": {
    "x": 0,
    "y": 0
  }
}

```

*The TitleAsset clip type lets you create video titles from a text string and apply styling and positioning.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>title</b> for titles.|
|text|string|true|none|The title text string - i.e. "My Title".|
|style|string|false|none|Uses a preset to apply font properties and stylng to the title.|
|color|string|false|none|Set the text color using HTML color notation including hexidecimal, rgb, rgba and  color name. Transparency is supported by setting the last two characters of a hex string,  i.e. #ffffff33 or using rgba, i.e. rgba(255, 255, 255, 0.5).|
|size|string|false|none|Set the relative size of the text using predefined sizes from xx-small to xx-large.|
|background|string|false|none|Apply a background color behind the text using HTML color notation with support for  transparency. Useful for subtitles.|
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

*The ImageAsset is used to create video from images. The src must be a publicly accesible URL to an image resource such as a jpg or png file.*

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

*The VideoAsset is used to create video sequences from video files. The src must be a publicly accesible URL to a video resource such as an mp4 file. The in and out attributes of the parent Clip let you trim the video file by setting the start and end point to use.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|The type of asset - set to <b>video</b> for videos.|
|src|string|true|none|The video source URL. The URL must be publicly accessible or include credentials.|
|trim|number|false|none|The start trim point of the clip, in seconds (defaults to 0). Videos will start from the in trim point. The video will play until the file ends or the Clip length is reached.|
|volume|number|false|none|Set the volume for the clip between 0 and 1 where 0 is muted and 1 is full volume (defaults to 0).|

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
|in|wipeLeft|
|in|wipeRight|
|out|fade|
|out|wipeLeft|
|out|wipeRight|

<h2 id="tocSoffset">Offset</h2>

<a id="schemaoffset"></a>

```json
{
  "x": 0,
  "y": 0
}

```

*Offsets the position of an asset horizontally or vertically by a relative distance.*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|x|number|false|none|Offset an asset on the horizontal axis (left or right), range varies from -1 to 1.|
|y|number|false|none|Offset an asset on the vertical axis (up or down), range varies from -1 to 1.|

<h2 id="tocSoutput">Output</h2>

<a id="schemaoutput"></a>

```json
{
  "format": "mp4",
  "resolution": "preview"
}

```

*The video output format*

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|format|string|true|none|none|
|resolution|string|true|none|none|

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
          "effect": "fadeIn"
        },
        "background": "string",
        "tracks": [
          {
            "clips": [
              {
                "asset": {
                  "type": "title",
                  "text": "string",
                  "style": "minimal",
                  "color": "white",
                  "size": "medium",
                  "background": "string",
                  "position": "center",
                  "offset": {
                    "x": 0,
                    "y": 0
                  }
                },
                "start": 0,
                "length": 0,
                "transition": {
                  "in": "fade",
                  "out": "fade"
                },
                "effect": "zoomIn",
                "filter": "boost"
              }
            ]
          }
        ]
      },
      "output": {
        "format": "mp4",
        "resolution": "preview"
      }
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
        "effect": "fadeIn"
      },
      "background": "string",
      "tracks": [
        {
          "clips": [
            {
              "asset": {
                "type": "title",
                "text": "string",
                "style": "minimal",
                "color": "white",
                "size": "medium",
                "background": "string",
                "position": "center",
                "offset": {
                  "x": 0,
                  "y": 0
                }
              },
              "start": 0,
              "length": 0,
              "transition": {
                "in": "fade",
                "out": "fade"
              },
              "effect": "zoomIn",
              "filter": "boost"
            }
          ]
        }
      ]
    },
    "output": {
      "format": "mp4",
      "resolution": "preview"
    }
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

