$.fn.tabify = function (options) {
    "use strict";
    if (this.length > 0) {
        var defaults = {
                tab:                ".tabbed-section__navigation a",
                body:               ".tabbed-section__body",
                tab_active:         "current-tab",
                body_active:        "tabbed-section__body--active",
                init_class:         "tabbed-section--active",
                first_tab:          false,
                equalize_height:    false,
                on_change:          function () { return null; }
            },
            wrapper =       this,
            settings =      $.extend({}, defaults, options),
            tabs =          wrapper.find(settings.tab),
            tab_bodies =    wrapper.find(settings.body),
            find_body = function (tab) {
                var selector = tab.attr("href") || tab.data("target") || tab.find("a").attr("href"),
                    body = $(selector);

                if (body.length === 1) {
                    return body;
                }
                console.log("Invalid tab body. Your selector was " + selector);
                return false;
            },
            find_tab = function (body) {
                var id = body.attr("id");
                return tabs.filter(function () {
                    if ($(this).is("[href=#" + id + "], [data-target=#" + id + "]") || $(this).find("a").is("[href=#" + id + "]")) {
                        return true;
                    }
                    return false;
                });
            },
            change_tab = function (new_tab, push) {
                var new_body = find_body(new_tab);
                if (push === undefined) {
                    push = true;
                }
                if (new_body !== false) {
                    tabs.removeClass(settings.tab_active);
                    tab_bodies.removeClass(settings.body_active);
                    new_tab.addClass(settings.tab_active);
                    new_body.addClass(settings.body_active);

                    if (push && history.pushState) {
                        history.pushState(null, null, "#" + new_body.attr("id"));
                    }

                    settings.on_change(new_tab, new_body);
                }
            },
            initial_tab = function () {
                var hash_target_tab = tab_bodies.filter(location.hash),
                    hash_target_tab_body = tab_bodies.find(location.hash).closest(settings.body);
                if (location.hash && hash_target_tab.length > 0) {
                    return find_tab(hash_target_tab);
                }
                if (location.hash && hash_target_tab_body.length > 0) {
                    return find_tab(hash_target_tab_body);
                }
                if (settings.first_tab) {
                    return settings.first_tab;
                }
                return tabs.first();
            };

        if (tab_bodies.length > 1) {
            wrapper.addClass(settings.init_class);
            change_tab(initial_tab(), false);

            if (settings.equalize_height) {
                tab_bodies.equal_height();
            }

            tabs
                .click(function (e) {
                    e.preventDefault();
                    change_tab($(this), true);
                })
                .add(tabs.find("a"))
                .data("no_scroll", true);

            tab_bodies
                .each(function () {
                    var body = $(this),
                        anchors = $("a[href*=#" + body.attr("id") + "]").not(tabs);

                    anchors
                        .data("no_scroll", true)
                        .click(function (e) {
                            e.preventDefault();
                            change_tab(find_tab(body), true);
                        });
                });
        } else if (tab_bodies.length === 1) {
            tabs.closest(".widget-span").hide();
        } else {
            $(this).addClass("tabbed-section--empty");
        }
    }
    return this;
};
