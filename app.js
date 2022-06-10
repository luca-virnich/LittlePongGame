document.addEventListener('DOMContentLoaded', () => {


    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};  //"lokale" player Elemente, in sync mit firebase
    let activePlayers = 0;
    let otherPlayerID;

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
            
            var ref2 = firebase.database().ref("players/"+otherPlayerID+"/x"); ////Returns x pos of other player

            ref2.once("value")
            .then(function(snapshot) {
                var a = snapshot.val()
                console.log (a)
            });


        
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
            activePlayers--;
            
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
          if (a < 2){
              activePlayers = a;
              getXofOtherPlayer()
              window.setTimeout(loadGame, 2000);
              
            }else {
                alert("Too many players at the same time. Try again later!");
            }
        });

        
       
        function loadGame(){
            if (user){
                let name = "player1";
                let xPosSpawn = 2;
                playerId = user.uid;
                playerRef = firebase.database().ref(`players/${playerId}`);
                
                console.log(xOfOtherPlayer)

                if (xOfOtherPlayer === 2){
                    name = "player2";
                    xPosSpawn = 98;
                }else if(xOfOtherPlayer === 98){
                    name = "player1";
                    xPosSpawn = 2;
                }else if(xOfOtherPlayer = null){
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
    









})