//calculation and input screen
const displayedCalc = document.getElementById("displayedCalc");
const displayedInput = document.getElementById("displayedInput");

let disableDec = false; //decimal button is disabled

// calculation array and input arrays for used as base for calculations. 
const calculation = []; const newNumber = []; const newOperator = [];

//Array reset funtions
const empty = function(array){ 
	array.splice(0, array.length);
} //oneArray
const clearInputs = function(){
	empty(newOperator); empty(newNumber); //clears input arrays
}
const clearAll = function() {
	empty(calculation); clearInputs(); //clears all arrays
	disableDec = false;	
}
const clearAllAndDisplay = function(){
	clearAll();
	displayedCalc.innerHTML = "cleared";
	displayedInput.innerHTML = "0";//tells user everything is cleared
}
//moves data from input arrays to calculation array
const pushToCalculation = function(input){
	if (input.constructor === Array) {
		calculation.push(input[0]);//should be an opperator
		empty(input);
	} else {
		if([".", "-."].includes(input)){
			input += "0";
		}
		if(input.length > 0){
			calculation.push(input);
		};//should be a number
	}
}
const displayCalculation = function(){
	if(calculation.join(" ").length > 45){
		//keeps it within the right size for the screen
		let lengthToCut = calculation.join(" ").length - 48; 
		displayedCalc.innerHTML = "..." + calculation.join(" ").slice(lengthToCut);
	} else if (calculation.length <= 45) {
		if (calculation.length == 0){
			displayedCalc.innerHTML = "cleared";
		} else {
			displayedCalc.innerHTML = calculation.join(" ");
		}
	}
}
//number buttons and decimal button
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "Dec"];//used for id reference
for (var key of numbers){
	let number = document.getElementById("num" + key);
	number.onclick = function(){
		//criteria to be used 
		if(calculation.length == 0 || newOperator.length == 1 
		|| ['=', '+', '-', 'x', '/'].includes(calculation[calculation.length-1])){
			if(calculation[calculation.length-1] == "="){ 
				clearAll();
			}
			if(newOperator.length == 1 && newNumber.length >= 0) { 
				pushToCalculation(newOperator);
			}
			//pushes decimal OR number, building a number
		   	if (this.value == "."){
				if(disableDec == false) { //alows decimal once
					newNumber.push(this.value);
					disableDec = true;
				} 
			} else {
				newNumber.push(this.value);
			}
			displayCalculation();
			displayedInput.innerHTML = newNumber.join("");
		}
	}
}
//operator buttons
const operatorIds = ["add", "subtract", "multiply", "divide", "answer"];
for (var key of operatorIds) {
	let operator = document.getElementById(key);
	operator.onclick = function(){
		//if(calculation.length >= 1 && (newNumber.length >= 1 || newOperator.length >= 1 || displayedInput.innerHTML = "removed")){
		//changes functional permissions
		if(calculation.length >= 0){
			disableDec = false;
			if (this.value === "="){
				//FINISHES calculation
				if (calculation[calculation.length-1] != "="){
					//adds last number
					pushToCalculation(newNumber.join(""));
					empty(newNumber);
					//changes string to real calculation
					let realCalculation = calculation.join(" ").replace(/x/g , "*");
					newNumber.push(eval(realCalculation) + "");//calulates, then turns back to string for manipulation
					calculation.push("=");//only for display
					displayCalculation();
					displayedInput.innerHTML = eval(realCalculation); //displays answer
				}
			} else { //other operators				
				if(calculation[calculation.length-1] == "="){//indicates calculation is finished
					empty(calculation);
				}		
				pushToCalculation(newNumber.join(""));//either new number or previous answer
				empty(newNumber);
				empty(newOperator);
				newOperator.push(this.value);
				displayCalculation();
				displayedInput.innerHTML = this.value;
			}
		}
	}
}

const negative = document.getElementById("negative");
negative.onclick = function(){
	if(newNumber[0].length >= 1){
		if(newNumber[0].charAt(0) === "-"){
			newNumber[0] = newNumber[0].slice(1);
		} else {
			newNumber[0] = "-" + newNumber[0];
		}
		displayedInput.innerHTML = newNumber.join("");
	}
}

const clear = document.getElementById("clear");
clear.onclick = function() {
	clearAllAndDisplay();
}

//changes input number (new number or answer) to a negative or reverts back to positive
const remove = document.getElementById("remove");
remove.onclick = function(){
	console.log(calculation);
	if(newOperator.length > 0 || newNumber.length > 0){
		if(['=', '+', '-', 'x', '/'].includes(calculation[calculation.length-1])){
			calculation.splice(-1,1);
		}
		clearInputs();
	} else {
		calculation.splice(-2,2);
	}
		displayCalculation();
		displayedInput.innerHTML = "removed";
}

const percentage = document.getElementById("percentage");
percentage.onclick = function(){
	disableDec == false;
	displayedCalc.innerHTML = "percentage"
	if (newNumber.length >= 1){
		displayedInput.innerHTML = eval(newNumber.join("")) / 100;
	}
	clearAll();
}