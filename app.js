document.addEventListener('DOMContentLoaded', () => {

    let player_left = document.getElementById('player_left')
    let yPos = 0
    let isMovingUp 

    function control (e) {

        
        
        //MOVE UP
        if (e.keyCode===87){
            console.log("UP")
            
            isMovingUp = true
            console.log(isMovingUp)
            
            window.requestAnimationFrame(LeftMovementUP)
        
        }

        //MOVE DOWN
        if (e.keyCode===83){
            console.log("DOWN")

            isMovingUp = false
            console.log(isMovingUp)

            window.requestAnimationFrame(LeftMovementDown)            
        }

        
    }
    
    document.addEventListener('keyup', control)



    function LeftMovementUP (){
        
        yPos = yPos - 3
        player_left.style.transform = `translateY(${yPos}px)`;

       requestAnimationFrame(LeftMovementUP)
        
    }

    function LeftMovementDown (){
        
        yPos = yPos + 3
        player_left.style.transform = `translateY(${yPos}px)`;

        requestAnimationFrame(LeftMovementDown)
        
    }

   

    





})


