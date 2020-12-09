var idb = (function (e) {
  'use strict'
  const t = (e, t) => t.some((t) => e instanceof t)
  let n, r
  const o = new WeakMap(),
    s = new WeakMap(),
    a = new WeakMap(),
    i = new WeakMap(),
    c = new WeakMap()
  let u = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ('done' === t) return s.get(e)
        if ('objectStoreNames' === t) return e.objectStoreNames || a.get(e)
        if ('store' === t)
          return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0])
      }
      return l(e[t])
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) => (e instanceof IDBTransaction && ('done' === t || 'store' === t)) || t in e,
  }
  function d(e) {
    u = e(u)
  }
  function f(e) {
    return e !== IDBDatabase.prototype.transaction || 'objectStoreNames' in IDBTransaction.prototype
      ? (
          r ||
          (r = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
          ])
        ).includes(e)
        ? function (...t) {
            return e.apply(D(this), t), l(o.get(this))
          }
        : function (...t) {
            return l(e.apply(D(this), t))
          }
      : function (t, ...n) {
          const r = e.call(D(this), t, ...n)
          return a.set(r, t.sort ? t.sort() : [t]), l(r)
        }
  }
  function p(e) {
    return 'function' == typeof e
      ? f(e)
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (s.has(e)) return
            const t = new Promise((t, n) => {
              const r = () => {
                  e.removeEventListener('complete', o),
                    e.removeEventListener('error', s),
                    e.removeEventListener('abort', s)
                },
                o = () => {
                  t(), r()
                },
                s = () => {
                  n(e.error || new DOMException('AbortError', 'AbortError')), r()
                }
              e.addEventListener('complete', o),
                e.addEventListener('error', s),
                e.addEventListener('abort', s)
            })
            s.set(e, t)
          })(e),
        t(e, n || (n = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]))
          ? new Proxy(e, u)
          : e)
  }
  function l(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const r = () => {
              e.removeEventListener('success', o), e.removeEventListener('error', s)
            },
            o = () => {
              t(l(e.result)), r()
            },
            s = () => {
              n(e.error), r()
            }
          e.addEventListener('success', o), e.addEventListener('error', s)
        })
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && o.set(t, e)
            })
            .catch(() => {}),
          c.set(t, e),
          t
        )
      })(e)
    if (i.has(e)) return i.get(e)
    const t = p(e)
    return t !== e && (i.set(e, t), c.set(t, e)), t
  }
  const D = (e) => c.get(e)
  const I = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    B = ['put', 'add', 'delete', 'clear'],
    b = new Map()
  function v(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return
    if (b.get(t)) return b.get(t)
    const n = t.replace(/FromIndex$/, ''),
      r = t !== n,
      o = B.includes(n)
    if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || (!o && !I.includes(n))) return
    const s = async function (e, ...t) {
      const s = this.transaction(e, o ? 'readwrite' : 'readonly')
      let a = s.store
      r && (a = a.index(t.shift()))
      const i = await a[n](...t)
      return o && (await s.done), i
    }
    return b.set(t, s), s
  }
  d((e) => ({
    ...e,
    get: (t, n, r) => v(t, n) || e.get(t, n, r),
    has: (t, n) => !!v(t, n) || e.has(t, n),
  }))
  const g = ['continue', 'continuePrimaryKey', 'advance'],
    y = {},
    h = new WeakMap(),
    w = new WeakMap(),
    m = {
      get(e, t) {
        if (!g.includes(t)) return e[t]
        let n = y[t]
        return (
          n ||
            (n = y[t] = function (...e) {
              h.set(this, w.get(this)[t](...e))
            }),
          n
        )
      },
    }
  async function* E(...e) {
    let t = this
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return
    t = t
    const n = new Proxy(t, m)
    for (w.set(n, t), c.set(n, D(t)); t; )
      yield n, (t = await (h.get(n) || t.continue())), h.delete(n)
  }
  function L(e, n) {
    return (
      (n === Symbol.asyncIterator && t(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ('iterate' === n && t(e, [IDBIndex, IDBObjectStore]))
    )
  }
  return (
    d((e) => ({
      ...e,
      get: (t, n, r) => (L(t, n) ? E : e.get(t, n, r)),
      has: (t, n) => L(t, n) || e.has(t, n),
    })),
    (e.deleteDB = function (e, { blocked: t } = {}) {
      const n = indexedDB.deleteDatabase(e)
      return t && n.addEventListener('blocked', () => t()), l(n).then(() => {})
    }),
    (e.openDB = function (e, t, { blocked: n, upgrade: r, blocking: o, terminated: s } = {}) {
      const a = indexedDB.open(e, t),
        i = l(a)
      return (
        r &&
          a.addEventListener('upgradeneeded', (e) => {
            r(l(a.result), e.oldVersion, e.newVersion, l(a.transaction))
          }),
        n && a.addEventListener('blocked', () => n()),
        i
          .then((e) => {
            s && e.addEventListener('close', () => s()),
              o && e.addEventListener('versionchange', () => o())
          })
          .catch(() => {}),
        i
      )
    }),
    (e.unwrap = D),
    (e.wrap = l),
    e
  )
})({})
