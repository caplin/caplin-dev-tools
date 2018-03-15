karma-jstd-adapter
==================

This is an adapter for the [Karma Test Runner](http://karma-runner.github.io/) for [Js-Test-Driver](https://code.google.com/p/js-test-driver/).

Basically that means that if you use this, you should be able to use Karma instead of Js-Test-Driver,
with out making any changes to your tests. It's possible I broke some things though.

[Another adapter exists](https://github.com/vojtajina/karma-jstd), but it takes a much different
approach than this adapter does, by adding a layer on top of [Jasmine](http://pivotal.github.io/jasmine/)
to simulate the features of Js-Test-Driver. Because of this, it is not yet feature-complete (for example,
while I was still using it, I had to write my own queue for AsyncTestCase.)

This adapter instead does a wholesale import of the JavaScript portions of Js-Test-Driver, and uses
that to provide the hooks into Karma. This provides the advantage of having most/all of Js-Test-Driver's
functionality, without the cost of having to write a layer on top of Jasmine or anything else. On the other hand,
Js-Test-Driver is a complex beast, and I'm certain there's a lot of code we're pulling over from Js-Test-Driver
that is never going to be run, but I don't have the time to figure out what parts we need, and what parts
we don't.

What Works
----------

As far as I can tell, everything works. The only thing that probably doesn't work is Js-Test-Driver's
[HtmlDoc feature](https://code.google.com/p/js-test-driver/wiki/HtmlDoc), I believe that was implemented in
Java, and thus wasn't pulled over into this adapter. I don't use that feature, so I can't confirm
whether it works or not. Hopefully it wouldn't be too implement that functionality if anyone needs it.

Installing
----------

Basically all you need is `jstd-adapter.js`, so you can either download it from GitHub, or
you can use `npm install karma-jstd-adapter`. In either case, add `jstd-adapter.js` to the list
of files Karma will load, and you'll be set to go.

Building
--------

"Building?" you ask, "What do you mean building?"

If you were looking at the files in this project, you may have noticed `inserter.js` and `jstd-adapter-template.js`.
`jstd-adapter-template.js` contains the code that interfaces with Karma, but needs the Js-Test-Driver
code to operate. `inserter.js` reads in the Js-Test-Driver code, does a few manipulations, and then
inserts it into the text of `jstd-adapter-template.js` and produces `jstd-adapter.js`.

If you wanted to produce the `jstd-adapter.js` file yourself for whatever reason (say a new version
of Js-Test-Driver comes out.), you'll need to do two things:

1. [Download the Js-Test-Driver jar file](https://code.google.com/p/js-test-driver/downloads/list).
2. Unzip it somewhere.
3. Run `node inserter.js C:\path\to\Js-Test-Driver\com\google\jstestdriver\javascript\`

And you'll be good to go!

Found a bug? Want to Contribute?
--------------------------------

Feel free to fork the project, create a pull request, or file an issue in the bug tracker on GitHub.

License
-------

Obviously this project is based on Js-Test-Driver, which is distributed under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0).

Portions of Js-Test-Driver are also distributed under the MIT license.

This project was also based partially on the [Tyrtle Adapter for Karma](https://github.com/karma-runner/karma-tyrtle), which doesn't
appear to have a license, but I figured I should mention it.

This project itself is licensed under the MIT license:

Copyright (c) 2013-2014 Tyler Church

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