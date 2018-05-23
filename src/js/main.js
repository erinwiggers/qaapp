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
    

// WEBAPP Scripts

// GLOBAL VARIABLES
var username = "social@lyntonweb.com", //email address for your account
    password = "u0856709d93976a5", //authkey for your account
    test = null,
    getDataClicked = false;
    

    
// GET RAW SCREENSHOT TEST RESULTS
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
    var progress1 = $("<p>connected to server</p>"),
        progress2 = $("<p>request sent</p>"),
        progress3 = $("<p>processing...</p>"),
        progress4 = $("<p>complete!</p>");

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
            console.log("connected to server");
            loader.addClass("show-loader");
            loader.addClass("animate-loader");
            loader_wrap.append(progress1);
        } else if (xhr.readyState == 2) {
            console.log("reqest sent");
            progress1.addClass("hide");
            loader_wrap.append(progress2);
        } else if (xhr.readyState == 3) {
            console.log("processing request");
            progress2.addClass("hide");
            loader_wrap.append(progress3);
        } else if (xhr.readyState == 4) {
            console.log("complete");
            progress3.addClass("hide");
            loader_wrap.append(progress4);
            loader.removeClass("animate-loader");
            var test = JSON.parse(xhr.responseText);
            buildDoc(test);
            console.log(test);
            //parseResults(testData);
        } else {
            console.log("Something went wrong");
        }
    };
};

// PARSE SCREENSHOT TEST RESULTS
var parseResults = function (test) {
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

    /*
    var testObj = [{}];
    for (i=0, results.length; i < results.length; i++) {
        var resultsArray[i] = [{}];
        var result_id = results[i].result_id,
            result_os = results[i].os['name'],
            result_browser = results[i].browser['name'],
            result_resolution = results[i].resolution['name'],
            result_tags = results[i].tags,
            show_result = results[i].show_result_web_url,
            launch_live = results[i].launch_live_test_url;
        
    } */
    
    var createArray = {
        url,
        show_url,
        date, 
        count, 
        version_id
    };
    
    return createArray;

};

// CREATE SPREADSHEET AND POPULATE WITH TEST DATA
var buildDoc = function (test) {
    var newSpreadsheetId = null;
    var page_slug = $("input[name=page-slug]").val(),
        client_slug = $("input[name=client-slug]").val();
    
    var createSheet = function (title, sheet_name) {
        var spreadsheetBody = {
            properties: {
                "title": title
            },
            sheets: {
                properties: {
                    "title": sheet_name
                },
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
                            "startRowIndex": 1
                        }
                    ]
                }
            }
        };
        var createRequest = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        createRequest.then(function (response) {
            newSpreadsheetId = response.result.spreadsheetId;
            var sheetVars = parseResults(test);
            populateNewSheet(newSpreadsheetId, page_slug, sheetVars.url, sheetVars.show_url, sheetVars.date, sheetVars.count, sheetVars.version_id);
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
                            "=HYPERLINK(\"" + url + "\", \"" + spreadsheetId + "\")"
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
            console.log(response.result);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    };
    
    createSheet(client_slug + " QA Documentation", page_slug);
}

// START DOCUMENTATION HANDLER
var startDoc = function() {
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