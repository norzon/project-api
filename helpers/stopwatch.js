module.exports = new class Stopwatch {

	constructor() {
		const now = new Date();
		this.startTime = now;
		this.stopTime = now;
		this.time = 0;
	}

	start() {
		this.startTime = new Date();
	}

	stop() {
		this.stopTime = new Date();
		this.diff = this.stopTime.getTime() - this.startTime.getTime();
		return this.diff;
	}

	untilNow() {
		return new Date().getTime() - this.startTime.getTime();
	}

}
