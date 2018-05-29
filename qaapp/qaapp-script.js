"use strict"; var sjcl = { cipher: {}, hash: {}, keyexchange: {}, mode: {}, misc: {}, codec: {}, exception: { corrupt: function (a) { this.toString = function () { return "CORRUPT: " + this.message }; this.message = a }, invalid: function (a) { this.toString = function () { return "INVALID: " + this.message }; this.message = a }, bug: function (a) { this.toString = function () { return "BUG: " + this.message }; this.message = a }, notReady: function (a) { this.toString = function () { return "NOT READY: " + this.message }; this.message = a } } };
sjcl.cipher.aes = function (a) {
this.s[0][0][0] || this.O(); var b, c, d, e, f = this.s[0][4], g = this.s[1]; b = a.length; var h = 1; if (4 !== b && 6 !== b && 8 !== b) throw new sjcl.exception.invalid("invalid aes key size"); this.b = [d = a.slice(0), e = []]; for (a = b; a < 4 * b + 28; a++) { c = d[a - 1]; if (0 === a % b || 8 === b && 4 === a % b) c = f[c >>> 24] << 24 ^ f[c >> 16 & 255] << 16 ^ f[c >> 8 & 255] << 8 ^ f[c & 255], 0 === a % b && (c = c << 8 ^ c >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7)); d[a] = d[a - b] ^ c } for (b = 0; a; b++ , a--)c = d[b & 3 ? a : a - 4], e[b] = 4 >= a || 4 > b ? c : g[0][f[c >>> 24]] ^ g[1][f[c >> 16 & 255]] ^ g[2][f[c >> 8 & 255]] ^ g[3][f[c &
    255]]
};
sjcl.cipher.aes.prototype = {
    encrypt: function (a) { return t(this, a, 0) }, decrypt: function (a) { return t(this, a, 1) }, s: [[[], [], [], [], []], [[], [], [], [], []]], O: function () {
        var a = this.s[0], b = this.s[1], c = a[4], d = b[4], e, f, g, h = [], k = [], l, n, m, p; for (e = 0; 0x100 > e; e++)k[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e; for (f = g = 0; !c[f]; f ^= l || 1, g = k[g] || 1)for (m = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4, m = m >> 8 ^ m & 255 ^ 99, c[f] = m, d[m] = f, n = h[e = h[l = h[f]]], p = 0x1010101 * n ^ 0x10001 * e ^ 0x101 * l ^ 0x1010100 * f, n = 0x101 * h[m] ^ 0x1010100 * m, e = 0; 4 > e; e++)a[e][f] = n = n << 24 ^ n >>> 8, b[e][m] = p = p << 24 ^ p >>> 8; for (e =
            0; 5 > e; e++)a[e] = a[e].slice(0), b[e] = b[e].slice(0)
    }
};
function t(a, b, c) {
    if (4 !== b.length) throw new sjcl.exception.invalid("invalid aes block size"); var d = a.b[c], e = b[0] ^ d[0], f = b[c ? 3 : 1] ^ d[1], g = b[2] ^ d[2]; b = b[c ? 1 : 3] ^ d[3]; var h, k, l, n = d.length / 4 - 2, m, p = 4, r = [0, 0, 0, 0]; h = a.s[c]; a = h[0]; var q = h[1], v = h[2], w = h[3], x = h[4]; for (m = 0; m < n; m++)h = a[e >>> 24] ^ q[f >> 16 & 255] ^ v[g >> 8 & 255] ^ w[b & 255] ^ d[p], k = a[f >>> 24] ^ q[g >> 16 & 255] ^ v[b >> 8 & 255] ^ w[e & 255] ^ d[p + 1], l = a[g >>> 24] ^ q[b >> 16 & 255] ^ v[e >> 8 & 255] ^ w[f & 255] ^ d[p + 2], b = a[b >>> 24] ^ q[e >> 16 & 255] ^ v[f >> 8 & 255] ^ w[g & 255] ^ d[p + 3], p += 4, e = h, f = k, g = l; for (m =
        0; 4 > m; m++)r[c ? 3 & -m : m] = x[e >>> 24] << 24 ^ x[f >> 16 & 255] << 16 ^ x[g >> 8 & 255] << 8 ^ x[b & 255] ^ d[p++], h = e, e = f, f = g, g = b, b = h; return r
}
sjcl.bitArray = {
    bitSlice: function (a, b, c) { a = sjcl.bitArray.$(a.slice(b / 32), 32 - (b & 31)).slice(1); return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b) }, extract: function (a, b, c) { var d = Math.floor(-b - c & 31); return ((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1 }, concat: function (a, b) { if (0 === a.length || 0 === b.length) return a.concat(b); var c = a[a.length - 1], d = sjcl.bitArray.getPartial(c); return 32 === d ? a.concat(b) : sjcl.bitArray.$(b, d, c | 0, a.slice(0, a.length - 1)) }, bitLength: function (a) {
        var b = a.length; return 0 ===
            b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1])
    }, clamp: function (a, b) { if (32 * a.length < b) return a; a = a.slice(0, Math.ceil(b / 32)); var c = a.length; b = b & 31; 0 < c && b && (a[c - 1] = sjcl.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1)); return a }, partial: function (a, b, c) { return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 0x10000000000 * a }, getPartial: function (a) { return Math.round(a / 0x10000000000) || 32 }, equal: function (a, b) {
        if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return !1; var c = 0, d; for (d = 0; d < a.length; d++)c |= a[d] ^ b[d]; return 0 ===
            c
    }, $: function (a, b, c, d) { var e; e = 0; for (void 0 === d && (d = []); 32 <= b; b -= 32)d.push(c), c = 0; if (0 === b) return d.concat(a); for (e = 0; e < a.length; e++)d.push(c | a[e] >>> b), c = a[e] << 32 - b; e = a.length ? a[a.length - 1] : 0; a = sjcl.bitArray.getPartial(e); d.push(sjcl.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1)); return d }, i: function (a, b) { return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]] }, byteswapM: function (a) { var b, c; for (b = 0; b < a.length; ++b)c = a[b], a[b] = c >>> 24 | c >>> 8 & 0xff00 | (c & 0xff00) << 8 | c << 24; return a }
};
sjcl.codec.utf8String = { fromBits: function (a) { var b = "", c = sjcl.bitArray.bitLength(a), d, e; for (d = 0; d < c / 8; d++)0 === (d & 3) && (e = a[d / 4]), b += String.fromCharCode(e >>> 8 >>> 8 >>> 8), e <<= 8; return decodeURIComponent(escape(b)) }, toBits: function (a) { a = unescape(encodeURIComponent(a)); var b = [], c, d = 0; for (c = 0; c < a.length; c++)d = d << 8 | a.charCodeAt(c), 3 === (c & 3) && (b.push(d), d = 0); c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d)); return b } };
sjcl.codec.hex = { fromBits: function (a) { var b = "", c; for (c = 0; c < a.length; c++)b += ((a[c] | 0) + 0xf00000000000).toString(16).substr(4); return b.substr(0, sjcl.bitArray.bitLength(a) / 4) }, toBits: function (a) { var b, c = [], d; a = a.replace(/\s|0x/g, ""); d = a.length; a = a + "00000000"; for (b = 0; b < a.length; b += 8)c.push(parseInt(a.substr(b, 8), 16) ^ 0); return sjcl.bitArray.clamp(c, 4 * d) } };
sjcl.codec.base32 = {
    B: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", X: "0123456789ABCDEFGHIJKLMNOPQRSTUV", BITS: 32, BASE: 5, REMAINING: 27, fromBits: function (a, b, c) { var d = sjcl.codec.base32.BASE, e = sjcl.codec.base32.REMAINING, f = "", g = 0, h = sjcl.codec.base32.B, k = 0, l = sjcl.bitArray.bitLength(a); c && (h = sjcl.codec.base32.X); for (c = 0; f.length * d < l;)f += h.charAt((k ^ a[c] >>> g) >>> e), g < d ? (k = a[c] << d - g, g += e, c++) : (k <<= d, g -= d); for (; f.length & 7 && !b;)f += "="; return f }, toBits: function (a, b) {
        a = a.replace(/\s|=/g, "").toUpperCase(); var c = sjcl.codec.base32.BITS,
            d = sjcl.codec.base32.BASE, e = sjcl.codec.base32.REMAINING, f = [], g, h = 0, k = sjcl.codec.base32.B, l = 0, n, m = "base32"; b && (k = sjcl.codec.base32.X, m = "base32hex"); for (g = 0; g < a.length; g++) { n = k.indexOf(a.charAt(g)); if (0 > n) { if (!b) try { return sjcl.codec.base32hex.toBits(a) } catch (p) { } throw new sjcl.exception.invalid("this isn't " + m + "!"); } h > e ? (h -= e, f.push(l ^ n >>> h), l = n << c - h) : (h += d, l ^= n << c - h) } h & 56 && f.push(sjcl.bitArray.partial(h & 56, l, 1)); return f
    }
};
sjcl.codec.base32hex = { fromBits: function (a, b) { return sjcl.codec.base32.fromBits(a, b, 1) }, toBits: function (a) { return sjcl.codec.base32.toBits(a, 1) } };
sjcl.codec.base64 = {
    B: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", fromBits: function (a, b, c) { var d = "", e = 0, f = sjcl.codec.base64.B, g = 0, h = sjcl.bitArray.bitLength(a); c && (f = f.substr(0, 62) + "-_"); for (c = 0; 6 * d.length < h;)d += f.charAt((g ^ a[c] >>> e) >>> 26), 6 > e ? (g = a[c] << 6 - e, e += 26, c++) : (g <<= 6, e -= 6); for (; d.length & 3 && !b;)d += "="; return d }, toBits: function (a, b) {
        a = a.replace(/\s|=/g, ""); var c = [], d, e = 0, f = sjcl.codec.base64.B, g = 0, h; b && (f = f.substr(0, 62) + "-_"); for (d = 0; d < a.length; d++) {
            h = f.indexOf(a.charAt(d));
            if (0 > h) throw new sjcl.exception.invalid("this isn't base64!"); 26 < e ? (e -= 26, c.push(g ^ h >>> e), g = h << 32 - e) : (e += 6, g ^= h << 32 - e)
        } e & 56 && c.push(sjcl.bitArray.partial(e & 56, g, 1)); return c
    }
}; sjcl.codec.base64url = { fromBits: function (a) { return sjcl.codec.base64.fromBits(a, 1, 1) }, toBits: function (a) { return sjcl.codec.base64.toBits(a, 1) } }; sjcl.hash.sha256 = function (a) { this.b[0] || this.O(); a ? (this.F = a.F.slice(0), this.A = a.A.slice(0), this.l = a.l) : this.reset() }; sjcl.hash.sha256.hash = function (a) { return (new sjcl.hash.sha256).update(a).finalize() };
sjcl.hash.sha256.prototype = {
    blockSize: 512, reset: function () { this.F = this.Y.slice(0); this.A = []; this.l = 0; return this }, update: function (a) {
    "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a)); var b, c = this.A = sjcl.bitArray.concat(this.A, a); b = this.l; a = this.l = b + sjcl.bitArray.bitLength(a); if (0x1fffffffffffff < a) throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits"); if ("undefined" !== typeof Uint32Array) {
        var d = new Uint32Array(c), e = 0; for (b = 512 + b - (512 + b & 0x1ff); b <= a; b += 512)u(this, d.subarray(16 * e,
            16 * (e + 1))), e += 1; c.splice(0, 16 * e)
    } else for (b = 512 + b - (512 + b & 0x1ff); b <= a; b += 512)u(this, c.splice(0, 16)); return this
    }, finalize: function () { var a, b = this.A, c = this.F, b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]); for (a = b.length + 2; a & 15; a++)b.push(0); b.push(Math.floor(this.l / 0x100000000)); for (b.push(this.l | 0); b.length;)u(this, b.splice(0, 16)); this.reset(); return c }, Y: [], b: [], O: function () {
        function a(a) { return 0x100000000 * (a - Math.floor(a)) | 0 } for (var b = 0, c = 2, d, e; 64 > b; c++) {
            e = !0; for (d = 2; d * d <= c; d++)if (0 === c % d) {
                e =
                !1; break
            } e && (8 > b && (this.Y[b] = a(Math.pow(c, .5))), this.b[b] = a(Math.pow(c, 1 / 3)), b++)
        }
    }
};
function u(a, b) {
    var c, d, e, f = a.F, g = a.b, h = f[0], k = f[1], l = f[2], n = f[3], m = f[4], p = f[5], r = f[6], q = f[7]; for (c = 0; 64 > c; c++)16 > c ? d = b[c] : (d = b[c + 1 & 15], e = b[c + 14 & 15], d = b[c & 15] = (d >>> 7 ^ d >>> 18 ^ d >>> 3 ^ d << 25 ^ d << 14) + (e >>> 17 ^ e >>> 19 ^ e >>> 10 ^ e << 15 ^ e << 13) + b[c & 15] + b[c + 9 & 15] | 0), d = d + q + (m >>> 6 ^ m >>> 11 ^ m >>> 25 ^ m << 26 ^ m << 21 ^ m << 7) + (r ^ m & (p ^ r)) + g[c], q = r, r = p, p = m, m = n + d | 0, n = l, l = k, k = h, h = d + (k & l ^ n & (k ^ l)) + (k >>> 2 ^ k >>> 13 ^ k >>> 22 ^ k << 30 ^ k << 19 ^ k << 10) | 0; f[0] = f[0] + h | 0; f[1] = f[1] + k | 0; f[2] = f[2] + l | 0; f[3] = f[3] + n | 0; f[4] = f[4] + m | 0; f[5] = f[5] + p | 0; f[6] = f[6] + r | 0; f[7] =
        f[7] + q | 0
}
sjcl.mode.ccm = {
    name: "ccm", G: [], listenProgress: function (a) { sjcl.mode.ccm.G.push(a) }, unListenProgress: function (a) { a = sjcl.mode.ccm.G.indexOf(a); -1 < a && sjcl.mode.ccm.G.splice(a, 1) }, fa: function (a) { var b = sjcl.mode.ccm.G.slice(), c; for (c = 0; c < b.length; c += 1)b[c](a) }, encrypt: function (a, b, c, d, e) {
        var f, g = b.slice(0), h = sjcl.bitArray, k = h.bitLength(c) / 8, l = h.bitLength(g) / 8; e = e || 64; d = d || []; if (7 > k) throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"); for (f = 2; 4 > f && l >>> 8 * f; f++); f < 15 - k && (f = 15 - k); c = h.clamp(c,
            8 * (15 - f)); b = sjcl.mode.ccm.V(a, b, c, d, e, f); g = sjcl.mode.ccm.C(a, g, c, b, e, f); return h.concat(g.data, g.tag)
    }, decrypt: function (a, b, c, d, e) {
        e = e || 64; d = d || []; var f = sjcl.bitArray, g = f.bitLength(c) / 8, h = f.bitLength(b), k = f.clamp(b, h - e), l = f.bitSlice(b, h - e), h = (h - e) / 8; if (7 > g) throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"); for (b = 2; 4 > b && h >>> 8 * b; b++); b < 15 - g && (b = 15 - g); c = f.clamp(c, 8 * (15 - b)); k = sjcl.mode.ccm.C(a, k, c, l, e, b); a = sjcl.mode.ccm.V(a, k.data, c, d, e, b); if (!f.equal(k.tag, a)) throw new sjcl.exception.corrupt("ccm: tag doesn't match");
        return k.data
    }, na: function (a, b, c, d, e, f) { var g = [], h = sjcl.bitArray, k = h.i; d = [h.partial(8, (b.length ? 64 : 0) | d - 2 << 2 | f - 1)]; d = h.concat(d, c); d[3] |= e; d = a.encrypt(d); if (b.length) for (c = h.bitLength(b) / 8, 65279 >= c ? g = [h.partial(16, c)] : 0xffffffff >= c && (g = h.concat([h.partial(16, 65534)], [c])), g = h.concat(g, b), b = 0; b < g.length; b += 4)d = a.encrypt(k(d, g.slice(b, b + 4).concat([0, 0, 0]))); return d }, V: function (a, b, c, d, e, f) {
        var g = sjcl.bitArray, h = g.i; e /= 8; if (e % 2 || 4 > e || 16 < e) throw new sjcl.exception.invalid("ccm: invalid tag length");
        if (0xffffffff < d.length || 0xffffffff < b.length) throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"); c = sjcl.mode.ccm.na(a, d, c, e, g.bitLength(b) / 8, f); for (d = 0; d < b.length; d += 4)c = a.encrypt(h(c, b.slice(d, d + 4).concat([0, 0, 0]))); return g.clamp(c, 8 * e)
    }, C: function (a, b, c, d, e, f) {
        var g, h = sjcl.bitArray; g = h.i; var k = b.length, l = h.bitLength(b), n = k / 50, m = n; c = h.concat([h.partial(8, f - 1)], c).concat([0, 0, 0]).slice(0, 4); d = h.bitSlice(g(d, a.encrypt(c)), 0, e); if (!k) return { tag: d, data: [] }; for (g = 0; g < k; g += 4)g > n && (sjcl.mode.ccm.fa(g /
            k), n += m), c[3]++ , e = a.encrypt(c), b[g] ^= e[0], b[g + 1] ^= e[1], b[g + 2] ^= e[2], b[g + 3] ^= e[3]; return { tag: d, data: h.clamp(b, l) }
    }
};
sjcl.mode.ocb2 = {
    name: "ocb2", encrypt: function (a, b, c, d, e, f) {
        if (128 !== sjcl.bitArray.bitLength(c)) throw new sjcl.exception.invalid("ocb iv must be 128 bits"); var g, h = sjcl.mode.ocb2.S, k = sjcl.bitArray, l = k.i, n = [0, 0, 0, 0]; c = h(a.encrypt(c)); var m, p = []; d = d || []; e = e || 64; for (g = 0; g + 4 < b.length; g += 4)m = b.slice(g, g + 4), n = l(n, m), p = p.concat(l(c, a.encrypt(l(c, m)))), c = h(c); m = b.slice(g); b = k.bitLength(m); g = a.encrypt(l(c, [0, 0, 0, b])); m = k.clamp(l(m.concat([0, 0, 0]), g), b); n = l(n, l(m.concat([0, 0, 0]), g)); n = a.encrypt(l(n, l(c, h(c))));
        d.length && (n = l(n, f ? d : sjcl.mode.ocb2.pmac(a, d))); return p.concat(k.concat(m, k.clamp(n, e)))
    }, decrypt: function (a, b, c, d, e, f) {
        if (128 !== sjcl.bitArray.bitLength(c)) throw new sjcl.exception.invalid("ocb iv must be 128 bits"); e = e || 64; var g = sjcl.mode.ocb2.S, h = sjcl.bitArray, k = h.i, l = [0, 0, 0, 0], n = g(a.encrypt(c)), m, p, r = sjcl.bitArray.bitLength(b) - e, q = []; d = d || []; for (c = 0; c + 4 < r / 32; c += 4)m = k(n, a.decrypt(k(n, b.slice(c, c + 4)))), l = k(l, m), q = q.concat(m), n = g(n); p = r - 32 * c; m = a.encrypt(k(n, [0, 0, 0, p])); m = k(m, h.clamp(b.slice(c), p).concat([0,
            0, 0])); l = k(l, m); l = a.encrypt(k(l, k(n, g(n)))); d.length && (l = k(l, f ? d : sjcl.mode.ocb2.pmac(a, d))); if (!h.equal(h.clamp(l, e), h.bitSlice(b, r))) throw new sjcl.exception.corrupt("ocb: tag doesn't match"); return q.concat(h.clamp(m, p))
    }, pmac: function (a, b) {
        var c, d = sjcl.mode.ocb2.S, e = sjcl.bitArray, f = e.i, g = [0, 0, 0, 0], h = a.encrypt([0, 0, 0, 0]), h = f(h, d(d(h))); for (c = 0; c + 4 < b.length; c += 4)h = d(h), g = f(g, a.encrypt(f(h, b.slice(c, c + 4)))); c = b.slice(c); 128 > e.bitLength(c) && (h = f(h, d(h)), c = e.concat(c, [-2147483648, 0, 0, 0])); g = f(g, c);
        return a.encrypt(f(d(f(h, d(h))), g))
    }, S: function (a) { return [a[0] << 1 ^ a[1] >>> 31, a[1] << 1 ^ a[2] >>> 31, a[2] << 1 ^ a[3] >>> 31, a[3] << 1 ^ 135 * (a[0] >>> 31)] }
};
sjcl.mode.gcm = {
    name: "gcm", encrypt: function (a, b, c, d, e) { var f = b.slice(0); b = sjcl.bitArray; d = d || []; a = sjcl.mode.gcm.C(!0, a, f, d, c, e || 128); return b.concat(a.data, a.tag) }, decrypt: function (a, b, c, d, e) { var f = b.slice(0), g = sjcl.bitArray, h = g.bitLength(f); e = e || 128; d = d || []; e <= h ? (b = g.bitSlice(f, h - e), f = g.bitSlice(f, 0, h - e)) : (b = f, f = []); a = sjcl.mode.gcm.C(!1, a, f, d, c, e); if (!g.equal(a.tag, b)) throw new sjcl.exception.corrupt("gcm: tag doesn't match"); return a.data }, ka: function (a, b) {
        var c, d, e, f, g, h = sjcl.bitArray.i; e = [0, 0,
            0, 0]; f = b.slice(0); for (c = 0; 128 > c; c++) { (d = 0 !== (a[Math.floor(c / 32)] & 1 << 31 - c % 32)) && (e = h(e, f)); g = 0 !== (f[3] & 1); for (d = 3; 0 < d; d--)f[d] = f[d] >>> 1 | (f[d - 1] & 1) << 31; f[0] >>>= 1; g && (f[0] ^= -0x1f000000) } return e
    }, j: function (a, b, c) { var d, e = c.length; b = b.slice(0); for (d = 0; d < e; d += 4)b[0] ^= 0xffffffff & c[d], b[1] ^= 0xffffffff & c[d + 1], b[2] ^= 0xffffffff & c[d + 2], b[3] ^= 0xffffffff & c[d + 3], b = sjcl.mode.gcm.ka(b, a); return b }, C: function (a, b, c, d, e, f) {
        var g, h, k, l, n, m, p, r, q = sjcl.bitArray; m = c.length; p = q.bitLength(c); r = q.bitLength(d); h = q.bitLength(e);
        g = b.encrypt([0, 0, 0, 0]); 96 === h ? (e = e.slice(0), e = q.concat(e, [1])) : (e = sjcl.mode.gcm.j(g, [0, 0, 0, 0], e), e = sjcl.mode.gcm.j(g, e, [0, 0, Math.floor(h / 0x100000000), h & 0xffffffff])); h = sjcl.mode.gcm.j(g, [0, 0, 0, 0], d); n = e.slice(0); d = h.slice(0); a || (d = sjcl.mode.gcm.j(g, h, c)); for (l = 0; l < m; l += 4)n[3]++ , k = b.encrypt(n), c[l] ^= k[0], c[l + 1] ^= k[1], c[l + 2] ^= k[2], c[l + 3] ^= k[3]; c = q.clamp(c, p); a && (d = sjcl.mode.gcm.j(g, h, c)); a = [Math.floor(r / 0x100000000), r & 0xffffffff, Math.floor(p / 0x100000000), p & 0xffffffff]; d = sjcl.mode.gcm.j(g, d, a); k = b.encrypt(e);
        d[0] ^= k[0]; d[1] ^= k[1]; d[2] ^= k[2]; d[3] ^= k[3]; return { tag: q.bitSlice(d, 0, f), data: c }
    }
}; sjcl.misc.hmac = function (a, b) { this.W = b = b || sjcl.hash.sha256; var c = [[], []], d, e = b.prototype.blockSize / 32; this.w = [new b, new b]; a.length > e && (a = b.hash(a)); for (d = 0; d < e; d++)c[0][d] = a[d] ^ 909522486, c[1][d] = a[d] ^ 1549556828; this.w[0].update(c[0]); this.w[1].update(c[1]); this.R = new b(this.w[0]) };
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) { if (this.aa) throw new sjcl.exception.invalid("encrypt on already updated hmac called!"); this.update(a); return this.digest(a) }; sjcl.misc.hmac.prototype.reset = function () { this.R = new this.W(this.w[0]); this.aa = !1 }; sjcl.misc.hmac.prototype.update = function (a) { this.aa = !0; this.R.update(a) }; sjcl.misc.hmac.prototype.digest = function () { var a = this.R.finalize(), a = (new this.W(this.w[1])).update(a).finalize(); this.reset(); return a };
sjcl.misc.pbkdf2 = function (a, b, c, d, e) { c = c || 1E4; if (0 > d || 0 > c) throw new sjcl.exception.invalid("invalid params to pbkdf2"); "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a)); "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b)); e = e || sjcl.misc.hmac; a = new e(a); var f, g, h, k, l = [], n = sjcl.bitArray; for (k = 1; 32 * l.length < (d || 1); k++) { e = f = a.encrypt(n.concat(b, [k])); for (g = 1; g < c; g++)for (f = a.encrypt(f), h = 0; h < f.length; h++)e[h] ^= f[h]; l = l.concat(e) } d && (l = n.clamp(l, d)); return l };
sjcl.prng = function (a) { this.c = [new sjcl.hash.sha256]; this.m = [0]; this.P = 0; this.H = {}; this.N = 0; this.U = {}; this.Z = this.f = this.o = this.ha = 0; this.b = [0, 0, 0, 0, 0, 0, 0, 0]; this.h = [0, 0, 0, 0]; this.L = void 0; this.M = a; this.D = !1; this.K = { progress: {}, seeded: {} }; this.u = this.ga = 0; this.I = 1; this.J = 2; this.ca = 0x10000; this.T = [0, 48, 64, 96, 128, 192, 0x100, 384, 512, 768, 1024]; this.da = 3E4; this.ba = 80 };
sjcl.prng.prototype = {
    randomWords: function (a, b) {
        var c = [], d; d = this.isReady(b); var e; if (d === this.u) throw new sjcl.exception.notReady("generator isn't seeded"); if (d & this.J) {
            d = !(d & this.I); e = []; var f = 0, g; this.Z = e[0] = (new Date).valueOf() + this.da; for (g = 0; 16 > g; g++)e.push(0x100000000 * Math.random() | 0); for (g = 0; g < this.c.length && (e = e.concat(this.c[g].finalize()), f += this.m[g], this.m[g] = 0, d || !(this.P & 1 << g)); g++); this.P >= 1 << this.c.length && (this.c.push(new sjcl.hash.sha256), this.m.push(0)); this.f -= f; f > this.o && (this.o =
                f); this.P++; this.b = sjcl.hash.sha256.hash(this.b.concat(e)); this.L = new sjcl.cipher.aes(this.b); for (d = 0; 4 > d && (this.h[d] = this.h[d] + 1 | 0, !this.h[d]); d++);
        } for (d = 0; d < a; d += 4)0 === (d + 1) % this.ca && y(this), e = z(this), c.push(e[0], e[1], e[2], e[3]); y(this); return c.slice(0, a)
    }, setDefaultParanoia: function (a, b) { if (0 === a && "Setting paranoia=0 will ruin your security; use it only for testing" !== b) throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing"); this.M = a }, addEntropy: function (a,
        b, c) {
            c = c || "user"; var d, e, f = (new Date).valueOf(), g = this.H[c], h = this.isReady(), k = 0; d = this.U[c]; void 0 === d && (d = this.U[c] = this.ha++); void 0 === g && (g = this.H[c] = 0); this.H[c] = (this.H[c] + 1) % this.c.length; switch (typeof a) {
                case "number": void 0 === b && (b = 1); this.c[g].update([d, this.N++, 1, b, f, 1, a | 0]); break; case "object": c = Object.prototype.toString.call(a); if ("[object Uint32Array]" === c) { e = []; for (c = 0; c < a.length; c++)e.push(a[c]); a = e } else for ("[object Array]" !== c && (k = 1), c = 0; c < a.length && !k; c++)"number" !== typeof a[c] &&
                    (k = 1); if (!k) { if (void 0 === b) for (c = b = 0; c < a.length; c++)for (e = a[c]; 0 < e;)b++ , e = e >>> 1; this.c[g].update([d, this.N++, 2, b, f, a.length].concat(a)) } break; case "string": void 0 === b && (b = a.length); this.c[g].update([d, this.N++, 3, b, f, a.length]); this.c[g].update(a); break; default: k = 1
            }if (k) throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"); this.m[g] += b; this.f += b; h === this.u && (this.isReady() !== this.u && A("seeded", Math.max(this.o, this.f)), A("progress", this.getProgress()))
    },
    isReady: function (a) { a = this.T[void 0 !== a ? a : this.M]; return this.o && this.o >= a ? this.m[0] > this.ba && (new Date).valueOf() > this.Z ? this.J | this.I : this.I : this.f >= a ? this.J | this.u : this.u }, getProgress: function (a) { a = this.T[a ? a : this.M]; return this.o >= a ? 1 : this.f > a ? 1 : this.f / a }, startCollectors: function () {
        if (!this.D) {
        this.a = { loadTimeCollector: B(this, this.ma), mouseCollector: B(this, this.oa), keyboardCollector: B(this, this.la), accelerometerCollector: B(this, this.ea), touchCollector: B(this, this.qa) }; if (window.addEventListener) window.addEventListener("load",
            this.a.loadTimeCollector, !1), window.addEventListener("mousemove", this.a.mouseCollector, !1), window.addEventListener("keypress", this.a.keyboardCollector, !1), window.addEventListener("devicemotion", this.a.accelerometerCollector, !1), window.addEventListener("touchmove", this.a.touchCollector, !1); else if (document.attachEvent) document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), document.attachEvent("keypress", this.a.keyboardCollector); else throw new sjcl.exception.bug("can't attach event");
            this.D = !0
        }
    }, stopCollectors: function () {
    this.D && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, !1), window.removeEventListener("mousemove", this.a.mouseCollector, !1), window.removeEventListener("keypress", this.a.keyboardCollector, !1), window.removeEventListener("devicemotion", this.a.accelerometerCollector, !1), window.removeEventListener("touchmove", this.a.touchCollector, !1)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), document.detachEvent("onmousemove",
        this.a.mouseCollector), document.detachEvent("keypress", this.a.keyboardCollector)), this.D = !1)
    }, addEventListener: function (a, b) { this.K[a][this.ga++] = b }, removeEventListener: function (a, b) { var c, d, e = this.K[a], f = []; for (d in e) e.hasOwnProperty(d) && e[d] === b && f.push(d); for (c = 0; c < f.length; c++)d = f[c], delete e[d] }, la: function () { C(this, 1) }, oa: function (a) { var b, c; try { b = a.x || a.clientX || a.offsetX || 0, c = a.y || a.clientY || a.offsetY || 0 } catch (d) { c = b = 0 } 0 != b && 0 != c && this.addEntropy([b, c], 2, "mouse"); C(this, 0) }, qa: function (a) {
        a =
        a.touches[0] || a.changedTouches[0]; this.addEntropy([a.pageX || a.clientX, a.pageY || a.clientY], 1, "touch"); C(this, 0)
    }, ma: function () { C(this, 2) }, ea: function (a) { a = a.accelerationIncludingGravity.x || a.accelerationIncludingGravity.y || a.accelerationIncludingGravity.z; if (window.orientation) { var b = window.orientation; "number" === typeof b && this.addEntropy(b, 1, "accelerometer") } a && this.addEntropy(a, 2, "accelerometer"); C(this, 0) }
};
function A(a, b) { var c, d = sjcl.random.K[a], e = []; for (c in d) d.hasOwnProperty(c) && e.push(d[c]); for (c = 0; c < e.length; c++)e[c](b) } function C(a, b) { "undefined" !== typeof window && window.performance && "function" === typeof window.performance.now ? a.addEntropy(window.performance.now(), b, "loadtime") : a.addEntropy((new Date).valueOf(), b, "loadtime") } function y(a) { a.b = z(a).concat(z(a)); a.L = new sjcl.cipher.aes(a.b) } function z(a) { for (var b = 0; 4 > b && (a.h[b] = a.h[b] + 1 | 0, !a.h[b]); b++); return a.L.encrypt(a.h) }
function B(a, b) { return function () { b.apply(a, arguments) } } sjcl.random = new sjcl.prng(6);
a: try {
    var D, E, F, G; if (G = "undefined" !== typeof module && module.exports) { var H; try { H = require("crypto") } catch (a) { H = null } G = E = H } if (G && E.randomBytes) D = E.randomBytes(128), D = new Uint32Array((new Uint8Array(D)).buffer), sjcl.random.addEntropy(D, 1024, "crypto['randomBytes']"); else if ("undefined" !== typeof window && "undefined" !== typeof Uint32Array) {
        F = new Uint32Array(32); if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(F); else if (window.msCrypto && window.msCrypto.getRandomValues) window.msCrypto.getRandomValues(F);
        else break a; sjcl.random.addEntropy(F, 1024, "crypto['getRandomValues']")
    }
} catch (a) { "undefined" !== typeof window && window.console && (console.log("There was an error collecting entropy from the browser:"), console.log(a)) }
sjcl.json = {
    defaults: { v: 1, iter: 1E4, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes" }, ja: function (a, b, c, d) {
        c = c || {}; d = d || {}; var e = sjcl.json, f = e.g({ iv: sjcl.random.randomWords(4, 0) }, e.defaults), g; e.g(f, c); c = f.adata; "string" === typeof f.salt && (f.salt = sjcl.codec.base64.toBits(f.salt)); "string" === typeof f.iv && (f.iv = sjcl.codec.base64.toBits(f.iv)); if (!sjcl.mode[f.mode] || !sjcl.cipher[f.cipher] || "string" === typeof a && 100 >= f.iter || 64 !== f.ts && 96 !== f.ts && 128 !== f.ts || 128 !== f.ks && 192 !== f.ks && 0x100 !== f.ks || 2 > f.iv.length ||
            4 < f.iv.length) throw new sjcl.exception.invalid("json encrypt: invalid parameters"); "string" === typeof a ? (g = sjcl.misc.cachedPbkdf2(a, f), a = g.key.slice(0, f.ks / 32), f.salt = g.salt) : sjcl.ecc && a instanceof sjcl.ecc.elGamal.publicKey && (g = a.kem(), f.kemtag = g.tag, a = g.key.slice(0, f.ks / 32)); "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b)); "string" === typeof c && (f.adata = c = sjcl.codec.utf8String.toBits(c)); g = new sjcl.cipher[f.cipher](a); e.g(d, f); d.key = a; f.ct = "ccm" === f.mode && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm &&
                b instanceof ArrayBuffer ? sjcl.arrayBuffer.ccm.encrypt(g, b, f.iv, c, f.ts) : sjcl.mode[f.mode].encrypt(g, b, f.iv, c, f.ts); return f
    }, encrypt: function (a, b, c, d) { var e = sjcl.json, f = e.ja.apply(e, arguments); return e.encode(f) }, ia: function (a, b, c, d) {
        c = c || {}; d = d || {}; var e = sjcl.json; b = e.g(e.g(e.g({}, e.defaults), b), c, !0); var f, g; f = b.adata; "string" === typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt)); "string" === typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv)); if (!sjcl.mode[b.mode] || !sjcl.cipher[b.cipher] || "string" ===
            typeof a && 100 >= b.iter || 64 !== b.ts && 96 !== b.ts && 128 !== b.ts || 128 !== b.ks && 192 !== b.ks && 0x100 !== b.ks || !b.iv || 2 > b.iv.length || 4 < b.iv.length) throw new sjcl.exception.invalid("json decrypt: invalid parameters"); "string" === typeof a ? (g = sjcl.misc.cachedPbkdf2(a, b), a = g.key.slice(0, b.ks / 32), b.salt = g.salt) : sjcl.ecc && a instanceof sjcl.ecc.elGamal.secretKey && (a = a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0, b.ks / 32)); "string" === typeof f && (f = sjcl.codec.utf8String.toBits(f)); g = new sjcl.cipher[b.cipher](a); f = "ccm" ===
                b.mode && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm && b.ct instanceof ArrayBuffer ? sjcl.arrayBuffer.ccm.decrypt(g, b.ct, b.iv, b.tag, f, b.ts) : sjcl.mode[b.mode].decrypt(g, b.ct, b.iv, f, b.ts); e.g(d, b); d.key = a; return 1 === c.raw ? f : sjcl.codec.utf8String.fromBits(f)
    }, decrypt: function (a, b, c, d) { var e = sjcl.json; return e.ia(a, e.decode(b), c, d) }, encode: function (a) {
        var b, c = "{", d = ""; for (b in a) if (a.hasOwnProperty(b)) {
            if (!b.match(/^[a-z0-9]+$/i)) throw new sjcl.exception.invalid("json encode: invalid property name"); c += d + '"' +
                b + '":'; d = ","; switch (typeof a[b]) { case "number": case "boolean": c += a[b]; break; case "string": c += '"' + escape(a[b]) + '"'; break; case "object": c += '"' + sjcl.codec.base64.fromBits(a[b], 0) + '"'; break; default: throw new sjcl.exception.bug("json encode: unsupported type"); }
        } return c + "}"
    }, decode: function (a) {
        a = a.replace(/\s/g, ""); if (!a.match(/^\{.*\}$/)) throw new sjcl.exception.invalid("json decode: this isn't json!"); a = a.replace(/^\{|\}$/g, "").split(/,/); var b = {}, c, d; for (c = 0; c < a.length; c++) {
            if (!(d = a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))) throw new sjcl.exception.invalid("json decode: this isn't json!");
            null != d[3] ? b[d[2]] = parseInt(d[3], 10) : null != d[4] ? b[d[2]] = d[2].match(/^(ct|adata|salt|iv)$/) ? sjcl.codec.base64.toBits(d[4]) : unescape(d[4]) : null != d[5] && (b[d[2]] = "true" === d[5])
        } return b
    }, g: function (a, b, c) { void 0 === a && (a = {}); if (void 0 === b) return a; for (var d in b) if (b.hasOwnProperty(d)) { if (c && void 0 !== a[d] && a[d] !== b[d]) throw new sjcl.exception.invalid("required parameter overridden"); a[d] = b[d] } return a }, sa: function (a, b) { var c = {}, d; for (d in a) a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d]); return c }, ra: function (a,
        b) { var c = {}, d; for (d = 0; d < b.length; d++)void 0 !== a[b[d]] && (c[b[d]] = a[b[d]]); return c }
}; sjcl.encrypt = sjcl.json.encrypt; sjcl.decrypt = sjcl.json.decrypt; sjcl.misc.pa = {}; sjcl.misc.cachedPbkdf2 = function (a, b) { var c = sjcl.misc.pa, d; b = b || {}; d = b.iter || 1E3; c = c[a] = c[a] || {}; d = c[d] = c[d] || { firstSalt: b.salt && b.salt.length ? b.salt.slice(0) : sjcl.random.randomWords(2, 0) }; c = void 0 === b.salt ? d.firstSalt : b.salt; d[c] = d[c] || sjcl.misc.pbkdf2(a, c, b.iter); return { key: d[c].slice(0), salt: c.slice(0) } };
"undefined" !== typeof module && module.exports && (module.exports = sjcl); "function" === typeof define && define([], function () { return sjcl });

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) {
if (typeof define === 'function' && define.amd) {
 // AMD. Register as an anonymous module.
 define(['jquery'], factory);
 } else if (typeof exports === 'object') {
 // Node/CommonJS
 factory(require('jquery'));
 } else {
 // Browser globals
 factory(window.jQuery || window.Zepto);
 }
 }(function($) {

/*>>core*/
/**
 *
 * Magnific Popup Core JS file
 *
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true;
		}

		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}

		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin.
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) {
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}

		mfp.types = [];
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data );
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}


		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}



		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}



		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}

		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();


		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}



		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);

		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;

		// Wait for next cycle to allow CSS transition
		setTimeout(function() {

			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}

			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}

		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},

	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/







/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/




 _checkInstance(); }));

/* store.js - Copyright (c) 2010-2017 Marcus Westin */
!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { var t; t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.store = e() } }(function () { return function e(t, n, r) { function o(a, u) { if (!n[a]) { if (!t[a]) { var s = "function" == typeof require && require; if (!u && s) return s(a, !0); if (i) return i(a, !0); var c = new Error("Cannot find module '" + a + "'"); throw c.code = "MODULE_NOT_FOUND", c } var f = n[a] = { exports: {} }; t[a][0].call(f.exports, function (e) { var n = t[a][1][e]; return o(n ? n : e) }, f, f.exports, e, t, n, r) } return n[a].exports } for (var i = "function" == typeof require && require, a = 0; a < r.length; a++)o(r[a]); return o }({ 1: [function (e, t, n) { "use strict"; var r = e("../src/store-engine"), o = [e("../storages/localStorage"), e("../storages/sessionStorage"), e("../storages/cookieStorage"), e("../storages/memoryStorage")], i = []; t.exports = r.createStore(o, i) }, { "../src/store-engine": 2, "../storages/cookieStorage": 4, "../storages/localStorage": 5, "../storages/memoryStorage": 6, "../storages/sessionStorage": 7 }], 2: [function (e, t, n) { "use strict"; function r() { var e = "undefined" == typeof console ? null : console; if (e) { var t = e.warn ? e.warn : e.log; t.apply(e, arguments) } } function o(e, t, n) { n || (n = ""), e && !l(e) && (e = [e]), t && !l(t) && (t = [t]); var o = n ? "__storejs_" + n + "_" : "", i = n ? new RegExp("^" + o) : null, h = /^[a-zA-Z0-9_\-]*$/; if (!h.test(n)) throw new Error("store.js namespaces can only have alphanumerics + underscores and dashes"); var v = { _namespacePrefix: o, _namespaceRegexp: i, _testStorage: function (e) { try { var t = "__storejs__test__"; e.write(t, t); var n = e.read(t) === t; return e.remove(t), n } catch (r) { return !1 } }, _assignPluginFnProp: function (e, t) { var n = this[t]; this[t] = function () { function t() { if (n) return s(arguments, function (e, t) { r[t] = e }), n.apply(o, r) } var r = a(arguments, 0), o = this, i = [t].concat(r); return e.apply(o, i) } }, _serialize: function (e) { return JSON.stringify(e) }, _deserialize: function (e, t) { if (!e) return t; var n = ""; try { n = JSON.parse(e) } catch (r) { n = e } return void 0 !== n ? n : t }, _addStorage: function (e) { this.enabled || this._testStorage(e) && (this.storage = e, this.enabled = !0) }, _addPlugin: function (e) { var t = this; if (l(e)) return void s(e, function (e) { t._addPlugin(e) }); var n = u(this.plugins, function (t) { return e === t }); if (!n) { if (this.plugins.push(e), !p(e)) throw new Error("Plugins must be function values that return objects"); var r = e.call(this); if (!g(r)) throw new Error("Plugins must return an object of function properties"); s(r, function (n, r) { if (!p(n)) throw new Error("Bad plugin property: " + r + " from plugin " + e.name + ". Plugins should only return functions."); t._assignPluginFnProp(n, r) }) } }, addStorage: function (e) { r("store.addStorage(storage) is deprecated. Use createStore([storages])"), this._addStorage(e) } }, m = f(v, d, { plugins: [] }); return m.raw = {}, s(m, function (e, t) { p(e) && (m.raw[t] = c(m, e)) }), s(e, function (e) { m._addStorage(e) }), s(t, function (e) { m._addPlugin(e) }), m } var i = e("./util"), a = i.slice, u = i.pluck, s = i.each, c = i.bind, f = i.create, l = i.isList, p = i.isFunction, g = i.isObject; t.exports = { createStore: o }; var d = { version: "2.0.12", enabled: !1, get: function (e, t) { var n = this.storage.read(this._namespacePrefix + e); return this._deserialize(n, t) }, set: function (e, t) { return void 0 === t ? this.remove(e) : (this.storage.write(this._namespacePrefix + e, this._serialize(t)), t) }, remove: function (e) { this.storage.remove(this._namespacePrefix + e) }, each: function (e) { var t = this; this.storage.each(function (n, r) { e.call(t, t._deserialize(n), (r || "").replace(t._namespaceRegexp, "")) }) }, clearAll: function () { this.storage.clearAll() }, hasNamespace: function (e) { return this._namespacePrefix == "__storejs_" + e + "_" }, createStore: function () { return o.apply(this, arguments) }, addPlugin: function (e) { this._addPlugin(e) }, namespace: function (e) { return o(this.storage, this.plugins, e) } } }, { "./util": 3 }], 3: [function (e, t, n) { (function (e) { "use strict"; function n() { return Object.assign ? Object.assign : function (e, t, n, r) { for (var o = 1; o < arguments.length; o++)u(Object(arguments[o]), function (t, n) { e[n] = t }); return e } } function r() { if (Object.create) return function (e, t, n, r) { var o = a(arguments, 1); return g.apply(this, [Object.create(e)].concat(o)) }; var e = function () { }; return function (t, n, r, o) { var i = a(arguments, 1); return e.prototype = t, g.apply(this, [new e].concat(i)) } } function o() { return String.prototype.trim ? function (e) { return String.prototype.trim.call(e) } : function (e) { return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") } } function i(e, t) { return function () { return t.apply(e, Array.prototype.slice.call(arguments, 0)) } } function a(e, t) { return Array.prototype.slice.call(e, t || 0) } function u(e, t) { c(e, function (e, n) { return t(e, n), !1 }) } function s(e, t) { var n = f(e) ? [] : {}; return c(e, function (e, r) { return n[r] = t(e, r), !1 }), n } function c(e, t) { if (f(e)) { for (var n = 0; n < e.length; n++)if (t(e[n], n)) return e[n] } else for (var r in e) if (e.hasOwnProperty(r) && t(e[r], r)) return e[r] } function f(e) { return null != e && "function" != typeof e && "number" == typeof e.length } function l(e) { return e && "[object Function]" === {}.toString.call(e) } function p(e) { return e && "[object Object]" === {}.toString.call(e) } var g = n(), d = r(), h = o(), v = "undefined" != typeof window ? window : e; t.exports = { assign: g, create: d, trim: h, bind: i, slice: a, each: u, map: s, pluck: c, isList: f, isFunction: l, isObject: p, Global: v } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 4: [function (e, t, n) { "use strict"; function r(e) { if (!e || !s(e)) return null; var t = "(?:^|.*;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"; return unescape(p.cookie.replace(new RegExp(t), "$1")) } function o(e) { for (var t = p.cookie.split(/; ?/g), n = t.length - 1; n >= 0; n--)if (l(t[n])) { var r = t[n].split("="), o = unescape(r[0]), i = unescape(r[1]); e(i, o) } } function i(e, t) { e && (p.cookie = escape(e) + "=" + escape(t) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/") } function a(e) { e && s(e) && (p.cookie = escape(e) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/") } function u() { o(function (e, t) { a(t) }) } function s(e) { return new RegExp("(?:^|;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(p.cookie) } var c = e("../src/util"), f = c.Global, l = c.trim; t.exports = { name: "cookieStorage", read: r, write: i, each: o, remove: a, clearAll: u }; var p = f.document }, { "../src/util": 3 }], 5: [function (e, t, n) { "use strict"; function r() { return f.localStorage } function o(e) { return r().getItem(e) } function i(e, t) { return r().setItem(e, t) } function a(e) { for (var t = r().length - 1; t >= 0; t--) { var n = r().key(t); e(o(n), n) } } function u(e) { return r().removeItem(e) } function s() { return r().clear() } var c = e("../src/util"), f = c.Global; t.exports = { name: "localStorage", read: o, write: i, each: a, remove: u, clearAll: s } }, { "../src/util": 3 }], 6: [function (e, t, n) { "use strict"; function r(e) { return s[e] } function o(e, t) { s[e] = t } function i(e) { for (var t in s) s.hasOwnProperty(t) && e(s[t], t) } function a(e) { delete s[e] } function u(e) { s = {} } t.exports = { name: "memoryStorage", read: r, write: o, each: i, remove: a, clearAll: u }; var s = {} }, {}], 7: [function (e, t, n) { "use strict"; function r() { return f.sessionStorage } function o(e) { return r().getItem(e) } function i(e, t) { return r().setItem(e, t) } function a(e) { for (var t = r().length - 1; t >= 0; t--) { var n = r().key(t); e(o(n), n) } } function u(e) { return r().removeItem(e) } function s() { return r().clear() } var c = e("../src/util"), f = c.Global; t.exports = { name: "sessionStorage", read: o, write: i, each: a, remove: u, clearAll: s } }, { "../src/util": 3 }] }, {}, [1])(1) });

$.fn.tabify = function (options) {
    "use strict";
    if (this.length > 0) {
        var defaults = {
                tab:                ".tabbed-section__navigation a",
                body:               ".tabbed-section__body",
                tab_active:         "current-tab",
                body_active:        "tabbed-section__body--active",
                init_class:         "tabbed-section--active",
                first_tab:          false,
                equalize_height:    false,
                on_change:          function () { return null; }
            },
            wrapper =       this,
            settings =      $.extend({}, defaults, options),
            tabs =          wrapper.find(settings.tab),
            tab_bodies =    wrapper.find(settings.body),
            find_body = function (tab) {
                var selector = tab.attr("href") || tab.data("target") || tab.find("a").attr("href"),
                    body = $(selector);

                if (body.length === 1) {
                    return body;
                }
                console.log("Invalid tab body. Your selector was " + selector);
                return false;
            },
            find_tab = function (body) {
                var id = body.attr("id");
                return tabs.filter(function () {
                    if ($(this).is("[href=#" + id + "], [data-target=#" + id + "]") || $(this).find("a").is("[href=#" + id + "]")) {
                        return true;
                    }
                    return false;
                });
            },
            change_tab = function (new_tab, push) {
                var new_body = find_body(new_tab);
                if (push === undefined) {
                    push = true;
                }
                if (new_body !== false) {
                    tabs.removeClass(settings.tab_active);
                    tab_bodies.removeClass(settings.body_active);
                    new_tab.addClass(settings.tab_active);
                    new_body.addClass(settings.body_active);

                    if (push && history.pushState) {
                        history.pushState(null, null, "#" + new_body.attr("id"));
                    }

                    settings.on_change(new_tab, new_body);
                }
            },
            initial_tab = function () {
                var hash_target_tab = tab_bodies.filter(location.hash),
                    hash_target_tab_body = tab_bodies.find(location.hash).closest(settings.body);
                if (location.hash && hash_target_tab.length > 0) {
                    return find_tab(hash_target_tab);
                }
                if (location.hash && hash_target_tab_body.length > 0) {
                    return find_tab(hash_target_tab_body);
                }
                if (settings.first_tab) {
                    return settings.first_tab;
                }
                return tabs.first();
            };

        if (tab_bodies.length > 1) {
            wrapper.addClass(settings.init_class);
            change_tab(initial_tab(), false);

            if (settings.equalize_height) {
                tab_bodies.equal_height();
            }

            tabs
                .click(function (e) {
                    e.preventDefault();
                    change_tab($(this), true);
                })
                .add(tabs.find("a"))
                .data("no_scroll", true);

            tab_bodies
                .each(function () {
                    var body = $(this),
                        anchors = $("a[href*=#" + body.attr("id") + "]").not(tabs);

                    anchors
                        .data("no_scroll", true)
                        .click(function (e) {
                            e.preventDefault();
                            change_tab(find_tab(body), true);
                        });
                });
        } else if (tab_bodies.length === 1) {
            tabs.closest(".widget-span").hide();
        } else {
            $(this).addClass("tabbed-section--empty");
        }
    }
    return this;
};

////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
    // UI Scripts - general functions not related to core app
    // WEBAPP Scripts
        // global variables
        // FUNCTIONS
            // Take Screenshot Test
            // Get Test Results
            // Parse Results for Test Variables
            // Parse Results for Individual Result Variables
            // Pass Results to Google Sheets
            // Create New Google Sheet
            // Handle Clicks
            // Handle Google Sign In
////////////////////////////////////////////////////////////////
   
// UI Scripts

// TABS : SIDE PANEL CLOSE
$(document).ready(function () {
    $("div.tab-content").not("[data-tab=1]").addClass("hide"),
        $(".tabs-nav li").first().addClass("active"),
        $(".tabs-nav li").on("click", function () {
            $(this).addClass("active"),
                $(".tabs-nav li").not(this).removeClass("active");
            var a = $(this).attr("data-tab");
            $("div[data-tab = " + a + "]").removeClass("hide"),
                $("div.tab-content").not("[data-tab=" + a + "]").addClass("hide")
        }),
        $("li[data-tab=all]").on("click", function () {
            $(this).addClass("active"),
                $("div.tab-content").removeClass("hide")
        });
    $(".close").on("click", function () {
        $(".side-panel").animate({ "width": "toggle" });
    });
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var clearStorage = function() {
    console.log(store.get("created"));
    store.clearAll();
    console.log("cleared");
    console.log(store.get("created"));
}

var compare = function() {
    var url = $("input[name=compare_url]").val(),
        imgSrc = $("input[name=drive_id]").val();
    localStorage.setItem("image_source", imgSrc);
    window.open("compare.html?url=" + url);
};

   
// WEBAPP Scripts

// GLOBAL VARIABLES
var username = "social@lyntonweb.com", //email address for your account
    password = "u0856709d93976a5", //authkey for your account
    test = null,
    newSpreadsheetId = null,
    resultsSheetId = null,
    newSpreadsheetUrl = null,
    firstSheetId = null,
    getDataClicked = false;

// CALL STANDARD SCREENSHOT TEST API
var ScreenshotTestApi = function(username, password) {
    this.baseUrl = "https://" + username + ":" + password + "@crossbrowsertesting.com/api/v3/screenshots";
    this.basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    this.currentTest = null;
    this.allBrowsers = [];
    this.callApi = function (url, method, params, callback) {
        var self = this;
        $.ajax({
            type: method,
            url: url,
            data: params,
            dataType: "json",
            async: false,
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader('Authorization', "Basic " + self.basicAuth);
            },
            success: function (data) {
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                throw "Failed: " + textStatus
            }
        });
    };
    this.startNewTest = function (params, callback) {
        var self = this;
        self.callApi(this.baseUrl, "POST", params, function (data) {
            self.log('new test started successfully', data)
            self.currentTest = data;
            $("#results").append("<div>Success! Test completed</div>");
            callback();
        });
    };
    this.getTestId = function () {
        return this.currentTest.screenshot_test_id;
    };
    this.log = function (text) {
        if (window.console) console.log(text);
    };
};

// RUN NEW SCREENSHOT TEST
var runNewTest = function() {
    $(".side-panel").animate({ "width": "toggle" });
    $("#results").html("<p>Running Screenshot Test on " + $("input[name=url]").val() + "</p>");
    var screenshot = new ScreenshotTestApi(username, password),
        resultsQuery = "?type=fullpage&size=small",
        params = {
            url: $("input[name=url]").val(),
            browser_list_name: "lw_custom"
        };
    screenshot.startNewTest(params, function () {
        $("#results").append("<p>New Test ID: <strong><span id='test_id'>" + screenshot.getTestId() + "</p><strong>");
        $("#results").append("<br><br><p><a class='button button--delta' href='https://app.crossbrowsertesting.com/screenshots/" + screenshot.getTestId() + resultsQuery + "' target='_blank'>View Test on CBT</a></p>");
        $("#results").append("<br><br><button class='button' type='button' onclick='location.href=location.href'>Start Over</button>");
    });
};

// GET RAW SCREENSHOT TEST RESULTS AND CHECK STORED CLIENTS
var getResults = function () {
    var ssBaseUrl = "https://crossbrowsertesting.com/api/v3/screenshots/";
    var username = "social@lyntonweb.com";
    var password = "u0856709d93976a5";
    var basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    var testData = null;
    var test_id = $("input[name=test_id]").val(),
        version_id = $("input[name=version_id]").val(),
        client_slug = $("input[name=client-slug]").val(),
        page_slug = $("input[name=page-slug]").val(),
        loader = $(".loader"),
        loader_wrap = $(".loader__wrapper");

    var xhr = new XMLHttpRequest();
    if (version_id != null) {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id + "/" + version_id, true);
    } else {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id, true);
    }
    xhr.setRequestHeader('Authorization', "Basic " + basicAuth);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
            console.log("reqest initiated");
        } else if (xhr.readyState == 2) {
            $(".side-panel").animate({ "width": "toggle" });
            $("#results").html("<h4>Getting test data from CrossBrowserTesting.com</h4>");
            loader.addClass("show-loader");
            loader.addClass("animate-loader");
        } else if (xhr.readyState == 3) {
            $("#results").append("<p>Processing...</p>");
        } else if (xhr.readyState == 4) {
            $("#results").append("<p>Success! Data is now ready for transfer to Sheets</p><br>");
            var test = JSON.parse(xhr.responseText);
            buildDoc(test);
        } else {
            console.log("Something went wrong");
        }
    };
};

// LOOP STORED CLIENTS AND CREATE EITHER ADD TO OR CREATE A NEW SHEET OR DOC
/*
var loopCreatedDocs = function (client_slug, page_slug, test) {
    var spreadsheet = store.get("sheets");
    if (spreadsheet == "undefined") {
        store.each(function(key, values) {
            var client = key.created_test[0].slug,
                page = key.created_test[0].page;
            if (client_slug == client) {
                var sheetVars = parseResultsOne(test);
                addNewDocSheet(spreadsheet, page, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
            } else if (client_slug == client && page_slug == page) {
                var client_spreadsheet = store.get(client_slug)
                parseResultsTwo(test, client_spreadsheet);
            } 
        });
    }
    else {
        buildDoc(test);
    }
};
*/

// ADD NEW SHEET TO CREATED DOC
var addNewDocSheet = function (spreadsheetId, page_slug, url, show_url, date, count, version_id) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var formattedDate = date.split("T")[0];
    var batchUpdateValuesRequestBody = {
        valueInputOption: 'USER_ENTERED',
        responseValueRenderOption: "FORMULA",
        sheet: {
            properties: {
                "title": page_slug
            }
        },
        data: [
            {
                "majorDimension": "ROWS",
                "range": "A1:A6",
                "values": [
                    [
                        "=HYPERLINK(\"" + url + "\", \"" + page_slug + "\")"
                    ],
                    [
                        "=HYPERLINK(\"" + show_url + "\", \"View Test\")"
                    ],
                    [
                        "=DATEVALUE(\"" + formattedDate + "\")"
                    ],
                    [
                        "=T(\"" + count + "\")"
                    ],
                    [
                        "=T(\"" + version_id + "\")"
                    ],
                    [
                        "=T(\"" + "pass_percentage" + "\")"
                    ]
                ]
            },
            {
                "majorDimension": "COLUMNS",
                "range": "A9:E",
                "values": [
                    [
                        "Result"
                    ],
                    [
                        "OS"
                    ],
                    [
                        "Browser"
                    ],
                    [
                        "Resolution"
                    ],
                    [
                        "Tags"
                    ]
                ]
            }
        ]
    };
    var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
    request.then(function (response) {
        $("#results").append("<p>Data successfully populated!</p><br>");
        $(".loader").removeClass("animate-loader");
        $(".loader").removeClass("show-loader");
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};

// PARSE SCREENSHOT TEST RESULTS -- GET TEST VARIABLES
var parseResultsOne = function (test) {
    var count = test.version_count,
        id = test.screenshot_test_id,
        date = test.created_date,
        url = test.url,
        result_count = test.versions[0].result_count.successful,
        result_total = test.versions[0].result_count.total,
        version_id = test.versions[0].version_id,
        show_url = test.versions[0].show_results_web_url,
        tags = test.versions[0].tags;

    var results = $.makeArray(test.versions[0].results);
    var testArray = {
        url,
        show_url,
        date,
        count,
        version_id
    };
    return testArray;
}

// PARSE SCREENSHOT TEST RESULTS -- GET RESULTS VARIABLES
var parseResultsTwo = function (test, spreadsheetId, sheetId, page_slug) {
    var allResults = function () {
        var results = test.versions[0].results;
        var abbrResults = test.versions[0].results.slice(0,10);
        var total_results = results.length;
        var resolution_slug = null;
        $.each(results, function (key, value) {
            var evalResolution = function () {
                var resolution = value.resolution.name;
                var screenWidth = resolution.split("x")[0];
                if (screenWidth > 1919) {
                    resolution_slug = "large desktop";
                } else if (screenWidth > 1365) {
                    resolution_slug = "desktop";
                } else if (screenWidth > 767) {
                    resolution_slug = "tablet";
                } else {
                    resolution_slug = "mobile";
                }
            };
            evalResolution();
            setTimeout(populateResults(spreadsheetId, value.result_id, value.os.name, value.browser.name, value.resolution.name, resolution_slug, value.tags, value.show_result_web_url, value.launch_live_test_url), 5000);
            if (key === (total_results - 1)) {
                $("#results").append("<p>Populating data from " + $("input[name=page-slug]").val() + " Test...</p>");
            }
        });
    };
    allResults();
    $("#results").append("<strong>Your documentation is ready!</strong>");
    $("#results").append("<br><a href='" + newSpreadsheetUrl + "' target='_blank' class='button'>View Spreadsheet</a>");
    $(".loader").removeClass("animate-loader");
    $(".loader").removeClass("show-loader");
};

// FORMAT SHEET
var formatSheet = function (spreadsheetId, sheetId) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var headerRange = {
        "sheetId": sheetId,
        "startRowIndex": 1,
        "endColumnIndex": 10,
        "endRowIndex": 2,
        "startColumnIndex": 0
    };
    var resultsRange = {
        "sheetId": sheetId,
        "startRowIndex": 9,
        "endColumnIndex": 10,
        "endRowIndex": 500,
        "startColumnIndex": 0
    };
    var requests = [{
            "addConditionalFormatRule": {
                "rule": {
                    "booleanRule": {
                        "condition": {
                            "type": "NOT_BLANK"
                        },
                        "format": {
                            "backgroundColor": {
                                "alpha": 0.8,
                                "blue": 0.871,
                                "green": 0.871,
                                "red": 0.871
                            },
                            "textFormat": {
                                "bold": true
                            }
                        }
                    },
                    "ranges": [ headerRange ]
                }
            }
        },
        {
        "addConditionalFormatRule": {
            "rule": {
                "booleanRule": {
                    "condition": {
                        "type": "TEXT_CONTAINS",
                        "values": {
                            "userEnteredValue": "pass"
                        }
                    },
                    "format": {
                        "backgroundColor": {
                            "alpha": .3,
                            "blue": 0.498,
                            "green": 0.718,
                            "red": 0.494
                        },
                        "textFormat": {
                            "bold": true
                        }
                    }
                },
                "ranges": [ resultsRange ]
            }
        }
    }];
    var body = {
        requests
    };
    var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
    request.then(function (response) {
        var result = response.result;
        console.log(`${result.replies.length} cells updated.`);
        $("#results").append("<p>Data successfully formatted!</p><br>");
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};

// CREATE NAMED RANGE IN SHEET
var nameRange = function (spreadsheetId, sheetId) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var requests = [{
        "addNamedRange": {
            "namedRange": {
                "name": "Results",
                "range": {
                    "sheetId": sheetId,
                    "startRowIndex": 8,
                    "endRowIndex": 500,
                    "startColumnIndex": 0,
                    "endColumnIndex": 10,
                },
            }
        }
    }];
    var body = {
        requests
    };
    var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
    request.then(function (response) {
        var result = response.result;
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};


// PASS RESULTS TO GOOGLE SHEET
var populateResults = function (spreadsheetId, result_id, result_os, result_browser, result_resolution, resolution_slug, result_tags, result_url, live_url) {
    var params = {
        spreadsheetId: spreadsheetId,
        valueInputOption: 'USER_ENTERED',
        responseValueRenderOption: "FORMULA",
        insertDataOption: "INSERT_ROWS",
        range: "10:500"
    };
    var valueRangeBody = {
        "majorDimension": "COLUMNS",
        "range": "10:500",
        "values": [
            [
                "=HYPERLINK(\"" + result_url + "\", \"" + result_id + "\")"
            ],
            [
                "=T(\"" + result_os + "\")"
            ],
            [
                "=T(\"" + result_browser + "\")"
            ],
            [
                "=T(\"" + result_resolution + "\")"
            ],
            [
                "=T(\"" + resolution_slug + "\")"
            ],
            [
                "=T(\"" + result_tags + "\")"
            ],
            [
                "=HYPERLINK(\"" + live_url + "\", \"Start Live Test\" )"
            ]
        ]
    };
    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function (response) {
       console.log("results passed successfully")
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};

// CREATE SPREADSHEET AND POPULATE WITH TEST VARIABLES
var buildDoc = function (test) {
    var page_slug = $("input[name=page-slug]").val(),
        client_slug = $("input[name=client-slug]").val();

    var createSheet = function (title) {
        var spreadsheetBody = {
            properties: {
                "title": title
            },
            sheets: [
                {
                    properties: {
                        "title": page_slug
                    }
                },
                {
                    properties: {
                        "title": "results"
                    }
                }
            ]
        };
        var createRequest = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        createRequest.then(function (response) {
            newSpreadsheetUrl = response.result.spreadsheetUrl;
            var firstSheetObj = response.result.sheets[0];
            var resultsSheetObj = response.result.sheets[1];
            var firstSheetId = firstSheetObj.properties.sheetId;
            var resultsSheetId = resultsSheetObj.properties.sheetId;
            $("#results").append("<h4>New Sheet Created for " + client_slug + "</h4>");
            newSpreadsheetId = response.result.spreadsheetId;
            var sheetVars = parseResultsOne(test);
            store.set("created", {
                "created_test": [
                    {
                        "slug": client_slug,
                        "page": page_slug
                    }
                ]
            });
            store.set("sheets", {
                client_slug: [
                    {
                        "sheet": newSpreadsheetId
                    }
                ]
            });
            nameRange(newSpreadsheetId, firstSheetId);
            populateNewSheet(newSpreadsheetId, page_slug, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
            setTimeout(parseResultsTwo(test, newSpreadsheetId, firstSheetId), 5000);
            formatSheet(newSpreadsheetId, resultsSheetId);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    };
    
    
    var populateNewSheet = function (spreadsheetId, page_slug, url, show_url, date, count, version_id) {
        var params = {
            spreadsheetId: spreadsheetId
        };
        var formattedDate = date.split("T")[0];
        var batchUpdateValuesRequestBody = {
            valueInputOption: 'USER_ENTERED',
            responseValueRenderOption: "FORMULA",
            data: [
                {
                    "majorDimension": "ROWS",
                    "range": page_slug + "!A1:A6",
                    "values": [
                        [
                            "=HYPERLINK(\"" + url + "\", \"" + page_slug + "\")"
                        ],
                        [
                            "=HYPERLINK(\"" + show_url + "\", \"View Test\")"
                        ],
                        [
                            "=T(\"Date: " + formattedDate + "\")"
                        ],
                        [
                            "=T(\"Version #: " + count + "\")"
                        ],
                        [
                            "=T(\"Version ID: " + version_id + "\")"
                        ]
                    ]
                },
                {
                    "majorDimension": "COLUMNS",
                    "range": "results!A2:I",
                    "values": [
                        [
                            "Result"
                        ],
                        [
                            "OS"
                        ],
                        [
                            "Browser"
                        ],
                        [
                            "Resolution"
                        ],
                        [
                            "Device"
                        ],
                        [
                            "Tags"
                        ],
                        [
                            "Live Tests"
                        ],
                        [
                            "Status"
                        ],
                        [
                            "Notes"
                        ]
                    ]
                },
                {
                    "majorDimension": "ROWS",
                    "range": "results!A1:3",
                    "values": [
                        [
                            "Results"
                        ],
                        [
                            " "
                        ],
                        [
                            "=SORT(Results , 6, true, 5, true, 3, true)"
                        ]
                    ]
                }
            ]
        };
        var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
        request.then(function (response) {
            $("#results").append("<p>Data successfully populated!</p><br>");
            $(".loader").removeClass("animate-loader");
            $(".loader").removeClass("show-loader");
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    };

    createSheet(client_slug + " QA Documentation", page_slug);
};

// START DOCUMENTATION CLICK HANDLER
var startDoc = function () {
    getResults();
};

// GOOGLE API HANDLER
function initClient() {
    var API_KEY = 'AIzaSyA09kGmIzbCL37IQt5fGIP1NFwESZH99SE';
    var CLIENT_ID = '407152186767-6qr0jchv3iop1vc14agbmm5t1qa3fgtc.apps.googleusercontent.com';
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn && getDataClicked) {
        handleData();
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

$('#kanban').kanban({
    titles: ['Task', 'Estimate', 'Complete', 'Invoiced', 'Paid'],
    colours: ['#00aaff', '#ff921d', '#00ff40', '#ffe54b', '#8454ff'],
    items: [
        {
            id: 1,
            title: 'Test',
            block: 'Task',
            link: '[URL]',
            link_text: 'TEST001',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 2,
            title: 'Test 2',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 3,
            title: 'Test 3',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 4,
            title: 'Test 5',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 5,
            title: 'Test 5',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
    ]
});