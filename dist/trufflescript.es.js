var l = Object.defineProperty;
var c = (r, e, n) => e in r ? l(r, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[e] = n;
var s = (r, e, n) => (c(r, typeof e != "symbol" ? e + "" : e, n), n);
function h(r, e, n) {
  let t = 0;
  if (n === void 0) {
    for (const u in r)
      if (Object.hasOwn(r, u) && (t += 1, !Object.hasOwn(e, u) || r[u] !== e[u]))
        return !1;
  } else
    for (const u in r)
      if (Object.hasOwn(r, u) && (t += 1, !Object.hasOwn(e, u) || !n(r[u], e[u])))
        return !1;
  return t === f(e);
}
function a(r, e, n) {
  let t = 0;
  if (n === void 0) {
    for (const u in r)
      if (Object.hasOwn(r, u) && (t += 1, !Object.hasOwn(e, u) || r[u] !== e[u]))
        return !0;
  } else
    for (const u in r)
      if (Object.hasOwn(r, u) && (t += 1, !Object.hasOwn(e, u) || !n(r[u], e[u])))
        return !0;
  return t !== f(e);
}
function O(r) {
  for (const e in r)
    if (Object.hasOwn(r, e))
      return !0;
  return !1;
}
function f(r) {
  let e = 0;
  for (const n in r)
    Object.hasOwn(r, n) && (e += 1);
  return e;
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  equals: h,
  isEmpty: O,
  length: f,
  notEquals: a
}, Symbol.toStringTag, { value: "Module" }));
function w(r, e, n) {
  if (r.length !== e.length)
    return !1;
  if (n === void 0) {
    for (let t = 0; t < r.length; t++)
      if (r[t] !== e[t])
        return !1;
  } else
    for (let t = 0; t < r.length; t++)
      if (!n(r[t], e[t]))
        return !1;
  return !0;
}
function _(r, e, n) {
  if (r.length !== e.length)
    return !0;
  if (n === void 0) {
    for (let t = 0; t < r.length; t++)
      if (r[t] !== e[t])
        return !0;
  } else
    for (let t = 0; t < r.length; t++)
      if (!n(r[t], e[t]))
        return !0;
  return !1;
}
const p = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  equals: w,
  notEquals: _
}, Symbol.toStringTag, { value: "Module" }));
class o {
  constructor(e) {
    s(this, "ok");
    this.ok = e;
  }
  get is_ok() {
    return !0;
  }
  get is_err() {
    return !1;
  }
  match(e, n) {
    return e(this.ok);
  }
  and_then(e) {
    return e(this.ok);
  }
  map(e) {
    return new o(e(this.ok));
  }
  map_err(e) {
    return new o(this.ok);
  }
  unwrap() {
    return this.ok;
  }
  unwrap_or(e) {
    return this.ok;
  }
  unwrap_or_else(e) {
    return this.ok;
  }
}
class i {
  constructor(e) {
    s(this, "err");
    this.err = e;
  }
  get is_ok() {
    return !1;
  }
  get is_err() {
    return !0;
  }
  and_then(e) {
    return new i(this.err);
  }
  map(e) {
    return new i(this.err);
  }
  map_err(e) {
    return new i(e(this.err));
  }
  match(e, n) {
    return n(this.err);
  }
  unwrap() {
    throw `Unwrap was called on an Err: ${this.err}`;
  }
  unwrap_or(e) {
    return e;
  }
  unwrap_or_else(e) {
    return e();
  }
}
export {
  p as ArrayFns,
  i as Err,
  k as ObjectFns,
  o as Ok
};
//# sourceMappingURL=trufflescript.es.js.map
