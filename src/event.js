/**
 * Creates an event manager object. This function can be called with or without "new" keyword.
 * If it is called with "new", the resulting object can be used stand alone or attached to another object.
 * If it is called without "new", the target object should be passed as a parameter.
 * Eventjs attaches three functions to its target:
 *   on(), off(), trigger()
 * The parameters can be string or object. Strings represent event names and object represents the object that is
 * applied to the event listeners as their 'this'
 * Duplicate event strings are allowed though it doesn't have any useful application!
 * Duplicate target objects is allowed too. The last one will be set as the target.
 * If no target object is specified, the listener functions will be called with their 'this' set to the current instance
 * of eventjs object.
 * @constructor
 */
function Eventjs ( /* list of at least event names and one optional target object (in any order) */ ) {
    "use strict";
    var events = {};
    var target = this;
    for ( var i = 0; i < arguments.length; i++ ) {
        var arg = arguments[ i ];
        switch ( typeof arg ) {
            case 'string':
                events[ arg ] = [ /*list of event listeners */];
                break;
            case 'object':
                target = arg;// 'this' for the listeners
                break;
            default:
                throw {
                    'name': 'Invalid parameter',
                    'message': 'Eventjs() only accepts string and object parameters'
                }
                break;
        }
    }

    if ( ( target === this ) && !( this instanceof Eventjs ) ) {
        throw {
            'name': 'Cannot attach the event object',
            'message': 'Eventjs is not called with "new" keyword and no parameter of type object is passed to it'
        }
    }

    //** if there is no such event, throw an exception
    function checkEventName ( eventName ) {
        "use strict";
        if ( typeof eventName !== 'string' || !events[ eventName ] ) {
            throw {
                'name': 'Invalid event name',
                'message': 'The event name does not exist in this event manager: ' + eventName
            }
        }
        return true;
    }

    //** registers an event listener
    target.on = function ( eventName/*, one or more listeners... */ ) {
        "use strict";
        checkEventName( eventName );
        //add every handler to the list of events for this particular event name
        for ( var i = 1 ; i < arguments.length ; i++ ) {
            var listener = arguments[ i ];
            //if this handler doesn't already exist in the list add it
            if ( events[ eventName ].indexOf( listener ) === -1 ) {
                events[ eventName ].push( listener );
            }
        }
        return this;
    };

    //** un-register a handler from an event name. if handler is missing, all handlers will be removed
    target.off = function ( eventName/*, one or more listeners... */ ) {
        "use strict";
        switch ( arguments.length ) {
            case 0: //no event name specified. remove all event listeners
                for ( var iEventName in events ) {
                    target.off( iEventName );
                }
                break;
            case 1: //only the event name specified. remove all event listeners for this particular event
                checkEventName( eventName );
                while ( true ) {
                    var listener = events[ eventName ][0];
                    if ( listener ) {
                        target.off( eventName, listener );
                    } else {
                        break;
                    }
                }
                break;
            default: //remove the specified event listeners for the specified event name
                checkEventName( eventName );
                //add every handler to the list of events for this particular event name
                for ( var i = 1 ; i < arguments.length ; i++ ) {
                    var listener = arguments[ i ];
                    //if this handler doesn't already exist in the list add it
                    var currHandlerIndex = events[ eventName ].indexOf( listener );
                    if ( currHandlerIndex !== -1 ) {
                        events[ eventName ].splice( currHandlerIndex, 1 );
                    }
                }
                break;
        }
        return this;
    };

    //** triggers a handler with a list of arguments. Any argument to the event handler can follow the eventName
    target.trigger = function ( eventName /*, optional list of arguments to be passed to event handler */ ) {
        "use strict";
        checkEventName( eventName );
        var argumentList = [];
        //add all the arguments after the first argument to this list (firs argument is the eventName)
        for ( var i = 1 ; i < arguments.length ; i++ ) {
            argumentList.push( arguments[ i ] );
        }
        var listeners = events[ eventName ];
        var errors = [];
        //now run the events that are explicityly registered with this event manager
        for ( var j = 0 ; j < listeners.length ; j++ ) {
            var lis = listeners[ j ];
            try {
                lis.apply( target, argumentList );
            } catch ( e ) {
                errors.push( e );
            }
        }
        if ( errors.length > 0 ) {
            throw "One or more event handlers couldn't run successfully: " + errors;
        }
        return this;
    };

    return target;
}