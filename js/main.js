//calculation and input screen
const displayedCalc = document.getElementById("displayedCalc");
const displayedInput = document.getElementById("displayedInput");

let disableDec = false; //decimal button is disabled

// calculation array and input arrays for used as base for calculations. 
const calculation = []; 
const newNumber = []; 
const newOperator = [];

//Array reset funtions
const empty = function(array) { array.splice(0, array.length); }//oneArray
const clearInputs = function(){
	empty(newOperator); empty(newNumber); //clears input arrays
}
const clearAll = function() {
	empty(calculation); 
	clearInputs(); //clears all arrays
	disableDec = false;	
}
const clearAllAndDisplay = function(){
	clearAll();
	displayedCalc.innerHTML = "cleared";
	displayedInput.innerHTML = "0";//tells user everything is cleared
}
//moves data from input arrays to calculation array
const pushToCalculation = function(array){
	let string;
	if(array.length > 0) { 
		string = ([".", "-."].includes(array[0])) ? array.join("") + "0" : array.join(""); 
		calculation.push(string);
	}
	empty(array);
}
const displayCalculation = function(){
	if(calculation.join(" ").length > 34){
		displayedCalc.innerHTML = "..." + calculation.join(" ").slice(calculation.join(" ").length - 34);
		//keeps it to the length of 34 or less.
	} else {
		displayedCalc.innerHTML = (calculation.length == 0) ? "cleared" : calculation.join(" ");
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
			if(calculation[calculation.length-1] == "=") { clearAll(); }
			if(newOperator.length == 1 && newNumber.length >= 0) { pushToCalculation(newOperator); }
			//pushes decimal OR number, building a number
		   	if (this.value === "." && disableDec == false && newNumber.length < 35){ //alows decimal once
					newNumber.push(this.value);
					disableDec = true;
			} 
			if(this.value !== "." && newNumber.length < 35) { 
				newNumber.push(this.value); 
			}
			displayCalculation();
			displayedInput.innerHTML = (newNumber.length == 35) ? "exceeds limit>>" + newNumber.join("").slice(13) 
			: (newNumber.join(""));
		}
	}
}
//operator buttons
const operatorIds = ["add", "subtract", "multiply", "divide", "answer"];
for (var key of operatorIds) {
	let operator = document.getElementById(key);
	operator.onclick = function(){
		if(newNumber.length >= 1 || newOperator.length == 1 || calculation.length > 0){
			disableDec = false;
			if (this.value === "=" && calculation[calculation.length-1] != "="){
				pushToCalculation(newNumber);//changes string to real calculation
				let realCalculation = calculation.join(" ").replace(/x/g , "*");
				newNumber.push(eval(realCalculation) + "");//calulates, then turns back to string for manipulation
				calculation.push("=");//only for display
				displayCalculation();
				displayedInput.innerHTML = eval(realCalculation); //displays answer
			}
			if (this.value !== "="){ //other operators				
				if (calculation[calculation.length-1] == "=") { empty(calculation);	}	
				pushToCalculation(newNumber);//either new number or previous answer
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
		newNumber[0] = (newNumber[0].charAt(0) === "-") ? newNumber[0].slice(1) : "-"+newNumber[0];
		displayedInput.innerHTML = newNumber.join("");
	}
}

const clear = document.getElementById("clear");
clear.onclick = function() { clearAllAndDisplay(); }

//changes input number (new number or answer) to a negative or reverts back to positive
const remove = document.getElementById("remove");
remove.onclick = function(){
	if (newOperator.length > 0 || newNumber.length > 0){
		if(['=', '+', '-', 'x', '/'].includes(calculation[calculation.length-1])){	calculation.splice(-1,1) };
		clearInputs();
	} else { 
		calculation.splice(-2,2); 
	}
	displayCalculation();
	displayedInput.innerHTML = "removed";
}
const percentage = document.getElementById("percentage");
percentage.onclick = function(){
	if (newNumber.length >= 1){
		disableDec == false;
		displayedCalc.innerHTML = "percentage";
		displayedInput.innerHTML = eval(newNumber.join("")) / 100;
		clearAll();
	}
}