Introduction
------------
Eventjs is a library for creating event-handling mechanism in Javascript. Features:
 * Lihgtweight: uses minimal memory and CPU.
 * User friendly: simple and intuitive calls. e.g. trigger() gets a variable list of arguments to pass to handlers
 * Small: there are only 3 methods. The minimized code is less than 2KB
 * Flexible: can be used as a standalone object or attach its functionality to another object
 * Chainable: the calls are chainable, multiple handlers can be passed at once
 * Safe: "use strict", checked JSLint
 * Chainability

Making an event handler
-----------------------
You can attach the event handler to another object or create it independently. In order to attach it to an object, call
it on the object with a list of event names:

```Javascript
var obj = {};
Eventjs( obj, 'cook', 'ready', 'burn' );
//now obj has these methods:
obj.on();
obj.off();
obj.trigger();
```
An event handler can be created independent too:

```Javascript
var obj = {};
var obj.eventHandler = new Eventjs( 'cook', 'ready', 'burn' );
//now obj.eventHandler has these methods:
obj.eventHandler.on();
obj.eventHandler.off();
obj.eventHandler.trigger();
```

Registering and triggering events
---------------------------------
The `on()` function registers an event listener and `trigger()` runs them:

```Javascript
var evt = new Eventjs( 'start' );
evt.on( 'start', function () {
    alert( 'The start event happened' );
});
evt.trigger( 'start' );//shows the above alert dialogue
```

The `on()` function is quite flexible. You can register multiple event listeners:

```Javascript
function eventListener1 () {
    console.log( "Listener 1" );
}
function eventListener2 () {
    console.log( "Listener 2" );
}
function eventListener3 () {
    console.log( "Listener 3" );
}
function eventListener4 () {
    console.log( "Listener 4" );
}

var evt = new Eventjs( 'start', 'stop' );
evt.on( 'start', eventListener1, eventListener2 );
evt.on( 'start', eventListener3).on( 'stop', eventListener4 );

evt.trigger( 'start' );//writes Listener 1, Listener 2 and Listener 3 in the console window
evt.trigger( 'stop' );//writes Listener 4
```

Removing event listeners
------------------------
The `off()` function removes listeners with a flexible syntax. First of all, let's remove a couple of event handlers:

```Javascript
evt.off( 'start', eventListener1, eventListener2 ); //removes eventListener1, eventListener2 from event named 'start'
```
If you want to remove all event listeners associated with a particular name, call `off()` like this:

```Javascript
evt.off( 'start' );//removes all the event listeners associated with the event named 'start'
```

If you want to remove all event listeners from all event names do (it can be a dangerous call):

```Javascript
evt.off();//there will be no function assigned to any event of this event handler
```

Tests
-----
[QUnit][1] tests are available [online][2].

[1]: http://www.qunit.com
[2]: http://htmlpreview.github.com/?https://github.com/hanifbbz/eventjs/blob/master/test/qunit.html