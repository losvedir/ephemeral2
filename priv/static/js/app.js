(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
"use strict";

!(function () {
  "use strict";var e = "undefined" != typeof window ? window : global;if ("function" != typeof e.require) {
    var t = {},
        n = {},
        i = function i(e, t) {
      return ({}).hasOwnProperty.call(e, t);
    },
        r = (function (_r) {
      var _rWrapper = function r(_x, _x2) {
        return _r.apply(this, arguments);
      };

      _rWrapper.toString = function () {
        return _r.toString();
      };

      return _rWrapper;
    })(function (e, t) {
      var n,
          i,
          r = [];n = /^\.\.?(\/|$)/.test(t) ? [e, t].join("/").split("/") : t.split("/");for (var o = 0, s = n.length; s > o; o++) i = n[o], ".." === i ? r.pop() : "." !== i && "" !== i && r.push(i);return r.join("/");
    }),
        o = function o(e) {
      return e.split("/").slice(0, -1).join("/");
    },
        s = function s(t) {
      return function (n) {
        var i = o(t),
            s = r(i, n);return e.require(s, t);
      };
    },
        a = function a(e, t) {
      var i = { id: e, exports: {} };return (n[e] = i, t(i.exports, s(e), i), i.exports);
    },
        c = (function (_c) {
      var _cWrapper = function c(_x, _x2) {
        return _c.apply(this, arguments);
      };

      _cWrapper.toString = function () {
        return _c.toString();
      };

      return _cWrapper;
    })(function (e, o) {
      var s = r(e, ".");if ((null == o && (o = "/"), i(n, s))) return n[s].exports;if (i(t, s)) return a(s, t[s]);var c = r(s, "./index");if (i(n, c)) return n[c].exports;if (i(t, c)) return a(c, t[c]);throw new Error("Cannot find module \"" + e + "\" from \"" + o + "\"");
    }),
        l = function l(e, n) {
      if ("object" == typeof e) for (var r in e) i(e, r) && (t[r] = e[r]);else t[e] = n;
    },
        u = function u() {
      var e = [];for (var n in t) i(t, n) && e.push(n);return e;
    };e.require = c, e.require.define = l, e.require.register = l, e.require.list = u, e.require.brunch = !0;
  }
})(), require.define({ phoenix: function phoenix(e) {
    "use strict";var t = (function (_t) {
      var _tWrapper = function t(_x, _x2, _x3) {
        return _t.apply(this, arguments);
      };

      _tWrapper.toString = function () {
        return _t.toString();
      };

      return _tWrapper;
    })(function (e, t, n) {
      t && Object.defineProperties(e, t), n && Object.defineProperties(e.prototype, n);
    }),
        n = function n(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    },
        i = { connecting: 0, open: 1, closing: 2, closed: 3 },
        r = e.Channel = (function () {
      function e(t, i, r, o) {
        n(this, e), this.topic = t, this.message = i, this.callback = r, this.socket = o, this.bindings = null, this.reset();
      }return (t(e, null, { reset: { value: function value() {
            this.bindings = [];
          }, writable: !0, configurable: !0 }, on: { value: function value(e, t) {
            this.bindings.push({ event: e, callback: t });
          }, writable: !0, configurable: !0 }, isMember: { value: function value(e) {
            return this.topic === e;
          }, writable: !0, configurable: !0 }, off: { value: function value(e) {
            this.bindings = this.bindings.filter(function (t) {
              return t.event !== e;
            });
          }, writable: !0, configurable: !0 }, trigger: { value: function value(e, t) {
            this.bindings.filter(function (t) {
              return t.event === e;
            }).map(function (e) {
              return e.callback(t);
            });
          }, writable: !0, configurable: !0 }, send: { value: function value(e, t) {
            this.socket.send({ topic: this.topic, event: e, payload: t });
          }, writable: !0, configurable: !0 }, leave: { value: function value() {
            var e = void 0 === arguments[0] ? {} : arguments[0];this.socket.leave(this.topic, e), this.reset();
          }, writable: !0, configurable: !0 } }), e);
    })(),
        o = (e.Socket = (function () {
      function e(t) {
        var r = void 0 === arguments[1] ? {} : arguments[1];n(this, e), this.states = i, this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.flushEveryMs = 50, this.reconnectTimer = null, this.reconnectAfterMs = 5000, this.heartbeatIntervalMs = 30000, this.channels = [], this.sendBuffer = [], this.transport = r.transport || WebSocket || o, this.heartbeatIntervalMs = r.heartbeatIntervalMs || this.heartbeatIntervalMs, this.logger = r.logger || function () {}, this.endPoint = this.expandEndpoint(t), this.resetBufferTimer(), this.reconnect();
      }return (t(e, null, { protocol: { value: function value() {
            return location.protocol.match(/^https/) ? "wss" : "ws";
          }, writable: !0, configurable: !0 }, expandEndpoint: { value: function value(e) {
            return "/" !== e.charAt(0) ? e : "/" === e.charAt(1) ? "" + this.protocol() + ":" + e : "" + this.protocol() + "://" + location.host + e;
          }, writable: !0, configurable: !0 }, close: { value: function value(e, t, n) {
            this.conn && (this.conn.onclose = function () {}, t ? this.conn.close(t, n || "") : this.conn.close(), this.conn = null), e && e();
          }, writable: !0, configurable: !0 }, reconnect: { value: function value() {
            var e = this;this.close(function () {
              e.conn = new e.transport(e.endPoint), e.conn.onopen = function () {
                return e.onConnOpen();
              }, e.conn.onerror = function (t) {
                return e.onConnError(t);
              }, e.conn.onmessage = function (t) {
                return e.onConnMessage(t);
              }, e.conn.onclose = function (t) {
                return e.onConnClose(t);
              };
            });
          }, writable: !0, configurable: !0 }, resetBufferTimer: { value: function value() {
            var e = this;clearTimeout(this.sendBufferTimer), this.sendBufferTimer = setTimeout(function () {
              return e.flushSendBuffer();
            }, this.flushEveryMs);
          }, writable: !0, configurable: !0 }, log: { value: function value(e) {
            this.logger(e);
          }, writable: !0, configurable: !0 }, onOpen: { value: function value(e) {
            this.stateChangeCallbacks.open.push(e);
          }, writable: !0, configurable: !0 }, onClose: { value: function value(e) {
            this.stateChangeCallbacks.close.push(e);
          }, writable: !0, configurable: !0 }, onError: { value: function value(e) {
            this.stateChangeCallbacks.error.push(e);
          }, writable: !0, configurable: !0 }, onMessage: { value: function value(e) {
            this.stateChangeCallbacks.message.push(e);
          }, writable: !0, configurable: !0 }, onConnOpen: { value: function value() {
            var e = this;clearInterval(this.reconnectTimer), this.transport.skipHeartbeat || (this.heartbeatTimer = setInterval(function () {
              return e.sendHeartbeat();
            }, this.heartbeatIntervalMs)), this.rejoinAll(), this.stateChangeCallbacks.open.forEach(function (e) {
              return e();
            });
          }, writable: !0, configurable: !0 }, onConnClose: { value: function value(e) {
            var t = this;this.log("WS close:"), this.log(e), clearInterval(this.reconnectTimer), clearInterval(this.heartbeatTimer), this.reconnectTimer = setInterval(function () {
              return t.reconnect();
            }, this.reconnectAfterMs), this.stateChangeCallbacks.close.forEach(function (t) {
              return t(e);
            });
          }, writable: !0, configurable: !0 }, onConnError: { value: function value(e) {
            this.log("WS error:"), this.log(e), this.stateChangeCallbacks.error.forEach(function (t) {
              return t(e);
            });
          }, writable: !0, configurable: !0 }, connectionState: { value: function value() {
            switch (this.conn && this.conn.readyState) {case this.states.connecting:
                return "connecting";case this.states.open:
                return "open";case this.states.closing:
                return "closing";default:
                return "closed";}
          }, writable: !0, configurable: !0 }, isConnected: { value: function value() {
            return "open" === this.connectionState();
          }, writable: !0, configurable: !0 }, rejoinAll: { value: function value() {
            var e = this;this.channels.forEach(function (t) {
              return e.rejoin(t);
            });
          }, writable: !0, configurable: !0 }, rejoin: { value: function value(e) {
            e.reset(), this.send({ topic: e.topic, event: "join", payload: e.message }), e.callback(e);
          }, writable: !0, configurable: !0 }, join: { value: function value(e, t, n) {
            var i = new r(e, t, n, this);this.channels.push(i), this.isConnected() && this.rejoin(i);
          }, writable: !0, configurable: !0 }, leave: { value: function value(e) {
            var t = void 0 === arguments[1] ? {} : arguments[1];this.send({ topic: e, event: "leave", payload: t }), this.channels = this.channels.filter(function (t) {
              return !t.isMember(e);
            });
          }, writable: !0, configurable: !0 }, send: { value: function value(e) {
            var t = this,
                n = function n() {
              return t.conn.send(JSON.stringify(e));
            };this.isConnected() ? n() : this.sendBuffer.push(n);
          }, writable: !0, configurable: !0 }, sendHeartbeat: { value: function value() {
            this.send({ topic: "phoenix", event: "heartbeat", payload: {} });
          }, writable: !0, configurable: !0 }, flushSendBuffer: { value: function value() {
            this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach(function (e) {
              return e();
            }), this.sendBuffer = []), this.resetBufferTimer();
          }, writable: !0, configurable: !0 }, onConnMessage: { value: function value(e) {
            this.log("message received:"), this.log(e);var t = JSON.parse(e.data),
                n = t.topic,
                i = t.event,
                r = t.payload;this.channels.filter(function (e) {
              return e.isMember(n);
            }).forEach(function (e) {
              return e.trigger(i, r);
            }), this.stateChangeCallbacks.message.forEach(function (e) {
              e(n, i, r);
            });
          }, writable: !0, configurable: !0 } }), e);
    })(), e.LongPoller = (function () {
      function e(t) {
        n(this, e), this.retryInMs = 5000, this.endPoint = null, this.token = null, this.sig = null, this.skipHeartbeat = !0, this.onopen = function () {}, this.onerror = function () {}, this.onmessage = function () {}, this.onclose = function () {}, this.states = i, this.upgradeEndpoint = this.normalizeEndpoint(t), this.pollEndpoint = this.upgradeEndpoint + (/\/$/.test(t) ? "poll" : "/poll"), this.readyState = this.states.connecting, this.poll();
      }return (t(e, null, { normalizeEndpoint: { value: function value(e) {
            return e.replace("ws://", "http://").replace("wss://", "https://");
          }, writable: !0, configurable: !0 }, endpointURL: { value: function value() {
            return this.pollEndpoint + ("?token=" + encodeURIComponent(this.token) + "&sig=" + encodeURIComponent(this.sig));
          }, writable: !0, configurable: !0 }, closeAndRetry: { value: function value() {
            this.close(), this.readyState = this.states.connecting;
          }, writable: !0, configurable: !0 }, ontimeout: { value: function value() {
            this.onerror("timeout"), this.closeAndRetry();
          }, writable: !0, configurable: !0 }, poll: { value: function value() {
            var e = this;(this.readyState === this.states.open || this.readyState === this.states.connecting) && s.request("GET", this.endpointURL(), "application/json", null, this.ontimeout.bind(this), function (t, n) {
              if (n && "" !== n) {
                var i = JSON.parse(n),
                    r = i.token,
                    o = i.sig,
                    s = i.messages;e.token = r, e.sig = o;
              }switch (t) {case 200:
                  s.forEach(function (t) {
                    return e.onmessage({ data: JSON.stringify(t) });
                  }), e.poll();break;case 204:
                  e.poll();break;case 410:
                  e.readyState = e.states.open, e.onopen(), e.poll();break;case 0:case 500:
                  e.onerror(), e.closeAndRetry();break;default:
                  throw "unhandled poll status " + t;}
            });
          }, writable: !0, configurable: !0 }, send: { value: function value(e) {
            var t = this;s.request("POST", this.endpointURL(), "application/json", e, this.onerror.bind(this, "timeout"), function (e) {
              200 !== e && t.onerror(e);
            });
          }, writable: !0, configurable: !0 }, close: { value: function value() {
            this.readyState = this.states.closed, this.onclose();
          }, writable: !0, configurable: !0 } }), e);
    })()),
        s = e.Ajax = { states: { complete: 4 }, request: function request(e, t, n, i, r, o) {
        var s = this,
            a = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");a.open(e, t, !0), a.setRequestHeader("Content-type", n), a.onerror = function () {
          o && o(500, null);
        }, a.onreadystatechange = function () {
          a.readyState === s.states.complete && o && o(a.status, a.responseText);
        }, r && (a.ontimeout = r), a.send(i);
      } };Object.defineProperty(e, "__esModule", { value: !0 });
  } }), "object" != typeof window || window.Phoenix || (window.Phoenix = require("phoenix"));"use strict";

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/
function SHA256(s) {

    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
    }

    function S(X, n) {
        return X >>> n | X << 32 - n;
    }
    function R(X, n) {
        return X >>> n;
    }
    function Ch(x, y, z) {
        return x & y ^ ~x & z;
    }
    function Maj(x, y, z) {
        return x & y ^ x & z ^ y & z;
    }
    function Sigma0256(x) {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22);
    }
    function Sigma1256(x) {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25);
    }
    function Gamma0256(x) {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3);
    }
    function Gamma1256(x) {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10);
    }

    function core_sha256(m, l) {
        var K = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298);
        var HASH = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 128 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (var j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }

        return utftext;
    }

    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 15);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};require.register("web/static/js/app", function(exports, require, module) {
"use strict";

var Socket = require("phoenix").Socket;

// let socket = new Socket("/ws")
// socket.join("topic:subtopic", {}, chan => {
// })

var s;
var hash;
var content;
var counter = document.getElementById("visitor-count");
var visitorCount = 0;

function haveContent(socket, hash, content) {
  socket.join("have:" + hash, {}, function (chan) {
    chan.on("CONTENT_REQUEST", function (_msg) {
      chan.send("CONTENT", { content: content, hash: hash });
    });
    chan.on("VISITORS", function (msg) {
      counter.innerHTML = msg.count;
    });
    chan.send("VISITOR_REQUEST", {}, function () {});
  });
}

function wantContent(socket, hash, elem) {
  socket.join("want:" + hash, {}, function (chan) {
    chan.on("CONTENT", function (msg) {
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });
    chan.send("CONTENT_REQUEST", { hash: hash });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var elem1 = document.getElementById("create-new-page");
  var elem2 = document.getElementById("content-goes-here");

  s = new Socket("/ws");

  if (elem1) {
    elem1.addEventListener("click", function () {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(s, hash, content);
    });
  } else if (elem2) {
    setTimeout(function () {
      wantContent(s, window.location.pathname.substr(1), elem2);
    }, 2000);
  }
});

var App = {};

module.exports = App;});

;
//# sourceMappingURL=app.js.map