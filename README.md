NodeJS Timecode Emitter
===

A simple class that given a start time and a framerate, will emit a `frame` event periodically.

## Installation

```sh
yarn add timecode-emitter
```

## Usage

```ts
import { TimecodeEmitter } from 'timecode-emitter';

const startTime = Date.now();
const timecode = new TimecodeEmitter(48, startTime); // Supports weird framerates

timecode
  .onFrame(frame => console.log(`FRAME ${frame.code}`))
  .start();

```

... will output ...

```sh
> node script.js
FRAME 00:01:08:00
FRAME 00:01:08:01
FRAME 00:01:08:02
FRAME 00:01:08:03
FRAME 00:01:08:04
...
```

## `frame` event data

```js
{
  hour: 3,
  minute: 4,
  second: 47,
  frame: 12,
  code: '03:04:47:12'
}
```

