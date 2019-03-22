// This html page calculates a Social Security retirement benefit for
// a specified beneficiary. The data, which consists of date of birth, age (in
// years) at retirement, constant or inflated dollars, annual earnings from
// 1951 to the current year, and level of future earnings, must be entered in
// the forms on the page. Results are presented at the bottom of the page when
// the Calculate button is pressed. If there is an error with the input, an error
// message is displayed in a new window.
//
// In addition, the page calculates a disability benefit and survivor
// benefits for a child, mother/father, and widow/widower, and maximum family
// benefit for survivors. These calculations assume death or disability entitlement
// near the end of the current year,  and so are unaffected by specified future
// earnings or inflated dollars.
//
// This page has the capability of doing WEP calculations.  This is controlled
// by the variable do_wep, defined at the end of these preliminary comments.
// When it is turned on, the web page loads with a new input form for the
// amount of the non-covered pension for the WEP calculation.  Note that the page
// title and some of the meta tags must also be changed to make a postable WEP
// calculator.
//
// Limitations
//
//   Earnings prior to 1951 are not considered.
//   Periods of disability are not considered.
//   Military service is not considered.
//   The special minimum pia is not considered.
//   The old-start pia is not considered.
//   Only two sets of assumptions are allowed: either flat assumptions,
//   or the intermediate assumptions from the latest Trustees Report.
//
// Updates
//
// This calculator requires two updates per year in order to produce results
// consistent with current economic data and projections.  These updates are
// currently being done by David Olson in OCACT, and the following instructions
// explain what needs to be done for these updates.  Note that the pages are
// changed periodically by OCOMM for other reasons.  Make sure to get the latest
// versions of the pages off the mirror site before making any changes.
//
// This page contains historical data which needs to be updated every year,
// when the new average wage and benefit increases are announced (around
// November 1).  At the same time, a new year must be added to the
// annualEarningsForm.  To update:
//
//   Add a new entry to the table in the annualEarningsForm, creating
//     a new row if necessary.
//   Create a new decade of earnings cookie if necessary, updating the function
//     earningsReset.
//   Update the cookie list later in this comment.
//   Increment the quantity years.
//   Add the new benefit increase to the cpiHist array.
//   Add the new average wage to the fqHist array.
//   Add the new wage base to the baseHist array.
//   Add the new quarter of coverage amount to the qcamtHist array.
//   Add the new WEP year of coverage amount to the ycamtHist array.
//   Remove the first benefit increase from the cpitr array and add
//     another one at the end.  There should be 15 projected benefit
//     increases.
//   Change the average wages in the fqtr array to start one year later,
//     increasing from the new actual average wage.  There should be
//     16 projected average wage values.
//   Increase the variable current_year by one.
//   Update the years in the text on the annualEarningsForm.
//   Update the years in the text on the currentEarningsForm.
//   Update the years in the text on the futureEarningsForm.
//   Update the years in the text in the benefit estimates section.
//   Update the month in the last updated section at the top of the page.
//   Send the new pages to OCOMM.  The current contact is Ernesto Garcia.
//
//
// The projected benefit increases and average wage increases need to be
// updated every year, when the new Trustees Report is released (around
// April 1). To update:
//
//   Update the cpitr array of projected benefit increases.  Use the first 15
//     projected values from alt 2 in the TR.
//   Update the ultimate benefit increase (cpiult).
//   Update the fqtr array of projected average wages.  Use the first 16
//     projected values from alt 2 in the TR.
//   Update the ultimate average wage increase (awincult).
//   Update the month in the last updated section at the top of the page.
//   Send the new pages to OCOMM.  The current contact is Ernesto Garcia.
//
// This webpage has a debug mode.  If the variable do_debug is set to
// true, when the calculate button is pressed, large chunks of information
// about the calculation are written to a new text window.  This causes a
// noticeable but short delay as the information is written, so this should
// be left off unless the information is needed.
//
// This page uses the following non-persistent cookies:
// bday stores the birthdate
// age stores the stop-work age
// selections stores the choice of inflation assumptions
// currentEarn stores the current year earnings
// futureEarn stores the projected future earnings
// earnings1950s stores earnings values from 1951-1960
// earnings1960s stores earnings values from 1961-1970
// earnings1970s stores earnings values from 1971-1980
// earnings1980s stores earnings values from 1981-1990
// earnings1990s stores earnings values from 1991-2000
// earnings2000s stores earnings values from 2001-2010
// earnings2010s stores earnings values from 2011-2018



// Switch to turn on WEP mode.
var do_wep = true;

// Switch to turn on debugging mode.
var do_debug = false;

// Handle for a plaintext window used for debug purposes.
var _console = null;


// Writelns the string msg in the debug window if debug mode is on.
function debug(msg)
{
if (do_debug) {
// Initialize or open window if necessary
if ((_console == null) || (_console.closed)) {
_console = window.open("","console","width=600,height=300,resizable,scrollbars");
_console.document.open("text/plain");
}
_console.document.writeln(msg);
}
}



var first_year = 1922;
var start_year = 1951;

// We're using the date on the user's computer to do some
// computations, including finding an immediate survivor benefit.
// Do not use current_year for any number related to 2005 which
// must remain fixed due to the structure of the program,
// e.g. an array length or the number of years of earnings
// entered on the annualEarningsForm.  Use the quantity years
// defined below.
//
// Modified March 2004 - Since Netscape browsers don't seem to
// understand the following functions for getting the date
// from the user's computer, these variables are being changed to
// constants which we have control over.
//
//var today = new Date();
var current_year = 2019;
// Note that today stores Jan-Dec as 0-11.
//var current_month = today.getMonth() + 1;
var current_month = 11;

// last_year is a generic maximum date, and will eventually
// have to be changed.
var last_year = 2075;
var current_interval = 11;

// Number of historical years.  This quantity is used in various
// places throughout the program to index fixed sets of data.  It
// must be incremented each year.  See comment at beginning of
// program about updating.
var years = 68; // now = 2018 - 1951 + 1

// Number of total years (last_year - start_year)
var total_years = last_year - start_year + 1;

// Pia formula percentages.
percPia = [ 0.90, 0.32, 0.15 ];

// Mfb formula percentages.
percMfb = [ 1.50, 2.72, 1.34, 1.75 ];

// Historical benefit increases, 1951 to 2018.
// We use 2.5 for 1999, since all calculations
// will be for 2003 and later.
cpiHist = [
0.0, 12.5,  0.0, 13.0,  0.0,  //  1951-55
0.0,  0.0,  0.0,  7.0,  0.0,  //  1956-60
0.0,  0.0,  0.0,  0.0,  7.0,  //  1961-65
0.0,  0.0, 13.0,  0.0, 15.0,  //  1966-70
10.0, 20.0,  0.0, 11.0,  8.0, //  1971-75
6.4,  5.9,  6.5,  9.9, 14.3,  //  1976-80
11.2,  7.4,  3.5,  3.5,  3.1, //  1981-85
1.3,  4.2,  4.0,  4.7,  5.4,  //  1986-90
3.7,  3.0,  2.6,  2.8,  2.6,  //  1991-95
2.9,  2.1,  1.3,  2.5,  3.5,  //  1996-2000
2.6,  1.4,  2.1,  2.7,  4.1,  //  2001-05
3.3,  2.3,  5.8,  0.0,  0.0,  //  2006-10
3.6,  1.7,  1.5,  1.7,  0.0,  //  2011-15
0.3,  2.0,  2.8];             //  2016-18

// Historical average wage index, 1951 to 2017.
fqHist = [
2799.16,  2973.32,  3139.44,  3155.64,  3301.44,  // 1951-55
3532.36,  3641.72,  3673.80,  3855.80,  4007.12,  // 1956-60
4086.76,  4291.40,  4396.64,  4576.32,  4658.72,  // 1961-65
4938.36,  5213.44,  5571.76,  5893.76,  6186.24,  // 1966-70
6497.08,  7133.80,  7580.16,  8030.76,  8630.92,  // 1971-75
9226.48,  9779.44, 10556.03, 11479.46, 12513.46,  // 1976-80
13773.10, 14531.34, 15239.24, 16135.07, 16822.51, // 1981-85
17321.82, 18426.51, 19334.04, 20099.55, 21027.98, // 1986-90
21811.60, 22935.42, 23132.67, 23753.53, 24705.66, // 1991-95
25913.90, 27426.00, 28861.44, 30469.84, 32154.82, // 1996-2000
32921.92, 33252.09, 34064.95, 35648.55, 36952.94, // 2001-05
38651.41, 40405.48, 41334.97, 40711.61, 41673.83, // 2006-10
42979.61, 44321.67, 44888.16, 46481.52, 48098.63, // 2011-15
48642.15, 50321.89];                              // 2016-17

// Historical OASDI wage bases, 1951 to 2019.
baseHist = [
3600.0,   3600.0,   3600.0,   3600.0,   4200.0,   // 1951-55
4200.0,   4200.0,   4200.0,   4800.0,   4800.0,   // 1956-60
4800.0,   4800.0,   4800.0,   4800.0,   4800.0,   // 1961-65
6600.0,   6600.0,   7800.0,   7800.0,   7800.0,   // 1966-70
7800.0,   9000.0,  10800.0,  13200.0,  14100.0,   // 1971-75
15300.0,  16500.0,  17700.0,  22900.0,  25900.0,  // 1976-80
29700.0,  32400.0,  35700.0,  37800.0,  39600.0,  // 1981-85
42000.0,  43800.0,  45000.0,  48000.0,  51300.0,  // 1986-90
53400.0,  55500.0,  57600.0,  60600.0,  61200.0,  // 1991-95
62700.0,  65400.0,  68400.0,  72600.0,  76200.0,  // 1996-2000
80400.0,  84900.0,  87000.0,  87900.0,  90000.0,  // 2001-05
94200.0,  97500.0, 102000.0, 106800.0, 106800.0,  // 2006-10
106800.0, 110100.0, 113700.0, 117000.0, 118500.0, // 2011-15
118500.0, 127200.0, 128400.0, 132900.0];          //…
var PIA_Calculator = document.cookie;

// the following are variables used to fit the earnings data into
// a small number of string cookies.
// earningsDecadeStrings is an array of strings of the form
// f:f:f:f:f:f:f:f:f:f  with f a float (perhaps with commas).
// note that years that end in 0 are in the previous decade's string.
// decadeValues is an array of ten floats, which are the earnings
var earningsDecadeStrings = new Array();
var decadeValues = new Array;


// Looks for a cookie named "name" in the cookie file
// name is the string name of the cookie searched for
// returns the value stored in the cookie
function getCookie(name) {
var index = PIA_Calculator.indexOf(name + "=");
if (index == -1) return null;
index = PIA_Calculator.indexOf("=", index) + 1;
var endstr = PIA_Calculator.indexOf(";", index);
if (endstr == -1) endstr = PIA_Calculator.length;
return unescape(PIA_Calculator.substring(index, endstr));
}

// The cookies used by this webpage, following Federal website policy,
// are transient.  The following is a switch to make the cookies
// persistent so that a user can have their data saved to their hard
// drive between sessions.  The default expiration time with this
// switch turned on is 300 days.
//
var persistentCookies = false;
//var expiration = new Date(today.getTime() + 300 * 24 * 60 * 60 * 1000);

// Writes a cookie into the cookie file
// name is the string name of the cookie
// value is the value written into the cookie
function setCookie(name, value) {
if (persistentCookies) {
if (value != null && value != "") {
document.cookie=name + "=" + escape(value) + "; expires=" + expiration.toGMTString();
}
else {
document.cookie=name + "=" + escape(0) + "; expires=" + expiration.toGMTString();
}
}
else {
if (value != null && value != "") {
document.cookie=name + "=" + escape(value);
}
else {
document.cookie=name + "=" + escape(0);
}
}
PIA_Calculator = document.cookie; // update PIA_Calculator
}

// Sets cookie for string cookie
// cname is the name of the cookie being set
// value is an earnings value from a given year
// idx1 indexes the decade in which the year falls
// idx2 indexes the year within the decade
// note that years that end in 0 are in the previous decade's string
function updateEarningsDecadeCookie(cname,idx1,idx2,value) {
decadeValues = earningsDecadeStrings[idx1].split(":");
decadeValues[idx2] = value;
earningsDecadeStrings[idx1] = decadeValues.join(":");
setCookie(cname,earningsDecadeStrings[idx1]);
}


// End of cookie code

// These functions override the normal reset functions so that this calculator can
// work with the new template to initialize itself.
function inputReset() {
document.inputForm.bday.value = getCookie("bday") || "1/15/1950";
document.inputForm.ageYears.value = getCookie("ageYears") || "66";
document.inputForm.ageMonths.value = getCookie("ageMonths") || "0";
document.inputForm.selections.selectedIndex = getCookie("selections") || "0";
if (do_wep) {
document.inputForm.ncpension.value = getCookie("ncpension") || "0";
}
return false;
}

function currentReset() {
document.currentEarningsForm.currentEarning.value = getCookie("currentEarn") || "0";
document.currentEarningsForm.futureEarning.value = getCookie("futureEarn") || "0";
return false;
}

function earningsReset() {
with (document.annualEarningsForm) {
earningsDecadeStrings[0] = getCookie("earnings1950s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[1] = getCookie("earnings1960s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[2] = getCookie("earnings1970s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[3] = getCookie("earnings1980s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[4] = getCookie("earnings1990s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[5] = getCookie("earnings2000s") || "0:0:0:0:0:0:0:0:0:0";
earningsDecadeStrings[6] = getCookie("earnings2010s") || "0:0:0:0:0:0:0:0:0:0";
for (var i = 0; i < years; i++) {
elements[i].value = earningsDecadeStrings[Math.floor(i / 10)].split(":")[i%10];
}
}
return false;
}