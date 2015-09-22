# 🐱 catQuery

catQuery is a tiny library that makes working with HTML less painful. It's heavily inspired by jQuery, but focuses on being a wrapper for the modern but still convoluted DOM API:s. Therefore it should not be seen as a drop-in replacement for jQuery, as the API will probably work differently even though they may look alike.

It started out as a library that I made for one of my projects, [TodoCat](https://todoc.at), where I until now have only used the raw DOM API without any wrappers.

## 🚜 Getting started

For now simply download or link to the [CDN of the minified catQuery file](https://cdn.rawgit.com/Arood/catquery/catquery.min.js). I will look into adding it to package managers in the near future.

## 📖 Documentation

You can documentation on [the website](http://catquery.io/docs/) or in [the source](https://cdn.rawgit.com/Arood/catquery/master/catquery.min.js).

## 🔨 Contributing

catQuery and the website is built with a simple [gulp](http://gulpjs.com)-script. Install gulp if you haven't already, checkout this repo, do a `npm install` and start `gulp`. You can now start coding!

Tests are done with [Jasmine](http://jasmine.github.io), you'll find the specs in `tests/spec.js`. Docs are automatically generated with [docco](http://jashkenas.github.io/docco/). You can run your tests and check the docs in a local web server that will be running at port 8080.
