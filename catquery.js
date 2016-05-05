// catQuery is a tiny library that makes working with HTML less painful. It's
// heavily inspired by jQuery, but focuses on being a wrapper for the modern
// but still convoluted DOM API:s. Therefore it should not be seen as a drop-in
// replacement for jQuery, as the API will probably work differently even
// though they may look alike.
//
// ## API
//
// * [catQuery()](#section-2)
// * **[Core](#section-3)**
//   * [catQuery.extend()](#section-4)
//   * [catQuery.version](#section-5)
//   * [catQuery.create()](#section-6)
//   * [catQuery.one()](#section-7)
//   * [catQuery.each()](#section-8)
//   * [.each()](#section-8)
// * **[Prototype](#section-9)**
//   * [.length](#section-10)
//   * [.node](#section-11)
//   * [.nodes](#section-12)
//   * [.find()](#section-13)
//   * [.append()](#section-14)
//   * [.prepend()](#section-15)
//   * [.before()](#section-16)
//   * [.after()](#section-17)
//   * [.remove()](#section-18)
//   * [.attr()](#section-19)
//   * [.addClass()](#section-21)
//   * [.removeClass()](#section-22)
//   * [.hasClass()](#section-23)
//   * [.css()](#section-24)
//   * [.text()](#section-25)
//   * [.on()](#section-26)
//   * [.click()](#section-27)
//

(function(document, undefined) {

  // ### catQuery(`selector`)
  // Entering a string with a query selector will search the DOM with
  // `document.querySelectorAll` and transform the result into a catQuery
  // collection.
  //
  // Example:
  //
  //     catQuery('.my-div');
  //
  // ### catQuery(`html`)
  // If the string contains HTML (simply matched by if the string starts
  // with `<` or not), catQuery will turn this into a DOM element or
  // fragment, and transform that result into a catQuery collection. Read more
  // about HTML creation further down.
  //
  // Example:
  //
  //     catQuery('<div class="my-div">Lorem ipsum</div>');
  //
  // ### catQuery(`elements`)
  // Passing an element, a DOM fragment or NodeList will turn it into a
  // catQuery collection.
  //
  // Example:
  //
  //     catQuery(document.querySelector(".my-div"));

  var catQuery = function(a) {

    if (typeof a === "string") {

      if (a.charAt(0) === "<") {
        return catQuery.create(a);
      } else {
        a = document.querySelectorAll(a);
      }
    }

    return new catQuery.fn.init(a);

  };

  catQuery.fn = catQuery.prototype = {};

  // ## Core
  // These are methods and stuff that can be accessed without having to create
  // a set first. Some of the methods are available in sets also though, these
  // functions are documented without "catQuery" as the prefix, like `extend`
  // below.

  // ### catQuery.extend(`objects...`)
  //
  // This function is used to extend an object with properties from one or more
  // other objects. The first parameter is the target, which will get the new
  // properties.
  //
  // If you enter a single property, the object will be merged into catQuery
  // itself. You can also use this on `catQuery.fn`, if you want to add your own
  // plugins jQuery-style.
  //
  // Examples:
  //
  // ~~~
  // catQuery.extend({
  //   randomElement: function() {
  //     var all = document.querySelectorAll("*");
  //     var el = all[Math.floor(Math.random()*all.length)];
  //     return catQuery(el);
  //   }
  // });
  // // You can now use catQuery.randomElement()
  // ~~~
  //
  // ~~~
  // var obj = { hello: "world" };
  // catQuery.extend(obj, {
  //   hello: "Reno"
  // });
  // obj.hello
  // // › Reno
  // ~~~

  catQuery.extend = catQuery.fn.extend = function() {
    var options, name, src, copy, target = arguments[0] || {}, length = arguments.length;
    if (length === 1) {
        arguments[1] = target;
        target = this;
        length++;
    }
    for (var i=0; i<length; i++) {
      if ((options = arguments[i]) !== null) {
        for (name in options) {
          if (options.hasOwnProperty(name)) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
    }
    return target;
  };

  catQuery.extend({

    // ### catQuery.version
    // catQuery library version.
    version: "1.1",

    // ### catQuery.create(`html`)
    // Turns a string into real HTML elements and returns it as a catQuery set.
    // If the string **doesn't** start with a `<`, it will run as a shorthand
    // for `document.createElement` instead.
    //
    // Examples:
    //
    // ~~~
    // var el = catQuery.create('<div class="things"></div>');
    // ~~~
    //
    // ~~~
    // var el = catQuery.create('div');
    // ~~~
    create: function(html) {
      if (html.charAt(0) !== "<") {
        return catQuery(document.createElement(html));
      }
      var map = {
        legend: [1, '<fieldset>', '</fieldset>'],
        tr: [2, '<table><tbody>', '</tbody></table>'],
        col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
        _default: [0, '', '']
      };

      map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

      map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

      map.thead =
      map.tbody =
      map.colgroup =
      map.caption =
      map.tfoot = [1, '<table>', '</table>'];

      map.text =
      map.circle =
      map.ellipse =
      map.line =
      map.path =
      map.polygon =
      map.polyline =
      map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

      if ('string' !== typeof html) throw new TypeError('String expected');

      var m = /<([\w:]+)/.exec(html);
      if (!m) return document.createTextNode(html);

      html = html.replace(/^\s+|\s+$/g, '');

      var tag = m[1], el;

      if (tag === 'body') {
        el = document.createElement('html');
        el.innerHTML = html;
        return el.removeChild(el.lastChild);
      }

      var wrap = map[tag] || map._default;
      var depth = wrap[0];
      var prefix = wrap[1];
      var suffix = wrap[2];
      el = document.createElement('div');
      el.innerHTML = prefix + html + suffix;
      while (depth--) el = el.lastChild;

      if (el.firstChild == el.lastChild) {
        return catQuery(el.removeChild(el.firstChild));
      }

      return catQuery(el.childNodes);
    },

    // ### catQuery.one(`selector`)
    // Find a single element (with `document.querySelector`) and create a
    // catQuery collection with it.
    //
    // ~~~
    // catQuery.one("div").length
    // // › 1
    // ~~~
    one: function(a) {
      return new catQuery.fn.init(document.querySelector(a));
    },

    // ### catQuery.each(`object`, `callback`) <br> .each(`callback`)
    // Loops through an array or object, or each element if used with a
    // collection.
    //
    // The callback always has 2 parameters, the first being the object key or
    // array index, and the second being the value or the collection element.
    //
    // Note that collection elements are **not** wrapped in a catQuery object.
    //
    // Examples:
    //
    // ~~~
    // catQuery.each(["hello", "world"], function(i, value) {
    //   console.log(value);
    // });
    // // › hello
    // // › world
    // ~~~
    //
    // ~~~
    // catQuery("<div>Hello</div><div>Elena</div>")
    // .each(function(i, el) {
    //   console.log(el.innerText);
    // });
    // // › Hello
    // // › Elena
    // ~~~
    each: catQuery.fn.each = function() {
      var arr = this.nodes ? this.nodes : arguments[0],
          i=0,
          l=arr.length,
          cb=arguments.length == 2 ? arguments[1] : arguments[0];
      if (typeof l === "function") {
        return console.error("Collection is not an array-like object");
      }
      if (typeof cb !== "function") {
        return console.error("No callback function provided");
      }
      if (l !== undefined) {
        for (; i<l; i++) {
          if (cb.call(arr[i], i, arr[i]) === false) {
            break;
          }
        }
      } else {
        for (i in arr) {
          if (cb.call(arr[i], i, arr[i]) === false) {
            break;
          }
        }
      }
      return this.nodes ? this : arguments[0];
    }

  });

  // ## Prototype
  // Here are the properties and methods that will be added to each catQuery
  // collection that has been created.

  catQuery.fn.extend({
    constructor: catQuery,
    // ### .length
    // Number of elements in the current collection.
    //
    // Example:
    //
    // ~~~
    // if (catQuery(".things").length > 0) {
    //   // .things exists, so we can do something with it
    // }
    // ~~~
    length: 0,
    // ### .node
    // The first available node in the collection. Useful if you want to
    // quickly find a single element to pass to another library.
    //
    // Example:
    //
    // ~~~
    // jQuery(catQuery(".my-div").node) // lol
    // ~~~
    node: null,
    // ### .nodes
    // An array with all nodes in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("div").nodes[2];
    // // gets the third element in the collection
    // ~~~
    nodes: [],
    // ### .find(`selector`)
    // Find children of the elements in the collection, and returns these as
    // a new catQuery collection.
    find: function(selector) {
      var results = [];
      this.each(function(i, el) {
        var noId = false;
        if (!el.id) {
          noId = true;
          el.id = "catquerytmpid";
        }
        results = results.concat(Array.prototype.slice.call(document.querySelectorAll("#"+el.id+" "+selector)));
        if (noId) el.id = "";
      });
      return catQuery(results);
    },
    // ### .append(`element`)
    // Inserts the specified element at the end of the first element in the
    // collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("<a><b></b></a>").append(catQuery("<c/>"));
    // // › <a><b></b><c></c></a>
    // ~~~
    append: function(el) {
      el = el instanceof catQuery ? el.node : el;
      this.node.appendChild(el);
      return this;
    },
    // ### .prepend(`element`)
    // Inserts the specified element as the first child of the first element
    // in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("<a><b></b></a>").prepend(catQuery("<c/>"));
    // // › <a><c></c><b></b></a>
    // ~~~
    prepend: function(el) {
      el = el instanceof catQuery ? el.node : el;
      this.node.insertBefore(el, this.node.firstChild);
      return this;
    },
    // ### .before(`element`)
    // Inserts the specified element before the first element in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("<a/>").before(catQuery("<b/>"));
    // // › <b></b><a></a>
    // ~~~
    before: function(el) {
      el = el instanceof catQuery ? el.node : el;
      this.node.parentNode.insertBefore(el, this.node);
      return this;
    },
    // ### .after(`element`)
    // Inserts the specified element after the first element in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("<a/>").after(catQuery("<b/>"));
    // // › <a></a><b></b>
    // ~~~
    after: function(el) {
      el = el instanceof catQuery ? el.node : el;
      this.node.parentNode.insertBefore(el, this.node.nextSibling);
      return this;
    },
    // ### .remove()
    // Removes each element in the collection from the DOM.
    //
    // Example:
    //
    // ~~~
    // catQuery("div").remove();
    // // All divs are gone now!
    // // (you probably shouldn't use it like that)
    // ~~~
    remove: function() {
      this.each(function(i, el) {
        el.parentNode.removeChild(el);
      });
    },
    // ### .attr(`name`, `value`) <br> .attr(`object`)
    // Sets one or more attributes to all elements in the collection. You can
    // use two string parameters where the first is the attribute name and the
    // second is the value. If you want to send several attributes you can use
    // an object where keys are attribute names and values are values.
    //
    // Example:
    //
    // ~~~
    // catQuery("div").attr("class", "kittens");
    // ~~~
    //
    // ~~~
    // catQuery("div").attr({
    //   "class": "kittens",
    //   "data-id": "123"
    // });
    // ~~~
    attr: function() {
      var args = arguments;
      if (args.length === 2) {
        this.each(function(i, el) {
          el.setAttribute(args[0], args[1]);
        });
      } else {
        if (typeof args[0] !== "string") {
          var self = this;
          catQuery.each(args[0], function(key, value) {
            self.each(function(i, el) {
              el.setAttribute(key, value);
            });
          });
        } else {
          // ### .attr(`name`)
          // If you only send a string parameter, catQuery will return the
          // attribute from the first element in the collection.
          //
          // Example:
          //
          // ~~~
          // catQuery("div").attr("class");
          // ~~~
          return this.node.getAttribute(args[0]);
        }
      }
      return this;
    },
    // ### .addClass(`name`)
    // Adds a class to each element in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("div").addClass("kittens");
    // ~~~
    addClass: function(name) {
      this.each(function(i, el) {
        el.classList.add(name);
      });
      return this;
    },
    // ### .removeClass(`name`)
    // Removes the class from each element in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("div").removeClass("kittens");
    // ~~~
    removeClass: function(name) {
      this.each(function(i, el) {
        el.classList.remove(name);
      });
      return this;
    },
    // ### .hasClass(`name`)
    // Returns a boolean that's true if any of the elements in the collection
    // has the queried class.
    //
    // Example:
    //
    // ~~~
    // catQuery(".kittens").hasClass("kittens");
    // // › true
    // ~~~
    hasClass: function(name) {
      var found = false;
      this.each(function(i, el) {
        if (el.classList.contains(name)) {
          found = true;
        }
      });
      return found;
    },
    // ### .css(`name`, `value`) <br> .css(`object`)
    // Adds one or multiple styles to the elements in the collection.
    //
    // *Note: At this time, catQuery doesn't do any automatic mapping for
    // cross-browser support of style names.*
    //
    // Examples:
    //
    // ~~~
    // catQuery('p').css("color", "red");
    // ~~~
    //
    // ~~~
    // catQuery('p').css({
    //   color: "red",
    //   backgroundColor: "#0f0"
    // });
    // ~~~
    css: function(name, value) {
      this.each(function(i, el) {
        if (typeof name === "string") {
          try {
            el.style[name] = value;
          } catch (e) {}
        } else if (typeof name === "object") {
          catQuery.each(name, function(n,v) {
            try {
              el.style[n] = v;
            } catch (e) {}
          });
        }
      });
      return this;
    },
    // ### .text(`string`)
    // Set the text content of all elements in the collection.
    text: function(string) {
      this.each(function(i, el) {
        el.innerHTML = "";
        el.appendChild(document.createTextNode(string));
      });
      return this;
    },
    // ### .on(`eventName`, `callback`)
    // Adds an event listener to each element in the collection.
    //
    // Example:
    //
    // ~~~
    // catQuery("a").on("click", function(e) {
    //   e.preventDefault();
    //   alert("Nope!");
    // });
    // ~~~
    on: function(a,b) {
      this.each(function(i, el) {
        el.addEventListener(a, b);
      });
      return this;
    },
    // ### .click(`callback`)
    // Alias for `.on('click', callback)`
    //
    // Example:
    //
    // ~~~
    // catQuery("a").click(function(e) {
    //   e.preventDefault();
    //   alert("Nope!");
    // });
    // ~~~
    click: function(b) {
      return this.on('click', b);
    },
    // ### catQuery.fn.init(`element`)
    // This is the constructor used by catQuery() when creating a collection.
    // You should never have to use this by yourself, so I'm not sure why I'm
    // even documenting it. Sorry if I confused you. Again, ignore this one,
    // it's used internally.
    //
    // I mean, I'm not your dad or anything, so I can't tell you what to do.
    // But please don't use this. It would kinda kill the point of catQuery.
    init: function(el) {
      if (el.length !== undefined) {
        this.node = el[0];
        this.nodes = Array.prototype.slice.call(el);
        this.length = el.length;
      } else {
        this.node = el;
        this.nodes = [el];
        this.length = 1;
      }
      return this;
    }
  });

  catQuery.fn.init.prototype = catQuery.prototype;

  // Finally, we turn the catQuery variable into a global, so you can actually
  // use it.

  window.catQuery = catQuery;

})(window.document);

/*
The MIT License (MIT)

Copyright (c) 2015 Marcus Olovsson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
