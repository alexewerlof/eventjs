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