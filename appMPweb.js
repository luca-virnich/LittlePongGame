document.addEventListener('DOMContentLoaded', () => {


    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};  //"lokale" player Elemente, in sync mit firebase
    let otherPlayerID;
    let playerLeftID;
    let playerRightID;

    let ballRef;
    let ball = {};
    let ballElements = {};
 
    let yPos = 50
    let isMovingUp
    let animationUp
    let animationDown

    const gameContainer = document.querySelector(".game-container")

    

    function handeArrowPress (e){

        if (e.keyCode===87 && !isMovingUp){
            isMovingUp = true
            //console.log("up")
            stopMovementDown()
            window.requestAnimationFrame(moveUp)
        }

        if (e.keyCode===83){
            if (isMovingUp || isMovingUp === undefined){
                isMovingUp = false
                //console.log("down")
                stopMovementUp()
                window.requestAnimationFrame(moveDown)
            }
        }
    }

    function moveUp (){
        yPos = yPos - 1 
        players[playerId].y = yPos
        playerRef.set(players[playerId])
        animationUp = requestAnimationFrame(moveUp)
        if (yPos < 0){                                                                         
            //isMovingUp = false                                    Enabe for Boundry Bounce, but buggy
            stopMovementUp()
            //window.requestAnimationFrame(moveDown)
        }
    }

    function moveDown (){
        yPos = yPos + 1 
        players[playerId].y = yPos
        playerRef.set(players[playerId])
        animationDown = requestAnimationFrame(moveDown)
        if (yPos > 80){                                         
            //isMovingUp = true
            stopMovementDown()
            //window.requestAnimationFrame(moveUp)
        } 
    }
    
    function stopMovementUp(){
        cancelAnimationFrame(animationUp)
        return
    }
    
    function stopMovementDown(){
        cancelAnimationFrame(animationDown)
        return
    }

    

    function codeDebug(e) {
       
        if (e.keyCode===79){
            
            console.log(Object.keys(players).length)
        
        }
    }


    function initgame(){

        document.addEventListener('keyup', handeArrowPress)
        document.addEventListener('keyup', codeDebug)
        
        const allPlayersRef = firebase.database().ref(`players`);
        const allScoreRef = firebase.database().ref(`score`)
       
        allPlayersRef.on("value", (snapshot)=>{
            
            //!!!!!!!!!!!!!
            //immer wenn eine änderung passiert
            players = snapshot.val() || {};
            Object.keys(players).forEach((key) =>{
                const characterState = players[key];
                let el = playerElements [key];
                
                //update dom
                el.querySelector(".Character_name").innerHTML = characterState.name;
                let left = characterState.x;
                let top = characterState.y;
                el.style.top = top + "%";
                el.style.left = left + "%";

            })
        })
        allPlayersRef.on("child_added", (snapshot)=>{
            //immer wenn neuer spieler joint
            
            const addedPlayer = snapshot.val();
            const characterElement = document.createElement("div");
            characterElement.classList.add("character");

            characterElement.innerHTML = (`
                <span class="Character_name"></span>
            `);
            
            playerElements[addedPlayer.id] = characterElement;

            
            //Neuen spieler mit Inhalt füllen
            // !!Hier zweiten spieler anders als ersten gestalten
            characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
            
            const left = addedPlayer.x;
            const top = addedPlayer.y;
            characterElement.style.top = top + "%";
            characterElement.style.left = left + "%";
            gameContainer.appendChild(characterElement);
        })

        allPlayersRef.on("child_removed", (snapshot)=>{
            const removedKey = snapshot.val().id;
            gameContainer.removeChild(playerElements[removedKey]);
            delete playerElements[removedKey];
        })

    }

    //////////////////////////////////////////////////




    var xOfOtherPlayer;

    function getXofOtherPlayer(){
        var ref2 = firebase.database().ref("players/"+otherPlayerID+"/x"); ////Returns x pos of other player
        
        ref2.once("value")
        .then(function(snapshot) {
            
            xOfOtherPlayer = snapshot.val()
        });
    }

    

    firebase.auth().onAuthStateChanged((user) => {

        var ref = firebase.database().ref("players");
        ref.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot){               
                otherPlayerID = childSnapshot.key    //wird getriggert wenn man als 2ter spieler joint um spawn zu ermitteln
            })

          var a = snapshot.numChildren();
          if (a < 2){                               //mehr als 2 spieler nicht erlaubt
              getXofOtherPlayer()
              window.setTimeout(loadGame, 1000);
              
            }else {
                alert("Too many players at the same time. Try again later!");
            }
        });

       
        function loadGame(){
            if (user){
                let name;
                let xPosSpawn;
                playerId = user.uid;
                playerRef = firebase.database().ref(`players/${playerId}`);
                

                if (xOfOtherPlayer === 2){
                    name = "player2";
                    xPosSpawn = 98;
                }else if(xOfOtherPlayer === 98){
                    name = "player1";
                    xPosSpawn = 2;
                }else if(xOfOtherPlayer === null){
                    name = "player1";
                    xPosSpawn = 2;
                }
                
                playerRef.set({                                                     //neuer spieler
                    id: playerId,
                    name: name,
                    x: xPosSpawn,
                    y: 50,
                    score: 0,
                })
                
                //remove from firebase when disconnected
                playerRef.onDisconnect().remove();
                initgame();
                window.setTimeout(getLeftAndRightID, 1000)    //fires the game if 2 players are 
                
               

            }else {
                //logged out 
        
            }    
        }
       
    })

    firebase.auth().signInAnonymously().catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.errorMessage;
        //
        console.log(errorCode, errorMessage);
    })
    
    function getLeftAndRightID(){
        if(Object.keys(players).length === 2){
            if(players[playerId].x === 2){
                playerLeftID = playerId;
                playerRightID = otherPlayerID;
            }else if(players[playerId].x === 98){
                playerLeftID = otherPlayerID;
                playerRightID = playerId;
            }
            loadBall();                      
            
        }if(Object.keys(players).length === 1){
            viewBall();
        }    
    }


    ////////////
    ////////////
    ///BALLL////
    ////////////
    ////////////
    //if einSPieler >>> child added / value funktion für ersten spieler

    function viewBall(){


        const allBallRef = firebase.database().ref("ball")

        allBallRef.on("child_added", (snapchot) =>{

            const addedBall = snapchot.val()
            const BallElement = document.createElement("div");
            BallElement.classList.add("ballFB");

            ballElements["ballChild"] = BallElement;
            
            const left = addedBall.x;
            const top = addedBall.y;
            BallElement.style.top = top + "%";
            BallElement.style.left = left + "%";
            gameContainer.appendChild(BallElement);
        })
        
        allBallRef.on("value", (snapchot)=>{
            //console.log("ball value geändert")
            ball = snapchot.val() || {};
            
            Object.keys(ball).forEach((key) =>{
                const ballState = ball[key];
                let el = ballElements [key];
                //update dom
                let left = ballState.x;
                let top = ballState.y;
                el.style.top = top + "%";
                el.style.left = left + "%";
            })
        })
       
        

    }




    function loadBall(){

        ballRef = firebase.database().ref('ball/ballChild')

        ballRef.set({
            id: "ballChild",
            x: 50,
            y: 50,
        })

        initBall();
    }


    function initBall(){

        const allBallRef = firebase.database().ref("ball")

        allBallRef.on("child_added", (snapshot)=>{

            const addedBall = snapshot.val();
            const BallElement = document.createElement("div");
            BallElement.classList.add("ballFB");

            ballElements["ballChild"] = BallElement;
            
            const left = addedBall.x;
            const top = addedBall.y;
            BallElement.style.top = top + "%";
            BallElement.style.left = left + "%";
            gameContainer.appendChild(BallElement);

           
        })
        allBallRef.on("value", (snapchot)=>{
            ball = snapchot.val() || {};
            Object.keys(ball).forEach((key) =>{
                const ballState = ball[key];
                let el = ballElements [key];
        
                //update dom
                let left = ballState.x;
                let top = ballState.y;
                el.style.top = top + "%";
                el.style.left = left + "%";
            })
        })
        moveBall();
    }

    function moveBall (){

        let ballX = 50
        let ballY = 50
        
        let isMovingUpRight = true
        let isMovingDownRight = false
        let isMovingDownLeft = false
        let isMovingUpLeft = false
        
        let yPosRight 
        let yPosLeft 


        
        window.setTimeout(drawBall, 2000);
        checkCollision()    
        yPosChecker();
        

        
    
        function drawBall (){
            
            if (isMovingUpRight){   
                ballY--;
                ballX = ballX + 0.5;
                ball["ballChild"].y = ballY;
                ball["ballChild"].x = ballX;
                ballRef.set(ball["ballChild"]);
            }

            if(isMovingDownRight){                 
                ballY++
                ballX = ballX + 0.5
                ball["ballChild"].y = ballY
                ball["ballChild"].x = ballX
                ballRef.set(ball["ballChild"])
            }             

            if (isMovingDownLeft){  
                ballY++
                ballX = ballX - 0.5   
                ball["ballChild"].y = ballY
                ball["ballChild"].x = ballX
                ballRef.set(ball["ballChild"])        
            }

            if (isMovingUpLeft){ 
                ballY--
                ballX = ballX - 0.5 
                ball["ballChild"].y = ballY
                ball["ballChild"].x = ballX
                ballRef.set(ball["ballChild"])                  
            }
        
            requestAnimationFrame(drawBall)
        }


        function checkCollision (){

            if(ballY <= 0){                     //Top Bounce
                if (isMovingUpLeft){
                    nowMovingDownLeft()
                }
                if(isMovingUpRight){
                    nowMovingDownRight()
                }
            }

            if (ballY >= 100){                  //Bottom Bounce
                if (isMovingDownLeft){
                    nowMovingUpLeft()
                }
                if(isMovingDownRight){
                nowMovingUpRight()
                }
            }

            if (ballX >= 92){ 

                if (ballY+2.5 > parseInt(yPosRight) && ballY+2.5 < (parseInt(yPosRight) + 20) ){       // Collision Check Right
                    if(isMovingDownRight){
                        nowMovingDownLeft()
                    }
                    else if (isMovingUpRight){                   
                        nowMovingUpLeft()
                    }
                }                       
                else {                                 
                respawnBall()
                //increaseScoreLeft()
                }
            }

            if(ballX <= 3){
                if (ballY+2.5 > parseInt(yPosLeft) && ballY+2.5 < (parseInt(yPosLeft) + 20) ){       // Collision Check Left
                    if(isMovingDownLeft){
                        nowMovingDownRight()
                    }
                    else if (isMovingUpLeft){                   
                        nowMovingUpRight()
                    }
                }                       
                else {                                 
                respawnBall()
                //increaseScoreRight()
                }
            }

            requestAnimationFrame(checkCollision)
        }

        
        function yPosChecker (){ 
            yPosLeft = players[playerLeftID].y
            yPosRight = players[playerRightID].y
            //console.log(yPosLeft)
            //console.log(yPosRight)
            window.requestAnimationFrame(yPosChecker)
        }

        function increaseScoreLeft() {
            score_player_left += 1;
            document.getElementById("score_left").innerHTML = score_player_left;
        }    


        function increaseScoreRight() {
            score_player_right += 1;
            document.getElementById("score_right").innerHTML = score_player_right;
        }  

        function respawnBall (){
            ballX = 50 
            ballY = 50
        }

        function resetBallMovement(){
            isMovingUpRight = false
            isMovingDownRight = false
            isMovingDownLeft = false
            isMovingUpLeft = false
        }

        function nowMovingUpRight (){
            resetBallMovement()
            isMovingUpRight = true
        }

        function nowMovingDownRight (){
            resetBallMovement()
            isMovingDownRight = true
        }

        function nowMovingDownLeft(){
            resetBallMovement()
            isMovingDownLeft = true
        }

        function nowMovingUpLeft(){
            resetBallMovement()
            isMovingUpLeft = true
        }




    }






})