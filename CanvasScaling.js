
function getWidthResolution(longSide){
  let format= document.getElementById("format").value;
  if(format ==  "2/3"){
    return(longSide*2/3)
    
  }
  else if(format == "3/4"){
    return(longSide*3/4)
  }
  else{
    return(longSide)
  }  
  
}
function getHeightResolution(longSide){
  let format= document.getElementById("format").value;
  if(format ==  "3/2"){
    return(longSide*2/3)
    
  }
  else if(format == "4/3"){
    return(longSide*3/4)
  }
  else{
    return(longSide)
  }  
}
function getCanvasWidth(){
     let format= eval(document.getElementById("format").value);
     let smallerSide;
  let result;
 
    
      
  if(VPWidth<VPHeight){
    smallerSide = "width";
    
  }
  else{
  smallerSide = "height";
    
   }
  if(smallerSide == "width"){
    result = VPWidth*0.7;
     document.getElementById("GPXUploaderWrapper").style.width = result.toString() +"px";
        return VPWidth*0.7
  }else{
    result = VPHeight*0.7*format;
     document.getElementById("GPXUploaderWrapper").style.width = result.toString() +"px";
        return VPHeight*format*0.7;
      }
      
      
    }
  function getCanvasHeight(){
     let format=eval(document.getElementById("format").value);
    
     let smallerSide;
    
      
  if(VPWidth<VPHeight){
    smallerSide = "width";
  }
  else{
  smallerSide = "height";
   }
 
      if(smallerSide == "width"){
        return VPWidth* 1/format*0.7 

        
      }else{
        return VPHeight*0.7;
      }
      
      
    
    
    
       
  
}
