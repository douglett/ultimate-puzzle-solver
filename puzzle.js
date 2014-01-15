
var arrowout = 1
var arrowin = 2
var octagon = 3
var cross = 4

var pnames = {}
pnames[arrowout] = 'arrowout'
pnames[arrowin] = 'arrowin'
pnames[octagon] =  'octagon'
pnames[cross] = 'cross'
pnames[-arrowout] = '<arrowout>'
pnames[-arrowin] = '<arrowin>'
pnames[-octagon] = '<octagon>'
pnames[-cross] = '<cross>'


var pieces = []
var board = []

var piece_list = [
	[ octagon, octagon, -octagon, -arrowout ], 		// 0
	[ arrowin, arrowin, -arrowout, -cross ],
	[ arrowout, octagon, -octagon, -cross ],
	[ octagon, cross, -arrowin, -octagon ],
	[ octagon, arrowin, -cross, -arrowin ],
	[ cross, arrowout, -cross, -arrowin ], 			// 5
	[ octagon, cross, -arrowout, -arrowout ],
	[ arrowin, cross, -arrowout, -arrowin ],
	[ octagon, arrowin, -octagon, -cross ],
	[ arrowout, octagon, -octagon, -arrowout ],
	[ arrowout, arrowout, -octagon, -arrowin ], 	// 10
	[ arrowin, arrowout, -arrowout, -octagon ],
	[ arrowin, arrowin, -octagon, -cross ],
	[ octagon, arrowin, -arrowin, -arrowout ],
	[ octagon, cross, -cross, -octagon ], 
	[ cross, arrowout, -arrowout, -octagon ] 		// 15
]


function PuzzlePiece(piece) {
	this.sides = [ piece[0], piece[1], piece[2], piece[3] ]
	this.rot = 0
	this.used = false
	this.id = PuzzlePiece.prototype.idcount
	PuzzlePiece.prototype.idcount++
}
PuzzlePiece.prototype = {
	idcount: 0,
	up: function() {
		return this.sides[(4-this.rot)%4]
	},
	right: function() {
		return this.sides[(5-this.rot)%4]
	},
	down: function() {
		return this.sides[(6-this.rot)%4]
	},
	left: function() {
		return this.sides[(7-this.rot)%4]
	},
	dir: function(dir) {
		if (dir == 0)
			return this.up()
		else if (dir == 1)
			return this.right()
		else if (dir == 2)
			return this.down()
		else if (dir == 3)
			return this.left()
	},
	show: function() {
		console.log( pnames[this.up()], pnames[this.right()], pnames[this.down()], pnames[this.left()] )
	}
}


var logging = false
function log() {
	if (logging)
		console.log.apply(console, arguments)
}


function setup() {
	// setup pieces
	for (var i=0; i<piece_list.length; i++)
		pieces.push( new PuzzlePiece(piece_list[i]) )

	// setup board
	for (var y=0; y<4; y++) {
		var row = []
		for (var x=0; x<4; x++) 
			row.push(null)
		board.push(row)
	}
}


function main() {
	setup()
	console.log("start")
	pdraw.draw()

	setTimeout(function() {
		var result = match(0, 0)
		console.log('finished. success:', result)
		// console.log(board)
		showboard1()
		showboard3()
		pdraw.draw()
	}, 1000)
}


function match(x, y) {
	// check if we're out of pieces
	if (y*board.length+x >= pieces.length)
		return true

	// calculate next position
	var nexty = y
	var nextx = x+1
	if (nextx >= board[0].length) {
		nexty = y+1
		nextx = 0
	}

	// match each available piece against open slot
	for (var i=0; i<pieces.length; i++) {
		var piece = pieces[i]
		if (piece.used)
			continue
		for (var r=0; r<4; r++) {
			piece.rot = r
			if (fits(piece, x, y)) {
				piece.used = true
				board[y][x] = piece
				log("fits", x, y, piece)
				if ( match(nextx, nexty) )
					return true
				else {
					piece.used = false
					board[y][x] = null
					log("cancel_fits")
				}
			}
		}
	}

	// no match for this slot, go back
	return false
}


function fits(piece, x, y) {
	// check proposed pieces left hand side
	if (!( x == 0 || board[y][x-1] == null || board[y][x-1].right() + piece.left() == 0 ))
		return false
	// check right
	if (!( x == board[0].length-1 || board[y][x+1] == null || board[y][x+1].left() + piece.right() == 0 ))
		return false
	// up
	if (!( y == 0 || board[y-1][x] == null || board[y-1][x].down() + piece.up() == 0 ))
		return false
	// down
	if (!( y == board.length-1 || board[y+1][x] == null || board[y+1][x].up() + piece.down() == 0 ))
		return false
	return true
}


function showboard1() {
	for (var y=0; y<board.length; y++)
		// for (var x=0; x<board[0].length; x++)
		console.log(board[y])
}
function showboard2() {
	for (var y=0; y<board.length; y++)
		for (var x=0; x<board[0].length; x++) {
			// console.log(board[y][x])
			if (board[y][x] == null)
				console.log(null)
			else
				console.log( pnames[board[y][x].left()], pnames[board[y][x].right()] )
		}
}
function showboard3() {
	for (var y=0; y<board.length; y++) {
		var r = []
		for (var x=0; x<board[0].length; x++) {
			if (board[y][x] == null)
				// console.log(null)
				r.push(null)
			else 
				// console.log( board[y][x].id )
				r.push( board[y][x].id )
		}
		console.log(r)
	}
}



(function() {

var pdraw = window.pdraw = {}
var canvas = document.getElementById('mycanvas')
var w = canvas.width = 700
var h = canvas.height = 700
var ctx = canvas.getContext('2d')

pdraw.draw = function() {
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, w, h)

	ctx.strokeStyle = 'white'
	ctx.lineWidth = 2

	ctx.save()
	ctx.translate(80, 80)

	var spc = 150
	var wid = 80
	for (var y=0; y<board.length; y++)
		for (var x=0; x<board[0].length; x++) {
			ctx.save()
				ctx.translate(spc*x, spc*y)
				ctx.strokeRect(-wid/2, -wid/2, wid, wid)
				for (var r=0; r<4; r++) {
					ctx.save()
						ctx.rotate(90*r*Math.PI/180)
						ctx.translate(0, -40)
						if (board[y][x] != null) {
							// draw_oct()
							// draw_shape(octagon)
							draw_shape(board[y][x].dir(r))
						}
					ctx.restore()
				}
			ctx.restore()
		}

	ctx.restore()
}


function draw_shape(shape_id) {
	switch (shape_id) {
		case -octagon:
			ctx.rotate(Math.PI)
		case octagon:
			draw_octagon()
		break
		case -arrowout:
			ctx.rotate(Math.PI)
		case arrowout:
			draw_arrowout()
		break
		case -arrowin:
			ctx.rotate(Math.PI)
		case arrowin:
			draw_arrowin()
		break
		case -cross:
			ctx.rotate(Math.PI)
		case cross:
			draw_cross()
		break
	}
}


function draw_octagon() {
	ctx.beginPath()
		ctx.moveTo(-5, 0)
		ctx.lineTo(-15, -10)
		ctx.lineTo(-15, -20)
		ctx.lineTo(-5, -30)
		ctx.lineTo(5, -30)
		ctx.lineTo(15, -20)
		ctx.lineTo(15, -10)
		ctx.lineTo(5, 0)
	// ctx.closePath()
	ctx.stroke()
}

function draw_arrowout() {
	ctx.beginPath()
		ctx.moveTo(-5, 0)
		ctx.lineTo(-5, -15)
		ctx.lineTo(-15, -15)
		ctx.lineTo(0, -30)
		ctx.lineTo(15, -15)
		ctx.lineTo(5, -15)
		ctx.lineTo(5, 0)
	ctx.stroke()
}

function draw_arrowin() {
	ctx.beginPath()
		ctx.moveTo(-5, 0)
		ctx.lineTo(-15, -15)
		ctx.lineTo(-5, -15)
		ctx.lineTo(-5, -30)
		ctx.lineTo(5, -30)
		ctx.lineTo(5, -15)
		ctx.lineTo(15, -15)
		ctx.lineTo(5, 0)
	ctx.stroke()
}

function draw_cross() {
	ctx.beginPath()
		ctx.moveTo(-5, 0)
		ctx.lineTo(-5, -10)
		ctx.lineTo(-15, -10)
		ctx.lineTo(-15, -20)
		ctx.lineTo(-5, -20)
		ctx.lineTo(-5, -30)
		ctx.lineTo(5, -30)
		ctx.lineTo(5, -20)
		ctx.lineTo(15, -20)
		ctx.lineTo(15, -10)
		ctx.lineTo(5, -10)
		ctx.lineTo(5, 0)
	ctx.stroke()
}


}());