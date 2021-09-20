'use strict';

(function (w, d) {

w.addEventListener('DOMContentLoaded', function () {

	svg4everybody();

	class Range {
		flag = false;

		constructor(selector) {
			this.selector = selector;
			this.thumb = this.selector.querySelector('.thumb');
			this.track = this.selector.querySelector('.track-inner');
			this.range = this.selector.querySelector('.range');

			['touchstart', 'mousedown'].forEach(eventName => {
				[this.range, this.thumb].forEach(element => {
					element.addEventListener(eventName, e => {
						this.flag = true;
					});
				});
			});

			['touchend', 'mouseup', 'touchcancel'].forEach(eventName => {
					document.addEventListener(eventName, e => {
					this.flag = false;
				});
			});

			['touchmove', 'mousemove'].forEach(eventName => {
					document.addEventListener(eventName, e => {
					let mrgLeft = this.selector.offsetLeft;
					if (!this.flag) return false;
					let x = Math.max(0, Math.min(e.pageX - mrgLeft, this.range.offsetWidth));
					this.calc(x);
				});
			});
		}

		calc(x) {
			this.thumb.style.transform = 'translate(' + (x - this.thumb.offsetWidth / 2) + 'px, -50%)';
			this.track.style.width = x + 'px';
		}
	}

	let range1 = new Range(d.querySelector('.range1'));
	let range2 = new Range(d.querySelector('.range2'));

});

})(window, document);