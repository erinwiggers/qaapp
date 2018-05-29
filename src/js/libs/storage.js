/* store.js - Copyright (c) 2010-2017 Marcus Westin */
!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { var t; t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.store = e() } }(function () { return function e(t, n, r) { function o(a, u) { if (!n[a]) { if (!t[a]) { var s = "function" == typeof require && require; if (!u && s) return s(a, !0); if (i) return i(a, !0); var c = new Error("Cannot find module '" + a + "'"); throw c.code = "MODULE_NOT_FOUND", c } var f = n[a] = { exports: {} }; t[a][0].call(f.exports, function (e) { var n = t[a][1][e]; return o(n ? n : e) }, f, f.exports, e, t, n, r) } return n[a].exports } for (var i = "function" == typeof require && require, a = 0; a < r.length; a++)o(r[a]); return o }({ 1: [function (e, t, n) { "use strict"; var r = e("../src/store-engine"), o = [e("../storages/localStorage"), e("../storages/sessionStorage"), e("../storages/cookieStorage"), e("../storages/memoryStorage")], i = []; t.exports = r.createStore(o, i) }, { "../src/store-engine": 2, "../storages/cookieStorage": 4, "../storages/localStorage": 5, "../storages/memoryStorage": 6, "../storages/sessionStorage": 7 }], 2: [function (e, t, n) { "use strict"; function r() { var e = "undefined" == typeof console ? null : console; if (e) { var t = e.warn ? e.warn : e.log; t.apply(e, arguments) } } function o(e, t, n) { n || (n = ""), e && !l(e) && (e = [e]), t && !l(t) && (t = [t]); var o = n ? "__storejs_" + n + "_" : "", i = n ? new RegExp("^" + o) : null, h = /^[a-zA-Z0-9_\-]*$/; if (!h.test(n)) throw new Error("store.js namespaces can only have alphanumerics + underscores and dashes"); var v = { _namespacePrefix: o, _namespaceRegexp: i, _testStorage: function (e) { try { var t = "__storejs__test__"; e.write(t, t); var n = e.read(t) === t; return e.remove(t), n } catch (r) { return !1 } }, _assignPluginFnProp: function (e, t) { var n = this[t]; this[t] = function () { function t() { if (n) return s(arguments, function (e, t) { r[t] = e }), n.apply(o, r) } var r = a(arguments, 0), o = this, i = [t].concat(r); return e.apply(o, i) } }, _serialize: function (e) { return JSON.stringify(e) }, _deserialize: function (e, t) { if (!e) return t; var n = ""; try { n = JSON.parse(e) } catch (r) { n = e } return void 0 !== n ? n : t }, _addStorage: function (e) { this.enabled || this._testStorage(e) && (this.storage = e, this.enabled = !0) }, _addPlugin: function (e) { var t = this; if (l(e)) return void s(e, function (e) { t._addPlugin(e) }); var n = u(this.plugins, function (t) { return e === t }); if (!n) { if (this.plugins.push(e), !p(e)) throw new Error("Plugins must be function values that return objects"); var r = e.call(this); if (!g(r)) throw new Error("Plugins must return an object of function properties"); s(r, function (n, r) { if (!p(n)) throw new Error("Bad plugin property: " + r + " from plugin " + e.name + ". Plugins should only return functions."); t._assignPluginFnProp(n, r) }) } }, addStorage: function (e) { r("store.addStorage(storage) is deprecated. Use createStore([storages])"), this._addStorage(e) } }, m = f(v, d, { plugins: [] }); return m.raw = {}, s(m, function (e, t) { p(e) && (m.raw[t] = c(m, e)) }), s(e, function (e) { m._addStorage(e) }), s(t, function (e) { m._addPlugin(e) }), m } var i = e("./util"), a = i.slice, u = i.pluck, s = i.each, c = i.bind, f = i.create, l = i.isList, p = i.isFunction, g = i.isObject; t.exports = { createStore: o }; var d = { version: "2.0.12", enabled: !1, get: function (e, t) { var n = this.storage.read(this._namespacePrefix + e); return this._deserialize(n, t) }, set: function (e, t) { return void 0 === t ? this.remove(e) : (this.storage.write(this._namespacePrefix + e, this._serialize(t)), t) }, remove: function (e) { this.storage.remove(this._namespacePrefix + e) }, each: function (e) { var t = this; this.storage.each(function (n, r) { e.call(t, t._deserialize(n), (r || "").replace(t._namespaceRegexp, "")) }) }, clearAll: function () { this.storage.clearAll() }, hasNamespace: function (e) { return this._namespacePrefix == "__storejs_" + e + "_" }, createStore: function () { return o.apply(this, arguments) }, addPlugin: function (e) { this._addPlugin(e) }, namespace: function (e) { return o(this.storage, this.plugins, e) } } }, { "./util": 3 }], 3: [function (e, t, n) { (function (e) { "use strict"; function n() { return Object.assign ? Object.assign : function (e, t, n, r) { for (var o = 1; o < arguments.length; o++)u(Object(arguments[o]), function (t, n) { e[n] = t }); return e } } function r() { if (Object.create) return function (e, t, n, r) { var o = a(arguments, 1); return g.apply(this, [Object.create(e)].concat(o)) }; var e = function () { }; return function (t, n, r, o) { var i = a(arguments, 1); return e.prototype = t, g.apply(this, [new e].concat(i)) } } function o() { return String.prototype.trim ? function (e) { return String.prototype.trim.call(e) } : function (e) { return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") } } function i(e, t) { return function () { return t.apply(e, Array.prototype.slice.call(arguments, 0)) } } function a(e, t) { return Array.prototype.slice.call(e, t || 0) } function u(e, t) { c(e, function (e, n) { return t(e, n), !1 }) } function s(e, t) { var n = f(e) ? [] : {}; return c(e, function (e, r) { return n[r] = t(e, r), !1 }), n } function c(e, t) { if (f(e)) { for (var n = 0; n < e.length; n++)if (t(e[n], n)) return e[n] } else for (var r in e) if (e.hasOwnProperty(r) && t(e[r], r)) return e[r] } function f(e) { return null != e && "function" != typeof e && "number" == typeof e.length } function l(e) { return e && "[object Function]" === {}.toString.call(e) } function p(e) { return e && "[object Object]" === {}.toString.call(e) } var g = n(), d = r(), h = o(), v = "undefined" != typeof window ? window : e; t.exports = { assign: g, create: d, trim: h, bind: i, slice: a, each: u, map: s, pluck: c, isList: f, isFunction: l, isObject: p, Global: v } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 4: [function (e, t, n) { "use strict"; function r(e) { if (!e || !s(e)) return null; var t = "(?:^|.*;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"; return unescape(p.cookie.replace(new RegExp(t), "$1")) } function o(e) { for (var t = p.cookie.split(/; ?/g), n = t.length - 1; n >= 0; n--)if (l(t[n])) { var r = t[n].split("="), o = unescape(r[0]), i = unescape(r[1]); e(i, o) } } function i(e, t) { e && (p.cookie = escape(e) + "=" + escape(t) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/") } function a(e) { e && s(e) && (p.cookie = escape(e) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/") } function u() { o(function (e, t) { a(t) }) } function s(e) { return new RegExp("(?:^|;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(p.cookie) } var c = e("../src/util"), f = c.Global, l = c.trim; t.exports = { name: "cookieStorage", read: r, write: i, each: o, remove: a, clearAll: u }; var p = f.document }, { "../src/util": 3 }], 5: [function (e, t, n) { "use strict"; function r() { return f.localStorage } function o(e) { return r().getItem(e) } function i(e, t) { return r().setItem(e, t) } function a(e) { for (var t = r().length - 1; t >= 0; t--) { var n = r().key(t); e(o(n), n) } } function u(e) { return r().removeItem(e) } function s() { return r().clear() } var c = e("../src/util"), f = c.Global; t.exports = { name: "localStorage", read: o, write: i, each: a, remove: u, clearAll: s } }, { "../src/util": 3 }], 6: [function (e, t, n) { "use strict"; function r(e) { return s[e] } function o(e, t) { s[e] = t } function i(e) { for (var t in s) s.hasOwnProperty(t) && e(s[t], t) } function a(e) { delete s[e] } function u(e) { s = {} } t.exports = { name: "memoryStorage", read: r, write: o, each: i, remove: a, clearAll: u }; var s = {} }, {}], 7: [function (e, t, n) { "use strict"; function r() { return f.sessionStorage } function o(e) { return r().getItem(e) } function i(e, t) { return r().setItem(e, t) } function a(e) { for (var t = r().length - 1; t >= 0; t--) { var n = r().key(t); e(o(n), n) } } function u(e) { return r().removeItem(e) } function s() { return r().clear() } var c = e("../src/util"), f = c.Global; t.exports = { name: "sessionStorage", read: o, write: i, each: a, remove: u, clearAll: s } }, { "../src/util": 3 }] }, {}, [1])(1) });
