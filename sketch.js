let lastPoint;
let TracksAsCoord;
let Track;
let Trackpoints;
let TrackWidth;
let LayerHeight;
let LayerWidth;
let MinX;
let MaxX;
let MinY;
let MaxY;
let GlobalMappingFactor;
let Padding;
let TrackLayer;
let UplaodButton;
let height;
let width;
let changeTitle;
let TitleLayer;
let MaxResolution;
let Zoom;
let LocationX;
let LocationY;
let LocationName;
let LocationFontSize;
let RegionX;
let RegionY;
let RegionName;
let RegionFontSize;
let Roboto;


function setup() {

  MaxResolution= 2000;
  LayerHeight =getHeightResolution(MaxResolution);
  LayerWidth = getWidthResolution(MaxResolution);
  var canvas = createCanvas(windowWidth,windowWidth)
  canvas.parent("sketch-holder");
  background(255);
  TrackLayer = createGraphics(LayerWidth,LayerHeight);
  TrackLayer.background(255);
  TitleLayer= createGraphics(LayerWidth ,LayerHeight);
  TitleLayer.background(255);
 
  TracksAsCoord = [];
  Padding =  document.getElementById("Padding").value;
  Zoom =  document.getElementById("Zoom").value;  
  TrackWidth =  document.getElementById("TrackWidth").value;
  LocationX = 150;
  LocationY = 1250;
  windowResized();
  LocationFontSize =150;
  RegionX = 150;
  RegionY = 1350;
  RegionFontSize = 100;
  LocationName = "Location";
  

  RegionName = "[Region]";

  
  
  TitleLayer.textFont("Roboto")
 
  UploadButton = select("#DownloadButton")
  mergeLayers();



 



  
   
}
function windowResized(){
  resizeCanvas(getCanvasWidth(),getCanvasHeight())
  image(TitleLayer,0, 0,getCanvasWidth(),getCanvasHeight());
  
  
}
 function OnChangedFormat(){
  LayerHeight =getHeightResolution(MaxResolution);
  LayerWidth = getWidthResolution(MaxResolution);
  LocationY = LayerHeight*5/6;
  RegionY = LocationY+100;
 
  TrackLayer.resizeCanvas(LayerWidth,LayerHeight);
  TitleLayer.resizeCanvas(LayerWidth,LayerHeight);
  resizeCanvas(getCanvasWidth(),getCanvasHeight())
  drawCanvas();
     
 }



function latLonToCoord(TrackArray){
  let Tracks =[];
  for(let k = 0; k<TrackArray.length; k++){
  let Coordinates = [] ;
  
  for(let i =0 ;i<TrackArray[k].length;i++){
  
    let lat = TrackArray[k][i][0];
    let lon = TrackArray[k][i][1];
    Coordinates.push(getMercatorCoord(lat,lon));
    
  
 
  }
    Tracks.push(Coordinates)
  }
  
  return Tracks; 
}


function getMercatorCoord(lat,lon){
  let RadLatitude = lat*PI/180;
  let RadLongitude =  lon*PI/180;
  let x = RadLongitude;
  let y = log(tan((PI/4)+ 0.5 * RadLatitude))
  return createVector(x,y)
}

function findMax(Array,Value){
  let Max = -Infinity;
  for(let k = 0;k<Array.length;k++){
    for(let i =0 ; i< Array[k].length;i++){
      if(Array[k][i][Value]> Max){
      Max = Array[k][i][Value]
      }
    }
  }
  return(Max);
}
function findMin(Array,Value){
  
  let Min = Infinity;
  for(let k = 0;k< Array.length;k++)
  for(let i =0 ; i< Array[k].length;i++){
    if(Array[k][i][Value]< Min){
      Min = Array[k][i][Value]
   
    }
  }
  
  return(Min);
}
function getGlobalMappingFactor(){
  let XFactor = LayerWidth / (MaxX-MinX);
  let YFactor = LayerHeight/ (MaxY-MinY);
  if(XFactor<YFactor){ 
    GlobalMappingFactor = XFactor * Zoom * 0.99;
  }else{
    GlobalMappingFactor = YFactor * Zoom * 0.99;
  }
  
}

function prepareDrawing(TrackArray) {
  TracksAsCoord = latLonToCoord(TrackArray)
  
  MinX = findMin(TracksAsCoord,"x")
  MinY = findMin(TracksAsCoord,"y")
  MaxX = findMax(TracksAsCoord,"x")
  MaxY = findMax(TracksAsCoord,"y")
  for(let k = 0; k<TracksAsCoord.length;k++)
    for(let i = 0; i<TracksAsCoord[k].length;i++){
      TracksAsCoord[k][i].x = TracksAsCoord[k][i].x - MinX;
      TracksAsCoord[k][i].y =TracksAsCoord[k][i].y -MinY;
    }
  
  drawCanvas();
  
  
}
function centerX(){
  return((LayerWidth-MaxX*GlobalMappingFactor +MinX *GlobalMappingFactor)/2)
}

function centerY(){
  return((LayerHeight-MaxY*GlobalMappingFactor +MinY *GlobalMappingFactor)/2)
}

function saveImage(){
 
    TitleLayer.save(document.getElementById("fname").value);
  
  
}

async function drawCanvas(){

  await printLoading();
  Zoom =  document.getElementById("Zoom").value;
  TrackWidth =  document.getElementById("TrackWidth").value;
  TrackLayer.background(255);
  getGlobalMappingFactor();
  let displacementX = centerX();
  let displacementY = centerY()
  for(let k = 0; k<TracksAsCoord.length;k++){
    lastPoint = TracksAsCoord[k][0];
    for(let i = 1; i<TracksAsCoord[k].length;i++){
       TrackLayer.strokeWeight(TrackWidth)
      TrackLayer.line(lastPoint.x *GlobalMappingFactor + displacementX,
          LayerHeight-lastPoint.y * GlobalMappingFactor-displacementY,
           TracksAsCoord[k][i].x * GlobalMappingFactor + displacementX,
           LayerHeight-TracksAsCoord[k][i].y * GlobalMappingFactor - displacementY)
      lastPoint=TracksAsCoord[k][i];
    }
  }
  
  mergeLayers()
  document.getElementById("Status").style.color = 'black';
  document.getElementById("Status").innerHTML = "Status: Finished!"
  
   
  
}
function printLoading(){
return new Promise((resolve, reject)=>{
  document.getElementById("Status").style.color = 'red';
  document.getElementById("Status").innerHTML = "Status: Loading..."
   setTimeout(resolve, 100)
})
   }
function mergeLayers(){

  Padding =  document.getElementById("Padding").value;
  background(255);
  TitleLayer.background(255);
  
  TitleLayer.image(TrackLayer,(1-Padding)*LayerWidth/2, (1-Padding)*LayerHeight/2,LayerWidth*Padding,LayerHeight*Padding);
  TitleLayer.textSize(LocationFontSize);

  TitleLayer.text(LocationName,LocationX,LocationY);
  TitleLayer.textSize(RegionFontSize);
  
  TitleLayer.text(RegionName,RegionX,RegionY)
  

  image(TitleLayer,0,0,getCanvasWidth(),getCanvasHeight());
  
}
function changeTextfields(){

  let radios = document.getElementsByName('LorR');
  if(radios[0].checked){
    LocationX = document.getElementById("xCoord").value;
    LocationY = document.getElementById("yCoord").value;
    LocationName = document.getElementById("name").value;
    LocationFontSize = parseInt(document.getElementById("fSize").value);

   
  }
  else{
    RegionX = document.getElementById("xCoord").value;
    RegionY = document.getElementById("yCoord").value;
    RegionName = document.getElementById("name").value;
    RegionFontSize = parseInt(document.getElementById("fSize").value);
    
  }
mergeLayers()
}
function radioboxListener(){
  let radios = document.getElementsByName('LorR');
  if(radios[0].checked){
    document.getElementById("xCoord").value = LocationX;
    document.getElementById("yCoord").value = LocationY;
    document.getElementById("name").value = LocationName;
    document.getElementById("fSize").value = LocationFontSize;
  }
  else{
    document.getElementById("xCoord").value = RegionX;
    document.getElementById("yCoord").value = RegionY;
    document.getElementById("name").value = RegionName;
    document.getElementById("fSize").value = RegionFontSize;
  }
    
    
  
  
}
 

