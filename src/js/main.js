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

var clearStorage = function() {
    console.log(store.get("created"));
    store.clearAll();
    console.log("cleared");
    console.log(store.get("created"));
}

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
    resultsSheetId = null,
    newSpreadsheetUrl = null,
    firstSheetId = null,
    getDataClicked = false;

// CALL STANDARD SCREENSHOT TEST API
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

// RUN NEW SCREENSHOT TEST
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

// GET RAW SCREENSHOT TEST RESULTS AND CHECK STORED CLIENTS
var getResults = function () {
    var ssBaseUrl = "https://crossbrowsertesting.com/api/v3/screenshots/";
    var username = "social@lyntonweb.com";
    var password = "u0856709d93976a5";
    var basicAuth = btoa(unescape(encodeURIComponent(username + ":" + password)));
    var testData = null;
    var test_id = $("input[name=test_id]").val(),
        version_id = $("input[name=version_id]").val(),
        client_slug = $("input[name=client-slug]").val(),
        page_slug = $("input[name=page-slug]").val(),
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

// LOOP STORED CLIENTS AND CREATE EITHER ADD TO OR CREATE A NEW SHEET OR DOC
/*
var loopCreatedDocs = function (client_slug, page_slug, test) {
    var spreadsheet = store.get("sheets");
    if (spreadsheet == "undefined") {
        store.each(function(key, values) {
            var client = key.created_test[0].slug,
                page = key.created_test[0].page;
            if (client_slug == client) {
                var sheetVars = parseResultsOne(test);
                addNewDocSheet(spreadsheet, page, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
            } else if (client_slug == client && page_slug == page) {
                var client_spreadsheet = store.get(client_slug)
                parseResultsTwo(test, client_spreadsheet);
            } 
        });
    }
    else {
        buildDoc(test);
    }
};
*/

// ADD NEW SHEET TO CREATED DOC
var addNewDocSheet = function (spreadsheetId, page_slug, url, show_url, date, count, version_id) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var formattedDate = date.split("T")[0];
    var batchUpdateValuesRequestBody = {
        valueInputOption: 'USER_ENTERED',
        responseValueRenderOption: "FORMULA",
        sheet: {
            properties: {
                "title": page_slug
            }
        },
        data: [
            {
                "majorDimension": "ROWS",
                "range": "A1:A6",
                "values": [
                    [
                        "=HYPERLINK(\"" + url + "\", \"" + page_slug + "\")"
                    ],
                    [
                        "=HYPERLINK(\"" + show_url + "\", \"View Test\")"
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
var parseResultsTwo = function (test, spreadsheetId, sheetId, page_slug) {
    var allResults = function () {
        var results = test.versions[0].results;
        var abbrResults = test.versions[0].results.slice(0,10);
        var total_results = results.length;
        var resolution_slug = null;
        $.each(results, function (key, value) {
            var evalResolution = function () {
                var resolution = value.resolution.name;
                var screenWidth = resolution.split("x")[0];
                if (screenWidth > 1919) {
                    resolution_slug = "large desktop";
                } else if (screenWidth > 1365) {
                    resolution_slug = "desktop";
                } else if (screenWidth > 767) {
                    resolution_slug = "tablet";
                } else {
                    resolution_slug = "mobile";
                }
            };
            evalResolution();
            setTimeout(populateResults(spreadsheetId, value.result_id, value.os.name, value.browser.name, value.resolution.name, resolution_slug, value.tags, value.show_result_web_url, value.launch_live_test_url), 5000);
            if (key === (total_results - 1)) {
                $("#results").append("<p>Populating data from " + $("input[name=page-slug]").val() + " Test...</p>");
            }
        });
    };
    allResults();
    $("#results").append("<strong>Your documentation is ready!</strong>");
    $("#results").append("<br><a href='" + newSpreadsheetUrl + "' target='_blank' class='button'>View Spreadsheet</a>");
    $(".loader").removeClass("animate-loader");
    $(".loader").removeClass("show-loader");
};

// FORMAT SHEET
var formatSheet = function (spreadsheetId, sheetId) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var headerRange = {
        "sheetId": sheetId,
        "startRowIndex": 1,
        "endColumnIndex": 10,
        "endRowIndex": 2,
        "startColumnIndex": 0
    };
    var resultsRange = {
        "sheetId": sheetId,
        "startRowIndex": 9,
        "endColumnIndex": 10,
        "endRowIndex": 500,
        "startColumnIndex": 0
    };
    var requests = [{
            "addConditionalFormatRule": {
                "rule": {
                    "booleanRule": {
                        "condition": {
                            "type": "NOT_BLANK"
                        },
                        "format": {
                            "backgroundColor": {
                                "alpha": 0.8,
                                "blue": 0.871,
                                "green": 0.871,
                                "red": 0.871
                            },
                            "textFormat": {
                                "bold": true
                            }
                        }
                    },
                    "ranges": [ headerRange ]
                }
            }
        },
        {
        "addConditionalFormatRule": {
            "rule": {
                "booleanRule": {
                    "condition": {
                        "type": "TEXT_CONTAINS",
                        "values": {
                            "userEnteredValue": "pass"
                        }
                    },
                    "format": {
                        "backgroundColor": {
                            "alpha": .3,
                            "blue": 0.498,
                            "green": 0.718,
                            "red": 0.494
                        },
                        "textFormat": {
                            "bold": true
                        }
                    }
                },
                "ranges": [ resultsRange ]
            }
        }
    }];
    var body = {
        requests
    };
    var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
    request.then(function (response) {
        var result = response.result;
        console.log(`${result.replies.length} cells updated.`);
        $("#results").append("<p>Data successfully formatted!</p><br>");
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};

// CREATE NAMED RANGE IN SHEET
var nameRange = function (spreadsheetId, sheetId) {
    var params = {
        spreadsheetId: spreadsheetId
    };
    var requests = [{
        "addNamedRange": {
            "namedRange": {
                "name": "Results",
                "range": {
                    "sheetId": sheetId,
                    "startRowIndex": 8,
                    "endRowIndex": 500,
                    "startColumnIndex": 0,
                    "endColumnIndex": 10,
                },
            }
        }
    }];
    var body = {
        requests
    };
    var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
    request.then(function (response) {
        var result = response.result;
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
};


// PASS RESULTS TO GOOGLE SHEET
var populateResults = function (spreadsheetId, result_id, result_os, result_browser, result_resolution, resolution_slug, result_tags, result_url, live_url) {
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
                "=T(\"" + resolution_slug + "\")"
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
            sheets: [
                {
                    properties: {
                        "title": page_slug
                    }
                },
                {
                    properties: {
                        "title": "results"
                    }
                }
            ]
        };
        var createRequest = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        createRequest.then(function (response) {
            newSpreadsheetUrl = response.result.spreadsheetUrl;
            var firstSheetObj = response.result.sheets[0];
            var resultsSheetObj = response.result.sheets[1];
            var firstSheetId = firstSheetObj.properties.sheetId;
            var resultsSheetId = resultsSheetObj.properties.sheetId;
            $("#results").append("<h4>New Sheet Created for " + client_slug + "</h4>");
            newSpreadsheetId = response.result.spreadsheetId;
            var sheetVars = parseResultsOne(test);
            store.set("created", {
                "created_test": [
                    {
                        "slug": client_slug,
                        "page": page_slug
                    }
                ]
            });
            store.set("sheets", {
                client_slug: [
                    {
                        "sheet": newSpreadsheetId
                    }
                ]
            });
            nameRange(newSpreadsheetId, firstSheetId);
            populateNewSheet(newSpreadsheetId, page_slug, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
            setTimeout(parseResultsTwo(test, newSpreadsheetId, firstSheetId), 5000);
            formatSheet(newSpreadsheetId, resultsSheetId);
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
                    "range": page_slug + "!A1:A6",
                    "values": [
                        [
                            "=HYPERLINK(\"" + url + "\", \"" + page_slug + "\")"
                        ],
                        [
                            "=HYPERLINK(\"" + show_url + "\", \"View Test\")"
                        ],
                        [
                            "=T(\"Date: " + formattedDate + "\")"
                        ],
                        [
                            "=T(\"Version #: " + count + "\")"
                        ],
                        [
                            "=T(\"Version ID: " + version_id + "\")"
                        ]
                    ]
                },
                {
                    "majorDimension": "COLUMNS",
                    "range": "results!A2:I",
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
                            "Device"
                        ],
                        [
                            "Tags"
                        ],
                        [
                            "Live Tests"
                        ],
                        [
                            "Status"
                        ],
                        [
                            "Notes"
                        ]
                    ]
                },
                {
                    "majorDimension": "ROWS",
                    "range": "results!A1:3",
                    "values": [
                        [
                            "Results"
                        ],
                        [
                            " "
                        ],
                        [
                            "=SORT(Results , 6, true, 5, true, 3, true)"
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

$('#kanban').kanban({
    titles: ['Task', 'Estimate', 'Complete', 'Invoiced', 'Paid'],
    colours: ['#00aaff', '#ff921d', '#00ff40', '#ffe54b', '#8454ff'],
    items: [
        {
            id: 1,
            title: 'Test',
            block: 'Task',
            link: '[URL]',
            link_text: 'TEST001',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 2,
            title: 'Test 2',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 3,
            title: 'Test 3',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 4,
            title: 'Test 5',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
        {
            id: 5,
            title: 'Test 5',
            block: 'Estimate',
            footer: '<i class="ion-md-chatboxes"></i> 1 <div class="pull-right"><i class="ion-md-checkbox"></i> 1/4</div>'
        },
    ]
});