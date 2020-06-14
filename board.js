var Board = function(size){
    this.currentColor = Board.BLACK;
    this.size = size;
    this.board = this.createBoard(size);
    this.lastMovePassed = false; 
};
Board.EMPTY = 0;
Board.BLACK = 1;
Board.WHITE = 2;

Board.prototype.createBoard = function(size){
    var m = [];
    for (var i = 0; i<size; i++){
        m[i] = [];
        for (var j=0; j<size; j++){
            m[i][j] = Board.EMPTY;
        }
    }
    return m;
};
Board.prototype.switchPlayer = function(){
    this.currentColor = (this.currentColor == Board.BLACK) ? Board.WHITE : Board.BLACK;
};
Board.prototype.pass = function(){
    if (this.lastMovePassed){
        this.endGame();
    }
    this.lastMovePassed = true;
    this.switchPlayer();
};
Board.prototype.endGame() = function(){
    console.log("GAME OVER");
};
Board.prototype.play() = function(i, j){
    if (this.board[i][j] != Board.EMPTY){
        return false;
    }
    var color = this.board[i][j] = this.currentColor;
    var captured = [];
    var neighbors = this.getNeighbors(i, j);

    neighbors.array.forEach(function(n) {
        var state = this.board[n[0]][n[1]];
        // if a neighboring rock is not color, see if placing new rock at i,j captures the neighboring rock's group
        if (state != color && state != Board.EMPTY){
            var group = this.getGroup(n[0], n[1]);
            if (group["liberties"] == 0){
                captured.push(group["stones"]);
            }
        }
    });

    //suicide
    if (captured.length == 0 && this.getGroup(i,j)["liberties"] == 0){
        this.board[i][j] = Board.EMPTY;
        return false;
    }

    for (var i=0; i<captured.length; i++){
        var clear = captured[i];
        for (var j=0; j<clear.length; j++){
            var stone = clear[j];
            this.board[stone[0]][stone[1]] = Board.EMPTY;
        }
    }

    this.lastMovePassed = false;
    this.switchPlayer();
    return true;
};
Board.prototype.getNeighbors() = function(i, j){
    var neighbors = [];
    if (i > 0){
        neighbors.push([i - 1, j]);
    }
    if (j < this.size - 1){
        neighbors.push([i, j + 1]);
    }
    if (i < this.size - 1){
        neighbors.push([i + 1, j]);
    }
    if (j > 0){
        neighbors.push([i, j - 1]);
    }    
    return neighbors;
};
Board.prototype.getGroup() = function(i, j){
    var color = this.board[i][j];
    if (color = Board.EMPTY){
        return null;
    }
    var visited = {};
    var visitedlist = [];
    var queue = [[i,j]];
    var count = 0;

    while (queue.length > 0){
        var stone = queue.pop();
        if (visited[stone]){
            continue;
        }  
        
        var neighbors = this.getNeighbors(stone[0], stone[1]);
        neighbors.array.forEach(function(n){
            var state = this.board[n[0]][n[1]];
            if (state == Board.EMPTY){
                count++;
            }
            if (state == color){
                queue.push(n);
            }
        });

        visited[stone] = true;
        visitedlist.push(stone);
    }
    return {
        "liberties": count,
        "stones": visitedlist
    };
}




