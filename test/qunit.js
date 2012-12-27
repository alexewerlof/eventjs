test( 'Basics', function () {
    var evt = new Eventjs( 'start', 'test', 'finish' );
    ok( evt, 'Returns an object' );
    ok( evt instanceof Eventjs, 'The returned object is an instance of Eventjs' );
    ok( evt.on, 'The new object has an on() method' );
    ok( evt.off, 'The new object has an off() method' );
    ok( evt.trigger, 'The new object has an trigger() method' );
});

test( 'Event registration, calling and removing', function () {
    expect( 1 );
    var evt = new Eventjs( 'start' );
    function onStart() {
        ok( true, 'event handler called');
    }
    evt.on( 'start', onStart );
    evt.trigger( 'start' );
    evt.off( 'start', onStart );
    evt.trigger( 'start' );
});

test( 'passing this parameter', function () {
    expect( 1 );
    var evt = new Eventjs( 'start', {
        f : function () {
            ok( true, 'Object is accessible' );
        }
    });
    evt.on( 'start', function () {
        this.f();
    });
    evt.trigger( 'start' );
});

test( 'passing parameters to trigger()', function () {
    var evt = new Eventjs( 'start' );
    evt.on( 'start', function ( a, b, c ) {
        deepEqual( a, 3, 'a OK' );
        deepEqual( b, "hello", 'b OK' );
        deepEqual( c, { t1:4, t2:"end"}, 'c OK' );
    });
    evt.trigger( 'start', 3, "hello", { t1:4, t2:"end"} );
});

test( 'attaching to an object', function () {
    expect( 4 );
    var obj = {
        f1: function () {
            ok( true, 'obj.f1() is called' );
        },
        f2: function () {
            ok( true, 'obj.f2() is called' );
        }
    }
    Eventjs( 'start', obj );
    obj.on( 'start', function () {
        ok( true, 'Event listener ran. Calling this.f1()' );
        this.f1();
    });
    obj.on( 'start', function () {
        ok( true, 'Event listener ran. Calling this.f2()' );
        this.f2();
    });
    obj.trigger( 'start' );
});

test( 'chaining', function () {
    function onStart () {
        ok( true, 'on start event called')
    }
    expect( 1 );
    var evt = new Eventjs( 'start' );
    evt.on( 'start', onStart ).trigger( 'start').off( 'start', onStart).trigger( 'start' );
});

test( 'no duplicate listener', function () {
    expect( 1 );
    function onStart () {
        ok( test, 'onStart called' );
    }
    var evt = new Eventjs( 'start' );
    evt.on( 'start', onStart );
    evt.on( 'start', onStart );
    evt.trigger( 'start' );
});

test( 'remove all listeners for an event name', function () {
    var evt = new Eventjs( 'roar', 'meow' );
    function listener1 () {
        ok( true, 'listener1');
    }
    function listener2 () {
        ok( true, 'listener2' );
    }
    function listener3 () {
        ok( true, 'listener3');
    }
    function listener4 () {
        ok( true, 'listener4' );
    }
    evt.on( 'roar', listener1, listener2, listener3 ).on( 'roar', listener4 );
    expect( 4 );
    evt.trigger( 'roar' );
    evt.off( 'roar' );
    evt.trigger( 'roar' );//none of them should be called
});

test( 'remove all listeners for every event name of the eventjs object', function () {
    var evt = new Eventjs( 'roar', 'meow' );
    function listener1 () {
        ok( true, 'listener1');
    }
    function listener2 () {
        ok( true, 'listener2' );
    }
    function listener3 () {
        ok( true, 'listener3');
    }
    function listener4 () {
        ok( true, 'listener4' );
    }
    evt.on( 'roar', listener1 ).on( 'roar', listener2 );
    evt.on( 'meow', listener3 ).on( 'roar', listener4 );
    expect( 4 );
    evt.trigger( 'roar' );
    evt.trigger( 'meow' );
    evt.off();
    evt.trigger( 'roar' );//none should be called
    evt.trigger( 'meow' );//none should be called
});