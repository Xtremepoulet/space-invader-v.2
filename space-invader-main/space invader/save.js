const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");


//set the dimension of the navigator for the canvas width and height 
canvas.width = innerWidth;
canvas.height = innerHeight;


//class definitions


class Player{
    constructor(){

        this.rotation = 0; //set to 0 by default 

        //velocity object 
        this.velocity = {
            x: 0,
            y: 0
        }


        //image declaration and initialisation
        let image = new Image();
        image.src = './spaceship.jpg';
        image.onload = () => {  //when the image is loaded, we can init her components 
            this.image = image;
            const scale = 0.15;
            this.width = this.image.width * scale;  //redimension of the image 
            this.height = this.image.height * scale;

            //this is the position x and y for the rectangle which contain the image
            this.position = {
                x: canvas.width / 2,
                y: canvas.height - this.width - 20
            }
        }

    }


    //update method we call it everytime we update the player 
    update(){

        if(this.image){ //if the image is true, so the image is loaded 

            this.position.x += this.velocity.x;
            this.draw();
        }
        
    }

    //draw method which draw the image on screen and apply some effect depending what we do 
    draw(){

        ctx.save() //we save the current settings for the canvas 

        //this allows us to move and rotate the image of player when we do something 
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);


        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);


        ctx.restore() //we restore the previous settings for the canvas 
        
    }
}




//creation de la classe invader qui nous permettra d'init notre grid d'invaders 
class Invader{
    constructor({ position }){  //destructuring position. init in the Grid class when we push our Invader inside the invaders array

      

        this.velocity = {
            x: 4,
            y: 0
        }

        //meme principe que pour la classe Player 
        let image = new Image();
        image.src = "./invader.png";
        image.onload = () => {
            this.image = image;
            let scale = 0.07;
            this.width = image.width * scale;
            this.height = image.height * scale;
            
            this.position = {  //this.postion est égale au destructuring passé dans invaders.push. Il s'agit des postion x et y definit dans Grid (car chaque invader à une position différente pour ne pas qu'ils se chevauche)
                x: position.x,
                y: position.y
            }

        }
    }

    //prend la velocité definit dans Grid pour que chaque invader possède la meme 
    update( {velocity }){
        if(this.image){//si l'image est load 
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        
        }
    }


    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    //shoot method which load our projectile inside invader_projectiles (its our array taken in args)
    shoot(invader_projectiles){
        invader_projectiles.push(new InvaderProjectile({position: {   //we push it with the position destructured of our class 
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }}))
    }



    
}



//classe grid qui nous permet de gerer une seule grille pour tout nos invaders 
class Grid{
    constructor(){

        this.position = {
            x: 0,
            y: 0
        }


        this.velocity = {
            x: 10,
            y: 0
        }




        this.invaders = [];//definission d'un array qui va prendre tout les invaders qui seront initialisé dans notre boucle for 

        //taille de chaque invader 
        this.width = 40;
        this.height = 40;

        //we generate a random value for the rows and columns
        let rows = Math.floor(Math.random() * 5 + 5);
        let columns = Math.floor(Math.random() * 5 + 3);

        //boucle for en 2 temps afin de loop à la fois sur sur l'axe x et y 
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                this.invaders.push(new Invader({position: {  //on créer un nouvel invader pour chaque itération et on lui passe les position definit dans grid 
                    x: i * this.width,
                    y: j * this.height
                } }));
            }
        }
    }


    update(){
        //on re attribut notre velocité 
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //a chaque appel de update(), this.velocity.y est remise à 0. cela empeche notre grid de se deplace en y si la condition n'est pas remplis
        this.velocity.y = 0;

        //gestion des collisions et re attribution des paramètres
        if(this.position.x >= canvas.width - this.width){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 20;
        }
        if(this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 20;
        }

    }
    
}






class Projectile{
    constructor(){

        this.position = {
            x: player.position.x + player.width / 2,
            y: player.position.y
        }

        this.velocity = {
            x: 0,
            y: 5
        }


        this.radius = 5;

    }


    update(){
        this.draw();

        this.position.y -= this.velocity.y;
    }



    draw(){
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.restore();
    }
}




class InvaderProjectile{
    constructor({ position }){  //destructuring for the projectile. take the position of the Invader class were he is init 
        
        this.position = position;

        this.velocity = {
            x: 0,
            y: 5
        }

        this.width = 3;
        this.height = 10;
    }



    update(){
        this.draw();

        this.position.y += this.velocity.y;
    }
    

    draw(){
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        ctx.restore();
    }

}




//keys gestion


//objects to let us know when a key is pressed or no (true or false)
let keys = {
    a: {
        pressed: false,
    }, 
    e: {
        pressed: false,
    }, 
    space: {
        pressed: false,
    }
}


//event gestion 


//key = destructuring -> its equal to event.key
addEventListener("keydown", ({ key }) => {
    switch(key){ 

        //depending the case, we do something
        case 'a':
            keys.a.pressed = true;
            break;
        case 'e':
            keys.e.pressed = true;
            break;
        case ' ':
            keys.space.pressed = true;
    }
})


//when the key is up, any keys is equal to false
addEventListener("keyup", ({ key }) => {
    switch(key){
        case 'a':
            keys.a.pressed = false;
            break;
        case 'e':
            keys.e.pressed = false;
            break;
        case ' ':
            keys.space.pressed = false;
            projectiles.push(new Projectile());
    }
})





//variables declaration 


let player = new Player(); //creation of our player
let projectiles = [];  //creation d'un array qui stockera tout nos projectile 

let grids = [] //we create at least one grids element before it init

const invader_projectiles = []; //we declare an array which will store every invader_projectile we will init

let frame = 0;
// let random_time = Math.floor(Math.random() * 500 + 300);
let random_time = 1000;


//function which repeat at 60 frames / s  (thanks to requestAnimationFrame)
function animate(){
    requestAnimationFrame(animate);
    ctx.fillRect(0,0,canvas.width, canvas.height);   //we fill the canvas with a black background 
   
    //we call the update method for the player 
    player.update();


    //we loop through invader_projectiles 
    invader_projectiles.forEach(((invader_projectile, index) => {
        
        //collision gestion
        if(invader_projectile.position.y + invader_projectile.height >= canvas.height){
            setTimeout(function(){ //setTimeout for splice method of our array. gestion of problems
                invader_projectiles.splice(index, 1);
            }, 0)
        }
        else{
            invader_projectile.update();
        }
    }))

    //pour chaque grid definit dand grids 
    grids.forEach(grid => {
        grid.update(); //on appel update 

        //on a certain frame, we launch our shoot method for invaders
        if(frame % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invader_projectiles);//take the array in args 
        } 
        

        grid.invaders.forEach((invader, i) => {  //this.invaders = []  dans Grid. On loop dessus pour mettre à jour chaque invader 
            invader.update({velocity: grid.velocity}); //on met à jour chaque invader en lui attribuant la velocité présente dans Grid

            


            projectiles.forEach((projectile, j) => { //on loop sur l'array projectile dans notre loop sur notre array grids et invaders 
                //si il y a collision avec l'élément invader de l'array 
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y)
                    {
                        
                        //ce setTimeout permet de nous assurer que l'élément soit bien dans l'array lorsque splice sera appelé. Un splice peut parfois modifier le format de l'array
                        setTimeout(function(){
                            const invaderExist = grid.invaders.find(invader2 => invader2 === invader); //on verifie que l'invader se trouve bien dans notre array 
                            const projectileExist = projectiles.find(projectile2 => projectile2 === projectile);//meme chose pour notre projectile 

                            if(projectileExist && invaderExist){ //si le projectile et l'invader existe alors on les retires les deux de nos array aux index i et j 
                                grid.invaders.splice(i, 1);
                                projectiles.splice(j, 1);
                            }
                        }, 0)
                        
                }
            } )
        })
    })


    

    //on loop sur projectiles et on update chaqu'un. si le projectile collide avec canvas.height alors il est remove 
    projectiles.forEach((projectile, index) => {
        projectile.update();
        if(projectile.position.y <= 0){
            projectiles.splice(index, 1);  //remove projectile à l'index index
        }
    })




    //gestion of keys if they are pressed or not. velocity, rotation, and collision with the canvas
    if(keys.a.pressed && player.position.x >= 0){
      player.velocity.x = -7;
      player.rotation = -0.15;
    } else if(keys.e.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 7;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }





    
    //gestion des frames pour le chargement de nos novuelles grids 
    if(frame % random_time === 0){
        grids.push(new Grid());
        frame = 0;
    }



    frame++;

    
}


animate();




