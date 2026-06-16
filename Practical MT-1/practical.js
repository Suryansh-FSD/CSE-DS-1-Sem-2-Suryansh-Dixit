function factorial() {
    var n = document.getElementById("Input").value;
    var answer = 1;

    if (n == "") {
        document.getElementById("Output").innerHTML = "Please enter a number";
    } else {
        for (var i = 1; i <= n; i++) {
            answer = answer * i;
        }

        document.getElementById("Output").innerHTML = "Factorial is: " + answer;
    }
}