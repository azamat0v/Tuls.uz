/*
 a mess
*/

(function() {
  "use strict";

  /* Create the color palette on canvas */

  // Color variables
  var rotation, baseColor, secondColor, thirdColor, lightBackground;

  // Canvas variables
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    canvasWidth, canvasHeight;

  // Set canvas size
  canvasWidth = canvas.width = 80;
  canvasHeight = canvas.height = 80;

  // Helper functions
  var getRotation = function() {
    var r = document.getElementById('rotate').value;
    rotation = parseInt(r, 10);
  }

  var randomNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Here come the colors
  var Color = function(hue, sat, light) {
    // Settings
    // Play with these to change the types of colors generated
    this.minHue = 0;
    this.maxHue = 360;

    this.minSat = 75;
    this.maxSat = 100;

    this.minLight = 65;
    this.maxLight = 80;

    this.scaleLight = 15;

    // Darker colors for a light background
    if (lightBackground) {
      this.minLight = 40;
      this.maxLight = 65;
    }

    // Set hue
    this.hue = hue || randomNum(this.minHue, this.maxHue);

    // Redo if ugly hue is generated
    // Because magenta is hideous
    if (this.hue > 288 && this.hue < 316) {
      this.hue = randomNum(316, 360);
    } else if (this.hue > 280 && this.hue < 288) {
      this.hue = randomNum(260, 280);
    }

    this.sat = sat || randomNum(this.minSat, this.maxSat);
    this.light = light || randomNum(this.minLight, this.maxLight);

    this.hsl = 'hsl(' + this.hue + ', ' + this.sat + '%, ' + this.light + '%)';
  };

  // Change hue by rotation number
  Color.prototype.changeHue = function(hue, rotate) {
    return hue + rotate > this.maxHue ?
      (hue + rotate) - this.maxHue : hue + rotate;
  };

  // Scale lightness while keeping within limits
  Color.prototype.changeLight = function(light) {
    return light + this.scaleLight > this.maxLight ? this.maxLight : light + this.scaleLight;
  };

  // Now generate the three main colors of the palette
  var setColors = function(newPalette) {
    if (newPalette) {
      baseColor = new Color();
    }

    secondColor = new Color(
      baseColor.changeHue(baseColor.hue, rotation),
      baseColor.sat,
      baseColor.changeLight(baseColor.light));

    thirdColor = new Color(
      baseColor.changeHue(baseColor.hue, rotation + rotation),
      baseColor.sat,
      baseColor.changeLight(baseColor.light));
  };

  // Draw colors on canvas
  var drawColor = function(x, y, width, height, color, blendMode, alpha) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha || 1;
    ctx.globalCompositeOperation = blendMode || 'source-over';
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };

  // Draw the canvas
  var drawCanvas = function() {

    // Top color
    drawColor(0, 0, canvasWidth, canvasHeight, baseColor.hsl);

    // Middle color
    drawColor(0, canvasHeight / 3, canvasWidth, canvasHeight, secondColor.hsl);

    // Bottom color
    drawColor(0, canvasHeight / 3 + canvasHeight / 3, canvasWidth, canvasHeight, thirdColor.hsl);

    // Left color overlay (lightens with yellow)
    drawColor(0, 0, canvasWidth / 3, canvasHeight, '#fcd108', 'screen', 0.75);

    // Right color overlay (darkens with blue)
    drawColor(canvasWidth / 3 + canvasWidth / 3, 0, canvasWidth / 3, canvasHeight, '#094078', 'overlay');

    // Full color overlays (creates a cast over all colors for a more uniform, moderated look)
    drawColor(0, 0, canvasWidth, canvasHeight, '#ffcc00', 'overlay', 0.25);
    drawColor(0, 0, canvasWidth, canvasHeight, '#f13a6d', 'lighten', 0.25);
    drawColor(0, 0, canvasWidth, canvasHeight, '#092559', 'screen', 0.5);
  };

  /* Import the color palette to DOM */

  // Pick a color from canvas
  var getColor = function(x, y) {
    var rgba = ctx.getImageData(x, y, 1, 1).data;
    rgba[3] = 1; // set alpha channel from 255 to 1

    return rgba;
  };

  // Convert rgba array to hex
  var rgbToHex = function(rgb) {
    var hex = [];

    for (var i = 0; i < rgb.length - 1; i++) {
      hex[i] = rgb[i].toString(16);

      if (hex[i].length < 2) {
        hex[i] = '0' + hex[i]; // Pad with leading zero
      }
    }

    return '#' + hex.join('');
  };

  // Change text color of HTML element
  var changeElementColor = function(element, color) {
    document.querySelector(element).style.color = 'rgba(' + color.join(',') + ')';
  };

  // Now get all nine colors from canvas
  var createPalette = function() {
    var allColors = {
      c1: getColor(10, 10),
      c2: getColor(canvasWidth / 2 + 10, 0 + 10),
      c3: getColor(canvasWidth - 10, 0),

      c4: getColor(10, canvasHeight / 2 + 10),
      c5: getColor(canvasWidth / 2 + 10, canvasHeight / 2 + 10),
      c6: getColor(canvasWidth - 10, canvasHeight / 2),

      c7: getColor(10, canvasHeight - 10),
      c8: getColor(canvasWidth / 2 + 10, canvasHeight - 10),
      c9: getColor(canvasWidth - 10, canvasHeight - 10)
    };

    // And apply them to the DOM
    for (var i = 1; i < 10; i++) {
      document.getElementById('color' + i).style.backgroundColor = 'rgba(' + allColors['c' + i].join(',') + ')';
      document.querySelectorAll('.hex')[i - 1].style.color = 'rgba(' + allColors['c' + i].join(',') + ')';
      document.querySelectorAll('.hex')[i - 1].textContent = rgbToHex(allColors['c' + i]);
    }

    // And apply them to the text colors
    changeElementColor('.title', allColors.c2);
    changeElementColor('.rotate-label', allColors.c5);
    changeElementColor('#rotate', allColors.c8);

    changeElementColor('.instructions', allColors.c6);
    changeElementColor('.key1', allColors.c9);
    changeElementColor('.key2', allColors.c9);
  };

  // Run all the palette functions
  var init = function(newPalette) {
    getRotation();
    setColors(newPalette);
    drawCanvas();
    createPalette();
  };

  init('uhuh');

  /* Event listeners */

  // Input number box
  document.getElementById('rotate').addEventListener('input', function() {
    init();
  }, false);

  // Spacebar
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 32) {
      init('yehp');
      e.preventDefault();
    }
  }, false);

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 69) {
      lightBackground ? lightBackground = false : lightBackground = true;
      document.body.classList.toggle('lightBackground');

      e.preventDefault();
    }
  }, false);

}());