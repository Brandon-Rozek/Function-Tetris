function Graph(config) {
    // user defined properties
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;
    this.unitsPerTick = config.unitsPerTick;
    this.centerY = config.centerY; /*center x and y is the "origin" of the graph relative to canvas location*/
    this.centerX = config.centerX;
    // constants 
    this.canvas = document.getElementById('myCanvas');
    this.tickSize = 20;
    // relationships
    this.context = this.canvas.getContext('2d');
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.unitX = this.canvas.width / this.rangeX;
    this.unitY = this.canvas.height / this.rangeY;
    this.iteration = (this.maxX - this.minX) / 1000;
    this.scaleX = this.canvas.width / this.rangeX;
    this.scaleY = this.canvas.height / this.rangeY;
    this.XmaxUnit;
    this.XminUnit;
    /////////////change, added next 3 vars
    this.shiftAmount;
    this.shiftIncrement;
    this.timeInterval;
    // draw x and y axis
    this.drawXAxis();
    this.drawYAxis();
    this.drawGrid();
    this.getImage();

}

Graph.prototype.drawXAxis = function () {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.canvas.width, this.centerY);
    context.strokeStyle = 'rgb(25,75,160)';
    context.lineWidth = 4;
    context.stroke();
    context.restore();
};

Graph.prototype.drawYAxis = function () {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.canvas.height);
    context.strokeStyle = 'rgb(25,75,160)';
    context.lineWidth = 4;
    context.stroke();
    context.restore();
};

Graph.prototype.drawGrid = function () {
    var context = this.context;
    context.save();
    context.beginPath();
    context.strokeStyle = '#8c8c8c';
    context.fillStyle = 'white';
    console.log(context.canvas.width)
    context.fillRect(0, 0, context.canvas.width, context.canvas.length);
    context.lineWidth = 2;

    // Sets up x coordinate tick marks
    var xPosIncrement = this.unitsPerTick * this.unitX;
    var xPos, unit;
    context.font = '12pt Ubuntu';
    context.textAlign = 'left';
    context.textBaseline = 'top';

    // draws vertical lines before x = 0
    xPos = this.centerX - xPosIncrement;
    unit = -1 * this.unitsPerTick;
    while (xPos > 0) {
        context.moveTo(xPos, this.centerY - this.tickSize / 2);
        context.lineTo(xPos, this.canvas.height);
        context.lineTo(xPos, -this.canvas.height);
        context.stroke();
        context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
        unit -= this.unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
        this.XminUnit = unit;
    }
    if (this.XminUnit === undefined) {
        this.XminUnit = -1;
    }

    // draws vertical lines after x = 0
    xPos = this.centerX + xPosIncrement;
    unit = this.unitsPerTick;
    while (xPos < this.canvas.width) {
        context.moveTo(xPos, this.centerY - this.tickSize / 2);
        context.lineTo(xPos, this.canvas.height);
        context.lineTo(xPos, -this.canvas.height);
        context.stroke();
        context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
        unit += this.unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
        this.XmaxUnit = unit;
    }

    // Sets up Y coordinate tick marks
    var yPosIncrement = this.unitsPerTick * this.unitY;
    var yPos, unit;
    context.font = '12pt Ubuntu';
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    // draws horizontal lines after y = 0
    yPos = this.centerY - yPosIncrement;
    unit = this.unitsPerTick;
    while (yPos > 0) {
        context.moveTo(this.centerX - this.tickSize / 2, yPos);
        context.lineTo(this.canvas.width, yPos);
        context.lineTo(-this.canvas.width, yPos);
        context.stroke();
        context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
        unit += this.unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }

    // draws horizontal lines before y = 0
    yPos = this.centerY + yPosIncrement;
    unit = -1 * this.unitsPerTick;
    while (yPos < this.canvas.height) {
        context.moveTo(this.centerX - this.tickSize / 2, yPos);
        context.lineTo(this.canvas.width, yPos);
        context.lineTo(-this.canvas.width, yPos);
        context.stroke();
        context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
        unit -= this.unitsPerTick;
        yPos = Math.round(yPos + yPosIncrement);
    }
    context.restore();
};

Graph.prototype.drawEquation = function (equation) {
    var context = this.context;
    context.save();
    this.transformContext();
    context.beginPath();
    context.moveTo(this.XminUnit, equation(this.XminUnit));
    for (var x = this.XminUnit + this.iteration; x <= this.XmaxUnit; x += this.iteration) {
        context.lineTo(x, equation(x));
    }
    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    /////////////--Added for no spacing in regular lines
    context.setLineDash([1, 0]);
    context.stroke();
    context.restore();
};
Graph.prototype.drawdottedEquation = function (equation) {
    var context = this.context;
    context.save();
    this.transformContext();
    context.beginPath();
    context.moveTo(this.XminUnit, equation(this.XminUnit));
    for (var x = this.XminUnit + this.iteration; x <= this.XmaxUnit; x += this.iteration) {
        context.lineTo(x, equation(x));
    }
    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.setLineDash([5]);
    context.stroke();
    context.restore();
};

Graph.prototype.drawPoint = function (goalx, goaly) {
    var context = this.context;
    context.save();
    this.transformContext();
    context.beginPath();
    var c = document.getElementById("myCanvas");
    var img = document.getElementById("balloon");
    context.drawImage(img, goalx - 0.32, goaly - 0.48, 0.64, 0.96);
    context.stroke();
    context.restore();
};

//sets context to origin
Graph.prototype.transformContext = function () {
    var context = this.context;
    this.context.translate(this.centerX, this.centerY);
    context.scale(this.scaleX, -this.scaleY);
};
///////////////deprecated
Graph.prototype.reset = function () {
    var context = this.context;
    context.save();
    context.fillStyle = 'black';
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
    /*
    this.drawXAxis();
    this.drawYAxis();
    this.drawGrid();*/
    context.restore();
};
//////////////
Graph.prototype.printGrid = function () {
    var context = this.context;
    context.save();
    var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
};
////////////
Graph.prototype.getImage = function () {
    this.image = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
}

//////////////----First test animator, example
Graph.prototype.animateLine = function (line, mode, frameRate) {
    console.log('animate');
    line.falling = true;
    var context = this.context
        //for test, currentLevel is Quadratic; LEVEL NAME MUST MATCH DIV INPUT NAME
    Game.currentLevel = 'Quadratic';
    var divSelector = "#" + Game.currentLevel + " #";
    Game.currentLine = line;

    this.animator = window.setInterval(
        function () {
            //update vals in input boxes
            $(divSelector + "vShift").val(Math.round(line.goalvShift * 10 + line.shiftAmount * 10) / 10);
            $(divSelector + "vStretch").val(line.vStretch);
            $(divSelector + "hStretch").val(line.hStretch);
            $(divSelector + "hShift").val(line.goalhShift + line.hShift);


            //setting up each frame of the graph
            line.graph.context.putImageData(line.graph.image, 0, 0);
            line.graph.drawdottedEquation(line.equation);
            line.graph.drawEquation(function (x) {
                return line.vStretch * line.equation(x / line.hStretch + line.hShift) + line.shiftAmount;
            });
            //line.shiftAmount = Math.round(line.shiftAmount - line.shiftIncrement);

            line.shiftAmount = Math.round(line.shiftAmount * 10 - line.shiftIncrement * 10) / 10;

            //ending the animation at bottom (before the curve goes one more increment below 0)
            if (line.hShift == 0 && line.vShift == (line.shiftAmount + line.vShift + line.shiftIncrement)) {
                window.clearInterval(line.graph.animator);
                Game.currentLine = undefined;
                line.falling = false;
                Game.level++;
                playLevel();
            } else if (line.shiftAmount < 0 - line.shiftIncrement) {
                window.clearInterval(line.graph.animator);
                Game.currentLine = undefined;
                line.falling = false;
                alert("You lose . . . . You made it to Level " + Game.level);
                Game.level = 0;
            }

        }, 1000 / frameRate);
};