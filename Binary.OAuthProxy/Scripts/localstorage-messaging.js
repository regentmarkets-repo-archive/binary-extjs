
(function() {

    // Potential improvements:
    //   * When window gets focus, check the local storage in case events are dropped

    // Function to call when a new state is recieved
    var reciever; // function(state)

    // Allocate a unique-ish window ID to this window
    var thisWindowId = (new Date()).getTime();

    // Last window and serial heard
    var lastWindowId, lastSerial = 0;

    // Test localStorage & JSON are available
    var featuresAvailable;
    try {
        if(('localStorage' in window) && (window.localStorage) !== null && ('JSON' in window)) {
            featuresAvailable = true;
        }
    } catch(e) { }

    // Helper for listening
    var setEventHandler = function(name, listener) {
        if(window.addEventListener) {
            window.addEventListener(name, listener, false);
        } else {
            window.attachEvent('on'+name, listener);
        }
    };

    // Listen for changes
    if(featuresAvailable) {
        setEventHandler("storage", function(e) {
            // Check it's the right key and there is a value
            if(e.key !== '$messaging' || !(e.newValue)) { return; }
            var msg = JSON.parse(e.newValue);
            // Don't repeat messages, or do anything with our own broadcasts
            if((msg.window !== lastWindowId) || (msg.serial !== lastSerial)) {
                lastWindowId = msg.window;
                lastSerial = msg.serial;
                if(reciever) {
                    reciever(msg.state);
                }
            }
        });
    }

    // Broadcast a new state to all other windows
    var broadcastState = function(state) {
        if(!featuresAvailable) { return; }
        var msg = {
            window: (lastWindowId = thisWindowId),
            serial: (++lastSerial),
            state: state
        };
        // Use JSON stringify because the spec says only strings are supported, even if it will take anything
        window.localStorage.setItem("$messaging", JSON.stringify(msg));
    };

    // Get the current state from the localStorage
    var getState = function() {
        if(!featuresAvailable) { return undefined; }
        var state;
        var lastMsg = window.localStorage.getItem('$messaging');
        if(lastMsg) {
            var msg = JSON.parse(lastMsg);
            lastWindowId = msg.window;
            lastSerial = msg.serial;
            state = msg.state;
        }
        return state;
    };

    // -------------------------------------------------------------------------------
    // Demo code

    if(!featuresAvailable) {
        alert("Your browser doesn't support everything needed for this demo.");
    }

    var showState = function(state, setBy, updateInput) {
        document.getElementById('globalState').innerHTML = state || '&nbsp';
        document.getElementById('setBy').innerHTML = setBy;
        if(updateInput) {
            document.getElementById('localState').value = state;
        }
    };

    reciever = function(state) {
        showState(state, 'broadcast change from other window', true);
    };

    setEventHandler("keyup", function() {
        var newState = document.getElementById('localState').value;
        if(currentState !== newState) {
            broadcastState(newState);
            showState(newState, 'local change to input element', false);
            currentState = newState;
        }
    });

    var currentState = getState();
    if(currentState) {
        showState(currentState, "initial state from localStorage", true);
    }

})();
