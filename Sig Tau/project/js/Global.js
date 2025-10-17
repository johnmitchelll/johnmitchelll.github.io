const COLOR_AZURE = "rgb(0, 128, 255)";
const COLOR_BLUE = "rgb(0, 0, 255)";
const COLOR_WHITE = "rgb(255, 255, 255)";
const MAX_SCREEN_WIDTH = 900;
const RED = "rgb(230,42,35)";
const ACTIVE_WIDTH = Math.min(window.innerWidth, MAX_SCREEN_WIDTH);

const H1_FONTSIZE = "2em";
const H2_FONTSIZE = "1.5em";
const H3_FONTSIZE = "1em";

var scene;
var prevScene = -1;
var pnmDBInfo;

var primaryColor;
var secondaryColor;
var background;

var submissionTries = 0;

/*  Questions in order:
Name (First & Last)
Most recent GPA
Instagram
Email (ASU or Personal)
Phone Number
*/