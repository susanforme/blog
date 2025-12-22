var I = (e) => {
  throw TypeError(e);
};
var D = (e, r, t) => r.has(e) || I("Cannot " + t);
var o = (e, r, t) => (D(e, r, "read from private field"), t ? t.call(e) : r.get(e)), u = (e, r, t) => r.has(e) ? I("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(e) : r.set(e, t), d = (e, r, t, i) => (D(e, r, "write to private field"), i ? i.call(e, t) : r.set(e, t), t), L = (e, r, t) => (D(e, r, "access private method"), t);
var v = (e, r, t) => new Promise((i, n) => {
  var w = (a) => {
    try {
      h(t.next(a));
    } catch (f) {
      n(f);
    }
  }, c = (a) => {
    try {
      h(t.throw(a));
    } catch (f) {
      n(f);
    }
  }, h = (a) => a.done ? i(a.value) : Promise.resolve(a.value).then(w, c);
  h((t = t.apply(e, r)).next());
});
var l = /* @__PURE__ */ ((e) => (e[e.INIT = 0] = "INIT", e[e.DECODE = 1] = "DECODE", e[e.FREE = 2] = "FREE", e))(l || {}), s, E, m, P;
const p = class p {
  constructor() {
    u(this, m);
    u(this, s);
    u(this, E, !1);
    p.workPort ? d(this, s, p.workPort) : d(this, s, new Worker(
      new URL(
        /* @vite-ignore */
        "" + new URL("assets/load.worker.js", import.meta.url).href,
        import.meta.url
      ),
      { type: "module" }
    ));
  }
  init() {
    return v(this, null, function* () {
      if (!o(this, E))
        return new Promise((r, t) => {
          if (!o(this, s)) throw new Error("Worker未创建");
          const i = (n) => {
            const { type: w, success: c, error: h } = n.data;
            w === l.INIT && (o(this, s).removeEventListener(
              "message",
              i
            ), c ? (d(this, E, !0), r()) : t(new Error(h)));
          };
          o(this, s).addEventListener("message", i), o(this, s).postMessage({
            type: l.INIT
          });
        });
    });
  }
  /**
   * @description heif解码以流式方式解码
   * @param imgFile Uint8Array | Blob | File
   */
  heifDecode(r) {
    return v(this, null, function* () {
      if (!o(this, E))
        throw new Error("heif未初始化");
      let t = r;
      return r instanceof Blob && (t = yield L(this, m, P).call(this, r)), new Promise((i, n) => {
        if (!o(this, s)) throw new Error("Worker未创建");
        const w = (c) => {
          const { type: h, success: a, error: f, payload: y } = c.data;
          h === l.DECODE && (o(this, s).removeEventListener(
            "message",
            w
          ), a && y ? i(y) : n(new Error(f)));
        };
        o(this, s).addEventListener("message", w), o(this, s).postMessage({
          type: l.DECODE,
          payload: t
        });
      });
    });
  }
  /**
   * 释放解码器
   */
  free() {
    o(this, s) && (o(this, s).postMessage({
      type: l.FREE
    }), o(this, s).terminate(), d(this, s, void 0), d(this, E, !1));
  }
};
s = new WeakMap(), E = new WeakMap(), m = new WeakSet(), P = function(r) {
  return new Promise((t, i) => {
    const n = new FileReader();
    n.onload = () => {
      t(
        new Uint8Array(n.result)
      );
    }, n.onerror = i, n.readAsArrayBuffer(r);
  });
};
let g = p;
export {
  g as HEIFReader
};
