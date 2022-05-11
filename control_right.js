document.addEventListener('DOMContentLoaded', () => {

    let player_right = document.getElementById('player_right')
     
    let yPos = 80
    let isMovingUp
    let animationUp
    let animationDown
    

    function control (e) {

        //MOVE UP
    
        if (e.keyCode===38){
            if (!isMovingUp || isMovingUp === undefined){
                isMovingUp = true
                console.log("up Right")
                stopMovementDown()
                window.requestAnimationFrame(moveUp)
            }
        }

        //MOVE DOWN

        if (e.keyCode===40 && isMovingUp){
            
            isMovingUp = false
            console.log("down Right")
            stopMovementUp()
            window.requestAnimationFrame(moveDown)
            
        }

    }
    
    document.addEventListener('keyup', control)

    
    function moveUp (){
        yPos = yPos - 1 
        player_right.style.top = yPos + "%"
        animationUp = requestAnimationFrame(moveUp)
        if (yPos < 0){                                                                         
            //isMovingUp = false                                    //Enabe for Boundry Bounce, but buggy
            stopMovementUp()
            //window.requestAnimationFrame(moveDown)
        }
    }

    function moveDown (){
        yPos = yPos + 1 
        player_right.style.top = yPos + "%";
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

    window.addEventListener("keydown", function(e) {                                     //disable scrolling with keys and vanish mouse
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

})

