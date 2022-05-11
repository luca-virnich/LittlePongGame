document.addEventListener('DOMContentLoaded', () => {

    let ball = document.getElementById('ball')
    
    let ballX = 50
    let ballY = 50
    
    let isMovingUpRight = true
    let isMovingDownRight = false
    let isMovingDownLeft = false
    let isMovingUpLeft = false
      
   
    drawBall()
    checkCollision()    
   
   
   
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

        console.log(ballY)

        if (ballY >= 100){                  //Bottom Bounce
            if (isMovingDownLeft){
                isMovingUpRight = false
                isMovingDownRight = false
                isMovingDownLeft = false
                isMovingUpLeft = true
            }
            if(isMovingDownRight){
                isMovingUpRight = true
                isMovingDownRight = false
                isMovingDownLeft = false
                isMovingUpLeft = false
            }
        }

        if (ballX >= 100){                  //right Bounce
            if(isMovingDownRight){
                isMovingUpRight = false
                isMovingDownRight = false
                isMovingDownLeft = true
                isMovingUpLeft = false
            }
            if (isMovingUpRight){
                isMovingUpRight = false
                isMovingDownRight = false
                isMovingDownLeft = false
                isMovingUpLeft = true
            }
        }

        if(ballY <= 0){                     //Top Bounce
            if (isMovingUpLeft){
                isMovingUpRight = false
                isMovingDownRight = false
                isMovingDownLeft = true
                isMovingUpLeft = false
            }
            if(isMovingUpRight){
                isMovingUpRight = false
                isMovingDownRight = true
                isMovingDownLeft = false
                isMovingUpLeft = false
            }
        }

        if(ballX <= 0){                     //Left Bounce
            if (isMovingDownLeft){
                isMovingUpRight = false
                isMovingDownRight = true
                isMovingDownLeft = false
                isMovingUpLeft = false
            }
            if (isMovingUpLeft){
                isMovingUpRight = true
                isMovingDownRight = false
                isMovingDownLeft = false
                isMovingUpLeft = false
            }
        }



        requestAnimationFrame(checkCollision)
    }



    
})