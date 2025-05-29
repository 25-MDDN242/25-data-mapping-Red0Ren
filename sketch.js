let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile =  "input_new1.jpg";
let maskFile   =   "mask_new1.png";
let outputFile = "output_4.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);
}

function draw () {
  let num_lines_to_draw = 40; // rows to process per frame
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=0; i<1920; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      // create a color from the values (always RGB)
      let col = color(pix);
      let mask = maskImg.get(i, j);

      colorMode(HSB, 360, 100, 100);
      // draw a "dimmed" version in gray
      let h = hue(col);
      let s = saturation(col);
      let b = brightness(col);

      // highlighted mask
      if(mask[0] > 1) {
        // draw the full pixels
        let new_sat = map(s, 0, 100, 90, 100);
        let new_brt = map(b, 0, 100, 23, 100);
        let new_hue = map(h, 0, 360, 0, 5);
        let new_col = color(new_hue, new_sat, new_brt);
        set(i, j, new_col);
      }
      // background
      else {
        let new_brt = map(b, 0, 100, 0, 70); // dark
        // let new_brt = map(b, 0, 100, 100, 0); // light
        let new_col = color(h, 0, new_brt);
        // let new_col = color(h, s, b);
        set(i, j, new_col);
      }
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();
  // print(renderCounter);
  if(renderCounter > 1080) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}