/** Samson Close
    Assignment 2 - Interactive Toy
    September 23, 2020
    
    It's Flipping Pancake Time!
    
    Click to flip pancakes, catch them on your plate!
    
    
   PSEUDO CODE:
   
   - Plate and hand follow mouseX
   - Pan jumps up when mouse clicked
   - Pancake slides across pan, accelerating
   - Pancake Y velocity set very high when pan tosses it
     - Y velocity is relative to the X velocity
   - Flying pancake affected by gravity acceleration
   - If pancake is near the top pancake vertically, and is within a range of the center of the top pancake
     - Then add the pancake to the stack
   - Push stack and plate down on screen when stack gets too high
   - Display score of pancakes in top left
   
*/

let framerate = 60;

let targetX = 250;

let originalPlateLevel = 300;
let plateLevel = originalPlateLevel;
let plateRadius = 50;

let highestStackY = 110; // The highest pancake Y value permitted before lowering the plate

let pancakeHeight = 10;
let pancakeRadiusDisplay = 30;
let pancakeRadiusHitbox = 25;

let pancakes = 1; // Always begin with 1 pancake to start

let minCatchX = 170;
let maxCatchX = 350;

let panTopLevel = 360;
let panHeight = 20;
let panRadius = 100;
let panAnimation = 100;

let pancakeAccelerationPan = 250 / framerate; // 200 pixels / second^2
let pancakeAccelerationGravity = 1700 / framerate; // 200 pixels / second^2
let pancakeVelocityX = 100;
let pancakeVelocityY = 0;
let pancakeX = -pancakeRadiusDisplay;
let pancakeY = panTopLevel;
let pancakeFlying = false;

let lost = false;
let firstStart = true;

// Target y is plateLevel - bunHeight

// Setup window
function setup() {
  createCanvas(400, 400);
  frameRate(framerate);
  rectMode(CENTER); // Rect mode to center
  ellipseMode(CENTER); // Ellipse mode to center
  
  // Load Amiri-Slanted as the font
  textFont(loadFont("Amiri-Slanted.ttf"));
}

function resetGame() {
  resetPancake();
  pancakes = 1;
  plateLevel = originalPlateLevel;
}

function resetPancake() {
  pancakeVelocityX = 100;
  pancakeVelocityY = 0;
  pancakeX = -pancakeRadiusDisplay;
  pancakeY = panTopLevel;
  pancakeFlying = false;
}

// Get the centerX OFFSET for the i-th pancake in the stack (between -10 and 10)
function getPancakeOffset(i) {
  // Some seed. This will always be the same so that each time the image is drawn, the pancake variance remains the same with each loop
  randomSeed(12345);
  
  // Start at 1 because we want to save the final random() call for the return
  for (let j = 1; j < i; j++) {
    random(-10, 10);
  }
  
  return random(-10, 10);
}

// Draw the art
function draw() {
  
  if (lost) {
    
    
    fill(0, 0, 0);
    textSize(50);
    text("Stacked", 100, 50);
    text(pancakes, 180, 50);
    text("Pancakes", 90, 50);
    
  } else if (firstStart) {
    // First time starting up the game
    
  } else {
    // In-Game
  
    //////////////////// Game math ////////////////////
    
    // Makes the plate move down gradually rather than teleporting
    let plateTravelDistance = max(0, (pancakes * pancakeHeight) - (plateLevel - highestStackY));
    plateLevel = plateLevel + (plateTravelDistance * 0.05);
    
    // Where the user's currently trying to catch the pancake
    targetX = min(max(mouseX, minCatchX), maxCatchX);
    let targetY = plateLevel - (pancakes * pancakeHeight);
    
    // Make the pancake go into a flying state if it falls off the side of the pan
    if (pancakeX - pancakeRadiusHitbox > panRadius || pancakeFlying) {
      pancakeFlying = true;
    }
    
    if (pancakeFlying) {
    // Affect the pancake by gravity if it's off the pan
      pancakeVelocityY += pancakeAccelerationGravity;
    } else {
    // Accelerate the pancake if it's on the pan
      pancakeVelocityX += pancakeAccelerationPan;
    }
    pancakeX += (pancakeVelocityX / 60);
    pancakeY += (pancakeVelocityY / 60);
    
    // If the pancake has landed on the top pancake
        // If the difference between the top pancake center X and the flying pancake center X is less than the hitbox threshold
    if (abs(targetX + getPancakeOffset(pancakes) - pancakeX) <= pancakeRadiusHitbox
        // And if the difference between the top pancake Y and the flying pancake Y is less than the velocity
        // (this means that the faster the pancakes are falling, the more of an assist the player will have for catching it)
     && abs(targetY - pancakeY) <= abs(pancakeVelocityY / framerate)
        // And if the pancake is falling DOWN, not going UP
     && pancakeVelocityY >= 0) {
      // Catch the pancake
      pancakes++;
      resetPancake();
    }
    // If the pancake has fallen off the bottom of the screen
    else if (pancakeY - pancakeHeight > 400) {
      lost = true;
    }
  }
  
  //////////////////// Background ////////////////////
    
  background(244, 244, 244); // White
  
  //////////////////// Butler hand ////////////////////
  
  // Fingers, back to front
  
  fill(237, 192, 147); // Skin colour 1 (dark shadow)
  quad(targetX - 15, plateLevel + 10, 
       targetX - 5 , plateLevel + 10,
       targetX + 15, plateLevel + 30,
       targetX + 5 , plateLevel + 30);
  fill(240, 194, 151); // Skin colour 2 (shadow)
  quad(targetX - 30, plateLevel + 10, 
       targetX - 20, plateLevel + 10,
       targetX + 5 , plateLevel + 30,
       targetX - 5 , plateLevel + 30);
  fill(247, 203, 161); // Skin colour 3 (lighter shadow)
  quad(targetX - 20, plateLevel + 10, 
       targetX - 10, plateLevel + 10,
       targetX + 10, plateLevel + 30,
       targetX     , plateLevel + 30);
  fill(255, 213, 173); // Skin colour 4 (regular)
  quad(targetX - 20, plateLevel + 10, 
       targetX - 10, plateLevel + 10,
       targetX + 5 , plateLevel + 30,
       targetX - 5 , plateLevel + 30);
  // Thumb
  fill(255, 213, 173); // Skin colour 4 (regular)
  quad(targetX + 20, plateLevel + 10, 
       targetX + 30, plateLevel + 10,
       targetX + 25, plateLevel + 30,
       targetX + 15, plateLevel + 30);
       
  // Palm
  fill(255, 213, 173); // Skin colour 4 (regular)
  quad(targetX - 5 , plateLevel + 30, 
       targetX + 25, plateLevel + 30,
       targetX + 25, plateLevel + 45,
       targetX     , plateLevel + 40);
       
  // Wrist
  fill(255, 213, 173); // Skin colour 4 (regular)
  quad(targetX     , plateLevel + 30, 
       targetX + 50, plateLevel + 28,
       targetX + 50, plateLevel + 50,
       targetX + 10, plateLevel + 43);
       
  // White Sleeve
  fill(255, 255, 255); // White
  quad(500         , plateLevel + 38, 
       targetX + 50, plateLevel + 28,
       targetX + 50, plateLevel + 52,
       500         , plateLevel + 62);
       
  // Black Sleeve
  fill(50, 50, 70); // Blackish Blue
  quad(500         , plateLevel + 35, 
       targetX + 60, plateLevel + 25,
       targetX + 60, plateLevel + 55,
       500         , plateLevel + 65);
       
  // Sleeve buttons
  fill(200, 200, 200); // grey
  ellipse(targetX + 70, plateLevel + 35, 8, 8);
  ellipse(targetX + 80, plateLevel + 35, 8, 8);
  
  
  //////////////////// Pan ////////////////////
  
  let panY = panTopLevel + (panHeight / 2);
  
  // Makes the pan bounce up to throw the pancake up
  if (panAnimation < 25) {
    panY -= 35 * sin(panAnimation * 0.04 * PI);
    panAnimation++;
  }
  
  fill(40, 40, 50);
  rect(0, panY, panRadius * 2, panHeight);
  
  //////////////////// Sliding Pancake ////////////////////
  
  drawPancake(pancakeX, pancakeY);
  
  //////////////////// Plate ////////////////////
 
  fill(255, 255, 255);
  stroke(155, 155, 155);
  strokeWeight(2);
  quad(targetX - plateRadius     , plateLevel, 
       targetX + plateRadius     , plateLevel, 
       targetX + plateRadius - 20, plateLevel + 10, 
       targetX - plateRadius + 20, plateLevel + 10);
  noStroke();
       
  //////////////////// Pancake stack ////////////////////
  
  for (let i = 0; i < pancakes; i++) {
    if (i == 0) {
      // Initial pancake (always centered on the plate)
      drawPancake(targetX                      , plateLevel - (i * pancakeHeight));
    } else {
      // Give the other pancakes a random x variance from -10 to 10
      drawPancake(targetX + getPancakeOffset(i), plateLevel - (i * pancakeHeight));
    }
  }
  
  //////////////////// Score ////////////////////
  
  if (!firstStart && !lost) {
    fill(0, 0, 0);
    textSize(50);
    text(pancakes, 50, 50);
  }
  
  //////////////////// Menu Text ////////////////////
  
  if (lost) {
    // Display the losing screen
    fill(0, 0, 0);
    textSize(50);
    text("Stacked", 130, 50);
    text(pancakes, 180, 100); // Display score
    text("Pancakes", 120, 150);
    
    text("Left click", 120, 300);
    text("to restart", 112, 350);
    
  } else if (firstStart) {
    // Display the initial instructions
    fill(0, 0, 0);
    textSize(50);
    text("Left click to", 100, 50);
    text("launch pancakes!", 60, 100);
    
    text("Left click", 120, 300);
    text("to start", 135, 350);
  }
}

function drawPancake(centerX, bottomY) {
  
  fill(214, 174, 43); // Pancake OUTSIDE colour
  quad(centerX - pancakeRadiusDisplay, bottomY, 
       centerX + pancakeRadiusDisplay, bottomY, 
       centerX + pancakeRadiusDisplay, bottomY - pancakeHeight, 
       centerX - pancakeRadiusDisplay, bottomY - pancakeHeight);
       
  fill(255, 214, 79); // Pancake INSIDE colour
  quad(centerX - pancakeRadiusDisplay + 2, bottomY - 2, 
       centerX + pancakeRadiusDisplay - 2, bottomY - 2, 
       centerX + pancakeRadiusDisplay - 2, bottomY - pancakeHeight + 2, 
       centerX - pancakeRadiusDisplay + 2, bottomY - pancakeHeight + 2);
}

// Shoot the pancake when the mouse is pressed
function mousePressed() {
  if (lost || firstStart) {
    // On menu or losing screen, begin game on left click
    lost = false;
    firstStart = false;
    resetGame();
  }
  // If the pancake isn't already flying
  else if (!pancakeFlying) {
    // Make if fly
    pancakeFlying = true;
    // Pancake flies off the pan at a y speed relative to the x speed
    pancakeVelocityY = -(pancakeVelocityX - 50) * 5;
    // Begin the pan animation
    panAnimation = 0;
  }
}
