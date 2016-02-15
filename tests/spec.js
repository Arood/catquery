var c = catQuery;

describe("creating elements", function() {

  it("works when typing raw HTML into catQuery()", function() {
    var test = c('<div>');
    expect(test instanceof catQuery).toBeTruthy();
  });

  it("works when typing raw HTML into catQuery.create()", function() {
    var test = c.create('<div>');
    expect(test instanceof catQuery).toBeTruthy();
  });

  it("works when typing a tag name into catQuery.create()", function() {
    var test = c.create('div');
    expect(test instanceof catQuery).toBeTruthy();
  });

});

describe("extending objects", function() {

  it("extends itself if only one argument is passed", function() {
    c.extend({
      poop: true
    });
    expect(c.poop).toBeTruthy();
  })

  var testObject = {};
  c.extend(testObject, { poop2: true });

  it("extends first object if multiple arguments are passed", function() {
    expect(testObject.poop2).toBeTruthy();
  });

  it("extends first object without modifying catQuery", function() {
    expect(c.poop2).toBeFalsy();
  });

});

describe("traversing", function() {

  it("can loop through an array", function() {
    var arr = ["hello", " world"];
    var test = "";
    catQuery.each(arr, function(i, item) {
      test += item;
    });
    expect(test).toEqual("hello world");
  });

  it("can loop through an object", function() {
    var obj = {
      hello: "world",
      lorem: "ipsum"
    };
    var test = 0;
    catQuery.each(obj, function(key, value) {
      test += key.length + value.length;
    });
    expect(test).toEqual(20);
  });

  it("can loop through a collection", function() {
    var counter = 0;
    catQuery('<div></div><div></div><div></div>').each(function(i, el) {
      counter++;
    });
    expect(counter).toEqual(3);
  });

  it("will return the same collection afterwards", function() {
    expect(catQuery('div').each(function() {}).each(function() {}) instanceof catQuery).toBeTruthy();
  });

});

describe("finding children of elements", function() {

  var test = catQuery('<ul><li></li><li></li></ul><ul><li></li><li></li></ul><ol><li></li><li></li></ol>');

  it("will find the children of all elements in the collection", function() {
    expect(test.find("li").length).toEqual(6);
  });

});

describe("working with attributes", function() {

  var testElement = c("<div/>");

  it("will set attributes properly", function() {
    testElement.attr("data-test","poop");
    expect(testElement.node.getAttribute("data-test")).toEqual("poop");
  });

  it("can set many attributes", function() {
    testElement.attr({
      class: "wow",
      id: "meep"
    });
    expect(testElement.node.getAttribute("class") === "wow" && testElement.node.getAttribute("id") === "meep").toBeTruthy();
  });

  it("will return the value if only name is specified", function() {
    expect(testElement.attr("id")).toEqual("meep");
  });

});

describe('modifying classes', function() {

  it("can add a class to elements", function() {
    var el = c('<div/>').addClass("test");
    expect(el.node.classList.contains("test")).toBeTruthy();
  });

  it("can remove a class", function() {
    var el = document.createElement('div');
    el.classList.add("poop");

    c(el).removeClass("poop");

    expect(el.classList.contains("poop")).toBeFalsy();
  });

  it("can see if a class exists in a collection", function() {
    var el = c('<div></div><div class="poop"></div><div></div>');
    expect(el.hasClass("poop")).toBeTruthy();
  });

});

describe('modifying the DOM', function() {

  it("can append elements", function() {
    var test = catQuery("<a><b></b></a>").append(catQuery("<c/>"));
    expect(test.node.innerHTML).toEqual("<b></b><c></c>");
  });

  it("can prepend elements", function() {
    var test = catQuery("<a><b></b></a>").prepend(catQuery("<c/>"));
    expect(test.node.innerHTML).toEqual("<c></c><b></b>");
  });

  it("can insert an element before", function() {
    var a = catQuery("<a/>"),
        b = catQuery("<b/>"),
        c = catQuery("<c/>");
    a.append(b);
    b.before(c);
    expect(a.node.innerHTML).toEqual("<c></c><b></b>");
  });

  it("can insert an element after", function() {
    var a = catQuery("<a/>"),
        b = catQuery("<b/>"),
        c = catQuery("<c/>");
    a.append(b);
    b.after(c);
    expect(a.node.innerHTML).toEqual("<b></b><c></c>");
  });

  it("can set text content of elements", function() {
    var elements = catQuery('<div></div><div></div>'), test = "";

    elements.text("Hello").each(function(i, el) {
      test += el.textContent;
    });

    expect(test).toEqual("HelloHello");
  })

});
