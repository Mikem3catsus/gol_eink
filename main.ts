let width = 250
let height = 122
// Set some values so the typing works
let live_array = [[0,0],[0,0]]
let next_array = [[0,0],[0,0]]
let x = 0
let y = 0
for (let index = 0; index < width; index++) {
    let column = []
    let column2=[]
    for (let index2 = 0; index2 < height; index2++) {
    	column[index2] = 0
        column2[index2] = 0
    }
    live_array[index] = column
    next_array[index] = column2
}

// build a flyer
live_array[2][2]=1
live_array[2][1]=1
live_array[2][3]=1
//live_array[3][4]=1
//live_array[3][3]=1

basic.forever(function () {
    for(let x=0;x<width;x++){
        for(let y=0;y<height;y++){
            let x_dec = (x-1)
            if (x_dec == -1){x_dec=width-1}
            let x_inc = (x+1)%width
            let y_dec = (y-1)
            if(y_dec == -1){y_dec = height -1}
            let y_inc = (y+1)%height
            let neighbor_count = (
                live_array[x_dec][y_dec] +
                live_array[x_dec][y] +
                live_array[x_dec][y_inc] +
                live_array[x][y_dec] +
                live_array[x][y_inc] +
                live_array[x_inc][y_dec] +
                live_array[x_inc][y] +
                live_array[x_inc][y_inc]
            )
            if((neighbor_count==3) || ( (neighbor_count == 2) && (live_array[x][y]==1))){
                next_array[x][y] = 1
            } else {
                next_array[x][y] = 0
            }
            if(neighbor_count==2){
                if (live_array[x][y] == 1){
                    next_array[x][y] = 1
                }
            }
        }
    }
    for(let x=0;x<width;x++){
        for(let y=0;y<height;y++){
            live_array[x][y]=next_array[x][y]
        }
    }
    //display on LEDs
	for(let x=0;x<5;x++) {
        for(let y=0;y<5;y++) {
            if (live_array[x][y] ==1) {
                led.plot(x, y)
            } else {
                led.unplot(x,y)
            }
        }
    }
})
