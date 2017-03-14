window.assertEquals = function assertEquals(c, b, d) {
  var a = argsWithOptionalMsg_(arguments, 3);
  c = a[0];
  b = a[1];
  d = a[2];

  if (!compare_(b, d)) {
    fail(
      c +
        "expected " +
        prettyPrintEntity_(b) +
        " but was " +
        prettyPrintEntity_(d) +
        ""
    );
  }

  return true;
};

window.assertFalse = function assertFalse(b, c) {
  var a = argsWithOptionalMsg_(arguments, 2);

  isBoolean_(a[1]);

  if (a[1] != false) {
    fail(a[0] + "expected false but was " + prettyPrintEntity_(a[1]));
  }

  return true;
};

window.assertTrue = function assertTrue(b, c) {
  var a = argsWithOptionalMsg_(arguments, 2);
  isBoolean_(a[1]);

  if (a[1] != true) {
    fail(a[0] + "expected true but was " + prettyPrintEntity_(a[1]));
  }

  return true;
};

window.assert = assertTrue;

function isBoolean_(a) {
  if (typeof a != "boolean") {
    fail("Not a boolean: " + prettyPrintEntity_(a));
  }
}

function argsWithOptionalMsg_(b, e) {
  var a = [];

  for (var d = 0; d < b.length; d++) {
    a.push(b[d]);
  }

  var c = e - 1;

  if (b.length < c) {
    fail("expected at least " + c + " arguments, got " + b.length);
  } else {
    if (b.length == e) {
      a[0] += " ";
    } else {
      a.unshift("");
    }
  }

  return a;
}

function fail(b) {
  var a = new Error(b);

  a.name = "AssertError";

  if (!a.message) {
    a.message = b;
  }

  throw a;
}

function prettyPrintEntity_(a) {
  if (isElement_(a)) {
    return formatElement_(a);
  }

  var c;

  if (typeof a == "function") {
    try {
      c = a.toString().match(/(function [^\(]+\(\))/)[1];
    } catch (b) {}

    return c || "[function]";
  }
  try {
    c = JSON.stringify(a);
  } catch (b) {}

  return c || "[" + typeof a + "]";
}

var isElement_ = (function() {
  var c = document.createElement("div");

  function b(f) {
    try {
      c.appendChild(f);
      c.removeChild(f);
    } catch (d) {
      return false;
    }
    return true;
  }

  return function a(d) {
    return d && d.nodeType === 1 && b(d);
  };
})();

function formatElement_(f) {
  var d;
  try {
    d = f.tagName.toLowerCase();
    var j = "<" + d;
    var b = f.attributes, g;
    for (var c = 0, a = b.length; c < a; c++) {
      g = b.item(c);
      if (!!g.nodeValue) {
        j += " " + g.nodeName + '="' + g.nodeValue + '"';
      }
    }
    return j + ">...</" + d + ">";
  } catch (h) {
    return "[Element]" + (!!d ? " " + d : "");
  }
}

function compare_(g, j) {
  if (g === j) {
    return true;
  }
  if (typeof g != "object" || typeof j != "object" || !g || !j) {
    return g == j;
  }
  if (isElement_(g) || isElement_(j)) {
    return false;
  }
  var d = null;
  var f = 0;
  var b = 0;
  try {
    if (Array.isArray(j)) {
      f = j.length;
    } else {
      for (d in j) {
        if (j.hasOwnProperty(d)) {
          ++f;
        }
      }
    }
    if (f == 0 && typeof j.length == "number") {
      f = j.length;
      for (var c = 0, a = f; c < a; c++) {
        if (!(c in j)) {
          f = 0;
          break;
        }
      }
    }
    for (d in g) {
      if (g.hasOwnProperty(d)) {
        if (!compare_(g[d], j[d])) {
          return false;
        }
        ++b;
      }
    }
    if (b != f) {
      return false;
    }
    return b == 0 ? g.toString() == j.toString() : true;
  } catch (h) {
    return false;
  }
}
