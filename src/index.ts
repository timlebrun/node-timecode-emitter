import { EventEmitter } from 'events';
import { ITimecodeEmitterFrameEvent } from './interfaces';
import { pad } from './helpers';

export class TimecodeEmitter extends EventEmitter {

	private intervalId = null;
	private frameDuration = 1000 / this.frameRate;

	get hour () { return this._hour; }
	get minute() { return this._minute; }
	get second() { return this._second; }
	get frame () { return this._frame; }
	
	get code() { return this._code; }

	get time () { return this._time; }

	
	// Private properties to make sure they wont be tinkered with
	private _hour: number = 0;
	private _minute: number = 0;
	private _second: number = 0;
	private _frame: number = 0;

	private _code: string = '00:00:00:00';

	private _time: number = this.startTime;

	private _muted: boolean = false;

	constructor(
		private readonly frameRate: number,
		private readonly startTime: number = Date.now(),
	) { super(); }

	/**
	 * Retrieves hours, minutes, seconds and frames from a millisecond timestamp
	 * and updates the internal values 
	 * 
	 * @param milliseconds 
	 */
	updateTime(milliseconds: number) {
		let register = milliseconds;

		register = register % 86400000; // Remove days from register
		this._hour = Math.floor(register / 3600000);
		
		register = register % 3600000; // Remove hours from register
		this._minute = Math.floor(register / 60000);

		register = register % 60000 // Remove minutes from register
		this._second = Math.floor(register / 1000);

		register = register % 1000 // Remove seconds from register
		this._frame = Math.floor(register / this.frameDuration);

		this._code = `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}:${pad(this._frame)}`;
		this._time = milliseconds;

		return this;
	}

	/**
	 * Quick sugar function for callback binding
	 * 
	 * @param callback 
	 */
	onFrame(callback: (event: ITimecodeEmitterFrameEvent) => void) {
		this.on('frame', callback);

		return this;
	}

	/**
	 * Increments time by one frame and emits event
	 * Executed on play and then on all frames
	 */
	private onIntervalFrame() {
		if (this._muted) return;

		this.updateTime(this._time + this.frameDuration);
		this.emit('frame', {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			frame: this._frame,
			time: this._time,
			code: this._code,
		} as ITimecodeEmitterFrameEvent);
	}

	/**
	 * Starts the interval
	 */
	start() {
		this.onIntervalFrame();
		this.intervalId = setInterval(() => this.onIntervalFrame(), this.frameDuration);

		return this;
	}

	/**
	 * Stops and resets time to `startTime`
	 */
	stop() {
		this.pause();
		this._time = this.startTime;

		return this;
	}

	/**
	 * Pauses the interval updating time and sending frames
	 * Resumes when `play()` is called again
	 * (will restart out of sync, but at the time it paused)
	 */
	pause() {
		clearInterval(this.intervalId);

		return this;
	}

	/**
	 * Mutes timecode output, but keeps incrementing
	 */
	mute() {
		this._muted = true;

		return this;
	}

	/**
	 * Unmutes timecode output
	 */
	unmute() {
		this._muted = false;

		return this;
	}
}