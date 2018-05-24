////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
    // UI Scripts - general functions not related to core app
    // WEBAPP Scripts
        // global variables
        // FUNCTIONS
            // Take Screenshot Test
            // Get Test Results
            // Parse Results for Test Variables
            // Parse Results for Individual Result Variables
            // Pass Results to Google Sheets
            // Create New Google Sheet
            // Handle Clicks
            // Handle Google Sign In
////////////////////////////////////////////////////////////////

// UI Scripts

// TABS : SIDE PANEL CLOSE
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
    $(".close").on("click", function () {
        $(".side-panel").animate({ "width": "toggle" });
    });
    $('iframe').each(function () {
        this.contentWindow.location.reload(true);
    });
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var compare = function() {
    var url = $("input[name=compare_url]").val(),
        imgSrc = $("input[name=drive_id]").val();
    localStorage.setItem("image_source", imgSrc);
    window.open("compare.html?url=" + url);
};

 
// WEBAPP Scripts

// GLOBAL VARIABLES
var username = "social@lyntonweb.com", //email address for your account
    password = "u0856709d93976a5", //authkey for your account
    test = null,
    newSpreadsheetId = null,
    newSpreadsheetUrl = null,
    getDataClicked = false;

// TAKE STANDARD SCREENSHOT TEST
var ScreenshotTestApi = function(username, password) {
    this.baseUrl = "https://" + username + ":" + password + "@crossbrowsertesting.com/api/v3/screenshots";
    this.basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    this.currentTest = null;
    this.allBrowsers = [];
    this.callApi = function (url, method, params, callback) {
        var self = this;
        $.ajax({
            type: method,
            url: url,
            data: params,
            dataType: "json",
            async: false,
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader('Authorization', "Basic " + self.basicAuth);
            },
            success: function (data) {
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                throw "Failed: " + textStatus
            }
        });
    };
    this.startNewTest = function (params, callback) {
        var self = this;
        self.callApi(this.baseUrl, "POST", params, function (data) {
            self.log('new test started successfully', data)
            self.currentTest = data;
            $("#results").append("<div>Success! Test completed</div>");
            callback();
        });
    };
    this.getTestId = function () {
        return this.currentTest.screenshot_test_id;
    };
    this.log = function (text) {
        if (window.console) console.log(text);
    };
};

var runNewTest = function() {
    $(".side-panel").animate({ "width": "toggle" });
    $("#results").html("<p>Running Screenshot Test on " + $("input[name=url]").val() + "</p>");
    var screenshot = new ScreenshotTestApi(username, password),
        resultsQuery = "?type=fullpage&size=small",
        params = {
            url: $("input[name=url]").val(),
            browser_list_name: "lw_custom"
        };
    screenshot.startNewTest(params, function () {
        $("#results").append("<p>New Test ID: <strong><span id='test_id'>" + screenshot.getTestId() + "</p><strong>");
        $("#results").append("<br><br><p><a class='button button--delta' href='https://app.crossbrowsertesting.com/screenshots/" + screenshot.getTestId() + resultsQuery + "' target='_blank'>View Test on CBT</a></p>");
        $("#results").append("<br><br><button class='button' type='button' onclick='location.href=location.href'>Start Over</button>");
    });
};

// GET RAW SCREENSHOT TEST RESULTS AND START DOCS
var getResults = function () {
    var ssBaseUrl = "https://crossbrowsertesting.com/api/v3/screenshots/";
    var username = "social@lyntonweb.com";
    var password = "u0856709d93976a5";
    var basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    var testData = null;
    var test_id = $("input[name=test_id]").val(),
        version_id = $("input[name=version_id]").val(),
        loader = $(".loader"),
        loader_wrap = $(".loader__wrapper");

    var xhr = new XMLHttpRequest();
    if (version_id != null) {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id + "/" + version_id, true);
    } else {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id, true);
    }
    xhr.setRequestHeader('Authorization', "Basic " + basicAuth);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
            console.log("reqest initiated");
        } else if (xhr.readyState == 2) {
            $(".side-panel").animate({ "width": "toggle" });
            $("#results").html("<h4>Getting test data from CrossBrowserTesting.com</h4>");
            loader.addClass("show-loader");
            loader.addClass("animate-loader");
        } else if (xhr.readyState == 3) {
            $("#results").append("<p>Processing...</p>");
        } else if (xhr.readyState == 4) {
            $("#results").append("<p>Success! Data is now ready for transfer to Sheets</p><br>");
            var test = JSON.parse(xhr.responseText);
            buildDoc(test);
        } else {
            console.log("Something went wrong");
        }
    };
};

// GET RAW SCREENSHOT TEST RESULTS AND START DOCS
var getImageResults = function () {
    var ssBaseUrl = "https://crossbrowsertesting.com/api/v3/screenshots/";
    var username = "social@lyntonweb.com";
    var password = "u0856709d93976a5";
    var basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    var testData = null;
    var test_id = $("input[name=test_id]").val();

    var xhr = new XMLHttpRequest();
    if (version_id != null) {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id + "/" + version_id, true);
    } else {
        xhr.open("GET", "https://crossbrowsertesting.com/api/v3/screenshots/" + test_id, true);
    }
    xhr.setRequestHeader('Authorization', "Basic " + basicAuth);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
            console.log("reqest initiated");
        } else if (xhr.readyState == 2) {
            $(".side-panel").animate({ "width": "toggle" });
            $("#results").html("<h4>Getting test data from CrossBrowserTesting.com</h4>");
            loader.addClass("show-loader");
            loader.addClass("animate-loader");
        } else if (xhr.readyState == 3) {
            $("#results").append("<p>Processing...</p>");
        } else if (xhr.readyState == 4) {
            $("#results").append("<p>Success! Now let's get an image!</p><br>");
            var test = JSON.parse(xhr.responseText);
            getSSImage(test);
        } else {
            console.log("Something went wrong");
        }
    };
};

// PARSE SCREENSHOT TEST RESULTS -- GET SINGLE SS IMAGE
var getSSImage = function (test) {
    var storeImage = function () {
        $.each(test.versions[0].results, function (key, value) {
            if (key == 8) {
                var screenshot_image = value.images.chromeless;
                localStorage.setItem("image", screenshot_image);
                $("#results").append("<p>Got your image! Let's compare!</p><br>");
                window.open("/qaapp/compare.html?url=" + $("input[name=compUrl]").val());
            }
        });
    };
    storeImage();
};

// PARSE SCREENSHOT TEST RESULTS -- GET TEST VARIABLES
var parseResultsOne = function (test) {
    var count = test.version_count,
        id = test.screenshot_test_id,
        date = test.created_date,
        url = test.url,
        result_count = test.versions[0].result_count.successful,
        result_total = test.versions[0].result_count.total,
        version_id = test.versions[0].version_id,
        show_url = test.versions[0].show_results_web_url,
        tags = test.versions[0].tags;

    var results = $.makeArray(test.versions[0].results);
    var testArray = {
        url,
        show_url,
        date,
        count,
        version_id
    };
    return testArray;
}

// PARSE SCREENSHOT TEST RESULTS -- GET RESULTS VARIABLES
var parseResultsTwo = function (test, spreadsheetId) {
    var allResults = function () {
        var results = test.versions[0].results;
        var total_results = results.length;
        $.each(test.versions[0].results, function (key, value) {
            populateResults(spreadsheetId, value.result_id, value.os.name, value.browser.name, value.resolution.name, value.tags, value.show_result_web_url, value.launch_live_test_url);
            if (key == 8) {
                var screenshot_image = value.images.chromeless;
                localStorage.setItem("image", screenshot_image);
            }
            if (key == (total_results - 1)) {
                $("#results").append("<p>Populating data from " + $("input[name=page-slug]").val() + " Test...</p>");
            }
        });
    };
    allResults();
};

// PASS RESULTS TO GOOGLE SHEET
var populateResults = function (spreadsheetId, result_id, result_os, result_browser, result_resolution, result_tags, result_url, live_url) {
    var params = {
        spreadsheetId: spreadsheetId,
        valueInputOption: 'USER_ENTERED',
        responseValueRenderOption: "FORMULA",
        insertDataOption: "INSERT_ROWS",
        range: "10:500"
    };
    var valueRangeBody = {
        "majorDimension": "COLUMNS",
        "range": "10:500",
        "values": [
            [
                "=HYPERLINK(\"" + result_url + "\", \"" + result_id + "\")"
            ],
            [
                "=T(\"" + result_os + "\")"
            ],
            [
                "=T(\"" + result_browser + "\")"
            ],
            [
                "=T(\"" + result_resolution + "\")"
            ],
            [
                "=T(\"" + result_tags + "\")"
            ],
            [
                "=HYPERLINK(\"" + live_url + "\", \"Start Live Test\" )"
            ]
        ]
    };
    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function (response) {
       console.log("results passed successfully")
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};

// CREATE SPREADSHEET AND POPULATE WITH TEST VARIABLES
var buildDoc = function (test) {
    var page_slug = $("input[name=page-slug]").val(),
        client_slug = $("input[name=client-slug]").val();

    var createSheet = function (title) {
        var spreadsheetBody = {
            properties: {
                "title": title
            },
            sheets: {
                properties: {
                    "title": page_slug
                }/*,
                conditionalFormats: {
                    "booleanRule": {
                        "condition": {
                            "type": "NOT_BLANK"
                        },
                        "format": {
                            "padding": {
                                "bottom": 10,
                                "left": 20,
                                "right": 20,
                                "top": 10
                            },
                            "textFormat": {
                                "bold": true,
                                "fontSize": 20
                            }
                        }
                    },
                    "ranges": [
                        {
                            "endColumnIndex": 1,
                            "endRowIndex": 1,
                            "startColumnIndex": 1,
                            "startRowIndex": 1,
                            "sheetId": firstSheetId
                        }
                    ]
                }*/
            }
        };
        var createRequest = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        createRequest.then(function (response) {
            newSpreadsheetUrl = response.result.spreadsheetUrl;
            $("#results").append("<h4>New Sheet Created for " + client_slug + "</h4>");
            newSpreadsheetId = response.result.spreadsheetId;
            var sheetVars = parseResultsOne(test);
            populateNewSheet(newSpreadsheetId, page_slug, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
            parseResultsTwo(test, newSpreadsheetId);
            $("#results").append("<strong>Your documentation is ready!</strong>");
            $("#results").append("<br><a href='" + newSpreadsheetUrl + "' target='_blank' class='button'>View Spreadsheet</a>");
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    };

    var populateNewSheet = function (spreadsheetId, page_slug, url, show_url, date, count, version_id) {
        var params = {
            spreadsheetId: spreadsheetId
        };
        var formattedDate = date.split("T")[0];
        var batchUpdateValuesRequestBody = {
            valueInputOption: 'USER_ENTERED',
            responseValueRenderOption: "FORMULA",
            data: [
                {
                    "majorDimension": "ROWS",
                    "range": "A1:A6",
                    "values": [
                        [
                            "=T(\"" + page_slug + "\")"
                        ],
                        [
                            "=HYPERLINK(\"" + url + "\", \"View Test\")"
                        ],
                        [
                            "=DATEVALUE(\"" + formattedDate + "\")"
                        ],
                        [
                            "=T(\"" + count + "\")"
                        ],
                        [
                            "=T(\"" + version_id + "\")"
                        ],
                        [
                            "=T(\"" + "pass_percentage" + "\")"
                        ]
                    ]
                },
                {
                    "majorDimension": "COLUMNS",
                    "range": "A9:E",
                    "values": [
                        [
                            "Result"
                        ],
                        [
                            "OS"
                        ],
                        [
                            "Browser"
                        ],
                        [
                            "Resolution"
                        ],
                        [
                            "Tags"
                        ]
                    ]
                }
            ]
        };
        var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
        request.then(function (response) {
            $("#results").append("<p>Data successfully populated!</p><br>");
            $(".loader").removeClass("animate-loader");
            $(".loader").removeClass("show-loader");
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    };

    createSheet(client_slug + " QA Documentation", page_slug);
};

// START DOCUMENTATION CLICK HANDLER
var startDoc = function () {
    getResults();
};

// GOOGLE API HANDLER
function initClient() {
    var API_KEY = 'AIzaSyA09kGmIzbCL37IQt5fGIP1NFwESZH99SE';
    var CLIENT_ID = '407152186767-6qr0jchv3iop1vc14agbmm5t1qa3fgtc.apps.googleusercontent.com';
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn && getDataClicked) {
        handleData();
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}