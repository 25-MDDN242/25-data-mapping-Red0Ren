let sourceImg = null;
let maskImg = null;
let renderCounter = 0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  // console.log(p5.Renderer2D);

}
function setup() {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
// DEFAULT
  // background(255, 0, 0);
// EXAMPLE
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  // pixel overlay
  // for(let i=0;i<4000;i++) { // drawing  a limit of 3999 "dots"
  //   let x = floor(random(sourceImg.width));
  //   let y = floor(random(sourceImg.height));
  //   let pixData = sourceImg.get(x, y);
  //   let maskData = maskImg.get(x, y);
  //   fill(pixData);
  //   if(maskData[0] > 128) {
  //     let pointSize = 10;
  //     ellipse(x, y, pointSize, pointSize);
  //   }
  //   else {
  //     let pointSize = 20;
  //     rect(x, y, pointSize, pointSize);
  //   }
  // }

  // Gray background
  let j = renderCounter;
  // get one scanline
  for (let i = 0; i < 1920; i++) {
    let pix = sourceImg.get(i, j);
    let mask = maskImg.get(i, j);
    if (mask[0] > 128) {
      // draw the full pixels
      set(i, j, pix);
    }
    else {
      // draw a "dimmed" version in gray
      let gray_color = 54 + pix[1] / -100;// limit: (-25 - 253) + pix[1] / 
      set(i, j, gray_color);
    }
  }
  updatePixels();
  
  renderCounter = renderCounter + 1;
  if (renderCounter > 1080) {
    // if(renderCounter > 10) {
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
