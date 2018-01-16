"use strict";


$(document).ready(function() {
    var isGamePlaying = false;
    var isShowingSequenceToPlayer = false;
    var isStrictModeOn = false;
    var isOn = false; // Used to reset the game
    var colors = ["green", "red", "yellow", "blue"];
    var seqColors = [];
    var curPlayerTurnInSequence = 0;
    var step = 0;

    var sounds = {
        green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    };


    /* ---- Misc ---- */

    $("#on-block").hide();

    /* ---- Custom Functions ---- */

    

    function addToSequence() {
        let rColor = Math.floor(Math.random() * colors.length);
        seqColors.push(colors[rColor]);
    }

    function showSequenceToPlayer() {
        if (isOn) {
            let curColorIndex = 0;
            isShowingSequenceToPlayer = true;
            
            // Custom loop function, allowing the use of interval between iterations
            function showColor() {
                if (isOn) {
                    let curColor =  "#" + seqColors[curColorIndex];

                    $(curColor).effect("highlight", {}, 750);
                    sounds[seqColors[curColorIndex]].play();

                    if (curColorIndex != seqColors.length - 1) {
                        curColorIndex++;
                        setTimeout(() => {
                            showColor();
                        }, 1000);
                    } else {
                        isShowingSequenceToPlayer = false;
                    }
                }
            }

            setTimeout(() => {
                showColor();
            }, 1250);
            
        }
    }

    function toggleGameActive() {
        if (isOn) {
            let colorDisabled = "rgb(102, 8, 8)";
            isOn = false;
            seqColors = [];
            step = curPlayerTurnInSequence = 0;
            $("#step-display").html("--");
            $("#step-display").css("color", colorDisabled);
            $("#strict-light").css("background-color", "black");

            isGamePlaying = isStrictModeOn = isShowingSequenceToPlayer = false;

            colors.forEach(color => {
                $("#" + color).css("background-color", color);
            });
        } else {
            isOn = true;
            $("#on-off-block").animate({left: "50px"});
            $("#step-display").css("color", "red");
        }
        $("#off-block").toggle();
        $("#on-block").toggle();
    }

    function increaseStep() {
        // For now we can't go higher thsan 99 for formatting reasons
        if (step < 20) {
            step++;
        } else {
            alert("You won the game ! Congratulations !");
            seqColors = [];
            step = curPlayerTurnInSequence = 0;
            $("#step-display").html("--");
            isShowingSequenceToPlayer = false;
            colors.forEach(color => {
                $("#" + color).css("background-color", color);
            });
            addToSequence();
            showSequenceToPlayer();
            increaseStep();
        }

        if (step < 10) {
            $("#step-display").html("0" + step);
        } else {
            $("#step-display").html(step);
        }
    }

    function loseGame() {
        alert("You lost !");
        seqColors = [];
        step = curPlayerTurnInSequence = 0;
        $("#step-display").html("--");
        isShowingSequenceToPlayer = false;
        colors.forEach(color => {
            $("#" + color).css("background-color", color);
        });
        addToSequence();
        showSequenceToPlayer();
        increaseStep();
    }

    /* ---- JQuery Events ---- */

    $("#btn-start").click(function() { 
        if (!isGamePlaying && isOn) {
            isGamePlaying = true;
            colors.forEach(color => {
                $("#" + color).css("background-color", color);
            });
            addToSequence();
            showSequenceToPlayer();
            increaseStep();
        }
    });

    $("#btn-strict-mode").click(function() {
        if (isOn) {
            if (isStrictModeOn) {
                isStrictModeOn = false;
                $("#strict-light").css("background-color", "black");
            } else {
                isStrictModeOn = true;
                $("#strict-light").css("background-color", "red");
            }
        }
    });

    $("#on-off-wrapper").click(function() {
        toggleGameActive();
    });

    
    $(".color-square").click(function() {
        if (isGamePlaying && !isShowingSequenceToPlayer && isOn) {
            let colorID = $(this).attr("id");
            $("#" + colorID).effect("highlight", {}, 750);
            sounds[colorID].play();
           
            if (colorID === seqColors[curPlayerTurnInSequence]) {
                if (curPlayerTurnInSequence === seqColors.length - 1) {
                    addToSequence();
                    showSequenceToPlayer();
                    increaseStep();
                    curPlayerTurnInSequence = 0;
                } else {
                    curPlayerTurnInSequence++;
                }
            } else {
                if (isStrictModeOn) {
                    loseGame();
                } else {
                    curPlayerTurnInSequence = 0;
                    showSequenceToPlayer();
                }
            }
        }
    });

});