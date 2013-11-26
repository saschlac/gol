GOL = function( width, height, canvasID){
    this.gridHeight = height;
    this.gridWidth = width;
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("2d");
    
    this.updateCanvasGrid();
    
    this.currentGrid = GOL.createArray(this.gridWidth,this.gridHeight);
    
    this.setupListeners();
    
    this.initGrid();
    this.drawGrid();
    
    this.running = false;
}

GOL.prototype.updateCanvasGrid = function(){
    //http://stackoverflow.com/questions/1664785/html5-canvas-resize-to-fit-window
    this.context.width  = window.innerWidth-250;
    this.context.height = window.innerHeight;
    
    this.gridSizeX = Math.floor(this.canvas.width/this.gridWidth);
    this.gridSizeY = Math.floor(this.canvas.height/this.gridHeight);
}

GOL.prototype.drawGrid = function(){
    this.clearCanvas();
    
    this.context = this.canvas.getContext("2d");
    
    for(var i=0;i<this.gridWidth;i++){
        for(var j=0;j<this.gridHeight;j++){
            if(this.currentGrid[i][j] > 0){
                this.context.fillStyle = '#0E4'; //this.getColor(i,j);
                this.context.fillRect(i*this.gridSizeX, j*this.gridSizeY, this.gridSizeX, this.gridSizeY);
            }
        }    
    }
}

GOL.prototype.getColor = function(i,j){
    var iComp = ( '000'+((i%512)*10).toString(16) ).substr(-3) ;
    var jComp = ( '000'+((j%512)*15).toString(16) ).substr(-3) ;
    
    var color = '#'+iComp+jComp+'';
    
    return color;
}

GOL.createArray = function(width,height){
    //Some reference: http://stackoverflow.com/questions/18163234/declare-an-empty-two-dimensional-array-in-javascript
    
    var retVal = [];
    for(var i =0; i< width;i++){
        retVal.push( Array.apply(null, new Array( height )).map(Number.prototype.valueOf, 0) );
    }
    
    return retVal;
}

GOL.prototype.initGrid = function(){
    this.randomizeGrid(); 
}

GOL.prototype.calculateNextStep = function(){
    
    var changeList = [];
    
    for(var x=0;x<this.gridWidth;x++){
        for(var y=0;y<this.gridHeight;y++){
            //count neighbors
            var numNeighbors = this.countNeighbors(x,y);
            
            if( this.currentGrid[x][y] == GOL.ALIVE && (numNeighbors < 2 || numNeighbors > 3))
                changeList.push([x,y,GOL.DEAD]);
            if( this.currentGrid[x][y] == GOL.DEAD && numNeighbors ==3)    
                changeList.push([x,y,GOL.ALIVE]);
        }
    }
    
    this.updateGrid(changeList);
    
    this.drawGrid();
    
    var me = this;
    
    if (this.running) {
        setTimeout(function() {
          me.calculateNextStep();
        }, 0);
      }
}

GOL.prototype.countNeighbors = function(x,y){
    var count = 0;
    var grid = this.currentGrid;
    
    if(x > 0){
        if( y > 0 && grid[x-1][y-1] == GOL.ALIVE )
            count++;
        if( grid[x-1][y] == GOL.ALIVE )
            count++;
        if( y < (this.gridHeight-1) && grid[x-1][y+1] == GOL.ALIVE )
            count++;
    }
    if( x < (this.gridWidth-1) ){
        if( y > 0 && grid[x+1][y-1] == GOL.ALIVE )
            count++;
        if( grid[x+1][y] == GOL.ALIVE )
            count++;
        if( y < (this.gridHeight-1) && grid[x+1][y+1] == GOL.ALIVE )
            count++;
    }
    
    if( y > 0 && grid[x][y-1] == GOL.ALIVE )
        count++;
    if( y < (this.gridHeight-1) && grid[x][y+1] == GOL.ALIVE )
        count++;
    
    return count;
}

GOL.prototype.updateGrid = function(changeList){
    for(var i = 0;i < changeList.length; i++){
        this.currentGrid[changeList[i][0]][changeList[i][1]] = changeList[i][2];
    }
}

GOL.prototype.setupListeners = function(){
    var me = this;

    this.canvas.addEventListener('click', function(e) {
    
        //console.log(e.x,me.canvas.offsetLeft,e.y,me.canvas.offsetTop);
    
        console.log(e.y,me.gridSizeY);
    
        var xCoord = Math.floor( (e.x - me.canvas.offsetLeft)/me.gridSizeX);
        var yCoord = Math.floor( (e.y)/me.gridSizeY);
        
        me.toggle(xCoord,yCoord);
        
        me.drawGrid();
        
    }, false);
    
    document.getElementById('stepBtn').addEventListener('click', function(e) { me.calculateNextStep();});
    
    document.getElementById('startStopBtn').addEventListener('click', function(e) {
        if(me.running){
            me.stop();
        }
        else{
            me.start();
        }
        
    });
    
    document.getElementById('clearBtn').addEventListener('click', function(e) {me.clearGrid();});
    document.getElementById('randomBtn').addEventListener('click', function(e) {me.randomizeGrid();});
}

GOL.prototype.stop = function(){
    this.running = false;
    document.getElementById('startStopBtn').innerHTML = 'Start';
}

GOL.prototype.start = function(){
    this.running = true;
    this.calculateNextStep();
    document.getElementById('startStopBtn').innerHTML = 'Stop';  
}

GOL.prototype.clearGrid = function(){
    for(var x=0;x<this.gridWidth;x++){
        for(var y=0;y<this.gridHeight;y++){
            this.currentGrid[x][y] = GOL.DEAD;
        }
    }
    
    this.drawGrid();
}

GOL.prototype.randomizeGrid = function(){
    for(var x=0;x<this.gridWidth;x++){
        for(var y=0;y<this.gridHeight;y++){
            this.currentGrid[x][y] = Math.round(Math.random());
        }
    }
    
    this.drawGrid();
}

GOL.prototype.toggle = function(x,y){
    if( this.currentGrid[x][y] > 0){
        this.currentGrid[x][y] = 0;
    }
    else{
        this.currentGrid[x][y] = 1;
    }
}

GOL.prototype.clearCanvas = function(){
    //Maybe look at this if there are performance issues: http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
    this.canvas.width = this.canvas.width;
}

GOL.ALIVE = 1;
GOL.DEAD = 0;