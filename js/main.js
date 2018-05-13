//calculation screen
const displayedCalc = document.getElementById("displayedCalc");
const displayedInput = document.getElementById("displayedInput");

//true and values to allow and prevent functionalities
let disableDec = false; let allowNumber = true; let allowOperator = false; let calculationFinished = false;
// calculation array and input arrays for used as base for calculations. 
const calculation = []; const newNumber = []; const newOperator = []; const newAnswer = [];

//Array reset funtions (except displayes)
const empty = function(array){ array.splice(0, array.length);} //oneArray
const clearAll = function() { //allArrays
	empty(calculation); empty(newOperator); empty(newNumber); empty(newAnswer);
	disableDec = false; allowNumber = true; allowOperator = false; calculationFinished = false;
}
const clearedDisplay = function(){
	displayedCalc.innerHTML = "cleared";
	displayedInput.innerHTML = "0";
}
//moves from input array data to calculation array
const pushToCalculation = function(input){
	calculation.push(input[0]);
	input.splice(0,input.length);
}
//number and decimal buttons
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "Dec"];//used for id reference
for (var key of numbers){
	let number = document.getElementById("num" + key);
	number.onclick = function(){
		//functional permisions changes
		if(allowNumber == true){
			if(calculationFinished == true){
				clearAll();
			}
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

		//displaying data
		if (calculation.length == 0) { 
			displayedCalc.innerHTML = "cleared"; 
		} else {
			displayedCalc.innerHTML = calculation.join(" ");
		}
		displayedInput.innerHTML = newNumber.join("");
		allowOperator = true;
	}
}

//operator buttons
const operatorIds = ["add", "subtract", "multiply", "divide", "answer"];
for (var key of operatorIds) {
	let operator = document.getElementById(key);
	operator.onclick = function() {
		if(allowOperator == true){
			//changes functional permissions
			allowNumber = true; disableDec = false;	

			if (this.value === "="){
				//FINISHES calculation
				if (calculationFinished == false){
					//adds last number
					calculation.push(newNumber.join(""));
					empty(newNumber);

					//changes string to real calculation
					let realCalculation = calculation.join(" ").replace("x", "*");
					newAnswer.push(eval(realCalculation + ""));//calulates, then turns back to string for manipulation
					displayedCalc.innerHTML = calculation.join(" ") + " =";//adding " =" for display
					displayedInput.innerHTML = eval(realCalculation); //displays answer
					calculationFinished = true;
				}

			} else { //other operators
				
				if (newAnswer.length == 1){
					//If Calculation is finished and dispalayed, a new calculation starts with the previous Answer as the first number
					empty(calculation); pushToCalculation(newAnswer);
				} else {
					//If Calculation is NOT finished, pushed number previously created
					calculation.push(newNumber.join("")); empty(newNumber);
				}
				
				//replaces previous operator (would have been pushed into calculation IF new number was created afterwards)
				empty(newOperator)
				newOperator.push(this.value);
				
				displayedCalc.innerHTML = calculation.join(" ");
				displayedInput.innerHTML = this.value;
				calculationFinished = false;
			}
			//restarts a new number
			empty(newNumber);
		}
	}
}

const negative = document.getElementById("negative");
negative.onclick = function(){
	if(calculationFinished == true){
		if(newAnswer[0].charAt(0) === "-"){
			newAnswer[0] = newAnswer[0].slice(1);
		} else {
			newAnswer[0] = "-" + newAnswer[0];
		}
		displayedInput.innerHTML = newAnswer.join("");
	} else {
		if(newNumber[0] == "-"){
			newNumber.splice(0,1);//pop to front
		} else {
			newNumber.unshift("-");
		}
		displayedInput.innerHTML = newNumber.join("");
	}
}

const clear = document.getElementById("clear");
clear.onclick = function() {
	clearAll(); clearedDisplay();
}
//changes input number (new number or answer) to a negative or reverts back to positive
const remove = document.getElementById("remove");
remove.onclick = function(){
	const undoSetting = function(){
		//corrects display and permissions
		displayedCalc.innerHTML = calculation.join(" ");
		displayedInput.innerHTML = "removed";
		disableDec = true;	allowNumber = false;  allowOperator = true;
	}
	if(calculationFinished == true){
		empty(newAnswer); undoSetting();
		calculationFinished = false;
	} else {
		if (calculation.length > 1){
			if (newOperator == 1 && newNumber == 0){
				empty(newOperator);
			} else if (newOperator == 0 && newNumber >= 1){
				empty(newNumber);
				calculation.splice(-1,1);	
			} else {
				calculation.splice(-2,2);
			}
			undoSetting();
		} else {
			clearAll(); clearedDisplay();
		}
	}
}

const percentage = document.getElementById("percentage");
percentage.onclick = function(){
	displayedCalc.innerHTML = "percentage"
	if(calculationFinished == true){
		displayedInput.innerHTML = eval(newAnswer[0]) / 100;
	} 
	if (newNumber.length >= 1){
		displayedInput.innerHTML = eval(newNumber.join("")) / 100;
	}
	clearAll();
}