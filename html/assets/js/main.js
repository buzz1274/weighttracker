require(["config"], function () {
    "use strict"

    require(["bootstrap", "ember"],

        function ($, ember) {
            console.log($);
            console.log(ember);
        }
    );
});