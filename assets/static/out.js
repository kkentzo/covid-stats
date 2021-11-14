(() => {
  // node_modules/chart.js/dist/chunks/helpers.segment.js
  var requestAnimFrame = function() {
    if (typeof window === "undefined") {
      return function(callback2) {
        return callback2();
      };
    }
    return window.requestAnimationFrame;
  }();
  function throttled(fn, thisArg, updateFn) {
    const updateArgs = updateFn || ((args2) => Array.prototype.slice.call(args2));
    let ticking = false;
    let args = [];
    return function(...rest) {
      args = updateArgs(rest);
      if (!ticking) {
        ticking = true;
        requestAnimFrame.call(window, () => {
          ticking = false;
          fn.apply(thisArg, args);
        });
      }
    };
  }
  function debounce(fn, delay) {
    let timeout;
    return function(...args) {
      if (delay) {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay, args);
      } else {
        fn.apply(this, args);
      }
      return delay;
    };
  }
  var _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
  var _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
  var _textX = (align, left, right, rtl) => {
    const check = rtl ? "left" : "right";
    return align === check ? right : align === "center" ? (left + right) / 2 : left;
  };
  function noop() {
  }
  var uid = function() {
    let id = 0;
    return function() {
      return id++;
    };
  }();
  function isNullOrUndef(value) {
    return value === null || typeof value === "undefined";
  }
  function isArray(value) {
    if (Array.isArray && Array.isArray(value)) {
      return true;
    }
    const type = Object.prototype.toString.call(value);
    if (type.substr(0, 7) === "[object" && type.substr(-6) === "Array]") {
      return true;
    }
    return false;
  }
  function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === "[object Object]";
  }
  var isNumberFinite = (value) => (typeof value === "number" || value instanceof Number) && isFinite(+value);
  function finiteOrDefault(value, defaultValue) {
    return isNumberFinite(value) ? value : defaultValue;
  }
  function valueOrDefault(value, defaultValue) {
    return typeof value === "undefined" ? defaultValue : value;
  }
  var toPercentage = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 : value / dimension;
  var toDimension = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 * dimension : +value;
  function callback(fn, args, thisArg) {
    if (fn && typeof fn.call === "function") {
      return fn.apply(thisArg, args);
    }
  }
  function each(loopable, fn, thisArg, reverse) {
    let i, len, keys;
    if (isArray(loopable)) {
      len = loopable.length;
      if (reverse) {
        for (i = len - 1; i >= 0; i--) {
          fn.call(thisArg, loopable[i], i);
        }
      } else {
        for (i = 0; i < len; i++) {
          fn.call(thisArg, loopable[i], i);
        }
      }
    } else if (isObject(loopable)) {
      keys = Object.keys(loopable);
      len = keys.length;
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[keys[i]], keys[i]);
      }
    }
  }
  function _elementsEqual(a0, a1) {
    let i, ilen, v0, v1;
    if (!a0 || !a1 || a0.length !== a1.length) {
      return false;
    }
    for (i = 0, ilen = a0.length; i < ilen; ++i) {
      v0 = a0[i];
      v1 = a1[i];
      if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
        return false;
      }
    }
    return true;
  }
  function clone$1(source) {
    if (isArray(source)) {
      return source.map(clone$1);
    }
    if (isObject(source)) {
      const target = Object.create(null);
      const keys = Object.keys(source);
      const klen = keys.length;
      let k = 0;
      for (; k < klen; ++k) {
        target[keys[k]] = clone$1(source[keys[k]]);
      }
      return target;
    }
    return source;
  }
  function isValidKey(key) {
    return ["__proto__", "prototype", "constructor"].indexOf(key) === -1;
  }
  function _merger(key, target, source, options) {
    if (!isValidKey(key)) {
      return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
      merge(tval, sval, options);
    } else {
      target[key] = clone$1(sval);
    }
  }
  function merge(target, source, options) {
    const sources = isArray(source) ? source : [source];
    const ilen = sources.length;
    if (!isObject(target)) {
      return target;
    }
    options = options || {};
    const merger = options.merger || _merger;
    for (let i = 0; i < ilen; ++i) {
      source = sources[i];
      if (!isObject(source)) {
        continue;
      }
      const keys = Object.keys(source);
      for (let k = 0, klen = keys.length; k < klen; ++k) {
        merger(keys[k], target, source, options);
      }
    }
    return target;
  }
  function mergeIf(target, source) {
    return merge(target, source, { merger: _mergerIf });
  }
  function _mergerIf(key, target, source) {
    if (!isValidKey(key)) {
      return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
      mergeIf(tval, sval);
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = clone$1(sval);
    }
  }
  var emptyString = "";
  var dot = ".";
  function indexOfDotOrLength(key, start) {
    const idx = key.indexOf(dot, start);
    return idx === -1 ? key.length : idx;
  }
  function resolveObjectKey(obj, key) {
    if (key === emptyString) {
      return obj;
    }
    let pos = 0;
    let idx = indexOfDotOrLength(key, pos);
    while (obj && idx > pos) {
      obj = obj[key.substr(pos, idx - pos)];
      pos = idx + 1;
      idx = indexOfDotOrLength(key, pos);
    }
    return obj;
  }
  function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  var defined = (value) => typeof value !== "undefined";
  var isFunction = (value) => typeof value === "function";
  var setsEqual = (a, b) => {
    if (a.size !== b.size) {
      return false;
    }
    for (const item of a) {
      if (!b.has(item)) {
        return false;
      }
    }
    return true;
  };
  var PI = Math.PI;
  var TAU = 2 * PI;
  var PITAU = TAU + PI;
  var INFINITY = Number.POSITIVE_INFINITY;
  var RAD_PER_DEG = PI / 180;
  var HALF_PI = PI / 2;
  var QUARTER_PI = PI / 4;
  var TWO_THIRDS_PI = PI * 2 / 3;
  var log10 = Math.log10;
  var sign = Math.sign;
  function niceNum(range) {
    const roundedRange = Math.round(range);
    range = almostEquals(range, roundedRange, range / 1e3) ? roundedRange : range;
    const niceRange = Math.pow(10, Math.floor(log10(range)));
    const fraction = range / niceRange;
    const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return niceFraction * niceRange;
  }
  function _factorize(value) {
    const result = [];
    const sqrt = Math.sqrt(value);
    let i;
    for (i = 1; i < sqrt; i++) {
      if (value % i === 0) {
        result.push(i);
        result.push(value / i);
      }
    }
    if (sqrt === (sqrt | 0)) {
      result.push(sqrt);
    }
    result.sort((a, b) => a - b).pop();
    return result;
  }
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  function almostEquals(x, y, epsilon) {
    return Math.abs(x - y) < epsilon;
  }
  function almostWhole(x, epsilon) {
    const rounded = Math.round(x);
    return rounded - epsilon <= x && rounded + epsilon >= x;
  }
  function _setMinAndMaxByKey(array, target, property) {
    let i, ilen, value;
    for (i = 0, ilen = array.length; i < ilen; i++) {
      value = array[i][property];
      if (!isNaN(value)) {
        target.min = Math.min(target.min, value);
        target.max = Math.max(target.max, value);
      }
    }
  }
  function toRadians(degrees) {
    return degrees * (PI / 180);
  }
  function toDegrees(radians) {
    return radians * (180 / PI);
  }
  function _decimalPlaces(x) {
    if (!isNumberFinite(x)) {
      return;
    }
    let e = 1;
    let p = 0;
    while (Math.round(x * e) / e !== x) {
      e *= 10;
      p++;
    }
    return p;
  }
  function getAngleFromPoint(centrePoint, anglePoint) {
    const distanceFromXCenter = anglePoint.x - centrePoint.x;
    const distanceFromYCenter = anglePoint.y - centrePoint.y;
    const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
    let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
    if (angle < -0.5 * PI) {
      angle += TAU;
    }
    return {
      angle,
      distance: radialDistanceFromCenter
    };
  }
  function distanceBetweenPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  }
  function _angleDiff(a, b) {
    return (a - b + PITAU) % TAU - PI;
  }
  function _normalizeAngle(a) {
    return (a % TAU + TAU) % TAU;
  }
  function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
    const a = _normalizeAngle(angle);
    const s = _normalizeAngle(start);
    const e = _normalizeAngle(end);
    const angleToStart = _normalizeAngle(s - a);
    const angleToEnd = _normalizeAngle(e - a);
    const startToAngle = _normalizeAngle(a - s);
    const endToAngle = _normalizeAngle(a - e);
    return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
  }
  function _limitValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function _int16Range(value) {
    return _limitValue(value, -32768, 32767);
  }
  var atEdge = (t) => t === 0 || t === 1;
  var elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
  var elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
  var effects = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => -t * (t - 2),
    easeInOutQuad: (t) => (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (t -= 1) * t * t + 1,
    easeInOutCubic: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
    easeInOutQuart: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
    easeInOutQuint: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
    easeInSine: (t) => -Math.cos(t * HALF_PI) + 1,
    easeOutSine: (t) => Math.sin(t * HALF_PI),
    easeInOutSine: (t) => -0.5 * (Math.cos(PI * t) - 1),
    easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: (t) => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
    easeInOutExpo: (t) => atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
    easeInCirc: (t) => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
    easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
    easeInOutCirc: (t) => (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
    easeInElastic: (t) => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
    easeOutElastic: (t) => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
    easeInOutElastic(t) {
      const s = 0.1125;
      const p = 0.45;
      return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
    },
    easeInBack(t) {
      const s = 1.70158;
      return t * t * ((s + 1) * t - s);
    },
    easeOutBack(t) {
      const s = 1.70158;
      return (t -= 1) * t * ((s + 1) * t + s) + 1;
    },
    easeInOutBack(t) {
      let s = 1.70158;
      if ((t /= 0.5) < 1) {
        return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
      }
      return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    easeInBounce: (t) => 1 - effects.easeOutBounce(1 - t),
    easeOutBounce(t) {
      const m = 7.5625;
      const d = 2.75;
      if (t < 1 / d) {
        return m * t * t;
      }
      if (t < 2 / d) {
        return m * (t -= 1.5 / d) * t + 0.75;
      }
      if (t < 2.5 / d) {
        return m * (t -= 2.25 / d) * t + 0.9375;
      }
      return m * (t -= 2.625 / d) * t + 0.984375;
    },
    easeInOutBounce: (t) => t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
  };
  var map = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
  var hex = "0123456789ABCDEF";
  var h1 = (b) => hex[b & 15];
  var h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15];
  var eq = (b) => (b & 240) >> 4 === (b & 15);
  function isShort(v) {
    return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
  }
  function hexParse(str) {
    var len = str.length;
    var ret;
    if (str[0] === "#") {
      if (len === 4 || len === 5) {
        ret = {
          r: 255 & map[str[1]] * 17,
          g: 255 & map[str[2]] * 17,
          b: 255 & map[str[3]] * 17,
          a: len === 5 ? map[str[4]] * 17 : 255
        };
      } else if (len === 7 || len === 9) {
        ret = {
          r: map[str[1]] << 4 | map[str[2]],
          g: map[str[3]] << 4 | map[str[4]],
          b: map[str[5]] << 4 | map[str[6]],
          a: len === 9 ? map[str[7]] << 4 | map[str[8]] : 255
        };
      }
    }
    return ret;
  }
  function hexString(v) {
    var f = isShort(v) ? h1 : h2;
    return v ? "#" + f(v.r) + f(v.g) + f(v.b) + (v.a < 255 ? f(v.a) : "") : v;
  }
  function round(v) {
    return v + 0.5 | 0;
  }
  var lim = (v, l, h) => Math.max(Math.min(v, h), l);
  function p2b(v) {
    return lim(round(v * 2.55), 0, 255);
  }
  function n2b(v) {
    return lim(round(v * 255), 0, 255);
  }
  function b2n(v) {
    return lim(round(v / 2.55) / 100, 0, 1);
  }
  function n2p(v) {
    return lim(round(v * 100), 0, 100);
  }
  var RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
  function rgbParse(str) {
    const m = RGB_RE.exec(str);
    let a = 255;
    let r, g, b;
    if (!m) {
      return;
    }
    if (m[7] !== r) {
      const v = +m[7];
      a = 255 & (m[8] ? p2b(v) : v * 255);
    }
    r = +m[1];
    g = +m[3];
    b = +m[5];
    r = 255 & (m[2] ? p2b(r) : r);
    g = 255 & (m[4] ? p2b(g) : g);
    b = 255 & (m[6] ? p2b(b) : b);
    return {
      r,
      g,
      b,
      a
    };
  }
  function rgbString(v) {
    return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
  }
  var HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
  function hsl2rgbn(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)];
  }
  function hsv2rgbn(h, s, v) {
    const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5), f(3), f(1)];
  }
  function hwb2rgbn(h, w, b) {
    const rgb = hsl2rgbn(h, 1, 0.5);
    let i;
    if (w + b > 1) {
      i = 1 / (w + b);
      w *= i;
      b *= i;
    }
    for (i = 0; i < 3; i++) {
      rgb[i] *= 1 - w - b;
      rgb[i] += w;
    }
    return rgb;
  }
  function rgb2hsl(v) {
    const range = 255;
    const r = v.r / range;
    const g = v.g / range;
    const b = v.b / range;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h, s, d;
    if (max !== min) {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = h * 60 + 0.5;
    }
    return [h | 0, s || 0, l];
  }
  function calln(f, a, b, c) {
    return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
  }
  function hsl2rgb(h, s, l) {
    return calln(hsl2rgbn, h, s, l);
  }
  function hwb2rgb(h, w, b) {
    return calln(hwb2rgbn, h, w, b);
  }
  function hsv2rgb(h, s, v) {
    return calln(hsv2rgbn, h, s, v);
  }
  function hue(h) {
    return (h % 360 + 360) % 360;
  }
  function hueParse(str) {
    const m = HUE_RE.exec(str);
    let a = 255;
    let v;
    if (!m) {
      return;
    }
    if (m[5] !== v) {
      a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
    }
    const h = hue(+m[2]);
    const p1 = +m[3] / 100;
    const p2 = +m[4] / 100;
    if (m[1] === "hwb") {
      v = hwb2rgb(h, p1, p2);
    } else if (m[1] === "hsv") {
      v = hsv2rgb(h, p1, p2);
    } else {
      v = hsl2rgb(h, p1, p2);
    }
    return {
      r: v[0],
      g: v[1],
      b: v[2],
      a
    };
  }
  function rotate(v, deg) {
    var h = rgb2hsl(v);
    h[0] = hue(h[0] + deg);
    h = hsl2rgb(h);
    v.r = h[0];
    v.g = h[1];
    v.b = h[2];
  }
  function hslString(v) {
    if (!v) {
      return;
    }
    const a = rgb2hsl(v);
    const h = a[0];
    const s = n2p(a[1]);
    const l = n2p(a[2]);
    return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
  }
  var map$1 = {
    x: "dark",
    Z: "light",
    Y: "re",
    X: "blu",
    W: "gr",
    V: "medium",
    U: "slate",
    A: "ee",
    T: "ol",
    S: "or",
    B: "ra",
    C: "lateg",
    D: "ights",
    R: "in",
    Q: "turquois",
    E: "hi",
    P: "ro",
    O: "al",
    N: "le",
    M: "de",
    L: "yello",
    F: "en",
    K: "ch",
    G: "arks",
    H: "ea",
    I: "ightg",
    J: "wh"
  };
  var names = {
    OiceXe: "f0f8ff",
    antiquewEte: "faebd7",
    aqua: "ffff",
    aquamarRe: "7fffd4",
    azuY: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "0",
    blanKedOmond: "ffebcd",
    Xe: "ff",
    XeviTet: "8a2be2",
    bPwn: "a52a2a",
    burlywood: "deb887",
    caMtXe: "5f9ea0",
    KartYuse: "7fff00",
    KocTate: "d2691e",
    cSO: "ff7f50",
    cSnflowerXe: "6495ed",
    cSnsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "ffff",
    xXe: "8b",
    xcyan: "8b8b",
    xgTMnPd: "b8860b",
    xWay: "a9a9a9",
    xgYF: "6400",
    xgYy: "a9a9a9",
    xkhaki: "bdb76b",
    xmagFta: "8b008b",
    xTivegYF: "556b2f",
    xSange: "ff8c00",
    xScEd: "9932cc",
    xYd: "8b0000",
    xsOmon: "e9967a",
    xsHgYF: "8fbc8f",
    xUXe: "483d8b",
    xUWay: "2f4f4f",
    xUgYy: "2f4f4f",
    xQe: "ced1",
    xviTet: "9400d3",
    dAppRk: "ff1493",
    dApskyXe: "bfff",
    dimWay: "696969",
    dimgYy: "696969",
    dodgerXe: "1e90ff",
    fiYbrick: "b22222",
    flSOwEte: "fffaf0",
    foYstWAn: "228b22",
    fuKsia: "ff00ff",
    gaRsbSo: "dcdcdc",
    ghostwEte: "f8f8ff",
    gTd: "ffd700",
    gTMnPd: "daa520",
    Way: "808080",
    gYF: "8000",
    gYFLw: "adff2f",
    gYy: "808080",
    honeyMw: "f0fff0",
    hotpRk: "ff69b4",
    RdianYd: "cd5c5c",
    Rdigo: "4b0082",
    ivSy: "fffff0",
    khaki: "f0e68c",
    lavFMr: "e6e6fa",
    lavFMrXsh: "fff0f5",
    lawngYF: "7cfc00",
    NmoncEffon: "fffacd",
    ZXe: "add8e6",
    ZcSO: "f08080",
    Zcyan: "e0ffff",
    ZgTMnPdLw: "fafad2",
    ZWay: "d3d3d3",
    ZgYF: "90ee90",
    ZgYy: "d3d3d3",
    ZpRk: "ffb6c1",
    ZsOmon: "ffa07a",
    ZsHgYF: "20b2aa",
    ZskyXe: "87cefa",
    ZUWay: "778899",
    ZUgYy: "778899",
    ZstAlXe: "b0c4de",
    ZLw: "ffffe0",
    lime: "ff00",
    limegYF: "32cd32",
    lRF: "faf0e6",
    magFta: "ff00ff",
    maPon: "800000",
    VaquamarRe: "66cdaa",
    VXe: "cd",
    VScEd: "ba55d3",
    VpurpN: "9370db",
    VsHgYF: "3cb371",
    VUXe: "7b68ee",
    VsprRggYF: "fa9a",
    VQe: "48d1cc",
    VviTetYd: "c71585",
    midnightXe: "191970",
    mRtcYam: "f5fffa",
    mistyPse: "ffe4e1",
    moccasR: "ffe4b5",
    navajowEte: "ffdead",
    navy: "80",
    Tdlace: "fdf5e6",
    Tive: "808000",
    TivedBb: "6b8e23",
    Sange: "ffa500",
    SangeYd: "ff4500",
    ScEd: "da70d6",
    pOegTMnPd: "eee8aa",
    pOegYF: "98fb98",
    pOeQe: "afeeee",
    pOeviTetYd: "db7093",
    papayawEp: "ffefd5",
    pHKpuff: "ffdab9",
    peru: "cd853f",
    pRk: "ffc0cb",
    plum: "dda0dd",
    powMrXe: "b0e0e6",
    purpN: "800080",
    YbeccapurpN: "663399",
    Yd: "ff0000",
    Psybrown: "bc8f8f",
    PyOXe: "4169e1",
    saddNbPwn: "8b4513",
    sOmon: "fa8072",
    sandybPwn: "f4a460",
    sHgYF: "2e8b57",
    sHshell: "fff5ee",
    siFna: "a0522d",
    silver: "c0c0c0",
    skyXe: "87ceeb",
    UXe: "6a5acd",
    UWay: "708090",
    UgYy: "708090",
    snow: "fffafa",
    sprRggYF: "ff7f",
    stAlXe: "4682b4",
    tan: "d2b48c",
    teO: "8080",
    tEstN: "d8bfd8",
    tomato: "ff6347",
    Qe: "40e0d0",
    viTet: "ee82ee",
    JHt: "f5deb3",
    wEte: "ffffff",
    wEtesmoke: "f5f5f5",
    Lw: "ffff00",
    LwgYF: "9acd32"
  };
  function unpack() {
    const unpacked = {};
    const keys = Object.keys(names);
    const tkeys = Object.keys(map$1);
    let i, j, k, ok, nk;
    for (i = 0; i < keys.length; i++) {
      ok = nk = keys[i];
      for (j = 0; j < tkeys.length; j++) {
        k = tkeys[j];
        nk = nk.replace(k, map$1[k]);
      }
      k = parseInt(names[ok], 16);
      unpacked[nk] = [k >> 16 & 255, k >> 8 & 255, k & 255];
    }
    return unpacked;
  }
  var names$1;
  function nameParse(str) {
    if (!names$1) {
      names$1 = unpack();
      names$1.transparent = [0, 0, 0, 0];
    }
    const a = names$1[str.toLowerCase()];
    return a && {
      r: a[0],
      g: a[1],
      b: a[2],
      a: a.length === 4 ? a[3] : 255
    };
  }
  function modHSL(v, i, ratio) {
    if (v) {
      let tmp = rgb2hsl(v);
      tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
      tmp = hsl2rgb(tmp);
      v.r = tmp[0];
      v.g = tmp[1];
      v.b = tmp[2];
    }
  }
  function clone(v, proto) {
    return v ? Object.assign(proto || {}, v) : v;
  }
  function fromObject(input) {
    var v = { r: 0, g: 0, b: 0, a: 255 };
    if (Array.isArray(input)) {
      if (input.length >= 3) {
        v = { r: input[0], g: input[1], b: input[2], a: 255 };
        if (input.length > 3) {
          v.a = n2b(input[3]);
        }
      }
    } else {
      v = clone(input, { r: 0, g: 0, b: 0, a: 1 });
      v.a = n2b(v.a);
    }
    return v;
  }
  function functionParse(str) {
    if (str.charAt(0) === "r") {
      return rgbParse(str);
    }
    return hueParse(str);
  }
  var Color = class {
    constructor(input) {
      if (input instanceof Color) {
        return input;
      }
      const type = typeof input;
      let v;
      if (type === "object") {
        v = fromObject(input);
      } else if (type === "string") {
        v = hexParse(input) || nameParse(input) || functionParse(input);
      }
      this._rgb = v;
      this._valid = !!v;
    }
    get valid() {
      return this._valid;
    }
    get rgb() {
      var v = clone(this._rgb);
      if (v) {
        v.a = b2n(v.a);
      }
      return v;
    }
    set rgb(obj) {
      this._rgb = fromObject(obj);
    }
    rgbString() {
      return this._valid ? rgbString(this._rgb) : this._rgb;
    }
    hexString() {
      return this._valid ? hexString(this._rgb) : this._rgb;
    }
    hslString() {
      return this._valid ? hslString(this._rgb) : this._rgb;
    }
    mix(color2, weight) {
      const me = this;
      if (color2) {
        const c1 = me.rgb;
        const c2 = color2.rgb;
        let w2;
        const p = weight === w2 ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = c1.a - c2.a;
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        w2 = 1 - w1;
        c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
        c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
        c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
        c1.a = p * c1.a + (1 - p) * c2.a;
        me.rgb = c1;
      }
      return me;
    }
    clone() {
      return new Color(this.rgb);
    }
    alpha(a) {
      this._rgb.a = n2b(a);
      return this;
    }
    clearer(ratio) {
      const rgb = this._rgb;
      rgb.a *= 1 - ratio;
      return this;
    }
    greyscale() {
      const rgb = this._rgb;
      const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
      rgb.r = rgb.g = rgb.b = val;
      return this;
    }
    opaquer(ratio) {
      const rgb = this._rgb;
      rgb.a *= 1 + ratio;
      return this;
    }
    negate() {
      const v = this._rgb;
      v.r = 255 - v.r;
      v.g = 255 - v.g;
      v.b = 255 - v.b;
      return this;
    }
    lighten(ratio) {
      modHSL(this._rgb, 2, ratio);
      return this;
    }
    darken(ratio) {
      modHSL(this._rgb, 2, -ratio);
      return this;
    }
    saturate(ratio) {
      modHSL(this._rgb, 1, ratio);
      return this;
    }
    desaturate(ratio) {
      modHSL(this._rgb, 1, -ratio);
      return this;
    }
    rotate(deg) {
      rotate(this._rgb, deg);
      return this;
    }
  };
  function index_esm(input) {
    return new Color(input);
  }
  var isPatternOrGradient = (value) => value instanceof CanvasGradient || value instanceof CanvasPattern;
  function color(value) {
    return isPatternOrGradient(value) ? value : index_esm(value);
  }
  function getHoverColor(value) {
    return isPatternOrGradient(value) ? value : index_esm(value).saturate(0.5).darken(0.1).hexString();
  }
  var overrides = Object.create(null);
  var descriptors = Object.create(null);
  function getScope$1(node, key) {
    if (!key) {
      return node;
    }
    const keys = key.split(".");
    for (let i = 0, n = keys.length; i < n; ++i) {
      const k = keys[i];
      node = node[k] || (node[k] = Object.create(null));
    }
    return node;
  }
  function set(root, scope, values) {
    if (typeof scope === "string") {
      return merge(getScope$1(root, scope), values);
    }
    return merge(getScope$1(root, ""), scope);
  }
  var Defaults = class {
    constructor(_descriptors2) {
      this.animation = void 0;
      this.backgroundColor = "rgba(0,0,0,0.1)";
      this.borderColor = "rgba(0,0,0,0.1)";
      this.color = "#666";
      this.datasets = {};
      this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
      this.elements = {};
      this.events = [
        "mousemove",
        "mouseout",
        "click",
        "touchstart",
        "touchmove"
      ];
      this.font = {
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        size: 12,
        style: "normal",
        lineHeight: 1.2,
        weight: null
      };
      this.hover = {};
      this.hoverBackgroundColor = (ctx2, options) => getHoverColor(options.backgroundColor);
      this.hoverBorderColor = (ctx2, options) => getHoverColor(options.borderColor);
      this.hoverColor = (ctx2, options) => getHoverColor(options.color);
      this.indexAxis = "x";
      this.interaction = {
        mode: "nearest",
        intersect: true
      };
      this.maintainAspectRatio = true;
      this.onHover = null;
      this.onClick = null;
      this.parsing = true;
      this.plugins = {};
      this.responsive = true;
      this.scale = void 0;
      this.scales = {};
      this.showLine = true;
      this.describe(_descriptors2);
    }
    set(scope, values) {
      return set(this, scope, values);
    }
    get(scope) {
      return getScope$1(this, scope);
    }
    describe(scope, values) {
      return set(descriptors, scope, values);
    }
    override(scope, values) {
      return set(overrides, scope, values);
    }
    route(scope, name, targetScope, targetName) {
      const scopeObject = getScope$1(this, scope);
      const targetScopeObject = getScope$1(this, targetScope);
      const privateName = "_" + name;
      Object.defineProperties(scopeObject, {
        [privateName]: {
          value: scopeObject[name],
          writable: true
        },
        [name]: {
          enumerable: true,
          get() {
            const local = this[privateName];
            const target = targetScopeObject[targetName];
            if (isObject(local)) {
              return Object.assign({}, target, local);
            }
            return valueOrDefault(local, target);
          },
          set(value) {
            this[privateName] = value;
          }
        }
      });
    }
  };
  var defaults = new Defaults({
    _scriptable: (name) => !name.startsWith("on"),
    _indexable: (name) => name !== "events",
    hover: {
      _fallback: "interaction"
    },
    interaction: {
      _scriptable: false,
      _indexable: false
    }
  });
  function toFontString(font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
      return null;
    }
    return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
  }
  function _measureText(ctx2, data, gc, longest, string) {
    let textWidth = data[string];
    if (!textWidth) {
      textWidth = data[string] = ctx2.measureText(string).width;
      gc.push(string);
    }
    if (textWidth > longest) {
      longest = textWidth;
    }
    return longest;
  }
  function _longestText(ctx2, font, arrayOfThings, cache) {
    cache = cache || {};
    let data = cache.data = cache.data || {};
    let gc = cache.garbageCollect = cache.garbageCollect || [];
    if (cache.font !== font) {
      data = cache.data = {};
      gc = cache.garbageCollect = [];
      cache.font = font;
    }
    ctx2.save();
    ctx2.font = font;
    let longest = 0;
    const ilen = arrayOfThings.length;
    let i, j, jlen, thing, nestedThing;
    for (i = 0; i < ilen; i++) {
      thing = arrayOfThings[i];
      if (thing !== void 0 && thing !== null && isArray(thing) !== true) {
        longest = _measureText(ctx2, data, gc, longest, thing);
      } else if (isArray(thing)) {
        for (j = 0, jlen = thing.length; j < jlen; j++) {
          nestedThing = thing[j];
          if (nestedThing !== void 0 && nestedThing !== null && !isArray(nestedThing)) {
            longest = _measureText(ctx2, data, gc, longest, nestedThing);
          }
        }
      }
    }
    ctx2.restore();
    const gcLen = gc.length / 2;
    if (gcLen > arrayOfThings.length) {
      for (i = 0; i < gcLen; i++) {
        delete data[gc[i]];
      }
      gc.splice(0, gcLen);
    }
    return longest;
  }
  function _alignPixel(chart, pixel, width) {
    const devicePixelRatio = chart.currentDevicePixelRatio;
    const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
    return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
  }
  function clearCanvas(canvas, ctx2) {
    ctx2 = ctx2 || canvas.getContext("2d");
    ctx2.save();
    ctx2.resetTransform();
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.restore();
  }
  function drawPoint(ctx2, options, x, y) {
    let type, xOffset, yOffset, size, cornerRadius;
    const style = options.pointStyle;
    const rotation = options.rotation;
    const radius = options.radius;
    let rad = (rotation || 0) * RAD_PER_DEG;
    if (style && typeof style === "object") {
      type = style.toString();
      if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
        ctx2.save();
        ctx2.translate(x, y);
        ctx2.rotate(rad);
        ctx2.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
        ctx2.restore();
        return;
      }
    }
    if (isNaN(radius) || radius <= 0) {
      return;
    }
    ctx2.beginPath();
    switch (style) {
      default:
        ctx2.arc(x, y, radius, 0, TAU);
        ctx2.closePath();
        break;
      case "triangle":
        ctx2.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx2.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx2.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        ctx2.closePath();
        break;
      case "rectRounded":
        cornerRadius = radius * 0.516;
        size = radius - cornerRadius;
        xOffset = Math.cos(rad + QUARTER_PI) * size;
        yOffset = Math.sin(rad + QUARTER_PI) * size;
        ctx2.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
        ctx2.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
        ctx2.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
        ctx2.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
        ctx2.closePath();
        break;
      case "rect":
        if (!rotation) {
          size = Math.SQRT1_2 * radius;
          ctx2.rect(x - size, y - size, 2 * size, 2 * size);
          break;
        }
        rad += QUARTER_PI;
      case "rectRot":
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx2.moveTo(x - xOffset, y - yOffset);
        ctx2.lineTo(x + yOffset, y - xOffset);
        ctx2.lineTo(x + xOffset, y + yOffset);
        ctx2.lineTo(x - yOffset, y + xOffset);
        ctx2.closePath();
        break;
      case "crossRot":
        rad += QUARTER_PI;
      case "cross":
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx2.moveTo(x - xOffset, y - yOffset);
        ctx2.lineTo(x + xOffset, y + yOffset);
        ctx2.moveTo(x + yOffset, y - xOffset);
        ctx2.lineTo(x - yOffset, y + xOffset);
        break;
      case "star":
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx2.moveTo(x - xOffset, y - yOffset);
        ctx2.lineTo(x + xOffset, y + yOffset);
        ctx2.moveTo(x + yOffset, y - xOffset);
        ctx2.lineTo(x - yOffset, y + xOffset);
        rad += QUARTER_PI;
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx2.moveTo(x - xOffset, y - yOffset);
        ctx2.lineTo(x + xOffset, y + yOffset);
        ctx2.moveTo(x + yOffset, y - xOffset);
        ctx2.lineTo(x - yOffset, y + xOffset);
        break;
      case "line":
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx2.moveTo(x - xOffset, y - yOffset);
        ctx2.lineTo(x + xOffset, y + yOffset);
        break;
      case "dash":
        ctx2.moveTo(x, y);
        ctx2.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
        break;
    }
    ctx2.fill();
    if (options.borderWidth > 0) {
      ctx2.stroke();
    }
  }
  function _isPointInArea(point, area, margin) {
    margin = margin || 0.5;
    return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
  }
  function clipArea(ctx2, area) {
    ctx2.save();
    ctx2.beginPath();
    ctx2.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
    ctx2.clip();
  }
  function unclipArea(ctx2) {
    ctx2.restore();
  }
  function _steppedLineTo(ctx2, previous, target, flip, mode) {
    if (!previous) {
      return ctx2.lineTo(target.x, target.y);
    }
    if (mode === "middle") {
      const midpoint = (previous.x + target.x) / 2;
      ctx2.lineTo(midpoint, previous.y);
      ctx2.lineTo(midpoint, target.y);
    } else if (mode === "after" !== !!flip) {
      ctx2.lineTo(previous.x, target.y);
    } else {
      ctx2.lineTo(target.x, previous.y);
    }
    ctx2.lineTo(target.x, target.y);
  }
  function _bezierCurveTo(ctx2, previous, target, flip) {
    if (!previous) {
      return ctx2.lineTo(target.x, target.y);
    }
    ctx2.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
  }
  function renderText(ctx2, text, x, y, font, opts = {}) {
    const lines = isArray(text) ? text : [text];
    const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
    let i, line;
    ctx2.save();
    ctx2.font = font.string;
    setRenderOpts(ctx2, opts);
    for (i = 0; i < lines.length; ++i) {
      line = lines[i];
      if (stroke) {
        if (opts.strokeColor) {
          ctx2.strokeStyle = opts.strokeColor;
        }
        if (!isNullOrUndef(opts.strokeWidth)) {
          ctx2.lineWidth = opts.strokeWidth;
        }
        ctx2.strokeText(line, x, y, opts.maxWidth);
      }
      ctx2.fillText(line, x, y, opts.maxWidth);
      decorateText(ctx2, x, y, line, opts);
      y += font.lineHeight;
    }
    ctx2.restore();
  }
  function setRenderOpts(ctx2, opts) {
    if (opts.translation) {
      ctx2.translate(opts.translation[0], opts.translation[1]);
    }
    if (!isNullOrUndef(opts.rotation)) {
      ctx2.rotate(opts.rotation);
    }
    if (opts.color) {
      ctx2.fillStyle = opts.color;
    }
    if (opts.textAlign) {
      ctx2.textAlign = opts.textAlign;
    }
    if (opts.textBaseline) {
      ctx2.textBaseline = opts.textBaseline;
    }
  }
  function decorateText(ctx2, x, y, line, opts) {
    if (opts.strikethrough || opts.underline) {
      const metrics = ctx2.measureText(line);
      const left = x - metrics.actualBoundingBoxLeft;
      const right = x + metrics.actualBoundingBoxRight;
      const top = y - metrics.actualBoundingBoxAscent;
      const bottom = y + metrics.actualBoundingBoxDescent;
      const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
      ctx2.strokeStyle = ctx2.fillStyle;
      ctx2.beginPath();
      ctx2.lineWidth = opts.decorationWidth || 2;
      ctx2.moveTo(left, yDecoration);
      ctx2.lineTo(right, yDecoration);
      ctx2.stroke();
    }
  }
  function addRoundedRectPath(ctx2, rect) {
    const { x, y, w, h, radius } = rect;
    ctx2.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
    ctx2.lineTo(x, y + h - radius.bottomLeft);
    ctx2.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
    ctx2.lineTo(x + w - radius.bottomRight, y + h);
    ctx2.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
    ctx2.lineTo(x + w, y + radius.topRight);
    ctx2.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
    ctx2.lineTo(x + radius.topLeft, y);
  }
  var LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
  var FONT_STYLE = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
  function toLineHeight(value, size) {
    const matches = ("" + value).match(LINE_HEIGHT);
    if (!matches || matches[1] === "normal") {
      return size * 1.2;
    }
    value = +matches[2];
    switch (matches[3]) {
      case "px":
        return value;
      case "%":
        value /= 100;
        break;
    }
    return size * value;
  }
  var numberOrZero = (v) => +v || 0;
  function _readValueToProps(value, props) {
    const ret = {};
    const objProps = isObject(props);
    const keys = objProps ? Object.keys(props) : props;
    const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
    for (const prop of keys) {
      ret[prop] = numberOrZero(read(prop));
    }
    return ret;
  }
  function toTRBL(value) {
    return _readValueToProps(value, { top: "y", right: "x", bottom: "y", left: "x" });
  }
  function toTRBLCorners(value) {
    return _readValueToProps(value, ["topLeft", "topRight", "bottomLeft", "bottomRight"]);
  }
  function toPadding(value) {
    const obj = toTRBL(value);
    obj.width = obj.left + obj.right;
    obj.height = obj.top + obj.bottom;
    return obj;
  }
  function toFont(options, fallback) {
    options = options || {};
    fallback = fallback || defaults.font;
    let size = valueOrDefault(options.size, fallback.size);
    if (typeof size === "string") {
      size = parseInt(size, 10);
    }
    let style = valueOrDefault(options.style, fallback.style);
    if (style && !("" + style).match(FONT_STYLE)) {
      console.warn('Invalid font style specified: "' + style + '"');
      style = "";
    }
    const font = {
      family: valueOrDefault(options.family, fallback.family),
      lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
      size,
      style,
      weight: valueOrDefault(options.weight, fallback.weight),
      string: ""
    };
    font.string = toFontString(font);
    return font;
  }
  function resolve(inputs, context, index, info) {
    let cacheable = true;
    let i, ilen, value;
    for (i = 0, ilen = inputs.length; i < ilen; ++i) {
      value = inputs[i];
      if (value === void 0) {
        continue;
      }
      if (context !== void 0 && typeof value === "function") {
        value = value(context);
        cacheable = false;
      }
      if (index !== void 0 && isArray(value)) {
        value = value[index % value.length];
        cacheable = false;
      }
      if (value !== void 0) {
        if (info && !cacheable) {
          info.cacheable = false;
        }
        return value;
      }
    }
  }
  function _addGrace(minmax, grace, beginAtZero) {
    const { min, max } = minmax;
    const change = toDimension(grace, (max - min) / 2);
    const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
    return {
      min: keepZero(min, -Math.abs(change)),
      max: keepZero(max, change)
    };
  }
  function createContext(parentContext, context) {
    return Object.assign(Object.create(parentContext), context);
  }
  function _lookup(table, value, cmp) {
    cmp = cmp || ((index) => table[index] < value);
    let hi = table.length - 1;
    let lo = 0;
    let mid;
    while (hi - lo > 1) {
      mid = lo + hi >> 1;
      if (cmp(mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return { lo, hi };
  }
  var _lookupByKey = (table, key, value) => _lookup(table, value, (index) => table[index][key] < value);
  var _rlookupByKey = (table, key, value) => _lookup(table, value, (index) => table[index][key] >= value);
  function _filterBetween(values, min, max) {
    let start = 0;
    let end = values.length;
    while (start < end && values[start] < min) {
      start++;
    }
    while (end > start && values[end - 1] > max) {
      end--;
    }
    return start > 0 || end < values.length ? values.slice(start, end) : values;
  }
  var arrayEvents = ["push", "pop", "shift", "splice", "unshift"];
  function listenArrayEvents(array, listener) {
    if (array._chartjs) {
      array._chartjs.listeners.push(listener);
      return;
    }
    Object.defineProperty(array, "_chartjs", {
      configurable: true,
      enumerable: false,
      value: {
        listeners: [listener]
      }
    });
    arrayEvents.forEach((key) => {
      const method = "_onData" + _capitalize(key);
      const base = array[key];
      Object.defineProperty(array, key, {
        configurable: true,
        enumerable: false,
        value(...args) {
          const res = base.apply(this, args);
          array._chartjs.listeners.forEach((object) => {
            if (typeof object[method] === "function") {
              object[method](...args);
            }
          });
          return res;
        }
      });
    });
  }
  function unlistenArrayEvents(array, listener) {
    const stub = array._chartjs;
    if (!stub) {
      return;
    }
    const listeners = stub.listeners;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length > 0) {
      return;
    }
    arrayEvents.forEach((key) => {
      delete array[key];
    });
    delete array._chartjs;
  }
  function _arrayUnique(items) {
    const set2 = new Set();
    let i, ilen;
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      set2.add(items[i]);
    }
    if (set2.size === ilen) {
      return items;
    }
    return Array.from(set2);
  }
  function _createResolver(scopes, prefixes = [""], rootScopes = scopes, fallback, getTarget2 = () => scopes[0]) {
    if (!defined(fallback)) {
      fallback = _resolve("_fallback", scopes);
    }
    const cache = {
      [Symbol.toStringTag]: "Object",
      _cacheable: true,
      _scopes: scopes,
      _rootScopes: rootScopes,
      _fallback: fallback,
      _getTarget: getTarget2,
      override: (scope) => _createResolver([scope, ...scopes], prefixes, rootScopes, fallback)
    };
    return new Proxy(cache, {
      deleteProperty(target, prop) {
        delete target[prop];
        delete target._keys;
        delete scopes[0][prop];
        return true;
      },
      get(target, prop) {
        return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
      },
      getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(scopes[0]);
      },
      has(target, prop) {
        return getKeysFromAllScopes(target).includes(prop);
      },
      ownKeys(target) {
        return getKeysFromAllScopes(target);
      },
      set(target, prop, value) {
        const storage = target._storage || (target._storage = getTarget2());
        storage[prop] = value;
        delete target[prop];
        delete target._keys;
        return true;
      }
    });
  }
  function _attachContext(proxy, context, subProxy, descriptorDefaults) {
    const cache = {
      _cacheable: false,
      _proxy: proxy,
      _context: context,
      _subProxy: subProxy,
      _stack: new Set(),
      _descriptors: _descriptors(proxy, descriptorDefaults),
      setContext: (ctx2) => _attachContext(proxy, ctx2, subProxy, descriptorDefaults),
      override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
    };
    return new Proxy(cache, {
      deleteProperty(target, prop) {
        delete target[prop];
        delete proxy[prop];
        return true;
      },
      get(target, prop, receiver) {
        return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
      },
      getOwnPropertyDescriptor(target, prop) {
        return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? { enumerable: true, configurable: true } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(proxy);
      },
      has(target, prop) {
        return Reflect.has(proxy, prop);
      },
      ownKeys() {
        return Reflect.ownKeys(proxy);
      },
      set(target, prop, value) {
        proxy[prop] = value;
        delete target[prop];
        return true;
      }
    });
  }
  function _descriptors(proxy, defaults2 = { scriptable: true, indexable: true }) {
    const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
    return {
      allKeys: _allKeys,
      scriptable: _scriptable,
      indexable: _indexable,
      isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
      isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
    };
  }
  var readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
  var needsSubResolver = (prop, value) => isObject(value) && prop !== "adapters";
  function _cached(target, prop, resolve2) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return target[prop];
    }
    const value = resolve2();
    target[prop] = value;
    return value;
  }
  function _resolveWithContext(target, prop, receiver) {
    const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
    let value = _proxy[prop];
    if (isFunction(value) && descriptors2.isScriptable(prop)) {
      value = _resolveScriptable(prop, value, target, receiver);
    }
    if (isArray(value) && value.length) {
      value = _resolveArray(prop, value, target, descriptors2.isIndexable);
    }
    if (needsSubResolver(prop, value)) {
      value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors2);
    }
    return value;
  }
  function _resolveScriptable(prop, value, target, receiver) {
    const { _proxy, _context, _subProxy, _stack } = target;
    if (_stack.has(prop)) {
      throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
    }
    _stack.add(prop);
    value = value(_context, _subProxy || receiver);
    _stack.delete(prop);
    if (isObject(value)) {
      value = createSubResolver(_proxy._scopes, _proxy, prop, value);
    }
    return value;
  }
  function _resolveArray(prop, value, target, isIndexable) {
    const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
    if (defined(_context.index) && isIndexable(prop)) {
      value = value[_context.index % value.length];
    } else if (isObject(value[0])) {
      const arr = value;
      const scopes = _proxy._scopes.filter((s) => s !== arr);
      value = [];
      for (const item of arr) {
        const resolver = createSubResolver(scopes, _proxy, prop, item);
        value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
      }
    }
    return value;
  }
  function resolveFallback(fallback, prop, value) {
    return isFunction(fallback) ? fallback(prop, value) : fallback;
  }
  var getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
  function addScopes(set2, parentScopes, key, parentFallback) {
    for (const parent of parentScopes) {
      const scope = getScope(key, parent);
      if (scope) {
        set2.add(scope);
        const fallback = resolveFallback(scope._fallback, key, scope);
        if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
          return fallback;
        }
      } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
        return null;
      }
    }
    return false;
  }
  function createSubResolver(parentScopes, resolver, prop, value) {
    const rootScopes = resolver._rootScopes;
    const fallback = resolveFallback(resolver._fallback, prop, value);
    const allScopes = [...parentScopes, ...rootScopes];
    const set2 = new Set();
    set2.add(value);
    let key = addScopesFromKey(set2, allScopes, prop, fallback || prop);
    if (key === null) {
      return false;
    }
    if (defined(fallback) && fallback !== prop) {
      key = addScopesFromKey(set2, allScopes, fallback, key);
      if (key === null) {
        return false;
      }
    }
    return _createResolver(Array.from(set2), [""], rootScopes, fallback, () => subGetTarget(resolver, prop, value));
  }
  function addScopesFromKey(set2, allScopes, key, fallback) {
    while (key) {
      key = addScopes(set2, allScopes, key, fallback);
    }
    return key;
  }
  function subGetTarget(resolver, prop, value) {
    const parent = resolver._getTarget();
    if (!(prop in parent)) {
      parent[prop] = {};
    }
    const target = parent[prop];
    if (isArray(target) && isObject(value)) {
      return value;
    }
    return target;
  }
  function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
    let value;
    for (const prefix of prefixes) {
      value = _resolve(readKey(prefix, prop), scopes);
      if (defined(value)) {
        return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
      }
    }
  }
  function _resolve(key, scopes) {
    for (const scope of scopes) {
      if (!scope) {
        continue;
      }
      const value = scope[key];
      if (defined(value)) {
        return value;
      }
    }
  }
  function getKeysFromAllScopes(target) {
    let keys = target._keys;
    if (!keys) {
      keys = target._keys = resolveKeysFromAllScopes(target._scopes);
    }
    return keys;
  }
  function resolveKeysFromAllScopes(scopes) {
    const set2 = new Set();
    for (const scope of scopes) {
      for (const key of Object.keys(scope).filter((k) => !k.startsWith("_"))) {
        set2.add(key);
      }
    }
    return Array.from(set2);
  }
  var EPSILON = Number.EPSILON || 1e-14;
  var getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
  var getValueAxis = (indexAxis) => indexAxis === "x" ? "y" : "x";
  function splineCurve(firstPoint, middlePoint, afterPoint, t) {
    const previous = firstPoint.skip ? middlePoint : firstPoint;
    const current = middlePoint;
    const next = afterPoint.skip ? middlePoint : afterPoint;
    const d01 = distanceBetweenPoints(current, previous);
    const d12 = distanceBetweenPoints(next, current);
    let s01 = d01 / (d01 + d12);
    let s12 = d12 / (d01 + d12);
    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;
    const fa = t * s01;
    const fb = t * s12;
    return {
      previous: {
        x: current.x - fa * (next.x - previous.x),
        y: current.y - fa * (next.y - previous.y)
      },
      next: {
        x: current.x + fb * (next.x - previous.x),
        y: current.y + fb * (next.y - previous.y)
      }
    };
  }
  function monotoneAdjust(points, deltaK, mK) {
    const pointsLen = points.length;
    let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for (let i = 0; i < pointsLen - 1; ++i) {
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent || !pointAfter) {
        continue;
      }
      if (almostEquals(deltaK[i], 0, EPSILON)) {
        mK[i] = mK[i + 1] = 0;
        continue;
      }
      alphaK = mK[i] / deltaK[i];
      betaK = mK[i + 1] / deltaK[i];
      squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
      if (squaredMagnitude <= 9) {
        continue;
      }
      tauK = 3 / Math.sqrt(squaredMagnitude);
      mK[i] = alphaK * tauK * deltaK[i];
      mK[i + 1] = betaK * tauK * deltaK[i];
    }
  }
  function monotoneCompute(points, mK, indexAxis = "x") {
    const valueAxis = getValueAxis(indexAxis);
    const pointsLen = points.length;
    let delta, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for (let i = 0; i < pointsLen; ++i) {
      pointBefore = pointCurrent;
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent) {
        continue;
      }
      const iPixel = pointCurrent[indexAxis];
      const vPixel = pointCurrent[valueAxis];
      if (pointBefore) {
        delta = (iPixel - pointBefore[indexAxis]) / 3;
        pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
        pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
      }
      if (pointAfter) {
        delta = (pointAfter[indexAxis] - iPixel) / 3;
        pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
        pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
      }
    }
  }
  function splineCurveMonotone(points, indexAxis = "x") {
    const valueAxis = getValueAxis(indexAxis);
    const pointsLen = points.length;
    const deltaK = Array(pointsLen).fill(0);
    const mK = Array(pointsLen);
    let i, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for (i = 0; i < pointsLen; ++i) {
      pointBefore = pointCurrent;
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent) {
        continue;
      }
      if (pointAfter) {
        const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
        deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
      }
      mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
    }
    monotoneAdjust(points, deltaK, mK);
    monotoneCompute(points, mK, indexAxis);
  }
  function capControlPoint(pt, min, max) {
    return Math.max(Math.min(pt, max), min);
  }
  function capBezierPoints(points, area) {
    let i, ilen, point, inArea, inAreaPrev;
    let inAreaNext = _isPointInArea(points[0], area);
    for (i = 0, ilen = points.length; i < ilen; ++i) {
      inAreaPrev = inArea;
      inArea = inAreaNext;
      inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
      if (!inArea) {
        continue;
      }
      point = points[i];
      if (inAreaPrev) {
        point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
        point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
      }
      if (inAreaNext) {
        point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
        point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
      }
    }
  }
  function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
    let i, ilen, point, controlPoints;
    if (options.spanGaps) {
      points = points.filter((pt) => !pt.skip);
    }
    if (options.cubicInterpolationMode === "monotone") {
      splineCurveMonotone(points, indexAxis);
    } else {
      let prev = loop ? points[points.length - 1] : points[0];
      for (i = 0, ilen = points.length; i < ilen; ++i) {
        point = points[i];
        controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
        point.cp1x = controlPoints.previous.x;
        point.cp1y = controlPoints.previous.y;
        point.cp2x = controlPoints.next.x;
        point.cp2y = controlPoints.next.y;
        prev = point;
      }
    }
    if (options.capBezierPoints) {
      capBezierPoints(points, area);
    }
  }
  function _isDomSupported() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function _getParentNode(domNode) {
    let parent = domNode.parentNode;
    if (parent && parent.toString() === "[object ShadowRoot]") {
      parent = parent.host;
    }
    return parent;
  }
  function parseMaxStyle(styleValue, node, parentProperty) {
    let valueInPixels;
    if (typeof styleValue === "string") {
      valueInPixels = parseInt(styleValue, 10);
      if (styleValue.indexOf("%") !== -1) {
        valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
      }
    } else {
      valueInPixels = styleValue;
    }
    return valueInPixels;
  }
  var getComputedStyle = (element) => window.getComputedStyle(element, null);
  function getStyle(el, property) {
    return getComputedStyle(el).getPropertyValue(property);
  }
  var positions = ["top", "right", "bottom", "left"];
  function getPositionedStyle(styles, style, suffix) {
    const result = {};
    suffix = suffix ? "-" + suffix : "";
    for (let i = 0; i < 4; i++) {
      const pos = positions[i];
      result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
    }
    result.width = result.left + result.right;
    result.height = result.top + result.bottom;
    return result;
  }
  var useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
  function getCanvasPosition(evt, canvas) {
    const e = evt.native || evt;
    const touches = e.touches;
    const source = touches && touches.length ? touches[0] : e;
    const { offsetX, offsetY } = source;
    let box = false;
    let x, y;
    if (useOffsetPos(offsetX, offsetY, e.target)) {
      x = offsetX;
      y = offsetY;
    } else {
      const rect = canvas.getBoundingClientRect();
      x = source.clientX - rect.left;
      y = source.clientY - rect.top;
      box = true;
    }
    return { x, y, box };
  }
  function getRelativePosition(evt, chart) {
    const { canvas, currentDevicePixelRatio } = chart;
    const style = getComputedStyle(canvas);
    const borderBox = style.boxSizing === "border-box";
    const paddings = getPositionedStyle(style, "padding");
    const borders = getPositionedStyle(style, "border", "width");
    const { x, y, box } = getCanvasPosition(evt, canvas);
    const xOffset = paddings.left + (box && borders.left);
    const yOffset = paddings.top + (box && borders.top);
    let { width, height } = chart;
    if (borderBox) {
      width -= paddings.width + borders.width;
      height -= paddings.height + borders.height;
    }
    return {
      x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
      y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
    };
  }
  function getContainerSize(canvas, width, height) {
    let maxWidth, maxHeight;
    if (width === void 0 || height === void 0) {
      const container = _getParentNode(canvas);
      if (!container) {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
      } else {
        const rect = container.getBoundingClientRect();
        const containerStyle = getComputedStyle(container);
        const containerBorder = getPositionedStyle(containerStyle, "border", "width");
        const containerPadding = getPositionedStyle(containerStyle, "padding");
        width = rect.width - containerPadding.width - containerBorder.width;
        height = rect.height - containerPadding.height - containerBorder.height;
        maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
        maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
      }
    }
    return {
      width,
      height,
      maxWidth: maxWidth || INFINITY,
      maxHeight: maxHeight || INFINITY
    };
  }
  var round1 = (v) => Math.round(v * 10) / 10;
  function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
    const style = getComputedStyle(canvas);
    const margins = getPositionedStyle(style, "margin");
    const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
    const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
    const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
    let { width, height } = containerSize;
    if (style.boxSizing === "content-box") {
      const borders = getPositionedStyle(style, "border", "width");
      const paddings = getPositionedStyle(style, "padding");
      width -= paddings.width + borders.width;
      height -= paddings.height + borders.height;
    }
    width = Math.max(0, width - margins.width);
    height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
    width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
    height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
    if (width && !height) {
      height = round1(width / 2);
    }
    return {
      width,
      height
    };
  }
  function retinaScale(chart, forceRatio, forceStyle) {
    const pixelRatio = forceRatio || 1;
    const deviceHeight = Math.floor(chart.height * pixelRatio);
    const deviceWidth = Math.floor(chart.width * pixelRatio);
    chart.height = deviceHeight / pixelRatio;
    chart.width = deviceWidth / pixelRatio;
    const canvas = chart.canvas;
    if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
      canvas.style.height = `${chart.height}px`;
      canvas.style.width = `${chart.width}px`;
    }
    if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
      chart.currentDevicePixelRatio = pixelRatio;
      canvas.height = deviceHeight;
      canvas.width = deviceWidth;
      chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      return true;
    }
    return false;
  }
  var supportsEventListenerOptions = function() {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    } catch (e) {
    }
    return passiveSupported;
  }();
  function readUsedSize(element, property) {
    const value = getStyle(element, property);
    const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
    return matches ? +matches[1] : void 0;
  }
  function _pointInLine(p1, p2, t, mode) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y)
    };
  }
  function _steppedInterpolation(p1, p2, t, mode) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: mode === "middle" ? t < 0.5 ? p1.y : p2.y : mode === "after" ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
    };
  }
  function _bezierInterpolation(p1, p2, t, mode) {
    const cp1 = { x: p1.cp2x, y: p1.cp2y };
    const cp2 = { x: p2.cp1x, y: p2.cp1y };
    const a = _pointInLine(p1, cp1, t);
    const b = _pointInLine(cp1, cp2, t);
    const c = _pointInLine(cp2, p2, t);
    const d = _pointInLine(a, b, t);
    const e = _pointInLine(b, c, t);
    return _pointInLine(d, e, t);
  }
  var intlCache = new Map();
  function getNumberFormat(locale2, options) {
    options = options || {};
    const cacheKey = locale2 + JSON.stringify(options);
    let formatter = intlCache.get(cacheKey);
    if (!formatter) {
      formatter = new Intl.NumberFormat(locale2, options);
      intlCache.set(cacheKey, formatter);
    }
    return formatter;
  }
  function formatNumber(num, locale2, options) {
    return getNumberFormat(locale2, options).format(num);
  }
  var getRightToLeftAdapter = function(rectX, width) {
    return {
      x(x) {
        return rectX + rectX + width - x;
      },
      setWidth(w) {
        width = w;
      },
      textAlign(align) {
        if (align === "center") {
          return align;
        }
        return align === "right" ? "left" : "right";
      },
      xPlus(x, value) {
        return x - value;
      },
      leftForLtr(x, itemWidth) {
        return x - itemWidth;
      }
    };
  };
  var getLeftToRightAdapter = function() {
    return {
      x(x) {
        return x;
      },
      setWidth(w) {
      },
      textAlign(align) {
        return align;
      },
      xPlus(x, value) {
        return x + value;
      },
      leftForLtr(x, _itemWidth) {
        return x;
      }
    };
  };
  function getRtlAdapter(rtl, rectX, width) {
    return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
  }
  function overrideTextDirection(ctx2, direction) {
    let style, original;
    if (direction === "ltr" || direction === "rtl") {
      style = ctx2.canvas.style;
      original = [
        style.getPropertyValue("direction"),
        style.getPropertyPriority("direction")
      ];
      style.setProperty("direction", direction, "important");
      ctx2.prevTextDirection = original;
    }
  }
  function restoreTextDirection(ctx2, original) {
    if (original !== void 0) {
      delete ctx2.prevTextDirection;
      ctx2.canvas.style.setProperty("direction", original[0], original[1]);
    }
  }
  function propertyFn(property) {
    if (property === "angle") {
      return {
        between: _angleBetween,
        compare: _angleDiff,
        normalize: _normalizeAngle
      };
    }
    return {
      between: (n, s, e) => n >= Math.min(s, e) && n <= Math.max(e, s),
      compare: (a, b) => a - b,
      normalize: (x) => x
    };
  }
  function normalizeSegment({ start, end, count, loop, style }) {
    return {
      start: start % count,
      end: end % count,
      loop: loop && (end - start + 1) % count === 0,
      style
    };
  }
  function getSegment(segment, points, bounds) {
    const { property, start: startBound, end: endBound } = bounds;
    const { between, normalize } = propertyFn(property);
    const count = points.length;
    let { start, end, loop } = segment;
    let i, ilen;
    if (loop) {
      start += count;
      end += count;
      for (i = 0, ilen = count; i < ilen; ++i) {
        if (!between(normalize(points[start % count][property]), startBound, endBound)) {
          break;
        }
        start--;
        end--;
      }
      start %= count;
      end %= count;
    }
    if (end < start) {
      end += count;
    }
    return { start, end, loop, style: segment.style };
  }
  function _boundSegment(segment, points, bounds) {
    if (!bounds) {
      return [segment];
    }
    const { property, start: startBound, end: endBound } = bounds;
    const count = points.length;
    const { compare, between, normalize } = propertyFn(property);
    const { start, end, loop, style } = getSegment(segment, points, bounds);
    const result = [];
    let inside = false;
    let subStart = null;
    let value, point, prevValue;
    const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
    const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
    const shouldStart = () => inside || startIsBefore();
    const shouldStop = () => !inside || endIsBefore();
    for (let i = start, prev = start; i <= end; ++i) {
      point = points[i % count];
      if (point.skip) {
        continue;
      }
      value = normalize(point[property]);
      if (value === prevValue) {
        continue;
      }
      inside = between(value, startBound, endBound);
      if (subStart === null && shouldStart()) {
        subStart = compare(value, startBound) === 0 ? i : prev;
      }
      if (subStart !== null && shouldStop()) {
        result.push(normalizeSegment({ start: subStart, end: i, loop, count, style }));
        subStart = null;
      }
      prev = i;
      prevValue = value;
    }
    if (subStart !== null) {
      result.push(normalizeSegment({ start: subStart, end, loop, count, style }));
    }
    return result;
  }
  function _boundSegments(line, bounds) {
    const result = [];
    const segments = line.segments;
    for (let i = 0; i < segments.length; i++) {
      const sub = _boundSegment(segments[i], line.points, bounds);
      if (sub.length) {
        result.push(...sub);
      }
    }
    return result;
  }
  function findStartAndEnd(points, count, loop, spanGaps) {
    let start = 0;
    let end = count - 1;
    if (loop && !spanGaps) {
      while (start < count && !points[start].skip) {
        start++;
      }
    }
    while (start < count && points[start].skip) {
      start++;
    }
    start %= count;
    if (loop) {
      end += start;
    }
    while (end > start && points[end % count].skip) {
      end--;
    }
    end %= count;
    return { start, end };
  }
  function solidSegments(points, start, max, loop) {
    const count = points.length;
    const result = [];
    let last = start;
    let prev = points[start];
    let end;
    for (end = start + 1; end <= max; ++end) {
      const cur = points[end % count];
      if (cur.skip || cur.stop) {
        if (!prev.skip) {
          loop = false;
          result.push({ start: start % count, end: (end - 1) % count, loop });
          start = last = cur.stop ? end : null;
        }
      } else {
        last = end;
        if (prev.skip) {
          start = end;
        }
      }
      prev = cur;
    }
    if (last !== null) {
      result.push({ start: start % count, end: last % count, loop });
    }
    return result;
  }
  function _computeSegments(line, segmentOptions) {
    const points = line.points;
    const spanGaps = line.options.spanGaps;
    const count = points.length;
    if (!count) {
      return [];
    }
    const loop = !!line._loop;
    const { start, end } = findStartAndEnd(points, count, loop, spanGaps);
    if (spanGaps === true) {
      return splitByStyles(line, [{ start, end, loop }], points, segmentOptions);
    }
    const max = end < start ? end + count : end;
    const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
    return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
  }
  function splitByStyles(line, segments, points, segmentOptions) {
    if (!segmentOptions || !segmentOptions.setContext || !points) {
      return segments;
    }
    return doSplitByStyles(line, segments, points, segmentOptions);
  }
  function doSplitByStyles(line, segments, points, segmentOptions) {
    const chartContext = line._chart.getContext();
    const baseStyle = readStyle(line.options);
    const { _datasetIndex: datasetIndex, options: { spanGaps } } = line;
    const count = points.length;
    const result = [];
    let prevStyle = baseStyle;
    let start = segments[0].start;
    let i = start;
    function addStyle(s, e, l, st) {
      const dir = spanGaps ? -1 : 1;
      if (s === e) {
        return;
      }
      s += count;
      while (points[s % count].skip) {
        s -= dir;
      }
      while (points[e % count].skip) {
        e += dir;
      }
      if (s % count !== e % count) {
        result.push({ start: s % count, end: e % count, loop: l, style: st });
        prevStyle = st;
        start = e % count;
      }
    }
    for (const segment of segments) {
      start = spanGaps ? start : segment.start;
      let prev = points[start % count];
      let style;
      for (i = start + 1; i <= segment.end; i++) {
        const pt = points[i % count];
        style = readStyle(segmentOptions.setContext(createContext(chartContext, {
          type: "segment",
          p0: prev,
          p1: pt,
          p0DataIndex: (i - 1) % count,
          p1DataIndex: i % count,
          datasetIndex
        })));
        if (styleChanged(style, prevStyle)) {
          addStyle(start, i - 1, segment.loop, prevStyle);
        }
        prev = pt;
        prevStyle = style;
      }
      if (start < i - 1) {
        addStyle(start, i - 1, segment.loop, prevStyle);
      }
    }
    return result;
  }
  function readStyle(options) {
    return {
      backgroundColor: options.backgroundColor,
      borderCapStyle: options.borderCapStyle,
      borderDash: options.borderDash,
      borderDashOffset: options.borderDashOffset,
      borderJoinStyle: options.borderJoinStyle,
      borderWidth: options.borderWidth,
      borderColor: options.borderColor
    };
  }
  function styleChanged(style, prevStyle) {
    return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
  }

  // node_modules/chart.js/dist/chart.esm.js
  var Animator = class {
    constructor() {
      this._request = null;
      this._charts = new Map();
      this._running = false;
      this._lastDate = void 0;
    }
    _notify(chart, anims, date, type) {
      const callbacks = anims.listeners[type];
      const numSteps = anims.duration;
      callbacks.forEach((fn) => fn({
        chart,
        initial: anims.initial,
        numSteps,
        currentStep: Math.min(date - anims.start, numSteps)
      }));
    }
    _refresh() {
      if (this._request) {
        return;
      }
      this._running = true;
      this._request = requestAnimFrame.call(window, () => {
        this._update();
        this._request = null;
        if (this._running) {
          this._refresh();
        }
      });
    }
    _update(date = Date.now()) {
      let remaining = 0;
      this._charts.forEach((anims, chart) => {
        if (!anims.running || !anims.items.length) {
          return;
        }
        const items = anims.items;
        let i = items.length - 1;
        let draw2 = false;
        let item;
        for (; i >= 0; --i) {
          item = items[i];
          if (item._active) {
            if (item._total > anims.duration) {
              anims.duration = item._total;
            }
            item.tick(date);
            draw2 = true;
          } else {
            items[i] = items[items.length - 1];
            items.pop();
          }
        }
        if (draw2) {
          chart.draw();
          this._notify(chart, anims, date, "progress");
        }
        if (!items.length) {
          anims.running = false;
          this._notify(chart, anims, date, "complete");
          anims.initial = false;
        }
        remaining += items.length;
      });
      this._lastDate = date;
      if (remaining === 0) {
        this._running = false;
      }
    }
    _getAnims(chart) {
      const charts = this._charts;
      let anims = charts.get(chart);
      if (!anims) {
        anims = {
          running: false,
          initial: true,
          items: [],
          listeners: {
            complete: [],
            progress: []
          }
        };
        charts.set(chart, anims);
      }
      return anims;
    }
    listen(chart, event, cb) {
      this._getAnims(chart).listeners[event].push(cb);
    }
    add(chart, items) {
      if (!items || !items.length) {
        return;
      }
      this._getAnims(chart).items.push(...items);
    }
    has(chart) {
      return this._getAnims(chart).items.length > 0;
    }
    start(chart) {
      const anims = this._charts.get(chart);
      if (!anims) {
        return;
      }
      anims.running = true;
      anims.start = Date.now();
      anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
      this._refresh();
    }
    running(chart) {
      if (!this._running) {
        return false;
      }
      const anims = this._charts.get(chart);
      if (!anims || !anims.running || !anims.items.length) {
        return false;
      }
      return true;
    }
    stop(chart) {
      const anims = this._charts.get(chart);
      if (!anims || !anims.items.length) {
        return;
      }
      const items = anims.items;
      let i = items.length - 1;
      for (; i >= 0; --i) {
        items[i].cancel();
      }
      anims.items = [];
      this._notify(chart, anims, Date.now(), "complete");
    }
    remove(chart) {
      return this._charts.delete(chart);
    }
  };
  var animator = new Animator();
  var transparent = "transparent";
  var interpolators = {
    boolean(from, to, factor) {
      return factor > 0.5 ? to : from;
    },
    color(from, to, factor) {
      const c0 = color(from || transparent);
      const c1 = c0.valid && color(to || transparent);
      return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
    },
    number(from, to, factor) {
      return from + (to - from) * factor;
    }
  };
  var Animation = class {
    constructor(cfg, target, prop, to) {
      const currentValue = target[prop];
      to = resolve([cfg.to, to, currentValue, cfg.from]);
      const from = resolve([cfg.from, currentValue, to]);
      this._active = true;
      this._fn = cfg.fn || interpolators[cfg.type || typeof from];
      this._easing = effects[cfg.easing] || effects.linear;
      this._start = Math.floor(Date.now() + (cfg.delay || 0));
      this._duration = this._total = Math.floor(cfg.duration);
      this._loop = !!cfg.loop;
      this._target = target;
      this._prop = prop;
      this._from = from;
      this._to = to;
      this._promises = void 0;
    }
    active() {
      return this._active;
    }
    update(cfg, to, date) {
      if (this._active) {
        this._notify(false);
        const currentValue = this._target[this._prop];
        const elapsed = date - this._start;
        const remain = this._duration - elapsed;
        this._start = date;
        this._duration = Math.floor(Math.max(remain, cfg.duration));
        this._total += elapsed;
        this._loop = !!cfg.loop;
        this._to = resolve([cfg.to, to, currentValue, cfg.from]);
        this._from = resolve([cfg.from, currentValue, to]);
      }
    }
    cancel() {
      if (this._active) {
        this.tick(Date.now());
        this._active = false;
        this._notify(false);
      }
    }
    tick(date) {
      const elapsed = date - this._start;
      const duration = this._duration;
      const prop = this._prop;
      const from = this._from;
      const loop = this._loop;
      const to = this._to;
      let factor;
      this._active = from !== to && (loop || elapsed < duration);
      if (!this._active) {
        this._target[prop] = to;
        this._notify(true);
        return;
      }
      if (elapsed < 0) {
        this._target[prop] = from;
        return;
      }
      factor = elapsed / duration % 2;
      factor = loop && factor > 1 ? 2 - factor : factor;
      factor = this._easing(Math.min(1, Math.max(0, factor)));
      this._target[prop] = this._fn(from, to, factor);
    }
    wait() {
      const promises = this._promises || (this._promises = []);
      return new Promise((res, rej) => {
        promises.push({ res, rej });
      });
    }
    _notify(resolved) {
      const method = resolved ? "res" : "rej";
      const promises = this._promises || [];
      for (let i = 0; i < promises.length; i++) {
        promises[i][method]();
      }
    }
  };
  var numbers = ["x", "y", "borderWidth", "radius", "tension"];
  var colors = ["color", "borderColor", "backgroundColor"];
  defaults.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  });
  var animationOptions = Object.keys(defaults.animation);
  defaults.describe("animation", {
    _fallback: false,
    _indexable: false,
    _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
  });
  defaults.set("animations", {
    colors: {
      type: "color",
      properties: colors
    },
    numbers: {
      type: "number",
      properties: numbers
    }
  });
  defaults.describe("animations", {
    _fallback: "animation"
  });
  defaults.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (v) => v | 0
        }
      }
    }
  });
  var Animations = class {
    constructor(chart, config) {
      this._chart = chart;
      this._properties = new Map();
      this.configure(config);
    }
    configure(config) {
      if (!isObject(config)) {
        return;
      }
      const animatedProps = this._properties;
      Object.getOwnPropertyNames(config).forEach((key) => {
        const cfg = config[key];
        if (!isObject(cfg)) {
          return;
        }
        const resolved = {};
        for (const option of animationOptions) {
          resolved[option] = cfg[option];
        }
        (isArray(cfg.properties) && cfg.properties || [key]).forEach((prop) => {
          if (prop === key || !animatedProps.has(prop)) {
            animatedProps.set(prop, resolved);
          }
        });
      });
    }
    _animateOptions(target, values) {
      const newOptions = values.options;
      const options = resolveTargetOptions(target, newOptions);
      if (!options) {
        return [];
      }
      const animations = this._createAnimations(options, newOptions);
      if (newOptions.$shared) {
        awaitAll(target.options.$animations, newOptions).then(() => {
          target.options = newOptions;
        }, () => {
        });
      }
      return animations;
    }
    _createAnimations(target, values) {
      const animatedProps = this._properties;
      const animations = [];
      const running = target.$animations || (target.$animations = {});
      const props = Object.keys(values);
      const date = Date.now();
      let i;
      for (i = props.length - 1; i >= 0; --i) {
        const prop = props[i];
        if (prop.charAt(0) === "$") {
          continue;
        }
        if (prop === "options") {
          animations.push(...this._animateOptions(target, values));
          continue;
        }
        const value = values[prop];
        let animation = running[prop];
        const cfg = animatedProps.get(prop);
        if (animation) {
          if (cfg && animation.active()) {
            animation.update(cfg, value, date);
            continue;
          } else {
            animation.cancel();
          }
        }
        if (!cfg || !cfg.duration) {
          target[prop] = value;
          continue;
        }
        running[prop] = animation = new Animation(cfg, target, prop, value);
        animations.push(animation);
      }
      return animations;
    }
    update(target, values) {
      if (this._properties.size === 0) {
        Object.assign(target, values);
        return;
      }
      const animations = this._createAnimations(target, values);
      if (animations.length) {
        animator.add(this._chart, animations);
        return true;
      }
    }
  };
  function awaitAll(animations, properties) {
    const running = [];
    const keys = Object.keys(properties);
    for (let i = 0; i < keys.length; i++) {
      const anim = animations[keys[i]];
      if (anim && anim.active()) {
        running.push(anim.wait());
      }
    }
    return Promise.all(running);
  }
  function resolveTargetOptions(target, newOptions) {
    if (!newOptions) {
      return;
    }
    let options = target.options;
    if (!options) {
      target.options = newOptions;
      return;
    }
    if (options.$shared) {
      target.options = options = Object.assign({}, options, { $shared: false, $animations: {} });
    }
    return options;
  }
  function scaleClip(scale, allowedOverflow) {
    const opts = scale && scale.options || {};
    const reverse = opts.reverse;
    const min = opts.min === void 0 ? allowedOverflow : 0;
    const max = opts.max === void 0 ? allowedOverflow : 0;
    return {
      start: reverse ? max : min,
      end: reverse ? min : max
    };
  }
  function defaultClip(xScale, yScale, allowedOverflow) {
    if (allowedOverflow === false) {
      return false;
    }
    const x = scaleClip(xScale, allowedOverflow);
    const y = scaleClip(yScale, allowedOverflow);
    return {
      top: y.end,
      right: x.end,
      bottom: y.start,
      left: x.start
    };
  }
  function toClip(value) {
    let t, r, b, l;
    if (isObject(value)) {
      t = value.top;
      r = value.right;
      b = value.bottom;
      l = value.left;
    } else {
      t = r = b = l = value;
    }
    return {
      top: t,
      right: r,
      bottom: b,
      left: l,
      disabled: value === false
    };
  }
  function getSortedDatasetIndices(chart, filterVisible) {
    const keys = [];
    const metasets = chart._getSortedDatasetMetas(filterVisible);
    let i, ilen;
    for (i = 0, ilen = metasets.length; i < ilen; ++i) {
      keys.push(metasets[i].index);
    }
    return keys;
  }
  function applyStack(stack, value, dsIndex, options = {}) {
    const keys = stack.keys;
    const singleMode = options.mode === "single";
    let i, ilen, datasetIndex, otherValue;
    if (value === null) {
      return;
    }
    for (i = 0, ilen = keys.length; i < ilen; ++i) {
      datasetIndex = +keys[i];
      if (datasetIndex === dsIndex) {
        if (options.all) {
          continue;
        }
        break;
      }
      otherValue = stack.values[datasetIndex];
      if (isNumberFinite(otherValue) && (singleMode || (value === 0 || sign(value) === sign(otherValue)))) {
        value += otherValue;
      }
    }
    return value;
  }
  function convertObjectDataToArray(data) {
    const keys = Object.keys(data);
    const adata = new Array(keys.length);
    let i, ilen, key;
    for (i = 0, ilen = keys.length; i < ilen; ++i) {
      key = keys[i];
      adata[i] = {
        x: key,
        y: data[key]
      };
    }
    return adata;
  }
  function isStacked(scale, meta) {
    const stacked = scale && scale.options.stacked;
    return stacked || stacked === void 0 && meta.stack !== void 0;
  }
  function getStackKey(indexScale, valueScale, meta) {
    return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
  }
  function getUserBounds(scale) {
    const { min, max, minDefined, maxDefined } = scale.getUserBounds();
    return {
      min: minDefined ? min : Number.NEGATIVE_INFINITY,
      max: maxDefined ? max : Number.POSITIVE_INFINITY
    };
  }
  function getOrCreateStack(stacks, stackKey, indexValue) {
    const subStack = stacks[stackKey] || (stacks[stackKey] = {});
    return subStack[indexValue] || (subStack[indexValue] = {});
  }
  function getLastIndexInStack(stack, vScale, positive, type) {
    for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
      const value = stack[meta.index];
      if (positive && value > 0 || !positive && value < 0) {
        return meta.index;
      }
    }
    return null;
  }
  function updateStacks(controller, parsed) {
    const { chart, _cachedMeta: meta } = controller;
    const stacks = chart._stacks || (chart._stacks = {});
    const { iScale, vScale, index: datasetIndex } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const key = getStackKey(iScale, vScale, meta);
    const ilen = parsed.length;
    let stack;
    for (let i = 0; i < ilen; ++i) {
      const item = parsed[i];
      const { [iAxis]: index, [vAxis]: value } = item;
      const itemStacks = item._stacks || (item._stacks = {});
      stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
      stack[datasetIndex] = value;
      stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
      stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
    }
  }
  function getFirstScaleId(chart, axis) {
    const scales2 = chart.scales;
    return Object.keys(scales2).filter((key) => scales2[key].axis === axis).shift();
  }
  function createDatasetContext(parent, index) {
    return createContext(parent, {
      active: false,
      dataset: void 0,
      datasetIndex: index,
      index,
      mode: "default",
      type: "dataset"
    });
  }
  function createDataContext(parent, index, element) {
    return createContext(parent, {
      active: false,
      dataIndex: index,
      parsed: void 0,
      raw: void 0,
      element,
      index,
      mode: "default",
      type: "data"
    });
  }
  function clearStacks(meta, items) {
    const datasetIndex = meta.controller.index;
    const axis = meta.vScale && meta.vScale.axis;
    if (!axis) {
      return;
    }
    items = items || meta._parsed;
    for (const parsed of items) {
      const stacks = parsed._stacks;
      if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
        return;
      }
      delete stacks[axis][datasetIndex];
    }
  }
  var isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
  var cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
  var createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && { keys: getSortedDatasetIndices(chart, true), values: null };
  var DatasetController = class {
    constructor(chart, datasetIndex) {
      this.chart = chart;
      this._ctx = chart.ctx;
      this.index = datasetIndex;
      this._cachedDataOpts = {};
      this._cachedMeta = this.getMeta();
      this._type = this._cachedMeta.type;
      this.options = void 0;
      this._parsing = false;
      this._data = void 0;
      this._objectData = void 0;
      this._sharedOptions = void 0;
      this._drawStart = void 0;
      this._drawCount = void 0;
      this.enableOptionSharing = false;
      this.$context = void 0;
      this._syncList = [];
      this.initialize();
    }
    initialize() {
      const meta = this._cachedMeta;
      this.configure();
      this.linkScales();
      meta._stacked = isStacked(meta.vScale, meta);
      this.addElements();
    }
    updateIndex(datasetIndex) {
      if (this.index !== datasetIndex) {
        clearStacks(this._cachedMeta);
      }
      this.index = datasetIndex;
    }
    linkScales() {
      const chart = this.chart;
      const meta = this._cachedMeta;
      const dataset = this.getDataset();
      const chooseId = (axis, x, y, r) => axis === "x" ? x : axis === "r" ? r : y;
      const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
      const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
      const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
      const indexAxis = meta.indexAxis;
      const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
      const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
      meta.xScale = this.getScaleForId(xid);
      meta.yScale = this.getScaleForId(yid);
      meta.rScale = this.getScaleForId(rid);
      meta.iScale = this.getScaleForId(iid);
      meta.vScale = this.getScaleForId(vid);
    }
    getDataset() {
      return this.chart.data.datasets[this.index];
    }
    getMeta() {
      return this.chart.getDatasetMeta(this.index);
    }
    getScaleForId(scaleID) {
      return this.chart.scales[scaleID];
    }
    _getOtherScale(scale) {
      const meta = this._cachedMeta;
      return scale === meta.iScale ? meta.vScale : meta.iScale;
    }
    reset() {
      this._update("reset");
    }
    _destroy() {
      const meta = this._cachedMeta;
      if (this._data) {
        unlistenArrayEvents(this._data, this);
      }
      if (meta._stacked) {
        clearStacks(meta);
      }
    }
    _dataCheck() {
      const dataset = this.getDataset();
      const data = dataset.data || (dataset.data = []);
      const _data = this._data;
      if (isObject(data)) {
        this._data = convertObjectDataToArray(data);
      } else if (_data !== data) {
        if (_data) {
          unlistenArrayEvents(_data, this);
          const meta = this._cachedMeta;
          clearStacks(meta);
          meta._parsed = [];
        }
        if (data && Object.isExtensible(data)) {
          listenArrayEvents(data, this);
        }
        this._syncList = [];
        this._data = data;
      }
    }
    addElements() {
      const meta = this._cachedMeta;
      this._dataCheck();
      if (this.datasetElementType) {
        meta.dataset = new this.datasetElementType();
      }
    }
    buildOrUpdateElements(resetNewElements) {
      const meta = this._cachedMeta;
      const dataset = this.getDataset();
      let stackChanged = false;
      this._dataCheck();
      const oldStacked = meta._stacked;
      meta._stacked = isStacked(meta.vScale, meta);
      if (meta.stack !== dataset.stack) {
        stackChanged = true;
        clearStacks(meta);
        meta.stack = dataset.stack;
      }
      this._resyncElements(resetNewElements);
      if (stackChanged || oldStacked !== meta._stacked) {
        updateStacks(this, meta._parsed);
      }
    }
    configure() {
      const config = this.chart.config;
      const scopeKeys = config.datasetScopeKeys(this._type);
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
      this.options = config.createResolver(scopes, this.getContext());
      this._parsing = this.options.parsing;
    }
    parse(start, count) {
      const { _cachedMeta: meta, _data: data } = this;
      const { iScale, _stacked } = meta;
      const iAxis = iScale.axis;
      let sorted = start === 0 && count === data.length ? true : meta._sorted;
      let prev = start > 0 && meta._parsed[start - 1];
      let i, cur, parsed;
      if (this._parsing === false) {
        meta._parsed = data;
        meta._sorted = true;
        parsed = data;
      } else {
        if (isArray(data[start])) {
          parsed = this.parseArrayData(meta, data, start, count);
        } else if (isObject(data[start])) {
          parsed = this.parseObjectData(meta, data, start, count);
        } else {
          parsed = this.parsePrimitiveData(meta, data, start, count);
        }
        const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
        for (i = 0; i < count; ++i) {
          meta._parsed[i + start] = cur = parsed[i];
          if (sorted) {
            if (isNotInOrderComparedToPrev()) {
              sorted = false;
            }
            prev = cur;
          }
        }
        meta._sorted = sorted;
      }
      if (_stacked) {
        updateStacks(this, parsed);
      }
    }
    parsePrimitiveData(meta, data, start, count) {
      const { iScale, vScale } = meta;
      const iAxis = iScale.axis;
      const vAxis = vScale.axis;
      const labels = iScale.getLabels();
      const singleScale = iScale === vScale;
      const parsed = new Array(count);
      let i, ilen, index;
      for (i = 0, ilen = count; i < ilen; ++i) {
        index = i + start;
        parsed[i] = {
          [iAxis]: singleScale || iScale.parse(labels[index], index),
          [vAxis]: vScale.parse(data[index], index)
        };
      }
      return parsed;
    }
    parseArrayData(meta, data, start, count) {
      const { xScale, yScale } = meta;
      const parsed = new Array(count);
      let i, ilen, index, item;
      for (i = 0, ilen = count; i < ilen; ++i) {
        index = i + start;
        item = data[index];
        parsed[i] = {
          x: xScale.parse(item[0], index),
          y: yScale.parse(item[1], index)
        };
      }
      return parsed;
    }
    parseObjectData(meta, data, start, count) {
      const { xScale, yScale } = meta;
      const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
      const parsed = new Array(count);
      let i, ilen, index, item;
      for (i = 0, ilen = count; i < ilen; ++i) {
        index = i + start;
        item = data[index];
        parsed[i] = {
          x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
          y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
        };
      }
      return parsed;
    }
    getParsed(index) {
      return this._cachedMeta._parsed[index];
    }
    getDataElement(index) {
      return this._cachedMeta.data[index];
    }
    applyStack(scale, parsed, mode) {
      const chart = this.chart;
      const meta = this._cachedMeta;
      const value = parsed[scale.axis];
      const stack = {
        keys: getSortedDatasetIndices(chart, true),
        values: parsed._stacks[scale.axis]
      };
      return applyStack(stack, value, meta.index, { mode });
    }
    updateRangeFromParsed(range, scale, parsed, stack) {
      const parsedValue = parsed[scale.axis];
      let value = parsedValue === null ? NaN : parsedValue;
      const values = stack && parsed._stacks[scale.axis];
      if (stack && values) {
        stack.values = values;
        value = applyStack(stack, parsedValue, this._cachedMeta.index);
      }
      range.min = Math.min(range.min, value);
      range.max = Math.max(range.max, value);
    }
    getMinMax(scale, canStack) {
      const meta = this._cachedMeta;
      const _parsed = meta._parsed;
      const sorted = meta._sorted && scale === meta.iScale;
      const ilen = _parsed.length;
      const otherScale = this._getOtherScale(scale);
      const stack = createStack(canStack, meta, this.chart);
      const range = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
      const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
      let i, parsed;
      function _skip() {
        parsed = _parsed[i];
        const otherValue = parsed[otherScale.axis];
        return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
      }
      for (i = 0; i < ilen; ++i) {
        if (_skip()) {
          continue;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        if (sorted) {
          break;
        }
      }
      if (sorted) {
        for (i = ilen - 1; i >= 0; --i) {
          if (_skip()) {
            continue;
          }
          this.updateRangeFromParsed(range, scale, parsed, stack);
          break;
        }
      }
      return range;
    }
    getAllParsedValues(scale) {
      const parsed = this._cachedMeta._parsed;
      const values = [];
      let i, ilen, value;
      for (i = 0, ilen = parsed.length; i < ilen; ++i) {
        value = parsed[i][scale.axis];
        if (isNumberFinite(value)) {
          values.push(value);
        }
      }
      return values;
    }
    getMaxOverflow() {
      return false;
    }
    getLabelAndValue(index) {
      const meta = this._cachedMeta;
      const iScale = meta.iScale;
      const vScale = meta.vScale;
      const parsed = this.getParsed(index);
      return {
        label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
        value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
      };
    }
    _update(mode) {
      const meta = this._cachedMeta;
      this.configure();
      this._cachedDataOpts = {};
      this.update(mode || "default");
      meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
    }
    update(mode) {
    }
    draw() {
      const ctx2 = this._ctx;
      const chart = this.chart;
      const meta = this._cachedMeta;
      const elements2 = meta.data || [];
      const area = chart.chartArea;
      const active = [];
      const start = this._drawStart || 0;
      const count = this._drawCount || elements2.length - start;
      let i;
      if (meta.dataset) {
        meta.dataset.draw(ctx2, area, start, count);
      }
      for (i = start; i < start + count; ++i) {
        const element = elements2[i];
        if (element.hidden) {
          continue;
        }
        if (element.active) {
          active.push(element);
        } else {
          element.draw(ctx2, area);
        }
      }
      for (i = 0; i < active.length; ++i) {
        active[i].draw(ctx2, area);
      }
    }
    getStyle(index, active) {
      const mode = active ? "active" : "default";
      return index === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
    }
    getContext(index, active, mode) {
      const dataset = this.getDataset();
      let context;
      if (index >= 0 && index < this._cachedMeta.data.length) {
        const element = this._cachedMeta.data[index];
        context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
        context.parsed = this.getParsed(index);
        context.raw = dataset.data[index];
        context.index = context.dataIndex = index;
      } else {
        context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
        context.dataset = dataset;
        context.index = context.datasetIndex = this.index;
      }
      context.active = !!active;
      context.mode = mode;
      return context;
    }
    resolveDatasetElementOptions(mode) {
      return this._resolveElementOptions(this.datasetElementType.id, mode);
    }
    resolveDataElementOptions(index, mode) {
      return this._resolveElementOptions(this.dataElementType.id, mode, index);
    }
    _resolveElementOptions(elementType, mode = "default", index) {
      const active = mode === "active";
      const cache = this._cachedDataOpts;
      const cacheKey = elementType + "-" + mode;
      const cached = cache[cacheKey];
      const sharing = this.enableOptionSharing && defined(index);
      if (cached) {
        return cloneIfNotShared(cached, sharing);
      }
      const config = this.chart.config;
      const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
      const prefixes = active ? [`${elementType}Hover`, "hover", elementType, ""] : [elementType, ""];
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
      const names2 = Object.keys(defaults.elements[elementType]);
      const context = () => this.getContext(index, active);
      const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
      if (values.$shared) {
        values.$shared = sharing;
        cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
      }
      return values;
    }
    _resolveAnimations(index, transition, active) {
      const chart = this.chart;
      const cache = this._cachedDataOpts;
      const cacheKey = `animation-${transition}`;
      const cached = cache[cacheKey];
      if (cached) {
        return cached;
      }
      let options;
      if (chart.options.animation !== false) {
        const config = this.chart.config;
        const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        options = config.createResolver(scopes, this.getContext(index, active, transition));
      }
      const animations = new Animations(chart, options && options.animations);
      if (options && options._cacheable) {
        cache[cacheKey] = Object.freeze(animations);
      }
      return animations;
    }
    getSharedOptions(options) {
      if (!options.$shared) {
        return;
      }
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
    }
    includeOptions(mode, sharedOptions) {
      return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
    }
    updateElement(element, index, properties, mode) {
      if (isDirectUpdateMode(mode)) {
        Object.assign(element, properties);
      } else {
        this._resolveAnimations(index, mode).update(element, properties);
      }
    }
    updateSharedOptions(sharedOptions, mode, newOptions) {
      if (sharedOptions && !isDirectUpdateMode(mode)) {
        this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
      }
    }
    _setStyle(element, index, mode, active) {
      element.active = active;
      const options = this.getStyle(index, active);
      this._resolveAnimations(index, mode, active).update(element, {
        options: !active && this.getSharedOptions(options) || options
      });
    }
    removeHoverStyle(element, datasetIndex, index) {
      this._setStyle(element, index, "active", false);
    }
    setHoverStyle(element, datasetIndex, index) {
      this._setStyle(element, index, "active", true);
    }
    _removeDatasetHoverStyle() {
      const element = this._cachedMeta.dataset;
      if (element) {
        this._setStyle(element, void 0, "active", false);
      }
    }
    _setDatasetHoverStyle() {
      const element = this._cachedMeta.dataset;
      if (element) {
        this._setStyle(element, void 0, "active", true);
      }
    }
    _resyncElements(resetNewElements) {
      const data = this._data;
      const elements2 = this._cachedMeta.data;
      for (const [method, arg1, arg2] of this._syncList) {
        this[method](arg1, arg2);
      }
      this._syncList = [];
      const numMeta = elements2.length;
      const numData = data.length;
      const count = Math.min(numData, numMeta);
      if (count) {
        this.parse(0, count);
      }
      if (numData > numMeta) {
        this._insertElements(numMeta, numData - numMeta, resetNewElements);
      } else if (numData < numMeta) {
        this._removeElements(numData, numMeta - numData);
      }
    }
    _insertElements(start, count, resetNewElements = true) {
      const meta = this._cachedMeta;
      const data = meta.data;
      const end = start + count;
      let i;
      const move = (arr) => {
        arr.length += count;
        for (i = arr.length - 1; i >= end; i--) {
          arr[i] = arr[i - count];
        }
      };
      move(data);
      for (i = start; i < end; ++i) {
        data[i] = new this.dataElementType();
      }
      if (this._parsing) {
        move(meta._parsed);
      }
      this.parse(start, count);
      if (resetNewElements) {
        this.updateElements(data, start, count, "reset");
      }
    }
    updateElements(element, start, count, mode) {
    }
    _removeElements(start, count) {
      const meta = this._cachedMeta;
      if (this._parsing) {
        const removed = meta._parsed.splice(start, count);
        if (meta._stacked) {
          clearStacks(meta, removed);
        }
      }
      meta.data.splice(start, count);
    }
    _sync(args) {
      if (this._parsing) {
        this._syncList.push(args);
      } else {
        const [method, arg1, arg2] = args;
        this[method](arg1, arg2);
      }
    }
    _onDataPush() {
      const count = arguments.length;
      this._sync(["_insertElements", this.getDataset().data.length - count, count]);
    }
    _onDataPop() {
      this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
    }
    _onDataShift() {
      this._sync(["_removeElements", 0, 1]);
    }
    _onDataSplice(start, count) {
      this._sync(["_removeElements", start, count]);
      this._sync(["_insertElements", start, arguments.length - 2]);
    }
    _onDataUnshift() {
      this._sync(["_insertElements", 0, arguments.length]);
    }
  };
  DatasetController.defaults = {};
  DatasetController.prototype.datasetElementType = null;
  DatasetController.prototype.dataElementType = null;
  function getAllScaleValues(scale, type) {
    if (!scale._cache.$bar) {
      const visibleMetas = scale.getMatchingVisibleMetas(type);
      let values = [];
      for (let i = 0, ilen = visibleMetas.length; i < ilen; i++) {
        values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
      }
      scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
    }
    return scale._cache.$bar;
  }
  function computeMinSampleSize(meta) {
    const scale = meta.iScale;
    const values = getAllScaleValues(scale, meta.type);
    let min = scale._length;
    let i, ilen, curr, prev;
    const updateMinAndPrev = () => {
      if (curr === 32767 || curr === -32768) {
        return;
      }
      if (defined(prev)) {
        min = Math.min(min, Math.abs(curr - prev) || min);
      }
      prev = curr;
    };
    for (i = 0, ilen = values.length; i < ilen; ++i) {
      curr = scale.getPixelForValue(values[i]);
      updateMinAndPrev();
    }
    prev = void 0;
    for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
      curr = scale.getPixelForTick(i);
      updateMinAndPrev();
    }
    return min;
  }
  function computeFitCategoryTraits(index, ruler, options, stackCount) {
    const thickness = options.barThickness;
    let size, ratio;
    if (isNullOrUndef(thickness)) {
      size = ruler.min * options.categoryPercentage;
      ratio = options.barPercentage;
    } else {
      size = thickness * stackCount;
      ratio = 1;
    }
    return {
      chunk: size / stackCount,
      ratio,
      start: ruler.pixels[index] - size / 2
    };
  }
  function computeFlexCategoryTraits(index, ruler, options, stackCount) {
    const pixels = ruler.pixels;
    const curr = pixels[index];
    let prev = index > 0 ? pixels[index - 1] : null;
    let next = index < pixels.length - 1 ? pixels[index + 1] : null;
    const percent = options.categoryPercentage;
    if (prev === null) {
      prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
    }
    if (next === null) {
      next = curr + curr - prev;
    }
    const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
    const size = Math.abs(next - prev) / 2 * percent;
    return {
      chunk: size / stackCount,
      ratio: options.barPercentage,
      start
    };
  }
  function parseFloatBar(entry, item, vScale, i) {
    const startValue = vScale.parse(entry[0], i);
    const endValue = vScale.parse(entry[1], i);
    const min = Math.min(startValue, endValue);
    const max = Math.max(startValue, endValue);
    let barStart = min;
    let barEnd = max;
    if (Math.abs(min) > Math.abs(max)) {
      barStart = max;
      barEnd = min;
    }
    item[vScale.axis] = barEnd;
    item._custom = {
      barStart,
      barEnd,
      start: startValue,
      end: endValue,
      min,
      max
    };
  }
  function parseValue(entry, item, vScale, i) {
    if (isArray(entry)) {
      parseFloatBar(entry, item, vScale, i);
    } else {
      item[vScale.axis] = vScale.parse(entry, i);
    }
    return item;
  }
  function parseArrayOrPrimitive(meta, data, start, count) {
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = [];
    let i, ilen, item, entry;
    for (i = start, ilen = start + count; i < ilen; ++i) {
      entry = data[i];
      item = {};
      item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
      parsed.push(parseValue(entry, item, vScale, i));
    }
    return parsed;
  }
  function isFloatBar(custom) {
    return custom && custom.barStart !== void 0 && custom.barEnd !== void 0;
  }
  function barSign(size, vScale, actualBase) {
    if (size !== 0) {
      return sign(size);
    }
    return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
  }
  function borderProps(properties) {
    let reverse, start, end, top, bottom;
    if (properties.horizontal) {
      reverse = properties.base > properties.x;
      start = "left";
      end = "right";
    } else {
      reverse = properties.base < properties.y;
      start = "bottom";
      end = "top";
    }
    if (reverse) {
      top = "end";
      bottom = "start";
    } else {
      top = "start";
      bottom = "end";
    }
    return { start, end, reverse, top, bottom };
  }
  function setBorderSkipped(properties, options, stack, index) {
    let edge = options.borderSkipped;
    const res = {};
    if (!edge) {
      properties.borderSkipped = res;
      return;
    }
    const { start, end, reverse, top, bottom } = borderProps(properties);
    if (edge === "middle" && stack) {
      properties.enableBorderRadius = true;
      if ((stack._top || 0) === index) {
        edge = top;
      } else if ((stack._bottom || 0) === index) {
        edge = bottom;
      } else {
        res[parseEdge(bottom, start, end, reverse)] = true;
        edge = top;
      }
    }
    res[parseEdge(edge, start, end, reverse)] = true;
    properties.borderSkipped = res;
  }
  function parseEdge(edge, a, b, reverse) {
    if (reverse) {
      edge = swap(edge, a, b);
      edge = startEnd(edge, b, a);
    } else {
      edge = startEnd(edge, a, b);
    }
    return edge;
  }
  function swap(orig, v1, v2) {
    return orig === v1 ? v2 : orig === v2 ? v1 : orig;
  }
  function startEnd(v, start, end) {
    return v === "start" ? start : v === "end" ? end : v;
  }
  function setInflateAmount(properties, { inflateAmount }, ratio) {
    properties.inflateAmount = inflateAmount === "auto" ? ratio === 1 ? 0.33 : 0 : inflateAmount;
  }
  var BarController = class extends DatasetController {
    parsePrimitiveData(meta, data, start, count) {
      return parseArrayOrPrimitive(meta, data, start, count);
    }
    parseArrayData(meta, data, start, count) {
      return parseArrayOrPrimitive(meta, data, start, count);
    }
    parseObjectData(meta, data, start, count) {
      const { iScale, vScale } = meta;
      const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
      const iAxisKey = iScale.axis === "x" ? xAxisKey : yAxisKey;
      const vAxisKey = vScale.axis === "x" ? xAxisKey : yAxisKey;
      const parsed = [];
      let i, ilen, item, obj;
      for (i = start, ilen = start + count; i < ilen; ++i) {
        obj = data[i];
        item = {};
        item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
        parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
      }
      return parsed;
    }
    updateRangeFromParsed(range, scale, parsed, stack) {
      super.updateRangeFromParsed(range, scale, parsed, stack);
      const custom = parsed._custom;
      if (custom && scale === this._cachedMeta.vScale) {
        range.min = Math.min(range.min, custom.min);
        range.max = Math.max(range.max, custom.max);
      }
    }
    getMaxOverflow() {
      return 0;
    }
    getLabelAndValue(index) {
      const meta = this._cachedMeta;
      const { iScale, vScale } = meta;
      const parsed = this.getParsed(index);
      const custom = parsed._custom;
      const value = isFloatBar(custom) ? "[" + custom.start + ", " + custom.end + "]" : "" + vScale.getLabelForValue(parsed[vScale.axis]);
      return {
        label: "" + iScale.getLabelForValue(parsed[iScale.axis]),
        value
      };
    }
    initialize() {
      this.enableOptionSharing = true;
      super.initialize();
      const meta = this._cachedMeta;
      meta.stack = this.getDataset().stack;
    }
    update(mode) {
      const meta = this._cachedMeta;
      this.updateElements(meta.data, 0, meta.data.length, mode);
    }
    updateElements(bars, start, count, mode) {
      const reset = mode === "reset";
      const { index, _cachedMeta: { vScale } } = this;
      const base = vScale.getBasePixel();
      const horizontal = vScale.isHorizontal();
      const ruler = this._getRuler();
      const firstOpts = this.resolveDataElementOptions(start, mode);
      const sharedOptions = this.getSharedOptions(firstOpts);
      const includeOptions = this.includeOptions(mode, sharedOptions);
      this.updateSharedOptions(sharedOptions, mode, firstOpts);
      for (let i = start; i < start + count; i++) {
        const parsed = this.getParsed(i);
        const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? { base, head: base } : this._calculateBarValuePixels(i);
        const ipixels = this._calculateBarIndexPixels(i, ruler);
        const stack = (parsed._stacks || {})[vScale.axis];
        const properties = {
          horizontal,
          base: vpixels.base,
          enableBorderRadius: !stack || isFloatBar(parsed._custom) || (index === stack._top || index === stack._bottom),
          x: horizontal ? vpixels.head : ipixels.center,
          y: horizontal ? ipixels.center : vpixels.head,
          height: horizontal ? ipixels.size : Math.abs(vpixels.size),
          width: horizontal ? Math.abs(vpixels.size) : ipixels.size
        };
        if (includeOptions) {
          properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? "active" : mode);
        }
        const options = properties.options || bars[i].options;
        setBorderSkipped(properties, options, stack, index);
        setInflateAmount(properties, options, ruler.ratio);
        this.updateElement(bars[i], i, properties, mode);
      }
    }
    _getStacks(last, dataIndex) {
      const meta = this._cachedMeta;
      const iScale = meta.iScale;
      const metasets = iScale.getMatchingVisibleMetas(this._type);
      const stacked = iScale.options.stacked;
      const ilen = metasets.length;
      const stacks = [];
      let i, item;
      for (i = 0; i < ilen; ++i) {
        item = metasets[i];
        if (!item.controller.options.grouped) {
          continue;
        }
        if (typeof dataIndex !== "undefined") {
          const val = item.controller.getParsed(dataIndex)[item.controller._cachedMeta.vScale.axis];
          if (isNullOrUndef(val) || isNaN(val)) {
            continue;
          }
        }
        if (stacked === false || stacks.indexOf(item.stack) === -1 || stacked === void 0 && item.stack === void 0) {
          stacks.push(item.stack);
        }
        if (item.index === last) {
          break;
        }
      }
      if (!stacks.length) {
        stacks.push(void 0);
      }
      return stacks;
    }
    _getStackCount(index) {
      return this._getStacks(void 0, index).length;
    }
    _getStackIndex(datasetIndex, name, dataIndex) {
      const stacks = this._getStacks(datasetIndex, dataIndex);
      const index = name !== void 0 ? stacks.indexOf(name) : -1;
      return index === -1 ? stacks.length - 1 : index;
    }
    _getRuler() {
      const opts = this.options;
      const meta = this._cachedMeta;
      const iScale = meta.iScale;
      const pixels = [];
      let i, ilen;
      for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
        pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
      }
      const barThickness = opts.barThickness;
      const min = barThickness || computeMinSampleSize(meta);
      return {
        min,
        pixels,
        start: iScale._startPixel,
        end: iScale._endPixel,
        stackCount: this._getStackCount(),
        scale: iScale,
        grouped: opts.grouped,
        ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
      };
    }
    _calculateBarValuePixels(index) {
      const { _cachedMeta: { vScale, _stacked }, options: { base: baseValue, minBarLength } } = this;
      const actualBase = baseValue || 0;
      const parsed = this.getParsed(index);
      const custom = parsed._custom;
      const floating = isFloatBar(custom);
      let value = parsed[vScale.axis];
      let start = 0;
      let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
      let head, size;
      if (length !== value) {
        start = length - value;
        length = value;
      }
      if (floating) {
        value = custom.barStart;
        length = custom.barEnd - custom.barStart;
        if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
          start = 0;
        }
        start += value;
      }
      const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
      let base = vScale.getPixelForValue(startValue);
      if (this.chart.getDataVisibility(index)) {
        head = vScale.getPixelForValue(start + length);
      } else {
        head = base;
      }
      size = head - base;
      if (Math.abs(size) < minBarLength) {
        size = barSign(size, vScale, actualBase) * minBarLength;
        if (value === actualBase) {
          base -= size / 2;
        }
        head = base + size;
      }
      if (base === vScale.getPixelForValue(actualBase)) {
        const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
        base += halfGrid;
        size -= halfGrid;
      }
      return {
        size,
        base,
        head,
        center: head + size / 2
      };
    }
    _calculateBarIndexPixels(index, ruler) {
      const scale = ruler.scale;
      const options = this.options;
      const skipNull = options.skipNull;
      const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
      let center, size;
      if (ruler.grouped) {
        const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
        const range = options.barThickness === "flex" ? computeFlexCategoryTraits(index, ruler, options, stackCount) : computeFitCategoryTraits(index, ruler, options, stackCount);
        const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : void 0);
        center = range.start + range.chunk * stackIndex + range.chunk / 2;
        size = Math.min(maxBarThickness, range.chunk * range.ratio);
      } else {
        center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index);
        size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
      }
      return {
        base: center - size / 2,
        head: center + size / 2,
        center,
        size
      };
    }
    draw() {
      const meta = this._cachedMeta;
      const vScale = meta.vScale;
      const rects = meta.data;
      const ilen = rects.length;
      let i = 0;
      for (; i < ilen; ++i) {
        if (this.getParsed(i)[vScale.axis] !== null) {
          rects[i].draw(this._ctx);
        }
      }
    }
  };
  BarController.id = "bar";
  BarController.defaults = {
    datasetElementType: false,
    dataElementType: "bar",
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: true,
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "base", "width", "height"]
      }
    }
  };
  BarController.overrides = {
    scales: {
      _index_: {
        type: "category",
        offset: true,
        grid: {
          offset: true
        }
      },
      _value_: {
        type: "linear",
        beginAtZero: true
      }
    }
  };
  var BubbleController = class extends DatasetController {
    initialize() {
      this.enableOptionSharing = true;
      super.initialize();
    }
    parsePrimitiveData(meta, data, start, count) {
      const parsed = super.parsePrimitiveData(meta, data, start, count);
      for (let i = 0; i < parsed.length; i++) {
        parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
      }
      return parsed;
    }
    parseArrayData(meta, data, start, count) {
      const parsed = super.parseArrayData(meta, data, start, count);
      for (let i = 0; i < parsed.length; i++) {
        const item = data[start + i];
        parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
      }
      return parsed;
    }
    parseObjectData(meta, data, start, count) {
      const parsed = super.parseObjectData(meta, data, start, count);
      for (let i = 0; i < parsed.length; i++) {
        const item = data[start + i];
        parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
      }
      return parsed;
    }
    getMaxOverflow() {
      const data = this._cachedMeta.data;
      let max = 0;
      for (let i = data.length - 1; i >= 0; --i) {
        max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
      }
      return max > 0 && max;
    }
    getLabelAndValue(index) {
      const meta = this._cachedMeta;
      const { xScale, yScale } = meta;
      const parsed = this.getParsed(index);
      const x = xScale.getLabelForValue(parsed.x);
      const y = yScale.getLabelForValue(parsed.y);
      const r = parsed._custom;
      return {
        label: meta.label,
        value: "(" + x + ", " + y + (r ? ", " + r : "") + ")"
      };
    }
    update(mode) {
      const points = this._cachedMeta.data;
      this.updateElements(points, 0, points.length, mode);
    }
    updateElements(points, start, count, mode) {
      const reset = mode === "reset";
      const { iScale, vScale } = this._cachedMeta;
      const firstOpts = this.resolveDataElementOptions(start, mode);
      const sharedOptions = this.getSharedOptions(firstOpts);
      const includeOptions = this.includeOptions(mode, sharedOptions);
      const iAxis = iScale.axis;
      const vAxis = vScale.axis;
      for (let i = start; i < start + count; i++) {
        const point = points[i];
        const parsed = !reset && this.getParsed(i);
        const properties = {};
        const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
        const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
        properties.skip = isNaN(iPixel) || isNaN(vPixel);
        if (includeOptions) {
          properties.options = this.resolveDataElementOptions(i, point.active ? "active" : mode);
          if (reset) {
            properties.options.radius = 0;
          }
        }
        this.updateElement(point, i, properties, mode);
      }
      this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
    resolveDataElementOptions(index, mode) {
      const parsed = this.getParsed(index);
      let values = super.resolveDataElementOptions(index, mode);
      if (values.$shared) {
        values = Object.assign({}, values, { $shared: false });
      }
      const radius = values.radius;
      if (mode !== "active") {
        values.radius = 0;
      }
      values.radius += valueOrDefault(parsed && parsed._custom, radius);
      return values;
    }
  };
  BubbleController.id = "bubble";
  BubbleController.defaults = {
    datasetElementType: false,
    dataElementType: "point",
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "borderWidth", "radius"]
      }
    }
  };
  BubbleController.overrides = {
    scales: {
      x: {
        type: "linear"
      },
      y: {
        type: "linear"
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return "";
          }
        }
      }
    }
  };
  function getRatioAndOffset(rotation, circumference, cutout) {
    let ratioX = 1;
    let ratioY = 1;
    let offsetX = 0;
    let offsetY = 0;
    if (circumference < TAU) {
      const startAngle = rotation;
      const endAngle = startAngle + circumference;
      const startX = Math.cos(startAngle);
      const startY = Math.sin(startAngle);
      const endX = Math.cos(endAngle);
      const endY = Math.sin(endAngle);
      const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
      const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
      const maxX = calcMax(0, startX, endX);
      const maxY = calcMax(HALF_PI, startY, endY);
      const minX = calcMin(PI, startX, endX);
      const minY = calcMin(PI + HALF_PI, startY, endY);
      ratioX = (maxX - minX) / 2;
      ratioY = (maxY - minY) / 2;
      offsetX = -(maxX + minX) / 2;
      offsetY = -(maxY + minY) / 2;
    }
    return { ratioX, ratioY, offsetX, offsetY };
  }
  var DoughnutController = class extends DatasetController {
    constructor(chart, datasetIndex) {
      super(chart, datasetIndex);
      this.enableOptionSharing = true;
      this.innerRadius = void 0;
      this.outerRadius = void 0;
      this.offsetX = void 0;
      this.offsetY = void 0;
    }
    linkScales() {
    }
    parse(start, count) {
      const data = this.getDataset().data;
      const meta = this._cachedMeta;
      if (this._parsing === false) {
        meta._parsed = data;
      } else {
        let getter = (i2) => +data[i2];
        if (isObject(data[start])) {
          const { key = "value" } = this._parsing;
          getter = (i2) => +resolveObjectKey(data[i2], key);
        }
        let i, ilen;
        for (i = start, ilen = start + count; i < ilen; ++i) {
          meta._parsed[i] = getter(i);
        }
      }
    }
    _getRotation() {
      return toRadians(this.options.rotation - 90);
    }
    _getCircumference() {
      return toRadians(this.options.circumference);
    }
    _getRotationExtents() {
      let min = TAU;
      let max = -TAU;
      for (let i = 0; i < this.chart.data.datasets.length; ++i) {
        if (this.chart.isDatasetVisible(i)) {
          const controller = this.chart.getDatasetMeta(i).controller;
          const rotation = controller._getRotation();
          const circumference = controller._getCircumference();
          min = Math.min(min, rotation);
          max = Math.max(max, rotation + circumference);
        }
      }
      return {
        rotation: min,
        circumference: max - min
      };
    }
    update(mode) {
      const chart = this.chart;
      const { chartArea } = chart;
      const meta = this._cachedMeta;
      const arcs = meta.data;
      const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
      const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
      const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
      const chartWeight = this._getRingWeight(this.index);
      const { circumference, rotation } = this._getRotationExtents();
      const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circumference, cutout);
      const maxWidth = (chartArea.width - spacing) / ratioX;
      const maxHeight = (chartArea.height - spacing) / ratioY;
      const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
      const outerRadius = toDimension(this.options.radius, maxRadius);
      const innerRadius = Math.max(outerRadius * cutout, 0);
      const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
      this.offsetX = offsetX * outerRadius;
      this.offsetY = offsetY * outerRadius;
      meta.total = this.calculateTotal();
      this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
      this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
      this.updateElements(arcs, 0, arcs.length, mode);
    }
    _circumference(i, reset) {
      const opts = this.options;
      const meta = this._cachedMeta;
      const circumference = this._getCircumference();
      if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
        return 0;
      }
      return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
    }
    updateElements(arcs, start, count, mode) {
      const reset = mode === "reset";
      const chart = this.chart;
      const chartArea = chart.chartArea;
      const opts = chart.options;
      const animationOpts = opts.animation;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const animateScale = reset && animationOpts.animateScale;
      const innerRadius = animateScale ? 0 : this.innerRadius;
      const outerRadius = animateScale ? 0 : this.outerRadius;
      const firstOpts = this.resolveDataElementOptions(start, mode);
      const sharedOptions = this.getSharedOptions(firstOpts);
      const includeOptions = this.includeOptions(mode, sharedOptions);
      let startAngle = this._getRotation();
      let i;
      for (i = 0; i < start; ++i) {
        startAngle += this._circumference(i, reset);
      }
      for (i = start; i < start + count; ++i) {
        const circumference = this._circumference(i, reset);
        const arc = arcs[i];
        const properties = {
          x: centerX + this.offsetX,
          y: centerY + this.offsetY,
          startAngle,
          endAngle: startAngle + circumference,
          circumference,
          outerRadius,
          innerRadius
        };
        if (includeOptions) {
          properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? "active" : mode);
        }
        startAngle += circumference;
        this.updateElement(arc, i, properties, mode);
      }
      this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
    calculateTotal() {
      const meta = this._cachedMeta;
      const metaData = meta.data;
      let total = 0;
      let i;
      for (i = 0; i < metaData.length; i++) {
        const value = meta._parsed[i];
        if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
          total += Math.abs(value);
        }
      }
      return total;
    }
    calculateCircumference(value) {
      const total = this._cachedMeta.total;
      if (total > 0 && !isNaN(value)) {
        return TAU * (Math.abs(value) / total);
      }
      return 0;
    }
    getLabelAndValue(index) {
      const meta = this._cachedMeta;
      const chart = this.chart;
      const labels = chart.data.labels || [];
      const value = formatNumber(meta._parsed[index], chart.options.locale);
      return {
        label: labels[index] || "",
        value
      };
    }
    getMaxBorderWidth(arcs) {
      let max = 0;
      const chart = this.chart;
      let i, ilen, meta, controller, options;
      if (!arcs) {
        for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
          if (chart.isDatasetVisible(i)) {
            meta = chart.getDatasetMeta(i);
            arcs = meta.data;
            controller = meta.controller;
            if (controller !== this) {
              controller.configure();
            }
            break;
          }
        }
      }
      if (!arcs) {
        return 0;
      }
      for (i = 0, ilen = arcs.length; i < ilen; ++i) {
        options = controller.resolveDataElementOptions(i);
        if (options.borderAlign !== "inner") {
          max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
        }
      }
      return max;
    }
    getMaxOffset(arcs) {
      let max = 0;
      for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
        const options = this.resolveDataElementOptions(i);
        max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
      }
      return max;
    }
    _getRingWeightOffset(datasetIndex) {
      let ringWeightOffset = 0;
      for (let i = 0; i < datasetIndex; ++i) {
        if (this.chart.isDatasetVisible(i)) {
          ringWeightOffset += this._getRingWeight(i);
        }
      }
      return ringWeightOffset;
    }
    _getRingWeight(datasetIndex) {
      return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
    }
    _getVisibleDatasetWeightTotal() {
      return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
    }
  };
  DoughnutController.id = "doughnut";
  DoughnutController.defaults = {
    datasetElementType: false,
    dataElementType: "arc",
    animation: {
      animateRotate: true,
      animateScale: false
    },
    animations: {
      numbers: {
        type: "number",
        properties: ["circumference", "endAngle", "innerRadius", "outerRadius", "startAngle", "x", "y", "offset", "borderWidth", "spacing"]
      }
    },
    cutout: "50%",
    rotation: 0,
    circumference: 360,
    radius: "100%",
    spacing: 0,
    indexAxis: "r"
  };
  DoughnutController.descriptors = {
    _scriptable: (name) => name !== "spacing",
    _indexable: (name) => name !== "spacing"
  };
  DoughnutController.overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const { labels: { pointStyle } } = chart.legend.options;
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  pointStyle,
                  hidden: !chart.getDataVisibility(i),
                  index: i
                };
              });
            }
            return [];
          }
        },
        onClick(e, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(tooltipItem) {
            let dataLabel = tooltipItem.label;
            const value = ": " + tooltipItem.formattedValue;
            if (isArray(dataLabel)) {
              dataLabel = dataLabel.slice();
              dataLabel[0] += value;
            } else {
              dataLabel += value;
            }
            return dataLabel;
          }
        }
      }
    }
  };
  var LineController = class extends DatasetController {
    initialize() {
      this.enableOptionSharing = true;
      super.initialize();
    }
    update(mode) {
      const meta = this._cachedMeta;
      const { dataset: line, data: points = [], _dataset } = meta;
      const animationsDisabled = this.chart._animationsDisabled;
      let { start, count } = getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
      this._drawStart = start;
      this._drawCount = count;
      if (scaleRangesChanged(meta)) {
        start = 0;
        count = points.length;
      }
      line._chart = this.chart;
      line._datasetIndex = this.index;
      line._decimated = !!_dataset._decimated;
      line.points = points;
      const options = this.resolveDatasetElementOptions(mode);
      if (!this.options.showLine) {
        options.borderWidth = 0;
      }
      options.segment = this.options.segment;
      this.updateElement(line, void 0, {
        animated: !animationsDisabled,
        options
      }, mode);
      this.updateElements(points, start, count, mode);
    }
    updateElements(points, start, count, mode) {
      const reset = mode === "reset";
      const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
      const firstOpts = this.resolveDataElementOptions(start, mode);
      const sharedOptions = this.getSharedOptions(firstOpts);
      const includeOptions = this.includeOptions(mode, sharedOptions);
      const iAxis = iScale.axis;
      const vAxis = vScale.axis;
      const { spanGaps, segment } = this.options;
      const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
      const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
      let prevParsed = start > 0 && this.getParsed(start - 1);
      for (let i = start; i < start + count; ++i) {
        const point = points[i];
        const parsed = this.getParsed(i);
        const properties = directUpdate ? point : {};
        const nullData = isNullOrUndef(parsed[vAxis]);
        const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
        const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
        properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
        properties.stop = i > 0 && parsed[iAxis] - prevParsed[iAxis] > maxGapLength;
        if (segment) {
          properties.parsed = parsed;
          properties.raw = _dataset.data[i];
        }
        if (includeOptions) {
          properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
        }
        if (!directUpdate) {
          this.updateElement(point, i, properties, mode);
        }
        prevParsed = parsed;
      }
      this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
    getMaxOverflow() {
      const meta = this._cachedMeta;
      const dataset = meta.dataset;
      const border = dataset.options && dataset.options.borderWidth || 0;
      const data = meta.data || [];
      if (!data.length) {
        return border;
      }
      const firstPoint = data[0].size(this.resolveDataElementOptions(0));
      const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
      return Math.max(border, firstPoint, lastPoint) / 2;
    }
    draw() {
      const meta = this._cachedMeta;
      meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
      super.draw();
    }
  };
  LineController.id = "line";
  LineController.defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: true,
    spanGaps: false
  };
  LineController.overrides = {
    scales: {
      _index_: {
        type: "category"
      },
      _value_: {
        type: "linear"
      }
    }
  };
  function getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
    const pointCount = points.length;
    let start = 0;
    let count = pointCount;
    if (meta._sorted) {
      const { iScale, _parsed } = meta;
      const axis = iScale.axis;
      const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
      if (minDefined) {
        start = _limitValue(Math.min(_lookupByKey(_parsed, iScale.axis, min).lo, animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo), 0, pointCount - 1);
      }
      if (maxDefined) {
        count = _limitValue(Math.max(_lookupByKey(_parsed, iScale.axis, max).hi + 1, animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max)).hi + 1), start, pointCount) - start;
      } else {
        count = pointCount - start;
      }
    }
    return { start, count };
  }
  function scaleRangesChanged(meta) {
    const { xScale, yScale, _scaleRanges } = meta;
    const newRanges = {
      xmin: xScale.min,
      xmax: xScale.max,
      ymin: yScale.min,
      ymax: yScale.max
    };
    if (!_scaleRanges) {
      meta._scaleRanges = newRanges;
      return true;
    }
    const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
    Object.assign(_scaleRanges, newRanges);
    return changed;
  }
  var PolarAreaController = class extends DatasetController {
    constructor(chart, datasetIndex) {
      super(chart, datasetIndex);
      this.innerRadius = void 0;
      this.outerRadius = void 0;
    }
    getLabelAndValue(index) {
      const meta = this._cachedMeta;
      const chart = this.chart;
      const labels = chart.data.labels || [];
      const value = formatNumber(meta._parsed[index].r, chart.options.locale);
      return {
        label: labels[index] || "",
        value
      };
    }
    update(mode) {
      const arcs = this._cachedMeta.data;
      this._updateRadius();
      this.updateElements(arcs, 0, arcs.length, mode);
    }
    _updateRadius() {
      const chart = this.chart;
      const chartArea = chart.chartArea;
      const opts = chart.options;
      const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
      const outerRadius = Math.max(minSize / 2, 0);
      const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
      const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
      this.outerRadius = outerRadius - radiusLength * this.index;
      this.innerRadius = this.outerRadius - radiusLength;
    }
    updateElements(arcs, start, count, mode) {
      const reset = mode === "reset";
      const chart = this.chart;
      const dataset = this.getDataset();
      const opts = chart.options;
      const animationOpts = opts.animation;
      const scale = this._cachedMeta.rScale;
      const centerX = scale.xCenter;
      const centerY = scale.yCenter;
      const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
      let angle = datasetStartAngle;
      let i;
      const defaultAngle = 360 / this.countVisibleElements();
      for (i = 0; i < start; ++i) {
        angle += this._computeAngle(i, mode, defaultAngle);
      }
      for (i = start; i < start + count; i++) {
        const arc = arcs[i];
        let startAngle = angle;
        let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
        let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(dataset.data[i]) : 0;
        angle = endAngle;
        if (reset) {
          if (animationOpts.animateScale) {
            outerRadius = 0;
          }
          if (animationOpts.animateRotate) {
            startAngle = endAngle = datasetStartAngle;
          }
        }
        const properties = {
          x: centerX,
          y: centerY,
          innerRadius: 0,
          outerRadius,
          startAngle,
          endAngle,
          options: this.resolveDataElementOptions(i, arc.active ? "active" : mode)
        };
        this.updateElement(arc, i, properties, mode);
      }
    }
    countVisibleElements() {
      const dataset = this.getDataset();
      const meta = this._cachedMeta;
      let count = 0;
      meta.data.forEach((element, index) => {
        if (!isNaN(dataset.data[index]) && this.chart.getDataVisibility(index)) {
          count++;
        }
      });
      return count;
    }
    _computeAngle(index, mode, defaultAngle) {
      return this.chart.getDataVisibility(index) ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
    }
  };
  PolarAreaController.id = "polarArea";
  PolarAreaController.defaults = {
    dataElementType: "arc",
    animation: {
      animateRotate: true,
      animateScale: true
    },
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"]
      }
    },
    indexAxis: "r",
    startAngle: 0
  };
  PolarAreaController.overrides = {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const { labels: { pointStyle } } = chart.legend.options;
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  pointStyle,
                  hidden: !chart.getDataVisibility(i),
                  index: i
                };
              });
            }
            return [];
          }
        },
        onClick(e, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(context) {
            return context.chart.data.labels[context.dataIndex] + ": " + context.formattedValue;
          }
        }
      }
    },
    scales: {
      r: {
        type: "radialLinear",
        angleLines: {
          display: false
        },
        beginAtZero: true,
        grid: {
          circular: true
        },
        pointLabels: {
          display: false
        },
        startAngle: 0
      }
    }
  };
  var PieController = class extends DoughnutController {
  };
  PieController.id = "pie";
  PieController.defaults = {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: "100%"
  };
  var RadarController = class extends DatasetController {
    getLabelAndValue(index) {
      const vScale = this._cachedMeta.vScale;
      const parsed = this.getParsed(index);
      return {
        label: vScale.getLabels()[index],
        value: "" + vScale.getLabelForValue(parsed[vScale.axis])
      };
    }
    update(mode) {
      const meta = this._cachedMeta;
      const line = meta.dataset;
      const points = meta.data || [];
      const labels = meta.iScale.getLabels();
      line.points = points;
      if (mode !== "resize") {
        const options = this.resolveDatasetElementOptions(mode);
        if (!this.options.showLine) {
          options.borderWidth = 0;
        }
        const properties = {
          _loop: true,
          _fullLoop: labels.length === points.length,
          options
        };
        this.updateElement(line, void 0, properties, mode);
      }
      this.updateElements(points, 0, points.length, mode);
    }
    updateElements(points, start, count, mode) {
      const dataset = this.getDataset();
      const scale = this._cachedMeta.rScale;
      const reset = mode === "reset";
      for (let i = start; i < start + count; i++) {
        const point = points[i];
        const options = this.resolveDataElementOptions(i, point.active ? "active" : mode);
        const pointPosition = scale.getPointPositionForValue(i, dataset.data[i]);
        const x = reset ? scale.xCenter : pointPosition.x;
        const y = reset ? scale.yCenter : pointPosition.y;
        const properties = {
          x,
          y,
          angle: pointPosition.angle,
          skip: isNaN(x) || isNaN(y),
          options
        };
        this.updateElement(point, i, properties, mode);
      }
    }
  };
  RadarController.id = "radar";
  RadarController.defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    indexAxis: "r",
    showLine: true,
    elements: {
      line: {
        fill: "start"
      }
    }
  };
  RadarController.overrides = {
    aspectRatio: 1,
    scales: {
      r: {
        type: "radialLinear"
      }
    }
  };
  var ScatterController = class extends LineController {
  };
  ScatterController.id = "scatter";
  ScatterController.defaults = {
    showLine: false,
    fill: false
  };
  ScatterController.overrides = {
    interaction: {
      mode: "point"
    },
    plugins: {
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(item) {
            return "(" + item.label + ", " + item.formattedValue + ")";
          }
        }
      }
    },
    scales: {
      x: {
        type: "linear"
      },
      y: {
        type: "linear"
      }
    }
  };
  var controllers = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PolarAreaController,
    PieController,
    RadarController,
    ScatterController
  });
  function abstract() {
    throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
  }
  var DateAdapter = class {
    constructor(options) {
      this.options = options || {};
    }
    formats() {
      return abstract();
    }
    parse(value, format2) {
      return abstract();
    }
    format(timestamp, format2) {
      return abstract();
    }
    add(timestamp, amount, unit) {
      return abstract();
    }
    diff(a, b, unit) {
      return abstract();
    }
    startOf(timestamp, unit, weekday) {
      return abstract();
    }
    endOf(timestamp, unit) {
      return abstract();
    }
  };
  DateAdapter.override = function(members) {
    Object.assign(DateAdapter.prototype, members);
  };
  var adapters = {
    _date: DateAdapter
  };
  function getRelativePosition2(e, chart) {
    if ("native" in e) {
      return {
        x: e.x,
        y: e.y
      };
    }
    return getRelativePosition(e, chart);
  }
  function evaluateAllVisibleItems(chart, handler) {
    const metasets = chart.getSortedVisibleDatasetMetas();
    let index, data, element;
    for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
      ({ index, data } = metasets[i]);
      for (let j = 0, jlen = data.length; j < jlen; ++j) {
        element = data[j];
        if (!element.skip) {
          handler(element, index, j);
        }
      }
    }
  }
  function binarySearch(metaset, axis, value, intersect) {
    const { controller, data, _sorted } = metaset;
    const iScale = controller._cachedMeta.iScale;
    if (iScale && axis === iScale.axis && _sorted && data.length) {
      const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
      if (!intersect) {
        return lookupMethod(data, axis, value);
      } else if (controller._sharedOptions) {
        const el = data[0];
        const range = typeof el.getRange === "function" && el.getRange(axis);
        if (range) {
          const start = lookupMethod(data, axis, value - range);
          const end = lookupMethod(data, axis, value + range);
          return { lo: start.lo, hi: end.hi };
        }
      }
    }
    return { lo: 0, hi: data.length - 1 };
  }
  function optimizedEvaluateItems(chart, axis, position, handler, intersect) {
    const metasets = chart.getSortedVisibleDatasetMetas();
    const value = position[axis];
    for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
      const { index, data } = metasets[i];
      const { lo, hi } = binarySearch(metasets[i], axis, value, intersect);
      for (let j = lo; j <= hi; ++j) {
        const element = data[j];
        if (!element.skip) {
          handler(element, index, j);
        }
      }
    }
  }
  function getDistanceMetricForAxis(axis) {
    const useX = axis.indexOf("x") !== -1;
    const useY = axis.indexOf("y") !== -1;
    return function(pt1, pt2) {
      const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
      const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
      return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };
  }
  function getIntersectItems(chart, position, axis, useFinalPosition) {
    const items = [];
    if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
      return items;
    }
    const evaluationFunc = function(element, datasetIndex, index) {
      if (element.inRange(position.x, position.y, useFinalPosition)) {
        items.push({ element, datasetIndex, index });
      }
    };
    optimizedEvaluateItems(chart, axis, position, evaluationFunc, true);
    return items;
  }
  function getNearestItems(chart, position, axis, intersect, useFinalPosition) {
    const distanceMetric = getDistanceMetricForAxis(axis);
    let minDistance = Number.POSITIVE_INFINITY;
    let items = [];
    if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
      return items;
    }
    const evaluationFunc = function(element, datasetIndex, index) {
      if (intersect && !element.inRange(position.x, position.y, useFinalPosition)) {
        return;
      }
      const center = element.getCenterPoint(useFinalPosition);
      if (!_isPointInArea(center, chart.chartArea, chart._minPadding) && !element.inRange(position.x, position.y, useFinalPosition)) {
        return;
      }
      const distance = distanceMetric(position, center);
      if (distance < minDistance) {
        items = [{ element, datasetIndex, index }];
        minDistance = distance;
      } else if (distance === minDistance) {
        items.push({ element, datasetIndex, index });
      }
    };
    optimizedEvaluateItems(chart, axis, position, evaluationFunc);
    return items;
  }
  function getAxisItems(chart, e, options, useFinalPosition) {
    const position = getRelativePosition2(e, chart);
    const items = [];
    const axis = options.axis;
    const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
    let intersectsItem = false;
    evaluateAllVisibleItems(chart, (element, datasetIndex, index) => {
      if (element[rangeMethod](position[axis], useFinalPosition)) {
        items.push({ element, datasetIndex, index });
      }
      if (element.inRange(position.x, position.y, useFinalPosition)) {
        intersectsItem = true;
      }
    });
    if (options.intersect && !intersectsItem) {
      return [];
    }
    return items;
  }
  var Interaction = {
    modes: {
      index(chart, e, options, useFinalPosition) {
        const position = getRelativePosition2(e, chart);
        const axis = options.axis || "x";
        const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition) : getNearestItems(chart, position, axis, false, useFinalPosition);
        const elements2 = [];
        if (!items.length) {
          return [];
        }
        chart.getSortedVisibleDatasetMetas().forEach((meta) => {
          const index = items[0].index;
          const element = meta.data[index];
          if (element && !element.skip) {
            elements2.push({ element, datasetIndex: meta.index, index });
          }
        });
        return elements2;
      },
      dataset(chart, e, options, useFinalPosition) {
        const position = getRelativePosition2(e, chart);
        const axis = options.axis || "xy";
        let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition) : getNearestItems(chart, position, axis, false, useFinalPosition);
        if (items.length > 0) {
          const datasetIndex = items[0].datasetIndex;
          const data = chart.getDatasetMeta(datasetIndex).data;
          items = [];
          for (let i = 0; i < data.length; ++i) {
            items.push({ element: data[i], datasetIndex, index: i });
          }
        }
        return items;
      },
      point(chart, e, options, useFinalPosition) {
        const position = getRelativePosition2(e, chart);
        const axis = options.axis || "xy";
        return getIntersectItems(chart, position, axis, useFinalPosition);
      },
      nearest(chart, e, options, useFinalPosition) {
        const position = getRelativePosition2(e, chart);
        const axis = options.axis || "xy";
        return getNearestItems(chart, position, axis, options.intersect, useFinalPosition);
      },
      x(chart, e, options, useFinalPosition) {
        options.axis = "x";
        return getAxisItems(chart, e, options, useFinalPosition);
      },
      y(chart, e, options, useFinalPosition) {
        options.axis = "y";
        return getAxisItems(chart, e, options, useFinalPosition);
      }
    }
  };
  var STATIC_POSITIONS = ["left", "top", "right", "bottom"];
  function filterByPosition(array, position) {
    return array.filter((v) => v.pos === position);
  }
  function filterDynamicPositionByAxis(array, axis) {
    return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
  }
  function sortByWeight(array, reverse) {
    return array.sort((a, b) => {
      const v0 = reverse ? b : a;
      const v1 = reverse ? a : b;
      return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
    });
  }
  function wrapBoxes(boxes) {
    const layoutBoxes = [];
    let i, ilen, box, pos, stack, stackWeight;
    for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
      box = boxes[i];
      ({ position: pos, options: { stack, stackWeight = 1 } } = box);
      layoutBoxes.push({
        index: i,
        box,
        pos,
        horizontal: box.isHorizontal(),
        weight: box.weight,
        stack: stack && pos + stack,
        stackWeight
      });
    }
    return layoutBoxes;
  }
  function buildStacks(layouts2) {
    const stacks = {};
    for (const wrap of layouts2) {
      const { stack, pos, stackWeight } = wrap;
      if (!stack || !STATIC_POSITIONS.includes(pos)) {
        continue;
      }
      const _stack = stacks[stack] || (stacks[stack] = { count: 0, placed: 0, weight: 0, size: 0 });
      _stack.count++;
      _stack.weight += stackWeight;
    }
    return stacks;
  }
  function setLayoutDims(layouts2, params) {
    const stacks = buildStacks(layouts2);
    const { vBoxMaxWidth, hBoxMaxHeight } = params;
    let i, ilen, layout;
    for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
      layout = layouts2[i];
      const { fullSize } = layout.box;
      const stack = stacks[layout.stack];
      const factor = stack && layout.stackWeight / stack.weight;
      if (layout.horizontal) {
        layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
        layout.height = hBoxMaxHeight;
      } else {
        layout.width = vBoxMaxWidth;
        layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
      }
    }
    return stacks;
  }
  function buildLayoutBoxes(boxes) {
    const layoutBoxes = wrapBoxes(boxes);
    const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
    const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
    const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
    const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
    const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
    const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
    const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
    return {
      fullSize,
      leftAndTop: left.concat(top),
      rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
      chartArea: filterByPosition(layoutBoxes, "chartArea"),
      vertical: left.concat(right).concat(centerVertical),
      horizontal: top.concat(bottom).concat(centerHorizontal)
    };
  }
  function getCombinedMax(maxPadding, chartArea, a, b) {
    return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
  }
  function updateMaxPadding(maxPadding, boxPadding) {
    maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
    maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
    maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
    maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
  }
  function updateDims(chartArea, params, layout, stacks) {
    const { pos, box } = layout;
    const maxPadding = chartArea.maxPadding;
    if (!isObject(pos)) {
      if (layout.size) {
        chartArea[pos] -= layout.size;
      }
      const stack = stacks[layout.stack] || { size: 0, count: 1 };
      stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
      layout.size = stack.size / stack.count;
      chartArea[pos] += layout.size;
    }
    if (box.getPadding) {
      updateMaxPadding(maxPadding, box.getPadding());
    }
    const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
    const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
    const widthChanged = newWidth !== chartArea.w;
    const heightChanged = newHeight !== chartArea.h;
    chartArea.w = newWidth;
    chartArea.h = newHeight;
    return layout.horizontal ? { same: widthChanged, other: heightChanged } : { same: heightChanged, other: widthChanged };
  }
  function handleMaxPadding(chartArea) {
    const maxPadding = chartArea.maxPadding;
    function updatePos(pos) {
      const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
      chartArea[pos] += change;
      return change;
    }
    chartArea.y += updatePos("top");
    chartArea.x += updatePos("left");
    updatePos("right");
    updatePos("bottom");
  }
  function getMargins(horizontal, chartArea) {
    const maxPadding = chartArea.maxPadding;
    function marginForPositions(positions2) {
      const margin = { left: 0, top: 0, right: 0, bottom: 0 };
      positions2.forEach((pos) => {
        margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
      });
      return margin;
    }
    return horizontal ? marginForPositions(["left", "right"]) : marginForPositions(["top", "bottom"]);
  }
  function fitBoxes(boxes, chartArea, params, stacks) {
    const refitBoxes = [];
    let i, ilen, layout, box, refit, changed;
    for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
      layout = boxes[i];
      box = layout.box;
      box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
      const { same, other } = updateDims(chartArea, params, layout, stacks);
      refit |= same && refitBoxes.length;
      changed = changed || other;
      if (!box.fullSize) {
        refitBoxes.push(layout);
      }
    }
    return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
  }
  function setBoxDims(box, left, top, width, height) {
    box.top = top;
    box.left = left;
    box.right = left + width;
    box.bottom = top + height;
    box.width = width;
    box.height = height;
  }
  function placeBoxes(boxes, chartArea, params, stacks) {
    const userPadding = params.padding;
    let { x, y } = chartArea;
    for (const layout of boxes) {
      const box = layout.box;
      const stack = stacks[layout.stack] || { count: 1, placed: 0, weight: 1 };
      const weight = layout.stackWeight / stack.weight || 1;
      if (layout.horizontal) {
        const width = chartArea.w * weight;
        const height = stack.size || box.height;
        if (defined(stack.start)) {
          y = stack.start;
        }
        if (box.fullSize) {
          setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
        } else {
          setBoxDims(box, chartArea.left + stack.placed, y, width, height);
        }
        stack.start = y;
        stack.placed += width;
        y = box.bottom;
      } else {
        const height = chartArea.h * weight;
        const width = stack.size || box.width;
        if (defined(stack.start)) {
          x = stack.start;
        }
        if (box.fullSize) {
          setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
        } else {
          setBoxDims(box, x, chartArea.top + stack.placed, width, height);
        }
        stack.start = x;
        stack.placed += height;
        x = box.right;
      }
    }
    chartArea.x = x;
    chartArea.y = y;
  }
  defaults.set("layout", {
    autoPadding: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
  var layouts = {
    addBox(chart, item) {
      if (!chart.boxes) {
        chart.boxes = [];
      }
      item.fullSize = item.fullSize || false;
      item.position = item.position || "top";
      item.weight = item.weight || 0;
      item._layers = item._layers || function() {
        return [{
          z: 0,
          draw(chartArea) {
            item.draw(chartArea);
          }
        }];
      };
      chart.boxes.push(item);
    },
    removeBox(chart, layoutItem) {
      const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
      if (index !== -1) {
        chart.boxes.splice(index, 1);
      }
    },
    configure(chart, item, options) {
      item.fullSize = options.fullSize;
      item.position = options.position;
      item.weight = options.weight;
    },
    update(chart, width, height, minPadding) {
      if (!chart) {
        return;
      }
      const padding = toPadding(chart.options.layout.padding);
      const availableWidth = Math.max(width - padding.width, 0);
      const availableHeight = Math.max(height - padding.height, 0);
      const boxes = buildLayoutBoxes(chart.boxes);
      const verticalBoxes = boxes.vertical;
      const horizontalBoxes = boxes.horizontal;
      each(chart.boxes, (box) => {
        if (typeof box.beforeLayout === "function") {
          box.beforeLayout();
        }
      });
      const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
      const params = Object.freeze({
        outerWidth: width,
        outerHeight: height,
        padding,
        availableWidth,
        availableHeight,
        vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
        hBoxMaxHeight: availableHeight / 2
      });
      const maxPadding = Object.assign({}, padding);
      updateMaxPadding(maxPadding, toPadding(minPadding));
      const chartArea = Object.assign({
        maxPadding,
        w: availableWidth,
        h: availableHeight,
        x: padding.left,
        y: padding.top
      }, padding);
      const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
      fitBoxes(boxes.fullSize, chartArea, params, stacks);
      fitBoxes(verticalBoxes, chartArea, params, stacks);
      if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
        fitBoxes(verticalBoxes, chartArea, params, stacks);
      }
      handleMaxPadding(chartArea);
      placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
      chartArea.x += chartArea.w;
      chartArea.y += chartArea.h;
      placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
      chart.chartArea = {
        left: chartArea.left,
        top: chartArea.top,
        right: chartArea.left + chartArea.w,
        bottom: chartArea.top + chartArea.h,
        height: chartArea.h,
        width: chartArea.w
      };
      each(boxes.chartArea, (layout) => {
        const box = layout.box;
        Object.assign(box, chart.chartArea);
        box.update(chartArea.w, chartArea.h);
      });
    }
  };
  var BasePlatform = class {
    acquireContext(canvas, aspectRatio) {
    }
    releaseContext(context) {
      return false;
    }
    addEventListener(chart, type, listener) {
    }
    removeEventListener(chart, type, listener) {
    }
    getDevicePixelRatio() {
      return 1;
    }
    getMaximumSize(element, width, height, aspectRatio) {
      width = Math.max(0, width || element.width);
      height = height || element.height;
      return {
        width,
        height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
      };
    }
    isAttached(canvas) {
      return true;
    }
    updateConfig(config) {
    }
  };
  var BasicPlatform = class extends BasePlatform {
    acquireContext(item) {
      return item && item.getContext && item.getContext("2d") || null;
    }
    updateConfig(config) {
      config.options.animation = false;
    }
  };
  var EXPANDO_KEY = "$chartjs";
  var EVENT_TYPES = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup",
    pointerenter: "mouseenter",
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointerleave: "mouseout",
    pointerout: "mouseout"
  };
  var isNullOrEmpty = (value) => value === null || value === "";
  function initCanvas(canvas, aspectRatio) {
    const style = canvas.style;
    const renderHeight = canvas.getAttribute("height");
    const renderWidth = canvas.getAttribute("width");
    canvas[EXPANDO_KEY] = {
      initial: {
        height: renderHeight,
        width: renderWidth,
        style: {
          display: style.display,
          height: style.height,
          width: style.width
        }
      }
    };
    style.display = style.display || "block";
    style.boxSizing = style.boxSizing || "border-box";
    if (isNullOrEmpty(renderWidth)) {
      const displayWidth = readUsedSize(canvas, "width");
      if (displayWidth !== void 0) {
        canvas.width = displayWidth;
      }
    }
    if (isNullOrEmpty(renderHeight)) {
      if (canvas.style.height === "") {
        canvas.height = canvas.width / (aspectRatio || 2);
      } else {
        const displayHeight = readUsedSize(canvas, "height");
        if (displayHeight !== void 0) {
          canvas.height = displayHeight;
        }
      }
    }
    return canvas;
  }
  var eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;
  function addListener(node, type, listener) {
    node.addEventListener(type, listener, eventListenerOptions);
  }
  function removeListener(chart, type, listener) {
    chart.canvas.removeEventListener(type, listener, eventListenerOptions);
  }
  function fromNativeEvent(event, chart) {
    const type = EVENT_TYPES[event.type] || event.type;
    const { x, y } = getRelativePosition(event, chart);
    return {
      type,
      chart,
      native: event,
      x: x !== void 0 ? x : null,
      y: y !== void 0 ? y : null
    };
  }
  function createAttachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const node of entry.addedNodes) {
          if (node === canvas || node.contains(canvas)) {
            return listener();
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
    return observer;
  }
  function createDetachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const node of entry.removedNodes) {
          if (node === canvas || node.contains(canvas)) {
            return listener();
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
    return observer;
  }
  var drpListeningCharts = new Map();
  var oldDevicePixelRatio = 0;
  function onWindowResize() {
    const dpr = window.devicePixelRatio;
    if (dpr === oldDevicePixelRatio) {
      return;
    }
    oldDevicePixelRatio = dpr;
    drpListeningCharts.forEach((resize, chart) => {
      if (chart.currentDevicePixelRatio !== dpr) {
        resize();
      }
    });
  }
  function listenDevicePixelRatioChanges(chart, resize) {
    if (!drpListeningCharts.size) {
      window.addEventListener("resize", onWindowResize);
    }
    drpListeningCharts.set(chart, resize);
  }
  function unlistenDevicePixelRatioChanges(chart) {
    drpListeningCharts.delete(chart);
    if (!drpListeningCharts.size) {
      window.removeEventListener("resize", onWindowResize);
    }
  }
  function createResizeObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const container = canvas && _getParentNode(canvas);
    if (!container) {
      return;
    }
    const resize = throttled((width, height) => {
      const w = container.clientWidth;
      listener(width, height);
      if (w < container.clientWidth) {
        listener();
      }
    }, window);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (width === 0 && height === 0) {
        return;
      }
      resize(width, height);
    });
    observer.observe(container);
    listenDevicePixelRatioChanges(chart, resize);
    return observer;
  }
  function releaseObserver(chart, type, observer) {
    if (observer) {
      observer.disconnect();
    }
    if (type === "resize") {
      unlistenDevicePixelRatioChanges(chart);
    }
  }
  function createProxyAndListen(chart, type, listener) {
    const canvas = chart.canvas;
    const proxy = throttled((event) => {
      if (chart.ctx !== null) {
        listener(fromNativeEvent(event, chart));
      }
    }, chart, (args) => {
      const event = args[0];
      return [event, event.offsetX, event.offsetY];
    });
    addListener(canvas, type, proxy);
    return proxy;
  }
  var DomPlatform = class extends BasePlatform {
    acquireContext(canvas, aspectRatio) {
      const context = canvas && canvas.getContext && canvas.getContext("2d");
      if (context && context.canvas === canvas) {
        initCanvas(canvas, aspectRatio);
        return context;
      }
      return null;
    }
    releaseContext(context) {
      const canvas = context.canvas;
      if (!canvas[EXPANDO_KEY]) {
        return false;
      }
      const initial = canvas[EXPANDO_KEY].initial;
      ["height", "width"].forEach((prop) => {
        const value = initial[prop];
        if (isNullOrUndef(value)) {
          canvas.removeAttribute(prop);
        } else {
          canvas.setAttribute(prop, value);
        }
      });
      const style = initial.style || {};
      Object.keys(style).forEach((key) => {
        canvas.style[key] = style[key];
      });
      canvas.width = canvas.width;
      delete canvas[EXPANDO_KEY];
      return true;
    }
    addEventListener(chart, type, listener) {
      this.removeEventListener(chart, type);
      const proxies = chart.$proxies || (chart.$proxies = {});
      const handlers = {
        attach: createAttachObserver,
        detach: createDetachObserver,
        resize: createResizeObserver
      };
      const handler = handlers[type] || createProxyAndListen;
      proxies[type] = handler(chart, type, listener);
    }
    removeEventListener(chart, type) {
      const proxies = chart.$proxies || (chart.$proxies = {});
      const proxy = proxies[type];
      if (!proxy) {
        return;
      }
      const handlers = {
        attach: releaseObserver,
        detach: releaseObserver,
        resize: releaseObserver
      };
      const handler = handlers[type] || removeListener;
      handler(chart, type, proxy);
      proxies[type] = void 0;
    }
    getDevicePixelRatio() {
      return window.devicePixelRatio;
    }
    getMaximumSize(canvas, width, height, aspectRatio) {
      return getMaximumSize(canvas, width, height, aspectRatio);
    }
    isAttached(canvas) {
      const container = _getParentNode(canvas);
      return !!(container && container.isConnected);
    }
  };
  function _detectPlatform(canvas) {
    if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
      return BasicPlatform;
    }
    return DomPlatform;
  }
  var Element = class {
    constructor() {
      this.x = void 0;
      this.y = void 0;
      this.active = false;
      this.options = void 0;
      this.$animations = void 0;
    }
    tooltipPosition(useFinalPosition) {
      const { x, y } = this.getProps(["x", "y"], useFinalPosition);
      return { x, y };
    }
    hasValue() {
      return isNumber(this.x) && isNumber(this.y);
    }
    getProps(props, final) {
      const anims = this.$animations;
      if (!final || !anims) {
        return this;
      }
      const ret = {};
      props.forEach((prop) => {
        ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
      });
      return ret;
    }
  };
  Element.defaults = {};
  Element.defaultRoutes = void 0;
  var formatters = {
    values(value) {
      return isArray(value) ? value : "" + value;
    },
    numeric(tickValue, index, ticks) {
      if (tickValue === 0) {
        return "0";
      }
      const locale2 = this.chart.options.locale;
      let notation;
      let delta = tickValue;
      if (ticks.length > 1) {
        const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
        if (maxTick < 1e-4 || maxTick > 1e15) {
          notation = "scientific";
        }
        delta = calculateDelta(tickValue, ticks);
      }
      const logDelta = log10(Math.abs(delta));
      const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
      const options = { notation, minimumFractionDigits: numDecimal, maximumFractionDigits: numDecimal };
      Object.assign(options, this.options.ticks.format);
      return formatNumber(tickValue, locale2, options);
    },
    logarithmic(tickValue, index, ticks) {
      if (tickValue === 0) {
        return "0";
      }
      const remain = tickValue / Math.pow(10, Math.floor(log10(tickValue)));
      if (remain === 1 || remain === 2 || remain === 5) {
        return formatters.numeric.call(this, tickValue, index, ticks);
      }
      return "";
    }
  };
  function calculateDelta(tickValue, ticks) {
    let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
    if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
      delta = tickValue - Math.floor(tickValue);
    }
    return delta;
  }
  var Ticks = { formatters };
  defaults.set("scale", {
    display: true,
    offset: false,
    reverse: false,
    beginAtZero: false,
    bounds: "ticks",
    grace: 0,
    grid: {
      display: true,
      lineWidth: 1,
      drawBorder: true,
      drawOnChartArea: true,
      drawTicks: true,
      tickLength: 8,
      tickWidth: (_ctx, options) => options.lineWidth,
      tickColor: (_ctx, options) => options.color,
      offset: false,
      borderDash: [],
      borderDashOffset: 0,
      borderWidth: 1
    },
    title: {
      display: false,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: true,
      autoSkip: true,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ticks.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: false,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  });
  defaults.route("scale.ticks", "color", "", "color");
  defaults.route("scale.grid", "color", "", "borderColor");
  defaults.route("scale.grid", "borderColor", "", "borderColor");
  defaults.route("scale.title", "color", "", "color");
  defaults.describe("scale", {
    _fallback: false,
    _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
    _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash"
  });
  defaults.describe("scales", {
    _fallback: "scale"
  });
  defaults.describe("scale.ticks", {
    _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
    _indexable: (name) => name !== "backdropPadding"
  });
  function autoSkip(scale, ticks) {
    const tickOpts = scale.options.ticks;
    const ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale);
    const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
    const numMajorIndices = majorIndices.length;
    const first = majorIndices[0];
    const last = majorIndices[numMajorIndices - 1];
    const newTicks = [];
    if (numMajorIndices > ticksLimit) {
      skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
      return newTicks;
    }
    const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
    if (numMajorIndices > 0) {
      let i, ilen;
      const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
      skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
      for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
        skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
      }
      skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
      return newTicks;
    }
    skip(ticks, newTicks, spacing);
    return newTicks;
  }
  function determineMaxTicks(scale) {
    const offset = scale.options.offset;
    const tickLength = scale._tickSize();
    const maxScale = scale._length / tickLength + (offset ? 0 : 1);
    const maxChart = scale._maxLength / tickLength;
    return Math.floor(Math.min(maxScale, maxChart));
  }
  function calculateSpacing(majorIndices, ticks, ticksLimit) {
    const evenMajorSpacing = getEvenSpacing(majorIndices);
    const spacing = ticks.length / ticksLimit;
    if (!evenMajorSpacing) {
      return Math.max(spacing, 1);
    }
    const factors = _factorize(evenMajorSpacing);
    for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
      const factor = factors[i];
      if (factor > spacing) {
        return factor;
      }
    }
    return Math.max(spacing, 1);
  }
  function getMajorIndices(ticks) {
    const result = [];
    let i, ilen;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      if (ticks[i].major) {
        result.push(i);
      }
    }
    return result;
  }
  function skipMajors(ticks, newTicks, majorIndices, spacing) {
    let count = 0;
    let next = majorIndices[0];
    let i;
    spacing = Math.ceil(spacing);
    for (i = 0; i < ticks.length; i++) {
      if (i === next) {
        newTicks.push(ticks[i]);
        count++;
        next = majorIndices[count * spacing];
      }
    }
  }
  function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    const start = valueOrDefault(majorStart, 0);
    const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
    let count = 0;
    let length, i, next;
    spacing = Math.ceil(spacing);
    if (majorEnd) {
      length = majorEnd - majorStart;
      spacing = length / Math.floor(length / spacing);
    }
    next = start;
    while (next < 0) {
      count++;
      next = Math.round(start + count * spacing);
    }
    for (i = Math.max(start, 0); i < end; i++) {
      if (i === next) {
        newTicks.push(ticks[i]);
        count++;
        next = Math.round(start + count * spacing);
      }
    }
  }
  function getEvenSpacing(arr) {
    const len = arr.length;
    let i, diff;
    if (len < 2) {
      return false;
    }
    for (diff = arr[0], i = 1; i < len; ++i) {
      if (arr[i] - arr[i - 1] !== diff) {
        return false;
      }
    }
    return diff;
  }
  var reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
  var offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
  function sample(arr, numItems) {
    const result = [];
    const increment = arr.length / numItems;
    const len = arr.length;
    let i = 0;
    for (; i < len; i += increment) {
      result.push(arr[Math.floor(i)]);
    }
    return result;
  }
  function getPixelForGridLine(scale, index, offsetGridLines) {
    const length = scale.ticks.length;
    const validIndex2 = Math.min(index, length - 1);
    const start = scale._startPixel;
    const end = scale._endPixel;
    const epsilon = 1e-6;
    let lineValue = scale.getPixelForTick(validIndex2);
    let offset;
    if (offsetGridLines) {
      if (length === 1) {
        offset = Math.max(lineValue - start, end - lineValue);
      } else if (index === 0) {
        offset = (scale.getPixelForTick(1) - lineValue) / 2;
      } else {
        offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
      }
      lineValue += validIndex2 < index ? offset : -offset;
      if (lineValue < start - epsilon || lineValue > end + epsilon) {
        return;
      }
    }
    return lineValue;
  }
  function garbageCollect(caches, length) {
    each(caches, (cache) => {
      const gc = cache.gc;
      const gcLen = gc.length / 2;
      let i;
      if (gcLen > length) {
        for (i = 0; i < gcLen; ++i) {
          delete cache.data[gc[i]];
        }
        gc.splice(0, gcLen);
      }
    });
  }
  function getTickMarkLength(options) {
    return options.drawTicks ? options.tickLength : 0;
  }
  function getTitleHeight(options, fallback) {
    if (!options.display) {
      return 0;
    }
    const font = toFont(options.font, fallback);
    const padding = toPadding(options.padding);
    const lines = isArray(options.text) ? options.text.length : 1;
    return lines * font.lineHeight + padding.height;
  }
  function createScaleContext(parent, scale) {
    return createContext(parent, {
      scale,
      type: "scale"
    });
  }
  function createTickContext(parent, index, tick) {
    return createContext(parent, {
      tick,
      index,
      type: "tick"
    });
  }
  function titleAlign(align, position, reverse) {
    let ret = _toLeftRightCenter(align);
    if (reverse && position !== "right" || !reverse && position === "right") {
      ret = reverseAlign(ret);
    }
    return ret;
  }
  function titleArgs(scale, offset, position, align) {
    const { top, left, bottom, right, chart } = scale;
    const { chartArea, scales: scales2 } = chart;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    const height = bottom - top;
    const width = right - left;
    if (scale.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        titleY = scales2[positionAxisID].getPixelForValue(value) + height - offset;
      } else if (position === "center") {
        titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
      } else {
        titleY = offsetFromEdge(scale, position, offset);
      }
      maxWidth = right - left;
    } else {
      if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        titleX = scales2[positionAxisID].getPixelForValue(value) - width + offset;
      } else if (position === "center") {
        titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
      } else {
        titleX = offsetFromEdge(scale, position, offset);
      }
      titleY = _alignStartEnd(align, bottom, top);
      rotation = position === "left" ? -HALF_PI : HALF_PI;
    }
    return { titleX, titleY, maxWidth, rotation };
  }
  var Scale = class extends Element {
    constructor(cfg) {
      super();
      this.id = cfg.id;
      this.type = cfg.type;
      this.options = void 0;
      this.ctx = cfg.ctx;
      this.chart = cfg.chart;
      this.top = void 0;
      this.bottom = void 0;
      this.left = void 0;
      this.right = void 0;
      this.width = void 0;
      this.height = void 0;
      this._margins = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      this.maxWidth = void 0;
      this.maxHeight = void 0;
      this.paddingTop = void 0;
      this.paddingBottom = void 0;
      this.paddingLeft = void 0;
      this.paddingRight = void 0;
      this.axis = void 0;
      this.labelRotation = void 0;
      this.min = void 0;
      this.max = void 0;
      this._range = void 0;
      this.ticks = [];
      this._gridLineItems = null;
      this._labelItems = null;
      this._labelSizes = null;
      this._length = 0;
      this._maxLength = 0;
      this._longestTextCache = {};
      this._startPixel = void 0;
      this._endPixel = void 0;
      this._reversePixels = false;
      this._userMax = void 0;
      this._userMin = void 0;
      this._suggestedMax = void 0;
      this._suggestedMin = void 0;
      this._ticksLength = 0;
      this._borderValue = 0;
      this._cache = {};
      this._dataLimitsCached = false;
      this.$context = void 0;
    }
    init(options) {
      this.options = options.setContext(this.getContext());
      this.axis = options.axis;
      this._userMin = this.parse(options.min);
      this._userMax = this.parse(options.max);
      this._suggestedMin = this.parse(options.suggestedMin);
      this._suggestedMax = this.parse(options.suggestedMax);
    }
    parse(raw, index) {
      return raw;
    }
    getUserBounds() {
      let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
      _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
      _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
      _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
      _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
      return {
        min: finiteOrDefault(_userMin, _suggestedMin),
        max: finiteOrDefault(_userMax, _suggestedMax),
        minDefined: isNumberFinite(_userMin),
        maxDefined: isNumberFinite(_userMax)
      };
    }
    getMinMax(canStack) {
      let { min, max, minDefined, maxDefined } = this.getUserBounds();
      let range;
      if (minDefined && maxDefined) {
        return { min, max };
      }
      const metas = this.getMatchingVisibleMetas();
      for (let i = 0, ilen = metas.length; i < ilen; ++i) {
        range = metas[i].controller.getMinMax(this, canStack);
        if (!minDefined) {
          min = Math.min(min, range.min);
        }
        if (!maxDefined) {
          max = Math.max(max, range.max);
        }
      }
      min = maxDefined && min > max ? max : min;
      max = minDefined && min > max ? min : max;
      return {
        min: finiteOrDefault(min, finiteOrDefault(max, min)),
        max: finiteOrDefault(max, finiteOrDefault(min, max))
      };
    }
    getPadding() {
      return {
        left: this.paddingLeft || 0,
        top: this.paddingTop || 0,
        right: this.paddingRight || 0,
        bottom: this.paddingBottom || 0
      };
    }
    getTicks() {
      return this.ticks;
    }
    getLabels() {
      const data = this.chart.data;
      return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
    }
    beforeLayout() {
      this._cache = {};
      this._dataLimitsCached = false;
    }
    beforeUpdate() {
      callback(this.options.beforeUpdate, [this]);
    }
    update(maxWidth, maxHeight, margins) {
      const { beginAtZero, grace, ticks: tickOpts } = this.options;
      const sampleSize = tickOpts.sampleSize;
      this.beforeUpdate();
      this.maxWidth = maxWidth;
      this.maxHeight = maxHeight;
      this._margins = margins = Object.assign({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }, margins);
      this.ticks = null;
      this._labelSizes = null;
      this._gridLineItems = null;
      this._labelItems = null;
      this.beforeSetDimensions();
      this.setDimensions();
      this.afterSetDimensions();
      this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
      if (!this._dataLimitsCached) {
        this.beforeDataLimits();
        this.determineDataLimits();
        this.afterDataLimits();
        this._range = _addGrace(this, grace, beginAtZero);
        this._dataLimitsCached = true;
      }
      this.beforeBuildTicks();
      this.ticks = this.buildTicks() || [];
      this.afterBuildTicks();
      const samplingEnabled = sampleSize < this.ticks.length;
      this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
      this.configure();
      this.beforeCalculateLabelRotation();
      this.calculateLabelRotation();
      this.afterCalculateLabelRotation();
      if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
        this.ticks = autoSkip(this, this.ticks);
        this._labelSizes = null;
      }
      if (samplingEnabled) {
        this._convertTicksToLabels(this.ticks);
      }
      this.beforeFit();
      this.fit();
      this.afterFit();
      this.afterUpdate();
    }
    configure() {
      let reversePixels = this.options.reverse;
      let startPixel, endPixel;
      if (this.isHorizontal()) {
        startPixel = this.left;
        endPixel = this.right;
      } else {
        startPixel = this.top;
        endPixel = this.bottom;
        reversePixels = !reversePixels;
      }
      this._startPixel = startPixel;
      this._endPixel = endPixel;
      this._reversePixels = reversePixels;
      this._length = endPixel - startPixel;
      this._alignToPixels = this.options.alignToPixels;
    }
    afterUpdate() {
      callback(this.options.afterUpdate, [this]);
    }
    beforeSetDimensions() {
      callback(this.options.beforeSetDimensions, [this]);
    }
    setDimensions() {
      if (this.isHorizontal()) {
        this.width = this.maxWidth;
        this.left = 0;
        this.right = this.width;
      } else {
        this.height = this.maxHeight;
        this.top = 0;
        this.bottom = this.height;
      }
      this.paddingLeft = 0;
      this.paddingTop = 0;
      this.paddingRight = 0;
      this.paddingBottom = 0;
    }
    afterSetDimensions() {
      callback(this.options.afterSetDimensions, [this]);
    }
    _callHooks(name) {
      this.chart.notifyPlugins(name, this.getContext());
      callback(this.options[name], [this]);
    }
    beforeDataLimits() {
      this._callHooks("beforeDataLimits");
    }
    determineDataLimits() {
    }
    afterDataLimits() {
      this._callHooks("afterDataLimits");
    }
    beforeBuildTicks() {
      this._callHooks("beforeBuildTicks");
    }
    buildTicks() {
      return [];
    }
    afterBuildTicks() {
      this._callHooks("afterBuildTicks");
    }
    beforeTickToLabelConversion() {
      callback(this.options.beforeTickToLabelConversion, [this]);
    }
    generateTickLabels(ticks) {
      const tickOpts = this.options.ticks;
      let i, ilen, tick;
      for (i = 0, ilen = ticks.length; i < ilen; i++) {
        tick = ticks[i];
        tick.label = callback(tickOpts.callback, [tick.value, i, ticks], this);
      }
    }
    afterTickToLabelConversion() {
      callback(this.options.afterTickToLabelConversion, [this]);
    }
    beforeCalculateLabelRotation() {
      callback(this.options.beforeCalculateLabelRotation, [this]);
    }
    calculateLabelRotation() {
      const options = this.options;
      const tickOpts = options.ticks;
      const numTicks = this.ticks.length;
      const minRotation = tickOpts.minRotation || 0;
      const maxRotation = tickOpts.maxRotation;
      let labelRotation = minRotation;
      let tickWidth, maxHeight, maxLabelDiagonal;
      if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
        this.labelRotation = minRotation;
        return;
      }
      const labelSizes = this._getLabelSizes();
      const maxLabelWidth = labelSizes.widest.width;
      const maxLabelHeight = labelSizes.highest.height;
      const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
      tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
      if (maxLabelWidth + 6 > tickWidth) {
        tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
        maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
        maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
        labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
        labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
      }
      this.labelRotation = labelRotation;
    }
    afterCalculateLabelRotation() {
      callback(this.options.afterCalculateLabelRotation, [this]);
    }
    beforeFit() {
      callback(this.options.beforeFit, [this]);
    }
    fit() {
      const minSize = {
        width: 0,
        height: 0
      };
      const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
      const display = this._isVisible();
      const isHorizontal = this.isHorizontal();
      if (display) {
        const titleHeight = getTitleHeight(titleOpts, chart.options.font);
        if (isHorizontal) {
          minSize.width = this.maxWidth;
          minSize.height = getTickMarkLength(gridOpts) + titleHeight;
        } else {
          minSize.height = this.maxHeight;
          minSize.width = getTickMarkLength(gridOpts) + titleHeight;
        }
        if (tickOpts.display && this.ticks.length) {
          const { first, last, widest, highest } = this._getLabelSizes();
          const tickPadding = tickOpts.padding * 2;
          const angleRadians = toRadians(this.labelRotation);
          const cos = Math.cos(angleRadians);
          const sin = Math.sin(angleRadians);
          if (isHorizontal) {
            const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
            minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
          } else {
            const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
            minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
          }
          this._calculatePadding(first, last, sin, cos);
        }
      }
      this._handleMargins();
      if (isHorizontal) {
        this.width = this._length = chart.width - this._margins.left - this._margins.right;
        this.height = minSize.height;
      } else {
        this.width = minSize.width;
        this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
      }
    }
    _calculatePadding(first, last, sin, cos) {
      const { ticks: { align, padding }, position } = this.options;
      const isRotated = this.labelRotation !== 0;
      const labelsBelowTicks = position !== "top" && this.axis === "x";
      if (this.isHorizontal()) {
        const offsetLeft = this.getPixelForTick(0) - this.left;
        const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
        let paddingLeft = 0;
        let paddingRight = 0;
        if (isRotated) {
          if (labelsBelowTicks) {
            paddingLeft = cos * first.width;
            paddingRight = sin * last.height;
          } else {
            paddingLeft = sin * first.height;
            paddingRight = cos * last.width;
          }
        } else if (align === "start") {
          paddingRight = last.width;
        } else if (align === "end") {
          paddingLeft = first.width;
        } else {
          paddingLeft = first.width / 2;
          paddingRight = last.width / 2;
        }
        this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
        this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
      } else {
        let paddingTop = last.height / 2;
        let paddingBottom = first.height / 2;
        if (align === "start") {
          paddingTop = 0;
          paddingBottom = first.height;
        } else if (align === "end") {
          paddingTop = last.height;
          paddingBottom = 0;
        }
        this.paddingTop = paddingTop + padding;
        this.paddingBottom = paddingBottom + padding;
      }
    }
    _handleMargins() {
      if (this._margins) {
        this._margins.left = Math.max(this.paddingLeft, this._margins.left);
        this._margins.top = Math.max(this.paddingTop, this._margins.top);
        this._margins.right = Math.max(this.paddingRight, this._margins.right);
        this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
      }
    }
    afterFit() {
      callback(this.options.afterFit, [this]);
    }
    isHorizontal() {
      const { axis, position } = this.options;
      return position === "top" || position === "bottom" || axis === "x";
    }
    isFullSize() {
      return this.options.fullSize;
    }
    _convertTicksToLabels(ticks) {
      this.beforeTickToLabelConversion();
      this.generateTickLabels(ticks);
      let i, ilen;
      for (i = 0, ilen = ticks.length; i < ilen; i++) {
        if (isNullOrUndef(ticks[i].label)) {
          ticks.splice(i, 1);
          ilen--;
          i--;
        }
      }
      this.afterTickToLabelConversion();
    }
    _getLabelSizes() {
      let labelSizes = this._labelSizes;
      if (!labelSizes) {
        const sampleSize = this.options.ticks.sampleSize;
        let ticks = this.ticks;
        if (sampleSize < ticks.length) {
          ticks = sample(ticks, sampleSize);
        }
        this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length);
      }
      return labelSizes;
    }
    _computeLabelSizes(ticks, length) {
      const { ctx: ctx2, _longestTextCache: caches } = this;
      const widths = [];
      const heights = [];
      let widestLabelSize = 0;
      let highestLabelSize = 0;
      let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
      for (i = 0; i < length; ++i) {
        label = ticks[i].label;
        tickFont = this._resolveTickFontOptions(i);
        ctx2.font = fontString = tickFont.string;
        cache = caches[fontString] = caches[fontString] || { data: {}, gc: [] };
        lineHeight = tickFont.lineHeight;
        width = height = 0;
        if (!isNullOrUndef(label) && !isArray(label)) {
          width = _measureText(ctx2, cache.data, cache.gc, width, label);
          height = lineHeight;
        } else if (isArray(label)) {
          for (j = 0, jlen = label.length; j < jlen; ++j) {
            nestedLabel = label[j];
            if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
              width = _measureText(ctx2, cache.data, cache.gc, width, nestedLabel);
              height += lineHeight;
            }
          }
        }
        widths.push(width);
        heights.push(height);
        widestLabelSize = Math.max(width, widestLabelSize);
        highestLabelSize = Math.max(height, highestLabelSize);
      }
      garbageCollect(caches, length);
      const widest = widths.indexOf(widestLabelSize);
      const highest = heights.indexOf(highestLabelSize);
      const valueAt = (idx) => ({ width: widths[idx] || 0, height: heights[idx] || 0 });
      return {
        first: valueAt(0),
        last: valueAt(length - 1),
        widest: valueAt(widest),
        highest: valueAt(highest),
        widths,
        heights
      };
    }
    getLabelForValue(value) {
      return value;
    }
    getPixelForValue(value, index) {
      return NaN;
    }
    getValueForPixel(pixel) {
    }
    getPixelForTick(index) {
      const ticks = this.ticks;
      if (index < 0 || index > ticks.length - 1) {
        return null;
      }
      return this.getPixelForValue(ticks[index].value);
    }
    getPixelForDecimal(decimal) {
      if (this._reversePixels) {
        decimal = 1 - decimal;
      }
      const pixel = this._startPixel + decimal * this._length;
      return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
    }
    getDecimalForPixel(pixel) {
      const decimal = (pixel - this._startPixel) / this._length;
      return this._reversePixels ? 1 - decimal : decimal;
    }
    getBasePixel() {
      return this.getPixelForValue(this.getBaseValue());
    }
    getBaseValue() {
      const { min, max } = this;
      return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
    }
    getContext(index) {
      const ticks = this.ticks || [];
      if (index >= 0 && index < ticks.length) {
        const tick = ticks[index];
        return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
      }
      return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
    }
    _tickSize() {
      const optionTicks = this.options.ticks;
      const rot = toRadians(this.labelRotation);
      const cos = Math.abs(Math.cos(rot));
      const sin = Math.abs(Math.sin(rot));
      const labelSizes = this._getLabelSizes();
      const padding = optionTicks.autoSkipPadding || 0;
      const w = labelSizes ? labelSizes.widest.width + padding : 0;
      const h = labelSizes ? labelSizes.highest.height + padding : 0;
      return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
    }
    _isVisible() {
      const display = this.options.display;
      if (display !== "auto") {
        return !!display;
      }
      return this.getMatchingVisibleMetas().length > 0;
    }
    _computeGridLineItems(chartArea) {
      const axis = this.axis;
      const chart = this.chart;
      const options = this.options;
      const { grid, position } = options;
      const offset = grid.offset;
      const isHorizontal = this.isHorizontal();
      const ticks = this.ticks;
      const ticksLength = ticks.length + (offset ? 1 : 0);
      const tl = getTickMarkLength(grid);
      const items = [];
      const borderOpts = grid.setContext(this.getContext());
      const axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0;
      const axisHalfWidth = axisWidth / 2;
      const alignBorderValue = function(pixel) {
        return _alignPixel(chart, pixel, axisWidth);
      };
      let borderValue, i, lineValue, alignedLineValue;
      let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
      if (position === "top") {
        borderValue = alignBorderValue(this.bottom);
        ty1 = this.bottom - tl;
        ty2 = borderValue - axisHalfWidth;
        y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
        y2 = chartArea.bottom;
      } else if (position === "bottom") {
        borderValue = alignBorderValue(this.top);
        y1 = chartArea.top;
        y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
        ty1 = borderValue + axisHalfWidth;
        ty2 = this.top + tl;
      } else if (position === "left") {
        borderValue = alignBorderValue(this.right);
        tx1 = this.right - tl;
        tx2 = borderValue - axisHalfWidth;
        x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
        x2 = chartArea.right;
      } else if (position === "right") {
        borderValue = alignBorderValue(this.left);
        x1 = chartArea.left;
        x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
        tx1 = borderValue + axisHalfWidth;
        tx2 = this.left + tl;
      } else if (axis === "x") {
        if (position === "center") {
          borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
        } else if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
        }
        y1 = chartArea.top;
        y2 = chartArea.bottom;
        ty1 = borderValue + axisHalfWidth;
        ty2 = ty1 + tl;
      } else if (axis === "y") {
        if (position === "center") {
          borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
        } else if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
        }
        tx1 = borderValue - axisHalfWidth;
        tx2 = tx1 - tl;
        x1 = chartArea.left;
        x2 = chartArea.right;
      }
      const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
      const step = Math.max(1, Math.ceil(ticksLength / limit));
      for (i = 0; i < ticksLength; i += step) {
        const optsAtIndex = grid.setContext(this.getContext(i));
        const lineWidth = optsAtIndex.lineWidth;
        const lineColor = optsAtIndex.color;
        const borderDash = grid.borderDash || [];
        const borderDashOffset = optsAtIndex.borderDashOffset;
        const tickWidth = optsAtIndex.tickWidth;
        const tickColor = optsAtIndex.tickColor;
        const tickBorderDash = optsAtIndex.tickBorderDash || [];
        const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
        lineValue = getPixelForGridLine(this, i, offset);
        if (lineValue === void 0) {
          continue;
        }
        alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
        if (isHorizontal) {
          tx1 = tx2 = x1 = x2 = alignedLineValue;
        } else {
          ty1 = ty2 = y1 = y2 = alignedLineValue;
        }
        items.push({
          tx1,
          ty1,
          tx2,
          ty2,
          x1,
          y1,
          x2,
          y2,
          width: lineWidth,
          color: lineColor,
          borderDash,
          borderDashOffset,
          tickWidth,
          tickColor,
          tickBorderDash,
          tickBorderDashOffset
        });
      }
      this._ticksLength = ticksLength;
      this._borderValue = borderValue;
      return items;
    }
    _computeLabelItems(chartArea) {
      const axis = this.axis;
      const options = this.options;
      const { position, ticks: optionTicks } = options;
      const isHorizontal = this.isHorizontal();
      const ticks = this.ticks;
      const { align, crossAlign, padding, mirror } = optionTicks;
      const tl = getTickMarkLength(options.grid);
      const tickAndPadding = tl + padding;
      const hTickAndPadding = mirror ? -padding : tickAndPadding;
      const rotation = -toRadians(this.labelRotation);
      const items = [];
      let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
      let textBaseline = "middle";
      if (position === "top") {
        y = this.bottom - hTickAndPadding;
        textAlign = this._getXAxisLabelAlignment();
      } else if (position === "bottom") {
        y = this.top + hTickAndPadding;
        textAlign = this._getXAxisLabelAlignment();
      } else if (position === "left") {
        const ret = this._getYAxisLabelAlignment(tl);
        textAlign = ret.textAlign;
        x = ret.x;
      } else if (position === "right") {
        const ret = this._getYAxisLabelAlignment(tl);
        textAlign = ret.textAlign;
        x = ret.x;
      } else if (axis === "x") {
        if (position === "center") {
          y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
        } else if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
        }
        textAlign = this._getXAxisLabelAlignment();
      } else if (axis === "y") {
        if (position === "center") {
          x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
        } else if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          x = this.chart.scales[positionAxisID].getPixelForValue(value);
        }
        textAlign = this._getYAxisLabelAlignment(tl).textAlign;
      }
      if (axis === "y") {
        if (align === "start") {
          textBaseline = "top";
        } else if (align === "end") {
          textBaseline = "bottom";
        }
      }
      const labelSizes = this._getLabelSizes();
      for (i = 0, ilen = ticks.length; i < ilen; ++i) {
        tick = ticks[i];
        label = tick.label;
        const optsAtIndex = optionTicks.setContext(this.getContext(i));
        pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
        font = this._resolveTickFontOptions(i);
        lineHeight = font.lineHeight;
        lineCount = isArray(label) ? label.length : 1;
        const halfCount = lineCount / 2;
        const color2 = optsAtIndex.color;
        const strokeColor = optsAtIndex.textStrokeColor;
        const strokeWidth = optsAtIndex.textStrokeWidth;
        if (isHorizontal) {
          x = pixel;
          if (position === "top") {
            if (crossAlign === "near" || rotation !== 0) {
              textOffset = -lineCount * lineHeight + lineHeight / 2;
            } else if (crossAlign === "center") {
              textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
            } else {
              textOffset = -labelSizes.highest.height + lineHeight / 2;
            }
          } else {
            if (crossAlign === "near" || rotation !== 0) {
              textOffset = lineHeight / 2;
            } else if (crossAlign === "center") {
              textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
            } else {
              textOffset = labelSizes.highest.height - lineCount * lineHeight;
            }
          }
          if (mirror) {
            textOffset *= -1;
          }
        } else {
          y = pixel;
          textOffset = (1 - lineCount) * lineHeight / 2;
        }
        let backdrop;
        if (optsAtIndex.showLabelBackdrop) {
          const labelPadding = toPadding(optsAtIndex.backdropPadding);
          const height = labelSizes.heights[i];
          const width = labelSizes.widths[i];
          let top = y + textOffset - labelPadding.top;
          let left = x - labelPadding.left;
          switch (textBaseline) {
            case "middle":
              top -= height / 2;
              break;
            case "bottom":
              top -= height;
              break;
          }
          switch (textAlign) {
            case "center":
              left -= width / 2;
              break;
            case "right":
              left -= width;
              break;
          }
          backdrop = {
            left,
            top,
            width: width + labelPadding.width,
            height: height + labelPadding.height,
            color: optsAtIndex.backdropColor
          };
        }
        items.push({
          rotation,
          label,
          font,
          color: color2,
          strokeColor,
          strokeWidth,
          textOffset,
          textAlign,
          textBaseline,
          translation: [x, y],
          backdrop
        });
      }
      return items;
    }
    _getXAxisLabelAlignment() {
      const { position, ticks } = this.options;
      const rotation = -toRadians(this.labelRotation);
      if (rotation) {
        return position === "top" ? "left" : "right";
      }
      let align = "center";
      if (ticks.align === "start") {
        align = "left";
      } else if (ticks.align === "end") {
        align = "right";
      }
      return align;
    }
    _getYAxisLabelAlignment(tl) {
      const { position, ticks: { crossAlign, mirror, padding } } = this.options;
      const labelSizes = this._getLabelSizes();
      const tickAndPadding = tl + padding;
      const widest = labelSizes.widest.width;
      let textAlign;
      let x;
      if (position === "left") {
        if (mirror) {
          x = this.right + padding;
          if (crossAlign === "near") {
            textAlign = "left";
          } else if (crossAlign === "center") {
            textAlign = "center";
            x += widest / 2;
          } else {
            textAlign = "right";
            x += widest;
          }
        } else {
          x = this.right - tickAndPadding;
          if (crossAlign === "near") {
            textAlign = "right";
          } else if (crossAlign === "center") {
            textAlign = "center";
            x -= widest / 2;
          } else {
            textAlign = "left";
            x = this.left;
          }
        }
      } else if (position === "right") {
        if (mirror) {
          x = this.left + padding;
          if (crossAlign === "near") {
            textAlign = "right";
          } else if (crossAlign === "center") {
            textAlign = "center";
            x -= widest / 2;
          } else {
            textAlign = "left";
            x -= widest;
          }
        } else {
          x = this.left + tickAndPadding;
          if (crossAlign === "near") {
            textAlign = "left";
          } else if (crossAlign === "center") {
            textAlign = "center";
            x += widest / 2;
          } else {
            textAlign = "right";
            x = this.right;
          }
        }
      } else {
        textAlign = "right";
      }
      return { textAlign, x };
    }
    _computeLabelArea() {
      if (this.options.ticks.mirror) {
        return;
      }
      const chart = this.chart;
      const position = this.options.position;
      if (position === "left" || position === "right") {
        return { top: 0, left: this.left, bottom: chart.height, right: this.right };
      }
      if (position === "top" || position === "bottom") {
        return { top: this.top, left: 0, bottom: this.bottom, right: chart.width };
      }
    }
    drawBackground() {
      const { ctx: ctx2, options: { backgroundColor }, left, top, width, height } = this;
      if (backgroundColor) {
        ctx2.save();
        ctx2.fillStyle = backgroundColor;
        ctx2.fillRect(left, top, width, height);
        ctx2.restore();
      }
    }
    getLineWidthForValue(value) {
      const grid = this.options.grid;
      if (!this._isVisible() || !grid.display) {
        return 0;
      }
      const ticks = this.ticks;
      const index = ticks.findIndex((t) => t.value === value);
      if (index >= 0) {
        const opts = grid.setContext(this.getContext(index));
        return opts.lineWidth;
      }
      return 0;
    }
    drawGrid(chartArea) {
      const grid = this.options.grid;
      const ctx2 = this.ctx;
      const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
      let i, ilen;
      const drawLine = (p1, p2, style) => {
        if (!style.width || !style.color) {
          return;
        }
        ctx2.save();
        ctx2.lineWidth = style.width;
        ctx2.strokeStyle = style.color;
        ctx2.setLineDash(style.borderDash || []);
        ctx2.lineDashOffset = style.borderDashOffset;
        ctx2.beginPath();
        ctx2.moveTo(p1.x, p1.y);
        ctx2.lineTo(p2.x, p2.y);
        ctx2.stroke();
        ctx2.restore();
      };
      if (grid.display) {
        for (i = 0, ilen = items.length; i < ilen; ++i) {
          const item = items[i];
          if (grid.drawOnChartArea) {
            drawLine({ x: item.x1, y: item.y1 }, { x: item.x2, y: item.y2 }, item);
          }
          if (grid.drawTicks) {
            drawLine({ x: item.tx1, y: item.ty1 }, { x: item.tx2, y: item.ty2 }, {
              color: item.tickColor,
              width: item.tickWidth,
              borderDash: item.tickBorderDash,
              borderDashOffset: item.tickBorderDashOffset
            });
          }
        }
      }
    }
    drawBorder() {
      const { chart, ctx: ctx2, options: { grid } } = this;
      const borderOpts = grid.setContext(this.getContext());
      const axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;
      if (!axisWidth) {
        return;
      }
      const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
      const borderValue = this._borderValue;
      let x1, x2, y1, y2;
      if (this.isHorizontal()) {
        x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
        x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
        y1 = y2 = borderValue;
      } else {
        y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
        y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
        x1 = x2 = borderValue;
      }
      ctx2.save();
      ctx2.lineWidth = borderOpts.borderWidth;
      ctx2.strokeStyle = borderOpts.borderColor;
      ctx2.beginPath();
      ctx2.moveTo(x1, y1);
      ctx2.lineTo(x2, y2);
      ctx2.stroke();
      ctx2.restore();
    }
    drawLabels(chartArea) {
      const optionTicks = this.options.ticks;
      if (!optionTicks.display) {
        return;
      }
      const ctx2 = this.ctx;
      const area = this._computeLabelArea();
      if (area) {
        clipArea(ctx2, area);
      }
      const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
      let i, ilen;
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        const item = items[i];
        const tickFont = item.font;
        const label = item.label;
        if (item.backdrop) {
          ctx2.fillStyle = item.backdrop.color;
          ctx2.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height);
        }
        let y = item.textOffset;
        renderText(ctx2, label, 0, y, tickFont, item);
      }
      if (area) {
        unclipArea(ctx2);
      }
    }
    drawTitle() {
      const { ctx: ctx2, options: { position, title, reverse } } = this;
      if (!title.display) {
        return;
      }
      const font = toFont(title.font);
      const padding = toPadding(title.padding);
      const align = title.align;
      let offset = font.lineHeight / 2;
      if (position === "bottom" || position === "center" || isObject(position)) {
        offset += padding.bottom;
        if (isArray(title.text)) {
          offset += font.lineHeight * (title.text.length - 1);
        }
      } else {
        offset += padding.top;
      }
      const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
      renderText(ctx2, title.text, 0, 0, font, {
        color: title.color,
        maxWidth,
        rotation,
        textAlign: titleAlign(align, position, reverse),
        textBaseline: "middle",
        translation: [titleX, titleY]
      });
    }
    draw(chartArea) {
      if (!this._isVisible()) {
        return;
      }
      this.drawBackground();
      this.drawGrid(chartArea);
      this.drawBorder();
      this.drawTitle();
      this.drawLabels(chartArea);
    }
    _layers() {
      const opts = this.options;
      const tz = opts.ticks && opts.ticks.z || 0;
      const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
      if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
        return [{
          z: tz,
          draw: (chartArea) => {
            this.draw(chartArea);
          }
        }];
      }
      return [{
        z: gz,
        draw: (chartArea) => {
          this.drawBackground();
          this.drawGrid(chartArea);
          this.drawTitle();
        }
      }, {
        z: gz + 1,
        draw: () => {
          this.drawBorder();
        }
      }, {
        z: tz,
        draw: (chartArea) => {
          this.drawLabels(chartArea);
        }
      }];
    }
    getMatchingVisibleMetas(type) {
      const metas = this.chart.getSortedVisibleDatasetMetas();
      const axisID = this.axis + "AxisID";
      const result = [];
      let i, ilen;
      for (i = 0, ilen = metas.length; i < ilen; ++i) {
        const meta = metas[i];
        if (meta[axisID] === this.id && (!type || meta.type === type)) {
          result.push(meta);
        }
      }
      return result;
    }
    _resolveTickFontOptions(index) {
      const opts = this.options.ticks.setContext(this.getContext(index));
      return toFont(opts.font);
    }
    _maxDigits() {
      const fontSize = this._resolveTickFontOptions(0).lineHeight;
      return (this.isHorizontal() ? this.width : this.height) / fontSize;
    }
  };
  var TypedRegistry = class {
    constructor(type, scope, override) {
      this.type = type;
      this.scope = scope;
      this.override = override;
      this.items = Object.create(null);
    }
    isForType(type) {
      return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
    }
    register(item) {
      const proto = Object.getPrototypeOf(item);
      let parentScope;
      if (isIChartComponent(proto)) {
        parentScope = this.register(proto);
      }
      const items = this.items;
      const id = item.id;
      const scope = this.scope + "." + id;
      if (!id) {
        throw new Error("class does not have id: " + item);
      }
      if (id in items) {
        return scope;
      }
      items[id] = item;
      registerDefaults(item, scope, parentScope);
      if (this.override) {
        defaults.override(item.id, item.overrides);
      }
      return scope;
    }
    get(id) {
      return this.items[id];
    }
    unregister(item) {
      const items = this.items;
      const id = item.id;
      const scope = this.scope;
      if (id in items) {
        delete items[id];
      }
      if (scope && id in defaults[scope]) {
        delete defaults[scope][id];
        if (this.override) {
          delete overrides[id];
        }
      }
    }
  };
  function registerDefaults(item, scope, parentScope) {
    const itemDefaults = merge(Object.create(null), [
      parentScope ? defaults.get(parentScope) : {},
      defaults.get(scope),
      item.defaults
    ]);
    defaults.set(scope, itemDefaults);
    if (item.defaultRoutes) {
      routeDefaults(scope, item.defaultRoutes);
    }
    if (item.descriptors) {
      defaults.describe(scope, item.descriptors);
    }
  }
  function routeDefaults(scope, routes) {
    Object.keys(routes).forEach((property) => {
      const propertyParts = property.split(".");
      const sourceName = propertyParts.pop();
      const sourceScope = [scope].concat(propertyParts).join(".");
      const parts = routes[property].split(".");
      const targetName = parts.pop();
      const targetScope = parts.join(".");
      defaults.route(sourceScope, sourceName, targetScope, targetName);
    });
  }
  function isIChartComponent(proto) {
    return "id" in proto && "defaults" in proto;
  }
  var Registry = class {
    constructor() {
      this.controllers = new TypedRegistry(DatasetController, "datasets", true);
      this.elements = new TypedRegistry(Element, "elements");
      this.plugins = new TypedRegistry(Object, "plugins");
      this.scales = new TypedRegistry(Scale, "scales");
      this._typedRegistries = [this.controllers, this.scales, this.elements];
    }
    add(...args) {
      this._each("register", args);
    }
    remove(...args) {
      this._each("unregister", args);
    }
    addControllers(...args) {
      this._each("register", args, this.controllers);
    }
    addElements(...args) {
      this._each("register", args, this.elements);
    }
    addPlugins(...args) {
      this._each("register", args, this.plugins);
    }
    addScales(...args) {
      this._each("register", args, this.scales);
    }
    getController(id) {
      return this._get(id, this.controllers, "controller");
    }
    getElement(id) {
      return this._get(id, this.elements, "element");
    }
    getPlugin(id) {
      return this._get(id, this.plugins, "plugin");
    }
    getScale(id) {
      return this._get(id, this.scales, "scale");
    }
    removeControllers(...args) {
      this._each("unregister", args, this.controllers);
    }
    removeElements(...args) {
      this._each("unregister", args, this.elements);
    }
    removePlugins(...args) {
      this._each("unregister", args, this.plugins);
    }
    removeScales(...args) {
      this._each("unregister", args, this.scales);
    }
    _each(method, args, typedRegistry) {
      [...args].forEach((arg) => {
        const reg = typedRegistry || this._getRegistryForType(arg);
        if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
          this._exec(method, reg, arg);
        } else {
          each(arg, (item) => {
            const itemReg = typedRegistry || this._getRegistryForType(item);
            this._exec(method, itemReg, item);
          });
        }
      });
    }
    _exec(method, registry2, component) {
      const camelMethod = _capitalize(method);
      callback(component["before" + camelMethod], [], component);
      registry2[method](component);
      callback(component["after" + camelMethod], [], component);
    }
    _getRegistryForType(type) {
      for (let i = 0; i < this._typedRegistries.length; i++) {
        const reg = this._typedRegistries[i];
        if (reg.isForType(type)) {
          return reg;
        }
      }
      return this.plugins;
    }
    _get(id, typedRegistry, type) {
      const item = typedRegistry.get(id);
      if (item === void 0) {
        throw new Error('"' + id + '" is not a registered ' + type + ".");
      }
      return item;
    }
  };
  var registry = new Registry();
  var PluginService = class {
    constructor() {
      this._init = [];
    }
    notify(chart, hook, args, filter) {
      if (hook === "beforeInit") {
        this._init = this._createDescriptors(chart, true);
        this._notify(this._init, chart, "install");
      }
      const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
      const result = this._notify(descriptors2, chart, hook, args);
      if (hook === "destroy") {
        this._notify(descriptors2, chart, "stop");
        this._notify(this._init, chart, "uninstall");
      }
      return result;
    }
    _notify(descriptors2, chart, hook, args) {
      args = args || {};
      for (const descriptor of descriptors2) {
        const plugin = descriptor.plugin;
        const method = plugin[hook];
        const params = [chart, args, descriptor.options];
        if (callback(method, params, plugin) === false && args.cancelable) {
          return false;
        }
      }
      return true;
    }
    invalidate() {
      if (!isNullOrUndef(this._cache)) {
        this._oldCache = this._cache;
        this._cache = void 0;
      }
    }
    _descriptors(chart) {
      if (this._cache) {
        return this._cache;
      }
      const descriptors2 = this._cache = this._createDescriptors(chart);
      this._notifyStateChanges(chart);
      return descriptors2;
    }
    _createDescriptors(chart, all) {
      const config = chart && chart.config;
      const options = valueOrDefault(config.options && config.options.plugins, {});
      const plugins2 = allPlugins(config);
      return options === false && !all ? [] : createDescriptors(chart, plugins2, options, all);
    }
    _notifyStateChanges(chart) {
      const previousDescriptors = this._oldCache || [];
      const descriptors2 = this._cache;
      const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
      this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
      this._notify(diff(descriptors2, previousDescriptors), chart, "start");
    }
  };
  function allPlugins(config) {
    const plugins2 = [];
    const keys = Object.keys(registry.plugins.items);
    for (let i = 0; i < keys.length; i++) {
      plugins2.push(registry.getPlugin(keys[i]));
    }
    const local = config.plugins || [];
    for (let i = 0; i < local.length; i++) {
      const plugin = local[i];
      if (plugins2.indexOf(plugin) === -1) {
        plugins2.push(plugin);
      }
    }
    return plugins2;
  }
  function getOpts(options, all) {
    if (!all && options === false) {
      return null;
    }
    if (options === true) {
      return {};
    }
    return options;
  }
  function createDescriptors(chart, plugins2, options, all) {
    const result = [];
    const context = chart.getContext();
    for (let i = 0; i < plugins2.length; i++) {
      const plugin = plugins2[i];
      const id = plugin.id;
      const opts = getOpts(options[id], all);
      if (opts === null) {
        continue;
      }
      result.push({
        plugin,
        options: pluginOpts(chart.config, plugin, opts, context)
      });
    }
    return result;
  }
  function pluginOpts(config, plugin, opts, context) {
    const keys = config.pluginScopeKeys(plugin);
    const scopes = config.getOptionScopes(opts, keys);
    return config.createResolver(scopes, context, [""], { scriptable: false, indexable: false, allKeys: true });
  }
  function getIndexAxis(type, options) {
    const datasetDefaults = defaults.datasets[type] || {};
    const datasetOptions = (options.datasets || {})[type] || {};
    return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
  }
  function getAxisFromDefaultScaleID(id, indexAxis) {
    let axis = id;
    if (id === "_index_") {
      axis = indexAxis;
    } else if (id === "_value_") {
      axis = indexAxis === "x" ? "y" : "x";
    }
    return axis;
  }
  function getDefaultScaleIDFromAxis(axis, indexAxis) {
    return axis === indexAxis ? "_index_" : "_value_";
  }
  function axisFromPosition(position) {
    if (position === "top" || position === "bottom") {
      return "x";
    }
    if (position === "left" || position === "right") {
      return "y";
    }
  }
  function determineAxis(id, scaleOptions) {
    if (id === "x" || id === "y") {
      return id;
    }
    return scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.charAt(0).toLowerCase();
  }
  function mergeScaleConfig(config, options) {
    const chartDefaults = overrides[config.type] || { scales: {} };
    const configScales = options.scales || {};
    const chartIndexAxis = getIndexAxis(config.type, options);
    const firstIDs = Object.create(null);
    const scales2 = Object.create(null);
    Object.keys(configScales).forEach((id) => {
      const scaleConf = configScales[id];
      if (!isObject(scaleConf)) {
        return console.error(`Invalid scale configuration for scale: ${id}`);
      }
      if (scaleConf._proxy) {
        return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
      }
      const axis = determineAxis(id, scaleConf);
      const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
      const defaultScaleOptions = chartDefaults.scales || {};
      firstIDs[axis] = firstIDs[axis] || id;
      scales2[id] = mergeIf(Object.create(null), [{ axis }, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
    });
    config.data.datasets.forEach((dataset) => {
      const type = dataset.type || config.type;
      const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
      const datasetDefaults = overrides[type] || {};
      const defaultScaleOptions = datasetDefaults.scales || {};
      Object.keys(defaultScaleOptions).forEach((defaultID) => {
        const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
        const id = dataset[axis + "AxisID"] || firstIDs[axis] || axis;
        scales2[id] = scales2[id] || Object.create(null);
        mergeIf(scales2[id], [{ axis }, configScales[id], defaultScaleOptions[defaultID]]);
      });
    });
    Object.keys(scales2).forEach((key) => {
      const scale = scales2[key];
      mergeIf(scale, [defaults.scales[scale.type], defaults.scale]);
    });
    return scales2;
  }
  function initOptions(config) {
    const options = config.options || (config.options = {});
    options.plugins = valueOrDefault(options.plugins, {});
    options.scales = mergeScaleConfig(config, options);
  }
  function initData(data) {
    data = data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    return data;
  }
  function initConfig(config) {
    config = config || {};
    config.data = initData(config.data);
    initOptions(config);
    return config;
  }
  var keyCache = new Map();
  var keysCached = new Set();
  function cachedKeys(cacheKey, generate) {
    let keys = keyCache.get(cacheKey);
    if (!keys) {
      keys = generate();
      keyCache.set(cacheKey, keys);
      keysCached.add(keys);
    }
    return keys;
  }
  var addIfFound = (set2, obj, key) => {
    const opts = resolveObjectKey(obj, key);
    if (opts !== void 0) {
      set2.add(opts);
    }
  };
  var Config = class {
    constructor(config) {
      this._config = initConfig(config);
      this._scopeCache = new Map();
      this._resolverCache = new Map();
    }
    get platform() {
      return this._config.platform;
    }
    get type() {
      return this._config.type;
    }
    set type(type) {
      this._config.type = type;
    }
    get data() {
      return this._config.data;
    }
    set data(data) {
      this._config.data = initData(data);
    }
    get options() {
      return this._config.options;
    }
    set options(options) {
      this._config.options = options;
    }
    get plugins() {
      return this._config.plugins;
    }
    update() {
      const config = this._config;
      this.clearCache();
      initOptions(config);
    }
    clearCache() {
      this._scopeCache.clear();
      this._resolverCache.clear();
    }
    datasetScopeKeys(datasetType) {
      return cachedKeys(datasetType, () => [[
        `datasets.${datasetType}`,
        ""
      ]]);
    }
    datasetAnimationScopeKeys(datasetType, transition) {
      return cachedKeys(`${datasetType}.transition.${transition}`, () => [
        [
          `datasets.${datasetType}.transitions.${transition}`,
          `transitions.${transition}`
        ],
        [
          `datasets.${datasetType}`,
          ""
        ]
      ]);
    }
    datasetElementScopeKeys(datasetType, elementType) {
      return cachedKeys(`${datasetType}-${elementType}`, () => [[
        `datasets.${datasetType}.elements.${elementType}`,
        `datasets.${datasetType}`,
        `elements.${elementType}`,
        ""
      ]]);
    }
    pluginScopeKeys(plugin) {
      const id = plugin.id;
      const type = this.type;
      return cachedKeys(`${type}-plugin-${id}`, () => [[
        `plugins.${id}`,
        ...plugin.additionalOptionScopes || []
      ]]);
    }
    _cachedScopes(mainScope, resetCache) {
      const _scopeCache = this._scopeCache;
      let cache = _scopeCache.get(mainScope);
      if (!cache || resetCache) {
        cache = new Map();
        _scopeCache.set(mainScope, cache);
      }
      return cache;
    }
    getOptionScopes(mainScope, keyLists, resetCache) {
      const { options, type } = this;
      const cache = this._cachedScopes(mainScope, resetCache);
      const cached = cache.get(keyLists);
      if (cached) {
        return cached;
      }
      const scopes = new Set();
      keyLists.forEach((keys) => {
        if (mainScope) {
          scopes.add(mainScope);
          keys.forEach((key) => addIfFound(scopes, mainScope, key));
        }
        keys.forEach((key) => addIfFound(scopes, options, key));
        keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
        keys.forEach((key) => addIfFound(scopes, defaults, key));
        keys.forEach((key) => addIfFound(scopes, descriptors, key));
      });
      const array = Array.from(scopes);
      if (array.length === 0) {
        array.push(Object.create(null));
      }
      if (keysCached.has(keyLists)) {
        cache.set(keyLists, array);
      }
      return array;
    }
    chartOptionScopes() {
      const { options, type } = this;
      return [
        options,
        overrides[type] || {},
        defaults.datasets[type] || {},
        { type },
        defaults,
        descriptors
      ];
    }
    resolveNamedOptions(scopes, names2, context, prefixes = [""]) {
      const result = { $shared: true };
      const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
      let options = resolver;
      if (needContext(resolver, names2)) {
        result.$shared = false;
        context = isFunction(context) ? context() : context;
        const subResolver = this.createResolver(scopes, context, subPrefixes);
        options = _attachContext(resolver, context, subResolver);
      }
      for (const prop of names2) {
        result[prop] = options[prop];
      }
      return result;
    }
    createResolver(scopes, context, prefixes = [""], descriptorDefaults) {
      const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
      return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
    }
  };
  function getResolver(resolverCache, scopes, prefixes) {
    let cache = resolverCache.get(scopes);
    if (!cache) {
      cache = new Map();
      resolverCache.set(scopes, cache);
    }
    const cacheKey = prefixes.join();
    let cached = cache.get(cacheKey);
    if (!cached) {
      const resolver = _createResolver(scopes, prefixes);
      cached = {
        resolver,
        subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes("hover"))
      };
      cache.set(cacheKey, cached);
    }
    return cached;
  }
  var hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).reduce((acc, key) => acc || isFunction(value[key]), false);
  function needContext(proxy, names2) {
    const { isScriptable, isIndexable } = _descriptors(proxy);
    for (const prop of names2) {
      const scriptable = isScriptable(prop);
      const indexable = isIndexable(prop);
      const value = (indexable || scriptable) && proxy[prop];
      if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
        return true;
      }
    }
    return false;
  }
  var version = "3.6.0";
  var KNOWN_POSITIONS = ["top", "bottom", "left", "right", "chartArea"];
  function positionIsHorizontal(position, axis) {
    return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
  }
  function compare2Level(l1, l2) {
    return function(a, b) {
      return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
    };
  }
  function onAnimationsComplete(context) {
    const chart = context.chart;
    const animationOptions2 = chart.options.animation;
    chart.notifyPlugins("afterRender");
    callback(animationOptions2 && animationOptions2.onComplete, [context], chart);
  }
  function onAnimationProgress(context) {
    const chart = context.chart;
    const animationOptions2 = chart.options.animation;
    callback(animationOptions2 && animationOptions2.onProgress, [context], chart);
  }
  function getCanvas(item) {
    if (_isDomSupported() && typeof item === "string") {
      item = document.getElementById(item);
    } else if (item && item.length) {
      item = item[0];
    }
    if (item && item.canvas) {
      item = item.canvas;
    }
    return item;
  }
  var instances = {};
  var getChart = (key) => {
    const canvas = getCanvas(key);
    return Object.values(instances).filter((c) => c.canvas === canvas).pop();
  };
  var Chart = class {
    constructor(item, userConfig) {
      const config = this.config = new Config(userConfig);
      const initialCanvas = getCanvas(item);
      const existingChart = getChart(initialCanvas);
      if (existingChart) {
        throw new Error("Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas can be reused.");
      }
      const options = config.createResolver(config.chartOptionScopes(), this.getContext());
      this.platform = new (config.platform || _detectPlatform(initialCanvas))();
      this.platform.updateConfig(config);
      const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
      const canvas = context && context.canvas;
      const height = canvas && canvas.height;
      const width = canvas && canvas.width;
      this.id = uid();
      this.ctx = context;
      this.canvas = canvas;
      this.width = width;
      this.height = height;
      this._options = options;
      this._aspectRatio = this.aspectRatio;
      this._layers = [];
      this._metasets = [];
      this._stacks = void 0;
      this.boxes = [];
      this.currentDevicePixelRatio = void 0;
      this.chartArea = void 0;
      this._active = [];
      this._lastEvent = void 0;
      this._listeners = {};
      this._responsiveListeners = void 0;
      this._sortedMetasets = [];
      this.scales = {};
      this._plugins = new PluginService();
      this.$proxies = {};
      this._hiddenIndices = {};
      this.attached = false;
      this._animationsDisabled = void 0;
      this.$context = void 0;
      this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
      instances[this.id] = this;
      if (!context || !canvas) {
        console.error("Failed to create chart: can't acquire context from the given item");
        return;
      }
      animator.listen(this, "complete", onAnimationsComplete);
      animator.listen(this, "progress", onAnimationProgress);
      this._initialize();
      if (this.attached) {
        this.update();
      }
    }
    get aspectRatio() {
      const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
      if (!isNullOrUndef(aspectRatio)) {
        return aspectRatio;
      }
      if (maintainAspectRatio && _aspectRatio) {
        return _aspectRatio;
      }
      return height ? width / height : null;
    }
    get data() {
      return this.config.data;
    }
    set data(data) {
      this.config.data = data;
    }
    get options() {
      return this._options;
    }
    set options(options) {
      this.config.options = options;
    }
    _initialize() {
      this.notifyPlugins("beforeInit");
      if (this.options.responsive) {
        this.resize();
      } else {
        retinaScale(this, this.options.devicePixelRatio);
      }
      this.bindEvents();
      this.notifyPlugins("afterInit");
      return this;
    }
    clear() {
      clearCanvas(this.canvas, this.ctx);
      return this;
    }
    stop() {
      animator.stop(this);
      return this;
    }
    resize(width, height) {
      if (!animator.running(this)) {
        this._resize(width, height);
      } else {
        this._resizeBeforeDraw = { width, height };
      }
    }
    _resize(width, height) {
      const options = this.options;
      const canvas = this.canvas;
      const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
      const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
      const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
      const mode = this.width ? "resize" : "attach";
      this.width = newSize.width;
      this.height = newSize.height;
      this._aspectRatio = this.aspectRatio;
      if (!retinaScale(this, newRatio, true)) {
        return;
      }
      this.notifyPlugins("resize", { size: newSize });
      callback(options.onResize, [this, newSize], this);
      if (this.attached) {
        if (this._doResize(mode)) {
          this.render();
        }
      }
    }
    ensureScalesHaveIDs() {
      const options = this.options;
      const scalesOptions = options.scales || {};
      each(scalesOptions, (axisOptions, axisID) => {
        axisOptions.id = axisID;
      });
    }
    buildOrUpdateScales() {
      const options = this.options;
      const scaleOpts = options.scales;
      const scales2 = this.scales;
      const updated = Object.keys(scales2).reduce((obj, id) => {
        obj[id] = false;
        return obj;
      }, {});
      let items = [];
      if (scaleOpts) {
        items = items.concat(Object.keys(scaleOpts).map((id) => {
          const scaleOptions = scaleOpts[id];
          const axis = determineAxis(id, scaleOptions);
          const isRadial = axis === "r";
          const isHorizontal = axis === "x";
          return {
            options: scaleOptions,
            dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
            dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
          };
        }));
      }
      each(items, (item) => {
        const scaleOptions = item.options;
        const id = scaleOptions.id;
        const axis = determineAxis(id, scaleOptions);
        const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
        if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
          scaleOptions.position = item.dposition;
        }
        updated[id] = true;
        let scale = null;
        if (id in scales2 && scales2[id].type === scaleType) {
          scale = scales2[id];
        } else {
          const scaleClass = registry.getScale(scaleType);
          scale = new scaleClass({
            id,
            type: scaleType,
            ctx: this.ctx,
            chart: this
          });
          scales2[scale.id] = scale;
        }
        scale.init(scaleOptions, options);
      });
      each(updated, (hasUpdated, id) => {
        if (!hasUpdated) {
          delete scales2[id];
        }
      });
      each(scales2, (scale) => {
        layouts.configure(this, scale, scale.options);
        layouts.addBox(this, scale);
      });
    }
    _updateMetasets() {
      const metasets = this._metasets;
      const numData = this.data.datasets.length;
      const numMeta = metasets.length;
      metasets.sort((a, b) => a.index - b.index);
      if (numMeta > numData) {
        for (let i = numData; i < numMeta; ++i) {
          this._destroyDatasetMeta(i);
        }
        metasets.splice(numData, numMeta - numData);
      }
      this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
    }
    _removeUnreferencedMetasets() {
      const { _metasets: metasets, data: { datasets } } = this;
      if (metasets.length > datasets.length) {
        delete this._stacks;
      }
      metasets.forEach((meta, index) => {
        if (datasets.filter((x) => x === meta._dataset).length === 0) {
          this._destroyDatasetMeta(index);
        }
      });
    }
    buildOrUpdateControllers() {
      const newControllers = [];
      const datasets = this.data.datasets;
      let i, ilen;
      this._removeUnreferencedMetasets();
      for (i = 0, ilen = datasets.length; i < ilen; i++) {
        const dataset = datasets[i];
        let meta = this.getDatasetMeta(i);
        const type = dataset.type || this.config.type;
        if (meta.type && meta.type !== type) {
          this._destroyDatasetMeta(i);
          meta = this.getDatasetMeta(i);
        }
        meta.type = type;
        meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
        meta.order = dataset.order || 0;
        meta.index = i;
        meta.label = "" + dataset.label;
        meta.visible = this.isDatasetVisible(i);
        if (meta.controller) {
          meta.controller.updateIndex(i);
          meta.controller.linkScales();
        } else {
          const ControllerClass = registry.getController(type);
          const { datasetElementType, dataElementType } = defaults.datasets[type];
          Object.assign(ControllerClass.prototype, {
            dataElementType: registry.getElement(dataElementType),
            datasetElementType: datasetElementType && registry.getElement(datasetElementType)
          });
          meta.controller = new ControllerClass(this, i);
          newControllers.push(meta.controller);
        }
      }
      this._updateMetasets();
      return newControllers;
    }
    _resetElements() {
      each(this.data.datasets, (dataset, datasetIndex) => {
        this.getDatasetMeta(datasetIndex).controller.reset();
      }, this);
    }
    reset() {
      this._resetElements();
      this.notifyPlugins("reset");
    }
    update(mode) {
      const config = this.config;
      config.update();
      const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
      each(this.scales, (scale) => {
        layouts.removeBox(this, scale);
      });
      const animsDisabled = this._animationsDisabled = !options.animation;
      this.ensureScalesHaveIDs();
      this.buildOrUpdateScales();
      const existingEvents = new Set(Object.keys(this._listeners));
      const newEvents = new Set(options.events);
      if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
        this.unbindEvents();
        this.bindEvents();
      }
      this._plugins.invalidate();
      if (this.notifyPlugins("beforeUpdate", { mode, cancelable: true }) === false) {
        return;
      }
      const newControllers = this.buildOrUpdateControllers();
      this.notifyPlugins("beforeElementsUpdate");
      let minPadding = 0;
      for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
        const { controller } = this.getDatasetMeta(i);
        const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
        controller.buildOrUpdateElements(reset);
        minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
      }
      minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
      this._updateLayout(minPadding);
      if (!animsDisabled) {
        each(newControllers, (controller) => {
          controller.reset();
        });
      }
      this._updateDatasets(mode);
      this.notifyPlugins("afterUpdate", { mode });
      this._layers.sort(compare2Level("z", "_idx"));
      if (this._lastEvent) {
        this._eventHandler(this._lastEvent, true);
      }
      this.render();
    }
    _updateLayout(minPadding) {
      if (this.notifyPlugins("beforeLayout", { cancelable: true }) === false) {
        return;
      }
      layouts.update(this, this.width, this.height, minPadding);
      const area = this.chartArea;
      const noArea = area.width <= 0 || area.height <= 0;
      this._layers = [];
      each(this.boxes, (box) => {
        if (noArea && box.position === "chartArea") {
          return;
        }
        if (box.configure) {
          box.configure();
        }
        this._layers.push(...box._layers());
      }, this);
      this._layers.forEach((item, index) => {
        item._idx = index;
      });
      this.notifyPlugins("afterLayout");
    }
    _updateDatasets(mode) {
      if (this.notifyPlugins("beforeDatasetsUpdate", { mode, cancelable: true }) === false) {
        return;
      }
      for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
        this._updateDataset(i, isFunction(mode) ? mode({ datasetIndex: i }) : mode);
      }
      this.notifyPlugins("afterDatasetsUpdate", { mode });
    }
    _updateDataset(index, mode) {
      const meta = this.getDatasetMeta(index);
      const args = { meta, index, mode, cancelable: true };
      if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
        return;
      }
      meta.controller._update(mode);
      args.cancelable = false;
      this.notifyPlugins("afterDatasetUpdate", args);
    }
    render() {
      if (this.notifyPlugins("beforeRender", { cancelable: true }) === false) {
        return;
      }
      if (animator.has(this)) {
        if (this.attached && !animator.running(this)) {
          animator.start(this);
        }
      } else {
        this.draw();
        onAnimationsComplete({ chart: this });
      }
    }
    draw() {
      let i;
      if (this._resizeBeforeDraw) {
        const { width, height } = this._resizeBeforeDraw;
        this._resize(width, height);
        this._resizeBeforeDraw = null;
      }
      this.clear();
      if (this.width <= 0 || this.height <= 0) {
        return;
      }
      if (this.notifyPlugins("beforeDraw", { cancelable: true }) === false) {
        return;
      }
      const layers = this._layers;
      for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
        layers[i].draw(this.chartArea);
      }
      this._drawDatasets();
      for (; i < layers.length; ++i) {
        layers[i].draw(this.chartArea);
      }
      this.notifyPlugins("afterDraw");
    }
    _getSortedDatasetMetas(filterVisible) {
      const metasets = this._sortedMetasets;
      const result = [];
      let i, ilen;
      for (i = 0, ilen = metasets.length; i < ilen; ++i) {
        const meta = metasets[i];
        if (!filterVisible || meta.visible) {
          result.push(meta);
        }
      }
      return result;
    }
    getSortedVisibleDatasetMetas() {
      return this._getSortedDatasetMetas(true);
    }
    _drawDatasets() {
      if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: true }) === false) {
        return;
      }
      const metasets = this.getSortedVisibleDatasetMetas();
      for (let i = metasets.length - 1; i >= 0; --i) {
        this._drawDataset(metasets[i]);
      }
      this.notifyPlugins("afterDatasetsDraw");
    }
    _drawDataset(meta) {
      const ctx2 = this.ctx;
      const clip = meta._clip;
      const useClip = !clip.disabled;
      const area = this.chartArea;
      const args = {
        meta,
        index: meta.index,
        cancelable: true
      };
      if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
        return;
      }
      if (useClip) {
        clipArea(ctx2, {
          left: clip.left === false ? 0 : area.left - clip.left,
          right: clip.right === false ? this.width : area.right + clip.right,
          top: clip.top === false ? 0 : area.top - clip.top,
          bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
        });
      }
      meta.controller.draw();
      if (useClip) {
        unclipArea(ctx2);
      }
      args.cancelable = false;
      this.notifyPlugins("afterDatasetDraw", args);
    }
    getElementsAtEventForMode(e, mode, options, useFinalPosition) {
      const method = Interaction.modes[mode];
      if (typeof method === "function") {
        return method(this, e, options, useFinalPosition);
      }
      return [];
    }
    getDatasetMeta(datasetIndex) {
      const dataset = this.data.datasets[datasetIndex];
      const metasets = this._metasets;
      let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
      if (!meta) {
        meta = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null,
          order: dataset && dataset.order || 0,
          index: datasetIndex,
          _dataset: dataset,
          _parsed: [],
          _sorted: false
        };
        metasets.push(meta);
      }
      return meta;
    }
    getContext() {
      return this.$context || (this.$context = createContext(null, { chart: this, type: "chart" }));
    }
    getVisibleDatasetCount() {
      return this.getSortedVisibleDatasetMetas().length;
    }
    isDatasetVisible(datasetIndex) {
      const dataset = this.data.datasets[datasetIndex];
      if (!dataset) {
        return false;
      }
      const meta = this.getDatasetMeta(datasetIndex);
      return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
    }
    setDatasetVisibility(datasetIndex, visible) {
      const meta = this.getDatasetMeta(datasetIndex);
      meta.hidden = !visible;
    }
    toggleDataVisibility(index) {
      this._hiddenIndices[index] = !this._hiddenIndices[index];
    }
    getDataVisibility(index) {
      return !this._hiddenIndices[index];
    }
    _updateVisibility(datasetIndex, dataIndex, visible) {
      const mode = visible ? "show" : "hide";
      const meta = this.getDatasetMeta(datasetIndex);
      const anims = meta.controller._resolveAnimations(void 0, mode);
      if (defined(dataIndex)) {
        meta.data[dataIndex].hidden = !visible;
        this.update();
      } else {
        this.setDatasetVisibility(datasetIndex, visible);
        anims.update(meta, { visible });
        this.update((ctx2) => ctx2.datasetIndex === datasetIndex ? mode : void 0);
      }
    }
    hide(datasetIndex, dataIndex) {
      this._updateVisibility(datasetIndex, dataIndex, false);
    }
    show(datasetIndex, dataIndex) {
      this._updateVisibility(datasetIndex, dataIndex, true);
    }
    _destroyDatasetMeta(datasetIndex) {
      const meta = this._metasets[datasetIndex];
      if (meta && meta.controller) {
        meta.controller._destroy();
      }
      delete this._metasets[datasetIndex];
    }
    _stop() {
      let i, ilen;
      this.stop();
      animator.remove(this);
      for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
        this._destroyDatasetMeta(i);
      }
    }
    destroy() {
      const { canvas, ctx: ctx2 } = this;
      this._stop();
      this.config.clearCache();
      if (canvas) {
        this.unbindEvents();
        clearCanvas(canvas, ctx2);
        this.platform.releaseContext(ctx2);
        this.canvas = null;
        this.ctx = null;
      }
      this.notifyPlugins("destroy");
      delete instances[this.id];
    }
    toBase64Image(...args) {
      return this.canvas.toDataURL(...args);
    }
    bindEvents() {
      this.bindUserEvents();
      if (this.options.responsive) {
        this.bindResponsiveEvents();
      } else {
        this.attached = true;
      }
    }
    bindUserEvents() {
      const listeners = this._listeners;
      const platform = this.platform;
      const _add = (type, listener2) => {
        platform.addEventListener(this, type, listener2);
        listeners[type] = listener2;
      };
      const listener = (e, x, y) => {
        e.offsetX = x;
        e.offsetY = y;
        this._eventHandler(e);
      };
      each(this.options.events, (type) => _add(type, listener));
    }
    bindResponsiveEvents() {
      if (!this._responsiveListeners) {
        this._responsiveListeners = {};
      }
      const listeners = this._responsiveListeners;
      const platform = this.platform;
      const _add = (type, listener2) => {
        platform.addEventListener(this, type, listener2);
        listeners[type] = listener2;
      };
      const _remove = (type, listener2) => {
        if (listeners[type]) {
          platform.removeEventListener(this, type, listener2);
          delete listeners[type];
        }
      };
      const listener = (width, height) => {
        if (this.canvas) {
          this.resize(width, height);
        }
      };
      let detached;
      const attached = () => {
        _remove("attach", attached);
        this.attached = true;
        this.resize();
        _add("resize", listener);
        _add("detach", detached);
      };
      detached = () => {
        this.attached = false;
        _remove("resize", listener);
        this._stop();
        this._resize(0, 0);
        _add("attach", attached);
      };
      if (platform.isAttached(this.canvas)) {
        attached();
      } else {
        detached();
      }
    }
    unbindEvents() {
      each(this._listeners, (listener, type) => {
        this.platform.removeEventListener(this, type, listener);
      });
      this._listeners = {};
      each(this._responsiveListeners, (listener, type) => {
        this.platform.removeEventListener(this, type, listener);
      });
      this._responsiveListeners = void 0;
    }
    updateHoverStyle(items, mode, enabled) {
      const prefix = enabled ? "set" : "remove";
      let meta, item, i, ilen;
      if (mode === "dataset") {
        meta = this.getDatasetMeta(items[0].datasetIndex);
        meta.controller["_" + prefix + "DatasetHoverStyle"]();
      }
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        item = items[i];
        const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
        if (controller) {
          controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
        }
      }
    }
    getActiveElements() {
      return this._active || [];
    }
    setActiveElements(activeElements) {
      const lastActive = this._active || [];
      const active = activeElements.map(({ datasetIndex, index }) => {
        const meta = this.getDatasetMeta(datasetIndex);
        if (!meta) {
          throw new Error("No dataset found at index " + datasetIndex);
        }
        return {
          datasetIndex,
          element: meta.data[index],
          index
        };
      });
      const changed = !_elementsEqual(active, lastActive);
      if (changed) {
        this._active = active;
        this._updateHoverStyles(active, lastActive);
      }
    }
    notifyPlugins(hook, args, filter) {
      return this._plugins.notify(this, hook, args, filter);
    }
    _updateHoverStyles(active, lastActive, replay) {
      const hoverOptions = this.options.hover;
      const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
      const deactivated = diff(lastActive, active);
      const activated = replay ? active : diff(active, lastActive);
      if (deactivated.length) {
        this.updateHoverStyle(deactivated, hoverOptions.mode, false);
      }
      if (activated.length && hoverOptions.mode) {
        this.updateHoverStyle(activated, hoverOptions.mode, true);
      }
    }
    _eventHandler(e, replay) {
      const args = { event: e, replay, cancelable: true };
      const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
      if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
        return;
      }
      const changed = this._handleEvent(e, replay);
      args.cancelable = false;
      this.notifyPlugins("afterEvent", args, eventFilter);
      if (changed || args.changed) {
        this.render();
      }
      return this;
    }
    _handleEvent(e, replay) {
      const { _active: lastActive = [], options } = this;
      const hoverOptions = options.hover;
      const useFinalPosition = replay;
      let active = [];
      let changed = false;
      let lastEvent = null;
      if (e.type !== "mouseout") {
        active = this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
        lastEvent = e.type === "click" ? this._lastEvent : e;
      }
      this._lastEvent = null;
      if (_isPointInArea(e, this.chartArea, this._minPadding)) {
        callback(options.onHover, [e, active, this], this);
        if (e.type === "mouseup" || e.type === "click" || e.type === "contextmenu") {
          callback(options.onClick, [e, active, this], this);
        }
      }
      changed = !_elementsEqual(active, lastActive);
      if (changed || replay) {
        this._active = active;
        this._updateHoverStyles(active, lastActive, replay);
      }
      this._lastEvent = lastEvent;
      return changed;
    }
  };
  var invalidatePlugins = () => each(Chart.instances, (chart) => chart._plugins.invalidate());
  var enumerable = true;
  Object.defineProperties(Chart, {
    defaults: {
      enumerable,
      value: defaults
    },
    instances: {
      enumerable,
      value: instances
    },
    overrides: {
      enumerable,
      value: overrides
    },
    registry: {
      enumerable,
      value: registry
    },
    version: {
      enumerable,
      value: version
    },
    getChart: {
      enumerable,
      value: getChart
    },
    register: {
      enumerable,
      value: (...items) => {
        registry.add(...items);
        invalidatePlugins();
      }
    },
    unregister: {
      enumerable,
      value: (...items) => {
        registry.remove(...items);
        invalidatePlugins();
      }
    }
  });
  function clipArc(ctx2, element, endAngle) {
    const { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element;
    let angleMargin = pixelMargin / outerRadius;
    ctx2.beginPath();
    ctx2.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
    if (innerRadius > pixelMargin) {
      angleMargin = pixelMargin / innerRadius;
      ctx2.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
    } else {
      ctx2.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
    }
    ctx2.closePath();
    ctx2.clip();
  }
  function toRadiusCorners(value) {
    return _readValueToProps(value, ["outerStart", "outerEnd", "innerStart", "innerEnd"]);
  }
  function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
    const o = toRadiusCorners(arc.options.borderRadius);
    const halfThickness = (outerRadius - innerRadius) / 2;
    const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
    const computeOuterLimit = (val) => {
      const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
      return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
    };
    return {
      outerStart: computeOuterLimit(o.outerStart),
      outerEnd: computeOuterLimit(o.outerEnd),
      innerStart: _limitValue(o.innerStart, 0, innerLimit),
      innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
    };
  }
  function rThetaToXY(r, theta, x, y) {
    return {
      x: x + r * Math.cos(theta),
      y: y + r * Math.sin(theta)
    };
  }
  function pathArc(ctx2, element, offset, spacing, end) {
    const { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element;
    const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
    const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
    let spacingOffset = 0;
    const alpha = end - start;
    if (spacing) {
      const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
      const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
      const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
      const adjustedAngle = avNogSpacingRadius !== 0 ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha;
      spacingOffset = (alpha - adjustedAngle) / 2;
    }
    const beta = Math.max(1e-3, alpha * outerRadius - offset / PI) / outerRadius;
    const angleOffset = (alpha - beta) / 2;
    const startAngle = start + angleOffset + spacingOffset;
    const endAngle = end - angleOffset - spacingOffset;
    const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
    const outerStartAdjustedRadius = outerRadius - outerStart;
    const outerEndAdjustedRadius = outerRadius - outerEnd;
    const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
    const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
    const innerStartAdjustedRadius = innerRadius + innerStart;
    const innerEndAdjustedRadius = innerRadius + innerEnd;
    const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
    const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
    ctx2.beginPath();
    ctx2.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle);
    if (outerEnd > 0) {
      const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
      ctx2.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
    }
    const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
    ctx2.lineTo(p4.x, p4.y);
    if (innerEnd > 0) {
      const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
      ctx2.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
    }
    ctx2.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, startAngle + innerStart / innerRadius, true);
    if (innerStart > 0) {
      const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
      ctx2.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
    }
    const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
    ctx2.lineTo(p8.x, p8.y);
    if (outerStart > 0) {
      const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
      ctx2.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
    }
    ctx2.closePath();
  }
  function drawArc(ctx2, element, offset, spacing) {
    const { fullCircles, startAngle, circumference } = element;
    let endAngle = element.endAngle;
    if (fullCircles) {
      pathArc(ctx2, element, offset, spacing, startAngle + TAU);
      for (let i = 0; i < fullCircles; ++i) {
        ctx2.fill();
      }
      if (!isNaN(circumference)) {
        endAngle = startAngle + circumference % TAU;
        if (circumference % TAU === 0) {
          endAngle += TAU;
        }
      }
    }
    pathArc(ctx2, element, offset, spacing, endAngle);
    ctx2.fill();
    return endAngle;
  }
  function drawFullCircleBorders(ctx2, element, inner) {
    const { x, y, startAngle, pixelMargin, fullCircles } = element;
    const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
    const innerRadius = element.innerRadius + pixelMargin;
    let i;
    if (inner) {
      clipArc(ctx2, element, startAngle + TAU);
    }
    ctx2.beginPath();
    ctx2.arc(x, y, innerRadius, startAngle + TAU, startAngle, true);
    for (i = 0; i < fullCircles; ++i) {
      ctx2.stroke();
    }
    ctx2.beginPath();
    ctx2.arc(x, y, outerRadius, startAngle, startAngle + TAU);
    for (i = 0; i < fullCircles; ++i) {
      ctx2.stroke();
    }
  }
  function drawBorder(ctx2, element, offset, spacing, endAngle) {
    const { options } = element;
    const inner = options.borderAlign === "inner";
    if (!options.borderWidth) {
      return;
    }
    if (inner) {
      ctx2.lineWidth = options.borderWidth * 2;
      ctx2.lineJoin = "round";
    } else {
      ctx2.lineWidth = options.borderWidth;
      ctx2.lineJoin = "bevel";
    }
    if (element.fullCircles) {
      drawFullCircleBorders(ctx2, element, inner);
    }
    if (inner) {
      clipArc(ctx2, element, endAngle);
    }
    pathArc(ctx2, element, offset, spacing, endAngle);
    ctx2.stroke();
  }
  var ArcElement = class extends Element {
    constructor(cfg) {
      super();
      this.options = void 0;
      this.circumference = void 0;
      this.startAngle = void 0;
      this.endAngle = void 0;
      this.innerRadius = void 0;
      this.outerRadius = void 0;
      this.pixelMargin = 0;
      this.fullCircles = 0;
      if (cfg) {
        Object.assign(this, cfg);
      }
    }
    inRange(chartX, chartY, useFinalPosition) {
      const point = this.getProps(["x", "y"], useFinalPosition);
      const { angle, distance } = getAngleFromPoint(point, { x: chartX, y: chartY });
      const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
        "startAngle",
        "endAngle",
        "innerRadius",
        "outerRadius",
        "circumference"
      ], useFinalPosition);
      const rAdjust = this.options.spacing / 2;
      const betweenAngles = circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
      const withinRadius = distance >= innerRadius + rAdjust && distance <= outerRadius + rAdjust;
      return betweenAngles && withinRadius;
    }
    getCenterPoint(useFinalPosition) {
      const { x, y, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
        "x",
        "y",
        "startAngle",
        "endAngle",
        "innerRadius",
        "outerRadius",
        "circumference"
      ], useFinalPosition);
      const { offset, spacing } = this.options;
      const halfAngle = (startAngle + endAngle) / 2;
      const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
      return {
        x: x + Math.cos(halfAngle) * halfRadius,
        y: y + Math.sin(halfAngle) * halfRadius
      };
    }
    tooltipPosition(useFinalPosition) {
      return this.getCenterPoint(useFinalPosition);
    }
    draw(ctx2) {
      const { options, circumference } = this;
      const offset = (options.offset || 0) / 2;
      const spacing = (options.spacing || 0) / 2;
      this.pixelMargin = options.borderAlign === "inner" ? 0.33 : 0;
      this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
      if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
        return;
      }
      ctx2.save();
      let radiusOffset = 0;
      if (offset) {
        radiusOffset = offset / 2;
        const halfAngle = (this.startAngle + this.endAngle) / 2;
        ctx2.translate(Math.cos(halfAngle) * radiusOffset, Math.sin(halfAngle) * radiusOffset);
        if (this.circumference >= PI) {
          radiusOffset = offset;
        }
      }
      ctx2.fillStyle = options.backgroundColor;
      ctx2.strokeStyle = options.borderColor;
      const endAngle = drawArc(ctx2, this, radiusOffset, spacing);
      drawBorder(ctx2, this, radiusOffset, spacing, endAngle);
      ctx2.restore();
    }
  };
  ArcElement.id = "arc";
  ArcElement.defaults = {
    borderAlign: "center",
    borderColor: "#fff",
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0
  };
  ArcElement.defaultRoutes = {
    backgroundColor: "backgroundColor"
  };
  function setStyle(ctx2, options, style = options) {
    ctx2.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
    ctx2.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
    ctx2.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
    ctx2.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
    ctx2.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
    ctx2.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
  }
  function lineTo(ctx2, previous, target) {
    ctx2.lineTo(target.x, target.y);
  }
  function getLineMethod(options) {
    if (options.stepped) {
      return _steppedLineTo;
    }
    if (options.tension || options.cubicInterpolationMode === "monotone") {
      return _bezierCurveTo;
    }
    return lineTo;
  }
  function pathVars(points, segment, params = {}) {
    const count = points.length;
    const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
    const { start: segmentStart, end: segmentEnd } = segment;
    const start = Math.max(paramsStart, segmentStart);
    const end = Math.min(paramsEnd, segmentEnd);
    const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
    return {
      count,
      start,
      loop: segment.loop,
      ilen: end < start && !outside ? count + end - start : end - start
    };
  }
  function pathSegment(ctx2, line, segment, params) {
    const { points, options } = line;
    const { count, start, loop, ilen } = pathVars(points, segment, params);
    const lineMethod = getLineMethod(options);
    let { move = true, reverse } = params || {};
    let i, point, prev;
    for (i = 0; i <= ilen; ++i) {
      point = points[(start + (reverse ? ilen - i : i)) % count];
      if (point.skip) {
        continue;
      } else if (move) {
        ctx2.moveTo(point.x, point.y);
        move = false;
      } else {
        lineMethod(ctx2, prev, point, reverse, options.stepped);
      }
      prev = point;
    }
    if (loop) {
      point = points[(start + (reverse ? ilen : 0)) % count];
      lineMethod(ctx2, prev, point, reverse, options.stepped);
    }
    return !!loop;
  }
  function fastPathSegment(ctx2, line, segment, params) {
    const points = line.points;
    const { count, start, ilen } = pathVars(points, segment, params);
    const { move = true, reverse } = params || {};
    let avgX = 0;
    let countX = 0;
    let i, point, prevX, minY, maxY, lastY;
    const pointIndex = (index) => (start + (reverse ? ilen - index : index)) % count;
    const drawX = () => {
      if (minY !== maxY) {
        ctx2.lineTo(avgX, maxY);
        ctx2.lineTo(avgX, minY);
        ctx2.lineTo(avgX, lastY);
      }
    };
    if (move) {
      point = points[pointIndex(0)];
      ctx2.moveTo(point.x, point.y);
    }
    for (i = 0; i <= ilen; ++i) {
      point = points[pointIndex(i)];
      if (point.skip) {
        continue;
      }
      const x = point.x;
      const y = point.y;
      const truncX = x | 0;
      if (truncX === prevX) {
        if (y < minY) {
          minY = y;
        } else if (y > maxY) {
          maxY = y;
        }
        avgX = (countX * avgX + x) / ++countX;
      } else {
        drawX();
        ctx2.lineTo(x, y);
        prevX = truncX;
        countX = 0;
        minY = maxY = y;
      }
      lastY = y;
    }
    drawX();
  }
  function _getSegmentMethod(line) {
    const opts = line.options;
    const borderDash = opts.borderDash && opts.borderDash.length;
    const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== "monotone" && !opts.stepped && !borderDash;
    return useFastPath ? fastPathSegment : pathSegment;
  }
  function _getInterpolationMethod(options) {
    if (options.stepped) {
      return _steppedInterpolation;
    }
    if (options.tension || options.cubicInterpolationMode === "monotone") {
      return _bezierInterpolation;
    }
    return _pointInLine;
  }
  function strokePathWithCache(ctx2, line, start, count) {
    let path = line._path;
    if (!path) {
      path = line._path = new Path2D();
      if (line.path(path, start, count)) {
        path.closePath();
      }
    }
    setStyle(ctx2, line.options);
    ctx2.stroke(path);
  }
  function strokePathDirect(ctx2, line, start, count) {
    const { segments, options } = line;
    const segmentMethod = _getSegmentMethod(line);
    for (const segment of segments) {
      setStyle(ctx2, options, segment.style);
      ctx2.beginPath();
      if (segmentMethod(ctx2, line, segment, { start, end: start + count - 1 })) {
        ctx2.closePath();
      }
      ctx2.stroke();
    }
  }
  var usePath2D = typeof Path2D === "function";
  function draw(ctx2, line, start, count) {
    if (usePath2D && !line.options.segment) {
      strokePathWithCache(ctx2, line, start, count);
    } else {
      strokePathDirect(ctx2, line, start, count);
    }
  }
  var LineElement = class extends Element {
    constructor(cfg) {
      super();
      this.animated = true;
      this.options = void 0;
      this._chart = void 0;
      this._loop = void 0;
      this._fullLoop = void 0;
      this._path = void 0;
      this._points = void 0;
      this._segments = void 0;
      this._decimated = false;
      this._pointsUpdated = false;
      this._datasetIndex = void 0;
      if (cfg) {
        Object.assign(this, cfg);
      }
    }
    updateControlPoints(chartArea, indexAxis) {
      const options = this.options;
      if ((options.tension || options.cubicInterpolationMode === "monotone") && !options.stepped && !this._pointsUpdated) {
        const loop = options.spanGaps ? this._loop : this._fullLoop;
        _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
        this._pointsUpdated = true;
      }
    }
    set points(points) {
      this._points = points;
      delete this._segments;
      delete this._path;
      this._pointsUpdated = false;
    }
    get points() {
      return this._points;
    }
    get segments() {
      return this._segments || (this._segments = _computeSegments(this, this.options.segment));
    }
    first() {
      const segments = this.segments;
      const points = this.points;
      return segments.length && points[segments[0].start];
    }
    last() {
      const segments = this.segments;
      const points = this.points;
      const count = segments.length;
      return count && points[segments[count - 1].end];
    }
    interpolate(point, property) {
      const options = this.options;
      const value = point[property];
      const points = this.points;
      const segments = _boundSegments(this, { property, start: value, end: value });
      if (!segments.length) {
        return;
      }
      const result = [];
      const _interpolate = _getInterpolationMethod(options);
      let i, ilen;
      for (i = 0, ilen = segments.length; i < ilen; ++i) {
        const { start, end } = segments[i];
        const p1 = points[start];
        const p2 = points[end];
        if (p1 === p2) {
          result.push(p1);
          continue;
        }
        const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
        const interpolated = _interpolate(p1, p2, t, options.stepped);
        interpolated[property] = point[property];
        result.push(interpolated);
      }
      return result.length === 1 ? result[0] : result;
    }
    pathSegment(ctx2, segment, params) {
      const segmentMethod = _getSegmentMethod(this);
      return segmentMethod(ctx2, this, segment, params);
    }
    path(ctx2, start, count) {
      const segments = this.segments;
      const segmentMethod = _getSegmentMethod(this);
      let loop = this._loop;
      start = start || 0;
      count = count || this.points.length - start;
      for (const segment of segments) {
        loop &= segmentMethod(ctx2, this, segment, { start, end: start + count - 1 });
      }
      return !!loop;
    }
    draw(ctx2, chartArea, start, count) {
      const options = this.options || {};
      const points = this.points || [];
      if (points.length && options.borderWidth) {
        ctx2.save();
        draw(ctx2, this, start, count);
        ctx2.restore();
      }
      if (this.animated) {
        this._pointsUpdated = false;
        this._path = void 0;
      }
    }
  };
  LineElement.id = "line";
  LineElement.defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: true,
    cubicInterpolationMode: "default",
    fill: false,
    spanGaps: false,
    stepped: false,
    tension: 0
  };
  LineElement.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  LineElement.descriptors = {
    _scriptable: true,
    _indexable: (name) => name !== "borderDash" && name !== "fill"
  };
  function inRange$1(el, pos, axis, useFinalPosition) {
    const options = el.options;
    const { [axis]: value } = el.getProps([axis], useFinalPosition);
    return Math.abs(pos - value) < options.radius + options.hitRadius;
  }
  var PointElement = class extends Element {
    constructor(cfg) {
      super();
      this.options = void 0;
      this.parsed = void 0;
      this.skip = void 0;
      this.stop = void 0;
      if (cfg) {
        Object.assign(this, cfg);
      }
    }
    inRange(mouseX, mouseY, useFinalPosition) {
      const options = this.options;
      const { x, y } = this.getProps(["x", "y"], useFinalPosition);
      return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
    }
    inXRange(mouseX, useFinalPosition) {
      return inRange$1(this, mouseX, "x", useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
      return inRange$1(this, mouseY, "y", useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
      const { x, y } = this.getProps(["x", "y"], useFinalPosition);
      return { x, y };
    }
    size(options) {
      options = options || this.options || {};
      let radius = options.radius || 0;
      radius = Math.max(radius, radius && options.hoverRadius || 0);
      const borderWidth = radius && options.borderWidth || 0;
      return (radius + borderWidth) * 2;
    }
    draw(ctx2, area) {
      const options = this.options;
      if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
        return;
      }
      ctx2.strokeStyle = options.borderColor;
      ctx2.lineWidth = options.borderWidth;
      ctx2.fillStyle = options.backgroundColor;
      drawPoint(ctx2, options, this.x, this.y);
    }
    getRange() {
      const options = this.options || {};
      return options.radius + options.hitRadius;
    }
  };
  PointElement.id = "point";
  PointElement.defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0
  };
  PointElement.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  function getBarBounds(bar, useFinalPosition) {
    const { x, y, base, width, height } = bar.getProps(["x", "y", "base", "width", "height"], useFinalPosition);
    let left, right, top, bottom, half;
    if (bar.horizontal) {
      half = height / 2;
      left = Math.min(x, base);
      right = Math.max(x, base);
      top = y - half;
      bottom = y + half;
    } else {
      half = width / 2;
      left = x - half;
      right = x + half;
      top = Math.min(y, base);
      bottom = Math.max(y, base);
    }
    return { left, top, right, bottom };
  }
  function skipOrLimit(skip2, value, min, max) {
    return skip2 ? 0 : _limitValue(value, min, max);
  }
  function parseBorderWidth(bar, maxW, maxH) {
    const value = bar.options.borderWidth;
    const skip2 = bar.borderSkipped;
    const o = toTRBL(value);
    return {
      t: skipOrLimit(skip2.top, o.top, 0, maxH),
      r: skipOrLimit(skip2.right, o.right, 0, maxW),
      b: skipOrLimit(skip2.bottom, o.bottom, 0, maxH),
      l: skipOrLimit(skip2.left, o.left, 0, maxW)
    };
  }
  function parseBorderRadius(bar, maxW, maxH) {
    const { enableBorderRadius } = bar.getProps(["enableBorderRadius"]);
    const value = bar.options.borderRadius;
    const o = toTRBLCorners(value);
    const maxR = Math.min(maxW, maxH);
    const skip2 = bar.borderSkipped;
    const enableBorder = enableBorderRadius || isObject(value);
    return {
      topLeft: skipOrLimit(!enableBorder || skip2.top || skip2.left, o.topLeft, 0, maxR),
      topRight: skipOrLimit(!enableBorder || skip2.top || skip2.right, o.topRight, 0, maxR),
      bottomLeft: skipOrLimit(!enableBorder || skip2.bottom || skip2.left, o.bottomLeft, 0, maxR),
      bottomRight: skipOrLimit(!enableBorder || skip2.bottom || skip2.right, o.bottomRight, 0, maxR)
    };
  }
  function boundingRects(bar) {
    const bounds = getBarBounds(bar);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const border = parseBorderWidth(bar, width / 2, height / 2);
    const radius = parseBorderRadius(bar, width / 2, height / 2);
    return {
      outer: {
        x: bounds.left,
        y: bounds.top,
        w: width,
        h: height,
        radius
      },
      inner: {
        x: bounds.left + border.l,
        y: bounds.top + border.t,
        w: width - border.l - border.r,
        h: height - border.t - border.b,
        radius: {
          topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
          topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
          bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
          bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
        }
      }
    };
  }
  function inRange(bar, x, y, useFinalPosition) {
    const skipX = x === null;
    const skipY = y === null;
    const skipBoth = skipX && skipY;
    const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
    return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
  }
  function hasRadius(radius) {
    return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
  }
  function addNormalRectPath(ctx2, rect) {
    ctx2.rect(rect.x, rect.y, rect.w, rect.h);
  }
  function inflateRect(rect, amount, refRect = {}) {
    const x = rect.x !== refRect.x ? -amount : 0;
    const y = rect.y !== refRect.y ? -amount : 0;
    const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
    const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
    return {
      x: rect.x + x,
      y: rect.y + y,
      w: rect.w + w,
      h: rect.h + h,
      radius: rect.radius
    };
  }
  var BarElement = class extends Element {
    constructor(cfg) {
      super();
      this.options = void 0;
      this.horizontal = void 0;
      this.base = void 0;
      this.width = void 0;
      this.height = void 0;
      this.inflateAmount = void 0;
      if (cfg) {
        Object.assign(this, cfg);
      }
    }
    draw(ctx2) {
      const { inflateAmount, options: { borderColor, backgroundColor } } = this;
      const { inner, outer } = boundingRects(this);
      const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
      ctx2.save();
      if (outer.w !== inner.w || outer.h !== inner.h) {
        ctx2.beginPath();
        addRectPath(ctx2, inflateRect(outer, inflateAmount, inner));
        ctx2.clip();
        addRectPath(ctx2, inflateRect(inner, -inflateAmount, outer));
        ctx2.fillStyle = borderColor;
        ctx2.fill("evenodd");
      }
      ctx2.beginPath();
      addRectPath(ctx2, inflateRect(inner, inflateAmount));
      ctx2.fillStyle = backgroundColor;
      ctx2.fill();
      ctx2.restore();
    }
    inRange(mouseX, mouseY, useFinalPosition) {
      return inRange(this, mouseX, mouseY, useFinalPosition);
    }
    inXRange(mouseX, useFinalPosition) {
      return inRange(this, mouseX, null, useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
      return inRange(this, null, mouseY, useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
      const { x, y, base, horizontal } = this.getProps(["x", "y", "base", "horizontal"], useFinalPosition);
      return {
        x: horizontal ? (x + base) / 2 : x,
        y: horizontal ? y : (y + base) / 2
      };
    }
    getRange(axis) {
      return axis === "x" ? this.width / 2 : this.height / 2;
    }
  };
  BarElement.id = "bar";
  BarElement.defaults = {
    borderSkipped: "start",
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: "auto",
    pointStyle: void 0
  };
  BarElement.defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  var elements = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ArcElement,
    LineElement,
    PointElement,
    BarElement
  });
  function lttbDecimation(data, start, count, availableWidth, options) {
    const samples = options.samples || availableWidth;
    if (samples >= count) {
      return data.slice(start, start + count);
    }
    const decimated = [];
    const bucketWidth = (count - 2) / (samples - 2);
    let sampledIndex = 0;
    const endIndex = start + count - 1;
    let a = start;
    let i, maxAreaPoint, maxArea, area, nextA;
    decimated[sampledIndex++] = data[a];
    for (i = 0; i < samples - 2; i++) {
      let avgX = 0;
      let avgY = 0;
      let j;
      const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
      const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
      const avgRangeLength = avgRangeEnd - avgRangeStart;
      for (j = avgRangeStart; j < avgRangeEnd; j++) {
        avgX += data[j].x;
        avgY += data[j].y;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;
      const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
      const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
      const { x: pointAx, y: pointAy } = data[a];
      maxArea = area = -1;
      for (j = rangeOffs; j < rangeTo; j++) {
        area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy));
        if (area > maxArea) {
          maxArea = area;
          maxAreaPoint = data[j];
          nextA = j;
        }
      }
      decimated[sampledIndex++] = maxAreaPoint;
      a = nextA;
    }
    decimated[sampledIndex++] = data[endIndex];
    return decimated;
  }
  function minMaxDecimation(data, start, count, availableWidth) {
    let avgX = 0;
    let countX = 0;
    let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
    const decimated = [];
    const endIndex = start + count - 1;
    const xMin = data[start].x;
    const xMax = data[endIndex].x;
    const dx = xMax - xMin;
    for (i = start; i < start + count; ++i) {
      point = data[i];
      x = (point.x - xMin) / dx * availableWidth;
      y = point.y;
      const truncX = x | 0;
      if (truncX === prevX) {
        if (y < minY) {
          minY = y;
          minIndex = i;
        } else if (y > maxY) {
          maxY = y;
          maxIndex = i;
        }
        avgX = (countX * avgX + point.x) / ++countX;
      } else {
        const lastIndex = i - 1;
        if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
          const intermediateIndex1 = Math.min(minIndex, maxIndex);
          const intermediateIndex2 = Math.max(minIndex, maxIndex);
          if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
            decimated.push({
              ...data[intermediateIndex1],
              x: avgX
            });
          }
          if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
            decimated.push({
              ...data[intermediateIndex2],
              x: avgX
            });
          }
        }
        if (i > 0 && lastIndex !== startIndex) {
          decimated.push(data[lastIndex]);
        }
        decimated.push(point);
        prevX = truncX;
        countX = 0;
        minY = maxY = y;
        minIndex = maxIndex = startIndex = i;
      }
    }
    return decimated;
  }
  function cleanDecimatedDataset(dataset) {
    if (dataset._decimated) {
      const data = dataset._data;
      delete dataset._decimated;
      delete dataset._data;
      Object.defineProperty(dataset, "data", { value: data });
    }
  }
  function cleanDecimatedData(chart) {
    chart.data.datasets.forEach((dataset) => {
      cleanDecimatedDataset(dataset);
    });
  }
  function getStartAndCountOfVisiblePointsSimplified(meta, points) {
    const pointCount = points.length;
    let start = 0;
    let count;
    const { iScale } = meta;
    const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
    if (minDefined) {
      start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
    }
    if (maxDefined) {
      count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
    return { start, count };
  }
  var plugin_decimation = {
    id: "decimation",
    defaults: {
      algorithm: "min-max",
      enabled: false
    },
    beforeElementsUpdate: (chart, args, options) => {
      if (!options.enabled) {
        cleanDecimatedData(chart);
        return;
      }
      const availableWidth = chart.width;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const { _data, indexAxis } = dataset;
        const meta = chart.getDatasetMeta(datasetIndex);
        const data = _data || dataset.data;
        if (resolve([indexAxis, chart.options.indexAxis]) === "y") {
          return;
        }
        if (meta.type !== "line") {
          return;
        }
        const xAxis = chart.scales[meta.xAxisID];
        if (xAxis.type !== "linear" && xAxis.type !== "time") {
          return;
        }
        if (chart.options.parsing) {
          return;
        }
        let { start, count } = getStartAndCountOfVisiblePointsSimplified(meta, data);
        const threshold = options.threshold || 4 * availableWidth;
        if (count <= threshold) {
          cleanDecimatedDataset(dataset);
          return;
        }
        if (isNullOrUndef(_data)) {
          dataset._data = data;
          delete dataset.data;
          Object.defineProperty(dataset, "data", {
            configurable: true,
            enumerable: true,
            get: function() {
              return this._decimated;
            },
            set: function(d) {
              this._data = d;
            }
          });
        }
        let decimated;
        switch (options.algorithm) {
          case "lttb":
            decimated = lttbDecimation(data, start, count, availableWidth, options);
            break;
          case "min-max":
            decimated = minMaxDecimation(data, start, count, availableWidth);
            break;
          default:
            throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
        }
        dataset._decimated = decimated;
      });
    },
    destroy(chart) {
      cleanDecimatedData(chart);
    }
  };
  function getLineByIndex(chart, index) {
    const meta = chart.getDatasetMeta(index);
    const visible = meta && chart.isDatasetVisible(index);
    return visible ? meta.dataset : null;
  }
  function parseFillOption(line) {
    const options = line.options;
    const fillOption = options.fill;
    let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
    if (fill === void 0) {
      fill = !!options.backgroundColor;
    }
    if (fill === false || fill === null) {
      return false;
    }
    if (fill === true) {
      return "origin";
    }
    return fill;
  }
  function decodeFill(line, index, count) {
    const fill = parseFillOption(line);
    if (isObject(fill)) {
      return isNaN(fill.value) ? false : fill;
    }
    let target = parseFloat(fill);
    if (isNumberFinite(target) && Math.floor(target) === target) {
      if (fill[0] === "-" || fill[0] === "+") {
        target = index + target;
      }
      if (target === index || target < 0 || target >= count) {
        return false;
      }
      return target;
    }
    return ["origin", "start", "end", "stack", "shape"].indexOf(fill) >= 0 && fill;
  }
  function computeLinearBoundary(source) {
    const { scale = {}, fill } = source;
    let target = null;
    let horizontal;
    if (fill === "start") {
      target = scale.bottom;
    } else if (fill === "end") {
      target = scale.top;
    } else if (isObject(fill)) {
      target = scale.getPixelForValue(fill.value);
    } else if (scale.getBasePixel) {
      target = scale.getBasePixel();
    }
    if (isNumberFinite(target)) {
      horizontal = scale.isHorizontal();
      return {
        x: horizontal ? target : null,
        y: horizontal ? null : target
      };
    }
    return null;
  }
  var simpleArc = class {
    constructor(opts) {
      this.x = opts.x;
      this.y = opts.y;
      this.radius = opts.radius;
    }
    pathSegment(ctx2, bounds, opts) {
      const { x, y, radius } = this;
      bounds = bounds || { start: 0, end: TAU };
      ctx2.arc(x, y, radius, bounds.end, bounds.start, true);
      return !opts.bounds;
    }
    interpolate(point) {
      const { x, y, radius } = this;
      const angle = point.angle;
      return {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        angle
      };
    }
  };
  function computeCircularBoundary(source) {
    const { scale, fill } = source;
    const options = scale.options;
    const length = scale.getLabels().length;
    const target = [];
    const start = options.reverse ? scale.max : scale.min;
    const end = options.reverse ? scale.min : scale.max;
    let i, center, value;
    if (fill === "start") {
      value = start;
    } else if (fill === "end") {
      value = end;
    } else if (isObject(fill)) {
      value = fill.value;
    } else {
      value = scale.getBaseValue();
    }
    if (options.grid.circular) {
      center = scale.getPointPositionForValue(0, start);
      return new simpleArc({
        x: center.x,
        y: center.y,
        radius: scale.getDistanceFromCenterForValue(value)
      });
    }
    for (i = 0; i < length; ++i) {
      target.push(scale.getPointPositionForValue(i, value));
    }
    return target;
  }
  function computeBoundary(source) {
    const scale = source.scale || {};
    if (scale.getPointPositionForValue) {
      return computeCircularBoundary(source);
    }
    return computeLinearBoundary(source);
  }
  function findSegmentEnd(start, end, points) {
    for (; end > start; end--) {
      const point = points[end];
      if (!isNaN(point.x) && !isNaN(point.y)) {
        break;
      }
    }
    return end;
  }
  function pointsFromSegments(boundary, line) {
    const { x = null, y = null } = boundary || {};
    const linePoints = line.points;
    const points = [];
    line.segments.forEach(({ start, end }) => {
      end = findSegmentEnd(start, end, linePoints);
      const first = linePoints[start];
      const last = linePoints[end];
      if (y !== null) {
        points.push({ x: first.x, y });
        points.push({ x: last.x, y });
      } else if (x !== null) {
        points.push({ x, y: first.y });
        points.push({ x, y: last.y });
      }
    });
    return points;
  }
  function buildStackLine(source) {
    const { scale, index, line } = source;
    const points = [];
    const segments = line.segments;
    const sourcePoints = line.points;
    const linesBelow = getLinesBelow(scale, index);
    linesBelow.push(createBoundaryLine({ x: null, y: scale.bottom }, line));
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = segment.start; j <= segment.end; j++) {
        addPointsBelow(points, sourcePoints[j], linesBelow);
      }
    }
    return new LineElement({ points, options: {} });
  }
  function getLinesBelow(scale, index) {
    const below = [];
    const metas = scale.getMatchingVisibleMetas("line");
    for (let i = 0; i < metas.length; i++) {
      const meta = metas[i];
      if (meta.index === index) {
        break;
      }
      if (!meta.hidden) {
        below.unshift(meta.dataset);
      }
    }
    return below;
  }
  function addPointsBelow(points, sourcePoint, linesBelow) {
    const postponed = [];
    for (let j = 0; j < linesBelow.length; j++) {
      const line = linesBelow[j];
      const { first, last, point } = findPoint(line, sourcePoint, "x");
      if (!point || first && last) {
        continue;
      }
      if (first) {
        postponed.unshift(point);
      } else {
        points.push(point);
        if (!last) {
          break;
        }
      }
    }
    points.push(...postponed);
  }
  function findPoint(line, sourcePoint, property) {
    const point = line.interpolate(sourcePoint, property);
    if (!point) {
      return {};
    }
    const pointValue = point[property];
    const segments = line.segments;
    const linePoints = line.points;
    let first = false;
    let last = false;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const firstValue = linePoints[segment.start][property];
      const lastValue = linePoints[segment.end][property];
      if (pointValue >= firstValue && pointValue <= lastValue) {
        first = pointValue === firstValue;
        last = pointValue === lastValue;
        break;
      }
    }
    return { first, last, point };
  }
  function getTarget(source) {
    const { chart, fill, line } = source;
    if (isNumberFinite(fill)) {
      return getLineByIndex(chart, fill);
    }
    if (fill === "stack") {
      return buildStackLine(source);
    }
    if (fill === "shape") {
      return true;
    }
    const boundary = computeBoundary(source);
    if (boundary instanceof simpleArc) {
      return boundary;
    }
    return createBoundaryLine(boundary, line);
  }
  function createBoundaryLine(boundary, line) {
    let points = [];
    let _loop = false;
    if (isArray(boundary)) {
      _loop = true;
      points = boundary;
    } else {
      points = pointsFromSegments(boundary, line);
    }
    return points.length ? new LineElement({
      points,
      options: { tension: 0 },
      _loop,
      _fullLoop: _loop
    }) : null;
  }
  function resolveTarget(sources, index, propagate) {
    const source = sources[index];
    let fill = source.fill;
    const visited = [index];
    let target;
    if (!propagate) {
      return fill;
    }
    while (fill !== false && visited.indexOf(fill) === -1) {
      if (!isNumberFinite(fill)) {
        return fill;
      }
      target = sources[fill];
      if (!target) {
        return false;
      }
      if (target.visible) {
        return fill;
      }
      visited.push(fill);
      fill = target.fill;
    }
    return false;
  }
  function _clip(ctx2, target, clipY) {
    ctx2.beginPath();
    target.path(ctx2);
    ctx2.lineTo(target.last().x, clipY);
    ctx2.lineTo(target.first().x, clipY);
    ctx2.closePath();
    ctx2.clip();
  }
  function getBounds(property, first, last, loop) {
    if (loop) {
      return;
    }
    let start = first[property];
    let end = last[property];
    if (property === "angle") {
      start = _normalizeAngle(start);
      end = _normalizeAngle(end);
    }
    return { property, start, end };
  }
  function _getEdge(a, b, prop, fn) {
    if (a && b) {
      return fn(a[prop], b[prop]);
    }
    return a ? a[prop] : b ? b[prop] : 0;
  }
  function _segments(line, target, property) {
    const segments = line.segments;
    const points = line.points;
    const tpoints = target.points;
    const parts = [];
    for (const segment of segments) {
      let { start, end } = segment;
      end = findSegmentEnd(start, end, points);
      const bounds = getBounds(property, points[start], points[end], segment.loop);
      if (!target.segments) {
        parts.push({
          source: segment,
          target: bounds,
          start: points[start],
          end: points[end]
        });
        continue;
      }
      const targetSegments = _boundSegments(target, bounds);
      for (const tgt of targetSegments) {
        const subBounds = getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
        const fillSources = _boundSegment(segment, points, subBounds);
        for (const fillSource of fillSources) {
          parts.push({
            source: fillSource,
            target: tgt,
            start: {
              [property]: _getEdge(bounds, subBounds, "start", Math.max)
            },
            end: {
              [property]: _getEdge(bounds, subBounds, "end", Math.min)
            }
          });
        }
      }
    }
    return parts;
  }
  function clipBounds(ctx2, scale, bounds) {
    const { top, bottom } = scale.chart.chartArea;
    const { property, start, end } = bounds || {};
    if (property === "x") {
      ctx2.beginPath();
      ctx2.rect(start, top, end - start, bottom - top);
      ctx2.clip();
    }
  }
  function interpolatedLineTo(ctx2, target, point, property) {
    const interpolatedPoint = target.interpolate(point, property);
    if (interpolatedPoint) {
      ctx2.lineTo(interpolatedPoint.x, interpolatedPoint.y);
    }
  }
  function _fill(ctx2, cfg) {
    const { line, target, property, color: color2, scale } = cfg;
    const segments = _segments(line, target, property);
    for (const { source: src, target: tgt, start, end } of segments) {
      const { style: { backgroundColor = color2 } = {} } = src;
      const notShape = target !== true;
      ctx2.save();
      ctx2.fillStyle = backgroundColor;
      clipBounds(ctx2, scale, notShape && getBounds(property, start, end));
      ctx2.beginPath();
      const lineLoop = !!line.pathSegment(ctx2, src);
      let loop;
      if (notShape) {
        if (lineLoop) {
          ctx2.closePath();
        } else {
          interpolatedLineTo(ctx2, target, end, property);
        }
        const targetLoop = !!target.pathSegment(ctx2, tgt, { move: lineLoop, reverse: true });
        loop = lineLoop && targetLoop;
        if (!loop) {
          interpolatedLineTo(ctx2, target, start, property);
        }
      }
      ctx2.closePath();
      ctx2.fill(loop ? "evenodd" : "nonzero");
      ctx2.restore();
    }
  }
  function doFill(ctx2, cfg) {
    const { line, target, above, below, area, scale } = cfg;
    const property = line._loop ? "angle" : cfg.axis;
    ctx2.save();
    if (property === "x" && below !== above) {
      _clip(ctx2, target, area.top);
      _fill(ctx2, { line, target, color: above, scale, property });
      ctx2.restore();
      ctx2.save();
      _clip(ctx2, target, area.bottom);
    }
    _fill(ctx2, { line, target, color: below, scale, property });
    ctx2.restore();
  }
  function drawfill(ctx2, source, area) {
    const target = getTarget(source);
    const { line, scale, axis } = source;
    const lineOpts = line.options;
    const fillOption = lineOpts.fill;
    const color2 = lineOpts.backgroundColor;
    const { above = color2, below = color2 } = fillOption || {};
    if (target && line.points.length) {
      clipArea(ctx2, area);
      doFill(ctx2, { line, target, above, below, area, scale, axis });
      unclipArea(ctx2);
    }
  }
  var plugin_filler = {
    id: "filler",
    afterDatasetsUpdate(chart, _args, options) {
      const count = (chart.data.datasets || []).length;
      const sources = [];
      let meta, i, line, source;
      for (i = 0; i < count; ++i) {
        meta = chart.getDatasetMeta(i);
        line = meta.dataset;
        source = null;
        if (line && line.options && line instanceof LineElement) {
          source = {
            visible: chart.isDatasetVisible(i),
            index: i,
            fill: decodeFill(line, i, count),
            chart,
            axis: meta.controller.options.indexAxis,
            scale: meta.vScale,
            line
          };
        }
        meta.$filler = source;
        sources.push(source);
      }
      for (i = 0; i < count; ++i) {
        source = sources[i];
        if (!source || source.fill === false) {
          continue;
        }
        source.fill = resolveTarget(sources, i, options.propagate);
      }
    },
    beforeDraw(chart, _args, options) {
      const draw2 = options.drawTime === "beforeDraw";
      const metasets = chart.getSortedVisibleDatasetMetas();
      const area = chart.chartArea;
      for (let i = metasets.length - 1; i >= 0; --i) {
        const source = metasets[i].$filler;
        if (!source) {
          continue;
        }
        source.line.updateControlPoints(area, source.axis);
        if (draw2) {
          drawfill(chart.ctx, source, area);
        }
      }
    },
    beforeDatasetsDraw(chart, _args, options) {
      if (options.drawTime !== "beforeDatasetsDraw") {
        return;
      }
      const metasets = chart.getSortedVisibleDatasetMetas();
      for (let i = metasets.length - 1; i >= 0; --i) {
        const source = metasets[i].$filler;
        if (source) {
          drawfill(chart.ctx, source, chart.chartArea);
        }
      }
    },
    beforeDatasetDraw(chart, args, options) {
      const source = args.meta.$filler;
      if (!source || source.fill === false || options.drawTime !== "beforeDatasetDraw") {
        return;
      }
      drawfill(chart.ctx, source, chart.chartArea);
    },
    defaults: {
      propagate: true,
      drawTime: "beforeDatasetDraw"
    }
  };
  var getBoxSize = (labelOpts, fontSize) => {
    let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
    if (labelOpts.usePointStyle) {
      boxHeight = Math.min(boxHeight, fontSize);
      boxWidth = Math.min(boxWidth, fontSize);
    }
    return {
      boxWidth,
      boxHeight,
      itemHeight: Math.max(fontSize, boxHeight)
    };
  };
  var itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
  var Legend = class extends Element {
    constructor(config) {
      super();
      this._added = false;
      this.legendHitBoxes = [];
      this._hoveredItem = null;
      this.doughnutMode = false;
      this.chart = config.chart;
      this.options = config.options;
      this.ctx = config.ctx;
      this.legendItems = void 0;
      this.columnSizes = void 0;
      this.lineWidths = void 0;
      this.maxHeight = void 0;
      this.maxWidth = void 0;
      this.top = void 0;
      this.bottom = void 0;
      this.left = void 0;
      this.right = void 0;
      this.height = void 0;
      this.width = void 0;
      this._margins = void 0;
      this.position = void 0;
      this.weight = void 0;
      this.fullSize = void 0;
    }
    update(maxWidth, maxHeight, margins) {
      this.maxWidth = maxWidth;
      this.maxHeight = maxHeight;
      this._margins = margins;
      this.setDimensions();
      this.buildLabels();
      this.fit();
    }
    setDimensions() {
      if (this.isHorizontal()) {
        this.width = this.maxWidth;
        this.left = this._margins.left;
        this.right = this.width;
      } else {
        this.height = this.maxHeight;
        this.top = this._margins.top;
        this.bottom = this.height;
      }
    }
    buildLabels() {
      const labelOpts = this.options.labels || {};
      let legendItems = callback(labelOpts.generateLabels, [this.chart], this) || [];
      if (labelOpts.filter) {
        legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
      }
      if (labelOpts.sort) {
        legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
      }
      if (this.options.reverse) {
        legendItems.reverse();
      }
      this.legendItems = legendItems;
    }
    fit() {
      const { options, ctx: ctx2 } = this;
      if (!options.display) {
        this.width = this.height = 0;
        return;
      }
      const labelOpts = options.labels;
      const labelFont = toFont(labelOpts.font);
      const fontSize = labelFont.size;
      const titleHeight = this._computeTitleHeight();
      const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
      let width, height;
      ctx2.font = labelFont.string;
      if (this.isHorizontal()) {
        width = this.maxWidth;
        height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
      } else {
        height = this.maxHeight;
        width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10;
      }
      this.width = Math.min(width, options.maxWidth || this.maxWidth);
      this.height = Math.min(height, options.maxHeight || this.maxHeight);
    }
    _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
      const { ctx: ctx2, maxWidth, options: { labels: { padding } } } = this;
      const hitboxes = this.legendHitBoxes = [];
      const lineWidths = this.lineWidths = [0];
      const lineHeight = itemHeight + padding;
      let totalHeight = titleHeight;
      ctx2.textAlign = "left";
      ctx2.textBaseline = "middle";
      let row = -1;
      let top = -lineHeight;
      this.legendItems.forEach((legendItem, i) => {
        const itemWidth = boxWidth + fontSize / 2 + ctx2.measureText(legendItem.text).width;
        if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
          totalHeight += lineHeight;
          lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
          top += lineHeight;
          row++;
        }
        hitboxes[i] = { left: 0, top, row, width: itemWidth, height: itemHeight };
        lineWidths[lineWidths.length - 1] += itemWidth + padding;
      });
      return totalHeight;
    }
    _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
      const { ctx: ctx2, maxHeight, options: { labels: { padding } } } = this;
      const hitboxes = this.legendHitBoxes = [];
      const columnSizes = this.columnSizes = [];
      const heightLimit = maxHeight - titleHeight;
      let totalWidth = padding;
      let currentColWidth = 0;
      let currentColHeight = 0;
      let left = 0;
      let col = 0;
      this.legendItems.forEach((legendItem, i) => {
        const itemWidth = boxWidth + fontSize / 2 + ctx2.measureText(legendItem.text).width;
        if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
          totalWidth += currentColWidth + padding;
          columnSizes.push({ width: currentColWidth, height: currentColHeight });
          left += currentColWidth + padding;
          col++;
          currentColWidth = currentColHeight = 0;
        }
        hitboxes[i] = { left, top: currentColHeight, col, width: itemWidth, height: itemHeight };
        currentColWidth = Math.max(currentColWidth, itemWidth);
        currentColHeight += itemHeight + padding;
      });
      totalWidth += currentColWidth;
      columnSizes.push({ width: currentColWidth, height: currentColHeight });
      return totalWidth;
    }
    adjustHitBoxes() {
      if (!this.options.display) {
        return;
      }
      const titleHeight = this._computeTitleHeight();
      const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
      const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
      if (this.isHorizontal()) {
        let row = 0;
        let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
        for (const hitbox of hitboxes) {
          if (row !== hitbox.row) {
            row = hitbox.row;
            left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
          }
          hitbox.top += this.top + titleHeight + padding;
          hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
          left += hitbox.width + padding;
        }
      } else {
        let col = 0;
        let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
        for (const hitbox of hitboxes) {
          if (hitbox.col !== col) {
            col = hitbox.col;
            top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
          }
          hitbox.top = top;
          hitbox.left += this.left + padding;
          hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
          top += hitbox.height + padding;
        }
      }
    }
    isHorizontal() {
      return this.options.position === "top" || this.options.position === "bottom";
    }
    draw() {
      if (this.options.display) {
        const ctx2 = this.ctx;
        clipArea(ctx2, this);
        this._draw();
        unclipArea(ctx2);
      }
    }
    _draw() {
      const { options: opts, columnSizes, lineWidths, ctx: ctx2 } = this;
      const { align, labels: labelOpts } = opts;
      const defaultColor = defaults.color;
      const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
      const labelFont = toFont(labelOpts.font);
      const { color: fontColor, padding } = labelOpts;
      const fontSize = labelFont.size;
      const halfFontSize = fontSize / 2;
      let cursor;
      this.drawTitle();
      ctx2.textAlign = rtlHelper.textAlign("left");
      ctx2.textBaseline = "middle";
      ctx2.lineWidth = 0.5;
      ctx2.font = labelFont.string;
      const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
      const drawLegendBox = function(x, y, legendItem) {
        if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
          return;
        }
        ctx2.save();
        const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
        ctx2.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
        ctx2.lineCap = valueOrDefault(legendItem.lineCap, "butt");
        ctx2.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
        ctx2.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
        ctx2.lineWidth = lineWidth;
        ctx2.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
        ctx2.setLineDash(valueOrDefault(legendItem.lineDash, []));
        if (labelOpts.usePointStyle) {
          const drawOptions = {
            radius: boxWidth * Math.SQRT2 / 2,
            pointStyle: legendItem.pointStyle,
            rotation: legendItem.rotation,
            borderWidth: lineWidth
          };
          const centerX = rtlHelper.xPlus(x, boxWidth / 2);
          const centerY = y + halfFontSize;
          drawPoint(ctx2, drawOptions, centerX, centerY);
        } else {
          const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
          const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
          const borderRadius = toTRBLCorners(legendItem.borderRadius);
          ctx2.beginPath();
          if (Object.values(borderRadius).some((v) => v !== 0)) {
            addRoundedRectPath(ctx2, {
              x: xBoxLeft,
              y: yBoxTop,
              w: boxWidth,
              h: boxHeight,
              radius: borderRadius
            });
          } else {
            ctx2.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
          }
          ctx2.fill();
          if (lineWidth !== 0) {
            ctx2.stroke();
          }
        }
        ctx2.restore();
      };
      const fillText = function(x, y, legendItem) {
        renderText(ctx2, legendItem.text, x, y + itemHeight / 2, labelFont, {
          strikethrough: legendItem.hidden,
          textAlign: rtlHelper.textAlign(legendItem.textAlign)
        });
      };
      const isHorizontal = this.isHorizontal();
      const titleHeight = this._computeTitleHeight();
      if (isHorizontal) {
        cursor = {
          x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
          y: this.top + padding + titleHeight,
          line: 0
        };
      } else {
        cursor = {
          x: this.left + padding,
          y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
          line: 0
        };
      }
      overrideTextDirection(this.ctx, opts.textDirection);
      const lineHeight = itemHeight + padding;
      this.legendItems.forEach((legendItem, i) => {
        ctx2.strokeStyle = legendItem.fontColor || fontColor;
        ctx2.fillStyle = legendItem.fontColor || fontColor;
        const textWidth = ctx2.measureText(legendItem.text).width;
        const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
        const width = boxWidth + halfFontSize + textWidth;
        let x = cursor.x;
        let y = cursor.y;
        rtlHelper.setWidth(this.width);
        if (isHorizontal) {
          if (i > 0 && x + width + padding > this.right) {
            y = cursor.y += lineHeight;
            cursor.line++;
            x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
          }
        } else if (i > 0 && y + lineHeight > this.bottom) {
          x = cursor.x = x + columnSizes[cursor.line].width + padding;
          cursor.line++;
          y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
        }
        const realX = rtlHelper.x(x);
        drawLegendBox(realX, y, legendItem);
        x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
        fillText(rtlHelper.x(x), y, legendItem);
        if (isHorizontal) {
          cursor.x += width + padding;
        } else {
          cursor.y += lineHeight;
        }
      });
      restoreTextDirection(this.ctx, opts.textDirection);
    }
    drawTitle() {
      const opts = this.options;
      const titleOpts = opts.title;
      const titleFont = toFont(titleOpts.font);
      const titlePadding = toPadding(titleOpts.padding);
      if (!titleOpts.display) {
        return;
      }
      const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
      const ctx2 = this.ctx;
      const position = titleOpts.position;
      const halfFontSize = titleFont.size / 2;
      const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
      let y;
      let left = this.left;
      let maxWidth = this.width;
      if (this.isHorizontal()) {
        maxWidth = Math.max(...this.lineWidths);
        y = this.top + topPaddingPlusHalfFontSize;
        left = _alignStartEnd(opts.align, left, this.right - maxWidth);
      } else {
        const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
        y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
      }
      const x = _alignStartEnd(position, left, left + maxWidth);
      ctx2.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
      ctx2.textBaseline = "middle";
      ctx2.strokeStyle = titleOpts.color;
      ctx2.fillStyle = titleOpts.color;
      ctx2.font = titleFont.string;
      renderText(ctx2, titleOpts.text, x, y, titleFont);
    }
    _computeTitleHeight() {
      const titleOpts = this.options.title;
      const titleFont = toFont(titleOpts.font);
      const titlePadding = toPadding(titleOpts.padding);
      return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
    }
    _getLegendItemAt(x, y) {
      let i, hitBox, lh;
      if (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom) {
        lh = this.legendHitBoxes;
        for (i = 0; i < lh.length; ++i) {
          hitBox = lh[i];
          if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
            return this.legendItems[i];
          }
        }
      }
      return null;
    }
    handleEvent(e) {
      const opts = this.options;
      if (!isListened(e.type, opts)) {
        return;
      }
      const hoveredItem = this._getLegendItemAt(e.x, e.y);
      if (e.type === "mousemove") {
        const previous = this._hoveredItem;
        const sameItem = itemsEqual(previous, hoveredItem);
        if (previous && !sameItem) {
          callback(opts.onLeave, [e, previous, this], this);
        }
        this._hoveredItem = hoveredItem;
        if (hoveredItem && !sameItem) {
          callback(opts.onHover, [e, hoveredItem, this], this);
        }
      } else if (hoveredItem) {
        callback(opts.onClick, [e, hoveredItem, this], this);
      }
    }
  };
  function isListened(type, opts) {
    if (type === "mousemove" && (opts.onHover || opts.onLeave)) {
      return true;
    }
    if (opts.onClick && (type === "click" || type === "mouseup")) {
      return true;
    }
    return false;
  }
  var plugin_legend = {
    id: "legend",
    _element: Legend,
    start(chart, _args, options) {
      const legend = chart.legend = new Legend({ ctx: chart.ctx, options, chart });
      layouts.configure(chart, legend, options);
      layouts.addBox(chart, legend);
    },
    stop(chart) {
      layouts.removeBox(chart, chart.legend);
      delete chart.legend;
    },
    beforeUpdate(chart, _args, options) {
      const legend = chart.legend;
      layouts.configure(chart, legend, options);
      legend.options = options;
    },
    afterUpdate(chart) {
      const legend = chart.legend;
      legend.buildLabels();
      legend.adjustHitBoxes();
    },
    afterEvent(chart, args) {
      if (!args.replay) {
        chart.legend.handleEvent(args.event);
      }
    },
    defaults: {
      display: true,
      position: "top",
      align: "center",
      fullSize: true,
      reverse: false,
      weight: 1e3,
      onClick(e, legendItem, legend) {
        const index = legendItem.datasetIndex;
        const ci = legend.chart;
        if (ci.isDatasetVisible(index)) {
          ci.hide(index);
          legendItem.hidden = true;
        } else {
          ci.show(index);
          legendItem.hidden = false;
        }
      },
      onHover: null,
      onLeave: null,
      labels: {
        color: (ctx2) => ctx2.chart.options.color,
        boxWidth: 40,
        padding: 10,
        generateLabels(chart) {
          const datasets = chart.data.datasets;
          const { labels: { usePointStyle, pointStyle, textAlign, color: color2 } } = chart.legend.options;
          return chart._getSortedDatasetMetas().map((meta) => {
            const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
            const borderWidth = toPadding(style.borderWidth);
            return {
              text: datasets[meta.index].label,
              fillStyle: style.backgroundColor,
              fontColor: color2,
              hidden: !meta.visible,
              lineCap: style.borderCapStyle,
              lineDash: style.borderDash,
              lineDashOffset: style.borderDashOffset,
              lineJoin: style.borderJoinStyle,
              lineWidth: (borderWidth.width + borderWidth.height) / 4,
              strokeStyle: style.borderColor,
              pointStyle: pointStyle || style.pointStyle,
              rotation: style.rotation,
              textAlign: textAlign || style.textAlign,
              borderRadius: 0,
              datasetIndex: meta.index
            };
          }, this);
        }
      },
      title: {
        color: (ctx2) => ctx2.chart.options.color,
        display: false,
        position: "center",
        text: ""
      }
    },
    descriptors: {
      _scriptable: (name) => !name.startsWith("on"),
      labels: {
        _scriptable: (name) => !["generateLabels", "filter", "sort"].includes(name)
      }
    }
  };
  var Title = class extends Element {
    constructor(config) {
      super();
      this.chart = config.chart;
      this.options = config.options;
      this.ctx = config.ctx;
      this._padding = void 0;
      this.top = void 0;
      this.bottom = void 0;
      this.left = void 0;
      this.right = void 0;
      this.width = void 0;
      this.height = void 0;
      this.position = void 0;
      this.weight = void 0;
      this.fullSize = void 0;
    }
    update(maxWidth, maxHeight) {
      const opts = this.options;
      this.left = 0;
      this.top = 0;
      if (!opts.display) {
        this.width = this.height = this.right = this.bottom = 0;
        return;
      }
      this.width = this.right = maxWidth;
      this.height = this.bottom = maxHeight;
      const lineCount = isArray(opts.text) ? opts.text.length : 1;
      this._padding = toPadding(opts.padding);
      const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
      if (this.isHorizontal()) {
        this.height = textSize;
      } else {
        this.width = textSize;
      }
    }
    isHorizontal() {
      const pos = this.options.position;
      return pos === "top" || pos === "bottom";
    }
    _drawArgs(offset) {
      const { top, left, bottom, right, options } = this;
      const align = options.align;
      let rotation = 0;
      let maxWidth, titleX, titleY;
      if (this.isHorizontal()) {
        titleX = _alignStartEnd(align, left, right);
        titleY = top + offset;
        maxWidth = right - left;
      } else {
        if (options.position === "left") {
          titleX = left + offset;
          titleY = _alignStartEnd(align, bottom, top);
          rotation = PI * -0.5;
        } else {
          titleX = right - offset;
          titleY = _alignStartEnd(align, top, bottom);
          rotation = PI * 0.5;
        }
        maxWidth = bottom - top;
      }
      return { titleX, titleY, maxWidth, rotation };
    }
    draw() {
      const ctx2 = this.ctx;
      const opts = this.options;
      if (!opts.display) {
        return;
      }
      const fontOpts = toFont(opts.font);
      const lineHeight = fontOpts.lineHeight;
      const offset = lineHeight / 2 + this._padding.top;
      const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
      renderText(ctx2, opts.text, 0, 0, fontOpts, {
        color: opts.color,
        maxWidth,
        rotation,
        textAlign: _toLeftRightCenter(opts.align),
        textBaseline: "middle",
        translation: [titleX, titleY]
      });
    }
  };
  function createTitle(chart, titleOpts) {
    const title = new Title({
      ctx: chart.ctx,
      options: titleOpts,
      chart
    });
    layouts.configure(chart, title, titleOpts);
    layouts.addBox(chart, title);
    chart.titleBlock = title;
  }
  var plugin_title = {
    id: "title",
    _element: Title,
    start(chart, _args, options) {
      createTitle(chart, options);
    },
    stop(chart) {
      const titleBlock = chart.titleBlock;
      layouts.removeBox(chart, titleBlock);
      delete chart.titleBlock;
    },
    beforeUpdate(chart, _args, options) {
      const title = chart.titleBlock;
      layouts.configure(chart, title, options);
      title.options = options;
    },
    defaults: {
      align: "center",
      display: false,
      font: {
        weight: "bold"
      },
      fullSize: true,
      padding: 10,
      position: "top",
      text: "",
      weight: 2e3
    },
    defaultRoutes: {
      color: "color"
    },
    descriptors: {
      _scriptable: true,
      _indexable: false
    }
  };
  var map2 = new WeakMap();
  var plugin_subtitle = {
    id: "subtitle",
    start(chart, _args, options) {
      const title = new Title({
        ctx: chart.ctx,
        options,
        chart
      });
      layouts.configure(chart, title, options);
      layouts.addBox(chart, title);
      map2.set(chart, title);
    },
    stop(chart) {
      layouts.removeBox(chart, map2.get(chart));
      map2.delete(chart);
    },
    beforeUpdate(chart, _args, options) {
      const title = map2.get(chart);
      layouts.configure(chart, title, options);
      title.options = options;
    },
    defaults: {
      align: "center",
      display: false,
      font: {
        weight: "normal"
      },
      fullSize: true,
      padding: 0,
      position: "top",
      text: "",
      weight: 1500
    },
    defaultRoutes: {
      color: "color"
    },
    descriptors: {
      _scriptable: true,
      _indexable: false
    }
  };
  var positioners = {
    average(items) {
      if (!items.length) {
        return false;
      }
      let i, len;
      let x = 0;
      let y = 0;
      let count = 0;
      for (i = 0, len = items.length; i < len; ++i) {
        const el = items[i].element;
        if (el && el.hasValue()) {
          const pos = el.tooltipPosition();
          x += pos.x;
          y += pos.y;
          ++count;
        }
      }
      return {
        x: x / count,
        y: y / count
      };
    },
    nearest(items, eventPosition) {
      if (!items.length) {
        return false;
      }
      let x = eventPosition.x;
      let y = eventPosition.y;
      let minDistance = Number.POSITIVE_INFINITY;
      let i, len, nearestElement;
      for (i = 0, len = items.length; i < len; ++i) {
        const el = items[i].element;
        if (el && el.hasValue()) {
          const center = el.getCenterPoint();
          const d = distanceBetweenPoints(eventPosition, center);
          if (d < minDistance) {
            minDistance = d;
            nearestElement = el;
          }
        }
      }
      if (nearestElement) {
        const tp = nearestElement.tooltipPosition();
        x = tp.x;
        y = tp.y;
      }
      return {
        x,
        y
      };
    }
  };
  function pushOrConcat(base, toPush) {
    if (toPush) {
      if (isArray(toPush)) {
        Array.prototype.push.apply(base, toPush);
      } else {
        base.push(toPush);
      }
    }
    return base;
  }
  function splitNewlines(str) {
    if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
      return str.split("\n");
    }
    return str;
  }
  function createTooltipItem(chart, item) {
    const { element, datasetIndex, index } = item;
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    const { label, value } = controller.getLabelAndValue(index);
    return {
      chart,
      label,
      parsed: controller.getParsed(index),
      raw: chart.data.datasets[datasetIndex].data[index],
      formattedValue: value,
      dataset: controller.getDataset(),
      dataIndex: index,
      datasetIndex,
      element
    };
  }
  function getTooltipSize(tooltip, options) {
    const ctx2 = tooltip._chart.ctx;
    const { body, footer, title } = tooltip;
    const { boxWidth, boxHeight } = options;
    const bodyFont = toFont(options.bodyFont);
    const titleFont = toFont(options.titleFont);
    const footerFont = toFont(options.footerFont);
    const titleLineCount = title.length;
    const footerLineCount = footer.length;
    const bodyLineItemCount = body.length;
    const padding = toPadding(options.padding);
    let height = padding.height;
    let width = 0;
    let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
    combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
    if (titleLineCount) {
      height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
    }
    if (combinedBodyLength) {
      const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
      height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
    }
    if (footerLineCount) {
      height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
    }
    let widthPadding = 0;
    const maxLineWidth = function(line) {
      width = Math.max(width, ctx2.measureText(line).width + widthPadding);
    };
    ctx2.save();
    ctx2.font = titleFont.string;
    each(tooltip.title, maxLineWidth);
    ctx2.font = bodyFont.string;
    each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
    widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
    each(body, (bodyItem) => {
      each(bodyItem.before, maxLineWidth);
      each(bodyItem.lines, maxLineWidth);
      each(bodyItem.after, maxLineWidth);
    });
    widthPadding = 0;
    ctx2.font = footerFont.string;
    each(tooltip.footer, maxLineWidth);
    ctx2.restore();
    width += padding.width;
    return { width, height };
  }
  function determineYAlign(chart, size) {
    const { y, height } = size;
    if (y < height / 2) {
      return "top";
    } else if (y > chart.height - height / 2) {
      return "bottom";
    }
    return "center";
  }
  function doesNotFitWithAlign(xAlign, chart, options, size) {
    const { x, width } = size;
    const caret = options.caretSize + options.caretPadding;
    if (xAlign === "left" && x + width + caret > chart.width) {
      return true;
    }
    if (xAlign === "right" && x - width - caret < 0) {
      return true;
    }
  }
  function determineXAlign(chart, options, size, yAlign) {
    const { x, width } = size;
    const { width: chartWidth, chartArea: { left, right } } = chart;
    let xAlign = "center";
    if (yAlign === "center") {
      xAlign = x <= (left + right) / 2 ? "left" : "right";
    } else if (x <= width / 2) {
      xAlign = "left";
    } else if (x >= chartWidth - width / 2) {
      xAlign = "right";
    }
    if (doesNotFitWithAlign(xAlign, chart, options, size)) {
      xAlign = "center";
    }
    return xAlign;
  }
  function determineAlignment(chart, options, size) {
    const yAlign = options.yAlign || determineYAlign(chart, size);
    return {
      xAlign: options.xAlign || determineXAlign(chart, options, size, yAlign),
      yAlign
    };
  }
  function alignX(size, xAlign) {
    let { x, width } = size;
    if (xAlign === "right") {
      x -= width;
    } else if (xAlign === "center") {
      x -= width / 2;
    }
    return x;
  }
  function alignY(size, yAlign, paddingAndSize) {
    let { y, height } = size;
    if (yAlign === "top") {
      y += paddingAndSize;
    } else if (yAlign === "bottom") {
      y -= height + paddingAndSize;
    } else {
      y -= height / 2;
    }
    return y;
  }
  function getBackgroundPoint(options, size, alignment, chart) {
    const { caretSize, caretPadding, cornerRadius } = options;
    const { xAlign, yAlign } = alignment;
    const paddingAndSize = caretSize + caretPadding;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
    let x = alignX(size, xAlign);
    const y = alignY(size, yAlign, paddingAndSize);
    if (yAlign === "center") {
      if (xAlign === "left") {
        x += paddingAndSize;
      } else if (xAlign === "right") {
        x -= paddingAndSize;
      }
    } else if (xAlign === "left") {
      x -= Math.max(topLeft, bottomLeft) + caretPadding;
    } else if (xAlign === "right") {
      x += Math.max(topRight, bottomRight) + caretPadding;
    }
    return {
      x: _limitValue(x, 0, chart.width - size.width),
      y: _limitValue(y, 0, chart.height - size.height)
    };
  }
  function getAlignedX(tooltip, align, options) {
    const padding = toPadding(options.padding);
    return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
  }
  function getBeforeAfterBodyLines(callback2) {
    return pushOrConcat([], splitNewlines(callback2));
  }
  function createTooltipContext(parent, tooltip, tooltipItems) {
    return createContext(parent, {
      tooltip,
      tooltipItems,
      type: "tooltip"
    });
  }
  function overrideCallbacks(callbacks, context) {
    const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
    return override ? callbacks.override(override) : callbacks;
  }
  var Tooltip = class extends Element {
    constructor(config) {
      super();
      this.opacity = 0;
      this._active = [];
      this._chart = config._chart;
      this._eventPosition = void 0;
      this._size = void 0;
      this._cachedAnimations = void 0;
      this._tooltipItems = [];
      this.$animations = void 0;
      this.$context = void 0;
      this.options = config.options;
      this.dataPoints = void 0;
      this.title = void 0;
      this.beforeBody = void 0;
      this.body = void 0;
      this.afterBody = void 0;
      this.footer = void 0;
      this.xAlign = void 0;
      this.yAlign = void 0;
      this.x = void 0;
      this.y = void 0;
      this.height = void 0;
      this.width = void 0;
      this.caretX = void 0;
      this.caretY = void 0;
      this.labelColors = void 0;
      this.labelPointStyles = void 0;
      this.labelTextColors = void 0;
    }
    initialize(options) {
      this.options = options;
      this._cachedAnimations = void 0;
      this.$context = void 0;
    }
    _resolveAnimations() {
      const cached = this._cachedAnimations;
      if (cached) {
        return cached;
      }
      const chart = this._chart;
      const options = this.options.setContext(this.getContext());
      const opts = options.enabled && chart.options.animation && options.animations;
      const animations = new Animations(this._chart, opts);
      if (opts._cacheable) {
        this._cachedAnimations = Object.freeze(animations);
      }
      return animations;
    }
    getContext() {
      return this.$context || (this.$context = createTooltipContext(this._chart.getContext(), this, this._tooltipItems));
    }
    getTitle(context, options) {
      const { callbacks } = options;
      const beforeTitle = callbacks.beforeTitle.apply(this, [context]);
      const title = callbacks.title.apply(this, [context]);
      const afterTitle = callbacks.afterTitle.apply(this, [context]);
      let lines = [];
      lines = pushOrConcat(lines, splitNewlines(beforeTitle));
      lines = pushOrConcat(lines, splitNewlines(title));
      lines = pushOrConcat(lines, splitNewlines(afterTitle));
      return lines;
    }
    getBeforeBody(tooltipItems, options) {
      return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [tooltipItems]));
    }
    getBody(tooltipItems, options) {
      const { callbacks } = options;
      const bodyItems = [];
      each(tooltipItems, (context) => {
        const bodyItem = {
          before: [],
          lines: [],
          after: []
        };
        const scoped = overrideCallbacks(callbacks, context);
        pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(this, context)));
        pushOrConcat(bodyItem.lines, scoped.label.call(this, context));
        pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(this, context)));
        bodyItems.push(bodyItem);
      });
      return bodyItems;
    }
    getAfterBody(tooltipItems, options) {
      return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [tooltipItems]));
    }
    getFooter(tooltipItems, options) {
      const { callbacks } = options;
      const beforeFooter = callbacks.beforeFooter.apply(this, [tooltipItems]);
      const footer = callbacks.footer.apply(this, [tooltipItems]);
      const afterFooter = callbacks.afterFooter.apply(this, [tooltipItems]);
      let lines = [];
      lines = pushOrConcat(lines, splitNewlines(beforeFooter));
      lines = pushOrConcat(lines, splitNewlines(footer));
      lines = pushOrConcat(lines, splitNewlines(afterFooter));
      return lines;
    }
    _createItems(options) {
      const active = this._active;
      const data = this._chart.data;
      const labelColors = [];
      const labelPointStyles = [];
      const labelTextColors = [];
      let tooltipItems = [];
      let i, len;
      for (i = 0, len = active.length; i < len; ++i) {
        tooltipItems.push(createTooltipItem(this._chart, active[i]));
      }
      if (options.filter) {
        tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
      }
      if (options.itemSort) {
        tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
      }
      each(tooltipItems, (context) => {
        const scoped = overrideCallbacks(options.callbacks, context);
        labelColors.push(scoped.labelColor.call(this, context));
        labelPointStyles.push(scoped.labelPointStyle.call(this, context));
        labelTextColors.push(scoped.labelTextColor.call(this, context));
      });
      this.labelColors = labelColors;
      this.labelPointStyles = labelPointStyles;
      this.labelTextColors = labelTextColors;
      this.dataPoints = tooltipItems;
      return tooltipItems;
    }
    update(changed, replay) {
      const options = this.options.setContext(this.getContext());
      const active = this._active;
      let properties;
      let tooltipItems = [];
      if (!active.length) {
        if (this.opacity !== 0) {
          properties = {
            opacity: 0
          };
        }
      } else {
        const position = positioners[options.position].call(this, active, this._eventPosition);
        tooltipItems = this._createItems(options);
        this.title = this.getTitle(tooltipItems, options);
        this.beforeBody = this.getBeforeBody(tooltipItems, options);
        this.body = this.getBody(tooltipItems, options);
        this.afterBody = this.getAfterBody(tooltipItems, options);
        this.footer = this.getFooter(tooltipItems, options);
        const size = this._size = getTooltipSize(this, options);
        const positionAndSize = Object.assign({}, position, size);
        const alignment = determineAlignment(this._chart, options, positionAndSize);
        const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this._chart);
        this.xAlign = alignment.xAlign;
        this.yAlign = alignment.yAlign;
        properties = {
          opacity: 1,
          x: backgroundPoint.x,
          y: backgroundPoint.y,
          width: size.width,
          height: size.height,
          caretX: position.x,
          caretY: position.y
        };
      }
      this._tooltipItems = tooltipItems;
      this.$context = void 0;
      if (properties) {
        this._resolveAnimations().update(this, properties);
      }
      if (changed && options.external) {
        options.external.call(this, { chart: this._chart, tooltip: this, replay });
      }
    }
    drawCaret(tooltipPoint, ctx2, size, options) {
      const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
      ctx2.lineTo(caretPosition.x1, caretPosition.y1);
      ctx2.lineTo(caretPosition.x2, caretPosition.y2);
      ctx2.lineTo(caretPosition.x3, caretPosition.y3);
    }
    getCaretPosition(tooltipPoint, size, options) {
      const { xAlign, yAlign } = this;
      const { caretSize, cornerRadius } = options;
      const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
      const { x: ptX, y: ptY } = tooltipPoint;
      const { width, height } = size;
      let x1, x2, x3, y1, y2, y3;
      if (yAlign === "center") {
        y2 = ptY + height / 2;
        if (xAlign === "left") {
          x1 = ptX;
          x2 = x1 - caretSize;
          y1 = y2 + caretSize;
          y3 = y2 - caretSize;
        } else {
          x1 = ptX + width;
          x2 = x1 + caretSize;
          y1 = y2 - caretSize;
          y3 = y2 + caretSize;
        }
        x3 = x1;
      } else {
        if (xAlign === "left") {
          x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
        } else if (xAlign === "right") {
          x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
        } else {
          x2 = this.caretX;
        }
        if (yAlign === "top") {
          y1 = ptY;
          y2 = y1 - caretSize;
          x1 = x2 - caretSize;
          x3 = x2 + caretSize;
        } else {
          y1 = ptY + height;
          y2 = y1 + caretSize;
          x1 = x2 + caretSize;
          x3 = x2 - caretSize;
        }
        y3 = y1;
      }
      return { x1, x2, x3, y1, y2, y3 };
    }
    drawTitle(pt, ctx2, options) {
      const title = this.title;
      const length = title.length;
      let titleFont, titleSpacing, i;
      if (length) {
        const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
        pt.x = getAlignedX(this, options.titleAlign, options);
        ctx2.textAlign = rtlHelper.textAlign(options.titleAlign);
        ctx2.textBaseline = "middle";
        titleFont = toFont(options.titleFont);
        titleSpacing = options.titleSpacing;
        ctx2.fillStyle = options.titleColor;
        ctx2.font = titleFont.string;
        for (i = 0; i < length; ++i) {
          ctx2.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
          pt.y += titleFont.lineHeight + titleSpacing;
          if (i + 1 === length) {
            pt.y += options.titleMarginBottom - titleSpacing;
          }
        }
      }
    }
    _drawColorBox(ctx2, pt, i, rtlHelper, options) {
      const labelColors = this.labelColors[i];
      const labelPointStyle = this.labelPointStyles[i];
      const { boxHeight, boxWidth, boxPadding } = options;
      const bodyFont = toFont(options.bodyFont);
      const colorX = getAlignedX(this, "left", options);
      const rtlColorX = rtlHelper.x(colorX);
      const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
      const colorY = pt.y + yOffSet;
      if (options.usePointStyle) {
        const drawOptions = {
          radius: Math.min(boxWidth, boxHeight) / 2,
          pointStyle: labelPointStyle.pointStyle,
          rotation: labelPointStyle.rotation,
          borderWidth: 1
        };
        const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
        const centerY = colorY + boxHeight / 2;
        ctx2.strokeStyle = options.multiKeyBackground;
        ctx2.fillStyle = options.multiKeyBackground;
        drawPoint(ctx2, drawOptions, centerX, centerY);
        ctx2.strokeStyle = labelColors.borderColor;
        ctx2.fillStyle = labelColors.backgroundColor;
        drawPoint(ctx2, drawOptions, centerX, centerY);
      } else {
        ctx2.lineWidth = labelColors.borderWidth || 1;
        ctx2.strokeStyle = labelColors.borderColor;
        ctx2.setLineDash(labelColors.borderDash || []);
        ctx2.lineDashOffset = labelColors.borderDashOffset || 0;
        const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding);
        const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2);
        const borderRadius = toTRBLCorners(labelColors.borderRadius);
        if (Object.values(borderRadius).some((v) => v !== 0)) {
          ctx2.beginPath();
          ctx2.fillStyle = options.multiKeyBackground;
          addRoundedRectPath(ctx2, {
            x: outerX,
            y: colorY,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          });
          ctx2.fill();
          ctx2.stroke();
          ctx2.fillStyle = labelColors.backgroundColor;
          ctx2.beginPath();
          addRoundedRectPath(ctx2, {
            x: innerX,
            y: colorY + 1,
            w: boxWidth - 2,
            h: boxHeight - 2,
            radius: borderRadius
          });
          ctx2.fill();
        } else {
          ctx2.fillStyle = options.multiKeyBackground;
          ctx2.fillRect(outerX, colorY, boxWidth, boxHeight);
          ctx2.strokeRect(outerX, colorY, boxWidth, boxHeight);
          ctx2.fillStyle = labelColors.backgroundColor;
          ctx2.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
        }
      }
      ctx2.fillStyle = this.labelTextColors[i];
    }
    drawBody(pt, ctx2, options) {
      const { body } = this;
      const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
      const bodyFont = toFont(options.bodyFont);
      let bodyLineHeight = bodyFont.lineHeight;
      let xLinePadding = 0;
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      const fillLineOfText = function(line) {
        ctx2.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
        pt.y += bodyLineHeight + bodySpacing;
      };
      const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
      let bodyItem, textColor, lines, i, j, ilen, jlen;
      ctx2.textAlign = bodyAlign;
      ctx2.textBaseline = "middle";
      ctx2.font = bodyFont.string;
      pt.x = getAlignedX(this, bodyAlignForCalculation, options);
      ctx2.fillStyle = options.bodyColor;
      each(this.beforeBody, fillLineOfText);
      xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
      for (i = 0, ilen = body.length; i < ilen; ++i) {
        bodyItem = body[i];
        textColor = this.labelTextColors[i];
        ctx2.fillStyle = textColor;
        each(bodyItem.before, fillLineOfText);
        lines = bodyItem.lines;
        if (displayColors && lines.length) {
          this._drawColorBox(ctx2, pt, i, rtlHelper, options);
          bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
        }
        for (j = 0, jlen = lines.length; j < jlen; ++j) {
          fillLineOfText(lines[j]);
          bodyLineHeight = bodyFont.lineHeight;
        }
        each(bodyItem.after, fillLineOfText);
      }
      xLinePadding = 0;
      bodyLineHeight = bodyFont.lineHeight;
      each(this.afterBody, fillLineOfText);
      pt.y -= bodySpacing;
    }
    drawFooter(pt, ctx2, options) {
      const footer = this.footer;
      const length = footer.length;
      let footerFont, i;
      if (length) {
        const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
        pt.x = getAlignedX(this, options.footerAlign, options);
        pt.y += options.footerMarginTop;
        ctx2.textAlign = rtlHelper.textAlign(options.footerAlign);
        ctx2.textBaseline = "middle";
        footerFont = toFont(options.footerFont);
        ctx2.fillStyle = options.footerColor;
        ctx2.font = footerFont.string;
        for (i = 0; i < length; ++i) {
          ctx2.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
          pt.y += footerFont.lineHeight + options.footerSpacing;
        }
      }
    }
    drawBackground(pt, ctx2, tooltipSize, options) {
      const { xAlign, yAlign } = this;
      const { x, y } = pt;
      const { width, height } = tooltipSize;
      const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
      ctx2.fillStyle = options.backgroundColor;
      ctx2.strokeStyle = options.borderColor;
      ctx2.lineWidth = options.borderWidth;
      ctx2.beginPath();
      ctx2.moveTo(x + topLeft, y);
      if (yAlign === "top") {
        this.drawCaret(pt, ctx2, tooltipSize, options);
      }
      ctx2.lineTo(x + width - topRight, y);
      ctx2.quadraticCurveTo(x + width, y, x + width, y + topRight);
      if (yAlign === "center" && xAlign === "right") {
        this.drawCaret(pt, ctx2, tooltipSize, options);
      }
      ctx2.lineTo(x + width, y + height - bottomRight);
      ctx2.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
      if (yAlign === "bottom") {
        this.drawCaret(pt, ctx2, tooltipSize, options);
      }
      ctx2.lineTo(x + bottomLeft, y + height);
      ctx2.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
      if (yAlign === "center" && xAlign === "left") {
        this.drawCaret(pt, ctx2, tooltipSize, options);
      }
      ctx2.lineTo(x, y + topLeft);
      ctx2.quadraticCurveTo(x, y, x + topLeft, y);
      ctx2.closePath();
      ctx2.fill();
      if (options.borderWidth > 0) {
        ctx2.stroke();
      }
    }
    _updateAnimationTarget(options) {
      const chart = this._chart;
      const anims = this.$animations;
      const animX = anims && anims.x;
      const animY = anims && anims.y;
      if (animX || animY) {
        const position = positioners[options.position].call(this, this._active, this._eventPosition);
        if (!position) {
          return;
        }
        const size = this._size = getTooltipSize(this, options);
        const positionAndSize = Object.assign({}, position, this._size);
        const alignment = determineAlignment(chart, options, positionAndSize);
        const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
        if (animX._to !== point.x || animY._to !== point.y) {
          this.xAlign = alignment.xAlign;
          this.yAlign = alignment.yAlign;
          this.width = size.width;
          this.height = size.height;
          this.caretX = position.x;
          this.caretY = position.y;
          this._resolveAnimations().update(this, point);
        }
      }
    }
    draw(ctx2) {
      const options = this.options.setContext(this.getContext());
      let opacity = this.opacity;
      if (!opacity) {
        return;
      }
      this._updateAnimationTarget(options);
      const tooltipSize = {
        width: this.width,
        height: this.height
      };
      const pt = {
        x: this.x,
        y: this.y
      };
      opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
      const padding = toPadding(options.padding);
      const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
      if (options.enabled && hasTooltipContent) {
        ctx2.save();
        ctx2.globalAlpha = opacity;
        this.drawBackground(pt, ctx2, tooltipSize, options);
        overrideTextDirection(ctx2, options.textDirection);
        pt.y += padding.top;
        this.drawTitle(pt, ctx2, options);
        this.drawBody(pt, ctx2, options);
        this.drawFooter(pt, ctx2, options);
        restoreTextDirection(ctx2, options.textDirection);
        ctx2.restore();
      }
    }
    getActiveElements() {
      return this._active || [];
    }
    setActiveElements(activeElements, eventPosition) {
      const lastActive = this._active;
      const active = activeElements.map(({ datasetIndex, index }) => {
        const meta = this._chart.getDatasetMeta(datasetIndex);
        if (!meta) {
          throw new Error("Cannot find a dataset at index " + datasetIndex);
        }
        return {
          datasetIndex,
          element: meta.data[index],
          index
        };
      });
      const changed = !_elementsEqual(lastActive, active);
      const positionChanged = this._positionChanged(active, eventPosition);
      if (changed || positionChanged) {
        this._active = active;
        this._eventPosition = eventPosition;
        this.update(true);
      }
    }
    handleEvent(e, replay) {
      const options = this.options;
      const lastActive = this._active || [];
      let changed = false;
      let active = [];
      if (e.type !== "mouseout") {
        active = this._chart.getElementsAtEventForMode(e, options.mode, options, replay);
        if (options.reverse) {
          active.reverse();
        }
      }
      const positionChanged = this._positionChanged(active, e);
      changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
      if (changed) {
        this._active = active;
        if (options.enabled || options.external) {
          this._eventPosition = {
            x: e.x,
            y: e.y
          };
          this.update(true, replay);
        }
      }
      return changed;
    }
    _positionChanged(active, e) {
      const { caretX, caretY, options } = this;
      const position = positioners[options.position].call(this, active, e);
      return position !== false && (caretX !== position.x || caretY !== position.y);
    }
  };
  Tooltip.positioners = positioners;
  var plugin_tooltip = {
    id: "tooltip",
    _element: Tooltip,
    positioners,
    afterInit(chart, _args, options) {
      if (options) {
        chart.tooltip = new Tooltip({ _chart: chart, options });
      }
    },
    beforeUpdate(chart, _args, options) {
      if (chart.tooltip) {
        chart.tooltip.initialize(options);
      }
    },
    reset(chart, _args, options) {
      if (chart.tooltip) {
        chart.tooltip.initialize(options);
      }
    },
    afterDraw(chart) {
      const tooltip = chart.tooltip;
      const args = {
        tooltip
      };
      if (chart.notifyPlugins("beforeTooltipDraw", args) === false) {
        return;
      }
      if (tooltip) {
        tooltip.draw(chart.ctx);
      }
      chart.notifyPlugins("afterTooltipDraw", args);
    },
    afterEvent(chart, args) {
      if (chart.tooltip) {
        const useFinalPosition = args.replay;
        if (chart.tooltip.handleEvent(args.event, useFinalPosition)) {
          args.changed = true;
        }
      }
    },
    defaults: {
      enabled: true,
      external: null,
      position: "average",
      backgroundColor: "rgba(0,0,0,0.8)",
      titleColor: "#fff",
      titleFont: {
        weight: "bold"
      },
      titleSpacing: 2,
      titleMarginBottom: 6,
      titleAlign: "left",
      bodyColor: "#fff",
      bodySpacing: 2,
      bodyFont: {},
      bodyAlign: "left",
      footerColor: "#fff",
      footerSpacing: 2,
      footerMarginTop: 6,
      footerFont: {
        weight: "bold"
      },
      footerAlign: "left",
      padding: 6,
      caretPadding: 2,
      caretSize: 5,
      cornerRadius: 6,
      boxHeight: (ctx2, opts) => opts.bodyFont.size,
      boxWidth: (ctx2, opts) => opts.bodyFont.size,
      multiKeyBackground: "#fff",
      displayColors: true,
      boxPadding: 0,
      borderColor: "rgba(0,0,0,0)",
      borderWidth: 0,
      animation: {
        duration: 400,
        easing: "easeOutQuart"
      },
      animations: {
        numbers: {
          type: "number",
          properties: ["x", "y", "width", "height", "caretX", "caretY"]
        },
        opacity: {
          easing: "linear",
          duration: 200
        }
      },
      callbacks: {
        beforeTitle: noop,
        title(tooltipItems) {
          if (tooltipItems.length > 0) {
            const item = tooltipItems[0];
            const labels = item.chart.data.labels;
            const labelCount = labels ? labels.length : 0;
            if (this && this.options && this.options.mode === "dataset") {
              return item.dataset.label || "";
            } else if (item.label) {
              return item.label;
            } else if (labelCount > 0 && item.dataIndex < labelCount) {
              return labels[item.dataIndex];
            }
          }
          return "";
        },
        afterTitle: noop,
        beforeBody: noop,
        beforeLabel: noop,
        label(tooltipItem) {
          if (this && this.options && this.options.mode === "dataset") {
            return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
          }
          let label = tooltipItem.dataset.label || "";
          if (label) {
            label += ": ";
          }
          const value = tooltipItem.formattedValue;
          if (!isNullOrUndef(value)) {
            label += value;
          }
          return label;
        },
        labelColor(tooltipItem) {
          const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
          const options = meta.controller.getStyle(tooltipItem.dataIndex);
          return {
            borderColor: options.borderColor,
            backgroundColor: options.backgroundColor,
            borderWidth: options.borderWidth,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderRadius: 0
          };
        },
        labelTextColor() {
          return this.options.bodyColor;
        },
        labelPointStyle(tooltipItem) {
          const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
          const options = meta.controller.getStyle(tooltipItem.dataIndex);
          return {
            pointStyle: options.pointStyle,
            rotation: options.rotation
          };
        },
        afterLabel: noop,
        afterBody: noop,
        beforeFooter: noop,
        footer: noop,
        afterFooter: noop
      }
    },
    defaultRoutes: {
      bodyFont: "font",
      footerFont: "font",
      titleFont: "font"
    },
    descriptors: {
      _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
      _indexable: false,
      callbacks: {
        _scriptable: false,
        _indexable: false
      },
      animation: {
        _fallback: false
      },
      animations: {
        _fallback: "animation"
      }
    },
    additionalOptionScopes: ["interaction"]
  };
  var plugins = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    Decimation: plugin_decimation,
    Filler: plugin_filler,
    Legend: plugin_legend,
    SubTitle: plugin_subtitle,
    Title: plugin_title,
    Tooltip: plugin_tooltip
  });
  var addIfString = (labels, raw, index) => typeof raw === "string" ? labels.push(raw) - 1 : isNaN(raw) ? null : index;
  function findOrAddLabel(labels, raw, index) {
    const first = labels.indexOf(raw);
    if (first === -1) {
      return addIfString(labels, raw, index);
    }
    const last = labels.lastIndexOf(raw);
    return first !== last ? index : first;
  }
  var validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
  var CategoryScale = class extends Scale {
    constructor(cfg) {
      super(cfg);
      this._startValue = void 0;
      this._valueRange = 0;
    }
    parse(raw, index) {
      if (isNullOrUndef(raw)) {
        return null;
      }
      const labels = this.getLabels();
      index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw));
      return validIndex(index, labels.length - 1);
    }
    determineDataLimits() {
      const { minDefined, maxDefined } = this.getUserBounds();
      let { min, max } = this.getMinMax(true);
      if (this.options.bounds === "ticks") {
        if (!minDefined) {
          min = 0;
        }
        if (!maxDefined) {
          max = this.getLabels().length - 1;
        }
      }
      this.min = min;
      this.max = max;
    }
    buildTicks() {
      const min = this.min;
      const max = this.max;
      const offset = this.options.offset;
      const ticks = [];
      let labels = this.getLabels();
      labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
      this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
      this._startValue = this.min - (offset ? 0.5 : 0);
      for (let value = min; value <= max; value++) {
        ticks.push({ value });
      }
      return ticks;
    }
    getLabelForValue(value) {
      const labels = this.getLabels();
      if (value >= 0 && value < labels.length) {
        return labels[value];
      }
      return value;
    }
    configure() {
      super.configure();
      if (!this.isHorizontal()) {
        this._reversePixels = !this._reversePixels;
      }
    }
    getPixelForValue(value) {
      if (typeof value !== "number") {
        value = this.parse(value);
      }
      return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
    }
    getPixelForTick(index) {
      const ticks = this.ticks;
      if (index < 0 || index > ticks.length - 1) {
        return null;
      }
      return this.getPixelForValue(ticks[index].value);
    }
    getValueForPixel(pixel) {
      return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
    }
    getBasePixel() {
      return this.bottom;
    }
  };
  CategoryScale.id = "category";
  CategoryScale.defaults = {
    ticks: {
      callback: CategoryScale.prototype.getLabelForValue
    }
  };
  function generateTicks$1(generationOptions, dataRange) {
    const ticks = [];
    const MIN_SPACING = 1e-14;
    const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
    const unit = step || 1;
    const maxSpaces = maxTicks - 1;
    const { min: rmin, max: rmax } = dataRange;
    const minDefined = !isNullOrUndef(min);
    const maxDefined = !isNullOrUndef(max);
    const countDefined = !isNullOrUndef(count);
    const minSpacing = (rmax - rmin) / (maxDigits + 1);
    let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
    let factor, niceMin, niceMax, numSpaces;
    if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
      return [{ value: rmin }, { value: rmax }];
    }
    numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > maxSpaces) {
      spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
    }
    if (!isNullOrUndef(precision)) {
      factor = Math.pow(10, precision);
      spacing = Math.ceil(spacing * factor) / factor;
    }
    if (bounds === "ticks") {
      niceMin = Math.floor(rmin / spacing) * spacing;
      niceMax = Math.ceil(rmax / spacing) * spacing;
    } else {
      niceMin = rmin;
      niceMax = rmax;
    }
    if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1e3)) {
      numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
      spacing = (max - min) / numSpaces;
      niceMin = min;
      niceMax = max;
    } else if (countDefined) {
      niceMin = minDefined ? min : niceMin;
      niceMax = maxDefined ? max : niceMax;
      numSpaces = count - 1;
      spacing = (niceMax - niceMin) / numSpaces;
    } else {
      numSpaces = (niceMax - niceMin) / spacing;
      if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)) {
        numSpaces = Math.round(numSpaces);
      } else {
        numSpaces = Math.ceil(numSpaces);
      }
    }
    const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
    factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMax = Math.round(niceMax * factor) / factor;
    let j = 0;
    if (minDefined) {
      if (includeBounds && niceMin !== min) {
        ticks.push({ value: min });
        if (niceMin < min) {
          j++;
        }
        if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
          j++;
        }
      } else if (niceMin < min) {
        j++;
      }
    }
    for (; j < numSpaces; ++j) {
      ticks.push({ value: Math.round((niceMin + j * spacing) * factor) / factor });
    }
    if (maxDefined && includeBounds && niceMax !== max) {
      if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
        ticks[ticks.length - 1].value = max;
      } else {
        ticks.push({ value: max });
      }
    } else if (!maxDefined || niceMax === max) {
      ticks.push({ value: niceMax });
    }
    return ticks;
  }
  function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
    const rad = toRadians(minRotation);
    const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 1e-3;
    const length = 0.75 * minSpacing * ("" + value).length;
    return Math.min(minSpacing / ratio, length);
  }
  var LinearScaleBase = class extends Scale {
    constructor(cfg) {
      super(cfg);
      this.start = void 0;
      this.end = void 0;
      this._startValue = void 0;
      this._endValue = void 0;
      this._valueRange = 0;
    }
    parse(raw, index) {
      if (isNullOrUndef(raw)) {
        return null;
      }
      if ((typeof raw === "number" || raw instanceof Number) && !isFinite(+raw)) {
        return null;
      }
      return +raw;
    }
    handleTickRangeOptions() {
      const { beginAtZero } = this.options;
      const { minDefined, maxDefined } = this.getUserBounds();
      let { min, max } = this;
      const setMin = (v) => min = minDefined ? min : v;
      const setMax = (v) => max = maxDefined ? max : v;
      if (beginAtZero) {
        const minSign = sign(min);
        const maxSign = sign(max);
        if (minSign < 0 && maxSign < 0) {
          setMax(0);
        } else if (minSign > 0 && maxSign > 0) {
          setMin(0);
        }
      }
      if (min === max) {
        let offset = 1;
        if (max >= Number.MAX_SAFE_INTEGER || min <= Number.MIN_SAFE_INTEGER) {
          offset = Math.abs(max * 0.05);
        }
        setMax(max + offset);
        if (!beginAtZero) {
          setMin(min - offset);
        }
      }
      this.min = min;
      this.max = max;
    }
    getTickLimit() {
      const tickOpts = this.options.ticks;
      let { maxTicksLimit, stepSize } = tickOpts;
      let maxTicks;
      if (stepSize) {
        maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
        if (maxTicks > 1e3) {
          console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
          maxTicks = 1e3;
        }
      } else {
        maxTicks = this.computeTickLimit();
        maxTicksLimit = maxTicksLimit || 11;
      }
      if (maxTicksLimit) {
        maxTicks = Math.min(maxTicksLimit, maxTicks);
      }
      return maxTicks;
    }
    computeTickLimit() {
      return Number.POSITIVE_INFINITY;
    }
    buildTicks() {
      const opts = this.options;
      const tickOpts = opts.ticks;
      let maxTicks = this.getTickLimit();
      maxTicks = Math.max(2, maxTicks);
      const numericGeneratorOptions = {
        maxTicks,
        bounds: opts.bounds,
        min: opts.min,
        max: opts.max,
        precision: tickOpts.precision,
        step: tickOpts.stepSize,
        count: tickOpts.count,
        maxDigits: this._maxDigits(),
        horizontal: this.isHorizontal(),
        minRotation: tickOpts.minRotation || 0,
        includeBounds: tickOpts.includeBounds !== false
      };
      const dataRange = this._range || this;
      const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
      if (opts.bounds === "ticks") {
        _setMinAndMaxByKey(ticks, this, "value");
      }
      if (opts.reverse) {
        ticks.reverse();
        this.start = this.max;
        this.end = this.min;
      } else {
        this.start = this.min;
        this.end = this.max;
      }
      return ticks;
    }
    configure() {
      const ticks = this.ticks;
      let start = this.min;
      let end = this.max;
      super.configure();
      if (this.options.offset && ticks.length) {
        const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
        start -= offset;
        end += offset;
      }
      this._startValue = start;
      this._endValue = end;
      this._valueRange = end - start;
    }
    getLabelForValue(value) {
      return formatNumber(value, this.chart.options.locale);
    }
  };
  var LinearScale = class extends LinearScaleBase {
    determineDataLimits() {
      const { min, max } = this.getMinMax(true);
      this.min = isNumberFinite(min) ? min : 0;
      this.max = isNumberFinite(max) ? max : 1;
      this.handleTickRangeOptions();
    }
    computeTickLimit() {
      const horizontal = this.isHorizontal();
      const length = horizontal ? this.width : this.height;
      const minRotation = toRadians(this.options.ticks.minRotation);
      const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 1e-3;
      const tickFont = this._resolveTickFontOptions(0);
      return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
    }
    getPixelForValue(value) {
      return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
    }
    getValueForPixel(pixel) {
      return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
    }
  };
  LinearScale.id = "linear";
  LinearScale.defaults = {
    ticks: {
      callback: Ticks.formatters.numeric
    }
  };
  function isMajor(tickVal) {
    const remain = tickVal / Math.pow(10, Math.floor(log10(tickVal)));
    return remain === 1;
  }
  function generateTicks(generationOptions, dataRange) {
    const endExp = Math.floor(log10(dataRange.max));
    const endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
    const ticks = [];
    let tickVal = finiteOrDefault(generationOptions.min, Math.pow(10, Math.floor(log10(dataRange.min))));
    let exp = Math.floor(log10(tickVal));
    let significand = Math.floor(tickVal / Math.pow(10, exp));
    let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
    do {
      ticks.push({ value: tickVal, major: isMajor(tickVal) });
      ++significand;
      if (significand === 10) {
        significand = 1;
        ++exp;
        precision = exp >= 0 ? 1 : precision;
      }
      tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
    } while (exp < endExp || exp === endExp && significand < endSignificand);
    const lastTick = finiteOrDefault(generationOptions.max, tickVal);
    ticks.push({ value: lastTick, major: isMajor(tickVal) });
    return ticks;
  }
  var LogarithmicScale = class extends Scale {
    constructor(cfg) {
      super(cfg);
      this.start = void 0;
      this.end = void 0;
      this._startValue = void 0;
      this._valueRange = 0;
    }
    parse(raw, index) {
      const value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);
      if (value === 0) {
        this._zero = true;
        return void 0;
      }
      return isNumberFinite(value) && value > 0 ? value : null;
    }
    determineDataLimits() {
      const { min, max } = this.getMinMax(true);
      this.min = isNumberFinite(min) ? Math.max(0, min) : null;
      this.max = isNumberFinite(max) ? Math.max(0, max) : null;
      if (this.options.beginAtZero) {
        this._zero = true;
      }
      this.handleTickRangeOptions();
    }
    handleTickRangeOptions() {
      const { minDefined, maxDefined } = this.getUserBounds();
      let min = this.min;
      let max = this.max;
      const setMin = (v) => min = minDefined ? min : v;
      const setMax = (v) => max = maxDefined ? max : v;
      const exp = (v, m) => Math.pow(10, Math.floor(log10(v)) + m);
      if (min === max) {
        if (min <= 0) {
          setMin(1);
          setMax(10);
        } else {
          setMin(exp(min, -1));
          setMax(exp(max, 1));
        }
      }
      if (min <= 0) {
        setMin(exp(max, -1));
      }
      if (max <= 0) {
        setMax(exp(min, 1));
      }
      if (this._zero && this.min !== this._suggestedMin && min === exp(this.min, 0)) {
        setMin(exp(min, -1));
      }
      this.min = min;
      this.max = max;
    }
    buildTicks() {
      const opts = this.options;
      const generationOptions = {
        min: this._userMin,
        max: this._userMax
      };
      const ticks = generateTicks(generationOptions, this);
      if (opts.bounds === "ticks") {
        _setMinAndMaxByKey(ticks, this, "value");
      }
      if (opts.reverse) {
        ticks.reverse();
        this.start = this.max;
        this.end = this.min;
      } else {
        this.start = this.min;
        this.end = this.max;
      }
      return ticks;
    }
    getLabelForValue(value) {
      return value === void 0 ? "0" : formatNumber(value, this.chart.options.locale);
    }
    configure() {
      const start = this.min;
      super.configure();
      this._startValue = log10(start);
      this._valueRange = log10(this.max) - log10(start);
    }
    getPixelForValue(value) {
      if (value === void 0 || value === 0) {
        value = this.min;
      }
      if (value === null || isNaN(value)) {
        return NaN;
      }
      return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
    }
    getValueForPixel(pixel) {
      const decimal = this.getDecimalForPixel(pixel);
      return Math.pow(10, this._startValue + decimal * this._valueRange);
    }
  };
  LogarithmicScale.id = "logarithmic";
  LogarithmicScale.defaults = {
    ticks: {
      callback: Ticks.formatters.logarithmic,
      major: {
        enabled: true
      }
    }
  };
  function getTickBackdropHeight(opts) {
    const tickOpts = opts.ticks;
    if (tickOpts.display && opts.display) {
      const padding = toPadding(tickOpts.backdropPadding);
      return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
    }
    return 0;
  }
  function measureLabelSize(ctx2, font, label) {
    label = isArray(label) ? label : [label];
    return {
      w: _longestText(ctx2, font.string, label),
      h: label.length * font.lineHeight
    };
  }
  function determineLimits(angle, pos, size, min, max) {
    if (angle === min || angle === max) {
      return {
        start: pos - size / 2,
        end: pos + size / 2
      };
    } else if (angle < min || angle > max) {
      return {
        start: pos - size,
        end: pos
      };
    }
    return {
      start: pos,
      end: pos + size
    };
  }
  function fitWithPointLabels(scale) {
    const furthestLimits = {
      l: 0,
      r: scale.width,
      t: 0,
      b: scale.height - scale.paddingTop
    };
    const furthestAngles = {};
    const labelSizes = [];
    const padding = [];
    const valueCount = scale.getLabels().length;
    for (let i = 0; i < valueCount; i++) {
      const opts = scale.options.pointLabels.setContext(scale.getPointLabelContext(i));
      padding[i] = opts.padding;
      const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i]);
      const plFont = toFont(opts.font);
      const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
      labelSizes[i] = textSize;
      const angleRadians = scale.getIndexAngle(i);
      const angle = toDegrees(angleRadians);
      const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
      const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
      if (hLimits.start < furthestLimits.l) {
        furthestLimits.l = hLimits.start;
        furthestAngles.l = angleRadians;
      }
      if (hLimits.end > furthestLimits.r) {
        furthestLimits.r = hLimits.end;
        furthestAngles.r = angleRadians;
      }
      if (vLimits.start < furthestLimits.t) {
        furthestLimits.t = vLimits.start;
        furthestAngles.t = angleRadians;
      }
      if (vLimits.end > furthestLimits.b) {
        furthestLimits.b = vLimits.end;
        furthestAngles.b = angleRadians;
      }
    }
    scale._setReductions(scale.drawingArea, furthestLimits, furthestAngles);
    scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
  }
  function buildPointLabelItems(scale, labelSizes, padding) {
    const items = [];
    const valueCount = scale.getLabels().length;
    const opts = scale.options;
    const tickBackdropHeight = getTickBackdropHeight(opts);
    const outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);
    for (let i = 0; i < valueCount; i++) {
      const extra = i === 0 ? tickBackdropHeight / 2 : 0;
      const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i]);
      const angle = toDegrees(scale.getIndexAngle(i));
      const size = labelSizes[i];
      const y = yForAngle(pointLabelPosition.y, size.h, angle);
      const textAlign = getTextAlignForAngle(angle);
      const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
      items.push({
        x: pointLabelPosition.x,
        y,
        textAlign,
        left,
        top: y,
        right: left + size.w,
        bottom: y + size.h
      });
    }
    return items;
  }
  function getTextAlignForAngle(angle) {
    if (angle === 0 || angle === 180) {
      return "center";
    } else if (angle < 180) {
      return "left";
    }
    return "right";
  }
  function leftForTextAlign(x, w, align) {
    if (align === "right") {
      x -= w;
    } else if (align === "center") {
      x -= w / 2;
    }
    return x;
  }
  function yForAngle(y, h, angle) {
    if (angle === 90 || angle === 270) {
      y -= h / 2;
    } else if (angle > 270 || angle < 90) {
      y -= h;
    }
    return y;
  }
  function drawPointLabels(scale, labelCount) {
    const { ctx: ctx2, options: { pointLabels } } = scale;
    for (let i = labelCount - 1; i >= 0; i--) {
      const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
      const plFont = toFont(optsAtIndex.font);
      const { x, y, textAlign, left, top, right, bottom } = scale._pointLabelItems[i];
      const { backdropColor } = optsAtIndex;
      if (!isNullOrUndef(backdropColor)) {
        const padding = toPadding(optsAtIndex.backdropPadding);
        ctx2.fillStyle = backdropColor;
        ctx2.fillRect(left - padding.left, top - padding.top, right - left + padding.width, bottom - top + padding.height);
      }
      renderText(ctx2, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
        color: optsAtIndex.color,
        textAlign,
        textBaseline: "middle"
      });
    }
  }
  function pathRadiusLine(scale, radius, circular, labelCount) {
    const { ctx: ctx2 } = scale;
    if (circular) {
      ctx2.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
    } else {
      let pointPosition = scale.getPointPosition(0, radius);
      ctx2.moveTo(pointPosition.x, pointPosition.y);
      for (let i = 1; i < labelCount; i++) {
        pointPosition = scale.getPointPosition(i, radius);
        ctx2.lineTo(pointPosition.x, pointPosition.y);
      }
    }
  }
  function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
    const ctx2 = scale.ctx;
    const circular = gridLineOpts.circular;
    const { color: color2, lineWidth } = gridLineOpts;
    if (!circular && !labelCount || !color2 || !lineWidth || radius < 0) {
      return;
    }
    ctx2.save();
    ctx2.strokeStyle = color2;
    ctx2.lineWidth = lineWidth;
    ctx2.setLineDash(gridLineOpts.borderDash);
    ctx2.lineDashOffset = gridLineOpts.borderDashOffset;
    ctx2.beginPath();
    pathRadiusLine(scale, radius, circular, labelCount);
    ctx2.closePath();
    ctx2.stroke();
    ctx2.restore();
  }
  function numberOrZero2(param) {
    return isNumber(param) ? param : 0;
  }
  function createPointLabelContext(parent, index, label) {
    return createContext(parent, {
      label,
      index,
      type: "pointLabel"
    });
  }
  var RadialLinearScale = class extends LinearScaleBase {
    constructor(cfg) {
      super(cfg);
      this.xCenter = void 0;
      this.yCenter = void 0;
      this.drawingArea = void 0;
      this._pointLabels = [];
      this._pointLabelItems = [];
    }
    setDimensions() {
      this.width = this.maxWidth;
      this.height = this.maxHeight;
      this.paddingTop = getTickBackdropHeight(this.options) / 2;
      this.xCenter = Math.floor(this.width / 2);
      this.yCenter = Math.floor((this.height - this.paddingTop) / 2);
      this.drawingArea = Math.min(this.height - this.paddingTop, this.width) / 2;
    }
    determineDataLimits() {
      const { min, max } = this.getMinMax(false);
      this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
      this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
      this.handleTickRangeOptions();
    }
    computeTickLimit() {
      return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
    }
    generateTickLabels(ticks) {
      LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
      this._pointLabels = this.getLabels().map((value, index) => {
        const label = callback(this.options.pointLabels.callback, [value, index], this);
        return label || label === 0 ? label : "";
      });
    }
    fit() {
      const opts = this.options;
      if (opts.display && opts.pointLabels.display) {
        fitWithPointLabels(this);
      } else {
        this.setCenterPoint(0, 0, 0, 0);
      }
    }
    _setReductions(largestPossibleRadius, furthestLimits, furthestAngles) {
      let radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
      let radiusReductionRight = Math.max(furthestLimits.r - this.width, 0) / Math.sin(furthestAngles.r);
      let radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
      let radiusReductionBottom = -Math.max(furthestLimits.b - (this.height - this.paddingTop), 0) / Math.cos(furthestAngles.b);
      radiusReductionLeft = numberOrZero2(radiusReductionLeft);
      radiusReductionRight = numberOrZero2(radiusReductionRight);
      radiusReductionTop = numberOrZero2(radiusReductionTop);
      radiusReductionBottom = numberOrZero2(radiusReductionBottom);
      this.drawingArea = Math.max(largestPossibleRadius / 2, Math.min(Math.floor(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2), Math.floor(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2)));
      this.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
    }
    setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
      const maxRight = this.width - rightMovement - this.drawingArea;
      const maxLeft = leftMovement + this.drawingArea;
      const maxTop = topMovement + this.drawingArea;
      const maxBottom = this.height - this.paddingTop - bottomMovement - this.drawingArea;
      this.xCenter = Math.floor((maxLeft + maxRight) / 2 + this.left);
      this.yCenter = Math.floor((maxTop + maxBottom) / 2 + this.top + this.paddingTop);
    }
    getIndexAngle(index) {
      const angleMultiplier = TAU / this.getLabels().length;
      const startAngle = this.options.startAngle || 0;
      return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
    }
    getDistanceFromCenterForValue(value) {
      if (isNullOrUndef(value)) {
        return NaN;
      }
      const scalingFactor = this.drawingArea / (this.max - this.min);
      if (this.options.reverse) {
        return (this.max - value) * scalingFactor;
      }
      return (value - this.min) * scalingFactor;
    }
    getValueForDistanceFromCenter(distance) {
      if (isNullOrUndef(distance)) {
        return NaN;
      }
      const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
      return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
    }
    getPointLabelContext(index) {
      const pointLabels = this._pointLabels || [];
      if (index >= 0 && index < pointLabels.length) {
        const pointLabel = pointLabels[index];
        return createPointLabelContext(this.getContext(), index, pointLabel);
      }
    }
    getPointPosition(index, distanceFromCenter) {
      const angle = this.getIndexAngle(index) - HALF_PI;
      return {
        x: Math.cos(angle) * distanceFromCenter + this.xCenter,
        y: Math.sin(angle) * distanceFromCenter + this.yCenter,
        angle
      };
    }
    getPointPositionForValue(index, value) {
      return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
    }
    getBasePosition(index) {
      return this.getPointPositionForValue(index || 0, this.getBaseValue());
    }
    getPointLabelPosition(index) {
      const { left, top, right, bottom } = this._pointLabelItems[index];
      return {
        left,
        top,
        right,
        bottom
      };
    }
    drawBackground() {
      const { backgroundColor, grid: { circular } } = this.options;
      if (backgroundColor) {
        const ctx2 = this.ctx;
        ctx2.save();
        ctx2.beginPath();
        pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this.getLabels().length);
        ctx2.closePath();
        ctx2.fillStyle = backgroundColor;
        ctx2.fill();
        ctx2.restore();
      }
    }
    drawGrid() {
      const ctx2 = this.ctx;
      const opts = this.options;
      const { angleLines, grid } = opts;
      const labelCount = this.getLabels().length;
      let i, offset, position;
      if (opts.pointLabels.display) {
        drawPointLabels(this, labelCount);
      }
      if (grid.display) {
        this.ticks.forEach((tick, index) => {
          if (index !== 0) {
            offset = this.getDistanceFromCenterForValue(tick.value);
            const optsAtIndex = grid.setContext(this.getContext(index - 1));
            drawRadiusLine(this, optsAtIndex, offset, labelCount);
          }
        });
      }
      if (angleLines.display) {
        ctx2.save();
        for (i = this.getLabels().length - 1; i >= 0; i--) {
          const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
          const { color: color2, lineWidth } = optsAtIndex;
          if (!lineWidth || !color2) {
            continue;
          }
          ctx2.lineWidth = lineWidth;
          ctx2.strokeStyle = color2;
          ctx2.setLineDash(optsAtIndex.borderDash);
          ctx2.lineDashOffset = optsAtIndex.borderDashOffset;
          offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
          position = this.getPointPosition(i, offset);
          ctx2.beginPath();
          ctx2.moveTo(this.xCenter, this.yCenter);
          ctx2.lineTo(position.x, position.y);
          ctx2.stroke();
        }
        ctx2.restore();
      }
    }
    drawBorder() {
    }
    drawLabels() {
      const ctx2 = this.ctx;
      const opts = this.options;
      const tickOpts = opts.ticks;
      if (!tickOpts.display) {
        return;
      }
      const startAngle = this.getIndexAngle(0);
      let offset, width;
      ctx2.save();
      ctx2.translate(this.xCenter, this.yCenter);
      ctx2.rotate(startAngle);
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      this.ticks.forEach((tick, index) => {
        if (index === 0 && !opts.reverse) {
          return;
        }
        const optsAtIndex = tickOpts.setContext(this.getContext(index));
        const tickFont = toFont(optsAtIndex.font);
        offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
        if (optsAtIndex.showLabelBackdrop) {
          ctx2.font = tickFont.string;
          width = ctx2.measureText(tick.label).width;
          ctx2.fillStyle = optsAtIndex.backdropColor;
          const padding = toPadding(optsAtIndex.backdropPadding);
          ctx2.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
        }
        renderText(ctx2, tick.label, 0, -offset, tickFont, {
          color: optsAtIndex.color
        });
      });
      ctx2.restore();
    }
    drawTitle() {
    }
  };
  RadialLinearScale.id = "radialLinear";
  RadialLinearScale.defaults = {
    display: true,
    animate: true,
    position: "chartArea",
    angleLines: {
      display: true,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0
    },
    grid: {
      circular: false
    },
    startAngle: 0,
    ticks: {
      showLabelBackdrop: true,
      callback: Ticks.formatters.numeric
    },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: true,
      font: {
        size: 10
      },
      callback(label) {
        return label;
      },
      padding: 5
    }
  };
  RadialLinearScale.defaultRoutes = {
    "angleLines.color": "borderColor",
    "pointLabels.color": "color",
    "ticks.color": "color"
  };
  RadialLinearScale.descriptors = {
    angleLines: {
      _fallback: "grid"
    }
  };
  var INTERVALS = {
    millisecond: { common: true, size: 1, steps: 1e3 },
    second: { common: true, size: 1e3, steps: 60 },
    minute: { common: true, size: 6e4, steps: 60 },
    hour: { common: true, size: 36e5, steps: 24 },
    day: { common: true, size: 864e5, steps: 30 },
    week: { common: false, size: 6048e5, steps: 4 },
    month: { common: true, size: 2628e6, steps: 12 },
    quarter: { common: false, size: 7884e6, steps: 4 },
    year: { common: true, size: 3154e7 }
  };
  var UNITS = Object.keys(INTERVALS);
  function sorter(a, b) {
    return a - b;
  }
  function parse(scale, input) {
    if (isNullOrUndef(input)) {
      return null;
    }
    const adapter = scale._adapter;
    const { parser, round: round2, isoWeekday } = scale._parseOpts;
    let value = input;
    if (typeof parser === "function") {
      value = parser(value);
    }
    if (!isNumberFinite(value)) {
      value = typeof parser === "string" ? adapter.parse(value, parser) : adapter.parse(value);
    }
    if (value === null) {
      return null;
    }
    if (round2) {
      value = round2 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, "isoWeek", isoWeekday) : adapter.startOf(value, round2);
    }
    return +value;
  }
  function determineUnitForAutoTicks(minUnit, min, max, capacity) {
    const ilen = UNITS.length;
    for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
      const interval = INTERVALS[UNITS[i]];
      const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
      if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
        return UNITS[i];
      }
    }
    return UNITS[ilen - 1];
  }
  function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
    for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
      const unit = UNITS[i];
      if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
        return unit;
      }
    }
    return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
  }
  function determineMajorUnit(unit) {
    for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
      if (INTERVALS[UNITS[i]].common) {
        return UNITS[i];
      }
    }
  }
  function addTick(ticks, time, timestamps) {
    if (!timestamps) {
      ticks[time] = true;
    } else if (timestamps.length) {
      const { lo, hi } = _lookup(timestamps, time);
      const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
      ticks[timestamp] = true;
    }
  }
  function setMajorTicks(scale, ticks, map3, majorUnit) {
    const adapter = scale._adapter;
    const first = +adapter.startOf(ticks[0].value, majorUnit);
    const last = ticks[ticks.length - 1].value;
    let major, index;
    for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
      index = map3[major];
      if (index >= 0) {
        ticks[index].major = true;
      }
    }
    return ticks;
  }
  function ticksFromTimestamps(scale, values, majorUnit) {
    const ticks = [];
    const map3 = {};
    const ilen = values.length;
    let i, value;
    for (i = 0; i < ilen; ++i) {
      value = values[i];
      map3[value] = i;
      ticks.push({
        value,
        major: false
      });
    }
    return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map3, majorUnit);
  }
  var TimeScale = class extends Scale {
    constructor(props) {
      super(props);
      this._cache = {
        data: [],
        labels: [],
        all: []
      };
      this._unit = "day";
      this._majorUnit = void 0;
      this._offsets = {};
      this._normalized = false;
      this._parseOpts = void 0;
    }
    init(scaleOpts, opts) {
      const time = scaleOpts.time || (scaleOpts.time = {});
      const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
      mergeIf(time.displayFormats, adapter.formats());
      this._parseOpts = {
        parser: time.parser,
        round: time.round,
        isoWeekday: time.isoWeekday
      };
      super.init(scaleOpts);
      this._normalized = opts.normalized;
    }
    parse(raw, index) {
      if (raw === void 0) {
        return null;
      }
      return parse(this, raw);
    }
    beforeLayout() {
      super.beforeLayout();
      this._cache = {
        data: [],
        labels: [],
        all: []
      };
    }
    determineDataLimits() {
      const options = this.options;
      const adapter = this._adapter;
      const unit = options.time.unit || "day";
      let { min, max, minDefined, maxDefined } = this.getUserBounds();
      function _applyBounds(bounds) {
        if (!minDefined && !isNaN(bounds.min)) {
          min = Math.min(min, bounds.min);
        }
        if (!maxDefined && !isNaN(bounds.max)) {
          max = Math.max(max, bounds.max);
        }
      }
      if (!minDefined || !maxDefined) {
        _applyBounds(this._getLabelBounds());
        if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
          _applyBounds(this.getMinMax(false));
        }
      }
      min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
      max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
      this.min = Math.min(min, max - 1);
      this.max = Math.max(min + 1, max);
    }
    _getLabelBounds() {
      const arr = this.getLabelTimestamps();
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      if (arr.length) {
        min = arr[0];
        max = arr[arr.length - 1];
      }
      return { min, max };
    }
    buildTicks() {
      const options = this.options;
      const timeOpts = options.time;
      const tickOpts = options.ticks;
      const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
      if (options.bounds === "ticks" && timestamps.length) {
        this.min = this._userMin || timestamps[0];
        this.max = this._userMax || timestamps[timestamps.length - 1];
      }
      const min = this.min;
      const max = this.max;
      const ticks = _filterBetween(timestamps, min, max);
      this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
      this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
      this.initOffsets(timestamps);
      if (options.reverse) {
        ticks.reverse();
      }
      return ticksFromTimestamps(this, ticks, this._majorUnit);
    }
    initOffsets(timestamps) {
      let start = 0;
      let end = 0;
      let first, last;
      if (this.options.offset && timestamps.length) {
        first = this.getDecimalForValue(timestamps[0]);
        if (timestamps.length === 1) {
          start = 1 - first;
        } else {
          start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
        }
        last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
        if (timestamps.length === 1) {
          end = last;
        } else {
          end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
        }
      }
      const limit = timestamps.length < 3 ? 0.5 : 0.25;
      start = _limitValue(start, 0, limit);
      end = _limitValue(end, 0, limit);
      this._offsets = { start, end, factor: 1 / (start + 1 + end) };
    }
    _generate() {
      const adapter = this._adapter;
      const min = this.min;
      const max = this.max;
      const options = this.options;
      const timeOpts = options.time;
      const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
      const stepSize = valueOrDefault(timeOpts.stepSize, 1);
      const weekday = minor === "week" ? timeOpts.isoWeekday : false;
      const hasWeekday = isNumber(weekday) || weekday === true;
      const ticks = {};
      let first = min;
      let time, count;
      if (hasWeekday) {
        first = +adapter.startOf(first, "isoWeek", weekday);
      }
      first = +adapter.startOf(first, hasWeekday ? "day" : minor);
      if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
        throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
      }
      const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
      for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
        addTick(ticks, time, timestamps);
      }
      if (time === max || options.bounds === "ticks" || count === 1) {
        addTick(ticks, time, timestamps);
      }
      return Object.keys(ticks).sort((a, b) => a - b).map((x) => +x);
    }
    getLabelForValue(value) {
      const adapter = this._adapter;
      const timeOpts = this.options.time;
      if (timeOpts.tooltipFormat) {
        return adapter.format(value, timeOpts.tooltipFormat);
      }
      return adapter.format(value, timeOpts.displayFormats.datetime);
    }
    _tickFormatFunction(time, index, ticks, format2) {
      const options = this.options;
      const formats = options.time.displayFormats;
      const unit = this._unit;
      const majorUnit = this._majorUnit;
      const minorFormat = unit && formats[unit];
      const majorFormat = majorUnit && formats[majorUnit];
      const tick = ticks[index];
      const major = majorUnit && majorFormat && tick && tick.major;
      const label = this._adapter.format(time, format2 || (major ? majorFormat : minorFormat));
      const formatter = options.ticks.callback;
      return formatter ? callback(formatter, [label, index, ticks], this) : label;
    }
    generateTickLabels(ticks) {
      let i, ilen, tick;
      for (i = 0, ilen = ticks.length; i < ilen; ++i) {
        tick = ticks[i];
        tick.label = this._tickFormatFunction(tick.value, i, ticks);
      }
    }
    getDecimalForValue(value) {
      return value === null ? NaN : (value - this.min) / (this.max - this.min);
    }
    getPixelForValue(value) {
      const offsets = this._offsets;
      const pos = this.getDecimalForValue(value);
      return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
    }
    getValueForPixel(pixel) {
      const offsets = this._offsets;
      const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
      return this.min + pos * (this.max - this.min);
    }
    _getLabelSize(label) {
      const ticksOpts = this.options.ticks;
      const tickLabelWidth = this.ctx.measureText(label).width;
      const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
      const cosRotation = Math.cos(angle);
      const sinRotation = Math.sin(angle);
      const tickFontSize = this._resolveTickFontOptions(0).size;
      return {
        w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
        h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
      };
    }
    _getLabelCapacity(exampleTime) {
      const timeOpts = this.options.time;
      const displayFormats = timeOpts.displayFormats;
      const format2 = displayFormats[timeOpts.unit] || displayFormats.millisecond;
      const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [exampleTime], this._majorUnit), format2);
      const size = this._getLabelSize(exampleLabel);
      const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
      return capacity > 0 ? capacity : 1;
    }
    getDataTimestamps() {
      let timestamps = this._cache.data || [];
      let i, ilen;
      if (timestamps.length) {
        return timestamps;
      }
      const metas = this.getMatchingVisibleMetas();
      if (this._normalized && metas.length) {
        return this._cache.data = metas[0].controller.getAllParsedValues(this);
      }
      for (i = 0, ilen = metas.length; i < ilen; ++i) {
        timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
      }
      return this._cache.data = this.normalize(timestamps);
    }
    getLabelTimestamps() {
      const timestamps = this._cache.labels || [];
      let i, ilen;
      if (timestamps.length) {
        return timestamps;
      }
      const labels = this.getLabels();
      for (i = 0, ilen = labels.length; i < ilen; ++i) {
        timestamps.push(parse(this, labels[i]));
      }
      return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
    }
    normalize(values) {
      return _arrayUnique(values.sort(sorter));
    }
  };
  TimeScale.id = "time";
  TimeScale.defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: false,
      unit: false,
      round: false,
      isoWeekday: false,
      minUnit: "millisecond",
      displayFormats: {}
    },
    ticks: {
      source: "auto",
      major: {
        enabled: false
      }
    }
  };
  function interpolate(table, val, reverse) {
    let lo = 0;
    let hi = table.length - 1;
    let prevSource, nextSource, prevTarget, nextTarget;
    if (reverse) {
      if (val >= table[lo].pos && val <= table[hi].pos) {
        ({ lo, hi } = _lookupByKey(table, "pos", val));
      }
      ({ pos: prevSource, time: prevTarget } = table[lo]);
      ({ pos: nextSource, time: nextTarget } = table[hi]);
    } else {
      if (val >= table[lo].time && val <= table[hi].time) {
        ({ lo, hi } = _lookupByKey(table, "time", val));
      }
      ({ time: prevSource, pos: prevTarget } = table[lo]);
      ({ time: nextSource, pos: nextTarget } = table[hi]);
    }
    const span = nextSource - prevSource;
    return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
  }
  var TimeSeriesScale = class extends TimeScale {
    constructor(props) {
      super(props);
      this._table = [];
      this._minPos = void 0;
      this._tableRange = void 0;
    }
    initOffsets() {
      const timestamps = this._getTimestampsForTable();
      const table = this._table = this.buildLookupTable(timestamps);
      this._minPos = interpolate(table, this.min);
      this._tableRange = interpolate(table, this.max) - this._minPos;
      super.initOffsets(timestamps);
    }
    buildLookupTable(timestamps) {
      const { min, max } = this;
      const items = [];
      const table = [];
      let i, ilen, prev, curr, next;
      for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
        curr = timestamps[i];
        if (curr >= min && curr <= max) {
          items.push(curr);
        }
      }
      if (items.length < 2) {
        return [
          { time: min, pos: 0 },
          { time: max, pos: 1 }
        ];
      }
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        next = items[i + 1];
        prev = items[i - 1];
        curr = items[i];
        if (Math.round((next + prev) / 2) !== curr) {
          table.push({ time: curr, pos: i / (ilen - 1) });
        }
      }
      return table;
    }
    _getTimestampsForTable() {
      let timestamps = this._cache.all || [];
      if (timestamps.length) {
        return timestamps;
      }
      const data = this.getDataTimestamps();
      const label = this.getLabelTimestamps();
      if (data.length && label.length) {
        timestamps = this.normalize(data.concat(label));
      } else {
        timestamps = data.length ? data : label;
      }
      timestamps = this._cache.all = timestamps;
      return timestamps;
    }
    getDecimalForValue(value) {
      return (interpolate(this._table, value) - this._minPos) / this._tableRange;
    }
    getValueForPixel(pixel) {
      const offsets = this._offsets;
      const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
      return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
    }
  };
  TimeSeriesScale.id = "timeseries";
  TimeSeriesScale.defaults = TimeScale.defaults;
  var scales = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale
  });
  var registerables = [
    controllers,
    elements,
    plugins,
    scales
  ];

  // node_modules/date-fns/esm/_lib/toInteger/index.js
  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
      return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  // node_modules/date-fns/esm/_lib/requiredArgs/index.js
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
    }
  }

  // node_modules/date-fns/esm/toDate/index.js
  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === "[object Number]") {
      return new Date(argument);
    } else {
      if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }

  // node_modules/date-fns/esm/addDays/index.js
  function addDays(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var amount = toInteger(dirtyAmount);
    if (isNaN(amount)) {
      return new Date(NaN);
    }
    if (!amount) {
      return date;
    }
    date.setDate(date.getDate() + amount);
    return date;
  }

  // node_modules/date-fns/esm/addMonths/index.js
  function addMonths(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var amount = toInteger(dirtyAmount);
    if (isNaN(amount)) {
      return new Date(NaN);
    }
    if (!amount) {
      return date;
    }
    var dayOfMonth = date.getDate();
    var endOfDesiredMonth = new Date(date.getTime());
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
    var daysInMonth = endOfDesiredMonth.getDate();
    if (dayOfMonth >= daysInMonth) {
      return endOfDesiredMonth;
    } else {
      date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
      return date;
    }
  }

  // node_modules/date-fns/esm/addMilliseconds/index.js
  function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
  }

  // node_modules/date-fns/esm/addHours/index.js
  var MILLISECONDS_IN_HOUR = 36e5;
  function addHours(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
  }

  // node_modules/date-fns/esm/startOfWeek/index.js
  function startOfWeek(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    var date = toDate(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js
  function getTimezoneOffsetInMilliseconds(date) {
    var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    utcDate.setUTCFullYear(date.getFullYear());
    return date.getTime() - utcDate.getTime();
  }

  // node_modules/date-fns/esm/startOfDay/index.js
  function startOfDay(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/differenceInCalendarDays/index.js
  var MILLISECONDS_IN_DAY = 864e5;
  function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var startOfDayLeft = startOfDay(dirtyDateLeft);
    var startOfDayRight = startOfDay(dirtyDateRight);
    var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
    var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight);
    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
  }

  // node_modules/date-fns/esm/addMinutes/index.js
  var MILLISECONDS_IN_MINUTE = 6e4;
  function addMinutes(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
  }

  // node_modules/date-fns/esm/addQuarters/index.js
  function addQuarters(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    var months = amount * 3;
    return addMonths(dirtyDate, months);
  }

  // node_modules/date-fns/esm/addSeconds/index.js
  function addSeconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * 1e3);
  }

  // node_modules/date-fns/esm/addWeeks/index.js
  function addWeeks(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    var days = amount * 7;
    return addDays(dirtyDate, days);
  }

  // node_modules/date-fns/esm/addYears/index.js
  function addYears(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMonths(dirtyDate, amount * 12);
  }

  // node_modules/date-fns/esm/compareAsc/index.js
  function compareAsc(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var diff = dateLeft.getTime() - dateRight.getTime();
    if (diff < 0) {
      return -1;
    } else if (diff > 0) {
      return 1;
    } else {
      return diff;
    }
  }

  // node_modules/date-fns/esm/constants/index.js
  var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
  var millisecondsInMinute = 6e4;
  var millisecondsInHour = 36e5;
  var minTime = -maxTime;

  // node_modules/date-fns/esm/isDate/index.js
  function isDate(value) {
    requiredArgs(1, arguments);
    return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
  }

  // node_modules/date-fns/esm/isValid/index.js
  function isValid(dirtyDate) {
    requiredArgs(1, arguments);
    if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
      return false;
    }
    var date = toDate(dirtyDate);
    return !isNaN(Number(date));
  }

  // node_modules/date-fns/esm/differenceInCalendarMonths/index.js
  function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
  }

  // node_modules/date-fns/esm/differenceInCalendarYears/index.js
  function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    return dateLeft.getFullYear() - dateRight.getFullYear();
  }

  // node_modules/date-fns/esm/differenceInDays/index.js
  function compareLocalAsc(dateLeft, dateRight) {
    var diff = dateLeft.getFullYear() - dateRight.getFullYear() || dateLeft.getMonth() - dateRight.getMonth() || dateLeft.getDate() - dateRight.getDate() || dateLeft.getHours() - dateRight.getHours() || dateLeft.getMinutes() - dateRight.getMinutes() || dateLeft.getSeconds() - dateRight.getSeconds() || dateLeft.getMilliseconds() - dateRight.getMilliseconds();
    if (diff < 0) {
      return -1;
    } else if (diff > 0) {
      return 1;
    } else {
      return diff;
    }
  }
  function differenceInDays(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var sign2 = compareLocalAsc(dateLeft, dateRight);
    var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight));
    dateLeft.setDate(dateLeft.getDate() - sign2 * difference);
    var isLastDayNotFull = Number(compareLocalAsc(dateLeft, dateRight) === -sign2);
    var result = sign2 * (difference - isLastDayNotFull);
    return result === 0 ? 0 : result;
  }

  // node_modules/date-fns/esm/differenceInMilliseconds/index.js
  function differenceInMilliseconds(dateLeft, dateRight) {
    requiredArgs(2, arguments);
    return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
  }

  // node_modules/date-fns/esm/_lib/roundingMethods/index.js
  var roundingMap = {
    ceil: Math.ceil,
    round: Math.round,
    floor: Math.floor,
    trunc: function(value) {
      return value < 0 ? Math.ceil(value) : Math.floor(value);
    }
  };
  var defaultRoundingMethod = "trunc";
  function getRoundingMethod(method) {
    return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
  }

  // node_modules/date-fns/esm/differenceInHours/index.js
  function differenceInHours(dateLeft, dateRight, options) {
    requiredArgs(2, arguments);
    var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInHour;
    return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
  }

  // node_modules/date-fns/esm/differenceInMinutes/index.js
  function differenceInMinutes(dateLeft, dateRight, options) {
    requiredArgs(2, arguments);
    var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
    return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
  }

  // node_modules/date-fns/esm/endOfDay/index.js
  function endOfDay(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfMonth/index.js
  function endOfMonth(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var month = date.getMonth();
    date.setFullYear(date.getFullYear(), month + 1, 0);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/isLastDayOfMonth/index.js
  function isLastDayOfMonth(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    return endOfDay(date).getTime() === endOfMonth(date).getTime();
  }

  // node_modules/date-fns/esm/differenceInMonths/index.js
  function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var sign2 = compareAsc(dateLeft, dateRight);
    var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
    var result;
    if (difference < 1) {
      result = 0;
    } else {
      if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
        dateLeft.setDate(30);
      }
      dateLeft.setMonth(dateLeft.getMonth() - sign2 * difference);
      var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign2;
      if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
        isLastMonthNotFull = false;
      }
      result = sign2 * (difference - Number(isLastMonthNotFull));
    }
    return result === 0 ? 0 : result;
  }

  // node_modules/date-fns/esm/differenceInQuarters/index.js
  function differenceInQuarters(dateLeft, dateRight, options) {
    requiredArgs(2, arguments);
    var diff = differenceInMonths(dateLeft, dateRight) / 3;
    return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
  }

  // node_modules/date-fns/esm/differenceInSeconds/index.js
  function differenceInSeconds(dateLeft, dateRight, options) {
    requiredArgs(2, arguments);
    var diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
    return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
  }

  // node_modules/date-fns/esm/differenceInWeeks/index.js
  function differenceInWeeks(dateLeft, dateRight, options) {
    requiredArgs(2, arguments);
    var diff = differenceInDays(dateLeft, dateRight) / 7;
    return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
  }

  // node_modules/date-fns/esm/differenceInYears/index.js
  function differenceInYears(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var sign2 = compareAsc(dateLeft, dateRight);
    var difference = Math.abs(differenceInCalendarYears(dateLeft, dateRight));
    dateLeft.setFullYear(1584);
    dateRight.setFullYear(1584);
    var isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign2;
    var result = sign2 * (difference - Number(isLastYearNotFull));
    return result === 0 ? 0 : result;
  }

  // node_modules/date-fns/esm/startOfMinute/index.js
  function startOfMinute(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setSeconds(0, 0);
    return date;
  }

  // node_modules/date-fns/esm/startOfQuarter/index.js
  function startOfQuarter(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var currentMonth = date.getMonth();
    var month = currentMonth - currentMonth % 3;
    date.setMonth(month, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/startOfMonth/index.js
  function startOfMonth(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/startOfYear/index.js
  function startOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var cleanDate = toDate(dirtyDate);
    var date = new Date(0);
    date.setFullYear(cleanDate.getFullYear(), 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/endOfYear/index.js
  function endOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getFullYear();
    date.setFullYear(year + 1, 0, 0);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfHour/index.js
  function endOfHour(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setMinutes(59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfWeek/index.js
  function endOfWeek(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    var date = toDate(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfMinute/index.js
  function endOfMinute(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setSeconds(59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfQuarter/index.js
  function endOfQuarter(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var currentMonth = date.getMonth();
    var month = currentMonth - currentMonth % 3 + 3;
    date.setMonth(month, 0);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // node_modules/date-fns/esm/endOfSecond/index.js
  function endOfSecond(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setMilliseconds(999);
    return date;
  }

  // node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js
  var formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  var formatDistance = function(token, count, options) {
    var result;
    var tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options !== null && options !== void 0 && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }
    return result;
  };
  var formatDistance_default = formatDistance;

  // node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js
  function buildFormatLongFn(args) {
    return function() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format2 = args.formats[width] || args.formats[args.defaultWidth];
      return format2;
    };
  }

  // node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js
  var dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  var timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  var formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
  var formatLong_default = formatLong;

  // node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js
  var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
  var formatRelative = function(token, _date, _baseDate, _options) {
    return formatRelativeLocale[token];
  };
  var formatRelative_default = formatRelative;

  // node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js
  function buildLocalizeFn(args) {
    return function(dirtyIndex, dirtyOptions) {
      var options = dirtyOptions || {};
      var context = options.context ? String(options.context) : "standalone";
      var valuesArray;
      if (context === "formatting" && args.formattingValues) {
        var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        var width = options.width ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        var _defaultWidth = args.defaultWidth;
        var _width = options.width ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[_width] || args.values[_defaultWidth];
      }
      var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
      return valuesArray[index];
    };
  }

  // node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js
  var eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  };
  var quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  };
  var monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  var dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  var dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  var formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  var ordinalNumber = function(dirtyNumber, _options) {
    var number = Number(dirtyNumber);
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + "st";
        case 2:
          return number + "nd";
        case 3:
          return number + "rd";
      }
    }
    return number + "th";
  };
  var localize = {
    ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: function(quarter) {
        return quarter - 1;
      }
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
  var localize_default = localize;

  // node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js
  function buildMatchFn(args) {
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var width = options.width;
      var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      var matchedString = matchResult[0];
      var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
        return pattern.test(matchedString);
      }) : findKey(parsePatterns, function(pattern) {
        return pattern.test(matchedString);
      });
      var value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value,
        rest
      };
    };
  }
  function findKey(object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key;
      }
    }
    return void 0;
  }
  function findIndex(array, predicate) {
    for (var key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return void 0;
  }

  // node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js
  function buildMatchPatternFn(args) {
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var matchResult = string.match(args.matchPattern);
      if (!matchResult)
        return null;
      var matchedString = matchResult[0];
      var parseResult = string.match(args.parsePattern);
      if (!parseResult)
        return null;
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value,
        rest
      };
    };
  }

  // node_modules/date-fns/esm/locale/en-US/_lib/match/index.js
  var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  var parseOrdinalNumberPattern = /\d+/i;
  var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  var parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  var parseMonthPatterns = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  };
  var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  var parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  var parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  var match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function(value) {
        return parseInt(value, 10);
      }
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: function(index) {
        return index + 1;
      }
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
  var match_default = match;

  // node_modules/date-fns/esm/locale/en-US/index.js
  var locale = {
    code: "en-US",
    formatDistance: formatDistance_default,
    formatLong: formatLong_default,
    formatRelative: formatRelative_default,
    localize: localize_default,
    match: match_default,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  var en_US_default = locale;

  // node_modules/date-fns/esm/subMilliseconds/index.js
  function subMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, -amount);
  }

  // node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
  function addLeadingZeros(number, targetLength) {
    var sign2 = number < 0 ? "-" : "";
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = "0" + output;
    }
    return sign2 + output;
  }

  // node_modules/date-fns/esm/_lib/format/lightFormatters/index.js
  var formatters2 = {
    y: function(date, token) {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
    },
    M: function(date, token) {
      var month = date.getUTCMonth();
      return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    d: function(date, token) {
      return addLeadingZeros(date.getUTCDate(), token.length);
    },
    a: function(date, token) {
      var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return dayPeriodEnumValue.toUpperCase();
        case "aaa":
          return dayPeriodEnumValue;
        case "aaaaa":
          return dayPeriodEnumValue[0];
        case "aaaa":
        default:
          return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
      }
    },
    h: function(date, token) {
      return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
    },
    H: function(date, token) {
      return addLeadingZeros(date.getUTCHours(), token.length);
    },
    m: function(date, token) {
      return addLeadingZeros(date.getUTCMinutes(), token.length);
    },
    s: function(date, token) {
      return addLeadingZeros(date.getUTCSeconds(), token.length);
    },
    S: function(date, token) {
      var numberOfDigits = token.length;
      var milliseconds = date.getUTCMilliseconds();
      var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };
  var lightFormatters_default = formatters2;

  // node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js
  var MILLISECONDS_IN_DAY2 = 864e5;
  function getUTCDayOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY2) + 1;
  }

  // node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js
  function startOfUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js
  function getUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }

  // node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js
  function startOfUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var year = getUTCISOWeekYear(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary);
    return date;
  }

  // node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js
  var MILLISECONDS_IN_WEEK = 6048e5;
  function getUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
  }

  // node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js
  function startOfUTCWeek(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js
  function getUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate, dirtyOptions);
    var year = date.getUTCFullYear();
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
    }
    var firstWeekOfNextYear = new Date(0);
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
    var firstWeekOfThisYear = new Date(0);
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }

  // node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js
  function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    var year = getUTCWeekYear(dirtyDate, dirtyOptions);
    var firstWeek = new Date(0);
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCWeek(firstWeek, dirtyOptions);
    return date;
  }

  // node_modules/date-fns/esm/_lib/getUTCWeek/index.js
  var MILLISECONDS_IN_WEEK2 = 6048e5;
  function getUTCWeek(dirtyDate, options) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK2) + 1;
  }

  // node_modules/date-fns/esm/_lib/format/formatters/index.js
  var dayPeriodEnum = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  };
  var formatters3 = {
    G: function(date, token, localize2) {
      var era = date.getUTCFullYear() > 0 ? 1 : 0;
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return localize2.era(era, {
            width: "abbreviated"
          });
        case "GGGGG":
          return localize2.era(era, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return localize2.era(era, {
            width: "wide"
          });
      }
    },
    y: function(date, token, localize2) {
      if (token === "yo") {
        var signedYear = date.getUTCFullYear();
        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize2.ordinalNumber(year, {
          unit: "year"
        });
      }
      return lightFormatters_default.y(date, token);
    },
    Y: function(date, token, localize2, options) {
      var signedWeekYear = getUTCWeekYear(date, options);
      var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
      if (token === "YY") {
        var twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }
      if (token === "Yo") {
        return localize2.ordinalNumber(weekYear, {
          unit: "year"
        });
      }
      return addLeadingZeros(weekYear, token.length);
    },
    R: function(date, token) {
      var isoWeekYear = getUTCISOWeekYear(date);
      return addLeadingZeros(isoWeekYear, token.length);
    },
    u: function(date, token) {
      var year = date.getUTCFullYear();
      return addLeadingZeros(year, token.length);
    },
    Q: function(date, token, localize2) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        case "Q":
          return String(quarter);
        case "QQ":
          return addLeadingZeros(quarter, 2);
        case "Qo":
          return localize2.ordinalNumber(quarter, {
            unit: "quarter"
          });
        case "QQQ":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    q: function(date, token, localize2) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        case "q":
          return String(quarter);
        case "qq":
          return addLeadingZeros(quarter, 2);
        case "qo":
          return localize2.ordinalNumber(quarter, {
            unit: "quarter"
          });
        case "qqq":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    M: function(date, token, localize2) {
      var month = date.getUTCMonth();
      switch (token) {
        case "M":
        case "MM":
          return lightFormatters_default.M(date, token);
        case "Mo":
          return localize2.ordinalNumber(month + 1, {
            unit: "month"
          });
        case "MMM":
          return localize2.month(month, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return localize2.month(month, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return localize2.month(month, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    L: function(date, token, localize2) {
      var month = date.getUTCMonth();
      switch (token) {
        case "L":
          return String(month + 1);
        case "LL":
          return addLeadingZeros(month + 1, 2);
        case "Lo":
          return localize2.ordinalNumber(month + 1, {
            unit: "month"
          });
        case "LLL":
          return localize2.month(month, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return localize2.month(month, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return localize2.month(month, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    w: function(date, token, localize2, options) {
      var week = getUTCWeek(date, options);
      if (token === "wo") {
        return localize2.ordinalNumber(week, {
          unit: "week"
        });
      }
      return addLeadingZeros(week, token.length);
    },
    I: function(date, token, localize2) {
      var isoWeek = getUTCISOWeek(date);
      if (token === "Io") {
        return localize2.ordinalNumber(isoWeek, {
          unit: "week"
        });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    d: function(date, token, localize2) {
      if (token === "do") {
        return localize2.ordinalNumber(date.getUTCDate(), {
          unit: "date"
        });
      }
      return lightFormatters_default.d(date, token);
    },
    D: function(date, token, localize2) {
      var dayOfYear = getUTCDayOfYear(date);
      if (token === "Do") {
        return localize2.ordinalNumber(dayOfYear, {
          unit: "dayOfYear"
        });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    E: function(date, token, localize2) {
      var dayOfWeek = date.getUTCDay();
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    e: function(date, token, localize2, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "e":
          return String(localDayOfWeek);
        case "ee":
          return addLeadingZeros(localDayOfWeek, 2);
        case "eo":
          return localize2.ordinalNumber(localDayOfWeek, {
            unit: "day"
          });
        case "eee":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    c: function(date, token, localize2, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "c":
          return String(localDayOfWeek);
        case "cc":
          return addLeadingZeros(localDayOfWeek, token.length);
        case "co":
          return localize2.ordinalNumber(localDayOfWeek, {
            unit: "day"
          });
        case "ccc":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    i: function(date, token, localize2) {
      var dayOfWeek = date.getUTCDay();
      var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        case "i":
          return String(isoDayOfWeek);
        case "ii":
          return addLeadingZeros(isoDayOfWeek, token.length);
        case "io":
          return localize2.ordinalNumber(isoDayOfWeek, {
            unit: "day"
          });
        case "iii":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    a: function(date, token, localize2) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    b: function(date, token, localize2) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      }
      switch (token) {
        case "b":
        case "bb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    B: function(date, token, localize2) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    h: function(date, token, localize2) {
      if (token === "ho") {
        var hours = date.getUTCHours() % 12;
        if (hours === 0)
          hours = 12;
        return localize2.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return lightFormatters_default.h(date, token);
    },
    H: function(date, token, localize2) {
      if (token === "Ho") {
        return localize2.ordinalNumber(date.getUTCHours(), {
          unit: "hour"
        });
      }
      return lightFormatters_default.H(date, token);
    },
    K: function(date, token, localize2) {
      var hours = date.getUTCHours() % 12;
      if (token === "Ko") {
        return localize2.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    k: function(date, token, localize2) {
      var hours = date.getUTCHours();
      if (hours === 0)
        hours = 24;
      if (token === "ko") {
        return localize2.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    m: function(date, token, localize2) {
      if (token === "mo") {
        return localize2.ordinalNumber(date.getUTCMinutes(), {
          unit: "minute"
        });
      }
      return lightFormatters_default.m(date, token);
    },
    s: function(date, token, localize2) {
      if (token === "so") {
        return localize2.ordinalNumber(date.getUTCSeconds(), {
          unit: "second"
        });
      }
      return lightFormatters_default.s(date, token);
    },
    S: function(date, token) {
      return lightFormatters_default.S(date, token);
    },
    X: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return "Z";
      }
      switch (token) {
        case "X":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "XXXX":
        case "XX":
          return formatTimezone(timezoneOffset);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    x: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        case "x":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "xxxx":
        case "xx":
          return formatTimezone(timezoneOffset);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    O: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    z: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();
      switch (token) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    t: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = Math.floor(originalDate.getTime() / 1e3);
      return addLeadingZeros(timestamp, token.length);
    },
    T: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = originalDate.getTime();
      return addLeadingZeros(timestamp, token.length);
    }
  };
  function formatTimezoneShort(offset, dirtyDelimiter) {
    var sign2 = offset > 0 ? "-" : "+";
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    if (minutes === 0) {
      return sign2 + String(hours);
    }
    var delimiter = dirtyDelimiter || "";
    return sign2 + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
      var sign2 = offset > 0 ? "-" : "+";
      return sign2 + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, dirtyDelimiter);
  }
  function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || "";
    var sign2 = offset > 0 ? "-" : "+";
    var absOffset = Math.abs(offset);
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
    var minutes = addLeadingZeros(absOffset % 60, 2);
    return sign2 + hours + delimiter + minutes;
  }
  var formatters_default = formatters3;

  // node_modules/date-fns/esm/_lib/format/longFormatters/index.js
  function dateLongFormatter(pattern, formatLong2) {
    switch (pattern) {
      case "P":
        return formatLong2.date({
          width: "short"
        });
      case "PP":
        return formatLong2.date({
          width: "medium"
        });
      case "PPP":
        return formatLong2.date({
          width: "long"
        });
      case "PPPP":
      default:
        return formatLong2.date({
          width: "full"
        });
    }
  }
  function timeLongFormatter(pattern, formatLong2) {
    switch (pattern) {
      case "p":
        return formatLong2.time({
          width: "short"
        });
      case "pp":
        return formatLong2.time({
          width: "medium"
        });
      case "ppp":
        return formatLong2.time({
          width: "long"
        });
      case "pppp":
      default:
        return formatLong2.time({
          width: "full"
        });
    }
  }
  function dateTimeLongFormatter(pattern, formatLong2) {
    var matchResult = pattern.match(/(P+)(p+)?/);
    var datePattern = matchResult[1];
    var timePattern = matchResult[2];
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong2);
    }
    var dateTimeFormat;
    switch (datePattern) {
      case "P":
        dateTimeFormat = formatLong2.dateTime({
          width: "short"
        });
        break;
      case "PP":
        dateTimeFormat = formatLong2.dateTime({
          width: "medium"
        });
        break;
      case "PPP":
        dateTimeFormat = formatLong2.dateTime({
          width: "long"
        });
        break;
      case "PPPP":
      default:
        dateTimeFormat = formatLong2.dateTime({
          width: "full"
        });
        break;
    }
    return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
  }
  var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };
  var longFormatters_default = longFormatters;

  // node_modules/date-fns/esm/_lib/protectedTokens/index.js
  var protectedDayOfYearTokens = ["D", "DD"];
  var protectedWeekYearTokens = ["YY", "YYYY"];
  function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1;
  }
  function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1;
  }
  function throwProtectedError(token, format2, input) {
    if (token === "YYYY") {
      throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
    } else if (token === "YY") {
      throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
    } else if (token === "D") {
      throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
    } else if (token === "DD") {
      throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
    }
  }

  // node_modules/date-fns/esm/format/index.js
  var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  var escapedStringRegExp = /^'([^]*?)'?$/;
  var doubleQuoteRegExp = /''/g;
  var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
  function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
    requiredArgs(2, arguments);
    var formatStr = String(dirtyFormatStr);
    var options = dirtyOptions || {};
    var locale2 = options.locale || en_US_default;
    var localeFirstWeekContainsDate = locale2.options && locale2.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
    }
    var localeWeekStartsOn = locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    if (!locale2.localize) {
      throw new RangeError("locale must contain localize property");
    }
    if (!locale2.formatLong) {
      throw new RangeError("locale must contain formatLong property");
    }
    var originalDate = toDate(dirtyDate);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
    var utcDate = subMilliseconds(originalDate, timezoneOffset);
    var formatterOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale: locale2,
      _originalDate: originalDate
    };
    var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
      var firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        var longFormatter = longFormatters_default[firstCharacter];
        return longFormatter(substring, locale2.formatLong, formatterOptions);
      }
      return substring;
    }).join("").match(formattingTokensRegExp).map(function(substring) {
      if (substring === "''") {
        return "'";
      }
      var firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return cleanEscapedString(substring);
      }
      var formatter = formatters_default[firstCharacter];
      if (formatter) {
        if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, dirtyDate);
        }
        if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, dirtyDate);
        }
        return formatter(utcDate, substring, locale2.localize, formatterOptions);
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
      }
      return substring;
    }).join("");
    return result;
  }
  function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
  }

  // node_modules/date-fns/esm/_lib/assign/index.js
  function assign(target, dirtyObject) {
    if (target == null) {
      throw new TypeError("assign requires that input parameter not be null or undefined");
    }
    dirtyObject = dirtyObject || {};
    for (var property in dirtyObject) {
      if (Object.prototype.hasOwnProperty.call(dirtyObject, property)) {
        target[property] = dirtyObject[property];
      }
    }
    return target;
  }

  // node_modules/date-fns/esm/_lib/setUTCDay/index.js
  function setUTCDay(dirtyDate, dirtyDay, dirtyOptions) {
    requiredArgs(2, arguments);
    var options = dirtyOptions || {};
    var locale2 = options.locale;
    var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    var date = toDate(dirtyDate);
    var day = toInteger(dirtyDay);
    var currentDay = date.getUTCDay();
    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;
    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }

  // node_modules/date-fns/esm/_lib/setUTCISODay/index.js
  function setUTCISODay(dirtyDate, dirtyDay) {
    requiredArgs(2, arguments);
    var day = toInteger(dirtyDay);
    if (day % 7 === 0) {
      day = day - 7;
    }
    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var currentDay = date.getUTCDay();
    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;
    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }

  // node_modules/date-fns/esm/_lib/setUTCISOWeek/index.js
  function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var isoWeek = toInteger(dirtyISOWeek);
    var diff = getUTCISOWeek(date) - isoWeek;
    date.setUTCDate(date.getUTCDate() - diff * 7);
    return date;
  }

  // node_modules/date-fns/esm/_lib/setUTCWeek/index.js
  function setUTCWeek(dirtyDate, dirtyWeek, options) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var week = toInteger(dirtyWeek);
    var diff = getUTCWeek(date, options) - week;
    date.setUTCDate(date.getUTCDate() - diff * 7);
    return date;
  }

  // node_modules/date-fns/esm/parse/_lib/parsers/index.js
  var MILLISECONDS_IN_HOUR2 = 36e5;
  var MILLISECONDS_IN_MINUTE2 = 6e4;
  var MILLISECONDS_IN_SECOND = 1e3;
  var numericPatterns = {
    month: /^(1[0-2]|0?\d)/,
    date: /^(3[0-1]|[0-2]?\d)/,
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    week: /^(5[0-3]|[0-4]?\d)/,
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    hour11h: /^(1[0-1]|0?\d)/,
    hour12h: /^(1[0-2]|0?\d)/,
    minute: /^[0-5]?\d/,
    second: /^[0-5]?\d/,
    singleDigit: /^\d/,
    twoDigits: /^\d{1,2}/,
    threeDigits: /^\d{1,3}/,
    fourDigits: /^\d{1,4}/,
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    twoDigitsSigned: /^-?\d{1,2}/,
    threeDigitsSigned: /^-?\d{1,3}/,
    fourDigitsSigned: /^-?\d{1,4}/
  };
  var timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
  };
  function parseNumericPattern(pattern, string, valueCallback) {
    var matchResult = string.match(pattern);
    if (!matchResult) {
      return null;
    }
    var value = parseInt(matchResult[0], 10);
    return {
      value: valueCallback ? valueCallback(value) : value,
      rest: string.slice(matchResult[0].length)
    };
  }
  function parseTimezonePattern(pattern, string) {
    var matchResult = string.match(pattern);
    if (!matchResult) {
      return null;
    }
    if (matchResult[0] === "Z") {
      return {
        value: 0,
        rest: string.slice(1)
      };
    }
    var sign2 = matchResult[1] === "+" ? 1 : -1;
    var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
    var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
    var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
    return {
      value: sign2 * (hours * MILLISECONDS_IN_HOUR2 + minutes * MILLISECONDS_IN_MINUTE2 + seconds * MILLISECONDS_IN_SECOND),
      rest: string.slice(matchResult[0].length)
    };
  }
  function parseAnyDigitsSigned(string, valueCallback) {
    return parseNumericPattern(numericPatterns.anyDigitsSigned, string, valueCallback);
  }
  function parseNDigits(n, string, valueCallback) {
    switch (n) {
      case 1:
        return parseNumericPattern(numericPatterns.singleDigit, string, valueCallback);
      case 2:
        return parseNumericPattern(numericPatterns.twoDigits, string, valueCallback);
      case 3:
        return parseNumericPattern(numericPatterns.threeDigits, string, valueCallback);
      case 4:
        return parseNumericPattern(numericPatterns.fourDigits, string, valueCallback);
      default:
        return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), string, valueCallback);
    }
  }
  function parseNDigitsSigned(n, string, valueCallback) {
    switch (n) {
      case 1:
        return parseNumericPattern(numericPatterns.singleDigitSigned, string, valueCallback);
      case 2:
        return parseNumericPattern(numericPatterns.twoDigitsSigned, string, valueCallback);
      case 3:
        return parseNumericPattern(numericPatterns.threeDigitsSigned, string, valueCallback);
      case 4:
        return parseNumericPattern(numericPatterns.fourDigitsSigned, string, valueCallback);
      default:
        return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), string, valueCallback);
    }
  }
  function dayPeriodEnumToHours(enumValue) {
    switch (enumValue) {
      case "morning":
        return 4;
      case "evening":
        return 17;
      case "pm":
      case "noon":
      case "afternoon":
        return 12;
      case "am":
      case "midnight":
      case "night":
      default:
        return 0;
    }
  }
  function normalizeTwoDigitYear(twoDigitYear, currentYear) {
    var isCommonEra = currentYear > 0;
    var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
    var result;
    if (absCurrentYear <= 50) {
      result = twoDigitYear || 100;
    } else {
      var rangeEnd = absCurrentYear + 50;
      var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
      var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
      result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
    }
    return isCommonEra ? result : 1 - result;
  }
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function isLeapYearIndex(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
  }
  var parsers = {
    G: {
      priority: 140,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "G":
          case "GG":
          case "GGG":
            return match2.era(string, {
              width: "abbreviated"
            }) || match2.era(string, {
              width: "narrow"
            });
          case "GGGGG":
            return match2.era(string, {
              width: "narrow"
            });
          case "GGGG":
          default:
            return match2.era(string, {
              width: "wide"
            }) || match2.era(string, {
              width: "abbreviated"
            }) || match2.era(string, {
              width: "narrow"
            });
        }
      },
      set: function(date, flags, value, _options) {
        flags.era = value;
        date.setUTCFullYear(value, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["R", "u", "t", "T"]
    },
    y: {
      priority: 130,
      parse: function(string, token, match2, _options) {
        var valueCallback = function(year) {
          return {
            year,
            isTwoDigitYear: token === "yy"
          };
        };
        switch (token) {
          case "y":
            return parseNDigits(4, string, valueCallback);
          case "yo":
            return match2.ordinalNumber(string, {
              unit: "year",
              valueCallback
            });
          default:
            return parseNDigits(token.length, string, valueCallback);
        }
      },
      validate: function(_date, value, _options) {
        return value.isTwoDigitYear || value.year > 0;
      },
      set: function(date, flags, value, _options) {
        var currentYear = date.getUTCFullYear();
        if (value.isTwoDigitYear) {
          var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
          date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
          date.setUTCHours(0, 0, 0, 0);
          return date;
        }
        var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
        date.setUTCFullYear(year, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]
    },
    Y: {
      priority: 130,
      parse: function(string, token, match2, _options) {
        var valueCallback = function(year) {
          return {
            year,
            isTwoDigitYear: token === "YY"
          };
        };
        switch (token) {
          case "Y":
            return parseNDigits(4, string, valueCallback);
          case "Yo":
            return match2.ordinalNumber(string, {
              unit: "year",
              valueCallback
            });
          default:
            return parseNDigits(token.length, string, valueCallback);
        }
      },
      validate: function(_date, value, _options) {
        return value.isTwoDigitYear || value.year > 0;
      },
      set: function(date, flags, value, options) {
        var currentYear = getUTCWeekYear(date, options);
        if (value.isTwoDigitYear) {
          var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
          date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
          date.setUTCHours(0, 0, 0, 0);
          return startOfUTCWeek(date, options);
        }
        var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
        date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options);
      },
      incompatibleTokens: ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"]
    },
    R: {
      priority: 130,
      parse: function(string, token, _match, _options) {
        if (token === "R") {
          return parseNDigitsSigned(4, string);
        }
        return parseNDigitsSigned(token.length, string);
      },
      set: function(_date, _flags, value, _options) {
        var firstWeekOfYear = new Date(0);
        firstWeekOfYear.setUTCFullYear(value, 0, 4);
        firstWeekOfYear.setUTCHours(0, 0, 0, 0);
        return startOfUTCISOWeek(firstWeekOfYear);
      },
      incompatibleTokens: ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]
    },
    u: {
      priority: 130,
      parse: function(string, token, _match, _options) {
        if (token === "u") {
          return parseNDigitsSigned(4, string);
        }
        return parseNDigitsSigned(token.length, string);
      },
      set: function(date, _flags, value, _options) {
        date.setUTCFullYear(value, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]
    },
    Q: {
      priority: 120,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "Q":
          case "QQ":
            return parseNDigits(token.length, string);
          case "Qo":
            return match2.ordinalNumber(string, {
              unit: "quarter"
            });
          case "QQQ":
            return match2.quarter(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.quarter(string, {
              width: "narrow",
              context: "formatting"
            });
          case "QQQQQ":
            return match2.quarter(string, {
              width: "narrow",
              context: "formatting"
            });
          case "QQQQ":
          default:
            return match2.quarter(string, {
              width: "wide",
              context: "formatting"
            }) || match2.quarter(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.quarter(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 4;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMonth((value - 1) * 3, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]
    },
    q: {
      priority: 120,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "q":
          case "qq":
            return parseNDigits(token.length, string);
          case "qo":
            return match2.ordinalNumber(string, {
              unit: "quarter"
            });
          case "qqq":
            return match2.quarter(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.quarter(string, {
              width: "narrow",
              context: "standalone"
            });
          case "qqqqq":
            return match2.quarter(string, {
              width: "narrow",
              context: "standalone"
            });
          case "qqqq":
          default:
            return match2.quarter(string, {
              width: "wide",
              context: "standalone"
            }) || match2.quarter(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.quarter(string, {
              width: "narrow",
              context: "standalone"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 4;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMonth((value - 1) * 3, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]
    },
    M: {
      priority: 110,
      parse: function(string, token, match2, _options) {
        var valueCallback = function(value) {
          return value - 1;
        };
        switch (token) {
          case "M":
            return parseNumericPattern(numericPatterns.month, string, valueCallback);
          case "MM":
            return parseNDigits(2, string, valueCallback);
          case "Mo":
            return match2.ordinalNumber(string, {
              unit: "month",
              valueCallback
            });
          case "MMM":
            return match2.month(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.month(string, {
              width: "narrow",
              context: "formatting"
            });
          case "MMMMM":
            return match2.month(string, {
              width: "narrow",
              context: "formatting"
            });
          case "MMMM":
          default:
            return match2.month(string, {
              width: "wide",
              context: "formatting"
            }) || match2.month(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.month(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 11;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMonth(value, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"]
    },
    L: {
      priority: 110,
      parse: function(string, token, match2, _options) {
        var valueCallback = function(value) {
          return value - 1;
        };
        switch (token) {
          case "L":
            return parseNumericPattern(numericPatterns.month, string, valueCallback);
          case "LL":
            return parseNDigits(2, string, valueCallback);
          case "Lo":
            return match2.ordinalNumber(string, {
              unit: "month",
              valueCallback
            });
          case "LLL":
            return match2.month(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.month(string, {
              width: "narrow",
              context: "standalone"
            });
          case "LLLLL":
            return match2.month(string, {
              width: "narrow",
              context: "standalone"
            });
          case "LLLL":
          default:
            return match2.month(string, {
              width: "wide",
              context: "standalone"
            }) || match2.month(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.month(string, {
              width: "narrow",
              context: "standalone"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 11;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMonth(value, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"]
    },
    w: {
      priority: 100,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "w":
            return parseNumericPattern(numericPatterns.week, string);
          case "wo":
            return match2.ordinalNumber(string, {
              unit: "week"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 53;
      },
      set: function(date, _flags, value, options) {
        return startOfUTCWeek(setUTCWeek(date, value, options), options);
      },
      incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"]
    },
    I: {
      priority: 100,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "I":
            return parseNumericPattern(numericPatterns.week, string);
          case "Io":
            return match2.ordinalNumber(string, {
              unit: "week"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 53;
      },
      set: function(date, _flags, value, options) {
        return startOfUTCISOWeek(setUTCISOWeek(date, value, options), options);
      },
      incompatibleTokens: ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]
    },
    d: {
      priority: 90,
      subPriority: 1,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "d":
            return parseNumericPattern(numericPatterns.date, string);
          case "do":
            return match2.ordinalNumber(string, {
              unit: "date"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(date, value, _options) {
        var year = date.getUTCFullYear();
        var isLeapYear = isLeapYearIndex(year);
        var month = date.getUTCMonth();
        if (isLeapYear) {
          return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
        } else {
          return value >= 1 && value <= DAYS_IN_MONTH[month];
        }
      },
      set: function(date, _flags, value, _options) {
        date.setUTCDate(value);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"]
    },
    D: {
      priority: 90,
      subPriority: 1,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "D":
          case "DD":
            return parseNumericPattern(numericPatterns.dayOfYear, string);
          case "Do":
            return match2.ordinalNumber(string, {
              unit: "date"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(date, value, _options) {
        var year = date.getUTCFullYear();
        var isLeapYear = isLeapYearIndex(year);
        if (isLeapYear) {
          return value >= 1 && value <= 366;
        } else {
          return value >= 1 && value <= 365;
        }
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMonth(0, value);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"]
    },
    E: {
      priority: 90,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "E":
          case "EE":
          case "EEE":
            return match2.day(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "EEEEE":
            return match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "EEEEEE":
            return match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "EEEE":
          default:
            return match2.day(string, {
              width: "wide",
              context: "formatting"
            }) || match2.day(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 6;
      },
      set: function(date, _flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["D", "i", "e", "c", "t", "T"]
    },
    e: {
      priority: 90,
      parse: function(string, token, match2, options) {
        var valueCallback = function(value) {
          var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
        };
        switch (token) {
          case "e":
          case "ee":
            return parseNDigits(token.length, string, valueCallback);
          case "eo":
            return match2.ordinalNumber(string, {
              unit: "day",
              valueCallback
            });
          case "eee":
            return match2.day(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "eeeee":
            return match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "eeeeee":
            return match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
          case "eeee":
          default:
            return match2.day(string, {
              width: "wide",
              context: "formatting"
            }) || match2.day(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(string, {
              width: "short",
              context: "formatting"
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 6;
      },
      set: function(date, _flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"]
    },
    c: {
      priority: 90,
      parse: function(string, token, match2, options) {
        var valueCallback = function(value) {
          var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
        };
        switch (token) {
          case "c":
          case "cc":
            return parseNDigits(token.length, string, valueCallback);
          case "co":
            return match2.ordinalNumber(string, {
              unit: "day",
              valueCallback
            });
          case "ccc":
            return match2.day(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.day(string, {
              width: "short",
              context: "standalone"
            }) || match2.day(string, {
              width: "narrow",
              context: "standalone"
            });
          case "ccccc":
            return match2.day(string, {
              width: "narrow",
              context: "standalone"
            });
          case "cccccc":
            return match2.day(string, {
              width: "short",
              context: "standalone"
            }) || match2.day(string, {
              width: "narrow",
              context: "standalone"
            });
          case "cccc":
          default:
            return match2.day(string, {
              width: "wide",
              context: "standalone"
            }) || match2.day(string, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.day(string, {
              width: "short",
              context: "standalone"
            }) || match2.day(string, {
              width: "narrow",
              context: "standalone"
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 6;
      },
      set: function(date, _flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"]
    },
    i: {
      priority: 90,
      parse: function(string, token, match2, _options) {
        var valueCallback = function(value) {
          if (value === 0) {
            return 7;
          }
          return value;
        };
        switch (token) {
          case "i":
          case "ii":
            return parseNDigits(token.length, string);
          case "io":
            return match2.ordinalNumber(string, {
              unit: "day"
            });
          case "iii":
            return match2.day(string, {
              width: "abbreviated",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "short",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting",
              valueCallback
            });
          case "iiiii":
            return match2.day(string, {
              width: "narrow",
              context: "formatting",
              valueCallback
            });
          case "iiiiii":
            return match2.day(string, {
              width: "short",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting",
              valueCallback
            });
          case "iiii":
          default:
            return match2.day(string, {
              width: "wide",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "abbreviated",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "short",
              context: "formatting",
              valueCallback
            }) || match2.day(string, {
              width: "narrow",
              context: "formatting",
              valueCallback
            });
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 7;
      },
      set: function(date, _flags, value, options) {
        date = setUTCISODay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"]
    },
    a: {
      priority: 80,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "a":
          case "aa":
          case "aaa":
            return match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaaa":
            return match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaa":
          default:
            return match2.dayPeriod(string, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      set: function(date, _flags, value, _options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["b", "B", "H", "K", "k", "t", "T"]
    },
    b: {
      priority: 80,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "b":
          case "bb":
          case "bbb":
            return match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbbb":
            return match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbb":
          default:
            return match2.dayPeriod(string, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      set: function(date, _flags, value, _options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["a", "B", "H", "K", "k", "t", "T"]
    },
    B: {
      priority: 80,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "B":
          case "BB":
          case "BBB":
            return match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBBB":
            return match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBB":
          default:
            return match2.dayPeriod(string, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(string, {
              width: "narrow",
              context: "formatting"
            });
        }
      },
      set: function(date, _flags, value, _options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["a", "b", "t", "T"]
    },
    h: {
      priority: 70,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "h":
            return parseNumericPattern(numericPatterns.hour12h, string);
          case "ho":
            return match2.ordinalNumber(string, {
              unit: "hour"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 12;
      },
      set: function(date, _flags, value, _options) {
        var isPM = date.getUTCHours() >= 12;
        if (isPM && value < 12) {
          date.setUTCHours(value + 12, 0, 0, 0);
        } else if (!isPM && value === 12) {
          date.setUTCHours(0, 0, 0, 0);
        } else {
          date.setUTCHours(value, 0, 0, 0);
        }
        return date;
      },
      incompatibleTokens: ["H", "K", "k", "t", "T"]
    },
    H: {
      priority: 70,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "H":
            return parseNumericPattern(numericPatterns.hour23h, string);
          case "Ho":
            return match2.ordinalNumber(string, {
              unit: "hour"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 23;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCHours(value, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["a", "b", "h", "K", "k", "t", "T"]
    },
    K: {
      priority: 70,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "K":
            return parseNumericPattern(numericPatterns.hour11h, string);
          case "Ko":
            return match2.ordinalNumber(string, {
              unit: "hour"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 11;
      },
      set: function(date, _flags, value, _options) {
        var isPM = date.getUTCHours() >= 12;
        if (isPM && value < 12) {
          date.setUTCHours(value + 12, 0, 0, 0);
        } else {
          date.setUTCHours(value, 0, 0, 0);
        }
        return date;
      },
      incompatibleTokens: ["a", "b", "h", "H", "k", "t", "T"]
    },
    k: {
      priority: 70,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "k":
            return parseNumericPattern(numericPatterns.hour24h, string);
          case "ko":
            return match2.ordinalNumber(string, {
              unit: "hour"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 1 && value <= 24;
      },
      set: function(date, _flags, value, _options) {
        var hours = value <= 24 ? value % 24 : value;
        date.setUTCHours(hours, 0, 0, 0);
        return date;
      },
      incompatibleTokens: ["a", "b", "h", "H", "K", "t", "T"]
    },
    m: {
      priority: 60,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "m":
            return parseNumericPattern(numericPatterns.minute, string);
          case "mo":
            return match2.ordinalNumber(string, {
              unit: "minute"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 59;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMinutes(value, 0, 0);
        return date;
      },
      incompatibleTokens: ["t", "T"]
    },
    s: {
      priority: 50,
      parse: function(string, token, match2, _options) {
        switch (token) {
          case "s":
            return parseNumericPattern(numericPatterns.second, string);
          case "so":
            return match2.ordinalNumber(string, {
              unit: "second"
            });
          default:
            return parseNDigits(token.length, string);
        }
      },
      validate: function(_date, value, _options) {
        return value >= 0 && value <= 59;
      },
      set: function(date, _flags, value, _options) {
        date.setUTCSeconds(value, 0);
        return date;
      },
      incompatibleTokens: ["t", "T"]
    },
    S: {
      priority: 30,
      parse: function(string, token, _match, _options) {
        var valueCallback = function(value) {
          return Math.floor(value * Math.pow(10, -token.length + 3));
        };
        return parseNDigits(token.length, string, valueCallback);
      },
      set: function(date, _flags, value, _options) {
        date.setUTCMilliseconds(value);
        return date;
      },
      incompatibleTokens: ["t", "T"]
    },
    X: {
      priority: 10,
      parse: function(string, token, _match, _options) {
        switch (token) {
          case "X":
            return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, string);
          case "XX":
            return parseTimezonePattern(timezonePatterns.basic, string);
          case "XXXX":
            return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, string);
          case "XXXXX":
            return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, string);
          case "XXX":
          default:
            return parseTimezonePattern(timezonePatterns.extended, string);
        }
      },
      set: function(date, flags, value, _options) {
        if (flags.timestampIsSet) {
          return date;
        }
        return new Date(date.getTime() - value);
      },
      incompatibleTokens: ["t", "T", "x"]
    },
    x: {
      priority: 10,
      parse: function(string, token, _match, _options) {
        switch (token) {
          case "x":
            return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, string);
          case "xx":
            return parseTimezonePattern(timezonePatterns.basic, string);
          case "xxxx":
            return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, string);
          case "xxxxx":
            return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, string);
          case "xxx":
          default:
            return parseTimezonePattern(timezonePatterns.extended, string);
        }
      },
      set: function(date, flags, value, _options) {
        if (flags.timestampIsSet) {
          return date;
        }
        return new Date(date.getTime() - value);
      },
      incompatibleTokens: ["t", "T", "X"]
    },
    t: {
      priority: 40,
      parse: function(string, _token, _match, _options) {
        return parseAnyDigitsSigned(string);
      },
      set: function(_date, _flags, value, _options) {
        return [new Date(value * 1e3), {
          timestampIsSet: true
        }];
      },
      incompatibleTokens: "*"
    },
    T: {
      priority: 20,
      parse: function(string, _token, _match, _options) {
        return parseAnyDigitsSigned(string);
      },
      set: function(_date, _flags, value, _options) {
        return [new Date(value), {
          timestampIsSet: true
        }];
      },
      incompatibleTokens: "*"
    }
  };
  var parsers_default = parsers;

  // node_modules/date-fns/esm/parse/index.js
  var TIMEZONE_UNIT_PRIORITY = 10;
  var formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  var escapedStringRegExp2 = /^'([^]*?)'?$/;
  var doubleQuoteRegExp2 = /''/g;
  var notWhitespaceRegExp = /\S/;
  var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
  function parse2(dirtyDateString, dirtyFormatString, dirtyReferenceDate, dirtyOptions) {
    requiredArgs(3, arguments);
    var dateString = String(dirtyDateString);
    var formatString = String(dirtyFormatString);
    var options = dirtyOptions || {};
    var locale2 = options.locale || en_US_default;
    if (!locale2.match) {
      throw new RangeError("locale must contain match property");
    }
    var localeFirstWeekContainsDate = locale2.options && locale2.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
    }
    var localeWeekStartsOn = locale2.options && locale2.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    if (formatString === "") {
      if (dateString === "") {
        return toDate(dirtyReferenceDate);
      } else {
        return new Date(NaN);
      }
    }
    var subFnOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale: locale2
    };
    var setters = [{
      priority: TIMEZONE_UNIT_PRIORITY,
      subPriority: -1,
      set: dateToSystemTimezone,
      index: 0
    }];
    var i;
    var tokens = formatString.match(longFormattingTokensRegExp2).map(function(substring) {
      var firstCharacter2 = substring[0];
      if (firstCharacter2 === "p" || firstCharacter2 === "P") {
        var longFormatter = longFormatters_default[firstCharacter2];
        return longFormatter(substring, locale2.formatLong, subFnOptions);
      }
      return substring;
    }).join("").match(formattingTokensRegExp2);
    var usedTokens = [];
    for (i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      var firstCharacter = token[0];
      var parser = parsers_default[firstCharacter];
      if (parser) {
        var incompatibleTokens = parser.incompatibleTokens;
        if (Array.isArray(incompatibleTokens)) {
          var incompatibleToken = void 0;
          for (var _i = 0; _i < usedTokens.length; _i++) {
            var usedToken = usedTokens[_i].token;
            if (incompatibleTokens.indexOf(usedToken) !== -1 || usedToken === firstCharacter) {
              incompatibleToken = usedTokens[_i];
              break;
            }
          }
          if (incompatibleToken) {
            throw new RangeError("The format string mustn't contain `".concat(incompatibleToken.fullToken, "` and `").concat(token, "` at the same time"));
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length) {
          throw new RangeError("The format string mustn't contain `".concat(token, "` and any other token at the same time"));
        }
        usedTokens.push({
          token: firstCharacter,
          fullToken: token
        });
        var parseResult = parser.parse(dateString, token, locale2.match, subFnOptions);
        if (!parseResult) {
          return new Date(NaN);
        }
        setters.push({
          priority: parser.priority,
          subPriority: parser.subPriority || 0,
          set: parser.set,
          validate: parser.validate,
          value: parseResult.value,
          index: setters.length
        });
        dateString = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
          throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString2(token);
        }
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length);
        } else {
          return new Date(NaN);
        }
      }
    }
    if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
      return new Date(NaN);
    }
    var uniquePrioritySetters = setters.map(function(setter2) {
      return setter2.priority;
    }).sort(function(a, b) {
      return b - a;
    }).filter(function(priority, index, array) {
      return array.indexOf(priority) === index;
    }).map(function(priority) {
      return setters.filter(function(setter2) {
        return setter2.priority === priority;
      }).sort(function(a, b) {
        return b.subPriority - a.subPriority;
      });
    }).map(function(setterArray) {
      return setterArray[0];
    });
    var date = toDate(dirtyReferenceDate);
    if (isNaN(date)) {
      return new Date(NaN);
    }
    var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
    var flags = {};
    for (i = 0; i < uniquePrioritySetters.length; i++) {
      var setter = uniquePrioritySetters[i];
      if (setter.validate && !setter.validate(utcDate, setter.value, subFnOptions)) {
        return new Date(NaN);
      }
      var result = setter.set(utcDate, flags, setter.value, subFnOptions);
      if (result[0]) {
        utcDate = result[0];
        assign(flags, result[1]);
      } else {
        utcDate = result;
      }
    }
    return utcDate;
  }
  function dateToSystemTimezone(date, flags) {
    if (flags.timestampIsSet) {
      return date;
    }
    var convertedDate = new Date(0);
    convertedDate.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    convertedDate.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    return convertedDate;
  }
  function cleanEscapedString2(input) {
    return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'");
  }

  // node_modules/date-fns/esm/startOfHour/index.js
  function startOfHour(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setMinutes(0, 0, 0);
    return date;
  }

  // node_modules/date-fns/esm/startOfSecond/index.js
  function startOfSecond(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setMilliseconds(0);
    return date;
  }

  // node_modules/date-fns/esm/parseISO/index.js
  var MILLISECONDS_IN_HOUR3 = 36e5;
  var MILLISECONDS_IN_MINUTE3 = 6e4;
  var DEFAULT_ADDITIONAL_DIGITS = 2;
  var patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/
  };
  var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
  var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
  var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
  function parseISO(argument, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {};
    var additionalDigits = options.additionalDigits == null ? DEFAULT_ADDITIONAL_DIGITS : toInteger(options.additionalDigits);
    if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
      throw new RangeError("additionalDigits must be 0, 1 or 2");
    }
    if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
      return new Date(NaN);
    }
    var dateStrings = splitDateString(argument);
    var date;
    if (dateStrings.date) {
      var parseYearResult = parseYear(dateStrings.date, additionalDigits);
      date = parseDate(parseYearResult.restDateString, parseYearResult.year);
    }
    if (isNaN(date) || !date) {
      return new Date(NaN);
    }
    var timestamp = date.getTime();
    var time = 0;
    var offset;
    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
      if (isNaN(time) || time === null) {
        return new Date(NaN);
      }
    }
    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
      if (isNaN(offset)) {
        return new Date(NaN);
      }
    } else {
      var dirtyDate = new Date(timestamp + time);
      var result = new Date(0);
      result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
      result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
      return result;
    }
    return new Date(timestamp + time + offset);
  }
  function splitDateString(dateString) {
    var dateStrings = {};
    var array = dateString.split(patterns.dateTimeDelimiter);
    var timeString;
    if (array.length > 2) {
      return dateStrings;
    }
    if (/:/.test(array[0])) {
      dateStrings.date = null;
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
      if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
        dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
        timeString = dateString.substr(dateStrings.date.length, dateString.length);
      }
    }
    if (timeString) {
      var token = patterns.timezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], "");
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }
    return dateStrings;
  }
  function parseYear(dateString, additionalDigits) {
    var regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
    var captures = dateString.match(regex);
    if (!captures)
      return {
        year: null
      };
    var year = captures[1] && parseInt(captures[1]);
    var century = captures[2] && parseInt(captures[2]);
    return {
      year: century == null ? year : century * 100,
      restDateString: dateString.slice((captures[1] || captures[2]).length)
    };
  }
  function parseDate(dateString, year) {
    if (year === null)
      return null;
    var captures = dateString.match(dateRegex);
    if (!captures)
      return null;
    var isWeekDate = !!captures[4];
    var dayOfYear = parseDateUnit(captures[1]);
    var month = parseDateUnit(captures[2]) - 1;
    var day = parseDateUnit(captures[3]);
    var week = parseDateUnit(captures[4]);
    var dayOfWeek = parseDateUnit(captures[5]) - 1;
    if (isWeekDate) {
      if (!validateWeekDate(year, week, dayOfWeek)) {
        return new Date(NaN);
      }
      return dayOfISOWeekYear(year, week, dayOfWeek);
    } else {
      var date = new Date(0);
      if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
        return new Date(NaN);
      }
      date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
      return date;
    }
  }
  function parseDateUnit(value) {
    return value ? parseInt(value) : 1;
  }
  function parseTime(timeString) {
    var captures = timeString.match(timeRegex);
    if (!captures)
      return null;
    var hours = parseTimeUnit(captures[1]);
    var minutes = parseTimeUnit(captures[2]);
    var seconds = parseTimeUnit(captures[3]);
    if (!validateTime(hours, minutes, seconds)) {
      return NaN;
    }
    return hours * MILLISECONDS_IN_HOUR3 + minutes * MILLISECONDS_IN_MINUTE3 + seconds * 1e3;
  }
  function parseTimeUnit(value) {
    return value && parseFloat(value.replace(",", ".")) || 0;
  }
  function parseTimezone(timezoneString) {
    if (timezoneString === "Z")
      return 0;
    var captures = timezoneString.match(timezoneRegex);
    if (!captures)
      return 0;
    var sign2 = captures[1] === "+" ? -1 : 1;
    var hours = parseInt(captures[2]);
    var minutes = captures[3] && parseInt(captures[3]) || 0;
    if (!validateTimezone(hours, minutes)) {
      return NaN;
    }
    return sign2 * (hours * MILLISECONDS_IN_HOUR3 + minutes * MILLISECONDS_IN_MINUTE3);
  }
  function dayOfISOWeekYear(isoWeekYear, week, day) {
    var date = new Date(0);
    date.setUTCFullYear(isoWeekYear, 0, 4);
    var fourthOfJanuaryDay = date.getUTCDay() || 7;
    var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }
  var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function isLeapYearIndex2(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100;
  }
  function validateDate(year, month, date) {
    return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex2(year) ? 29 : 28));
  }
  function validateDayOfYearDate(year, dayOfYear) {
    return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex2(year) ? 366 : 365);
  }
  function validateWeekDate(_year, week, day) {
    return week >= 1 && week <= 53 && day >= 0 && day <= 6;
  }
  function validateTime(hours, minutes, seconds) {
    if (hours === 24) {
      return minutes === 0 && seconds === 0;
    }
    return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
  }
  function validateTimezone(_hours, minutes) {
    return minutes >= 0 && minutes <= 59;
  }

  // node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js
  var FORMATS = {
    datetime: "MMM d, yyyy, h:mm:ss aaaa",
    millisecond: "h:mm:ss.SSS aaaa",
    second: "h:mm:ss aaaa",
    minute: "h:mm aaaa",
    hour: "ha",
    day: "MMM d",
    week: "PP",
    month: "MMM yyyy",
    quarter: "qqq - yyyy",
    year: "yyyy"
  };
  adapters._date.override({
    _id: "date-fns",
    formats: function() {
      return FORMATS;
    },
    parse: function(value, fmt) {
      if (value === null || typeof value === "undefined") {
        return null;
      }
      const type = typeof value;
      if (type === "number" || value instanceof Date) {
        value = toDate(value);
      } else if (type === "string") {
        if (typeof fmt === "string") {
          value = parse2(value, fmt, new Date(), this.options);
        } else {
          value = parseISO(value, this.options);
        }
      }
      return isValid(value) ? value.getTime() : null;
    },
    format: function(time, fmt) {
      return format(time, fmt, this.options);
    },
    add: function(time, amount, unit) {
      switch (unit) {
        case "millisecond":
          return addMilliseconds(time, amount);
        case "second":
          return addSeconds(time, amount);
        case "minute":
          return addMinutes(time, amount);
        case "hour":
          return addHours(time, amount);
        case "day":
          return addDays(time, amount);
        case "week":
          return addWeeks(time, amount);
        case "month":
          return addMonths(time, amount);
        case "quarter":
          return addQuarters(time, amount);
        case "year":
          return addYears(time, amount);
        default:
          return time;
      }
    },
    diff: function(max, min, unit) {
      switch (unit) {
        case "millisecond":
          return differenceInMilliseconds(max, min);
        case "second":
          return differenceInSeconds(max, min);
        case "minute":
          return differenceInMinutes(max, min);
        case "hour":
          return differenceInHours(max, min);
        case "day":
          return differenceInDays(max, min);
        case "week":
          return differenceInWeeks(max, min);
        case "month":
          return differenceInMonths(max, min);
        case "quarter":
          return differenceInQuarters(max, min);
        case "year":
          return differenceInYears(max, min);
        default:
          return 0;
      }
    },
    startOf: function(time, unit, weekday) {
      switch (unit) {
        case "second":
          return startOfSecond(time);
        case "minute":
          return startOfMinute(time);
        case "hour":
          return startOfHour(time);
        case "day":
          return startOfDay(time);
        case "week":
          return startOfWeek(time);
        case "isoWeek":
          return startOfWeek(time, { weekStartsOn: +weekday });
        case "month":
          return startOfMonth(time);
        case "quarter":
          return startOfQuarter(time);
        case "year":
          return startOfYear(time);
        default:
          return time;
      }
    },
    endOf: function(time, unit) {
      switch (unit) {
        case "second":
          return endOfSecond(time);
        case "minute":
          return endOfMinute(time);
        case "hour":
          return endOfHour(time);
        case "day":
          return endOfDay(time);
        case "week":
          return endOfWeek(time);
        case "month":
          return endOfMonth(time);
        case "quarter":
          return endOfQuarter(time);
        case "year":
          return endOfYear(time);
        default:
          return time;
      }
    }
  });

  // js/results.json
  var results_default = [{ label: "France", data: [{ x: "2020-01-22T00:00:00Z", y: 0 }, { x: "2020-01-23T00:00:00Z", y: 0 }, { x: "2020-01-24T00:00:00Z", y: 0 }, { x: "2020-01-25T00:00:00Z", y: 0 }, { x: "2020-01-26T00:00:00Z", y: 0 }, { x: "2020-01-27T00:00:00Z", y: 0 }, { x: "2020-01-28T00:00:00Z", y: 0 }, { x: "2020-01-29T00:00:00Z", y: 0 }, { x: "2020-01-30T00:00:00Z", y: 0 }, { x: "2020-01-31T00:00:00Z", y: 0 }, { x: "2020-02-01T00:00:00Z", y: 0 }, { x: "2020-02-02T00:00:00Z", y: 0 }, { x: "2020-02-03T00:00:00Z", y: 0 }, { x: "2020-02-04T00:00:00Z", y: 0 }, { x: "2020-02-05T00:00:00Z", y: 0 }, { x: "2020-02-06T00:00:00Z", y: 0 }, { x: "2020-02-07T00:00:00Z", y: 0 }, { x: "2020-02-08T00:00:00Z", y: 0 }, { x: "2020-02-09T00:00:00Z", y: 0 }, { x: "2020-02-10T00:00:00Z", y: 0 }, { x: "2020-02-11T00:00:00Z", y: 0 }, { x: "2020-02-12T00:00:00Z", y: 0 }, { x: "2020-02-13T00:00:00Z", y: 0 }, { x: "2020-02-14T00:00:00Z", y: 0 }, { x: "2020-02-15T00:00:00Z", y: 1 }, { x: "2020-02-16T00:00:00Z", y: 1 }, { x: "2020-02-17T00:00:00Z", y: 1 }, { x: "2020-02-18T00:00:00Z", y: 1 }, { x: "2020-02-19T00:00:00Z", y: 1 }, { x: "2020-02-20T00:00:00Z", y: 1 }, { x: "2020-02-21T00:00:00Z", y: 1 }, { x: "2020-02-22T00:00:00Z", y: 1 }, { x: "2020-02-23T00:00:00Z", y: 1 }, { x: "2020-02-24T00:00:00Z", y: 1 }, { x: "2020-02-25T00:00:00Z", y: 1 }, { x: "2020-02-26T00:00:00Z", y: 2 }, { x: "2020-02-27T00:00:00Z", y: 2 }, { x: "2020-02-28T00:00:00Z", y: 2 }, { x: "2020-02-29T00:00:00Z", y: 2 }, { x: "2020-03-01T00:00:00Z", y: 2 }, { x: "2020-03-02T00:00:00Z", y: 3 }, { x: "2020-03-03T00:00:00Z", y: 4 }, { x: "2020-03-04T00:00:00Z", y: 4 }, { x: "2020-03-05T00:00:00Z", y: 7 }, { x: "2020-03-06T00:00:00Z", y: 9 }, { x: "2020-03-07T00:00:00Z", y: 16 }, { x: "2020-03-08T00:00:00Z", y: 19 }, { x: "2020-03-09T00:00:00Z", y: 25 }, { x: "2020-03-10T00:00:00Z", y: 33 }, { x: "2020-03-11T00:00:00Z", y: 48 }, { x: "2020-03-12T00:00:00Z", y: 48 }, { x: "2020-03-13T00:00:00Z", y: 79 }, { x: "2020-03-14T00:00:00Z", y: 91 }, { x: "2020-03-15T00:00:00Z", y: 91 }, { x: "2020-03-16T00:00:00Z", y: 149 }, { x: "2020-03-17T00:00:00Z", y: 149 }, { x: "2020-03-18T00:00:00Z", y: 149 }, { x: "2020-03-19T00:00:00Z", y: 244 }, { x: "2020-03-20T00:00:00Z", y: 451 }, { x: "2020-03-21T00:00:00Z", y: 563 }, { x: "2020-03-22T00:00:00Z", y: 676 }, { x: "2020-03-23T00:00:00Z", y: 862 }, { x: "2020-03-24T00:00:00Z", y: 1102 }, { x: "2020-03-25T00:00:00Z", y: 1333 }, { x: "2020-03-26T00:00:00Z", y: 1697 }, { x: "2020-03-27T00:00:00Z", y: 1996 }, { x: "2020-03-28T00:00:00Z", y: 2314 }, { x: "2020-03-29T00:00:00Z", y: 2608 }, { x: "2020-03-30T00:00:00Z", y: 3025 }, { x: "2020-03-31T00:00:00Z", y: 3526 }, { x: "2020-04-01T00:00:00Z", y: 4779 }, { x: "2020-04-02T00:00:00Z", y: 5388 }, { x: "2020-04-03T00:00:00Z", y: 6510 }, { x: "2020-04-04T00:00:00Z", y: 7562 }, { x: "2020-04-05T00:00:00Z", y: 8081 }, { x: "2020-04-06T00:00:00Z", y: 8914 }, { x: "2020-04-07T00:00:00Z", y: 10330 }, { x: "2020-04-08T00:00:00Z", y: 10874 }, { x: "2020-04-09T00:00:00Z", y: 12214 }, { x: "2020-04-10T00:00:00Z", y: 13199 }, { x: "2020-04-11T00:00:00Z", y: 13835 }, { x: "2020-04-12T00:00:00Z", y: 14396 }, { x: "2020-04-13T00:00:00Z", y: 14969 }, { x: "2020-04-14T00:00:00Z", y: 15712 }, { x: "2020-04-15T00:00:00Z", y: 17150 }, { x: "2020-04-16T00:00:00Z", y: 17903 }, { x: "2020-04-17T00:00:00Z", y: 18664 }, { x: "2020-04-18T00:00:00Z", y: 19305 }, { x: "2020-04-19T00:00:00Z", y: 19694 }, { x: "2020-04-20T00:00:00Z", y: 20241 }, { x: "2020-04-21T00:00:00Z", y: 20769 }, { x: "2020-04-22T00:00:00Z", y: 21313 }, { x: "2020-04-23T00:00:00Z", y: 21829 }, { x: "2020-04-24T00:00:00Z", y: 22218 }, { x: "2020-04-25T00:00:00Z", y: 22587 }, { x: "2020-04-26T00:00:00Z", y: 22830 }, { x: "2020-04-27T00:00:00Z", y: 23267 }, { x: "2020-04-28T00:00:00Z", y: 23634 }, { x: "2020-04-29T00:00:00Z", y: 24060 }, { x: "2020-04-30T00:00:00Z", y: 24349 }, { x: "2020-05-01T00:00:00Z", y: 24566 }, { x: "2020-05-02T00:00:00Z", y: 24763 }, { x: "2020-05-03T00:00:00Z", y: 24898 }, { x: "2020-05-04T00:00:00Z", y: 25204 }, { x: "2020-05-05T00:00:00Z", y: 25537 }, { x: "2020-05-06T00:00:00Z", y: 25812 }, { x: "2020-05-07T00:00:00Z", y: 25991 }, { x: "2020-05-08T00:00:00Z", y: 26233 }, { x: "2020-05-09T00:00:00Z", y: 26313 }, { x: "2020-05-10T00:00:00Z", y: 26383 }, { x: "2020-05-11T00:00:00Z", y: 26646 }, { x: "2020-05-12T00:00:00Z", y: 26994 }, { x: "2020-05-13T00:00:00Z", y: 27079 }, { x: "2020-05-14T00:00:00Z", y: 27430 }, { x: "2020-05-15T00:00:00Z", y: 27532 }, { x: "2020-05-16T00:00:00Z", y: 27630 }, { x: "2020-05-17T00:00:00Z", y: 28113 }, { x: "2020-05-18T00:00:00Z", y: 28242 }, { x: "2020-05-19T00:00:00Z", y: 28025 }, { x: "2020-05-20T00:00:00Z", y: 28136 }, { x: "2020-05-21T00:00:00Z", y: 28218 }, { x: "2020-05-22T00:00:00Z", y: 28366 }, { x: "2020-05-23T00:00:00Z", y: 28452 }, { x: "2020-05-24T00:00:00Z", y: 28372 }, { x: "2020-05-25T00:00:00Z", y: 28461 }, { x: "2020-05-26T00:00:00Z", y: 28598 }, { x: "2020-05-27T00:00:00Z", y: 28599 }, { x: "2020-05-28T00:00:00Z", y: 28666 }, { x: "2020-05-29T00:00:00Z", y: 28717 }, { x: "2020-05-30T00:00:00Z", y: 28774 }, { x: "2020-05-31T00:00:00Z", y: 28805 }, { x: "2020-06-01T00:00:00Z", y: 28837 }, { x: "2020-06-02T00:00:00Z", y: 28943 }, { x: "2020-06-03T00:00:00Z", y: 29024 }, { x: "2020-06-04T00:00:00Z", y: 29069 }, { x: "2020-06-05T00:00:00Z", y: 29114 }, { x: "2020-06-06T00:00:00Z", y: 29145 }, { x: "2020-06-07T00:00:00Z", y: 29158 }, { x: "2020-06-08T00:00:00Z", y: 29213 }, { x: "2020-06-09T00:00:00Z", y: 29301 }, { x: "2020-06-10T00:00:00Z", y: 29322 }, { x: "2020-06-11T00:00:00Z", y: 29349 }, { x: "2020-06-12T00:00:00Z", y: 29377 }, { x: "2020-06-13T00:00:00Z", y: 29401 }, { x: "2020-06-14T00:00:00Z", y: 29411 }, { x: "2020-06-15T00:00:00Z", y: 29439 }, { x: "2020-06-16T00:00:00Z", y: 29553 }, { x: "2020-06-17T00:00:00Z", y: 29578 }, { x: "2020-06-18T00:00:00Z", y: 29606 }, { x: "2020-06-19T00:00:00Z", y: 29620 }, { x: "2020-06-20T00:00:00Z", y: 29638 }, { x: "2020-06-21T00:00:00Z", y: 29644 }, { x: "2020-06-22T00:00:00Z", y: 29668 }, { x: "2020-06-23T00:00:00Z", y: 29722 }, { x: "2020-06-24T00:00:00Z", y: 29735 }, { x: "2020-06-25T00:00:00Z", y: 29754 }, { x: "2020-06-26T00:00:00Z", y: 29780 }, { x: "2020-06-27T00:00:00Z", y: 29781 }, { x: "2020-06-28T00:00:00Z", y: 29781 }, { x: "2020-06-29T00:00:00Z", y: 29816 }, { x: "2020-06-30T00:00:00Z", y: 29846 }, { x: "2020-07-01T00:00:00Z", y: 29865 }, { x: "2020-07-02T00:00:00Z", y: 29878 }, { x: "2020-07-03T00:00:00Z", y: 29896 }, { x: "2020-07-04T00:00:00Z", y: 29896 }, { x: "2020-07-05T00:00:00Z", y: 29895 }, { x: "2020-07-06T00:00:00Z", y: 29925 }, { x: "2020-07-07T00:00:00Z", y: 29936 }, { x: "2020-07-08T00:00:00Z", y: 29967 }, { x: "2020-07-09T00:00:00Z", y: 29983 }, { x: "2020-07-10T00:00:00Z", y: 30009 }, { x: "2020-07-11T00:00:00Z", y: 30012 }, { x: "2020-07-12T00:00:00Z", y: 30012 }, { x: "2020-07-13T00:00:00Z", y: 30035 }, { x: "2020-07-14T00:00:00Z", y: 30037 }, { x: "2020-07-15T00:00:00Z", y: 30125 }, { x: "2020-07-16T00:00:00Z", y: 30142 }, { x: "2020-07-17T00:00:00Z", y: 30155 }, { x: "2020-07-18T00:00:00Z", y: 30158 }, { x: "2020-07-19T00:00:00Z", y: 30158 }, { x: "2020-07-20T00:00:00Z", y: 30182 }, { x: "2020-07-21T00:00:00Z", y: 30169 }, { x: "2020-07-22T00:00:00Z", y: 30175 }, { x: "2020-07-23T00:00:00Z", y: 30186 }, { x: "2020-07-24T00:00:00Z", y: 30196 }, { x: "2020-07-25T00:00:00Z", y: 30196 }, { x: "2020-07-26T00:00:00Z", y: 30196 }, { x: "2020-07-27T00:00:00Z", y: 30214 }, { x: "2020-07-28T00:00:00Z", y: 30227 }, { x: "2020-07-29T00:00:00Z", y: 30241 }, { x: "2020-07-30T00:00:00Z", y: 30257 }, { x: "2020-07-31T00:00:00Z", y: 30268 }, { x: "2020-08-01T00:00:00Z", y: 30268 }, { x: "2020-08-02T00:00:00Z", y: 30268 }, { x: "2020-08-03T00:00:00Z", y: 30298 }, { x: "2020-08-04T00:00:00Z", y: 30300 }, { x: "2020-08-05T00:00:00Z", y: 30311 }, { x: "2020-08-06T00:00:00Z", y: 30315 }, { x: "2020-08-07T00:00:00Z", y: 30328 }, { x: "2020-08-08T00:00:00Z", y: 30329 }, { x: "2020-08-09T00:00:00Z", y: 30329 }, { x: "2020-08-10T00:00:00Z", y: 30344 }, { x: "2020-08-11T00:00:00Z", y: 30357 }, { x: "2020-08-12T00:00:00Z", y: 30376 }, { x: "2020-08-13T00:00:00Z", y: 30393 }, { x: "2020-08-14T00:00:00Z", y: 30412 }, { x: "2020-08-15T00:00:00Z", y: 30413 }, { x: "2020-08-16T00:00:00Z", y: 30415 }, { x: "2020-08-17T00:00:00Z", y: 30434 }, { x: "2020-08-18T00:00:00Z", y: 30456 }, { x: "2020-08-19T00:00:00Z", y: 30474 }, { x: "2020-08-20T00:00:00Z", y: 30485 }, { x: "2020-08-21T00:00:00Z", y: 30509 }, { x: "2020-08-22T00:00:00Z", y: 30518 }, { x: "2020-08-23T00:00:00Z", y: 30518 }, { x: "2020-08-24T00:00:00Z", y: 30534 }, { x: "2020-08-25T00:00:00Z", y: 30553 }, { x: "2020-08-26T00:00:00Z", y: 30553 }, { x: "2020-08-27T00:00:00Z", y: 30588 }, { x: "2020-08-28T00:00:00Z", y: 30606 }, { x: "2020-08-29T00:00:00Z", y: 30612 }, { x: "2020-08-30T00:00:00Z", y: 30615 }, { x: "2020-08-31T00:00:00Z", y: 30646 }, { x: "2020-09-01T00:00:00Z", y: 30673 }, { x: "2020-09-02T00:00:00Z", y: 30699 }, { x: "2020-09-03T00:00:00Z", y: 30716 }, { x: "2020-09-04T00:00:00Z", y: 30696 }, { x: "2020-09-05T00:00:00Z", y: 30708 }, { x: "2020-09-06T00:00:00Z", y: 30712 }, { x: "2020-09-07T00:00:00Z", y: 30735 }, { x: "2020-09-08T00:00:00Z", y: 30773 }, { x: "2020-09-09T00:00:00Z", y: 30805 }, { x: "2020-09-10T00:00:00Z", y: 30824 }, { x: "2020-09-11T00:00:00Z", y: 30906 }, { x: "2020-09-12T00:00:00Z", y: 30924 }, { x: "2020-09-13T00:00:00Z", y: 30929 }, { x: "2020-09-14T00:00:00Z", y: 30963 }, { x: "2020-09-15T00:00:00Z", y: 31013 }, { x: "2020-09-16T00:00:00Z", y: 31061 }, { x: "2020-09-17T00:00:00Z", y: 31108 }, { x: "2020-09-18T00:00:00Z", y: 31262 }, { x: "2020-09-19T00:00:00Z", y: 31287 }, { x: "2020-09-20T00:00:00Z", y: 31298 }, { x: "2020-09-21T00:00:00Z", y: 31351 }, { x: "2020-09-22T00:00:00Z", y: 31430 }, { x: "2020-09-23T00:00:00Z", y: 31476 }, { x: "2020-09-24T00:00:00Z", y: 31524 }, { x: "2020-09-25T00:00:00Z", y: 31675 }, { x: "2020-09-26T00:00:00Z", y: 31714 }, { x: "2020-09-27T00:00:00Z", y: 31741 }, { x: "2020-09-28T00:00:00Z", y: 31825 }, { x: "2020-09-29T00:00:00Z", y: 31898 }, { x: "2020-09-30T00:00:00Z", y: 31978 }, { x: "2020-10-01T00:00:00Z", y: 32035 }, { x: "2020-10-02T00:00:00Z", y: 32171 }, { x: "2020-10-03T00:00:00Z", y: 32196 }, { x: "2020-10-04T00:00:00Z", y: 32228 }, { x: "2020-10-05T00:00:00Z", y: 32299 }, { x: "2020-10-06T00:00:00Z", y: 32386 }, { x: "2020-10-07T00:00:00Z", y: 32466 }, { x: "2020-10-08T00:00:00Z", y: 32539 }, { x: "2020-10-09T00:00:00Z", y: 32649 }, { x: "2020-10-10T00:00:00Z", y: 32684 }, { x: "2020-10-11T00:00:00Z", y: 32730 }, { x: "2020-10-12T00:00:00Z", y: 32827 }, { x: "2020-10-13T00:00:00Z", y: 32955 }, { x: "2020-10-14T00:00:00Z", y: 33061 }, { x: "2020-10-15T00:00:00Z", y: 33146 }, { x: "2020-10-16T00:00:00Z", y: 33325 }, { x: "2020-10-17T00:00:00Z", y: 33398 }, { x: "2020-10-18T00:00:00Z", y: 33483 }, { x: "2020-10-19T00:00:00Z", y: 33631 }, { x: "2020-10-20T00:00:00Z", y: 33912 }, { x: "2020-10-21T00:00:00Z", y: 34080 }, { x: "2020-10-22T00:00:00Z", y: 34234 }, { x: "2020-10-23T00:00:00Z", y: 34534 }, { x: "2020-10-24T00:00:00Z", y: 34670 }, { x: "2020-10-25T00:00:00Z", y: 34649 }, { x: "2020-10-26T00:00:00Z", y: 35038 }, { x: "2020-10-27T00:00:00Z", y: 35566 }, { x: "2020-10-28T00:00:00Z", y: 35825 }, { x: "2020-10-29T00:00:00Z", y: 36058 }, { x: "2020-10-30T00:00:00Z", y: 36605 }, { x: "2020-10-31T00:00:00Z", y: 36827 }, { x: "2020-11-01T00:00:00Z", y: 37058 }, { x: "2020-11-02T00:00:00Z", y: 37486 }, { x: "2020-11-03T00:00:00Z", y: 38765 }, { x: "2020-11-04T00:00:00Z", y: 38731 }, { x: "2020-11-05T00:00:00Z", y: 39088 }, { x: "2020-11-06T00:00:00Z", y: 39917 }, { x: "2020-11-07T00:00:00Z", y: 40220 }, { x: "2020-11-08T00:00:00Z", y: 40490 }, { x: "2020-11-09T00:00:00Z", y: 41050 }, { x: "2020-11-10T00:00:00Z", y: 42281 }, { x: "2020-11-11T00:00:00Z", y: 42609 }, { x: "2020-11-12T00:00:00Z", y: 43024 }, { x: "2020-11-13T00:00:00Z", y: 43957 }, { x: "2020-11-14T00:00:00Z", y: 44310 }, { x: "2020-11-15T00:00:00Z", y: 44613 }, { x: "2020-11-16T00:00:00Z", y: 45124 }, { x: "2020-11-17T00:00:00Z", y: 46350 }, { x: "2020-11-18T00:00:00Z", y: 46781 }, { x: "2020-11-19T00:00:00Z", y: 47198 }, { x: "2020-11-20T00:00:00Z", y: 48339 }, { x: "2020-11-21T00:00:00Z", y: 48591 }, { x: "2020-11-22T00:00:00Z", y: 48805 }, { x: "2020-11-23T00:00:00Z", y: 49311 }, { x: "2020-11-24T00:00:00Z", y: 50322 }, { x: "2020-11-25T00:00:00Z", y: 50710 }, { x: "2020-11-26T00:00:00Z", y: 51041 }, { x: "2020-11-27T00:00:00Z", y: 52e3 }, { x: "2020-11-28T00:00:00Z", y: 52212 }, { x: "2020-11-29T00:00:00Z", y: 52410 }, { x: "2020-11-30T00:00:00Z", y: 52818 }, { x: "2020-12-01T00:00:00Z", y: 53595 }, { x: "2020-12-02T00:00:00Z", y: 53906 }, { x: "2020-12-03T00:00:00Z", y: 54230 }, { x: "2020-12-04T00:00:00Z", y: 54860 }, { x: "2020-12-05T00:00:00Z", y: 55072 }, { x: "2020-12-06T00:00:00Z", y: 55246 }, { x: "2020-12-07T00:00:00Z", y: 55612 }, { x: "2020-12-08T00:00:00Z", y: 56450 }, { x: "2020-12-09T00:00:00Z", y: 56747 }, { x: "2020-12-10T00:00:00Z", y: 57043 }, { x: "2020-12-11T00:00:00Z", y: 57671 }, { x: "2020-12-12T00:00:00Z", y: 57864 }, { x: "2020-12-13T00:00:00Z", y: 58014 }, { x: "2020-12-14T00:00:00Z", y: 58390 }, { x: "2020-12-15T00:00:00Z", y: 59181 }, { x: "2020-12-16T00:00:00Z", y: 59471 }, { x: "2020-12-17T00:00:00Z", y: 59732 }, { x: "2020-12-18T00:00:00Z", y: 60344 }, { x: "2020-12-19T00:00:00Z", y: 60533 }, { x: "2020-12-20T00:00:00Z", y: 60664 }, { x: "2020-12-21T00:00:00Z", y: 61018 }, { x: "2020-12-22T00:00:00Z", y: 61820 }, { x: "2020-12-23T00:00:00Z", y: 62097 }, { x: "2020-12-24T00:00:00Z", y: 62388 }, { x: "2020-12-25T00:00:00Z", y: 62547 }, { x: "2020-12-26T00:00:00Z", y: 62693 }, { x: "2020-12-27T00:00:00Z", y: 62866 }, { x: "2020-12-28T00:00:00Z", y: 63234 }, { x: "2020-12-29T00:00:00Z", y: 64203 }, { x: "2020-12-30T00:00:00Z", y: 64507 }, { x: "2020-12-31T00:00:00Z", y: 64758 }, { x: "2021-01-01T00:00:00Z", y: 64891 }, { x: "2021-01-02T00:00:00Z", y: 65047 }, { x: "2021-01-03T00:00:00Z", y: 65163 }, { x: "2021-01-04T00:00:00Z", y: 65548 }, { x: "2021-01-05T00:00:00Z", y: 66416 }, { x: "2021-01-06T00:00:00Z", y: 66698 }, { x: "2021-01-07T00:00:00Z", y: 66974 }, { x: "2021-01-08T00:00:00Z", y: 67565 }, { x: "2021-01-09T00:00:00Z", y: 67733 }, { x: "2021-01-10T00:00:00Z", y: 67884 }, { x: "2021-01-11T00:00:00Z", y: 68196 }, { x: "2021-01-12T00:00:00Z", y: 68938 }, { x: "2021-01-13T00:00:00Z", y: 69167 }, { x: "2021-01-14T00:00:00Z", y: 69451 }, { x: "2021-01-15T00:00:00Z", y: 70087 }, { x: "2021-01-16T00:00:00Z", y: 70280 }, { x: "2021-01-17T00:00:00Z", y: 70421 }, { x: "2021-01-18T00:00:00Z", y: 70825 }, { x: "2021-01-19T00:00:00Z", y: 71481 }, { x: "2021-01-20T00:00:00Z", y: 71791 }, { x: "2021-01-21T00:00:00Z", y: 72138 }, { x: "2021-01-22T00:00:00Z", y: 72787 }, { x: "2021-01-23T00:00:00Z", y: 73017 }, { x: "2021-01-24T00:00:00Z", y: 73189 }, { x: "2021-01-25T00:00:00Z", y: 73635 }, { x: "2021-01-26T00:00:00Z", y: 74249 }, { x: "2021-01-27T00:00:00Z", y: 74599 }, { x: "2021-01-28T00:00:00Z", y: 74943 }, { x: "2021-01-29T00:00:00Z", y: 75764 }, { x: "2021-01-30T00:00:00Z", y: 76005 }, { x: "2021-01-31T00:00:00Z", y: 76200 }, { x: "2021-02-01T00:00:00Z", y: 76656 }, { x: "2021-02-02T00:00:00Z", y: 77382 }, { x: "2021-02-03T00:00:00Z", y: 77740 }, { x: "2021-02-04T00:00:00Z", y: 77740 }, { x: "2021-02-05T00:00:00Z", y: 78748 }, { x: "2021-02-06T00:00:00Z", y: 78939 }, { x: "2021-02-07T00:00:00Z", y: 79110 }, { x: "2021-02-08T00:00:00Z", y: 79570 }, { x: "2021-02-09T00:00:00Z", y: 80294 }, { x: "2021-02-10T00:00:00Z", y: 80590 }, { x: "2021-02-11T00:00:00Z", y: 80950 }, { x: "2021-02-12T00:00:00Z", y: 81595 }, { x: "2021-02-13T00:00:00Z", y: 81794 }, { x: "2021-02-14T00:00:00Z", y: 81961 }, { x: "2021-02-15T00:00:00Z", y: 82373 }, { x: "2021-02-16T00:00:00Z", y: 82960 }, { x: "2021-02-17T00:00:00Z", y: 83270 }, { x: "2021-02-18T00:00:00Z", y: 83541 }, { x: "2021-02-19T00:00:00Z", y: 84113 }, { x: "2021-02-20T00:00:00Z", y: 84270 }, { x: "2021-02-21T00:00:00Z", y: 84429 }, { x: "2021-02-22T00:00:00Z", y: 84763 }, { x: "2021-02-23T00:00:00Z", y: 85194 }, { x: "2021-02-24T00:00:00Z", y: 85472 }, { x: "2021-02-25T00:00:00Z", y: 85733 }, { x: "2021-02-26T00:00:00Z", y: 86272 }, { x: "2021-02-27T00:00:00Z", y: 86457 }, { x: "2021-02-28T00:00:00Z", y: 86579 }, { x: "2021-03-01T00:00:00Z", y: 86954 }, { x: "2021-03-02T00:00:00Z", y: 87372 }, { x: "2021-03-03T00:00:00Z", y: 87694 }, { x: "2021-03-04T00:00:00Z", y: 87987 }, { x: "2021-03-05T00:00:00Z", y: 88426 }, { x: "2021-03-06T00:00:00Z", y: 88596 }, { x: "2021-03-07T00:00:00Z", y: 88726 }, { x: "2021-03-08T00:00:00Z", y: 89086 }, { x: "2021-03-09T00:00:00Z", y: 89454 }, { x: "2021-03-10T00:00:00Z", y: 89785 }, { x: "2021-03-11T00:00:00Z", y: 90050 }, { x: "2021-03-12T00:00:00Z", y: 90273 }, { x: "2021-03-13T00:00:00Z", y: 90442 }, { x: "2021-03-14T00:00:00Z", y: 90583 }, { x: "2021-03-15T00:00:00Z", y: 90916 }, { x: "2021-03-16T00:00:00Z", y: 91324 }, { x: "2021-03-17T00:00:00Z", y: 91565 }, { x: "2021-03-18T00:00:00Z", y: 91833 }, { x: "2021-03-19T00:00:00Z", y: 92118 }, { x: "2021-03-20T00:00:00Z", y: 92294 }, { x: "2021-03-21T00:00:00Z", y: 92433 }, { x: "2021-03-22T00:00:00Z", y: 92776 }, { x: "2021-03-23T00:00:00Z", y: 93063 }, { x: "2021-03-24T00:00:00Z", y: 93309 }, { x: "2021-03-25T00:00:00Z", y: 93535 }, { x: "2021-03-26T00:00:00Z", y: 94432 }, { x: "2021-03-27T00:00:00Z", y: 94623 }, { x: "2021-03-28T00:00:00Z", y: 94754 }, { x: "2021-03-29T00:00:00Z", y: 95114 }, { x: "2021-03-30T00:00:00Z", y: 95495 }, { x: "2021-03-31T00:00:00Z", y: 95798 }, { x: "2021-04-01T00:00:00Z", y: 96106 }, { x: "2021-04-02T00:00:00Z", y: 96438 }, { x: "2021-04-03T00:00:00Z", y: 96624 }, { x: "2021-04-04T00:00:00Z", y: 96809 }, { x: "2021-04-05T00:00:00Z", y: 97006 }, { x: "2021-04-06T00:00:00Z", y: 97432 }, { x: "2021-04-07T00:00:00Z", y: 97853 }, { x: "2021-04-08T00:00:00Z", y: 98196 }, { x: "2021-04-09T00:00:00Z", y: 98527 }, { x: "2021-04-10T00:00:00Z", y: 98734 }, { x: "2021-04-11T00:00:00Z", y: 98910 }, { x: "2021-04-12T00:00:00Z", y: 99295 }, { x: "2021-04-13T00:00:00Z", y: 99640 }, { x: "2021-04-14T00:00:00Z", y: 99937 }, { x: "2021-04-15T00:00:00Z", y: 100233 }, { x: "2021-04-16T00:00:00Z", y: 100564 }, { x: "2021-04-17T00:00:00Z", y: 100753 }, { x: "2021-04-18T00:00:00Z", y: 100893 }, { x: "2021-04-19T00:00:00Z", y: 101340 }, { x: "2021-04-20T00:00:00Z", y: 101728 }, { x: "2021-04-21T00:00:00Z", y: 102041 }, { x: "2021-04-22T00:00:00Z", y: 102324 }, { x: "2021-04-23T00:00:00Z", y: 102656 }, { x: "2021-04-24T00:00:00Z", y: 102873 }, { x: "2021-04-25T00:00:00Z", y: 103018 }, { x: "2021-04-26T00:00:00Z", y: 103416 }, { x: "2021-04-27T00:00:00Z", y: 103763 }, { x: "2021-04-28T00:00:00Z", y: 104078 }, { x: "2021-04-29T00:00:00Z", y: 104384 }, { x: "2021-04-30T00:00:00Z", y: 104676 }, { x: "2021-05-01T00:00:00Z", y: 104868 }, { x: "2021-05-02T00:00:00Z", y: 104982 }, { x: "2021-05-03T00:00:00Z", y: 105293 }, { x: "2021-05-04T00:00:00Z", y: 105550 }, { x: "2021-05-05T00:00:00Z", y: 105794 }, { x: "2021-05-06T00:00:00Z", y: 106013 }, { x: "2021-05-07T00:00:00Z", y: 106264 }, { x: "2021-05-08T00:00:00Z", y: 106440 }, { x: "2021-05-09T00:00:00Z", y: 106555 }, { x: "2021-05-10T00:00:00Z", y: 106847 }, { x: "2021-05-11T00:00:00Z", y: 107098 }, { x: "2021-05-12T00:00:00Z", y: 107282 }, { x: "2021-05-13T00:00:00Z", y: 107413 }, { x: "2021-05-14T00:00:00Z", y: 107586 }, { x: "2021-05-15T00:00:00Z", y: 107698 }, { x: "2021-05-16T00:00:00Z", y: 107779 }, { x: "2021-05-17T00:00:00Z", y: 107975 }, { x: "2021-05-18T00:00:00Z", y: 108203 }, { x: "2021-05-19T00:00:00Z", y: 108344 }, { x: "2021-05-20T00:00:00Z", y: 108477 }, { x: "2021-05-21T00:00:00Z", y: 108600 }, { x: "2021-05-22T00:00:00Z", y: 108689 }, { x: "2021-05-23T00:00:00Z", y: 108760 }, { x: "2021-05-24T00:00:00Z", y: 108822 }, { x: "2021-05-25T00:00:00Z", y: 109043 }, { x: "2021-05-26T00:00:00Z", y: 109188 }, { x: "2021-05-27T00:00:00Z", y: 109330 }, { x: "2021-05-28T00:00:00Z", y: 109455 }, { x: "2021-05-29T00:00:00Z", y: 109523 }, { x: "2021-05-30T00:00:00Z", y: 109567 }, { x: "2021-05-31T00:00:00Z", y: 109693 }, { x: "2021-06-01T00:00:00Z", y: 109827 }, { x: "2021-06-02T00:00:00Z", y: 109923 }, { x: "2021-06-03T00:00:00Z", y: 109993 }, { x: "2021-06-04T00:00:00Z", y: 110081 }, { x: "2021-06-05T00:00:00Z", y: 110138 }, { x: "2021-06-06T00:00:00Z", y: 110170 }, { x: "2021-06-07T00:00:00Z", y: 110234 }, { x: "2021-06-08T00:00:00Z", y: 110309 }, { x: "2021-06-09T00:00:00Z", y: 110374 }, { x: "2021-06-10T00:00:00Z", y: 110442 }, { x: "2021-06-11T00:00:00Z", y: 110516 }, { x: "2021-06-12T00:00:00Z", y: 110550 }, { x: "2021-06-13T00:00:00Z", y: 110566 }, { x: "2021-06-14T00:00:00Z", y: 110629 }, { x: "2021-06-15T00:00:00Z", y: 110709 }, { x: "2021-06-16T00:00:00Z", y: 110753 }, { x: "2021-06-17T00:00:00Z", y: 110809 }, { x: "2021-06-18T00:00:00Z", y: 110877 }, { x: "2021-06-19T00:00:00Z", y: 110899 }, { x: "2021-06-20T00:00:00Z", y: 110914 }, { x: "2021-06-21T00:00:00Z", y: 110954 }, { x: "2021-06-22T00:00:00Z", y: 111005 }, { x: "2021-06-23T00:00:00Z", y: 111038 }, { x: "2021-06-24T00:00:00Z", y: 111082 }, { x: "2021-06-25T00:00:00Z", y: 111115 }, { x: "2021-06-26T00:00:00Z", y: 111127 }, { x: "2021-06-27T00:00:00Z", y: 111145 }, { x: "2021-06-28T00:00:00Z", y: 111189 }, { x: "2021-06-29T00:00:00Z", y: 111234 }, { x: "2021-06-30T00:00:00Z", y: 111259 }, { x: "2021-07-01T00:00:00Z", y: 111288 }, { x: "2021-07-02T00:00:00Z", y: 111312 }, { x: "2021-07-03T00:00:00Z", y: 111329 }, { x: "2021-07-04T00:00:00Z", y: 111340 }, { x: "2021-07-05T00:00:00Z", y: 111377 }, { x: "2021-07-06T00:00:00Z", y: 111412 }, { x: "2021-07-07T00:00:00Z", y: 111440 }, { x: "2021-07-08T00:00:00Z", y: 111465 }, { x: "2021-07-09T00:00:00Z", y: 111483 }, { x: "2021-07-10T00:00:00Z", y: 111502 }, { x: "2021-07-11T00:00:00Z", y: 111507 }, { x: "2021-07-12T00:00:00Z", y: 111535 }, { x: "2021-07-13T00:00:00Z", y: 111589 }, { x: "2021-07-14T00:00:00Z", y: 111595 }, { x: "2021-07-15T00:00:00Z", y: 111611 }, { x: "2021-07-16T00:00:00Z", y: 111633 }, { x: "2021-07-17T00:00:00Z", y: 111649 }, { x: "2021-07-18T00:00:00Z", y: 111654 }, { x: "2021-07-19T00:00:00Z", y: 111674 }, { x: "2021-07-20T00:00:00Z", y: 111707 }, { x: "2021-07-21T00:00:00Z", y: 111729 }, { x: "2021-07-22T00:00:00Z", y: 111741 }, { x: "2021-07-23T00:00:00Z", y: 111778 }, { x: "2021-07-24T00:00:00Z", y: 111800 }, { x: "2021-07-25T00:00:00Z", y: 111806 }, { x: "2021-07-26T00:00:00Z", y: 111852 }, { x: "2021-07-27T00:00:00Z", y: 111881 }, { x: "2021-07-28T00:00:00Z", y: 111925 }, { x: "2021-07-29T00:00:00Z", y: 111954 }, { x: "2021-07-30T00:00:00Z", y: 112017 }, { x: "2021-07-31T00:00:00Z", y: 112061 }, { x: "2021-08-01T00:00:00Z", y: 112079 }, { x: "2021-08-02T00:00:00Z", y: 112136 }, { x: "2021-08-03T00:00:00Z", y: 112196 }, { x: "2021-08-04T00:00:00Z", y: 112245 }, { x: "2021-08-05T00:00:00Z", y: 112298 }, { x: "2021-08-06T00:00:00Z", y: 112364 }, { x: "2021-08-07T00:00:00Z", y: 112396 }, { x: "2021-08-08T00:00:00Z", y: 112427 }, { x: "2021-08-09T00:00:00Z", y: 112511 }, { x: "2021-08-10T00:00:00Z", y: 112591 }, { x: "2021-08-11T00:00:00Z", y: 112654 }, { x: "2021-08-12T00:00:00Z", y: 112734 }, { x: "2021-08-13T00:00:00Z", y: 112828 }, { x: "2021-08-14T00:00:00Z", y: 112881 }, { x: "2021-08-15T00:00:00Z", y: 112925 }, { x: "2021-08-16T00:00:00Z", y: 113055 }, { x: "2021-08-17T00:00:00Z", y: 113179 }, { x: "2021-08-18T00:00:00Z", y: 113312 }, { x: "2021-08-19T00:00:00Z", y: 113451 }, { x: "2021-08-20T00:00:00Z", y: 113548 }, { x: "2021-08-21T00:00:00Z", y: 113660 }, { x: "2021-08-22T00:00:00Z", y: 113775 }, { x: "2021-08-23T00:00:00Z", y: 113938 }, { x: "2021-08-24T00:00:00Z", y: 114112 }, { x: "2021-08-25T00:00:00Z", y: 114240 }, { x: "2021-08-26T00:00:00Z", y: 114379 }, { x: "2021-08-27T00:00:00Z", y: 114500 }, { x: "2021-08-28T00:00:00Z", y: 114574 }, { x: "2021-08-29T00:00:00Z", y: 114627 }, { x: "2021-08-30T00:00:00Z", y: 114778 }, { x: "2021-08-31T00:00:00Z", y: 114926 }, { x: "2021-09-01T00:00:00Z", y: 115031 }, { x: "2021-09-02T00:00:00Z", y: 115157 }, { x: "2021-09-03T00:00:00Z", y: 115269 }, { x: "2021-09-04T00:00:00Z", y: 115352 }, { x: "2021-09-05T00:00:00Z", y: 115401 }, { x: "2021-09-06T00:00:00Z", y: 115563 }, { x: "2021-09-07T00:00:00Z", y: 115680 }, { x: "2021-09-08T00:00:00Z", y: 115846 }, { x: "2021-09-09T00:00:00Z", y: 115941 }, { x: "2021-09-10T00:00:00Z", y: 116049 }, { x: "2021-09-11T00:00:00Z", y: 116095 }, { x: "2021-09-12T00:00:00Z", y: 116124 }, { x: "2021-09-13T00:00:00Z", y: 116245 }, { x: "2021-09-14T00:00:00Z", y: 116454 }, { x: "2021-09-15T00:00:00Z", y: 116470 }, { x: "2021-09-16T00:00:00Z", y: 116511 }, { x: "2021-09-17T00:00:00Z", y: 116618 }, { x: "2021-09-18T00:00:00Z", y: 116662 }, { x: "2021-09-19T00:00:00Z", y: 116696 }, { x: "2021-09-20T00:00:00Z", y: 116765 }, { x: "2021-09-21T00:00:00Z", y: 116901 }, { x: "2021-09-22T00:00:00Z", y: 116981 }, { x: "2021-09-23T00:00:00Z", y: 117062 }, { x: "2021-09-24T00:00:00Z", y: 117147 }, { x: "2021-09-25T00:00:00Z", y: 117157 }, { x: "2021-09-26T00:00:00Z", y: 117182 }, { x: "2021-09-27T00:00:00Z", y: 117281 }, { x: "2021-09-28T00:00:00Z", y: 117348 }, { x: "2021-09-29T00:00:00Z", y: 117407 }, { x: "2021-09-30T00:00:00Z", y: 117474 }, { x: "2021-10-01T00:00:00Z", y: 117535 }, { x: "2021-10-02T00:00:00Z", y: 117578 }, { x: "2021-10-03T00:00:00Z", y: 117595 }, { x: "2021-10-04T00:00:00Z", y: 117657 }, { x: "2021-10-05T00:00:00Z", y: 117728 }, { x: "2021-10-06T00:00:00Z", y: 117800 }, { x: "2021-10-07T00:00:00Z", y: 117846 }, { x: "2021-10-08T00:00:00Z", y: 117895 }, { x: "2021-10-09T00:00:00Z", y: 117915 }, { x: "2021-10-10T00:00:00Z", y: 117927 }, { x: "2021-10-11T00:00:00Z", y: 117966 }, { x: "2021-10-12T00:00:00Z", y: 118027 }, { x: "2021-10-13T00:00:00Z", y: 118080 }, { x: "2021-10-14T00:00:00Z", y: 118111 }, { x: "2021-10-15T00:00:00Z", y: 118153 }, { x: "2021-10-16T00:00:00Z", y: 118173 }, { x: "2021-10-17T00:00:00Z", y: 118183 }, { x: "2021-10-18T00:00:00Z", y: 118232 }, { x: "2021-10-19T00:00:00Z", y: 118272 }, { x: "2021-10-20T00:00:00Z", y: 118300 }, { x: "2021-10-21T00:00:00Z", y: 118339 }, { x: "2021-10-22T00:00:00Z", y: 118373 }, { x: "2021-10-23T00:00:00Z", y: 118396 }, { x: "2021-10-24T00:00:00Z", y: 118405 }, { x: "2021-10-25T00:00:00Z", y: 118452 }, { x: "2021-10-26T00:00:00Z", y: 118490 }, { x: "2021-10-27T00:00:00Z", y: 118530 }, { x: "2021-10-28T00:00:00Z", y: 118561 }, { x: "2021-10-29T00:00:00Z", y: 118590 }, { x: "2021-10-30T00:00:00Z", y: 118612 }, { x: "2021-10-31T00:00:00Z", y: 118625 }, { x: "2021-11-01T00:00:00Z", y: 118632 }, { x: "2021-11-02T00:00:00Z", y: 118720 }, { x: "2021-11-03T00:00:00Z", y: 118758 }, { x: "2021-11-04T00:00:00Z", y: 118804 }, { x: "2021-11-05T00:00:00Z", y: 118830 }, { x: "2021-11-06T00:00:00Z", y: 118855 }, { x: "2021-11-07T00:00:00Z", y: 118866 }, { x: "2021-11-08T00:00:00Z", y: 118924 }, { x: "2021-11-09T00:00:00Z", y: 118970 }, { x: "2021-11-10T00:00:00Z", y: 119003 }, { x: "2021-11-11T00:00:00Z", y: 119021 }, { x: "2021-11-12T00:00:00Z", y: 119069 }, { x: "2021-11-13T00:00:00Z", y: 119085 }] }, { label: "Germany", data: [{ x: "2020-01-22T00:00:00Z", y: 0 }, { x: "2020-01-23T00:00:00Z", y: 0 }, { x: "2020-01-24T00:00:00Z", y: 0 }, { x: "2020-01-25T00:00:00Z", y: 0 }, { x: "2020-01-26T00:00:00Z", y: 0 }, { x: "2020-01-27T00:00:00Z", y: 0 }, { x: "2020-01-28T00:00:00Z", y: 0 }, { x: "2020-01-29T00:00:00Z", y: 0 }, { x: "2020-01-30T00:00:00Z", y: 0 }, { x: "2020-01-31T00:00:00Z", y: 0 }, { x: "2020-02-01T00:00:00Z", y: 0 }, { x: "2020-02-02T00:00:00Z", y: 0 }, { x: "2020-02-03T00:00:00Z", y: 0 }, { x: "2020-02-04T00:00:00Z", y: 0 }, { x: "2020-02-05T00:00:00Z", y: 0 }, { x: "2020-02-06T00:00:00Z", y: 0 }, { x: "2020-02-07T00:00:00Z", y: 0 }, { x: "2020-02-08T00:00:00Z", y: 0 }, { x: "2020-02-09T00:00:00Z", y: 0 }, { x: "2020-02-10T00:00:00Z", y: 0 }, { x: "2020-02-11T00:00:00Z", y: 0 }, { x: "2020-02-12T00:00:00Z", y: 0 }, { x: "2020-02-13T00:00:00Z", y: 0 }, { x: "2020-02-14T00:00:00Z", y: 0 }, { x: "2020-02-15T00:00:00Z", y: 0 }, { x: "2020-02-16T00:00:00Z", y: 0 }, { x: "2020-02-17T00:00:00Z", y: 0 }, { x: "2020-02-18T00:00:00Z", y: 0 }, { x: "2020-02-19T00:00:00Z", y: 0 }, { x: "2020-02-20T00:00:00Z", y: 0 }, { x: "2020-02-21T00:00:00Z", y: 0 }, { x: "2020-02-22T00:00:00Z", y: 0 }, { x: "2020-02-23T00:00:00Z", y: 0 }, { x: "2020-02-24T00:00:00Z", y: 0 }, { x: "2020-02-25T00:00:00Z", y: 0 }, { x: "2020-02-26T00:00:00Z", y: 0 }, { x: "2020-02-27T00:00:00Z", y: 0 }, { x: "2020-02-28T00:00:00Z", y: 0 }, { x: "2020-02-29T00:00:00Z", y: 0 }, { x: "2020-03-01T00:00:00Z", y: 0 }, { x: "2020-03-02T00:00:00Z", y: 0 }, { x: "2020-03-03T00:00:00Z", y: 0 }, { x: "2020-03-04T00:00:00Z", y: 0 }, { x: "2020-03-05T00:00:00Z", y: 0 }, { x: "2020-03-06T00:00:00Z", y: 0 }, { x: "2020-03-07T00:00:00Z", y: 0 }, { x: "2020-03-08T00:00:00Z", y: 0 }, { x: "2020-03-09T00:00:00Z", y: 2 }, { x: "2020-03-10T00:00:00Z", y: 2 }, { x: "2020-03-11T00:00:00Z", y: 3 }, { x: "2020-03-12T00:00:00Z", y: 3 }, { x: "2020-03-13T00:00:00Z", y: 7 }, { x: "2020-03-14T00:00:00Z", y: 9 }, { x: "2020-03-15T00:00:00Z", y: 11 }, { x: "2020-03-16T00:00:00Z", y: 17 }, { x: "2020-03-17T00:00:00Z", y: 24 }, { x: "2020-03-18T00:00:00Z", y: 28 }, { x: "2020-03-19T00:00:00Z", y: 44 }, { x: "2020-03-20T00:00:00Z", y: 67 }, { x: "2020-03-21T00:00:00Z", y: 84 }, { x: "2020-03-22T00:00:00Z", y: 94 }, { x: "2020-03-23T00:00:00Z", y: 123 }, { x: "2020-03-24T00:00:00Z", y: 157 }, { x: "2020-03-25T00:00:00Z", y: 206 }, { x: "2020-03-26T00:00:00Z", y: 267 }, { x: "2020-03-27T00:00:00Z", y: 342 }, { x: "2020-03-28T00:00:00Z", y: 433 }, { x: "2020-03-29T00:00:00Z", y: 533 }, { x: "2020-03-30T00:00:00Z", y: 645 }, { x: "2020-03-31T00:00:00Z", y: 775 }, { x: "2020-04-01T00:00:00Z", y: 920 }, { x: "2020-04-02T00:00:00Z", y: 1107 }, { x: "2020-04-03T00:00:00Z", y: 1275 }, { x: "2020-04-04T00:00:00Z", y: 1444 }, { x: "2020-04-05T00:00:00Z", y: 1584 }, { x: "2020-04-06T00:00:00Z", y: 1810 }, { x: "2020-04-07T00:00:00Z", y: 2016 }, { x: "2020-04-08T00:00:00Z", y: 2349 }, { x: "2020-04-09T00:00:00Z", y: 2607 }, { x: "2020-04-10T00:00:00Z", y: 2767 }, { x: "2020-04-11T00:00:00Z", y: 2736 }, { x: "2020-04-12T00:00:00Z", y: 3022 }, { x: "2020-04-13T00:00:00Z", y: 3194 }, { x: "2020-04-14T00:00:00Z", y: 3294 }, { x: "2020-04-15T00:00:00Z", y: 3804 }, { x: "2020-04-16T00:00:00Z", y: 4052 }, { x: "2020-04-17T00:00:00Z", y: 4352 }, { x: "2020-04-18T00:00:00Z", y: 4459 }, { x: "2020-04-19T00:00:00Z", y: 4586 }, { x: "2020-04-20T00:00:00Z", y: 4862 }, { x: "2020-04-21T00:00:00Z", y: 5033 }, { x: "2020-04-22T00:00:00Z", y: 5279 }, { x: "2020-04-23T00:00:00Z", y: 5575 }, { x: "2020-04-24T00:00:00Z", y: 5760 }, { x: "2020-04-25T00:00:00Z", y: 5877 }, { x: "2020-04-26T00:00:00Z", y: 5976 }, { x: "2020-04-27T00:00:00Z", y: 6126 }, { x: "2020-04-28T00:00:00Z", y: 6314 }, { x: "2020-04-29T00:00:00Z", y: 6467 }, { x: "2020-04-30T00:00:00Z", y: 6623 }, { x: "2020-05-01T00:00:00Z", y: 6736 }, { x: "2020-05-02T00:00:00Z", y: 6812 }, { x: "2020-05-03T00:00:00Z", y: 6866 }, { x: "2020-05-04T00:00:00Z", y: 6993 }, { x: "2020-05-05T00:00:00Z", y: 6993 }, { x: "2020-05-06T00:00:00Z", y: 7275 }, { x: "2020-05-07T00:00:00Z", y: 7392 }, { x: "2020-05-08T00:00:00Z", y: 7510 }, { x: "2020-05-09T00:00:00Z", y: 7549 }, { x: "2020-05-10T00:00:00Z", y: 7569 }, { x: "2020-05-11T00:00:00Z", y: 7661 }, { x: "2020-05-12T00:00:00Z", y: 7738 }, { x: "2020-05-13T00:00:00Z", y: 7861 }, { x: "2020-05-14T00:00:00Z", y: 7884 }, { x: "2020-05-15T00:00:00Z", y: 7897 }, { x: "2020-05-16T00:00:00Z", y: 7938 }, { x: "2020-05-17T00:00:00Z", y: 7962 }, { x: "2020-05-18T00:00:00Z", y: 8003 }, { x: "2020-05-19T00:00:00Z", y: 8081 }, { x: "2020-05-20T00:00:00Z", y: 8144 }, { x: "2020-05-21T00:00:00Z", y: 8203 }, { x: "2020-05-22T00:00:00Z", y: 8228 }, { x: "2020-05-23T00:00:00Z", y: 8261 }, { x: "2020-05-24T00:00:00Z", y: 8283 }, { x: "2020-05-25T00:00:00Z", y: 8309 }, { x: "2020-05-26T00:00:00Z", y: 8372 }, { x: "2020-05-27T00:00:00Z", y: 8428 }, { x: "2020-05-28T00:00:00Z", y: 8470 }, { x: "2020-05-29T00:00:00Z", y: 8504 }, { x: "2020-05-30T00:00:00Z", y: 8530 }, { x: "2020-05-31T00:00:00Z", y: 8540 }, { x: "2020-06-01T00:00:00Z", y: 8555 }, { x: "2020-06-02T00:00:00Z", y: 8563 }, { x: "2020-06-03T00:00:00Z", y: 8602 }, { x: "2020-06-04T00:00:00Z", y: 8635 }, { x: "2020-06-05T00:00:00Z", y: 8658 }, { x: "2020-06-06T00:00:00Z", y: 8673 }, { x: "2020-06-07T00:00:00Z", y: 8685 }, { x: "2020-06-08T00:00:00Z", y: 8695 }, { x: "2020-06-09T00:00:00Z", y: 8736 }, { x: "2020-06-10T00:00:00Z", y: 8752 }, { x: "2020-06-11T00:00:00Z", y: 8772 }, { x: "2020-06-12T00:00:00Z", y: 8783 }, { x: "2020-06-13T00:00:00Z", y: 8793 }, { x: "2020-06-14T00:00:00Z", y: 8801 }, { x: "2020-06-15T00:00:00Z", y: 8807 }, { x: "2020-06-16T00:00:00Z", y: 8820 }, { x: "2020-06-17T00:00:00Z", y: 8851 }, { x: "2020-06-18T00:00:00Z", y: 8875 }, { x: "2020-06-19T00:00:00Z", y: 8887 }, { x: "2020-06-20T00:00:00Z", y: 8895 }, { x: "2020-06-21T00:00:00Z", y: 8895 }, { x: "2020-06-22T00:00:00Z", y: 8899 }, { x: "2020-06-23T00:00:00Z", y: 8914 }, { x: "2020-06-24T00:00:00Z", y: 8928 }, { x: "2020-06-25T00:00:00Z", y: 8940 }, { x: "2020-06-26T00:00:00Z", y: 8965 }, { x: "2020-06-27T00:00:00Z", y: 8968 }, { x: "2020-06-28T00:00:00Z", y: 8968 }, { x: "2020-06-29T00:00:00Z", y: 8976 }, { x: "2020-06-30T00:00:00Z", y: 8990 }, { x: "2020-07-01T00:00:00Z", y: 8995 }, { x: "2020-07-02T00:00:00Z", y: 9006 }, { x: "2020-07-03T00:00:00Z", y: 9010 }, { x: "2020-07-04T00:00:00Z", y: 9020 }, { x: "2020-07-05T00:00:00Z", y: 9023 }, { x: "2020-07-06T00:00:00Z", y: 9022 }, { x: "2020-07-07T00:00:00Z", y: 9032 }, { x: "2020-07-08T00:00:00Z", y: 9046 }, { x: "2020-07-09T00:00:00Z", y: 9057 }, { x: "2020-07-10T00:00:00Z", y: 9063 }, { x: "2020-07-11T00:00:00Z", y: 9070 }, { x: "2020-07-12T00:00:00Z", y: 9071 }, { x: "2020-07-13T00:00:00Z", y: 9074 }, { x: "2020-07-14T00:00:00Z", y: 9078 }, { x: "2020-07-15T00:00:00Z", y: 9080 }, { x: "2020-07-16T00:00:00Z", y: 9087 }, { x: "2020-07-17T00:00:00Z", y: 9088 }, { x: "2020-07-18T00:00:00Z", y: 9091 }, { x: "2020-07-19T00:00:00Z", y: 9092 }, { x: "2020-07-20T00:00:00Z", y: 9094 }, { x: "2020-07-21T00:00:00Z", y: 9099 }, { x: "2020-07-22T00:00:00Z", y: 9102 }, { x: "2020-07-23T00:00:00Z", y: 9110 }, { x: "2020-07-24T00:00:00Z", y: 9120 }, { x: "2020-07-25T00:00:00Z", y: 9124 }, { x: "2020-07-26T00:00:00Z", y: 9124 }, { x: "2020-07-27T00:00:00Z", y: 9125 }, { x: "2020-07-28T00:00:00Z", y: 9131 }, { x: "2020-07-29T00:00:00Z", y: 9135 }, { x: "2020-07-30T00:00:00Z", y: 9144 }, { x: "2020-07-31T00:00:00Z", y: 9147 }, { x: "2020-08-01T00:00:00Z", y: 9154 }, { x: "2020-08-02T00:00:00Z", y: 9154 }, { x: "2020-08-03T00:00:00Z", y: 9154 }, { x: "2020-08-04T00:00:00Z", y: 9163 }, { x: "2020-08-05T00:00:00Z", y: 9179 }, { x: "2020-08-06T00:00:00Z", y: 9181 }, { x: "2020-08-07T00:00:00Z", y: 9195 }, { x: "2020-08-08T00:00:00Z", y: 9201 }, { x: "2020-08-09T00:00:00Z", y: 9202 }, { x: "2020-08-10T00:00:00Z", y: 9203 }, { x: "2020-08-11T00:00:00Z", y: 9208 }, { x: "2020-08-12T00:00:00Z", y: 9213 }, { x: "2020-08-13T00:00:00Z", y: 9217 }, { x: "2020-08-14T00:00:00Z", y: 9230 }, { x: "2020-08-15T00:00:00Z", y: 9235 }, { x: "2020-08-16T00:00:00Z", y: 9235 }, { x: "2020-08-17T00:00:00Z", y: 9236 }, { x: "2020-08-18T00:00:00Z", y: 9241 }, { x: "2020-08-19T00:00:00Z", y: 9249 }, { x: "2020-08-20T00:00:00Z", y: 9263 }, { x: "2020-08-21T00:00:00Z", y: 9266 }, { x: "2020-08-22T00:00:00Z", y: 9272 }, { x: "2020-08-23T00:00:00Z", y: 9275 }, { x: "2020-08-24T00:00:00Z", y: 9276 }, { x: "2020-08-25T00:00:00Z", y: 9281 }, { x: "2020-08-26T00:00:00Z", y: 9285 }, { x: "2020-08-27T00:00:00Z", y: 9290 }, { x: "2020-08-28T00:00:00Z", y: 9290 }, { x: "2020-08-29T00:00:00Z", y: 9299 }, { x: "2020-08-30T00:00:00Z", y: 9300 }, { x: "2020-08-31T00:00:00Z", y: 9303 }, { x: "2020-09-01T00:00:00Z", y: 9307 }, { x: "2020-09-02T00:00:00Z", y: 9322 }, { x: "2020-09-03T00:00:00Z", y: 9322 }, { x: "2020-09-04T00:00:00Z", y: 9327 }, { x: "2020-09-05T00:00:00Z", y: 9329 }, { x: "2020-09-06T00:00:00Z", y: 9330 }, { x: "2020-09-07T00:00:00Z", y: 9331 }, { x: "2020-09-08T00:00:00Z", y: 9336 }, { x: "2020-09-09T00:00:00Z", y: 9342 }, { x: "2020-09-10T00:00:00Z", y: 9345 }, { x: "2020-09-11T00:00:00Z", y: 9348 }, { x: "2020-09-12T00:00:00Z", y: 9352 }, { x: "2020-09-13T00:00:00Z", y: 9354 }, { x: "2020-09-14T00:00:00Z", y: 9356 }, { x: "2020-09-15T00:00:00Z", y: 9367 }, { x: "2020-09-16T00:00:00Z", y: 9373 }, { x: "2020-09-17T00:00:00Z", y: 9376 }, { x: "2020-09-18T00:00:00Z", y: 9386 }, { x: "2020-09-19T00:00:00Z", y: 9388 }, { x: "2020-09-20T00:00:00Z", y: 9390 }, { x: "2020-09-21T00:00:00Z", y: 9390 }, { x: "2020-09-22T00:00:00Z", y: 9405 }, { x: "2020-09-23T00:00:00Z", y: 9423 }, { x: "2020-09-24T00:00:00Z", y: 9436 }, { x: "2020-09-25T00:00:00Z", y: 9451 }, { x: "2020-09-26T00:00:00Z", y: 9459 }, { x: "2020-09-27T00:00:00Z", y: 9464 }, { x: "2020-09-28T00:00:00Z", y: 9468 }, { x: "2020-09-29T00:00:00Z", y: 9483 }, { x: "2020-09-30T00:00:00Z", y: 9495 }, { x: "2020-10-01T00:00:00Z", y: 9509 }, { x: "2020-10-02T00:00:00Z", y: 9518 }, { x: "2020-10-03T00:00:00Z", y: 9531 }, { x: "2020-10-04T00:00:00Z", y: 9533 }, { x: "2020-10-05T00:00:00Z", y: 9554 }, { x: "2020-10-06T00:00:00Z", y: 9566 }, { x: "2020-10-07T00:00:00Z", y: 9582 }, { x: "2020-10-08T00:00:00Z", y: 9594 }, { x: "2020-10-09T00:00:00Z", y: 9599 }, { x: "2020-10-10T00:00:00Z", y: 9620 }, { x: "2020-10-11T00:00:00Z", y: 9626 }, { x: "2020-10-12T00:00:00Z", y: 9640 }, { x: "2020-10-13T00:00:00Z", y: 9682 }, { x: "2020-10-14T00:00:00Z", y: 9716 }, { x: "2020-10-15T00:00:00Z", y: 9739 }, { x: "2020-10-16T00:00:00Z", y: 9773 }, { x: "2020-10-17T00:00:00Z", y: 9785 }, { x: "2020-10-18T00:00:00Z", y: 9798 }, { x: "2020-10-19T00:00:00Z", y: 9842 }, { x: "2020-10-20T00:00:00Z", y: 9882 }, { x: "2020-10-21T00:00:00Z", y: 9911 }, { x: "2020-10-22T00:00:00Z", y: 9960 }, { x: "2020-10-23T00:00:00Z", y: 9978 }, { x: "2020-10-24T00:00:00Z", y: 10035 }, { x: "2020-10-25T00:00:00Z", y: 10062 }, { x: "2020-10-26T00:00:00Z", y: 10091 }, { x: "2020-10-27T00:00:00Z", y: 10121 }, { x: "2020-10-28T00:00:00Z", y: 10218 }, { x: "2020-10-29T00:00:00Z", y: 10305 }, { x: "2020-10-30T00:00:00Z", y: 10391 }, { x: "2020-10-31T00:00:00Z", y: 10483 }, { x: "2020-11-01T00:00:00Z", y: 10513 }, { x: "2020-11-02T00:00:00Z", y: 10669 }, { x: "2020-11-03T00:00:00Z", y: 10717 }, { x: "2020-11-04T00:00:00Z", y: 10949 }, { x: "2020-11-05T00:00:00Z", y: 11110 }, { x: "2020-11-06T00:00:00Z", y: 11240 }, { x: "2020-11-07T00:00:00Z", y: 11306 }, { x: "2020-11-08T00:00:00Z", y: 11372 }, { x: "2020-11-09T00:00:00Z", y: 11408 }, { x: "2020-11-10T00:00:00Z", y: 11781 }, { x: "2020-11-11T00:00:00Z", y: 11994 }, { x: "2020-11-12T00:00:00Z", y: 12216 }, { x: "2020-11-13T00:00:00Z", y: 12404 }, { x: "2020-11-14T00:00:00Z", y: 12511 }, { x: "2020-11-15T00:00:00Z", y: 12573 }, { x: "2020-11-16T00:00:00Z", y: 12833 }, { x: "2020-11-17T00:00:00Z", y: 13138 }, { x: "2020-11-18T00:00:00Z", y: 13390 }, { x: "2020-11-19T00:00:00Z", y: 13662 }, { x: "2020-11-20T00:00:00Z", y: 13918 }, { x: "2020-11-21T00:00:00Z", y: 14061 }, { x: "2020-11-22T00:00:00Z", y: 14159 }, { x: "2020-11-23T00:00:00Z", y: 14460 }, { x: "2020-11-24T00:00:00Z", y: 14832 }, { x: "2020-11-25T00:00:00Z", y: 15210 }, { x: "2020-11-26T00:00:00Z", y: 15640 }, { x: "2020-11-27T00:00:00Z", y: 16011 }, { x: "2020-11-28T00:00:00Z", y: 16181 }, { x: "2020-11-29T00:00:00Z", y: 16306 }, { x: "2020-11-30T00:00:00Z", y: 16694 }, { x: "2020-12-01T00:00:00Z", y: 17177 }, { x: "2020-12-02T00:00:00Z", y: 17659 }, { x: "2020-12-03T00:00:00Z", y: 18097 }, { x: "2020-12-04T00:00:00Z", y: 18577 }, { x: "2020-12-05T00:00:00Z", y: 18839 }, { x: "2020-12-06T00:00:00Z", y: 18989 }, { x: "2020-12-07T00:00:00Z", y: 19434 }, { x: "2020-12-08T00:00:00Z", y: 20002 }, { x: "2020-12-09T00:00:00Z", y: 20460 }, { x: "2020-12-10T00:00:00Z", y: 21064 }, { x: "2020-12-11T00:00:00Z", y: 21567 }, { x: "2020-12-12T00:00:00Z", y: 21900 }, { x: "2020-12-13T00:00:00Z", y: 22106 }, { x: "2020-12-14T00:00:00Z", y: 22634 }, { x: "2020-12-15T00:00:00Z", y: 23544 }, { x: "2020-12-16T00:00:00Z", y: 24273 }, { x: "2020-12-17T00:00:00Z", y: 25027 }, { x: "2020-12-18T00:00:00Z", y: 25754 }, { x: "2020-12-19T00:00:00Z", y: 26171 }, { x: "2020-12-20T00:00:00Z", y: 26400 }, { x: "2020-12-21T00:00:00Z", y: 27110 }, { x: "2020-12-22T00:00:00Z", y: 28096 }, { x: "2020-12-23T00:00:00Z", y: 28909 }, { x: "2020-12-24T00:00:00Z", y: 29330 }, { x: "2020-12-25T00:00:00Z", y: 29580 }, { x: "2020-12-26T00:00:00Z", y: 29946 }, { x: "2020-12-27T00:00:00Z", y: 30297 }, { x: "2020-12-28T00:00:00Z", y: 31145 }, { x: "2020-12-29T00:00:00Z", y: 32263 }, { x: "2020-12-30T00:00:00Z", y: 33281 }, { x: "2020-12-31T00:00:00Z", y: 33791 }, { x: "2021-01-01T00:00:00Z", y: 34150 }, { x: "2021-01-02T00:00:00Z", y: 34480 }, { x: "2021-01-03T00:00:00Z", y: 34791 }, { x: "2021-01-04T00:00:00Z", y: 35748 }, { x: "2021-01-05T00:00:00Z", y: 36757 }, { x: "2021-01-06T00:00:00Z", y: 37835 }, { x: "2021-01-07T00:00:00Z", y: 38987 }, { x: "2021-01-08T00:00:00Z", y: 40022 }, { x: "2021-01-09T00:00:00Z", y: 40597 }, { x: "2021-01-10T00:00:00Z", y: 40936 }, { x: "2021-01-11T00:00:00Z", y: 41799 }, { x: "2021-01-12T00:00:00Z", y: 42889 }, { x: "2021-01-13T00:00:00Z", y: 44096 }, { x: "2021-01-14T00:00:00Z", y: 45207 }, { x: "2021-01-15T00:00:00Z", y: 45705 }, { x: "2021-01-16T00:00:00Z", y: 46464 }, { x: "2021-01-17T00:00:00Z", y: 46901 }, { x: "2021-01-18T00:00:00Z", y: 47263 }, { x: "2021-01-19T00:00:00Z", y: 48997 }, { x: "2021-01-20T00:00:00Z", y: 50010 }, { x: "2021-01-21T00:00:00Z", y: 50876 }, { x: "2021-01-22T00:00:00Z", y: 51713 }, { x: "2021-01-23T00:00:00Z", y: 51873 }, { x: "2021-01-24T00:00:00Z", y: 52296 }, { x: "2021-01-25T00:00:00Z", y: 53127 }, { x: "2021-01-26T00:00:00Z", y: 53619 }, { x: "2021-01-27T00:00:00Z", y: 54498 }, { x: "2021-01-28T00:00:00Z", y: 55883 }, { x: "2021-01-29T00:00:00Z", y: 56286 }, { x: "2021-01-30T00:00:00Z", y: 57105 }, { x: "2021-01-31T00:00:00Z", y: 57163 }, { x: "2021-02-01T00:00:00Z", y: 58059 }, { x: "2021-02-02T00:00:00Z", y: 58992 }, { x: "2021-02-03T00:00:00Z", y: 59776 }, { x: "2021-02-04T00:00:00Z", y: 60634 }, { x: "2021-02-05T00:00:00Z", y: 61324 }, { x: "2021-02-06T00:00:00Z", y: 61551 }, { x: "2021-02-07T00:00:00Z", y: 61708 }, { x: "2021-02-08T00:00:00Z", y: 62191 }, { x: "2021-02-09T00:00:00Z", y: 63006 }, { x: "2021-02-10T00:00:00Z", y: 63672 }, { x: "2021-02-11T00:00:00Z", y: 64224 }, { x: "2021-02-12T00:00:00Z", y: 64771 }, { x: "2021-02-13T00:00:00Z", y: 64990 }, { x: "2021-02-14T00:00:00Z", y: 65107 }, { x: "2021-02-15T00:00:00Z", y: 65288 }, { x: "2021-02-16T00:00:00Z", y: 65829 }, { x: "2021-02-17T00:00:00Z", y: 66732 }, { x: "2021-02-18T00:00:00Z", y: 67245 }, { x: "2021-02-19T00:00:00Z", y: 67741 }, { x: "2021-02-20T00:00:00Z", y: 67883 }, { x: "2021-02-21T00:00:00Z", y: 67946 }, { x: "2021-02-22T00:00:00Z", y: 68363 }, { x: "2021-02-23T00:00:00Z", y: 68785 }, { x: "2021-02-24T00:00:00Z", y: 69170 }, { x: "2021-02-25T00:00:00Z", y: 69343 }, { x: "2021-02-26T00:00:00Z", y: 69939 }, { x: "2021-02-27T00:00:00Z", y: 70092 }, { x: "2021-02-28T00:00:00Z", y: 70152 }, { x: "2021-03-01T00:00:00Z", y: 70514 }, { x: "2021-03-02T00:00:00Z", y: 70926 }, { x: "2021-03-03T00:00:00Z", y: 71285 }, { x: "2021-03-04T00:00:00Z", y: 71554 }, { x: "2021-03-05T00:00:00Z", y: 71852 }, { x: "2021-03-06T00:00:00Z", y: 71951 }, { x: "2021-03-07T00:00:00Z", y: 71984 }, { x: "2021-03-08T00:00:00Z", y: 72236 }, { x: "2021-03-09T00:00:00Z", y: 72534 }, { x: "2021-03-10T00:00:00Z", y: 72858 }, { x: "2021-03-11T00:00:00Z", y: 73120 }, { x: "2021-03-12T00:00:00Z", y: 73348 }, { x: "2021-03-13T00:00:00Z", y: 73369 }, { x: "2021-03-14T00:00:00Z", y: 73463 }, { x: "2021-03-15T00:00:00Z", y: 73701 }, { x: "2021-03-16T00:00:00Z", y: 73953 }, { x: "2021-03-17T00:00:00Z", y: 74177 }, { x: "2021-03-18T00:00:00Z", y: 74402 }, { x: "2021-03-19T00:00:00Z", y: 74609 }, { x: "2021-03-20T00:00:00Z", y: 74707 }, { x: "2021-03-21T00:00:00Z", y: 74756 }, { x: "2021-03-22T00:00:00Z", y: 75009 }, { x: "2021-03-23T00:00:00Z", y: 75255 }, { x: "2021-03-24T00:00:00Z", y: 75484 }, { x: "2021-03-25T00:00:00Z", y: 75669 }, { x: "2021-03-26T00:00:00Z", y: 75828 }, { x: "2021-03-27T00:00:00Z", y: 75915 }, { x: "2021-03-28T00:00:00Z", y: 75959 }, { x: "2021-03-29T00:00:00Z", y: 76139 }, { x: "2021-03-30T00:00:00Z", y: 76389 }, { x: "2021-03-31T00:00:00Z", y: 76589 }, { x: "2021-04-01T00:00:00Z", y: 76823 }, { x: "2021-04-02T00:00:00Z", y: 76940 }, { x: "2021-04-03T00:00:00Z", y: 77010 }, { x: "2021-04-04T00:00:00Z", y: 77060 }, { x: "2021-04-05T00:00:00Z", y: 77136 }, { x: "2021-04-06T00:00:00Z", y: 77245 }, { x: "2021-04-07T00:00:00Z", y: 77755 }, { x: "2021-04-08T00:00:00Z", y: 78049 }, { x: "2021-04-09T00:00:00Z", y: 78295 }, { x: "2021-04-10T00:00:00Z", y: 78402 }, { x: "2021-04-11T00:00:00Z", y: 78500 }, { x: "2021-04-12T00:00:00Z", y: 78796 }, { x: "2021-04-13T00:00:00Z", y: 79137 }, { x: "2021-04-14T00:00:00Z", y: 79427 }, { x: "2021-04-15T00:00:00Z", y: 79672 }, { x: "2021-04-16T00:00:00Z", y: 79894 }, { x: "2021-04-17T00:00:00Z", y: 79971 }, { x: "2021-04-18T00:00:00Z", y: 80052 }, { x: "2021-04-19T00:00:00Z", y: 80353 }, { x: "2021-04-20T00:00:00Z", y: 80680 }, { x: "2021-04-21T00:00:00Z", y: 80938 }, { x: "2021-04-22T00:00:00Z", y: 81203 }, { x: "2021-04-23T00:00:00Z", y: 81492 }, { x: "2021-04-24T00:00:00Z", y: 81610 }, { x: "2021-04-25T00:00:00Z", y: 81671 }, { x: "2021-04-26T00:00:00Z", y: 82009 }, { x: "2021-04-27T00:00:00Z", y: 82325 }, { x: "2021-04-28T00:00:00Z", y: 82588 }, { x: "2021-04-29T00:00:00Z", y: 82865 }, { x: "2021-04-30T00:00:00Z", y: 83097 }, { x: "2021-05-01T00:00:00Z", y: 83207 }, { x: "2021-05-02T00:00:00Z", y: 83292 }, { x: "2021-05-03T00:00:00Z", y: 83605 }, { x: "2021-05-04T00:00:00Z", y: 83890 }, { x: "2021-05-05T00:00:00Z", y: 84141 }, { x: "2021-05-06T00:00:00Z", y: 84425 }, { x: "2021-05-07T00:00:00Z", y: 84659 }, { x: "2021-05-08T00:00:00Z", y: 84789 }, { x: "2021-05-09T00:00:00Z", y: 84844 }, { x: "2021-05-10T00:00:00Z", y: 85118 }, { x: "2021-05-11T00:00:00Z", y: 85385 }, { x: "2021-05-12T00:00:00Z", y: 85451 }, { x: "2021-05-13T00:00:00Z", y: 85853 }, { x: "2021-05-14T00:00:00Z", y: 86030 }, { x: "2021-05-15T00:00:00Z", y: 86100 }, { x: "2021-05-16T00:00:00Z", y: 86166 }, { x: "2021-05-17T00:00:00Z", y: 86386 }, { x: "2021-05-18T00:00:00Z", y: 86671 }, { x: "2021-05-19T00:00:00Z", y: 86908 }, { x: "2021-05-20T00:00:00Z", y: 87135 }, { x: "2021-05-21T00:00:00Z", y: 87303 }, { x: "2021-05-22T00:00:00Z", y: 87385 }, { x: "2021-05-23T00:00:00Z", y: 87429 }, { x: "2021-05-24T00:00:00Z", y: 87461 }, { x: "2021-05-25T00:00:00Z", y: 87733 }, { x: "2021-05-26T00:00:00Z", y: 88e3 }, { x: "2021-05-27T00:00:00Z", y: 88192 }, { x: "2021-05-28T00:00:00Z", y: 88360 }, { x: "2021-05-29T00:00:00Z", y: 88413 }, { x: "2021-05-30T00:00:00Z", y: 88431 }, { x: "2021-05-31T00:00:00Z", y: 88601 }, { x: "2021-06-01T00:00:00Z", y: 88781 }, { x: "2021-06-02T00:00:00Z", y: 88945 }, { x: "2021-06-03T00:00:00Z", y: 89031 }, { x: "2021-06-04T00:00:00Z", y: 89152 }, { x: "2021-06-05T00:00:00Z", y: 89228 }, { x: "2021-06-06T00:00:00Z", y: 89249 }, { x: "2021-06-07T00:00:00Z", y: 89390 }, { x: "2021-06-08T00:00:00Z", y: 89497 }, { x: "2021-06-09T00:00:00Z", y: 89592 }, { x: "2021-06-10T00:00:00Z", y: 89693 }, { x: "2021-06-11T00:00:00Z", y: 89821 }, { x: "2021-06-12T00:00:00Z", y: 89841 }, { x: "2021-06-13T00:00:00Z", y: 89849 }, { x: "2021-06-14T00:00:00Z", y: 89944 }, { x: "2021-06-15T00:00:00Z", y: 90079 }, { x: "2021-06-16T00:00:00Z", y: 90185 }, { x: "2021-06-17T00:00:00Z", y: 90277 }, { x: "2021-06-18T00:00:00Z", y: 90374 }, { x: "2021-06-19T00:00:00Z", y: 90390 }, { x: "2021-06-20T00:00:00Z", y: 90400 }, { x: "2021-06-21T00:00:00Z", y: 90477 }, { x: "2021-06-22T00:00:00Z", y: 90553 }, { x: "2021-06-23T00:00:00Z", y: 90620 }, { x: "2021-06-24T00:00:00Z", y: 90685 }, { x: "2021-06-25T00:00:00Z", y: 90752 }, { x: "2021-06-26T00:00:00Z", y: 90761 }, { x: "2021-06-27T00:00:00Z", y: 90768 }, { x: "2021-06-28T00:00:00Z", y: 90826 }, { x: "2021-06-29T00:00:00Z", y: 90883 }, { x: "2021-06-30T00:00:00Z", y: 90945 }, { x: "2021-07-01T00:00:00Z", y: 91014 }, { x: "2021-07-02T00:00:00Z", y: 91032 }, { x: "2021-07-03T00:00:00Z", y: 91040 }, { x: "2021-07-04T00:00:00Z", y: 91039 }, { x: "2021-07-05T00:00:00Z", y: 91068 }, { x: "2021-07-06T00:00:00Z", y: 91118 }, { x: "2021-07-07T00:00:00Z", y: 91148 }, { x: "2021-07-08T00:00:00Z", y: 91197 }, { x: "2021-07-09T00:00:00Z", y: 91232 }, { x: "2021-07-10T00:00:00Z", y: 91239 }, { x: "2021-07-11T00:00:00Z", y: 91241 }, { x: "2021-07-12T00:00:00Z", y: 91268 }, { x: "2021-07-13T00:00:00Z", y: 91295 }, { x: "2021-07-14T00:00:00Z", y: 91326 }, { x: "2021-07-15T00:00:00Z", y: 91346 }, { x: "2021-07-16T00:00:00Z", y: 91367 }, { x: "2021-07-17T00:00:00Z", y: 91369 }, { x: "2021-07-18T00:00:00Z", y: 91370 }, { x: "2021-07-19T00:00:00Z", y: 91404 }, { x: "2021-07-20T00:00:00Z", y: 91423 }, { x: "2021-07-21T00:00:00Z", y: 91466 }, { x: "2021-07-22T00:00:00Z", y: 91505 }, { x: "2021-07-23T00:00:00Z", y: 91514 }, { x: "2021-07-24T00:00:00Z", y: 91531 }, { x: "2021-07-25T00:00:00Z", y: 91534 }, { x: "2021-07-26T00:00:00Z", y: 91573 }, { x: "2021-07-27T00:00:00Z", y: 91592 }, { x: "2021-07-28T00:00:00Z", y: 91709 }, { x: "2021-07-29T00:00:00Z", y: 91622 }, { x: "2021-07-30T00:00:00Z", y: 91663 }, { x: "2021-07-31T00:00:00Z", y: 91666 }, { x: "2021-08-01T00:00:00Z", y: 91666 }, { x: "2021-08-02T00:00:00Z", y: 91685 }, { x: "2021-08-03T00:00:00Z", y: 91710 }, { x: "2021-08-04T00:00:00Z", y: 91736 }, { x: "2021-08-05T00:00:00Z", y: 91761 }, { x: "2021-08-06T00:00:00Z", y: 91785 }, { x: "2021-08-07T00:00:00Z", y: 91789 }, { x: "2021-08-08T00:00:00Z", y: 91791 }, { x: "2021-08-09T00:00:00Z", y: 91810 }, { x: "2021-08-10T00:00:00Z", y: 91824 }, { x: "2021-08-11T00:00:00Z", y: 91841 }, { x: "2021-08-12T00:00:00Z", y: 91860 }, { x: "2021-08-13T00:00:00Z", y: 91871 }, { x: "2021-08-14T00:00:00Z", y: 91874 }, { x: "2021-08-15T00:00:00Z", y: 91878 }, { x: "2021-08-16T00:00:00Z", y: 91905 }, { x: "2021-08-17T00:00:00Z", y: 91927 }, { x: "2021-08-18T00:00:00Z", y: 91949 }, { x: "2021-08-19T00:00:00Z", y: 91963 }, { x: "2021-08-20T00:00:00Z", y: 91980 }, { x: "2021-08-21T00:00:00Z", y: 91983 }, { x: "2021-08-22T00:00:00Z", y: 91987 }, { x: "2021-08-23T00:00:00Z", y: 92028 }, { x: "2021-08-24T00:00:00Z", y: 92067 }, { x: "2021-08-25T00:00:00Z", y: 92090 }, { x: "2021-08-26T00:00:00Z", y: 92108 }, { x: "2021-08-27T00:00:00Z", y: 92125 }, { x: "2021-08-28T00:00:00Z", y: 92136 }, { x: "2021-08-29T00:00:00Z", y: 92146 }, { x: "2021-08-30T00:00:00Z", y: 92208 }, { x: "2021-08-31T00:00:00Z", y: 92229 }, { x: "2021-09-01T00:00:00Z", y: 92262 }, { x: "2021-09-02T00:00:00Z", y: 92307 }, { x: "2021-09-03T00:00:00Z", y: 92331 }, { x: "2021-09-04T00:00:00Z", y: 92351 }, { x: "2021-09-05T00:00:00Z", y: 92360 }, { x: "2021-09-06T00:00:00Z", y: 92419 }, { x: "2021-09-07T00:00:00Z", y: 92463 }, { x: "2021-09-08T00:00:00Z", y: 92463 }, { x: "2021-09-09T00:00:00Z", y: 92559 }, { x: "2021-09-10T00:00:00Z", y: 92604 }, { x: "2021-09-11T00:00:00Z", y: 92612 }, { x: "2021-09-12T00:00:00Z", y: 92625 }, { x: "2021-09-13T00:00:00Z", y: 92694 }, { x: "2021-09-14T00:00:00Z", y: 92776 }, { x: "2021-09-15T00:00:00Z", y: 92843 }, { x: "2021-09-16T00:00:00Z", y: 92906 }, { x: "2021-09-17T00:00:00Z", y: 92928 }, { x: "2021-09-18T00:00:00Z", y: 92964 }, { x: "2021-09-19T00:00:00Z", y: 92977 }, { x: "2021-09-20T00:00:00Z", y: 93058 }, { x: "2021-09-21T00:00:00Z", y: 93129 }, { x: "2021-09-22T00:00:00Z", y: 93243 }, { x: "2021-09-23T00:00:00Z", y: 93310 }, { x: "2021-09-24T00:00:00Z", y: 93370 }, { x: "2021-09-25T00:00:00Z", y: 93398 }, { x: "2021-09-26T00:00:00Z", y: 93409 }, { x: "2021-09-27T00:00:00Z", y: 93509 }, { x: "2021-09-28T00:00:00Z", y: 93576 }, { x: "2021-09-29T00:00:00Z", y: 93643 }, { x: "2021-09-30T00:00:00Z", y: 93715 }, { x: "2021-10-01T00:00:00Z", y: 93781 }, { x: "2021-10-02T00:00:00Z", y: 93791 }, { x: "2021-10-03T00:00:00Z", y: 93798 }, { x: "2021-10-04T00:00:00Z", y: 93887 }, { x: "2021-10-05T00:00:00Z", y: 93963 }, { x: "2021-10-06T00:00:00Z", y: 94031 }, { x: "2021-10-07T00:00:00Z", y: 94117 }, { x: "2021-10-08T00:00:00Z", y: 94182 }, { x: "2021-10-09T00:00:00Z", y: 94206 }, { x: "2021-10-10T00:00:00Z", y: 94213 }, { x: "2021-10-11T00:00:00Z", y: 94308 }, { x: "2021-10-12T00:00:00Z", y: 94393 }, { x: "2021-10-13T00:00:00Z", y: 94407 }, { x: "2021-10-14T00:00:00Z", y: 94530 }, { x: "2021-10-15T00:00:00Z", y: 94605 }, { x: "2021-10-16T00:00:00Z", y: 94622 }, { x: "2021-10-17T00:00:00Z", y: 94632 }, { x: "2021-10-18T00:00:00Z", y: 94720 }, { x: "2021-10-19T00:00:00Z", y: 94812 }, { x: "2021-10-20T00:00:00Z", y: 94886 }, { x: "2021-10-21T00:00:00Z", y: 94995 }, { x: "2021-10-22T00:00:00Z", y: 95081 }, { x: "2021-10-23T00:00:00Z", y: 95104 }, { x: "2021-10-24T00:00:00Z", y: 95121 }, { x: "2021-10-25T00:00:00Z", y: 95148 }, { x: "2021-10-26T00:00:00Z", y: 95365 }, { x: "2021-10-27T00:00:00Z", y: 95489 }, { x: "2021-10-28T00:00:00Z", y: 95522 }, { x: "2021-10-29T00:00:00Z", y: 95701 }, { x: "2021-10-30T00:00:00Z", y: 95734 }, { x: "2021-10-31T00:00:00Z", y: 95735 }, { x: "2021-11-01T00:00:00Z", y: 95838 }, { x: "2021-11-02T00:00:00Z", y: 96031 }, { x: "2021-11-03T00:00:00Z", y: 96196 }, { x: "2021-11-04T00:00:00Z", y: 96351 }, { x: "2021-11-05T00:00:00Z", y: 96492 }, { x: "2021-11-06T00:00:00Z", y: 96529 }, { x: "2021-11-07T00:00:00Z", y: 96563 }, { x: "2021-11-08T00:00:00Z", y: 96731 }, { x: "2021-11-09T00:00:00Z", y: 96968 }, { x: "2021-11-10T00:00:00Z", y: 97203 }, { x: "2021-11-11T00:00:00Z", y: 97394 }, { x: "2021-11-12T00:00:00Z", y: 97623 }, { x: "2021-11-13T00:00:00Z", y: 97677 }] }, { label: "Greece", data: [{ x: "2020-01-22T00:00:00Z", y: 0 }, { x: "2020-01-23T00:00:00Z", y: 0 }, { x: "2020-01-24T00:00:00Z", y: 0 }, { x: "2020-01-25T00:00:00Z", y: 0 }, { x: "2020-01-26T00:00:00Z", y: 0 }, { x: "2020-01-27T00:00:00Z", y: 0 }, { x: "2020-01-28T00:00:00Z", y: 0 }, { x: "2020-01-29T00:00:00Z", y: 0 }, { x: "2020-01-30T00:00:00Z", y: 0 }, { x: "2020-01-31T00:00:00Z", y: 0 }, { x: "2020-02-01T00:00:00Z", y: 0 }, { x: "2020-02-02T00:00:00Z", y: 0 }, { x: "2020-02-03T00:00:00Z", y: 0 }, { x: "2020-02-04T00:00:00Z", y: 0 }, { x: "2020-02-05T00:00:00Z", y: 0 }, { x: "2020-02-06T00:00:00Z", y: 0 }, { x: "2020-02-07T00:00:00Z", y: 0 }, { x: "2020-02-08T00:00:00Z", y: 0 }, { x: "2020-02-09T00:00:00Z", y: 0 }, { x: "2020-02-10T00:00:00Z", y: 0 }, { x: "2020-02-11T00:00:00Z", y: 0 }, { x: "2020-02-12T00:00:00Z", y: 0 }, { x: "2020-02-13T00:00:00Z", y: 0 }, { x: "2020-02-14T00:00:00Z", y: 0 }, { x: "2020-02-15T00:00:00Z", y: 0 }, { x: "2020-02-16T00:00:00Z", y: 0 }, { x: "2020-02-17T00:00:00Z", y: 0 }, { x: "2020-02-18T00:00:00Z", y: 0 }, { x: "2020-02-19T00:00:00Z", y: 0 }, { x: "2020-02-20T00:00:00Z", y: 0 }, { x: "2020-02-21T00:00:00Z", y: 0 }, { x: "2020-02-22T00:00:00Z", y: 0 }, { x: "2020-02-23T00:00:00Z", y: 0 }, { x: "2020-02-24T00:00:00Z", y: 0 }, { x: "2020-02-25T00:00:00Z", y: 0 }, { x: "2020-02-26T00:00:00Z", y: 0 }, { x: "2020-02-27T00:00:00Z", y: 0 }, { x: "2020-02-28T00:00:00Z", y: 0 }, { x: "2020-02-29T00:00:00Z", y: 0 }, { x: "2020-03-01T00:00:00Z", y: 0 }, { x: "2020-03-02T00:00:00Z", y: 0 }, { x: "2020-03-03T00:00:00Z", y: 0 }, { x: "2020-03-04T00:00:00Z", y: 0 }, { x: "2020-03-05T00:00:00Z", y: 0 }, { x: "2020-03-06T00:00:00Z", y: 0 }, { x: "2020-03-07T00:00:00Z", y: 0 }, { x: "2020-03-08T00:00:00Z", y: 0 }, { x: "2020-03-09T00:00:00Z", y: 0 }, { x: "2020-03-10T00:00:00Z", y: 0 }, { x: "2020-03-11T00:00:00Z", y: 1 }, { x: "2020-03-12T00:00:00Z", y: 1 }, { x: "2020-03-13T00:00:00Z", y: 1 }, { x: "2020-03-14T00:00:00Z", y: 3 }, { x: "2020-03-15T00:00:00Z", y: 4 }, { x: "2020-03-16T00:00:00Z", y: 4 }, { x: "2020-03-17T00:00:00Z", y: 5 }, { x: "2020-03-18T00:00:00Z", y: 5 }, { x: "2020-03-19T00:00:00Z", y: 6 }, { x: "2020-03-20T00:00:00Z", y: 8 }, { x: "2020-03-21T00:00:00Z", y: 13 }, { x: "2020-03-22T00:00:00Z", y: 15 }, { x: "2020-03-23T00:00:00Z", y: 17 }, { x: "2020-03-24T00:00:00Z", y: 20 }, { x: "2020-03-25T00:00:00Z", y: 22 }, { x: "2020-03-26T00:00:00Z", y: 22 }, { x: "2020-03-27T00:00:00Z", y: 22 }, { x: "2020-03-28T00:00:00Z", y: 22 }, { x: "2020-03-29T00:00:00Z", y: 38 }, { x: "2020-03-30T00:00:00Z", y: 38 }, { x: "2020-03-31T00:00:00Z", y: 38 }, { x: "2020-04-01T00:00:00Z", y: 38 }, { x: "2020-04-02T00:00:00Z", y: 38 }, { x: "2020-04-03T00:00:00Z", y: 59 }, { x: "2020-04-04T00:00:00Z", y: 68 }, { x: "2020-04-05T00:00:00Z", y: 73 }, { x: "2020-04-06T00:00:00Z", y: 79 }, { x: "2020-04-07T00:00:00Z", y: 81 }, { x: "2020-04-08T00:00:00Z", y: 83 }, { x: "2020-04-09T00:00:00Z", y: 86 }, { x: "2020-04-10T00:00:00Z", y: 90 }, { x: "2020-04-11T00:00:00Z", y: 93 }, { x: "2020-04-12T00:00:00Z", y: 93 }, { x: "2020-04-13T00:00:00Z", y: 99 }, { x: "2020-04-14T00:00:00Z", y: 101 }, { x: "2020-04-15T00:00:00Z", y: 102 }, { x: "2020-04-16T00:00:00Z", y: 105 }, { x: "2020-04-17T00:00:00Z", y: 108 }, { x: "2020-04-18T00:00:00Z", y: 110 }, { x: "2020-04-19T00:00:00Z", y: 116 }, { x: "2020-04-20T00:00:00Z", y: 116 }, { x: "2020-04-21T00:00:00Z", y: 121 }, { x: "2020-04-22T00:00:00Z", y: 121 }, { x: "2020-04-23T00:00:00Z", y: 125 }, { x: "2020-04-24T00:00:00Z", y: 130 }, { x: "2020-04-25T00:00:00Z", y: 130 }, { x: "2020-04-26T00:00:00Z", y: 134 }, { x: "2020-04-27T00:00:00Z", y: 136 }, { x: "2020-04-28T00:00:00Z", y: 138 }, { x: "2020-04-29T00:00:00Z", y: 139 }, { x: "2020-04-30T00:00:00Z", y: 140 }, { x: "2020-05-01T00:00:00Z", y: 140 }, { x: "2020-05-02T00:00:00Z", y: 143 }, { x: "2020-05-03T00:00:00Z", y: 144 }, { x: "2020-05-04T00:00:00Z", y: 146 }, { x: "2020-05-05T00:00:00Z", y: 146 }, { x: "2020-05-06T00:00:00Z", y: 147 }, { x: "2020-05-07T00:00:00Z", y: 148 }, { x: "2020-05-08T00:00:00Z", y: 150 }, { x: "2020-05-09T00:00:00Z", y: 151 }, { x: "2020-05-10T00:00:00Z", y: 151 }, { x: "2020-05-11T00:00:00Z", y: 151 }, { x: "2020-05-12T00:00:00Z", y: 152 }, { x: "2020-05-13T00:00:00Z", y: 155 }, { x: "2020-05-14T00:00:00Z", y: 156 }, { x: "2020-05-15T00:00:00Z", y: 160 }, { x: "2020-05-16T00:00:00Z", y: 162 }, { x: "2020-05-17T00:00:00Z", y: 163 }, { x: "2020-05-18T00:00:00Z", y: 165 }, { x: "2020-05-19T00:00:00Z", y: 165 }, { x: "2020-05-20T00:00:00Z", y: 166 }, { x: "2020-05-21T00:00:00Z", y: 168 }, { x: "2020-05-22T00:00:00Z", y: 169 }, { x: "2020-05-23T00:00:00Z", y: 171 }, { x: "2020-05-24T00:00:00Z", y: 171 }, { x: "2020-05-25T00:00:00Z", y: 172 }, { x: "2020-05-26T00:00:00Z", y: 173 }, { x: "2020-05-27T00:00:00Z", y: 173 }, { x: "2020-05-28T00:00:00Z", y: 175 }, { x: "2020-05-29T00:00:00Z", y: 175 }, { x: "2020-05-30T00:00:00Z", y: 175 }, { x: "2020-05-31T00:00:00Z", y: 175 }, { x: "2020-06-01T00:00:00Z", y: 179 }, { x: "2020-06-02T00:00:00Z", y: 179 }, { x: "2020-06-03T00:00:00Z", y: 180 }, { x: "2020-06-04T00:00:00Z", y: 180 }, { x: "2020-06-05T00:00:00Z", y: 182 }, { x: "2020-06-06T00:00:00Z", y: 182 }, { x: "2020-06-07T00:00:00Z", y: 182 }, { x: "2020-06-08T00:00:00Z", y: 182 }, { x: "2020-06-09T00:00:00Z", y: 183 }, { x: "2020-06-10T00:00:00Z", y: 183 }, { x: "2020-06-11T00:00:00Z", y: 183 }, { x: "2020-06-12T00:00:00Z", y: 183 }, { x: "2020-06-13T00:00:00Z", y: 183 }, { x: "2020-06-14T00:00:00Z", y: 183 }, { x: "2020-06-15T00:00:00Z", y: 184 }, { x: "2020-06-16T00:00:00Z", y: 185 }, { x: "2020-06-17T00:00:00Z", y: 187 }, { x: "2020-06-18T00:00:00Z", y: 188 }, { x: "2020-06-19T00:00:00Z", y: 189 }, { x: "2020-06-20T00:00:00Z", y: 190 }, { x: "2020-06-21T00:00:00Z", y: 190 }, { x: "2020-06-22T00:00:00Z", y: 190 }, { x: "2020-06-23T00:00:00Z", y: 190 }, { x: "2020-06-24T00:00:00Z", y: 190 }, { x: "2020-06-25T00:00:00Z", y: 191 }, { x: "2020-06-26T00:00:00Z", y: 191 }, { x: "2020-06-27T00:00:00Z", y: 191 }, { x: "2020-06-28T00:00:00Z", y: 191 }, { x: "2020-06-29T00:00:00Z", y: 191 }, { x: "2020-06-30T00:00:00Z", y: 192 }, { x: "2020-07-01T00:00:00Z", y: 192 }, { x: "2020-07-02T00:00:00Z", y: 192 }, { x: "2020-07-03T00:00:00Z", y: 192 }, { x: "2020-07-04T00:00:00Z", y: 192 }, { x: "2020-07-05T00:00:00Z", y: 192 }, { x: "2020-07-06T00:00:00Z", y: 192 }, { x: "2020-07-07T00:00:00Z", y: 193 }, { x: "2020-07-08T00:00:00Z", y: 193 }, { x: "2020-07-09T00:00:00Z", y: 193 }, { x: "2020-07-10T00:00:00Z", y: 193 }, { x: "2020-07-11T00:00:00Z", y: 193 }, { x: "2020-07-12T00:00:00Z", y: 193 }, { x: "2020-07-13T00:00:00Z", y: 193 }, { x: "2020-07-14T00:00:00Z", y: 193 }, { x: "2020-07-15T00:00:00Z", y: 193 }, { x: "2020-07-16T00:00:00Z", y: 193 }, { x: "2020-07-17T00:00:00Z", y: 194 }, { x: "2020-07-18T00:00:00Z", y: 194 }, { x: "2020-07-19T00:00:00Z", y: 194 }, { x: "2020-07-20T00:00:00Z", y: 195 }, { x: "2020-07-21T00:00:00Z", y: 197 }, { x: "2020-07-22T00:00:00Z", y: 200 }, { x: "2020-07-23T00:00:00Z", y: 201 }, { x: "2020-07-24T00:00:00Z", y: 201 }, { x: "2020-07-25T00:00:00Z", y: 201 }, { x: "2020-07-26T00:00:00Z", y: 202 }, { x: "2020-07-27T00:00:00Z", y: 202 }, { x: "2020-07-28T00:00:00Z", y: 203 }, { x: "2020-07-29T00:00:00Z", y: 203 }, { x: "2020-07-30T00:00:00Z", y: 203 }, { x: "2020-07-31T00:00:00Z", y: 206 }, { x: "2020-08-01T00:00:00Z", y: 206 }, { x: "2020-08-02T00:00:00Z", y: 208 }, { x: "2020-08-03T00:00:00Z", y: 209 }, { x: "2020-08-04T00:00:00Z", y: 209 }, { x: "2020-08-05T00:00:00Z", y: 210 }, { x: "2020-08-06T00:00:00Z", y: 210 }, { x: "2020-08-07T00:00:00Z", y: 210 }, { x: "2020-08-08T00:00:00Z", y: 211 }, { x: "2020-08-09T00:00:00Z", y: 212 }, { x: "2020-08-10T00:00:00Z", y: 213 }, { x: "2020-08-11T00:00:00Z", y: 214 }, { x: "2020-08-12T00:00:00Z", y: 216 }, { x: "2020-08-13T00:00:00Z", y: 221 }, { x: "2020-08-14T00:00:00Z", y: 223 }, { x: "2020-08-15T00:00:00Z", y: 226 }, { x: "2020-08-16T00:00:00Z", y: 228 }, { x: "2020-08-17T00:00:00Z", y: 230 }, { x: "2020-08-18T00:00:00Z", y: 232 }, { x: "2020-08-19T00:00:00Z", y: 235 }, { x: "2020-08-20T00:00:00Z", y: 235 }, { x: "2020-08-21T00:00:00Z", y: 238 }, { x: "2020-08-22T00:00:00Z", y: 240 }, { x: "2020-08-23T00:00:00Z", y: 242 }, { x: "2020-08-24T00:00:00Z", y: 242 }, { x: "2020-08-25T00:00:00Z", y: 243 }, { x: "2020-08-26T00:00:00Z", y: 243 }, { x: "2020-08-27T00:00:00Z", y: 254 }, { x: "2020-08-28T00:00:00Z", y: 259 }, { x: "2020-08-29T00:00:00Z", y: 260 }, { x: "2020-08-30T00:00:00Z", y: 262 }, { x: "2020-08-31T00:00:00Z", y: 266 }, { x: "2020-09-01T00:00:00Z", y: 271 }, { x: "2020-09-02T00:00:00Z", y: 273 }, { x: "2020-09-03T00:00:00Z", y: 278 }, { x: "2020-09-04T00:00:00Z", y: 279 }, { x: "2020-09-05T00:00:00Z", y: 280 }, { x: "2020-09-06T00:00:00Z", y: 284 }, { x: "2020-09-07T00:00:00Z", y: 289 }, { x: "2020-09-08T00:00:00Z", y: 290 }, { x: "2020-09-09T00:00:00Z", y: 293 }, { x: "2020-09-10T00:00:00Z", y: 297 }, { x: "2020-09-11T00:00:00Z", y: 300 }, { x: "2020-09-12T00:00:00Z", y: 302 }, { x: "2020-09-13T00:00:00Z", y: 305 }, { x: "2020-09-14T00:00:00Z", y: 310 }, { x: "2020-09-15T00:00:00Z", y: 313 }, { x: "2020-09-16T00:00:00Z", y: 316 }, { x: "2020-09-17T00:00:00Z", y: 325 }, { x: "2020-09-18T00:00:00Z", y: 327 }, { x: "2020-09-19T00:00:00Z", y: 331 }, { x: "2020-09-20T00:00:00Z", y: 338 }, { x: "2020-09-21T00:00:00Z", y: 344 }, { x: "2020-09-22T00:00:00Z", y: 352 }, { x: "2020-09-23T00:00:00Z", y: 357 }, { x: "2020-09-24T00:00:00Z", y: 366 }, { x: "2020-09-25T00:00:00Z", y: 369 }, { x: "2020-09-26T00:00:00Z", y: 376 }, { x: "2020-09-27T00:00:00Z", y: 379 }, { x: "2020-09-28T00:00:00Z", y: 383 }, { x: "2020-09-29T00:00:00Z", y: 388 }, { x: "2020-09-30T00:00:00Z", y: 391 }, { x: "2020-10-01T00:00:00Z", y: 393 }, { x: "2020-10-02T00:00:00Z", y: 398 }, { x: "2020-10-03T00:00:00Z", y: 405 }, { x: "2020-10-04T00:00:00Z", y: 409 }, { x: "2020-10-05T00:00:00Z", y: 417 }, { x: "2020-10-06T00:00:00Z", y: 420 }, { x: "2020-10-07T00:00:00Z", y: 424 }, { x: "2020-10-08T00:00:00Z", y: 430 }, { x: "2020-10-09T00:00:00Z", y: 431 }, { x: "2020-10-10T00:00:00Z", y: 436 }, { x: "2020-10-11T00:00:00Z", y: 449 }, { x: "2020-10-12T00:00:00Z", y: 456 }, { x: "2020-10-13T00:00:00Z", y: 462 }, { x: "2020-10-14T00:00:00Z", y: 469 }, { x: "2020-10-15T00:00:00Z", y: 482 }, { x: "2020-10-16T00:00:00Z", y: 490 }, { x: "2020-10-17T00:00:00Z", y: 500 }, { x: "2020-10-18T00:00:00Z", y: 509 }, { x: "2020-10-19T00:00:00Z", y: 520 }, { x: "2020-10-20T00:00:00Z", y: 528 }, { x: "2020-10-21T00:00:00Z", y: 534 }, { x: "2020-10-22T00:00:00Z", y: 549 }, { x: "2020-10-23T00:00:00Z", y: 559 }, { x: "2020-10-24T00:00:00Z", y: 564 }, { x: "2020-10-25T00:00:00Z", y: 574 }, { x: "2020-10-26T00:00:00Z", y: 581 }, { x: "2020-10-27T00:00:00Z", y: 593 }, { x: "2020-10-28T00:00:00Z", y: 603 }, { x: "2020-10-29T00:00:00Z", y: 615 }, { x: "2020-10-30T00:00:00Z", y: 620 }, { x: "2020-10-31T00:00:00Z", y: 626 }, { x: "2020-11-01T00:00:00Z", y: 635 }, { x: "2020-11-02T00:00:00Z", y: 642 }, { x: "2020-11-03T00:00:00Z", y: 655 }, { x: "2020-11-04T00:00:00Z", y: 673 }, { x: "2020-11-05T00:00:00Z", y: 702 }, { x: "2020-11-06T00:00:00Z", y: 715 }, { x: "2020-11-07T00:00:00Z", y: 749 }, { x: "2020-11-08T00:00:00Z", y: 784 }, { x: "2020-11-09T00:00:00Z", y: 825 }, { x: "2020-11-10T00:00:00Z", y: 866 }, { x: "2020-11-11T00:00:00Z", y: 909 }, { x: "2020-11-12T00:00:00Z", y: 959 }, { x: "2020-11-13T00:00:00Z", y: 997 }, { x: "2020-11-14T00:00:00Z", y: 1035 }, { x: "2020-11-15T00:00:00Z", y: 1106 }, { x: "2020-11-16T00:00:00Z", y: 1165 }, { x: "2020-11-17T00:00:00Z", y: 1228 }, { x: "2020-11-18T00:00:00Z", y: 1288 }, { x: "2020-11-19T00:00:00Z", y: 1347 }, { x: "2020-11-20T00:00:00Z", y: 1419 }, { x: "2020-11-21T00:00:00Z", y: 1527 }, { x: "2020-11-22T00:00:00Z", y: 1630 }, { x: "2020-11-23T00:00:00Z", y: 1714 }, { x: "2020-11-24T00:00:00Z", y: 1815 }, { x: "2020-11-25T00:00:00Z", y: 1902 }, { x: "2020-11-26T00:00:00Z", y: 2001 }, { x: "2020-11-27T00:00:00Z", y: 2102 }, { x: "2020-11-28T00:00:00Z", y: 2223 }, { x: "2020-11-29T00:00:00Z", y: 2321 }, { x: "2020-11-30T00:00:00Z", y: 2406 }, { x: "2020-12-01T00:00:00Z", y: 2517 }, { x: "2020-12-02T00:00:00Z", y: 2606 }, { x: "2020-12-03T00:00:00Z", y: 2706 }, { x: "2020-12-04T00:00:00Z", y: 2804 }, { x: "2020-12-05T00:00:00Z", y: 2902 }, { x: "2020-12-06T00:00:00Z", y: 3003 }, { x: "2020-12-07T00:00:00Z", y: 3092 }, { x: "2020-12-08T00:00:00Z", y: 3194 }, { x: "2020-12-09T00:00:00Z", y: 3289 }, { x: "2020-12-10T00:00:00Z", y: 3370 }, { x: "2020-12-11T00:00:00Z", y: 3472 }, { x: "2020-12-12T00:00:00Z", y: 3540 }, { x: "2020-12-13T00:00:00Z", y: 3625 }, { x: "2020-12-14T00:00:00Z", y: 3687 }, { x: "2020-12-15T00:00:00Z", y: 3785 }, { x: "2020-12-16T00:00:00Z", y: 3870 }, { x: "2020-12-17T00:00:00Z", y: 3948 }, { x: "2020-12-18T00:00:00Z", y: 4044 }, { x: "2020-12-19T00:00:00Z", y: 4102 }, { x: "2020-12-20T00:00:00Z", y: 4172 }, { x: "2020-12-21T00:00:00Z", y: 4257 }, { x: "2020-12-22T00:00:00Z", y: 4340 }, { x: "2020-12-23T00:00:00Z", y: 4402 }, { x: "2020-12-24T00:00:00Z", y: 4457 }, { x: "2020-12-25T00:00:00Z", y: 4507 }, { x: "2020-12-26T00:00:00Z", y: 4553 }, { x: "2020-12-27T00:00:00Z", y: 4606 }, { x: "2020-12-28T00:00:00Z", y: 4672 }, { x: "2020-12-29T00:00:00Z", y: 4730 }, { x: "2020-12-30T00:00:00Z", y: 4788 }, { x: "2020-12-31T00:00:00Z", y: 4838 }, { x: "2021-01-01T00:00:00Z", y: 4881 }, { x: "2021-01-02T00:00:00Z", y: 4921 }, { x: "2021-01-03T00:00:00Z", y: 4957 }, { x: "2021-01-04T00:00:00Z", y: 5011 }, { x: "2021-01-05T00:00:00Z", y: 5051 }, { x: "2021-01-06T00:00:00Z", y: 5099 }, { x: "2021-01-07T00:00:00Z", y: 5146 }, { x: "2021-01-08T00:00:00Z", y: 5195 }, { x: "2021-01-09T00:00:00Z", y: 5227 }, { x: "2021-01-10T00:00:00Z", y: 5263 }, { x: "2021-01-11T00:00:00Z", y: 5302 }, { x: "2021-01-12T00:00:00Z", y: 5329 }, { x: "2021-01-13T00:00:00Z", y: 5354 }, { x: "2021-01-14T00:00:00Z", y: 5387 }, { x: "2021-01-15T00:00:00Z", y: 5421 }, { x: "2021-01-16T00:00:00Z", y: 5441 }, { x: "2021-01-17T00:00:00Z", y: 5469 }, { x: "2021-01-18T00:00:00Z", y: 5488 }, { x: "2021-01-19T00:00:00Z", y: 5518 }, { x: "2021-01-20T00:00:00Z", y: 5545 }, { x: "2021-01-21T00:00:00Z", y: 5570 }, { x: "2021-01-22T00:00:00Z", y: 5598 }, { x: "2021-01-23T00:00:00Z", y: 5622 }, { x: "2021-01-24T00:00:00Z", y: 5646 }, { x: "2021-01-25T00:00:00Z", y: 5671 }, { x: "2021-01-26T00:00:00Z", y: 5692 }, { x: "2021-01-27T00:00:00Z", y: 5724 }, { x: "2021-01-28T00:00:00Z", y: 5742 }, { x: "2021-01-29T00:00:00Z", y: 5764 }, { x: "2021-01-30T00:00:00Z", y: 5779 }, { x: "2021-01-31T00:00:00Z", y: 5796 }, { x: "2021-02-01T00:00:00Z", y: 5829 }, { x: "2021-02-02T00:00:00Z", y: 5851 }, { x: "2021-02-03T00:00:00Z", y: 5878 }, { x: "2021-02-04T00:00:00Z", y: 5903 }, { x: "2021-02-05T00:00:00Z", y: 5922 }, { x: "2021-02-06T00:00:00Z", y: 5951 }, { x: "2021-02-07T00:00:00Z", y: 5972 }, { x: "2021-02-08T00:00:00Z", y: 5997 }, { x: "2021-02-09T00:00:00Z", y: 6017 }, { x: "2021-02-10T00:00:00Z", y: 6034 }, { x: "2021-02-11T00:00:00Z", y: 6056 }, { x: "2021-02-12T00:00:00Z", y: 6077 }, { x: "2021-02-13T00:00:00Z", y: 6103 }, { x: "2021-02-14T00:00:00Z", y: 6126 }, { x: "2021-02-15T00:00:00Z", y: 6152 }, { x: "2021-02-16T00:00:00Z", y: 6181 }, { x: "2021-02-17T00:00:00Z", y: 6194 }, { x: "2021-02-18T00:00:00Z", y: 6221 }, { x: "2021-02-19T00:00:00Z", y: 6249 }, { x: "2021-02-20T00:00:00Z", y: 6272 }, { x: "2021-02-21T00:00:00Z", y: 6297 }, { x: "2021-02-22T00:00:00Z", y: 6321 }, { x: "2021-02-23T00:00:00Z", y: 6343 }, { x: "2021-02-24T00:00:00Z", y: 6371 }, { x: "2021-02-25T00:00:00Z", y: 6410 }, { x: "2021-02-26T00:00:00Z", y: 6439 }, { x: "2021-02-27T00:00:00Z", y: 6468 }, { x: "2021-02-28T00:00:00Z", y: 6504 }, { x: "2021-03-01T00:00:00Z", y: 6534 }, { x: "2021-03-02T00:00:00Z", y: 6557 }, { x: "2021-03-03T00:00:00Z", y: 6597 }, { x: "2021-03-04T00:00:00Z", y: 6632 }, { x: "2021-03-05T00:00:00Z", y: 6664 }, { x: "2021-03-06T00:00:00Z", y: 6705 }, { x: "2021-03-07T00:00:00Z", y: 6758 }, { x: "2021-03-08T00:00:00Z", y: 6797 }, { x: "2021-03-09T00:00:00Z", y: 6843 }, { x: "2021-03-10T00:00:00Z", y: 6886 }, { x: "2021-03-11T00:00:00Z", y: 6937 }, { x: "2021-03-12T00:00:00Z", y: 6986 }, { x: "2021-03-13T00:00:00Z", y: 7038 }, { x: "2021-03-14T00:00:00Z", y: 7091 }, { x: "2021-03-15T00:00:00Z", y: 7137 }, { x: "2021-03-16T00:00:00Z", y: 7196 }, { x: "2021-03-17T00:00:00Z", y: 7252 }, { x: "2021-03-18T00:00:00Z", y: 7297 }, { x: "2021-03-19T00:00:00Z", y: 7361 }, { x: "2021-03-20T00:00:00Z", y: 7421 }, { x: "2021-03-21T00:00:00Z", y: 7462 }, { x: "2021-03-22T00:00:00Z", y: 7531 }, { x: "2021-03-23T00:00:00Z", y: 7582 }, { x: "2021-03-24T00:00:00Z", y: 7649 }, { x: "2021-03-25T00:00:00Z", y: 7701 }, { x: "2021-03-26T00:00:00Z", y: 7754 }, { x: "2021-03-27T00:00:00Z", y: 7826 }, { x: "2021-03-28T00:00:00Z", y: 7880 }, { x: "2021-03-29T00:00:00Z", y: 7945 }, { x: "2021-03-30T00:00:00Z", y: 8017 }, { x: "2021-03-31T00:00:00Z", y: 8093 }, { x: "2021-04-01T00:00:00Z", y: 8160 }, { x: "2021-04-02T00:00:00Z", y: 8232 }, { x: "2021-04-03T00:00:00Z", y: 8302 }, { x: "2021-04-04T00:00:00Z", y: 8380 }, { x: "2021-04-05T00:00:00Z", y: 8453 }, { x: "2021-04-06T00:00:00Z", y: 8532 }, { x: "2021-04-07T00:00:00Z", y: 8607 }, { x: "2021-04-08T00:00:00Z", y: 8680 }, { x: "2021-04-09T00:00:00Z", y: 8758 }, { x: "2021-04-10T00:00:00Z", y: 8833 }, { x: "2021-04-11T00:00:00Z", y: 8885 }, { x: "2021-04-12T00:00:00Z", y: 8961 }, { x: "2021-04-13T00:00:00Z", y: 9054 }, { x: "2021-04-14T00:00:00Z", y: 9135 }, { x: "2021-04-15T00:00:00Z", y: 9239 }, { x: "2021-04-16T00:00:00Z", y: 9330 }, { x: "2021-04-17T00:00:00Z", y: 9397 }, { x: "2021-04-18T00:00:00Z", y: 9462 }, { x: "2021-04-19T00:00:00Z", y: 9540 }, { x: "2021-04-20T00:00:00Z", y: 9627 }, { x: "2021-04-21T00:00:00Z", y: 9713 }, { x: "2021-04-22T00:00:00Z", y: 9788 }, { x: "2021-04-23T00:00:00Z", y: 9864 }, { x: "2021-04-24T00:00:00Z", y: 9950 }, { x: "2021-04-25T00:00:00Z", y: 10007 }, { x: "2021-04-26T00:00:00Z", y: 10087 }, { x: "2021-04-27T00:00:00Z", y: 10179 }, { x: "2021-04-28T00:00:00Z", y: 10242 }, { x: "2021-04-29T00:00:00Z", y: 10315 }, { x: "2021-04-30T00:00:00Z", y: 10381 }, { x: "2021-05-01T00:00:00Z", y: 10453 }, { x: "2021-05-02T00:00:00Z", y: 10453 }, { x: "2021-05-03T00:00:00Z", y: 10587 }, { x: "2021-05-04T00:00:00Z", y: 10668 }, { x: "2021-05-05T00:00:00Z", y: 10764 }, { x: "2021-05-06T00:00:00Z", y: 10847 }, { x: "2021-05-07T00:00:00Z", y: 10910 }, { x: "2021-05-08T00:00:00Z", y: 10978 }, { x: "2021-05-09T00:00:00Z", y: 11029 }, { x: "2021-05-10T00:00:00Z", y: 11089 }, { x: "2021-05-11T00:00:00Z", y: 11141 }, { x: "2021-05-12T00:00:00Z", y: 11211 }, { x: "2021-05-13T00:00:00Z", y: 11266 }, { x: "2021-05-14T00:00:00Z", y: 11322 }, { x: "2021-05-15T00:00:00Z", y: 11365 }, { x: "2021-05-16T00:00:00Z", y: 11415 }, { x: "2021-05-17T00:00:00Z", y: 11471 }, { x: "2021-05-18T00:00:00Z", y: 11534 }, { x: "2021-05-19T00:00:00Z", y: 11587 }, { x: "2021-05-20T00:00:00Z", y: 11641 }, { x: "2021-05-21T00:00:00Z", y: 11697 }, { x: "2021-05-22T00:00:00Z", y: 11734 }, { x: "2021-05-23T00:00:00Z", y: 11772 }, { x: "2021-05-24T00:00:00Z", y: 11822 }, { x: "2021-05-25T00:00:00Z", y: 11872 }, { x: "2021-05-26T00:00:00Z", y: 11916 }, { x: "2021-05-27T00:00:00Z", y: 11955 }, { x: "2021-05-28T00:00:00Z", y: 11995 }, { x: "2021-05-29T00:00:00Z", y: 12024 }, { x: "2021-05-30T00:00:00Z", y: 12054 }, { x: "2021-05-31T00:00:00Z", y: 12095 }, { x: "2021-06-01T00:00:00Z", y: 12122 }, { x: "2021-06-02T00:00:00Z", y: 12145 }, { x: "2021-06-03T00:00:00Z", y: 12184 }, { x: "2021-06-04T00:00:00Z", y: 12218 }, { x: "2021-06-05T00:00:00Z", y: 12253 }, { x: "2021-06-06T00:00:00Z", y: 12277 }, { x: "2021-06-07T00:00:00Z", y: 12301 }, { x: "2021-06-08T00:00:00Z", y: 12331 }, { x: "2021-06-09T00:00:00Z", y: 12346 }, { x: "2021-06-10T00:00:00Z", y: 12370 }, { x: "2021-06-11T00:00:00Z", y: 12381 }, { x: "2021-06-12T00:00:00Z", y: 12405 }, { x: "2021-06-13T00:00:00Z", y: 12422 }, { x: "2021-06-14T00:00:00Z", y: 12443 }, { x: "2021-06-15T00:00:00Z", y: 12465 }, { x: "2021-06-16T00:00:00Z", y: 12478 }, { x: "2021-06-17T00:00:00Z", y: 12494 }, { x: "2021-06-18T00:00:00Z", y: 12514 }, { x: "2021-06-19T00:00:00Z", y: 12534 }, { x: "2021-06-20T00:00:00Z", y: 12548 }, { x: "2021-06-21T00:00:00Z", y: 12565 }, { x: "2021-06-22T00:00:00Z", y: 12581 }, { x: "2021-06-23T00:00:00Z", y: 12595 }, { x: "2021-06-24T00:00:00Z", y: 12613 }, { x: "2021-06-25T00:00:00Z", y: 12634 }, { x: "2021-06-26T00:00:00Z", y: 12646 }, { x: "2021-06-27T00:00:00Z", y: 12664 }, { x: "2021-06-28T00:00:00Z", y: 12682 }, { x: "2021-06-29T00:00:00Z", y: 12695 }, { x: "2021-06-30T00:00:00Z", y: 12706 }, { x: "2021-07-01T00:00:00Z", y: 12710 }, { x: "2021-07-02T00:00:00Z", y: 12722 }, { x: "2021-07-03T00:00:00Z", y: 12731 }, { x: "2021-07-04T00:00:00Z", y: 12737 }, { x: "2021-07-05T00:00:00Z", y: 12743 }, { x: "2021-07-06T00:00:00Z", y: 12754 }, { x: "2021-07-07T00:00:00Z", y: 12763 }, { x: "2021-07-08T00:00:00Z", y: 12773 }, { x: "2021-07-09T00:00:00Z", y: 12785 }, { x: "2021-07-10T00:00:00Z", y: 12787 }, { x: "2021-07-11T00:00:00Z", y: 12792 }, { x: "2021-07-12T00:00:00Z", y: 12802 }, { x: "2021-07-13T00:00:00Z", y: 12806 }, { x: "2021-07-14T00:00:00Z", y: 12813 }, { x: "2021-07-15T00:00:00Z", y: 12819 }, { x: "2021-07-16T00:00:00Z", y: 12833 }, { x: "2021-07-17T00:00:00Z", y: 12840 }, { x: "2021-07-18T00:00:00Z", y: 12850 }, { x: "2021-07-19T00:00:00Z", y: 12858 }, { x: "2021-07-20T00:00:00Z", y: 12867 }, { x: "2021-07-21T00:00:00Z", y: 12870 }, { x: "2021-07-22T00:00:00Z", y: 12875 }, { x: "2021-07-23T00:00:00Z", y: 12882 }, { x: "2021-07-24T00:00:00Z", y: 12890 }, { x: "2021-07-25T00:00:00Z", y: 12898 }, { x: "2021-07-26T00:00:00Z", y: 12903 }, { x: "2021-07-27T00:00:00Z", y: 12911 }, { x: "2021-07-28T00:00:00Z", y: 12926 }, { x: "2021-07-29T00:00:00Z", y: 12935 }, { x: "2021-07-30T00:00:00Z", y: 12948 }, { x: "2021-07-31T00:00:00Z", y: 12965 }, { x: "2021-08-01T00:00:00Z", y: 12975 }, { x: "2021-08-02T00:00:00Z", y: 12983 }, { x: "2021-08-03T00:00:00Z", y: 12997 }, { x: "2021-08-04T00:00:00Z", y: 13013 }, { x: "2021-08-05T00:00:00Z", y: 13026 }, { x: "2021-08-06T00:00:00Z", y: 13048 }, { x: "2021-08-07T00:00:00Z", y: 13058 }, { x: "2021-08-08T00:00:00Z", y: 13075 }, { x: "2021-08-09T00:00:00Z", y: 13097 }, { x: "2021-08-10T00:00:00Z", y: 13118 }, { x: "2021-08-11T00:00:00Z", y: 13138 }, { x: "2021-08-12T00:00:00Z", y: 13158 }, { x: "2021-08-13T00:00:00Z", y: 13182 }, { x: "2021-08-14T00:00:00Z", y: 13206 }, { x: "2021-08-15T00:00:00Z", y: 13223 }, { x: "2021-08-16T00:00:00Z", y: 13237 }, { x: "2021-08-17T00:00:00Z", y: 13253 }, { x: "2021-08-18T00:00:00Z", y: 13278 }, { x: "2021-08-19T00:00:00Z", y: 13298 }, { x: "2021-08-20T00:00:00Z", y: 13328 }, { x: "2021-08-21T00:00:00Z", y: 13351 }, { x: "2021-08-22T00:00:00Z", y: 13384 }, { x: "2021-08-23T00:00:00Z", y: 13422 }, { x: "2021-08-24T00:00:00Z", y: 13466 }, { x: "2021-08-25T00:00:00Z", y: 13509 }, { x: "2021-08-26T00:00:00Z", y: 13539 }, { x: "2021-08-27T00:00:00Z", y: 13561 }, { x: "2021-08-28T00:00:00Z", y: 13599 }, { x: "2021-08-29T00:00:00Z", y: 13636 }, { x: "2021-08-30T00:00:00Z", y: 13656 }, { x: "2021-08-31T00:00:00Z", y: 13691 }, { x: "2021-09-01T00:00:00Z", y: 13743 }, { x: "2021-09-02T00:00:00Z", y: 13777 }, { x: "2021-09-03T00:00:00Z", y: 13813 }, { x: "2021-09-04T00:00:00Z", y: 13843 }, { x: "2021-09-05T00:00:00Z", y: 13886 }, { x: "2021-09-06T00:00:00Z", y: 13933 }, { x: "2021-09-07T00:00:00Z", y: 13971 }, { x: "2021-09-08T00:00:00Z", y: 14014 }, { x: "2021-09-09T00:00:00Z", y: 14060 }, { x: "2021-09-10T00:00:00Z", y: 14102 }, { x: "2021-09-11T00:00:00Z", y: 14141 }, { x: "2021-09-12T00:00:00Z", y: 14169 }, { x: "2021-09-13T00:00:00Z", y: 14223 }, { x: "2021-09-14T00:00:00Z", y: 14268 }, { x: "2021-09-15T00:00:00Z", y: 14311 }, { x: "2021-09-16T00:00:00Z", y: 14354 }, { x: "2021-09-17T00:00:00Z", y: 14394 }, { x: "2021-09-18T00:00:00Z", y: 14433 }, { x: "2021-09-19T00:00:00Z", y: 14466 }, { x: "2021-09-20T00:00:00Z", y: 14505 }, { x: "2021-09-21T00:00:00Z", y: 14548 }, { x: "2021-09-22T00:00:00Z", y: 14575 }, { x: "2021-09-23T00:00:00Z", y: 14606 }, { x: "2021-09-24T00:00:00Z", y: 14639 }, { x: "2021-09-25T00:00:00Z", y: 14655 }, { x: "2021-09-26T00:00:00Z", y: 14679 }, { x: "2021-09-27T00:00:00Z", y: 14727 }, { x: "2021-09-28T00:00:00Z", y: 14751 }, { x: "2021-09-29T00:00:00Z", y: 14795 }, { x: "2021-09-30T00:00:00Z", y: 14828 }, { x: "2021-10-01T00:00:00Z", y: 14860 }, { x: "2021-10-02T00:00:00Z", y: 14889 }, { x: "2021-10-03T00:00:00Z", y: 14920 }, { x: "2021-10-04T00:00:00Z", y: 14956 }, { x: "2021-10-05T00:00:00Z", y: 14991 }, { x: "2021-10-06T00:00:00Z", y: 15012 }, { x: "2021-10-07T00:00:00Z", y: 15042 }, { x: "2021-10-08T00:00:00Z", y: 15069 }, { x: "2021-10-09T00:00:00Z", y: 15105 }, { x: "2021-10-10T00:00:00Z", y: 15135 }, { x: "2021-10-11T00:00:00Z", y: 15177 }, { x: "2021-10-12T00:00:00Z", y: 15210 }, { x: "2021-10-13T00:00:00Z", y: 15241 }, { x: "2021-10-14T00:00:00Z", y: 15289 }, { x: "2021-10-15T00:00:00Z", y: 15317 }, { x: "2021-10-16T00:00:00Z", y: 15348 }, { x: "2021-10-17T00:00:00Z", y: 15375 }, { x: "2021-10-18T00:00:00Z", y: 15418 }, { x: "2021-10-19T00:00:00Z", y: 15447 }, { x: "2021-10-20T00:00:00Z", y: 15485 }, { x: "2021-10-21T00:00:00Z", y: 15519 }, { x: "2021-10-22T00:00:00Z", y: 15555 }, { x: "2021-10-23T00:00:00Z", y: 15598 }, { x: "2021-10-24T00:00:00Z", y: 15628 }, { x: "2021-10-25T00:00:00Z", y: 15682 }, { x: "2021-10-26T00:00:00Z", y: 15707 }, { x: "2021-10-27T00:00:00Z", y: 15770 }, { x: "2021-10-28T00:00:00Z", y: 15801 }, { x: "2021-10-29T00:00:00Z", y: 15856 }, { x: "2021-10-30T00:00:00Z", y: 15894 }, { x: "2021-10-31T00:00:00Z", y: 15938 }, { x: "2021-11-01T00:00:00Z", y: 15990 }, { x: "2021-11-02T00:00:00Z", y: 16050 }, { x: "2021-11-03T00:00:00Z", y: 16109 }, { x: "2021-11-04T00:00:00Z", y: 16151 }, { x: "2021-11-05T00:00:00Z", y: 16200 }, { x: "2021-11-06T00:00:00Z", y: 16243 }, { x: "2021-11-07T00:00:00Z", y: 16295 }, { x: "2021-11-08T00:00:00Z", y: 16361 }, { x: "2021-11-09T00:00:00Z", y: 16414 }, { x: "2021-11-10T00:00:00Z", y: 16493 }, { x: "2021-11-11T00:00:00Z", y: 16560 }, { x: "2021-11-12T00:00:00Z", y: 16616 }, { x: "2021-11-13T00:00:00Z", y: 16686 }] }, { label: "United Kingdom", data: [{ x: "2020-01-22T00:00:00Z", y: 0 }, { x: "2020-01-23T00:00:00Z", y: 0 }, { x: "2020-01-24T00:00:00Z", y: 0 }, { x: "2020-01-25T00:00:00Z", y: 0 }, { x: "2020-01-26T00:00:00Z", y: 0 }, { x: "2020-01-27T00:00:00Z", y: 0 }, { x: "2020-01-28T00:00:00Z", y: 0 }, { x: "2020-01-29T00:00:00Z", y: 0 }, { x: "2020-01-30T00:00:00Z", y: 0 }, { x: "2020-01-31T00:00:00Z", y: 0 }, { x: "2020-02-01T00:00:00Z", y: 0 }, { x: "2020-02-02T00:00:00Z", y: 0 }, { x: "2020-02-03T00:00:00Z", y: 0 }, { x: "2020-02-04T00:00:00Z", y: 0 }, { x: "2020-02-05T00:00:00Z", y: 0 }, { x: "2020-02-06T00:00:00Z", y: 0 }, { x: "2020-02-07T00:00:00Z", y: 0 }, { x: "2020-02-08T00:00:00Z", y: 0 }, { x: "2020-02-09T00:00:00Z", y: 0 }, { x: "2020-02-10T00:00:00Z", y: 0 }, { x: "2020-02-11T00:00:00Z", y: 0 }, { x: "2020-02-12T00:00:00Z", y: 0 }, { x: "2020-02-13T00:00:00Z", y: 0 }, { x: "2020-02-14T00:00:00Z", y: 0 }, { x: "2020-02-15T00:00:00Z", y: 0 }, { x: "2020-02-16T00:00:00Z", y: 0 }, { x: "2020-02-17T00:00:00Z", y: 0 }, { x: "2020-02-18T00:00:00Z", y: 0 }, { x: "2020-02-19T00:00:00Z", y: 0 }, { x: "2020-02-20T00:00:00Z", y: 0 }, { x: "2020-02-21T00:00:00Z", y: 0 }, { x: "2020-02-22T00:00:00Z", y: 0 }, { x: "2020-02-23T00:00:00Z", y: 0 }, { x: "2020-02-24T00:00:00Z", y: 0 }, { x: "2020-02-25T00:00:00Z", y: 0 }, { x: "2020-02-26T00:00:00Z", y: 0 }, { x: "2020-02-27T00:00:00Z", y: 0 }, { x: "2020-02-28T00:00:00Z", y: 0 }, { x: "2020-02-29T00:00:00Z", y: 0 }, { x: "2020-03-01T00:00:00Z", y: 0 }, { x: "2020-03-02T00:00:00Z", y: 0 }, { x: "2020-03-03T00:00:00Z", y: 0 }, { x: "2020-03-04T00:00:00Z", y: 0 }, { x: "2020-03-05T00:00:00Z", y: 0 }, { x: "2020-03-06T00:00:00Z", y: 1 }, { x: "2020-03-07T00:00:00Z", y: 2 }, { x: "2020-03-08T00:00:00Z", y: 2 }, { x: "2020-03-09T00:00:00Z", y: 3 }, { x: "2020-03-10T00:00:00Z", y: 7 }, { x: "2020-03-11T00:00:00Z", y: 7 }, { x: "2020-03-12T00:00:00Z", y: 9 }, { x: "2020-03-13T00:00:00Z", y: 10 }, { x: "2020-03-14T00:00:00Z", y: 29 }, { x: "2020-03-15T00:00:00Z", y: 43 }, { x: "2020-03-16T00:00:00Z", y: 66 }, { x: "2020-03-17T00:00:00Z", y: 83 }, { x: "2020-03-18T00:00:00Z", y: 118 }, { x: "2020-03-19T00:00:00Z", y: 164 }, { x: "2020-03-20T00:00:00Z", y: 196 }, { x: "2020-03-21T00:00:00Z", y: 254 }, { x: "2020-03-22T00:00:00Z", y: 289 }, { x: "2020-03-23T00:00:00Z", y: 365 }, { x: "2020-03-24T00:00:00Z", y: 513 }, { x: "2020-03-25T00:00:00Z", y: 704 }, { x: "2020-03-26T00:00:00Z", y: 886 }, { x: "2020-03-27T00:00:00Z", y: 1174 }, { x: "2020-03-28T00:00:00Z", y: 1466 }, { x: "2020-03-29T00:00:00Z", y: 1679 }, { x: "2020-03-30T00:00:00Z", y: 2053 }, { x: "2020-03-31T00:00:00Z", y: 2457 }, { x: "2020-04-01T00:00:00Z", y: 3130 }, { x: "2020-04-02T00:00:00Z", y: 3787 }, { x: "2020-04-03T00:00:00Z", y: 4524 }, { x: "2020-04-04T00:00:00Z", y: 5281 }, { x: "2020-04-05T00:00:00Z", y: 5882 }, { x: "2020-04-06T00:00:00Z", y: 6452 }, { x: "2020-04-07T00:00:00Z", y: 7557 }, { x: "2020-04-08T00:00:00Z", y: 8589 }, { x: "2020-04-09T00:00:00Z", y: 9706 }, { x: "2020-04-10T00:00:00Z", y: 10829 }, { x: "2020-04-11T00:00:00Z", y: 11673 }, { x: "2020-04-12T00:00:00Z", y: 12330 }, { x: "2020-04-13T00:00:00Z", y: 13055 }, { x: "2020-04-14T00:00:00Z", y: 14135 }, { x: "2020-04-15T00:00:00Z", y: 15019 }, { x: "2020-04-16T00:00:00Z", y: 16059 }, { x: "2020-04-17T00:00:00Z", y: 16973 }, { x: "2020-04-18T00:00:00Z", y: 18081 }, { x: "2020-04-19T00:00:00Z", y: 18514 }, { x: "2020-04-20T00:00:00Z", y: 19090 }, { x: "2020-04-21T00:00:00Z", y: 20314 }, { x: "2020-04-22T00:00:00Z", y: 21171 }, { x: "2020-04-23T00:00:00Z", y: 21855 }, { x: "2020-04-24T00:00:00Z", y: 22873 }, { x: "2020-04-25T00:00:00Z", y: 23689 }, { x: "2020-04-26T00:00:00Z", y: 24053 }, { x: "2020-04-27T00:00:00Z", y: 24376 }, { x: "2020-04-28T00:00:00Z", y: 25347 }, { x: "2020-04-29T00:00:00Z", y: 26118 }, { x: "2020-04-30T00:00:00Z", y: 26754 }, { x: "2020-05-01T00:00:00Z", y: 27454 }, { x: "2020-05-02T00:00:00Z", y: 28039 }, { x: "2020-05-03T00:00:00Z", y: 28292 }, { x: "2020-05-04T00:00:00Z", y: 28565 }, { x: "2020-05-05T00:00:00Z", y: 29290 }, { x: "2020-05-06T00:00:00Z", y: 29937 }, { x: "2020-05-07T00:00:00Z", y: 30395 }, { x: "2020-05-08T00:00:00Z", y: 30975 }, { x: "2020-05-09T00:00:00Z", y: 31250 }, { x: "2020-05-10T00:00:00Z", y: 31467 }, { x: "2020-05-11T00:00:00Z", y: 31655 }, { x: "2020-05-12T00:00:00Z", y: 32270 }, { x: "2020-05-13T00:00:00Z", y: 32718 }, { x: "2020-05-14T00:00:00Z", y: 33071 }, { x: "2020-05-15T00:00:00Z", y: 33422 }, { x: "2020-05-16T00:00:00Z", y: 33833 }, { x: "2020-05-17T00:00:00Z", y: 33900 }, { x: "2020-05-18T00:00:00Z", y: 34046 }, { x: "2020-05-19T00:00:00Z", y: 34547 }, { x: "2020-05-20T00:00:00Z", y: 34876 }, { x: "2020-05-21T00:00:00Z", y: 35149 }, { x: "2020-05-22T00:00:00Z", y: 35440 }, { x: "2020-05-23T00:00:00Z", y: 35660 }, { x: "2020-05-24T00:00:00Z", y: 36039 }, { x: "2020-05-25T00:00:00Z", y: 36143 }, { x: "2020-05-26T00:00:00Z", y: 36274 }, { x: "2020-05-27T00:00:00Z", y: 36696 }, { x: "2020-05-28T00:00:00Z", y: 37039 }, { x: "2020-05-29T00:00:00Z", y: 37313 }, { x: "2020-05-30T00:00:00Z", y: 37467 }, { x: "2020-05-31T00:00:00Z", y: 37527 }, { x: "2020-06-01T00:00:00Z", y: 37613 }, { x: "2020-06-02T00:00:00Z", y: 37863 }, { x: "2020-06-03T00:00:00Z", y: 38117 }, { x: "2020-06-04T00:00:00Z", y: 38247 }, { x: "2020-06-05T00:00:00Z", y: 38505 }, { x: "2020-06-06T00:00:00Z", y: 38648 }, { x: "2020-06-07T00:00:00Z", y: 38702 }, { x: "2020-06-08T00:00:00Z", y: 38749 }, { x: "2020-06-09T00:00:00Z", y: 38946 }, { x: "2020-06-10T00:00:00Z", y: 39110 }, { x: "2020-06-11T00:00:00Z", y: 39186 }, { x: "2020-06-12T00:00:00Z", y: 39317 }, { x: "2020-06-13T00:00:00Z", y: 39424 }, { x: "2020-06-14T00:00:00Z", y: 39451 }, { x: "2020-06-15T00:00:00Z", y: 39480 }, { x: "2020-06-16T00:00:00Z", y: 39600 }, { x: "2020-06-17T00:00:00Z", y: 39710 }, { x: "2020-06-18T00:00:00Z", y: 39777 }, { x: "2020-06-19T00:00:00Z", y: 39861 }, { x: "2020-06-20T00:00:00Z", y: 39932 }, { x: "2020-06-21T00:00:00Z", y: 39963 }, { x: "2020-06-22T00:00:00Z", y: 39976 }, { x: "2020-06-23T00:00:00Z", y: 40070 }, { x: "2020-06-24T00:00:00Z", y: 40157 }, { x: "2020-06-25T00:00:00Z", y: 40256 }, { x: "2020-06-26T00:00:00Z", y: 40333 }, { x: "2020-06-27T00:00:00Z", y: 40373 }, { x: "2020-06-28T00:00:00Z", y: 40404 }, { x: "2020-06-29T00:00:00Z", y: 40425 }, { x: "2020-06-30T00:00:00Z", y: 40479 }, { x: "2020-07-01T00:00:00Z", y: 40576 }, { x: "2020-07-02T00:00:00Z", y: 40617 }, { x: "2020-07-03T00:00:00Z", y: 40666 }, { x: "2020-07-04T00:00:00Z", y: 40698 }, { x: "2020-07-05T00:00:00Z", y: 40717 }, { x: "2020-07-06T00:00:00Z", y: 40728 }, { x: "2020-07-07T00:00:00Z", y: 40782 }, { x: "2020-07-08T00:00:00Z", y: 40839 }, { x: "2020-07-09T00:00:00Z", y: 40870 }, { x: "2020-07-10T00:00:00Z", y: 40904 }, { x: "2020-07-11T00:00:00Z", y: 40921 }, { x: "2020-07-12T00:00:00Z", y: 40930 }, { x: "2020-07-13T00:00:00Z", y: 40940 }, { x: "2020-07-14T00:00:00Z", y: 40984 }, { x: "2020-07-15T00:00:00Z", y: 41010 }, { x: "2020-07-16T00:00:00Z", y: 41034 }, { x: "2020-07-17T00:00:00Z", y: 41060 }, { x: "2020-07-18T00:00:00Z", y: 41069 }, { x: "2020-07-19T00:00:00Z", y: 41080 }, { x: "2020-07-20T00:00:00Z", y: 41090 }, { x: "2020-07-21T00:00:00Z", y: 41115 }, { x: "2020-07-22T00:00:00Z", y: 41132 }, { x: "2020-07-23T00:00:00Z", y: 41141 }, { x: "2020-07-24T00:00:00Z", y: 41173 }, { x: "2020-07-25T00:00:00Z", y: 41188 }, { x: "2020-07-26T00:00:00Z", y: 41196 }, { x: "2020-07-27T00:00:00Z", y: 41199 }, { x: "2020-07-28T00:00:00Z", y: 41220 }, { x: "2020-07-29T00:00:00Z", y: 41254 }, { x: "2020-07-30T00:00:00Z", y: 41254 }, { x: "2020-07-31T00:00:00Z", y: 41274 }, { x: "2020-08-01T00:00:00Z", y: 41287 }, { x: "2020-08-02T00:00:00Z", y: 41292 }, { x: "2020-08-03T00:00:00Z", y: 41293 }, { x: "2020-08-04T00:00:00Z", y: 41311 }, { x: "2020-08-05T00:00:00Z", y: 41325 }, { x: "2020-08-06T00:00:00Z", y: 41343 }, { x: "2020-08-07T00:00:00Z", y: 41355 }, { x: "2020-08-08T00:00:00Z", y: 41358 }, { x: "2020-08-09T00:00:00Z", y: 41363 }, { x: "2020-08-10T00:00:00Z", y: 41381 }, { x: "2020-08-11T00:00:00Z", y: 41394 }, { x: "2020-08-12T00:00:00Z", y: 41414 }, { x: "2020-08-13T00:00:00Z", y: 41432 }, { x: "2020-08-14T00:00:00Z", y: 41443 }, { x: "2020-08-15T00:00:00Z", y: 41446 }, { x: "2020-08-16T00:00:00Z", y: 41451 }, { x: "2020-08-17T00:00:00Z", y: 41454 }, { x: "2020-08-18T00:00:00Z", y: 41466 }, { x: "2020-08-19T00:00:00Z", y: 41483 }, { x: "2020-08-20T00:00:00Z", y: 41489 }, { x: "2020-08-21T00:00:00Z", y: 41491 }, { x: "2020-08-22T00:00:00Z", y: 41509 }, { x: "2020-08-23T00:00:00Z", y: 41515 }, { x: "2020-08-24T00:00:00Z", y: 41519 }, { x: "2020-08-25T00:00:00Z", y: 41535 }, { x: "2020-08-26T00:00:00Z", y: 41552 }, { x: "2020-08-27T00:00:00Z", y: 41564 }, { x: "2020-08-28T00:00:00Z", y: 41573 }, { x: "2020-08-29T00:00:00Z", y: 41585 }, { x: "2020-08-30T00:00:00Z", y: 41586 }, { x: "2020-08-31T00:00:00Z", y: 41589 }, { x: "2020-09-01T00:00:00Z", y: 41592 }, { x: "2020-09-02T00:00:00Z", y: 41602 }, { x: "2020-09-03T00:00:00Z", y: 41616 }, { x: "2020-09-04T00:00:00Z", y: 41626 }, { x: "2020-09-05T00:00:00Z", y: 41638 }, { x: "2020-09-06T00:00:00Z", y: 41640 }, { x: "2020-09-07T00:00:00Z", y: 41643 }, { x: "2020-09-08T00:00:00Z", y: 41675 }, { x: "2020-09-09T00:00:00Z", y: 41683 }, { x: "2020-09-10T00:00:00Z", y: 41697 }, { x: "2020-09-11T00:00:00Z", y: 41703 }, { x: "2020-09-12T00:00:00Z", y: 41712 }, { x: "2020-09-13T00:00:00Z", y: 41717 }, { x: "2020-09-14T00:00:00Z", y: 41726 }, { x: "2020-09-15T00:00:00Z", y: 41753 }, { x: "2020-09-16T00:00:00Z", y: 41773 }, { x: "2020-09-17T00:00:00Z", y: 41794 }, { x: "2020-09-18T00:00:00Z", y: 41821 }, { x: "2020-09-19T00:00:00Z", y: 41848 }, { x: "2020-09-20T00:00:00Z", y: 41866 }, { x: "2020-09-21T00:00:00Z", y: 41877 }, { x: "2020-09-22T00:00:00Z", y: 41914 }, { x: "2020-09-23T00:00:00Z", y: 41951 }, { x: "2020-09-24T00:00:00Z", y: 41991 }, { x: "2020-09-25T00:00:00Z", y: 42025 }, { x: "2020-09-26T00:00:00Z", y: 42060 }, { x: "2020-09-27T00:00:00Z", y: 42077 }, { x: "2020-09-28T00:00:00Z", y: 42090 }, { x: "2020-09-29T00:00:00Z", y: 42162 }, { x: "2020-09-30T00:00:00Z", y: 42233 }, { x: "2020-10-01T00:00:00Z", y: 42292 }, { x: "2020-10-02T00:00:00Z", y: 42358 }, { x: "2020-10-03T00:00:00Z", y: 42407 }, { x: "2020-10-04T00:00:00Z", y: 42440 }, { x: "2020-10-05T00:00:00Z", y: 42459 }, { x: "2020-10-06T00:00:00Z", y: 42535 }, { x: "2020-10-07T00:00:00Z", y: 42605 }, { x: "2020-10-08T00:00:00Z", y: 42682 }, { x: "2020-10-09T00:00:00Z", y: 42769 }, { x: "2020-10-10T00:00:00Z", y: 42850 }, { x: "2020-10-11T00:00:00Z", y: 42915 }, { x: "2020-10-12T00:00:00Z", y: 42965 }, { x: "2020-10-13T00:00:00Z", y: 43108 }, { x: "2020-10-14T00:00:00Z", y: 43245 }, { x: "2020-10-15T00:00:00Z", y: 43383 }, { x: "2020-10-16T00:00:00Z", y: 43519 }, { x: "2020-10-17T00:00:00Z", y: 43669 }, { x: "2020-10-18T00:00:00Z", y: 43736 }, { x: "2020-10-19T00:00:00Z", y: 43816 }, { x: "2020-10-20T00:00:00Z", y: 44057 }, { x: "2020-10-21T00:00:00Z", y: 44248 }, { x: "2020-10-22T00:00:00Z", y: 44437 }, { x: "2020-10-23T00:00:00Z", y: 44661 }, { x: "2020-10-24T00:00:00Z", y: 44835 }, { x: "2020-10-25T00:00:00Z", y: 44986 }, { x: "2020-10-26T00:00:00Z", y: 45088 }, { x: "2020-10-27T00:00:00Z", y: 45455 }, { x: "2020-10-28T00:00:00Z", y: 45765 }, { x: "2020-10-29T00:00:00Z", y: 46045 }, { x: "2020-10-30T00:00:00Z", y: 46319 }, { x: "2020-10-31T00:00:00Z", y: 46645 }, { x: "2020-11-01T00:00:00Z", y: 46807 }, { x: "2020-11-02T00:00:00Z", y: 46943 }, { x: "2020-11-03T00:00:00Z", y: 47340 }, { x: "2020-11-04T00:00:00Z", y: 47832 }, { x: "2020-11-05T00:00:00Z", y: 48210 }, { x: "2020-11-06T00:00:00Z", y: 48565 }, { x: "2020-11-07T00:00:00Z", y: 48978 }, { x: "2020-11-08T00:00:00Z", y: 49134 }, { x: "2020-11-09T00:00:00Z", y: 49329 }, { x: "2020-11-10T00:00:00Z", y: 49861 }, { x: "2020-11-11T00:00:00Z", y: 50457 }, { x: "2020-11-12T00:00:00Z", y: 51020 }, { x: "2020-11-13T00:00:00Z", y: 51396 }, { x: "2020-11-14T00:00:00Z", y: 51858 }, { x: "2020-11-15T00:00:00Z", y: 52026 }, { x: "2020-11-16T00:00:00Z", y: 52240 }, { x: "2020-11-17T00:00:00Z", y: 52839 }, { x: "2020-11-18T00:00:00Z", y: 53368 }, { x: "2020-11-19T00:00:00Z", y: 53870 }, { x: "2020-11-20T00:00:00Z", y: 54381 }, { x: "2020-11-21T00:00:00Z", y: 54721 }, { x: "2020-11-22T00:00:00Z", y: 55120 }, { x: "2020-11-23T00:00:00Z", y: 55327 }, { x: "2020-11-24T00:00:00Z", y: 55935 }, { x: "2020-11-25T00:00:00Z", y: 56630 }, { x: "2020-11-26T00:00:00Z", y: 57128 }, { x: "2020-11-27T00:00:00Z", y: 57648 }, { x: "2020-11-28T00:00:00Z", y: 58127 }, { x: "2020-11-29T00:00:00Z", y: 58342 }, { x: "2020-11-30T00:00:00Z", y: 58545 }, { x: "2020-12-01T00:00:00Z", y: 59148 }, { x: "2020-12-02T00:00:00Z", y: 59796 }, { x: "2020-12-03T00:00:00Z", y: 60210 }, { x: "2020-12-04T00:00:00Z", y: 60714 }, { x: "2020-12-05T00:00:00Z", y: 61111 }, { x: "2020-12-06T00:00:00Z", y: 61342 }, { x: "2020-12-07T00:00:00Z", y: 61531 }, { x: "2020-12-08T00:00:00Z", y: 62130 }, { x: "2020-12-09T00:00:00Z", y: 62663 }, { x: "2020-12-10T00:00:00Z", y: 63179 }, { x: "2020-12-11T00:00:00Z", y: 63603 }, { x: "2020-12-12T00:00:00Z", y: 64123 }, { x: "2020-12-13T00:00:00Z", y: 64267 }, { x: "2020-12-14T00:00:00Z", y: 64500 }, { x: "2020-12-15T00:00:00Z", y: 65006 }, { x: "2020-12-16T00:00:00Z", y: 65618 }, { x: "2020-12-17T00:00:00Z", y: 66150 }, { x: "2020-12-18T00:00:00Z", y: 66640 }, { x: "2020-12-19T00:00:00Z", y: 67177 }, { x: "2020-12-20T00:00:00Z", y: 67503 }, { x: "2020-12-21T00:00:00Z", y: 67718 }, { x: "2020-12-22T00:00:00Z", y: 68409 }, { x: "2020-12-23T00:00:00Z", y: 69157 }, { x: "2020-12-24T00:00:00Z", y: 69732 }, { x: "2020-12-25T00:00:00Z", y: 70302 }, { x: "2020-12-26T00:00:00Z", y: 70513 }, { x: "2020-12-27T00:00:00Z", y: 70860 }, { x: "2020-12-28T00:00:00Z", y: 71217 }, { x: "2020-12-29T00:00:00Z", y: 71675 }, { x: "2020-12-30T00:00:00Z", y: 72657 }, { x: "2020-12-31T00:00:00Z", y: 73622 }, { x: "2021-01-01T00:00:00Z", y: 74237 }, { x: "2021-01-02T00:00:00Z", y: 74682 }, { x: "2021-01-03T00:00:00Z", y: 75137 }, { x: "2021-01-04T00:00:00Z", y: 75547 }, { x: "2021-01-05T00:00:00Z", y: 76428 }, { x: "2021-01-06T00:00:00Z", y: 77470 }, { x: "2021-01-07T00:00:00Z", y: 78632 }, { x: "2021-01-08T00:00:00Z", y: 79965 }, { x: "2021-01-09T00:00:00Z", y: 81e3 }, { x: "2021-01-10T00:00:00Z", y: 81567 }, { x: "2021-01-11T00:00:00Z", y: 82096 }, { x: "2021-01-12T00:00:00Z", y: 83342 }, { x: "2021-01-13T00:00:00Z", y: 84910 }, { x: "2021-01-14T00:00:00Z", y: 86163 }, { x: "2021-01-15T00:00:00Z", y: 87448 }, { x: "2021-01-16T00:00:00Z", y: 88747 }, { x: "2021-01-17T00:00:00Z", y: 89429 }, { x: "2021-01-18T00:00:00Z", y: 90031 }, { x: "2021-01-19T00:00:00Z", y: 91643 }, { x: "2021-01-20T00:00:00Z", y: 93469 }, { x: "2021-01-21T00:00:00Z", y: 94765 }, { x: "2021-01-22T00:00:00Z", y: 96166 }, { x: "2021-01-23T00:00:00Z", y: 97518 }, { x: "2021-01-24T00:00:00Z", y: 98129 }, { x: "2021-01-25T00:00:00Z", y: 98723 }, { x: "2021-01-26T00:00:00Z", y: 100359 }, { x: "2021-01-27T00:00:00Z", y: 102085 }, { x: "2021-01-28T00:00:00Z", y: 103324 }, { x: "2021-01-29T00:00:00Z", y: 104572 }, { x: "2021-01-30T00:00:00Z", y: 105777 }, { x: "2021-01-31T00:00:00Z", y: 106367 }, { x: "2021-02-01T00:00:00Z", y: 106774 }, { x: "2021-02-02T00:00:00Z", y: 108225 }, { x: "2021-02-03T00:00:00Z", y: 109547 }, { x: "2021-02-04T00:00:00Z", y: 110462 }, { x: "2021-02-05T00:00:00Z", y: 111477 }, { x: "2021-02-06T00:00:00Z", y: 112305 }, { x: "2021-02-07T00:00:00Z", y: 112681 }, { x: "2021-02-08T00:00:00Z", y: 113014 }, { x: "2021-02-09T00:00:00Z", y: 114066 }, { x: "2021-02-10T00:00:00Z", y: 115068 }, { x: "2021-02-11T00:00:00Z", y: 115748 }, { x: "2021-02-12T00:00:00Z", y: 116507 }, { x: "2021-02-13T00:00:00Z", y: 117128 }, { x: "2021-02-14T00:00:00Z", y: 117387 }, { x: "2021-02-15T00:00:00Z", y: 117622 }, { x: "2021-02-16T00:00:00Z", y: 118421 }, { x: "2021-02-17T00:00:00Z", y: 119159 }, { x: "2021-02-18T00:00:00Z", y: 119614 }, { x: "2021-02-19T00:00:00Z", y: 120147 }, { x: "2021-02-20T00:00:00Z", y: 120593 }, { x: "2021-02-21T00:00:00Z", y: 120810 }, { x: "2021-02-22T00:00:00Z", y: 120988 }, { x: "2021-02-23T00:00:00Z", y: 121536 }, { x: "2021-02-24T00:00:00Z", y: 121979 }, { x: "2021-02-25T00:00:00Z", y: 122303 }, { x: "2021-02-26T00:00:00Z", y: 122648 }, { x: "2021-02-27T00:00:00Z", y: 122939 }, { x: "2021-02-28T00:00:00Z", y: 123083 }, { x: "2021-03-01T00:00:00Z", y: 123187 }, { x: "2021-03-02T00:00:00Z", y: 123530 }, { x: "2021-03-03T00:00:00Z", y: 124017 }, { x: "2021-03-04T00:00:00Z", y: 124259 }, { x: "2021-03-05T00:00:00Z", y: 124495 }, { x: "2021-03-06T00:00:00Z", y: 124654 }, { x: "2021-03-07T00:00:00Z", y: 124736 }, { x: "2021-03-08T00:00:00Z", y: 124801 }, { x: "2021-03-09T00:00:00Z", y: 125032 }, { x: "2021-03-10T00:00:00Z", y: 125222 }, { x: "2021-03-11T00:00:00Z", y: 125403 }, { x: "2021-03-12T00:00:00Z", y: 125579 }, { x: "2021-03-13T00:00:00Z", y: 125701 }, { x: "2021-03-14T00:00:00Z", y: 125753 }, { x: "2021-03-15T00:00:00Z", y: 125817 }, { x: "2021-03-16T00:00:00Z", y: 125927 }, { x: "2021-03-17T00:00:00Z", y: 126068 }, { x: "2021-03-18T00:00:00Z", y: 126163 }, { x: "2021-03-19T00:00:00Z", y: 126263 }, { x: "2021-03-20T00:00:00Z", y: 126359 }, { x: "2021-03-21T00:00:00Z", y: 126393 }, { x: "2021-03-22T00:00:00Z", y: 126411 }, { x: "2021-03-23T00:00:00Z", y: 126523 }, { x: "2021-03-24T00:00:00Z", y: 126621 }, { x: "2021-03-25T00:00:00Z", y: 126684 }, { x: "2021-03-26T00:00:00Z", y: 126755 }, { x: "2021-03-27T00:00:00Z", y: 126813 }, { x: "2021-03-28T00:00:00Z", y: 126834 }, { x: "2021-03-29T00:00:00Z", y: 126857 }, { x: "2021-03-30T00:00:00Z", y: 126912 }, { x: "2021-03-31T00:00:00Z", y: 126955 }, { x: "2021-04-01T00:00:00Z", y: 127006 }, { x: "2021-04-02T00:00:00Z", y: 127058 }, { x: "2021-04-03T00:00:00Z", y: 127068 }, { x: "2021-04-04T00:00:00Z", y: 127078 }, { x: "2021-04-05T00:00:00Z", y: 127106 }, { x: "2021-04-06T00:00:00Z", y: 127126 }, { x: "2021-04-07T00:00:00Z", y: 127171 }, { x: "2021-04-08T00:00:00Z", y: 127224 }, { x: "2021-04-09T00:00:00Z", y: 127284 }, { x: "2021-04-10T00:00:00Z", y: 127324 }, { x: "2021-04-11T00:00:00Z", y: 127331 }, { x: "2021-04-12T00:00:00Z", y: 127346 }, { x: "2021-04-13T00:00:00Z", y: 127369 }, { x: "2021-04-14T00:00:00Z", y: 127407 }, { x: "2021-04-15T00:00:00Z", y: 127438 }, { x: "2021-04-16T00:00:00Z", y: 127472 }, { x: "2021-04-17T00:00:00Z", y: 127508 }, { x: "2021-04-18T00:00:00Z", y: 127518 }, { x: "2021-04-19T00:00:00Z", y: 127524 }, { x: "2021-04-20T00:00:00Z", y: 127557 }, { x: "2021-04-21T00:00:00Z", y: 127577 }, { x: "2021-04-22T00:00:00Z", y: 127597 }, { x: "2021-04-23T00:00:00Z", y: 127638 }, { x: "2021-04-24T00:00:00Z", y: 127670 }, { x: "2021-04-25T00:00:00Z", y: 127681 }, { x: "2021-04-26T00:00:00Z", y: 127688 }, { x: "2021-04-27T00:00:00Z", y: 127705 }, { x: "2021-04-28T00:00:00Z", y: 127734 }, { x: "2021-04-29T00:00:00Z", y: 127759 }, { x: "2021-04-30T00:00:00Z", y: 127775 }, { x: "2021-05-01T00:00:00Z", y: 127782 }, { x: "2021-05-02T00:00:00Z", y: 127796 }, { x: "2021-05-03T00:00:00Z", y: 127797 }, { x: "2021-05-04T00:00:00Z", y: 127803 }, { x: "2021-05-05T00:00:00Z", y: 127830 }, { x: "2021-05-06T00:00:00Z", y: 127843 }, { x: "2021-05-07T00:00:00Z", y: 127858 }, { x: "2021-05-08T00:00:00Z", y: 127863 }, { x: "2021-05-09T00:00:00Z", y: 127865 }, { x: "2021-05-10T00:00:00Z", y: 127870 }, { x: "2021-05-11T00:00:00Z", y: 127890 }, { x: "2021-05-12T00:00:00Z", y: 127901 }, { x: "2021-05-13T00:00:00Z", y: 127912 }, { x: "2021-05-14T00:00:00Z", y: 127930 }, { x: "2021-05-15T00:00:00Z", y: 127937 }, { x: "2021-05-16T00:00:00Z", y: 127941 }, { x: "2021-05-17T00:00:00Z", y: 127946 }, { x: "2021-05-18T00:00:00Z", y: 127953 }, { x: "2021-05-19T00:00:00Z", y: 127956 }, { x: "2021-05-20T00:00:00Z", y: 127963 }, { x: "2021-05-21T00:00:00Z", y: 127972 }, { x: "2021-05-22T00:00:00Z", y: 127978 }, { x: "2021-05-23T00:00:00Z", y: 127983 }, { x: "2021-05-24T00:00:00Z", y: 127986 }, { x: "2021-05-25T00:00:00Z", y: 128001 }, { x: "2021-05-26T00:00:00Z", y: 128010 }, { x: "2021-05-27T00:00:00Z", y: 128020 }, { x: "2021-05-28T00:00:00Z", y: 128030 }, { x: "2021-05-29T00:00:00Z", y: 128037 }, { x: "2021-05-30T00:00:00Z", y: 128043 }, { x: "2021-05-31T00:00:00Z", y: 128045 }, { x: "2021-06-01T00:00:00Z", y: 128045 }, { x: "2021-06-02T00:00:00Z", y: 128057 }, { x: "2021-06-03T00:00:00Z", y: 128075 }, { x: "2021-06-04T00:00:00Z", y: 128086 }, { x: "2021-06-05T00:00:00Z", y: 128099 }, { x: "2021-06-06T00:00:00Z", y: 128103 }, { x: "2021-06-07T00:00:00Z", y: 128104 }, { x: "2021-06-08T00:00:00Z", y: 128118 }, { x: "2021-06-09T00:00:00Z", y: 128124 }, { x: "2021-06-10T00:00:00Z", y: 128131 }, { x: "2021-06-11T00:00:00Z", y: 128148 }, { x: "2021-06-12T00:00:00Z", y: 128160 }, { x: "2021-06-13T00:00:00Z", y: 128168 }, { x: "2021-06-14T00:00:00Z", y: 128171 }, { x: "2021-06-15T00:00:00Z", y: 128181 }, { x: "2021-06-16T00:00:00Z", y: 128190 }, { x: "2021-06-17T00:00:00Z", y: 128209 }, { x: "2021-06-18T00:00:00Z", y: 128220 }, { x: "2021-06-19T00:00:00Z", y: 128234 }, { x: "2021-06-20T00:00:00Z", y: 128240 }, { x: "2021-06-21T00:00:00Z", y: 128245 }, { x: "2021-06-22T00:00:00Z", y: 128272 }, { x: "2021-06-23T00:00:00Z", y: 128291 }, { x: "2021-06-24T00:00:00Z", y: 128312 }, { x: "2021-06-25T00:00:00Z", y: 128330 }, { x: "2021-06-26T00:00:00Z", y: 128353 }, { x: "2021-06-27T00:00:00Z", y: 128364 }, { x: "2021-06-28T00:00:00Z", y: 128367 }, { x: "2021-06-29T00:00:00Z", y: 128390 }, { x: "2021-06-30T00:00:00Z", y: 128404 }, { x: "2021-07-01T00:00:00Z", y: 128426 }, { x: "2021-07-02T00:00:00Z", y: 128453 }, { x: "2021-07-03T00:00:00Z", y: 128471 }, { x: "2021-07-04T00:00:00Z", y: 128486 }, { x: "2021-07-05T00:00:00Z", y: 128495 }, { x: "2021-07-06T00:00:00Z", y: 128532 }, { x: "2021-07-07T00:00:00Z", y: 128565 }, { x: "2021-07-08T00:00:00Z", y: 128601 }, { x: "2021-07-09T00:00:00Z", y: 128631 }, { x: "2021-07-10T00:00:00Z", y: 128665 }, { x: "2021-07-11T00:00:00Z", y: 128691 }, { x: "2021-07-12T00:00:00Z", y: 128697 }, { x: "2021-07-13T00:00:00Z", y: 128747 }, { x: "2021-07-14T00:00:00Z", y: 128797 }, { x: "2021-07-15T00:00:00Z", y: 128864 }, { x: "2021-07-16T00:00:00Z", y: 128913 }, { x: "2021-07-17T00:00:00Z", y: 128960 }, { x: "2021-07-18T00:00:00Z", y: 128988 }, { x: "2021-07-19T00:00:00Z", y: 129007 }, { x: "2021-07-20T00:00:00Z", y: 129109 }, { x: "2021-07-21T00:00:00Z", y: 129182 }, { x: "2021-07-22T00:00:00Z", y: 129266 }, { x: "2021-07-23T00:00:00Z", y: 129330 }, { x: "2021-07-24T00:00:00Z", y: 129418 }, { x: "2021-07-25T00:00:00Z", y: 129446 }, { x: "2021-07-26T00:00:00Z", y: 129460 }, { x: "2021-07-27T00:00:00Z", y: 129591 }, { x: "2021-07-28T00:00:00Z", y: 129718 }, { x: "2021-07-29T00:00:00Z", y: 129809 }, { x: "2021-07-30T00:00:00Z", y: 129877 }, { x: "2021-07-31T00:00:00Z", y: 129949 }, { x: "2021-08-01T00:00:00Z", y: 130014 }, { x: "2021-08-02T00:00:00Z", y: 130039 }, { x: "2021-08-03T00:00:00Z", y: 130179 }, { x: "2021-08-04T00:00:00Z", y: 130300 }, { x: "2021-08-05T00:00:00Z", y: 130390 }, { x: "2021-08-06T00:00:00Z", y: 130482 }, { x: "2021-08-07T00:00:00Z", y: 130585 }, { x: "2021-08-08T00:00:00Z", y: 130630 }, { x: "2021-08-09T00:00:00Z", y: 130667 }, { x: "2021-08-10T00:00:00Z", y: 130813 }, { x: "2021-08-11T00:00:00Z", y: 130921 }, { x: "2021-08-12T00:00:00Z", y: 131016 }, { x: "2021-08-13T00:00:00Z", y: 131116 }, { x: "2021-08-14T00:00:00Z", y: 131210 }, { x: "2021-08-15T00:00:00Z", y: 131269 }, { x: "2021-08-16T00:00:00Z", y: 131296 }, { x: "2021-08-17T00:00:00Z", y: 131466 }, { x: "2021-08-18T00:00:00Z", y: 131577 }, { x: "2021-08-19T00:00:00Z", y: 131691 }, { x: "2021-08-20T00:00:00Z", y: 131805 }, { x: "2021-08-21T00:00:00Z", y: 131909 }, { x: "2021-08-22T00:00:00Z", y: 131958 }, { x: "2021-08-23T00:00:00Z", y: 132e3 }, { x: "2021-08-24T00:00:00Z", y: 132174 }, { x: "2021-08-25T00:00:00Z", y: 132323 }, { x: "2021-08-26T00:00:00Z", y: 132465 }, { x: "2021-08-27T00:00:00Z", y: 132566 }, { x: "2021-08-28T00:00:00Z", y: 132699 }, { x: "2021-08-29T00:00:00Z", y: 132760 }, { x: "2021-08-30T00:00:00Z", y: 132808 }, { x: "2021-08-31T00:00:00Z", y: 132859 }, { x: "2021-09-01T00:00:00Z", y: 133066 }, { x: "2021-09-02T00:00:00Z", y: 133244 }, { x: "2021-09-03T00:00:00Z", y: 133365 }, { x: "2021-09-04T00:00:00Z", y: 133485 }, { x: "2021-09-05T00:00:00Z", y: 133553 }, { x: "2021-09-06T00:00:00Z", y: 133598 }, { x: "2021-09-07T00:00:00Z", y: 133808 }, { x: "2021-09-08T00:00:00Z", y: 133999 }, { x: "2021-09-09T00:00:00Z", y: 134166 }, { x: "2021-09-10T00:00:00Z", y: 134313 }, { x: "2021-09-11T00:00:00Z", y: 134469 }, { x: "2021-09-12T00:00:00Z", y: 134525 }, { x: "2021-09-13T00:00:00Z", y: 134587 }, { x: "2021-09-14T00:00:00Z", y: 134774 }, { x: "2021-09-15T00:00:00Z", y: 134975 }, { x: "2021-09-16T00:00:00Z", y: 135134 }, { x: "2021-09-17T00:00:00Z", y: 135314 }, { x: "2021-09-18T00:00:00Z", y: 135478 }, { x: "2021-09-19T00:00:00Z", y: 135539 }, { x: "2021-09-20T00:00:00Z", y: 135589 }, { x: "2021-09-21T00:00:00Z", y: 135793 }, { x: "2021-09-22T00:00:00Z", y: 135961 }, { x: "2021-09-23T00:00:00Z", y: 136156 }, { x: "2021-09-24T00:00:00Z", y: 136336 }, { x: "2021-09-25T00:00:00Z", y: 136465 }, { x: "2021-09-26T00:00:00Z", y: 136529 }, { x: "2021-09-27T00:00:00Z", y: 136569 }, { x: "2021-09-28T00:00:00Z", y: 136746 }, { x: "2021-09-29T00:00:00Z", y: 136906 }, { x: "2021-09-30T00:00:00Z", y: 137043 }, { x: "2021-10-01T00:00:00Z", y: 137171 }, { x: "2021-10-02T00:00:00Z", y: 137295 }, { x: "2021-10-03T00:00:00Z", y: 137338 }, { x: "2021-10-04T00:00:00Z", y: 137378 }, { x: "2021-10-05T00:00:00Z", y: 137544 }, { x: "2021-10-06T00:00:00Z", y: 137694 }, { x: "2021-10-07T00:00:00Z", y: 137818 }, { x: "2021-10-08T00:00:00Z", y: 137945 }, { x: "2021-10-09T00:00:00Z", y: 138101 }, { x: "2021-10-10T00:00:00Z", y: 138139 }, { x: "2021-10-11T00:00:00Z", y: 138167 }, { x: "2021-10-12T00:00:00Z", y: 138351 }, { x: "2021-10-13T00:00:00Z", y: 138487 }, { x: "2021-10-14T00:00:00Z", y: 138647 }, { x: "2021-10-15T00:00:00Z", y: 138792 }, { x: "2021-10-16T00:00:00Z", y: 138940 }, { x: "2021-10-17T00:00:00Z", y: 138997 }, { x: "2021-10-18T00:00:00Z", y: 139042 }, { x: "2021-10-19T00:00:00Z", y: 139265 }, { x: "2021-10-20T00:00:00Z", y: 139444 }, { x: "2021-10-21T00:00:00Z", y: 139562 }, { x: "2021-10-22T00:00:00Z", y: 139743 }, { x: "2021-10-23T00:00:00Z", y: 139878 }, { x: "2021-10-24T00:00:00Z", y: 139950 }, { x: "2021-10-25T00:00:00Z", y: 139990 }, { x: "2021-10-26T00:00:00Z", y: 140253 }, { x: "2021-10-27T00:00:00Z", y: 140462 }, { x: "2021-10-28T00:00:00Z", y: 140628 }, { x: "2021-10-29T00:00:00Z", y: 140815 }, { x: "2021-10-30T00:00:00Z", y: 140981 }, { x: "2021-10-31T00:00:00Z", y: 141055 }, { x: "2021-11-01T00:00:00Z", y: 141098 }, { x: "2021-11-02T00:00:00Z", y: 141390 }, { x: "2021-11-03T00:00:00Z", y: 141607 }, { x: "2021-11-04T00:00:00Z", y: 141826 }, { x: "2021-11-05T00:00:00Z", y: 142019 }, { x: "2021-11-06T00:00:00Z", y: 142174 }, { x: "2021-11-07T00:00:00Z", y: 142236 }, { x: "2021-11-08T00:00:00Z", y: 142293 }, { x: "2021-11-09T00:00:00Z", y: 142556 }, { x: "2021-11-10T00:00:00Z", y: 142772 }, { x: "2021-11-11T00:00:00Z", y: 142971 }, { x: "2021-11-12T00:00:00Z", y: 143116 }, { x: "2021-11-13T00:00:00Z", y: 143274 }] }];

  // js/app.js
  Chart.register(...registerables);
  var ctx = document.getElementById("chart-cases").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      datasets: results_default
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            displayFormats: {
              hour: "YYYY MMM dd HH:mm"
            }
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          mode: "nearest",
          intersect: true,
          callbacks: {
            title: tooltipTitle
          }
        }
      }
    }
  });
  function tooltipTitle(tooltipItems) {
    return format(new Date(tooltipItems[0].raw.x), "yyyy-MM-dd");
  }
})();
/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */
/*!
 * Chart.js v3.6.0
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
/*!
 * chartjs-adapter-date-fns v2.0.0
 * https://www.chartjs.org
 * (c) 2021 chartjs-adapter-date-fns Contributors
 * Released under the MIT license
 */
