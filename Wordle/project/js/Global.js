const GRID_SIDE_GAPS = 10;
const GRID_BRICK_GAP = 5;

const YELLOW = 'rgb(184, 184, 0)';
const GREEN = 'rgb(0, 173, 0)';
const BLANK = 'rgb(59, 59, 59)';

var cpuWordle;
var currentScene;
var test;
var turnsInfo = [];

var winner = undefined;

const omegaWordList = words.concat(allowedWords);
