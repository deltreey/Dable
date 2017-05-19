export function mixin(obj, mixins) {
  for (var key in mixins) {
    if (Object.prototype.hasOwnProperty.call(mixins, key)) {
      obj[key] = typeof mixins[key] === 'object' && mixins[key] !== null ?
        mixin(mixins[key].constructor(), mixins[key]) : mixins[key];
    }
  }
  return obj;
}

export function bind(fn, thisArg) {
  var outer = Array.prototype.slice.call(arguments, 2);
  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return fn.apply(thisArg, outer.concat(args));
  };
}

export function doSort(dable) {
  return function() {
    dable.sortFunc(this); // use this here, as the event.srcElement
                          // is probably a <span>
  };
}

export function doSearch(dable) {
  return function() {
    dable.searchFunc(this); // use this here, as the event.srcElement
                            // is probably a <span>
  };
}

// eslint-disable-next-line no-empty-function
export function noop() {}

export function arrayContains(array, object) {
  for (var i = 0; i < array.length; ++i) {
    if (array[i] === object) {
      return true;
    }
  }
  return false;
}

export function removeStyle(node) {
  node.removeAttribute('style');
  var childNodes = node.children;
  if (childNodes && childNodes.length > 0) {
    for (var i = 0; i < childNodes.length; ++i) {
      removeStyle(childNodes[i]);
    }
  }
}

export function triggerKeyup(el) {
  var e;
  if ('createEvent' in document) {
    // modern browsers, IE9+
    e = document.createEvent('KeyboardEvent');
    e.initEvent('keyup', true, true, window, false, false, false, false,
      38, 38);
    el.dispatchEvent(e);
  } else {
    // IE 8
    e = document.createEventObject('KeyboardEvent');
    e.keyCode = 38;
    el.fireEvent('onkeyup', e);
  }
}
