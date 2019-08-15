/* eslint-disable */
/*
  from:
  https://github.com/ai/nanoevents/blob/49745c1576007e0b1fa40890fb6a997ecb4078f1/index.js

  license: MIT

  to make this work with Rollup
*/

export default function NanoEvents ()
{
  this.events = {}
}

NanoEvents.prototype =
{
emit: function emit (event) {
  var args = [].slice.call(arguments, 1)
  // Array.prototype.call() returns empty array if context is not array-like
  ;[].slice.call(this.events[event] || []).filter(function (i) {
    i.apply(null, args)
  })
},

on: function on (event, cb) {
  if (process.env.NODE_ENV !== 'production' && typeof cb !== 'function') {
    throw new Error('Listener must be a function')
  }

  (this.events[event] = this.events[event] || []).push(cb)

  return function () {
    this.events[event] = this.events[event].filter(function (i) {
      return i !== cb
    })
  }.bind(this)
}
}
