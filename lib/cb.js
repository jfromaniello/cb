module.exports = function(callback) {

	var cb = function() {
		if (timedout || (once && count)) return;
		count += 1;
		tid && clearTimeout(tid);

		var args = Array.prototype.slice.call(arguments);
		process.nextTick(function() {
			if (!errback) return callback.apply(this, args);
			args[0] ? errback(args[0]) : callback.apply(this, args.slice(1));
		});

	}, count = 0, once = false, timedout = false, errback, tid;

	cb.timeout = function(ms) {
		var start = Date.now();
		tid && clearTimeout(tid);
		tid = setTimeout(function() {
			cb(new TimeoutError(ms, Date.now() - start));
			timedout = true;
		}, ms);
		return cb;
	};

	cb.error = function(func) { errback = func; return cb; };

	cb.once = function() { once = true; return cb; };

	return cb;

};

var TimeoutError = module.exports.TimeoutError = function TimeoutError(ms, real) {
	this.message = 'Specified timeout of ' + ms + 'ms was reached. Real elapsed time ' + real + 'ms';
	Error.captureStackTrace(this, this.constructor);
};
TimeoutError.prototype = new Error;
TimeoutError.prototype.constructor = TimeoutError;
TimeoutError.prototype.name = 'TimeoutError';
