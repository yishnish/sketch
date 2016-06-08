function CanvasHelper(){

  var mouseIsDown = false;
  var lastCoords = {};

  this.startDrawingAt = function(coords){
    this.context.beginPath();
    this.context.moveTo(coords.x, coords.y);  
  }

  this.drawLine = function(coords){
    this.context.lineTo(coords.x, coords.y);
    this.context.stroke();                    
  }

  this.setUpCanvas = function(socket){
    this.socket = socket;
    var canvas = document.getElementById('my-canvas');
    var _context = canvas.getContext('2d');
    _context.fillStyle = 'rgb(0,0,200)';
    _context.fillRect(0, 0, 450, 450);
    this.context = _context;
    _helper = this;

    socket.on('draw-line', function(coords){
      var start = coords.start, end = coords.end;
      _helper.startDrawingAt(start);
      _helper.drawLine(end);
    });

    canvas.onmousedown = function(event){
      oldPosition = findEventLocation(_context, event);
      mouseIsDown = true;
    }

    canvas.onmousemove = function(event){
      if(mouseIsDown){
        var newPosition = findEventLocation(_context, event);
        socket.emit('draw-line', oldPosition, newPosition);
        oldPosition = newPosition;
      }
    }

    canvas.onmouseleave = function(event){
      mouseIsDown = false;
    }

    canvas.onmouseup = function(event){
      var newPosition = findEventLocation(_context, event);
      socket.emit('draw-line', oldPosition, newPosition);
      oldPosition = newPosition;
      mouseIsDown = false;
    }
  }

  function findEventLocation(canvasContext, clickEvent){
    var canvasBorder = canvasContext.canvas.getBoundingClientRect();
    var canvasLeft = canvasBorder.left;
    var canvasTop = canvasBorder.top; 
    var clickXLoc = clickEvent.clientX;
    var clickYLoc = clickEvent.clientY;

    return {
      x : clickXLoc - canvasLeft,
      y: clickYLoc - canvasTop
    }
  }
}
