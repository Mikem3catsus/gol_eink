/**
 * Sorry about the variable names. May come back
 * 
 * and rename everything after the conversion
 * 
 * between blocks and javascript changed names and
 * 
 * formatting significantly.
 */
let neighbor_count = 0
let y_inc = 0
let y_dec = 0
let x_inc = 0
let x_dec = 0
let x = 0
let y = 0
// Set the width and height to be 1/2 the number of pixels for 2 reasons:
// 1. There isn't enough memory for full-sized arrays
// 2. The individual pixels are so small it doesn't look good anyway.
let width = 250 / 2
let height = 122 / 2
// Set some values so the typing works
let live_array = [[0, 0], [0, 0]]
let next_array = [[0, 0], [0, 0]]
// build out the 2d arrays that represent the "frame" or "grid"
for (let index = 0; index <= width - 1; index++) {
    let column2: number[] = []
    let column: number[] = []
    for (let index2 = 0; index2 <= height - 1; index2++) {
        column[index2] = 0
        column2[index2] = 0
    }
    live_array[index] = column
    next_array[index] = column2
}
// build a flipper
live_array[2][2] = 1
live_array[2][1] = 1
live_array[2][3] = 1
// and a flyer that will eventually crash into the flipper
live_array[11][10] = 1
live_array[12][11] = 1
live_array[13][11] = 1
live_array[13][10] = 1
live_array[13][9] = 1
basic.forever(function () {
    // Compute the next frame
    for (let x2 = 0; x2 <= width - 1; x2++) {
        for (let y2 = 0; y2 <= height - 1; y2++) {
            // Javascript doesn't % negative numbers to positive numbers, so
            // we have to do this "the hard way" with if statements.
            x_dec = x2 - 1
            if (x_dec == -1) {
                x_dec = width - 1
            }
            x_inc = (x2 + 1) % width
            y_dec = y2 - 1
            if (y_dec == -1) {
                y_dec = height - 1
            }
            y_inc = (y2 + 1) % height
            neighbor_count = live_array[x_dec][y_dec] + live_array[x_dec][y2] + live_array[x_dec][y_inc]
            neighbor_count += live_array[x2][y_dec] + live_array[x2][y_inc]
            neighbor_count += live_array[x_inc][y_dec] + live_array[x_inc][y2] + live_array[x_inc][y_inc]
            if (neighbor_count == 3 || neighbor_count == 2 && live_array[x2][y2] == 1) {
                next_array[x2][y2] = 1
            } else {
                next_array[x2][y2] = 0
            }
        }
    }
    // copy next frame to current frame
    for (let x3 = 0; x3 <= width - 1; x3++) {
        for (let y3 = 0; y3 <= height - 1; y3++) {
            live_array[x3][y3] = next_array[x3][y3]
        }
    }
    // display on LEDs
    for (let x4 = 0; x4 <= 4; x4++) {
        for (let y4 = 0; y4 <= 4; y4++) {
            if (live_array[x4][y4] == 1) {
                led.plot(x4, y4)
            } else {
                led.unplot(x4, y4)
            }
        }
    }
    // display on eink
    inkybit.clear()
    for (let x5 = 0; x5 <= width - 1; x5++) {
        for (let y5 = 0; y5 <= height - 1; y5++) {
            if (live_array[x5][y5] == 1) {
                inkybit.drawRectangle(
                x5 * 2,
                y5 * 2,
                2,
                2,
                inkybit.Color.Black,
                false
                )
            }
        }
    }
    inkybit.show()
    // the inkybit.clear() takes ~11 seconds and we want to show the
    // completed scene for a reasonable amount of time. 30 seconds
    // seemed about right.
    basic.pause(30000)
})
