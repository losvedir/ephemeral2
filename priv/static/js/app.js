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

(function () {
  "use strict";

  var globals = typeof window !== "undefined" ? window : global;
  if (typeof globals.require === "function") return;

  var modules = {};
  var cache = {};

  var has = function has(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function expand(root, name) {
    var results = [],
        parts,
        part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join("/").split("/");
    } else {
      parts = name.split("/");
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === "..") {
        results.pop();
      } else if (part !== "." && part !== "") {
        results.push(part);
      }
    }
    return results.join("/");
  };

  var dirname = function dirname(path) {
    return path.split("/").slice(0, -1).join("/");
  };

  var localRequire = function localRequire(path) {
    return function (name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function initModule(name, definition) {
    var module = { id: name, exports: {} };
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function require(name, loaderPath) {
    var path = expand(name, ".");
    if (loaderPath == null) loaderPath = "/";

    if (has(cache, path)) {
      return cache[path].exports;
    }if (has(modules, path)) {
      return initModule(path, modules[path]);
    }var dirIndex = expand(path, "./index");
    if (has(cache, dirIndex)) {
      return cache[dirIndex].exports;
    }if (has(modules, dirIndex)) {
      return initModule(dirIndex, modules[dirIndex]);
    }throw new Error("Cannot find module \"" + name + "\" from " + "\"" + loaderPath + "\"");
  };

  var define = function define(bundle, fn) {
    if (typeof bundle === "object") {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function list() {
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
require.define({ phoenix: function (exports, require, module) {
    "use strict";

    var _classCallCheck = function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
    var CHANNEL_EVENTS = {
      close: "phx_close",
      error: "phx_error",
      join: "phx_join",
      reply: "phx_reply",
      leave: "phx_leave"
    };

    var Push = (function () {

      // Initializes the Push
      //
      // chan - The Channel
      // event - The event, ie `"phx_join"`
      // payload - The payload, ie `{user_id: 123}`
      // mergePush - The optional `Push` to merge hooks from

      function Push(chan, event, payload, mergePush) {
        var _this = this;

        _classCallCheck(this, Push);

        this.chan = chan;
        this.event = event;
        this.payload = payload || {};
        this.receivedResp = null;
        this.afterHooks = [];
        this.recHooks = {};
        this.sent = false;
        if (mergePush) {
          mergePush.afterHooks.forEach(function (hook) {
            return _this.after(hook.ms, hook.callback);
          });
          for (var status in mergePush.recHooks) {
            if (mergePush.recHooks.hasOwnProperty(status)) {
              this.receive(status, mergePush.recHooks[status]);
            }
          }
        }
      }

      Push.prototype.send = function send() {
        var _this = this;

        var ref = this.chan.socket.makeRef();
        var refEvent = this.chan.replyEventName(ref);

        this.chan.on(refEvent, function (payload) {
          _this.receivedResp = payload;
          _this.matchReceive(payload);
          _this.chan.off(refEvent);
          _this.cancelAfters();
        });

        this.startAfters();
        this.sent = true;
        this.chan.socket.push({
          topic: this.chan.topic,
          event: this.event,
          payload: this.payload,
          ref: ref
        });
      };

      Push.prototype.receive = function receive(status, callback) {
        if (this.receivedResp && this.receivedResp.status === status) {
          callback(this.receivedResp.response);
        }
        this.recHooks[status] = callback;
        return this;
      };

      Push.prototype.after = function after(ms, callback) {
        var timer = null;
        if (this.sent) {
          timer = setTimeout(callback, ms);
        }
        this.afterHooks.push({ ms: ms, callback: callback, timer: timer });
        return this;
      };

      // private

      Push.prototype.matchReceive = function matchReceive(_ref) {
        var status = _ref.status;
        var response = _ref.response;
        var ref = _ref.ref;

        var callback = this.recHooks[status];
        if (!callback) {
          return;
        }

        if (this.event === CHANNEL_EVENTS.join) {
          callback(this.chan);
        } else {
          callback(response);
        }
      };

      Push.prototype.cancelAfters = function cancelAfters() {
        this.afterHooks.forEach(function (hook) {
          clearTimeout(hook.timer);
          hook.timer = null;
        });
      };

      Push.prototype.startAfters = function startAfters() {
        this.afterHooks.map(function (hook) {
          if (!hook.timer) {
            hook.timer = setTimeout(function () {
              return hook.callback();
            }, hook.ms);
          }
        });
      };

      return Push;
    })();

    var Channel = exports.Channel = (function () {
      function Channel(topic, message, callback, socket) {
        _classCallCheck(this, Channel);

        this.topic = topic;
        this.message = message;
        this.callback = callback;
        this.socket = socket;
        this.bindings = [];
        this.afterHooks = [];
        this.recHooks = {};
        this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.message);

        this.reset();
      }

      Channel.prototype.after = function after(ms, callback) {
        this.joinPush.after(ms, callback);
        return this;
      };

      Channel.prototype.receive = function receive(status, callback) {
        this.joinPush.receive(status, callback);
        return this;
      };

      Channel.prototype.rejoin = function rejoin() {
        this.reset();
        this.joinPush.send();
      };

      Channel.prototype.onClose = function onClose(callback) {
        this.on(CHANNEL_EVENTS.close, callback);
      };

      Channel.prototype.onError = function onError(callback) {
        var _this = this;

        this.on(CHANNEL_EVENTS.error, function (reason) {
          callback(reason);
          _this.trigger(CHANNEL_EVENTS.close, "error");
        });
      };

      Channel.prototype.reset = function reset() {
        var _this = this;

        this.bindings = [];
        var newJoinPush = new Push(this, CHANNEL_EVENTS.join, this.message, this.joinPush);
        this.joinPush = newJoinPush;
        this.onError(function (reason) {
          setTimeout(function () {
            return _this.rejoin();
          }, _this.socket.reconnectAfterMs);
        });
        this.on(CHANNEL_EVENTS.reply, function (payload) {
          _this.trigger(_this.replyEventName(payload.ref), payload);
        });
      };

      Channel.prototype.on = function on(event, callback) {
        this.bindings.push({ event: event, callback: callback });
      };

      Channel.prototype.isMember = function isMember(topic) {
        return this.topic === topic;
      };

      Channel.prototype.off = function off(event) {
        this.bindings = this.bindings.filter(function (bind) {
          return bind.event !== event;
        });
      };

      Channel.prototype.trigger = function trigger(triggerEvent, msg) {
        this.bindings.filter(function (bind) {
          return bind.event === triggerEvent;
        }).map(function (bind) {
          return bind.callback(msg);
        });
      };

      Channel.prototype.push = function push(event, payload) {
        var pushEvent = new Push(this, event, payload);
        pushEvent.send();

        return pushEvent;
      };

      Channel.prototype.replyEventName = function replyEventName(ref) {
        return "chan_reply_" + ref;
      };

      Channel.prototype.leave = function leave() {
        var _this = this;

        return this.push(CHANNEL_EVENTS.leave).receive("ok", function () {
          _this.socket.leave(_this);
          _this.reset();
        });
      };

      return Channel;
    })();

    var Socket = exports.Socket = (function () {

      // Initializes the Socket
      //
      // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
      //                                               "wss://example.com"
      //                                               "/ws" (inherited host & protocol)
      // opts - Optional configuration
      //   transport - The Websocket Transport, ie WebSocket, Phoenix.LongPoller.
      //               Defaults to WebSocket with automatic LongPoller fallback.
      //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
      //   reconnectAfterMs - The millisec interval to reconnect after connection loss
      //   logger - The optional function for specialized logging, ie:
      //            `logger: function(msg){ console.log(msg) }`
      //   longpoller_timeout - The maximum timeout of a long poll AJAX request.
      //                        Defaults to 20s (double the server long poll timer).
      //
      // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
      //

      function Socket(endPoint) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Socket);

        this.states = SOCKET_STATES;
        this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
        this.flushEveryMs = 50;
        this.reconnectTimer = null;
        this.channels = [];
        this.sendBuffer = [];
        this.ref = 0;
        this.transport = opts.transport || window.WebSocket || LongPoller;
        this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
        this.reconnectAfterMs = opts.reconnectAfterMs || 5000;
        this.logger = opts.logger || function () {}; // noop
        this.longpoller_timeout = opts.longpoller_timeout || 20000;
        this.endPoint = this.expandEndpoint(endPoint);

        this.resetBufferTimer();
      }

      Socket.prototype.protocol = function protocol() {
        return location.protocol.match(/^https/) ? "wss" : "ws";
      };

      Socket.prototype.expandEndpoint = function expandEndpoint(endPoint) {
        if (endPoint.charAt(0) !== "/") {
          return endPoint;
        }
        if (endPoint.charAt(1) === "/") {
          return "" + this.protocol() + ":" + endPoint;
        }

        return "" + this.protocol() + "://" + location.host + "" + endPoint;
      };

      Socket.prototype.disconnect = function disconnect(callback, code, reason) {
        if (this.conn) {
          this.conn.onclose = function () {}; // noop
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
          this.conn = null;
        }
        callback && callback();
      };

      Socket.prototype.connect = function connect() {
        var _this = this;

        this.disconnect(function () {
          _this.conn = new _this.transport(_this.endPoint);
          _this.conn.timeout = _this.longpoller_timeout;
          _this.conn.onopen = function () {
            return _this.onConnOpen();
          };
          _this.conn.onerror = function (error) {
            return _this.onConnError(error);
          };
          _this.conn.onmessage = function (event) {
            return _this.onConnMessage(event);
          };
          _this.conn.onclose = function (event) {
            return _this.onConnClose(event);
          };
        });
      };

      Socket.prototype.resetBufferTimer = function resetBufferTimer() {
        var _this = this;

        clearTimeout(this.sendBufferTimer);
        this.sendBufferTimer = setTimeout(function () {
          return _this.flushSendBuffer();
        }, this.flushEveryMs);
      };

      // Logs the message. Override `this.logger` for specialized logging. noops by default

      Socket.prototype.log = function log(msg) {
        this.logger(msg);
      };

      // Registers callbacks for connection state change events
      //
      // Examples
      //
      //    socket.onError function(error){ alert("An error occurred") }
      //

      Socket.prototype.onOpen = function onOpen(callback) {
        this.stateChangeCallbacks.open.push(callback);
      };

      Socket.prototype.onClose = function onClose(callback) {
        this.stateChangeCallbacks.close.push(callback);
      };

      Socket.prototype.onError = function onError(callback) {
        this.stateChangeCallbacks.error.push(callback);
      };

      Socket.prototype.onMessage = function onMessage(callback) {
        this.stateChangeCallbacks.message.push(callback);
      };

      Socket.prototype.onConnOpen = function onConnOpen() {
        var _this = this;

        clearInterval(this.reconnectTimer);
        if (!this.conn.skipHeartbeat) {
          clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = setInterval(function () {
            return _this.sendHeartbeat();
          }, this.heartbeatIntervalMs);
        }
        this.rejoinAll();
        this.stateChangeCallbacks.open.forEach(function (callback) {
          return callback();
        });
      };

      Socket.prototype.onConnClose = function onConnClose(event) {
        var _this = this;

        this.log("WS close:");
        this.log(event);
        clearInterval(this.reconnectTimer);
        clearInterval(this.heartbeatTimer);
        this.reconnectTimer = setInterval(function () {
          return _this.connect();
        }, this.reconnectAfterMs);
        this.stateChangeCallbacks.close.forEach(function (callback) {
          return callback(event);
        });
      };

      Socket.prototype.onConnError = function onConnError(error) {
        this.log("WS error:");
        this.log(error);
        this.stateChangeCallbacks.error.forEach(function (callback) {
          return callback(error);
        });
      };

      Socket.prototype.connectionState = function connectionState() {
        switch (this.conn && this.conn.readyState) {
          case this.states.connecting:
            return "connecting";
          case this.states.open:
            return "open";
          case this.states.closing:
            return "closing";
          default:
            return "closed";
        }
      };

      Socket.prototype.isConnected = function isConnected() {
        return this.connectionState() === "open";
      };

      Socket.prototype.rejoinAll = function rejoinAll() {
        this.channels.forEach(function (chan) {
          return chan.rejoin();
        });
      };

      Socket.prototype.join = function join(topic, message, callback) {
        var chan = new Channel(topic, message, callback, this);
        this.channels.push(chan);
        if (this.isConnected()) {
          chan.rejoin();
        }
        return chan;
      };

      Socket.prototype.leave = function leave(chan) {
        this.channels = this.channels.filter(function (c) {
          return !c.isMember(chan.topic);
        });
      };

      Socket.prototype.push = function push(data) {
        var _this = this;

        var callback = function callback() {
          return _this.conn.send(JSON.stringify(data));
        };
        if (this.isConnected()) {
          callback();
        } else {
          this.sendBuffer.push(callback);
        }
      };

      // Return the next message ref, accounting for overflows

      Socket.prototype.makeRef = function makeRef() {
        var newRef = this.ref + 1;
        if (newRef === this.ref) {
          this.ref = 0;
        } else {
          this.ref = newRef;
        }

        return this.ref.toString();
      };

      Socket.prototype.sendHeartbeat = function sendHeartbeat() {
        this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
      };

      Socket.prototype.flushSendBuffer = function flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
          this.sendBuffer.forEach(function (callback) {
            return callback();
          });
          this.sendBuffer = [];
        }
        this.resetBufferTimer();
      };

      Socket.prototype.onConnMessage = function onConnMessage(rawMessage) {
        this.log("message received:");
        this.log(rawMessage);

        var _JSON$parse = JSON.parse(rawMessage.data);

        var topic = _JSON$parse.topic;
        var event = _JSON$parse.event;
        var payload = _JSON$parse.payload;

        this.channels.filter(function (chan) {
          return chan.isMember(topic);
        }).forEach(function (chan) {
          return chan.trigger(event, payload);
        });
        this.stateChangeCallbacks.message.forEach(function (callback) {
          callback(topic, event, payload);
        });
      };

      return Socket;
    })();

    var LongPoller = exports.LongPoller = (function () {
      function LongPoller(endPoint) {
        _classCallCheck(this, LongPoller);

        this.retryInMs = 5000;
        this.endPoint = null;
        this.token = null;
        this.sig = null;
        this.skipHeartbeat = true;
        this.onopen = function () {}; // noop
        this.onerror = function () {}; // noop
        this.onmessage = function () {}; // noop
        this.onclose = function () {}; // noop
        this.states = SOCKET_STATES;
        this.upgradeEndpoint = this.normalizeEndpoint(endPoint);
        this.pollEndpoint = this.upgradeEndpoint + (/\/$/.test(endPoint) ? "poll" : "/poll");
        this.readyState = this.states.connecting;

        this.poll();
      }

      LongPoller.prototype.normalizeEndpoint = function normalizeEndpoint(endPoint) {
        return endPoint.replace("ws://", "http://").replace("wss://", "https://");
      };

      LongPoller.prototype.endpointURL = function endpointURL() {
        return this.pollEndpoint + ("?token=" + encodeURIComponent(this.token) + "&sig=" + encodeURIComponent(this.sig));
      };

      LongPoller.prototype.closeAndRetry = function closeAndRetry() {
        this.close();
        this.readyState = this.states.connecting;
      };

      LongPoller.prototype.ontimeout = function ontimeout() {
        this.onerror("timeout");
        this.closeAndRetry();
      };

      LongPoller.prototype.poll = function poll() {
        var _this = this;

        if (!(this.readyState === this.states.open || this.readyState === this.states.connecting)) {
          return;
        }

        Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
          if (resp) {
            var status = resp.status;
            var token = resp.token;
            var sig = resp.sig;
            var messages = resp.messages;

            _this.token = token;
            _this.sig = sig;
          } else {
            var status = 0;
          }

          switch (status) {
            case 200:
              messages.forEach(function (msg) {
                return _this.onmessage({ data: JSON.stringify(msg) });
              });
              _this.poll();
              break;
            case 204:
              _this.poll();
              break;
            case 410:
              _this.readyState = _this.states.open;
              _this.onopen();
              _this.poll();
              break;
            case 0:
            case 500:
              _this.onerror();
              _this.closeAndRetry();
              break;
            default:
              throw "unhandled poll status " + status;
          }
        });
      };

      LongPoller.prototype.send = function send(body) {
        var _this = this;

        Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
          if (!resp || resp.status !== 200) {
            _this.onerror(status);
            _this.closeAndRetry();
          }
        });
      };

      LongPoller.prototype.close = function close(code, reason) {
        this.readyState = this.states.closed;
        this.onclose();
      };

      return LongPoller;
    })();

    var Ajax = exports.Ajax = (function () {
      function Ajax() {
        _classCallCheck(this, Ajax);
      }

      Ajax.request = function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
        if (window.XDomainRequest) {
          var req = new XDomainRequest(); // IE8, IE9
          this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
        } else {
          var req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
          new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
          this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
        }
      };

      Ajax.xdomainRequest = function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
        var _this = this;

        req.timeout = timeout;
        req.open(method, endPoint);
        req.onload = function () {
          var response = _this.parseJSON(req.responseText);
          callback && callback(response);
        };
        if (ontimeout) {
          req.ontimeout = ontimeout;
        }

        // Work around bug in IE9 that requires an attached onprogress handler
        req.onprogress = function () {};

        req.send(body);
      };

      Ajax.xhrRequest = function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
        var _this = this;

        req.timeout = timeout;
        req.open(method, endPoint, true);
        req.setRequestHeader("Content-Type", accept);
        req.onerror = function () {
          callback && callback(null);
        };
        req.onreadystatechange = function () {
          if (req.readyState === _this.states.complete && callback) {
            var response = _this.parseJSON(req.responseText);
            callback(response);
          }
        };
        if (ontimeout) {
          req.ontimeout = ontimeout;
        }

        req.send(body);
      };

      Ajax.parseJSON = function parseJSON(resp) {
        return resp && resp !== "" ? JSON.parse(resp) : null;
      };

      return Ajax;
    })();

    Ajax.states = { complete: 4 };
    exports.__esModule = true;
  } });
if (typeof window === "object" && !window.Phoenix) {
  window.Phoenix = require("phoenix");
};
/*! Brunch !*/"use strict";

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

var s;
var hash;
var content;
var counter = document.getElementById("visitor-count");
var visitorCount = 0;

function haveContent(socket, hash, content) {
  for (var i = 0; i < socket.channels.length; i++) {
    if (socket.channels[i].topic === "have:" + hash) {
      return;
    }
  }

  socket.join("have:" + hash, {}).receive("ok", function (chan) {
    chan.on("CONTENT_REQUEST", function (_msg) {
      chan.push("CONTENT", { content: content, hash: hash });
    });
    chan.on("VISITORS_COUNT", function (msg) {
      counter.innerHTML = msg.count;
    });
  });
}

function wantContent(socket, hash, elem) {
  socket.join("want:" + hash, {}).receive("ok", function (chan) {
    chan.on("CONTENT", function (msg) {
      elem.innerHTML = msg.content;
      chan.leave();
      haveContent(socket, hash, msg.content);
    });
    chan.push("CONTENT_REQUEST", { hash: hash });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var homePageElement = document.getElementById("create-new-page");
  var showPageElement = document.getElementById("content-goes-here");

  s = new Socket("/ws");
  s.connect();

  if (homePageElement) {
    homePageElement.addEventListener("click", function () {
      content = document.getElementById("new-page-content").value;
      hash = SHA256(content);
      history.pushState({}, "Your Page", hash);
      document.getElementById("content-goes-here").innerHTML = content;
      haveContent(s, hash, content);
    });
  } else if (showPageElement) {
    setTimeout(function () {
      wantContent(s, window.location.pathname.substr(1), showPageElement);
    }, 2000);
  }
});

var App = {};

module.exports = App;});

;
//# sourceMappingURL=app.js.map
