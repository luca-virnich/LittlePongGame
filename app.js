document.addEventListener('DOMContentLoaded', () => {

    let player_left = document.getElementById('player_left')
    let yPos = 0

    function control (e) {
        

        if (e.keyCode===87){
            console.log("UP")

            //MOVE UP
        }

        if (e.keyCode===83){
            console.log("DOWN")

            //MOVE DOWN
        }

        
    }
    
    document.addEventListener('keydown', control)



    function LeftMovement (){
        yPos = yPos - 5
        player_left.style.transform = `translateY(${yPos}px)`;

        requestAnimationFrame(LeftMovement)
    }

    window.requestAnimationFrame(LeftMovement)

    





})

