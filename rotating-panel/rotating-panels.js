/* Hero Panel */
(function () {

    var $rotatingPanel = (function(){return $("ul[data-plugin=rotating-panel]");}()),
        options = rotatingPanel.data("options"),
        panels = [],
        rotating = false,
        returnObj = {},
        intervalId;

    // Get rotating panels and store them in a private array
    $rotatingPanel.children("li").each(function (i) {
        panels.push($(this));
    });

    // Bind to the custom rotate event for the hero panel
    heropanel.bind("rotate", function (e, index, direction) {
        if (!direction) {
            returnObj.rotate(null, index, true);
        }
        else {
            returnObj.rotate(direction, -1, true);
        }
    });

    // Bind to the custom stop event for the hero panel
    heropanel.bind("stop", function (e) {
        StopTimer();
    });

    // If this results in more than one panel begin rotating and setup pager
    if (panels.length > 1) {

        // Private function to start the timer
        function StartTimer() {
            intervalId = setInterval(function(){returnObj.rotate("next");},5000)
            //$(document).everyTime("5s", "rotating-panel", function () { returnObj.rotate("next"); }, 0);
        };

        // Private function to stop the timer
        function StopTimer() {
            clearInterval(intervalId);
            //$(document).stopTime("rotating-panel");
        }

        StartTimer(); // Call StartTimer function
    }

    returnObj.currentIndex = 0;

    returnObj.rotate = function (direction, index, noFade) {
        if (!rotating && returnObj.currentIndex !== (index -1)) {
            rotating = true;
            StopTimer(); // During rotate stop the timer

            var oldIndex = this.currentIndex; // Store of the old index for refernce later

            // If moving back decrement else if forward increment
            if (direction && direction === "prev") {
                this.currentIndex--;

                if (this.currentIndex < 0) {
                    this.currentIndex = (panels.length - 1);
                }
            }
            else if (direction && direction === "next") {
                this.currentIndex++;

                if (this.currentIndex > (panels.length - 1)) {
                    this.currentIndex = 0;
                }
            }
            else if (index > 0) {
                this.currentIndex = (index - 1);
            }

            if (noFade) {
                panels[oldIndex].hide(0,
                    panels[returnObj.currentIndex].show(0,
                        function () {
                            StartTimer();
                            rotating = false;
                        })); // Fade new panel in and on completion begin timer again
            }
            else {
                panels[oldIndex].fadeOut(500,
                    function () {

                        if(options && options.pager.length > 0){
                            $(options.pager).trigger("paged",returnObj.currentIndex);
                        }

                        panels[returnObj.currentIndex].fadeIn(500,
                            function () {
                                StartTimer();
                                rotating = false;
                            }); // Fade new panel in and on completion begin timer again
                    }); // Fade old panel out
            }
        };

        return returnObj;

    }
} ());

/* Pager */
(function () {
    var pager = (function () { return $("ul[data-plugin=pager]").show(); } ()),
    options = pager.data("options"),
    prev = pager.find("a[data-action=prev]"),
    next = pager.find("a[data-action=next]");

    // Listener for when the element that's paging wants to inform the pager
    //pager.bind("paged",function(){ console.log("paged"); });

    // Setup a function that can trigger a pager event with the relevant params
    var dispatchPagerEvent = function (link) {
        // change to remove focus on href requirement
        var jLink = $(link);
        var direction = jLink.attr("data-action");

        $(options.paging).trigger("rotate", [-1, direction]);
    };

    // Setup a handler for previous
    prev.click(function (e) {
        dispatchPagerEvent(this);
        e.preventDefault();
    });

    // Setup a handler for next
    next.click(function (e) {
        dispatchPagerEvent(this);
        e.preventDefault();
    });

} ());