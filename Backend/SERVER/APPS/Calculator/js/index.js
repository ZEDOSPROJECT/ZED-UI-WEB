/* 
    My attempt to clone an iPhone calculator
*/


let calculator = {
  
    // Initialise defaults
    data: {
      maxChars: 10,
      storedResult: null,
      currentValue: '0',
      currentOperation: null,

    // Map the keys
    mapKeys: { 
      48 : { type: 'input', value:  '0' },
      49 : { type: 'input', value:  '1' },
      50 : { type: 'input', value:  '2' },
      51 : { type: 'input', value:  '3' },
      52 : { type: 'input', value:  '4' },
      53 : { type: 'input', value:  '5' },
      54 : { type: 'input', value:  '6' },
      55 : { type: 'input', value:  '7' },
      56 : { type: 'input', value:  '8' },
      57 : { type: 'input', value:  '9' },
      190: { type: 'input', value:  '.' },
      88 : { type: 'operation', value:  'exponent' },
      47 : { type: 'operation', value:  'division' },
      221: { type: 'operation', value:  'multiply' },
      189: { type: 'operation', value:  'subtract' },
      187: { type: 'operation', value:  'sum' },
      67 : { type: 'clear', value:  'clear' },
      13 : { type: 'result', value:  null },
      8  : { type: 'delete', value:  null },
      84 : { type: 'toggle', value:  'toggle' },
    },
  },
  
  // Receive keyboard input (via data-keycode) & press the corresponding button

  activateButtonWithKeypress (keyCode){
    const chooseBtn = document.querySelectorAll(`.calculator button[data-keycode="${keyCode}"]`)[0];
    if (chooseBtn) {
      chooseBtn.classList.toggle('active');
      setTimeout(() => {
        chooseBtn.classList.toggle('active');
      }, 150);
    }
  },
  
  // Select all buttons & map to corresponding type

  bindButtons () {
    const buttons = document.querySelectorAll('.calculator button');
    const mapKeys = calculator.data.mapKeys;
    Array.from(buttons).forEach((button) => {
      button.addEventListener('click', (event) => {
        this.processUserInput(mapKeys[event.target.dataset.keycode])
      });
    });
  },
  
  bindKeyboard () {
    document.addEventListener('keydown', (event) => {
      const mapKeys = calculator.data.mapKeys;
      let keyCode = event.keyCode

      // binds shift + 7 to 'divide by'
      if (keyCode === 55 && event.shiftKey) {
        keyCode = 47;
      }
      if (mapKeys[keyCode]) {
        this.processUserInput(mapKeys[keyCode])
        this.activateButtonWithKeypress(keyCode)
      }
    });
  },
  
  // Blinks display content when numbers are pressed

  blinkDisplay () {
    const blinkDisplay = document.querySelector('.calculator-display')
    blinkDisplay.classList.toggle('blink')
    setTimeout(() => {
      blinkDisplay.classList.toggle('blink')
    }, 150);
  },

  // Perform the calculation!
  
  calculate () {
    // Initialise and convert input to number
    const oldValue = parseFloat(this.data.storedResult, 10)
    const operation = this.data.currentOperation
    const newValue = parseFloat(this.data.currentValue, 10)
    let resultValue = 0

    // Performs calculation of numbers determined by operator value
    if (this.data.currentOperation === 'multiply') {
      resultValue = oldValue * newValue;
    }
    if (this.data.currentOperation === 'division') {
      resultValue = oldValue / newValue;
    }
    if (this.data.currentOperation === 'subtract') {
      resultValue = oldValue - newValue;
    }
    if (this.data.currentOperation === 'sum') {
      const multiplierFix = 1000000000;
      // resultValue = oldValue + newValue;
      resultValue = (((oldValue * multiplierFix) + (newValue * multiplierFix)) / multiplierFix)
    }
    if (this.data.currentOperation === 'exponent') {
      resultValue = Math.pow(oldValue, newValue);
    }
    this.data.storedResult = null;
    this.data.currentValue = '' + resultValue;
    this.updateDisplay();
  },
  
  // Resets defaults and clears display for 'C' button
  clearAll () {
    this.data.currentOperation = null;
    this.data.storedResult = null;
    this.data.currentValue = '0';
    this.updateDisplay();
  },
  
  // Resets current value
  clearCurrentValue () {
    this.data.currentValue = '0';
    this.updateDisplay();
  },
  
   // Removes last entered number if backspaced
  deleteNumber () {
    const newValue = this.data.currentValue.slice(0, -1);
    if (newValue === '') {
      this.blinkDisplay();
      this.clearCurrentValue();
    } else {
      this.data.currentValue = newValue;
      this.updateDisplay();
    }
  },
  
  // Receives user input type and launches corresponding function

  processUserInput (userInput) {
    if (userInput.type === 'input') {
      this.setNumber(userInput.value)
    }
    if (userInput.type === 'operation') {
      this.setOperation(userInput.value)
    }
    if (userInput.type === 'delete') {
      this.deleteNumber();
    }
    if (userInput.type === 'result') {
      this.showResult();
    }
    if (userInput.type === 'clear') {
      this.clearAll();
    }
    if (userInput.type === 'toggle') {
      this.toggleNumber();
    }
  },
  
  // Blinks display as required to prompt user

  setNumber (newNumber) {
    let currentValue = this.data.currentValue;
    if (newNumber === '.' && currentValue.includes('.')) {
      this.blinkDisplay();
      return;
    } 
    if (currentValue.length === this.data.maxChars) {
      this.blinkDisplay();
      return;
    }
    if (currentValue === '0' && newNumber === '.') {
      currentValue = '0.'
    } else if (currentValue === '0' && newNumber !== '.') {
      this.blinkDisplay();
      currentValue = newNumber
    } else {
      currentValue += newNumber
    }
    this.data.currentValue = currentValue
    this.updateDisplay()
  },
  
  // Selects operator for calculation

  setOperation (newOperation) {
    if (this.data.currentOperation !== null && this.data.storedResult !== null) {
      this.calculate()
    }
    this.data.storedResult = this.data.currentValue;
    this.data.currentValue = '0'
    this.data.currentOperation = newOperation;
  },
  
  // When "=" is pressed, perform calculation and update the display

  showResult () {
    if (this.data.storedResult !== null) {
      this.calculate()
      this.updateDisplay();

      // if null "=" was pressed first
    } else {
      this.blinkDisplay();
    }
  },
  
  // When toggle button is pressed, toggle negative '-'
  toggleNumber () {
    this.data.currentValue = (parseFloat(this.data.currentValue, 10) * -1) + '';
    this.updateDisplay();
  },
  
  // Add current value to display class
  updateDisplay () {
    document.querySelector('.calculator-display').innerHTML = this.data.currentValue
  },
  
  // Function to initialise display and bindings
  start () {
    this.updateDisplay();
    this.bindKeyboard();
    this.bindButtons();
  },
    
}

// Start the app
calculator.start()