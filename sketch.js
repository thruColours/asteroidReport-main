// let todayURL = 'https://api.nasa.gov/neo/rest/v1/feed/today?detail=true&api_key=IikTf9lHxDYg3tE65SLExHJhuGsf9x5Xc9g62Qsw';

let currentDate;
let yr;
let m;
let d;

let dSelect = '31';

yr = '2020';
m = '08';
d = dSelect;

currentDate = yr + '-' + m + '-' + d;

// change month here as well as above
let dateInput = '2020-08-' + dSelect;

let todayURL = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + dateInput + '&end_date=' + dateInput + '&api_key=IikTf9lHxDYg3tE65SLExHJhuGsf9x5Xc9g62Qsw';

let astHourSlice, astMinuSlice, astMiss, astSize;

let img;
let hundredMilKM_BoundaryCircRadius = 1000;

function preload() {
  img = loadImage('images/earth_white.png');
}

function setup() {
  //since the centre x,y coordinates that the asteroids are drawn
  //outwards from are dependent on canvas size, try overlaying
  //another canvas which can be repositioned, and then the main
  //canvas can be resized as required
  createCanvas(2400, 2400);
  angleMode(DEGREES);
  noLoop();
  loadJSON(todayURL,      gotData);

  // loadJSON('https://api.nasa.gov/neo/rest/v1/feed?start_date=2021-07-17&end_date=2021-07-17&detailed=false&api_key=IikTf9lHxDYg3tE65SLExHJhuGsf9x5Xc9g62Qsw',      gotData);

  img = loadImage('images/earth_white.png')

}

function gotData(data){
  console.log(data);

  let astTimes = [];
  astMiss = [];
  astSize = [];

  const asteroids = data.near_earth_objects[currentDate];
  // console.log(asteroids);
  // astCount = asteroids.length;

  asteroids.forEach((item) =>
  astTimes.push(item.close_approach_data[0].close_approach_date_full) &&
  astMiss.push(item.close_approach_data[0].miss_distance.kilometers) &&
  astSize.push(item.estimated_diameter.meters.estimated_diameter_min)
  );

  chopDate = x => x.slice(12, 14);
  astHourSlice = astTimes.map(chopDate);

  chopDatei = x => x.slice(15, 17);
  astMinuSlice = astTimes.map(chopDatei);

  // Don't pass any params to draw because it gets called by P5 from elsewhere
  // Instead look to the top of the sketch - those are now global vars that
  // can be set in this function and used in `draw()`

  // Don't do this -> draw(astHourSlice, astMinuSlice, astMiss);
  // Do this:
  redraw();
  // `noLoop()` is set in setup and then `redraw()` will make the `draw()`
  // run once more.
}

function draw() {

  background(128, 128, 128, 0);
  // background(255,255,255);

  // This is here to make sure the draw function doesn't throw an error
  // when it runs at the beginning of the sketch, before gotData has
  // returned the data you need.
  if(astHourSlice === undefined || astHourSlice.length === 0){
    console.log('no data yet')
    return;
  }

    let x = height/2;
    let y = width/2;
    let earthDiamMetersLog = log(12756000);
    let earthDiamForDisp = (earthDiamMetersLog * 2) * 2;
    let earthRadiusForDisp = earthDiamForDisp/2;
    let earthToMoonKM = 384400;
    let earthToMoonDist = map(earthToMoonKM, 0, 100000000, 0, 500);
    let moonDiamMetersLog = log(3475000);
    let moonDiamForDisp = moonDiamMetersLog * 2;

    // 100,000,000 km boundary
    // stroke(255, 255, 255);
    // strokeWeight(0.5);
    noFill();
    // fill(20, 20, 20);
    // fill(200, 200, 200);
    noStroke();
    circle(width/2, height/2, (2000 + earthRadiusForDisp));

    // moon orbit
    // stroke(255, 248, 220);
    // circle(width/2, height/2, earthToMoonDist + earthDiamForDisp);
  
    // moon body
    // let moonOrbitEdgeDrawPoint = earthToMoonDist + earthRadiusForDisp;
    // let moonRadiusForDisp = moonDiamForDisp/2;
    // fill(255, 248, 220);
    // circle(x, y - (earthToMoonDist + earthRadiusForDisp + moonRadiusForDisp), moonDiamForDisp);
    

  // So you now have the three global vars set at the top and you can use
  // them to make a loop. I'm using the length of `astHourSlice` because it's
  // the first one I saw and I assume all those arrays will have the same length.

  for(let i = 0; i < astHourSlice.length; i++){
    // Pulling each item out of the arrays and assigning them to the
    // the variable names you are using previously.
    let hr = astHourSlice[i];
    let min = astMinuSlice[i];
    let astDist = astMiss[i];
    let astSiize = astSize[i];

    const angle = calculateAngle(hr,min) - 90;
    // const indicatorAngle = calculateAngle(hr,min);
    // console.log("ind. angle:" + indicatorAngle);

    const circDiam = calculateSize(astSiize);
    // console.log(circDiam);
    
    // added circDiam/2 (circ radius) to distance as to draw circle/asteroid from edge
    const distance = calculateDist(astDist) + circDiam/2;
    // console.log("calculated distance:" + distance);

    var dx = distance * cos(angle);
    var dy = distance * sin(angle);

    //colours for ast dots
    const colAngle = calculateAngle(hr,min);
    // console.log('colAngle:' + colAngle);
    let colAngleMap = map(colAngle, 0, 360, 100, 255);

    const colDistance = calculateDist(astDist);
    // console.log('colDist:' + colDistance);
    const colCircDiam = calculateSize(astSiize)*12;
    // console.log('colCirc:' + colCircDiam);

    //fill(colAngleMap, (colDistance/2), colCircDiam/2);
    
    //for black background
    // fill((colAngleMap*2), (colDistance), (colCircDiam));
    
    //for white background
    fill((colAngleMap), (colDistance/4), (colCircDiam/1.5)/1.5);
    // fill((colAngleMap), (colDistance/4), (colCircDiam/1.5));
    
    // fill(250,250,250);
    
    noStroke();
    circle(x + dx, y + dy, circDiam);

  }
  
  //Earth
  noStroke();
  // fill(255, 255, 255);
  fill(0, 0, 0);
  circle(width/2, height/2, earthDiamForDisp);
  imageMode(CENTER);
  image(img, width/2, (height/2) -1, earthDiamForDisp + 5, earthDiamForDisp - 1);
  // image(img, width/2, height/2, earthDiamForDisp + 1, earthDiamForDisp + 1);
  
  // dayInMonthRing ();
  // monthInYearRing();
  keyTyped();
}


function calculateAngle (h,m) {
  const hourVar = 15;

  mi = (m/60) * 100;
  minu = (mi/100) * 15;

  timeAng = minu + (h * hourVar);
  return timeAng;
}

function calculateDist (closeApproach) {

  let earthDiamMetersLog = log(12756000);
  let earthDiamForDisp = (earthDiamMetersLog * 2) * 2;
  let earthRadiusForDisp = earthDiamForDisp/2;

  let mapDistance = map(closeApproach, 0, 100000000, 0, hundredMilKM_BoundaryCircRadius);
  return mapDistance + earthRadiusForDisp;
}

function calculateSize (minSize) {
  size = (log(minSize) * 2) * 2;
  return size;
}

// function mouseClicked(){
//   // save('2021-07-17' + 'tri');
//   save(currentDate);
//   // redraw();
// }

function keyTyped() {
  if (key === 'a') {
      save(currentDate + ' ' + '24k');
  } else {
    
  }
}
