document.addEventListener('DOMContentLoaded', () => {

    let player_left = document.getElementById('player_left')
     
    let yPos = 0
    let isMovingUp
    let animationUp
    let animationDown
    

    function control (e) {

        //MOVE UP
    
        if (e.keyCode===87 && !isMovingUp){
            isMovingUp = true
            //console.log("up")
            stopMovementDown()
            window.requestAnimationFrame(moveUp)
        }

        //MOVE DOWN

        if (e.keyCode===83){
            if (isMovingUp || isMovingUp === undefined){
                isMovingUp = false
                //console.log("down")
                stopMovementUp()
                window.requestAnimationFrame(moveDown)
            }
        }

    }
    
    document.addEventListener('keyup', control)

    
    function moveUp (){
        yPos = yPos - 1 
        player_left.style.top = yPos + "%"
        animationUp = requestAnimationFrame(moveUp)
        if (yPos < 0){                                                                         
            //isMovingUp = false                                    Enabe for Boundry Bounce, but buggy
            stopMovementUp()
            //window.requestAnimationFrame(moveDown)
        }
    }

    function moveDown (){
        yPos = yPos + 1 
        player_left.style.top = yPos + "%";
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

})


