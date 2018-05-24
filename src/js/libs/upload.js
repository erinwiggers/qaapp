/*
 * singleuploadimage - jQuery plugin for upload a image, simple and elegant.
 * 
 * Copyright (c) 2014 Langwan Luo
 *
 * Licensed under the MIT license
 *
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *     https://github.com/langwan/jquery.singleuploadimage.js
 *
 * version: 1.0.3
 */

(function ($) {

    $.fn.singleupload = function (options) {

        var $this = this;
        var inputfile = null;

        var settings = $.extend({
            action: '#',
            onSuccess: function (url, data) { },
            onError: function (code) { },
            OnProgress: function (loaded, total) {
                var percent = Math.round(loaded * 100 / total);
                $this.html(percent + '%');
            },
            name: 'img'
        }, options);

        $('#' + settings.inputId).bind('change', function () {
            $this.css('backgroundImage', 'none');
            var fd = new FormData();
            fd.append($('#' + settings.inputId).attr('name'), $('#' + settings.inputId).get(0).files[0]);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", settings.action, true);
            xhr.send(fd);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 1) {
                    console.log("reqest initiated");
                } else if (xhr.readyState == 2) {
                    $(".side-panel").animate({ "width": "toggle" });
                    $("#results").html("<h4>Uploading Image/h4>");
                    loader.addClass("show-loader");
                    loader.addClass("animate-loader");
                } else if (xhr.readyState == 3) {
                    $("#results").append("<p>Processing...</p>");
                } else if (xhr.readyState == 4) {
                    $("#results").append("<p>Success! Image Uploaded</p><br>");
                    var results = JSON.parse(xhr.responseText);
                    return results;
                    console.log(results);
                } else {
                    console.log("Something went wrong");
                }
            };

        });

        return this;
    }


}(jQuery));
