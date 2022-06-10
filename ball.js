document.addEventListener('DOMContentLoaded', () => {

    let ball = document.getElementById('ball')
    let player_left = document.getElementById('player_left')
    let player_right = document.getElementById('player_right')
    
    let ballX = 50
    let ballY = 50
    
    let isMovingUpRight = true
    let isMovingDownRight = false
    let isMovingDownLeft = false
    let isMovingUpLeft = false
      
    let score_player_left = 0
    let score_player_right = 0

    let yPosRight 
    let yPosLeft 

    

    //drawBall()
    //checkCollision()    
    //yPosChecker()

    
   
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
        
        ball.style.top = ballY + "%"
        ball.style.left = ballX + "%" 
       
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
               increaseScoreLeft()
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
               increaseScoreRight()
            }
        }

        requestAnimationFrame(checkCollision)
    }

    function yPosChecker (){
        yPosLeft = player_left.style.top
        yPosRight = player_right.style.top
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

    




    
})