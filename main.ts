function CopyNextArrayToLiveArray () {
    for (let copy_x = 0; copy_x <= width - 1; copy_x++) {
        for (let copy_y = 0; copy_y <= height - 1; copy_y++) {
            live_array[copy_x][copy_y] = next_array[copy_x][copy_y]
        }
    }
}
function UpdateInkyBit () {
    inkybit.clear()
    for (let inky_x = 0; inky_x <= width - 1; inky_x++) {
        for (let inky_y = 0; inky_y <= height - 1; inky_y++) {
            if (live_array[inky_x][inky_y] == 1) {
                inkybit.drawRectangle(
                inky_x * 2,
                inky_y * 2,
                2,
                2,
                inkybit.Color.Black,
                false
                )
            }
        }
    }
    inkybit.show()
}
function CreateFlipper (flipper_x: number, flipper_y: number) {
    live_array[flipper_x + 1][flipper_y] = 1
    live_array[flipper_x + 1][flipper_y + 1] = 1
    live_array[flipper_x + 1][flipper_y + 2] = 1
}
function UpdateLEDs () {
    // display on LEDs
    for (let led_x = 0; led_x <= 4; led_x++) {
        for (let led_y = 0; led_y <= 4; led_y++) {
            if (live_array[led_x][led_y] == 1) {
                led.plot(led_x, led_y)
            } else {
                led.unplot(led_x, led_y)
            }
        }
    }
}
function CreateFlyer (flyer_x: number, flyer_y: number) {
    live_array[flyer_x][flyer_y + 1] = 1
    live_array[flyer_x + 1][flyer_y + 2] = 1
    live_array[flyer_x + 2][flyer_y + 2] = 1
    live_array[flyer_x + 2][flyer_y + 1] = 1
    live_array[flyer_x + 2][flyer_y] = 1
}
function InitArrays () {
    // build out the 2d arrays that represent the "frame" or "grid"
    for (let init_x = 0; init_x <= width - 1; init_x++) {
        let new_next_column: number[] = []
        let new_live_column: number[] = []
        for (let init_y = 0; init_y <= height - 1; init_y++) {
            new_live_column[init_y] = 0
            new_next_column[init_y] = 0
        }
        live_array[init_x] = new_live_column
        next_array[init_x] = new_next_column
    }
}
function ComputeNextArray () {
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
}
let neighbor_count = 0
let y_inc = 0
let y_dec = 0
let x_inc = 0
let x_dec = 0
let next_array: number[][] = []
let live_array: number[][] = []
let height = 0
let width = 0
// Set the width and height to be 1/2 the number of pixels for 2 reasons:
// 1. There isn't enough memory for full-sized arrays
// 2. The individual pixels are so small it doesn't look good anyway.
width = 250 / 2
height = 122 / 2
InitArrays()
CreateFlipper(1, 1)
CreateFlyer(10, 10)
basic.forever(function () {
    ComputeNextArray()
    CopyNextArrayToLiveArray()
    UpdateLEDs()
    UpdateInkyBit()
    // the inkybit.clear() takes ~11 seconds and we want to show the
    // completed scene for a reasonable amount of time. 30 seconds
    // seemed about right.
    basic.pause(30000)
})

function CreateRandomWorld () {
    for(let random_x=0;random_x<width;random_x++){
        for(let random_y=0;random_y<height;random_y++){
            live_array[random_x][random_y] = randint(0, 1)
        }
    }
    UpdateLEDs()
}

input.onButtonPressed(Button.A, function () {
    CreateRandomWorld()
})