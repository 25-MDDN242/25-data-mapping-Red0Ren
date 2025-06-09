// Global variables for images
let sourceImg = null; // This will store the input image
let maskImg = null;   // This will store the mask image (used for filtering)

// File paths for input and output
let sourceFile = "input_3.jpg";     // Input image file
let maskFile   = "mask_3.png";      // Greyscale or colour mask used to filter/select parts of the image
let outputFile = "output_test.png"; // Name of the output file if saved

// Variables to store the centre and size of the largest mask region
let maskCenter = null;
let maskCenterSize = null;

// Load images before setup runs
function preload() {
  sourceImg = loadImage(sourceFile); // Load input image
  maskImg = loadImage(maskFile);     // Load mask image
}

function setup () {
  // Create and attach the canvas
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);     // Draw images centred on their coordinates
  noStroke();            // No stroke for shapes
  background(0, 0, 108); // Set background colour (R,G,B) — a dark blue

  // Prepare pixel data from images for access
  sourceImg.loadPixels();
  maskImg.loadPixels();

  // Use HSB mode for better control of colour adjustments later
  colorMode(HSB);

  // Find the main area of the mask
  maskCenterSearch(20); // Only consider areas larger than 20 pixels wide/tall
}

// Canvas dimensions and drawing control
let X_STOP = 1920; // Width of image
let Y_STOP = 1080; // Height of image
let OFFSET = 20;   // Buffer for positioning

// This function scans the mask image to find the centre of the largest masked area
function maskCenterSearch(min_width) {
  let max_up_down = 0;     // Tallest vertical masked area
  let max_left_right = 0;  // Widest horizontal masked area
  let max_x_index = 0;     // X position of the largest vertical band
  let max_y_index = 0;     // Y position of the largest horizontal band

  // First: scan rows top to bottom to find widest band
  print("Scanning mask top to bottom...");
  for (let j = 0; j < Y_STOP; j++) {
    let mask_count = 0;
    for (let i = 0; i < X_STOP; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {  // Check green channel — marks mask presence
        mask_count++;
      }
    }
    if (mask_count > max_left_right) {
      max_left_right = mask_count;
      max_y_index = j;
    }
  }

  // Second: scan columns left to right to find tallest band
  print("Scanning mask left to right...");
  for (let i = 0; i < X_STOP; i++) {
    let mask_count = 0;
    for (let j = 0; j < Y_STOP; j++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) {
        mask_count++;
      }
    }
    if (mask_count > max_up_down) {
      max_up_down = mask_count;
      max_x_index = i;
    }
  }

  print("Scanning mask done!");

  // Save the mask region only if it’s above minimum size
  if (max_left_right > min_width && max_up_down > min_width) {
    maskCenter = [max_x_index, max_y_index];
    maskCenterSize = [max_left_right, max_up_down];
  }
}

// Counter to draw the image in batches
let renderCounter = 0;

function draw () {
  angleMode(DEGREES); // Just in case you use rotation (not used here)

  let num_lines_to_draw = 40; // Draw 40 scan lines per frame (horizontal)

  // For each row j between renderCounter and the next 40 rows
  for (let j = renderCounter; j < renderCounter + num_lines_to_draw && j < Y_STOP; j++) {
    for (let i = 0; i < X_STOP; i++) {
      colorMode(RGB);           // Work in RGB colour mode
      let mask = maskImg.get(i, j); // Get pixel from mask image

      let pix;
      if (mask[1] < 128) {
        // If green channel is low, just use original image pixel
        // pix = sourceImg.get(i, j);
        let new_brt = map(b, 0, 100, 0, 70); // dark
        // let new_brt = map(b, 0, 100, 100, 0); // light
        let new_col = color(h, 0, new_brt);
        // let new_col = color(h, s, b);
        pix = set(i, j, new_col);
      }
      else {
        // If green channel is high (masked), apply scanline effect
        if (j % 2 == 0) {
          pix = [252, 132, 3, 100]; // Orange scanline pixel (RGBA)
        }
        else {
          pix = sourceImg.get(i, j); // Otherwise, use original
        }
      }

      set(i, j, pix); // Draw pixel to canvas
    }
  }

  renderCounter += num_lines_to_draw; // Move down 40 rows per frame
  updatePixels(); // Update the canvas with the changed pixels

  // If mask centre is found, draw visual guide
  if (maskCenter !== null) {
    strokeWeight(5);
    stroke(255, 0, 0); // Red stroke

    // Crosshair at mask centre
    line(maskCenter[0] - 10, maskCenter[1], maskCenter[0] + 10, maskCenter[1]);
    line(maskCenter[0], maskCenter[1] - 10, maskCenter[0], maskCenter[1] + 10);

    // Rectangle outlining the mask region
    noFill();
    let mcw = maskCenterSize[0];
    let mch = maskCenterSize[1];
    rect(maskCenter[0] - mcw / 2, maskCenter[1] - mch / 2, mcw, mch);
  }

  // Stop drawing once the image is fully rendered
  if (renderCounter > Y_STOP) {
    console.log("Done!");
    noLoop(); // Stop calling draw()

    // Optionally save the result as an image
    // saveArtworkImage(outputFile);
  }
}

// Press '!' key to save images using external function
function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
