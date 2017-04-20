function visXY(inData1, inData2, inMode, captation, inPointSize, inGridType, inGridSteps){

	//access canvas
	var canvas = document.getElementById("PlottingSpace");
	var ctx = canvas.getContext("2d");

	//parameters
	var Rand = 40;
	var GroesseX = canvas.width;
	var GroesseY = canvas.height;

	var DataLimitX = Math.max.apply(Math, inData1) * 1.1;
	var DataLimitY = Math.max.apply(Math, inData2) * 1.1;
	
	//transform coordinates
	var CoordinateTransform = function(inAData, inWhichAxis){
		
		var outAData = inAData;
		var iRange = Math.max.apply(Math, outAData) * 1.1;
		
		if(inWhichAxis == 1){ //x axis
			ScaleFactor = (canvas.width - 2 * Rand) / iRange;
			for(i = 0; i < outAData.length; i++){
				outAData[i] = Math.round(ScaleFactor * outAData[i]) + Rand;
			}
		}		
		if(inWhichAxis == 2){ //y axis
			ScaleFactor = (canvas.height - 2 * Rand) / iRange;		
			for(i = 0; i < outAData.length; i++){
				outAData[i] = (canvas.width - Rand) - Math.round(ScaleFactor * outAData[i]);
			}
		}
		return outAData;//return transformed Values
	}
	
	//Axis
	var DrawAxis = function(TickStepNummer){

		//private variables
		var TickStepX = (canvas.width - 2 * Rand) / TickStepNummer;
		var TickStepY = (canvas.width - 2 * Rand) / TickStepNummer;
	
		//axis lines
		ctx.strokeStyle="gray";
		ctx.textAlign = 'left';
		ctx.moveTo(Rand,Rand);
		ctx.lineTo(Rand,canvas.height - Rand);
		ctx.lineTo(canvas.width - Rand,canvas.height - Rand);
		ctx.stroke();
		
		//arrow heads
		//y axis
		ctx.beginPath();
		ctx.moveTo(Rand, Rand);
		ctx.lineTo(Rand+5, Rand+10);
		ctx.lineTo(Rand-5, Rand+10);
		ctx.closePath();
		ctx.fillStyle = 'gray';
		ctx.fill();
		//x axis
		ctx.beginPath();
		ctx.moveTo(canvas.width - Rand, canvas.height - Rand);
		ctx.lineTo(canvas.width - Rand - 10, canvas.height - Rand - 5);
		ctx.lineTo(canvas.width - Rand - 10, canvas.height - Rand + 5);
		ctx.closePath();
		ctx.fillStyle = 'gray';
		ctx.fill();		
		
		//ticks
		ctx.fillStyle="black";
		ctx.font = "10px Arial";

		ctx.textAlign = 'left';		
		for(i = 0; i < TickStepNummer; i++){
			ctx.fillText(i*Math.round(DataLimitX/TickStepNummer),
				Rand + i * TickStepX, canvas.height - Rand + 10);		
		}
		ctx.textAlign = 'right';		
		for(i = 0; i < TickStepNummer; i++){
			ctx.fillText(i*Math.round(DataLimitY/TickStepNummer),
				Rand - 2, canvas.height - Rand - i * TickStepY);			
		}	
	}
	
	//Grid
	var DrawGrid = function(GitterStepNummer, mode){
		//mode takes "xy", "x" and "y", GitterStepNumber must be an integer
	
		var GitterX = (canvas.width - 2 * Rand) / GitterStepNummer;
		var GitterY = (canvas.height - 2 * Rand) / GitterStepNummer;
		ctx.strokeStyle="lightgray";
		
		if(mode == "xy"){ // Full grid
			for(var i = 0; i < GitterStepNummer; i++){
				for(var j = 0; j < GitterStepNummer; j++){
					ctx.rect(Rand+GitterX*i,Rand+GitterY*j,GitterX,GitterY);
				}
			}
			ctx.stroke();
		} else if(mode == "y") { // Only horizontal lines
			for(var j = 0; j < GitterStepNummer; j++){
				ctx.beginPath();
				ctx.moveTo(Rand, Rand+GitterY*j);
				ctx.lineTo(canvas.width - Rand, Rand+GitterY*j);
				ctx.stroke();
			}
		} else if(mode == "x") { // only vertical lines
			for(var i = 0; i < GitterStepNummer; i++){
				ctx.beginPath();
				ctx.moveTo(Rand+GitterX*i,Rand);
				ctx.lineTo(Rand+GitterX*i,canvas.height - Rand);
				ctx.stroke();
			}
		}
	}

	//Points
	var DrawPoints = function(aDataX, aDataY){
	
		var xp, yp; //points will have to be scaled because of the margins etc.

		//define colors
		var aColors = ["blue", "magenta", "lightblue"];
		var iColorCount = 1;
		
		ctx.strokeStyle = aColors[iColorCount]; //set color
		
		//transform x and y values
		xp = CoordinateTransform(aDataX,1);
		yp = CoordinateTransform(aDataY,2);
		
		//draw points
		for(i = 0; i < xp.length; i++){ //draw points for all x values
			ctx.beginPath();
			ctx.arc(xp[i], yp[i], inPointSize, 0, 2 * Math.PI); //circle
			ctx.stroke();
		}
	}
	
	//Line
	var DrawLine = function(aDataX, aDataY){
	
		var sortx, sorty, sorthelper1, sorthelper2 = []; //points will have to be scaled because of the margins etc.

		//define colors
		var aColors = ["blue", "magenta", "lightblue"];
		var iColorCount = 1;
		
		ctx.strokeStyle = aColors[iColorCount]; //set color
		
		//transform x and y values
		sortx = CoordinateTransform(aDataX,1);
		sorty = CoordinateTransform(aDataY,2);
		
		var all = [];
		
		for (var i = 0; i < sortx.length; i++) {
			all.push({ 'X': sortx[i], 'Y': sorty[i] });
		}
		
		//sort points
		all.sort(function(a, b) {
		return a.X - b.X;
		});
		
		sortx = [];
		sorty = [];
		
		for (var i = 0; i < all.length; i++) {
			sortx.push(all[i].X);
			sorty.push(all[i].Y);
		}   
		
		//draw lines between points
		for(i = 1; i < sortx.length; i++){ //draw points for all x values
			ctx.beginPath();	
			ctx.moveTo(sortx[i-1], sorty[i-1]);	
			ctx.lineTo(sortx[i], sorty[i]);
			ctx.stroke();
		}
	}
	
	var DrawTitle = function(inTitle){//Draw title
		ctx.textAlign = 'center';	
		ctx.fillStyle="black";
		ctx.font = "22px Arial";
		ctx.fillText(inTitle, canvas.width * 0.5, Rand - 10);
	}
	
	var DrawAxisLabels = function(){//Draw title
		ctx.textAlign = 'center';	
		ctx.fillStyle="black";
		ctx.font = "14px Arial";

		ctx.save();//save context so it's restorable after rotation
		ctx.fillText("Speed [km/h]", canvas.width * 0.5, canvas.height - 0.2* Rand);
		ctx.translate(0.2 * Rand + 8, canvas.height * 0.5);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText("Distance [m]", 0, 0);
		ctx.restore();//de-rotate	
	}	
	
	var DrawBG = function(inColor){//Draw a colored background
		ctx.fillStyle = inColor;
		ctx.fillRect(Rand,Rand,canvas.width - 2*Rand, canvas.height - 2*Rand);
	}
	
	//call drawing functions
	DrawBG('#F3F3F3'); //Background
	DrawGrid(inGridSteps, inGridType); //Grid
	
	if(inMode == "line"){// Line or points?
		DrawLine(inData1,inData2);
	} else if(inMode == "points"){
		DrawPoints(inData1,inData2);
	}
	
	DrawAxis(inGridSteps); //Axis
	DrawTitle(captation); //Title
	DrawAxisLabels(); //Labels for axis
}