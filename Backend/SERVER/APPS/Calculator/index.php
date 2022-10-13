<!DOCTYPE html>
<html lang="en" >

<head>
  <meta charset="UTF-8">
  <title>Pure JavaScript Calculator</title>
  
  
  
      <link rel="stylesheet" href="css/style.css">

  
</head>

<body>

  	<div class="container">
      <div class="calculator">
        <div class="calculator-display">0</div>
        <div class="calculator-keyboard">
          <div class="calculator-keyboard_container_numbers">
            <button class="calculator-keyboard_number_key" type="button" data-keycode="67" value="clear">C</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="84" value="toggle">&#8314;&#8725;&#8331;</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="88" value="exponent">%</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="190" value=".">.</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="48" value="0">0</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="49" value="1">1</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="50" value="2">2</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="51" value="3">3</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="52" value="4">4</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="53" value="5">5</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="54" value="6">6</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="55" value="7">7</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="56" value="8">8</button>
            <button class="calculator-keyboard_number_key" type="button" data-keycode="57" value="9">9</button>
          </div>
          <div class="calculator-keyboard_container_operators">
            <button class="calculator-keyboard_operator_key" type="button" data-keycode="47" value="div">÷</button>
            <button class="calculator-keyboard_operator_key" type="button" data-keycode="221" value="mult"><span>×</span></button>
            <button class="calculator-keyboard_operator_key" type="button" data-keycode="189" value="subtract">−</button>
            <button class="calculator-keyboard_operator_key" type="button" data-keycode="187" value="sum">+</button>
            <button class="calculator-keyboard_operator_key" type="button" data-keycode="13" value="result">=</button>
          </div>
        </div>
      </div>
    </div>
  
  

    <script  src="js/index.js"></script>




</body>

</html>
