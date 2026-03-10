(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.p.cS === region.m.cS)
	{
		return 'on line ' + region.p.cS;
	}
	return 'on lines ' + region.p.cS + ' through ' + region.m.cS;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.iS,
		impl.kw,
		impl.kh,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.jk) { flags += 'm'; }
	if (options.hY) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $author$project$Server$Received = $elm$core$Basics$identity;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.A) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.C),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.C);
		} else {
			var treeLen = builder.A * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.E) : builder.E;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.A);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.C) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.C);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{E: nodeList, A: (len / $elm$core$Array$branchFactor) | 0, C: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Server$input = _Platform_incomingPort(
	'input',
	A2(
		$elm$json$Json$Decode$andThen,
		function (url) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (processes) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (method) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (jsResponseHandler) {
									return A2(
										$elm$json$Json$Decode$andThen,
										function (body) {
											return $elm$json$Json$Decode$succeed(
												{hV: body, gj: jsResponseHandler, gr: method, dJ: processes, ht: url});
										},
										A2($elm$json$Json$Decode$field, 'body', $elm$json$Json$Decode$value));
								},
								A2($elm$json$Json$Decode$field, 'jsResponseHandler', $elm$json$Json$Decode$value));
						},
						A2($elm$json$Json$Decode$field, 'method', $elm$json$Json$Decode$string));
				},
				A2($elm$json$Json$Decode$field, 'processes', $elm$json$Json$Decode$string));
		},
		A2($elm$json$Json$Decode$field, 'url', $elm$json$Json$Decode$string)));
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Data$Scope$Food = 0;
var $author$project$Data$Process$Category$Packaging = {$: 5};
var $author$project$Data$Scope$Textile = 2;
var $author$project$Data$Process$Category$Transform = {$: 7};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Data$Scope$anyOf = function (scopes) {
	return $elm$core$List$filter(
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.M;
			},
			$elm$core$List$any(
				function (scope) {
					return A2($elm$core$List$member, scope, scopes);
				})));
};
var $NoRedInk$elm_uuid$Prng$Uuid$toString = function (_v0) {
	var internalString = _v0;
	return internalString;
};
var $author$project$Data$Uuid$toString = $NoRedInk$elm_uuid$Prng$Uuid$toString;
var $author$project$Data$Component$idToString = function (_v0) {
	var uuid = _v0;
	return $author$project$Data$Uuid$toString(uuid);
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Data$Component$encodeId = A2($elm$core$Basics$composeR, $author$project$Data$Component$idToString, $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Server$encodeComponent = function (_v0) {
	var id = _v0.H;
	var name = _v0.L;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Component$encodeId(id)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(name))
			]));
};
var $author$project$Data$Country$codeToString = function (_v0) {
	var string = _v0;
	return string;
};
var $author$project$Data$Country$encodeCode = A2($elm$core$Basics$composeR, $author$project$Data$Country$codeToString, $elm$json$Json$Encode$string);
var $author$project$Server$encodeCountry = function (_v0) {
	var code = _v0.cK;
	var name = _v0.L;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'code',
				$author$project$Data$Country$encodeCode(code)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(name))
			]));
};
var $author$project$Data$Food$Ingredient$idToString = function (_v0) {
	var uuid = _v0;
	return $author$project$Data$Uuid$toString(uuid);
};
var $author$project$Data$Food$Origin$toLabel = function (origin) {
	switch (origin) {
		case 0:
			return 'Europe et Maghreb';
		case 1:
			return 'France';
		case 2:
			return 'Hors Europe et Maghreb';
		default:
			return 'Hors Europe et Maghreb par avion';
	}
};
var $author$project$Server$encodeIngredient = function (ingredient) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(
					$author$project$Data$Food$Ingredient$idToString(ingredient.H))),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(ingredient.L)),
				_Utils_Tuple2(
				'defaultOrigin',
				$elm$json$Json$Encode$string(
					$author$project$Data$Food$Origin$toLabel(ingredient.fR)))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Server$encodeIngredients = function (ingredients) {
	return A2($elm$json$Json$Encode$list, $author$project$Server$encodeIngredient, ingredients);
};
var $author$project$Data$Textile$Material$idToString = function (_v0) {
	var string = _v0;
	return string;
};
var $author$project$Data$Textile$Material$encodeId = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Material$idToString, $elm$json$Json$Encode$string);
var $author$project$Server$encodeMaterial = function (_v0) {
	var id = _v0.H;
	var name = _v0.L;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Textile$Material$encodeId(id)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(name))
			]));
};
var $author$project$Data$Process$sourceIdToString = function (_v0) {
	var string = _v0;
	return string;
};
var $author$project$Data$Process$getTechnicalName = function (_v0) {
	var sourceId = _v0.e0;
	return $author$project$Data$Process$sourceIdToString(sourceId);
};
var $author$project$Data$Process$getDisplayName = function (process) {
	var _v0 = process.em;
	if (!_v0.$) {
		var displayName = _v0.a;
		return displayName;
	} else {
		return $author$project$Data$Process$getTechnicalName(process);
	}
};
var $author$project$Data$Process$idToString = function (_v0) {
	var uuid = _v0;
	return $author$project$Data$Uuid$toString(uuid);
};
var $author$project$Server$encodeProcess = function (process) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(
					$author$project$Data$Process$idToString(process.H))),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(
					$author$project$Data$Process$getDisplayName(process)))
			]));
};
var $author$project$Server$encodeProcessList = $elm$json$Json$Encode$list($author$project$Server$encodeProcess);
var $author$project$Data$Textile$Product$idToString = function (_v0) {
	var string = _v0;
	return string;
};
var $author$project$Data$Textile$Product$encodeId = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Product$idToString, $elm$json$Json$Encode$string);
var $author$project$Server$encodeProduct = function (_v0) {
	var id = _v0.H;
	var name = _v0.L;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Textile$Product$encodeId(id)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(name))
			]));
};
var $author$project$Server$serverRootUrl = 'https://ecobalyse.beta.gouv.fr/';
var $author$project$Server$apiDocUrl = $author$project$Server$serverRootUrl + '#/api';
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $author$project$Data$Validation$encodeErrors = A2($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $elm$json$Json$Encode$string);
var $author$project$Server$encodeValidationErrors = function (errors) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'error',
				$author$project$Data$Validation$encodeErrors(errors)),
				_Utils_Tuple2(
				'documentation',
				$elm$json$Json$Encode$string($author$project$Server$apiDocUrl))
			]));
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {iH: fragment, iN: host, gF: path, jJ: port_, jQ: protocol, dK: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {bl: frag, bC: params, a4: unvisited, bT: value, bU: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.a4;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.bT);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.bT);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.gF),
					$elm$url$Url$Parser$prepareQuery(url.dK),
					url.iH,
					$elm$core$Basics$identity)));
	});
var $author$project$Server$Route$FoodGetCountryList = {$: 0};
var $author$project$Server$Route$FoodGetIngredientList = {$: 1};
var $author$project$Server$Route$FoodGetPackagingList = {$: 2};
var $author$project$Server$Route$FoodGetTransformList = {$: 3};
var $author$project$Server$Route$FoodPostRecipe = function (a) {
	return {$: 4, a: a};
};
var $author$project$Server$Route$TextileGetCountryList = {$: 5};
var $author$project$Server$Route$TextileGetMaterialList = {$: 6};
var $author$project$Server$Route$TextileGetProductList = {$: 7};
var $author$project$Server$Route$TextileGetTrimList = {$: 8};
var $author$project$Server$Route$TextilePostSimulator = function (a) {
	return {$: 9, a: a};
};
var $author$project$Server$Route$TextilePostSimulatorDetailed = function (a) {
	return {$: 10, a: a};
};
var $author$project$Server$Route$TextilePostSimulatorSingle = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Data$Food$Query$Query = F5(
	function (distribution, ingredients, packaging, preparation, transform) {
		return {cO: distribution, iR: ingredients, bB: packaging, aL: preparation, bQ: transform};
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm_community$json_extra$Json$Decode$Extra$fromResult = function (result) {
	if (!result.$) {
		var successValue = result.a;
		return $elm$json$Json$Decode$succeed(successValue);
	} else {
		var errorMessage = result.a;
		return $elm$json$Json$Decode$fail(errorMessage);
	}
};
var $author$project$Data$Food$Retail$Ambient = 0;
var $author$project$Data$Food$Retail$Distribution = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $ianmackenzie$elm_units$Quantity$Quantity = $elm$core$Basics$identity;
var $ianmackenzie$elm_units$Volume$cubicMeters = function (numCubicMeters) {
	return numCubicMeters;
};
var $ianmackenzie$elm_units$Length$meters = function (numMeters) {
	return numMeters;
};
var $ianmackenzie$elm_units$Length$kilometers = function (numKilometers) {
	return $ianmackenzie$elm_units$Length$meters(1000 * numKilometers);
};
var $ianmackenzie$elm_units$Energy$joules = function (numJoules) {
	return numJoules;
};
var $ianmackenzie$elm_units$Energy$kilowattHours = function (numKilowattHours) {
	return $ianmackenzie$elm_units$Energy$joules(3.6e6 * numKilowattHours);
};
var $ianmackenzie$elm_units$Volume$liters = function (numLiters) {
	return $ianmackenzie$elm_units$Volume$cubicMeters(0.001 * numLiters);
};
var $ianmackenzie$elm_units$Quantity$rate = F2(
	function (_v0, _v1) {
		var dependentValue = _v0;
		var independentValue = _v1;
		return dependentValue / independentValue;
	});
var $ianmackenzie$elm_units$Quantity$ratio = F2(
	function (_v0, _v1) {
		var x = _v0;
		var y = _v1;
		return x / y;
	});
var $author$project$Data$Food$Retail$ambient = A2(
	$author$project$Data$Food$Retail$Distribution,
	0,
	{
		b2: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(0),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		b9: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(123.08),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		c5: $ianmackenzie$elm_units$Length$kilometers(600),
		bV: A2(
			$ianmackenzie$elm_units$Quantity$ratio,
			$ianmackenzie$elm_units$Volume$liters(561.5),
			$ianmackenzie$elm_units$Volume$cubicMeters(1))
	});
var $author$project$Data$Food$Retail$Fresh = 1;
var $author$project$Data$Food$Retail$fresh = A2(
	$author$project$Data$Food$Retail$Distribution,
	1,
	{
		b2: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(219.23),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		b9: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(46.15),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		c5: $ianmackenzie$elm_units$Length$kilometers(600),
		bV: A2(
			$ianmackenzie$elm_units$Quantity$ratio,
			$ianmackenzie$elm_units$Volume$liters(210.6),
			$ianmackenzie$elm_units$Volume$cubicMeters(1))
	});
var $author$project$Data$Food$Retail$Frozen = 2;
var $author$project$Data$Food$Retail$frozen = A2(
	$author$project$Data$Food$Retail$Distribution,
	2,
	{
		b2: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(415.38),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		b9: A2(
			$ianmackenzie$elm_units$Quantity$rate,
			$ianmackenzie$elm_units$Energy$kilowattHours(61.54),
			$ianmackenzie$elm_units$Volume$cubicMeters(1)),
		c5: $ianmackenzie$elm_units$Length$kilometers(600),
		bV: A2(
			$ianmackenzie$elm_units$Quantity$ratio,
			$ianmackenzie$elm_units$Volume$liters(280.8),
			$ianmackenzie$elm_units$Volume$cubicMeters(1))
	});
var $author$project$Data$Food$Retail$fromString = function (str) {
	switch (str) {
		case 'ambient':
			return $elm$core$Result$Ok($author$project$Data$Food$Retail$ambient);
		case 'fresh':
			return $elm$core$Result$Ok($author$project$Data$Food$Retail$fresh);
		case 'frozen':
			return $elm$core$Result$Ok($author$project$Data$Food$Retail$frozen);
		default:
			return $elm$core$Result$Err('Choix invalide pour la distribution : ' + str);
	}
};
var $author$project$Data$Food$Retail$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Retail$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$Preparation$Id = $elm$core$Basics$identity;
var $author$project$Data$Split$Split = $elm$core$Basics$identity;
var $author$project$Data$Split$complement = function (_v0) {
	var _float = _v0;
	return 100 - _float;
};
var $author$project$Data$Split$fourty = 40;
var $author$project$Data$Split$full = 100;
var $ianmackenzie$elm_units$Energy$megajoules = function (numMegajoules) {
	return $ianmackenzie$elm_units$Energy$joules(1.0e6 * numMegajoules);
};
var $author$project$Data$Split$zero = 0;
var $author$project$Data$Food$Preparation$all = _List_fromArray(
	[
		{
		aR: true,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.667),
			$author$project$Data$Split$full),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0),
			$author$project$Data$Split$zero),
		H: 'frying',
		L: 'Friture'
	},
		{
		aR: true,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.44),
			$author$project$Data$Split$fourty),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(1.584),
			$author$project$Data$Split$complement($author$project$Data$Split$fourty)),
		H: 'pan-cooking',
		L: 'Cuisson à la poêle'
	},
		{
		aR: false,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.08),
			$author$project$Data$Split$fourty),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0.288),
			$author$project$Data$Split$complement($author$project$Data$Split$fourty)),
		H: 'pan-warming',
		L: 'Réchauffage à la poêle'
	},
		{
		aR: true,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.999),
			$author$project$Data$Split$full),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0),
			$author$project$Data$Split$zero),
		H: 'oven',
		L: 'Cuisson au four'
	},
		{
		aR: true,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.128),
			$author$project$Data$Split$full),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0),
			$author$project$Data$Split$zero),
		H: 'microwave',
		L: 'Cuisson au four micro-ondes'
	},
		{
		aR: false,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.0777),
			$author$project$Data$Split$full),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0),
			$author$project$Data$Split$zero),
		H: 'refrigeration',
		L: 'Réfrigération'
	},
		{
		aR: false,
		eo: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$kilowattHours(0.294),
			$author$project$Data$Split$full),
		ez: _Utils_Tuple2(
			$ianmackenzie$elm_units$Energy$megajoules(0),
			$author$project$Data$Split$zero),
		H: 'freezing',
		L: 'Congélation'
	}
	]);
var $author$project$Data$Food$Preparation$idToString = function (_v0) {
	var string = _v0;
	return string;
};
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $author$project$Data$Food$Preparation$notFoundError = function (str) {
	return 'Préparation inconnue: ' + str;
};
var $author$project$Data$Food$Preparation$idFromString = function (string) {
	return A2(
		$elm$core$List$member,
		string,
		A2(
			$elm$core$List$map,
			$author$project$Data$Food$Preparation$idToString,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.H;
				},
				$author$project$Data$Food$Preparation$all))) ? $elm$core$Result$Ok(string) : $elm$core$Result$Err(
		$author$project$Data$Food$Preparation$notFoundError(string));
};
var $author$project$Data$Food$Preparation$decodeId = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Preparation$idFromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$Query$IngredientQuery = F4(
	function (country, id, mass, planeTransport) {
		return {fL: country, H: id, T: mass, gJ: planeTransport};
	});
var $author$project$Data$Food$Ingredient$PlaneNotApplicable = 2;
var $author$project$Data$Country$Code = $elm$core$Basics$identity;
var $elm$json$Json$Decode$map = _Json_map1;
var $author$project$Data$Country$decodeCode = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string);
var $author$project$Data$Food$Ingredient$Id = $elm$core$Basics$identity;
var $NoRedInk$elm_uuid$Prng$Uuid$Uuid = $elm$core$Basics$identity;
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {d: index, cU: match, jv: number, kg: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{hY: false, jk: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $NoRedInk$elm_uuid$Prng$Uuid$Barebones$uuidRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^[0-9A-Fa-f]{8,8}-[0-9A-Fa-f]{4,4}-[1-5][0-9A-Fa-f]{3,3}-[8-9A-Ba-b][0-9A-Fa-f]{3,3}-[0-9A-Fa-f]{12,12}$'));
var $NoRedInk$elm_uuid$Prng$Uuid$Barebones$isValidUuid = function (uuidAsString) {
	return A2($elm$regex$Regex$contains, $NoRedInk$elm_uuid$Prng$Uuid$Barebones$uuidRegex, uuidAsString);
};
var $NoRedInk$elm_uuid$Prng$Uuid$isValidUuid = $NoRedInk$elm_uuid$Prng$Uuid$Barebones$isValidUuid;
var $elm$core$String$toLower = _String_toLower;
var $NoRedInk$elm_uuid$Prng$Uuid$fromString = function (text) {
	return $NoRedInk$elm_uuid$Prng$Uuid$isValidUuid(text) ? $elm$core$Maybe$Just(
		$elm$core$String$toLower(text)) : $elm$core$Maybe$Nothing;
};
var $NoRedInk$elm_uuid$Prng$Uuid$decoder = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		var _v0 = $NoRedInk$elm_uuid$Prng$Uuid$fromString(string);
		if (!_v0.$) {
			var uuid = _v0.a;
			return $elm$json$Json$Decode$succeed(uuid);
		} else {
			return $elm$json$Json$Decode$fail('Not a valid UUID');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$Uuid$decoder = $NoRedInk$elm_uuid$Prng$Uuid$decoder;
var $author$project$Data$Food$Ingredient$decodeId = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $author$project$Data$Uuid$decoder);
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $ianmackenzie$elm_units$Mass$kilograms = function (numKilograms) {
	return numKilograms;
};
var $ianmackenzie$elm_units$Mass$grams = function (numGrams) {
	return $ianmackenzie$elm_units$Mass$kilograms(0.001 * numGrams);
};
var $author$project$Data$Food$Query$decodeMassInGrams = A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Mass$grams, $elm$json$Json$Decode$float);
var $author$project$Data$Food$Ingredient$ByPlane = 0;
var $author$project$Data$Food$Ingredient$NoPlane = 1;
var $author$project$Data$Food$Query$decodePlaneTransport = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'byPlane':
				return $elm$json$Json$Decode$succeed(0);
			case 'noPlane':
				return $elm$json$Json$Decode$succeed(1);
			default:
				return $elm$json$Json$Decode$fail('Transport par avion inconnu\u00A0: ' + str);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map2 = _Json_map2;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm_community$json_extra$Json$Decode$Extra$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm_community$json_extra$Json$Decode$Extra$optionalField = F2(
	function (fieldName, decoder) {
		var finishDecoding = function (json) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, fieldName, $elm$json$Json$Decode$value),
				json);
			if (!_v0.$) {
				var val = _v0.a;
				return A2(
					$elm$json$Json$Decode$map,
					$elm$core$Maybe$Just,
					A2($elm$json$Json$Decode$field, fieldName, decoder));
			} else {
				return $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing);
			}
		};
		return A2($elm$json$Json$Decode$andThen, finishDecoding, $elm$json$Json$Decode$value);
	});
var $elm_community$json_extra$Json$Decode$Extra$optionalNullableField = F2(
	function (fieldName, decoder) {
		return A2(
			$elm$json$Json$Decode$map,
			$elm$core$Maybe$andThen($elm$core$Basics$identity),
			A2(
				$elm_community$json_extra$Json$Decode$Extra$optionalField,
				fieldName,
				$elm$json$Json$Decode$nullable(decoder)));
	});
var $author$project$Data$Common$DecodeUtils$strictOptional = F2(
	function (field, decoder) {
		return $elm_community$json_extra$Json$Decode$Extra$andMap(
			A2($elm_community$json_extra$Json$Decode$Extra$optionalNullableField, field, decoder));
	});
var $author$project$Data$Common$DecodeUtils$strictOptionalWithDefault = F3(
	function (field, decoder, _default) {
		return $elm_community$json_extra$Json$Decode$Extra$andMap(
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(_default),
				A2($elm_community$json_extra$Json$Decode$Extra$optionalNullableField, field, decoder)));
	});
var $author$project$Data$Food$Query$decodeIngredient = A4(
	$author$project$Data$Common$DecodeUtils$strictOptionalWithDefault,
	'byPlane',
	$author$project$Data$Food$Query$decodePlaneTransport,
	2,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'mass',
		$author$project$Data$Food$Query$decodeMassInGrams,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'id',
			$author$project$Data$Food$Ingredient$decodeId,
			A3(
				$author$project$Data$Common$DecodeUtils$strictOptional,
				'country',
				$author$project$Data$Country$decodeCode,
				$elm$json$Json$Decode$succeed($author$project$Data$Food$Query$IngredientQuery)))));
var $author$project$Data$Food$Query$ProcessQuery = F2(
	function (id, mass) {
		return {H: id, T: mass};
	});
var $author$project$Data$Process$Id = $elm$core$Basics$identity;
var $author$project$Data$Process$decodeId = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $author$project$Data$Uuid$decoder);
var $author$project$Data$Food$Query$decodeProcess = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Data$Food$Query$ProcessQuery,
	A2($elm$json$Json$Decode$field, 'id', $author$project$Data$Process$decodeId),
	A2($elm$json$Json$Decode$field, 'mass', $author$project$Data$Food$Query$decodeMassInGrams));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Data$Food$Query$decode = A3(
	$author$project$Data$Common$DecodeUtils$strictOptional,
	'transform',
	$author$project$Data$Food$Query$decodeProcess,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'preparation',
		$elm$json$Json$Decode$list($author$project$Data$Food$Preparation$decodeId),
		_List_Nil,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'packaging',
			$elm$json$Json$Decode$list($author$project$Data$Food$Query$decodeProcess),
			_List_Nil,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'ingredients',
				$elm$json$Json$Decode$list($author$project$Data$Food$Query$decodeIngredient),
				A3(
					$author$project$Data$Common$DecodeUtils$strictOptional,
					'distribution',
					$author$project$Data$Food$Retail$decode,
					$elm$json$Json$Decode$succeed($author$project$Data$Food$Query$Query))))));
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Data$Common$DecodeUtils$replaceDoubleSpaces = function (string) {
	return A2($elm$core$String$contains, '  ', string) ? $author$project$Data$Common$DecodeUtils$replaceDoubleSpaces(
		A3($elm$core$String$replace, '  ', ' ', string)) : string;
};
var $author$project$Data$Common$DecodeUtils$betterErrorToString = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$errorToString,
	A2(
		$elm$core$Basics$composeR,
		A2($elm$core$String$replace, '\n', ' '),
		$author$project$Data$Common$DecodeUtils$replaceDoubleSpaces));
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$Data$Validation$fromDecodingError = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Common$DecodeUtils$betterErrorToString,
	$elm$core$Dict$singleton('decoding'));
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Data$Validation$infinity = $elm$core$Basics$round(1 / 0);
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $author$project$Data$Validation$check = F3(
	function (key, result, accumulator) {
		var _v0 = _Utils_Tuple2(result, accumulator);
		if (_v0.b.$ === 1) {
			if (!_v0.a.$) {
				var errors = _v0.b.a;
				return $elm$core$Result$Err(errors);
			} else {
				var error = _v0.a.a;
				var errors = _v0.b.a;
				return $elm$core$Result$Err(
					A2(
						$elm$core$Dict$union,
						A2($elm$core$Dict$singleton, key, error),
						errors));
			}
		} else {
			var valueOrError = _v0.a;
			var accFn = _v0.b.a;
			return A2(
				$elm$core$Result$map,
				accFn,
				A2(
					$elm$core$Result$mapError,
					$elm$core$Dict$singleton(key),
					valueOrError));
		}
	});
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $elm_community$result_extra$Result$Extra$combine = A2(
	$elm$core$List$foldr,
	$elm$core$Result$map2($elm$core$List$cons),
	$elm$core$Result$Ok(_List_Nil));
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm_community$result_extra$Result$Extra$combineMap = function (f) {
	return A2(
		$elm$core$Basics$composeL,
		$elm_community$result_extra$Result$Extra$combine,
		$elm$core$List$map(f));
};
var $author$project$Data$Validation$list = F3(
	function (key, list_, validator) {
		return A2(
			$author$project$Data$Validation$check,
			key,
			A2($elm_community$result_extra$Result$Extra$combineMap, validator, list_));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Data$Validation$boundedList = F5(
	function (bounds, key, items, validator, accumulator) {
		var min = bounds.jg;
		var max = A2($elm$core$Maybe$withDefault, $author$project$Data$Validation$infinity, bounds.jd);
		return ((_Utils_cmp(
			$elm$core$List$length(items),
			min) < 0) || (_Utils_cmp(
			$elm$core$List$length(items),
			max) > 0)) ? $elm$core$Result$Err(
			A2(
				$elm$core$Dict$singleton,
				key,
				'La liste \'' + (key + ('\' doit contenir ' + ((!_Utils_eq(max, $author$project$Data$Validation$infinity)) ? (((!(!min)) ? ('entre ' + ($elm$core$String$fromInt(min) + ' et ')) : '') + ($elm$core$String$fromInt(max) + ' élément(s) maximum.')) : ($elm$core$String$fromInt(min) + ' élément(s) minimum.')))))) : A4($author$project$Data$Validation$list, key, items, validator, accumulator);
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Data$Validation$maybe = F3(
	function (key, maybeValue, validator) {
		return A2(
			$author$project$Data$Validation$check,
			key,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Result$Ok($elm$core$Maybe$Nothing),
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						validator,
						$elm$core$Result$map($elm$core$Maybe$Just)),
					maybeValue)));
	});
var $author$project$Data$Validation$ok = function (key) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Result$Ok,
		$author$project$Data$Validation$check(key));
};
var $elm_community$result_extra$Result$Extra$andMap = F2(
	function (ra, rb) {
		var _v0 = _Utils_Tuple2(ra, rb);
		if (_v0.b.$ === 1) {
			var x = _v0.b.a;
			return $elm$core$Result$Err(x);
		} else {
			var o = _v0.a;
			var fn = _v0.b.a;
			return A2($elm$core$Result$map, fn, o);
		}
	});
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Data$Food$Ingredient$findById = F2(
	function (id, ingredients) {
		return A2(
			$elm$core$Result$fromMaybe,
			'Ingrédient introuvable par id : ' + $author$project$Data$Food$Ingredient$idToString(id),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.H;
						},
						$elm$core$Basics$eq(id)),
					ingredients)));
	});
var $author$project$Data$Country$findByCode = function (code) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.cK;
				},
				$elm$core$Basics$eq(code))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			$elm$core$Result$fromMaybe(
				'Code pays invalide: ' + ($author$project$Data$Country$codeToString(code) + '.'))));
};
var $author$project$Data$Scope$toLabel = function (scope) {
	switch (scope) {
		case 0:
			return 'Alimentaire';
		case 1:
			return 'Objets';
		case 2:
			return 'Textile';
		default:
			return 'Véhicules';
	}
};
var $author$project$Data$Country$validateForScope = F3(
	function (scope, countries, countryCode) {
		return A2(
			$elm$core$Result$andThen,
			function (_v0) {
				var code = _v0.cK;
				var scopes = _v0.M;
				return A2($elm$core$List$member, scope, scopes) ? $elm$core$Result$Ok(code) : $elm$core$Result$Err(
					'Le code pays ' + ($author$project$Data$Country$codeToString(countryCode) + (' n\'est pas utilisable dans un contexte ' + ($author$project$Data$Scope$toLabel(scope) + '.'))));
			},
			A2($author$project$Data$Country$findByCode, countryCode, countries));
	});
var $ianmackenzie$elm_units$Mass$inKilograms = function (_v0) {
	var numKilograms = _v0;
	return numKilograms;
};
var $author$project$Data$Food$Validation$validateMass = function (mass) {
	return ($ianmackenzie$elm_units$Mass$inKilograms(mass) <= 0) ? $elm$core$Result$Err('La masse doit être supérieure ou égale à zéro') : $elm$core$Result$Ok(mass);
};
var $author$project$Data$Food$Validation$validateMaybe = function (fn) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map(
			A2(
				$elm$core$Basics$composeR,
				fn,
				$elm$core$Result$map($elm$core$Maybe$Just))),
		$elm$core$Maybe$withDefault(
			$elm$core$Result$Ok($elm$core$Maybe$Nothing)));
};
var $author$project$Data$Food$Validation$validateIngredient = F2(
	function (db, ingredientQuery) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$elm$core$Result$Ok(ingredientQuery.gJ),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				$author$project$Data$Food$Validation$validateMass(ingredientQuery.T),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A2(
						$elm$core$Result$map,
						function ($) {
							return $.H;
						},
						A2($author$project$Data$Food$Ingredient$findById, ingredientQuery.H, db.dt.iR)),
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						A2(
							$author$project$Data$Food$Validation$validateMaybe,
							A2($author$project$Data$Country$validateForScope, 0, db.h4),
							ingredientQuery.fL),
						$elm$core$Result$Ok($author$project$Data$Food$Query$IngredientQuery)))));
	});
var $author$project$Data$Food$Preparation$findById = function (id) {
	return A2(
		$elm$core$Result$fromMaybe,
		$author$project$Data$Food$Preparation$notFoundError(
			$author$project$Data$Food$Preparation$idToString(id)),
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.H;
					},
					$elm$core$Basics$eq(id)),
				$author$project$Data$Food$Preparation$all)));
};
var $author$project$Data$Food$Validation$validatePreparation = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Food$Preparation$findById,
	$elm$core$Result$map(
		function ($) {
			return $.H;
		}));
var $author$project$Data$Process$findById = F2(
	function (id, processes) {
		return A2(
			$elm$core$Result$fromMaybe,
			'Procédé introuvable par id : ' + $author$project$Data$Process$idToString(id),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.H;
						},
						$elm$core$Basics$eq(id)),
					processes)));
	});
var $author$project$Data$Food$Validation$validateProcess = F2(
	function (db, processQuery) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$author$project$Data$Food$Validation$validateMass(processQuery.T),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				A2(
					$elm$core$Result$map,
					function ($) {
						return $.H;
					},
					A2($author$project$Data$Process$findById, processQuery.H, db.dJ)),
				$elm$core$Result$Ok($author$project$Data$Food$Query$ProcessQuery)));
	});
var $author$project$Data$Food$Validation$validate = F2(
	function (db, query) {
		return A4(
			$author$project$Data$Validation$maybe,
			'transform',
			query.bQ,
			$author$project$Data$Food$Validation$validateProcess(db),
			A5(
				$author$project$Data$Validation$boundedList,
				{
					jd: $elm$core$Maybe$Just(2),
					jg: 0
				},
				'preparation',
				query.aL,
				$author$project$Data$Food$Validation$validatePreparation,
				A4(
					$author$project$Data$Validation$list,
					'packaging',
					query.bB,
					$author$project$Data$Food$Validation$validateProcess(db),
					A4(
						$author$project$Data$Validation$list,
						'ingredients',
						query.iR,
						$author$project$Data$Food$Validation$validateIngredient(db),
						A3(
							$author$project$Data$Validation$ok,
							'distribution',
							query.cO,
							$elm$core$Result$Ok($author$project$Data$Food$Query$Query))))));
	});
var $author$project$Server$Route$decodeFoodQueryBody = function (db) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$decodeValue($author$project$Data$Food$Query$decode),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$mapError($author$project$Data$Validation$fromDecodingError),
			$elm$core$Result$andThen(
				$author$project$Data$Food$Validation$validate(db))));
};
var $author$project$Data$Textile$Product$Id = $elm$core$Basics$identity;
var $author$project$Data$Textile$Query$Query = function (airTransportRatio) {
	return function (business) {
		return function (countryDyeing) {
			return function (countryFabric) {
				return function (countryMaking) {
					return function (countrySpinning) {
						return function (disabledSteps) {
							return function (dyeingProcessType) {
								return function (fabricProcess) {
									return function (fading) {
										return function (makingComplexity) {
											return function (makingDeadStock) {
												return function (makingWaste) {
													return function (mass) {
														return function (materials) {
															return function (numberOfReferences) {
																return function (physicalDurability) {
																	return function (price) {
																		return function (printing) {
																			return function (product) {
																				return function (surfaceMass) {
																					return function (trims) {
																						return function (upcycled) {
																							return function (yarnSize) {
																								return {bY: airTransportRatio, fC: business, aW: countryDyeing, bb: countryFabric, bc: countryMaking, b4: countrySpinning, b6: disabledSteps, b7: dyeingProcessType, bj: fabricProcess, cb: fading, i9: makingComplexity, cl: makingDeadStock, cm: makingWaste, T: mass, jc: materials, gB: numberOfReferences, co: physicalDurability, gM: price, cp: printing, aC: product, e5: surfaceMass, kv: trims, cz: upcycled, kF: yarnSize};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Data$Textile$Dyeing$Average = 0;
var $author$project$Data$Textile$Dyeing$Continuous = 1;
var $author$project$Data$Textile$Dyeing$Discontinuous = 2;
var $author$project$Data$Textile$Dyeing$fromString = function (string) {
	switch (string) {
		case 'average':
			return $elm$core$Result$Ok(0);
		case 'continuous':
			return $elm$core$Result$Ok(1);
		case 'discontinuous':
			return $elm$core$Result$Ok(2);
		default:
			return $elm$core$Result$Err('Type de teinture inconnu\u202F: ' + string);
	}
};
var $author$project$Data$Textile$Dyeing$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Dyeing$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Textile$Fabric$KnittingCircular = 0;
var $author$project$Data$Textile$Fabric$KnittingFullyFashioned = 1;
var $author$project$Data$Textile$Fabric$KnittingIntegral = 2;
var $author$project$Data$Textile$Fabric$KnittingMix = 3;
var $author$project$Data$Textile$Fabric$KnittingStraight = 4;
var $author$project$Data$Textile$Fabric$Weaving = 5;
var $author$project$Data$Textile$Fabric$fromString = function (string) {
	switch (string) {
		case 'knitting-circular':
			return $elm$core$Result$Ok(0);
		case 'knitting-fully-fashioned':
			return $elm$core$Result$Ok(1);
		case 'knitting-integral':
			return $elm$core$Result$Ok(2);
		case 'knitting-mix':
			return $elm$core$Result$Ok(3);
		case 'knitting-straight':
			return $elm$core$Result$Ok(4);
		case 'weaving':
			return $elm$core$Result$Ok(5);
		default:
			return $elm$core$Result$Err('Procédé de tissage/tricotage inconnu: ' + string);
	}
};
var $author$project$Data$Textile$Fabric$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Fabric$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Textile$MakingComplexity$High = 0;
var $author$project$Data$Textile$MakingComplexity$Low = 1;
var $author$project$Data$Textile$MakingComplexity$Medium = 2;
var $author$project$Data$Textile$MakingComplexity$NotApplicable = 3;
var $author$project$Data$Textile$MakingComplexity$VeryHigh = 4;
var $author$project$Data$Textile$MakingComplexity$VeryLow = 5;
var $author$project$Data$Textile$MakingComplexity$fromString = function (str) {
	switch (str) {
		case 'high':
			return $elm$core$Result$Ok(0);
		case 'low':
			return $elm$core$Result$Ok(1);
		case 'medium':
			return $elm$core$Result$Ok(2);
		case 'not-applicable':
			return $elm$core$Result$Ok(3);
		case 'very-high':
			return $elm$core$Result$Ok(4);
		case 'very-low':
			return $elm$core$Result$Ok(5);
		default:
			return $elm$core$Result$Err('Type de complexité de fabrication inconnu\u00A0: ' + str);
	}
};
var $author$project$Data$Textile$MakingComplexity$decode = A2(
	$elm$json$Json$Decode$andThen,
	function (complexityStr) {
		return $elm_community$json_extra$Json$Decode$Extra$fromResult(
			$author$project$Data$Textile$MakingComplexity$fromString(complexityStr));
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$Textile$Printing$Printing = F2(
	function (kind, ratio) {
		return {eF: kind, jR: ratio};
	});
var $author$project$Data$Textile$Printing$Pigment = 0;
var $author$project$Data$Textile$Printing$Substantive = 1;
var $author$project$Data$Textile$Printing$fromString = function (string) {
	switch (string) {
		case 'pigment':
			return $elm$core$Result$Ok(0);
		case 'substantive':
			return $elm$core$Result$Ok(1);
		default:
			return $elm$core$Result$Err('Type d\'impression inconnu: ' + string);
	}
};
var $author$project$Data$Textile$Printing$decodeKind = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Printing$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Data$Split$fromBoundedFloat = F3(
	function (min, max, _float) {
		return ((_Utils_cmp(_float, min) < 0) || (_Utils_cmp(_float, max) > 0)) ? $elm$core$Result$Err(
			'Cette proportion doit être comprise entre ' + ($elm$core$String$fromFloat(min) + (' et ' + ($elm$core$String$fromFloat(max) + (' inclus (ici\u202F: ' + ($elm$core$String$fromFloat(_float) + ')')))))) : $elm$core$Result$Ok(100 * _float);
	});
var $author$project$Data$Textile$Printing$decodePrintingRatio = A2(
	$elm$json$Json$Decode$andThen,
	A2(
		$elm$core$Basics$composeR,
		A2($author$project$Data$Split$fromBoundedFloat, 0, 0.8),
		$elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$float);
var $author$project$Data$Split$twenty = 20;
var $author$project$Data$Textile$Printing$defaultRatio = $author$project$Data$Split$twenty;
var $author$project$Data$Textile$Printing$decode = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'ratio',
	$author$project$Data$Textile$Printing$decodePrintingRatio,
	$author$project$Data$Textile$Printing$defaultRatio,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'kind',
		$author$project$Data$Textile$Printing$decodeKind,
		$elm$json$Json$Decode$succeed($author$project$Data$Textile$Printing$Printing)));
var $author$project$Data$Textile$Economics$LargeBusinessWithServices = 0;
var $author$project$Data$Textile$Economics$LargeBusinessWithoutServices = 1;
var $author$project$Data$Textile$Economics$SmallBusiness = 2;
var $author$project$Data$Textile$Economics$businessFromString = function (string) {
	switch (string) {
		case 'small-business':
			return $elm$core$Result$Ok(2);
		case 'large-business-with-services':
			return $elm$core$Result$Ok(0);
		case 'large-business-without-services':
			return $elm$core$Result$Ok(1);
		default:
			return $elm$core$Result$Err('Type d\'entreprise inconnu : ' + string);
	}
};
var $author$project$Data$Textile$Economics$decodeBusiness = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Economics$businessFromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Split$fromFloat = A2($author$project$Data$Split$fromBoundedFloat, 0, 1);
var $author$project$Data$Split$decodeFloat = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Split$fromFloat, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$float);
var $author$project$Data$Textile$Step$Label$Distribution = 0;
var $author$project$Data$Textile$Step$Label$EndOfLife = 1;
var $author$project$Data$Textile$Step$Label$Ennobling = 2;
var $author$project$Data$Textile$Step$Label$Fabric = 3;
var $author$project$Data$Textile$Step$Label$Making = 4;
var $author$project$Data$Textile$Step$Label$Material = 5;
var $author$project$Data$Textile$Step$Label$Spinning = 6;
var $author$project$Data$Textile$Step$Label$Use = 7;
var $author$project$Data$Textile$Step$Label$fromCodeString = function (code) {
	switch (code) {
		case 'distribution':
			return $elm$core$Result$Ok(0);
		case 'ennobling':
			return $elm$core$Result$Ok(2);
		case 'eol':
			return $elm$core$Result$Ok(1);
		case 'fabric':
			return $elm$core$Result$Ok(3);
		case 'making':
			return $elm$core$Result$Ok(4);
		case 'material':
			return $elm$core$Result$Ok(5);
		case 'spinning':
			return $elm$core$Result$Ok(6);
		case 'use':
			return $elm$core$Result$Ok(7);
		default:
			return $elm$core$Result$Err('Code étape inconnu: ' + code);
	}
};
var $author$project$Data$Textile$Step$Label$decodeFromCode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Step$Label$fromCodeString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Component$Id = $elm$core$Basics$identity;
var $author$project$Data$Component$Item = F3(
	function (custom, id, quantity) {
		return {P: custom, H: id, bG: quantity};
	});
var $author$project$Data$Component$Custom = F3(
	function (elements, name, scopes) {
		return {o: elements, L: name, M: scopes};
	});
var $author$project$Data$Scope$Object = 1;
var $author$project$Data$Scope$Veli = 3;
var $author$project$Data$Scope$fromString = function (string) {
	switch (string) {
		case 'food':
			return $elm$core$Result$Ok(0);
		case 'object':
			return $elm$core$Result$Ok(1);
		case 'textile':
			return $elm$core$Result$Ok(2);
		case 'veli':
			return $elm$core$Result$Ok(3);
		default:
			return $elm$core$Result$Err('Couldn\'t decode unknown scope ' + string);
	}
};
var $author$project$Data$Scope$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Scope$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Component$Amount = $elm$core$Basics$identity;
var $author$project$Data$Component$Element = F3(
	function (amount, material, transforms) {
		return {aQ: amount, aa: material, at: transforms};
	});
var $author$project$Data$Component$decodeElement = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'transforms',
	$elm$json$Json$Decode$list($author$project$Data$Process$decodeId),
	_List_Nil,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'material',
		$author$project$Data$Process$decodeId,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'amount',
			A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$float),
			$elm$json$Json$Decode$succeed($author$project$Data$Component$Element))));
var $author$project$Data$Component$decodeCustom = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'scopes',
	$elm$json$Json$Decode$list($author$project$Data$Scope$decode),
	_List_Nil,
	A3(
		$author$project$Data$Common$DecodeUtils$strictOptional,
		'name',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'elements',
			$elm$json$Json$Decode$list($author$project$Data$Component$decodeElement),
			$elm$json$Json$Decode$succeed($author$project$Data$Component$Custom))));
var $author$project$Data$Component$Quantity = $elm$core$Basics$identity;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Data$Component$decodeQuantity = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$identity,
	A2(
		$elm$json$Json$Decode$andThen,
		function (_int) {
			return (_int < 1) ? $elm$json$Json$Decode$fail('La quantité doit être un nombre entier positif') : $elm$json$Json$Decode$succeed(_int);
		},
		$elm$json$Json$Decode$int));
var $author$project$Data$Component$decodeItem = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'quantity',
	$author$project$Data$Component$decodeQuantity,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $author$project$Data$Uuid$decoder),
		A3(
			$author$project$Data$Common$DecodeUtils$strictOptional,
			'custom',
			$author$project$Data$Component$decodeCustom,
			$elm$json$Json$Decode$succeed($author$project$Data$Component$Item))));
var $author$project$Data$Textile$Material$Id = $elm$core$Basics$identity;
var $author$project$Data$Textile$Query$MaterialQuery = F4(
	function (country, id, share, spinning) {
		return {fL: country, H: id, ac: share, cu: spinning};
	});
var $author$project$Data$Textile$Material$Spinning$Conventional = 0;
var $author$project$Data$Textile$Material$Spinning$Synthetic = 1;
var $author$project$Data$Textile$Material$Spinning$Unconventional = 2;
var $author$project$Data$Textile$Material$Spinning$fromString = function (string) {
	switch (string) {
		case 'ConventionalSpinning':
			return $elm$core$Result$Ok(0);
		case 'SyntheticSpinning':
			return $elm$core$Result$Ok(1);
		case 'UnconventionalSpinning':
			return $elm$core$Result$Ok(2);
		default:
			var other = string;
			return $elm$core$Result$Err('Le procédé de filature ou filage ' + (other + ' n\'est pas valide'));
	}
};
var $author$project$Data$Textile$Material$Spinning$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Material$Spinning$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Textile$Query$decodeMaterialQuery = A3(
	$author$project$Data$Common$DecodeUtils$strictOptional,
	'spinning',
	$author$project$Data$Textile$Material$Spinning$decode,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'share',
		$author$project$Data$Split$decodeFloat,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'id',
			A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string),
			A3(
				$author$project$Data$Common$DecodeUtils$strictOptional,
				'country',
				$author$project$Data$Country$decodeCode,
				$elm$json$Json$Decode$succeed($author$project$Data$Textile$Query$MaterialQuery)))));
var $author$project$Data$Unit$PhysicalDurability = $elm$core$Basics$identity;
var $author$project$Data$Unit$physicalDurability = function (value) {
	return value;
};
var $author$project$Data$Unit$decodePhysicalDurability = A2($elm$json$Json$Decode$map, $author$project$Data$Unit$physicalDurability, $elm$json$Json$Decode$float);
var $author$project$Data$Textile$Economics$Price = $elm$core$Basics$identity;
var $author$project$Data$Textile$Economics$priceFromFloat = $elm$core$Basics$identity;
var $author$project$Data$Textile$Economics$decodePrice = A2($elm$json$Json$Decode$map, $author$project$Data$Textile$Economics$priceFromFloat, $elm$json$Json$Decode$float);
var $ianmackenzie$elm_units$Area$squareMeters = function (numSquareMeters) {
	return numSquareMeters;
};
var $ianmackenzie$elm_units$Area$squareMeter = $ianmackenzie$elm_units$Area$squareMeters(1);
var $author$project$Data$Unit$gramsPerSquareMeter = function (_int) {
	return A2(
		$ianmackenzie$elm_units$Quantity$rate,
		$ianmackenzie$elm_units$Mass$grams(_int),
		$ianmackenzie$elm_units$Area$squareMeter);
};
var $author$project$Data$Unit$decodeSurfaceMass = A2($elm$json$Json$Decode$map, $author$project$Data$Unit$gramsPerSquareMeter, $elm$json$Json$Decode$int);
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Data$Unit$yarnSizeGramsPer10km = function (weight) {
	return A2(
		$ianmackenzie$elm_units$Quantity$rate,
		$ianmackenzie$elm_units$Length$meters(10000),
		$ianmackenzie$elm_units$Mass$grams(weight));
};
var $ianmackenzie$elm_units$Mass$kilogram = $ianmackenzie$elm_units$Mass$kilograms(1);
var $author$project$Data$Unit$yarnSizeKilometersPerKg = function (kilometers) {
	return A2(
		$ianmackenzie$elm_units$Quantity$rate,
		$ianmackenzie$elm_units$Length$kilometers(kilometers),
		$ianmackenzie$elm_units$Mass$kilogram);
};
var $author$project$Data$Unit$parseYarnSize = function (str) {
	var withUnitRegex = A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('(\\d+)(Nm|Dtex)'));
	var subMatches = A2(
		$elm$core$List$map,
		function ($) {
			return $.kg;
		},
		A2($elm$regex$Regex$find, withUnitRegex, str));
	var _v0 = $elm$core$String$toFloat(str);
	if (!_v0.$) {
		var _float = _v0.a;
		return $elm$core$Maybe$Just(
			$author$project$Data$Unit$yarnSizeKilometersPerKg(_float));
	} else {
		_v1$2:
		while (true) {
			if ((((((subMatches.b && subMatches.a.b) && (!subMatches.a.a.$)) && subMatches.a.b.b) && (!subMatches.a.b.a.$)) && (!subMatches.a.b.b.b)) && (!subMatches.b.b)) {
				switch (subMatches.a.b.a.a) {
					case 'Nm':
						var _v2 = subMatches.a;
						var floatStr = _v2.a.a;
						var _v3 = _v2.b;
						return A2(
							$elm$core$Maybe$map,
							$author$project$Data$Unit$yarnSizeKilometersPerKg,
							$elm$core$String$toFloat(floatStr));
					case 'Dtex':
						var _v4 = subMatches.a;
						var floatStr = _v4.a.a;
						var _v5 = _v4.b;
						return A2(
							$elm$core$Maybe$map,
							$author$project$Data$Unit$yarnSizeGramsPer10km,
							$elm$core$String$toFloat(floatStr));
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Data$Unit$decodeYarnSize = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $author$project$Data$Unit$yarnSizeKilometersPerKg, $elm$json$Json$Decode$float),
			A2(
			$elm$json$Json$Decode$andThen,
			function (str) {
				return $elm_community$json_extra$Json$Decode$Extra$fromResult(
					A2(
						$elm$core$Result$fromMaybe,
						'Titrage invalide: ' + str,
						$author$project$Data$Unit$parseYarnSize(str)));
			},
			$elm$json$Json$Decode$string)
		]));
var $author$project$Data$Textile$Query$decode = A3(
	$author$project$Data$Common$DecodeUtils$strictOptional,
	'yarnSize',
	$author$project$Data$Unit$decodeYarnSize,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'upcycled',
		$elm$json$Json$Decode$bool,
		false,
		A3(
			$author$project$Data$Common$DecodeUtils$strictOptional,
			'trims',
			$elm$json$Json$Decode$list($author$project$Data$Component$decodeItem),
			A3(
				$author$project$Data$Common$DecodeUtils$strictOptional,
				'surfaceMass',
				$author$project$Data$Unit$decodeSurfaceMass,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'product',
					A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string),
					A3(
						$author$project$Data$Common$DecodeUtils$strictOptional,
						'printing',
						$author$project$Data$Textile$Printing$decode,
						A3(
							$author$project$Data$Common$DecodeUtils$strictOptional,
							'price',
							$author$project$Data$Textile$Economics$decodePrice,
							A3(
								$author$project$Data$Common$DecodeUtils$strictOptional,
								'physicalDurability',
								$author$project$Data$Unit$decodePhysicalDurability,
								A3(
									$author$project$Data$Common$DecodeUtils$strictOptional,
									'numberOfReferences',
									$elm$json$Json$Decode$int,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'materials',
										$elm$json$Json$Decode$list($author$project$Data$Textile$Query$decodeMaterialQuery),
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'mass',
											A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Mass$kilograms, $elm$json$Json$Decode$float),
											A3(
												$author$project$Data$Common$DecodeUtils$strictOptional,
												'makingWaste',
												$author$project$Data$Split$decodeFloat,
												A3(
													$author$project$Data$Common$DecodeUtils$strictOptional,
													'makingDeadStock',
													$author$project$Data$Split$decodeFloat,
													A3(
														$author$project$Data$Common$DecodeUtils$strictOptional,
														'makingComplexity',
														$author$project$Data$Textile$MakingComplexity$decode,
														A3(
															$author$project$Data$Common$DecodeUtils$strictOptional,
															'fading',
															$elm$json$Json$Decode$bool,
															A3(
																$author$project$Data$Common$DecodeUtils$strictOptional,
																'fabricProcess',
																$author$project$Data$Textile$Fabric$decode,
																A3(
																	$author$project$Data$Common$DecodeUtils$strictOptional,
																	'dyeingProcessType',
																	$author$project$Data$Textile$Dyeing$decode,
																	A4(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																		'disabledSteps',
																		$elm$json$Json$Decode$list($author$project$Data$Textile$Step$Label$decodeFromCode),
																		_List_Nil,
																		A3(
																			$author$project$Data$Common$DecodeUtils$strictOptional,
																			'countrySpinning',
																			$author$project$Data$Country$decodeCode,
																			A3(
																				$author$project$Data$Common$DecodeUtils$strictOptional,
																				'countryMaking',
																				$author$project$Data$Country$decodeCode,
																				A3(
																					$author$project$Data$Common$DecodeUtils$strictOptional,
																					'countryFabric',
																					$author$project$Data$Country$decodeCode,
																					A3(
																						$author$project$Data$Common$DecodeUtils$strictOptional,
																						'countryDyeing',
																						$author$project$Data$Country$decodeCode,
																						A3(
																							$author$project$Data$Common$DecodeUtils$strictOptional,
																							'business',
																							$author$project$Data$Textile$Economics$decodeBusiness,
																							A3(
																								$author$project$Data$Common$DecodeUtils$strictOptional,
																								'airTransportRatio',
																								$author$project$Data$Split$decodeFloat,
																								$elm$json$Json$Decode$succeed($author$project$Data$Textile$Query$Query)))))))))))))))))))))))));
var $author$project$Data$Validation$nonEmptyList = $author$project$Data$Validation$boundedList(
	{jd: $elm$core$Maybe$Nothing, jg: 1});
var $author$project$Data$Component$findById = function (id) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.H;
				},
				$elm$core$Basics$eq(id))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			$elm$core$Result$fromMaybe(
				'Aucun composant avec id=' + $author$project$Data$Component$idToString(id))));
};
var $author$project$Data$Component$quantityToInt = function (_v0) {
	var _int = _v0;
	return _int;
};
var $author$project$Data$Component$validateItem = F2(
	function (components, item) {
		return A2(
			$elm$core$Result$andThen,
			$elm$core$Basics$always(
				($author$project$Data$Component$quantityToInt(item.bG) < 1) ? $elm$core$Result$Err('La quantité doit être un nombre entier positif') : $elm$core$Result$Ok(item)),
			A2($author$project$Data$Component$findById, item.H, components));
	});
var $author$project$Data$Split$thirty = 30;
var $author$project$Data$Env$maxMakingDeadStockRatio = $author$project$Data$Split$thirty;
var $author$project$Data$Env$minMakingDeadStockRatio = $author$project$Data$Split$zero;
var $author$project$Data$Split$toFloat = function (_v0) {
	var _float = _v0;
	return _float / 100;
};
var $author$project$Data$Split$toFloatString = A2($elm$core$Basics$composeR, $author$project$Data$Split$toFloat, $elm$core$String$fromFloat);
var $author$project$Data$Validation$validateWithin = F3(
	function (what, _v0, value) {
		var max = _v0.jd;
		var min = _v0.jg;
		var toNumber = _v0.bO;
		var toString = _v0.bP;
		return ((_Utils_cmp(
			toNumber(value),
			toNumber(min)) < 0) || (_Utils_cmp(
			toNumber(value),
			toNumber(max)) > 0)) ? $elm$core$Result$Err(
			what + (' doit être compris(e) entre ' + (toString(min) + (' et ' + (toString(max) + '.'))))) : $elm$core$Result$Ok(value);
	});
var $author$project$Data$Textile$Validation$validateMakingDeadStock = A2(
	$author$project$Data$Validation$validateWithin,
	'Le taux de stocks dormants en confection',
	{jd: $author$project$Data$Env$maxMakingDeadStockRatio, jg: $author$project$Data$Env$minMakingDeadStockRatio, bO: $author$project$Data$Split$toFloat, bP: $author$project$Data$Split$toFloatString});
var $author$project$Data$Env$maxMakingWasteRatio = $author$project$Data$Split$fourty;
var $author$project$Data$Env$minMakingWasteRatio = $author$project$Data$Split$zero;
var $author$project$Data$Textile$Validation$validateMakingWaste = A2(
	$author$project$Data$Validation$validateWithin,
	'Le taux de perte en confection',
	{jd: $author$project$Data$Env$maxMakingWasteRatio, jg: $author$project$Data$Env$minMakingWasteRatio, bO: $author$project$Data$Split$toFloat, bP: $author$project$Data$Split$toFloatString});
var $author$project$Data$Textile$Validation$validateMass = function (mass) {
	return ($ianmackenzie$elm_units$Mass$inKilograms(mass) <= 0) ? $elm$core$Result$Err('La masse doit être supérieure ou égale à zéro') : $elm$core$Result$Ok(mass);
};
var $author$project$Data$Textile$Material$findById = function (id) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.H;
				},
				$elm$core$Basics$eq(id))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			$elm$core$Result$fromMaybe(
				'Matière non trouvée id=' + ($author$project$Data$Textile$Material$idToString(id) + '.'))));
};
var $author$project$Data$Textile$Validation$validateMaybe = function (fn) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map(
			A2(
				$elm$core$Basics$composeR,
				fn,
				$elm$core$Result$map($elm$core$Maybe$Just))),
		$elm$core$Maybe$withDefault(
			$elm$core$Result$Ok($elm$core$Maybe$Nothing)));
};
var $author$project$Data$Textile$Validation$validateMaterialQuery = F2(
	function (db, materialQuery) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$elm$core$Result$Ok(materialQuery.cu),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				$elm$core$Result$Ok(materialQuery.ac),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A2(
						$elm$core$Result$map,
						function ($) {
							return $.H;
						},
						A2($author$project$Data$Textile$Material$findById, materialQuery.H, db.kk.jc)),
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						A2(
							$author$project$Data$Textile$Validation$validateMaybe,
							A2($author$project$Data$Country$validateForScope, 2, db.h4),
							materialQuery.fL),
						$elm$core$Result$Ok($author$project$Data$Textile$Query$MaterialQuery)))));
	});
var $author$project$Data$Textile$Economics$maxNumberOfReferences = 999999;
var $author$project$Data$Textile$Economics$minNumberOfReferences = 1;
var $author$project$Data$Textile$Validation$validateNumberOfReferences = A2(
	$author$project$Data$Validation$validateWithin,
	'Le nombre de références',
	{jd: $author$project$Data$Textile$Economics$maxNumberOfReferences, jg: $author$project$Data$Textile$Economics$minNumberOfReferences, bO: $elm$core$Basics$identity, bP: $elm$core$String$fromInt});
var $author$project$Data$Unit$maxDurability = function (dur) {
	return dur(1.45);
};
var $author$project$Data$Unit$minDurability = function (dur) {
	return dur(0.67);
};
var $author$project$Data$Unit$physicalDurabilityToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Textile$Validation$validatePhysicalDurability = A2(
	$author$project$Data$Validation$validateWithin,
	'Le coefficient de durabilité physique',
	{
		jd: $author$project$Data$Unit$maxDurability($elm$core$Basics$identity),
		jg: $author$project$Data$Unit$minDurability($elm$core$Basics$identity),
		bO: $author$project$Data$Unit$physicalDurabilityToFloat,
		bP: A2($elm$core$Basics$composeR, $author$project$Data$Unit$physicalDurabilityToFloat, $elm$core$String$fromFloat)
	});
var $author$project$Data$Textile$Economics$maxPrice = 1000;
var $author$project$Data$Textile$Economics$minPrice = 1;
var $author$project$Data$Textile$Economics$priceToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Textile$Validation$validatePrice = A2(
	$author$project$Data$Validation$validateWithin,
	'Le prix unitaire',
	{
		jd: $author$project$Data$Textile$Economics$maxPrice,
		jg: $author$project$Data$Textile$Economics$minPrice,
		bO: $author$project$Data$Textile$Economics$priceToFloat,
		bP: A2($elm$core$Basics$composeR, $author$project$Data$Textile$Economics$priceToFloat, $elm$core$String$fromFloat)
	});
var $author$project$Data$Textile$Product$findById = function (id) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.H;
				},
				$elm$core$Basics$eq(id))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			$elm$core$Result$fromMaybe(
				'Produit non trouvé id=' + ($author$project$Data$Textile$Product$idToString(id) + '.'))));
};
var $author$project$Data$Textile$Validation$validateProduct = F2(
	function (db, id) {
		return A2(
			$elm$core$Result$map,
			function ($) {
				return $.H;
			},
			A2($author$project$Data$Textile$Product$findById, id, db.kk.jP));
	});
var $author$project$Data$Unit$maxSurfaceMass = $author$project$Data$Unit$gramsPerSquareMeter(500);
var $author$project$Data$Unit$minSurfaceMass = $author$project$Data$Unit$gramsPerSquareMeter(80);
var $ianmackenzie$elm_units$Quantity$at = F2(
	function (_v0, _v1) {
		var rateOfChange = _v0;
		var independentValue = _v1;
		return rateOfChange * independentValue;
	});
var $ianmackenzie$elm_units$Mass$inGrams = function (mass) {
	return 1000 * $ianmackenzie$elm_units$Mass$inKilograms(mass);
};
var $author$project$Data$Unit$surfaceMassInGramsPerSquareMeters = function (surfaceMass) {
	return $elm$core$Basics$round(
		$ianmackenzie$elm_units$Mass$inGrams(
			A2($ianmackenzie$elm_units$Quantity$at, surfaceMass, $ianmackenzie$elm_units$Area$squareMeter)));
};
var $author$project$Data$Textile$Validation$validateSurfaceMass = A2(
	$author$project$Data$Validation$validateWithin,
	'La masse surfacique',
	{
		jd: $author$project$Data$Unit$maxSurfaceMass,
		jg: $author$project$Data$Unit$minSurfaceMass,
		bO: $author$project$Data$Unit$surfaceMassInGramsPerSquareMeters,
		bP: A2($elm$core$Basics$composeR, $author$project$Data$Unit$surfaceMassInGramsPerSquareMeters, $elm$core$String$fromInt)
	});
var $author$project$Data$Unit$maxYarnSize = $author$project$Data$Unit$yarnSizeKilometersPerKg(200);
var $author$project$Data$Unit$minYarnSize = $author$project$Data$Unit$yarnSizeKilometersPerKg(9);
var $ianmackenzie$elm_units$Length$inMeters = function (_v0) {
	var numMeters = _v0;
	return numMeters;
};
var $ianmackenzie$elm_units$Length$inKilometers = function (length) {
	return 0.001 * $ianmackenzie$elm_units$Length$inMeters(length);
};
var $author$project$Data$Unit$yarnSizeInKilometers = function (yarnSize) {
	return $ianmackenzie$elm_units$Length$inKilometers(
		A2($ianmackenzie$elm_units$Quantity$at, yarnSize, $ianmackenzie$elm_units$Mass$kilogram));
};
var $author$project$Data$Textile$Validation$validateYarnSize = A2(
	$author$project$Data$Validation$validateWithin,
	'Le titrage',
	{
		jd: $author$project$Data$Unit$maxYarnSize,
		jg: $author$project$Data$Unit$minYarnSize,
		bO: $author$project$Data$Unit$yarnSizeInKilometers,
		bP: A2($elm$core$Basics$composeR, $author$project$Data$Unit$yarnSizeInKilometers, $elm$core$String$fromFloat)
	});
var $author$project$Data$Textile$Validation$validate = F2(
	function (db, query) {
		return A4(
			$author$project$Data$Validation$maybe,
			'yarnSize',
			query.kF,
			$author$project$Data$Textile$Validation$validateYarnSize,
			A3(
				$author$project$Data$Validation$ok,
				'upcycled',
				query.cz,
				A4(
					$author$project$Data$Validation$maybe,
					'trims',
					query.kv,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(
							$author$project$Data$Component$validateItem(db.di)),
						$elm_community$result_extra$Result$Extra$combine),
					A4(
						$author$project$Data$Validation$maybe,
						'surfaceMass',
						query.e5,
						$author$project$Data$Textile$Validation$validateSurfaceMass,
						A3(
							$author$project$Data$Validation$check,
							'product',
							A2($author$project$Data$Textile$Validation$validateProduct, db, query.aC),
							A3(
								$author$project$Data$Validation$ok,
								'printing',
								query.cp,
								A4(
									$author$project$Data$Validation$maybe,
									'price',
									query.gM,
									$author$project$Data$Textile$Validation$validatePrice,
									A4(
										$author$project$Data$Validation$maybe,
										'physicalDurability',
										query.co,
										$author$project$Data$Textile$Validation$validatePhysicalDurability,
										A4(
											$author$project$Data$Validation$maybe,
											'numberOfReferences',
											query.gB,
											$author$project$Data$Textile$Validation$validateNumberOfReferences,
											A4(
												$author$project$Data$Validation$nonEmptyList,
												'materials',
												query.jc,
												$author$project$Data$Textile$Validation$validateMaterialQuery(db),
												A3(
													$author$project$Data$Validation$check,
													'mass',
													$author$project$Data$Textile$Validation$validateMass(query.T),
													A4(
														$author$project$Data$Validation$maybe,
														'makingWaste',
														query.cm,
														$author$project$Data$Textile$Validation$validateMakingWaste,
														A4(
															$author$project$Data$Validation$maybe,
															'makingDeadStock',
															query.cl,
															$author$project$Data$Textile$Validation$validateMakingDeadStock,
															A3(
																$author$project$Data$Validation$ok,
																'makingComplexity',
																query.i9,
																A3(
																	$author$project$Data$Validation$ok,
																	'fading',
																	query.cb,
																	A3(
																		$author$project$Data$Validation$ok,
																		'fabricProcess',
																		query.bj,
																		A3(
																			$author$project$Data$Validation$ok,
																			'dyeingProcessType',
																			query.b7,
																			A3(
																				$author$project$Data$Validation$ok,
																				'disabledSteps',
																				query.b6,
																				A4(
																					$author$project$Data$Validation$maybe,
																					'countrySpinning',
																					query.b4,
																					A2($author$project$Data$Country$validateForScope, 2, db.h4),
																					A4(
																						$author$project$Data$Validation$maybe,
																						'countryMaking',
																						query.bc,
																						A2($author$project$Data$Country$validateForScope, 2, db.h4),
																						A4(
																							$author$project$Data$Validation$maybe,
																							'countryFabric',
																							query.bb,
																							A2($author$project$Data$Country$validateForScope, 2, db.h4),
																							A4(
																								$author$project$Data$Validation$maybe,
																								'countryDyeing',
																								query.aW,
																								A2($author$project$Data$Country$validateForScope, 2, db.h4),
																								A3(
																									$author$project$Data$Validation$ok,
																									'business',
																									query.fC,
																									A3(
																										$author$project$Data$Validation$ok,
																										'airTransportRatio',
																										query.bY,
																										$elm$core$Result$Ok($author$project$Data$Textile$Query$Query)))))))))))))))))))))))));
	});
var $author$project$Server$Route$decodeTextileQueryBody = function (db) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$decodeValue($author$project$Data$Textile$Query$decode),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$mapError($author$project$Data$Validation$fromDecodingError),
			$elm$core$Result$andThen(
				$author$project$Data$Textile$Validation$validate(db))));
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.bU;
		var unvisited = _v0.a4;
		var params = _v0.bC;
		var frag = _v0.bl;
		var value = _v0.bT;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.bU;
			var unvisited = _v1.a4;
			var params = _v1.bC;
			var frag = _v1.bl;
			var value = _v1.bT;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var visited = _v0.bU;
			var unvisited = _v0.a4;
			var params = _v0.bC;
			var frag = _v0.bl;
			var value = _v0.bT;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Data$Impact$Definition$Acd = 0;
var $author$project$Data$Impact$Definition$Cch = 1;
var $author$project$Data$Impact$Definition$Ecs = 19;
var $author$project$Data$Impact$Definition$Etf = 2;
var $author$project$Data$Impact$Definition$EtfC = 3;
var $author$project$Data$Impact$Definition$Fru = 4;
var $author$project$Data$Impact$Definition$Fwe = 5;
var $author$project$Data$Impact$Definition$Htc = 6;
var $author$project$Data$Impact$Definition$HtcC = 7;
var $author$project$Data$Impact$Definition$Htn = 8;
var $author$project$Data$Impact$Definition$HtnC = 9;
var $author$project$Data$Impact$Definition$Ior = 10;
var $author$project$Data$Impact$Definition$Ldu = 11;
var $author$project$Data$Impact$Definition$Mru = 12;
var $author$project$Data$Impact$Definition$Ozd = 13;
var $author$project$Data$Impact$Definition$Pco = 14;
var $author$project$Data$Impact$Definition$Pef = 20;
var $author$project$Data$Impact$Definition$Pma = 15;
var $author$project$Data$Impact$Definition$Swe = 16;
var $author$project$Data$Impact$Definition$Tre = 17;
var $author$project$Data$Impact$Definition$Wtu = 18;
var $author$project$Data$Impact$Definition$toTrigram = function (str) {
	switch (str) {
		case 'acd':
			return $elm$core$Result$Ok(0);
		case 'cch':
			return $elm$core$Result$Ok(1);
		case 'etf':
			return $elm$core$Result$Ok(2);
		case 'etf-c':
			return $elm$core$Result$Ok(3);
		case 'fru':
			return $elm$core$Result$Ok(4);
		case 'fwe':
			return $elm$core$Result$Ok(5);
		case 'htc':
			return $elm$core$Result$Ok(6);
		case 'htc-c':
			return $elm$core$Result$Ok(7);
		case 'htn':
			return $elm$core$Result$Ok(8);
		case 'htn-c':
			return $elm$core$Result$Ok(9);
		case 'ior':
			return $elm$core$Result$Ok(10);
		case 'ldu':
			return $elm$core$Result$Ok(11);
		case 'mru':
			return $elm$core$Result$Ok(12);
		case 'ozd':
			return $elm$core$Result$Ok(13);
		case 'pco':
			return $elm$core$Result$Ok(14);
		case 'pma':
			return $elm$core$Result$Ok(15);
		case 'swe':
			return $elm$core$Result$Ok(16);
		case 'tre':
			return $elm$core$Result$Ok(17);
		case 'wtu':
			return $elm$core$Result$Ok(18);
		case 'ecs':
			return $elm$core$Result$Ok(19);
		case 'pef':
			return $elm$core$Result$Ok(20);
		default:
			return $elm$core$Result$Err('Trigramme d\'impact inconnu: ' + str);
	}
};
var $author$project$Data$Impact$parseTrigram = A2(
	$elm$url$Url$Parser$custom,
	'TRIGRAM',
	function (trigram) {
		return $elm$core$Result$toMaybe(
			$author$project$Data$Impact$Definition$toTrigram(trigram));
	});
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.bU;
		var unvisited = _v0.a4;
		var params = _v0.bC;
		var frag = _v0.bl;
		var value = _v0.bT;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $author$project$Server$Route$parser = F2(
	function (db, body) {
		return $elm$url$Url$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$FoodGetCountryList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('food'),
							$elm$url$Url$Parser$s('countries')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$FoodGetIngredientList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('food'),
							$elm$url$Url$Parser$s('ingredients')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$FoodGetTransformList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('food'),
							$elm$url$Url$Parser$s('transforms')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$FoodGetPackagingList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('food'),
							$elm$url$Url$Parser$s('packagings')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$FoodPostRecipe(
						A2($author$project$Server$Route$decodeFoodQueryBody, db, body)),
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('POST'),
						$elm$url$Url$Parser$s('food'))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextileGetCountryList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							$elm$url$Url$Parser$s('countries')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextileGetMaterialList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							$elm$url$Url$Parser$s('materials')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextileGetProductList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							$elm$url$Url$Parser$s('products')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextileGetTrimList,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('GET'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							$elm$url$Url$Parser$s('trims')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextilePostSimulator(
						A2($author$project$Server$Route$decodeTextileQueryBody, db, body)),
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('POST'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							$elm$url$Url$Parser$s('simulator')))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextilePostSimulatorDetailed(
						A2($author$project$Server$Route$decodeTextileQueryBody, db, body)),
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('POST'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							A2(
								$elm$url$Url$Parser$slash,
								$elm$url$Url$Parser$s('simulator'),
								$elm$url$Url$Parser$s('detailed'))))),
					A2(
					$elm$url$Url$Parser$map,
					$author$project$Server$Route$TextilePostSimulatorSingle(
						A2($author$project$Server$Route$decodeTextileQueryBody, db, body)),
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('POST'),
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('textile'),
							A2(
								$elm$url$Url$Parser$slash,
								$elm$url$Url$Parser$s('simulator'),
								$author$project$Data$Impact$parseTrigram))))
				]));
	});
var $author$project$Server$Route$endpoint = F2(
	function (db, _v0) {
		var body = _v0.hV;
		var method = _v0.gr;
		var url = _v0.ht;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$url$Url$Parser$parse(
				A2($author$project$Server$Route$parser, db, body)),
			$elm$url$Url$fromString('http://x/' + (method + url)));
	});
var $author$project$Data$Food$Ingredient$NoCooling = 2;
var $author$project$Data$Unit$impact = function (value) {
	return value;
};
var $author$project$Data$Unit$impactToFloat = function (_v0) {
	var value = _v0;
	return value;
};
var $ianmackenzie$elm_units$Energy$inJoules = function (_v0) {
	var numJoules = _v0;
	return numJoules;
};
var $ianmackenzie$elm_units$Energy$inKilowattHours = function (energy) {
	return $ianmackenzie$elm_units$Energy$inJoules(energy) / 3.6e6;
};
var $ianmackenzie$elm_units$Energy$inMegajoules = function (energy) {
	return $ianmackenzie$elm_units$Energy$inJoules(energy) / 1.0e6;
};
var $author$project$Data$Impact$Impacts = $elm$core$Basics$identity;
var $author$project$Data$Impact$Definition$map = F2(
	function (func, definitions) {
		return {
			a6: A2(func, 0, definitions.a6),
			a9: A2(func, 1, definitions.a9),
			be: A2(func, 19, definitions.be),
			bg: A2(func, 2, definitions.bg),
			bh: A2(func, 3, definitions.bh),
			bm: A2(func, 4, definitions.bm),
			bn: A2(func, 5, definitions.bn),
			bp: A2(func, 6, definitions.bp),
			bq: A2(func, 7, definitions.bq),
			br: A2(func, 8, definitions.br),
			bs: A2(func, 9, definitions.bs),
			bt: A2(func, 10, definitions.bt),
			bu: A2(func, 11, definitions.bu),
			by: A2(func, 12, definitions.by),
			bA: A2(func, 13, definitions.bA),
			bD: A2(func, 14, definitions.bD),
			bE: A2(func, 20, definitions.bE),
			bF: A2(func, 15, definitions.bF),
			bK: A2(func, 16, definitions.bK),
			bR: A2(func, 17, definitions.bR),
			bW: A2(func, 18, definitions.bW)
		};
	});
var $author$project$Data$Impact$mapImpacts = F2(
	function (fn, _v0) {
		var impacts = _v0;
		return A2($author$project$Data$Impact$Definition$map, fn, impacts);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Data$Impact$Definition$init = function (a) {
	return {a6: a, a9: a, be: a, bg: a, bh: a, bm: a, bn: a, bp: a, bq: a, br: a, bs: a, bt: a, bu: a, by: a, bA: a, bD: a, bE: a, bF: a, bK: a, bR: a, bW: a};
};
var $ianmackenzie$elm_units$Quantity$zero = 0;
var $author$project$Data$Impact$empty = $author$project$Data$Impact$Definition$init($ianmackenzie$elm_units$Quantity$zero);
var $author$project$Data$Impact$Definition$get = F2(
	function (trigram, definitions) {
		switch (trigram) {
			case 0:
				return definitions.a6;
			case 1:
				return definitions.a9;
			case 2:
				return definitions.bg;
			case 3:
				return definitions.bh;
			case 4:
				return definitions.bm;
			case 5:
				return definitions.bn;
			case 6:
				return definitions.bp;
			case 7:
				return definitions.bq;
			case 8:
				return definitions.br;
			case 9:
				return definitions.bs;
			case 10:
				return definitions.bt;
			case 11:
				return definitions.bu;
			case 12:
				return definitions.by;
			case 13:
				return definitions.bA;
			case 14:
				return definitions.bD;
			case 15:
				return definitions.bF;
			case 16:
				return definitions.bK;
			case 17:
				return definitions.bR;
			case 18:
				return definitions.bW;
			case 19:
				return definitions.be;
			default:
				return definitions.bE;
		}
	});
var $author$project$Data$Impact$getImpact = F2(
	function (trigram, _v0) {
		var impacts = _v0;
		return A2($author$project$Data$Impact$Definition$get, trigram, impacts);
	});
var $ianmackenzie$elm_units$Quantity$plus = F2(
	function (_v0, _v1) {
		var y = _v0;
		var x = _v1;
		return x + y;
	});
var $ianmackenzie$elm_units$Quantity$sum = function (quantities) {
	return A3($elm$core$List$foldl, $ianmackenzie$elm_units$Quantity$plus, $ianmackenzie$elm_units$Quantity$zero, quantities);
};
var $author$project$Data$Impact$sumImpacts = A2(
	$elm$core$List$foldl,
	function (impacts) {
		return $author$project$Data$Impact$mapImpacts(
			F2(
				function (trigram, impact) {
					return $ianmackenzie$elm_units$Quantity$sum(
						_List_fromArray(
							[
								A2($author$project$Data$Impact$getImpact, trigram, impacts),
								impact
							]));
				}));
	},
	$author$project$Data$Impact$empty);
var $author$project$Data$Food$Preparation$apply = F3(
	function (wellKnown, mass, preparation) {
		return $author$project$Data$Impact$sumImpacts(
			_List_fromArray(
				[
					A2(
					$author$project$Data$Impact$mapImpacts,
					function (_v0) {
						return A2(
							$elm$core$Basics$composeR,
							$author$project$Data$Unit$impactToFloat,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$mul(
									$ianmackenzie$elm_units$Energy$inKilowattHours(preparation.eo.a)),
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Basics$mul(
										$ianmackenzie$elm_units$Mass$inKilograms(mass)),
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Basics$mul(
											$author$project$Data$Split$toFloat(preparation.eo.b)),
										$author$project$Data$Unit$impact))));
					},
					wellKnown.i7.z),
					A2(
					$author$project$Data$Impact$mapImpacts,
					function (_v1) {
						return A2(
							$elm$core$Basics$composeR,
							$author$project$Data$Unit$impactToFloat,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$mul(
									$ianmackenzie$elm_units$Energy$inMegajoules(preparation.ez.a)),
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Basics$mul(
										$ianmackenzie$elm_units$Mass$inKilograms(mass)),
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Basics$mul(
											$author$project$Data$Split$toFloat(preparation.ez.b)),
										$author$project$Data$Unit$impact))));
					},
					wellKnown.ij.z)
				]));
	});
var $ianmackenzie$elm_units$Quantity$difference = F2(
	function (_v0, _v1) {
		var x = _v0;
		var y = _v1;
		return x - y;
	});
var $author$project$Data$Impact$Definition$update = F3(
	function (trigram, updateFunc, definitions) {
		switch (trigram) {
			case 0:
				return _Utils_update(
					definitions,
					{
						a6: updateFunc(definitions.a6)
					});
			case 1:
				return _Utils_update(
					definitions,
					{
						a9: updateFunc(definitions.a9)
					});
			case 2:
				return _Utils_update(
					definitions,
					{
						bg: updateFunc(definitions.bg)
					});
			case 3:
				return _Utils_update(
					definitions,
					{
						bh: updateFunc(definitions.bh)
					});
			case 4:
				return _Utils_update(
					definitions,
					{
						bm: updateFunc(definitions.bm)
					});
			case 5:
				return _Utils_update(
					definitions,
					{
						bn: updateFunc(definitions.bn)
					});
			case 6:
				return _Utils_update(
					definitions,
					{
						bp: updateFunc(definitions.bp)
					});
			case 7:
				return _Utils_update(
					definitions,
					{
						bq: updateFunc(definitions.bq)
					});
			case 8:
				return _Utils_update(
					definitions,
					{
						br: updateFunc(definitions.br)
					});
			case 9:
				return _Utils_update(
					definitions,
					{
						bs: updateFunc(definitions.bs)
					});
			case 10:
				return _Utils_update(
					definitions,
					{
						bt: updateFunc(definitions.bt)
					});
			case 11:
				return _Utils_update(
					definitions,
					{
						bu: updateFunc(definitions.bu)
					});
			case 12:
				return _Utils_update(
					definitions,
					{
						by: updateFunc(definitions.by)
					});
			case 13:
				return _Utils_update(
					definitions,
					{
						bA: updateFunc(definitions.bA)
					});
			case 14:
				return _Utils_update(
					definitions,
					{
						bD: updateFunc(definitions.bD)
					});
			case 15:
				return _Utils_update(
					definitions,
					{
						bF: updateFunc(definitions.bF)
					});
			case 16:
				return _Utils_update(
					definitions,
					{
						bK: updateFunc(definitions.bK)
					});
			case 17:
				return _Utils_update(
					definitions,
					{
						bR: updateFunc(definitions.bR)
					});
			case 18:
				return _Utils_update(
					definitions,
					{
						bW: updateFunc(definitions.bW)
					});
			case 19:
				return _Utils_update(
					definitions,
					{
						be: updateFunc(definitions.be)
					});
			default:
				return _Utils_update(
					definitions,
					{
						bE: updateFunc(definitions.bE)
					});
		}
	});
var $author$project$Data$Impact$insertWithoutAggregateComputation = F3(
	function (trigram, impact, _v0) {
		var impacts = _v0;
		return A3(
			$author$project$Data$Impact$Definition$update,
			trigram,
			$elm$core$Basics$always(impact),
			impacts);
	});
var $author$project$Data$Impact$applyComplements = F2(
	function (complement, impacts) {
		var ecoScore = A2($author$project$Data$Impact$getImpact, 19, impacts);
		return A3(
			$author$project$Data$Impact$insertWithoutAggregateComputation,
			19,
			A2($ianmackenzie$elm_units$Quantity$difference, ecoScore, complement),
			impacts);
	});
var $author$project$Data$Impact$Definition$trigrams = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
var $author$project$Data$Impact$Definition$foldl = F3(
	function (func, acc, base) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (trigram, acc_) {
					return A3(
						func,
						trigram,
						A2($author$project$Data$Impact$Definition$get, trigram, base),
						acc_);
				}),
			acc,
			$author$project$Data$Impact$Definition$trigrams);
	});
var $ianmackenzie$elm_units$Quantity$divideBy = F2(
	function (divisor, _v0) {
		var value = _v0;
		return value / divisor;
	});
var $ianmackenzie$elm_units$Quantity$multiplyBy = F2(
	function (scale, _v0) {
		var value = _v0;
		return scale * value;
	});
var $author$project$Data$Unit$impactAggregateScore = F2(
	function (normalization, weighting) {
		return A2(
			$elm$core$Basics$composeR,
			$ianmackenzie$elm_units$Quantity$divideBy(
				$author$project$Data$Unit$impactToFloat(normalization)),
			A2(
				$elm$core$Basics$composeR,
				$ianmackenzie$elm_units$Quantity$multiplyBy(
					$author$project$Data$Split$toFloat(weighting)),
				$ianmackenzie$elm_units$Quantity$multiplyBy(1000000)));
	});
var $author$project$Data$Impact$computeAggregatedScore = F3(
	function (definitions, getter, _v0) {
		var impacts = _v0;
		return A3(
			$author$project$Data$Impact$Definition$foldl,
			function (_v2) {
				return $ianmackenzie$elm_units$Quantity$plus;
			},
			$ianmackenzie$elm_units$Quantity$zero,
			A2(
				$author$project$Data$Impact$Definition$map,
				F2(
					function (trigram, impact) {
						return A2(
							$elm$core$Maybe$withDefault,
							$ianmackenzie$elm_units$Quantity$zero,
							A2(
								$elm$core$Maybe$map,
								function (_v1) {
									var normalization = _v1.gA;
									var weighting = _v1.hA;
									return A3($author$project$Data$Unit$impactAggregateScore, normalization, weighting, impact);
								},
								getter(
									A2($author$project$Data$Impact$Definition$get, trigram, definitions))));
					}),
				impacts));
	});
var $author$project$Data$Impact$Definition$filter = F3(
	function (func, zero, base) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (trigram, acc) {
					return func(trigram) ? acc : A3($author$project$Data$Impact$Definition$update, trigram, zero, acc);
				}),
			base,
			$author$project$Data$Impact$Definition$trigrams);
	});
var $author$project$Data$Impact$toProtectionAreas = F2(
	function (definitions, _v0) {
		var impactsPerKgWithoutComplements = _v0;
		var pick = function (trigrams) {
			return A3(
				$author$project$Data$Impact$computeAggregatedScore,
				definitions,
				function ($) {
					return $.fV;
				},
				A3(
					$author$project$Data$Impact$Definition$filter,
					function (t) {
						return A2($elm$core$List$member, t, trigrams);
					},
					$elm$core$Basics$always($ianmackenzie$elm_units$Quantity$zero),
					impactsPerKgWithoutComplements));
		};
		return {
			hS: pick(
				_List_fromArray(
					[0, 17, 5, 16, 3, 11])),
			h$: pick(
				_List_fromArray(
					[1])),
			iK: pick(
				_List_fromArray(
					[13, 10, 14, 9, 7, 15])),
			jZ: pick(
				_List_fromArray(
					[18, 4, 12]))
		};
	});
var $author$project$Data$Scoring$compute = F3(
	function (definitions, totalComplementsImpactPerKg, perKgWithoutComplements) {
		var subScores = A2($author$project$Data$Impact$toProtectionAreas, definitions, perKgWithoutComplements);
		var ecsPerKgWithoutComplements = A2($author$project$Data$Impact$getImpact, 19, perKgWithoutComplements);
		return {
			hM: A2($ianmackenzie$elm_units$Quantity$difference, ecsPerKgWithoutComplements, totalComplementsImpactPerKg),
			d4: ecsPerKgWithoutComplements,
			hS: subScores.hS,
			h$: subScores.h$,
			ee: totalComplementsImpactPerKg,
			iK: subScores.iK,
			jZ: subScores.jZ
		};
	});
var $author$project$Data$Food$Retail$elecImpact = F2(
	function (elecNeeds, volume) {
		return A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.z;
			},
			$author$project$Data$Impact$mapImpacts(
				F2(
					function (_v0, impact) {
						return $author$project$Data$Unit$impact(
							$ianmackenzie$elm_units$Energy$inKilowattHours(
								A2($ianmackenzie$elm_units$Quantity$at, elecNeeds, volume)) * $author$project$Data$Unit$impactToFloat(impact));
					})));
	});
var $ianmackenzie$elm_units$Volume$inCubicMeters = function (_v0) {
	var numCubicMeters = _v0;
	return numCubicMeters;
};
var $ianmackenzie$elm_units$Volume$inLiters = function (volume) {
	return 1000 * $ianmackenzie$elm_units$Volume$inCubicMeters(volume);
};
var $author$project$Data$Food$Retail$waterImpact = F2(
	function (waterNeeds, volume) {
		return A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.z;
			},
			$author$project$Data$Impact$mapImpacts(
				F2(
					function (_v0, impact) {
						return $author$project$Data$Unit$impact(
							$ianmackenzie$elm_units$Volume$inLiters(
								A2($ianmackenzie$elm_units$Quantity$multiplyBy, waterNeeds, volume)) * $author$project$Data$Unit$impactToFloat(impact));
					})));
	});
var $author$project$Data$Food$Retail$computeImpacts = F3(
	function (volume, _v0, wellknown) {
		var needs = _v0.b;
		return $author$project$Data$Impact$sumImpacts(
			_List_fromArray(
				[
					A3($author$project$Data$Food$Retail$waterImpact, needs.bV, volume, wellknown.bV),
					A3($author$project$Data$Food$Retail$elecImpact, needs.b2, volume, wellknown.i7),
					A3($author$project$Data$Food$Retail$elecImpact, needs.b9, volume, wellknown.i7)
				]));
	});
var $ianmackenzie$elm_units$Mass$inMetricTons = function (mass) {
	return 0.001 * $ianmackenzie$elm_units$Mass$inKilograms(mass);
};
var $author$project$Data$Transport$computeImpacts = F3(
	function (_v0, mass, transport) {
		var wellKnown = _v0.kD;
		var transportImpacts = $author$project$Data$Impact$sumImpacts(
			A2(
				$elm$core$List$map,
				function (_v1) {
					var transportProcess = _v1.a;
					var distance = _v1.b;
					return A2(
						$author$project$Data$Impact$mapImpacts,
						F2(
							function (_v2, impact) {
								return $author$project$Data$Unit$impact(
									($ianmackenzie$elm_units$Mass$inMetricTons(mass) * $ianmackenzie$elm_units$Length$inKilometers(distance)) * $author$project$Data$Unit$impactToFloat(impact));
							}),
						transportProcess.z);
				},
				_List_fromArray(
					[
						_Utils_Tuple2(wellKnown.i6, transport.dP),
						_Utils_Tuple2(wellKnown.i5, transport.j2),
						_Utils_Tuple2(wellKnown.hU, transport.g4),
						_Utils_Tuple2(wellKnown.hT, transport.j7),
						_Utils_Tuple2(wellKnown.gJ, transport.hK)
					])));
		return _Utils_update(
			transport,
			{z: transportImpacts});
	});
var $author$project$Data$Food$Recipe$computeImpact = F2(
	function (mass, _v0) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Unit$impactToFloat,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Basics$mul(
					$ianmackenzie$elm_units$Mass$inKilograms(mass)),
				$author$project$Data$Unit$impact));
	});
var $author$project$Data$Food$Recipe$computeIngredientImpacts = function (_v0) {
	var ingredient = _v0.aw;
	var mass = _v0.T;
	return A2(
		$author$project$Data$Impact$mapImpacts,
		$author$project$Data$Food$Recipe$computeImpact(mass),
		ingredient.jO.z);
};
var $author$project$Data$Food$Ingredient$AlwaysCool = 0;
var $author$project$Data$Food$Origin$France = 1;
var $author$project$Data$Transport$addRoadWithCooling = F3(
	function (distance, withCooling, transport) {
		return withCooling ? _Utils_update(
			transport,
			{
				j2: A2($ianmackenzie$elm_units$Quantity$plus, distance, transport.j2)
			}) : _Utils_update(
			transport,
			{
				dP: A2($ianmackenzie$elm_units$Quantity$plus, distance, transport.dP)
			});
	});
var $author$project$Data$Country$codeFromString = $elm$core$Basics$identity;
var $author$project$Data$Food$Recipe$france = $author$project$Data$Country$codeFromString('FR');
var $author$project$Data$Transport$default = function (impacts) {
	return {hK: $ianmackenzie$elm_units$Quantity$zero, z: impacts, dP: $ianmackenzie$elm_units$Quantity$zero, j2: $ianmackenzie$elm_units$Quantity$zero, g4: $ianmackenzie$elm_units$Quantity$zero, j7: $ianmackenzie$elm_units$Quantity$zero};
};
var $author$project$Data$Food$Ingredient$getDefaultOriginTransport = F2(
	function (planeTransport, origin) {
		var _default = $author$project$Data$Transport$default($author$project$Data$Impact$empty);
		switch (origin) {
			case 0:
				return _Utils_update(
					_default,
					{
						dP: $ianmackenzie$elm_units$Length$kilometers(2500)
					});
			case 1:
				return _default;
			case 2:
				return _Utils_update(
					_default,
					{
						dP: $ianmackenzie$elm_units$Length$kilometers(2500),
						g4: $ianmackenzie$elm_units$Length$kilometers(18000)
					});
			default:
				return (!planeTransport) ? _Utils_update(
					_default,
					{
						hK: $ianmackenzie$elm_units$Length$kilometers(18000),
						dP: $ianmackenzie$elm_units$Length$kilometers(2500)
					}) : _Utils_update(
					_default,
					{
						dP: $ianmackenzie$elm_units$Length$kilometers(2500),
						g4: $ianmackenzie$elm_units$Length$kilometers(18000)
					});
		}
	});
var $ianmackenzie$elm_units$Quantity$positiveInfinity = 1 / 0;
var $ianmackenzie$elm_units$Quantity$infinity = $ianmackenzie$elm_units$Quantity$positiveInfinity;
var $author$project$Data$Transport$erroneous = function (impacts) {
	return {hK: $ianmackenzie$elm_units$Quantity$infinity, z: impacts, dP: $ianmackenzie$elm_units$Quantity$infinity, j2: $ianmackenzie$elm_units$Quantity$infinity, g4: $ianmackenzie$elm_units$Quantity$infinity, j7: $ianmackenzie$elm_units$Quantity$infinity};
};
var $turboMaCk$any_dict$Dict$Any$get = F2(
	function (k, _v0) {
		var dict = _v0.g;
		var toKey = _v0.ae;
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$Dict$get,
				toKey(k),
				dict));
	});
var $author$project$Data$Transport$getTransportBetween = F4(
	function (impacts, cA, cB, distances) {
		var _v0 = _Utils_Tuple2(
			A2(
				$elm$core$Maybe$andThen,
				$turboMaCk$any_dict$Dict$Any$get(cB),
				A2($turboMaCk$any_dict$Dict$Any$get, cA, distances)),
			A2(
				$elm$core$Maybe$andThen,
				$turboMaCk$any_dict$Dict$Any$get(cA),
				A2($turboMaCk$any_dict$Dict$Any$get, cB, distances)));
		if (!_v0.a.$) {
			var transport = _v0.a.a;
			return _Utils_update(
				transport,
				{z: impacts});
		} else {
			if (!_v0.b.$) {
				var transport = _v0.b.a;
				return _Utils_update(
					transport,
					{z: impacts});
			} else {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				return $author$project$Data$Transport$erroneous(impacts);
			}
		}
	});
var $author$project$Data$Split$apply = F2(
	function (input, split) {
		return $author$project$Data$Split$toFloat(split) * input;
	});
var $author$project$Data$Split$half = 50;
var $author$project$Data$Split$quarter = 25;
var $author$project$Data$Split$tenth = 10;
var $author$project$Data$Transport$roadSeaTransportRatio = function (_v0) {
	var road = _v0.dP;
	var sea = _v0.g4;
	return (!$ianmackenzie$elm_units$Length$inKilometers(road)) ? $author$project$Data$Split$zero : ((!$ianmackenzie$elm_units$Length$inKilometers(sea)) ? $author$project$Data$Split$full : (($ianmackenzie$elm_units$Length$inKilometers(road) <= 500) ? $author$project$Data$Split$full : (($ianmackenzie$elm_units$Length$inKilometers(road) < 1000) ? $author$project$Data$Split$complement($author$project$Data$Split$tenth) : (($ianmackenzie$elm_units$Length$inKilometers(road) < 2000) ? $author$project$Data$Split$half : (($ianmackenzie$elm_units$Length$inKilometers(road) < 3000) ? $author$project$Data$Split$quarter : $author$project$Data$Split$zero)))));
};
var $author$project$Data$Textile$Formula$transportRatio = F2(
	function (airTransportRatio, transport) {
		var road = transport.dP;
		var sea = transport.g4;
		var air = transport.hK;
		var roadRatio = $author$project$Data$Transport$roadSeaTransportRatio(transport);
		var seaRatio = $author$project$Data$Split$complement(roadRatio);
		return _Utils_update(
			transport,
			{
				hK: A2(
					$ianmackenzie$elm_units$Quantity$multiplyBy,
					$author$project$Data$Split$toFloat(airTransportRatio),
					air),
				dP: A2(
					$ianmackenzie$elm_units$Quantity$multiplyBy,
					A2(
						$author$project$Data$Split$apply,
						$author$project$Data$Split$toFloat(roadRatio),
						$author$project$Data$Split$complement(airTransportRatio)),
					road),
				g4: A2(
					$ianmackenzie$elm_units$Quantity$multiplyBy,
					A2(
						$author$project$Data$Split$apply,
						$author$project$Data$Split$toFloat(seaRatio),
						$author$project$Data$Split$complement(airTransportRatio)),
					sea)
			});
	});
var $author$project$Data$Food$Recipe$computeIngredientTransport = F2(
	function (db, _v0) {
		var country = _v0.fL;
		var ingredient = _v0.aw;
		var mass = _v0.T;
		var planeTransport = _v0.gJ;
		var toTransformation = function (t) {
			return A3(
				$author$project$Data$Transport$addRoadWithCooling,
				$ianmackenzie$elm_units$Length$kilometers(160),
				!ingredient.ks,
				t);
		};
		var toLogistics = function (t) {
			if (!country.$) {
				var code = country.a.cK;
				return (!_Utils_eq(
					code,
					$author$project$Data$Country$codeFromString('FR'))) ? A3(
					$author$project$Data$Transport$addRoadWithCooling,
					$ianmackenzie$elm_units$Length$kilometers(500),
					!ingredient.ks,
					t) : t;
			} else {
				return (ingredient.fR !== 1) ? A3(
					$author$project$Data$Transport$addRoadWithCooling,
					$ianmackenzie$elm_units$Length$kilometers(500),
					!ingredient.ks,
					t) : t;
			}
		};
		var planeRatio = (!planeTransport) ? $author$project$Data$Split$full : $author$project$Data$Split$zero;
		var emptyImpacts = $author$project$Data$Impact$empty;
		var baseTransport = function () {
			var base = function () {
				if (!country.$) {
					var code = country.a.cK;
					return A2(
						$author$project$Data$Textile$Formula$transportRatio,
						planeRatio,
						A4($author$project$Data$Transport$getTransportBetween, emptyImpacts, code, $author$project$Data$Food$Recipe$france, db.ih));
				} else {
					return A2($author$project$Data$Food$Ingredient$getDefaultOriginTransport, planeTransport, ingredient.fR);
				}
			}();
			return (ingredient.ks !== 2) ? _Utils_update(
				base,
				{dP: $ianmackenzie$elm_units$Quantity$zero, j2: base.dP, g4: $ianmackenzie$elm_units$Quantity$zero, j7: base.g4}) : base;
		}();
		var transport = toLogistics(
			toTransformation(baseTransport));
		return A3($author$project$Data$Transport$computeImpacts, db.dt, mass, transport);
	});
var $author$project$Data$Impact$addComplementsImpacts = F2(
	function (a, b) {
		return {
			dj: A2($ianmackenzie$elm_units$Quantity$plus, a.dj, b.dj),
			du: A2($ianmackenzie$elm_units$Quantity$plus, a.du, b.du),
			dz: A2($ianmackenzie$elm_units$Quantity$plus, a.dz, b.dz),
			jf: A2($ianmackenzie$elm_units$Quantity$plus, a.jf, b.jf),
			jD: A2($ianmackenzie$elm_units$Quantity$plus, a.jD, b.jD),
			dG: A2($ianmackenzie$elm_units$Quantity$plus, a.dG, b.dG),
			dH: A2($ianmackenzie$elm_units$Quantity$plus, a.dH, b.dH)
		};
	});
var $author$project$Data$Unit$Ratio = $elm$core$Basics$identity;
var $author$project$Data$Unit$ratio = function (_float) {
	return _float;
};
var $author$project$Data$Food$EcosystemicServices$coefficients = {
	dj: $author$project$Data$Unit$ratio(1.5),
	du: $author$project$Data$Unit$ratio(3),
	dz: $author$project$Data$Unit$ratio(3000),
	dG: $author$project$Data$Unit$ratio(7),
	dH: $author$project$Data$Unit$ratio(4)
};
var $author$project$Data$Unit$noImpacts = $author$project$Data$Unit$impact(0);
var $author$project$Data$Unit$ratioToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Food$Recipe$computeIngredientComplementsImpacts = F2(
	function (_v0, ingredientMass) {
		var cropDiversity = _v0.dj;
		var hedges = _v0.du;
		var livestockDensity = _v0.dz;
		var permanentPasture = _v0.dG;
		var plotSize = _v0.dH;
		var apply = function (coeff) {
			return A2(
				$elm$core$Basics$composeR,
				$ianmackenzie$elm_units$Quantity$multiplyBy(
					$ianmackenzie$elm_units$Mass$inKilograms(ingredientMass)),
				$ianmackenzie$elm_units$Quantity$multiplyBy(
					$author$project$Data$Unit$ratioToFloat(coeff)));
		};
		return {
			dj: A2(apply, $author$project$Data$Food$EcosystemicServices$coefficients.dj, cropDiversity),
			du: A2(apply, $author$project$Data$Food$EcosystemicServices$coefficients.du, hedges),
			dz: A2(apply, $author$project$Data$Food$EcosystemicServices$coefficients.dz, livestockDensity),
			jf: $author$project$Data$Unit$noImpacts,
			jD: $author$project$Data$Unit$noImpacts,
			dG: A2(apply, $author$project$Data$Food$EcosystemicServices$coefficients.dG, permanentPasture),
			dH: A2(apply, $author$project$Data$Food$EcosystemicServices$coefficients.dH, plotSize)
		};
	});
var $author$project$Data$Impact$noComplementsImpacts = {dj: $author$project$Data$Unit$noImpacts, du: $author$project$Data$Unit$noImpacts, dz: $author$project$Data$Unit$noImpacts, jf: $author$project$Data$Unit$noImpacts, jD: $author$project$Data$Unit$noImpacts, dG: $author$project$Data$Unit$noImpacts, dH: $author$project$Data$Unit$noImpacts};
var $author$project$Data$Food$Recipe$computeIngredientsTotalComplements = A2(
	$elm$core$List$foldl,
	F2(
		function (_v0, acc) {
			var ingredient = _v0.aw;
			var mass = _v0.T;
			return A2(
				$author$project$Data$Impact$addComplementsImpacts,
				acc,
				A2($author$project$Data$Food$Recipe$computeIngredientComplementsImpacts, ingredient.is, mass));
		}),
	$author$project$Data$Impact$noComplementsImpacts);
var $author$project$Data$Food$Recipe$computeProcessImpacts = function (item) {
	return A2(
		$author$project$Data$Impact$mapImpacts,
		$author$project$Data$Food$Recipe$computeImpact(item.T),
		item.jO.z);
};
var $author$project$Data$Food$Retail$distributionTransport = F2(
	function (_v0, needsCooling) {
		var needs = _v0.b;
		return A3(
			$author$project$Data$Transport$addRoadWithCooling,
			needs.c5,
			needsCooling,
			$author$project$Data$Transport$default($author$project$Data$Impact$empty));
	});
var $author$project$Data$Food$Recipe$Recipe = F5(
	function (distribution, ingredients, packaging, preparation, transform) {
		return {cO: distribution, iR: ingredients, bB: packaging, aL: preparation, bQ: transform};
	});
var $author$project$Data$Food$Recipe$RecipeIngredient = F4(
	function (country, ingredient, mass, planeTransport) {
		return {fL: country, aw: ingredient, T: mass, gJ: planeTransport};
	});
var $author$project$Data$Food$Origin$OutOfEuropeAndMaghrebByPlane = 3;
var $author$project$Data$Food$Ingredient$byPlaneByDefault = function (ingredient) {
	return (ingredient.fR === 3) ? 0 : 2;
};
var $author$project$Data$Food$Ingredient$byPlaneAllowed = F2(
	function (planeTransport, ingredient) {
		var _v0 = _Utils_Tuple2(
			planeTransport,
			$author$project$Data$Food$Ingredient$byPlaneByDefault(ingredient));
		_v0$2:
		while (true) {
			switch (_v0.a) {
				case 0:
					if (_v0.b === 2) {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return $elm$core$Result$Err('Impossible de spécifier un acheminement par avion pour cet ingrédient, son origine par défaut ne le permet pas.');
					} else {
						break _v0$2;
					}
				case 2:
					if (!_v0.b) {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return $elm$core$Result$Ok(0);
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		}
		return $elm$core$Result$Ok(planeTransport);
	});
var $author$project$Data$Food$Recipe$ingredientFromQuery = F2(
	function (db, _v0) {
		var country = _v0.fL;
		var id = _v0.H;
		var mass = _v0.T;
		var planeTransport = _v0.gJ;
		var ingredientResult = A2($author$project$Data$Food$Ingredient$findById, id, db.dt.iR);
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			A2(
				$elm$core$Result$andThen,
				$author$project$Data$Food$Ingredient$byPlaneAllowed(planeTransport),
				ingredientResult),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				$elm$core$Result$Ok(mass),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					ingredientResult,
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						function () {
							var _v1 = A2(
								$elm$core$Maybe$map,
								function (c) {
									return A2($author$project$Data$Country$findByCode, c, db.h4);
								},
								country);
							if (!_v1.$) {
								if (!_v1.a.$) {
									var country_ = _v1.a.a;
									return $elm$core$Result$Ok(
										$elm$core$Maybe$Just(country_));
								} else {
									var error = _v1.a.a;
									return $elm$core$Result$Err(error);
								}
							} else {
								return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
							}
						}(),
						$elm$core$Result$Ok($author$project$Data$Food$Recipe$RecipeIngredient)))));
	});
var $author$project$Data$Food$Recipe$ingredientListFromQuery = function (db) {
	return A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.iR;
		},
		$elm_community$result_extra$Result$Extra$combineMap(
			$author$project$Data$Food$Recipe$ingredientFromQuery(db)));
};
var $author$project$Data$Food$Recipe$Packaging = F2(
	function (mass, process) {
		return {T: mass, jO: process};
	});
var $author$project$Data$Food$Recipe$packagingFromQuery = F2(
	function (_v0, _v1) {
		var processes = _v0.dJ;
		var id = _v1.H;
		var mass = _v1.T;
		return A2(
			$elm$core$Result$map,
			$author$project$Data$Food$Recipe$Packaging(mass),
			A2($author$project$Data$Process$findById, id, processes));
	});
var $author$project$Data$Food$Recipe$packagingListFromQuery = F2(
	function (db, query) {
		return A2(
			$elm_community$result_extra$Result$Extra$combineMap,
			$author$project$Data$Food$Recipe$packagingFromQuery(db),
			query.bB);
	});
var $author$project$Data$Food$Recipe$preparationListFromQuery = A2(
	$elm$core$Basics$composeR,
	function ($) {
		return $.aL;
	},
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map($author$project$Data$Food$Preparation$findById),
		$elm_community$result_extra$Result$Extra$combine));
var $author$project$Data$Food$Recipe$Transform = F2(
	function (mass, process) {
		return {T: mass, jO: process};
	});
var $author$project$Data$Food$Recipe$transformFromQuery = F2(
	function (_v0, query) {
		var processes = _v0.dJ;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Result$Ok($elm$core$Maybe$Nothing),
			A2(
				$elm$core$Maybe$map,
				function (_v1) {
					var id = _v1.H;
					var mass = _v1.T;
					return A2(
						$elm$core$Result$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Data$Food$Recipe$Transform(mass),
							$elm$core$Maybe$Just),
						A2($author$project$Data$Process$findById, id, processes));
				},
				query.bQ));
	});
var $author$project$Data$Food$Recipe$fromQuery = F2(
	function (db, query) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			A2($author$project$Data$Food$Recipe$transformFromQuery, db, query),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				$author$project$Data$Food$Recipe$preparationListFromQuery(query),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A2($author$project$Data$Food$Recipe$packagingListFromQuery, db, query),
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						A2($author$project$Data$Food$Recipe$ingredientListFromQuery, db, query),
						A2(
							$elm_community$result_extra$Result$Extra$andMap,
							$elm$core$Result$Ok(query.cO),
							$elm$core$Result$Ok($author$project$Data$Food$Recipe$Recipe))))));
	});
var $author$project$Data$Food$Recipe$getPackagingMass = function (recipe) {
	return $ianmackenzie$elm_units$Quantity$sum(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.T;
			},
			recipe.bB));
};
var $author$project$Data$Food$Recipe$isCookedAtPlant = F2(
	function (wellKnown, transform) {
		return _Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.jO;
				},
				transform),
			$elm$core$Maybe$Just(wellKnown.h3));
	});
var $author$project$Data$Food$Recipe$removeIngredientsInedibleMass = $elm$core$List$map(
	function (recipeIngredient) {
		var mass = recipeIngredient.T;
		var ingredient = recipeIngredient.aw;
		return _Utils_update(
			recipeIngredient,
			{
				T: A2(
					$ianmackenzie$elm_units$Quantity$multiplyBy,
					1 - $author$project$Data$Split$toFloat(ingredient.iQ),
					mass)
			});
	});
var $author$project$Data$Food$Recipe$getTransformedIngredientsMass = F2(
	function (wellKnown, _v0) {
		var ingredients = _v0.iR;
		var transform = _v0.bQ;
		return $ianmackenzie$elm_units$Quantity$sum(
			A2(
				$elm$core$List$map,
				function (_v1) {
					var ingredient = _v1.aw;
					var mass = _v1.T;
					return A2($author$project$Data$Food$Recipe$isCookedAtPlant, wellKnown, transform) ? A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$author$project$Data$Unit$ratioToFloat(ingredient.jT),
						mass) : mass;
				},
				$author$project$Data$Food$Recipe$removeIngredientsInedibleMass(ingredients)));
	});
var $author$project$Data$Food$Recipe$getMassAtPackaging = F2(
	function (wellKnown, recipe) {
		return $ianmackenzie$elm_units$Quantity$sum(
			_List_fromArray(
				[
					A2($author$project$Data$Food$Recipe$getTransformedIngredientsMass, wellKnown, recipe),
					$author$project$Data$Food$Recipe$getPackagingMass(recipe)
				]));
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Data$Food$Recipe$getPreparedMassAtConsumer = F2(
	function (wellKnown, recipe) {
		var ingredients = recipe.iR;
		var transform = recipe.bQ;
		var preparation = recipe.aL;
		var cookedAtConsumer = A2(
			$elm$core$List$any,
			function ($) {
				return $.aR;
			},
			preparation);
		return ((!A2($author$project$Data$Food$Recipe$isCookedAtPlant, wellKnown, transform)) && cookedAtConsumer) ? $ianmackenzie$elm_units$Quantity$sum(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var ingredient = _v0.aw;
					var mass = _v0.T;
					return A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$author$project$Data$Unit$ratioToFloat(ingredient.jT),
						mass);
				},
				ingredients)) : A2($author$project$Data$Food$Recipe$getTransformedIngredientsMass, wellKnown, recipe);
	});
var $author$project$Data$Impact$getTotalComplementsImpacts = function (complementsImpacts) {
	return $ianmackenzie$elm_units$Quantity$sum(
		_List_fromArray(
			[complementsImpacts.dj, complementsImpacts.du, complementsImpacts.dz, complementsImpacts.jf, complementsImpacts.jD, complementsImpacts.dG, complementsImpacts.dH]));
};
var $ianmackenzie$elm_units$Quantity$at_ = F2(
	function (_v0, _v1) {
		var rateOfChange = _v0;
		var dependentValue = _v1;
		return dependentValue / rateOfChange;
	});
var $ianmackenzie$elm_units$Density$kilogramsPerCubicMeter = function (numKilogramsPerCubicMeter) {
	return numKilogramsPerCubicMeter;
};
var $ianmackenzie$elm_units$Density$gramsPerCubicCentimeter = function (numGramsPerCubicCentimeter) {
	return $ianmackenzie$elm_units$Density$kilogramsPerCubicMeter(1000 * numGramsPerCubicCentimeter);
};
var $author$project$Data$Food$Recipe$getTransformedIngredientsDensity = function (_v0) {
	var ingredients = _v0.iR;
	var transform = _v0.bQ;
	if (ingredients.b && (!ingredients.b.b)) {
		var i = ingredients.a;
		return (!_Utils_eq(transform, $elm$core$Maybe$Nothing)) ? $ianmackenzie$elm_units$Density$gramsPerCubicCentimeter(1) : i.aw.ie;
	} else {
		return $ianmackenzie$elm_units$Density$gramsPerCubicCentimeter(1);
	}
};
var $author$project$Data$Food$Recipe$getTransformedIngredientsVolume = F2(
	function (wellKnown, recipe) {
		return A2(
			$ianmackenzie$elm_units$Quantity$at_,
			$author$project$Data$Food$Recipe$getTransformedIngredientsDensity(recipe),
			A2($author$project$Data$Food$Recipe$getTransformedIngredientsMass, wellKnown, recipe));
	});
var $author$project$Data$Impact$mapComplementsImpacts = F2(
	function (fn, ci) {
		return {
			dj: fn(ci.dj),
			du: fn(ci.du),
			dz: fn(ci.dz),
			jf: fn(ci.jf),
			jD: fn(ci.jD),
			dG: fn(ci.dG),
			dH: fn(ci.dH)
		};
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Data$Impact$perKg = function (totalMass) {
	return $author$project$Data$Impact$mapImpacts(
		function (_v0) {
			return $ianmackenzie$elm_units$Quantity$divideBy(
				$ianmackenzie$elm_units$Mass$inKilograms(totalMass));
		});
};
var $author$project$Data$Transport$sum = A2(
	$elm$core$List$foldl,
	F2(
		function (_v0, acc) {
			var air = _v0.hK;
			var impacts = _v0.z;
			var road = _v0.dP;
			var roadCooled = _v0.j2;
			var sea = _v0.g4;
			var seaCooled = _v0.j7;
			return _Utils_update(
				acc,
				{
					hK: A2($ianmackenzie$elm_units$Quantity$plus, air, acc.hK),
					z: $author$project$Data$Impact$sumImpacts(
						_List_fromArray(
							[acc.z, impacts])),
					dP: A2($ianmackenzie$elm_units$Quantity$plus, road, acc.dP),
					j2: A2($ianmackenzie$elm_units$Quantity$plus, roadCooled, acc.j2),
					g4: A2($ianmackenzie$elm_units$Quantity$plus, sea, acc.g4),
					j7: A2($ianmackenzie$elm_units$Quantity$plus, seaCooled, acc.j7)
				});
		}),
	$author$project$Data$Transport$default($author$project$Data$Impact$empty));
var $author$project$Data$Food$Recipe$compute = function (db) {
	var food = db.dt;
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Food$Recipe$fromQuery(db),
		$elm$core$Result$map(
			function (recipe) {
				var ingredients = recipe.iR;
				var transform = recipe.bQ;
				var packaging = recipe.bB;
				var distribution = recipe.cO;
				var preparation = recipe.aL;
				var transformedIngredientsMass = A2($author$project$Data$Food$Recipe$getTransformedIngredientsMass, food.kD, recipe);
				var transformImpacts = A2(
					$elm$core$Maybe$withDefault,
					$author$project$Data$Impact$empty,
					A2($elm$core$Maybe$map, $author$project$Data$Food$Recipe$computeProcessImpacts, transform));
				var totalComplementsImpact = $author$project$Data$Food$Recipe$computeIngredientsTotalComplements(ingredients);
				var preparedMass = A2($author$project$Data$Food$Recipe$getPreparedMassAtConsumer, food.kD, recipe);
				var totalComplementsImpactPerKg = A2(
					$author$project$Data$Impact$mapComplementsImpacts,
					$ianmackenzie$elm_units$Quantity$divideBy(
						$ianmackenzie$elm_units$Mass$inKilograms(preparedMass)),
					totalComplementsImpact);
				var preparationImpacts = $author$project$Data$Impact$sumImpacts(
					A2(
						$elm$core$List$map,
						A2($author$project$Data$Food$Preparation$apply, food.kD, transformedIngredientsMass),
						preparation));
				var packagingImpacts = $author$project$Data$Impact$sumImpacts(
					A2($elm$core$List$map, $author$project$Data$Food$Recipe$computeProcessImpacts, packaging));
				var ingredientsTransport = $author$project$Data$Transport$sum(
					A2(
						$elm$core$List$map,
						$author$project$Data$Food$Recipe$computeIngredientTransport(db),
						ingredients));
				var ingredientsImpacts = A2(
					$elm$core$List$map,
					function (recipeIngredient) {
						return A2(
							$elm$core$Tuple$pair,
							recipeIngredient,
							$author$project$Data$Food$Recipe$computeIngredientImpacts(recipeIngredient));
					},
					ingredients);
				var ingredientsTotalImpacts = $author$project$Data$Impact$sumImpacts(
					A2($elm$core$List$map, $elm$core$Tuple$second, ingredientsImpacts));
				var recipeImpacts = $author$project$Data$Impact$sumImpacts(
					_List_fromArray(
						[ingredientsTotalImpacts, transformImpacts, ingredientsTransport.z]));
				var distributionTransportNeedsCooling = A2(
					$elm$core$List$any,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.aw;
						},
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.ks;
							},
							$elm$core$Basics$neq(2))),
					ingredients);
				var distributionTransport = function () {
					var transport = A2(
						$elm$core$Maybe$withDefault,
						$author$project$Data$Transport$default($author$project$Data$Impact$empty),
						A2(
							$elm$core$Maybe$map,
							function (distrib) {
								return A2($author$project$Data$Food$Retail$distributionTransport, distrib, distributionTransportNeedsCooling);
							},
							distribution));
					var mass = A2($author$project$Data$Food$Recipe$getMassAtPackaging, food.kD, recipe);
					return A3($author$project$Data$Transport$computeImpacts, db.dt, mass, transport);
				}();
				var distributionImpacts = A2(
					$elm$core$Maybe$withDefault,
					$author$project$Data$Impact$empty,
					A2(
						$elm$core$Maybe$map,
						function (distrib) {
							var volume = A2($author$project$Data$Food$Recipe$getTransformedIngredientsVolume, food.kD, recipe);
							return A3($author$project$Data$Food$Retail$computeImpacts, volume, distrib, food.kD);
						},
						distribution));
				var totalImpactsWithoutComplements = $author$project$Data$Impact$sumImpacts(
					_List_fromArray(
						[recipeImpacts, packagingImpacts, distributionImpacts, distributionTransport.z, preparationImpacts]));
				var impactsPerKgWithoutComplements = A2($author$project$Data$Impact$perKg, preparedMass, totalImpactsWithoutComplements);
				var scoring = A3(
					$author$project$Data$Scoring$compute,
					db.id,
					$author$project$Data$Impact$getTotalComplementsImpacts(totalComplementsImpactPerKg),
					impactsPerKgWithoutComplements);
				var addIngredientsComplements = function (impacts) {
					return A2(
						$author$project$Data$Impact$applyComplements,
						$author$project$Data$Impact$getTotalComplementsImpacts(totalComplementsImpact),
						impacts);
				};
				var totalImpacts = addIngredientsComplements(totalImpactsWithoutComplements);
				var impactsPerKg = A2($author$project$Data$Impact$perKg, preparedMass, totalImpacts);
				return _Utils_Tuple2(
					recipe,
					{
						cO: {a3: distributionImpacts, aP: distributionTransport},
						bB: packagingImpacts,
						eS: impactsPerKg,
						aL: preparationImpacts,
						eU: preparedMass,
						aM: {
							it: $ianmackenzie$elm_units$Quantity$sum(
								A2(
									$elm$core$List$map,
									function ($) {
										return $.T;
									},
									$author$project$Data$Food$Recipe$removeIngredientsInedibleMass(recipe.iR))),
							iR: ingredientsImpacts,
							eD: addIngredientsComplements(ingredientsTotalImpacts),
							iT: $ianmackenzie$elm_units$Quantity$sum(
								A2(
									$elm$core$List$map,
									function ($) {
										return $.T;
									},
									recipe.iR)),
							a3: addIngredientsComplements(recipeImpacts),
							hm: totalComplementsImpact,
							ko: totalComplementsImpactPerKg,
							bQ: transformImpacts,
							kr: transformedIngredientsMass,
							aP: ingredientsTransport
						},
						eZ: scoring,
						a3: totalImpacts,
						fk: A2($author$project$Data$Food$Recipe$getMassAtPackaging, food.kD, recipe),
						aP: $author$project$Data$Transport$sum(
							_List_fromArray(
								[ingredientsTransport, distributionTransport]))
					});
			}));
};
var $author$project$Data$Validation$fromErrorString = $elm$core$Dict$singleton('general');
var $author$project$Server$toResponse = function (encodedResult) {
	if (encodedResult.$ === 1) {
		var errors = encodedResult.a;
		return _Utils_Tuple2(
			400,
			$author$project$Server$encodeValidationErrors(errors));
	} else {
		var encoded = encodedResult.a;
		return _Utils_Tuple2(200, encoded);
	}
};
var $author$project$Server$executeFoodQuery = F2(
	function (db, encoder) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Food$Recipe$compute(db),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$mapError($author$project$Data$Validation$fromErrorString),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Result$map(
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, encoder)),
					$author$project$Server$toResponse)));
	});
var $author$project$Data$Unit$NonPhysicalDurability = $elm$core$Basics$identity;
var $author$project$Data$Textile$Economics$computeNumberOfReferencesIndex = function (n) {
	var fromThreshold = F2(
		function (high, low) {
			return (low - n) / (low - high);
		});
	return $author$project$Data$Unit$ratio(
		(n <= 1000) ? 1 : ((n <= 7000) ? (0.5 + (A2(fromThreshold, 1000, 7000) * (1 - 0.5))) : ((n <= 16000) ? (A2(fromThreshold, 7000, 16000) * 0.5) : 0)));
};
var $author$project$Data$Textile$Economics$computeRepairCostIndex = F3(
	function (business, price, repairCost) {
		var repairCostRatio = $author$project$Data$Textile$Economics$priceToFloat(repairCost) / $author$project$Data$Textile$Economics$priceToFloat(price);
		var _v0 = _Utils_Tuple2(0.33, 1);
		var highThreshold = _v0.a;
		var lowThreshold = _v0.b;
		var repairabilityIndice = (_Utils_cmp(repairCostRatio, highThreshold) < 0) ? 1 : ((_Utils_cmp(repairCostRatio, lowThreshold) > 0) ? 0 : (($author$project$Data$Textile$Economics$priceToFloat(price) - ($author$project$Data$Textile$Economics$priceToFloat(repairCost) / lowThreshold)) / (($author$project$Data$Textile$Economics$priceToFloat(repairCost) / highThreshold) - ($author$project$Data$Textile$Economics$priceToFloat(repairCost) / lowThreshold))));
		return $author$project$Data$Unit$ratio(
			function () {
				switch (business) {
					case 0:
						return (repairabilityIndice * 0.67) + 0.33;
					case 1:
						return repairabilityIndice * 0.67;
					default:
						return repairabilityIndice;
				}
			}());
	});
var $author$project$Data$Unit$nonPhysicalDurability = function (value) {
	return value;
};
var $author$project$Data$Unit$nonPhysicalDurabilityToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Data$Textile$Economics$computeNonPhysicalDurabilityIndex = function (economics) {
	var formatIndex = A2(
		$elm$core$Basics$composeR,
		$elm$core$Basics$mul(100),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Basics$round,
			function (x) {
				return x / 100;
			}));
	var finalIndex = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (_v1) {
				var weighting = _v1.a;
				var index = _v1.b;
				return weighting * $author$project$Data$Unit$ratioToFloat(index);
			},
			_List_fromArray(
				[
					_Utils_Tuple2(
					0.5,
					$author$project$Data$Textile$Economics$computeNumberOfReferencesIndex(economics.gB)),
					_Utils_Tuple2(
					0.5,
					A3($author$project$Data$Textile$Economics$computeRepairCostIndex, economics.fC, economics.gM, economics.gX))
				])));
	var _v0 = _Utils_Tuple2(
		$author$project$Data$Unit$nonPhysicalDurabilityToFloat(
			$author$project$Data$Unit$minDurability($elm$core$Basics$identity)),
		$author$project$Data$Unit$nonPhysicalDurabilityToFloat(
			$author$project$Data$Unit$maxDurability($elm$core$Basics$identity)));
	var minDurability = _v0.a;
	var maxDurability = _v0.b;
	return $author$project$Data$Unit$nonPhysicalDurability(
		formatIndex(minDurability + (finalIndex * (maxDurability - minDurability))));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Data$Unit$floatDurabilityFromHolistic = function (_v0) {
	var nonPhysical = _v0.gz;
	var physical = _v0.eT;
	return A2(
		$elm$core$Basics$min,
		$author$project$Data$Unit$physicalDurabilityToFloat(physical),
		$author$project$Data$Unit$nonPhysicalDurabilityToFloat(nonPhysical));
};
var $author$project$Data$Textile$Simulator$computeDurability = function (simulator) {
	var inputs = simulator.u;
	var nonPhysicalDurability = $author$project$Data$Textile$Economics$computeNonPhysicalDurabilityIndex(
		{
			fC: A2($elm$core$Maybe$withDefault, inputs.aC.ir.fC, inputs.fC),
			gB: A2($elm$core$Maybe$withDefault, inputs.aC.ir.gB, inputs.gB),
			gM: A2($elm$core$Maybe$withDefault, inputs.aC.ir.gM, inputs.gM),
			gX: inputs.aC.ir.gX
		});
	var newDurability = {gz: nonPhysicalDurability, eT: simulator.au.eT};
	return _Utils_update(
		simulator,
		{
			ek: A2(
				$ianmackenzie$elm_units$Quantity$multiplyBy,
				$author$project$Data$Unit$floatDurabilityFromHolistic(newDurability),
				simulator.ek),
			au: newDurability,
			kz: $elm$core$Basics$round(
				simulator.kz * $author$project$Data$Unit$floatDurabilityFromHolistic(newDurability))
		});
};
var $author$project$Data$Split$applyToQuantity = F2(
	function (quantity, split) {
		return A2(
			$ianmackenzie$elm_units$Quantity$multiplyBy,
			$author$project$Data$Split$toFloat(split),
			quantity);
	});
var $author$project$Data$Split$fromPercent = function (_float) {
	return ((_float < 0) || (_float > 100)) ? $elm$core$Result$Err(
		'Une part (en pourcentage) doit être comprise entre 0 et 100 inclus (ici\u202F: ' + ($elm$core$String$fromFloat(_float) + ')')) : $elm$core$Result$Ok(_float);
};
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Data$Country$getAquaticPollutionRatio = function (scenario) {
	return A2(
		$elm$core$Result$withDefault,
		$author$project$Data$Split$full,
		function () {
			switch (scenario) {
				case 0:
					return $author$project$Data$Split$fromPercent(19);
				case 1:
					return $author$project$Data$Split$fromPercent(5);
				default:
					return $author$project$Data$Split$fromPercent(37);
			}
		}());
};
var $author$project$Data$Impact$multiplyBy = function (n) {
	return $author$project$Data$Impact$mapImpacts(
		function (_v0) {
			return $ianmackenzie$elm_units$Quantity$multiplyBy(n);
		});
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Data$Textile$Step$computePreTreatment = F3(
	function (country, mass, process) {
		var massInKg = $ianmackenzie$elm_units$Mass$inKilograms(mass);
		var _v0 = _Utils_Tuple2(
			A2($ianmackenzie$elm_units$Quantity$multiplyBy, massInKg, process.eo),
			A2($ianmackenzie$elm_units$Quantity$multiplyBy, massInKg, process.ez));
		var consumedElec = _v0.a;
		var consumedHeat = _v0.b;
		return {
			b9: $author$project$Data$Impact$sumImpacts(
				_List_fromArray(
					[
						A2(
						$author$project$Data$Impact$multiplyBy,
						$ianmackenzie$elm_units$Energy$inKilowattHours(consumedElec),
						country.fX.z),
						A2(
						$author$project$Data$Impact$multiplyBy,
						$ianmackenzie$elm_units$Energy$inMegajoules(consumedHeat),
						country.f6.z)
					])),
			ez: consumedHeat,
			ax: consumedElec,
			bz: $elm$core$List$singleton(process),
			kp: A2(
				$author$project$Data$Impact$multiplyBy,
				A2(
					$author$project$Data$Split$apply,
					massInKg,
					$author$project$Data$Country$getAquaticPollutionRatio(country.ft)),
				process.z)
		};
	});
var $author$project$Data$Textile$Step$emptyPreTreatments = {b9: $author$project$Data$Impact$empty, ez: $ianmackenzie$elm_units$Quantity$zero, ax: $ianmackenzie$elm_units$Quantity$zero, bz: _List_Nil, kp: $author$project$Data$Impact$empty};
var $author$project$Data$Textile$WellKnown$getEnnoblingPreTreatments = F2(
	function (origin, _v0) {
		var bleaching = _v0.fy;
		var degreasing = _v0.fS;
		var washingSyntheticFibers = _v0.hy;
		switch (origin) {
			case 0:
				return _List_fromArray(
					[bleaching]);
			case 1:
				return _List_fromArray(
					[bleaching, degreasing]);
			case 2:
				return _List_fromArray(
					[bleaching, degreasing]);
			default:
				return _List_fromArray(
					[washingSyntheticFibers]);
		}
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, _List_Nil, list, _List_Nil);
};
var $author$project$Data$Textile$Step$computePreTreatments = F3(
	function (wellKnown, materials, _v0) {
		var country = _v0.fL;
		var inputMass = _v0.cg;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v2, acc) {
					var energy = _v2.b9;
					var heat = _v2.ez;
					var kwh = _v2.ax;
					var operations = _v2.bz;
					var toxicity = _v2.kp;
					return _Utils_update(
						acc,
						{
							b9: $author$project$Data$Impact$sumImpacts(
								_List_fromArray(
									[acc.b9, energy])),
							ez: A2($ianmackenzie$elm_units$Quantity$plus, heat, acc.ez),
							ax: A2($ianmackenzie$elm_units$Quantity$plus, kwh, acc.ax),
							bz: $elm_community$list_extra$List$Extra$unique(
								_Utils_ap(acc.bz, operations)),
							kp: $author$project$Data$Impact$sumImpacts(
								_List_fromArray(
									[acc.kp, toxicity]))
						});
				}),
			$author$project$Data$Textile$Step$emptyPreTreatments,
			A2(
				$elm$core$List$concatMap,
				function (_v1) {
					var material = _v1.aa;
					var share = _v1.ac;
					return A2(
						$elm$core$List$map,
						A2(
							$author$project$Data$Textile$Step$computePreTreatment,
							country,
							A2($author$project$Data$Split$applyToQuantity, inputMass, share)),
						A2($author$project$Data$Textile$WellKnown$getEnnoblingPreTreatments, material.gD, wellKnown));
				},
				materials));
	});
var $ianmackenzie$elm_units$Quantity$per = F2(
	function (_v0, _v1) {
		var independentValue = _v0;
		var dependentValue = _v1;
		return dependentValue / independentValue;
	});
var $author$project$Data$Unit$forKWh = function (forOneKWh) {
	return $ianmackenzie$elm_units$Quantity$at(
		A2(
			$ianmackenzie$elm_units$Quantity$per,
			$ianmackenzie$elm_units$Energy$kilowattHours(1),
			forOneKWh));
};
var $author$project$Data$Unit$forKg = function (forOneKg) {
	return $ianmackenzie$elm_units$Quantity$at(
		A2($ianmackenzie$elm_units$Quantity$per, $ianmackenzie$elm_units$Mass$kilogram, forOneKg));
};
var $author$project$Data$Unit$forMJ = function (forOneMJ) {
	return $ianmackenzie$elm_units$Quantity$at(
		A2(
			$ianmackenzie$elm_units$Quantity$per,
			$ianmackenzie$elm_units$Energy$megajoules(1),
			forOneMJ));
};
var $author$project$Data$Process$getImpact = function (trigram) {
	return A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.z;
		},
		$author$project$Data$Impact$getImpact(trigram));
};
var $author$project$Data$Textile$Formula$dyeingImpacts = F5(
	function (impacts, dyeingProcess, heatProcess, elecProcess, baseMass) {
		var kwh = $ianmackenzie$elm_units$Energy$megajoules(
			$ianmackenzie$elm_units$Mass$inKilograms(baseMass) * $ianmackenzie$elm_units$Energy$inMegajoules(dyeingProcess.eo));
		var heatMJ = $ianmackenzie$elm_units$Energy$megajoules(
			$ianmackenzie$elm_units$Mass$inKilograms(baseMass) * $ianmackenzie$elm_units$Energy$inMegajoules(dyeingProcess.ez));
		return {
			ez: heatMJ,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v0) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$author$project$Data$Unit$forKg,
									A2($author$project$Data$Process$getImpact, trigram, dyeingProcess),
									baseMass),
									A2(
									$author$project$Data$Unit$forMJ,
									A2($author$project$Data$Process$getImpact, trigram, heatProcess),
									heatMJ),
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, elecProcess),
									kwh)
								]));
					}),
				impacts),
			ax: kwh
		};
	});
var $author$project$Data$Textile$WellKnown$getEnnoblingHeatProcess = F2(
	function (wk, country) {
		var _v0 = country.hI;
		if (_v0 === 2) {
			return wk.f5;
		} else {
			return wk.f7;
		}
	});
var $author$project$Data$Textile$Material$Origin$Synthetic = 3;
var $author$project$Data$Textile$Material$Origin$isSynthetic = function (origin) {
	return origin === 3;
};
var $author$project$Data$Textile$Formula$materialDyeingToxicityImpacts = F4(
	function (impacts, _v0, baseMass, split) {
		var aquaticPollutionScenario = _v0.ft;
		var dyeingToxicityProcess = _v0.iq;
		return A2(
			$author$project$Data$Impact$mapImpacts,
			F2(
				function (trigram, _v1) {
					return function (impact) {
						return A2($author$project$Data$Split$applyToQuantity, impact, split);
					}(
						A2(
							$ianmackenzie$elm_units$Quantity$multiplyBy,
							$author$project$Data$Split$toFloat(
								$author$project$Data$Country$getAquaticPollutionRatio(aquaticPollutionScenario)),
							A2(
								$author$project$Data$Unit$forKg,
								A2($author$project$Data$Process$getImpact, trigram, dyeingToxicityProcess),
								baseMass)));
				}),
			impacts);
	});
var $author$project$Data$Textile$Dyeing$toProcess = F2(
	function (_v0, processType) {
		var dyeingProcessAverage = _v0.im;
		var dyeingProcessContinuous = _v0.$9;
		var dyeingProcessDiscontinuous = _v0.io;
		_v1$2:
		while (true) {
			if (!processType.$) {
				switch (processType.a) {
					case 1:
						var _v2 = processType.a;
						return dyeingProcessContinuous;
					case 2:
						var _v3 = processType.a;
						return dyeingProcessDiscontinuous;
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return dyeingProcessAverage;
	});
var $author$project$Data$Textile$Simulator$updateLifeCycle = F2(
	function (update, simulator) {
		return _Utils_update(
			simulator,
			{
				K: update(simulator.K)
			});
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$Data$Textile$LifeCycle$updateStep = F2(
	function (label, update_) {
		return $elm$core$Array$map(
			function (step) {
				return _Utils_eq(step._, label) ? update_(step) : step;
			});
	});
var $author$project$Data$Textile$Simulator$updateLifeCycleStep = F2(
	function (label, update) {
		return $author$project$Data$Textile$Simulator$updateLifeCycle(
			A2($author$project$Data$Textile$LifeCycle$updateStep, label, update));
	});
var $author$project$Data$Textile$Simulator$computeDyeingImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			2,
			function (step) {
				var country = step.fL;
				var dyeingProcessType = step.b7;
				var preTreatments = A3($author$project$Data$Textile$Step$computePreTreatments, textile.kD, inputs.jc, step);
				var heatProcess = A2($author$project$Data$Textile$WellKnown$getEnnoblingHeatProcess, textile.kD, country);
				var dyeingToxicity = $author$project$Data$Impact$sumImpacts(
					A2(
						$elm$core$List$map,
						function (_v2) {
							var material = _v2.aa;
							var share = _v2.ac;
							return A4(
								$author$project$Data$Textile$Formula$materialDyeingToxicityImpacts,
								step.z,
								{
									ft: step.fL.ft,
									iq: $author$project$Data$Textile$Material$Origin$isSynthetic(material.gD) ? textile.kD.ip : textile.kD.il
								},
								step.jE,
								share);
						},
						inputs.jc));
				var dyeingProcess = A2($author$project$Data$Textile$Dyeing$toProcess, textile.kD, dyeingProcessType);
				var _v1 = A5($author$project$Data$Textile$Formula$dyeingImpacts, step.z, dyeingProcess, heatProcess, country.fX, step.jE);
				var heat = _v1.ez;
				var impacts = _v1.z;
				var kwh = _v1.ax;
				return _Utils_update(
					step,
					{
						ez: $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[step.ez, heat, preTreatments.ez])),
						z: $author$project$Data$Impact$sumImpacts(
							_List_fromArray(
								[step.z, impacts, dyeingToxicity, preTreatments.b9, preTreatments.kp])),
						ax: $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[step.ax, kwh, preTreatments.ax])),
						jK: preTreatments
					});
			},
			simulator);
	});
var $author$project$Data$Textile$Formula$endOfLifeImpacts = F3(
	function (impacts, _v0, baseMass) {
		var countryElecProcess = _v0.b3;
		var endOfLife = _v0.ix;
		var heatProcess = _v0.f6;
		var passengerCar = _v0.jF;
		var volume = _v0.kB;
		var carTrunkAllocationRatio = $ianmackenzie$elm_units$Volume$inCubicMeters(
			A2($ianmackenzie$elm_units$Quantity$divideBy, 0.2, volume));
		var _v1 = _Utils_Tuple2(
			$ianmackenzie$elm_units$Quantity$sum(
				_List_fromArray(
					[
						A2($ianmackenzie$elm_units$Quantity$multiplyBy, carTrunkAllocationRatio, passengerCar.eo),
						A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$ianmackenzie$elm_units$Mass$inKilograms(baseMass),
						endOfLife.eo)
					])),
			$ianmackenzie$elm_units$Quantity$sum(
				_List_fromArray(
					[
						A2($ianmackenzie$elm_units$Quantity$multiplyBy, carTrunkAllocationRatio, passengerCar.ez),
						A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$ianmackenzie$elm_units$Mass$inKilograms(baseMass),
						endOfLife.ez)
					])));
		var elecEnergy = _v1.a;
		var heatEnergy = _v1.b;
		return {
			ez: heatEnergy,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v2) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$ianmackenzie$elm_units$Quantity$multiplyBy,
									carTrunkAllocationRatio,
									A2($author$project$Data$Process$getImpact, trigram, passengerCar)),
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
									elecEnergy),
									A2(
									$author$project$Data$Unit$forMJ,
									A2($author$project$Data$Process$getImpact, trigram, heatProcess),
									heatEnergy),
									A2(
									$author$project$Data$Unit$forKg,
									A2($author$project$Data$Process$getImpact, trigram, endOfLife),
									baseMass)
								]));
					}),
				impacts),
			ax: elecEnergy
		};
	});
var $author$project$Data$Textile$Simulator$computeEndOfLifeImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			1,
			function (step) {
				var country = step.fL;
				var _v1 = A3(
					$author$project$Data$Textile$Formula$endOfLifeImpacts,
					step.z,
					{b3: country.fX, ix: textile.kD.ix, f6: country.f6, jF: textile.kD.jF, kB: simulator.u.aC.ix.kB},
					step.jE);
				var heat = _v1.ez;
				var impacts = _v1.z;
				var kwh = _v1.ax;
				return _Utils_update(
					step,
					{ez: heat, z: impacts, ax: kwh});
			},
			simulator);
	});
var $author$project$Data$Textile$Fabric$getProcess = F2(
	function (wellKnown, fabric) {
		switch (fabric) {
			case 0:
				return wellKnown.iY;
			case 1:
				return wellKnown.iZ;
			case 2:
				return wellKnown.i$;
			case 3:
				return wellKnown.i_;
			case 4:
				return wellKnown.i0;
			default:
				return wellKnown.kC;
		}
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{E: nodeList, A: nodeListSize, C: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Data$Textile$LifeCycle$getStep = function (label) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Array$filter(
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $._;
				},
				$elm$core$Basics$eq(label))),
		$elm$core$Array$get(0));
};
var $author$project$Data$Textile$LifeCycle$getStepProp = F3(
	function (label, prop, _default) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Textile$LifeCycle$getStep(label),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map(prop),
				$elm$core$Maybe$withDefault(_default)));
	});
var $author$project$Data$Textile$Fabric$isKnitted = function (fabric) {
	if (fabric === 5) {
		return false;
	} else {
		return true;
	}
};
var $author$project$Data$Textile$Formula$knittingImpacts = F3(
	function (impacts, _v0, baseMass) {
		var countryElecProcess = _v0.b3;
		var elec = _v0.eo;
		var electricityKWh = $ianmackenzie$elm_units$Energy$kilowattHours(
			$ianmackenzie$elm_units$Mass$inKilograms(baseMass) * $ianmackenzie$elm_units$Energy$inKilowattHours(elec));
		return {
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v1) {
						return A2(
							$author$project$Data$Unit$forKWh,
							A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
							electricityKWh);
					}),
				impacts),
			ax: electricityKWh,
			gH: $elm$core$Maybe$Nothing,
			hk: $elm$core$Maybe$Nothing
		};
	});
var $author$project$Data$Textile$WellKnown$weavingElecPPPM = 0.0003145;
var $author$project$Data$Unit$PickPerMeter = $elm$core$Basics$identity;
var $ianmackenzie$elm_units$Area$inSquareMeters = function (_v0) {
	var numSquareMeters = _v0;
	return numSquareMeters;
};
var $author$project$Data$Unit$threadDensityToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Textile$Formula$computePicking = F2(
	function (threadDensity, outputSurface) {
		return $elm$core$Basics$round(
			($author$project$Data$Unit$threadDensityToFloat(threadDensity) * $ianmackenzie$elm_units$Area$inSquareMeters(outputSurface)) * 100);
	});
var $author$project$Data$Unit$ThreadDensity = $elm$core$Basics$identity;
var $author$project$Data$Unit$threadDensity = $elm$core$Basics$identity;
var $author$project$Data$Textile$Formula$computeThreadDensity = F2(
	function (surfaceMass, yarnSize) {
		var wasteRatio = 1.08;
		return $author$project$Data$Unit$threadDensity(
			((($author$project$Data$Unit$surfaceMassInGramsPerSquareMeters(surfaceMass) * $author$project$Data$Unit$yarnSizeInKilometers(yarnSize)) / 100) / 2) / wasteRatio);
	});
var $author$project$Data$Unit$pickPerMeterToFloat = function (_v0) {
	var _int = _v0;
	return _int;
};
var $author$project$Data$Unit$surfaceMassToSurface = F2(
	function (surfaceMass, mass) {
		return A2($ianmackenzie$elm_units$Quantity$at_, surfaceMass, mass);
	});
var $author$project$Data$Textile$Formula$weavingImpacts = F2(
	function (impacts, _v0) {
		var countryElecProcess = _v0.b3;
		var outputMass = _v0.jE;
		var pickingElec = _v0.jH;
		var surfaceMass = _v0.e5;
		var yarnSize = _v0.kF;
		var threadDensity = A2($author$project$Data$Textile$Formula$computeThreadDensity, surfaceMass, yarnSize);
		var outputSurface = A2($author$project$Data$Unit$surfaceMassToSurface, surfaceMass, outputMass);
		var picking = A2($author$project$Data$Textile$Formula$computePicking, threadDensity, outputSurface);
		var electricityKWh = $ianmackenzie$elm_units$Energy$kilowattHours(
			pickingElec * $author$project$Data$Unit$pickPerMeterToFloat(picking));
		return {
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v1) {
						return A2(
							$author$project$Data$Unit$forKWh,
							A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
							electricityKWh);
					}),
				impacts),
			ax: electricityKWh,
			gH: $elm$core$Maybe$Just(picking),
			hk: $elm$core$Maybe$Just(threadDensity)
		};
	});
var $author$project$Data$Textile$Simulator$computeFabricImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		var lifeCycle = simulator.K;
		var fabricOutputMass = A4(
			$author$project$Data$Textile$LifeCycle$getStepProp,
			3,
			function ($) {
				return $.jE;
			},
			$ianmackenzie$elm_units$Quantity$zero,
			lifeCycle);
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			3,
			function (step) {
				var country = step.fL;
				var process = A2(
					$author$project$Data$Textile$Fabric$getProcess,
					textile.kD,
					A2($elm$core$Maybe$withDefault, inputs.aC.f_, inputs.bj));
				var _v1 = function () {
					if ($author$project$Data$Textile$Fabric$isKnitted(
						A2($elm$core$Maybe$withDefault, inputs.aC.f_, inputs.bj))) {
						return A3(
							$author$project$Data$Textile$Formula$knittingImpacts,
							step.z,
							{b3: country.fX, eo: process.eo},
							step.jE);
					} else {
						var surfaceMass = A2($elm$core$Maybe$withDefault, inputs.aC.e5, inputs.e5);
						return A2(
							$author$project$Data$Textile$Formula$weavingImpacts,
							step.z,
							{
								b3: country.fX,
								jE: fabricOutputMass,
								jH: $author$project$Data$Textile$WellKnown$weavingElecPPPM,
								e5: surfaceMass,
								kF: A2($elm$core$Maybe$withDefault, inputs.aC.kF, inputs.kF)
							});
					}
				}();
				var impacts = _v1.z;
				var kwh = _v1.ax;
				var picking = _v1.gH;
				var threadDensity = _v1.hk;
				return _Utils_update(
					step,
					{z: impacts, ax: kwh, gH: picking, hk: threadDensity});
			},
			simulator);
	});
var $ianmackenzie$elm_units$Quantity$minus = F2(
	function (_v0, _v1) {
		var y = _v0;
		var x = _v1;
		return x - y;
	});
var $author$project$Data$Textile$Formula$genericWaste = F2(
	function (processWaste, stepOutputMass) {
		var stepInputMass = A2(
			$ianmackenzie$elm_units$Quantity$divideBy,
			1 - $author$project$Data$Split$toFloat(processWaste),
			stepOutputMass);
		return {
			T: stepInputMass,
			hz: A2($ianmackenzie$elm_units$Quantity$minus, stepOutputMass, stepInputMass)
		};
	});
var $author$project$Data$Textile$Step$initMass = F2(
	function (mass, step) {
		return _Utils_update(
			step,
			{cg: mass, jE: mass});
	});
var $author$project$Data$Textile$LifeCycle$updateSteps = F3(
	function (labels, update_, lifeCycle) {
		return A3(
			$elm$core$List$foldl,
			function (label) {
				return A2($author$project$Data$Textile$LifeCycle$updateStep, label, update_);
			},
			lifeCycle,
			labels);
	});
var $author$project$Data$Textile$Simulator$updateLifeCycleSteps = F2(
	function (labels, update) {
		return $author$project$Data$Textile$Simulator$updateLifeCycle(
			A2($author$project$Data$Textile$LifeCycle$updateSteps, labels, update));
	});
var $author$project$Data$Textile$Step$updateWasteAndMasses = F3(
	function (waste, mass, step) {
		return _Utils_update(
			step,
			{
				cg: mass,
				jE: A2($ianmackenzie$elm_units$Quantity$difference, mass, waste),
				hz: waste
			});
	});
var $author$project$Data$Textile$Simulator$computeFabricStepWaste = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		var lifeCycle = simulator.K;
		var _v1 = A2(
			$author$project$Data$Textile$Formula$genericWaste,
			A2(
				$author$project$Data$Textile$Fabric$getProcess,
				textile.kD,
				A2($elm$core$Maybe$withDefault, inputs.aC.f_, inputs.bj)).hz,
			A4(
				$author$project$Data$Textile$LifeCycle$getStepProp,
				4,
				function ($) {
					return $.cg;
				},
				$ianmackenzie$elm_units$Quantity$zero,
				lifeCycle));
		var mass = _v1.T;
		var waste = _v1.hz;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleSteps,
			_List_fromArray(
				[5, 6]),
			$author$project$Data$Textile$Step$initMass(mass),
			A3(
				$author$project$Data$Textile$Simulator$updateLifeCycleStep,
				3,
				A2($author$project$Data$Textile$Step$updateWasteAndMasses, waste, mass),
				simulator));
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $author$project$Data$Textile$LifeCycle$computeFinalImpacts = A2(
	$elm$core$Array$foldl,
	F2(
		function (_v0, finalImpacts) {
			var enabled = _v0.cP;
			var impacts = _v0.z;
			var transport = _v0.c5;
			return enabled ? A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, impact) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2($author$project$Data$Impact$getImpact, trigram, impacts),
									impact,
									A2($author$project$Data$Impact$getImpact, trigram, transport.z)
								]));
					}),
				finalImpacts) : finalImpacts;
		}),
	$author$project$Data$Impact$empty);
var $author$project$Data$Impact$divideBy = function (n) {
	return $author$project$Data$Impact$mapImpacts(
		function (_v0) {
			return $ianmackenzie$elm_units$Quantity$divideBy(n);
		});
};
var $author$project$Data$Impact$divideComplementsImpactsBy = function (n) {
	return $author$project$Data$Impact$mapComplementsImpacts(
		$ianmackenzie$elm_units$Quantity$divideBy(n));
};
var $author$project$Data$Impact$impactsWithComplements = F2(
	function (complementsImpacts, impacts) {
		var complementsImpact = $author$project$Data$Impact$getTotalComplementsImpacts(complementsImpacts);
		var ecsWithComplements = A2(
			$ianmackenzie$elm_units$Quantity$minus,
			complementsImpact,
			A2($author$project$Data$Impact$getImpact, 19, impacts));
		return A3($author$project$Data$Impact$insertWithoutAggregateComputation, 19, ecsWithComplements, impacts);
	});
var $author$project$Data$Textile$LifeCycle$sumComplementsImpacts = A2(
	$elm$core$Basics$composeR,
	$elm$core$Array$toList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			function ($) {
				return $.cP;
			}),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map(
				function ($) {
					return $.h1;
				}),
			A2($elm$core$List$foldl, $author$project$Data$Impact$addComplementsImpacts, $author$project$Data$Impact$noComplementsImpacts))));
var $author$project$Data$Textile$Simulator$computeFinalImpacts = function (simulator) {
	var durability = simulator.au;
	var lifeCycle = simulator.K;
	var complementsImpacts = A2(
		$author$project$Data$Impact$divideComplementsImpactsBy,
		$author$project$Data$Unit$floatDurabilityFromHolistic(durability),
		$author$project$Data$Textile$LifeCycle$sumComplementsImpacts(
			A2(
				$elm$core$Array$filter,
				function ($) {
					return $.cP;
				},
				lifeCycle)));
	return _Utils_update(
		simulator,
		{
			h1: complementsImpacts,
			z: $author$project$Data$Impact$sumImpacts(
				_List_fromArray(
					[
						simulator.z,
						A2(
						$author$project$Data$Impact$impactsWithComplements,
						complementsImpacts,
						A2(
							$author$project$Data$Impact$divideBy,
							$author$project$Data$Unit$floatDurabilityFromHolistic(durability),
							$author$project$Data$Textile$LifeCycle$computeFinalImpacts(lifeCycle)))
					]))
		});
};
var $author$project$Data$Textile$Formula$finishingImpacts = F3(
	function (impacts, _v0, baseMass) {
		var elecProcess = _v0.fW;
		var finishingProcess = _v0.iG;
		var heatProcess = _v0.f6;
		var _v1 = _Utils_Tuple2(
			A2(
				$ianmackenzie$elm_units$Quantity$multiplyBy,
				$ianmackenzie$elm_units$Mass$inKilograms(baseMass),
				finishingProcess.ez),
			A2(
				$ianmackenzie$elm_units$Quantity$multiplyBy,
				$ianmackenzie$elm_units$Mass$inKilograms(baseMass),
				finishingProcess.eo));
		var heatMJ = _v1.a;
		var kwh = _v1.b;
		return {
			ez: heatMJ,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v2) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$author$project$Data$Unit$forKg,
									A2($author$project$Data$Process$getImpact, trigram, finishingProcess),
									baseMass),
									A2(
									$author$project$Data$Unit$forMJ,
									A2($author$project$Data$Process$getImpact, trigram, heatProcess),
									heatMJ),
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, elecProcess),
									kwh)
								]));
					}),
				impacts),
			ax: kwh
		};
	});
var $author$project$Data$Textile$Simulator$computeFinishingImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			2,
			function (step) {
				var country = step.fL;
				var _v1 = A3(
					$author$project$Data$Textile$Formula$finishingImpacts,
					step.z,
					{
						fW: country.fX,
						iG: textile.kD.iF,
						f6: A2($author$project$Data$Textile$WellKnown$getEnnoblingHeatProcess, textile.kD, country)
					},
					step.jE);
				var heat = _v1.ez;
				var impacts = _v1.z;
				var kwh = _v1.ax;
				return _Utils_update(
					step,
					{
						ez: A2($ianmackenzie$elm_units$Quantity$plus, heat, step.ez),
						z: $author$project$Data$Impact$sumImpacts(
							_List_fromArray(
								[step.z, impacts])),
						ax: A2($ianmackenzie$elm_units$Quantity$plus, kwh, step.ax)
					});
			},
			simulator);
	});
var $author$project$Data$Zone$Europe = 2;
var $author$project$Data$Country$isEuropeOrTurkey = function (country) {
	return (country.hI === 2) || _Utils_eq(
		country.cK,
		$author$project$Data$Country$codeFromString('TR'));
};
var $author$project$Data$Split$third = 33;
var $author$project$Data$Textile$Simulator$computeMakingAirTransportRatio = function (simulator) {
	var durability = simulator.au;
	var inputs = simulator.u;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleStep,
		4,
		function (step) {
			var country = step.fL;
			return _Utils_update(
				step,
				{
					bY: function () {
						var _v0 = inputs.bY;
						if (!_v0.$) {
							var airTransportRatio = _v0.a;
							return airTransportRatio;
						} else {
							return $author$project$Data$Country$isEuropeOrTurkey(country) ? $author$project$Data$Split$zero : (($author$project$Data$Unit$floatDurabilityFromHolistic(durability) >= 1) ? $author$project$Data$Split$third : $author$project$Data$Split$full);
						}
					}()
				});
		},
		simulator);
};
var $author$project$Data$Textile$Fabric$getMakingComplexity = F3(
	function (defaultComplexity, maybeCustomComplexity, maybeFabric) {
		var _v0 = _Utils_Tuple2(maybeFabric, maybeCustomComplexity);
		_v0$3:
		while (true) {
			if (!_v0.b.$) {
				var customComplexity = _v0.b.a;
				return customComplexity;
			} else {
				if (!_v0.a.$) {
					switch (_v0.a.a) {
						case 1:
							var _v1 = _v0.a.a;
							var _v2 = _v0.b;
							return 5;
						case 2:
							var _v3 = _v0.a.a;
							var _v4 = _v0.b;
							return 3;
						default:
							break _v0$3;
					}
				} else {
					break _v0$3;
				}
			}
		}
		return defaultComplexity;
	});
var $ianmackenzie$elm_units$Duration$inSeconds = function (_v0) {
	var numSeconds = _v0;
	return numSeconds;
};
var $ianmackenzie$elm_units$Duration$inMinutes = function (duration) {
	return $ianmackenzie$elm_units$Duration$inSeconds(duration) / 60;
};
var $ianmackenzie$elm_units$Duration$seconds = function (numSeconds) {
	return numSeconds;
};
var $ianmackenzie$elm_units$Duration$minutes = function (numMinutes) {
	return $ianmackenzie$elm_units$Duration$seconds(60 * numMinutes);
};
var $author$project$Data$Textile$MakingComplexity$toDuration = function (makingComplexity) {
	switch (makingComplexity) {
		case 0:
			return $ianmackenzie$elm_units$Duration$minutes(60);
		case 1:
			return $ianmackenzie$elm_units$Duration$minutes(15);
		case 2:
			return $ianmackenzie$elm_units$Duration$minutes(30);
		case 3:
			return $ianmackenzie$elm_units$Duration$minutes(0);
		case 4:
			return $ianmackenzie$elm_units$Duration$minutes(120);
		default:
			return $ianmackenzie$elm_units$Duration$minutes(5);
	}
};
var $author$project$Data$Textile$Formula$makingImpacts = F3(
	function (impacts, _v0, outputMass) {
		var countryElecProcess = _v0.b3;
		var countryHeatProcess = _v0.h5;
		var fadingProcess = _v0.iE;
		var makingComplexity = _v0.i9;
		var kWhPerMinute = $ianmackenzie$elm_units$Energy$kilowattHours(0.029);
		var elec = A2(
			$ianmackenzie$elm_units$Quantity$multiplyBy,
			$ianmackenzie$elm_units$Duration$inMinutes(
				$author$project$Data$Textile$MakingComplexity$toDuration(makingComplexity)),
			kWhPerMinute);
		var _v1 = _Utils_Tuple2(
			A2(
				$ianmackenzie$elm_units$Quantity$multiplyBy,
				$ianmackenzie$elm_units$Mass$inKilograms(outputMass),
				A2(
					$elm$core$Maybe$withDefault,
					$ianmackenzie$elm_units$Quantity$zero,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.eo;
						},
						fadingProcess))),
			A2(
				$ianmackenzie$elm_units$Quantity$multiplyBy,
				$ianmackenzie$elm_units$Mass$inKilograms(outputMass),
				A2(
					$elm$core$Maybe$withDefault,
					$ianmackenzie$elm_units$Quantity$zero,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.ez;
						},
						fadingProcess))));
		var fadingElec = _v1.a;
		var fadingHeat = _v1.b;
		return {
			ez: fadingHeat,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v2) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
									elec),
									A2(
									$author$project$Data$Unit$forKg,
									A2(
										$elm$core$Maybe$withDefault,
										$ianmackenzie$elm_units$Quantity$zero,
										A2(
											$elm$core$Maybe$map,
											$author$project$Data$Process$getImpact(trigram),
											fadingProcess)),
									outputMass),
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
									fadingElec),
									A2(
									$author$project$Data$Unit$forMJ,
									A2($author$project$Data$Process$getImpact, trigram, countryHeatProcess),
									fadingHeat)
								]));
					}),
				impacts),
			ax: $ianmackenzie$elm_units$Quantity$sum(
				_List_fromArray(
					[elec, fadingElec]))
		};
	});
var $author$project$Data$Textile$Simulator$computeMakingImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			4,
			function (step) {
				var country = step.fL;
				var _v1 = A3(
					$author$project$Data$Textile$Formula$makingImpacts,
					step.z,
					{
						b3: country.fX,
						h5: country.f6,
						iE: _Utils_eq(
							inputs.cb,
							$elm$core$Maybe$Just(true)) ? $elm$core$Maybe$Just(textile.kD.cb) : $elm$core$Maybe$Nothing,
						i9: A3($author$project$Data$Textile$Fabric$getMakingComplexity, inputs.aC.eI.ef, inputs.i9, inputs.bj)
					},
					step.jE);
				var heat = _v1.ez;
				var impacts = _v1.z;
				var kwh = _v1.ax;
				return _Utils_update(
					step,
					{ez: heat, z: impacts, ax: kwh});
			},
			simulator);
	});
var $author$project$Data$Split$fifteen = 15;
var $author$project$Data$Env$defaultDeadStock = $author$project$Data$Split$fifteen;
var $author$project$Data$Textile$Formula$makingDeadStock = F2(
	function (deadstock, baseMass) {
		var mass = A2(
			$ianmackenzie$elm_units$Quantity$divideBy,
			$author$project$Data$Split$toFloat(
				$author$project$Data$Split$complement(deadstock)),
			baseMass);
		return {
			h8: A2($ianmackenzie$elm_units$Quantity$minus, baseMass, mass),
			T: mass
		};
	});
var $author$project$Data$Textile$Step$Label$upcyclables = _List_fromArray(
	[5, 6, 3, 2]);
var $author$project$Data$Textile$Step$updateDeadStock = F3(
	function (deadstock, mass, step) {
		return _Utils_update(
			step,
			{
				h8: deadstock,
				cg: mass,
				jE: A2($ianmackenzie$elm_units$Quantity$difference, mass, deadstock)
			});
	});
var $author$project$Data$Textile$Simulator$computeMakingStepDeadStock = function (simulator) {
	var inputs = simulator.u;
	var lifeCycle = simulator.K;
	var _v0 = A2(
		$author$project$Data$Textile$Formula$makingDeadStock,
		A2($elm$core$Maybe$withDefault, $author$project$Data$Env$defaultDeadStock, inputs.cl),
		A4(
			$author$project$Data$Textile$LifeCycle$getStepProp,
			4,
			function ($) {
				return $.cg;
			},
			$ianmackenzie$elm_units$Quantity$zero,
			lifeCycle));
	var deadstock = _v0.h8;
	var mass = _v0.T;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleSteps,
		$author$project$Data$Textile$Step$Label$upcyclables,
		$author$project$Data$Textile$Step$initMass(mass),
		A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			4,
			A2($author$project$Data$Textile$Step$updateDeadStock, deadstock, mass),
			simulator));
};
var $author$project$Data$Split$two = 2;
var $author$project$Data$Textile$Fabric$getMakingWaste = F3(
	function (defaultWaste, maybeCustomWaste, maybeFabric) {
		var _v0 = _Utils_Tuple2(maybeFabric, maybeCustomWaste);
		_v0$3:
		while (true) {
			if (!_v0.b.$) {
				var customWaste = _v0.b.a;
				return customWaste;
			} else {
				if (!_v0.a.$) {
					switch (_v0.a.a) {
						case 1:
							var _v1 = _v0.a.a;
							var _v2 = _v0.b;
							return $author$project$Data$Split$two;
						case 2:
							var _v3 = _v0.a.a;
							var _v4 = _v0.b;
							return $author$project$Data$Split$zero;
						default:
							break _v0$3;
					}
				} else {
					break _v0$3;
				}
			}
		}
		return defaultWaste;
	});
var $author$project$Data$Textile$Simulator$computeMakingStepWaste = function (simulator) {
	var inputs = simulator.u;
	var _v0 = inputs;
	var fabricProcess = _v0.bj;
	var makingWaste = _v0.cm;
	var product = _v0.aC;
	var _v1 = A2(
		$author$project$Data$Textile$Formula$genericWaste,
		A3($author$project$Data$Textile$Fabric$getMakingWaste, product.eI.gG, makingWaste, fabricProcess),
		inputs.T);
	var mass = _v1.T;
	var waste = _v1.hz;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleSteps,
		$author$project$Data$Textile$Step$Label$upcyclables,
		$author$project$Data$Textile$Step$initMass(mass),
		A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			4,
			A2($author$project$Data$Textile$Step$updateWasteAndMasses, waste, mass),
			simulator));
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Data$Textile$Material$getRecyclingData = F2(
	function (material, materials) {
		return A3(
			$elm$core$Maybe$map2,
			$elm$core$Tuple$pair,
			A2(
				$elm$core$Maybe$andThen,
				function (id) {
					return $elm$core$Result$toMaybe(
						A2($author$project$Data$Textile$Material$findById, id, materials));
				},
				material.eW),
			material.hZ);
	});
var $author$project$Data$Textile$Formula$pureMaterialImpacts = F3(
	function (impacts, process, mass) {
		return A2(
			$author$project$Data$Impact$mapImpacts,
			F2(
				function (trigram, _v0) {
					return A2(
						$author$project$Data$Unit$forKg,
						A2($author$project$Data$Process$getImpact, trigram, process),
						mass);
				}),
			impacts);
	});
var $author$project$Data$Textile$Formula$recycledMaterialImpacts = F3(
	function (impacts, _v0, outputMass) {
		var cffData = _v0.hZ;
		var nonRecycledProcess = _v0.ju;
		var recycledProcess = _v0.jV;
		var _v1 = cffData;
		var manufacturerAllocation = _v1.ja;
		var recycledQualityRatio = _v1.jW;
		return A2(
			$author$project$Data$Impact$mapImpacts,
			F2(
				function (trigram, _v2) {
					var _v3 = _Utils_Tuple2(
						$author$project$Data$Unit$impactToFloat(
							A2($author$project$Data$Process$getImpact, trigram, recycledProcess)),
						$author$project$Data$Unit$impactToFloat(
							A2($author$project$Data$Process$getImpact, trigram, nonRecycledProcess)));
					var recycledImpactPerKg = _v3.a;
					var nonRecycledImpactPerKg = _v3.b;
					return $author$project$Data$Unit$impact(
						$ianmackenzie$elm_units$Mass$inKilograms(outputMass) * (A2($author$project$Data$Split$apply, recycledImpactPerKg, manufacturerAllocation) + (A2(
							$author$project$Data$Split$apply,
							$author$project$Data$Split$toFloat(recycledQualityRatio),
							$author$project$Data$Split$complement(manufacturerAllocation)) * nonRecycledImpactPerKg)));
				}),
			impacts);
	});
var $author$project$Data$Textile$Simulator$stepMaterialImpacts = F3(
	function (_v0, material, step) {
		var textile = _v0.kk;
		var _v1 = A2($author$project$Data$Textile$Material$getRecyclingData, material, textile.jc);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var sourceMaterial = _v2.a;
			var cffData = _v2.b;
			return A3(
				$author$project$Data$Textile$Formula$recycledMaterialImpacts,
				step.z,
				{hZ: cffData, ju: sourceMaterial.gq, jV: material.gq},
				step.jE);
		} else {
			return A3($author$project$Data$Textile$Formula$pureMaterialImpacts, step.z, material.gq, step.jE);
		}
	});
var $author$project$Data$Textile$Simulator$computeMaterialImpacts = F2(
	function (db, simulator) {
		var inputs = simulator.u;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			5,
			function (step) {
				return _Utils_update(
					step,
					{
						z: $author$project$Data$Impact$sumImpacts(
							A2(
								$elm$core$List$map,
								function (_v0) {
									var material = _v0.aa;
									var share = _v0.ac;
									return A2(
										$author$project$Data$Impact$mapImpacts,
										function (_v1) {
											return $ianmackenzie$elm_units$Quantity$multiplyBy(
												$author$project$Data$Split$toFloat(share));
										},
										A3($author$project$Data$Textile$Simulator$stepMaterialImpacts, db, material, step));
								},
								inputs.jc))
					});
			},
			simulator);
	});
var $author$project$Data$Textile$Simulator$computeMaterialStepWaste = function (simulator) {
	var inputs = simulator.u;
	var lifeCycle = simulator.K;
	var _v0 = function (inputMass) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (curr, acc) {
					return {
						T: A2($ianmackenzie$elm_units$Quantity$plus, acc.T, curr.T),
						hz: A2($ianmackenzie$elm_units$Quantity$plus, acc.hz, curr.hz)
					};
				}),
			{T: $ianmackenzie$elm_units$Quantity$zero, hz: $ianmackenzie$elm_units$Quantity$zero},
			A2(
				$elm$core$List$map,
				function (_v1) {
					var material = _v1.aa;
					var share = _v1.ac;
					return A2(
						$author$project$Data$Textile$Formula$genericWaste,
						material.gq.hz,
						A2(
							$ianmackenzie$elm_units$Quantity$multiplyBy,
							$author$project$Data$Split$toFloat(share),
							inputMass));
				},
				inputs.jc));
	}(
		A4(
			$author$project$Data$Textile$LifeCycle$getStepProp,
			6,
			function ($) {
				return $.cg;
			},
			$ianmackenzie$elm_units$Quantity$zero,
			lifeCycle));
	var mass = _v0.T;
	var waste = _v0.hz;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleStep,
		5,
		A2($author$project$Data$Textile$Step$updateWasteAndMasses, waste, mass),
		simulator);
};
var $author$project$Data$Textile$WellKnown$getPrintingProcess = F2(
	function (medium, _v0) {
		var printingDyes = _v0.gN;
		var printingPaste = _v0.gO;
		var printingPigment = _v0.gP;
		var printingSubstantive = _v0.gQ;
		if (!medium) {
			return {jL: printingPigment, jM: printingPaste};
		} else {
			return {jL: printingSubstantive, jM: printingDyes};
		}
	});
var $author$project$Data$Unit$forSquareMeter = function (forOneSquareMeter) {
	return $ianmackenzie$elm_units$Quantity$at(
		A2($ianmackenzie$elm_units$Quantity$per, $ianmackenzie$elm_units$Area$squareMeter, forOneSquareMeter));
};
var $author$project$Data$Textile$Formula$materialPrintingToxicityImpacts = F4(
	function (impacts, _v0, split, baseMass) {
		var aquaticPollutionScenario = _v0.ft;
		var printingToxicityProcess = _v0.jM;
		var surfaceMass = _v0.e5;
		return A2(
			$author$project$Data$Impact$mapImpacts,
			F2(
				function (trigram, _v1) {
					return function (impact) {
						return A2($author$project$Data$Split$applyToQuantity, impact, split);
					}(
						A2(
							$ianmackenzie$elm_units$Quantity$multiplyBy,
							$author$project$Data$Split$toFloat(
								$author$project$Data$Country$getAquaticPollutionRatio(aquaticPollutionScenario)),
							A2(
								$author$project$Data$Unit$forSquareMeter,
								A2($author$project$Data$Process$getImpact, trigram, printingToxicityProcess),
								A2($author$project$Data$Unit$surfaceMassToSurface, surfaceMass, baseMass))));
				}),
			impacts);
	});
var $author$project$Data$Textile$Formula$printingImpacts = F3(
	function (impacts, _v0, baseMass) {
		var elecProcess = _v0.fW;
		var heatProcess = _v0.f6;
		var printingProcess = _v0.jL;
		var ratio = _v0.jR;
		var surfaceMass = _v0.e5;
		var surface = function (s) {
			return A2($author$project$Data$Split$applyToQuantity, s, ratio);
		}(
			A2($author$project$Data$Unit$surfaceMassToSurface, surfaceMass, baseMass));
		var surfaceInSquareMeters = $ianmackenzie$elm_units$Area$inSquareMeters(surface);
		var _v1 = _Utils_Tuple2(
			A2($ianmackenzie$elm_units$Quantity$multiplyBy, surfaceInSquareMeters, printingProcess.ez),
			A2($ianmackenzie$elm_units$Quantity$multiplyBy, surfaceInSquareMeters, printingProcess.eo));
		var heatMJ = _v1.a;
		var kwh = _v1.b;
		return {
			ez: heatMJ,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v2) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$author$project$Data$Unit$forSquareMeter,
									A2($author$project$Data$Process$getImpact, trigram, printingProcess),
									surface),
									A2(
									$author$project$Data$Unit$forMJ,
									A2($author$project$Data$Process$getImpact, trigram, heatProcess),
									heatMJ),
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, elecProcess),
									kwh)
								]));
					}),
				impacts),
			ax: kwh
		};
	});
var $author$project$Data$Textile$Simulator$computePrintingImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			2,
			function (step) {
				var country = step.fL;
				var _v1 = step.cp;
				if (!_v1.$) {
					var kind = _v1.a.eF;
					var ratio = _v1.a.jR;
					var _v2 = A2($author$project$Data$Textile$WellKnown$getPrintingProcess, kind, textile.kD);
					var printingProcess = _v2.jL;
					var printingToxicityProcess = _v2.jM;
					var printingToxicity = A4(
						$author$project$Data$Textile$Formula$materialPrintingToxicityImpacts,
						step.z,
						{
							ft: step.fL.ft,
							jM: printingToxicityProcess,
							e5: A2($elm$core$Maybe$withDefault, inputs.aC.e5, inputs.e5)
						},
						ratio,
						step.jE);
					var _v3 = A3(
						$author$project$Data$Textile$Formula$printingImpacts,
						step.z,
						{
							fW: country.fX,
							f6: A2($author$project$Data$Textile$WellKnown$getEnnoblingHeatProcess, textile.kD, country),
							jL: printingProcess,
							jR: ratio,
							e5: A2($elm$core$Maybe$withDefault, inputs.aC.e5, inputs.e5)
						},
						step.jE);
					var heat = _v3.ez;
					var impacts = _v3.z;
					var kwh = _v3.ax;
					return _Utils_update(
						step,
						{
							ez: A2($ianmackenzie$elm_units$Quantity$plus, heat, step.ez),
							z: $author$project$Data$Impact$sumImpacts(
								_List_fromArray(
									[step.z, impacts, printingToxicity])),
							ax: A2($ianmackenzie$elm_units$Quantity$plus, kwh, step.ax)
						});
				} else {
					return step;
				}
			},
			simulator);
	});
var $author$project$Data$Textile$Material$Spinning$getDefault = function (origin) {
	if (origin === 3) {
		return 1;
	} else {
		return 0;
	}
};
var $author$project$Data$Textile$Material$Spinning$processesData = {
	eg: {
		gA: 4,
		hz: A2(
			$elm$core$Result$withDefault,
			$author$project$Data$Split$zero,
			$author$project$Data$Split$fromPercent(12))
	},
	e6: {
		gA: 1.5,
		hz: A2(
			$elm$core$Result$withDefault,
			$author$project$Data$Split$zero,
			$author$project$Data$Split$fromPercent(3))
	},
	fl: {
		gA: 2,
		hz: A2(
			$elm$core$Result$withDefault,
			$author$project$Data$Split$zero,
			$author$project$Data$Split$fromPercent(12))
	}
};
var $author$project$Data$Textile$Material$Spinning$normalization = function (spinning) {
	switch (spinning) {
		case 0:
			return $author$project$Data$Textile$Material$Spinning$processesData.eg.gA;
		case 1:
			return $author$project$Data$Textile$Material$Spinning$processesData.e6.gA;
		default:
			return $author$project$Data$Textile$Material$Spinning$processesData.fl.gA;
	}
};
var $author$project$Data$Textile$Material$Spinning$getElec = F3(
	function (mass, yarnSize, spinning) {
		return (($author$project$Data$Unit$yarnSizeInKilometers(yarnSize) / 50) * $author$project$Data$Textile$Material$Spinning$normalization(spinning)) * $ianmackenzie$elm_units$Mass$inKilograms(mass);
	});
var $author$project$Data$Textile$Formula$spinningImpacts = F2(
	function (impacts, _v0) {
		var countryElecProcess = _v0.b3;
		var spinningKwh = _v0.kb;
		return {
			ez: $ianmackenzie$elm_units$Quantity$zero,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v1) {
						return A2(
							$author$project$Data$Unit$forKWh,
							A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
							spinningKwh);
					}),
				impacts),
			ax: spinningKwh
		};
	});
var $author$project$Data$Textile$Simulator$stepSpinningImpacts = F4(
	function (material, maybeSpinning, product, step) {
		var yarnSize = A2($elm$core$Maybe$withDefault, product.kF, step.kF);
		var spinning = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Data$Textile$Material$Spinning$getDefault(material.gD),
			maybeSpinning);
		var kwh = $ianmackenzie$elm_units$Energy$kilowattHours(
			A3($author$project$Data$Textile$Material$Spinning$getElec, step.jE, yarnSize, spinning));
		return A2(
			$author$project$Data$Textile$Formula$spinningImpacts,
			step.z,
			{b3: step.fL.fX, kb: kwh});
	});
var $author$project$Data$Textile$Simulator$computeSpinningImpacts = function (simulator) {
	var inputs = simulator.u;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleStep,
		6,
		function (step) {
			return _Utils_update(
				step,
				{
					z: $author$project$Data$Impact$sumImpacts(
						A2(
							$elm$core$List$map,
							function (_v0) {
								var material = _v0.aa;
								var share = _v0.ac;
								var spinning = _v0.cu;
								return A2(
									$author$project$Data$Impact$mapImpacts,
									function (_v1) {
										return $ianmackenzie$elm_units$Quantity$multiplyBy(
											$author$project$Data$Split$toFloat(share));
									},
									A4($author$project$Data$Textile$Simulator$stepSpinningImpacts, material, spinning, inputs.aC, step).z);
							},
							inputs.jc)),
					ax: A3(
						$elm$core$List$foldl,
						$ianmackenzie$elm_units$Quantity$plus,
						$ianmackenzie$elm_units$Quantity$zero,
						A2(
							$elm$core$List$map,
							function (_v2) {
								var material = _v2.aa;
								var share = _v2.ac;
								var spinning = _v2.cu;
								return A2(
									$ianmackenzie$elm_units$Quantity$multiplyBy,
									$author$project$Data$Split$toFloat(share),
									A4($author$project$Data$Textile$Simulator$stepSpinningImpacts, material, spinning, inputs.aC, step).ax);
							},
							inputs.jc))
				});
		},
		simulator);
};
var $author$project$Data$Split$divideBy = F2(
	function (input, split) {
		return input / $author$project$Data$Split$toFloat(split);
	});
var $author$project$Data$Textile$Material$Spinning$waste = function (spinning) {
	switch (spinning) {
		case 0:
			return $author$project$Data$Textile$Material$Spinning$processesData.eg.hz;
		case 1:
			return $author$project$Data$Textile$Material$Spinning$processesData.e6.hz;
		default:
			return $author$project$Data$Textile$Material$Spinning$processesData.fl.hz;
	}
};
var $author$project$Data$Textile$Simulator$computeSpinningStepWaste = function (simulator) {
	var inputs = simulator.u;
	var lifeCycle = simulator.K;
	var _v0 = function (inputMass) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (curr, acc) {
					return {
						T: A2($ianmackenzie$elm_units$Quantity$plus, acc.T, curr.T),
						hz: A2($ianmackenzie$elm_units$Quantity$plus, acc.hz, curr.hz)
					};
				}),
			{T: $ianmackenzie$elm_units$Quantity$zero, hz: $ianmackenzie$elm_units$Quantity$zero},
			A2(
				$elm$core$List$map,
				function (_v1) {
					var material = _v1.aa;
					var share = _v1.ac;
					var spinning = _v1.cu;
					var spinningProcess = A2(
						$elm$core$Maybe$withDefault,
						$author$project$Data$Textile$Material$Spinning$getDefault(material.gD),
						spinning);
					var processWaste = $author$project$Data$Textile$Material$Spinning$waste(spinningProcess);
					var outputMaterialMass = A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$author$project$Data$Split$toFloat(share),
						inputMass);
					var inputMaterialMass = $ianmackenzie$elm_units$Mass$kilograms(
						A2(
							$author$project$Data$Split$divideBy,
							$ianmackenzie$elm_units$Mass$inKilograms(outputMaterialMass),
							$author$project$Data$Split$complement(processWaste)));
					return {
						T: inputMaterialMass,
						hz: A2($ianmackenzie$elm_units$Quantity$difference, inputMaterialMass, outputMaterialMass)
					};
				},
				inputs.jc));
	}(
		A4(
			$author$project$Data$Textile$LifeCycle$getStepProp,
			3,
			function ($) {
				return $.cg;
			},
			$ianmackenzie$elm_units$Quantity$zero,
			lifeCycle));
	var mass = _v0.T;
	var waste = _v0.hz;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleStep,
		6,
		A2($author$project$Data$Textile$Step$updateWasteAndMasses, waste, mass),
		simulator);
};
var $author$project$Data$Textile$Inputs$computeMaterialTransport = F3(
	function (distances, nextCountryCode, _v0) {
		var country = _v0.fL;
		var material = _v0.aa;
		var share = _v0.ac;
		if (!_Utils_eq(share, $author$project$Data$Split$zero)) {
			var emptyImpacts = $author$project$Data$Impact$empty;
			var countryCode = A2(
				$elm$core$Maybe$withDefault,
				material.fO,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.cK;
					},
					country));
			return A4($author$project$Data$Transport$getTransportBetween, emptyImpacts, countryCode, nextCountryCode, distances);
		} else {
			return $author$project$Data$Transport$default($author$project$Data$Impact$empty);
		}
	});
var $author$project$Data$Unit$forKgAndDistance = F3(
	function (cc, distance, mass) {
		return A2(
			$ianmackenzie$elm_units$Quantity$multiplyBy,
			$ianmackenzie$elm_units$Length$inKilometers(distance),
			A2(
				$author$project$Data$Unit$forKg,
				cc,
				A2($ianmackenzie$elm_units$Quantity$divideBy, 1000, mass)));
	});
var $author$project$Data$Textile$Step$computeTransportImpacts = F5(
	function (impacts, _v0, roadProcess, mass, _v1) {
		var airTransport = _v0.bX;
		var seaTransport = _v0.cr;
		var air = _v1.hK;
		var road = _v1.dP;
		var sea = _v1.g4;
		return {
			hK: air,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v2) {
						var _v3 = _Utils_Tuple3(
							A3(
								$author$project$Data$Unit$forKgAndDistance,
								A2($author$project$Data$Process$getImpact, trigram, roadProcess),
								road,
								mass),
							A3(
								$author$project$Data$Unit$forKgAndDistance,
								A2($author$project$Data$Process$getImpact, trigram, seaTransport),
								sea,
								mass),
							A3(
								$author$project$Data$Unit$forKgAndDistance,
								A2($author$project$Data$Process$getImpact, trigram, airTransport),
								air,
								mass));
						var roadImpact = _v3.a;
						var seaImpact = _v3.b;
						var airImpact = _v3.c;
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[roadImpact, seaImpact, airImpact]));
					}),
				impacts),
			dP: road,
			j2: $ianmackenzie$elm_units$Quantity$zero,
			g4: sea,
			j7: $ianmackenzie$elm_units$Quantity$zero
		};
	});
var $author$project$Data$Textile$Step$computeMaterialTransportAndImpact = F4(
	function (_v0, country, outputMass, materialInput) {
		var distances = _v0.ih;
		var textile = _v0.kk;
		var materialMass = A2($author$project$Data$Split$applyToQuantity, outputMass, materialInput.ac);
		return A5(
			$author$project$Data$Textile$Step$computeTransportImpacts,
			$author$project$Data$Impact$empty,
			textile.kD,
			textile.kD.bI,
			materialMass,
			A2(
				$author$project$Data$Textile$Formula$transportRatio,
				$author$project$Data$Split$zero,
				A3($author$project$Data$Textile$Inputs$computeMaterialTransport, distances, country.cK, materialInput)));
	});
var $author$project$Data$Transport$add = F2(
	function (a, b) {
		return _Utils_update(
			b,
			{
				hK: A2($ianmackenzie$elm_units$Quantity$plus, a.hK, b.hK),
				dP: A2($ianmackenzie$elm_units$Quantity$plus, a.dP, b.dP),
				g4: A2($ianmackenzie$elm_units$Quantity$plus, a.g4, b.g4)
			});
	});
var $author$project$Data$Textile$Step$computeTransportSummary = F2(
	function (step, transport) {
		var noTransports = $author$project$Data$Transport$default(step.c5.z);
		var _v0 = step._;
		switch (_v0) {
			case 0:
				return A2(
					$author$project$Data$Transport$add,
					_Utils_update(
						noTransports,
						{
							dP: $ianmackenzie$elm_units$Length$kilometers(500)
						}),
					noTransports);
			case 1:
				return noTransports;
			case 4:
				return A2($author$project$Data$Textile$Formula$transportRatio, step.bY, transport);
			case 7:
				return noTransports;
			default:
				return A2($author$project$Data$Textile$Formula$transportRatio, $author$project$Data$Split$zero, transport);
		}
	});
var $author$project$Data$Textile$Step$getTransportedMass = F2(
	function (inputs, _v0) {
		var label = _v0._;
		var outputMass = _v0.jE;
		return (label === 4) ? inputs.T : outputMass;
	});
var $author$project$Data$Textile$Step$computeTransports = F4(
	function (db, inputs, next, current) {
		var processInfo = current.ab;
		var transport = (current._ === 5) ? $author$project$Data$Transport$sum(
			A2(
				$elm$core$List$map,
				A3($author$project$Data$Textile$Step$computeMaterialTransportAndImpact, db, next.fL, current.jE),
				inputs.jc)) : A5(
			$author$project$Data$Textile$Step$computeTransportImpacts,
			current.c5.z,
			db.kk.kD,
			db.kk.kD.bI,
			A2($author$project$Data$Textile$Step$getTransportedMass, inputs, current),
			A2(
				$author$project$Data$Textile$Step$computeTransportSummary,
				current,
				A4($author$project$Data$Transport$getTransportBetween, current.c5.z, current.fL.cK, next.fL.cK, db.ih)));
		return _Utils_update(
			current,
			{
				ab: _Utils_update(
					processInfo,
					{
						bX: $elm$core$Maybe$Just(
							$author$project$Data$Process$getDisplayName(db.kk.kD.bX)),
						bI: $elm$core$Maybe$Just(
							$author$project$Data$Process$getDisplayName(db.kk.kD.bI)),
						cr: $elm$core$Maybe$Just(
							$author$project$Data$Process$getDisplayName(db.kk.kD.cr))
					}),
				c5: transport
			});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, n, xs),
			A2($elm$core$List$drop, n, xs));
	});
var $elm_community$list_extra$List$Extra$splitWhen = F2(
	function (predicate, list) {
		return A2(
			$elm$core$Maybe$map,
			function (i) {
				return A2($elm_community$list_extra$List$Extra$splitAt, i, list);
			},
			A2($elm_community$list_extra$List$Extra$findIndex, predicate, list));
	});
var $author$project$Data$Textile$LifeCycle$getNextEnabledStep = function (label) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Array$toList,
		A2(
			$elm$core$Basics$composeR,
			$elm_community$list_extra$List$Extra$splitWhen(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $._;
					},
					$elm$core$Basics$eq(label))),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map($elm$core$Tuple$second),
				$elm$core$Maybe$andThen(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$filter(
							function ($) {
								return $.cP;
							}),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$drop(1),
							$elm$core$List$head))))));
};
var $author$project$Data$Textile$LifeCycle$computeStepsTransport = F3(
	function (db, inputs, lifeCycle) {
		return A2(
			$elm$core$Array$map,
			function (step) {
				return step.cP ? A4(
					$author$project$Data$Textile$Step$computeTransports,
					db,
					inputs,
					A2(
						$elm$core$Maybe$withDefault,
						step,
						A2($author$project$Data$Textile$LifeCycle$getNextEnabledStep, step._, lifeCycle)),
					step) : step;
			},
			lifeCycle);
	});
var $author$project$Data$Textile$Simulator$computeStepsTransport = F2(
	function (db, simulator) {
		return A2(
			$author$project$Data$Textile$Simulator$updateLifeCycle,
			A2($author$project$Data$Textile$LifeCycle$computeStepsTransport, db, simulator.u),
			simulator);
	});
var $author$project$Data$Textile$LifeCycle$computeTotalTransportImpacts = A2(
	$elm$core$Array$foldl,
	F2(
		function (_v0, acc) {
			var transport = _v0.c5;
			return _Utils_update(
				acc,
				{
					hK: A2($ianmackenzie$elm_units$Quantity$plus, transport.hK, acc.hK),
					z: A2(
						$author$project$Data$Impact$mapImpacts,
						F2(
							function (trigram, impact) {
								return $ianmackenzie$elm_units$Quantity$sum(
									_List_fromArray(
										[
											impact,
											A2($author$project$Data$Impact$getImpact, trigram, transport.z)
										]));
							}),
						acc.z),
					dP: A2($ianmackenzie$elm_units$Quantity$plus, transport.dP, acc.dP),
					g4: A2($ianmackenzie$elm_units$Quantity$plus, transport.g4, acc.g4)
				});
		}),
	$author$project$Data$Transport$default($author$project$Data$Impact$empty));
var $author$project$Data$Textile$Simulator$computeTotalTransportImpacts = function (simulator) {
	return _Utils_update(
		simulator,
		{
			c5: $author$project$Data$Textile$LifeCycle$computeTotalTransportImpacts(simulator.K)
		});
};
var $author$project$Data$Component$Results = $elm$core$Basics$identity;
var $author$project$Data$Component$addResults = F2(
	function (_v0, _v1) {
		var results = _v0;
		var acc = _v1;
		return _Utils_update(
			acc,
			{
				z: $author$project$Data$Impact$sumImpacts(
					_List_fromArray(
						[results.z, acc.z])),
				S: A2($elm$core$List$cons, results, acc.S),
				T: $ianmackenzie$elm_units$Quantity$sum(
					_List_fromArray(
						[results.T, acc.T])),
				aN: $elm$core$Maybe$Nothing
			});
	});
var $author$project$Data$Component$TransformStage = 1;
var $author$project$Data$Uuid$fromString = A2(
	$elm$core$Basics$composeR,
	$NoRedInk$elm_uuid$Prng$Uuid$fromString,
	$elm$core$Result$fromMaybe('UUIDinvalide'));
var $author$project$Data$Process$idFromString = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Uuid$fromString,
	$elm$core$Result$map($elm$core$Basics$identity));
var $author$project$Data$Component$loadDefaultEnergyMixes = function (processes) {
	var fromIdString = A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Process$idFromString,
		$elm$core$Result$andThen(
			function (id) {
				return A2($author$project$Data$Process$findById, id, processes);
			}));
	return A3(
		$elm$core$Result$map2,
		F2(
			function (elec, heat) {
				return {eo: elec, ez: heat};
			}),
		fromIdString('a2129ece-5dd9-5e66-969c-2603b3c97244'),
		fromIdString('3561ace1-f710-50ce-a69c-9cf842e729e4'));
};
var $author$project$Data$Component$applyTransforms = F3(
	function (allProcesses, transforms, materialResults) {
		return A2(
			$elm$core$Result$map,
			function (_v0) {
				var elec = _v0.eo;
				var heat = _v0.ez;
				return A3(
					$elm$core$List$foldl,
					F2(
						function (transform, _v1) {
							var impacts = _v1.z;
							var items = _v1.S;
							var mass = _v1.T;
							var wastedMass = A2(
								$ianmackenzie$elm_units$Quantity$multiplyBy,
								$author$project$Data$Split$toFloat(transform.hz),
								mass);
							var transformImpacts = A2(
								$author$project$Data$Impact$multiplyBy,
								$ianmackenzie$elm_units$Mass$inKilograms(mass),
								$author$project$Data$Impact$sumImpacts(
									_List_fromArray(
										[
											transform.z,
											A2(
											$author$project$Data$Impact$multiplyBy,
											$ianmackenzie$elm_units$Energy$inKilowattHours(transform.eo),
											elec.z),
											A2(
											$author$project$Data$Impact$multiplyBy,
											$ianmackenzie$elm_units$Energy$inMegajoules(transform.ez),
											heat.z)
										])));
							var outputMass = A2($ianmackenzie$elm_units$Quantity$minus, wastedMass, mass);
							return {
								z: $author$project$Data$Impact$sumImpacts(
									_List_fromArray(
										[transformImpacts, impacts])),
								S: _Utils_ap(
									items,
									_List_fromArray(
										[
											{
											z: transformImpacts,
											S: _List_Nil,
											T: outputMass,
											aN: $elm$core$Maybe$Just(1)
										}
										])),
								T: outputMass,
								aN: $elm$core$Maybe$Nothing
							};
						}),
					materialResults,
					transforms);
			},
			$author$project$Data$Component$loadDefaultEnergyMixes(allProcesses));
	});
var $author$project$Data$Component$computeInitialAmount = F2(
	function (wastes, amount) {
		return A2($elm$core$List$member, $author$project$Data$Split$full, wastes) ? $elm$core$Result$Err('Un taux de perte ne peut pas être de 100%') : $elm$core$Result$Ok(
			A3(
				$elm$core$List$foldr,
				F2(
					function (waste, _v0) {
						var _float = _v0;
						return _float / (1 - $author$project$Data$Split$toFloat(waste));
					}),
				amount,
				wastes));
	});
var $author$project$Data$Component$MaterialStage = 0;
var $author$project$Data$Component$amountToFloat = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Component$computeMaterialResults = F2(
	function (amount, process) {
		var mass = $ianmackenzie$elm_units$Mass$kilograms(
			(process.hs === 'kg') ? $author$project$Data$Component$amountToFloat(amount) : ($author$project$Data$Component$amountToFloat(amount) * process.ie));
		var impacts = A2(
			$author$project$Data$Impact$multiplyBy,
			$author$project$Data$Component$amountToFloat(amount),
			process.z);
		return {
			z: impacts,
			S: _List_fromArray(
				[
					{
					z: impacts,
					S: _List_Nil,
					T: mass,
					aN: $elm$core$Maybe$Just(0)
				}
				]),
			T: mass,
			aN: $elm$core$Maybe$Nothing
		};
	});
var $author$project$Data$Component$ExpandedElement = F3(
	function (amount, material, transforms) {
		return {aQ: amount, aa: material, at: transforms};
	});
var $author$project$Data$Component$expandElement = F2(
	function (processes, _v0) {
		var amount = _v0.aQ;
		var material = _v0.aa;
		var transforms = _v0.at;
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$elm_community$result_extra$Result$Extra$combine(
				A2(
					$elm$core$List$map,
					function (id) {
						return A2($author$project$Data$Process$findById, id, processes);
					},
					transforms)),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				A2($author$project$Data$Process$findById, material, processes),
				$elm$core$Result$Ok(
					$author$project$Data$Component$ExpandedElement(amount))));
	});
var $author$project$Data$Component$computeElementResults = function (processes) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Component$expandElement(processes),
		$elm$core$Result$andThen(
			function (_v0) {
				var amount = _v0.aQ;
				var material = _v0.aa;
				var transforms = _v0.at;
				return A2(
					$elm$core$Result$andThen,
					function (initialAmount) {
						return A3(
							$author$project$Data$Component$applyTransforms,
							processes,
							transforms,
							A2($author$project$Data$Component$computeMaterialResults, initialAmount, material));
					},
					A2(
						$author$project$Data$Component$computeInitialAmount,
						A2(
							$elm$core$List$map,
							function ($) {
								return $.hz;
							},
							transforms),
						amount));
			}));
};
var $author$project$Data$Component$emptyResults = {z: $author$project$Data$Impact$empty, S: _List_Nil, T: $ianmackenzie$elm_units$Quantity$zero, aN: $elm$core$Maybe$Nothing};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Data$Component$computeItemResults = F2(
	function (_v0, _v1) {
		var components = _v0.di;
		var processes = _v0.dJ;
		var custom = _v1.P;
		var id = _v1.H;
		var quantity = _v1.bG;
		return A2(
			$elm$core$Result$map,
			function (_v2) {
				var impacts = _v2.z;
				var mass = _v2.T;
				var items = _v2.S;
				return {
					z: $author$project$Data$Impact$sumImpacts(
						A2(
							$elm$core$List$repeat,
							$author$project$Data$Component$quantityToInt(quantity),
							impacts)),
					S: items,
					T: $ianmackenzie$elm_units$Quantity$sum(
						A2(
							$elm$core$List$repeat,
							$author$project$Data$Component$quantityToInt(quantity),
							mass)),
					aN: $elm$core$Maybe$Nothing
				};
			},
			A2(
				$elm$core$Result$map,
				A2($elm$core$List$foldr, $author$project$Data$Component$addResults, $author$project$Data$Component$emptyResults),
				A2(
					$elm$core$Result$andThen,
					function (component) {
						return $elm_community$result_extra$Result$Extra$combine(
							A2(
								$elm$core$List$map,
								$author$project$Data$Component$computeElementResults(processes),
								A2(
									$elm$core$Maybe$withDefault,
									component.o,
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.o;
										},
										custom))));
					},
					A2($author$project$Data$Component$findById, id, components))));
	});
var $author$project$Data$Component$compute = function (db) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(
			$author$project$Data$Component$computeItemResults(db)),
		A2(
			$elm$core$Basics$composeR,
			$elm_community$result_extra$Result$Extra$combine,
			$elm$core$Result$map(
				A2($elm$core$List$foldr, $author$project$Data$Component$addResults, $author$project$Data$Component$emptyResults))));
};
var $author$project$Data$Component$extractImpacts = function (_v0) {
	var impacts = _v0.z;
	return impacts;
};
var $author$project$Data$Textile$Simulator$computeTrims = F2(
	function (db, simulator) {
		var durability = simulator.au;
		var inputs = simulator.u;
		return A2(
			$elm$core$Result$map,
			function (trimsImpacts) {
				return _Utils_update(
					simulator,
					{
						z: $author$project$Data$Impact$sumImpacts(
							_List_fromArray(
								[
									simulator.z,
									A2(
									$author$project$Data$Impact$divideBy,
									$author$project$Data$Unit$floatDurabilityFromHolistic(durability),
									trimsImpacts)
								])),
						c7: trimsImpacts
					});
			},
			A2(
				$elm$core$Result$map,
				$author$project$Data$Component$extractImpacts,
				A2($author$project$Data$Component$compute, db, inputs.kv)));
	});
var $author$project$Data$Textile$Formula$useImpacts = F3(
	function (impacts, _v0, baseMass) {
		var countryElecProcess = _v0.b3;
		var ironingElec = _v0.iW;
		var nonIroningProcess = _v0.jt;
		var useNbCycles = _v0.kz;
		var totalEnergy = A2(
			$ianmackenzie$elm_units$Quantity$multiplyBy,
			useNbCycles,
			$ianmackenzie$elm_units$Quantity$sum(
				_List_fromArray(
					[
						ironingElec,
						A2(
						$ianmackenzie$elm_units$Quantity$multiplyBy,
						$ianmackenzie$elm_units$Mass$inKilograms(baseMass),
						nonIroningProcess.eo)
					])));
		return {
			ez: $ianmackenzie$elm_units$Quantity$zero,
			z: A2(
				$author$project$Data$Impact$mapImpacts,
				F2(
					function (trigram, _v1) {
						return $ianmackenzie$elm_units$Quantity$sum(
							_List_fromArray(
								[
									A2(
									$author$project$Data$Unit$forKWh,
									A2($author$project$Data$Process$getImpact, trigram, countryElecProcess),
									totalEnergy),
									A2(
									$ianmackenzie$elm_units$Quantity$multiplyBy,
									useNbCycles,
									A2(
										$author$project$Data$Unit$forKg,
										A2($author$project$Data$Process$getImpact, trigram, nonIroningProcess),
										baseMass))
								]));
					}),
				impacts),
			ax: totalEnergy
		};
	});
var $author$project$Data$Textile$Simulator$computeUseImpacts = F2(
	function (_v0, simulator) {
		var textile = _v0.kk;
		var inputs = simulator.u;
		var useNbCycles = simulator.kz;
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleStep,
			7,
			function (step) {
				var _v1 = A3(
					$author$project$Data$Textile$Formula$useImpacts,
					step.z,
					{b3: textile.kD.i8, iW: inputs.aC.hu.iW, jt: inputs.aC.hu.jt, kz: useNbCycles},
					step.jE);
				var impacts = _v1.z;
				var kwh = _v1.ax;
				return _Utils_update(
					step,
					{z: impacts, ax: kwh});
			},
			simulator);
	});
var $author$project$Data$Component$extractMass = function (_v0) {
	var mass = _v0.T;
	return mass;
};
var $author$project$Data$Textile$Simulator$handleTrimsWeight = F2(
	function (db, simulator) {
		var inputs = simulator.u;
		var trimsMass = A2(
			$elm$core$Result$withDefault,
			$ianmackenzie$elm_units$Quantity$zero,
			A2(
				$elm$core$Result$map,
				$author$project$Data$Component$extractMass,
				A2($author$project$Data$Component$compute, db, inputs.kv)));
		return A3(
			$author$project$Data$Textile$Simulator$updateLifeCycleSteps,
			_List_fromArray(
				[5, 6, 3, 2]),
			function (step) {
				return _Utils_update(
					step,
					{
						cg: A2($ianmackenzie$elm_units$Quantity$minus, trimsMass, step.cg),
						jE: A2($ianmackenzie$elm_units$Quantity$minus, trimsMass, step.jE)
					});
			},
			simulator);
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $ianmackenzie$elm_units$Constants$second = 1;
var $ianmackenzie$elm_units$Constants$minute = 60 * $ianmackenzie$elm_units$Constants$second;
var $ianmackenzie$elm_units$Constants$hour = 60 * $ianmackenzie$elm_units$Constants$minute;
var $ianmackenzie$elm_units$Constants$day = 24 * $ianmackenzie$elm_units$Constants$hour;
var $ianmackenzie$elm_units$Duration$inDays = function (duration) {
	return $ianmackenzie$elm_units$Duration$inSeconds(duration) / $ianmackenzie$elm_units$Constants$day;
};
var $author$project$Data$Textile$Product$customDaysOfWear = function (_v0) {
	var daysOfWear = _v0.ek;
	var wearsPerCycle = _v0.fn;
	return $elm$core$Basics$round(
		$ianmackenzie$elm_units$Duration$inDays(daysOfWear) / A3($elm$core$Basics$clamp, 1, wearsPerCycle, wearsPerCycle));
};
var $author$project$Data$Textile$Inputs$Inputs = function (airTransportRatio) {
	return function (business) {
		return function (countryDistribution) {
			return function (countryDyeing) {
				return function (countryEndOfLife) {
					return function (countryFabric) {
						return function (countryMaking) {
							return function (countryMaterial) {
								return function (countrySpinning) {
									return function (countryUse) {
										return function (disabledSteps) {
											return function (dyeingProcessType) {
												return function (fabricProcess) {
													return function (fading) {
														return function (makingComplexity) {
															return function (makingDeadStock) {
																return function (makingWaste) {
																	return function (mass) {
																		return function (materials) {
																			return function (numberOfReferences) {
																				return function (physicalDurability) {
																					return function (price) {
																						return function (printing) {
																							return function (product) {
																								return function (surfaceMass) {
																									return function (trims) {
																										return function (upcycled) {
																											return function (yarnSize) {
																												return {bY: airTransportRatio, fC: business, eh: countryDistribution, aW: countryDyeing, ei: countryEndOfLife, bb: countryFabric, bc: countryMaking, fM: countryMaterial, b4: countrySpinning, ej: countryUse, b6: disabledSteps, b7: dyeingProcessType, bj: fabricProcess, cb: fading, i9: makingComplexity, cl: makingDeadStock, cm: makingWaste, T: mass, jc: materials, gB: numberOfReferences, co: physicalDurability, gM: price, cp: printing, aC: product, e5: surfaceMass, kv: trims, cz: upcycled, kF: yarnSize};
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Textile$Inputs$fromMaterialQuery = F2(
	function (materials, countries) {
		return A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map(
				function (_v0) {
					var country = _v0.fL;
					var id = _v0.H;
					var share = _v0.ac;
					var spinning = _v0.cu;
					var countryResult = function () {
						if (!country.$) {
							var countryCode = country.a;
							return A2(
								$elm$core$Result$map,
								$elm$core$Maybe$Just,
								A2($author$project$Data$Country$findByCode, countryCode, countries));
						} else {
							return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
						}
					}();
					return A3(
						$elm$core$Result$map2,
						F2(
							function (material_, country_) {
								return {fL: country_, aa: material_, ac: share, cu: spinning};
							}),
						A2($author$project$Data$Textile$Material$findById, id, materials),
						countryResult);
				}),
			$elm_community$result_extra$Result$Extra$combine);
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Data$Textile$Inputs$getMainMaterial = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$sortBy(
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.ac;
			},
			$author$project$Data$Split$toFloat)),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$reverse,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map(
					function ($) {
						return $.aa;
					}),
				$elm$core$Result$fromMaybe('La liste de matières est vide.')))));
var $author$project$Data$Textile$Inputs$getMainMaterialCountry = function (countries) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Textile$Inputs$getMainMaterial,
		$elm$core$Result$andThen(
			function (_v0) {
				var defaultCountry = _v0.fO;
				return A2($author$project$Data$Country$findByCode, defaultCountry, countries);
			}));
};
var $elm_community$result_extra$Result$Extra$or = F2(
	function (ra, rb) {
		if (ra.$ === 1) {
			return rb;
		} else {
			return ra;
		}
	});
var $elm_community$result_extra$Result$Extra$orElse = F2(
	function (ra, rb) {
		return A2($elm_community$result_extra$Result$Extra$or, rb, ra);
	});
var $author$project$Data$Country$unknownCountryCode = '---';
var $author$project$Data$Textile$Inputs$fromQuery = F2(
	function (_v0, query) {
		var countries = _v0.h4;
		var textile = _v0.kk;
		var unknownCountryResult = A2($author$project$Data$Country$findByCode, $author$project$Data$Country$unknownCountryCode, countries);
		var trims = function () {
			var _v2 = query.kv;
			if (!_v2.$) {
				var customTrims = _v2.a;
				return $elm$core$Result$Ok(customTrims);
			} else {
				return A2(
					$elm$core$Result$map,
					function ($) {
						return $.kv;
					},
					A2($author$project$Data$Textile$Product$findById, query.aC, textile.jP));
			}
		}();
		var materials_ = A3($author$project$Data$Textile$Inputs$fromMaterialQuery, textile.jc, countries, query.jc);
		var mainMaterialCountry = A2(
			$elm_community$result_extra$Result$Extra$orElse,
			unknownCountryResult,
			A2(
				$elm$core$Result$andThen,
				$author$project$Data$Textile$Inputs$getMainMaterialCountry(countries),
				materials_));
		var getCountryResult = F2(
			function (fallbackResult, maybeCode) {
				if (!maybeCode.$) {
					var code = maybeCode.a;
					return A2($author$project$Data$Country$findByCode, code, countries);
				} else {
					return fallbackResult;
				}
			});
		var franceResult = A2($author$project$Data$Country$findByCode, 'FR', countries);
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$elm$core$Result$Ok(query.kF),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				$elm$core$Result$Ok(query.cz),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					trims,
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						$elm$core$Result$Ok(query.e5),
						A2(
							$elm_community$result_extra$Result$Extra$andMap,
							A2($author$project$Data$Textile$Product$findById, query.aC, textile.jP),
							A2(
								$elm_community$result_extra$Result$Extra$andMap,
								$elm$core$Result$Ok(query.cp),
								A2(
									$elm_community$result_extra$Result$Extra$andMap,
									$elm$core$Result$Ok(query.gM),
									A2(
										$elm_community$result_extra$Result$Extra$andMap,
										$elm$core$Result$Ok(query.co),
										A2(
											$elm_community$result_extra$Result$Extra$andMap,
											$elm$core$Result$Ok(query.gB),
											A2(
												$elm_community$result_extra$Result$Extra$andMap,
												materials_,
												A2(
													$elm_community$result_extra$Result$Extra$andMap,
													$elm$core$Result$Ok(query.T),
													A2(
														$elm_community$result_extra$Result$Extra$andMap,
														$elm$core$Result$Ok(query.cm),
														A2(
															$elm_community$result_extra$Result$Extra$andMap,
															$elm$core$Result$Ok(query.cl),
															A2(
																$elm_community$result_extra$Result$Extra$andMap,
																$elm$core$Result$Ok(query.i9),
																A2(
																	$elm_community$result_extra$Result$Extra$andMap,
																	$elm$core$Result$Ok(query.cb),
																	A2(
																		$elm_community$result_extra$Result$Extra$andMap,
																		$elm$core$Result$Ok(query.bj),
																		A2(
																			$elm_community$result_extra$Result$Extra$andMap,
																			$elm$core$Result$Ok(query.b7),
																			A2(
																				$elm_community$result_extra$Result$Extra$andMap,
																				$elm$core$Result$Ok(query.b6),
																				A2(
																					$elm_community$result_extra$Result$Extra$andMap,
																					franceResult,
																					A2(
																						$elm_community$result_extra$Result$Extra$andMap,
																						A2(getCountryResult, unknownCountryResult, query.b4),
																						A2(
																							$elm_community$result_extra$Result$Extra$andMap,
																							mainMaterialCountry,
																							A2(
																								$elm_community$result_extra$Result$Extra$andMap,
																								A2(getCountryResult, unknownCountryResult, query.bc),
																								A2(
																									$elm_community$result_extra$Result$Extra$andMap,
																									A2(getCountryResult, unknownCountryResult, query.bb),
																									A2(
																										$elm_community$result_extra$Result$Extra$andMap,
																										franceResult,
																										A2(
																											$elm_community$result_extra$Result$Extra$andMap,
																											A2(getCountryResult, unknownCountryResult, query.aW),
																											A2(
																												$elm_community$result_extra$Result$Extra$andMap,
																												franceResult,
																												A2(
																													$elm_community$result_extra$Result$Extra$andMap,
																													$elm$core$Result$Ok(query.fC),
																													A2(
																														$elm_community$result_extra$Result$Extra$andMap,
																														$elm$core$Result$Ok(query.bY),
																														$elm$core$Result$Ok($author$project$Data$Textile$Inputs$Inputs)))))))))))))))))))))))))))));
	});
var $author$project$Data$Textile$Query$handleUpcycling = function (query) {
	return query.cz ? _Utils_update(
		query,
		{
			b6: $elm_community$list_extra$List$Extra$unique(
				_Utils_ap($author$project$Data$Textile$Step$Label$upcyclables, query.b6)),
			i9: $elm$core$Maybe$Just(
				A2($elm$core$Maybe$withDefault, 0, query.i9))
		}) : query;
};
var $author$project$Data$Textile$Inputs$countryList = function (inputs) {
	return _List_fromArray(
		[inputs.fM, inputs.b4, inputs.bb, inputs.aW, inputs.bc, inputs.eh, inputs.ej, inputs.ei]);
};
var $author$project$Data$Textile$Step$defaultProcessInfo = {bX: $elm$core$Maybe$Nothing, bY: $elm$core$Maybe$Nothing, aF: $elm$core$Maybe$Nothing, cM: $elm$core$Maybe$Nothing, cO: $elm$core$Maybe$Nothing, en: $elm$core$Maybe$Nothing, ix: $elm$core$Maybe$Nothing, f_: $elm$core$Maybe$Nothing, cb: $elm$core$Maybe$Nothing, eI: $elm$core$Maybe$Nothing, jF: $elm$core$Maybe$Nothing, cp: $elm$core$Maybe$Nothing, bI: $elm$core$Maybe$Nothing, cr: $elm$core$Maybe$Nothing, d2: $elm$core$Maybe$Nothing, d3: $elm$core$Maybe$Nothing};
var $author$project$Data$Unit$standardDurability = function (dur) {
	return dur(1);
};
var $author$project$Data$Textile$Step$create = function (_v0) {
	var country = _v0.fL;
	var editable = _v0.iu;
	var enabled = _v0.cP;
	var label = _v0._;
	var defaultImpacts = $author$project$Data$Impact$empty;
	return {
		bY: $author$project$Data$Split$zero,
		h1: $author$project$Data$Impact$noComplementsImpacts,
		fL: country,
		h8: $ianmackenzie$elm_units$Quantity$zero,
		au: $author$project$Data$Unit$standardDurability($elm$core$Basics$identity),
		b7: $elm$core$Maybe$Nothing,
		iu: editable,
		cP: enabled,
		ez: $ianmackenzie$elm_units$Quantity$zero,
		z: defaultImpacts,
		cg: $ianmackenzie$elm_units$Quantity$zero,
		ax: $ianmackenzie$elm_units$Quantity$zero,
		_: label,
		i9: $elm$core$Maybe$Nothing,
		cl: $elm$core$Maybe$Nothing,
		cm: $elm$core$Maybe$Nothing,
		jE: $ianmackenzie$elm_units$Quantity$zero,
		gH: $elm$core$Maybe$Nothing,
		jK: $author$project$Data$Textile$Step$emptyPreTreatments,
		cp: $elm$core$Maybe$Nothing,
		ab: $author$project$Data$Textile$Step$defaultProcessInfo,
		e5: $elm$core$Maybe$Nothing,
		hk: $elm$core$Maybe$Nothing,
		c5: $author$project$Data$Transport$default(defaultImpacts),
		hz: $ianmackenzie$elm_units$Quantity$zero,
		kF: $elm$core$Maybe$Nothing
	};
};
var $cuducos$elm_format_number$FormatNumber$Locales$Exact = function (a) {
	return {$: 2, a: a};
};
var $chain_partners$elm_bignum$Decimal$Sci = 1;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $cuducos$elm_format_number$FormatNumber$Parser$FormattedNumber = F5(
	function (original, integers, decimals, prefix, suffix) {
		return {h9: decimals, gh: integers, gE: original, dI: prefix, dU: suffix};
	});
var $cuducos$elm_format_number$FormatNumber$Parser$Negative = 2;
var $cuducos$elm_format_number$FormatNumber$Parser$Positive = 0;
var $cuducos$elm_format_number$FormatNumber$Parser$Zero = 1;
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $cuducos$elm_format_number$FormatNumber$Parser$classify = function (formatted) {
	var onlyZeros = A2(
		$elm$core$String$all,
		function (_char) {
			return _char === '0';
		},
		$elm$core$String$concat(
			A2(
				$elm$core$List$append,
				formatted.gh,
				$elm$core$List$singleton(formatted.h9))));
	return onlyZeros ? 1 : ((formatted.gE < 0) ? 2 : 0);
};
var $elm$core$String$filter = _String_filter;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $cuducos$elm_format_number$FormatNumber$Parser$addZerosToFit = F2(
	function (desiredLength, value) {
		var length = $elm$core$String$length(value);
		var missing = (_Utils_cmp(length, desiredLength) < 0) ? $elm$core$Basics$abs(desiredLength - length) : 0;
		return _Utils_ap(
			value,
			A2($elm$core$String$repeat, missing, '0'));
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $cuducos$elm_format_number$FormatNumber$Parser$removeZeros = function (decimals) {
	return (A2($elm$core$String$right, 1, decimals) !== '0') ? decimals : $cuducos$elm_format_number$FormatNumber$Parser$removeZeros(
		A2($elm$core$String$dropRight, 1, decimals));
};
var $cuducos$elm_format_number$FormatNumber$Parser$getDecimals = F2(
	function (locale, digits) {
		var _v0 = locale.h9;
		switch (_v0.$) {
			case 1:
				return $cuducos$elm_format_number$FormatNumber$Parser$removeZeros(digits);
			case 2:
				return digits;
			default:
				var min = _v0.a;
				return A2($cuducos$elm_format_number$FormatNumber$Parser$addZerosToFit, min, digits);
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (c !== '0') && (c !== '.');
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (head === '9') {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 1) {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				'0',
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3($elm$core$String$padRight, e + 1, '0', total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					'0',
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3($elm$core$String$padRight, s, '0', after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 1) {
				return false;
			} else {
				if ('5' === _v0.a.a) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $cuducos$elm_format_number$FormatNumber$Parser$splitInParts = F2(
	function (locale, value) {
		var toString = function () {
			var _v1 = locale.h9;
			switch (_v1.$) {
				case 1:
					var max = _v1.a;
					return $myrho$elm_round$Round$round(max);
				case 0:
					return $elm$core$String$fromFloat;
				default:
					var exact = _v1.a;
					return $myrho$elm_round$Round$round(exact);
			}
		}();
		var asList = A2(
			$elm$core$String$split,
			'.',
			toString(value));
		var decimals = function () {
			var _v0 = $elm$core$List$tail(asList);
			if (!_v0.$) {
				var values = _v0.a;
				return A2(
					$elm$core$Maybe$withDefault,
					'',
					$elm$core$List$head(values));
			} else {
				return '';
			}
		}();
		var integers = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(asList));
		return _Utils_Tuple2(integers, decimals);
	});
var $cuducos$elm_format_number$FormatNumber$Parser$splitThousands = function (integers) {
	var reversedSplitThousands = function (value) {
		return ($elm$core$String$length(value) > 3) ? A2(
			$elm$core$List$cons,
			A2($elm$core$String$right, 3, value),
			reversedSplitThousands(
				A2($elm$core$String$dropRight, 3, value))) : _List_fromArray(
			[value]);
	};
	return $elm$core$List$reverse(
		reversedSplitThousands(integers));
};
var $cuducos$elm_format_number$FormatNumber$Parser$parse = F2(
	function (locale, original) {
		var parts = A2($cuducos$elm_format_number$FormatNumber$Parser$splitInParts, locale, original);
		var integers = $cuducos$elm_format_number$FormatNumber$Parser$splitThousands(
			A2($elm$core$String$filter, $elm$core$Char$isDigit, parts.a));
		var decimals = A2($cuducos$elm_format_number$FormatNumber$Parser$getDecimals, locale, parts.b);
		var partial = A5($cuducos$elm_format_number$FormatNumber$Parser$FormattedNumber, original, integers, decimals, '', '');
		var _v0 = $cuducos$elm_format_number$FormatNumber$Parser$classify(partial);
		switch (_v0) {
			case 2:
				return _Utils_update(
					partial,
					{dI: locale.dC, dU: locale.eK});
			case 0:
				return _Utils_update(
					partial,
					{dI: locale.gK, dU: locale.gL});
			default:
				return _Utils_update(
					partial,
					{dI: locale.hG, dU: locale.hH});
		}
	});
var $cuducos$elm_format_number$FormatNumber$Stringfy$formatDecimals = F2(
	function (locale, decimals) {
		return (decimals === '') ? '' : _Utils_ap(locale.bd, decimals);
	});
var $cuducos$elm_format_number$FormatNumber$Stringfy$stringfy = F2(
	function (locale, formatted) {
		var stringfyDecimals = $cuducos$elm_format_number$FormatNumber$Stringfy$formatDecimals(locale);
		var integers = A2($elm$core$String$join, locale.bN, formatted.gh);
		var decimals = stringfyDecimals(formatted.h9);
		return $elm$core$String$concat(
			_List_fromArray(
				[formatted.dI, integers, decimals, formatted.dU]));
	});
var $cuducos$elm_format_number$FormatNumber$format = F2(
	function (locale, number_) {
		return A2(
			$cuducos$elm_format_number$FormatNumber$Stringfy$stringfy,
			locale,
			A2($cuducos$elm_format_number$FormatNumber$Parser$parse, locale, number_));
	});
var $cuducos$elm_format_number$FormatNumber$Locales$Min = function (a) {
	return {$: 0, a: a};
};
var $cuducos$elm_format_number$FormatNumber$Locales$base = {
	bd: '.',
	h9: $cuducos$elm_format_number$FormatNumber$Locales$Min(0),
	dC: '−',
	eK: '',
	gK: '',
	gL: '',
	bN: '',
	hG: '',
	hH: ''
};
var $cuducos$elm_format_number$FormatNumber$Locales$frenchLocale = _Utils_update(
	$cuducos$elm_format_number$FormatNumber$Locales$base,
	{
		bd: ',',
		h9: $cuducos$elm_format_number$FormatNumber$Locales$Exact(3),
		bN: '\u202F'
	});
var $chain_partners$elm_bignum$Decimal$Decimal = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $chain_partners$elm_bignum$Decimal$Zero = {$: 1};
var $chain_partners$elm_bignum$Decimal$decimalNotationRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^-?(\\d+\\.?\\d+|\\d+)$'));
var $chain_partners$elm_bignum$Integer$Integer = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $chain_partners$elm_bignum$Integer$Negative = 1;
var $chain_partners$elm_bignum$Integer$Positive = 0;
var $chain_partners$elm_bignum$Integer$Zero = {$: 1};
var $chain_partners$elm_bignum$Integer$isValidString = $elm$regex$Regex$contains(
	A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('^-?\\d+$')));
var $chain_partners$elm_bignum$Integer$combine = A2(
	$elm$core$List$foldl,
	F2(
		function (x, acc) {
			if (x.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var i = x.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$cons(i),
					acc);
			}
		}),
	$elm$core$Maybe$Just(_List_Nil));
var $chain_partners$elm_bignum$Integer$splitFromEndBy = F3(
	function (n, acc, s) {
		splitFromEndBy:
		while (true) {
			if (s === '') {
				return acc;
			} else {
				var rest = A2($elm$core$String$dropRight, n, s);
				var chunk = A2($elm$core$String$right, n, s);
				var $temp$n = n,
					$temp$acc = A2($elm$core$List$cons, chunk, acc),
					$temp$s = rest;
				n = $temp$n;
				acc = $temp$acc;
				s = $temp$s;
				continue splitFromEndBy;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$magnitudeFromString = function (s) {
	return $chain_partners$elm_bignum$Integer$combine(
		A2(
			$elm$core$List$map,
			$elm$core$String$toInt,
			A3($chain_partners$elm_bignum$Integer$splitFromEndBy, 7, _List_Nil, s)));
};
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr = A2(
	$elm$regex$Regex$replace,
	A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('^0*')),
	function (_v0) {
		return '';
	});
var $chain_partners$elm_bignum$Integer$fromString = function (s) {
	if ($chain_partners$elm_bignum$Integer$isValidString(s)) {
		var _v0 = A2($elm$core$String$startsWith, '-', s) ? _Utils_Tuple2(
			1,
			$chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr(
				A2($elm$core$String$dropLeft, 1, s))) : _Utils_Tuple2(
			0,
			$chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr(s));
		var sign = _v0.a;
		var num = _v0.b;
		return $elm$core$String$isEmpty(num) ? $elm$core$Maybe$Just($chain_partners$elm_bignum$Integer$Zero) : A2(
			$elm$core$Maybe$map,
			$chain_partners$elm_bignum$Integer$Integer(sign),
			$chain_partners$elm_bignum$Integer$magnitudeFromString(num));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $chain_partners$elm_bignum$Decimal$trimTrailingZero = A2(
	$elm$regex$Regex$replace,
	A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('0*$')),
	function (_v0) {
		return '';
	});
var $chain_partners$elm_bignum$Decimal$fromDecimalNotation = F2(
	function (minE, s) {
		var _v0 = A2($elm$core$String$split, '.', s);
		_v0$2:
		while (true) {
			if (_v0.b) {
				if (!_v0.b.b) {
					var i = _v0.a;
					var trimmedSig = $chain_partners$elm_bignum$Decimal$trimTrailingZero(i);
					var e = $elm$core$String$length(i) - $elm$core$String$length(trimmedSig);
					return A3(
						$elm$core$Maybe$map2,
						$chain_partners$elm_bignum$Decimal$Decimal,
						$chain_partners$elm_bignum$Integer$fromString(trimmedSig),
						$elm$core$Maybe$Just(e));
				} else {
					if (!_v0.b.b.b) {
						var i = _v0.a;
						var _v1 = _v0.b;
						var f = _v1.a;
						var trimmedF = $chain_partners$elm_bignum$Decimal$trimTrailingZero(f);
						var f_ = A2($elm$core$String$left, -minE, trimmedF);
						var mbSig = $chain_partners$elm_bignum$Integer$fromString(
							_Utils_ap(i, f_));
						var e = -$elm$core$String$length(f_);
						return A3(
							$elm$core$Maybe$map2,
							$chain_partners$elm_bignum$Decimal$Decimal,
							mbSig,
							$elm$core$Maybe$Just(e));
					} else {
						break _v0$2;
					}
				}
			} else {
				break _v0$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $chain_partners$elm_bignum$Decimal$fromScientificNotation = F2(
	function (minE, s) {
		var _v0 = A2(
			$elm$core$String$split,
			'e',
			$elm$core$String$toLower(s));
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var co = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var _v2 = A2($elm$core$String$split, '.', co);
			_v2$2:
			while (true) {
				if (_v2.b) {
					if (!_v2.b.b) {
						var i = _v2.a;
						if ($elm$core$String$length(i) > 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var mbE = A2(
								$elm$core$Maybe$andThen,
								function (e) {
									return (_Utils_cmp(e, minE) < 0) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(e);
								},
								$elm$core$String$toInt(exp));
							return (i === '0') ? $elm$core$Maybe$Just($chain_partners$elm_bignum$Decimal$Zero) : A3(
								$elm$core$Maybe$map2,
								$chain_partners$elm_bignum$Decimal$Decimal,
								$chain_partners$elm_bignum$Integer$fromString(i),
								mbE);
						}
					} else {
						if (!_v2.b.b.b) {
							var i = _v2.a;
							var _v3 = _v2.b;
							var f = _v3.a;
							var mbE = A2(
								$elm$core$Maybe$andThen,
								function (e) {
									return (_Utils_cmp(e, minE) < 0) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(e);
								},
								A2(
									$elm$core$Maybe$map,
									function (e) {
										return e - $elm$core$String$length(f);
									},
									$elm$core$String$toInt(exp)));
							return A3(
								$elm$core$Maybe$map2,
								$chain_partners$elm_bignum$Decimal$Decimal,
								$chain_partners$elm_bignum$Integer$fromString(
									_Utils_ap(i, f)),
								mbE);
						} else {
							break _v2$2;
						}
					}
				} else {
					break _v2$2;
				}
			}
			return $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$Basics$pow = _Basics_pow;
var $chain_partners$elm_bignum$Integer$defaultBase = A2($elm$core$Basics$pow, 10, 7);
var $chain_partners$elm_bignum$Integer$magnitudeFromInt_ = F2(
	function (acc, i) {
		magnitudeFromInt_:
		while (true) {
			var q = (i / $chain_partners$elm_bignum$Integer$defaultBase) | 0;
			if (!q) {
				return $elm$core$List$reverse(
					A2($elm$core$List$cons, i, acc));
			} else {
				var $temp$acc = A2($elm$core$List$cons, i % $chain_partners$elm_bignum$Integer$defaultBase, acc),
					$temp$i = q;
				acc = $temp$acc;
				i = $temp$i;
				continue magnitudeFromInt_;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$magnitudeFromInt = $chain_partners$elm_bignum$Integer$magnitudeFromInt_(_List_Nil);
var $chain_partners$elm_bignum$Integer$fromInt = function (i) {
	var _v0 = A2($elm$core$Basics$compare, i, 0);
	switch (_v0) {
		case 2:
			return A2(
				$chain_partners$elm_bignum$Integer$Integer,
				0,
				$chain_partners$elm_bignum$Integer$magnitudeFromInt(i));
		case 1:
			return $chain_partners$elm_bignum$Integer$Zero;
		default:
			return A2(
				$chain_partners$elm_bignum$Integer$Integer,
				1,
				$chain_partners$elm_bignum$Integer$magnitudeFromInt(
					$elm$core$Basics$abs(i)));
	}
};
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $chain_partners$elm_bignum$Integer$toString = function (i) {
	if (i.$ === 1) {
		return '0';
	} else {
		var s = i.a;
		var m = i.b;
		var sign = (s === 1) ? '-' : '';
		var num = $chain_partners$elm_bignum$Integer$trimLeadingZeroFromStr(
			A3(
				$elm$core$List$foldl,
				$elm$core$Basics$append,
				'',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$String$fromInt,
						A2($elm$core$String$padLeft, 7, '0')),
					m)));
		return _Utils_ap(sign, num);
	}
};
var $chain_partners$elm_bignum$Integer$zero = $chain_partners$elm_bignum$Integer$Zero;
var $chain_partners$elm_bignum$Decimal$sigExpFromInteger = function (i) {
	var s_ = $chain_partners$elm_bignum$Decimal$trimTrailingZero(
		$chain_partners$elm_bignum$Integer$toString(i));
	var s = $chain_partners$elm_bignum$Integer$toString(i);
	var i_ = A2(
		$elm$core$Maybe$withDefault,
		$chain_partners$elm_bignum$Integer$zero,
		$chain_partners$elm_bignum$Integer$fromString(s_));
	var e = $elm$core$String$length(s) - $elm$core$String$length(s_);
	return _Utils_Tuple2(i_, e);
};
var $chain_partners$elm_bignum$Decimal$moveZeroesToE = F2(
	function (minE, d) {
		moveZeroesToE:
		while (true) {
			if (d.$ === 1) {
				return $chain_partners$elm_bignum$Decimal$Zero;
			} else {
				var s = d.a;
				var e = d.b;
				var _v1 = $chain_partners$elm_bignum$Decimal$sigExpFromInteger(s);
				var s_ = _v1.a;
				var e_ = _v1.b;
				var e__ = A2($elm$core$Basics$max, e + e_, minE);
				var s__ = (_Utils_cmp(e + e_, minE) < 0) ? A3(
					$elm$core$Basics$composeR,
					$chain_partners$elm_bignum$Integer$toString,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$String$dropRight(minE - (e + e_)),
						A2(
							$elm$core$Basics$composeR,
							$chain_partners$elm_bignum$Integer$fromString,
							$elm$core$Maybe$withDefault($chain_partners$elm_bignum$Integer$zero))),
					s_) : s_;
				if (_Utils_eq(
					s__,
					$chain_partners$elm_bignum$Integer$fromInt(0))) {
					return $chain_partners$elm_bignum$Decimal$Zero;
				} else {
					if (A3(
						$elm$core$Basics$composeR,
						$chain_partners$elm_bignum$Integer$toString,
						$elm$core$String$endsWith('0'),
						s__)) {
						var $temp$minE = minE,
							$temp$d = A2($chain_partners$elm_bignum$Decimal$Decimal, s__, e__);
						minE = $temp$minE;
						d = $temp$d;
						continue moveZeroesToE;
					} else {
						return A2($chain_partners$elm_bignum$Decimal$Decimal, s__, e__);
					}
				}
			}
		}
	});
var $chain_partners$elm_bignum$Decimal$scientificNotationRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^-?\\d{1}(\\.\\d*[1-9]|)e{1}-?\\d+$'));
var $chain_partners$elm_bignum$Decimal$fromStringWithMinE = F2(
	function (minE, s) {
		if (s === '0') {
			return $elm$core$Maybe$Just($chain_partners$elm_bignum$Decimal$Zero);
		} else {
			return A2($elm$regex$Regex$contains, $chain_partners$elm_bignum$Decimal$decimalNotationRegex, s) ? A2(
				$elm$core$Maybe$map,
				$chain_partners$elm_bignum$Decimal$moveZeroesToE(minE),
				A2($chain_partners$elm_bignum$Decimal$fromDecimalNotation, minE, s)) : (A2($elm$regex$Regex$contains, $chain_partners$elm_bignum$Decimal$scientificNotationRegex, s) ? A2(
				$elm$core$Maybe$map,
				$chain_partners$elm_bignum$Decimal$moveZeroesToE(minE),
				A2($chain_partners$elm_bignum$Decimal$fromScientificNotation, minE, s)) : $elm$core$Maybe$Nothing);
		}
	});
var $chain_partners$elm_bignum$Decimal$minExponent = -32;
var $chain_partners$elm_bignum$Decimal$fromString = $chain_partners$elm_bignum$Decimal$fromStringWithMinE($chain_partners$elm_bignum$Decimal$minExponent);
var $chain_partners$elm_bignum$Decimal$fromFloat = function (f) {
	return A2(
		$elm$core$Maybe$withDefault,
		A2($chain_partners$elm_bignum$Decimal$Decimal, $chain_partners$elm_bignum$Integer$zero, 0),
		$chain_partners$elm_bignum$Decimal$fromString(
			$elm$core$String$fromFloat(f)));
};
var $chain_partners$elm_bignum$Decimal$HalfToEven = 4;
var $chain_partners$elm_bignum$Integer$countDigits = function (i) {
	var s = $chain_partners$elm_bignum$Integer$toString(i);
	return A2($elm$core$String$startsWith, '-', s) ? $elm$core$String$length(
		A2($elm$core$String$dropLeft, 1, s)) : $elm$core$String$length(s);
};
var $chain_partners$elm_bignum$Integer$addMagnitudes_ = F3(
	function (m1, m2, acc) {
		addMagnitudes_:
		while (true) {
			var _v0 = _Utils_Tuple2(m1, m2);
			if (!_v0.a.b) {
				if (!_v0.b.b) {
					return $elm$core$List$reverse(acc);
				} else {
					return _Utils_ap(
						$elm$core$List$reverse(acc),
						m2);
				}
			} else {
				if (!_v0.b.b) {
					return _Utils_ap(
						$elm$core$List$reverse(acc),
						m1);
				} else {
					var _v1 = _v0.a;
					var d1 = _v1.a;
					var ds1 = _v1.b;
					var _v2 = _v0.b;
					var d2 = _v2.a;
					var ds2 = _v2.b;
					var $temp$m1 = ds1,
						$temp$m2 = ds2,
						$temp$acc = A2($elm$core$List$cons, d1 + d2, acc);
					m1 = $temp$m1;
					m2 = $temp$m2;
					acc = $temp$acc;
					continue addMagnitudes_;
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$handleFinalCarry = function (_v0) {
	var c = _v0.a;
	var m = _v0.b;
	if (!c) {
		return m;
	} else {
		if (!m.b) {
			return _List_Nil;
		} else {
			var d = m.a;
			var ds = m.b;
			return (!(d + c)) ? ds : A2($elm$core$List$cons, c, m);
		}
	}
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $chain_partners$elm_bignum$Integer$normalizeDigit = F2(
	function (d, _v0) {
		var prevCarry = _v0.a;
		var acc = _v0.b;
		var sum = d + prevCarry;
		var d_ = A2($elm$core$Basics$modBy, $chain_partners$elm_bignum$Integer$defaultBase, sum);
		var carry = (sum < 0) ? (-1) : ((sum / $chain_partners$elm_bignum$Integer$defaultBase) | 0);
		return _Utils_Tuple2(
			carry,
			A2($elm$core$List$cons, d_, acc));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $chain_partners$elm_bignum$Integer$trimLeadingZeroFromMag = A2(
	$elm$core$List$foldr,
	F2(
		function (x, xs) {
			return ((!x) && $elm$core$List$isEmpty(xs)) ? _List_Nil : A2($elm$core$List$cons, x, xs);
		}),
	_List_Nil);
var $chain_partners$elm_bignum$Integer$normalizeMagnitude = function (m) {
	return $chain_partners$elm_bignum$Integer$trimLeadingZeroFromMag(
		$elm$core$List$reverse(
			$chain_partners$elm_bignum$Integer$handleFinalCarry(
				A3(
					$elm$core$List$foldl,
					$chain_partners$elm_bignum$Integer$normalizeDigit,
					_Utils_Tuple2(0, _List_Nil),
					m))));
};
var $chain_partners$elm_bignum$Integer$addMagnitudes = F2(
	function (m1, m2) {
		return $chain_partners$elm_bignum$Integer$normalizeMagnitude(
			A3($chain_partners$elm_bignum$Integer$addMagnitudes_, m1, m2, _List_Nil));
	});
var $chain_partners$elm_bignum$Integer$compareMag_ = F2(
	function (m1, m2) {
		compareMag_:
		while (true) {
			var _v0 = _Utils_Tuple2(m1, m2);
			if (!_v0.a.b) {
				if (!_v0.b.b) {
					return 1;
				} else {
					var _v2 = _v0.b;
					var d = _v2.a;
					var ds = _v2.b;
					return 0;
				}
			} else {
				if (!_v0.b.b) {
					var _v1 = _v0.a;
					var d = _v1.a;
					var ds = _v1.b;
					return 2;
				} else {
					var _v3 = _v0.a;
					var d1 = _v3.a;
					var ds1 = _v3.b;
					var _v4 = _v0.b;
					var d2 = _v4.a;
					var ds2 = _v4.b;
					var _v5 = A2($elm$core$Basics$compare, d1, d2);
					switch (_v5) {
						case 2:
							return 2;
						case 1:
							var $temp$m1 = ds1,
								$temp$m2 = ds2;
							m1 = $temp$m1;
							m2 = $temp$m2;
							continue compareMag_;
						default:
							return 0;
					}
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$compareMag = F2(
	function (m1, m2) {
		var _v0 = A2(
			$elm$core$Basics$compare,
			$elm$core$List$length(m1),
			$elm$core$List$length(m2));
		switch (_v0) {
			case 2:
				return 2;
			case 0:
				return 0;
			default:
				return A2(
					$chain_partners$elm_bignum$Integer$compareMag_,
					$elm$core$List$reverse(m1),
					$elm$core$List$reverse(m2));
		}
	});
var $chain_partners$elm_bignum$Integer$add = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		_v0$4:
		while (true) {
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				return i2;
			} else {
				if (_v0.b.$ === 1) {
					var _v2 = _v0.b;
					return i1;
				} else {
					if (!_v0.a.a) {
						if (_v0.b.a === 1) {
							var _v3 = _v0.a;
							var _v4 = _v3.a;
							var m1 = _v3.b;
							var _v5 = _v0.b;
							var _v6 = _v5.a;
							var m2 = _v5.b;
							var _v7 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
							switch (_v7) {
								case 2:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										0,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											m1,
											A2($elm$core$List$map, $elm$core$Basics$negate, m2)));
								case 1:
									return $chain_partners$elm_bignum$Integer$Zero;
								default:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										1,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											A2($elm$core$List$map, $elm$core$Basics$negate, m1),
											m2));
							}
						} else {
							break _v0$4;
						}
					} else {
						if (!_v0.b.a) {
							var _v8 = _v0.a;
							var _v9 = _v8.a;
							var m1 = _v8.b;
							var _v10 = _v0.b;
							var _v11 = _v10.a;
							var m2 = _v10.b;
							var _v12 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
							switch (_v12) {
								case 2:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										1,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											m1,
											A2($elm$core$List$map, $elm$core$Basics$negate, m2)));
								case 1:
									return $chain_partners$elm_bignum$Integer$Zero;
								default:
									return A2(
										$chain_partners$elm_bignum$Integer$Integer,
										0,
										A2(
											$chain_partners$elm_bignum$Integer$addMagnitudes,
											A2($elm$core$List$map, $elm$core$Basics$negate, m1),
											m2));
							}
						} else {
							break _v0$4;
						}
					}
				}
			}
		}
		var _v13 = _v0.a;
		var s1 = _v13.a;
		var m1 = _v13.b;
		var _v14 = _v0.b;
		var s2 = _v14.a;
		var m2 = _v14.b;
		return A2(
			$chain_partners$elm_bignum$Integer$Integer,
			s1,
			A2($chain_partners$elm_bignum$Integer$addMagnitudes, m1, m2));
	});
var $chain_partners$elm_bignum$Integer$reverseOrder = function (o) {
	switch (o) {
		case 2:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
};
var $chain_partners$elm_bignum$Integer$compare = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		_v0$7:
		while (true) {
			if (_v0.a.$ === 1) {
				if (_v0.b.$ === 1) {
					var _v1 = _v0.a;
					var _v2 = _v0.b;
					return 1;
				} else {
					if (!_v0.b.a) {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						var _v5 = _v4.a;
						return 0;
					} else {
						var _v6 = _v0.a;
						var _v7 = _v0.b;
						var _v8 = _v7.a;
						return 2;
					}
				}
			} else {
				if (_v0.b.$ === 1) {
					if (!_v0.a.a) {
						var _v9 = _v0.a;
						var _v10 = _v9.a;
						var _v11 = _v0.b;
						return 2;
					} else {
						var _v12 = _v0.a;
						var _v13 = _v12.a;
						var _v14 = _v0.b;
						return 0;
					}
				} else {
					if (!_v0.a.a) {
						if (_v0.b.a === 1) {
							var _v15 = _v0.a;
							var _v16 = _v15.a;
							var _v17 = _v0.b;
							var _v18 = _v17.a;
							return 2;
						} else {
							break _v0$7;
						}
					} else {
						if (!_v0.b.a) {
							var _v19 = _v0.a;
							var _v20 = _v19.a;
							var _v21 = _v0.b;
							var _v22 = _v21.a;
							return 0;
						} else {
							break _v0$7;
						}
					}
				}
			}
		}
		var _v23 = _v0.a;
		var s1 = _v23.a;
		var m1 = _v23.b;
		var _v24 = _v0.b;
		var s2 = _v24.a;
		var m2 = _v24.b;
		var ord = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
		return ((s1 === 1) && (s2 === 1)) ? $chain_partners$elm_bignum$Integer$reverseOrder(ord) : ord;
	});
var $chain_partners$elm_bignum$Integer$abs = function (i) {
	if (i.$ === 1) {
		return $chain_partners$elm_bignum$Integer$Zero;
	} else {
		if (!i.a) {
			var _v1 = i.a;
			return i;
		} else {
			var _v2 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 0, m);
		}
	}
};
var $chain_partners$elm_bignum$Integer$negate = function (i) {
	if (i.$ === 1) {
		return $chain_partners$elm_bignum$Integer$Zero;
	} else {
		if (!i.a) {
			var _v1 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 1, m);
		} else {
			var _v2 = i.a;
			var m = i.b;
			return A2($chain_partners$elm_bignum$Integer$Integer, 0, m);
		}
	}
};
var $chain_partners$elm_bignum$Integer$adjustSign = F3(
	function (dividend, divisor, _v0) {
		var q = _v0.a;
		var r = _v0.b;
		var _v1 = _Utils_Tuple2(dividend, divisor);
		_v1$3:
		while (true) {
			if (!_v1.a.$) {
				if (!_v1.a.a) {
					if ((!_v1.b.$) && (_v1.b.a === 1)) {
						var _v2 = _v1.a;
						var _v3 = _v2.a;
						var _v4 = _v1.b;
						var _v5 = _v4.a;
						return _Utils_Tuple2(
							$chain_partners$elm_bignum$Integer$negate(q),
							r);
					} else {
						break _v1$3;
					}
				} else {
					if (!_v1.b.$) {
						if (!_v1.b.a) {
							var _v6 = _v1.a;
							var _v7 = _v6.a;
							var _v8 = _v1.b;
							var _v9 = _v8.a;
							return _Utils_Tuple2(
								$chain_partners$elm_bignum$Integer$negate(q),
								$chain_partners$elm_bignum$Integer$negate(r));
						} else {
							var _v10 = _v1.a;
							var _v11 = _v10.a;
							var _v12 = _v1.b;
							var _v13 = _v12.a;
							return _Utils_Tuple2(
								q,
								$chain_partners$elm_bignum$Integer$negate(r));
						}
					} else {
						break _v1$3;
					}
				}
			} else {
				break _v1$3;
			}
		}
		return _Utils_Tuple2(q, r);
	});
var $chain_partners$elm_bignum$Integer$addScaleToPartialProducts = function (magList) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (m, _v0) {
				var digit = _v0.a;
				var acc = _v0.b;
				return _Utils_Tuple2(
					digit + 1,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$core$List$append,
							A2($elm$core$List$repeat, digit, 0),
							m),
						acc));
			}),
		_Utils_Tuple2(0, _List_Nil),
		magList).b;
};
var $chain_partners$elm_bignum$Integer$calculatePartialProducts = F2(
	function (m1, m2) {
		return A2(
			$elm$core$List$map,
			function (d) {
				return A2(
					$elm$core$List$map,
					$elm$core$Basics$mul(d),
					m1);
			},
			m2);
	});
var $chain_partners$elm_bignum$Integer$sumPartialProducts = function (magList) {
	return A3($elm$core$List$foldl, $chain_partners$elm_bignum$Integer$addMagnitudes, _List_Nil, magList);
};
var $chain_partners$elm_bignum$Integer$multiplyMagnitudes = F2(
	function (m1, m2) {
		return $chain_partners$elm_bignum$Integer$normalizeMagnitude(
			$chain_partners$elm_bignum$Integer$sumPartialProducts(
				$chain_partners$elm_bignum$Integer$addScaleToPartialProducts(
					A2($chain_partners$elm_bignum$Integer$calculatePartialProducts, m1, m2))));
	});
var $chain_partners$elm_bignum$Integer$mul = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			return $chain_partners$elm_bignum$Integer$Zero;
		} else {
			if (_v0.b.$ === 1) {
				var _v2 = _v0.b;
				return $chain_partners$elm_bignum$Integer$Zero;
			} else {
				var _v3 = _v0.a;
				var s1 = _v3.a;
				var m1 = _v3.b;
				var _v4 = _v0.b;
				var s2 = _v4.a;
				var m2 = _v4.b;
				var sign = _Utils_eq(s1, s2) ? 0 : 1;
				var magnitude = function () {
					var _v5 = A2(
						$elm$core$Basics$compare,
						$elm$core$List$length(m1),
						$elm$core$List$length(m2));
					if (_v5 === 2) {
						return A2($chain_partners$elm_bignum$Integer$multiplyMagnitudes, m1, m2);
					} else {
						return A2($chain_partners$elm_bignum$Integer$multiplyMagnitudes, m2, m1);
					}
				}();
				return A2($chain_partners$elm_bignum$Integer$Integer, sign, magnitude);
			}
		}
	});
var $chain_partners$elm_bignum$Integer$one = A2(
	$chain_partners$elm_bignum$Integer$Integer,
	0,
	_List_fromArray(
		[1]));
var $chain_partners$elm_bignum$Integer$sub = F2(
	function (i1, i2) {
		var _v0 = _Utils_Tuple2(i1, i2);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			return $chain_partners$elm_bignum$Integer$negate(i2);
		} else {
			if (_v0.b.$ === 1) {
				var _v2 = _v0.b;
				return i1;
			} else {
				var _v3 = _v0.a;
				var s1 = _v3.a;
				var m1 = _v3.b;
				var _v4 = _v0.b;
				var s2 = _v4.a;
				var m2 = _v4.b;
				return A2(
					$chain_partners$elm_bignum$Integer$add,
					i1,
					$chain_partners$elm_bignum$Integer$negate(i2));
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmodPartialDividend = F4(
	function (dividend, divisor, divExpediter, acc) {
		divmodPartialDividend:
		while (true) {
			var _v0 = A2($chain_partners$elm_bignum$Integer$compare, dividend, divisor);
			switch (_v0) {
				case 0:
					return _Utils_Tuple2(acc, dividend);
				case 1:
					return _Utils_Tuple2(
						A2($chain_partners$elm_bignum$Integer$add, acc, $chain_partners$elm_bignum$Integer$one),
						$chain_partners$elm_bignum$Integer$Zero);
				default:
					var divisorTimesDivExpediter = A2(
						$chain_partners$elm_bignum$Integer$mul,
						divisor,
						$chain_partners$elm_bignum$Integer$fromInt(divExpediter));
					var _v1 = A2($chain_partners$elm_bignum$Integer$compare, dividend, divisorTimesDivExpediter);
					switch (_v1) {
						case 0:
							var $temp$dividend = dividend,
								$temp$divisor = divisor,
								$temp$divExpediter = (divExpediter / 2) | 0,
								$temp$acc = acc;
							dividend = $temp$dividend;
							divisor = $temp$divisor;
							divExpediter = $temp$divExpediter;
							acc = $temp$acc;
							continue divmodPartialDividend;
						case 1:
							return _Utils_Tuple2(
								A2(
									$chain_partners$elm_bignum$Integer$add,
									acc,
									$chain_partners$elm_bignum$Integer$fromInt(divExpediter)),
								$chain_partners$elm_bignum$Integer$Zero);
						default:
							var dividend_ = A2($chain_partners$elm_bignum$Integer$sub, dividend, divisorTimesDivExpediter);
							var $temp$dividend = dividend_,
								$temp$divisor = divisor,
								$temp$divExpediter = divExpediter,
								$temp$acc = A2(
								$chain_partners$elm_bignum$Integer$add,
								acc,
								$chain_partners$elm_bignum$Integer$fromInt(divExpediter));
							dividend = $temp$dividend;
							divisor = $temp$divisor;
							divExpediter = $temp$divExpediter;
							acc = $temp$acc;
							continue divmodPartialDividend;
					}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$headAndTail = function (i) {
	if (i.$ === 1) {
		return _Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero);
	} else {
		var s = i.a;
		var m = i.b;
		var rM = $elm$core$List$reverse(m);
		if (!rM.b) {
			return _Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero);
		} else {
			if (!rM.b.b) {
				var d = rM.a;
				return _Utils_Tuple2(
					$chain_partners$elm_bignum$Integer$fromInt(d),
					$chain_partners$elm_bignum$Integer$Zero);
			} else {
				var d = rM.a;
				var ds = rM.b;
				return _Utils_Tuple2(
					$chain_partners$elm_bignum$Integer$fromInt(d),
					A2(
						$chain_partners$elm_bignum$Integer$Integer,
						s,
						$elm$core$List$reverse(ds)));
			}
		}
	}
};
var $chain_partners$elm_bignum$Integer$shiftRightBy = F2(
	function (n, i) {
		shiftRightBy:
		while (true) {
			if (i.$ === 1) {
				return $chain_partners$elm_bignum$Integer$Zero;
			} else {
				var s = i.a;
				var m = i.b;
				if (n <= 0) {
					return i;
				} else {
					var $temp$n = n - 1,
						$temp$i = A2(
						$chain_partners$elm_bignum$Integer$Integer,
						s,
						A2($elm$core$List$cons, 0, m));
					n = $temp$n;
					i = $temp$i;
					continue shiftRightBy;
				}
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmod_ = F4(
	function (dividend, divisor, qAcc, prevR) {
		divmod_:
		while (true) {
			var _v0 = _Utils_Tuple2(dividend, divisor);
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(qAcc, prevR));
			} else {
				var _v2 = $chain_partners$elm_bignum$Integer$headAndTail(dividend);
				var firstDigit = _v2.a;
				var remainingDigits = _v2.b;
				var currentDividend = A2(
					$chain_partners$elm_bignum$Integer$add,
					firstDigit,
					A2($chain_partners$elm_bignum$Integer$shiftRightBy, 1, prevR));
				var _v3 = A4($chain_partners$elm_bignum$Integer$divmodPartialDividend, currentDividend, divisor, $chain_partners$elm_bignum$Integer$defaultBase, $chain_partners$elm_bignum$Integer$Zero);
				var q = _v3.a;
				var r = _v3.b;
				var qAcc_ = A2(
					$chain_partners$elm_bignum$Integer$add,
					q,
					A2($chain_partners$elm_bignum$Integer$shiftRightBy, 1, qAcc));
				var $temp$dividend = remainingDigits,
					$temp$divisor = divisor,
					$temp$qAcc = qAcc_,
					$temp$prevR = r;
				dividend = $temp$dividend;
				divisor = $temp$divisor;
				qAcc = $temp$qAcc;
				prevR = $temp$prevR;
				continue divmod_;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$divmod = F2(
	function (dividend, divisor) {
		var _v0 = _Utils_Tuple2(dividend, divisor);
		_v0$0:
		while (true) {
			_v0$4:
			while (true) {
				if (_v0.b.$ === 1) {
					if (_v0.a.$ === 1) {
						break _v0$0;
					} else {
						var _v2 = _v0.b;
						return $elm$core$Maybe$Nothing;
					}
				} else {
					if (_v0.a.$ === 1) {
						break _v0$0;
					} else {
						if (!_v0.b.a) {
							if ((_v0.b.b.b && (_v0.b.b.a === 1)) && (!_v0.b.b.b.b)) {
								var _v3 = _v0.b;
								var _v4 = _v3.a;
								var _v5 = _v3.b;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(dividend, $chain_partners$elm_bignum$Integer$Zero));
							} else {
								break _v0$4;
							}
						} else {
							if ((_v0.b.b.b && (_v0.b.b.a === 1)) && (!_v0.b.b.b.b)) {
								var _v6 = _v0.b;
								var _v7 = _v6.a;
								var _v8 = _v6.b;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										$chain_partners$elm_bignum$Integer$negate(dividend),
										$chain_partners$elm_bignum$Integer$Zero));
							} else {
								break _v0$4;
							}
						}
					}
				}
			}
			var _v9 = _v0.a;
			var s1 = _v9.a;
			var m1 = _v9.b;
			var _v10 = _v0.b;
			var s2 = _v10.a;
			var m2 = _v10.b;
			var _v11 = A2($chain_partners$elm_bignum$Integer$compareMag, m1, m2);
			switch (_v11) {
				case 0:
					return $elm$core$Maybe$Just(
						_Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, dividend));
				case 1:
					var sign = _Utils_eq(s1, s2) ? 0 : 1;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2(
								$chain_partners$elm_bignum$Integer$Integer,
								sign,
								_List_fromArray(
									[1])),
							$chain_partners$elm_bignum$Integer$Zero));
				default:
					return A2(
						$elm$core$Maybe$map,
						A2($chain_partners$elm_bignum$Integer$adjustSign, dividend, divisor),
						A4(
							$chain_partners$elm_bignum$Integer$divmod_,
							$chain_partners$elm_bignum$Integer$abs(dividend),
							$chain_partners$elm_bignum$Integer$abs(divisor),
							$chain_partners$elm_bignum$Integer$Zero,
							$chain_partners$elm_bignum$Integer$Zero));
			}
		}
		var _v1 = _v0.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$Zero, $chain_partners$elm_bignum$Integer$Zero));
	});
var $chain_partners$elm_bignum$Integer$eq = F2(
	function (i1, i2) {
		var _v0 = A2($chain_partners$elm_bignum$Integer$compare, i1, i2);
		if (_v0 === 1) {
			return true;
		} else {
			return false;
		}
	});
var $chain_partners$elm_bignum$Integer$lt = F2(
	function (i1, i2) {
		var _v0 = A2($chain_partners$elm_bignum$Integer$compare, i1, i2);
		if (!_v0) {
			return true;
		} else {
			return false;
		}
	});
var $chain_partners$elm_bignum$Decimal$roundAwayFromZero = F2(
	function (i1, i2) {
		var z = $chain_partners$elm_bignum$Integer$zero;
		var isPositive = _Utils_eq(
			A2($chain_partners$elm_bignum$Integer$lt, i1, z),
			A2($chain_partners$elm_bignum$Integer$lt, i2, z));
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$zero, $chain_partners$elm_bignum$Integer$zero),
			A2($chain_partners$elm_bignum$Integer$divmod, i1, i2));
		var q = _v0.a;
		var r = _v0.b;
		if (A2($chain_partners$elm_bignum$Integer$eq, r, z)) {
			return q;
		} else {
			var _v1 = A2($chain_partners$elm_bignum$Integer$compare, q, z);
			switch (_v1) {
				case 0:
					return A2(
						$chain_partners$elm_bignum$Integer$add,
						q,
						$chain_partners$elm_bignum$Integer$fromInt(-1));
				case 1:
					return isPositive ? A2($chain_partners$elm_bignum$Integer$add, q, $chain_partners$elm_bignum$Integer$one) : A2(
						$chain_partners$elm_bignum$Integer$add,
						q,
						$chain_partners$elm_bignum$Integer$fromInt(-1));
				default:
					return A2($chain_partners$elm_bignum$Integer$add, q, $chain_partners$elm_bignum$Integer$one);
			}
		}
	});
var $chain_partners$elm_bignum$Decimal$roundDown = F2(
	function (i1, i2) {
		var z = $chain_partners$elm_bignum$Integer$zero;
		var isPositive = _Utils_eq(
			A2($chain_partners$elm_bignum$Integer$lt, i1, z),
			A2($chain_partners$elm_bignum$Integer$lt, i2, z));
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$zero, $chain_partners$elm_bignum$Integer$zero),
			A2($chain_partners$elm_bignum$Integer$divmod, i1, i2));
		var q = _v0.a;
		var r = _v0.b;
		if (A2($chain_partners$elm_bignum$Integer$eq, r, z)) {
			return q;
		} else {
			var _v1 = A2($chain_partners$elm_bignum$Integer$compare, q, z);
			switch (_v1) {
				case 0:
					return A2(
						$chain_partners$elm_bignum$Integer$add,
						q,
						$chain_partners$elm_bignum$Integer$fromInt(-1));
				case 1:
					return isPositive ? q : A2(
						$chain_partners$elm_bignum$Integer$add,
						q,
						$chain_partners$elm_bignum$Integer$fromInt(-1));
				default:
					return q;
			}
		}
	});
var $chain_partners$elm_bignum$Integer$remainderBy = F2(
	function (dividend, divisor) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2($chain_partners$elm_bignum$Integer$divmod, dividend, divisor));
	});
var $chain_partners$elm_bignum$Decimal$roundHalfToEven = F2(
	function (i1, i2) {
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$zero, $chain_partners$elm_bignum$Integer$zero),
			A2($chain_partners$elm_bignum$Integer$divmod, i1, i2));
		var q = _v0.a;
		var r = _v0.b;
		var mod = function () {
			var _v1 = A2(
				$chain_partners$elm_bignum$Integer$compare,
				$chain_partners$elm_bignum$Integer$abs(
					A2(
						$chain_partners$elm_bignum$Integer$mul,
						$chain_partners$elm_bignum$Integer$fromInt(2),
						r)),
				$chain_partners$elm_bignum$Integer$abs(i2));
			switch (_v1) {
				case 0:
					return $chain_partners$elm_bignum$Integer$zero;
				case 1:
					if (!_Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							$chain_partners$elm_bignum$Integer$zero,
							A2(
								$chain_partners$elm_bignum$Integer$remainderBy,
								q,
								$chain_partners$elm_bignum$Integer$fromInt(2))),
						$chain_partners$elm_bignum$Integer$zero)) {
						var _v2 = A2($chain_partners$elm_bignum$Integer$compare, i1, $chain_partners$elm_bignum$Integer$zero);
						switch (_v2) {
							case 0:
								return $chain_partners$elm_bignum$Integer$fromInt(-1);
							case 1:
								return $chain_partners$elm_bignum$Integer$zero;
							default:
								return $chain_partners$elm_bignum$Integer$one;
						}
					} else {
						return $chain_partners$elm_bignum$Integer$zero;
					}
				default:
					var _v3 = A2($chain_partners$elm_bignum$Integer$compare, i1, $chain_partners$elm_bignum$Integer$zero);
					switch (_v3) {
						case 0:
							return $chain_partners$elm_bignum$Integer$fromInt(-1);
						case 1:
							return $chain_partners$elm_bignum$Integer$zero;
						default:
							return $chain_partners$elm_bignum$Integer$one;
					}
			}
		}();
		return A2($chain_partners$elm_bignum$Integer$add, q, mod);
	});
var $chain_partners$elm_bignum$Decimal$roundTowardsZero = F2(
	function (i1, i2) {
		return A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$zero, $chain_partners$elm_bignum$Integer$zero),
			A2($chain_partners$elm_bignum$Integer$divmod, i1, i2)).a;
	});
var $chain_partners$elm_bignum$Decimal$roundUp = F2(
	function (i1, i2) {
		var z = $chain_partners$elm_bignum$Integer$zero;
		var isPositive = _Utils_eq(
			A2($chain_partners$elm_bignum$Integer$lt, i1, z),
			A2($chain_partners$elm_bignum$Integer$lt, i2, z));
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($chain_partners$elm_bignum$Integer$zero, $chain_partners$elm_bignum$Integer$zero),
			A2($chain_partners$elm_bignum$Integer$divmod, i1, i2));
		var q = _v0.a;
		var r = _v0.b;
		if (A2($chain_partners$elm_bignum$Integer$eq, r, z)) {
			return q;
		} else {
			var _v1 = A2($chain_partners$elm_bignum$Integer$compare, q, z);
			switch (_v1) {
				case 0:
					return q;
				case 1:
					return isPositive ? A2($chain_partners$elm_bignum$Integer$add, q, $chain_partners$elm_bignum$Integer$one) : q;
				default:
					return A2($chain_partners$elm_bignum$Integer$add, q, $chain_partners$elm_bignum$Integer$one);
			}
		}
	});
var $chain_partners$elm_bignum$Decimal$divRound = F3(
	function (mode, i1, i2) {
		switch (mode) {
			case 0:
				return A2($chain_partners$elm_bignum$Decimal$roundDown, i1, i2);
			case 1:
				return A2($chain_partners$elm_bignum$Decimal$roundUp, i1, i2);
			case 2:
				return A2($chain_partners$elm_bignum$Decimal$roundTowardsZero, i1, i2);
			case 3:
				return A2($chain_partners$elm_bignum$Decimal$roundAwayFromZero, i1, i2);
			default:
				return A2($chain_partners$elm_bignum$Decimal$roundHalfToEven, i1, i2);
		}
	});
var $chain_partners$elm_bignum$Decimal$roundWithContext = F2(
	function (context, d) {
		if (d.$ === 1) {
			return $chain_partners$elm_bignum$Decimal$Zero;
		} else {
			var s = d.a;
			var e = d.b;
			if (_Utils_cmp(context.aj, e) < 1) {
				return d;
			} else {
				if (_Utils_cmp(
					context.aj,
					$chain_partners$elm_bignum$Integer$countDigits(s) + e) > 0) {
					return $chain_partners$elm_bignum$Decimal$Zero;
				} else {
					var eDiff = context.aj - e;
					var divisor = (eDiff < 11) ? $chain_partners$elm_bignum$Integer$fromInt(
						A2($elm$core$Basics$pow, 10, eDiff)) : A2(
						$elm$core$Maybe$withDefault,
						$chain_partners$elm_bignum$Integer$zero,
						$chain_partners$elm_bignum$Integer$fromString(
							'1' + A2($elm$core$String$repeat, eDiff, '0')));
					var s_ = A3($chain_partners$elm_bignum$Decimal$divRound, context.bx, s, divisor);
					return A2($chain_partners$elm_bignum$Integer$eq, s_, $chain_partners$elm_bignum$Integer$zero) ? $chain_partners$elm_bignum$Decimal$Zero : A2(
						$chain_partners$elm_bignum$Decimal$moveZeroesToE,
						A2($elm$core$Basics$min, context.aj, $chain_partners$elm_bignum$Decimal$minExponent),
						A2($chain_partners$elm_bignum$Decimal$Decimal, s_, context.aj));
				}
			}
		}
	});
var $chain_partners$elm_bignum$Decimal$roundTo = function (e_) {
	return $chain_partners$elm_bignum$Decimal$roundWithContext(
		{aj: e_, bx: 4});
};
var $chain_partners$elm_bignum$Decimal$Dec = 0;
var $chain_partners$elm_bignum$Integer$gte = F2(
	function (i1, i2) {
		var _v0 = A2($chain_partners$elm_bignum$Integer$compare, i1, i2);
		switch (_v0) {
			case 2:
				return true;
			case 1:
				return true;
			default:
				return false;
		}
	});
var $chain_partners$elm_bignum$Decimal$normalize = function (d) {
	if (d.$ === 1) {
		return _Utils_Tuple2($chain_partners$elm_bignum$Decimal$Zero, 0);
	} else {
		var s = d.a;
		var e = d.b;
		var coefficientE = -($chain_partners$elm_bignum$Integer$countDigits(s) - 1);
		return _Utils_Tuple2(
			A2($chain_partners$elm_bignum$Decimal$Decimal, s, coefficientE),
			e - coefficientE);
	}
};
var $chain_partners$elm_bignum$Decimal$toStringIn = F2(
	function (notation, d) {
		if (d.$ === 1) {
			return '0';
		} else {
			var s = d.a;
			var e = d.b;
			if (notation === 1) {
				var _v2 = $chain_partners$elm_bignum$Decimal$normalize(d);
				var co = _v2.a;
				var exp = _v2.b;
				var coString = $chain_partners$elm_bignum$Decimal$cyclic$toString()(co);
				var expString = 'e' + $elm$core$String$fromInt(exp);
				return _Utils_ap(coString, expString);
			} else {
				var sign = A2($chain_partners$elm_bignum$Integer$gte, s, $chain_partners$elm_bignum$Integer$zero) ? '' : '-';
				var sigString = $chain_partners$elm_bignum$Integer$toString(
					$chain_partners$elm_bignum$Integer$abs(s));
				var decString = function () {
					var _v3 = A2($elm$core$Basics$compare, e, 0);
					switch (_v3) {
						case 2:
							return _Utils_ap(
								sigString,
								A2($elm$core$String$repeat, e, '0'));
						case 1:
							return sigString;
						default:
							var _v4 = A2(
								$elm$core$Basics$compare,
								$elm$core$String$length(sigString),
								-e);
							switch (_v4) {
								case 2:
									return A2(
										$elm$core$String$join,
										'.',
										_List_fromArray(
											[
												A2($elm$core$String$dropRight, -e, sigString),
												A2($elm$core$String$right, -e, sigString)
											]));
								case 1:
									return '0.' + sigString;
								default:
									return '0.' + A3($elm$core$String$padLeft, -e, '0', sigString);
							}
					}
				}();
				return _Utils_ap(sign, decString);
			}
		}
	});
function $chain_partners$elm_bignum$Decimal$cyclic$toString() {
	return $chain_partners$elm_bignum$Decimal$toStringIn(0);
}
var $chain_partners$elm_bignum$Decimal$toString = $chain_partners$elm_bignum$Decimal$cyclic$toString();
$chain_partners$elm_bignum$Decimal$cyclic$toString = function () {
	return $chain_partners$elm_bignum$Decimal$toString;
};
var $author$project$Views$Format$formatFloat = F2(
	function (decimals, _float) {
		var simpleFmt = function (dc) {
			return A2(
				$elm$core$Basics$composeR,
				$cuducos$elm_format_number$FormatNumber$format(
					_Utils_update(
						$cuducos$elm_format_number$FormatNumber$Locales$frenchLocale,
						{
							h9: $cuducos$elm_format_number$FormatNumber$Locales$Exact(dc)
						})),
				A2($elm$core$String$replace, '−', '-'));
		};
		if ($elm$core$Basics$isNaN(_float)) {
			return 'N/A';
		} else {
			if ($elm$core$Basics$isInfinite(_float)) {
				return ((_float < 0) ? '-' : '') + '∞';
			} else {
				if (!_float) {
					return '0';
				} else {
					if (_Utils_eq(
						$elm$core$Basics$round(_float),
						_float)) {
						return A2(simpleFmt, 0, _float);
					} else {
						if ($elm$core$Basics$abs(_float) >= 100) {
							return A2(simpleFmt, 0, _float);
						} else {
							if ($elm$core$Basics$abs(_float) < 0.01) {
								var sci = A2(
									$chain_partners$elm_bignum$Decimal$toStringIn,
									1,
									A2(
										$chain_partners$elm_bignum$Decimal$roundTo,
										-12,
										$chain_partners$elm_bignum$Decimal$fromFloat(_float)));
								var formatFloatStr = A2(
									$elm$core$Basics$composeR,
									$elm$core$String$toFloat,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Maybe$withDefault(0),
										simpleFmt(2)));
								var _v0 = A2($elm$core$String$split, 'e', sci);
								if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
									var floatStr = _v0.a;
									var _v1 = _v0.b;
									var exp = _v1.a;
									return formatFloatStr(floatStr) + ('e' + exp);
								} else {
									return A2(simpleFmt, decimals, _float);
								}
							} else {
								return A2(simpleFmt, decimals, _float);
							}
						}
					}
				}
			}
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Data$Split$toPercent = function (_v0) {
	var _float = _v0;
	return _float;
};
var $author$project$Data$Textile$Inputs$getMaterialCategoryShare = function (origin) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filterMap(
			function (_v0) {
				var material = _v0.aa;
				var share = _v0.ac;
				return _Utils_eq(material.gD, origin) ? $elm$core$Maybe$Just(
					$author$project$Data$Split$toPercent(share)) : $elm$core$Maybe$Nothing;
			}),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$sum,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Data$Split$fromPercent,
				$elm$core$Result$withDefault($author$project$Data$Split$zero))));
};
var $author$project$Data$Textile$Inputs$getOutOfEuropeEOLProbability = function (materialInputs) {
	var syntheticMaterialsShare = A2($author$project$Data$Textile$Inputs$getMaterialCategoryShare, 3, materialInputs);
	return A2(
		$elm$core$Result$withDefault,
		$author$project$Data$Split$zero,
		$author$project$Data$Split$fromFloat(
			($author$project$Data$Split$toPercent(syntheticMaterialsShare) >= 50) ? 0.121 : 0.049));
};
var $author$project$Data$Textile$Inputs$getOutOfEuropeEOLComplement = function (_v0) {
	var mass = _v0.T;
	var materials = _v0.jc;
	return $author$project$Data$Unit$impact(
		-(($author$project$Data$Split$toFloat(
			$author$project$Data$Textile$Inputs$getOutOfEuropeEOLProbability(materials)) * $ianmackenzie$elm_units$Mass$inKilograms(mass)) * 5000));
};
var $author$project$Data$Textile$Material$Origin$toMicrofibersComplement = function (origin) {
	switch (origin) {
		case 0:
			return $author$project$Data$Unit$impact(-330);
		case 1:
			return $author$project$Data$Unit$impact(-390);
		case 2:
			return $author$project$Data$Unit$impact(-250);
		default:
			return $author$project$Data$Unit$impact(-820);
	}
};
var $author$project$Data$Textile$Inputs$getMaterialMicrofibersComplement = F2(
	function (finalProductMass, _v0) {
		var material = _v0.aa;
		var share = _v0.ac;
		var materialMassInKg = $ianmackenzie$elm_units$Mass$inKilograms(
			A2($author$project$Data$Split$applyToQuantity, finalProductMass, share));
		return A2(
			$ianmackenzie$elm_units$Quantity$multiplyBy,
			materialMassInKg,
			$author$project$Data$Textile$Material$Origin$toMicrofibersComplement(material.gD));
	});
var $author$project$Data$Textile$Inputs$getTotalMicrofibersComplement = function (_v0) {
	var mass = _v0.T;
	var materials = _v0.jc;
	return $ianmackenzie$elm_units$Quantity$sum(
		A2(
			$elm$core$List$map,
			$author$project$Data$Textile$Inputs$getMaterialMicrofibersComplement(mass),
			materials));
};
var $author$project$Data$Textile$Step$updateFromInputs = F3(
	function (_v0, inputs, step) {
		var wellKnown = _v0.kD;
		var label = step._;
		var country = step.fL;
		var complementsImpacts = step.h1;
		var _v1 = inputs;
		var dyeingProcessType = _v1.b7;
		var makingComplexity = _v1.i9;
		var makingDeadStock = _v1.cl;
		var makingWaste = _v1.cm;
		var printing = _v1.cp;
		var surfaceMass = _v1.e5;
		var yarnSize = _v1.kF;
		switch (label) {
			case 0:
				return _Utils_update(
					step,
					{
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								cO: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(wellKnown.cO))
							})
					});
			case 1:
				return _Utils_update(
					step,
					{
						h1: _Utils_update(
							complementsImpacts,
							{
								jD: $author$project$Data$Textile$Inputs$getOutOfEuropeEOLComplement(inputs)
							}),
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.fX)),
								cM: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.f6)),
								ix: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(wellKnown.ix)),
								jF: $elm$core$Maybe$Just('Transport en voiture vers point de collecte (1km)')
							})
					});
			case 2:
				return _Utils_update(
					step,
					{
						b7: dyeingProcessType,
						cp: printing,
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.fX)),
								cM: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.f6)),
								en: $elm$core$Maybe$Nothing,
								cp: A2(
									$elm$core$Maybe$map,
									function (_v3) {
										var kind = _v3.eF;
										return $author$project$Data$Process$getDisplayName(
											A2($author$project$Data$Textile$WellKnown$getPrintingProcess, kind, wellKnown).jL);
									},
									printing)
							})
					});
			case 3:
				return _Utils_update(
					step,
					{
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.fX)),
								f_: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(
										A2($author$project$Data$Textile$Fabric$getProcess, wellKnown, inputs.aC.f_)))
							}),
						e5: surfaceMass,
						kF: yarnSize
					});
			case 4:
				return _Utils_update(
					step,
					{
						i9: makingComplexity,
						cl: makingDeadStock,
						cm: makingWaste,
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.fX)),
								cb: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(wellKnown.cb))
							})
					});
			case 5:
				return _Utils_update(
					step,
					{
						h1: _Utils_update(
							complementsImpacts,
							{
								jf: $author$project$Data$Textile$Inputs$getTotalMicrofibersComplement(inputs)
							})
					});
			case 6:
				return _Utils_update(
					step,
					{
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(country.fX))
							}),
						kF: yarnSize
					});
			default:
				return _Utils_update(
					step,
					{
						ab: _Utils_update(
							$author$project$Data$Textile$Step$defaultProcessInfo,
							{
								aF: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(wellKnown.i8)),
								d2: $elm$core$Maybe$Just(
									function (x) {
										return 'Repassage\u00A0: ' + (x + '\u00A0kWh');
									}(
										A2(
											$author$project$Views$Format$formatFloat,
											4,
											$ianmackenzie$elm_units$Energy$inKilowattHours(inputs.aC.hu.iW)))),
								d3: $elm$core$Maybe$Just(
									$author$project$Data$Process$getDisplayName(inputs.aC.hu.jt))
							})
					});
		}
	});
var $author$project$Data$Textile$LifeCycle$init = F2(
	function (_v0, inputs) {
		var textile = _v0.kk;
		return $elm$core$Array$fromList(
			A2(
				$elm$core$List$map,
				A2($author$project$Data$Textile$Step$updateFromInputs, textile, inputs),
				A3(
					$elm$core$List$map2,
					F2(
						function (_v1, country) {
							var label = _v1.a;
							var editable = _v1.b;
							return $author$project$Data$Textile$Step$create(
								{
									fL: country,
									iu: editable,
									cP: !A2($elm$core$List$member, label, inputs.b6),
									_: label
								});
						}),
					_List_fromArray(
						[
							_Utils_Tuple2(5, false),
							_Utils_Tuple2(6, true),
							_Utils_Tuple2(3, true),
							_Utils_Tuple2(2, true),
							_Utils_Tuple2(4, true),
							_Utils_Tuple2(0, false),
							_Utils_Tuple2(7, false),
							_Utils_Tuple2(1, false)
						]),
					$author$project$Data$Textile$Inputs$countryList(inputs))));
	});
var $author$project$Data$Textile$Simulator$init = function (db) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Textile$Query$handleUpcycling,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Textile$Inputs$fromQuery(db),
			$elm$core$Result$map(
				function (inputs) {
					var product = inputs.aC;
					return function (lifeCycle) {
						return {
							h1: $author$project$Data$Impact$noComplementsImpacts,
							ek: inputs.aC.hu.ek,
							au: {
								gz: $author$project$Data$Unit$standardDurability($elm$core$Basics$identity),
								eT: A2(
									$elm$core$Maybe$withDefault,
									$author$project$Data$Unit$maxDurability($elm$core$Basics$identity),
									inputs.co)
							},
							z: $author$project$Data$Impact$empty,
							u: inputs,
							K: lifeCycle,
							c5: $author$project$Data$Transport$default($author$project$Data$Impact$empty),
							c7: $author$project$Data$Impact$empty,
							kz: $author$project$Data$Textile$Product$customDaysOfWear(product.hu)
						};
					}(
						A2($author$project$Data$Textile$LifeCycle$init, db, inputs));
				})));
};
var $author$project$Data$Textile$Step$Label$all = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7]);
var $author$project$Data$Textile$Simulator$initializeFinalMass = function (simulator) {
	var inputs = simulator.u;
	return A3(
		$author$project$Data$Textile$Simulator$updateLifeCycleSteps,
		$author$project$Data$Textile$Step$Label$all,
		$author$project$Data$Textile$Step$initMass(inputs.T),
		simulator);
};
var $author$project$Data$Textile$Simulator$compute = F2(
	function (db, query) {
		var next = function (fn) {
			return $elm$core$Result$map(fn);
		};
		var nextIf = F2(
			function (label, fn) {
				return (!A2($elm$core$List$member, label, query.b6)) ? next(fn) : $elm$core$Basics$identity;
			});
		var nextWithDb = function (fn) {
			return next(
				fn(db));
		};
		var nextWithDbIf = F2(
			function (label, fn) {
				return (!A2($elm$core$List$member, label, query.b6)) ? nextWithDb(fn) : $elm$core$Basics$identity;
			});
		var andNext = function (fn) {
			return $elm$core$Result$andThen(fn);
		};
		var andNextWithDb = function (fn) {
			return andNext(
				fn(db));
		};
		return A2(
			next,
			$author$project$Data$Textile$Simulator$computeFinalImpacts,
			A2(
				andNextWithDb,
				$author$project$Data$Textile$Simulator$computeTrims,
				A2(
					next,
					$author$project$Data$Textile$Simulator$computeTotalTransportImpacts,
					A2(
						nextWithDb,
						$author$project$Data$Textile$Simulator$computeStepsTransport,
						A3(
							nextWithDbIf,
							1,
							$author$project$Data$Textile$Simulator$computeEndOfLifeImpacts,
							A3(
								nextWithDbIf,
								7,
								$author$project$Data$Textile$Simulator$computeUseImpacts,
								A3(
									nextWithDbIf,
									4,
									$author$project$Data$Textile$Simulator$computeMakingImpacts,
									A3(
										nextWithDbIf,
										2,
										$author$project$Data$Textile$Simulator$computeFinishingImpacts,
										A3(
											nextWithDbIf,
											2,
											$author$project$Data$Textile$Simulator$computePrintingImpacts,
											A3(
												nextWithDbIf,
												2,
												$author$project$Data$Textile$Simulator$computeDyeingImpacts,
												A3(
													nextWithDbIf,
													3,
													$author$project$Data$Textile$Simulator$computeFabricImpacts,
													A3(
														nextIf,
														6,
														$author$project$Data$Textile$Simulator$computeSpinningImpacts,
														A3(
															nextIf,
															5,
															$author$project$Data$Textile$Simulator$computeMaterialImpacts(db),
															A2(
																nextWithDb,
																$author$project$Data$Textile$Simulator$handleTrimsWeight,
																A3(
																	nextIf,
																	4,
																	$author$project$Data$Textile$Simulator$computeMakingAirTransportRatio,
																	A2(
																		next,
																		$author$project$Data$Textile$Simulator$computeDurability,
																		A2(
																			next,
																			$author$project$Data$Textile$Simulator$computeMaterialStepWaste,
																			A3(
																				nextIf,
																				6,
																				$author$project$Data$Textile$Simulator$computeSpinningStepWaste,
																				A3(
																					nextWithDbIf,
																					3,
																					$author$project$Data$Textile$Simulator$computeFabricStepWaste,
																					A3(
																						nextIf,
																						4,
																						$author$project$Data$Textile$Simulator$computeMakingStepDeadStock,
																						A3(
																							nextIf,
																							4,
																							$author$project$Data$Textile$Simulator$computeMakingStepWaste,
																							A2(
																								next,
																								$author$project$Data$Textile$Simulator$initializeFinalMass,
																								A2($author$project$Data$Textile$Simulator$init, db, query)))))))))))))))))))))));
	});
var $author$project$Server$executeTextileQuery = F2(
	function (db, encoder) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Textile$Simulator$compute(db),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$mapError($author$project$Data$Validation$fromErrorString),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Result$map(encoder),
					$author$project$Server$toResponse)));
	});
var $author$project$Server$respondWith = $elm$core$Tuple$pair;
var $author$project$Data$Impact$Definition$toString = function (trigram) {
	switch (trigram) {
		case 0:
			return 'acd';
		case 1:
			return 'cch';
		case 2:
			return 'etf';
		case 3:
			return 'etf-c';
		case 4:
			return 'fru';
		case 5:
			return 'fwe';
		case 6:
			return 'htc';
		case 7:
			return 'htc-c';
		case 8:
			return 'htn';
		case 9:
			return 'htn-c';
		case 10:
			return 'ior';
		case 11:
			return 'ldu';
		case 12:
			return 'mru';
		case 13:
			return 'ozd';
		case 14:
			return 'pco';
		case 15:
			return 'pma';
		case 16:
			return 'swe';
		case 17:
			return 'tre';
		case 18:
			return 'wtu';
		case 19:
			return 'ecs';
		default:
			return 'pef';
	}
};
var $author$project$Data$Impact$Definition$encodeBase = F2(
	function (encoder, base) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (trigram) {
					return _Utils_Tuple2(
						$author$project$Data$Impact$Definition$toString(trigram),
						encoder(
							A2($author$project$Data$Impact$Definition$get, trigram, base)));
				},
				$author$project$Data$Impact$Definition$trigrams));
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Data$Unit$encodeImpact = A2($elm$core$Basics$composeR, $author$project$Data$Unit$impactToFloat, $elm$json$Json$Encode$float);
var $author$project$Data$Impact$encode = function (_v0) {
	var impacts = _v0;
	return A2($author$project$Data$Impact$Definition$encodeBase, $author$project$Data$Unit$encodeImpact, impacts);
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Data$Country$aquaticPollutionScenarioToString = function (scenario) {
	switch (scenario) {
		case 0:
			return 'Average';
		case 1:
			return 'Best';
		default:
			return 'Worst';
	}
};
var $author$project$Data$Scope$toString = function (scope) {
	switch (scope) {
		case 0:
			return 'food';
		case 1:
			return 'object';
		case 2:
			return 'textile';
		default:
			return 'veli';
	}
};
var $author$project$Data$Scope$encode = A2($elm$core$Basics$composeR, $author$project$Data$Scope$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Country$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'aquaticPollutionScenario',
				$elm$json$Json$Encode$string(
					$author$project$Data$Country$aquaticPollutionScenarioToString(v.ft))),
				_Utils_Tuple2(
				'code',
				$author$project$Data$Country$encodeCode(v.cK)),
				_Utils_Tuple2(
				'electricityProcessUuid',
				$elm$json$Json$Encode$string(
					$author$project$Data$Process$idToString(v.fX.H))),
				_Utils_Tuple2(
				'heatProcessUuid',
				$elm$json$Json$Encode$string(
					$author$project$Data$Process$idToString(v.f6.H))),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(v.L)),
				_Utils_Tuple2(
				'scopes',
				A2($elm$json$Json$Encode$list, $author$project$Data$Scope$encode, v.M))
			]));
};
var $author$project$Data$Textile$Dyeing$toString = function (processType) {
	switch (processType) {
		case 0:
			return 'average';
		case 1:
			return 'continuous';
		default:
			return 'discontinuous';
	}
};
var $author$project$Data$Textile$Dyeing$encode = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Dyeing$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Textile$Fabric$toString = function (fabricProcess) {
	switch (fabricProcess) {
		case 0:
			return 'knitting-circular';
		case 1:
			return 'knitting-fully-fashioned';
		case 2:
			return 'knitting-integral';
		case 3:
			return 'knitting-mix';
		case 4:
			return 'knitting-straight';
		default:
			return 'weaving';
	}
};
var $author$project$Data$Textile$Fabric$encode = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Fabric$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Split$encodeFloat = A2($elm$core$Basics$composeR, $author$project$Data$Split$toFloat, $elm$json$Json$Encode$float);
var $author$project$Data$Textile$Printing$toString = function (printing) {
	if (!printing) {
		return 'pigment';
	} else {
		return 'substantive';
	}
};
var $author$project$Data$Textile$Printing$encodeKind = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Printing$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Textile$Printing$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'kind',
				$author$project$Data$Textile$Printing$encodeKind(v.eF)),
				_Utils_Tuple2(
				'ratio',
				$author$project$Data$Split$encodeFloat(v.jR))
			]));
};
var $author$project$Data$Textile$Product$encodeEndOfLifeOptions = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'volume',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Volume$inCubicMeters(v.kB)))
			]));
};
var $NoRedInk$elm_uuid$Prng$Uuid$encode = A2($elm$core$Basics$composeR, $NoRedInk$elm_uuid$Prng$Uuid$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Uuid$encoder = $NoRedInk$elm_uuid$Prng$Uuid$encode;
var $author$project$Data$Process$encodeId = function (_v0) {
	var uuid = _v0;
	return $author$project$Data$Uuid$encoder(uuid);
};
var $author$project$Data$Component$encodeElement = function (element) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'amount',
				$elm$json$Json$Encode$float(
					$author$project$Data$Component$amountToFloat(element.aQ))),
				_Utils_Tuple2(
				'material',
				$author$project$Data$Process$encodeId(element.aa)),
				_Utils_Tuple2(
				'transforms',
				A2($elm$json$Json$Encode$list, $author$project$Data$Process$encodeId, element.at))
			]));
};
var $author$project$Data$Common$EncodeUtils$optionalPropertiesObject = A2(
	$elm$core$Basics$composeL,
	$elm$json$Json$Encode$object,
	$elm$core$List$filterMap(
		function (_v0) {
			var key = _v0.a;
			var maybeVal = _v0.b;
			return A2(
				$elm$core$Maybe$map,
				function (val) {
					return _Utils_Tuple2(key, val);
				},
				maybeVal);
		}));
var $elm$core$String$trim = _String_trim;
var $author$project$Data$Component$encodeCustom = function (custom) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				A2(
					$elm$core$Maybe$map,
					$elm$json$Json$Encode$string,
					A2(
						$elm$core$Maybe$andThen,
						function (name) {
							return (name === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(name);
						},
						A2($elm$core$Maybe$map, $elm$core$String$trim, custom.L)))),
				_Utils_Tuple2(
				'elements',
				$elm$core$Maybe$Just(
					A2($elm$json$Json$Encode$list, $author$project$Data$Component$encodeElement, custom.o)))
			]));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Data$Component$encodeItem = function (item) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$core$Maybe$Just(
					$elm$json$Json$Encode$string(
						$author$project$Data$Component$idToString(item.H)))),
				_Utils_Tuple2(
				'quantity',
				$elm$core$Maybe$Just(
					$elm$json$Json$Encode$int(
						$author$project$Data$Component$quantityToInt(item.bG)))),
				_Utils_Tuple2(
				'custom',
				A2($elm$core$Maybe$map, $author$project$Data$Component$encodeCustom, item.P))
			]));
};
var $author$project$Data$Textile$MakingComplexity$toString = function (makingComplexity) {
	switch (makingComplexity) {
		case 0:
			return 'high';
		case 1:
			return 'low';
		case 2:
			return 'medium';
		case 3:
			return 'non-applicable';
		case 4:
			return 'very-high';
		default:
			return 'very-low';
	}
};
var $author$project$Data$Textile$Product$encodeMakingOptions = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'pcrWaste',
				$author$project$Data$Split$encodeFloat(v.gG)),
				_Utils_Tuple2(
				'complexity',
				$elm$json$Json$Encode$string(
					$author$project$Data$Textile$MakingComplexity$toString(v.ef)))
			]));
};
var $ianmackenzie$elm_units$Duration$inHours = function (duration) {
	return $ianmackenzie$elm_units$Duration$inSeconds(duration) / $ianmackenzie$elm_units$Constants$hour;
};
var $author$project$Data$Textile$Product$encodeUseOptions = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'nonIroningProcessUuid',
				$author$project$Data$Process$encodeId(v.jt.H)),
				_Utils_Tuple2(
				'wearsPerCycle',
				$elm$json$Json$Encode$int(v.fn)),
				_Utils_Tuple2(
				'defaultNbCycles',
				$elm$json$Json$Encode$int(v.fQ)),
				_Utils_Tuple2(
				'ratioDryer',
				$author$project$Data$Split$encodeFloat(v.gS)),
				_Utils_Tuple2(
				'ratioIroning',
				$author$project$Data$Split$encodeFloat(v.gT)),
				_Utils_Tuple2(
				'timeIroning',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Duration$inHours(v.hl))),
				_Utils_Tuple2(
				'daysOfWear',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Duration$inDays(v.ek)))
			]));
};
var $author$project$Data$Textile$Product$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Textile$Product$encodeId(v.H)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(v.L)),
				_Utils_Tuple2(
				'fabric',
				$author$project$Data$Textile$Fabric$encode(v.f_)),
				_Utils_Tuple2(
				'making',
				$author$project$Data$Textile$Product$encodeMakingOptions(v.eI)),
				_Utils_Tuple2(
				'trims',
				A2($elm$json$Json$Encode$list, $author$project$Data$Component$encodeItem, v.kv)),
				_Utils_Tuple2(
				'use',
				$author$project$Data$Textile$Product$encodeUseOptions(v.hu)),
				_Utils_Tuple2(
				'endOfLife',
				$author$project$Data$Textile$Product$encodeEndOfLifeOptions(v.ix))
			]));
};
var $author$project$Data$Textile$Step$Label$toCodeString = function (label) {
	switch (label) {
		case 0:
			return 'distribution';
		case 1:
			return 'eol';
		case 2:
			return 'ennobling';
		case 3:
			return 'fabric';
		case 4:
			return 'making';
		case 5:
			return 'material';
		case 6:
			return 'spinning';
		default:
			return 'use';
	}
};
var $author$project$Data$Textile$Step$Label$encode = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Step$Label$toCodeString, $elm$json$Json$Encode$string);
var $author$project$Data$Textile$Economics$businessToString = function (business) {
	switch (business) {
		case 0:
			return 'large-business-with-services';
		case 1:
			return 'large-business-without-services';
		default:
			return 'small-business';
	}
};
var $author$project$Data$Textile$Economics$encodeBusiness = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Economics$businessToString, $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Data$Textile$Material$Origin$toString = function (origin) {
	switch (origin) {
		case 0:
			return 'ArtificialFromOrganic';
		case 1:
			return 'NaturalFromAnimal';
		case 2:
			return 'NaturalFromVegetal';
		default:
			return 'Synthetic';
	}
};
var $author$project$Data$Textile$Material$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Textile$Material$encodeId(v.H)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(v.L)),
				_Utils_Tuple2(
				'shortName',
				$elm$json$Json$Encode$string(v.ka)),
				_Utils_Tuple2(
				'origin',
				$elm$json$Json$Encode$string(
					$author$project$Data$Textile$Material$Origin$toString(v.gD))),
				_Utils_Tuple2(
				'materialProcessUuid',
				$author$project$Data$Process$encodeId(v.gq.H)),
				_Utils_Tuple2(
				'recycledProcessUuid',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.H;
							},
							$author$project$Data$Process$encodeId),
						v.jV))),
				_Utils_Tuple2(
				'recycledFrom',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Material$encodeId, v.eW))),
				_Utils_Tuple2(
				'geographicOrigin',
				$elm$json$Json$Encode$string(v.iI)),
				_Utils_Tuple2(
				'defaultCountry',
				$elm$json$Json$Encode$string(
					$author$project$Data$Country$codeToString(v.fO)))
			]));
};
var $author$project$Data$Textile$Material$Spinning$toString = function (spinning) {
	switch (spinning) {
		case 0:
			return 'ConventionalSpinning';
		case 1:
			return 'SyntheticSpinning';
		default:
			return 'UnconventionalSpinning';
	}
};
var $author$project$Data$Textile$Material$Spinning$encode = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Material$Spinning$toString, $elm$json$Json$Encode$string);
var $author$project$Data$Textile$Inputs$encodeMaterialInput = function (v) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'country',
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.cK;
						},
						$author$project$Data$Country$encodeCode),
					v.fL)),
				_Utils_Tuple2(
				'material',
				$elm$core$Maybe$Just(
					$author$project$Data$Textile$Material$encode(v.aa))),
				_Utils_Tuple2(
				'share',
				$elm$core$Maybe$Just(
					$author$project$Data$Split$encodeFloat(v.ac))),
				_Utils_Tuple2(
				'spinning',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Material$Spinning$encode, v.cu))
			]));
};
var $author$project$Data$Unit$encodePhysicalDurability = function (_v0) {
	var _float = _v0;
	return $elm$json$Json$Encode$float(_float);
};
var $author$project$Data$Textile$Economics$encodePrice = A2($elm$core$Basics$composeR, $author$project$Data$Textile$Economics$priceToFloat, $elm$json$Json$Encode$float);
var $author$project$Data$Unit$encodeSurfaceMass = function (surfaceMass) {
	return $elm$json$Json$Encode$int(
		$author$project$Data$Unit$surfaceMassInGramsPerSquareMeters(surfaceMass));
};
var $author$project$Data$Unit$encodeYarnSize = A2($elm$core$Basics$composeR, $author$project$Data$Unit$yarnSizeInKilometers, $elm$json$Json$Encode$float);
var $author$project$Data$Textile$Inputs$encode = function (inputs) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'airTransportRatio',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, inputs.bY))),
				_Utils_Tuple2(
				'business',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Economics$encodeBusiness, inputs.fC))),
				_Utils_Tuple2(
				'countryDyeing',
				$author$project$Data$Country$encode(inputs.aW)),
				_Utils_Tuple2(
				'countryFabric',
				$author$project$Data$Country$encode(inputs.bb)),
				_Utils_Tuple2(
				'countryMaking',
				$author$project$Data$Country$encode(inputs.bc)),
				_Utils_Tuple2(
				'disabledSteps',
				A2($elm$json$Json$Encode$list, $author$project$Data$Textile$Step$Label$encode, inputs.b6)),
				_Utils_Tuple2(
				'dyeingProcessType',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Dyeing$encode, inputs.b7))),
				_Utils_Tuple2(
				'fabricProcess',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Fabric$encode, inputs.bj))),
				_Utils_Tuple2(
				'fading',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$bool, inputs.cb))),
				_Utils_Tuple2(
				'makingComplexity',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						A2($elm$core$Basics$composeR, $author$project$Data$Textile$MakingComplexity$toString, $elm$json$Json$Encode$string),
						inputs.i9))),
				_Utils_Tuple2(
				'makingDeadStock',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, inputs.cl))),
				_Utils_Tuple2(
				'makingWaste',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, inputs.cm))),
				_Utils_Tuple2(
				'mass',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(inputs.T))),
				_Utils_Tuple2(
				'materials',
				A2($elm$json$Json$Encode$list, $author$project$Data$Textile$Inputs$encodeMaterialInput, inputs.jc)),
				_Utils_Tuple2(
				'numberOfReferences',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, inputs.gB))),
				_Utils_Tuple2(
				'physicalDurability',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodePhysicalDurability, inputs.co))),
				_Utils_Tuple2(
				'price',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Economics$encodePrice, inputs.gM))),
				_Utils_Tuple2(
				'printing',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Textile$Printing$encode, inputs.cp))),
				_Utils_Tuple2(
				'product',
				$author$project$Data$Textile$Product$encode(inputs.aC)),
				_Utils_Tuple2(
				'surfaceMass',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeSurfaceMass, inputs.e5))),
				_Utils_Tuple2(
				'trims',
				A2($elm$json$Json$Encode$list, $author$project$Data$Component$encodeItem, inputs.kv)),
				_Utils_Tuple2(
				'upcycled',
				$elm$json$Json$Encode$bool(inputs.cz)),
				_Utils_Tuple2(
				'yarnSize',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeYarnSize, inputs.kF)))
			]));
};
var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Array$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Data$Transport$encodeKm = A2($elm$core$Basics$composeR, $ianmackenzie$elm_units$Length$inKilometers, $elm$json$Json$Encode$float);
var $author$project$Data$Transport$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'air',
				$author$project$Data$Transport$encodeKm(v.hK)),
				_Utils_Tuple2(
				'impacts',
				$author$project$Data$Impact$encode(v.z)),
				_Utils_Tuple2(
				'road',
				$author$project$Data$Transport$encodeKm(v.dP)),
				_Utils_Tuple2(
				'roadCooled',
				$author$project$Data$Transport$encodeKm(v.j2)),
				_Utils_Tuple2(
				'sea',
				$author$project$Data$Transport$encodeKm(v.g4)),
				_Utils_Tuple2(
				'seaCooled',
				$author$project$Data$Transport$encodeKm(v.j7))
			]));
};
var $author$project$Data$Impact$negateComplementsImpacts = $author$project$Data$Impact$mapComplementsImpacts(
	A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Unit$impactToFloat,
		A2($elm$core$Basics$composeR, $elm$core$Basics$negate, $author$project$Data$Unit$impact)));
var $author$project$Data$Impact$encodeComplementsImpacts = function (complementsImpact) {
	var negated = $author$project$Data$Impact$negateComplementsImpacts(complementsImpact);
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'cropDiversity',
				$author$project$Data$Unit$encodeImpact(negated.dj)),
				_Utils_Tuple2(
				'hedges',
				$author$project$Data$Unit$encodeImpact(negated.du)),
				_Utils_Tuple2(
				'livestockDensity',
				$author$project$Data$Unit$encodeImpact(negated.dz)),
				_Utils_Tuple2(
				'microfibers',
				$author$project$Data$Unit$encodeImpact(negated.jf)),
				_Utils_Tuple2(
				'outOfEuropeEOL',
				$author$project$Data$Unit$encodeImpact(negated.jD)),
				_Utils_Tuple2(
				'permanentPasture',
				$author$project$Data$Unit$encodeImpact(negated.dG)),
				_Utils_Tuple2(
				'plotSize',
				$author$project$Data$Unit$encodeImpact(negated.dH))
			]));
};
var $author$project$Data$Unit$encodeNonPhysicalDurability = function (_v0) {
	var _float = _v0;
	return $elm$json$Json$Encode$float(_float);
};
var $author$project$Data$Unit$encodePickPerMeter = function (_v0) {
	var _int = _v0;
	return $elm$json$Json$Encode$int(_int);
};
var $author$project$Data$Textile$Step$encodePreTreatments = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'elecKWh',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Energy$inKilowattHours(v.ax))),
				_Utils_Tuple2(
				'heatMJ',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Energy$inMegajoules(v.ez))),
				_Utils_Tuple2(
				'energy',
				$author$project$Data$Impact$encode(v.b9)),
				_Utils_Tuple2(
				'impacts',
				$author$project$Data$Impact$encode(
					$author$project$Data$Impact$sumImpacts(
						_List_fromArray(
							[v.b9, v.kp])))),
				_Utils_Tuple2(
				'toxicity',
				$author$project$Data$Impact$encode(v.kp)),
				_Utils_Tuple2(
				'operations',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					A2($elm$core$List$map, $author$project$Data$Process$getDisplayName, v.bz)))
			]));
};
var $author$project$Data$Textile$Step$encodeProcessInfo = function (v) {
	var encodeMaybeString = A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map($elm$json$Json$Encode$string),
		$elm$core$Maybe$withDefault($elm$json$Json$Encode$null));
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'airTransport',
				encodeMaybeString(v.bX)),
				_Utils_Tuple2(
				'airTransportRatio',
				encodeMaybeString(v.bY)),
				_Utils_Tuple2(
				'countryElec',
				encodeMaybeString(v.aF)),
				_Utils_Tuple2(
				'countryHeat',
				encodeMaybeString(v.cM)),
				_Utils_Tuple2(
				'distribution',
				encodeMaybeString(v.cO)),
				_Utils_Tuple2(
				'endOfLife',
				encodeMaybeString(v.ix)),
				_Utils_Tuple2(
				'fabric',
				encodeMaybeString(v.f_)),
				_Utils_Tuple2(
				'fading',
				encodeMaybeString(v.cb)),
				_Utils_Tuple2(
				'making',
				encodeMaybeString(v.eI)),
				_Utils_Tuple2(
				'passengerCar',
				encodeMaybeString(v.jF)),
				_Utils_Tuple2(
				'roadTransport',
				encodeMaybeString(v.bI)),
				_Utils_Tuple2(
				'seaTransport',
				encodeMaybeString(v.cr)),
				_Utils_Tuple2(
				'useIroning',
				encodeMaybeString(v.d2)),
				_Utils_Tuple2(
				'useNonIroning',
				encodeMaybeString(v.d3))
			]));
};
var $author$project$Data$Unit$encodeThreadDensity = function (_v0) {
	var _float = _v0;
	return $elm$json$Json$Encode$float(_float);
};
var $author$project$Data$Textile$Step$Label$toString = function (label) {
	switch (label) {
		case 0:
			return 'Distribution';
		case 1:
			return 'Fin de vie';
		case 2:
			return 'Ennoblissement';
		case 3:
			return 'Tissage & Tricotage';
		case 4:
			return 'Confection';
		case 5:
			return 'Matières premières';
		case 6:
			return 'Filature';
		default:
			return 'Utilisation';
	}
};
var $author$project$Data$Textile$Step$encode = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'airTransportRatio',
				$author$project$Data$Split$encodeFloat(v.bY)),
				_Utils_Tuple2(
				'complementsImpacts',
				$author$project$Data$Impact$encodeComplementsImpacts(v.h1)),
				_Utils_Tuple2(
				'country',
				$author$project$Data$Country$encode(v.fL)),
				_Utils_Tuple2(
				'deadstock',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(v.h8))),
				_Utils_Tuple2(
				'durability',
				$author$project$Data$Unit$encodeNonPhysicalDurability(v.au)),
				_Utils_Tuple2(
				'editable',
				$elm$json$Json$Encode$bool(v.iu)),
				_Utils_Tuple2(
				'elecKWh',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Energy$inKilowattHours(v.ax))),
				_Utils_Tuple2(
				'enabled',
				$elm$json$Json$Encode$bool(v.cP)),
				_Utils_Tuple2(
				'heatMJ',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Energy$inMegajoules(v.ez))),
				_Utils_Tuple2(
				'impacts',
				$author$project$Data$Impact$encode(
					A2(
						$author$project$Data$Impact$applyComplements,
						$author$project$Data$Impact$getTotalComplementsImpacts(v.h1),
						v.z))),
				_Utils_Tuple2(
				'inputMass',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(v.cg))),
				_Utils_Tuple2(
				'label',
				$elm$json$Json$Encode$string(
					$author$project$Data$Textile$Step$Label$toString(v._))),
				_Utils_Tuple2(
				'makingDeadStock',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, v.cl))),
				_Utils_Tuple2(
				'makingWaste',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, v.cm))),
				_Utils_Tuple2(
				'outputMass',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(v.jE))),
				_Utils_Tuple2(
				'picking',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodePickPerMeter, v.gH))),
				_Utils_Tuple2(
				'preTreatments',
				$author$project$Data$Textile$Step$encodePreTreatments(v.jK)),
				_Utils_Tuple2(
				'processInfo',
				$author$project$Data$Textile$Step$encodeProcessInfo(v.ab)),
				_Utils_Tuple2(
				'surfaceMass',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeSurfaceMass, v.e5))),
				_Utils_Tuple2(
				'threadDensity',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeThreadDensity, v.hk))),
				_Utils_Tuple2(
				'transport',
				$author$project$Data$Transport$encode(v.c5)),
				_Utils_Tuple2(
				'waste',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(v.hz))),
				_Utils_Tuple2(
				'yarnSize',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeYarnSize, v.kF)))
			]));
};
var $author$project$Data$Textile$LifeCycle$encode = $elm$json$Json$Encode$array($author$project$Data$Textile$Step$encode);
var $author$project$Data$Textile$Simulator$getTotalImpactsWithoutDurability = function (_v0) {
	var lifeCycle = _v0.K;
	var trimsImpacts = _v0.c7;
	var complementsImpactsWithoutDurability = $author$project$Data$Textile$LifeCycle$sumComplementsImpacts(
		A2(
			$elm$core$Array$filter,
			function ($) {
				return $.cP;
			},
			lifeCycle));
	return $author$project$Data$Impact$sumImpacts(
		_List_fromArray(
			[
				A2(
				$author$project$Data$Impact$impactsWithComplements,
				complementsImpactsWithoutDurability,
				$author$project$Data$Textile$LifeCycle$computeFinalImpacts(lifeCycle)),
				trimsImpacts
			]));
};
var $author$project$Route$TextileSimulator = F2(
	function (a, b) {
		return {$: 15, a: a, b: b};
	});
var $author$project$Data$Impact$default = 19;
var $author$project$Data$Textile$Inputs$toQueryCountryCode = function (c) {
	return _Utils_eq(c, $author$project$Data$Country$unknownCountryCode) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(c);
};
var $author$project$Data$Textile$Inputs$toMaterialQuery = $elm$core$List$map(
	function (_v0) {
		var country = _v0.fL;
		var material = _v0.aa;
		var share = _v0.ac;
		var spinning = _v0.cu;
		return {
			fL: A2(
				$elm$core$Maybe$andThen,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.cK;
					},
					$author$project$Data$Textile$Inputs$toQueryCountryCode),
				country),
			H: material.H,
			ac: share,
			cu: spinning
		};
	});
var $author$project$Data$Textile$Inputs$toQuery = function (inputs) {
	return {
		bY: inputs.bY,
		fC: inputs.fC,
		aW: $author$project$Data$Textile$Inputs$toQueryCountryCode(inputs.aW.cK),
		bb: $author$project$Data$Textile$Inputs$toQueryCountryCode(inputs.bb.cK),
		bc: $author$project$Data$Textile$Inputs$toQueryCountryCode(inputs.bc.cK),
		b4: $author$project$Data$Textile$Inputs$toQueryCountryCode(inputs.b4.cK),
		b6: inputs.b6,
		b7: inputs.b7,
		bj: inputs.bj,
		cb: inputs.cb,
		i9: inputs.i9,
		cl: inputs.cl,
		cm: inputs.cm,
		T: inputs.T,
		jc: $author$project$Data$Textile$Inputs$toMaterialQuery(inputs.jc),
		gB: inputs.gB,
		co: inputs.co,
		gM: inputs.gM,
		cp: inputs.cp,
		aC: inputs.aC.H,
		e5: inputs.e5,
		kv: _Utils_eq(inputs.kv, inputs.aC.kv) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(inputs.kv),
		cz: inputs.cz,
		kF: inputs.kF
	};
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $truqu$elm_base64$Base64$Encode$intToBase64 = function (i) {
	switch (i) {
		case 0:
			return 'A';
		case 1:
			return 'B';
		case 2:
			return 'C';
		case 3:
			return 'D';
		case 4:
			return 'E';
		case 5:
			return 'F';
		case 6:
			return 'G';
		case 7:
			return 'H';
		case 8:
			return 'I';
		case 9:
			return 'J';
		case 10:
			return 'K';
		case 11:
			return 'L';
		case 12:
			return 'M';
		case 13:
			return 'N';
		case 14:
			return 'O';
		case 15:
			return 'P';
		case 16:
			return 'Q';
		case 17:
			return 'R';
		case 18:
			return 'S';
		case 19:
			return 'T';
		case 20:
			return 'U';
		case 21:
			return 'V';
		case 22:
			return 'W';
		case 23:
			return 'X';
		case 24:
			return 'Y';
		case 25:
			return 'Z';
		case 26:
			return 'a';
		case 27:
			return 'b';
		case 28:
			return 'c';
		case 29:
			return 'd';
		case 30:
			return 'e';
		case 31:
			return 'f';
		case 32:
			return 'g';
		case 33:
			return 'h';
		case 34:
			return 'i';
		case 35:
			return 'j';
		case 36:
			return 'k';
		case 37:
			return 'l';
		case 38:
			return 'm';
		case 39:
			return 'n';
		case 40:
			return 'o';
		case 41:
			return 'p';
		case 42:
			return 'q';
		case 43:
			return 'r';
		case 44:
			return 's';
		case 45:
			return 't';
		case 46:
			return 'u';
		case 47:
			return 'v';
		case 48:
			return 'w';
		case 49:
			return 'x';
		case 50:
			return 'y';
		case 51:
			return 'z';
		case 52:
			return '0';
		case 53:
			return '1';
		case 54:
			return '2';
		case 55:
			return '3';
		case 56:
			return '4';
		case 57:
			return '5';
		case 58:
			return '6';
		case 59:
			return '7';
		case 60:
			return '8';
		case 61:
			return '9';
		case 62:
			return '+';
		default:
			return '/';
	}
};
var $truqu$elm_base64$Base64$Encode$toBase64 = function (_int) {
	return _Utils_ap(
		$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 18)),
		_Utils_ap(
			$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 12)),
			_Utils_ap(
				$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 6)),
				$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 0)))));
};
var $truqu$elm_base64$Base64$Encode$add = F2(
	function (_char, _v0) {
		var res = _v0.a;
		var count = _v0.b;
		var acc = _v0.c;
		var current = (acc << 8) | _char;
		if (count === 2) {
			return _Utils_Tuple3(
				_Utils_ap(
					res,
					$truqu$elm_base64$Base64$Encode$toBase64(current)),
				0,
				0);
		} else {
			return _Utils_Tuple3(res, count + 1, current);
		}
	});
var $truqu$elm_base64$Base64$Encode$chomp = F2(
	function (char_, acc) {
		var _char = $elm$core$Char$toCode(char_);
		return (_char < 128) ? A2($truqu$elm_base64$Base64$Encode$add, _char, acc) : ((_char < 2048) ? A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2($truqu$elm_base64$Base64$Encode$add, 192 | (_char >>> 6), acc)) : (((_char < 55296) || ((_char >= 57344) && (_char <= 65535))) ? A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2(
				$truqu$elm_base64$Base64$Encode$add,
				128 | (63 & (_char >>> 6)),
				A2($truqu$elm_base64$Base64$Encode$add, 224 | (_char >>> 12), acc))) : A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2(
				$truqu$elm_base64$Base64$Encode$add,
				128 | (63 & (_char >>> 6)),
				A2(
					$truqu$elm_base64$Base64$Encode$add,
					128 | (63 & (_char >>> 12)),
					A2($truqu$elm_base64$Base64$Encode$add, 240 | (_char >>> 18), acc))))));
	});
var $elm$core$String$foldl = _String_foldl;
var $truqu$elm_base64$Base64$Encode$initial = _Utils_Tuple3('', 0, 0);
var $truqu$elm_base64$Base64$Encode$wrapUp = function (_v0) {
	var res = _v0.a;
	var cnt = _v0.b;
	var acc = _v0.c;
	switch (cnt) {
		case 1:
			return res + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 2)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc << 4)) + '=='));
		case 2:
			return res + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 10)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 4)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc << 2)) + '=')));
		default:
			return res;
	}
};
var $truqu$elm_base64$Base64$Encode$encode = function (input) {
	return $truqu$elm_base64$Base64$Encode$wrapUp(
		A3($elm$core$String$foldl, $truqu$elm_base64$Base64$Encode$chomp, $truqu$elm_base64$Base64$Encode$initial, input));
};
var $truqu$elm_base64$Base64$encode = $truqu$elm_base64$Base64$Encode$encode;
var $author$project$Data$Food$Retail$toString = function (_v0) {
	var type_ = _v0.a;
	switch (type_) {
		case 0:
			return 'ambient';
		case 1:
			return 'fresh';
		default:
			return 'frozen';
	}
};
var $author$project$Data$Food$Retail$encode = A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Data$Food$Retail$toString);
var $author$project$Data$Food$Preparation$encodeId = function (_v0) {
	var id = _v0;
	return $elm$json$Json$Encode$string(id);
};
var $author$project$Data$Food$Ingredient$encodeId = function (_v0) {
	var uuid = _v0;
	return $author$project$Data$Uuid$encoder(uuid);
};
var $author$project$Data$Food$Query$encodeMassAsGrams = A2($elm$core$Basics$composeR, $ianmackenzie$elm_units$Mass$inGrams, $elm$json$Json$Encode$float);
var $author$project$Data$Food$Ingredient$encodePlaneTransport = function (planeTransport) {
	switch (planeTransport) {
		case 0:
			return $elm$core$Maybe$Just(
				$elm$json$Json$Encode$string('byPlane'));
		case 1:
			return $elm$core$Maybe$Just(
				$elm$json$Json$Encode$string('noPlane'));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Data$Food$Query$encodeIngredient = function (v) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$core$Maybe$Just(
					$author$project$Data$Food$Ingredient$encodeId(v.H))),
				_Utils_Tuple2(
				'mass',
				$elm$core$Maybe$Just(
					$author$project$Data$Food$Query$encodeMassAsGrams(v.T))),
				_Utils_Tuple2(
				'country',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, v.fL)),
				_Utils_Tuple2(
				'byPlane',
				$author$project$Data$Food$Ingredient$encodePlaneTransport(v.gJ))
			]));
};
var $author$project$Data$Food$Query$encodeProcess = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$author$project$Data$Process$encodeId(v.H)),
				_Utils_Tuple2(
				'mass',
				$author$project$Data$Food$Query$encodeMassAsGrams(v.T))
			]));
};
var $author$project$Data$Food$Query$encode = function (v) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ingredients',
				$elm$core$Maybe$Just(
					A2($elm$json$Json$Encode$list, $author$project$Data$Food$Query$encodeIngredient, v.iR))),
				_Utils_Tuple2(
				'transform',
				A2($elm$core$Maybe$map, $author$project$Data$Food$Query$encodeProcess, v.bQ)),
				_Utils_Tuple2(
				'packaging',
				function () {
					var _v0 = v.bB;
					if (!_v0.b) {
						return $elm$core$Maybe$Nothing;
					} else {
						var list = _v0;
						return $elm$core$Maybe$Just(
							A2($elm$json$Json$Encode$list, $author$project$Data$Food$Query$encodeProcess, list));
					}
				}()),
				_Utils_Tuple2(
				'distribution',
				A2($elm$core$Maybe$map, $author$project$Data$Food$Retail$encode, v.cO)),
				_Utils_Tuple2(
				'preparation',
				function () {
					var _v1 = v.aL;
					if (!_v1.b) {
						return $elm$core$Maybe$Nothing;
					} else {
						var list = _v1;
						return $elm$core$Maybe$Just(
							A2($elm$json$Json$Encode$list, $author$project$Data$Food$Preparation$encodeId, list));
					}
				}())
			]));
};
var $author$project$Data$Food$Query$b64encode = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Food$Query$encode,
	A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Encode$encode(0),
		$truqu$elm_base64$Base64$encode));
var $author$project$Data$Object$Query$encode = function (query) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'components',
				A2($elm$json$Json$Encode$list, $author$project$Data$Component$encodeItem, query.di))
			]));
};
var $author$project$Data$Object$Query$b64encode = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Object$Query$encode,
	A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Encode$encode(0),
		$truqu$elm_base64$Base64$encode));
var $author$project$Data$Textile$Query$encodeMaterialQuery = function (v) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'country',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, v.fL)),
				_Utils_Tuple2(
				'id',
				$elm$core$Maybe$Just(
					$author$project$Data$Textile$Material$encodeId(v.H))),
				_Utils_Tuple2(
				'share',
				$elm$core$Maybe$Just(
					$author$project$Data$Split$encodeFloat(v.ac))),
				_Utils_Tuple2(
				'spinning',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Material$Spinning$encode, v.cu))
			]));
};
var $author$project$Data$Textile$Query$encode = function (query) {
	return $author$project$Data$Common$EncodeUtils$optionalPropertiesObject(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'airTransportRatio',
				A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, query.bY)),
				_Utils_Tuple2(
				'business',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Economics$encodeBusiness, query.fC)),
				_Utils_Tuple2(
				'countryDyeing',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, query.aW)),
				_Utils_Tuple2(
				'countryFabric',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, query.bb)),
				_Utils_Tuple2(
				'countryMaking',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, query.bc)),
				_Utils_Tuple2(
				'countrySpinning',
				A2($elm$core$Maybe$map, $author$project$Data$Country$encodeCode, query.b4)),
				_Utils_Tuple2(
				'disabledSteps',
				function () {
					var _v0 = query.b6;
					if (!_v0.b) {
						return $elm$core$Maybe$Nothing;
					} else {
						var list = _v0;
						return $elm$core$Maybe$Just(
							A2($elm$json$Json$Encode$list, $author$project$Data$Textile$Step$Label$encode, list));
					}
				}()),
				_Utils_Tuple2(
				'dyeingProcessType',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Dyeing$encode, query.b7)),
				_Utils_Tuple2(
				'fabricProcess',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Fabric$encode, query.bj)),
				_Utils_Tuple2(
				'fading',
				A2($elm$core$Maybe$map, $elm$json$Json$Encode$bool, query.cb)),
				_Utils_Tuple2(
				'makingComplexity',
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeR, $author$project$Data$Textile$MakingComplexity$toString, $elm$json$Json$Encode$string),
					query.i9)),
				_Utils_Tuple2(
				'makingDeadStock',
				A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, query.cl)),
				_Utils_Tuple2(
				'makingWaste',
				A2($elm$core$Maybe$map, $author$project$Data$Split$encodeFloat, query.cm)),
				_Utils_Tuple2(
				'mass',
				$elm$core$Maybe$Just(
					$elm$json$Json$Encode$float(
						$ianmackenzie$elm_units$Mass$inKilograms(query.T)))),
				_Utils_Tuple2(
				'materials',
				$elm$core$Maybe$Just(
					A2($elm$json$Json$Encode$list, $author$project$Data$Textile$Query$encodeMaterialQuery, query.jc))),
				_Utils_Tuple2(
				'numberOfReferences',
				A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, query.gB)),
				_Utils_Tuple2(
				'physicalDurability',
				A2($elm$core$Maybe$map, $author$project$Data$Unit$encodePhysicalDurability, query.co)),
				_Utils_Tuple2(
				'price',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Economics$encodePrice, query.gM)),
				_Utils_Tuple2(
				'printing',
				A2($elm$core$Maybe$map, $author$project$Data$Textile$Printing$encode, query.cp)),
				_Utils_Tuple2(
				'product',
				$elm$core$Maybe$Just(
					$elm$json$Json$Encode$string(
						$author$project$Data$Textile$Product$idToString(query.aC)))),
				_Utils_Tuple2(
				'surfaceMass',
				A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeSurfaceMass, query.e5)),
				_Utils_Tuple2(
				'trims',
				A2(
					$elm$core$Maybe$map,
					$elm$json$Json$Encode$list($author$project$Data$Component$encodeItem),
					query.kv)),
				_Utils_Tuple2(
				'upcycled',
				$elm$core$Maybe$Just(
					$elm$json$Json$Encode$bool(query.cz))),
				_Utils_Tuple2(
				'yarnSize',
				A2($elm$core$Maybe$map, $author$project$Data$Unit$encodeYarnSize, query.kF))
			]));
};
var $author$project$Data$Textile$Query$b64encode = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Textile$Query$encode,
	A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Encode$encode(0),
		$truqu$elm_base64$Base64$encode));
var $author$project$Data$Dataset$strings = function (dataset) {
	switch (dataset.$) {
		case 0:
			var scope = dataset.a;
			return {
				_: 'Composants',
				ad: $author$project$Data$Scope$toString(scope) + '-components'
			};
		case 1:
			return {_: 'Pays', ad: 'countries'};
		case 2:
			return {_: 'Exemples', ad: 'food-examples'};
		case 3:
			return {_: 'Ingrédients', ad: 'ingredients'};
		case 4:
			return {_: 'Impacts', ad: 'impacts'};
		case 5:
			return {_: 'Exemples', ad: 'object-examples'};
		case 6:
			var scope = dataset.a;
			return {
				_: 'Procédés',
				ad: $author$project$Data$Scope$toString(scope) + '-processes'
			};
		case 7:
			return {_: 'Exemples', ad: 'textile-examples'};
		case 8:
			return {_: 'Matières', ad: 'materials'};
		case 9:
			return {_: 'Produits', ad: 'products'};
		default:
			return {_: 'Exemples', ad: 'veli-examples'};
	}
};
var $author$project$Data$Dataset$slug = A2(
	$elm$core$Basics$composeR,
	$author$project$Data$Dataset$strings,
	function ($) {
		return $.ad;
	});
var $author$project$Data$Dataset$toRoutePath = function (dataset) {
	switch (dataset.$) {
		case 0:
			if (!dataset.b.$) {
				var id = dataset.b.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Component$idToString(id)
					]);
			} else {
				var _v1 = dataset.b;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 1:
			if (!dataset.a.$) {
				var code = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Country$codeToString(code)
					]);
			} else {
				var _v2 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 2:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Uuid$toString(id)
					]);
			} else {
				var _v3 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 3:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Food$Ingredient$idToString(id)
					]);
			} else {
				var _v4 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 4:
			if (!dataset.a.$) {
				var trigram = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Impact$Definition$toString(trigram)
					]);
			} else {
				var _v5 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 5:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Uuid$toString(id)
					]);
			} else {
				var _v6 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 6:
			if (!dataset.b.$) {
				var id = dataset.b.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Process$idToString(id)
					]);
			} else {
				var _v7 = dataset.b;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 7:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Uuid$toString(id)
					]);
			} else {
				var _v8 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 8:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Textile$Material$idToString(id)
					]);
			} else {
				var _v9 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		case 9:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Textile$Product$idToString(id)
					]);
			} else {
				var _v10 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
		default:
			if (!dataset.a.$) {
				var id = dataset.a.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset),
						$author$project$Data$Uuid$toString(id)
					]);
			} else {
				var _v11 = dataset.a;
				return _List_fromArray(
					[
						$author$project$Data$Dataset$slug(dataset)
					]);
			}
	}
};
var $author$project$Page$Admin$Section$toSlug = function (section) {
	switch (section) {
		case 0:
			return 'accounts';
		case 1:
			return 'components';
		default:
			return 'processes';
	}
};
var $author$project$Route$toString = function (route) {
	var pieces = function () {
		_v0$8:
		while (true) {
			switch (route.$) {
				case 0:
					var section = route.a;
					return _List_fromArray(
						[
							'admin',
							$author$project$Page$Admin$Section$toSlug(section)
						]);
				case 1:
					return _List_fromArray(
						['api']);
				case 2:
					return _List_fromArray(
						['auth']);
				case 3:
					var email = route.a;
					var token = route.b;
					return _List_fromArray(
						['auth', email, token]);
				case 4:
					return _List_fromArray(
						['auth', 'signup']);
				case 5:
					var slug = route.a;
					return _List_fromArray(
						['pages', slug]);
				case 6:
					switch (route.a) {
						case 0:
							if ((route.b.$ === 2) && (route.b.a.$ === 1)) {
								var _v1 = route.a;
								var _v2 = route.b.a;
								return _List_fromArray(
									['explore', 'food']);
							} else {
								break _v0$8;
							}
						case 2:
							if ((route.b.$ === 7) && (route.b.a.$ === 1)) {
								var _v3 = route.a;
								var _v4 = route.b.a;
								return _List_fromArray(
									['explore', 'textile']);
							} else {
								break _v0$8;
							}
						default:
							break _v0$8;
					}
				case 7:
					if (route.b.$ === 1) {
						var trigram = route.a;
						var _v5 = route.b;
						return _List_fromArray(
							[
								'food',
								$author$project$Data$Impact$Definition$toString(trigram)
							]);
					} else {
						var trigram = route.a;
						var query = route.b.a;
						return _List_fromArray(
							[
								'food',
								$author$project$Data$Impact$Definition$toString(trigram),
								$author$project$Data$Food$Query$b64encode(query)
							]);
					}
				case 8:
					var uuid = route.a;
					return _List_fromArray(
						[
							'food',
							'edit-example',
							$author$project$Data$Uuid$toString(uuid)
						]);
				case 9:
					return _List_fromArray(
						['food']);
				case 10:
					return _List_Nil;
				case 11:
					if (!route.c.$) {
						var scope = route.a;
						var trigram = route.b;
						var query = route.c.a;
						return _List_fromArray(
							[
								$author$project$Data$Scope$toString(scope),
								'simulator',
								$author$project$Data$Impact$Definition$toString(trigram),
								$author$project$Data$Object$Query$b64encode(query)
							]);
					} else {
						var scope = route.a;
						var trigram = route.b;
						var _v6 = route.c;
						return _List_fromArray(
							[
								$author$project$Data$Scope$toString(scope),
								'simulator',
								$author$project$Data$Impact$Definition$toString(trigram)
							]);
					}
				case 12:
					var scope = route.a;
					var uuid = route.b;
					return _List_fromArray(
						[
							$author$project$Data$Scope$toString(scope),
							'edit-example',
							$author$project$Data$Uuid$toString(uuid)
						]);
				case 13:
					var scope = route.a;
					return _List_fromArray(
						[
							$author$project$Data$Scope$toString(scope),
							'simulator'
						]);
				case 14:
					return _List_fromArray(
						['stats']);
				case 15:
					if (!route.b.$) {
						var trigram = route.a;
						var query = route.b.a;
						return _List_fromArray(
							[
								'textile',
								'simulator',
								$author$project$Data$Impact$Definition$toString(trigram),
								$author$project$Data$Textile$Query$b64encode(query)
							]);
					} else {
						var trigram = route.a;
						var _v7 = route.b;
						return _List_fromArray(
							[
								'textile',
								'simulator',
								$author$project$Data$Impact$Definition$toString(trigram)
							]);
					}
				case 16:
					var uuid = route.a;
					return _List_fromArray(
						[
							'textile',
							'edit-example',
							$author$project$Data$Uuid$toString(uuid)
						]);
				default:
					return _List_fromArray(
						['textile', 'simulator']);
			}
		}
		var scope = route.a;
		var dataset = route.b;
		return A2(
			$elm$core$List$cons,
			'explore',
			A2(
				$elm$core$List$cons,
				$author$project$Data$Scope$toString(scope),
				$author$project$Data$Dataset$toRoutePath(dataset)));
	}();
	return '#/' + A2($elm$core$String$join, '/', pieces);
};
var $author$project$Server$toTextileWebUrl = F2(
	function (maybeTrigram, textileQuery) {
		return $author$project$Route$toString(
			A2(
				$author$project$Route$TextileSimulator,
				A2($elm$core$Maybe$withDefault, $author$project$Data$Impact$default, maybeTrigram),
				$elm$core$Maybe$Just(
					$author$project$Data$Textile$Inputs$toQuery(textileQuery))));
	});
var $author$project$Server$toAllImpactsDetailed = function (v) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'webUrl',
				$elm$json$Json$Encode$string(
					_Utils_ap(
						$author$project$Server$serverRootUrl,
						A2($author$project$Server$toTextileWebUrl, $elm$core$Maybe$Nothing, v.u)))),
				_Utils_Tuple2(
				'complementsImpacts',
				$author$project$Data$Impact$encodeComplementsImpacts(v.h1)),
				_Utils_Tuple2(
				'daysOfWear',
				$elm$json$Json$Encode$int(
					$elm$core$Basics$round(
						$ianmackenzie$elm_units$Duration$inDays(v.ek)))),
				_Utils_Tuple2(
				'durability',
				$elm$json$Json$Encode$float(
					$author$project$Data$Unit$floatDurabilityFromHolistic(v.au))),
				_Utils_Tuple2(
				'impacts',
				$author$project$Data$Impact$encode(v.z)),
				_Utils_Tuple2(
				'impactsWithoutDurability',
				$author$project$Data$Impact$encode(
					$author$project$Data$Textile$Simulator$getTotalImpactsWithoutDurability(v))),
				_Utils_Tuple2(
				'inputs',
				$author$project$Data$Textile$Inputs$encode(v.u)),
				_Utils_Tuple2(
				'lifeCycle',
				$author$project$Data$Textile$LifeCycle$encode(v.K)),
				_Utils_Tuple2(
				'transport',
				$author$project$Data$Transport$encode(v.c5)),
				_Utils_Tuple2(
				'trimsImpacts',
				$author$project$Data$Impact$encode(v.c7)),
				_Utils_Tuple2(
				'useNbCycles',
				$elm$json$Json$Encode$int(v.kz))
			]));
};
var $author$project$Views$Format$kgToString = function (mass) {
	return A2(
		$author$project$Views$Format$formatFloat,
		3,
		$ianmackenzie$elm_units$Mass$inKilograms(mass)) + 'kg';
};
var $author$project$Data$Textile$MakingComplexity$toLabel = function (makingComplexity) {
	switch (makingComplexity) {
		case 0:
			return 'Elevée';
		case 1:
			return 'Faible';
		case 2:
			return 'Moyenne';
		case 3:
			return 'Non applicable';
		case 4:
			return 'Très élevée';
		default:
			return 'Très faible';
	}
};
var $author$project$Data$Split$toPercentString = function (decimals) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Split$toPercent,
		$cuducos$elm_format_number$FormatNumber$format(
			_Utils_update(
				$cuducos$elm_format_number$FormatNumber$Locales$frenchLocale,
				{
					h9: $cuducos$elm_format_number$FormatNumber$Locales$Exact(decimals)
				})));
};
var $author$project$Data$Textile$Inputs$makingOptionsToString = function (_v0) {
	var airTransportRatio = _v0.bY;
	var fading = _v0.cb;
	var makingComplexity = _v0.i9;
	var makingDeadStock = _v0.cl;
	var makingWaste = _v0.cm;
	return function (s) {
		return (s !== '') ? (' (' + (s + ')')) : '';
	}(
		A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Data$Split$toPercentString(0),
							function (s) {
								return s + '\u202F% de perte';
							}),
						makingWaste),
						A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Data$Split$toPercentString(0),
							function (s) {
								return s + '\u202F% de stocks dormants';
							}),
						makingDeadStock),
						A2(
						$elm$core$Maybe$map,
						function (complexity) {
							return 'complexité de confection ' + $author$project$Data$Textile$MakingComplexity$toLabel(complexity);
						},
						makingComplexity),
						A2(
						$elm$core$Maybe$andThen,
						function (ratio) {
							return (!$author$project$Data$Split$toPercent(ratio)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
								A2($author$project$Data$Split$toPercentString, 0, ratio) + ' de transport aérien');
						},
						airTransportRatio),
						_Utils_eq(
						fading,
						$elm$core$Maybe$Just(true)) ? $elm$core$Maybe$Just('délavé') : $elm$core$Maybe$Nothing
					]))));
};
var $author$project$Data$Textile$Inputs$materialsToString = function (materials) {
	return A2(
		$elm$core$String$join,
		', ',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var country = _v1.fL;
				var material = _v1.aa;
				var share = _v1.ac;
				var countryName = A2(
					$elm$core$Maybe$withDefault,
					' par défaut (' + (material.iI + ')'),
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.L;
						},
						country));
				return A2($author$project$Data$Split$toPercentString, 0, share) + ('% ' + (material.ka + (' provenance ' + countryName)));
			},
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var share = _v0.ac;
					return $author$project$Data$Split$toFloat(share) > 0;
				},
				materials)));
};
var $author$project$Data$Textile$Printing$kindLabel = function (kind) {
	if (!kind) {
		return 'Pigmentaire';
	} else {
		return 'Fixé-lavé';
	}
};
var $author$project$Data$Textile$Printing$toFullLabel = function (_v0) {
	var kind = _v0.eF;
	var ratio = _v0.jR;
	return $author$project$Data$Textile$Printing$kindLabel(kind) + (' (' + (A2($author$project$Data$Split$toPercentString, 0, ratio) + '%)'));
};
var $author$project$Data$Textile$Fabric$toLabel = function (fabricProcess) {
	switch (fabricProcess) {
		case 0:
			return 'Tricotage Circulaire';
		case 1:
			return 'Tricotage Fully fashioned / Seamless';
		case 2:
			return 'Tricotage Intégral / Whole garment';
		case 3:
			return 'Tricotage moyen (par défaut)';
		case 4:
			return 'Tricotage Rectiligne';
		default:
			return 'Tissage';
	}
};
var $author$project$Data$Textile$Inputs$stepsToStrings = F2(
	function (wellKnown, inputs) {
		var ifStepEnabled = F2(
			function (label, list) {
				return (!A2($elm$core$List$member, label, inputs.b6)) ? list : _List_Nil;
			});
		return A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$List$isEmpty),
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_ap(
						inputs.aC.L,
						_Utils_ap(
							inputs.cz ? ' remanufacturé' : '',
							function () {
								var _v0 = inputs.co;
								if (!_v0.$) {
									var physicalDurability = _v0.a;
									return ', durabilité physique ' + $elm$core$String$fromFloat(
										$author$project$Data$Unit$physicalDurabilityToFloat(physicalDurability));
								} else {
									return '';
								}
							}())),
						$author$project$Views$Format$kgToString(inputs.T)
					]),
					A2(
					ifStepEnabled,
					5,
					_List_fromArray(
						[
							'matière',
							$author$project$Data$Textile$Inputs$materialsToString(inputs.jc)
						])),
					A2(
					ifStepEnabled,
					6,
					_List_fromArray(
						['filature', inputs.b4.L])),
					function () {
					var _v1 = inputs.kF;
					if (!_v1.$) {
						var yarnSize = _v1.a;
						return _List_fromArray(
							[
								'titrage',
								$elm$core$String$fromFloat(
								$author$project$Data$Unit$yarnSizeInKilometers(yarnSize)) + 'Nm'
							]);
					} else {
						return _List_Nil;
					}
				}(),
					A2(
					ifStepEnabled,
					3,
					_List_fromArray(
						[
							$author$project$Data$Textile$Fabric$toLabel(
							A2($elm$core$Maybe$withDefault, inputs.aC.f_, inputs.bj)),
							inputs.bb.L
						])),
					A2(
					ifStepEnabled,
					2,
					_List_fromArray(
						[
							'ennoblissement\u00A0: ' + $author$project$Data$Process$getDisplayName(
							A2($author$project$Data$Textile$Dyeing$toProcess, wellKnown, inputs.b7)),
							inputs.aW.L
						])),
					A2(
					ifStepEnabled,
					2,
					_List_fromArray(
						[
							'impression',
							function () {
							var _v2 = inputs.cp;
							if (!_v2.$) {
								var printing = _v2.a;
								return 'impression ' + ($author$project$Data$Textile$Printing$toFullLabel(printing) + ('\u00A0: ' + inputs.aW.L));
							} else {
								return 'non';
							}
						}()
						])),
					A2(
					ifStepEnabled,
					4,
					_List_fromArray(
						[
							'confection',
							_Utils_ap(
							inputs.bc.L,
							$author$project$Data$Textile$Inputs$makingOptionsToString(inputs))
						])),
					A2(
					ifStepEnabled,
					0,
					_List_fromArray(
						['distribution', inputs.eh.L])),
					A2(
					ifStepEnabled,
					7,
					_List_fromArray(
						['utilisation', inputs.ej.L])),
					A2(
					ifStepEnabled,
					1,
					_List_fromArray(
						['fin de vie', inputs.ei.L]))
				]));
	});
var $author$project$Data$Textile$Inputs$toString = F2(
	function (wellKnown, inputs) {
		return A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$elm$core$String$join('\u00A0: '),
				A2($author$project$Data$Textile$Inputs$stepsToStrings, wellKnown, inputs)));
	});
var $author$project$Server$toAllImpactsSimple = F2(
	function (wellKnown, _v0) {
		var impacts = _v0.z;
		var inputs = _v0.u;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'webUrl',
					$elm$json$Json$Encode$string(
						_Utils_ap(
							$author$project$Server$serverRootUrl,
							A2($author$project$Server$toTextileWebUrl, $elm$core$Maybe$Nothing, inputs)))),
					_Utils_Tuple2(
					'impacts',
					$author$project$Data$Impact$encode(impacts)),
					_Utils_Tuple2(
					'description',
					$elm$json$Json$Encode$string(
						A2($author$project$Data$Textile$Inputs$toString, wellKnown, inputs))),
					_Utils_Tuple2(
					'query',
					$author$project$Data$Textile$Query$encode(
						$author$project$Data$Textile$Inputs$toQuery(inputs)))
				]));
	});
var $author$project$Data$Food$Recipe$encodeScoring = function (scoring) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'all',
				$author$project$Data$Unit$encodeImpact(scoring.hM)),
				_Utils_Tuple2(
				'climate',
				$author$project$Data$Unit$encodeImpact(scoring.h$)),
				_Utils_Tuple2(
				'biodiversity',
				$author$project$Data$Unit$encodeImpact(scoring.hS)),
				_Utils_Tuple2(
				'health',
				$author$project$Data$Unit$encodeImpact(scoring.iK)),
				_Utils_Tuple2(
				'resources',
				$author$project$Data$Unit$encodeImpact(scoring.jZ))
			]));
};
var $author$project$Data$Food$Recipe$encodeResults = function (results) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'total',
				$author$project$Data$Impact$encode(results.a3)),
				_Utils_Tuple2(
				'perKg',
				$author$project$Data$Impact$encode(results.eS)),
				_Utils_Tuple2(
				'scoring',
				$author$project$Data$Food$Recipe$encodeScoring(results.eZ)),
				_Utils_Tuple2(
				'totalMass',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(results.fk))),
				_Utils_Tuple2(
				'preparedMass',
				$elm$json$Json$Encode$float(
					$ianmackenzie$elm_units$Mass$inKilograms(results.eU))),
				_Utils_Tuple2(
				'recipe',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'total',
							$author$project$Data$Impact$encode(results.aM.a3)),
							_Utils_Tuple2(
							'ingredientsTotal',
							$author$project$Data$Impact$encode(results.aM.eD)),
							_Utils_Tuple2(
							'totalBonusImpact',
							$author$project$Data$Impact$encodeComplementsImpacts(results.aM.hm)),
							_Utils_Tuple2(
							'transform',
							$author$project$Data$Impact$encode(results.aM.bQ)),
							_Utils_Tuple2(
							'transports',
							$author$project$Data$Transport$encode(results.aM.aP))
						]))),
				_Utils_Tuple2(
				'packaging',
				$author$project$Data$Impact$encode(results.bB)),
				_Utils_Tuple2(
				'preparation',
				$author$project$Data$Impact$encode(results.aL)),
				_Utils_Tuple2(
				'transports',
				$author$project$Data$Transport$encode(results.aP)),
				_Utils_Tuple2(
				'distribution',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'total',
							$author$project$Data$Impact$encode(results.cO.a3)),
							_Utils_Tuple2(
							'transports',
							$author$project$Data$Transport$encode(results.cO.aP))
						])))
			]));
};
var $author$project$Route$FoodBuilder = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Server$toFoodWebUrl = F2(
	function (trigram, foodQuery) {
		return $author$project$Route$toString(
			A2(
				$author$project$Route$FoodBuilder,
				trigram,
				$elm$core$Maybe$Just(foodQuery)));
	});
var $author$project$Server$toFoodResults = F2(
	function (query, results) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'webUrl',
					$elm$json$Json$Encode$string(
						_Utils_ap(
							$author$project$Server$serverRootUrl,
							A2($author$project$Server$toFoodWebUrl, $author$project$Data$Impact$default, query)))),
					_Utils_Tuple2(
					'results',
					$author$project$Data$Food$Recipe$encodeResults(results)),
					_Utils_Tuple2(
					'description',
					$elm$json$Json$Encode$string('TODO')),
					_Utils_Tuple2(
					'query',
					$author$project$Data$Food$Query$encode(query))
				]));
	});
var $author$project$Data$Impact$encodeSingleImpact = F2(
	function (_v0, trigram) {
		var impacts = _v0;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					$author$project$Data$Impact$Definition$toString(trigram),
					$author$project$Data$Unit$encodeImpact(
						A2($author$project$Data$Impact$Definition$get, trigram, impacts)))
				]));
	});
var $author$project$Server$toSingleImpactSimple = F3(
	function (wellKnown, trigram, _v0) {
		var impacts = _v0.z;
		var inputs = _v0.u;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'webUrl',
					$elm$json$Json$Encode$string(
						_Utils_ap(
							$author$project$Server$serverRootUrl,
							A2(
								$author$project$Server$toTextileWebUrl,
								$elm$core$Maybe$Just(trigram),
								inputs)))),
					_Utils_Tuple2(
					'impacts',
					A2($author$project$Data$Impact$encodeSingleImpact, impacts, trigram)),
					_Utils_Tuple2(
					'description',
					$elm$json$Json$Encode$string(
						A2($author$project$Data$Textile$Inputs$toString, wellKnown, inputs))),
					_Utils_Tuple2(
					'query',
					$author$project$Data$Textile$Query$encode(
						$author$project$Data$Textile$Inputs$toQuery(inputs)))
				]));
	});
var $author$project$Server$handleRequest = F2(
	function (db, request) {
		var _v0 = A2($author$project$Server$Route$endpoint, db, request);
		if (!_v0.$) {
			switch (_v0.a.$) {
				case 0:
					var _v1 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						A2(
							$elm$json$Json$Encode$list,
							$author$project$Server$encodeCountry,
							A2(
								$author$project$Data$Scope$anyOf,
								_List_fromArray(
									[0]),
								db.h4)));
				case 1:
					var _v2 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						$author$project$Server$encodeIngredients(db.dt.iR));
				case 2:
					var _v3 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						$author$project$Server$encodeProcessList(
							A2(
								$elm$core$List$filter,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.eb;
									},
									$elm$core$List$member($author$project$Data$Process$Category$Packaging)),
								A2(
									$author$project$Data$Scope$anyOf,
									_List_fromArray(
										[0]),
									db.dJ))));
				case 3:
					var _v4 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						$author$project$Server$encodeProcessList(
							A2(
								$elm$core$List$filter,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.eb;
									},
									$elm$core$List$member($author$project$Data$Process$Category$Transform)),
								A2(
									$author$project$Data$Scope$anyOf,
									_List_fromArray(
										[0]),
									db.dJ))));
				case 5:
					var _v5 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						A2(
							$elm$json$Json$Encode$list,
							$author$project$Server$encodeCountry,
							A2(
								$author$project$Data$Scope$anyOf,
								_List_fromArray(
									[2]),
								db.h4)));
				case 6:
					var _v6 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						A2($elm$json$Json$Encode$list, $author$project$Server$encodeMaterial, db.kk.jc));
				case 7:
					var _v7 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						A2($elm$json$Json$Encode$list, $author$project$Server$encodeProduct, db.kk.jP));
				case 8:
					var _v8 = _v0.a;
					return A2(
						$author$project$Server$respondWith,
						200,
						A2(
							$elm$json$Json$Encode$list,
							$author$project$Server$encodeComponent,
							A2(
								$author$project$Data$Scope$anyOf,
								_List_fromArray(
									[2]),
								db.di)));
				case 4:
					if (!_v0.a.a.$) {
						var foodQuery = _v0.a.a.a;
						return A3(
							$author$project$Server$executeFoodQuery,
							db,
							$author$project$Server$toFoodResults(foodQuery),
							foodQuery);
					} else {
						var error = _v0.a.a.a;
						return A2(
							$author$project$Server$respondWith,
							400,
							$author$project$Server$encodeValidationErrors(error));
					}
				case 9:
					if (!_v0.a.a.$) {
						var textileQuery = _v0.a.a.a;
						return A3(
							$author$project$Server$executeTextileQuery,
							db,
							$author$project$Server$toAllImpactsSimple(db.kk.kD),
							textileQuery);
					} else {
						var error = _v0.a.a.a;
						return A2(
							$author$project$Server$respondWith,
							400,
							$author$project$Server$encodeValidationErrors(error));
					}
				case 10:
					if (!_v0.a.a.$) {
						var textileQuery = _v0.a.a.a;
						return A3($author$project$Server$executeTextileQuery, db, $author$project$Server$toAllImpactsDetailed, textileQuery);
					} else {
						var error = _v0.a.a.a;
						return A2(
							$author$project$Server$respondWith,
							400,
							$author$project$Server$encodeValidationErrors(error));
					}
				default:
					if (!_v0.a.a.$) {
						var _v9 = _v0.a;
						var textileQuery = _v9.a.a;
						var trigram = _v9.b;
						return A3(
							$author$project$Server$executeTextileQuery,
							db,
							A2($author$project$Server$toSingleImpactSimple, db.kk.kD, trigram),
							textileQuery);
					} else {
						var _v10 = _v0.a;
						var error = _v10.a.a;
						return A2(
							$author$project$Server$respondWith,
							400,
							$author$project$Server$encodeValidationErrors(error));
					}
			}
		} else {
			return A2(
				$author$project$Server$respondWith,
				404,
				$author$project$Server$encodeValidationErrors(
					$author$project$Data$Validation$fromErrorString('Endpoint doesn\'t exist')));
		}
	});
var $author$project$Server$output = _Platform_outgoingPort('output', $elm$core$Basics$identity);
var $author$project$Server$sendResponse = F3(
	function (httpStatus, _v0, body) {
		var jsResponseHandler = _v0.gj;
		var method = _v0.gr;
		var url = _v0.ht;
		return $author$project$Server$output(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'status',
						$elm$json$Json$Encode$int(httpStatus)),
						_Utils_Tuple2(
						'method',
						$elm$json$Json$Encode$string(method)),
						_Utils_Tuple2(
						'url',
						$elm$json$Json$Encode$string(url)),
						_Utils_Tuple2('body', body),
						_Utils_Tuple2('jsResponseHandler', jsResponseHandler)
					])));
	});
var $author$project$Server$cmdRequest = F2(
	function (db, request) {
		var _v0 = A2($author$project$Server$handleRequest, db, request);
		var code = _v0.a;
		var responseBody = _v0.b;
		return A3($author$project$Server$sendResponse, code, request, responseBody);
	});
var $author$project$Static$Db$Db = F8(
	function (components, countries, definitions, distances, food, object, processes, textile) {
		return {di: components, h4: countries, id: definitions, ih: distances, dt: food, jw: object, dJ: processes, kk: textile};
	});
var $author$project$Data$Food$Db$Db = F3(
	function (examples, ingredients, wellKnown) {
		return {iz: examples, iR: ingredients, kD: wellKnown};
	});
var $author$project$Data$Food$Ingredient$Ingredient = function (categories) {
	return function (cropGroup) {
		return function (defaultOrigin) {
			return function (density) {
				return function (ecosystemicServices) {
					return function (id) {
						return function (inediblePart) {
							return function (landOccupation) {
								return function (name) {
									return function (process) {
										return function (rawToCookedRatio) {
											return function (scenario) {
												return function (transportCooling) {
													return function (visible) {
														return {eb: categories, h6: cropGroup, fR: defaultOrigin, ie: density, is: ecosystemicServices, H: id, iQ: inediblePart, i1: landOccupation, L: name, jO: process, jT: rawToCookedRatio, j4: scenario, ks: transportCooling, hx: visible};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Food$EcosystemicServices$AbstractEcosystemicServices = F5(
	function (cropDiversity, hedges, livestockDensity, permanentPasture, plotSize) {
		return {dj: cropDiversity, du: hedges, dz: livestockDensity, dG: permanentPasture, dH: plotSize};
	});
var $author$project$Data$Unit$decodeImpact = A2($elm$json$Json$Decode$map, $author$project$Data$Unit$impact, $elm$json$Json$Decode$float);
var $author$project$Data$Food$EcosystemicServices$decode = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'plotSize',
	$author$project$Data$Unit$decodeImpact,
	$author$project$Data$Unit$noImpacts,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'permanentPasture',
		$author$project$Data$Unit$decodeImpact,
		$author$project$Data$Unit$noImpacts,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'livestockDensity',
			$author$project$Data$Unit$decodeImpact,
			$author$project$Data$Unit$noImpacts,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'hedges',
				$author$project$Data$Unit$decodeImpact,
				$author$project$Data$Unit$noImpacts,
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'cropDiversity',
					$author$project$Data$Unit$decodeImpact,
					$author$project$Data$Unit$noImpacts,
					$elm$json$Json$Decode$succeed($author$project$Data$Food$EcosystemicServices$AbstractEcosystemicServices))))));
var $author$project$Data$Food$Ingredient$Category$AnimalProduct = 0;
var $author$project$Data$Food$Ingredient$Category$BleuBlancCoeur = 1;
var $author$project$Data$Food$Ingredient$Category$Conventional = 2;
var $author$project$Data$Food$Ingredient$Category$DairyProduct = 3;
var $author$project$Data$Food$Ingredient$Category$GrainProcessed = 4;
var $author$project$Data$Food$Ingredient$Category$GrainRaw = 5;
var $author$project$Data$Food$Ingredient$Category$Misc = 6;
var $author$project$Data$Food$Ingredient$Category$NutOilseedProcessed = 7;
var $author$project$Data$Food$Ingredient$Category$NutOilseedRaw = 8;
var $author$project$Data$Food$Ingredient$Category$Organic = 9;
var $author$project$Data$Food$Ingredient$Category$SpiceCondimentOrAdditive = 10;
var $author$project$Data$Food$Ingredient$Category$VegetableFresh = 11;
var $author$project$Data$Food$Ingredient$Category$VegetableProcessed = 12;
var $author$project$Data$Food$Ingredient$Category$fromString = function (str) {
	switch (str) {
		case 'animal_product':
			return $elm$core$Result$Ok(0);
		case 'conventional':
			return $elm$core$Result$Ok(2);
		case 'dairy_product':
			return $elm$core$Result$Ok(3);
		case 'grain_raw':
			return $elm$core$Result$Ok(5);
		case 'grain_processed':
			return $elm$core$Result$Ok(4);
		case 'misc':
			return $elm$core$Result$Ok(6);
		case 'nut_oilseed_raw':
			return $elm$core$Result$Ok(8);
		case 'nut_oilseed_processed':
			return $elm$core$Result$Ok(7);
		case 'spice_condiment_additive':
			return $elm$core$Result$Ok(10);
		case 'vegetable_fresh':
			return $elm$core$Result$Ok(11);
		case 'vegetable_processed':
			return $elm$core$Result$Ok(12);
		case 'organic':
			return $elm$core$Result$Ok(9);
		case 'bleublanccoeur':
			return $elm$core$Result$Ok(1);
		default:
			return $elm$core$Result$Err('Categorie d\'ingrédient invalide : ' + str);
	}
};
var $author$project$Data$Food$Ingredient$Category$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Ingredient$Category$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$Ingredient$CropGroup$Arboriculture = 0;
var $author$project$Data$Food$Ingredient$CropGroup$Barley = 1;
var $author$project$Data$Food$Ingredient$CropGroup$CornGrainAndSilage = 2;
var $author$project$Data$Food$Ingredient$CropGroup$FiberPlants = 3;
var $author$project$Data$Food$Ingredient$CropGroup$Forage = 4;
var $author$project$Data$Food$Ingredient$CropGroup$Frozen = 5;
var $author$project$Data$Food$Ingredient$CropGroup$GrainLegumes = 6;
var $author$project$Data$Food$Ingredient$CropGroup$IndustrialFrozen = 7;
var $author$project$Data$Food$Ingredient$CropGroup$Miscellaneous = 8;
var $author$project$Data$Food$Ingredient$CropGroup$NoCropGroup = 9;
var $author$project$Data$Food$Ingredient$CropGroup$Nuts = 10;
var $author$project$Data$Food$Ingredient$CropGroup$OliveTrees = 11;
var $author$project$Data$Food$Ingredient$CropGroup$Orchards = 12;
var $author$project$Data$Food$Ingredient$CropGroup$OtherCereals = 13;
var $author$project$Data$Food$Ingredient$CropGroup$OtherFrozen = 14;
var $author$project$Data$Food$Ingredient$CropGroup$OtherIndustrialCrops = 15;
var $author$project$Data$Food$Ingredient$CropGroup$OtherOilseeds = 16;
var $author$project$Data$Food$Ingredient$CropGroup$PermanentGrasslands = 17;
var $author$project$Data$Food$Ingredient$CropGroup$ProteinCrops = 18;
var $author$project$Data$Food$Ingredient$CropGroup$Rapeseed = 19;
var $author$project$Data$Food$Ingredient$CropGroup$Rice = 20;
var $author$project$Data$Food$Ingredient$CropGroup$Seeds = 21;
var $author$project$Data$Food$Ingredient$CropGroup$SoftWheat = 22;
var $author$project$Data$Food$Ingredient$CropGroup$Sugarcane = 23;
var $author$project$Data$Food$Ingredient$CropGroup$SummerPastures = 24;
var $author$project$Data$Food$Ingredient$CropGroup$Sunflower = 25;
var $author$project$Data$Food$Ingredient$CropGroup$TemporaryGrasslands = 26;
var $author$project$Data$Food$Ingredient$CropGroup$VegetablesAndFlowers = 27;
var $author$project$Data$Food$Ingredient$CropGroup$Vineyards = 28;
var $author$project$Data$Food$Ingredient$CropGroup$fromString = function (str) {
	switch (str) {
		case 'ARBORICULTURE':
			return $elm$core$Result$Ok(0);
		case 'AUTRES GELS':
			return $elm$core$Result$Ok(14);
		case 'ORGE':
			return $elm$core$Result$Ok(1);
		case 'CANNE A SUCRE':
			return $elm$core$Result$Ok(23);
		case 'MAIS GRAIN ET ENSILAGE':
			return $elm$core$Result$Ok(2);
		case 'ESTIVES LANDES':
			return $elm$core$Result$Ok(24);
		case 'PLANTES A FIBRES':
			return $elm$core$Result$Ok(3);
		case 'FOURRAGE':
			return $elm$core$Result$Ok(4);
		case 'GEL (surfaces gelées sans production)':
			return $elm$core$Result$Ok(5);
		case 'GEL INDUSTRIEL':
			return $elm$core$Result$Ok(7);
		case 'LEGUMINEUSES A GRAIN':
			return $elm$core$Result$Ok(6);
		case 'LEGUMES-FLEURS':
			return $elm$core$Result$Ok(27);
		case 'DIVERS':
			return $elm$core$Result$Ok(8);
		case '':
			return $elm$core$Result$Ok(9);
		case 'FRUITS A COQUES':
			return $elm$core$Result$Ok(10);
		case 'OLIVIERS':
			return $elm$core$Result$Ok(11);
		case 'VERGERS':
			return $elm$core$Result$Ok(12);
		case 'AUTRES CEREALES':
			return $elm$core$Result$Ok(13);
		case 'AUTRES CULTURES INDUSTRIELLES':
			return $elm$core$Result$Ok(15);
		case 'AUTRES OLEAGINEUX':
			return $elm$core$Result$Ok(16);
		case 'PRAIRIES PERMANENTES':
			return $elm$core$Result$Ok(17);
		case 'PROTEAGINEUX':
			return $elm$core$Result$Ok(18);
		case 'COLZA':
			return $elm$core$Result$Ok(19);
		case 'RIZ':
			return $elm$core$Result$Ok(20);
		case 'SEMENCES':
			return $elm$core$Result$Ok(21);
		case 'BLE TENDRE':
			return $elm$core$Result$Ok(22);
		case 'TOURNESOL':
			return $elm$core$Result$Ok(25);
		case 'PRAIRIES TEMPORAIRES':
			return $elm$core$Result$Ok(26);
		case 'VIGNES':
			return $elm$core$Result$Ok(28);
		default:
			return $elm$core$Result$Err('Groupe de culture invalide : ' + str);
	}
};
var $author$project$Data$Food$Ingredient$CropGroup$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Ingredient$CropGroup$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$Ingredient$Scenario$Import = 0;
var $author$project$Data$Food$Ingredient$Scenario$NoScenario = 1;
var $author$project$Data$Food$Ingredient$Scenario$Organic = 2;
var $author$project$Data$Food$Ingredient$Scenario$Reference = 3;
var $author$project$Data$Food$Ingredient$Scenario$fromString = function (str) {
	switch (str) {
		case 'reference':
			return $elm$core$Result$Ok(3);
		case 'organic':
			return $elm$core$Result$Ok(2);
		case 'import':
			return $elm$core$Result$Ok(0);
		case '':
			return $elm$core$Result$Ok(1);
		default:
			return $elm$core$Result$Err('Scénario invalide : ' + str);
	}
};
var $author$project$Data$Food$Ingredient$Scenario$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Ingredient$Scenario$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$Origin$EuropeAndMaghreb = 0;
var $author$project$Data$Food$Origin$OutOfEuropeAndMaghreb = 2;
var $author$project$Data$Food$Origin$fromString = function (string) {
	switch (string) {
		case 'EuropeAndMaghreb':
			return $elm$core$Result$Ok(0);
		case 'France':
			return $elm$core$Result$Ok(1);
		case 'OutOfEuropeAndMaghreb':
			return $elm$core$Result$Ok(2);
		case 'OutOfEuropeAndMaghrebByPlane':
			return $elm$core$Result$Ok(3);
		default:
			return $elm$core$Result$Err('Origine géographique inconnue : ' + string);
	}
};
var $author$project$Data$Food$Origin$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Food$Origin$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Unit$decodeRatio = A2($elm$json$Json$Decode$map, $author$project$Data$Unit$ratio, $elm$json$Json$Decode$float);
var $author$project$Data$Food$Ingredient$CoolOnceTransformed = 1;
var $author$project$Data$Food$Ingredient$decodeTransportCooling = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'none':
				return $elm$json$Json$Decode$succeed(2);
			case 'always':
				return $elm$json$Json$Decode$succeed(0);
			case 'once_transformed':
				return $elm$json$Json$Decode$succeed(1);
			default:
				var invalid = str;
				return $elm$json$Json$Decode$fail('Valeur de transport frigorifique invalide : ' + invalid);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$Food$EcosystemicServices$empty = {dj: $author$project$Data$Unit$noImpacts, du: $author$project$Data$Unit$noImpacts, dz: $author$project$Data$Unit$noImpacts, dG: $author$project$Data$Unit$noImpacts, dH: $author$project$Data$Unit$noImpacts};
var $author$project$Data$Food$Ingredient$CropGroup$empty = 9;
var $author$project$Data$Food$Ingredient$Scenario$empty = 1;
var $author$project$Data$Food$Ingredient$linkProcess = function (processes) {
	return A2(
		$elm$json$Json$Decode$andThen,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Data$Process$idFromString,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$andThen(
					function (id) {
						return A2($author$project$Data$Process$findById, id, processes);
					}),
				$elm_community$json_extra$Json$Decode$Extra$fromResult)),
		$elm$json$Json$Decode$string);
};
var $author$project$Data$Food$Ingredient$decodeIngredient = function (processes) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'visible',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'transportCooling',
			$author$project$Data$Food$Ingredient$decodeTransportCooling,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'scenario',
				$author$project$Data$Food$Ingredient$Scenario$decode,
				$author$project$Data$Food$Ingredient$Scenario$empty,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'rawToCookedRatio',
					$author$project$Data$Unit$decodeRatio,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'processId',
						$author$project$Data$Food$Ingredient$linkProcess(processes),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'name',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'landOccupation',
								$elm$json$Json$Decode$float,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'inediblePart',
									$author$project$Data$Split$decodeFloat,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'id',
										$author$project$Data$Food$Ingredient$decodeId,
										A4(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
											'ecosystemicServices',
											$author$project$Data$Food$EcosystemicServices$decode,
											$author$project$Data$Food$EcosystemicServices$empty,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'density',
												A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Density$gramsPerCubicCentimeter, $elm$json$Json$Decode$float),
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'defaultOrigin',
													$author$project$Data$Food$Origin$decode,
													A4(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
														'cropGroup',
														$author$project$Data$Food$Ingredient$CropGroup$decode,
														$author$project$Data$Food$Ingredient$CropGroup$empty,
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'categories',
															$elm$json$Json$Decode$list($author$project$Data$Food$Ingredient$Category$decode),
															$elm$json$Json$Decode$succeed($author$project$Data$Food$Ingredient$Ingredient)))))))))))))));
};
var $author$project$Data$Food$Ingredient$decodeIngredients = function (processes) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$List$filter(
			function ($) {
				return $.hx;
			}),
		$elm$json$Json$Decode$list(
			$author$project$Data$Food$Ingredient$decodeIngredient(processes)));
};
var $author$project$Data$Example$Example = F5(
	function (category, id, name, query, scope) {
		return {fE: category, H: id, L: name, dK: query, g3: scope};
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Data$Example$decode = function (decodeQuery) {
	return A6(
		$elm$json$Json$Decode$map5,
		$author$project$Data$Example$Example,
		A2($elm$json$Json$Decode$field, 'category', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'id', $author$project$Data$Uuid$decoder),
		A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'query', decodeQuery),
		A2($elm$json$Json$Decode$field, 'scope', $author$project$Data$Scope$decode));
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Data$Example$decodeListFromJsonString = function (decodeQuery) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$decodeString(
			$elm$json$Json$Decode$list(
				$author$project$Data$Example$decode(decodeQuery))),
		$elm$core$Result$mapError($elm$json$Json$Decode$errorToString));
};
var $author$project$Data$Food$WellKnown$WellKnown = F9(
	function (boatCoolingTransport, boatTransport, cooking, domesticGasHeat, lorryCoolingTransport, lorryTransport, lowVoltageElectricity, planeTransport, water) {
		return {hT: boatCoolingTransport, hU: boatTransport, h3: cooking, ij: domesticGasHeat, i5: lorryCoolingTransport, i6: lorryTransport, i7: lowVoltageElectricity, gJ: planeTransport, bV: water};
	});
var $author$project$Data$Food$WellKnown$load = function (processes) {
	var fromIdString = A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Process$idFromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$andThen(
				function (id) {
					return A2($author$project$Data$Process$findById, id, processes);
				}),
			$elm_community$result_extra$Result$Extra$andMap));
	return A2(
		fromIdString,
		'd3fc19a4-7ace-5870-aeb3-fe35a8189d94',
		A2(
			fromIdString,
			'c8bca164-5574-5232-84b9-46c5b734cd0c',
			A2(
				fromIdString,
				'931c9bb0-619a-5f75-b41b-ab8061e2ad92',
				A2(
					fromIdString,
					'1f30553d-df08-5f07-b035-ba3ce5af7cf1',
					A2(
						fromIdString,
						'a79eb385-fa19-590c-8e3b-16f6048c4303',
						A2(
							fromIdString,
							'a21ee9bf-675f-502b-a9a3-395686a429e0',
							A2(
								fromIdString,
								'83b897cf-9ed2-5604-83b4-67fab8606d35',
								A2(
									fromIdString,
									'54145f9e-1a8e-5a69-96d9-d3b92f9a1cee',
									A2(
										fromIdString,
										'c739cf97-d424-5abd-b6ad-4c21d66081bb',
										$elm$core$Result$Ok($author$project$Data$Food$WellKnown$WellKnown))))))))));
};
var $author$project$Data$Food$Db$buildFromJson = F3(
	function (exampleProductsJson, ingredientsJson, processes) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$author$project$Data$Food$WellKnown$load(processes),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				A2(
					$elm$core$Result$mapError,
					$elm$json$Json$Decode$errorToString,
					A2(
						$elm$json$Json$Decode$decodeString,
						$author$project$Data$Food$Ingredient$decodeIngredients(processes),
						ingredientsJson)),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A2($author$project$Data$Example$decodeListFromJsonString, $author$project$Data$Food$Query$decode, exampleProductsJson),
					$elm$core$Result$Ok($author$project$Data$Food$Db$Db))));
	});
var $author$project$Data$Object$Db$Db = function (examples) {
	return {iz: examples};
};
var $author$project$Data$Object$Query$Query = function (components) {
	return {di: components};
};
var $author$project$Data$Object$Query$decode = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'components',
	$elm$json$Json$Decode$list($author$project$Data$Component$decodeItem),
	$elm$json$Json$Decode$succeed($author$project$Data$Object$Query$Query));
var $author$project$Data$Object$Db$buildFromJson = F2(
	function (objectExamplesJson, veliExamplesJson) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			A3(
				$elm$core$Result$map2,
				$elm$core$Basics$append,
				A2($author$project$Data$Example$decodeListFromJsonString, $author$project$Data$Object$Query$decode, objectExamplesJson),
				A2($author$project$Data$Example$decodeListFromJsonString, $author$project$Data$Object$Query$decode, veliExamplesJson)),
			$elm$core$Result$Ok($author$project$Data$Object$Db$Db));
	});
var $author$project$Data$Textile$Db$Db = F4(
	function (examples, materials, products, wellKnown) {
		return {iz: examples, jc: materials, jP: products, kD: wellKnown};
	});
var $author$project$Data$Textile$Material$Material = function (cffData) {
	return function (defaultCountry) {
		return function (geographicOrigin) {
			return function (id) {
				return function (materialProcess) {
					return function (name) {
						return function (origin) {
							return function (recycledFrom) {
								return function (recycledProcess) {
									return function (shortName) {
										return {hZ: cffData, fO: defaultCountry, iI: geographicOrigin, H: id, gq: materialProcess, L: name, gD: origin, eW: recycledFrom, jV: recycledProcess, ka: shortName};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Textile$Material$Origin$ArtificialFromOrganic = 0;
var $author$project$Data$Textile$Material$Origin$NaturalFromAnimal = 1;
var $author$project$Data$Textile$Material$Origin$NaturalFromVegetal = 2;
var $author$project$Data$Textile$Material$Origin$fromString = function (origin) {
	switch (origin) {
		case 'ArtificialFromOrganic':
			return $elm$core$Result$Ok(0);
		case 'NaturalFromAnimal':
			return $elm$core$Result$Ok(1);
		case 'NaturalFromVegetal':
			return $elm$core$Result$Ok(2);
		case 'Synthetic':
			return $elm$core$Result$Ok(3);
		default:
			return $elm$core$Result$Err('Origine inconnue: ' + origin);
	}
};
var $author$project$Data$Textile$Material$Origin$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Textile$Material$Origin$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Textile$Material$CFFData = F2(
	function (manufacturerAllocation, recycledQualityRatio) {
		return {ja: manufacturerAllocation, jW: recycledQualityRatio};
	});
var $author$project$Data$Textile$Material$decodeCFFData = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'recycledQualityRatio',
	$author$project$Data$Split$decodeFloat,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'manufacturerAllocation',
		$author$project$Data$Split$decodeFloat,
		$elm$json$Json$Decode$succeed($author$project$Data$Textile$Material$CFFData)));
var $author$project$Data$Process$decodeFromId = function (processes) {
	return A2(
		$elm$json$Json$Decode$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Basics$identity,
			A2(
				$elm$core$Basics$composeR,
				function (id) {
					return A2($author$project$Data$Process$findById, id, processes);
				},
				$elm_community$json_extra$Json$Decode$Extra$fromResult)),
		$author$project$Data$Uuid$decoder);
};
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Data$Textile$Material$decode = function (processes) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'shortName',
		$elm$json$Json$Decode$string,
		A3(
			$author$project$Data$Common$DecodeUtils$strictOptional,
			'recycledProcessUuid',
			$author$project$Data$Process$decodeFromId(processes),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'recycledFrom',
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string)),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'origin',
					$author$project$Data$Textile$Material$Origin$decode,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'materialProcessUuid',
							$author$project$Data$Process$decodeFromId(processes),
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'geographicOrigin',
									$elm$json$Json$Decode$string,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'defaultCountry',
										A2($elm$json$Json$Decode$map, $author$project$Data$Country$codeFromString, $elm$json$Json$Decode$string),
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'cff',
											$elm$json$Json$Decode$maybe($author$project$Data$Textile$Material$decodeCFFData),
											$elm$json$Json$Decode$succeed($author$project$Data$Textile$Material$Material)))))))))));
};
var $author$project$Data$Textile$Material$decodeList = function (processes) {
	return $elm$json$Json$Decode$list(
		$author$project$Data$Textile$Material$decode(processes));
};
var $author$project$Data$Textile$Product$Product = function (economics) {
	return function (endOfLife) {
		return function (fabric) {
			return function (id) {
				return function (making) {
					return function (name) {
						return function (surfaceMass) {
							return function (trims) {
								return function (use) {
									return function (yarnSize) {
										return {ir: economics, ix: endOfLife, f_: fabric, H: id, eI: making, L: name, e5: surfaceMass, kv: trims, hu: use, kF: yarnSize};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Textile$Economics$Economics = F4(
	function (business, numberOfReferences, price, repairCost) {
		return {fC: business, gB: numberOfReferences, gM: price, gX: repairCost};
	});
var $author$project$Data$Textile$Economics$decode = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'repairCost',
	$author$project$Data$Textile$Economics$decodePrice,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'price',
		$author$project$Data$Textile$Economics$decodePrice,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'numberOfReferences',
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'business',
				$author$project$Data$Textile$Economics$decodeBusiness,
				$elm$json$Json$Decode$succeed($author$project$Data$Textile$Economics$Economics)))));
var $author$project$Data$Textile$Product$EndOfLifeOptions = function (volume) {
	return {kB: volume};
};
var $author$project$Data$Textile$Product$decodeEndOfLifeOptions = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'volume',
	A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Volume$cubicMeters, $elm$json$Json$Decode$float),
	$elm$json$Json$Decode$succeed($author$project$Data$Textile$Product$EndOfLifeOptions));
var $author$project$Data$Textile$Product$MakingOptions = F2(
	function (complexity, pcrWaste) {
		return {ef: complexity, gG: pcrWaste};
	});
var $author$project$Data$Textile$Product$decodeMakingOptions = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'pcrWaste',
	$author$project$Data$Split$decodeFloat,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'complexity',
		$author$project$Data$Textile$MakingComplexity$decode,
		$elm$json$Json$Decode$succeed($author$project$Data$Textile$Product$MakingOptions)));
var $author$project$Data$Textile$Product$UseOptions = F8(
	function (daysOfWear, defaultNbCycles, ironingElec, nonIroningProcess, ratioDryer, ratioIroning, timeIroning, wearsPerCycle) {
		return {ek: daysOfWear, fQ: defaultNbCycles, iW: ironingElec, jt: nonIroningProcess, gS: ratioDryer, gT: ratioIroning, hl: timeIroning, fn: wearsPerCycle};
	});
var $ianmackenzie$elm_units$Duration$days = function (numDays) {
	return $ianmackenzie$elm_units$Duration$seconds($ianmackenzie$elm_units$Constants$day * numDays);
};
var $ianmackenzie$elm_units$Duration$hours = function (numHours) {
	return $ianmackenzie$elm_units$Duration$seconds($ianmackenzie$elm_units$Constants$hour * numHours);
};
var $author$project$Data$Textile$Product$decodeUseOptions = function (processes) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'wearsPerCycle',
		$elm$json$Json$Decode$int,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'timeIroning',
			A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Duration$hours, $elm$json$Json$Decode$float),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'ratioIroning',
				$author$project$Data$Split$decodeFloat,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'ratioDryer',
					$author$project$Data$Split$decodeFloat,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'nonIroningProcessUuid',
						$author$project$Data$Process$decodeFromId(processes),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'ironingElecInMJ',
							A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Energy$megajoules, $elm$json$Json$Decode$float),
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'defaultNbCycles',
								$elm$json$Json$Decode$int,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'daysOfWear',
									A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Duration$days, $elm$json$Json$Decode$float),
									$elm$json$Json$Decode$succeed($author$project$Data$Textile$Product$UseOptions)))))))));
};
var $author$project$Data$Textile$Product$decode = function (processes) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'yarnSize',
		$author$project$Data$Unit$decodeYarnSize,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'use',
			$author$project$Data$Textile$Product$decodeUseOptions(processes),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'trims',
				$elm$json$Json$Decode$list($author$project$Data$Component$decodeItem),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'surfaceMass',
					$author$project$Data$Unit$decodeSurfaceMass,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'making',
							$author$project$Data$Textile$Product$decodeMakingOptions,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'fabric',
									$author$project$Data$Textile$Fabric$decode,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'endOfLife',
										$author$project$Data$Textile$Product$decodeEndOfLifeOptions,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'economics',
											$author$project$Data$Textile$Economics$decode,
											$elm$json$Json$Decode$succeed($author$project$Data$Textile$Product$Product)))))))))));
};
var $author$project$Data$Textile$Product$decodeList = function (processes) {
	return $elm$json$Json$Decode$list(
		$author$project$Data$Textile$Product$decode(processes));
};
var $author$project$Data$Textile$WellKnown$WellKnown = function (airTransport) {
	return function (bleaching) {
		return function (degreasing) {
			return function (distribution) {
				return function (dyeingCellulosic) {
					return function (dyeingProcessAverage) {
						return function (dyeingProcessContinuous) {
							return function (dyeingProcessDiscontinuous) {
								return function (dyeingSynthetic) {
									return function (elecMediumTensionAsia) {
										return function (endOfLife) {
											return function (fading) {
												return function (finishing) {
													return function (heatEurope) {
														return function (heatRoW) {
															return function (knittingCircular) {
																return function (knittingFullyFashioned) {
																	return function (knittingMix) {
																		return function (knittingSeamless) {
																			return function (knittingStraight) {
																				return function (lowVoltageFranceElec) {
																					return function (passengerCar) {
																						return function (printingDyes) {
																							return function (printingPaste) {
																								return function (printingPigment) {
																									return function (printingSubstantive) {
																										return function (roadTransport) {
																											return function (seaTransport) {
																												return function (trainTransport) {
																													return function (washingSyntheticFibers) {
																														return function (weaving) {
																															return {bX: airTransport, fy: bleaching, fS: degreasing, cO: distribution, il: dyeingCellulosic, im: dyeingProcessAverage, $9: dyeingProcessContinuous, io: dyeingProcessDiscontinuous, ip: dyeingSynthetic, iv: elecMediumTensionAsia, ix: endOfLife, cb: fading, iF: finishing, f5: heatEurope, f7: heatRoW, iY: knittingCircular, iZ: knittingFullyFashioned, i_: knittingMix, i$: knittingSeamless, i0: knittingStraight, i8: lowVoltageFranceElec, jF: passengerCar, gN: printingDyes, gO: printingPaste, gP: printingPigment, gQ: printingSubstantive, bI: roadTransport, cr: seaTransport, kq: trainTransport, hy: washingSyntheticFibers, kC: weaving};
																														};
																													};
																												};
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Textile$WellKnown$load = function (processes) {
	var fromIdString = A2(
		$elm$core$Basics$composeR,
		$author$project$Data$Process$idFromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$andThen(
				function (id) {
					return A2($author$project$Data$Process$findById, id, processes);
				}),
			$elm_community$result_extra$Result$Extra$andMap));
	return A2(
		fromIdString,
		'235b3488-6157-50ed-b74a-45e5d447dd85',
		A2(
			fromIdString,
			'7cdc9616-7fb4-5a69-9436-78e5b84ebf31',
			A2(
				fromIdString,
				'cdc841c2-493f-56d6-8fc2-ae5fad2a4917',
				A2(
					fromIdString,
					'20a62b2c-a543-5076-83aa-c5b7d340206a',
					A2(
						fromIdString,
						'46e96f29-9ca5-5475-bb3c-6397f43b7a5b',
						A2(
							fromIdString,
							'5c21e378-b941-57f7-98c9-67345847dbda',
							A2(
								fromIdString,
								'9418bfb4-34e5-5bba-920f-b50e2feff1bd',
								A2(
									fromIdString,
									'97c209ec-7782-5a29-8c47-af7f17c82d11',
									A2(
										fromIdString,
										'cfdc5e31-25fc-56ff-9a54-04670ecad301',
										A2(
											fromIdString,
											'2fd6b74f-600a-577c-ba37-b84d8f0482c2',
											A2(
												fromIdString,
												'931c9bb0-619a-5f75-b41b-ab8061e2ad92',
												A2(
													fromIdString,
													'8343adad-0350-5895-a701-4db41a235ba9',
													A2(
														fromIdString,
														'b2dba726-83d2-55b2-8107-91c9e47bdca7',
														A2(
															fromIdString,
															'29dc6c73-8d82-5056-8ac0-faf212bc0367',
															A2(
																fromIdString,
																'66ef36be-7691-5adc-a684-e83d45e53452',
																A2(
																	fromIdString,
																	'ddcf4b23-1283-57d3-854b-be3121452d50',
																	A2(
																		fromIdString,
																		'3561ace1-f710-50ce-a69c-9cf842e729e4',
																		A2(
																			fromIdString,
																			'f6ea2983-e024-5de2-b323-273f2436deba',
																			A2(
																				fromIdString,
																				'3c66588d-fffb-55cb-b9d5-c197b7e2e591',
																				A2(
																					fromIdString,
																					'24edc372-b238-5426-8ac9-059218936641',
																					A2(
																						fromIdString,
																						'ab96b73f-8534-59ad-9f34-a579abe3b023',
																						A2(
																							fromIdString,
																							'a2129ece-5dd9-5e66-969c-2603b3c97244',
																							A2(
																								fromIdString,
																								'e5e43c57-bd12-5ab7-8a22-7d12cdcece58',
																								A2(
																									fromIdString,
																									'7e17b44d-108a-504f-9e0d-0cfe5b5db054',
																									A2(
																										fromIdString,
																										'c8be445c-ae33-5240-9007-e7973e97fc24',
																										A2(
																											fromIdString,
																											'b7fa51fc-0421-57b0-bb0a-e0573e293c7a',
																											A2(
																												fromIdString,
																												'c49a5379-95c4-599a-84da-b5faaa345b97',
																												A2(
																													fromIdString,
																													'46e96f29-9ca5-5475-bb3c-6397f43b7a5b',
																													A2(
																														fromIdString,
																														'1746b5e1-1d0d-5858-a968-2ade8d778623',
																														A2(
																															fromIdString,
																															'b4251621-1747-526a-a54f-e4be7500efff',
																															A2(
																																fromIdString,
																																'326369d9-792a-5ab5-8276-c54108c80cb1',
																																$elm$core$Result$Ok($author$project$Data$Textile$WellKnown$WellKnown))))))))))))))))))))))))))))))));
};
var $author$project$Data$Textile$Db$buildFromJson = F4(
	function (exampleProductsJson, textileMaterialsJson, productsJson, processes) {
		return A2(
			$elm_community$result_extra$Result$Extra$andMap,
			$author$project$Data$Textile$WellKnown$load(processes),
			A2(
				$elm_community$result_extra$Result$Extra$andMap,
				A2(
					$elm$core$Result$mapError,
					$elm$json$Json$Decode$errorToString,
					A2(
						$elm$json$Json$Decode$decodeString,
						$author$project$Data$Textile$Product$decodeList(processes),
						productsJson)),
				A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2(
							$elm$json$Json$Decode$decodeString,
							$author$project$Data$Textile$Material$decodeList(processes),
							textileMaterialsJson)),
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						A2($author$project$Data$Example$decodeListFromJsonString, $author$project$Data$Textile$Query$decode, exampleProductsJson),
						$elm$core$Result$Ok($author$project$Data$Textile$Db$Db)))));
	});
var $author$project$Data$Country$Country = F7(
	function (aquaticPollutionScenario, code, electricityProcess, heatProcess, name, scopes, zone) {
		return {ft: aquaticPollutionScenario, cK: code, fX: electricityProcess, f6: heatProcess, L: name, M: scopes, hI: zone};
	});
var $author$project$Data$Zone$Africa = 0;
var $author$project$Data$Zone$Asia = 1;
var $author$project$Data$Zone$MiddleEast = 3;
var $author$project$Data$Zone$NorthAmerica = 4;
var $author$project$Data$Zone$Oceania = 5;
var $author$project$Data$Zone$SouthAmerica = 6;
var $author$project$Data$Zone$fromString = function (string) {
	switch (string) {
		case 'Africa':
			return $elm$core$Result$Ok(0);
		case 'Asia':
			return $elm$core$Result$Ok(1);
		case 'Europe':
			return $elm$core$Result$Ok(2);
		case 'Middle_East':
			return $elm$core$Result$Ok(3);
		case 'North_America':
			return $elm$core$Result$Ok(4);
		case 'Oceania':
			return $elm$core$Result$Ok(5);
		case 'South_America':
			return $elm$core$Result$Ok(6);
		default:
			return $elm$core$Result$Err('Zone géographique inconnue : ' + string);
	}
};
var $author$project$Data$Zone$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Zone$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Country$Average = 0;
var $author$project$Data$Country$Best = 1;
var $author$project$Data$Country$Worst = 2;
var $author$project$Data$Country$aquaticPollutionScenarioFromString = function (string) {
	switch (string) {
		case 'Average':
			return $elm$core$Result$Ok(0);
		case 'Best':
			return $elm$core$Result$Ok(1);
		case 'Worst':
			return $elm$core$Result$Ok(2);
		default:
			return $elm$core$Result$Err('Le scenario \'' + (string + '\' n\'est pas un scénario de pollution aquatique valide (choix entre [\'Best\', \'Average\', \'Worst\']'));
	}
};
var $author$project$Data$Country$decodeAquaticPollutionScenario = A2(
	$elm$json$Json$Decode$andThen,
	$elm_community$json_extra$Json$Decode$Extra$fromResult,
	A2($elm$json$Json$Decode$map, $author$project$Data$Country$aquaticPollutionScenarioFromString, $elm$json$Json$Decode$string));
var $author$project$Data$Country$decode = function (processes) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'zone',
		$author$project$Data$Zone$decode,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'scopes',
			$elm$json$Json$Decode$list($author$project$Data$Scope$decode),
			_List_fromArray(
				[0, 2]),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'name',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'heatProcessUuid',
					$author$project$Data$Process$decodeFromId(processes),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'electricityProcessUuid',
						$author$project$Data$Process$decodeFromId(processes),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'code',
							$author$project$Data$Country$decodeCode,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'aquaticPollutionScenario',
								$author$project$Data$Country$decodeAquaticPollutionScenario,
								$elm$json$Json$Decode$succeed($author$project$Data$Country$Country))))))));
};
var $author$project$Data$Country$decodeList = function (processes) {
	return $elm$json$Json$Decode$list(
		$author$project$Data$Country$decode(processes));
};
var $author$project$Data$Common$Db$countriesFromJson = function (processes) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$decodeString(
			$author$project$Data$Country$decodeList(processes)),
		$elm$core$Result$mapError($elm$json$Json$Decode$errorToString));
};
var $author$project$Static$Json$countriesJson = '[{"aquaticPollutionScenario":"Worst","code":"---","electricityProcessUuid":"ed6d177e-44bb-5ba4-beec-d683dc21be9f","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Pays inconnu (par défaut)","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Best","code":"REO","electricityProcessUuid":"ee114bf1-8c51-5c1e-8065-d762400447e2","heatProcessUuid":"f6ea2983-e024-5de2-b323-273f2436deba","name":"Région - Europe de l\'Ouest","scopes":["textile"],"zone":"Europe"},{"aquaticPollutionScenario":"Best","code":"REE","electricityProcessUuid":"5ee392cf-954e-56c8-b555-427d55023548","heatProcessUuid":"f6ea2983-e024-5de2-b323-273f2436deba","name":"Région - Europe de l\'Est","scopes":["textile"],"zone":"Europe"},{"aquaticPollutionScenario":"Worst","code":"RAS","electricityProcessUuid":"a2129ece-5dd9-5e66-969c-2603b3c97244","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Asie","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Worst","code":"RAF","electricityProcessUuid":"15958106-68d0-5130-8ed8-d8557cdcc1fa","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Afrique","scopes":["textile"],"zone":"Africa"},{"aquaticPollutionScenario":"Average","code":"RME","electricityProcessUuid":"fe6437fa-5d9a-5a7f-a2a8-430066232e5c","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Moyen-Orient","scopes":["textile"],"zone":"Middle_East"},{"aquaticPollutionScenario":"Average","code":"RLA","electricityProcessUuid":"aa315629-988f-5886-bafe-247821f356fc","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Amérique Latine","scopes":["textile"],"zone":"South_America"},{"aquaticPollutionScenario":"Worst","code":"RNA","electricityProcessUuid":"6911c87b-6cf9-5b33-be9a-e50a9e132575","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Amérique du nord","scopes":["textile"],"zone":"North_America"},{"aquaticPollutionScenario":"Worst","code":"ROC","electricityProcessUuid":"05bcd5b4-09eb-5f9c-8a02-fd9d91412ccf","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Région - Océanie","scopes":["textile"],"zone":"Oceania"},{"aquaticPollutionScenario":"Worst","code":"MM","electricityProcessUuid":"3b57b822-5e54-5116-b07d-55bcedcd6abf","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Myanmar","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Worst","code":"BD","electricityProcessUuid":"26055a0a-ec6d-5985-a220-84841949077d","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Bangladesh","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Worst","code":"BR","electricityProcessUuid":"2fac57eb-e7e7-5008-94fa-a943010112df","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Brésil","scopes":["food"],"zone":"South_America"},{"aquaticPollutionScenario":"Average","code":"CN","electricityProcessUuid":"251fa8f5-3e07-5f37-8bed-fa42a367f262","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Chine","scopes":["food","textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Best","code":"ES","electricityProcessUuid":"5d7e3f90-7c23-560d-bc71-8e726fb4549e","heatProcessUuid":"f6ea2983-e024-5de2-b323-273f2436deba","name":"Espagne","scopes":["food"],"zone":"Europe"},{"aquaticPollutionScenario":"Best","code":"FR","electricityProcessUuid":"c94d8ad5-9d44-5f1b-80b9-53ff0a4e2406","heatProcessUuid":"f6ea2983-e024-5de2-b323-273f2436deba","name":"France","scopes":["food","textile"],"zone":"Europe"},{"aquaticPollutionScenario":"Worst","code":"IN","electricityProcessUuid":"ed6d177e-44bb-5ba4-beec-d683dc21be9f","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Inde","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Best","code":"IT","electricityProcessUuid":"56055c38-1483-56c0-97d7-d66e66665a0c","heatProcessUuid":"f6ea2983-e024-5de2-b323-273f2436deba","name":"Italie","scopes":["food"],"zone":"Europe"},{"aquaticPollutionScenario":"Average","code":"KE","electricityProcessUuid":"73bfddbc-a57d-51f4-80dc-3c3fc9477dcb","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Kenya","scopes":["food"],"zone":"Africa"},{"aquaticPollutionScenario":"Average","code":"KH","electricityProcessUuid":"e274d3fd-eee9-54dc-ba1a-ca14a8717e93","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Cambodge","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Average","code":"MA","electricityProcessUuid":"a3197e15-9193-5212-8be9-77a3a9961d96","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Maroc","scopes":["food","textile"],"zone":"Africa"},{"aquaticPollutionScenario":"Best","code":"NZ","electricityProcessUuid":"2d7bf521-6ab0-5e08-9175-75ae8835a4fa","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Nouvelle-Zélande","scopes":["food"],"zone":"Oceania"},{"aquaticPollutionScenario":"Worst","code":"PE","electricityProcessUuid":"239bfc03-92d6-5a23-bba9-877ffb6d1757","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Pérou","scopes":["food"],"zone":"South_America"},{"aquaticPollutionScenario":"Worst","code":"PK","electricityProcessUuid":"1f73a42e-c744-5842-9358-27b35ee3295b","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Pakistan","scopes":["textile"],"zone":"Asia"},{"aquaticPollutionScenario":"Average","code":"TN","electricityProcessUuid":"f32261a1-a93e-5b57-b5a5-0f79d4a0244b","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Tunisie","scopes":["textile"],"zone":"Africa"},{"aquaticPollutionScenario":"Average","code":"TR","electricityProcessUuid":"930c987b-9fcc-5bfb-a5fd-f3cb2d7e420a","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Turquie","scopes":["textile"],"zone":"Middle_East"},{"aquaticPollutionScenario":"Best","code":"US","electricityProcessUuid":"5756830a-a96c-5303-b6aa-a15cc727daaa","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Etats-Unis","scopes":["food"],"zone":"North_America"},{"aquaticPollutionScenario":"Average","code":"VN","electricityProcessUuid":"f3ad3ac5-731a-5ef5-b9e1-13ce71780444","heatProcessUuid":"3561ace1-f710-50ce-a69c-9cf842e729e4","name":"Vietnam","scopes":["textile"],"zone":"Asia"}]';
var $author$project$Static$Db$countries = function (processes) {
	return A2($author$project$Data$Common$Db$countriesFromJson, processes, $author$project$Static$Json$countriesJson);
};
var $author$project$Data$Impact$Definition$Trigrams = function (acd) {
	return function (cch) {
		return function (etf) {
			return function (etfc) {
				return function (fru) {
					return function (fwe) {
						return function (htc) {
							return function (htcc) {
								return function (htn) {
									return function (htnc) {
										return function (ior) {
											return function (ldu) {
												return function (mru) {
													return function (ozd) {
														return function (pco) {
															return function (pma) {
																return function (swe) {
																	return function (tre) {
																		return function (wtu) {
																			return function (ecs) {
																				return function (pef) {
																					return {a6: acd, a9: cch, be: ecs, bg: etf, bh: etfc, bm: fru, bn: fwe, bp: htc, bq: htcc, br: htn, bs: htnc, bt: ior, bu: ldu, by: mru, bA: ozd, bD: pco, bE: pef, bF: pma, bK: swe, bR: tre, bW: wtu};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Impact$Definition$decodeWithoutAggregated = function (decoder) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'wtu',
		decoder('wtu'),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'tre',
			decoder('tre'),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'swe',
				decoder('swe'),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'pma',
					decoder('pma'),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'pco',
						decoder('pco'),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'ozd',
							decoder('ozd'),
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'mru',
								decoder('mru'),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'ldu',
									decoder('ldu'),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'ior',
										decoder('ior'),
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'htn-c',
											decoder('htn-c'),
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'htn',
												decoder('htn'),
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'htc-c',
													decoder('htc-c'),
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'htc',
														decoder('htc'),
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'fwe',
															decoder('fwe'),
															A3(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																'fru',
																decoder('fru'),
																A3(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																	'etf-c',
																	decoder('etf-c'),
																	A3(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																		'etf',
																		decoder('etf'),
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'cch',
																			decoder('cch'),
																			A3(
																				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																				'acd',
																				decoder('acd'),
																				$elm$json$Json$Decode$succeed($author$project$Data$Impact$Definition$Trigrams))))))))))))))))))));
};
var $author$project$Data$Impact$Definition$decodeBase = function (decoder) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'pef',
		decoder('pef'),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'ecs',
			decoder('ecs'),
			$author$project$Data$Impact$Definition$decodeWithoutAggregated(decoder)));
};
var $author$project$Data$Impact$decodeImpacts = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$identity,
	$author$project$Data$Impact$Definition$decodeBase(
		$elm$core$Basics$always($author$project$Data$Unit$decodeImpact)));
var $author$project$Data$Process$Process = function (categories) {
	return function (comment) {
		return function (density) {
			return function (displayName) {
				return function (elec) {
					return function (heat) {
						return function (id) {
							return function (impacts) {
								return function (scopes) {
									return function (source) {
										return function (sourceId) {
											return function (unit) {
												return function (waste) {
													return {eb: categories, fJ: comment, ie: density, em: displayName, eo: elec, ez: heat, H: id, z: impacts, M: scopes, hc: source, e0: sourceId, hs: unit, hz: waste};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Process$Category$EndOfLife = {$: 0};
var $author$project$Data$Process$Category$Energy = {$: 1};
var $author$project$Data$Process$Category$Ingredient = {$: 2};
var $author$project$Data$Process$Category$Material = {$: 3};
var $author$project$Data$Process$Category$MaterialType = function (a) {
	return {$: 4, a: a};
};
var $author$project$Data$Process$Category$TextileMaterial = {$: 6};
var $author$project$Data$Process$Category$Transport = {$: 8};
var $author$project$Data$Process$Category$Use = {$: 9};
var $author$project$Data$Process$Category$WasteTreatment = {$: 10};
var $author$project$Data$Process$Category$fromString = function (string) {
	switch (string) {
		case 'eol':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$EndOfLife);
		case 'energy':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Energy);
		case 'ingredient':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Ingredient);
		case 'material':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Material);
		case 'packaging':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Packaging);
		case 'textile_material':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$TextileMaterial);
		case 'transformation':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Transform);
		case 'transport':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Transport);
		case 'use':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$Use);
		case 'waste treatment':
			return $elm$core$Result$Ok($author$project$Data$Process$Category$WasteTreatment);
		default:
			return A2($elm$core$String$startsWith, 'material_type:', string) ? $elm$core$Result$Ok(
				$author$project$Data$Process$Category$MaterialType(
					A2($elm$core$String$dropLeft, 14, string))) : $elm$core$Result$Err('Catégorie de procédé invalide: ' + string);
	}
};
var $author$project$Data$Process$Category$decodeList = $elm$json$Json$Decode$list(
	A2(
		$elm$json$Json$Decode$andThen,
		A2($elm$core$Basics$composeR, $author$project$Data$Process$Category$fromString, $elm_community$json_extra$Json$Decode$Extra$fromResult),
		$elm$json$Json$Decode$string));
var $author$project$Data$Common$DecodeUtils$decodeNonEmptyString = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		return ($elm$core$String$trim(str) === '') ? $elm$json$Json$Decode$fail('String can\'t be empty') : $elm$json$Json$Decode$succeed(
			$elm$core$String$trim(str));
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$Process$SourceId = $elm$core$Basics$identity;
var $author$project$Data$Process$sourceIdFromString = $elm$core$Basics$identity;
var $author$project$Data$Process$decode = function (impactsDecoder) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'waste',
		$author$project$Data$Split$decodeFloat,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'unit',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'sourceId',
				A2($elm$json$Json$Decode$map, $author$project$Data$Process$sourceIdFromString, $author$project$Data$Common$DecodeUtils$decodeNonEmptyString),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'source',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'scopes',
						$elm$json$Json$Decode$list($author$project$Data$Scope$decode),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'impacts',
							impactsDecoder,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								$author$project$Data$Process$decodeId,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'heatMJ',
									A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Energy$megajoules, $elm$json$Json$Decode$float),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'elecMJ',
										A2($elm$json$Json$Decode$map, $ianmackenzie$elm_units$Energy$megajoules, $elm$json$Json$Decode$float),
										A3(
											$author$project$Data$Common$DecodeUtils$strictOptional,
											'displayName',
											$author$project$Data$Common$DecodeUtils$decodeNonEmptyString,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'density',
												$elm$json$Json$Decode$float,
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'comment',
													$elm$json$Json$Decode$string,
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'categories',
														$author$project$Data$Process$Category$decodeList,
														$elm$json$Json$Decode$succeed($author$project$Data$Process$Process))))))))))))));
};
var $author$project$Data$Process$decodeList = A2($elm$core$Basics$composeR, $author$project$Data$Process$decode, $elm$json$Json$Decode$list);
var $author$project$Data$Component$Component = F4(
	function (elements, id, name, scopes) {
		return {o: elements, H: id, L: name, M: scopes};
	});
var $author$project$Data$Scope$all = _List_fromArray(
	[0, 1, 2, 3]);
var $author$project$Data$Component$decode = A2(
	$elm$json$Json$Decode$andThen,
	function (component) {
		var _v0 = $elm$core$List$head(component.M);
		if (!_v0.$) {
			var scope = _v0.a;
			return $elm$json$Json$Decode$succeed(
				_Utils_update(
					component,
					{
						M: _List_fromArray(
							[scope])
					}));
		} else {
			return $elm$json$Json$Decode$fail(
				'Aucun scope pour le composant id=' + $author$project$Data$Component$idToString(component.H));
		}
	},
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'scopes',
		$elm$json$Json$Decode$list($author$project$Data$Scope$decode),
		$author$project$Data$Scope$all,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $author$project$Data$Uuid$decoder),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'elements',
					$elm$json$Json$Decode$list($author$project$Data$Component$decodeElement),
					$elm$json$Json$Decode$succeed($author$project$Data$Component$Component))))));
var $author$project$Data$Component$decodeList = $elm$json$Json$Decode$list($author$project$Data$Component$decode);
var $author$project$Data$Component$decodeListFromJsonString = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$decodeString($author$project$Data$Component$decodeList),
	$elm$core$Result$mapError($elm$json$Json$Decode$errorToString));
var $author$project$Static$Db$decodeScopedComponents = $author$project$Data$Component$decodeListFromJsonString;
var $author$project$Static$Db$decodeRawComponents = function (_v0) {
	var objectComponents = _v0.jx;
	var textileComponents = _v0.kl;
	var veliComponents = _v0.kA;
	return A2(
		$elm$core$Result$map,
		$elm$core$List$concat,
		$elm_community$result_extra$Result$Extra$combine(
			A2(
				$elm$core$List$map,
				$author$project$Static$Db$decodeScopedComponents,
				_List_fromArray(
					[objectComponents, textileComponents, veliComponents]))));
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $turboMaCk$any_dict$Dict$Any$AnyDict = $elm$core$Basics$identity;
var $turboMaCk$any_dict$Dict$Any$empty = function (toKey) {
	return {g: $elm$core$Dict$empty, ae: toKey};
};
var $turboMaCk$any_dict$Dict$Any$insert = F3(
	function (k, v, _v0) {
		var inner = _v0;
		return _Utils_update(
			inner,
			{
				g: A3(
					$elm$core$Dict$insert,
					inner.ae(k),
					_Utils_Tuple2(k, v),
					inner.g)
			});
	});
var $turboMaCk$any_dict$Dict$Any$decode = F3(
	function (fromStr, toComparable, valueD) {
		var construct = F3(
			function (strK, v, acc) {
				return A3(
					$turboMaCk$any_dict$Dict$Any$insert,
					A2(fromStr, strK, v),
					v,
					acc);
			});
		return A2(
			$elm$json$Json$Decode$map,
			A2(
				$elm$core$Dict$foldr,
				construct,
				$turboMaCk$any_dict$Dict$Any$empty(toComparable)),
			$elm$json$Json$Decode$dict(valueD));
	});
var $author$project$Data$Transport$Transport = F6(
	function (air, impacts, road, roadCooled, sea, seaCooled) {
		return {hK: air, z: impacts, dP: road, j2: roadCooled, g4: sea, j7: seaCooled};
	});
var $author$project$Data$Transport$decodeKm = A2(
	$elm$json$Json$Decode$map,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map($ianmackenzie$elm_units$Length$kilometers),
		$elm$core$Maybe$withDefault($ianmackenzie$elm_units$Quantity$zero)),
	$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$Data$Transport$decode = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Data$Transport$Transport,
	A2($elm$json$Json$Decode$field, 'air', $author$project$Data$Transport$decodeKm),
	$elm$json$Json$Decode$succeed($author$project$Data$Impact$empty),
	A2($elm$json$Json$Decode$field, 'road', $author$project$Data$Transport$decodeKm),
	$elm$json$Json$Decode$succeed($ianmackenzie$elm_units$Quantity$zero),
	A2($elm$json$Json$Decode$field, 'sea', $author$project$Data$Transport$decodeKm),
	$elm$json$Json$Decode$succeed($ianmackenzie$elm_units$Quantity$zero));
var $author$project$Data$Transport$decodeDistance = A3(
	$turboMaCk$any_dict$Dict$Any$decode,
	F2(
		function (str, _v0) {
			return $author$project$Data$Country$codeFromString(str);
		}),
	$author$project$Data$Country$codeToString,
	$author$project$Data$Transport$decode);
var $author$project$Data$Transport$decodeDistances = A3(
	$turboMaCk$any_dict$Dict$Any$decode,
	F2(
		function (str, _v0) {
			return $author$project$Data$Country$codeFromString(str);
		}),
	$author$project$Data$Country$codeToString,
	$author$project$Data$Transport$decodeDistance);
var $author$project$Data$Common$Db$transportsFromJson = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$decodeString($author$project$Data$Transport$decodeDistances),
	$elm$core$Result$mapError($elm$json$Json$Decode$errorToString));
var $author$project$Static$Json$transportsJson = '{"---":{"---":{"air":500,"road":500,"sea":null},"BD":{"air":1413,"road":1503,"sea":4187},"BR":{"air":14772,"road":null,"sea":16189},"CN":{"air":3210,"road":4758,"sea":11274},"ES":{"air":7860,"road":25614,"sea":11311},"FR":{"air":7291,"road":23612,"sea":11961},"IN":{"air":500,"road":500,"sea":null},"IT":{"air":6436,"road":20303,"sea":8128},"KE":{"air":4736,"road":null,"sea":5186},"KH":{"air":3083,"road":11851,"sea":6020},"MA":{"air":8132,"road":null,"sea":9793},"MM":{"air":2193,"road":3109,"sea":4625},"NZ":{"air":12016,"road":null,"sea":14067},"PE":{"air":16929,"road":null,"sea":19978},"PK":{"air":1313,"road":2263,"sea":2181},"RAF":{"air":4404,"road":null,"sea":3649},"RAS":{"air":3210,"road":4758,"sea":11274},"REE":{"air":6298,"road":20861,"sea":8601},"REO":{"air":7860,"road":25614,"sea":11311},"RLA":{"air":14772,"road":null,"sea":16189},"RME":{"air":4531,"road":15041,"sea":6670},"RNA":{"air":13554,"road":null,"sea":19102},"ROC":{"air":7969,"road":null,"sea":9770},"TN":{"air":6806,"road":null,"sea":8049},"TR":{"air":4531,"road":15041,"sea":6670},"US":{"air":13554,"road":null,"sea":19102},"VN":{"air":3099,"road":11470,"sea":6845}},"BD":{"BD":{"air":500,"road":500,"sea":null},"BR":{"air":16009,"road":null,"sea":19020},"CN":{"air":1894,"road":2936,"sea":9244},"ES":{"air":8658,"road":27584,"sea":13824},"FR":{"air":7982,"road":25449,"sea":14450},"IN":{"air":1413,"road":1503,"sea":4187},"IT":{"air":7221,"road":22265,"sea":10617},"KE":{"air":6149,"road":null,"sea":7099},"KH":{"air":1995,"road":2706,"sea":3990},"MA":{"air":9077,"road":null,"sea":12282},"MM":{"air":849,"road":1197,"sea":1170},"NZ":{"air":11246,"road":null,"sea":12094},"PE":{"air":17872,"road":null,"sea":22667},"PK":{"air":2090,"road":2596,"sea":5582},"RAF":{"air":5804,"road":null,"sea":6105},"RAS":{"air":1894,"road":2936,"sea":9244},"REE":{"air":6914,"road":22476,"sea":11088},"REO":{"air":8658,"road":27584,"sea":13824},"RLA":{"air":16009,"road":null,"sea":19020},"RME":{"air":5397,"road":6187,"sea":9114},"RNA":{"air":13103,"road":null,"sea":26331},"ROC":{"air":7294,"road":null,"sea":8753},"TN":{"air":7771,"road":null,"sea":10538},"TR":{"air":5397,"road":6187,"sea":9114},"US":{"air":13103,"road":null,"sea":26331},"VN":{"air":1892,"road":2595,"sea":4815}},"BR":{"BR":{"air":500,"road":500,"sea":null},"CN":{"air":16580,"road":null,"sea":25166},"ES":{"air":7627,"road":null,"sea":7695},"FR":{"air":8401,"road":null,"sea":8315},"IN":{"air":14772,"road":null,"sea":16189},"IT":{"air":9012,"road":null,"sea":9548},"KE":{"air":10366,"road":null,"sea":14094},"KH":{"air":17829,"road":null,"sea":20106},"MA":{"air":7061,"road":null,"sea":6422},"MM":{"air":16857,"road":null,"sea":19506},"NZ":{"air":12462,"road":null,"sea":21910},"PE":{"air":2302,"road":3429,"sea":6907},"PK":{"air":13927,"road":null,"sea":16457},"RAF":{"air":10497,"road":null,"sea":12738},"RAS":{"air":16580,"road":null,"sea":25166},"REE":{"air":9489,"road":null,"sea":10074},"REO":{"air":7627,"road":null,"sea":7695},"RLA":{"air":500,"road":500,"sea":null},"RME":{"air":10704,"road":null,"sea":10337},"RNA":{"air":6877,"road":null,"sea":7499},"ROC":{"air":15822,"road":null,"sea":19187},"TN":{"air":8321,"road":null,"sea":8573},"TR":{"air":10704,"road":null,"sea":10337},"US":{"air":6877,"road":null,"sea":7499},"VN":{"air":17869,"road":null,"sea":20931}},"CN":{"CN":{"air":500,"road":500,"sea":null},"ES":{"air":8976,"road":9977,"sea":20899},"FR":{"air":8189,"road":9005,"sea":21549},"IN":{"air":3210,"road":4758,"sea":11274},"IT":{"air":7630,"road":8870,"sea":17716},"KE":{"air":7866,"road":null,"sea":14016},"KH":{"air":2437,"road":3100,"sea":5771},"MA":{"air":9604,"road":null,"sea":19381},"MM":{"air":1594,"road":1983,"sea":9348},"NZ":{"air":10977,"road":null,"sea":11949},"PE":{"air":17233,"road":null,"sea":19362},"PK":{"air":3318,"road":4492,"sea":12627},"RAF":{"air":7413,"road":null,"sea":13204},"RAS":{"air":500,"road":500,"sea":null},"REE":{"air":7105,"road":7931,"sea":18166},"REO":{"air":8976,"road":9977,"sea":20899},"RLA":{"air":16580,"road":null,"sea":25166},"RME":{"air":6090,"road":7258,"sea":16189},"RNA":{"air":11611,"road":null,"sea":27066},"ROC":{"air":7469,"road":null,"sea":11574},"TN":{"air":8417,"road":null,"sea":17637},"TR":{"air":6090,"road":7258,"sea":16189},"US":{"air":11611,"road":null,"sea":27066},"VN":{"air":2107,"road":2644,"sea":4704}},"ES":{"ES":{"air":500,"road":500,"sea":null},"FR":{"air":826,"road":912,"sea":1672},"IN":{"air":7860,"road":25614,"sea":11311},"IT":{"air":1439,"road":1672,"sea":4669},"KE":{"air":6054,"road":null,"sea":11276},"KH":{"air":10649,"road":34608,"sea":15644},"MA":{"air":892,"road":null,"sea":1891},"MM":{"air":9430,"road":31035,"sea":14286},"NZ":{"air":19814,"road":null,"sea":23649},"PE":{"air":9226,"road":null,"sea":11052},"PK":{"air":6654,"road":7520,"sea":11764},"RAF":{"air":5469,"road":null,"sea":7870},"RAS":{"air":8976,"road":9977,"sea":20899},"REE":{"air":1875,"road":2133,"sea":5124},"REO":{"air":500,"road":500,"sea":null},"RLA":{"air":7627,"road":null,"sea":7695},"RME":{"air":3329,"road":3773,"sea":5458},"RNA":{"air":7651,"road":null,"sea":10045},"ROC":{"air":15822,"road":null,"sea":18853},"TN":{"air":1333,"road":null,"sea":3694},"TR":{"air":3329,"road":3773,"sea":5458},"US":{"air":7651,"road":null,"sea":10045},"VN":{"air":10499,"road":33893,"sea":16469}},"FR":{"FR":{"air":500,"road":500,"sea":null},"IN":{"air":7291,"road":23612,"sea":11961},"IT":{"air":931,"road":1030,"sea":5319},"KE":{"air":6097,"road":null,"sea":11768},"KH":{"air":9959,"road":32255,"sea":16294},"MA":{"air":1667,"road":null,"sea":2541},"MM":{"air":8725,"road":28649,"sea":14936},"NZ":{"air":19162,"road":null,"sea":24299},"PE":{"air":9891,"road":null,"sea":11541},"PK":{"air":6038,"road":6728,"sea":12403},"RAF":{"air":5437,"road":null,"sea":8520},"RAS":{"air":8189,"road":9005,"sea":21549},"REE":{"air":1091,"road":1206,"sea":5769},"REO":{"air":826,"road":912,"sea":1672},"RLA":{"air":8401,"road":null,"sea":8315},"RME":{"air":2799,"road":2971,"sea":6108},"RNA":{"air":7700,"road":null,"sea":9031},"ROC":{"air":15244,"road":null,"sea":19503},"TN":{"air":1459,"road":null,"sea":4344},"TR":{"air":2799,"road":2971,"sea":6108},"US":{"air":7700,"road":null,"sea":9031},"VN":{"air":9787,"road":31498,"sea":17119}},"IN":{"IN":{"air":500,"road":500,"sea":null},"IT":{"air":6436,"road":20303,"sea":8128},"KE":{"air":4736,"road":null,"sea":5186},"KH":{"air":3083,"road":11851,"sea":6020},"MA":{"air":8132,"road":null,"sea":9793},"MM":{"air":2193,"road":3109,"sea":4625},"NZ":{"air":12016,"road":null,"sea":14067},"PE":{"air":16929,"road":null,"sea":19978},"PK":{"air":1313,"road":2263,"sea":2181},"RAF":{"air":4404,"road":null,"sea":3649},"RAS":{"air":3210,"road":4758,"sea":11274},"REE":{"air":6298,"road":20861,"sea":8601},"REO":{"air":7860,"road":25614,"sea":11311},"RLA":{"air":14772,"road":null,"sea":16189},"RME":{"air":4531,"road":15041,"sea":6670},"RNA":{"air":13554,"road":null,"sea":19102},"ROC":{"air":7969,"road":null,"sea":9770},"TN":{"air":6806,"road":null,"sea":8049},"TR":{"air":4531,"road":15041,"sea":6670},"US":{"air":13554,"road":null,"sea":19102},"VN":{"air":3099,"road":11470,"sea":6845}},"IT":{"IT":{"air":500,"road":500,"sea":null},"KE":{"air":5269,"road":null,"sea":8012},"KH":{"air":9214,"road":30814,"sea":12462},"MA":{"air":1977,"road":null,"sea":3152},"MM":{"air":7999,"road":27229,"sea":11104},"NZ":{"air":18450,"road":null,"sea":20469},"PE":{"air":10665,"road":null,"sea":13346},"PK":{"air":5217,"road":6283,"sea":8398},"RAF":{"air":4577,"road":null,"sea":4687},"RAS":{"air":7630,"road":8870,"sea":17716},"REE":{"air":796,"road":1024,"sea":694},"REO":{"air":1439,"road":1672,"sea":4669},"RLA":{"air":9012,"road":null,"sea":9548},"RME":{"air":1909,"road":2527,"sea":2228},"RNA":{"air":8599,"road":null,"sea":12465},"ROC":{"air":14404,"road":null,"sea":15670},"TN":{"air":1036,"road":null,"sea":1594},"TR":{"air":1909,"road":2527,"sea":2228},"US":{"air":8599,"road":null,"sea":12465},"VN":{"air":9070,"road":30110,"sea":13286}},"KE":{"KE":{"air":500,"road":500,"sea":null},"KH":{"air":7500,"road":null,"sea":8841},"MA":{"air":5666,"road":13755,"sea":9726},"MM":{"air":6894,"road":null,"sea":7556},"NZ":{"air":13760,"road":null,"sea":14149},"PE":{"air":12668,"road":null,"sea":19703},"PK":{"air":4664,"road":null,"sea":5622},"RAF":{"air":774,"road":1025,"sea":3501},"RAS":{"air":7866,"road":null,"sea":14016},"REE":{"air":5811,"road":null,"sea":8383},"REO":{"air":6054,"road":null,"sea":11276},"RLA":{"air":10366,"road":null,"sea":14094},"RME":{"air":4219,"road":null,"sea":6539},"RNA":{"air":13701,"road":null,"sea":18244},"ROC":{"air":10562,"road":null,"sea":10608},"TN":{"air":4740,"road":6470,"sea":7964},"TR":{"air":4219,"road":null,"sea":6539},"US":{"air":13701,"road":null,"sea":18244},"VN":{"air":7635,"road":null,"sea":9523}},"KH":{"KH":{"air":500,"road":500,"sea":null},"MA":{"air":11068,"road":null,"sea":14127},"MM":{"air":1242,"road":1909,"sea":4093},"NZ":{"air":9258,"road":null,"sea":9625},"PE":{"air":19657,"road":null,"sea":19933},"PK":{"air":4062,"road":15555,"sea":7489},"RAF":{"air":7337,"road":null,"sea":7950},"RAS":{"air":2437,"road":3100,"sea":5771},"REE":{"air":8881,"road":29303,"sea":13074},"REO":{"air":10649,"road":34608,"sea":15644},"RLA":{"air":17829,"road":null,"sea":20106},"RME":{"air":7389,"road":25323,"sea":10934},"RNA":{"air":13914,"road":null,"sea":23101},"ROC":{"air":5361,"road":null,"sea":6964},"TN":{"air":9757,"road":null,"sea":12382},"TR":{"air":7389,"road":25323,"sea":10934},"US":{"air":13914,"road":null,"sea":23101},"VN":{"air":349,"road":530,"sea":1333}},"MA":{"MA":{"air":500,"road":500,"sea":null},"MM":{"air":9886,"road":null,"sea":12769},"NZ":{"air":19001,"road":null,"sea":22131},"PE":{"air":8852,"road":null,"sea":10243},"PK":{"air":7012,"road":null,"sea":10112},"RAF":{"air":5174,"road":17569,"sea":6353},"RAS":{"air":9604,"road":null,"sea":19381},"REE":{"air":2604,"road":null,"sea":3729},"REO":{"air":892,"road":null,"sea":1891},"RLA":{"air":7061,"road":null,"sea":6422},"RME":{"air":3681,"road":null,"sea":3941},"RNA":{"air":8064,"road":null,"sea":9509},"ROC":{"air":15943,"road":null,"sea":17336},"TN":{"air":1326,"road":1910,"sea":2176},"TR":{"air":3681,"road":null,"sea":3941},"US":{"air":8064,"road":null,"sea":9509},"VN":{"air":10957,"road":null,"sea":14952}},"MM":{"MM":{"air":500,"road":500,"sea":null},"NZ":{"air":10483,"road":null,"sea":12179},"PE":{"air":18535,"road":null,"sea":22663},"PK":{"air":2931,"road":3795,"sea":6039},"RAF":{"air":6596,"road":null,"sea":6592},"RAS":{"air":1594,"road":1983,"sea":9348},"REE":{"air":7645,"road":25678,"sea":11661},"REO":{"air":9430,"road":31035,"sea":14286},"RLA":{"air":16857,"road":null,"sea":19506},"RME":{"air":6208,"road":7455,"sea":9576},"RNA":{"air":13181,"road":null,"sea":26435},"ROC":{"air":6603,"road":null,"sea":8885},"TN":{"air":8590,"road":null,"sea":11024},"TR":{"air":6208,"road":7455,"sea":9576},"US":{"air":13181,"road":null,"sea":26435},"VN":{"air":1072,"road":1468,"sea":4918}},"NZ":{"NZ":{"air":500,"road":500,"sea":null},"PE":{"air":10917,"road":null,"sea":10704},"PK":{"air":13234,"road":null,"sea":15659},"RAF":{"air":14348,"road":null,"sea":15958},"RAS":{"air":10977,"road":null,"sea":11949},"REE":{"air":18081,"road":null,"sea":19719},"REO":{"air":19814,"road":null,"sea":23649},"RLA":{"air":12462,"road":null,"sea":21910},"RME":{"air":16547,"road":null,"sea":18942},"RNA":{"air":12569,"road":null,"sea":15880},"ROC":{"air":4049,"road":null,"sea":3897},"TN":{"air":18485,"road":null,"sea":20389},"TR":{"air":16547,"road":null,"sea":18942},"US":{"air":12569,"road":null,"sea":15880},"VN":{"air":9416,"road":null,"sea":9484}},"PE":{"PE":{"air":500,"road":500,"sea":null},"PK":{"air":15861,"road":null,"sea":20542},"RAF":{"air":12787,"road":null,"sea":16547},"RAS":{"air":17233,"road":null,"sea":19362},"REE":{"air":10958,"road":null,"sea":13816},"REO":{"air":9226,"road":null,"sea":11052},"RLA":{"air":2302,"road":3429,"sea":6907},"RME":{"air":12519,"road":null,"sea":14093},"RNA":{"air":5746,"road":null,"sea":6145},"ROC":{"air":14861,"road":null,"sea":15097},"TN":{"air":10173,"road":null,"sea":12370},"TR":{"air":12519,"road":null,"sea":14093},"US":{"air":5746,"road":null,"sea":6145},"VN":{"air":19308,"road":null,"sea":19411}},"PK":{"PK":{"air":500,"road":500,"sea":null},"RAF":{"air":4130,"road":null,"sea":3903},"RAS":{"air":3318,"road":4492,"sea":12627},"REE":{"air":5017,"road":5936,"sea":8905},"REO":{"air":6654,"road":7520,"sea":11764},"RLA":{"air":13927,"road":null,"sea":16457},"RME":{"air":3342,"road":3741,"sea":6925},"RNA":{"air":12357,"road":null,"sea":18630},"ROC":{"air":9206,"road":null,"sea":11173},"TN":{"air":5696,"road":null,"sea":8350},"TR":{"air":3342,"road":3741,"sea":6925},"US":{"air":12357,"road":null,"sea":18630},"VN":{"air":3981,"road":14986,"sea":8308}},"RAF":{"RAF":{"air":500,"road":500,"sea":null},"RAS":{"air":7413,"road":null,"sea":13204},"REE":{"air":5080,"road":null,"sea":5210},"REO":{"air":5469,"road":null,"sea":7870},"RLA":{"air":10497,"road":null,"sea":12738},"RME":{"air":3447,"road":null,"sea":3203},"RNA":{"air":13111,"road":null,"sea":15663},"ROC":{"air":10908,"road":null,"sea":11158},"TN":{"air":4138,"road":5406,"sea":4608},"TR":{"air":3447,"road":null,"sea":3203},"US":{"air":13111,"road":null,"sea":15663},"VN":{"air":7430,"road":null,"sea":8775}},"RAS":{"RAS":{"air":500,"road":500,"sea":null},"REE":{"air":7105,"road":7931,"sea":18166},"REO":{"air":8976,"road":9977,"sea":20899},"RLA":{"air":16580,"road":null,"sea":25166},"RME":{"air":6090,"road":7258,"sea":16189},"RNA":{"air":11611,"road":null,"sea":27066},"ROC":{"air":7469,"road":null,"sea":11574},"TN":{"air":8417,"road":null,"sea":17637},"TR":{"air":6090,"road":7258,"sea":16189},"US":{"air":11611,"road":null,"sea":27066},"VN":{"air":2107,"road":2644,"sea":4704}},"REE":{"REE":{"air":500,"road":500,"sea":null},"REO":{"air":1875,"road":2133,"sea":5124},"RLA":{"air":9489,"road":null,"sea":10074},"RME":{"air":1950,"road":2176,"sea":2690},"RNA":{"air":8254,"road":null,"sea":12246},"ROC":{"air":14200,"road":null,"sea":16168},"TN":{"air":1829,"road":null,"sea":2154},"TR":{"air":1950,"road":2176,"sea":2690},"US":{"air":8254,"road":null,"sea":12246},"VN":{"air":8703,"road":10866,"sea":13893}},"REO":{"REO":{"air":500,"road":500,"sea":null},"RLA":{"air":7627,"road":null,"sea":7695},"RME":{"air":3329,"road":3773,"sea":5458},"RNA":{"air":7651,"road":null,"sea":10045},"ROC":{"air":15822,"road":null,"sea":18853},"TN":{"air":1333,"road":null,"sea":3694},"TR":{"air":3329,"road":3773,"sea":5458},"US":{"air":7651,"road":null,"sea":10045},"VN":{"air":10499,"road":33893,"sea":16469}},"RLA":{"RLA":{"air":500,"road":500,"sea":null},"RME":{"air":10704,"road":null,"sea":10337},"RNA":{"air":6877,"road":null,"sea":7499},"ROC":{"air":15822,"road":null,"sea":19187},"TN":{"air":8321,"road":null,"sea":8573},"TR":{"air":10704,"road":null,"sea":10337},"US":{"air":6877,"road":null,"sea":7499},"VN":{"air":17869,"road":null,"sea":20931}},"RME":{"RME":{"air":500,"road":500,"sea":null},"RNA":{"air":10173,"road":null,"sea":13255},"ROC":{"air":12498,"road":null,"sea":14143},"TN":{"air":2386,"road":null,"sea":2276},"TR":{"air":500,"road":500,"sea":null},"US":{"air":10173,"road":null,"sea":13255},"VN":{"air":7278,"road":24341,"sea":11743}},"RNA":{"RNA":{"air":500,"road":500,"sea":null},"ROC":{"air":15230,"road":null,"sea":25624},"TN":{"air":8976,"road":null,"sea":11491},"TR":{"air":10173,"road":null,"sea":13255},"US":{"air":500,"road":500,"sea":null},"VN":{"air":13565,"road":null,"sea":22368}},"ROC":{"ROC":{"air":500,"road":500,"sea":null},"TN":{"air":14660,"road":null,"sea":15591},"TR":{"air":12498,"road":null,"sea":14143},"US":{"air":15230,"road":null,"sea":25624},"VN":{"air":5581,"road":null,"sea":7676}},"TN":{"TN":{"air":500,"road":500,"sea":null},"TR":{"air":2386,"road":null,"sea":2276},"US":{"air":8976,"road":null,"sea":11491},"VN":{"air":9658,"road":null,"sea":13207}},"TR":{"TR":{"air":500,"road":500,"sea":null},"US":{"air":10173,"road":null,"sea":13255},"VN":{"air":7278,"road":24341,"sea":11743}},"US":{"US":{"air":500,"road":500,"sea":null},"VN":{"air":13565,"road":null,"sea":22368}},"VN":{"VN":{"air":500,"road":500,"sea":null}}}';
var $author$project$Static$Db$distances = $author$project$Data$Common$Db$transportsFromJson($author$project$Static$Json$transportsJson);
var $author$project$Static$Json$foodIngredientsJson = '[{"alias":"egg-bleublanccoeur","categories":["animal_product","bleublanccoeur"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":10.6043,"hedges":1.87486,"livestockDensity":-0.007728,"permanentPasture":0,"plotSize":2.49886},"id":"7ef7399a-1d56-4947-b773-9f6438a50fda","inediblePart":0.2,"landOccupation":4.46911,"name":"Oeuf Bleu-Blanc-Cœur FR","processId":"58c49ef8-f390-5c81-83b2-8f398b64001a","rawToCookedRatio":0.974,"scenario":"reference","search":"Egg Bleu Blanc Coeur outdoor system at farm gate","transportCooling":"none","visible":true},{"alias":"milk","categories":["dairy_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.898901,"livestockDensity":-0.00017,"permanentPasture":0.175,"plotSize":0.839142},"id":"8f3863e7-f981-4367-90a2-e1aaa096a6e0","inediblePart":0,"landOccupation":1.39148,"name":"Lait FR","processId":"0427c659-7389-5087-b9f1-d7a4369fe7f6","rawToCookedRatio":1,"scenario":"reference","search":"Cow milk national average at farm gate","transportCooling":"always","visible":true},{"alias":"milk-organic","categories":["dairy_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0.545838,"hedges":1.68909,"livestockDensity":-0.000178,"permanentPasture":0.814,"plotSize":1.51092},"id":"2bf307e8-8cb0-400b-a4f1-cf615d9e96f4","inediblePart":0,"landOccupation":1.75076,"name":"Lait Bio","processId":"1782b099-df28-5c5f-b2e4-17ac2e60583e","rawToCookedRatio":1,"scenario":"organic","search":"cow milk organic national average","transportCooling":"always","visible":true},{"alias":"carrot-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0.61492,"hedges":0.12702,"plotSize":0.19209},"id":"9042b6d0-c309-4757-a03f-ba802f0c8c01","inediblePart":0.1,"landOccupation":0.219535,"name":"Carotte Bio","processId":"9a31a1e4-c536-5307-aea5-bf4364c2f15d","rawToCookedRatio":0.856,"scenario":"organic","search":"Carrot, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"flour","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.43142,"plotSize":0.58076},"id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","inediblePart":0,"landOccupation":1.5487,"name":"Farine UE","processId":"e9784d81-fcae-5fc2-8b5b-1166a7e0df9d","rawToCookedRatio":1,"scenario":"reference","search":"Wheat flour at industrial mill FR","transportCooling":"once_transformed","visible":true},{"alias":"flour-organic","categories":["grain_processed","organic"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":7.86,"hedges":1.0995,"plotSize":1.6375},"id":"db791ac8-02b9-41b0-bc2b-2913e745bd19","inediblePart":0,"landOccupation":3.27502,"name":"Farine Bio","processId":"d78f41f4-fe75-5ee7-96e6-7a9d1352545c","rawToCookedRatio":1,"scenario":"organic","search":"Wheat flour at industrial mill organic, constructed by Ecobalyse","transportCooling":"once_transformed","visible":true},{"alias":"sunflower-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"TOURNESOL","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":19.94,"hedges":2.1751,"plotSize":2.1147},"id":"dbcc6b38-8309-4bb0-a66e-525ec9dcc79c","inediblePart":0,"landOccupation":5.63909,"name":"Tournesol Bio","processId":"92364220-c4ea-526a-9362-a873618d87bf","rawToCookedRatio":1,"scenario":"organic","search":"Sunflower grain, consumption mix, organic 2023 {FR}","transportCooling":"none","visible":true},{"alias":"rapeseed-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"COLZA","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":10.938,"hedges":1.8035,"plotSize":2.2543},"id":"5238ba53-56e4-404e-ad68-43d80a5df85b","inediblePart":0,"landOccupation":4.50865,"name":"Colza Bio","processId":"e7ebe11b-70c6-5455-bf83-337b190b74c3","rawToCookedRatio":1,"scenario":"organic","search":"Winter rapeseed, organic, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"ground-beef","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":46.9842,"livestockDensity":-0.00255,"permanentPasture":37.5,"plotSize":39.6215},"id":"41d65ed4-230f-4a47-a67c-9a8015f50420","inediblePart":0,"landOccupation":53.2876,"name":"Boeuf haché cru FR","processId":"9a4c4a03-7244-5dd0-a669-e49452291dbd","rawToCookedRatio":0.792,"scenario":"reference","search":"Ground beef fresh case ready for direct consumption at plant","transportCooling":"always","visible":true},{"alias":"ground-beef-organic","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":14.9822,"hedges":53.3171,"livestockDensity":-0.00267,"permanentPasture":34.68,"plotSize":46.8446},"id":"4e3009f3-1b33-41d7-b6f3-dc7230331da0","inediblePart":0,"landOccupation":55.0185,"name":"Boeuf haché cru Bio","processId":"ed2f34df-710f-52c8-9bf6-e42ab1d64dbe","rawToCookedRatio":0.792,"scenario":"organic","search":"Ground beef fresh case ready for direct consumption at plant {{ground-beef-fresh-case-ready-direct-consumption-plant-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"ground-beef-feedlot","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"livestockDensity":-0.006,"permanentPasture":0,"plotSize":0},"id":"ce073919-1aff-4892-a1f5-b25ee94bccd8","inediblePart":0,"landOccupation":52.5467,"name":"Boeuf haché cru par défaut","processId":"62cce1fb-5980-52ff-bb1f-63fa756ca169","rawToCookedRatio":0.792,"scenario":"import","search":"Ground beef fresh case ready for direct consumption at plant {{ground-beef-fresh-case-ready-direct-consumption-plant-feedlot}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"ground-beef-grass-fed","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":52.7475,"livestockDensity":-0.00267,"permanentPasture":50.89,"plotSize":43.1349},"id":"3fd1b6d5-58d9-40eb-b215-d2e8c2876a5f","inediblePart":0,"landOccupation":55.9361,"name":"Boeuf haché cru - v. de réforme 100% herbe FR","processId":"62dbf767-ba1a-5b4a-bcc9-52c013ce5922","rawToCookedRatio":0.792,"scenario":"organic","search":"Ground beef fresh case ready for direct consumption at plant {{ground-beef-fresh-case-ready-direct-consumption-plant-grass-fed}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"cooked-ham","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.52795,"livestockDensity":-0.027132,"permanentPasture":0,"plotSize":1.97251},"id":"755225f1-f0c5-497f-b8a9-263828a84a22","inediblePart":0,"landOccupation":6.56426,"name":"Jambon cuit FR","processId":"9d299fee-9b86-5500-9fc1-6dc73c88391f","rawToCookedRatio":1,"scenario":"reference","search":"Cooked ham case ready at plant","transportCooling":"always","visible":true},{"alias":"cooked-ham-organic","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":35.1802,"hedges":7.61336,"livestockDensity":-0.007803,"permanentPasture":0,"plotSize":9.77126},"id":"4de5e41e-3271-4489-aa27-a973e4045082","inediblePart":0,"landOccupation":24.0584,"name":"Jambon cuit Bio","processId":"0ccbe554-2dd8-52b8-b3b5-744bf12bdc5f","rawToCookedRatio":1,"scenario":"organic","search":"Cooked ham case ready at plant {{cooked-ham-case-ready-plant-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"cooked-ham-bbc","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.94852,"livestockDensity":-0.027132,"permanentPasture":0,"plotSize":2.64678},"id":"15e2dfa0-9b5f-4bc9-a3ed-885f56061bc0","inediblePart":0,"landOccupation":7.44401,"name":"Jambon cuit (alim. ani. 100%FR) FR","processId":"25cb5ccb-5dde-52a9-b5ac-2125fdaa1a77","rawToCookedRatio":1,"scenario":"reference","search":"Cooked ham case ready at plant {{cooked-ham-case-ready-plant-bbc}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"chicken-breast","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.67159,"livestockDensity":-0.01518,"permanentPasture":0,"plotSize":2.00914},"id":"a360871c-fc35-4cb3-af2c-5eeb8bd6f984","inediblePart":0,"landOccupation":6.11263,"name":"Blanc de poulet cru FR","processId":"ccf36c8b-0777-5d41-ae20-165f2b093fa7","rawToCookedRatio":0.755,"scenario":"reference","search":"Meat without bone chicken for direct consumption","transportCooling":"always","visible":true},{"alias":"chicken-breast-organic","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":24.2736,"hedges":4.97927,"livestockDensity":-0.005225,"permanentPasture":0,"plotSize":5.28421},"id":"b19b0dc0-3478-46a0-b8a1-3225ea939ff1","inediblePart":0,"landOccupation":15.8937,"name":"Blanc de poulet cru Bio","processId":"dd390137-4fa7-57b4-a0a6-bbda3a6585a8","rawToCookedRatio":0.755,"scenario":"organic","search":"Meat without bone chicken for direct consumption {{meat-without-bone-chicken-direct-consumption-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"chicken-breast-fr-organic","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":24.2736,"hedges":4.97927,"livestockDensity":-0.005225,"permanentPasture":0,"plotSize":5.28421},"id":"b682ae30-9df9-4385-9005-4b4725c70d54","inediblePart":0,"landOccupation":18.594,"name":"Blanc de poulet cru (alim. ani. 100%FR) Bio","processId":"633b4e77-9bc3-54aa-9dce-a9684ec52515","rawToCookedRatio":0.755,"scenario":"organic","search":"Meat without bone chicken for direct consumption {{meat-without-bone-chicken-direct-consumption-organic-fr-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":false},{"alias":"rapeseed-oil","categories":["nut_oilseed_processed"],"cropGroup":"COLZA","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.9397,"plotSize":2.1215},"id":"96b301d9-d21b-4cea-8903-bd7917e95a30","inediblePart":0,"landOccupation":8.48614,"name":"Huile de colza par défaut","processId":"a08bb4c0-5480-51ff-9d9c-c7cedf0f4334","rawToCookedRatio":1,"scenario":"reference","search":"Rapeseed oil, at oil mill {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"rapeseed-oil-organic","categories":["nut_oilseed_processed","organic"],"cropGroup":"COLZA","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":18.133,"hedges":2.9899,"plotSize":3.7373},"id":"51f8e8d2-13c0-446c-bf0a-9272fc46edde","inediblePart":0,"landOccupation":7.47465,"name":"Huile de colza Bio","processId":"8d2d6d07-6700-5c72-b8f6-ea1b96bfe06c","rawToCookedRatio":1,"scenario":"organic","search":"Rapeseed oil, at oil mill {GLO} - Adapted from WFLDB U {{rapeseed-oil-oil-mill-glo-adapted-from-wfldb-u-organic}}, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"sunflower-oil","categories":["nut_oilseed_processed"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":3.4636,"hedges":2.4556,"plotSize":3.223},"id":"3cfab110-363e-442a-9170-1af337fe9ea3","inediblePart":0,"landOccupation":8.59466,"name":"Huile de tournesol par défaut","processId":"c7984a1c-66cb-52ea-bb54-763e0da8ecad","rawToCookedRatio":1,"scenario":"reference","search":"Sunflower oil, at oil mill {GLO} - Adapted from WFLDB U","transportCooling":"once_transformed","visible":true},{"alias":"sunflower-oil-organic","categories":["nut_oilseed_processed","organic"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":50.825,"hedges":5.5441,"plotSize":5.3901},"id":"64fb23f2-0cac-403c-bbfa-1973c9a0ea40","inediblePart":0,"landOccupation":14.3735,"name":"Huile de tournesol Bio","processId":"74316df8-a65f-5999-af15-448b841aab30","rawToCookedRatio":1,"scenario":"organic","search":"Sunflower oil, at oil mill {GLO} - Adapted from WFLDB U {{sunflower-oil-oil-mill-glo-adapted-from-wfldb-u-organic}}, constructed by Ecobalyse","transportCooling":"once_transformed","visible":true},{"alias":"zucchini-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.37941,"hedges":0.07837,"plotSize":0.11852},"id":"59092383-9bfb-419e-ab63-825c8e6e6ed0","inediblePart":0.1,"landOccupation":0.135454,"name":"Courgette Bio","processId":"30b69d8c-c7e7-53b5-8317-9a00f3330526","rawToCookedRatio":0.856,"scenario":"organic","search":"Zucchini, springtime, under tunnel, organic, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"peach-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.5142,"hedges":0.58485,"plotSize":0.71645},"id":"3cc14fbe-c798-46bf-bc7d-94d5ed28fa7c","inediblePart":0.2,"landOccupation":0.818796,"name":"Pêche Bio","processId":"a749eb68-1877-53d1-a3ec-56876a532c86","rawToCookedRatio":0.856,"scenario":"organic","search":"Peach, organic, national average, at orchard {FR} U","transportCooling":"always","visible":true},{"alias":"melon-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":1.4011,"hedges":0.28942,"plotSize":0.4377},"id":"359ec82d-4f28-43bd-b5be-84256a45c03e","inediblePart":0.4,"landOccupation":0.500229,"name":"Melon Bio","processId":"fb5b55ec-aab1-50df-bec5-97caef5fdd91","rawToCookedRatio":0.856,"scenario":"organic","search":"Melon, organic, at farm gate FR","transportCooling":"always","visible":true},{"alias":"butter","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"bbda834e-1548-4682-a461-c367dc1ce517","inediblePart":0,"landOccupation":9.17058,"name":"Beurre FR","processId":"7e0e3538-e229-556b-b5ce-b69cfa9e1880","rawToCookedRatio":1,"search":"Butter, 82% fat, unsalted, at dairy {FR} U","transportCooling":"always","visible":true},{"alias":"butter-organic","categories":["dairy_product","organic"],"defaultOrigin":"France","density":1,"id":"aeedb0fa-81a7-4f21-9bf1-7ec9c4c69ed9","inediblePart":0,"landOccupation":11.5352,"name":"Beurre Bio","processId":"387b0378-8ad4-519a-97b0-33c3a7e7664f","rawToCookedRatio":1,"search":"Butter, 82% fat, unsalted, at dairy {FR} U {{butter-82-fat-unsalted-dairy-fr-u-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"tap-water","categories":[],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","inediblePart":0,"landOccupation":0.0000222964,"name":"Eau du robinet UE","processId":"d3fc19a4-7ace-5870-aeb3-fe35a8189d94","rawToCookedRatio":1,"search":"Tap water Europe market","transportCooling":"none","visible":true},{"alias":"comte-aop","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"f804033a-fe59-4ec5-b24b-c7482b2a6cf6","inediblePart":0,"landOccupation":6.30564,"name":"Comté FR AOP","processId":"854e941b-c9dc-5e9e-92eb-68dc5cc5ff4c","rawToCookedRatio":1,"search":"Comte cheese, from cow\'s milk, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"emmental","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","inediblePart":0,"landOccupation":6.64346,"name":"Emmental FR","processId":"a9ab17e5-f011-5f18-af0a-b231e0e68964","rawToCookedRatio":1,"search":"Emmental cheese, from cow\'s milk, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"mozzarella","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"faa513ae-9c32-4e6c-874e-58c13309339e","inediblePart":0,"landOccupation":4.78585,"name":"Mozzarella FR","processId":"8afe86af-857f-5472-98c7-ea884107d8e3","rawToCookedRatio":1,"search":"Mozzarella cheese, from cow\'s milk, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"beetroot-organic","categories":["vegetable_fresh","organic"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0.37233,"hedges":0.08311,"plotSize":0.19209},"id":"1e878bf3-3f3f-4239-a4d8-072c9dec8457","inediblePart":0.1,"landOccupation":0.219535,"name":"Betterave rouge Bio","processId":"9a31a1e4-c536-5307-aea5-bf4364c2f15d","rawToCookedRatio":0.856,"scenario":"organic","search":"Carrot, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"celeriac-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0.61492,"hedges":0.12702,"plotSize":0.19209},"id":"f36c6c35-1d92-4d7c-8f15-5c4fbe931ed8","inediblePart":0.1,"landOccupation":0.219535,"name":"Céleri-rave Bio","processId":"9a31a1e4-c536-5307-aea5-bf4364c2f15d","rawToCookedRatio":0.856,"scenario":"organic","search":"Carrot, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"turnip-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0.44471,"hedges":0.09186,"plotSize":0.13892},"id":"7e64fe4d-001c-42eb-9307-13c8a21d2805","inediblePart":0.2,"landOccupation":0.15877,"name":"Navet Bio","processId":"283ea4ac-048d-5555-aa51-ba5bb7b45c0e","rawToCookedRatio":0.856,"scenario":"organic","search":"Carrot, organic, Lower Normandy, at farm gate","transportCooling":"always","visible":true},{"alias":"chickpea-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":9.4105,"hedges":0.77631,"plotSize":1.1813},"id":"20aea108-cab8-4223-b8b7-4747599e228c","inediblePart":0.2,"landOccupation":2.36268,"name":"Pois chiche Bio","processId":"6c050c28-615b-5863-bcfb-370832bb6e0d","rawToCookedRatio":2.33,"scenario":"organic","search":"Winter pea, from intercrop, organic, system number 1, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"soybean-humanconsumption","categories":["nut_oilseed_raw"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0623,"plotSize":2.0097},"id":"c466ec83-7735-43b6-a919-c933e6656a8d","inediblePart":0,"landOccupation":4.01946,"name":"Soja FR","processId":"0fc050a3-393c-5c39-8171-361c85a80b7c","rawToCookedRatio":2.33,"scenario":"reference","search":"Soybean, national average, animal feed, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"soybean-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":18.211,"hedges":1.9696,"plotSize":2.1103},"id":"92d34545-6952-466e-bf6d-c1f1f6069b48","inediblePart":0,"landOccupation":5.62754,"name":"Soja Bio","processId":"16d29a2d-4944-50d1-90f5-d3c151853d35","rawToCookedRatio":2.33,"scenario":"organic","search":"soybean organic animal at farm gate {FR}","transportCooling":"none","visible":false},{"alias":"soybean-br-no-deforestation","categories":["nut_oilseed_raw"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0cd5d7be-c2a9-4a3d-a3f9-86e351733438","inediblePart":0,"landOccupation":2.47642,"name":"Soja (non déforestant) par défaut","processId":"8f7ef559-0d9d-57aa-b698-b5ed621d6f5b","rawToCookedRatio":2.33,"scenario":"import","search":"Soybean, not associated to deforestation {BR}| market for soybean | Cut-off, U - Adapted from Ecoinvent","transportCooling":"none","visible":true},{"alias":"soybean-br-deforestation","categories":["nut_oilseed_raw"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"141f76d7-fe36-4f17-b7da-043ac884a309","inediblePart":0,"landOccupation":2.83548,"name":"Soja déforestant par défaut","processId":"9865cef2-f02f-550d-b155-728971443744","rawToCookedRatio":2.33,"scenario":"import","search":"Soybean {BR}| market for soybean | Cut-off, U copied from Ecoinvent","transportCooling":"none","visible":true},{"alias":"soybean-feed","categories":["nut_oilseed_raw"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0627,"plotSize":2.0105},"id":"086b58da-1c4c-40a8-9327-37477d04cfba","inediblePart":0,"landOccupation":4.02108,"name":"Soja feed par défaut","processId":"0282c8bb-1070-5b25-9614-e61d5148f174","rawToCookedRatio":2.33,"scenario":"reference","search":"Soybean grain dried, stored and transported, processing {FR}","transportCooling":"none","visible":false},{"alias":"sausage-meat","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"d1eb385a-ad1e-44f5-89d1-640c4c91d353","inediblePart":0,"landOccupation":9.35734,"name":"Chair à saucisse crue FR","processId":"2225c16a-47f3-52d1-8b52-a8bae1e08e24","rawToCookedRatio":0.792,"search":"Sausage meat, raw, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"sausage-toulouse","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"ee85fceb-7d1f-4871-a0e3-4e88cc816bd5","inediblePart":0,"landOccupation":19.3399,"name":"Saucisse de Toulouse (crue) FR","processId":"0a53d3d4-90aa-55d8-9ada-1ad8b5ed5b2b","rawToCookedRatio":0.792,"search":"Toulouse sausage, raw, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"sausage-toulouse-cooked","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"0a86af92-e0c5-4667-9cd2-d63bcc0d9726","inediblePart":0,"landOccupation":19.4461,"name":"Saucisse de Toulouse (cuite) FR","processId":"4edc8881-8559-5ee8-8a66-83557d3144e5","rawToCookedRatio":1,"search":"Toulouse sausage, cooked, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"sausage-tofu","categories":[],"defaultOrigin":"France","density":1,"id":"5799c843-f538-40c8-bd6f-a3b4a4288261","inediblePart":0,"landOccupation":1.68661,"name":"Saucisse végétale tofu FR","processId":"98c941c7-3a32-525a-abdd-f0c7a874ced0","rawToCookedRatio":1,"search":"Plant-based sausage with tofu (vegan), at plant {FR} U","transportCooling":"always","visible":true},{"alias":"tomato-paste","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11006,"plotSize":0.27515},"id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","inediblePart":0,"landOccupation":0.440238,"name":"Purée de tomates par défaut","processId":"a3ae0f78-5e38-5835-9c45-82b471c87693","rawToCookedRatio":1,"scenario":"reference","search":"Tomato paste, 30 degrees Brix, at plant {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"tomato-concentrated","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.21112,"plotSize":0.5278},"id":"55e180a0-9b80-4e0c-9aaf-4613a155d69a","inediblePart":0,"landOccupation":0.844484,"name":"Concentré de tomates par défaut","processId":"2b412e3e-3c78-51a2-aafa-e7d2907f3515","rawToCookedRatio":1,"scenario":"reference","search":"Tomato paste, 30 degrees Brix, for double concentrate, at plant {GLO}","transportCooling":"none","visible":true},{"alias":"beef-with-bone","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":30.7057,"livestockDensity":-0.00255,"permanentPasture":24.51,"plotSize":25.8934},"id":"9db6b0d1-941a-4dda-a347-b7a7fee8fd46","inediblePart":0.2,"landOccupation":34.7358,"name":"Viande de boeuf avec os (crue) FR","processId":"d08d4fc1-fea6-5c68-8b59-b62850b16d5e","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat with bone, beef, for direct consumption","transportCooling":"always","visible":true},{"alias":"beef-with-bone-feedlot","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"livestockDensity":-0.006,"permanentPasture":0,"plotSize":0},"id":"131354de-e269-4bc7-a21a-b55658b8e3fb","inediblePart":0.2,"landOccupation":34.2527,"name":"Viande de boeuf avec os par défaut","processId":"1d8ee50f-211e-57a2-96a6-130a9b72fb00","rawToCookedRatio":0.792,"scenario":"import","search":"Meat with bone, beef, for direct consumption {{meat-with-bone-beef-direct-consumption-feedlot}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"beef-with-bone-grass-fed","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":34.474,"livestockDensity":-0.00255,"permanentPasture":33.26,"plotSize":28.1915},"id":"f38271f1-bdba-40cd-a296-2bc741fbf915","inediblePart":0.2,"landOccupation":36.4628,"name":"Viande de boeuf avec os - vache de réforme 100% herbe FR","processId":"61651aef-b4eb-5e46-9ebb-c02be2d31936","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat with bone, beef for direct consumption {{meat-with-bone-beef-direct-consumption-grass-fed}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"beef-with-bone-organic","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":9.82287,"hedges":34.8541,"livestockDensity":-0.00267,"permanentPasture":22.67,"plotSize":30.625},"id":"6912db61-530f-4630-956a-b94a6ded0134","inediblePart":0.2,"landOccupation":35.8645,"name":"Viande de boeuf avec os Bio","processId":"c29b1e77-ce81-5794-ba00-730636c6d8de","rawToCookedRatio":0.792,"scenario":"organic","search":"Meat with bone, beef for direct consumption {{meat-with-bone-beef-direct-consumption-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"beef-without-bone","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":38.3825,"livestockDensity":-0.00255,"permanentPasture":30.63,"plotSize":32.3684},"id":"22179caa-eb41-49c0-ae04-49eda23da4da","inediblePart":0,"landOccupation":43.4211,"name":"Viande de boeuf sans os (crue) FR","processId":"48efc88e-dff7-55f0-a1b3-540d17fde967","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat without bone, beef, for direct consumption","transportCooling":"always","visible":true},{"alias":"beef-without-bone-feedlot","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"livestockDensity":-0.006,"permanentPasture":0,"plotSize":0},"id":"91f8ec52-d3bb-44db-84be-08bb1996caf8","inediblePart":0,"landOccupation":42.8171,"name":"Viande de boeuf sans os par défaut","processId":"ca2328f4-90ee-500a-a377-6d7fddd89aaa","rawToCookedRatio":0.792,"scenario":"import","search":"Meat without bone, beef for direct consumption {{meat-without-bone-beef-direct-consumption-feedlot}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"beef-without-bone-grass-fed","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":43.0977,"livestockDensity":-0.00255,"permanentPasture":41.58,"plotSize":35.2436},"id":"67db7c6c-a8f8-4285-b1dd-b0b3efe2d668","inediblePart":0,"landOccupation":45.5798,"name":"Viande de boeuf sans os - vache de réforme 100% herbe FR","processId":"a28b796f-bd2c-5fa9-b162-9e7291f44ae1","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat without bone, beef for direct consumption {{meat-without-bone-beef-direct-consumption-grass-fed}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"beef-without-bone-organic","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":12.2416,"hedges":43.5594,"livestockDensity":-0.00267,"permanentPasture":28.34,"plotSize":38.2706},"id":"ff532795-d725-4c6b-82bc-022d38b83bff","inediblePart":0,"landOccupation":35.8645,"name":"Viande de boeuf sans os Bio (crue)","processId":"c29b1e77-ce81-5794-ba00-730636c6d8de","rawToCookedRatio":0.792,"scenario":"organic","search":"Meat with bone, beef for direct consumption {{meat-with-bone-beef-direct-consumption-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"durum-wheat-semolina","categories":["grain_processed"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.6817,"plotSize":2.3734},"id":"4f3abd56-ed63-4207-afbb-20ac259017e0","inediblePart":0,"landOccupation":3.79749,"name":"Semoule de blé dur FR","processId":"ca12b4c3-38d6-5481-9d3b-ccfb64ad602a","rawToCookedRatio":2.259,"scenario":"reference","search":"Durum wheat, semolina, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"sugar","categories":["vegetable_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.042433,"plotSize":0.11424},"id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","inediblePart":0,"landOccupation":0.456976,"name":"Sucre de betterave FR","processId":"fb996a56-2cf1-5c11-92af-e6384ef9ac39","rawToCookedRatio":1,"scenario":"reference","search":"Sugar, from sugar beet, at sugar refinery {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"dark-chocolate","categories":["vegetable_processed"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"6f3939f7-408c-45d5-8653-61f3336bf305","inediblePart":0,"landOccupation":11.8,"name":"Chocolat noir par défaut","processId":"514bd01e-0aaa-5d71-b86a-efeef8fa7784","rawToCookedRatio":1,"search":"Dark chocolate, at plant {RER} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"chicken-breast-br-max","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.7164,"livestockDensity":-0.022,"permanentPasture":0,"plotSize":2.85266},"id":"8fb5024c-ceec-4201-b069-ea253c537ad6","inediblePart":0,"landOccupation":9.42511,"name":"Blanc de poulet cru (alim. ani. 100%BR) par défaut","processId":"d1d25df6-b039-52ae-b67f-32da12d75e8f","rawToCookedRatio":0.755,"scenario":"import","search":"Meat without bone chicken for direct consumption {{meat-without-bone-chicken-direct-consumption-br-max}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"chicken-breast-fr-feed","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":2.59614,"livestockDensity":-0.01518,"permanentPasture":0,"plotSize":3.75827},"id":"f94df72e-20fd-4cc5-ab64-ce3921649d58","inediblePart":0,"landOccupation":7.36908,"name":"Blanc de poulet cru (alim. ani. 100%FR) FR","processId":"53f3f0e1-45e3-5676-a4ec-b78b5d2dfffc","rawToCookedRatio":0.755,"scenario":"reference","search":"Meat without bone chicken for direct consumption {{meat-without-bone-chicken-direct-consumption-fr-feed}}, constructed by Ecobalyse","transportCooling":"always","visible":false},{"alias":"cane-sugar","categories":["vegetable_processed"],"cropGroup":"DIVERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"9b476f8e-08c2-4406-9198-1fb2e007f000","inediblePart":0,"landOccupation":1.54301,"name":"Sucre de canne par défaut","processId":"81f2ed5d-41a5-51a8-9590-44478eb6949d","rawToCookedRatio":1,"scenario":"import","search":"brown sugar at plant","transportCooling":"none","visible":true},{"alias":"tea-dried","categories":["misc"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":7.7622,"hedges":3.6603,"plotSize":7.3505},"id":"97f56acd-962e-4a4b-af42-1e468d2017a0","inediblePart":0,"landOccupation":8.40062,"name":"Thé (feuilles) UE","processId":"74cf4852-dbbf-5a4c-b82c-735721092903","rawToCookedRatio":1,"scenario":"reference","search":"Tea, dried {RoW}| tea production, dried | Cut-off, U - Adapted from Ecoinvent","transportCooling":"none","visible":true},{"alias":"coffee-ground","categories":["misc"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"77be5f12-5124-4828-861c-9ce4ed3fa661","inediblePart":0,"landOccupation":11.6926,"name":"Café moulu par défaut","processId":"c9181867-56e9-5cf0-b7a4-b78338ed1079","rawToCookedRatio":1,"scenario":"import","search":"Coffee, roast and ground, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"black-pepper","categories":["spice_condiment_additive"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"47b15759-416e-4c86-9127-4c75a55b7b8f","inediblePart":0,"landOccupation":16.0844,"name":"Poivre noir par défaut","processId":"e69790ad-d4cc-5345-a330-2d7d03d9b2f6","rawToCookedRatio":1,"scenario":"import","search":"Black pepper, dried, consumption mix","transportCooling":"none","visible":true},{"alias":"milk-powder","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"b6776a28-ec84-4bf3-988c-07b3c29f6136","inediblePart":0,"landOccupation":21.533,"name":"Poudre de lait écrémé FR","processId":"74c3af14-cde9-56d7-8b61-753f29e6729f","rawToCookedRatio":1,"search":"Milk, powder, skimmed, non rehydrated, at plant {FR} ","transportCooling":"none","visible":true},{"alias":"red-wine","categories":["misc"],"cropGroup":"VIGNES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.43403,"plotSize":1.5191},"id":"6621c18e-85de-4683-82be-7b236e68bc48","inediblePart":0,"landOccupation":1.73613,"name":"Vin rouge FR","processId":"8d85b9dc-d4ea-591d-9c9e-bc1a5cf1419e","rawToCookedRatio":1,"scenario":"reference","search":"Red Wine, from grape, in a cooperative cellar, packaged, French production mix, at plant, 1 L of red wine (PGi) {FR} U","transportCooling":"none","visible":true},{"alias":"fresh-shrimps","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"74a86477-3ec2-4f7a-b717-c1794d399e84","inediblePart":0.2,"landOccupation":1.85786,"name":"Crevettes fraîches par défaut","processId":"f0c417b7-0ca4-5260-a43d-27f5ee572e43","rawToCookedRatio":0.819,"search":"Fresh shrimps, China production FR U","transportCooling":"always","visible":true},{"alias":"large-trout","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"dc27661f-3ffa-4f85-b9bb-0028bc7c5fef","inediblePart":0.2,"landOccupation":1.55784,"name":"Truite d\'élevage FR","processId":"cd495bdf-5d34-52a6-9dcc-0cb80cb60780","rawToCookedRatio":0.819,"search":"Large trout, 2-4kg, conventional, at farm gate FR U","transportCooling":"always","visible":true},{"alias":"egg-indoor-code2","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.799774,"livestockDensity":-0.007728,"permanentPasture":0,"plotSize":0.903565},"id":"cf30d3bc-e99c-418a-b7e3-89a894d410a5","inediblePart":0.2,"landOccupation":3.72068,"name":"Oeuf FR","processId":"e0033192-7a17-5024-ad6a-6732470ef8e4","rawToCookedRatio":0.974,"scenario":"reference","search":"Egg, conventional, indoor system, non-cage, at farm gate FR U","transportCooling":"none","visible":true},{"alias":"egg-indoor-code3","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.663051,"livestockDensity":-0.007728,"permanentPasture":0,"plotSize":0.749285},"id":"9cbc31e9-80a4-4b87-ac4b-ddc051c47f69","inediblePart":0.2,"landOccupation":3.07156,"name":"Oeuf (code 3) FR","processId":"6a0895f2-e8ff-5f7b-b550-d664a3ba4949","rawToCookedRatio":0.974,"scenario":"reference","search":"Egg, conventional, indoor system, cage, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"egg-outdoor-code1","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.767134,"livestockDensity":-0.007728,"permanentPasture":0,"plotSize":0.865492},"id":"b2e75be9-65b8-487d-b5b3-f9c2aa047cf7","inediblePart":0.2,"landOccupation":4.27085,"name":"Oeuf (code 1) FR","processId":"0fee082b-600f-57b6-9f67-fc42464c0b0b","rawToCookedRatio":0.974,"scenario":"reference","search":"Egg, conventional, outdoor system, at farm gate FR U","transportCooling":"none","visible":true},{"alias":"egg-organic-code0","categories":["animal_product","organic"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":12.8558,"hedges":2.00241,"livestockDensity":-0.00266,"permanentPasture":0,"plotSize":2.16825},"id":"cfd4a437-aa49-49ff-818e-353421f2fc09","inediblePart":0.2,"landOccupation":6.78038,"name":"Oeuf Bio","processId":"85de2e27-d3b4-5edb-892f-170a07db140d","rawToCookedRatio":0.974,"scenario":"organic","search":"Egg, organic, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"wine-grape-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VIGNES","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.39691,"plotSize":1.2155},"id":"e05934df-fd40-4110-a610-0bd686911f2e","inediblePart":0.1,"landOccupation":1.38917,"name":"Raisin de cuve Bio","processId":"8f038d28-34b3-558d-a14c-f5a2c778d3cf","rawToCookedRatio":0.856,"scenario":"organic","search":"Grape, integrated, variety mix, Languedoc-Roussillon, at vineyard, organic 2023 {FR} U","transportCooling":"always","visible":false},{"alias":"lamb-meat-without-bone","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":41.6413,"livestockDensity":0.000084,"permanentPasture":25,"plotSize":36.1416},"id":"d79e0fce-8633-4189-a937-7b8010abafed","inediblePart":0,"landOccupation":96.5566,"name":"Viande d\'agneau (désossée) FR","processId":"85b19f05-dcf6-5bcf-adaf-3054ff7139ab","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat without bone lamb","transportCooling":"always","visible":true},{"alias":"lamb-meat-without-bone-organic","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":28.104,"hedges":90.8574,"livestockDensity":0.000021,"permanentPasture":67,"plotSize":79.1024},"id":"e07f7703-c4f7-479e-a8ac-bb73d3f08c78","inediblePart":0,"landOccupation":206.083,"name":"Viande d\'agneau Bio (désossée)","processId":"62a5bc6e-f8fc-5332-8db6-547246029a9b","rawToCookedRatio":0.792,"scenario":"organic","search":"lamb meat without bone {{lamb-meat-without-bone-organic}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"pear-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.28599,"hedges":0.32528,"plotSize":0.39847},"id":"57c2fff4-6ad8-4524-a81a-dacdae11deed","inediblePart":0.1,"landOccupation":0.455392,"name":"Poire Bio","processId":"2e865489-6f52-53e1-8daa-2b0a4670df77","rawToCookedRatio":0.856,"scenario":"organic","search":"Pear, consumption mix, organic 2023 {FR} U","transportCooling":"always","visible":false},{"alias":"carrot-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.030831,"plotSize":0.077077},"id":"4d5198e7-413a-4ae2-8448-535aa3b302ae","inediblePart":0.1,"landOccupation":0.123324,"name":"Carotte FR","processId":"37cce1ad-918a-513f-9a9f-2cbad803db16","rawToCookedRatio":0.856,"scenario":"reference","search":"Carrot, conventional, national average, at farm gate {FR} U","transportCooling":"once_transformed","visible":true},{"alias":"carrot-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0e223ce2-10cd-4998-bcee-8674f11f374d","inediblePart":0.1,"landOccupation":0.180271,"name":"Carotte UE","processId":"c4c3dcbf-d8e4-55b7-ba60-72908ab2f5fa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {NL}| carrot production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"carrot-non-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"519cc82d-cae4-432e-ad22-586ca9b37a7e","inediblePart":0.1,"landOccupation":0.287541,"name":"Carotte par défaut","processId":"5b845f63-9f54-5da5-9101-278c4c31d8aa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {RoW}| carrot production | Cut-off, U - Copied from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"zucchini-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.024398,"plotSize":0.060995},"id":"a8ba3467-3c82-442a-a73a-98769061b7a9","inediblePart":0.1,"landOccupation":0.0975918,"name":"Courgette FR","processId":"b4aa9f18-bb5d-5945-a91b-4123a672f155","rawToCookedRatio":0.856,"scenario":"reference","search":"Zucchini, springtime, under tunnel, conventionel, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"zucchini-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"5ef69042-45c5-4b86-b494-1dafcccfc222","inediblePart":0.1,"landOccupation":0.22888,"name":"Courgette UE","processId":"05d96115-ab74-5561-8378-f5e63aa2e06a","rawToCookedRatio":0.856,"scenario":"import","search":"Zucchini, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"pear-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.22191,"hedges":0.10464,"plotSize":0.21014},"id":"eab762ca-1edc-4fcc-ba6d-c247bbab0ec8","inediblePart":0.1,"landOccupation":0.240158,"name":"Poire FR","processId":"ac72c8c0-614c-5569-8806-a604e8aaa9c3","rawToCookedRatio":0.856,"scenario":"reference","search":"Pear, conventional, at orchard {FR} U","transportCooling":"none","visible":true},{"alias":"pear-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"bb00f430-ffda-46a3-ba45-267b0064a43e","inediblePart":0.1,"landOccupation":0.264092,"name":"Poire UE","processId":"63ba810b-7c04-5083-8cc1-b90880fe2089","rawToCookedRatio":0.856,"scenario":"import","search":"Pear {BE}| pear production | Cut-off, U - Adapted from Ecoinvent U {BE}","transportCooling":"none","visible":true},{"alias":"peach-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.44049,"hedges":0.20771,"plotSize":0.41713},"id":"a0012089-de27-45ae-89d1-863f71a06e72","inediblePart":0.2,"landOccupation":0.476723,"name":"Pêche FR","processId":"b2a5735b-1394-540f-8ce7-94ae67a7c1ad","rawToCookedRatio":0.856,"scenario":"reference","search":"Peach, production mix, national average, at orchard {FR} U","transportCooling":"none","visible":true},{"alias":"peach-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"fa9e9f34-acc9-4974-89c4-003d2428f502","inediblePart":0.2,"landOccupation":0.46046,"name":"Pêche UE","processId":"b4586d37-f256-5118-8aa2-8df41c6bc0c2","rawToCookedRatio":0.856,"scenario":"import","search":"Peach {ES}| peach production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"melon-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.10611,"plotSize":0.26529},"id":"dc5c2f84-937c-4059-b7f9-352658cd4c57","inediblePart":0.4,"landOccupation":0.424457,"name":"Melon FR","processId":"dbf9fb3d-a447-571b-bcb3-48b92f1df68d","rawToCookedRatio":0.856,"scenario":"reference","search":"Melon, conventional, national average, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"melon-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"cfabc9a1-1e99-48fc-bfea-9a2fbf6777a6","inediblePart":0.4,"landOccupation":0.424457,"name":"Melon UE","processId":"dbf9fb3d-a447-571b-bcb3-48b92f1df68d","rawToCookedRatio":0.856,"scenario":"import","search":"Melon, conventional, national average, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"potato-industry-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.07231,"plotSize":0.18078},"id":"f87309f5-bfbf-49a5-ae57-1a0319a7b7d3","inediblePart":0.1,"landOccupation":0.289242,"name":"Pomme de terre industrie FR","processId":"b88dacef-d012-5f6f-9fa1-bcdbdafd9876","rawToCookedRatio":0.856,"scenario":"reference","search":"Ware potato, conventional, for industrial use, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"potato-table-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.072312,"plotSize":0.18078},"id":"1bcf7aa8-a26c-4340-b98a-c41d015a99b7","inediblePart":0.1,"landOccupation":0.289247,"name":"Pomme de terre de table FR","processId":"d0f0c49b-5815-5840-80e1-5fa626e5379f","rawToCookedRatio":0.856,"scenario":"reference","search":"Ware potato, conventional, for fresh market, other varieties, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"potato-starch","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"b042c68d-6c0d-448d-91e6-7a8a424abd4a","inediblePart":0,"landOccupation":1.79665,"name":"Fécule de pomme de terre par défaut","processId":"b209ef3d-089a-5581-853e-0d8c1c253cad","rawToCookedRatio":1,"scenario":"import","search":"Potato starch {GLO}| market for | Cut-off, S - Copied from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"onion-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0.066103,"plotSize":0.16526},"id":"97cde31b-e46e-472d-836d-9b217c3845df","inediblePart":0.1,"landOccupation":0.26441,"name":"Oignon FR","processId":"bc2b7e2a-870e-5e15-ae1b-13e517ddc92e","rawToCookedRatio":0.856,"scenario":"reference","search":"Onion, national average, at farm FR","transportCooling":"none","visible":true},{"alias":"onion-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"50ede891-0244-4ab2-afeb-e5e808978f9b","inediblePart":0.1,"landOccupation":0.21575,"name":"Oignon UE","processId":"35091683-41e1-5d55-87bc-8cdf8141109f","rawToCookedRatio":0.856,"scenario":"import","search":" \\tOnion {NL}| onion production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"onion-non-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"20be5465-ce64-4375-84f5-acc5c486a0dc","inediblePart":0.1,"landOccupation":0.243671,"name":"Oignon par défaut","processId":"90589313-8a92-543e-a39d-79c4315872c3","rawToCookedRatio":0.856,"scenario":"import","search":"Onion {RoW}| onion production | Cut-off, U - Copied from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"eggplant-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.398,"ecosystemicServices":{"cropDiversity":0,"hedges":0.024398,"plotSize":0.060995},"id":"ed8ac786-b948-475f-ba0a-0b51b9343d1b","inediblePart":0.1,"landOccupation":0.0975918,"name":"Aubergine FR","processId":"b4aa9f18-bb5d-5945-a91b-4123a672f155","rawToCookedRatio":0.856,"scenario":"reference","search":"Zucchini, springtime, under tunnel, conventionel, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"eggplant-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.398,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"da1bb644-0d37-467f-8c7a-53300b58b0cf","inediblePart":0.1,"landOccupation":0.0975918,"name":"Aubergine UE","processId":"b4aa9f18-bb5d-5945-a91b-4123a672f155","rawToCookedRatio":0.856,"scenario":"import","search":"Zucchini, springtime, under tunnel, conventionel, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"french-bean-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.271,"ecosystemicServices":{"cropDiversity":0,"hedges":0.33389,"plotSize":0.83472},"id":"37101a07-9e1f-478d-803a-dad5693dcd8c","inediblePart":0.1,"landOccupation":1.33554,"name":"Haricot vert FR","processId":"ccfeb5f8-0b6b-5c60-b208-e2f60a37faf3","rawToCookedRatio":0.856,"scenario":"reference","search":"French bean, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"french-bean-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.271,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3934ba18-fd22-47f4-ad2e-31805ad8a5f7","inediblePart":0.1,"landOccupation":1.33554,"name":"Haricot vert UE","processId":"ccfeb5f8-0b6b-5c60-b208-e2f60a37faf3","rawToCookedRatio":0.856,"scenario":"import","search":"French bean, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"french-bean-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghrebByPlane","density":0.271,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"a38c77d5-be6c-49e5-beb0-d8d88d556392","inediblePart":0.1,"landOccupation":1.33554,"name":"Haricot vert par défaut","processId":"ccfeb5f8-0b6b-5c60-b208-e2f60a37faf3","rawToCookedRatio":0.856,"scenario":"import","search":"French bean, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"lettuce-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.027216,"plotSize":0.06804},"id":"6348bb16-2d8c-4b82-8dbc-8b7dc587c09b","inediblePart":0.4,"landOccupation":0.108865,"name":"Laitue FR","processId":"0fa6b3c3-4c23-5a4b-9b75-fcbbf2d7cff2","rawToCookedRatio":0.856,"scenario":"reference","search":"Lettuce, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"lettuce-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"2b5cc667-b981-4d27-8b1a-c435fab2043e","inediblePart":0.4,"landOccupation":0.0918483,"name":"Laitue UE","processId":"600ef965-3241-5f80-a283-9ba1a5a6cc41","rawToCookedRatio":0.856,"scenario":"import","search":"Iceberg lettuce {GLO}| production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"lettuce-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"e1495d32-01f6-462c-9157-b8351574d412","inediblePart":0.4,"landOccupation":0.0918483,"name":"Laitue par défaut","processId":"600ef965-3241-5f80-a283-9ba1a5a6cc41","rawToCookedRatio":0.856,"scenario":"import","search":"Iceberg lettuce {GLO}| production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"garden-peas-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.34531,"plotSize":0.86328},"id":"05c2db96-2658-4842-8c30-53e878b08931","inediblePart":0.2,"landOccupation":1.38126,"name":"Petit pois FR","processId":"88c9a2b8-c7f3-5b1c-a64d-0e681fd7db15","rawToCookedRatio":2.33,"scenario":"reference","search":"annual vining pea conventional","transportCooling":"always","visible":true},{"alias":"garden-peas-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3f4037f4-8c7a-45f7-b376-ec48357db98d","inediblePart":0.2,"landOccupation":1.38126,"name":"Petit pois UE","processId":"88c9a2b8-c7f3-5b1c-a64d-0e681fd7db15","rawToCookedRatio":2.33,"scenario":"import","search":"annual vining pea conventional","transportCooling":"none","visible":true},{"alias":"cherry-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":12.99,"hedges":6.1254,"plotSize":12.301},"id":"8ea6e0d1-a163-4059-8a6b-bd443f0168db","inediblePart":0.2,"landOccupation":14.0582,"name":"Cerise FR","processId":"852e4814-4226-570e-ba8c-f5826226d4c1","rawToCookedRatio":0.856,"scenario":"reference","search":"Cherry, conventional, national average, at orchard {FR} U","transportCooling":"always","visible":true},{"alias":"lemon-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"6ece5452-42de-4e0a-8c70-1d305e614cc8","inediblePart":0.3,"landOccupation":0.27999,"name":"Citron UE","processId":"234e9304-1593-5887-9efb-19e5ff210b30","rawToCookedRatio":0.856,"scenario":"import","search":"Lemon {ES}| lemon production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"plum-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":12.99,"hedges":6.1254,"plotSize":12.301},"id":"7829330e-e744-4495-bbe3-c372323ba2a5","inediblePart":0.2,"landOccupation":14.0582,"name":"Prune FR","processId":"852e4814-4226-570e-ba8c-f5826226d4c1","rawToCookedRatio":0.856,"scenario":"reference","search":"Cherry, conventional, national average, at orchard {FR} U","transportCooling":"none","visible":true},{"alias":"squash-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.024398,"plotSize":0.060995},"id":"6689fb67-0118-4dff-b74e-0c8de81ef65b","inediblePart":0.2,"landOccupation":0.0975918,"name":"Courge FR","processId":"b4aa9f18-bb5d-5945-a91b-4123a672f155","rawToCookedRatio":0.856,"scenario":"reference","search":"Zucchini, springtime, under tunnel, conventionel, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"squash-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"14335872-a8d9-4496-b771-cb80c21ad604","inediblePart":0.2,"landOccupation":0.22888,"name":"Courge UE","processId":"05d96115-ab74-5561-8378-f5e63aa2e06a","rawToCookedRatio":0.856,"scenario":"import","search":"Zucchini, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"squash-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0.37941,"hedges":0.07837,"plotSize":0.11852},"id":"bbee841c-6675-49ae-92da-2064877f6d14","inediblePart":0.2,"landOccupation":0.135454,"name":"Courge Bio","processId":"30b69d8c-c7e7-53b5-8317-9a00f3330526","rawToCookedRatio":0.856,"scenario":"organic","search":" \\tZucchini, springtime, under tunnel, organic, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"tomato-heated-greenhouse-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0097929,"plotSize":0.024482},"id":"a96c560e-7959-4698-b533-23f922bb62b9","inediblePart":0.03,"landOccupation":0.0391715,"name":"Tomate sous serre chauffée par défaut","processId":"6645209b-64fa-5f1e-be93-4615814df356","rawToCookedRatio":0.856,"scenario":"reference","search":"Tomato, medium size, conventional, heated greenhouse, at greenhouse {FR} U","transportCooling":"once_transformed","visible":true},{"alias":"tomato-greenhouse-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.015017,"plotSize":0.037543},"id":"16caaefa-40f5-4d29-a3e6-26349846f2c9","inediblePart":0.03,"landOccupation":0.0600685,"name":"Tomate sous serre non chauffée FR","processId":"5e7d0a76-4499-5ea6-987c-799443d641cd","rawToCookedRatio":0.856,"scenario":"reference","search":"Tomato medium size conventional soil based non-heated greenhouse at greenhouse","transportCooling":"once_transformed","visible":true},{"alias":"tomato-greenhouse-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"85641d75-149d-4863-a1a8-463e71a85fc2","inediblePart":0.03,"landOccupation":0.089318,"name":"Tomate UE","processId":"eac81b89-fdd3-5bd4-b484-4da96ff771ed","rawToCookedRatio":0.856,"scenario":"import","search":"Tomato, fresh grade {ES}| tomato production, fresh grade, in unheated greenhouse | Cut-off, U - Copied from Ecoinvent U","transportCooling":"once_transformed","visible":true},{"alias":"apricot-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.54683,"hedges":0.25786,"plotSize":0.51783},"id":"e3865e84-12e7-4f7a-9fe3-132f67713d82","inediblePart":0.2,"landOccupation":0.591809,"name":"Abricot FR","processId":"c0aa196f-3f34-514b-8c72-71723ad96833","rawToCookedRatio":0.856,"scenario":"reference","search":"Apricot {FR}| apricot production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"apricot-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"309e636c-bc57-4adc-bd3c-441c2ee8e42e","inediblePart":0.2,"landOccupation":0.591809,"name":"Abricot UE","processId":"c0aa196f-3f34-514b-8c72-71723ad96833","rawToCookedRatio":0.856,"scenario":"import","search":"Apricot {FR}| apricot production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"hazelnut-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"dfc9b995-2862-4abf-9af9-f3e8e403f325","inediblePart":0.5,"landOccupation":8.0993,"name":"Noisette avec coque par défaut","processId":"008322e1-3451-52da-897c-271b8d51d46d","rawToCookedRatio":1,"scenario":"import","search":"Hazelnut, in shell, at farm {TR} - Adapted from WFLDB U","transportCooling":"none","visible":false},{"alias":"hazelnut-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"dd6c5ca4-9d8a-4b4f-9d5e-fada405f7c39","inediblePart":0.5,"landOccupation":7.05296,"name":"Noisette avec coque UE","processId":"9cac6a0e-0b07-5046-b391-af1161c04be0","rawToCookedRatio":1,"scenario":"import","search":" \\tHazelnut, in shell, at farm {IT} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"hazelnut-unshelled-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3af43703-cba3-4992-837c-a1392b5c6221","inediblePart":0.5,"landOccupation":14.1109,"name":"Noisette décortiquée UE","processId":"89ab67b7-b928-50f2-af53-cf5c0517e67f","rawToCookedRatio":1,"scenario":"import","search":"Hazelnut, unshelled, at plant {IT} U","transportCooling":"none","visible":true},{"alias":"hazelnut-unshelled-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4d7a741d-4bd7-4b39-8648-1f9a2f719eac","inediblePart":0.5,"landOccupation":16.2036,"name":"Noisette décortiquée par défaut","processId":"a63178a5-56f9-5e18-b24e-341b234c1eed","rawToCookedRatio":1,"scenario":"import","search":"Hazelnut, unshelled, at plant {TR} U","transportCooling":"none","visible":false},{"alias":"artichoke-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11127,"plotSize":0.27818},"id":"51eea2d1-abec-4459-aae0-15f8348d0994","inediblePart":0.6,"landOccupation":0.445095,"name":"Artichaut FR","processId":"66065729-d03d-5b6e-9886-61de459fa512","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"artichoke-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":2.1773,"hedges":0.44974,"plotSize":0.68016},"id":"d7630e82-2b60-46cc-b50d-451a32e0887e","inediblePart":0.6,"landOccupation":0.777328,"name":"Artichaut Bio","processId":"fd3f416b-2d5a-57b0-ab91-ad84990345a9","rawToCookedRatio":0.856,"scenario":"organic","search":"Cauliflower, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"cauliflower-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.2355,"ecosystemicServices":{"cropDiversity":1.8868,"hedges":0.38973,"plotSize":0.58941},"id":"0f747732-1b0d-40ba-89a2-715fecd5454f","inediblePart":0.2,"landOccupation":0.673607,"name":"Chou-fleur Bio","processId":"9e9c4463-cdb8-5898-b2cb-9eae73341580","rawToCookedRatio":0.856,"scenario":"organic","search":"Cauliflower, winter, organic, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"cauliflower-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.2355,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11548,"plotSize":0.28869},"id":"a28383f4-4345-44fb-ada3-985d66492f97","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou-fleur FR","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"leek-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0.04321,"plotSize":0.10803},"id":"1d31a371-690d-41dd-9615-2e58bac40e62","inediblePart":0.2,"landOccupation":0.172841,"name":"Poireau FR","processId":"fac7ee85-b1e1-5170-a770-a304716b6d3d","rawToCookedRatio":0.856,"scenario":"reference","search":"Leek, national average, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"beetroot-fr","categories":["vegetable_fresh"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.011451,"plotSize":0.030831},"id":"e3dd5653-be1e-42b1-b11f-e46600d31c3e","inediblePart":0.1,"landOccupation":0.123324,"name":"Betterave rouge FR","processId":"37cce1ad-918a-513f-9a9f-2cbad803db16","rawToCookedRatio":0.856,"scenario":"reference","search":"Carrot, conventional, national average, at farm gate {FR} U \\t","transportCooling":"always","visible":true},{"alias":"turnip-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.030831,"plotSize":0.077077},"id":"9a64a770-f1b0-4980-a5e3-9ea34f930b0d","inediblePart":0.2,"landOccupation":0.123324,"name":"Navet FR","processId":"37cce1ad-918a-513f-9a9f-2cbad803db16","rawToCookedRatio":0.856,"scenario":"reference","search":"Carrot, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"turnip-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"56368adf-7b6f-4535-8555-06ee5a2404c9","inediblePart":0.2,"landOccupation":0.180271,"name":"Navet UE","processId":"c4c3dcbf-d8e4-55b7-ba60-72908ab2f5fa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {NL}| carrot production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"turnip-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"e54fdde1-da74-4cb3-bbc7-5c282be1b02b","inediblePart":0.2,"landOccupation":0.287541,"name":"Navet par défaut","processId":"5b845f63-9f54-5da5-9101-278c4c31d8aa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {RoW}| carrot production | Cut-off, U - Copied from Ecoinvent U","transportCooling":"always","visible":false},{"alias":"chinese-cabbage-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11548,"plotSize":0.28869},"id":"65f1221e-cf4c-413b-b023-8cec646e8ee4","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou chinois FR","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"chinese-cabbage-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":2.1823,"hedges":0.45078,"plotSize":0.68174},"id":"701f6e68-9eb9-4ee2-8b40-a3553811bda4","inediblePart":0.2,"landOccupation":0.779132,"name":"Chou chinois Bio","processId":"eba51895-1c4d-5a81-b404-eafdade4903d","rawToCookedRatio":0.856,"scenario":"organic","search":"Chinese cabbage (nappa cabbage or bok choy), consumption mix, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"white-cabbage-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"cd2b7d2f-b4a0-45cf-8006-0a10a99d78a3","inediblePart":0.2,"landOccupation":0.103602,"name":"Chou blanc par défaut","processId":"5cfe004a-f9af-564a-8d8e-ab6b0d1666d9","rawToCookedRatio":0.856,"scenario":"import","search":"Cabbage white {RoW}| cabbage white production","transportCooling":"always","visible":true},{"alias":"green-cabbage-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11548,"plotSize":0.28869},"id":"ddba1d97-7db9-4ab6-8bc7-43891f69b02c","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou vert FR","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"green-cabbage-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":1.8868,"hedges":0.38973,"plotSize":0.58941},"id":"aef5e0f4-7f91-4b75-b1e8-04594c64a538","inediblePart":0.2,"landOccupation":0.673607,"name":"Chou vert Bio","processId":"9e9c4463-cdb8-5898-b2cb-9eae73341580","rawToCookedRatio":0.856,"scenario":"organic","search":"Cauliflower, winter, organic, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"red-cabbage-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"28f7c945-14d0-4d83-b04d-ea09f48a05b2","inediblePart":0.2,"landOccupation":0.109163,"name":"Chou rouge par défaut","processId":"da587723-8c38-5f26-8d99-680471a579da","rawToCookedRatio":0.856,"scenario":"import","search":"Cabbage red {GLO}| production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"shallot-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0.066103,"plotSize":0.16526},"id":"f83eb463-aa6e-4b64-96ab-6f478152410d","inediblePart":0.1,"landOccupation":0.26441,"name":"Echalote FR","processId":"bc2b7e2a-870e-5e15-ae1b-13e517ddc92e","rawToCookedRatio":0.856,"scenario":"reference","search":"Onion, national average, at farm {FR} U","transportCooling":"always","visible":true},{"alias":"orange-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"af47d8b1-2c50-4f3f-8d10-1941133bd100","inediblePart":0.2,"landOccupation":0.348941,"name":"Orange UE","processId":"f95aed4c-b3fa-513b-9b5a-9eacba761b4a","rawToCookedRatio":0.856,"scenario":"import","search":"Orange, fresh grade, at farm {ES}","transportCooling":"always","visible":true},{"alias":"orange-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"f3c21efc-5e7b-4c24-a7f6-6ffbcb34d5b1","inediblePart":0.2,"landOccupation":0.270831,"name":"Orange par défaut","processId":"880e0e6d-0b3d-5d00-bce6-dfc4ad269d96","rawToCookedRatio":0.856,"scenario":"import","search":"Orange, fresh grade {ZA}| orange production, fresh grade","transportCooling":"always","visible":false},{"alias":"olive-eu","categories":["vegetable_fresh"],"cropGroup":"OLIVIERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4234febf-7bb7-4713-a399-7fd586849e7b","inediblePart":0.5,"landOccupation":2.02685,"name":"Olive UE","processId":"066ea184-266c-5595-a67a-f28517b0f8c8","rawToCookedRatio":1,"scenario":"import","search":"Olive {ES}| olive production | Cut-off, U","transportCooling":"always","visible":true},{"alias":"rapeseed-fr","categories":["nut_oilseed_raw"],"cropGroup":"COLZA","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.83047,"plotSize":0.90832},"id":"6a4df71d-3a0e-4477-8086-010f6a72ffec","inediblePart":0,"landOccupation":3.6333,"name":"Colza FR","processId":"9131c883-c8b8-5517-8cc1-f795ef21b705","rawToCookedRatio":1,"scenario":"reference","search":"Rape seed {FR}| production","transportCooling":"once_transformed","visible":true},{"alias":"rapeseed-eu","categories":["nut_oilseed_raw"],"cropGroup":"COLZA","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"33e9d781-cdd1-4a9b-a6b6-18ee8855c996","inediblePart":0,"landOccupation":5.11924,"name":"Colza UE","processId":"188390aa-01da-5260-901d-b7fa149f3575","rawToCookedRatio":1,"scenario":"import","search":"Rapeseed, at farm {GLO}","transportCooling":"none","visible":false},{"alias":"rapeseed-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"COLZA","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"b127c3f0-7178-40d3-8bf0-433b2b28f386","inediblePart":0,"landOccupation":5.36502,"name":"Colza par défaut","processId":"3cbdf3eb-323c-5609-98f3-0eacfc8b8ff3","rawToCookedRatio":1,"scenario":"import","search":"Rapeseed, at farm {CA}","transportCooling":"none","visible":false},{"alias":"pistachio-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4c1bfb2c-9edd-4a15-8a08-b2ea85268771","inediblePart":0.5,"landOccupation":2.7502,"name":"Pistache avec coque par défaut","processId":"57b2af55-c694-5941-bc0f-1de57f47af5e","rawToCookedRatio":1,"scenario":"import","search":"Peanut {CN}| peanut production","transportCooling":"none","visible":true},{"alias":"peanut-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"df428ef5-1745-404e-b7ab-22cdca785ca4","inediblePart":0.5,"landOccupation":11.3485,"name":"Arachide avec coque par défaut","processId":"8de7e6c9-46d2-5407-ba1a-8cdb906bbc86","rawToCookedRatio":1,"scenario":"import","search":"Peanut {IN}| peanut production | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"olive-oil-eu","categories":["nut_oilseed_processed"],"cropGroup":"OLIVIERS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":5.845,"plotSize":10.53},"id":"f1b219e6-7a77-429b-b372-461e3ad0d3bd","inediblePart":0,"landOccupation":12.0339,"name":"Huile d\'olive UE","processId":"d0d1057d-ccab-5f2a-b5f9-9e28d56a77a1","rawToCookedRatio":1,"scenario":"reference","search":"Extra Virgin Olive Oil consumption","transportCooling":"none","visible":true},{"alias":"avocado-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3c49c70f-7650-44f8-97f1-7490cbabf595","inediblePart":0.3,"landOccupation":1.01943,"name":"Avocat par défaut","processId":"bd459132-6ab3-5f48-88e5-f99c5cb893e0","rawToCookedRatio":0.856,"scenario":"import","search":"Avocado {GLO}| production","transportCooling":"always","visible":true},{"alias":"chickpea-fr","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.57879,"plotSize":1.3971},"id":"89035410-466b-4c9d-8726-98f0928b664b","inediblePart":0.2,"landOccupation":2.79414,"name":"Pois chiche FR","processId":"c426ce20-85f9-5ae4-91da-d1e015cd445d","rawToCookedRatio":2.33,"scenario":"reference","search":"Winter pea, conventional, 15% moisture, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"sunflower-fr","categories":["nut_oilseed_raw"],"cropGroup":"TOURNESOL","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":1.9217,"hedges":1.3625,"plotSize":1.7882},"id":"f105f36b-f467-4aea-8da7-8bc2e113db20","inediblePart":0.5,"landOccupation":4.76861,"name":"Tournesol FR","processId":"a0b4cdb4-e9a7-5a10-925c-3b435d58ae59","rawToCookedRatio":1,"scenario":"reference","search":"Sunflower at farm FR Adapted from WFLDB","transportCooling":"none","visible":true},{"alias":"sunflower-eu","categories":["nut_oilseed_raw"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"23cd53c5-4b66-4b7c-892f-fe74054f66e5","inediblePart":0.5,"landOccupation":2.12399,"name":"Tournesol UE","processId":"6d737375-f7f8-5d68-aed5-df00b19e90f7","rawToCookedRatio":1,"scenario":"import","search":"Sunflower, at farm {HU}","transportCooling":"none","visible":true},{"alias":"sunflower-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"TOURNESOL","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"a2d31857-322c-40a7-a0a4-563e74a685d2","inediblePart":0.5,"landOccupation":3.49448,"name":"Tournesol par défaut","processId":"fb685215-e9fb-5673-88e8-99a44bea7ae8","rawToCookedRatio":1,"scenario":"import","search":"Sunflower, at farm {Glo}","transportCooling":"none","visible":false},{"alias":"kiwi-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.88897,"hedges":0.41919,"plotSize":0.84183},"id":"f3ed8d7b-21be-4d21-aae0-fee3ae914224","inediblePart":0.1,"landOccupation":0.962086,"name":"Kiwi FR","processId":"ae81e897-0672-5926-b967-6a95ed4a6e74","rawToCookedRatio":0.856,"scenario":"reference","search":"Kiwi FR, conventional, national average, at orchard {FR}","transportCooling":"always","visible":true},{"alias":"kiwi-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"cf4d7abd-8cd6-48ef-bc83-212ad3f672b9","inediblePart":0.1,"landOccupation":0.317808,"name":"Kiwi UE","processId":"7d8bb140-3cdc-52d4-8a75-052bcd248d13","rawToCookedRatio":0.856,"scenario":"import","search":"Kiwi {GLO}| production","transportCooling":"always","visible":true},{"alias":"kiwi-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"5c5663f5-3075-4814-92ff-1f65c99ad518","inediblePart":0.1,"landOccupation":0.317808,"name":"Kiwi par défaut","processId":"7d8bb140-3cdc-52d4-8a75-052bcd248d13","rawToCookedRatio":0.856,"scenario":"import","search":"Kiwi {GLO}| production","transportCooling":"always","visible":true},{"alias":"mango-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghrebByPlane","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"db0e5f44-34b4-4160-b003-77c828d75e60","inediblePart":0.2,"landOccupation":0.410125,"name":"Mangue par défaut","processId":"7593f9cb-9e30-57de-8d56-3f34fe6c70ea","rawToCookedRatio":0.856,"scenario":"import","search":"Mango, conventional, Val de San Francisco, at orchard {BR} U","transportCooling":"always","visible":true},{"alias":"spinach-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"f46de7f5-4bf0-45f4-b75b-3e00164dd9ca","inediblePart":0.03,"landOccupation":0.0462044,"name":"Epinard par défaut","processId":"f4f0f1ad-fb1e-5a77-b7c7-295bab0aa450","rawToCookedRatio":0.856,"scenario":"import","search":"Spinach {GLO}| production |","transportCooling":"always","visible":true},{"alias":"fennel-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.039703,"plotSize":0.099258},"id":"63717c79-e734-4af3-bc3c-d75070f1822d","inediblePart":0.2,"landOccupation":0.158812,"name":"Fenouil FR","processId":"4e31f68b-b313-5b4f-8189-4885b17abeb2","rawToCookedRatio":0.856,"scenario":"reference","search":"Fennel {GLO}| production","transportCooling":"always","visible":true},{"alias":"fennel-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7415767c-42a3-410e-a046-b78b4ed74645","inediblePart":0.2,"landOccupation":0.158812,"name":"Fenouil UE","processId":"4e31f68b-b313-5b4f-8189-4885b17abeb2","rawToCookedRatio":0.856,"scenario":"import","search":"Fennel {GLO}| production","transportCooling":"always","visible":true},{"alias":"broccoli-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.2355,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0bb22705-4727-4660-ac02-d7c2a564b20e","inediblePart":0.2,"landOccupation":0.117091,"name":"Brocoli UE","processId":"541345f4-30e5-5055-bc4f-c2be8ef2fb94","rawToCookedRatio":0.856,"scenario":"import","search":"Broccoli {GLO}| production","transportCooling":"always","visible":true},{"alias":"blueberry-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"b193fd9e-99ab-4d1b-8e81-3b38bab2eacf","inediblePart":0.03,"landOccupation":3.45114,"name":"Myrtille par défaut","processId":"e2685c22-5b8b-57b9-b112-590de9ce9b7f","rawToCookedRatio":0.856,"scenario":"import","search":"Blueberry, at farm {CA} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"raspberry-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"50939126-d4a5-4b94-b110-63e8b9e66173","inediblePart":0.03,"landOccupation":2.02866,"name":"Framboise UE","processId":"b5cc81b8-a6b6-5ad6-8841-b72e825ec7ed","rawToCookedRatio":0.856,"scenario":"import","search":"Raspberry, at farm {RS} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"strawberry-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ce20da3d-0ce4-49e9-8942-6d99ff0221b1","inediblePart":0.03,"landOccupation":1.95,"name":"Fraise UE","processId":"0bbd4c8b-513d-5abe-8bfc-ae981646eb1b","rawToCookedRatio":0.856,"scenario":"import","search":"Strawberry for processing, open field, conventional, at farm gate {ES}","transportCooling":"always","visible":true},{"alias":"strawberry-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"e5bf7d33-6afe-46d6-ac06-f69c5769b10e","inediblePart":0.03,"landOccupation":1.27,"name":"Fraise par défaut","processId":"4ef5c851-6dec-5e0f-b758-a694732f7c1a","rawToCookedRatio":0.856,"scenario":"import","search":"Strawberry for processing, open field, conventional, at farm gate {MA}","transportCooling":"always","visible":true},{"alias":"banana-wi","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0.32133,"hedges":0.15152,"plotSize":0.30429},"id":"127b7cfe-0686-4455-8f8d-3c8bc034cbf9","inediblePart":0.3,"landOccupation":0.347759,"name":"Banane antillaise","processId":"03c717e8-da0d-51dd-a9d0-56379b532557","rawToCookedRatio":0.856,"scenario":"reference","search":"Banana, mixed production, West Indies, at farm gate {WI} U","transportCooling":"always","visible":true},{"alias":"banana-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"f79d155e-3f9e-4882-8dd0-b03f28c1ff76","inediblePart":0.3,"landOccupation":0.275967,"name":"Banane par défaut","processId":"90f4690b-2ffd-580f-8848-ed3f1ce1e0a1","rawToCookedRatio":0.856,"scenario":"import","search":"Banana, at farm {GLO}","transportCooling":"always","visible":true},{"alias":"cucumber-fr-inseason","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.015017,"plotSize":0.037543},"id":"d47b842a-f591-4ce9-9f1d-2aebcaaa3c37","inediblePart":0.1,"landOccupation":0.0600685,"name":"Concombre de saison FR","processId":"5e7d0a76-4499-5ea6-987c-799443d641cd","rawToCookedRatio":0.856,"scenario":"reference","search":"Tomato, medium size, conventional, soil based, non-heated greenhouse, at greenhouse","transportCooling":"always","visible":true},{"alias":"cucumber-fr-offseason","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.05634,"plotSize":0.14085},"id":"51cc3b34-c2de-4617-8954-3c35c703a6dc","inediblePart":0.1,"landOccupation":0.225361,"name":"Concombre hors saison FR","processId":"cbc07034-7585-5e64-800f-574a226e0370","rawToCookedRatio":0.856,"scenario":"reference","search":"Cucumber {GLO}| cucumber production, in heated greenhouse","transportCooling":"always","visible":true},{"alias":"cucumber-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7b62c28f-7234-4c81-abc0-721c421cbc3d","inediblePart":0.1,"landOccupation":0.225361,"name":"Concombre hors saison UE","processId":"cbc07034-7585-5e64-800f-574a226e0370","rawToCookedRatio":0.856,"scenario":"import","search":"Cucumber {GLO}| cucumber production, in heated greenhouse","transportCooling":"always","visible":true},{"alias":"strawberry-fr-inseason","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.15949,"plotSize":0.39873},"id":"800c5ae3-677d-4e12-9dd8-1c11cd69a210","inediblePart":0.03,"landOccupation":0.63797,"name":"Fraise de saison FR ","processId":"371408e3-0071-5441-b52b-281e7c769ac9","rawToCookedRatio":0.856,"scenario":"reference","search":"Strawberry, open field, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"strawberry-fr-offseason","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.27052,"plotSize":0.6763},"id":"3c20126c-e2ab-403b-8bbc-0fc0d2fd3a1b","inediblePart":0.03,"landOccupation":1.08208,"name":"Fraise hors saison FR","processId":"db14ecbb-3be0-5737-ab81-61ce637a7d5e","rawToCookedRatio":0.856,"scenario":"reference","search":"Strawberry, soilless protected crops, heated, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"celery-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.034583,"plotSize":0.086456},"id":"e1dbeb7c-74a7-4248-ab5e-7bdc2b1e5286","inediblePart":0.03,"landOccupation":0.13833,"name":"Céleri branche FR","processId":"d20ecc68-b2f7-536b-9225-a8c8ff470c51","rawToCookedRatio":0.856,"scenario":"reference","search":"Celery {GLO}| 675 production","transportCooling":"always","visible":true},{"alias":"celery-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0bf89106-5c02-4b81-8f28-6196ad6f58be","inediblePart":0.03,"landOccupation":0.13833,"name":"Céleri branche UE","processId":"d20ecc68-b2f7-536b-9225-a8c8ff470c51","rawToCookedRatio":0.856,"scenario":"import","search":"Celery {GLO}| 675 production","transportCooling":"always","visible":true},{"alias":"celeriac-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.030831,"plotSize":0.077077},"id":"88c0d4ba-93d6-4a41-94e6-ccec49cce325","inediblePart":0.03,"landOccupation":0.123324,"name":"Céleri-rave FR","processId":"37cce1ad-918a-513f-9a9f-2cbad803db16","rawToCookedRatio":0.856,"scenario":"reference","search":"Carrot, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"celeriac-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"a4c2f300-9268-45cc-a14f-89c48fcabc14","inediblePart":0.03,"landOccupation":0.180271,"name":"Céleri-rave UE","processId":"c4c3dcbf-d8e4-55b7-ba60-72908ab2f5fa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {NL}| carrot production | Cut-off, U","transportCooling":"always","visible":true},{"alias":"celeriac-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"1f5dd2a5-8439-4949-b5d8-2bce0ec3c9c7","inediblePart":0.03,"landOccupation":0.287541,"name":"Céleri-rave par défaut","processId":"5b845f63-9f54-5da5-9101-278c4c31d8aa","rawToCookedRatio":0.856,"scenario":"import","search":"Carrot {RoW}| carrot production | Cut-off, U - Copied from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"walnut-inshell-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.9584,"plotSize":5.712},"id":"6aacd47b-541c-4aab-85fb-bcd2c924effb","inediblePart":0.5,"landOccupation":6.52804,"name":"Noix avec coque FR","processId":"c950c222-2532-50ad-9147-e65600b921ba","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried inshell, national average, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"walnut-husked-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.8486,"plotSize":5.3917},"id":"63bc644e-fc29-45a5-a505-6a28c8f266c5","inediblePart":0.5,"landOccupation":6.16195,"name":"Noix décortiquées FR","processId":"ebe13be3-f0bf-57a7-9def-e785d2b12792","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried, husked, processed in FR | Ambient (long) | LDPE | at packaging {FR}","transportCooling":"none","visible":true},{"alias":"chestnut-husked-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.8486,"plotSize":5.3917},"id":"deb218ab-9c48-41ea-a9c7-6acc185cd83c","inediblePart":0.5,"landOccupation":6.16195,"name":"Châtaigne décortiquée FR","processId":"ebe13be3-f0bf-57a7-9def-e785d2b12792","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried, husked, processed in FR | Ambient (long) | LDPE | at packaging {FR}","transportCooling":"none","visible":true},{"alias":"chestnut-inshell-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.8404,"plotSize":5.3679},"id":"ae6a572a-d814-495e-b6a9-5b0acff707d9","inediblePart":0.5,"landOccupation":6.13472,"name":"Châtaigne avec coque FR","processId":"fc11f492-148e-50b1-a041-248c6360fc47","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried inshell, conventional, national average, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"mandarin-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7967ae83-ba85-4a8f-aed9-e96717fc4284","inediblePart":0.2,"landOccupation":0.344427,"name":"Mandarine UE","processId":"4c60c67c-5710-5388-acb8-a9d7e13f687a","rawToCookedRatio":0.856,"scenario":"import","search":"Mandarin {ES}| mandarin production","transportCooling":"always","visible":true},{"alias":"mushroom-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"5d22559d-c16d-4545-94b9-be2ff51e2879","inediblePart":0.1,"landOccupation":0.514552,"name":"Champignon frais UE","processId":"973dcd67-31ce-5a1c-8db6-152cbc241232","rawToCookedRatio":0.856,"scenario":"import","search":"Agaricus bisporus mushroom, fresh, at plant {NL} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"brussels-sprout-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11548,"plotSize":0.28869},"id":"f8e12f3a-6308-425c-bede-f8f9dbe405ee","inediblePart":0.1,"landOccupation":0.461912,"name":"Chou de Bruxelles FR","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"brussels-sprout-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":1.8868,"hedges":0.38973,"plotSize":0.58941},"id":"65296024-b028-46c2-be67-84068893cfe3","inediblePart":0.1,"landOccupation":0.673607,"name":"Chou de Bruxelles Bio","processId":"9e9c4463-cdb8-5898-b2cb-9eae73341580","rawToCookedRatio":0.856,"scenario":"organic","search":"Cauliflower, winter, organic, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"lentils-uncooked-fr","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.2397,"plotSize":2.9924},"id":"e3833045-a0a4-48c7-ab73-5a01834b0219","inediblePart":0,"landOccupation":5.98476,"name":"Lentilles FR","processId":"e45f6ccb-035e-569c-80c5-f8a26993c5b3","rawToCookedRatio":2.33,"scenario":"reference","search":"Lentils, dry, at farm (WFLDB)","transportCooling":"none","visible":true},{"alias":"curly-kale-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.11548,"plotSize":0.28869},"id":"40969824-958c-47b7-8e9e-6b3e80bb1176","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou frisé FR","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"reference","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"curly-kale-organic","categories":["organic","vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":1.8868,"hedges":0.38973,"plotSize":0.58941},"id":"577ca86a-b599-4757-9b98-712529a29738","inediblePart":0.2,"landOccupation":0.673607,"name":"Chou frisé Bio","processId":"9e9c4463-cdb8-5898-b2cb-9eae73341580","rawToCookedRatio":0.856,"scenario":"organic","search":"Cauliflower, winter, organic, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"pumpkin-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.05722,"plotSize":0.14305},"id":"ae0e7729-1bff-4c3b-8dc8-62bdb827345d","inediblePart":0.2,"landOccupation":0.22888,"name":"Citrouille FR","processId":"05d96115-ab74-5561-8378-f5e63aa2e06a","rawToCookedRatio":0.856,"scenario":"reference","search":"Zucchini, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"clementine-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"299941e9-577c-4618-968c-6901ffa99a8d","inediblePart":0.2,"landOccupation":0.531658,"name":"Clémentine par défaut","processId":"c6598f48-29cb-5b7c-9add-d58080fbd04c","rawToCookedRatio":0.856,"scenario":"import","search":"Clementine, export quality, Souss, at orchard {MA}","transportCooling":"always","visible":true},{"alias":"endive-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.027216,"plotSize":0.06804},"id":"b26efb2f-8811-4fbb-9d01-3d7f0d8135ef","inediblePart":0.2,"landOccupation":0.108865,"name":"Endive FR","processId":"0fa6b3c3-4c23-5a4b-9b75-fcbbf2d7cff2","rawToCookedRatio":0.856,"scenario":"reference","search":"Lettuce, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"endive-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"d680c44f-8458-406a-ac2c-13cd83e90a07","inediblePart":0.2,"landOccupation":0.0918483,"name":"Endive UE","processId":"600ef965-3241-5f80-a283-9ba1a5a6cc41","rawToCookedRatio":0.856,"scenario":"import","search":"Iceberg lettuce {GLO}| production |","transportCooling":"always","visible":true},{"alias":"wine-grape-fr","categories":["vegetable_fresh"],"cropGroup":"VIGNES","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.24237,"plotSize":0.8483},"id":"88d41160-fad0-4f85-b911-704dcfb387e4","inediblePart":0.1,"landOccupation":0.96949,"name":"Raisin de cuve FR","processId":"36d90e73-5553-5eae-8652-3522dec59c7a","rawToCookedRatio":0.856,"scenario":"reference","search":"Grape full production integrated variety mix","transportCooling":"always","visible":true},{"alias":"lambs-lettuce-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.027216,"plotSize":0.06804},"id":"4f53cbe2-feac-42ea-90cf-62856732103b","inediblePart":0.4,"landOccupation":0.108865,"name":"Mâche FR","processId":"0fa6b3c3-4c23-5a4b-9b75-fcbbf2d7cff2","rawToCookedRatio":0.856,"scenario":"reference","search":"Lettuce, conventional, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"lambs-lettuce-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"91e07b83-8702-42a4-a362-1480a2090805","inediblePart":0.4,"landOccupation":0.0918483,"name":"Mâche UE","processId":"600ef965-3241-5f80-a283-9ba1a5a6cc41","rawToCookedRatio":0.856,"scenario":"import","search":"Iceberg lettuce {GLO}| production","transportCooling":"always","visible":false},{"alias":"sweet-corn-fr","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.46302,"plotSize":0.47664},"id":"40fa68b6-381e-4dd6-ba70-8b43cfdee64e","inediblePart":0.5,"landOccupation":0.953277,"name":"Maïs doux FR","processId":"6f6b1e9b-db7f-568a-bb80-a237c615e706","rawToCookedRatio":2.259,"scenario":"reference","search":"Maize grain, conventional, 28% moisture, national average, animal feed, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"sweet-corn-organic-fr","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":1.5286,"hedges":0.81578,"plotSize":0.73211},"id":"741c0970-2823-430a-b4e4-e61ce08ea95a","inediblePart":0.5,"landOccupation":1.46421,"name":"Maïs doux Bio","processId":"4554e0a7-4ea3-59b2-8f90-1aac62d21829","rawToCookedRatio":2.259,"scenario":"organic","search":"Grain maize, organic, animal feed, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"sweet-corn-br","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"be9a2aa4-4c8b-4801-abcf-01ba1581f053","inediblePart":0.5,"landOccupation":2.25759,"name":"Maïs doux par défaut","processId":"fe182ad6-7885-5f31-9afb-11b26d1af210","rawToCookedRatio":2.259,"scenario":"import","search":"Maize grain, non-irrigated, at farm {BR} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"pineapple-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c1ca415f-85bb-43f6-bf8f-8bedd6f95e9a","inediblePart":0.5,"landOccupation":0.238316,"name":"Ananas par défaut","processId":"b7c09419-740e-57af-b3f1-ea8723fa71d5","rawToCookedRatio":0.856,"scenario":"import","search":"Pineapple glo","transportCooling":"always","visible":true},{"alias":"broad-beans-eu","categories":["vegetable_fresh"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ec58c11c-c5fd-4884-8d66-3d434aa1da1d","inediblePart":0.2,"landOccupation":2.80125,"name":"Fève UE","processId":"d21e3ed0-01e3-5f17-955f-10171826a34a","rawToCookedRatio":2.33,"scenario":"import","search":"Fava bean, Swiss integrated production {CH}| fava bean production, Swiss integrated production, at farm","transportCooling":"none","visible":true},{"alias":"broad-beans-fr","categories":["vegetable_fresh"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.66029,"plotSize":1.0505},"id":"d1d5713d-021f-4438-95c8-0496da3f0f5f","inediblePart":0.2,"landOccupation":2.80125,"name":"Fève FR","processId":"d21e3ed0-01e3-5f17-955f-10171826a34a","rawToCookedRatio":2.33,"scenario":"reference","search":"Fava bean, Swiss integrated production {CH}| fava bean production, Swiss integrated production, at farm","transportCooling":"none","visible":true},{"alias":"swiss-chard-eu","categories":["vegetable_fresh"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"EuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"d5eaecd5-21ab-4903-b029-66e7c7c6df9a","inediblePart":0.03,"landOccupation":0.0462044,"name":"Blette UE","processId":"f4f0f1ad-fb1e-5a77-b7c7-295bab0aa450","rawToCookedRatio":0.856,"scenario":"import","search":"Spinach GLO production","transportCooling":"always","visible":true},{"alias":"swiss-chard-fr","categories":["vegetable_fresh"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0042904,"plotSize":0.011551},"id":"2920acc6-000a-4f43-9525-7d619d19f62e","inediblePart":0.03,"landOccupation":0.0462044,"name":"Blette FR","processId":"f4f0f1ad-fb1e-5a77-b7c7-295bab0aa450","rawToCookedRatio":0.856,"scenario":"reference","search":"Spinach GLO production","transportCooling":"always","visible":true},{"alias":"flageolet-bean-eu","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"1ab7c8e7-fb50-4e5d-b153-372f853514cf","inediblePart":0.2,"landOccupation":2.80125,"name":"Haricot flageolet UE","processId":"d21e3ed0-01e3-5f17-955f-10171826a34a","rawToCookedRatio":2.33,"scenario":"import","search":"Fava bean, Swiss integrated production {CH}| fava bean production, Swiss integrated production, at farm","transportCooling":"none","visible":true},{"alias":"flageolet-bean-fr","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.70031,"plotSize":1.7508},"id":"b5c5285f-8dfe-4865-bdc9-8d86b6977d14","inediblePart":0.2,"landOccupation":2.80125,"name":"Haricot flageolet FR","processId":"d21e3ed0-01e3-5f17-955f-10171826a34a","rawToCookedRatio":2.33,"scenario":"reference","search":"Fava bean, Swiss integrated production {CH}| fava bean production, Swiss integrated production, at farm","transportCooling":"none","visible":true},{"alias":"rice-basmati-non-eu","categories":["grain_raw"],"cropGroup":"RIZ","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"cce078cf-3d3e-4153-a0a1-35555b2da639","inediblePart":0,"landOccupation":1.20794,"name":"Riz basmati par défaut","processId":"aeef59c5-49ea-5bb0-9bd8-185c1d9fe1fc","rawToCookedRatio":2.259,"scenario":"import","search":"Rice, basmati {IN}| rice production, basmati | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"none","visible":true},{"alias":"soft-wheat-organic","categories":["grain_raw","organic"],"cropGroup":"BLE TENDRE","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":6.3204,"hedges":0.8841,"plotSize":1.3167},"id":"a98b8776-a96d-48e9-b218-976f5452907a","inediblePart":0,"landOccupation":2.6335,"name":"Blé tendre Bio","processId":"c8ecf4f4-fcb7-59e5-b1da-da2c2852e4c5","rawToCookedRatio":2.259,"scenario":"organic","search":"Wheat, organic, national average, at farm gate FR U constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soft-wheat-fr","categories":["grain_raw"],"cropGroup":"BLE TENDRE","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.37157,"plotSize":0.50019},"id":"38788025-a65e-4edf-a92f-aab0b89b0d61","inediblePart":0,"landOccupation":1.33383,"name":"Blé tendre FR","processId":"222e8723-dee4-5279-83c5-65b1b1e9abbf","rawToCookedRatio":2.259,"scenario":"reference","search":"Soft wheat grain conventional national average animal feed at farm gate production","transportCooling":"none","visible":true},{"alias":"soft-wheat-non-eu","categories":["grain_raw"],"cropGroup":"BLE TENDRE","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"48c1fc68-01bb-4541-a274-ce1de33db1f9","inediblePart":0,"landOccupation":2.7526,"name":"Blé tendre par défaut","processId":"d7e924ef-91a9-57da-9fb4-f05a3f3afd08","rawToCookedRatio":2.259,"scenario":"import","search":"Wheat grain, at farm {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"durum-wheat-fr","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.88916,"plotSize":1.2549},"id":"28013f55-a3ce-4ae6-9a97-133ce7724ece","inediblePart":0,"landOccupation":2.00777,"name":"Blé dur FR","processId":"58c87222-b99a-52c1-9ebd-8f20e24b8822","rawToCookedRatio":2.259,"scenario":"reference","search":"Durum wheat grain, conventional, national average, at farm gate {FR}","transportCooling":"none","visible":true},{"alias":"durum-wheat-eu","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0d5d65e0-6ffc-4ffa-9966-944bc3ed62c8","inediblePart":0,"landOccupation":3.52234,"name":"Blé dur UE","processId":"048279c0-674b-530a-8bb4-95b60eb48a58","rawToCookedRatio":2.259,"scenario":"import","search":"Durum wheat grain, at farm {GR} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"durum-wheat-non-eu","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"2e196834-d2b1-4786-9265-db4440c8517c","inediblePart":0,"landOccupation":3.37551,"name":"Blé dur par défaut","processId":"5d728287-85a3-5b30-a82b-b0bc12fcef5e","rawToCookedRatio":2.259,"scenario":"import","search":"Durum wheat grain, at farm {AU} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"apple-organic","categories":["organic","vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.27428,"hedges":0.31196,"plotSize":0.38215},"id":"3d3fc6bd-0a43-462b-bc39-fed04cf34498","inediblePart":0.1,"landOccupation":0.436748,"name":"Pomme Bio","processId":"0beb4cce-479f-588c-a8ae-27a5af4d61a5","rawToCookedRatio":0.856,"scenario":"organic","search":"Table apple, consumption mix, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"apple-fr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.22621,"hedges":0.10667,"plotSize":0.21421},"id":"d9519b9d-d166-4bb0-8f34-27bb874b104a","inediblePart":0.1,"landOccupation":0.244814,"name":"Pomme FR","processId":"cf93fb65-5f08-5834-804f-fb8d0c9e13d0","rawToCookedRatio":0.856,"scenario":"reference","search":"Apple, conventional, national average, at orchard {FR} U","transportCooling":"always","visible":true},{"alias":"potato-table-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":1.4026,"hedges":0.28973,"plotSize":0.43816},"id":"5ba9ada3-0712-42c4-a13c-a5c5df639943","inediblePart":0.1,"landOccupation":0.500759,"name":"Pomme de terre de table Bio","processId":"16ef7087-994f-5773-bee1-ed702e8cfafa","rawToCookedRatio":0.856,"scenario":"organic","search":"Ware potato, organic 2023, variety mix, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"potato-industry-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":1.4014,"hedges":0.28947,"plotSize":0.43779},"id":"f839b523-b133-430f-9533-419b862e69e9","inediblePart":0.1,"landOccupation":0.500327,"name":"Pomme de terre industrie Bio","processId":"8f8d7cb1-c0f2-58aa-815b-52c04bb50e89","rawToCookedRatio":0.856,"scenario":"organic","search":"Ware potato, organic 2023, for industrial use, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"kiwi-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.43185,"hedges":0.49119,"plotSize":0.6017},"id":"7a04d33d-fb27-41f8-bbb3-85dc5662f24c","inediblePart":0.1,"landOccupation":0.687662,"name":"Kiwi Bio","processId":"3fe25ce7-6316-5e3f-94df-c617f0d29be6","rawToCookedRatio":0.856,"scenario":"organic","search":"Kiwi, consumption mix, organic 2023 {FR}","transportCooling":"always","visible":false},{"alias":"red-cabbage-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0.41275,"hedges":0.085257,"plotSize":0.12894},"id":"ba292cce-6815-45e3-be3e-ed34a3b04a6f","inediblePart":0.2,"landOccupation":0.147358,"name":"Chou rouge Bio","processId":"74fb0fdb-d880-56d8-9a1f-0357daafcfe6","rawToCookedRatio":0.856,"scenario":"organic","search":"Red Cabbage, consumption mix, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"sugar-beet-organic","categories":["vegetable_processed","organic"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0.13659,"hedges":0.030488,"plotSize":0.070468},"id":"83ef3fba-9359-4f51-9f10-234c0e940b88","inediblePart":0,"landOccupation":0.0805347,"name":"Betterave sucrière Bio","processId":"f9b0f39b-df02-5943-b183-5bf7c178b5fe","rawToCookedRatio":1,"scenario":"organic","search":"Sugar beet, organic 2023 {FR}| sugar beet production","transportCooling":"always","visible":true},{"alias":"papaya-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0.1187,"hedges":0.13501,"plotSize":0.16539},"id":"8eec6aa3-2234-468c-aa5a-cfb364285ac9","inediblePart":0.2,"landOccupation":0.18902,"name":"Papaye Bio","processId":"1dcbc55f-c12e-5ff1-b3b0-4ac1427a8e72","rawToCookedRatio":1,"scenario":"organic","search":"Papaya, consumption mix, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"tomato-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.25352,"hedges":0.052368,"plotSize":0.079198},"id":"b43ae38e-a9f6-4272-b258-14faea6ec795","inediblePart":0.03,"landOccupation":0.0905117,"name":"Tomate Bio","processId":"3c203e41-2b6d-5bdb-bbde-0f8b706bf128","rawToCookedRatio":0.856,"scenario":"organic","search":"Fresh tomato, consumption mix, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"pineapple-organic","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0.17208,"hedges":0.19573,"plotSize":0.23977},"id":"0f52bae1-07d0-446d-ae5b-f246f894ac3b","inediblePart":0.5,"landOccupation":0.274019,"name":"Ananas Bio","processId":"0050f67f-5cb7-552c-af06-2d5f824112fc","rawToCookedRatio":0.856,"scenario":"organic","search":"Pineapple, organic 2023 {GLO}| production","transportCooling":"always","visible":true},{"alias":"garden-peas-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":13.539,"hedges":2.7966,"plotSize":4.2295},"id":"74a016ae-d486-4766-adfd-e44697b7be2f","inediblePart":0.2,"landOccupation":4.83366,"name":"Petit pois Bio","processId":"13e48bf9-dc12-5925-9044-e33a63c37f80","rawToCookedRatio":2.33,"scenario":"organic","search":"Garden peas, consumption mix, organic 2023 {FR} U","transportCooling":"always","visible":true},{"alias":"almond-inshell-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.7442,"plotSize":5.0872},"id":"b97e29ab-81b0-478e-b73b-4113aaf68470","inediblePart":0.5,"landOccupation":5.81392,"name":"Amandes en coque Bio","processId":"5f01b49c-e4b2-52cd-9d50-30a8f6c3c711","rawToCookedRatio":1,"scenario":"organic","search":"Almonds, in shell, at farm, organic 2023 {CN}","transportCooling":"none","visible":true},{"alias":"lettuce-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0.24636,"hedges":0.050889,"plotSize":0.076961},"id":"83adcc36-72b1-4bff-b7bb-c6ac6f2a4a0b","inediblePart":0.4,"landOccupation":0.0879558,"name":"Laitue Bio","processId":"a5cc09cd-2ee4-523f-92c3-c24efdfc2fd6","rawToCookedRatio":0.856,"scenario":"organic","search":"Lettuce, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"mango-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghrebByPlane","density":0.447,"ecosystemicServices":{"cropDiversity":0.5288,"hedges":0.60146,"plotSize":0.73679},"id":"ef57c898-8780-48cb-b00f-7d8a310f46aa","inediblePart":0.2,"landOccupation":0.842044,"name":"Mangue Bio","processId":"ce81ca82-6b0d-5bb0-a744-205595d8079c","rawToCookedRatio":0.856,"scenario":"organic","search":"Mango, organic 2023, Val de San Francisco, at orchard {BR} U","transportCooling":"always","visible":true},{"alias":"lychee-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0.5288,"hedges":0.60146,"plotSize":0.73679},"id":"03ecc69a-01a4-4ca2-83ba-77e8310d034a","inediblePart":0.2,"landOccupation":0.842044,"name":"Litchi Bio","processId":"ce81ca82-6b0d-5bb0-a744-205595d8079c","rawToCookedRatio":0.856,"scenario":"organic","search":"Mango, organic 2023, Val de San Francisco, at orchard {BR} U","transportCooling":"always","visible":true},{"alias":"lychee-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"e9764c3c-554f-4f1e-9ba1-8debc869e6ba","inediblePart":0.2,"landOccupation":0.410125,"name":"Litchi par défaut","processId":"7593f9cb-9e30-57de-8d56-3f34fe6c70ea","rawToCookedRatio":0.856,"scenario":"import","search":"Mango, conventional, Val de San Francisco, at orchard {BR} U","transportCooling":"always","visible":true},{"alias":"oats-glo","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"94c4be9e-452d-4870-b1a2-5d2404a0490b","inediblePart":0,"landOccupation":1.76034,"name":"Avoine par défaut","processId":"e1c15b25-68bd-5019-a24f-977dcdd42c37","rawToCookedRatio":2.259,"scenario":"import","search":"Oats, at farm {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":false},{"alias":"oats-organic","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":3.4688,"hedges":1.2008,"plotSize":1.4799},"id":"1af0933a-0139-480c-832d-053513d0ccba","inediblePart":0,"landOccupation":2.36777,"name":"Avoine Bio","processId":"d3eb6018-2a94-568c-bc3b-dfc997764b1d","rawToCookedRatio":2.259,"scenario":"organic","search":"Spring oats, organic, national average, at feed plant {FR}","transportCooling":"none","visible":false},{"alias":"barley","categories":["grain_raw"],"cropGroup":"ORGE","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.38485,"plotSize":0.56125},"id":"ab087863-f311-4066-8e93-4d7f6e0db2b2","inediblePart":0,"landOccupation":1.49666,"name":"Orge FR","processId":"07dd9feb-f35b-5d86-8369-64a54df35be4","rawToCookedRatio":2.259,"scenario":"reference","search":"Barley, feed grain, conventional, national average, animal feed, at farm gate {FR}","transportCooling":"none","visible":false},{"alias":"barley-organic","categories":["grain_raw"],"cropGroup":"ORGE","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":6.348,"hedges":1.1579,"plotSize":1.8092},"id":"3c16dc23-021d-45ef-8805-c77b043b041a","inediblePart":0,"landOccupation":2.89468,"name":"Orge Bio","processId":"cddd4ef4-9810-5e9f-890f-846a05c9c285","rawToCookedRatio":2.259,"scenario":"organic","search":"Barley, organic, animal feed, at farm gate {FR} U","transportCooling":"none","visible":false},{"alias":"banana-organic","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0.3324,"hedges":0.37807,"plotSize":0.46313},"id":"b3f92ca9-3121-4e2d-9e1d-0cc2c5d392fe","inediblePart":0.3,"landOccupation":0.529292,"name":"Banane Bio","processId":"6adbf7fa-1de0-5251-a324-5d63f2aabcb8","rawToCookedRatio":0.856,"scenario":"organic","search":"Banana, consumption mix, organic 2023 {FR} U","transportCooling":"always","visible":true},{"alias":"orange-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0.24155,"hedges":0.27474,"plotSize":0.33655},"id":"1716c0e6-7a04-4649-a71f-08a495eb094e","inediblePart":0.2,"landOccupation":0.38463,"name":"Orange Bio","processId":"bbb1f24f-5a84-577c-9fcb-80bb9fa3e92b","rawToCookedRatio":0.856,"scenario":"organic","search":"Orange, fresh grade, at farm, organic 2023 {ES}","transportCooling":"always","visible":true},{"alias":"lemon-organic","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0.19256,"hedges":0.21902,"plotSize":0.2683},"id":"ed5c98fd-6fe5-43ca-b938-1dde919794b7","inediblePart":0.3,"landOccupation":0.306629,"name":"Citron Bio","processId":"ed602e82-ac82-5b0a-b953-3661f168f045","rawToCookedRatio":0.856,"scenario":"organic","search":"Lemon, organic 2023 {ES}| lemon production","transportCooling":"always","visible":true},{"alias":"celery-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.43039,"hedges":0.088901,"plotSize":0.13445},"id":"16efe840-56d1-4baa-9c14-7eabd1fb510f","inediblePart":0.03,"landOccupation":0.153655,"name":"Céleri branche Bio","processId":"bbcc33a9-2e2a-5088-b436-4a05add6f8cb","rawToCookedRatio":0.856,"scenario":"organic","search":"Celery, organic 2023 {GLO}| 675 production","transportCooling":"always","visible":true},{"alias":"olive-organic","categories":["vegetable_fresh","organic"],"cropGroup":"OLIVIERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":1.5995,"plotSize":3.2121},"id":"25543778-46ab-419e-a7d8-5c0cd37d8dbd","inediblePart":0.5,"landOccupation":3.67099,"name":"Olive Bio","processId":"bd0ce307-8af5-5a04-b7d5-be0ec2f6913a","rawToCookedRatio":1,"scenario":"organic","search":"Olive, organic 2023 {ES}| olive production","transportCooling":"always","visible":false},{"alias":"peanut-organic","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.7948,"plotSize":5.2348},"id":"9dec26dd-bf7c-4336-996e-3f9bd8659d05","inediblePart":0.5,"landOccupation":5.98268,"name":"Arachide avec coque Bio","processId":"048fd4c5-6b27-5701-a06c-8f4570bf6b6f","rawToCookedRatio":1,"scenario":"organic","search":"Peanut, organic 2023 {RoW}| peanut production","transportCooling":"none","visible":true},{"alias":"raspberry-organic","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":10.397,"hedges":2.1476,"plotSize":3.2479},"id":"091cda9d-3c9d-444c-ad0e-1d6f34491767","inediblePart":0.03,"landOccupation":3.71186,"name":"Framboise Bio","processId":"305b88b9-da4d-5573-a534-4f964a7e8c18","rawToCookedRatio":0.856,"scenario":"organic","search":"Raspberry, at farm, organic 2023 {RS}","transportCooling":"always","visible":true},{"alias":"lambs-lettuce-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0.24636,"hedges":0.050889,"plotSize":0.076961},"id":"a8b2bd23-e7af-4311-b163-ff3834b96f9f","inediblePart":0.4,"landOccupation":0.0879558,"name":"Mâche Bio","processId":"a5cc09cd-2ee4-523f-92c3-c24efdfc2fd6","rawToCookedRatio":0.856,"scenario":"organic","search":"Lettuce, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"endive-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0.24636,"hedges":0.050889,"plotSize":0.076961},"id":"6842d570-6b53-49f3-ba9c-984b55e40171","inediblePart":0.2,"landOccupation":0.0879558,"name":"Endive Bio","processId":"a5cc09cd-2ee4-523f-92c3-c24efdfc2fd6","rawToCookedRatio":0.856,"scenario":"organic","search":"Lettuce, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"durum-wheat-organic","categories":["grain_raw","organic"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":3.8882,"hedges":1.346,"plotSize":1.6588},"id":"590e5fc8-26fd-4cea-9737-86bc3aa6af8d","inediblePart":0,"landOccupation":2.65408,"name":"Blé dur Bio","processId":"1fa5eaea-5cad-59b4-930c-9092e2a54c56","rawToCookedRatio":2.259,"scenario":"organic","search":"Durum wheat grain, organic 2023, national average, at farm gate {FR}","transportCooling":"none","visible":false},{"alias":"onion-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0.82427,"hedges":0.17026,"plotSize":0.25749},"id":"752f4a99-f85b-4bb8-9a8b-139d1f08a4b0","inediblePart":0.1,"landOccupation":0.294277,"name":"Oignon Bio","processId":"1da54124-594f-5053-b788-4c3c99b6d1cd","rawToCookedRatio":0.856,"scenario":"organic","search":"Onion, national average, at farm, organic 2023 {FR} U","transportCooling":"none","visible":true},{"alias":"rice-basmati-organic","categories":["grain_raw","organic"],"cropGroup":"RIZ","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.2055,"plotSize":0.18928},"id":"dcdcb4d1-1793-4f1b-bd1f-7578d02e4fb1","inediblePart":0,"landOccupation":1.51421,"name":"Riz basmati Bio","processId":"cb474038-056f-5fd6-a3a2-01c8e928657c","rawToCookedRatio":2.259,"scenario":"organic","search":"Rice, non-basmati, organic 2023 {GLO}| market for rice, non-basmati","transportCooling":"none","visible":true},{"alias":"triticale-organic","categories":["grain_raw","organic"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":4.6389,"hedges":1.6059,"plotSize":1.9791},"id":"585c8bb1-1aaa-4c33-a5c1-84c886bb7ec3","inediblePart":0,"landOccupation":3.16648,"name":"Triricale Bio","processId":"72214808-e218-567f-ae89-d0cee404ab8b","rawToCookedRatio":2.259,"scenario":"organic","search":"Triticale, organic, animal feed, at farm gate {FR} U","transportCooling":"none","visible":false},{"alias":"bean-organic","categories":["grain_raw","organic"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":4.1357,"hedges":1.4317,"plotSize":1.7644},"id":"8cf0b0ce-7ae7-4123-8fee-823b4c190418","inediblePart":0,"landOccupation":2.823,"name":"Pois Bio","processId":"5de7df4a-068c-56eb-a34d-e114264aeba1","rawToCookedRatio":2.259,"scenario":"organic","search":"Pea, organic, animal feed, at farm gate {FR} U","transportCooling":"none","visible":false},{"alias":"alfalfa-organic","categories":["grain_raw","organic"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":2.2038,"hedges":0.76288,"plotSize":0.94018},"id":"fd187fa6-9cbc-4839-b13f-365c5371cee6","inediblePart":0,"landOccupation":1.50428,"name":"Luzerne Bio","processId":"909d58a0-585c-550b-95e4-2975ed6192f4","rawToCookedRatio":2.259,"scenario":"organic","search":"Alfalfa, hay, organic, animal feed, at farm gate {FR} U","transportCooling":"none","visible":false},{"alias":"radish-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0.13672,"hedges":0.02824,"plotSize":0.042709},"id":"076b3d53-fc81-454b-9c90-e19767de8b0b","inediblePart":0.1,"landOccupation":0.0488102,"name":"Radis Bio","processId":"4f982b91-4c25-5b52-b4c9-e06f0ed9fb31","rawToCookedRatio":1,"scenario":"organic","search":"Radish, organic 2023 {GLO}| radish production, in unheated greenhouse","transportCooling":"always","visible":true},{"alias":"lentils-uncooked-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":31.817,"hedges":2.6247,"plotSize":3.9941},"id":"02b2ed63-6246-446c-8cf3-224dbe698821","inediblePart":0,"landOccupation":7.9882,"name":"Lentilles Bio","processId":"08f62494-0ee6-55c9-af85-e09706e34ce1","rawToCookedRatio":2.33,"scenario":"organic","search":"Lentil, organic 2023 {RoW}","transportCooling":"none","visible":true},{"alias":"apricot-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.51789,"hedges":0.58905,"plotSize":0.72159},"id":"36158ea6-066c-4fd6-9e28-6477c7297b37","inediblePart":0.2,"landOccupation":0.824673,"name":"Abricot Bio","processId":"f8a5b889-a03e-5fed-bbbe-43d3d8ba2dc4","rawToCookedRatio":0.856,"scenario":"organic","search":"Apricot, organic 2023 {FR}| apricot production","transportCooling":"always","visible":true},{"alias":"leek-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0.41893,"hedges":0.086535,"plotSize":0.13087},"id":"66cde9d8-28e6-4855-9a3c-1b40a6f7bba8","inediblePart":0.2,"landOccupation":0.149566,"name":"Poireau Bio","processId":"ed4e8b3a-1571-57ee-b6e1-5c0dd1703ef3","rawToCookedRatio":0.856,"scenario":"organic","search":"Leek, national average, at plant, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"cherry-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":16.041,"hedges":18.245,"plotSize":22.351},"id":"b4e8febc-6588-4599-8c58-c019144597c6","inediblePart":0.2,"landOccupation":25.5436,"name":"Cerise Bio","processId":"7850ccc2-6ef8-5f58-832f-3b78368dfd97","rawToCookedRatio":0.856,"scenario":"organic","search":"Cherry, organic 2023, national average, at orchard {FR} U","transportCooling":"always","visible":true},{"alias":"plum-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":16.041,"hedges":18.245,"plotSize":22.351},"id":"10af6fa1-e374-4748-b8a8-f735d2813489","inediblePart":0.2,"landOccupation":25.5436,"name":"Prune Bio","processId":"7850ccc2-6ef8-5f58-832f-3b78368dfd97","rawToCookedRatio":0.856,"scenario":"organic","search":"Cherry, organic 2023, national average, at orchard {FR} U","transportCooling":"none","visible":true},{"alias":"shallot-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0.82427,"hedges":0.17026,"plotSize":0.25749},"id":"c224d640-c347-41c4-9754-a4cea77de16f","inediblePart":0.1,"landOccupation":0.294277,"name":"Echalote Bio","processId":"1da54124-594f-5053-b788-4c3c99b6d1cd","rawToCookedRatio":0.856,"scenario":"organic","search":"Onion, national average, at farm, organic 2023 {FR}","transportCooling":"always","visible":true},{"alias":"blueberry-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":10.684,"hedges":2.2068,"plotSize":3.3374},"id":"df1fe70a-08c0-4b8a-9f88-0caeb002d26a","inediblePart":0.03,"landOccupation":3.8142,"name":"Myrtille Bio","processId":"81afdcc9-dbcd-5547-bf95-c97c0b0ed5fe","rawToCookedRatio":0.856,"scenario":"organic","search":"Blueberry, at farm, organic 2023 {CA}","transportCooling":"always","visible":true},{"alias":"spinach-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0.13788,"hedges":0.02848,"plotSize":0.043071},"id":"49ad2a72-d196-4379-8f23-212b27d44917","inediblePart":0.03,"landOccupation":0.0492245,"name":"Epinard Bio","processId":"c9ee9f7c-c3b9-5745-a4b1-1b0300f2e27e","rawToCookedRatio":0.856,"scenario":"organic","search":"Spinach, organic 2023 {GLO}","transportCooling":"always","visible":true},{"alias":"watermelon-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":1.569,"hedges":0.32408,"plotSize":0.49013},"id":"d5aff6c8-470b-457b-bc67-294d8987ee5e","inediblePart":0.4,"landOccupation":0.560144,"name":"Pastèque Bio","processId":"637422c7-b6a1-5c16-b0eb-ae039c0386d0","rawToCookedRatio":0.856,"scenario":"organic","search":"Melon, organic 2023, national average, at farm gate {FR}","transportCooling":"always","visible":true},{"alias":"silage-maize-fr","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.43393,"plotSize":0.44669},"id":"dc872330-8d35-4b02-bf45-4481b89a093e","inediblePart":0.5,"landOccupation":0.893381,"name":"Ensilage maïs FR","processId":"834cc861-1bf6-5ac4-b947-a80851da4b57","rawToCookedRatio":2.259,"scenario":"reference","search":"Silage maize, conventional, national average, animal feed, at farm gate, production {FR} U","transportCooling":"none","visible":true},{"alias":"silage-maize-organic","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0.93269,"hedges":0.49774,"plotSize":0.44669},"id":"305cc005-eb5c-4e94-b5cf-9aa21c619577","inediblePart":0.5,"landOccupation":0.893381,"name":"Ensilage maïs Bio","processId":"834cc861-1bf6-5ac4-b947-a80851da4b57","rawToCookedRatio":2.259,"scenario":"organic","search":"Silage maize, conventional, national average, animal feed, at farm gate, production {FR} U","transportCooling":"none","visible":true},{"alias":"oilseed-feed","categories":["grain_raw"],"cropGroup":"AUTRES OLEAGINEUX","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4b3c39a6-496c-416c-a42a-8d4c2fc788da","inediblePart":0,"landOccupation":1.97529,"name":"Tourteau FR","processId":"1eec6669-df89-5638-92da-a7c2fb3b033a","rawToCookedRatio":2.33,"scenario":"import","search":"Oilseed meal mix, as feed, at regional warehouse, as DM {RER} - Adapted from WFLDB","transportCooling":"none","visible":false},{"alias":"grazed-grass-temporary","categories":[],"cropGroup":"PRAIRIES TEMPORAIRES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.2197,"plotSize":1.1234},"id":"ba97e4b9-1fac-4f92-bed1-9889e3ae631d","inediblePart":0,"landOccupation":1.49788,"name":"Herbe de prairie temporaire FR","processId":"d2d9709a-b022-5283-99ac-31d1c7ebb3f1","rawToCookedRatio":1,"scenario":"reference","search":"Grazed grass, temporary meadow, without clover, Northwestern region, on field {FR} U","transportCooling":"none","visible":false},{"alias":"grazed-grass-permanent","categories":[],"cropGroup":"PRAIRIES PERMANENTES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0365,"plotSize":0.84761},"id":"c88d387e-8435-4741-b742-0094dbdcee45","inediblePart":0,"landOccupation":1.35618,"name":"Herbe de prairie permanente FR","processId":"f1c34290-cdbe-5249-a667-dcc761059c97","rawToCookedRatio":1,"scenario":"reference","search":"Grazed grass, permanent meadow, without clover, Northwestern region, on field {FR} U","transportCooling":"none","visible":false},{"alias":"cherry-tr","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4e13ea5f-4ad1-4009-ae91-842cb18bd4dd","inediblePart":0.2,"landOccupation":1.79013,"name":"Cerise par défaut","processId":"31f47ffb-0ac9-5140-a61e-f41246644d45","rawToCookedRatio":0.856,"scenario":"import","search":"Cherry, at farm (WFLDB) TR","transportCooling":"always","visible":true},{"alias":"refined-palm-oil","categories":["nut_oilseed_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"EuropeAndMaghreb","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3612e931-f0e0-4263-a079-63650a941fbd","inediblePart":0,"landOccupation":2.13646,"name":"Huile de palme (raffinée) UE","processId":"3d90a1fd-8875-5b01-9fe2-68a1dfbdd0d0","rawToCookedRatio":1,"scenario":"import","search":"Palm oil, refined, processed in EU, at plant {RER} U","transportCooling":"none","visible":true},{"alias":"refined-linseed-oil","categories":["nut_oilseed_processed"],"cropGroup":"PLANTES A FIBRES","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":1.9969,"plotSize":0},"id":"61ede109-0eed-4aa3-93bb-aacf132b6bdd","inediblePart":0,"landOccupation":13.9781,"name":"Huile de lin (raffinée) FR","processId":"04652154-34aa-5dbd-9c01-8557f2d844f5","rawToCookedRatio":1,"scenario":"reference","search":"Linseed oil, refined, at oil mill { FR} U","transportCooling":"none","visible":true},{"alias":"refined-grapeseed-oil","categories":["nut_oilseed_processed"],"cropGroup":"VIGNES","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0.31376,"plotSize":1.0982},"id":"1e3d325d-b369-4f03-b3a3-f4261924fca4","inediblePart":0,"landOccupation":1.25506,"name":"Huile de pépin de raisin (raffinée) FR","processId":"d42c72e6-6043-521b-be15-d10efb920e7a","rawToCookedRatio":1,"scenario":"reference","search":"Grapeseed oil, refined at plant {FR} U","transportCooling":"none","visible":true},{"alias":"refined-soybean-oil","categories":["nut_oilseed_processed"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"188a3d66-f214-4821-9bac-7e8fdc715721","inediblePart":0,"landOccupation":7.45682,"name":"Huile de soja (raffinée) FR","processId":"3d2e9c5d-6088-5df4-8e6d-620655d82347","rawToCookedRatio":1,"scenario":"import","search":"Soybean oil, refined, at plant  {FR} U","transportCooling":"none","visible":true},{"alias":"virgin-hazelnut-oil","categories":["nut_oilseed_processed"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"00603559-120a-4aa4-b12b-2eda1705e064","inediblePart":0,"landOccupation":28.723,"name":"Huile de noisette (vierge) FR","processId":"17bc5b5f-b1fe-5877-9a4d-3512b6aa50e7","rawToCookedRatio":1,"scenario":"import","search":"Hazelnut oil, crude, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"refined-peanut-oil","categories":["nut_oilseed_processed"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c704400c-9108-49a8-a79a-b830eccb6b5e","inediblePart":0,"landOccupation":15.047,"name":"Huile d\'arachide (raffinée) par défaut","processId":"c66c23ee-1aaf-59cc-b32b-7f05ab81fdf1","rawToCookedRatio":1,"scenario":"import","search":"Peanut oil, at oil mill {SN} U","transportCooling":"none","visible":true},{"alias":"refined-sunflower-oil","categories":["nut_oilseed_processed"],"cropGroup":"TOURNESOL","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"583d00ab-0340-444b-9581-71175f0a937b","inediblePart":0,"landOccupation":10.4138,"name":"Huile de tournesol (raffinée) FR","processId":"41e46719-7326-5dbd-a494-142e83e497d7","rawToCookedRatio":1,"scenario":"import","search":"Sunflower oil, refined, low dehulling at plant {FR} U","transportCooling":"none","visible":true},{"alias":"refined-rapeseed-oil","categories":["nut_oilseed_processed"],"cropGroup":"COLZA","defaultOrigin":"France","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0755,"plotSize":1.1763},"id":"c3697176-e682-43c3-b16a-3992ff8f1404","inediblePart":0,"landOccupation":4.70538,"name":"Huile de colza (raffinée) FR","processId":"beddeba8-490f-5019-ac1e-a8d3bf1f062a","rawToCookedRatio":1,"scenario":"reference","search":"Rapeseed oil, refined, at oil mill {FR} U","transportCooling":"none","visible":true},{"alias":"extra-virgin-olive-oil","categories":["nut_oilseed_processed"],"cropGroup":"OLIVIERS","defaultOrigin":"EuropeAndMaghreb","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"fbe48b5b-62f2-4ccb-8aa6-66d08a4c7fac","inediblePart":0,"landOccupation":11.5482,"name":"Huile d\'olive (extra vierge) UE","processId":"7a903fb2-264d-5c54-8269-c5d13d95f4ac","rawToCookedRatio":1,"scenario":"import","search":"Extra Virgin Olive Oil, at plant {ES} U","transportCooling":"none","visible":true},{"alias":"fresh-cream-cheese","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"2cced940-3abf-439d-b2f1-e6241ffb31fd","inediblePart":0,"landOccupation":2.09033,"name":"Crème fraiche FR","processId":"3a74e4f9-7a51-59a1-a393-2889537c9901","rawToCookedRatio":1,"scenario":"reference","search":"fresh cream 8% at plant","transportCooling":"always","visible":true},{"alias":"egg-without-shell-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"8b6fda86-052a-49eb-90fb-53e307544150","inediblePart":0,"landOccupation":3.69808,"name":"Oeuf cru décoquillé FR","processId":"f9af949f-58ec-5608-abaf-772d7e190f38","rawToCookedRatio":0.974,"scenario":"reference","search":"egg without shell","transportCooling":"once_transformed","visible":true},{"alias":"egg-yolk-powder-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"f6e84334-a8bb-4f07-915d-ef51e8dcf800","inediblePart":0,"landOccupation":3.70517,"name":"poudre de jaune d\'oeuf FR","processId":"a34007f4-d4a4-562c-84a9-68360af1026a","rawToCookedRatio":1,"scenario":"reference","search":"yolk powder at plant","transportCooling":"once_transformed","visible":true},{"alias":"egg-white-powder-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"7fe451fd-77c8-46f3-b7ae-c050a08b7be8","inediblePart":0,"landOccupation":3.70572,"name":"poudre de blanc d\'oeuf FR","processId":"71637452-abfa-574b-a06e-0dd6f064246d","rawToCookedRatio":1,"scenario":"reference","search":"egg white powder at plant","transportCooling":"once_transformed","visible":true},{"alias":"emmental-grated-fr","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"bd6e16d9-588d-48df-9eab-e0c4c64f5c53","inediblePart":0,"landOccupation":6.68229,"name":"Emmental rapé FR","processId":"13a81bef-4db1-58d6-970b-f632566e504a","rawToCookedRatio":1,"scenario":"reference","search":"Emmental cheese, grated, cheese production, from cow\'s milk, hard cheese, French production mix, at plant, 1 kg of Emmental, grated cheese (PGi) {FR} U","transportCooling":"always","visible":true},{"alias":"cocoa-powder-non-ue","categories":["vegetable_processed"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghrebByPlane","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3d7f808b-77c5-4207-968d-feea6dfd9496","inediblePart":0,"landOccupation":11.9296,"name":"Poudre de cacao par défaut","processId":"04e64cd5-d278-50eb-9085-a80d4db90920","rawToCookedRatio":1,"scenario":"import","search":"cocoa powder at plant FR","transportCooling":"none","visible":true},{"alias":"salt","categories":["spice_condiment_additive"],"cropGroup":"DIVERS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0010857,"plotSize":0.0114},"id":"77defb24-cec3-4de9-8388-63229d1052fb","inediblePart":0,"landOccupation":0.0304003,"name":"Sel","processId":"aaa4632f-5b25-57dc-b431-8f4f63aee805","rawToCookedRatio":1,"scenario":"reference","search":"Salt {FR} U","transportCooling":"none","visible":true},{"alias":"bacon-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.63338,"livestockDensity":-0.027132,"permanentPasture":0,"plotSize":2.10883},"id":"f3537dee-a80a-4b6f-9942-16b3f9e21101","inediblePart":0,"landOccupation":7.00383,"name":"Poitrine de porc FR","processId":"17225d3f-0489-54f4-9c06-c8c515ca9f16","rawToCookedRatio":1,"scenario":"reference","search":"bacon at plant","transportCooling":"always","visible":true},{"alias":"bacon-default","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"livestockDensity":-0.0357,"permanentPasture":0,"plotSize":0},"id":"f615a946-e091-475a-8601-5a0758a4eb65","inediblePart":0,"landOccupation":6.09964,"name":"Poitrine de porc par défaut","processId":"a5c1eb34-5613-5b49-b46a-43b1d1191314","rawToCookedRatio":1,"scenario":"import","search":"Bacon, back, at plant {{bacon-default}}","transportCooling":"always","visible":true},{"alias":"bacon-fr-bbc","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.5789,"livestockDensity":-0.027132,"permanentPasture":0,"plotSize":2.02945},"id":"6fb662dc-583f-47d5-814f-2cc6a8c1f3b9","inediblePart":0,"landOccupation":7.94777,"name":"Poitrine de porc (alim. ani. 100% FR)","processId":"79dc0633-2115-513c-a011-98982292e461","rawToCookedRatio":1,"scenario":"reference","search":"Bacon, back, at plant {{bacon-fr-bbc}}","transportCooling":"always","visible":true},{"alias":"bacon-organic","categories":["animal_product"],"defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":26.2971,"hedges":6.91433,"livestockDensity":-0.007803,"permanentPasture":0,"plotSize":9.13176},"id":"b78a8267-2304-44a1-be1b-f3a4432bfdf7","inediblePart":0,"landOccupation":25.7743,"name":"Poitrine de porc Bio","processId":"e97292b7-c692-5554-b607-9cc369774ff1","rawToCookedRatio":1,"scenario":"organic","search":"Bacon, back, at plant {{bacon-fr-organic}}","transportCooling":"always","visible":true},{"alias":"glucose-syrup","categories":["spice_condiment_additive"],"cropGroup":"DIVERS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"06dffb5c-07ad-48de-9630-632f4c84e02d","inediblePart":0,"landOccupation":1.26873,"name":"Sirop de glucose FR ou UE ou par défaut","processId":"3d653688-83e2-56ce-8419-005564784e3e","rawToCookedRatio":1,"scenario":"import","search":"glucose syrup","transportCooling":"none","visible":true},{"alias":"apple-compote-fr","categories":["vegetable_processed"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.35875,"hedges":0.16917,"plotSize":0.33973},"id":"f51ef7f1-9d4c-4c4a-a4a6-c011c520f419","inediblePart":0,"landOccupation":0.38826,"name":"Compote de pomme FR","processId":"63ac7fd9-6bf5-5cd2-ad90-2286b0916e8e","rawToCookedRatio":0.856,"scenario":"reference","search":"compote apple at plant","transportCooling":"none","visible":true},{"alias":"goat-milk","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"a9eed813-3242-4701-8d76-f4fb2f222121","inediblePart":0,"landOccupation":1.9331,"name":"Lait de chèvre FR","processId":"41428d85-058c-588c-8eb0-b12f2f922fb0","rawToCookedRatio":1,"scenario":"reference","search":"Goat milk, consumption mix {FR} U","transportCooling":"once_transformed","visible":false},{"alias":"breakfast-cereals","categories":["grain_processed"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.4753,"plotSize":2.082},"id":"1508af02-c164-4189-9fac-0057566e0950","inediblePart":0,"landOccupation":3.33127,"name":"Mélange de céréales FR","processId":"c2a948c2-dfdd-582f-88a3-f2217e8377fd","rawToCookedRatio":2.259,"scenario":"reference","search":"cereals rich at plant","transportCooling":"none","visible":true},{"alias":"pasta","categories":["grain_processed"],"cropGroup":"DIVERS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.13748,"plotSize":1.4435},"id":"06e7ba46-85ba-4475-82d2-a59f847e801d","inediblePart":0.2,"landOccupation":3.8494,"name":"Pâtes FR","processId":"0da8ba31-b350-5aa0-a1cb-77a2d1695f30","rawToCookedRatio":2.259,"scenario":"reference","search":"pasta dried plant wheat FR","transportCooling":"none","visible":false},{"alias":"garlic","categories":["vegetable_fresh"],"cropGroup":"DIVERS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0095327,"plotSize":0.10009},"id":"06f219a1-ffb3-44ae-ba23-6f9ad7baff39","inediblePart":0.1,"landOccupation":0.266916,"name":"Ail FR","processId":"f3b9be39-06cd-5886-a7da-57aaeb45a013","rawToCookedRatio":1,"scenario":"reference","search":"garlic consumption mix","transportCooling":"none","visible":false},{"alias":"vegetable-mix","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.086615,"plotSize":0.21654},"id":"5ecb6c61-0a0f-4c00-a8e0-713c97929c7c","inediblePart":0,"landOccupation":0.34646,"name":"Mélange de légumes","processId":"8927c220-d637-5d12-b0f9-5954d61e2923","rawToCookedRatio":0.856,"scenario":"reference","search":"Diced mixed vegetables canned at plant","transportCooling":"always","visible":true},{"alias":"bolognese","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"ad4e4cff-9333-4f5a-bfc5-028cfe888072","inediblePart":0,"landOccupation":17.583,"name":"Sauce tomate à la viande FR","processId":"4dc36e0c-321b-5b21-8509-42fee9fdcdb3","rawToCookedRatio":0.856,"scenario":"reference","search":"tomato sauce bolognese at plant","transportCooling":"none","visible":true},{"alias":"honey","categories":["misc"],"cropGroup":"DIVERS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.035163,"plotSize":0.36921},"id":"87accb8f-37c1-4364-873a-5e8e67fd5811","inediblePart":0,"landOccupation":0.98457,"name":"Miel FR","processId":"7fd3aa2c-0c10-5165-b3ee-d3873e16dd41","rawToCookedRatio":1,"scenario":"reference","search":"honey at plant","transportCooling":"none","visible":true},{"alias":"turkey","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"b5395f5f-e011-4c65-9a6c-85dd77d10d2c","inediblePart":0,"landOccupation":4.8421,"name":"Viande de dinde FR","processId":"ab40129d-3ebc-528c-a17b-c03a015d5c28","rawToCookedRatio":0.755,"scenario":"reference","search":"turkey conventional at farm gate","transportCooling":"always","visible":true},{"alias":"pork-liver","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"dc2e130a-06c1-4859-a9ca-17456de99812","inediblePart":0,"landOccupation":1.65063,"name":"Foie de porc cru FR","processId":"56232d55-7a3f-507a-adb0-b7833b924820","rawToCookedRatio":0.73,"scenario":"reference","search":"liver pork raw at distribution","transportCooling":"always","visible":true},{"alias":"whey","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"33d2f3c2-ffa2-4b96-811e-50c1c8670e26","inediblePart":0,"landOccupation":0.0558178,"name":"Poudre de lactosérum FR","processId":"e8590810-7dc7-57d9-8a06-25e5d358bf89","rawToCookedRatio":1,"scenario":"reference","search":"Whey, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"strawberry-coulis","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.5975,"plotSize":1.4938},"id":"dd6ebd55-dc52-4e9e-ac79-aa3ed4b3295d","inediblePart":0.03,"landOccupation":2.39,"name":"Purée de fraise FR","processId":"538bfa96-6e80-585e-bd5e-8b73c7aeb771","rawToCookedRatio":0.856,"scenario":"reference","search":"strawberry coulis at plant","transportCooling":"none","visible":true},{"alias":"yogurt","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"0e77146c-be67-4f16-b072-f4fdb43b4acf","inediblePart":0.2,"landOccupation":12.1959,"name":"Fromage blanc FR","processId":"aba46855-60c8-5dda-8689-db3726341d77","rawToCookedRatio":1,"scenario":"reference","search":"yogurt milk cow at plant","transportCooling":"always","visible":true},{"alias":"goat-cheese","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"d93c2c58-8073-47ef-99da-999ad7cba846","inediblePart":0,"landOccupation":9.28115,"name":"Fromage de chèvre FR","processId":"38a4132b-9bae-58be-a943-d9b647ccc0ff","rawToCookedRatio":1,"scenario":"reference","search":"Cheese, from goat\'s milk, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"cocoa-butter","categories":["nut_oilseed_processed"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0ea5f5a0-51d9-41da-9ac4-cb60f3ddb86c","inediblePart":0,"landOccupation":11.9276,"name":"Beurre de cacao par défaut","processId":"db3318dc-c27c-5fb4-aa8a-8264e7d48017","rawToCookedRatio":1,"scenario":"import","search":"cocoa butter at plant FR","transportCooling":"once_transformed","visible":true},{"alias":"soy-protein","categories":["grain_processed"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"f8fb04c1-c207-4a3c-993f-e5a1b0204dfa","inediblePart":0,"landOccupation":2.65455,"name":"Protéines de soja par défaut","processId":"2eb6a813-318a-54d1-a3ea-920fe5ae83e1","rawToCookedRatio":1,"scenario":"import","search":"soy protein dehydrated at plant","transportCooling":"none","visible":true},{"alias":"vinegar-alcohol","categories":["misc"],"cropGroup":"DIVERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0032011,"plotSize":0.033612},"id":"24222e45-52dc-4c18-ab9f-0ee39d8a46b4","inediblePart":0,"landOccupation":0.0896314,"name":"Vinaigre d\'alcool FR","processId":"a630707c-c3de-50dd-ae99-9b92d930ba09","rawToCookedRatio":1,"scenario":"reference","search":"vinegar alcohol","transportCooling":"none","visible":true},{"alias":"veal-meat","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"221cd239-f1ae-4a2f-9fdc-dc73df5f95ab","inediblePart":0,"landOccupation":21.4533,"name":"Viande de veau FR","processId":"24de0bc6-1df2-5c84-bfef-d03b4f5192c7","rawToCookedRatio":0.792,"scenario":"reference","search":"veal without bone","transportCooling":"always","visible":true},{"alias":"french-fries","categories":["vegetable_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.028065,"plotSize":0.075559},"id":"7c742241-9678-4a46-972b-8be1baf7f5a7","inediblePart":0.1,"landOccupation":0.302236,"name":"Frites de pomme de terre congelées FR","processId":"d5f80a46-55a5-56f8-b999-762d1ad0d208","rawToCookedRatio":0.856,"scenario":"reference","search":"french fries frozen at processing","transportCooling":"none","visible":true},{"alias":"tomato-sauce","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.45185,"plotSize":1.1296},"id":"bdae67c5-ac20-417b-9094-8755ae1ab42b","inediblePart":0,"landOccupation":1.8074,"name":"Sauce tomate FR","processId":"b4216a81-55d0-5372-a6fd-530234e1045b","rawToCookedRatio":0.856,"scenario":"reference","search":"tomato sauce vegetables prepacked at plant","transportCooling":"none","visible":true},{"alias":"mustard","categories":["spice_condiment_additive"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0.90346,"plotSize":2.1808},"id":"d87bdd32-d698-4044-ae20-15b96c65f680","inediblePart":0.1,"landOccupation":4.36151,"name":"Moutarde FR","processId":"6c4df747-e40f-5d39-8dbc-05806830275b","rawToCookedRatio":0.856,"scenario":"reference","search":"Mustard, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"rice-flour","categories":["grain_processed"],"cropGroup":"RIZ","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"02878fcc-4c20-4d31-874d-169535443c6a","inediblePart":0,"landOccupation":1.41808,"name":"Farine de riz par défaut","processId":"4670d310-7d47-524c-a7ac-94d10eca063f","rawToCookedRatio":1,"scenario":"import","search":"rice flour FR at mill","transportCooling":"none","visible":true},{"alias":"brie-cheese","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"d56d21c0-0705-45e3-830d-504d63d581e0","inediblePart":0,"landOccupation":5.58127,"name":"Brie FR","processId":"83998504-7455-5a9c-bc26-8dbe8f1ae5f4","rawToCookedRatio":1,"scenario":"reference","search":"Brie cheese, from cow\'s milk, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"turmeric","categories":["spice_condiment_additive"],"cropGroup":"DIVERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"cfdb11f0-9ae1-47ab-a26c-20ff8444b862","inediblePart":0,"landOccupation":16.0844,"name":"Curcuma par défaut","processId":"ed399ef5-2ccd-51c3-b027-acd9a96472b2","rawToCookedRatio":1,"scenario":"import","search":"turmeric consumption mix","transportCooling":"none","visible":true},{"alias":"candied-fruits","categories":["vegetable_processed"],"cropGroup":"DIVERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.01701,"plotSize":0.1786},"id":"b1350dc9-f4da-4827-b984-f36b6f192c5a","inediblePart":0,"landOccupation":0.476277,"name":"Fruits confits FR","processId":"40f68072-cb26-5034-b182-2dec509d01ef","rawToCookedRatio":1,"scenario":"reference","search":"candied fruits at plant","transportCooling":"none","visible":true},{"alias":"reblochon","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"d85576e1-ba3a-4ec7-80d5-c106f780498a","inediblePart":0,"landOccupation":5.69799,"name":"Reblochon FR","processId":"56d8db15-7d3b-545a-b105-1d9d3267e077","rawToCookedRatio":1,"scenario":"reference","search":"Reblochon cheese, from cow\'s milk, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"fruit-puree","categories":["vegetable_processed"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.35346,"hedges":0.16668,"plotSize":0.33472},"id":"57490ff0-61a0-44cd-bd4f-3a3be7af25f2","inediblePart":0.1,"landOccupation":0.382537,"name":"Purée de fruits FR","processId":"f72c93ac-8da3-5140-96bb-7b47e6c3ffee","rawToCookedRatio":0.856,"scenario":"reference","search":"fruits puree at plant","transportCooling":"none","visible":true},{"alias":"apple-juice","categories":["vegetable_processed"],"cropGroup":"VERGERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0.51595,"hedges":0.2433,"plotSize":0.48859},"id":"40a4432b-2b12-45f3-aed2-a8c4e165e15f","inediblePart":0.1,"landOccupation":0.558389,"name":"Jus de pomme FR","processId":"45b2eab5-633d-5eb8-8e58-0563ce7c837f","rawToCookedRatio":1,"scenario":"reference","search":"apple juice concentrate","transportCooling":"none","visible":true},{"alias":"orange-juice","categories":["vegetable_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4649b3db-d927-4ea5-baa0-d74fa3c768d2","inediblePart":0.2,"landOccupation":0.319645,"name":"Jus d\'orange par défaut","processId":"04f3b844-fc0a-58e3-ae61-1a32cebc3e5d","rawToCookedRatio":1,"scenario":"import","search":"orange nectar at plant","transportCooling":"always","visible":true},{"alias":"soy-milk","categories":["vegetable_processed"],"cropGroup":"PROTEAGINEUX","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"afdc7ea9-6da0-4bab-9821-81acc46e23af","inediblePart":0,"landOccupation":0.422113,"name":"Lait de soja par défaut","processId":"5ecdc7a6-67ef-5b65-8cba-282fb1ba2554","rawToCookedRatio":1,"scenario":"import","search":"Soy drink, plain, at plant {FR} U","transportCooling":"always","visible":true},{"alias":"lemon-juice","categories":["vegetable_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"fd79d142-7e34-45a4-a0d1-59922b4c8d09","inediblePart":0,"landOccupation":1.38,"name":"Jus de citron UE","processId":"c2fb3abb-266e-5ab0-b393-89a96c0a743a","rawToCookedRatio":1,"scenario":"import","search":"lemon juice pure plant","transportCooling":"always","visible":true},{"alias":"tomato-juice","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"65e6f518-e5fc-4fda-9af9-287d26e2bbe1","inediblePart":0,"landOccupation":0.217565,"name":"Jus de tomate UE","processId":"257e163d-a091-591c-a957-777baa96f57f","rawToCookedRatio":1,"scenario":"import","search":"tomato juice plant","transportCooling":"always","visible":true},{"alias":"balsamic-vinegar","categories":["vegetable_processed"],"cropGroup":"DIVERS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0.072237,"plotSize":0.75849},"id":"c2e4259b-962f-49ea-b7f1-606f81b59207","inediblePart":0,"landOccupation":2.02264,"name":"Vinaigre balsamique FR","processId":"6fc98a5b-4193-5883-9d81-5979c73d7b5a","rawToCookedRatio":1,"scenario":"reference","search":"balsamic packaging","transportCooling":"always","visible":true},{"alias":"apricot-non-eu","categories":["vegetable_fresh"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c455b3b8-406b-407a-a525-b2c832522e49","inediblePart":0.2,"landOccupation":0.567091,"name":"Abricot par défaut","processId":"035fb863-c652-5caa-acc7-dcf993929b11","rawToCookedRatio":0.856,"scenario":"import","search":"apricot glo","transportCooling":"none","visible":true},{"alias":"lamb-meat-without-bone-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"d48015d2-a512-4bac-ba93-82a7ae001b81","inediblePart":0,"landOccupation":10.6433,"name":"Viande d\'agneau (désossée) UE","processId":"05b3b3c3-e0c0-5df5-9b95-eb67e0625cba","rawToCookedRatio":0.792,"scenario":"import","search":"lamb meat slaughterhouse IE","transportCooling":"always","visible":false},{"alias":"lamb-meat-without-bone-non-eu","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"45e3cd64-1647-4841-bacb-795e2aae4f02","inediblePart":0,"landOccupation":7.40711,"name":"Viande d\'agneau (désossée) par défaut","processId":"05b3b3c3-e0c0-5df5-9b95-eb67e0625cba","rawToCookedRatio":0.792,"scenario":"import","search":"lamb meat slaughterhouse NZ","transportCooling":"always","visible":false},{"alias":"almond-inshell-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0598,"plotSize":3.091},"id":"3a0c058b-70db-4fce-9984-e68e2f5a4760","inediblePart":0.5,"landOccupation":3.53262,"name":"Amandes en coque FR","processId":"6f2603f2-0d75-5b48-a393-9a401484ba0d","rawToCookedRatio":1,"scenario":"reference","search":"Almond mix","transportCooling":"none","visible":false},{"alias":"almond-inshell-ue","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0da203dd-5ce5-42cc-be90-95cc4c49b2ac","inediblePart":0.5,"landOccupation":3.53262,"name":"Amandes en coque UE","processId":"6f2603f2-0d75-5b48-a393-9a401484ba0d","rawToCookedRatio":1,"scenario":"import","search":"Almond mix","transportCooling":"none","visible":true},{"alias":"almond-inshell-non-ue","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"99dcb716-b0ab-4ca5-b88a-4de43dbfb1af","inediblePart":0.5,"landOccupation":3.53262,"name":"Amandes en coque par défaut","processId":"6f2603f2-0d75-5b48-a393-9a401484ba0d","rawToCookedRatio":1,"scenario":"import","search":"Almond mix","transportCooling":"none","visible":true},{"alias":"artichoke-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"dd7fe1c9-9d56-4790-b735-3de608a20849","inediblePart":0.6,"landOccupation":0.445095,"name":"Artichaut UE","processId":"66065729-d03d-5b6e-9886-61de459fa512","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"artichoke-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"92200507-627e-4ae5-a5f8-cf62ef619b02","inediblePart":0.6,"landOccupation":0.445095,"name":"Artichaut par défaut","processId":"66065729-d03d-5b6e-9886-61de459fa512","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, conventional, national average, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"avocado-organic","categories":["vegetable_fresh","organic"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0.64205,"hedges":0.73027,"plotSize":0.89458},"id":"d54c7a38-2577-4e8f-93c6-8f39b81226b5","inediblePart":0.3,"landOccupation":1.02238,"name":"Avocat Bio","processId":"a0e97484-0d2a-5c8c-896b-5074bc4900c4","rawToCookedRatio":0.856,"scenario":"organic","search":"Avocado, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"avocado-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"fa8cce35-0e6b-4a2f-bdc1-80c05e497616","inediblePart":0.3,"landOccupation":1.01943,"name":"Avocat UE","processId":"bd459132-6ab3-5f48-88e5-f99c5cb893e0","rawToCookedRatio":0.856,"scenario":"import","search":"Avocado {GLO}| production","transportCooling":"always","visible":true},{"alias":"oats-ue","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"6c3815da-dec2-4cf2-9be6-9d99b4e9948d","inediblePart":0,"landOccupation":1.76034,"name":"Avoine UE","processId":"e1c15b25-68bd-5019-a24f-977dcdd42c37","rawToCookedRatio":2.259,"scenario":"import","search":"Oats, at farm {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":false},{"alias":"chard-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0.13788,"hedges":0.02848,"plotSize":0.043071},"id":"7f26836d-f0ea-4c54-830f-d93f3e08863a","inediblePart":0.4,"landOccupation":0.0492245,"name":"Blette Bio","processId":"c9ee9f7c-c3b9-5745-a4b1-1b0300f2e27e","rawToCookedRatio":0.856,"scenario":"organic","search":"Spinach, organic 2023 {GLO}","transportCooling":"always","visible":true},{"alias":"swiss-chard-non-eu","categories":["vegetable_fresh"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"4974a272-0080-4a52-a46e-ae222dcf8dff","inediblePart":0.03,"landOccupation":0.0462044,"name":"Blette par défaut","processId":"f4f0f1ad-fb1e-5a77-b7c7-295bab0aa450","rawToCookedRatio":0.856,"scenario":"import","search":"Spinach GLO production","transportCooling":"always","visible":true},{"alias":"broccoli-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.2355,"ecosystemicServices":{"cropDiversity":0.611,"hedges":0.12621,"plotSize":0.19087},"id":"d1155206-18fc-41f1-8509-2f52e7614f2d","inediblePart":0.2,"landOccupation":0.218137,"name":"Brocoli Bio","processId":"b8759ae4-a8e5-579d-896f-9b79195d021c","rawToCookedRatio":0.856,"scenario":"organic","search":"Broccoli, consumption mix, organic 2023 {FR} U","transportCooling":"always","visible":false},{"alias":"broccoli-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.2355,"ecosystemicServices":{"cropDiversity":0,"hedges":0.029724,"plotSize":0.07431},"id":"5461f2bc-7010-41ee-ab90-35312769a49f","inediblePart":0.2,"landOccupation":0.118895,"name":"Brocoli FR","processId":"602def70-c594-5e44-928e-6144ce21ba85","rawToCookedRatio":0.856,"scenario":"reference","search":"Broccoli, consumption mix {FR} U","transportCooling":"always","visible":false},{"alias":"broccoli-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.2355,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"51882472-92d6-4512-aecf-f852f286d5b5","inediblePart":0.2,"landOccupation":0.117091,"name":"Brocoli par défaut","processId":"541345f4-30e5-5055-bc4f-c2be8ef2fb94","rawToCookedRatio":0.856,"scenario":"import","search":"Broccoli {GLO}| production","transportCooling":"always","visible":true},{"alias":"celery-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"2b2b9e3a-9414-4fbc-8584-8e4bdf5d6a93","inediblePart":0.03,"landOccupation":0.13833,"name":"Céleri branche par défaut","processId":"d20ecc68-b2f7-536b-9225-a8c8ff470c51","rawToCookedRatio":0.856,"scenario":"import","search":"Celery {GLO}| 675 production","transportCooling":"always","visible":true},{"alias":"cherry-ue","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ea6cc96f-ae22-4f14-ace9-a6a463fd360b","inediblePart":0.2,"landOccupation":1.56147,"name":"Cerise UE","processId":"31f47ffb-0ac9-5140-a61e-f41246644d45","rawToCookedRatio":0.856,"scenario":"import","search":"Cherry, at farm (WFLDB) glo","transportCooling":"always","visible":true},{"alias":"mushroom-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0.12864,"plotSize":0.3216},"id":"d330d763-6baa-442f-b479-55425b1fa54f","inediblePart":0.1,"landOccupation":0.514552,"name":"Champignon frais FR","processId":"973dcd67-31ce-5a1c-8db6-152cbc241232","rawToCookedRatio":0.856,"scenario":"reference","search":"Agaricus bisporus mushroom, fresh, at plant {NL} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"walnut-inshell-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":3.3328,"plotSize":9.7206},"id":"e3a3bd70-1c8e-4b8b-b22f-b1f9958574c8","inediblePart":0.5,"landOccupation":11.1093,"name":"Noix avec coque Bio","processId":"9a793483-7dce-5c7a-9e5e-e23ccdadf577","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried inshell, organic 2023, national average, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"white-cabbage-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"9f17139e-92b9-4bd4-9ba6-07da78f052ff","inediblePart":0.2,"landOccupation":0.103602,"name":"Chou blanc UE","processId":"5cfe004a-f9af-564a-8d8e-ab6b0d1666d9","rawToCookedRatio":0.856,"scenario":"import","search":"Cabbage white {RoW}| cabbage white production","transportCooling":"always","visible":true},{"alias":"white-cabbage-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0.0259,"plotSize":0.064751},"id":"7c78115b-3268-4b78-add5-98b0f85bfc34","inediblePart":0.2,"landOccupation":0.103602,"name":"Chou blanc FR","processId":"5cfe004a-f9af-564a-8d8e-ab6b0d1666d9","rawToCookedRatio":0.856,"scenario":"reference","search":"Cabbage white {RoW}| cabbage white production","transportCooling":"always","visible":true},{"alias":"white-cabbage-organic","categories":["vegetable_fresh","organic"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.362,"ecosystemicServices":{"cropDiversity":0.38712,"hedges":0.079962,"plotSize":0.12093},"id":"2e0fe760-f9a2-4f11-b7d9-b516735644de","inediblePart":0.2,"landOccupation":0.138206,"name":"Chou blanc Bio","processId":"361fd476-ed79-5f3e-9d65-f2fa1aa9a413","rawToCookedRatio":0.856,"scenario":"organic","search":"Cabbage white, organic 2023 {RoW}| cabbage white production | Cut-off, U","transportCooling":"always","visible":true},{"alias":"chinese-cabbage-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ebb1d5ac-83e9-4295-9067-01e4bc5e43d1","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou chinois UE","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"chinese-cabbage-non-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3e3f8e66-57c3-43f8-b86c-54fb42af7f45","inediblePart":0.2,"landOccupation":0.461912,"name":"Chou chinois par défaut","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"brussels-sprout-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0896a0d5-b6ae-4b48-9e61-7c7ee42447ec","inediblePart":0.1,"landOccupation":0.461912,"name":"Chou de Bruxelles UE","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"brussels-sprout-non-ue","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.362,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"f2ca7ffb-f4b2-478f-8008-41956b2aefa2","inediblePart":0.1,"landOccupation":0.461912,"name":"Chou de Bruxelles par défaut","processId":"85933c39-cf0c-5c05-8427-e725ea99276d","rawToCookedRatio":0.856,"scenario":"import","search":"Cauliflower, winter, conventional, at farm gate {FR} U","transportCooling":"always","visible":true},{"alias":"refined-palm-oil-non-ue","categories":["nut_oilseed_processed"],"cropGroup":"AUTRES CULTURES INDUSTRIELLES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"45658c32-66d9-4305-a34b-21d6a4cef89c","inediblePart":0,"landOccupation":2.15717,"name":"Huile de palme (raffinée) par défaut","processId":"73e684d5-a4c2-5009-8c7e-0dd2e27eed82","rawToCookedRatio":1,"scenario":"import","search":"Palm oil, refined, consumption mix {FR} U","transportCooling":"none","visible":true},{"alias":"sunflower-oil-eu","categories":["nut_oilseed_processed"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ea419fa9-d69f-4735-8fe8-fab427ce5185","inediblePart":0,"landOccupation":5.12758,"name":"Huile de tournesol UE","processId":"f6c444b5-2a8f-5a67-8848-9f04dd523408","rawToCookedRatio":1,"scenario":"import","search":"Sunflower oil, at plant {IT} U","transportCooling":"once_transformed","visible":true},{"alias":"milk-eu","categories":["dairy_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"dbba1f04-b86c-42aa-96f9-93cfcdf4a141","inediblePart":0,"landOccupation":0.538673,"name":"Lait UE","processId":"b7386800-8318-56d3-8f1b-1f802f304a8c","rawToCookedRatio":1,"scenario":"import","search":"Raw cow milk archetype, feed mix IT-154, at farm (WFLDB)","transportCooling":"always","visible":true},{"alias":"milk-non-eu","categories":["dairy_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"17cb3a3e-04e0-4550-bd9b-91a28d8bcec0","inediblePart":0,"landOccupation":1.87209,"name":"Lait par défaut","processId":"8843449c-6d97-5ef4-b172-132dd1263b37","rawToCookedRatio":1,"scenario":"import","search":"Cow milk {CA-QC}| milk production, from cow | Cut-off, U - Copied from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"lentils-uncooked-eu","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"d0cd6516-40b9-40ce-b632-63c3a0ed14c1","inediblePart":0,"landOccupation":5.98476,"name":"Lentilles UE","processId":"e45f6ccb-035e-569c-80c5-f8a26993c5b3","rawToCookedRatio":2.33,"scenario":"import","search":"Lentils, dry, at farm (WFLDB)","transportCooling":"none","visible":true},{"alias":"lentils-uncooked-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c06e8471-88c9-490c-99fc-eb85b4e9e300","inediblePart":0,"landOccupation":5.98476,"name":"Lentilles par défaut","processId":"e45f6ccb-035e-569c-80c5-f8a26993c5b3","rawToCookedRatio":2.33,"scenario":"import","search":"Lentils, dry, at farm (WFLDB)","transportCooling":"none","visible":true},{"alias":"lambs-lettuce-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.118,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c916d6db-03d1-48fb-9f81-71beffa94faf","inediblePart":0.4,"landOccupation":0.0918483,"name":"Mâche par défaut","processId":"600ef965-3241-5f80-a283-9ba1a5a6cc41","rawToCookedRatio":0.856,"scenario":"import","search":"Iceberg lettuce {GLO}| production","transportCooling":"always","visible":false},{"alias":"sweet-corn-eu","categories":["grain_raw"],"cropGroup":"MAIS GRAIN ET ENSILAGE","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"20c97ec2-4950-4cb6-ac9d-a3a97b63c4ea","inediblePart":0.5,"landOccupation":0.237371,"name":"Maïs doux UE","processId":"bb5f2ee6-2b42-5422-b5e6-23f3c3075cee","rawToCookedRatio":2.259,"scenario":"import","search":"Sweet corn GLO","transportCooling":"none","visible":true},{"alias":"unknown-cereals-and-grain-products","categories":["nut_oilseed_raw"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"c723eb89-a64f-405d-bb6b-6dced54c46ba","inediblePart":0.5,"landOccupation":2.12399,"name":"Autres céréales et produits céréaliers (non encore répertoriés)","processId":"6d737375-f7f8-5d68-aed5-df00b19e90f7","rawToCookedRatio":1,"scenario":"import","search":"Sunflower, at farm {HU}","transportCooling":"none","visible":true},{"alias":"unknown-dairy-product","categories":["dairy_product"],"defaultOrigin":"France","density":1,"id":"f30016f7-2e54-45ee-96e8-cd0140872ce6","inediblePart":0,"landOccupation":9.17058,"name":"Autres produits laitiers (non encore répertoriés)","processId":"7e0e3538-e229-556b-b5ce-b69cfa9e1880","rawToCookedRatio":1,"search":"Butter, 82% fat, unsalted, at dairy {FR} U","transportCooling":"always","visible":true},{"alias":"unknown-fruit-vegetable","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"748b0518-02cd-4e7c-8829-78e527e92298","inediblePart":0.2,"landOccupation":0.531658,"name":"Autres fruits, légumes, légumineuses, oléagineux (non encore répertoriés)","processId":"c6598f48-29cb-5b7c-9add-d58080fbd04c","rawToCookedRatio":0.856,"scenario":"import","search":"Clementine, export quality, Souss, at orchard {MA}","transportCooling":"always","visible":true},{"alias":"unknown-red-meat","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"7f6bd70c-1385-4855-9c25-e9a34e91df74","inediblePart":0,"landOccupation":43.4211,"name":"Autres viandes, oeufs, poissons (non encore répertoriés)","processId":"48efc88e-dff7-55f0-a1b3-540d17fde967","rawToCookedRatio":0.792,"scenario":"reference","search":"Meat without bone, beef, for direct consumption","transportCooling":"always","visible":true},{"alias":"unknown-groceries","categories":["misc"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":7.7622,"hedges":3.6603,"plotSize":7.3505},"id":"3211b18f-83b2-4cf8-a0fd-42962f70b8b4","inediblePart":0,"landOccupation":8.40062,"name":"Autres ingrédients divers (non encore répertoriés)","processId":"74cf4852-dbbf-5a4c-b82c-735721092903","rawToCookedRatio":1,"scenario":"reference","search":"Tea, dried {RoW}| tea production, dried | Cut-off, U - Adapted from Ecoinvent","transportCooling":"none","visible":true},{"alias":"unknown-drink","categories":[],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"1bd78657-5169-4a53-aadd-881aedc7d3e7","inediblePart":0,"landOccupation":0.0000222964,"name":"Autres eaux et autres boissons (non encore répertoriées)","processId":"d3fc19a4-7ace-5870-aeb3-fe35a8189d94","rawToCookedRatio":1,"search":"Tap water Europe market","transportCooling":"none","visible":true},{"alias":"unknown-white-meat","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"fda34c66-9093-458c-b7df-a091730b6b64","inediblePart":0,"landOccupation":9.42511,"name":"Autres viandes blanches, oeufs et poisson (non encore répertoriés)","processId":"d1d25df6-b039-52ae-b67f-32da12d75e8f","rawToCookedRatio":0.755,"scenario":"import","search":"Meat without bone chicken for direct consumption {{meat-without-bone-chicken-direct-consumption-br-max}}, constructed by Ecobalyse","transportCooling":"always","visible":true},{"alias":"unknwon-fishery-products","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"168b4b21-5fa8-484b-a192-83e7dda8f133","inediblePart":0.2,"landOccupation":1.85786,"name":"Autres produits issus de la pêche (non encore répertoriés)","processId":"f0c417b7-0ca4-5260-a43d-27f5ee572e43","rawToCookedRatio":0.819,"search":"Fresh shrimps, China production FR U","transportCooling":"always","visible":true},{"alias":"unknown-dried-fruits","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7cf22e4f-49b0-4430-818a-17de54f2b740","inediblePart":0.5,"landOccupation":16.2036,"name":"Autres fruits secs (non encore répertoriés)","processId":"a63178a5-56f9-5e18-b24e-341b234c1eed","rawToCookedRatio":1,"scenario":"import","search":"Hazelnut, unshelled, at plant {TR} U","transportCooling":"none","visible":true},{"alias":"unknown-oil","categories":["nut_oilseed_processed"],"cropGroup":"TOURNESOL","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":3.4636,"hedges":2.4556,"plotSize":3.223},"id":"66e7706b-5129-410c-b070-0a7feff2680f","inediblePart":0,"landOccupation":8.59466,"name":"Autres huiles (non encore répertoriées)","processId":"c7984a1c-66cb-52ea-bb54-763e0da8ecad","rawToCookedRatio":1,"scenario":"reference","search":"Sunflower oil, at oil mill {GLO} - Adapted from WFLDB U","transportCooling":"once_transformed","visible":true},{"alias":"anchovy-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"80aaae2b-6b1e-43fe-9139-319b114ca620","inediblePart":0.2,"landOccupation":0.0339743,"name":"Anchois FR","processId":"476ef7dc-fb77-5100-b8fa-2d76d8bc1d96","rawToCookedRatio":0.819,"scenario":"reference","search":"Anchovy, consumption mix {FR} U","transportCooling":"always","visible":false},{"alias":"anchovy-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"fcb112b1-bf64-431d-8f01-f2a9e7bfe155","inediblePart":0.2,"landOccupation":0.0339743,"name":"Anchois UE","processId":"476ef7dc-fb77-5100-b8fa-2d76d8bc1d96","rawToCookedRatio":0.819,"scenario":"import","search":"Anchovy, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"anchovy-non-eu","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"91314b7a-0b9f-4893-946d-e321dc1cacb4","inediblePart":0.2,"landOccupation":0.0339743,"name":"Anchois par défaut","processId":"476ef7dc-fb77-5100-b8fa-2d76d8bc1d96","rawToCookedRatio":0.819,"scenario":"import","search":"Anchovy, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"sardine-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"3a892ff6-4689-4053-96e7-0f9038894fae","inediblePart":0.2,"landOccupation":0.00403671,"name":"Sardine FR","processId":"9aa3ad5a-ce31-5029-b022-0b70826acfda","rawToCookedRatio":1,"scenario":"reference","search":"European Pilchard, BBiscay, Seine, average, at landing {FR} U","transportCooling":"always","visible":true},{"alias":"sardine-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"f7c74916-6951-4074-acd9-42dbe97dbb32","inediblePart":0.2,"landOccupation":0.0162783,"name":"Sardine UE","processId":"341bcac7-3807-5ed0-8f2f-53e4ba863282","rawToCookedRatio":1,"scenario":"import","search":"European pilchard or sardine, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"sardine-non-eu","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"79ce12b6-db5c-43c8-be48-44deb8f704e1","inediblePart":0.2,"landOccupation":0.0162783,"name":"Sardine par défaut","processId":"341bcac7-3807-5ed0-8f2f-53e4ba863282","rawToCookedRatio":1,"scenario":"import","search":"European pilchard or sardine, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"cod-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"62fc4202-1ff8-44f5-8f5b-e734ac8a4730","inediblePart":0.2,"landOccupation":0.0342705,"name":"Morue UE","processId":"0b9307ce-91c0-5d64-9c4d-d6ebf407f872","rawToCookedRatio":1,"scenario":"import","search":"Cod, consumption mix {FR}","transportCooling":"always","visible":true},{"alias":"crab-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"6875d374-d24e-45d1-93c1-39aa52e3713c","inediblePart":0.5,"landOccupation":0.329,"name":"Crabe FR","processId":"741ddf36-8294-5997-9611-e8cfed46dfaa","rawToCookedRatio":0.819,"scenario":"reference","search":"Brown crab, 1 kg of product, at landing {FR} U","transportCooling":"always","visible":true},{"alias":"crab-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"4f075683-12a5-423b-bd78-75aed2781290","inediblePart":0.5,"landOccupation":0.621,"name":"Crabe UE","processId":"84182cec-81b4-5fa3-bcf1-6d085774bb77","rawToCookedRatio":0.819,"scenario":"import","search":"Brown crab, 1 kg of product, at landing {GB} U","transportCooling":"always","visible":true},{"alias":"hake-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"cb1fc717-78f9-46fe-9121-fbf8aa803599","inediblePart":0.2,"landOccupation":0.0238428,"name":"Colin UE","processId":"53bddc6a-f760-5477-a44c-9af5a8b8b681","rawToCookedRatio":1,"scenario":"import","search":"Hake, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"lobster-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"5b0f85b9-5bc9-4eca-b134-af3a344f586e","inediblePart":0.5,"landOccupation":1.84,"name":"Homard FR","processId":"5a8697e7-ad87-52de-8c80-43924ff457e5","rawToCookedRatio":0.819,"scenario":"reference","search":"Lobster, 1 kg of product, at landing {FR} U","transportCooling":"always","visible":true},{"alias":"lobster-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"16ff0416-9d7f-4e3b-9e2e-7a25e729b863","inediblePart":0.5,"landOccupation":1.83,"name":"Homard UE","processId":"589f255b-e2d9-525d-b9aa-6e35f9111d70","rawToCookedRatio":0.819,"scenario":"import","search":"Lobster, 1 kg of product, at landing {GB} U","transportCooling":"always","visible":true},{"alias":"lobster-non-eu","categories":["animal_product"],"defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"id":"c217f7ad-7413-4663-b049-1ce6c040f597","inediblePart":0.5,"landOccupation":0.125,"name":"Homard par défaut","processId":"04037b75-7d5f-5fa3-9498-ace56417f706","rawToCookedRatio":0.819,"scenario":"import","search":"Lobster, 1 kg of product, at landing {US} U","transportCooling":"always","visible":true},{"alias":"salmon-raw-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"cacf491b-5529-4e0c-af3f-75ab1d007655","inediblePart":0.2,"landOccupation":5.14488,"name":"Saumon cru UE","processId":"b5a50474-8d15-55c1-b9f6-fe9e134ec019","rawToCookedRatio":1,"scenario":"import","search":"Salmon, fillet, raw, at processing {FR} U","transportCooling":"always","visible":true},{"alias":"squid-fr","categories":["animal_product"],"defaultOrigin":"France","density":1,"id":"1bcc2d19-8352-4cf8-bb55-81444a15d398","inediblePart":0.2,"landOccupation":0.0342705,"name":"Calmar FR","processId":"f5ae2780-5602-5dcf-ad17-51e7c8e84e17","rawToCookedRatio":0.819,"scenario":"reference","search":"Squid, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"mandarin-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.575,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"6467c956-277d-4e09-80c2-b0b062f84086","inediblePart":0.2,"landOccupation":1.28386,"name":"Mandarine par défaut","processId":"205fbb70-754d-5160-98aa-736cf6231c22","rawToCookedRatio":0.856,"scenario":"import","search":"Mandarin, at farm (WFLDB) cn","transportCooling":"always","visible":true},{"alias":"melon-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7b30c4ad-e851-4274-8062-4e14850108a9","inediblePart":0.4,"landOccupation":0.424457,"name":"Melon par défaut","processId":"dbf9fb3d-a447-571b-bcb3-48b92f1df68d","rawToCookedRatio":0.856,"scenario":"import","search":"Melon, conventional, national average, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"blueberry-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"869f04ba-6780-4124-9240-b7be514be1ba","inediblePart":0.03,"landOccupation":3.45114,"name":"Myrtille UE","processId":"e2685c22-5b8b-57b9-b112-590de9ce9b7f","rawToCookedRatio":0.856,"scenario":"import","search":"Blueberry, at farm {CA} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"blueberry-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0eb658ae-a7e4-4b74-a7eb-9604b23c2f98","inediblePart":0.03,"landOccupation":3.45114,"name":"Myrtille FR","processId":"e2685c22-5b8b-57b9-b112-590de9ce9b7f","rawToCookedRatio":0.856,"scenario":"import","search":"Blueberry, at farm {CA} - Adapted from WFLDB U","transportCooling":"always","visible":true},{"alias":"hazelnut-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":3.8341,"plotSize":11.183},"id":"df64fdd7-1900-402c-86b9-e766e22c27ed","inediblePart":0.5,"landOccupation":12.7804,"name":"Noisette avec coque Bio","processId":"6e3b1b19-b91b-55aa-bd62-6bef269d3411","rawToCookedRatio":1,"scenario":"organic","search":"Hazelnut, in shell, at farm, organic 2023 {IT}","transportCooling":"none","visible":true},{"alias":"hazelnut-unshelled-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":8.2333,"plotSize":24.014},"id":"4531bf0a-7910-4166-b3b1-e94027a10426","inediblePart":0.5,"landOccupation":27.4443,"name":"Noisette décortiquée Bio","processId":"d024fd06-4e3f-5a50-a1ec-2d5e744117c8","rawToCookedRatio":1,"scenario":"organic","search":"Hazelnut, unshelled, consumption mix, organic 2023 {FR} U","transportCooling":"none","visible":false},{"alias":"hazelnut-unshelled-fr","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":4.7391,"plotSize":13.822},"id":"60184de2-cc9e-4618-924a-b8fecf080c8b","inediblePart":0.5,"landOccupation":15.797,"name":"Noisette décortiquée FR","processId":"9109ede7-b2f6-594b-9125-e2082ce2c0f1","rawToCookedRatio":1,"scenario":"reference","search":"Hazelnut, unshelled, consumption mix {FR} U","transportCooling":"none","visible":false},{"alias":"chesnut-inshell-organic","categories":["nut_oilseed_raw","organic"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"France","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":3.8645,"plotSize":11.271},"id":"17b171b8-1e5e-472f-a6c5-8053b5ae4c9a","inediblePart":0.5,"landOccupation":12.8815,"name":"Châtaigne avec coque Bio","processId":"5c14a077-1794-591a-a7c3-eeee0aea3569","rawToCookedRatio":1,"scenario":"reference","search":"Walnut, dried inshell, traditional varieties, organic 2023, at farm gate {FR} U","transportCooling":"none","visible":true},{"alias":"walnut-inshell-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0060abe9-a6c2-47fb-bc87-404a9bbd3971","inediblePart":0.5,"landOccupation":1.62257,"name":"Noix avec coque UE","processId":"9d2a146b-8560-57a1-bf8d-98b59f2f02db","rawToCookedRatio":1,"scenario":"import","search":"Walnut, in shell, dried, at farm (WFLDB)","transportCooling":"none","visible":true},{"alias":"walnut-inshell-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"69d6cbd1-914d-40ea-aaa1-082911ed2fdd","inediblePart":0.5,"landOccupation":1.62257,"name":"Noix avec coque par défaut","processId":"9d2a146b-8560-57a1-bf8d-98b59f2f02db","rawToCookedRatio":1,"scenario":"import","search":"Walnut, in shell, dried, at farm (WFLDB)","transportCooling":"none","visible":true},{"alias":"barley-eu","categories":["grain_raw"],"cropGroup":"ORGE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"34a88056-cd23-40e6-8eaa-6a64595fa9b2","inediblePart":0,"landOccupation":1.35913,"name":"Orge UE","processId":"32e2ea09-f2de-5552-837b-5a5157064caa","rawToCookedRatio":2.259,"scenario":"import","search":"Barley grain, non-irrigated, at farm {DE} - Adapted from WFLDB U","transportCooling":"none","visible":false},{"alias":"barley-non-eu","categories":["grain_raw"],"cropGroup":"ORGE","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"de8ef49d-d235-4513-9496-aa8409bdc093","inediblePart":0,"landOccupation":1.35913,"name":"Orge par défaut","processId":"32e2ea09-f2de-5552-837b-5a5157064caa","rawToCookedRatio":2.259,"scenario":"import","search":"Barley grain at farm DE","transportCooling":"none","visible":true},{"alias":"pistachio-organic","categories":["nut_oilseed_raw"],"cropGroup":"FRUITS A COQUES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":1.6852,"plotSize":4.915},"id":"115a010d-270f-43f8-9827-b27348a08d13","inediblePart":0.5,"landOccupation":5.61718,"name":"Pistache avec coque Bio","processId":"5244d4d6-7f6a-5b09-aa80-c93a705ebb1a","rawToCookedRatio":1,"scenario":"organic","search":"Peanut, in shell, at farm, organic 2023 {GLO}","transportCooling":"none","visible":true},{"alias":"leek-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"7aea09f0-f3ae-4df0-9cbc-ba4007ce1459","inediblePart":0.2,"landOccupation":0.174645,"name":"Poireau UE","processId":"5fb3671b-4461-5f97-8577-6e6b4c8d044f","rawToCookedRatio":0.856,"scenario":"import","search":"leek, consumption","transportCooling":"always","visible":true},{"alias":"leek-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"bb58047c-2b1d-42ad-b5a2-bc5ebf8289a1","inediblePart":0.2,"landOccupation":0.174645,"name":"Poireau par défaut","processId":"5fb3671b-4461-5f97-8577-6e6b4c8d044f","rawToCookedRatio":0.856,"scenario":"import","search":"leek, consumption","transportCooling":"always","visible":true},{"alias":"bean-non-eu","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.3505,"plotSize":1.9059},"id":"134bc97e-e3dc-44de-8ec6-947b608a2d42","inediblePart":0,"landOccupation":3.04951,"name":"Pois par défaut","processId":"b1de3c75-d408-5099-b3f6-8de91704766d","rawToCookedRatio":2.259,"scenario":"reference","search":"protein pea//[GLO] market for protein pea","transportCooling":"none","visible":true},{"alias":"bean-eu","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"0fdccf80-b169-4b34-8409-d15c0d100957","inediblePart":0,"landOccupation":2.63969,"name":"Pois UE","processId":"90f96aaa-159f-50a4-8456-55bad07c4cc4","rawToCookedRatio":2.259,"scenario":"import","search":"protein pea FR","transportCooling":"none","visible":true},{"alias":"bean-fr","categories":["grain_raw"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0395,"plotSize":1.4671},"id":"bfdf1505-8426-499e-8286-a1e4b4920c7e","inediblePart":0,"landOccupation":2.34733,"name":"Pois FR","processId":"dc856fdb-f22f-5ccc-969e-de539aec81ac","rawToCookedRatio":2.259,"scenario":"reference","search":"Spring pea, conventional, 15% moisture, animal feed, at farm gate, production {FR} U","transportCooling":"none","visible":true},{"alias":"chickpea-non-eu","categories":["nut_oilseed_raw"],"cropGroup":"LEGUMINEUSES A GRAIN","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"227914fd-5cf5-4c05-958f-ac4321e6c557","inediblePart":0.2,"landOccupation":1.24093,"name":"Pois chiche par défaut","processId":"4f4050d3-9afe-5a90-b1ff-7505465f0a31","rawToCookedRatio":2.33,"scenario":"import","search":"chickpea production RoW","transportCooling":"none","visible":true},{"alias":"bellpepper-unheated-greenhouse-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.295,"ecosystemicServices":{"cropDiversity":0,"hedges":0.021327,"plotSize":0.053318},"id":"361139ac-1028-4cc8-9c0e-4955c5fa39d3","inediblePart":0.03,"landOccupation":0.0853083,"name":"Poivron sous serre non chauffée FR","processId":"74a8638a-7e28-5023-85d8-8bdd83ce70d6","rawToCookedRatio":0.856,"scenario":"reference","search":"Bell pepper {GLO}| bell pepper production, in unheated greenhouse","transportCooling":"none","visible":true},{"alias":"bellpepper-unheated-greenhouse-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.295,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"123d51c5-27a3-4b57-a1d2-3b627dc4032a","inediblePart":0.03,"landOccupation":0.0853083,"name":"Poivron sous serre non chauffée UE","processId":"74a8638a-7e28-5023-85d8-8bdd83ce70d6","rawToCookedRatio":0.856,"scenario":"import","search":"Bell pepper {GLO}| bell pepper production, in unheated greenhouse","transportCooling":"none","visible":true},{"alias":"bellpepper-unheated-greenhouse-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.295,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"d018ec1f-d3c8-4fa1-a70d-bca1b0380c47","inediblePart":0.03,"landOccupation":0.0853083,"name":"Poivron sous serre non chauffée par défaut","processId":"74a8638a-7e28-5023-85d8-8bdd83ce70d6","rawToCookedRatio":0.856,"scenario":"import","search":"Bell pepper {GLO}| bell pepper production, in unheated greenhouse","transportCooling":"none","visible":true},{"alias":"apple-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"8c2299d6-49e4-493c-bafe-c0b4b7ef2079","inediblePart":0.1,"landOccupation":0.78111,"name":"Pomme par défaut","processId":"75a76ed9-ad03-5269-a6f5-0fb86ce1073f","rawToCookedRatio":0.856,"scenario":"import","search":"Apple, at farm CN","transportCooling":"always","visible":true},{"alias":"potato-table-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"9bdb3037-1154-4477-a99c-6ca4ba9c9168","inediblePart":0.1,"landOccupation":0.247386,"name":"Pomme de terre de table UE","processId":"22dbe2d5-b300-5ccb-be44-88aa86c9c545","rawToCookedRatio":0.856,"scenario":"import","search":"Potato, at farm (WFLDB) nl","transportCooling":"always","visible":true},{"alias":"potato-table-non-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"33c427df-1967-452a-91b0-cdc1a2c9ca04","inediblePart":0.1,"landOccupation":0.620426,"name":"Pomme de terre de table par défaut","processId":"22dbe2d5-b300-5ccb-be44-88aa86c9c545","rawToCookedRatio":0.856,"scenario":"import","search":"Potato, at farm (WFLDB) cn","transportCooling":"always","visible":true},{"alias":"chicken-breast-eu","categories":["animal_product"],"defaultOrigin":"EuropeAndMaghreb","density":1,"id":"e57ae0e0-6277-427f-9090-087c97008966","inediblePart":0,"landOccupation":9.06905,"name":"Blanc de poulet cru UE","processId":"311355dc-d317-565e-8496-48f248fd1b58","rawToCookedRatio":0.755,"scenario":"import","search":"Chicken meat at slaughterhouse PL","transportCooling":"always","visible":false},{"alias":"tomato-paste-fr","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.016922,"plotSize":0.042304},"id":"ffd854c7-858b-4b97-9827-f99d2b71d48d","inediblePart":0,"landOccupation":0.0676861,"name":"Purée de tomates FR","processId":"345cb680-a630-54c5-96d1-2e83a11753da","rawToCookedRatio":1,"scenario":"reference","search":"Tomato puree, canned, processed in FR | Ambient (long) | Steel | at packaging {FR} U","transportCooling":"none","visible":true},{"alias":"radish-fr","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0.011541,"plotSize":0.028853},"id":"001e0594-90e9-4d0f-bf0d-a9a253269c58","inediblePart":0.1,"landOccupation":0.0461652,"name":"Radis FR","processId":"8f007c95-d23f-5de2-8d4e-e415860b94d7","rawToCookedRatio":1,"scenario":"reference","search":"Radish, consumption mix {FR} U","transportCooling":"always","visible":true},{"alias":"radish-eu","categories":["vegetable_fresh"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6375,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"bb970211-9d5c-4faf-a649-482e2a34b381","inediblePart":0.1,"landOccupation":0.0443612,"name":"Radis UE","processId":"40b21e57-7d60-5160-b2b7-63f9e0060d84","rawToCookedRatio":1,"scenario":"import","search":"Radish {GLO}| radish production, in unheated greenhouse | Cut-off, U - Adapted from Ecoinvent U","transportCooling":"always","visible":true},{"alias":"rice-basmati-eu","categories":["grain_raw"],"cropGroup":"RIZ","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"3294e42c-c053-42e5-bcc0-a35f189681d6","inediblePart":0,"landOccupation":1.21333,"name":"Riz basmati UE","processId":"a5542384-0a68-5b46-95d1-a9654e6ca74c","rawToCookedRatio":2.259,"scenario":"import","search":"Basmati rice, consumption mix {FR} U","transportCooling":"none","visible":true},{"alias":"durum-wheat-semolina-non-eu","categories":["grain_processed"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"b02ea3a9-f5f1-4673-b043-1d6d72894964","inediblePart":0,"landOccupation":3.79749,"name":"Semoule de blé dur par défaut","processId":"7b1e6ffd-8435-5e41-b98f-dc1358b003c3","rawToCookedRatio":2.259,"scenario":"import","search":"Durum wheat, semolina, at plant {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"durum-wheat-semolina-eu","categories":["grain_processed"],"cropGroup":"AUTRES CEREALES","defaultOrigin":"EuropeAndMaghreb","density":0.24,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"af44d84e-8a7d-47c2-ab19-934b3ea9ab17","inediblePart":0,"landOccupation":3.79749,"name":"Semoule de blé dur UE","processId":"7b1e6ffd-8435-5e41-b98f-dc1358b003c3","rawToCookedRatio":2.259,"scenario":"import","search":"Durum wheat, semolina, at plant {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"plum-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"EuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"07433a1e-66d9-45c2-889b-38afb54622de","inediblePart":0.2,"landOccupation":1.56147,"name":"Prune UE","processId":"31f47ffb-0ac9-5140-a61e-f41246644d45","rawToCookedRatio":0.856,"scenario":"import","search":"cherry at farm GLO","transportCooling":"none","visible":true},{"alias":"plum-non-eu","categories":["vegetable_fresh"],"cropGroup":"VERGERS","defaultOrigin":"OutOfEuropeAndMaghreb","density":0.447,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"b83a6d8e-5afa-447b-be7b-5df9573e7d3b","inediblePart":0.2,"landOccupation":1.56147,"name":"Prune par défaut","processId":"31f47ffb-0ac9-5140-a61e-f41246644d45","rawToCookedRatio":0.856,"scenario":"import","search":"cherry at farm GLO","transportCooling":"none","visible":true},{"alias":"soft-wheat-eu","categories":["grain_raw"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0,"plotSize":0},"id":"ae9ccfff-93bb-46b3-9ade-479fbbdb6d56","inediblePart":0,"landOccupation":2.7526,"name":"Blé tendre UE","processId":"d7e924ef-91a9-57da-9fb4-f05a3f3afd08","rawToCookedRatio":2.259,"scenario":"import","search":"Wheat grain, at farm {GLO} - Adapted from WFLDB U","transportCooling":"none","visible":true},{"alias":"onion-dried","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":0.6315,"plotSize":1.5788},"id":"0a2edda7-2158-4206-8d8c-2151fc925215","inediblePart":0,"landOccupation":2.526,"name":"Oignons déshydratés par défaut","processId":"d87062b2-a9af-52c3-8ba9-554c929f5c8a","rawToCookedRatio":1,"scenario":"reference","search":"onions dried","transportCooling":"none","visible":true},{"alias":"pasta-glo-fr","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0681,"plotSize":1.4378},"id":"5cba3ac2-bd63-43eb-9b6f-70b9de218c9a","inediblePart":0.2,"landOccupation":3.83407,"name":"Pâtes FR (blé GLO + élec FR)","processId":"85e316a2-7f09-50d5-b0bb-3b8735faeac5","rawToCookedRatio":2.259,"scenario":"reference","search":"Pasta, dried, from durum wheat, at plant, from GLO wheat and FR elec, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"pasta-glo-it","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.071,"plotSize":1.4417},"id":"c210f2f2-0188-4f30-bdb0-5703ae460117","inediblePart":0.2,"landOccupation":3.84446,"name":"Pâtes IT (blé GLO + élec IT)","processId":"62daf7e7-0f77-50f7-a81b-891823b336de","rawToCookedRatio":2.259,"scenario":"reference","search":"Pasta, dried, from durum wheat, at plant, from GLO wheat and IT elec, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"pasta-glo-es","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0706,"plotSize":1.4412},"id":"9bead6d1-5941-40b0-ae58-3d51bb690ba8","inediblePart":0.2,"landOccupation":3.84315,"name":"Pâtes ES (blé GLO + élec ES)","processId":"2d0ef86b-3865-57f9-a896-e45c8f680b2c","rawToCookedRatio":2.259,"scenario":"reference","search":"Pasta, dried, from durum wheat, at plant, from GLO wheat and ES elec, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"pasta-glo-de","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.0705,"plotSize":1.441},"id":"41e0d2c7-b63f-4b64-821b-5102dee75693","inediblePart":0.2,"landOccupation":3.8428,"name":"Pâtes DE (blé GLO + élec DE)","processId":"01aaf607-7a6c-56d9-8f92-901d93e7bf30","rawToCookedRatio":2.259,"scenario":"reference","search":"Pasta, dried, from durum wheat, at plant, from GLO wheat and DE elec, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"pasta-glo-be","categories":["grain_processed"],"cropGroup":"BLE TENDRE","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":1.075,"plotSize":1.4471},"id":"fb86bf1d-1862-4255-8361-d1228c7403c6","inediblePart":0.2,"landOccupation":3.85891,"name":"Pâtes BE (blé GLO + élec BE)","processId":"19ea8c4d-44aa-56a9-9bd8-91533020b214","rawToCookedRatio":2.259,"scenario":"reference","search":"Pasta, dried, from durum wheat, at plant, from GLO wheat and BE elec, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soup-fr","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.073561,"plotSize":0.1839},"id":"6f5ad776-ae83-4c01-9940-c4bc0a85ba50","inediblePart":0,"landOccupation":0.294242,"name":"Soupe FR","processId":"6942f4e0-3e9c-5cf4-9fb3-04fe89a2f209","rawToCookedRatio":1,"scenario":"reference","search":"Soup, mixed vegetables, prepacked, to be reheated, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"soup-be","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.079638,"plotSize":0.1991},"id":"241f3c4d-cf63-42d6-a0bb-75a05e634208","inediblePart":0,"landOccupation":0.318552,"name":"Soupe BE (légumes FR + élec BE)","processId":"884d58ae-0f84-58b0-9930-8073074a2cf8","rawToCookedRatio":1,"scenario":"reference","search":"Soup, mixed vegetables, prepacked, to be reheated, at plant {BE} U, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soup-de","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.076382,"plotSize":0.19096},"id":"641912dd-5925-4f83-a169-a29529f7f225","inediblePart":0,"landOccupation":0.305529,"name":"Soupe DE (légumes FR + élec DE)","processId":"1c27e968-92e7-548a-948a-0aa9336cf8a9","rawToCookedRatio":1,"scenario":"reference","search":"Soup, mixed vegetables, prepacked, to be reheated, at plant {DE} U, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soup-it","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.076521,"plotSize":0.1913},"id":"d6153611-8140-4b45-ad0f-ea196f603eaa","inediblePart":0,"landOccupation":0.306084,"name":"Soupe IT (légumes FR + élec IT)","processId":"b827d807-310f-5d03-9238-0ed2b3ec6f5d","rawToCookedRatio":1,"scenario":"reference","search":"Soup, mixed vegetables, prepacked, to be reheated, at plant {IT} U, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soup-es","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":1,"ecosystemicServices":{"cropDiversity":0,"hedges":0.076228,"plotSize":0.19057},"id":"08d7413e-ae4d-40a8-a057-05221075e97a","inediblePart":0,"landOccupation":0.30491,"name":"Soupe ES (légumes FR + élec ES)","processId":"3b3a6ad1-7928-5bc5-8e51-765f9e44681e","rawToCookedRatio":1,"scenario":"reference","search":"Soup, mixed vegetables, prepacked, to be reheated, at plant {ES} U, constructed by Ecobalyse","transportCooling":"none","visible":true},{"alias":"soup-dehydrated-fr","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"France","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":1.4149,"plotSize":3.5372},"id":"e01522ad-886c-4599-81b9-9e0f1d82e0e7","inediblePart":0,"landOccupation":5.6596,"name":"Soupe déshydratée FR","processId":"e0ee5ed9-2497-552d-a3cd-6a3b29a38595","rawToCookedRatio":12,"scenario":"reference","search":"Soup, mixed vegetables, dehydrated, at plant {FR} U","transportCooling":"none","visible":true},{"alias":"soup-dehydrated-be","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":1.847,"plotSize":4.6176},"id":"47d8fa33-b8eb-4147-a9df-124757c8a2ef","inediblePart":0,"landOccupation":7.38817,"name":"Soupe déshydratée BE","processId":"c10d2318-bf02-58b4-93cc-df882b6d75b3","rawToCookedRatio":12,"scenario":"reference","search":"Soup, mixed vegetables, dehydrated, at plant {BE} U","transportCooling":"none","visible":true},{"alias":"soup-dehydrated-de","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":1.6155,"plotSize":4.0389},"id":"76dcde1e-c604-4966-8ec2-b89008059f5b","inediblePart":0,"landOccupation":6.46218,"name":"Soupe déshydratée DE","processId":"f74a1f56-55cb-54d3-aa93-aae041c5f37c","rawToCookedRatio":12,"scenario":"reference","search":"Soup, mixed vegetables, dehydrated, at plant {DE} U","transportCooling":"none","visible":true},{"alias":"soup-dehydrated-it","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":1.6254,"plotSize":4.0635},"id":"ee72a4aa-f864-49a5-a46b-2c0511cd50c1","inediblePart":0,"landOccupation":6.5016,"name":"Soupe déshydratée IT","processId":"f76d41a1-259f-5e47-99f2-ef490aeab78f","rawToCookedRatio":12,"scenario":"reference","search":"Soup, mixed vegetables, dehydrated, at plant {IT} U","transportCooling":"none","visible":true},{"alias":"soup-dehydrated-es","categories":["vegetable_processed"],"cropGroup":"LEGUMES-FLEURS","defaultOrigin":"EuropeAndMaghreb","density":0.6195,"ecosystemicServices":{"cropDiversity":0,"hedges":1.6045,"plotSize":4.0113},"id":"2dfa8f4e-961a-4c2d-bd40-298b31173ef0","inediblePart":0,"landOccupation":6.41816,"name":"Soupe déshydratée ES","processId":"7201a69c-aaee-53b9-920b-08bc74418e20","rawToCookedRatio":12,"scenario":"reference","search":"Soup, mixed vegetables, dehydrated, at plant {ES} U","transportCooling":"none","visible":true}]';
var $author$project$Static$Json$foodProductExamplesJson = '[{"category":"","id":"1d04242a-6312-4d92-9233-8b485d128e65","name":"Produit vide","query":{"ingredients":[]},"scope":"food"},{"category":"Produits céréaliers","id":"b2b9f235-e7c4-4727-aa7a-1f7c8b5a9812","name":"Farine de blé bio FR (1kg) - 20","query":{"distribution":"ambient","ingredients":[{"country":"FR","id":"db791ac8-02b9-41b0-bc2b-2913e745bd19","mass":1000}],"packaging":[{"id":"759e14f8-923e-56c5-a373-8edadc741ec8","mass":20}]},"scope":"food"},{"category":"Produits céréaliers","id":"3c7d4110-6064-45a2-a7de-6649fa72ca1a","name":"Farine de blé FR (1kg) - 22","query":{"distribution":"ambient","ingredients":[{"country":"FR","id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":1000}],"packaging":[{"id":"759e14f8-923e-56c5-a373-8edadc741ec8","mass":20}]},"scope":"food"},{"category":"Produits céréaliers","id":"e2de4127-69e0-4436-b814-efb648ac9ff7","name":"Farine de blé origine Ukraine (1kg) - 22","query":{"distribution":"ambient","ingredients":[{"id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":1000}],"packaging":[{"id":"759e14f8-923e-56c5-a373-8edadc741ec8","mass":20}]},"scope":"food"},{"category":"Volaille","id":"55539367-a21b-4da1-8009-e2620c18404f","name":"Filets de poulet FR (250g) - 96","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"a360871c-fc35-4cb3-af2c-5eeb8bd6f984","mass":250}],"packaging":[{"id":"6b7c83ff-d085-5f36-8553-4e84e7bd944f","mass":50}],"preparation":["freezing","oven"]},"scope":"food"},{"category":"Volaille","id":"af215046-d6af-470c-975f-643ad0be35e5","name":"Filets de poulet origine Brésil (250g) - 100","query":{"distribution":"frozen","ingredients":[{"country":"BR","id":"8fb5024c-ceec-4201-b069-ea253c537ad6","mass":250}],"packaging":[{"id":"6b7c83ff-d085-5f36-8553-4e84e7bd944f","mass":50}],"preparation":["freezing","oven"]},"scope":"food"},{"category":"Produit surgelé","id":"b9966def-463f-4ad0-b225-5da94f80de73","name":"Pizza bolognese (375g) - 21","query":{"distribution":"frozen","ingredients":[{"id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":148},{"id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":100},{"id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":19},{"id":"ce073919-1aff-4892-a1f5-b25ee94bccd8","mass":43},{"id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":3},{"id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":5},{"id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":33},{"id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","mass":19},{"id":"3cfab110-363e-442a-9170-1af337fe9ea3","mass":2},{"id":"97cde31b-e46e-472d-836d-9b217c3845df","mass":14},{"id":"4d5198e7-413a-4ae2-8448-535aa3b302ae","mass":6}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":398}},"scope":"food"},{"category":"Produit surgelé","id":"6fb777d4-eae2-4594-9f0c-7fc4e2853b97","name":"Pizza bolognese FR (375g) - 21","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":148},{"country":"FR","id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":100},{"country":"FR","id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":19},{"country":"FR","id":"41d65ed4-230f-4a47-a67c-9a8015f50420","mass":43},{"country":"FR","id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":3},{"country":"FR","id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":5},{"country":"FR","id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":33},{"country":"FR","id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","mass":19},{"country":"FR","id":"3cfab110-363e-442a-9170-1af337fe9ea3","mass":2},{"country":"FR","id":"97cde31b-e46e-472d-836d-9b217c3845df","mass":14},{"country":"FR","id":"4d5198e7-413a-4ae2-8448-535aa3b302ae","mass":6}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":392}},"scope":"food"},{"category":"Produit surgelé","id":"786839bf-f348-4609-b2d4-75d3f35c692d","name":"Pizza bolognese FR bio (375g) - 21","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"db791ac8-02b9-41b0-bc2b-2913e745bd19","mass":148},{"country":"FR","id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":100},{"country":"FR","id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":19},{"country":"FR","id":"4e3009f3-1b33-41d7-b6f3-dc7230331da0","mass":43},{"country":"FR","id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":3},{"country":"FR","id":"51f8e8d2-13c0-446c-bf0a-9272fc46edde","mass":5},{"country":"FR","id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":33},{"country":"FR","id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","mass":19},{"country":"FR","id":"64fb23f2-0cac-403c-bbfa-1973c9a0ea40","mass":2},{"country":"FR","id":"97cde31b-e46e-472d-836d-9b217c3845df","mass":14},{"country":"FR","id":"9042b6d0-c309-4757-a03f-ba802f0c8c01","mass":6}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":398}},"scope":"food"},{"category":"Produit surgelé","id":"4ce49252-07c4-4e2a-a451-dc26f1550889","name":"Pizza royale (350g) - 6","query":{"distribution":"frozen","ingredients":[{"id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":97},{"id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":89},{"id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":70},{"id":"755225f1-f0c5-497f-b8a9-263828a84a22","mass":16},{"id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":5},{"id":"5d22559d-c16d-4545-94b9-be2ff51e2879","mass":31},{"id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":16},{"id":"47b15759-416e-4c86-9127-4c75a55b7b8f","mass":1},{"id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":22}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":363}},"scope":"food"},{"category":"Produit surgelé","id":"d97ee8a2-1e8b-425c-9ea4-c1d67d2640f9","name":"Pizza royale FR (350g) - 6","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":97},{"country":"FR","id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":89},{"country":"FR","id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":70},{"country":"FR","id":"755225f1-f0c5-497f-b8a9-263828a84a22","mass":16},{"country":"FR","id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":5},{"country":"FR","id":"5d22559d-c16d-4545-94b9-be2ff51e2879","mass":31},{"country":"FR","id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":16},{"id":"47b15759-416e-4c86-9127-4c75a55b7b8f","mass":1},{"country":"FR","id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":22}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":363}},"scope":"food"},{"category":"Produit surgelé","id":"1a2911dd-d32b-4e4e-9c31-a5eceaea66bb","name":"Pizza végétale (385g) - 19","query":{"distribution":"frozen","ingredients":[{"id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":113},{"id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":76},{"id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":36.00000000000001},{"id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":4},{"id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":21},{"id":"47b15759-416e-4c86-9127-4c75a55b7b8f","mass":2},{"id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","mass":12},{"id":"16caaefa-40f5-4d29-a3e6-26349846f2c9","mass":36.00000000000001},{"id":"361139ac-1028-4cc8-9c0e-4955c5fa39d3","mass":36.00000000000001},{"id":"97cde31b-e46e-472d-836d-9b217c3845df","mass":12},{"id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":22}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":396}},"scope":"food"},{"category":"Produit surgelé","id":"dafff308-db3f-4c3d-aa9c-b626c1b4ae17","name":"Pizza végétale FR (385g) - 19","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"a2e25aca-1f42-4bc8-bc0e-4d7c751775aa","mass":113},{"country":"FR","id":"6523c72b-2c28-474d-9bf8-45e018bbd0be","mass":76},{"country":"FR","id":"faa513ae-9c32-4e6c-874e-58c13309339e","mass":36.00000000000001},{"country":"FR","id":"8f075c25-9ebf-430c-b41d-51d165c6e0d8","mass":4},{"country":"FR","id":"96b301d9-d21b-4cea-8903-bd7917e95a30","mass":21},{"id":"47b15759-416e-4c86-9127-4c75a55b7b8f","mass":2},{"country":"FR","id":"74314f2e-aa88-4ac1-aa78-bb29dceebf0b","mass":12},{"country":"FR","id":"16caaefa-40f5-4d29-a3e6-26349846f2c9","mass":36.00000000000001},{"country":"FR","id":"361139ac-1028-4cc8-9c0e-4955c5fa39d3","mass":36.00000000000001},{"country":"FR","id":"97cde31b-e46e-472d-836d-9b217c3845df","mass":12},{"country":"FR","id":"36b3ffec-51e7-4e26-b1b5-7d52554e0aa6","mass":22}],"packaging":[{"id":"25595091-35b6-5c62-869f-a29c318c367e","mass":100}],"preparation":["freezing","oven"],"transform":{"id":"83b897cf-9ed2-5604-83b4-67fab8606d35","mass":370}},"scope":"food"},{"category":"Viande bovine","id":"b375f93b-b8c2-4849-ab32-8a731a8212ca","name":"Steak haché surgelé origine Brésil (200g) - 82","query":{"distribution":"frozen","ingredients":[{"country":"BR","id":"ce073919-1aff-4892-a1f5-b25ee94bccd8","mass":200}],"packaging":[{"id":"6b7c83ff-d085-5f36-8553-4e84e7bd944f","mass":50}],"preparation":["freezing","pan-cooking"]},"scope":"food"},{"category":"Viande bovine","id":"f5872248-3fa2-49cd-928e-df1adb9c7094","name":"Steak haché surgelé FR (250g) - 95","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"41d65ed4-230f-4a47-a67c-9a8015f50420","mass":250}],"packaging":[{"id":"b7f21404-aa5d-5a90-acb6-5f099fab8e76","mass":50}],"preparation":["freezing","pan-cooking"]},"scope":"food"},{"category":"Viande bovine","id":"2fd25fd5-48fa-49b5-b5f2-e9b1fc5db166","name":"Steak haché surgelé bio FR (200g) - 78","query":{"distribution":"frozen","ingredients":[{"country":"FR","id":"4e3009f3-1b33-41d7-b6f3-dc7230331da0","mass":200}],"packaging":[{"id":"6b7c83ff-d085-5f36-8553-4e84e7bd944f","mass":50}],"preparation":["freezing","pan-cooking"]},"scope":"food"}]';
var $author$project$Data$Impact$Definition$Definition = F7(
	function (trigram, label, description, unit, decimals, pefData, ecoscoreData) {
		return {h9: decimals, $8: description, fV: ecoscoreData, _: label, jG: pefData, ku: trigram, hs: unit};
	});
var $author$project$Data$Impact$Definition$AggregatedScoreData = F3(
	function (color, normalization, weighting) {
		return {aV: color, gA: normalization, hA: weighting};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Data$Impact$Definition$decodeAggregatedScoreData = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Data$Impact$Definition$AggregatedScoreData,
	A2($elm$json$Json$Decode$field, 'color', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'normalization', $author$project$Data$Unit$decodeImpact),
	A2($elm$json$Json$Decode$field, 'weighting', $author$project$Data$Split$decodeFloat));
var $author$project$Data$Impact$Definition$decodeDefinition = function (trigram) {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'ecoscore',
		$elm$json$Json$Decode$maybe($author$project$Data$Impact$Definition$decodeAggregatedScoreData),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'pef',
			$elm$json$Json$Decode$maybe($author$project$Data$Impact$Definition$decodeAggregatedScoreData),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'decimals',
				$elm$json$Json$Decode$int,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'short_unit',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'description_fr',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'label_fr',
							$elm$json$Json$Decode$string,
							A2(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
								$elm_community$json_extra$Json$Decode$Extra$fromResult(
									$author$project$Data$Impact$Definition$toTrigram(trigram)),
								$elm$json$Json$Decode$succeed($author$project$Data$Impact$Definition$Definition))))))));
};
var $author$project$Data$Impact$Definition$decode = $author$project$Data$Impact$Definition$decodeBase($author$project$Data$Impact$Definition$decodeDefinition);
var $author$project$Data$Common$Db$impactsFromJson = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$decodeString($author$project$Data$Impact$Definition$decode),
	$elm$core$Result$mapError($elm$json$Json$Decode$errorToString));
var $author$project$Static$Json$impactsJson = '{"acd":{"decimals":2,"description_en":"Indicator of the **potential acidification of soils and water** due to the release of gases such as nitrogen oxides and sulphur oxides.","description_fr":"Indicateur de l\'**acidification potentielle des sols et des eaux** due à la libération de gaz tels que les oxydes d\'azote et les oxydes de soufre.\\n\\nCet indicateur se mesure en mol (quantité de matière) d\'équivalent d\'ions hydrogène (`H+`).","ecoscore":{"color":"#91cf4f","normalization":55.5695,"weighting":0.0491},"label_en":"Acidification","label_fr":"Acidification","pef":{"color":"#ff1493","normalization":55.5695,"weighting":0.062},"short_unit":"molH+e","unit_en":"mol H+ eq","unit_fr":"mol éq. H+"},"cch":{"decimals":2,"description_en":"Indicator of **potential global warming** due to **emissions of greenhouse gases to air**. Divided into 3 subcategories based on the emission source: (1) fossil resources, (2) bio-based resources and (3) land use change.","description_fr":"Indicateur le plus connu, correspond à la **modification du climat**, affectant l\'écosystème global.\\n\\nCet indicateur se mesure en kg équivalent `CO₂`, le principal gaz à effet de serre.","ecoscore":{"color":"#9025be","normalization":7553.08,"weighting":0.2106},"label_en":"Climate change","label_fr":"Changement climatique","pef":{"color":"#800000","normalization":7553.08,"weighting":0.2106},"short_unit":"kgCO₂e","unit_en":"kg CO₂ eq","unit_fr":"kg éq. CO₂"},"ecs":{"decimals":2,"description_en":"Aggregated impact: sum of the weighted and normalized impact of all environmental impact categories according to the Ecobalyse methodology, including Biodiversity.","description_fr":"Impact *agrégé* : somme des impacts **normalisés** et **pondérés** de chaque catégorie d\'impact selon la méthode Ecobalyse, incluant l\'impact sur la biodiversité.\\n\\nCet indicateur n\'a **pas de dimension**, il se mesure en **Points** (`Pt`), en **milliPoints** (`mPt`) ou en **microPoints** (`µPt`) avec `1 Pt = 1 000 mPt = 1 000 000 µPt`. `1 Pt` correspond à l\'impact total d\'un européen sur une année.","ecoscore":null,"label_en":"Environmental Cost","label_fr":"Coût environnemental","pef":null,"short_unit":"Pts","unit_en":"Pts","unit_fr":"Pts"},"etf":{"decimals":2,"description_en":"Indicator of freshwater ecotoxicity. The unit of measurement is Comparative Toxic Unit for ecosystems (CTUe)","description_fr":"Indicateur d\'écotoxicité pour écosystèmes aquatiques d\'eau douce. Cet indicateur se mesure en Comparative Toxic Unit for ecosystems (CTUe)","ecoscore":null,"label_en":"Ecotoxicity, freshwater","label_fr":"Écotoxicité de l\'eau douce","pef":{"color":"#03A764","normalization":56716.6,"weighting":0.0192},"short_unit":"CTUe","unit_en":"CTUe","unit_fr":"CTUe"},"etf-c":{"correction":[{"sub-impact":"etf-o","weighting":2},{"sub-impact":"etf-i","weighting":1}],"decimals":2,"description_en":"Indicator of freshwater ecotoxicity. The unit of measurement is Comparative Toxic Unit for ecosystems (CTUe). This impact is corrected.","description_fr":"Indicateur d\'écotoxicité pour écosystèmes aquatiques d\'eau douce. Cet indicateur se mesure en Comparative Toxic Unit for ecosystems (CTUe). Cet indicateur est corrigé.","ecoscore":{"color":"#375622","normalization":98120,"weighting":0.2106},"label_en":"Ecotoxicity, freshwater, corrected","label_fr":"Écotoxicité de l\'eau douce, corrigée","pef":null,"short_unit":"CTUe","unit_en":"CTUe","unit_fr":"CTUe"},"fru":{"decimals":2,"description_en":"Indicator of the **depletion of natural fossil** fuel resources (e.g. natural gas, coal, oil).","description_fr":"Indicateur de l\'**épuisement des ressources naturelles en combustibles fossiles** (gaz, charbon, pétrole).\\n\\nIl se mesure en mégajoules (`MJ`), la quantité d\'énergie fossile utilisée.","ecoscore":{"color":"#9dc3e6","normalization":65004.3,"weighting":0.0659},"label_en":"Resource use, fossils","label_fr":"Utilisation de ressources fossiles","pef":{"color":"#000000","normalization":65004.3,"weighting":0.0832},"short_unit":"MJ","unit_en":"MJ","unit_fr":"MJ"},"fwe":{"decimals":2,"description_en":"Indicator of the **enrichment of the fresh water ecosystem** with nutritional elements, due to the emission of nitrogen or phosphor containing compounds.","description_fr":"Indicateur correspondant à un **enrichissement excessif des milieux naturels en nutriments**, ce qui conduit à une prolifération et une asphyxie (zone morte). C\'est ce phénomène qui est à l\'origine des algues vertes. On peut le retrouver en rivière et en lac également.\\n\\nCet indicateur se mesure en kg d\'équivalent Phosphore (`P`), le phosphore étant l\'un des éléments responsables de l\'eutrophisation des eaux douces.","ecoscore":{"color":"#548235","normalization":1.60685,"weighting":0.0222},"label_en":"Eutrophication, freshwater","label_fr":"Eutrophisation eaux douces","pef":{"color":"#1f7dca","normalization":1.60685,"weighting":0.028},"short_unit":"kgPe","unit_en":"kg P eq","unit_fr":"kg éq. P"},"htc":{"decimals":2,"description_en":"Indicator of carcinogenic toxicity for humans. The unit of measurement is Comparative toxic unit for humans (CTUh)","description_fr":"Indicateur de toxicité cancérigène pour l\'homme. Cet indicateur se mesure en Comparative Toxic Unit for humans (CTUh)","ecoscore":null,"label_en":"Human toxicity, cancer","label_fr":"Toxicité humaine - cancer","pef":{"color":"#ffff00","normalization":0.0000172529,"weighting":0.0213},"short_unit":"CTUh","unit_en":"CTUh","unit_fr":"CTUh"},"htc-c":{"correction":[{"sub-impact":"htc-o","weighting":2},{"sub-impact":"htc-i","weighting":0}],"decimals":2,"description_en":"Indicator of carcinogenic toxicity for humans. The unit of measurement is Comparative toxic unit for humans (CTUh). This impact is corrected.","description_fr":"Indicateur de toxicité cancérigène pour l\'homme. Cet indicateur se mesure en Comparative Toxic Unit for humans (CTUh). Cet indicateur est corrigé.","ecoscore":{"color":"#f4b183","normalization":0.0000172529,"weighting":0},"label_en":"Human toxicity, cancer, corrected","label_fr":"Toxicité humaine - cancer, corrigée","pef":null,"short_unit":"CTUh","unit_en":"CTUh","unit_fr":"CTUh"},"htn":{"decimals":2,"description_en":"Indicator of non-carcinogenic toxicity for humans. The unit of measurement is Comparative toxic unit for humans (CTUh)","description_fr":"Indicateur de toxicité non cancérigène pour l\'homme. Cet indicateur se mesure en Comparative Toxic Unit for humans (CTUh)","ecoscore":null,"label_en":"Human toxicity, non-cancer","label_fr":"Toxicité humaine - non-cancer","pef":{"color":"#FFA907","normalization":0.000128736,"weighting":0.0184},"short_unit":"CTUh","unit_en":"CTUh","unit_fr":"CTUh"},"htn-c":{"correction":[{"sub-impact":"htn-o","weighting":2},{"sub-impact":"htn-i","weighting":0}],"decimals":2,"description_en":"Indicator of non-carcinogenic toxicity for humans. The unit of measurement is Comparative toxic unit for humans (CTUh). This is a corrected impact.","description_fr":"Indicateur de toxicité non cancérigène pour l\'homme. Cet indicateur se mesure en Comparative Toxic Unit for humans (CTUh). Cet indicateur est corrigé.","ecoscore":{"color":"#43682b","normalization":0.000128736,"weighting":0},"label_en":"Human toxicity, non-cancer, corrected","label_fr":"Toxicité humaine - non-cancer, corrigée","pef":null,"short_unit":"CTUh","unit_en":"CTUh","unit_fr":"CTUh"},"ior":{"decimals":2,"description_en":"Damage to **human health and ecosystems** linked to the emissions of radionuclides.","description_fr":"Indicateur correspondant aux dommages pour la **santé humaine et les écosystèmes** liés aux émissions de radionucléides.\\n\\nIl se mesure en kilobecquerel d\'equivalent `Uranium 235`.","ecoscore":{"color":"#be8f00","normalization":4220.16,"weighting":0.0397},"label_en":"Ionising radiation","label_fr":"Radiations ionisantes","pef":{"color":"#ffd700","normalization":4220.16,"weighting":0.0501},"short_unit":"kBqU235e","unit_en":"kBq U-235 eq","unit_fr":"éq. kBq U235"},"ldu":{"decimals":2,"description_en":"Measure of the changes in **soil quality** (Biotic production, Erosion resistance, Mechanical filtration).","description_fr":"Mesure de l\'évolution de la **qualité des sols** (production biotique, résistance à l\'érosion, filtration mécanique).\\n\\nCet indicateur n\'a pas de dimension, il se mesure en Points (`Pt`).","ecoscore":{"color":"#a9d18e","normalization":819498,"weighting":0.0629},"label_en":"Land use","label_fr":"Utilisation des sols","pef":{"color":"#006400","normalization":819498,"weighting":0.0794},"short_unit":"Pt","unit_en":"Pt","unit_fr":"sans dimension (Pt)"},"mru":{"decimals":2,"description_en":"Indicator of the **depletion of natural non-fossil resources**.","description_fr":"Indicateur de l\'**épuisement des ressources naturelles non fossiles**.\\n\\nIl se mesure en kg d\'équivalent d\'antimoine (`Sb`) (élément métallique).","ecoscore":{"color":"#698ed0","normalization":0.0636226,"weighting":0.0598},"label_en":"Resource use, minerals and metals","label_fr":"Utilisation de ressources minérales et métalliques","pef":{"color":"#a9a9a9","normalization":0.0636226,"weighting":0.0755},"short_unit":"kgSbe","unit_en":"kg Sb eq","unit_fr":"kg éq. Sb"},"ozd":{"decimals":2,"description_en":"Indicator of **emissions to air** that cause the **destruction of the stratospheric ozone layer**.","description_fr":"La couche d\'ozone est située en haute altitude dans l\'atmosphère, elle protège des rayons ultra-violets solaires. Son appauvrissement augmente l\'**exposition de l\'ensemble des êtres vivants à ces radiations négatives** (cancérigènes en particulier).\\n\\nCet indicateur se mesure en kg d\'équivalent `CFC 11`, le CFC 11 (trichlorofluorométhane) étant l\'un des gaz responsable de l\'appauvrissement de la couche d\'ozone.","ecoscore":{"color":"#ffc000","normalization":0.053648,"weighting":0.05},"label_en":"Ozone depletion","label_fr":"Appauvrissement de la couche d\'ozone","pef":{"color":"#800080","normalization":0.053648,"weighting":0.0631},"short_unit":"kgCFC11e","unit_en":"kg CFC11 eq","unit_fr":"kg éq. CFC 11"},"pco":{"decimals":2,"description_en":"Indicator of **emissions of gases** that affect the creation of photochemical ozone in the lower atmosphere (smog) catalysed by sunlight.","description_fr":"Indicateur correspondant à la **dégradation de la qualité de l\'air**, principalement via la formation de brouillard de basse altitude nommé *smog*. Il a des conséquences néfastes sur la santé.\\n\\nCet indicateur se mesure en kg d\'équivalent Composés Organiques Volatiles Non Méthaniques (`COVNM`), un ensemble de composés organiques (alcools, aromatiques,...) contribuant à la formation d\'ozone photochimique.","ecoscore":{"color":"#ff6161","normalization":40.8592,"weighting":0.0379},"label_en":"Photochemical ozone formation","label_fr":"Formation d\'ozone photochimique","pef":{"color":"#da70d6","normalization":40.8592,"weighting":0.0478},"short_unit":"kgNMVOCe","unit_en":"kg NMVOC eq","unit_fr":"kg éq. COVNM"},"pef":{"decimals":2,"description_en":"Aggregated impact: sum of the weighted and normalized impact of all environmental impact categories according to the PEF methodology.","description_fr":"Impact *agrégé* : somme des impacts **normalisés** et **pondérés** de chaque catégorie d\'impact selon la méthode *single score* du PEF. 12 impacts différents pris en compte à ce stade. 4 encore à ajouter.\\n\\nCet indicateur n\'a **pas de dimension**, il se mesure en **Points** (`Pt`), en **milliPoints** (`mPt`) ou en **microPoints** (`µPt`) avec `1 Pt = 1 000 mPt = 1 000 000 µPt`. `1 Pt` correspond à l\'impact total d\'un européen sur une année.","ecoscore":null,"label_en":"PEF Coefficient Score","label_fr":"Score coefficient PEF","pef":null,"short_unit":"µPt PEF","unit_en":"µPt PEF","unit_fr":"µPt PEF"},"pma":{"decimals":2,"description_en":"Indicator of the potential **incidence of disease** due to particulate matter emissions.","description_fr":"Indicateur correspondant aux **effets négatifs sur la santé humaine** causés par les émissions de particules (`PM`) et de leurs précurseurs (`NOx`, `SOx`, `NH3`).\\n\\nCet indicateur se mesure en incidence de maladie supplémentaire due aux particules","ecoscore":{"color":"#ffc000","normalization":0.000595367,"weighting":0.071},"label_en":"Particulate matter","label_fr":"Particules","pef":{"color":"#696969","normalization":0.000595367,"weighting":0.0896},"short_unit":"dis.inc.","unit_en":"disease inc.","unit_fr":"incidence de maladie"},"swe":{"decimals":2,"description_en":"Indicator of the **enrichment of the marine ecosystem** with nutritional elements, due to the emission of nitrogen containing compounds.","description_fr":"Indicateur correspondant à un **enrichissement excessif des milieux naturels en nutriments**, ce qui conduit à une prolifération et une asphyxie (zone morte). C\'est ce phénomène qui est à l\'origine des algues vertes.\\n\\nCet indicateur se mesure en kg d\'équivalent azote (`N`), l\'azote étant l\'un des éléments responsables de l\'eutrophisation des eaux marines.","ecoscore":{"color":"#70ad47","normalization":19.5452,"weighting":0.0235},"label_en":"Eutrophication, marine","label_fr":"Eutrophisation marine","pef":{"color":"#000080","normalization":19.5452,"weighting":0.0296},"short_unit":"kgNe","unit_en":"kg N eq","unit_fr":"kg éq. N"},"tre":{"decimals":2,"description_en":"Indicator of the **enrichment of the terrestrial ecosystem** with nutritional elements, due to the emission of nitrogen containing compounds.","description_fr":"Comme dans l\'eau, l\'eutrophisation terrestre correspond à un **enrichissement excessif du milieu**, en azote en particulier, conduisant a un déséquilibre et un appauvrissement de l\'écosystème. Ceci concerne principalement les sols agricoles.\\n\\nCet indicateur se mesure en mol d\'équivalent azote (`N`).","ecoscore":{"color":"#c5e0b4","normalization":176.755,"weighting":0.0294},"label_en":"Eutrophication, terrestrial","label_fr":"Eutrophisation terrestre","pef":{"color":"#20b2aa","normalization":176.755,"weighting":0.0371},"short_unit":"molNe","unit_en":"mol N eq","unit_fr":"mol éq. N"},"wtu":{"decimals":2,"description_en":"Indicator of water consumption contributing to the depletion of available water. The impact is expressed in **cubic meters (`m³`)** of water use","description_fr":"Indicateur de la consommation d\'eau et son épuisement dans certaines régions. **À ce stade, elle n\'est prise en compte que pour l\'étape “Matière & Filature”.**\\n\\nCet indicateur se mesure en **mètre cube (`m³`)** d\'eau consommé.","ecoscore":{"color":"#0070c0","normalization":11468.7,"weighting":0.0674},"label_en":"Water use","label_fr":"Utilisation de ressources en eau","pef":{"color":"#00ffff","normalization":11468.7,"weighting":0.0851},"short_unit":"m³ eq","unit_en":"m³ eq","unit_fr":"m³ éq"}}';
var $author$project$Static$Db$impactDefinitions = $author$project$Data$Common$Db$impactsFromJson($author$project$Static$Json$impactsJson);
var $author$project$Static$Json$objectExamplesJson = '[{"category":"","id":"0d08a9ff-5683-4d3d-a7b8-dce74f37cd3b","name":"Objet vide","query":{"components":[]},"scope":"object"}]';
var $author$project$Static$Json$objectComponentsJson = '[{"elements":[],"id":"c38a56d0-c718-405b-963f-f43dbcba3571","name":"Composant vide","scopes":["object"]},{"elements":[{"amount":0.734063,"material":"59b42284-3e45-5343-8a20-1d7d66137461"}],"id":"ad9d7f23-076b-49c5-93a4-ee1cd7b53973","name":"Dossier plastique (PP)","scopes":["object"]},{"elements":[{"amount":0.91125,"material":"59b42284-3e45-5343-8a20-1d7d66137461"}],"id":"eda5dd7e-52e4-450f-8658-1876efc62bd6","name":"Assise plastique (PP)","scopes":["object"]},{"elements":[{"amount":35,"material":"59b42284-3e45-5343-8a20-1d7d66137461"}],"id":"190276e9-5b90-42d6-8fbd-bc7ddfd4c960","name":"Cadre plastique","scopes":["object"]}]';
var $author$project$Static$Json$textileComponentsJson = '[{"elements":[],"id":"28f2f107-ce9c-4760-9a74-0187ab067d09","name":"Composant vide","scopes":["textile"]},{"elements":[{"amount":0.05,"material":"dc44ae3c-8552-5822-a76d-f95ef68682da"}],"id":"86b877ff-0d59-482f-bb34-3ff306b07496","name":"Zip long","scopes":["textile"]},{"elements":[{"amount":0.01,"material":"dc44ae3c-8552-5822-a76d-f95ef68682da"}],"id":"0e8ea799-9b06-490c-a925-37564746c454","name":"Zip court","scopes":["textile"]},{"elements":[{"amount":0.001,"material":"61bab541-9097-5680-9884-254c98f25d80"}],"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","name":"Bouton en plastique","scopes":["textile"]},{"elements":[{"amount":0.003,"material":"dc44ae3c-8552-5822-a76d-f95ef68682da"}],"id":"0c903fc7-279b-4375-8cfa-ca8133b8e973","name":"Bouton en métal","scopes":["textile"]}]';
var $author$project$Static$Json$veliComponentsJson = '[{"elements":[],"id":"89b27c2a-0bb6-42c4-a052-8fb4c5a26bfc","name":"Composant vide","scopes":["veli"]}]';
var $author$project$Static$Json$rawJsonComponents = {jx: $author$project$Static$Json$objectComponentsJson, kl: $author$project$Static$Json$textileComponentsJson, kA: $author$project$Static$Json$veliComponentsJson};
var $author$project$Static$Json$textileMaterialsJson = '[{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"elasthane","materialProcessUuid":"b2340802-bde9-56e4-984f-37110706225e","name":"Elasthane (Lycra)","origin":"Synthetic","primary":false,"processId":"b2340802-bde9-56e4-984f-37110706225e","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Elasthane (Lycra)"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-acrylique","materialProcessUuid":"89bd29cf-9ae0-5cf0-825d-8a6d4a73a34f","name":"Acrylique","origin":"Synthetic","primary":false,"processId":"89bd29cf-9ae0-5cf0-825d-8a6d4a73a34f","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Acrylique"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-jute-kenaf","materialProcessUuid":"8782714f-1332-589a-85ca-885c47f5e58b","name":"Jute","origin":"NaturalFromVegetal","primary":false,"processId":"8782714f-1332-589a-85ca-885c47f5e58b","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Jute"},{"cff":null,"defaultCountry":"FR","geographicOrigin":"Europe","id":"ei-pp","materialProcessUuid":"28a36af2-cca9-5baa-a83e-d01b2e52ced6","name":"Polypropylène","origin":"Synthetic","primary":false,"processId":"28a36af2-cca9-5baa-a83e-d01b2e52ced6","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Polypropylène"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-pet","materialProcessUuid":"61bab541-9097-5680-9884-254c98f25d80","name":"Polyester","origin":"Synthetic","primary":true,"processId":"61bab541-9097-5680-9884-254c98f25d80","recycledFrom":null,"recycledProcessUuid":"994efc14-cc89-526c-b9d0-0d6a99adbd4f","shortName":"Polyester"},{"cff":{"manufacturerAllocation":0.5,"recycledQualityRatio":1},"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-pet-r","materialProcessUuid":"994efc14-cc89-526c-b9d0-0d6a99adbd4f","name":"Polyester recyclé","origin":"Synthetic","primary":true,"processId":"994efc14-cc89-526c-b9d0-0d6a99adbd4f","recycledFrom":"ei-pet","recycledProcessUuid":null,"shortName":"Polyester recyclé"},{"cff":null,"defaultCountry":"FR","geographicOrigin":"Europe","id":"ei-pa","materialProcessUuid":"b2318c3f-6d7b-5d95-b201-6b95470db3b7","name":"Nylon","origin":"Synthetic","primary":true,"processId":"b2318c3f-6d7b-5d95-b201-6b95470db3b7","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Nylon"},{"cff":null,"defaultCountry":"FR","geographicOrigin":"Europe","id":"ei-lin","materialProcessUuid":"b4e7353b-7963-5d88-b4bc-84bd925f5a86","name":"Lin","origin":"NaturalFromVegetal","primary":true,"processId":"b4e7353b-7963-5d88-b4bc-84bd925f5a86","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Lin"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-laine-par-defaut","materialProcessUuid":"3b45f504-83ac-5d0d-ab96-388850f3ef6f","name":"Laine par défaut","origin":"NaturalFromAnimal","primary":false,"processId":"3b45f504-83ac-5d0d-ab96-388850f3ef6f","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Laine par défaut"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-laine-nouvelle-filiere","materialProcessUuid":"40ec17ee-6b44-5ee2-8fbc-559aed52764f","name":"Laine nouvelle filière","origin":"NaturalFromAnimal","primary":true,"processId":"40ec17ee-6b44-5ee2-8fbc-559aed52764f","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Laine nouvelle filière"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-coton","materialProcessUuid":"f0dbe27b-1e74-55d0-88a2-bda812441744","name":"Coton","origin":"NaturalFromVegetal","primary":true,"processId":"f0dbe27b-1e74-55d0-88a2-bda812441744","recycledFrom":null,"recycledProcessUuid":"7c1986fd-fb5c-53b9-8a7a-aea3650145eb","shortName":"Coton"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-coton-organic","materialProcessUuid":"ae34a9bc-36c5-5ffa-8520-150e219569fe","name":"Coton biologique","origin":"NaturalFromVegetal","primary":true,"processId":"ae34a9bc-36c5-5ffa-8520-150e219569fe","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Coton biologique"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-chanvre","materialProcessUuid":"82aab465-3b46-52d2-9625-a68625a3f9fc","name":"Chanvre","origin":"NaturalFromVegetal","primary":true,"processId":"82aab465-3b46-52d2-9625-a68625a3f9fc","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Chanvre"},{"cff":null,"defaultCountry":"CN","geographicOrigin":"Asie - Pacifique","id":"ei-viscose","materialProcessUuid":"d60beb93-af80-56f5-84bf-71f5c76fd4a8","name":"Viscose","origin":"ArtificialFromOrganic","primary":true,"processId":"d60beb93-af80-56f5-84bf-71f5c76fd4a8","recycledFrom":null,"recycledProcessUuid":null,"shortName":"Viscose"},{"cff":{"manufacturerAllocation":0.8,"recycledQualityRatio":0.5},"defaultCountry":"FR","geographicOrigin":"France","id":"coton-rdpc","materialProcessUuid":"698746cf-6528-582e-a5e8-df4367bdb9e2","name":"Coton recyclé (déchets post-consommation)","origin":"NaturalFromVegetal","primary":true,"processId":"698746cf-6528-582e-a5e8-df4367bdb9e2","recycledFrom":"ei-coton","recycledProcessUuid":null,"shortName":"Coton recyclé (déchets post-consommation)"},{"cff":{"manufacturerAllocation":0.8,"recycledQualityRatio":0.5},"defaultCountry":"FR","geographicOrigin":"Espagne & France","id":"coton-rdp","materialProcessUuid":"7c1986fd-fb5c-53b9-8a7a-aea3650145eb","name":"Coton recyclé (déchets de production)","origin":"NaturalFromVegetal","primary":true,"processId":"7c1986fd-fb5c-53b9-8a7a-aea3650145eb","recycledFrom":"ei-coton","recycledProcessUuid":null,"shortName":"Coton recyclé (déchets de production)"}]';
var $author$project$Static$Json$textileProductExamplesJson = '[{"category":"Tshirt / Polo","id":"c0500a78-8b40-4e92-88df-c2a39e1a08c3","name":"Tshirt lin (150g) - France - Mode \\"éthique\\"","query":{"business":"small-business","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"TR","mass":0.15,"materials":[{"id":"ei-lin","share":1}],"numberOfReferences":200,"price":30,"product":"tshirt"},"scope":"textile"},{"category":"Tshirt / Polo","id":"b9dc9be5-ba32-4b8c-9190-b93098cf1d0d","name":"Tshirt coton bio (150g) - France - Mode \\"éthique\\"","query":{"business":"small-business","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"TR","mass":0.15,"materials":[{"id":"ei-coton-organic","share":1}],"numberOfReferences":200,"price":30,"product":"tshirt"},"scope":"textile"},{"category":"Pull","id":"dffc6a19-794a-4d14-ad1a-bc3512359f22","name":"Pull polyester (550g) - Asie - Mode \\"ultra fast fashion\\"","query":{"business":"large-business-without-services","countryDyeing":"RAS","countryFabric":"RAS","countryMaking":"RAS","countrySpinning":"RAS","mass":0.55,"materials":[{"id":"ei-pet","share":1}],"numberOfReferences":100000,"price":15,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"f02b1029-0d04-4239-94d1-b384ab3316cb","name":"Pull coton (550g) - Chine - Mode \\"fast fashion\\"","query":{"business":"large-business-without-services","countryDyeing":"CN","countryFabric":"CN","countryMaking":"CN","countrySpinning":"CN","mass":0.55,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":9000,"price":30,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"c605e8cc-7f3e-42b6-afc1-9358bda9a633","name":"Pull viscose (550g) - Chine - Mode \\"fast fashion\\"","query":{"business":"large-business-without-services","countryDyeing":"CN","countryFabric":"CN","countryMaking":"CN","countrySpinning":"CN","mass":0.55,"materials":[{"id":"ei-viscose","share":0.7},{"id":"ei-pet","share":0.3}],"numberOfReferences":9000,"price":30,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"9986e023-47f7-42c7-8c1b-4fe1371f2f59","name":"Pull coton (550g) - Pakistan - Mode \\"traditionnelle\\"","query":{"business":"large-business-without-services","countryDyeing":"PK","countryFabric":"PK","countryMaking":"PK","countrySpinning":"PK","mass":0.55,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":2500,"price":70,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"dc4a1762-ac99-4d41-8ef6-1f4d647dec62","name":"Pull coton bio (550g) - France - Mode \\"traditionnelle\\"","query":{"business":"large-business-with-services","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"IN","mass":0.55,"materials":[{"id":"ei-coton-organic","share":1}],"numberOfReferences":2500,"price":70,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"8a57688b-1da6-4fc4-85aa-a27c6cdf4a56","name":"Pull laine (550g) - France - Mode \\"éthique\\"","query":{"business":"small-business","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"CN","mass":0.55,"materials":[{"id":"ei-laine-par-defaut","share":1}],"numberOfReferences":200,"price":95,"product":"pull"},"scope":"textile"},{"category":"Pull","id":"611fd763-8df3-40d1-a51a-e8073bb3aaf0","name":"Pull laine paysanne (550g) - France - Mode \\"éthique\\"","query":{"business":"small-business","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"FR","mass":0.55,"materials":[{"country":"FR","id":"ei-laine-nouvelle-filiere","share":1}],"numberOfReferences":200,"price":95,"product":"pull"},"scope":"textile"},{"category":"Tshirt / Polo","id":"64ec2a97-5b87-4dc8-a9c2-96f3b50e9fe2","name":"Tshirt synthétique (150g) - Asie - Mode \\"ultra fast fashion\\"","query":{"business":"large-business-without-services","countryDyeing":"RAS","countryFabric":"RAS","countryMaking":"RAS","countrySpinning":"RAS","mass":0.15,"materials":[{"id":"ei-pet","share":0.95},{"id":"ei-pp","share":0.05}],"numberOfReferences":100000,"price":10,"product":"tshirt"},"scope":"textile"},{"category":"Tshirt / Polo","id":"351d73dc-9c50-4aa8-858a-2bd5448d1f26","name":"Tshirt coton (150g) - Chine - Mode \\"fast fashion\\"","query":{"business":"large-business-without-services","countryDyeing":"CN","countryFabric":"CN","countryMaking":"CN","countrySpinning":"CN","mass":0.15,"materials":[{"id":"ei-coton","share":0.75},{"id":"coton-rdp","share":0.25}],"numberOfReferences":9000,"price":20,"product":"tshirt"},"scope":"textile"},{"category":"Tshirt / Polo","id":"16c16705-3169-41bf-b1b2-6382b00c2118","name":"Tshirt coton (150g) - Pakistan - Mode \\"traditionnelle\\"","query":{"business":"large-business-with-services","countryDyeing":"PK","countryFabric":"PK","countryMaking":"PK","countrySpinning":"PK","mass":0.15,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":2500,"price":30,"product":"tshirt"},"scope":"textile"},{"category":"Tshirt / Polo","id":"5dbb2cfb-dc3a-48cc-bc7b-aaefbc3cc285","name":"Tshirt coton (150g) - France - Mode \\"traditionnelle\\"","query":{"business":"large-business-with-services","countryDyeing":"FR","countryFabric":"FR","countryMaking":"FR","countrySpinning":"TR","mass":0.15,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":2500,"price":30,"product":"tshirt"},"scope":"textile"},{"category":"Jupe / Robe","id":"307b3586-41f4-4d93-833a-e03b5be137cc","name":"Jupe coton (300g) - Majorant par défaut","query":{"countrySpinning":"CN","mass":0.3,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":15,"product":"jupe","trims":[{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1},{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":1}]},"scope":"textile"},{"category":"Chemise","id":"536e3785-039a-49d6-a119-3cfce485420c","name":"Chemise coton (250g) - Majorant par défaut","query":{"countrySpinning":"CN","mass":0.25,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":15,"product":"chemise","trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":10}]},"scope":"textile"},{"category":"Jean","id":"bf24fd40-9a2a-4489-935b-d82c339e5abe","name":"Jean coton (450g) - Majorant par défaut","query":{"countrySpinning":"CN","fading":true,"mass":0.45,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":20,"product":"jean","trims":[{"id":"0c903fc7-279b-4375-8cfa-ca8133b8e973","quantity":1},{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1}]},"scope":"textile"},{"category":"Pantalon","id":"f86835d3-7018-40fa-8144-2d1f6aa264b9","name":"Pantalon coton (450g) - Majorant par défaut","query":{"countrySpinning":"CN","mass":0.45,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":20,"product":"pantalon","trims":[{"id":"0c903fc7-279b-4375-8cfa-ca8133b8e973","quantity":1},{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1}]},"scope":"textile"},{"category":"Manteau / Veste","id":"32c8973b-864f-4060-977d-a0738f6414c4","name":"Manteau coton (950g) - Majorant par défaut","query":{"countrySpinning":"CN","mass":0.95,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":40,"product":"manteau","trims":[{"id":"86b877ff-0d59-482f-bb34-3ff306b07496","quantity":1},{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":3}]},"scope":"textile"},{"category":"Tshirt / Polo","id":"f48d7a6b-68db-4d1c-9623-6ec0ab89cbdb","name":"Tshirt coton (150g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.15,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":10,"product":"tshirt"},"scope":"textile"},{"category":"Tshirt / Polo","id":"6a2da9ff-9120-4a47-91ad-a8e72be45f4a","name":"Tshirt coton (150g) - Remanufacturé","query":{"business":"small-business","mass":0.15,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":200,"price":30,"product":"tshirt","upcycled":true},"scope":"textile"},{"category":"Pull","id":"190ccaed-6883-4dd9-a70b-918878ccced6","name":"Pull coton (550g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.55,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":15,"product":"pull"},"scope":"textile"},{"category":"Chaussettes","id":"47f8d396-9f57-4a1d-8d24-b2fc3439e75f","name":"Chaussettes coton (40g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.04,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":4,"product":"chaussettes"},"scope":"textile"},{"category":"Caleçon (tissé)","id":"3f3be8b2-115b-41b4-b925-5656aa7d8c87","name":"Caleçon coton (40g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.04,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":4,"product":"calecon"},"scope":"textile"},{"category":"Boxer / slip (tricoté)","id":"69a21510-b23b-4910-9bd9-23507c8f5a59","name":"Slip coton (30g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.03,"materials":[{"id":"ei-coton","share":1}],"numberOfReferences":100000,"price":4,"product":"slip"},"scope":"textile"},{"category":"Maillot de bain","id":"9d382f50-f77a-44cd-b26f-702c4a2ceb50","name":"Maillot de bain polyester (100g) - Majorant par défaut","query":{"business":"large-business-without-services","countrySpinning":"CN","mass":0.1,"materials":[{"id":"ei-pet","share":1}],"numberOfReferences":100000,"price":15,"product":"maillot-de-bain"},"scope":"textile"}]';
var $author$project$Static$Json$textileProductsJson = '[{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":15,"repairCost":10},"endOfLife":{"volume":0.006},"fabric":"weaving","id":"chemise","making":{"complexity":"low","pcrWaste":0.2},"name":"Chemise","surfaceMass":200,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":11}],"use":{"daysOfWear":40,"defaultNbCycles":20,"ironingElecInMJ":0.1638,"nonIroningProcessUuid":"163e6de6-9f3f-588c-af3a-7b375438180f","ratioDryer":0.12,"ratioIroning":0.7,"timeIroning":0.043,"wearsPerCycle":2},"yarnSize":40},{"dyeing":{"defaultMedium":"yarn"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":20,"repairCost":14},"endOfLife":{"volume":0.004},"fabric":"weaving","id":"jean","making":{"complexity":"medium","pcrWaste":0.22},"name":"Jean","surfaceMass":250,"trims":[{"id":"0c903fc7-279b-4375-8cfa-ca8133b8e973","quantity":1},{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1}],"use":{"daysOfWear":70,"defaultNbCycles":23,"ironingElecInMJ":0.24381,"nonIroningProcessUuid":"cefc9a3c-1bb2-50a4-a3ce-f56b891f764a","ratioDryer":0.3,"ratioIroning":0.63,"timeIroning":0.072,"wearsPerCycle":3},"yarnSize":40},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":15,"repairCost":19},"endOfLife":{"volume":0.007},"fabric":"weaving","id":"jupe","making":{"complexity":"low","pcrWaste":0.2},"name":"Jupe / Robe","surfaceMass":200,"trims":[{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1},{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":1}],"use":{"daysOfWear":70,"defaultNbCycles":23,"ironingElecInMJ":0.0729,"nonIroningProcessUuid":"5ca66e62-356c-57ea-81e9-82951cb7f473","ratioDryer":0.12,"ratioIroning":0.18,"timeIroning":0.075,"wearsPerCycle":3},"yarnSize":40},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":40,"repairCost":31},"endOfLife":{"volume":0.015},"fabric":"weaving","id":"manteau","making":{"complexity":"high","pcrWaste":0.2},"name":"Manteau / Veste","surfaceMass":450,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":5},{"id":"86b877ff-0d59-482f-bb34-3ff306b07496","quantity":1}],"use":{"daysOfWear":100,"defaultNbCycles":5,"ironingElecInMJ":0.018,"nonIroningProcessUuid":"8f3de83a-4545-528e-83d6-e6a065696394","ratioDryer":0.25,"ratioIroning":0.05,"timeIroning":0.067,"wearsPerCycle":20},"yarnSize":30},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":20,"repairCost":14},"endOfLife":{"volume":0.004},"fabric":"weaving","id":"pantalon","making":{"complexity":"medium","pcrWaste":0.2},"name":"Pantalon / Short","surfaceMass":250,"trims":[{"id":"0c903fc7-279b-4375-8cfa-ca8133b8e973","quantity":1},{"id":"0e8ea799-9b06-490c-a925-37564746c454","quantity":1}],"use":{"daysOfWear":70,"defaultNbCycles":23,"ironingElecInMJ":0.24381,"nonIroningProcessUuid":"f38c0b5f-873c-5d98-b216-4bf66c5bc520","ratioDryer":0.3,"ratioIroning":0.63,"timeIroning":0.072,"wearsPerCycle":3},"yarnSize":40},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":20,"repairCost":15},"endOfLife":{"volume":0.0102},"fabric":"knitting-mix","id":"pull","making":{"complexity":"low","pcrWaste":0.2},"name":"Pull","surfaceMass":250,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":5}],"use":{"daysOfWear":85,"defaultNbCycles":17,"ironingElecInMJ":0,"nonIroningProcessUuid":"a9ed30ef-4849-586f-98be-0c356054947e","ratioDryer":0.3,"ratioIroning":0,"timeIroning":0,"wearsPerCycle":5},"yarnSize":35},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":10,"repairCost":10},"endOfLife":{"volume":0.0018},"fabric":"knitting-mix","id":"tshirt","making":{"complexity":"low","pcrWaste":0.15},"name":"T-shirt / Polo","surfaceMass":200,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":3}],"use":{"daysOfWear":45,"defaultNbCycles":45,"ironingElecInMJ":0.0936,"nonIroningProcessUuid":"56a3b3e0-df9f-570b-b656-dab6724ab70c","ratioDryer":0.3,"ratioIroning":0.4,"timeIroning":0.043,"wearsPerCycle":1},"yarnSize":40},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":4,"repairCost":9},"endOfLife":{"volume":0.002},"fabric":"knitting-fully-fashioned","id":"chaussettes","making":{"complexity":"very-low","pcrWaste":0.02},"name":"Chaussettes","surfaceMass":250,"trims":[],"use":{"daysOfWear":50,"defaultNbCycles":25,"ironingElecInMJ":0,"nonIroningProcessUuid":"a9ed30ef-4849-586f-98be-0c356054947e","ratioDryer":0.3,"ratioIroning":0,"timeIroning":0,"wearsPerCycle":2},"yarnSize":35},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":4,"repairCost":9},"endOfLife":{"volume":0.002},"fabric":"weaving","id":"calecon","making":{"complexity":"low","pcrWaste":0.15},"name":"Caleçon (tissé)","surfaceMass":180,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":2}],"use":{"daysOfWear":60,"defaultNbCycles":60,"ironingElecInMJ":0,"nonIroningProcessUuid":"a9ed30ef-4849-586f-98be-0c356054947e","ratioDryer":0.3,"ratioIroning":0,"timeIroning":0,"wearsPerCycle":1},"yarnSize":45},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":4,"repairCost":9},"endOfLife":{"volume":0.002},"fabric":"knitting-mix","id":"slip","making":{"complexity":"low","pcrWaste":0.15},"name":"Boxer / Slip (tricoté)","surfaceMass":180,"trims":[],"use":{"daysOfWear":60,"defaultNbCycles":60,"ironingElecInMJ":0,"nonIroningProcessUuid":"a9ed30ef-4849-586f-98be-0c356054947e","ratioDryer":0.3,"ratioIroning":0,"timeIroning":0,"wearsPerCycle":1},"yarnSize":45},{"dyeing":{"defaultMedium":"fabric"},"economics":{"business":"large-business-without-services","numberOfReferences":100000,"price":15,"repairCost":9},"endOfLife":{"volume":0.004},"fabric":"knitting-mix","id":"maillot-de-bain","making":{"complexity":"low","pcrWaste":0.15},"name":"Maillot de bain","surfaceMass":220,"trims":[{"id":"d56bb0d5-7999-4b8b-b076-94d79099b56a","quantity":1}],"use":{"daysOfWear":30,"defaultNbCycles":30,"ironingElecInMJ":0,"nonIroningProcessUuid":"a9ed30ef-4849-586f-98be-0c356054947e","ratioDryer":0.3,"ratioIroning":0,"timeIroning":0,"wearsPerCycle":1},"yarnSize":40}]';
var $author$project$Static$Json$veliExamplesJson = '[{"category":"","id":"cefc2585-7125-4610-aadc-69970a3d67d1","name":"Véhicule vide","query":{"components":[]},"scope":"veli"}]';
var $author$project$Static$Db$db = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$decodeString(
		$author$project$Data$Process$decodeList($author$project$Data$Impact$decodeImpacts)),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Result$mapError($elm$json$Json$Decode$errorToString),
		$elm$core$Result$andThen(
			function (processes) {
				return A2(
					$elm_community$result_extra$Result$Extra$andMap,
					A4($author$project$Data$Textile$Db$buildFromJson, $author$project$Static$Json$textileProductExamplesJson, $author$project$Static$Json$textileMaterialsJson, $author$project$Static$Json$textileProductsJson, processes),
					A2(
						$elm_community$result_extra$Result$Extra$andMap,
						$elm$core$Result$Ok(processes),
						A2(
							$elm_community$result_extra$Result$Extra$andMap,
							A2($author$project$Data$Object$Db$buildFromJson, $author$project$Static$Json$objectExamplesJson, $author$project$Static$Json$veliExamplesJson),
							A2(
								$elm_community$result_extra$Result$Extra$andMap,
								A3($author$project$Data$Food$Db$buildFromJson, $author$project$Static$Json$foodProductExamplesJson, $author$project$Static$Json$foodIngredientsJson, processes),
								A2(
									$elm_community$result_extra$Result$Extra$andMap,
									$author$project$Static$Db$distances,
									A2(
										$elm_community$result_extra$Result$Extra$andMap,
										$author$project$Static$Db$impactDefinitions,
										A2(
											$elm_community$result_extra$Result$Extra$andMap,
											$author$project$Static$Db$countries(processes),
											A2(
												$elm_community$result_extra$Result$Extra$andMap,
												$author$project$Static$Db$decodeRawComponents($author$project$Static$Json$rawJsonComponents),
												$elm$core$Result$Ok($author$project$Static$Db$Db)))))))));
			})));
var $author$project$Server$update = function (msg) {
	var request = msg;
	var _v1 = $author$project$Static$Db$db(request.dJ);
	if (_v1.$ === 1) {
		var error = _v1.a;
		return A3(
			$author$project$Server$sendResponse,
			503,
			request,
			$author$project$Server$encodeValidationErrors(
				$author$project$Data$Validation$fromErrorString(error)));
	} else {
		var db = _v1.a;
		return A2($author$project$Server$cmdRequest, db, request);
	}
};
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$Server$main = $elm$core$Platform$worker(
	{
		iS: $elm$core$Basics$always(
			_Utils_Tuple2(0, $elm$core$Platform$Cmd$none)),
		kh: $elm$core$Basics$always(
			$author$project$Server$input($elm$core$Basics$identity)),
		kw: F2(
			function (msg, _v0) {
				return _Utils_Tuple2(
					0,
					$author$project$Server$update(msg));
			})
	});
_Platform_export({'Server':{'init':$author$project$Server$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));