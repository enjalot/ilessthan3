//ascii artify. from: http://thecodeplayer.com/walkthrough/cool-ascii-animation-using-an-image-sprite-canvas-and-javascript

/* stupid cross domain security policy

*/


var asciiScale = d3.scale.ordinal()
.domain(['Q', '0', "o", "x" ,"."])
//.range([0, 50, 75, 100, 121, 150, 175, 200, 225, 255])
//.domain(['周', '能', '彦', '弟', '哥', '有', "不", "大", "又", "一" ,"。"].reverse())
.range([0, 50, 121, 150, 175, 200, 225, 255])
.domain(['周', '能', '彦', '弟', '哥', '有', "大", "一" ,"。"].reverse())

//.range([0, 50, 127, 150, 175, 200, 230, 250, 255])

var colorScale = d3.scale.linear()
.interpolate(d3.interpolateHsl)
.range(["#FF2727", "#03750C", "#00AD53"])

//var img = document.getElementById("theimage");
//var W = img.width;
//var H = img.height;
var W;
var H;

//temporary canvas for pixel processing
var tcanvas = document.createElement("canvas");
tcanvas.width = W;
tcanvas.height = H; //same as the image
var tc = tcanvas.getContext("2d");
//painting the canvas white before painting the image to deal with pngs
tc.fillStyle = "white";
tc.fillRect(0, 0, W, H);


var display = d3.select("#display")
display.node().appendChild(tcanvas)
//drawing the image on the canvas
//tc.drawImage(img, 0, 0, W, H);

var img = new Image();
img.onload = function() {
  W = img.width;
  H = img.height;
  tcanvas.width = W;
  tcanvas.height = H; //same as the image
  tc.drawImage(img, 0, 0);
  console.log("img dims", img.width, img.height);
  var data = tc.getImageData(0,0,W, H); //chrome will not fail
  //console.log("W,H", W,H);
  render(data)
}
//img.src="nate_small.png"
img.src="nate_hackeysack_small.png"

function render(pixels) {
  //accessing pixel data
  //var pixels = tc.getImageData(0, 0, W, H);
  var colordata = pixels.data;

  //every pixel gives 4 integers -> r, g, b, a
  //so length of colordata array is W*H*4
  var ascii = document.getElementById("ascii");
  asciiScale.invert = function(x) {
     return this.domain()[d3.bisect(this.range(), x) - 1];
  }
  //console.log(asciiScale.invert(212));
  
  var factor = 4;
  //some variables
  var r, g, b, gray;
  var character, line = "";
  
  var data = []  
  for(var i = 0; i < colordata.length; i = i+4)
  {
      r = colordata[i];
      g = colordata[i+1];
      b = colordata[i+2];
      a = colordata[i+3]
      //converting the pixel into grayscale
      gray = r*0.2126 + g*0.7152 + b*0.0722;
      data.push({r: r, g:g, b:b, a:a, gray: gray});
  }

  colorScale.domain([0, data.length]);
  display.select("#ascii").selectAll("p")
  .data(data)
  .enter()
  .append("p")
  .text(function(d) {
    return asciiScale.invert(d.gray);
  })
  .style({
    "clear": function(d,i) {
      if(i != 0 && i%W == 0)
        return "left";
    },
    "color": function(d,i) {
      //return "rgba(" + [d.r, d.g, d.b, d.a] + ")";
      return colorScale(i);
    }
  })
}
