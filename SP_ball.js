document.addEventListener('DOMContentLoaded', () => {

    let SP_ball = document.getElementById('SP_ball')
    let player_left = document.getElementById('player_left')
    
    
    let ballX = 50
    let ballY = 50
    
    let isMovingUpRight = true
    let isMovingDownRight = false
    let isMovingDownLeft = false
    let isMovingUpLeft = false
      
    let score_single = 0

    let yPosLeft 

    

    drawBall()
    checkCollision()    
    yPosChecker()
   
   
   function drawBall (){
        if (isMovingUpRight){   
            ballY--
            ballX = ballX + 0.5             
        }

        if(isMovingDownRight){                 
            ballY++
            ballX = ballX + 0.5
        }             

        if (isMovingDownLeft){  
            ballY++
            ballX = ballX - 0.5           
        }

        if (isMovingUpLeft){ 
            ballY--
            ballX = ballX - 0.5                   
        }
        
        SP_ball.style.top = ballY + "%"
        SP_ball.style.left = ballX + "%" 
       
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

        if (ballX >= 100){ 

                                               // Right Wall Bounce
                                        
                if(isMovingDownRight){
                    nowMovingDownLeft()
                }
                else if (isMovingUpRight){                   
                    nowMovingUpLeft()
                }
                                 
         
        }

        

        if(ballX <= 3){
            if (ballY > parseInt(yPosLeft) && ballY < (parseInt(yPosLeft) + 20) ){       // Collision Check Left
                increaseSP_score()
                if(isMovingDownLeft){
                    nowMovingDownRight()
                }
                else if (isMovingUpLeft){                   
                    nowMovingUpRight()
                }
            }                       
            else {                                 
               respawnBall()
               resetSP_score()
            }
        }

        requestAnimationFrame(checkCollision)
    }

    function yPosChecker (){
        yPosLeft = player_left.style.top
        window.requestAnimationFrame(yPosChecker)
    }



    function increaseSP_score() {
        score_single += 1;
        document.getElementById("SP_score").innerHTML = score_single;
    } 

    function resetSP_score() {
        score_single = 0;
        document.getElementById("SP_score").innerHTML = score_single;
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

    




    function debugWithPressO(e) {

        if (e.keyCode===79){
            
           console.log(parseInt(yPosLeft) + 20)
           
        }

    }
    document.addEventListener('keyup', debugWithPressO)



    
})