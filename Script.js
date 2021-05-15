var parabola;
var start = function () {
    document.getElementById('myCanvas').width = window.innerWidth; //Sets size of Width
    document.getElementById('myCanvas').height = window.innerHeight; //Sets size of Height
    //Creates graph
    myGraph = new Graph({
        centerY: window.innerHeight / 2,
        centerX: window.innerWidth / 2,
        minX: 0,
        minY: 0,
        maxX: window.innerWidth / (window.innerHeight / 10),
        maxY: 10,
        unitsPerTick: 1
    });
    playLevel();
}

var playLevel = function () {
    Game.parabula.h = Game.parabula.fh();
    Game.parabula.k = Game.parabula.fk();
    parabola = new Line({
        equation: function (x) {
            return Math.pow((x + Game.parabula.h), 2) + Game.parabula.k;
        },
        //positive, shift left to origin
        hShift: Game.parabula.h,
        vShift: Game.parabula.k,
        graph: myGraph
    })
    myGraph.animateLine(parabola, 0, Game.level * 2 + 5);
}

//document object checks for arrow key presses
$(document).on('keyup', function (e) {
    //only works if a current line is set, and said line is falling (animating)
    if (Game.currentLine.falling) {
        switch (e.which) {
        case 37: //left arrow
            //shift the line one unit left
            Game.currentLine.hShift += 1;
            break;
        case 38: //up arrow
            //only if line is sliding horizontally
            Game.currentLine.shiftAmount += 1;
            break;
        case 39: //right arrow
            Game.currentLine.hShift -= 1;
            break;
        case 40: //down arrow
            Game.currentLine.shiftAmount -= 1;
            break;
        default:

        }
    }
});
$(document).ready(start);