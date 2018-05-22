// UI Scripts
    // TABS
    
    $(document).ready(function () {
        $("div.tab-content").not("[data-tab=1]").addClass("hide"),
            $(".tabs-nav li").first().addClass("active"),
            $(".tabs-nav li").on("click", function () {
                $(this).addClass("active"),
                    $(".tabs-nav li").not(this).removeClass("active");
                var a = $(this).attr("data-tab");
                $("div[data-tab = " + a + "]").removeClass("hide"),
                    $("div.tab-content").not("[data-tab=" + a + "]").addClass("hide")
            }),
            $("li[data-tab=all]").on("click", function () {
                $(this).addClass("active"),
                    $("div.tab-content").removeClass("hide")
            });
        $(".side-panel__trigger").on("click", function () {
            $(this).toggleClass("active");
            $(".side-panel").animate({ "width": "toggle" });
        });
    });
   