const { TimecodeEmitter } = require('./dist');

const timecode = new TimecodeEmitter(30);

timecode.onFrame(console.log).start();