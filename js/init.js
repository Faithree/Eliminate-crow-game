var context;
var queue;
var WIDTH = 1024;
var HEIGHT = 768;
var mouseXPosition;
var mouseYPosition;
var crowImage;
var stage;
var animation;
var deathAnimation;
var spriteSheet;
var enemyXPos=parseInt(700*Math.random());
var enemyYPos=parseInt(400*Math.random());
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;
var score = 0;
var scoreText;
var gameTime = 10;
var timerText;
var gunImage;
var TitleView = new createjs.Container();
var menu;  //说明按钮
var menuBg;//说明背景
var scrollTop;
var gameTimer;

  var again;
window.onload = function()
{
	
    /*
     *创建一个自定义画布。获取stage
     */
    var canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");
	stage.mouseEventsEnabled = true;
    /*
     *使用LoadQueue预加载
      */
    queue = new createjs.LoadQueue(); 
    queue.installPlugin(createjs.Sound);
    /*
     *用loadManifest创建一个资源列表
     */

    queue.loadManifest([
        
        {id : "backgroundImage", src: "assets/bg.png"},
        {id : "aimSight", src: "assets/aimSight.png"},
        {id : "shot", src: "assets/shot.mp3"},
        {id : "background", src: "assets/countryside.mp3"},
        {id : "tick", src: "assets/tick.mp3"},
        {id : "deathSound", src: "assets/die.mp3"},
		 {id : "gameOver", src: "assets/gameOver.mp3"},
        {id : "crowSpritesheet", src: "assets/crowSpritesheet.png"},
        {id : "crowDeath", src: "assets/crowDeath.png"},
        {id : "gun", src: "assets/gun.png"},
		{id : "paopao", src: "assets/paopao.png"},
		{id : "start", src: "assets/startB.png"},
		{id : "menu", src: "assets/menu.png"},
		{id : "menuBg", src: "assets/menuBg.png"},
		{id : "playBg", src: "assets/playBg.jpg"},
		{id : "again", src: "assets/again.png"},
		
    ]);
     queue.load(); 
     queue.on("complete", queueLoaded);
    
}
    
    
function queueLoaded(event)
{
    // 背景
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"));
	var backgroundImage2 = new createjs.Bitmap(queue.getResult("playBg"));
	var start = new createjs.Bitmap(queue.getResult("start"));
	menu = new createjs.Bitmap(queue.getResult("menu"));
	start.x=830;
	start.y=360;
	//alert(menu);
	menu.x=830;
	menu.y=460;
	

    TitleView.addChild(backgroundImage,start,menu);
	stage.addChild(backgroundImage2,TitleView);
   // 
	start.addEventListener("click", tweenTitleView);
	menu.addEventListener("click", showmenu);
	  createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);
	
	
	
	
}


function showmenu()
{
	// Show menu
	menuBg = new createjs.Bitmap(queue.getResult("menuBg"));	
	menuBg.x =1024;
	stage.addChildAt(menuBg,2);
	//alert(stage.getChildAt(2));
	createjs.Tween.get(menuBg,{override: true}).to({x:0}, 300,createjs.Ease.backOut);
	menuBg.addEventListener("click", hidemenu); 
}

function hidemenu(e)
{

	createjs.Tween.get(menuBg).to({x:1024}, 300,createjs.Ease.bounceOut).call(rmvmenu);
}

// Remove menu

function rmvmenu()
{
	stage.removeChild(menuBg);
	
}

function tweenTitleView()
{		
	// Start Game
		createjs.Tween.get(TitleView).to({y:-800}, 300, createjs.Ease.backIn).call(addGameView);
}

function addGameView()
{
	
	stage.removeChild(timerText);
	stage.removeChild(TitleView);
	stage.removeChild(scoreText);
	stage.removeChild(again);
	enemyXSpeed = 1.5;
    enemyYSpeed = 1.75;
	//alert(enemyXSpeed);
	//	alert(enemyYSpeed);
	
	score=0;
	gameTime=60;
	/*
     *创建一个计时器，，用于右上角的倒计时
     */   
     gameTimer = setInterval(updateTime, 1000);   
	
	TitleView = null;
	//到这里只有背景一层
	//alert(stage.getChildAt(0));
 //枪
	
	gunImage = new createjs.Bitmap(queue.getResult("gun"));
	 
	gunImage.x=500;
	gunImage.y=710;
	gunImage.regX=96;
	gunImage.regY=96;
 	stage.addChild(gunImage);
	
    //分数界面
    scoreText = new createjs.Text("Score: " + score.toString(), "30px Arial", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);
    
    //计时器
    timerText = new createjs.Text("Time: " + gameTime.toString(), "30px Arial", "#FFF");
    timerText.x = 800;
    timerText.y = 10;
    stage.addChild(timerText);
    
    //添加背景声音
    createjs.Sound.play("background", {loop: -1});  
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('crowSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": {"flap": [0,4]}      
    });
	
    crowDeathSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('crowDeath')],
        "frames": {"width": 198, "height": 148},
        "animations": {"die": [0,7, false, 1]}      
    });
     
    //创建瞄准镜
	 var data={
        "images":["assets/focus.png"],
       
	"frames": [

    [162, 2, 78, 78], 
    [82, 2, 78, 78], 
    [2, 162, 78, 78], 
    [2, 82, 78, 78], 
    [2, 2, 78, 78]
],
	"animations": {
    
        "focus0001":[0], 
        "focus0002":[1], 
        "focus0003":[2], 
        "focus0004":[3], 
        "focus0005":[4]
}
    };
	  var SpriteSheet=new createjs.SpriteSheet(data);
	  aimSight=new createjs.Sprite(SpriteSheet,"animations");
	  stage.addChild(aimSight);
   
 
    
  
    createjs.Ticker.addEventListener("tick", tickEvent);
    
    //创建鼠标事件
    
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
    createEnemy(); 
	
}


   
function createEnemy()
{
    animation = new createjs.Sprite(spriteSheet, "flap");
	//让他们的中心点偏移到图片中间
    animation.regX = 99;
    animation.regY = 58;
	//记录下图片的坐标
    animation.x  =enemyXPos=parseInt(700*Math.random());
    animation.y =enemyYPos= parseInt(700*Math.random());
    stage.addChildAt(animation,1);
            
}
    
function crowDeath()
{
    deathAnimation = new createjs.Sprite(crowDeathSpriteSheet, "die");
    deathAnimation.regX = 99;
    deathAnimation.regY = 58;
    deathAnimation.x = enemyXPos;
    deathAnimation.y = enemyYPos;
    stage.addChild(deathAnimation);
	
}
    
function tickEvent()
{
   
    if (enemyXPos < WIDTH && enemyXPos > 0)
    {
        enemyXPos += enemyXSpeed;
        
    } else
    {
        enemyXSpeed = enemyXSpeed * (-1);
        enemyXPos += enemyXSpeed;           
        
    }
    
    if (enemyYPos < HEIGHT && enemyYPos > 0)
    {
        enemyYPos += enemyYSpeed;
    }else
    {
        enemyYSpeed = enemyYSpeed * (-1);
        enemyYPos += enemyYSpeed;
    }
    
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    
}
    
function handleMouseMove(ev)
{
	 oEvent=ev||event;
	 scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
	// alert(scrollTop);
	 aimSight.x = oEvent.clientX-45;
     aimSight.y = oEvent.clientY+scrollTop-45;
	 gunImage.rotation=parseInt(Math.atan2(aimSight.y-gunImage.y,aimSight.x-gunImage.x)*180/3.14);
	//alert(aimSight.x+"---"+aimSight.y);
}

function handleMouseDown(ev)
{   oEvent=ev||event;

    createjs.Sound.play("shot");
    enemyXSpeed *= 1.1;
    enemyYSpeed *= 1.1;
	//alert(enemyXSpeed);
	//	alert(enemyYSpeed);s
    var shotX = Math.round(oEvent.clientX);
    var shotY = Math.round(oEvent.clientY+scrollTop);
	//alert(shotX+"---"+shotY);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);
    var distX = Math.abs(shotX - spriteX);	
    var distY = Math.abs(shotY - spriteY); 
    if (distX < 30  && distY <59)
    {
       stage.removeChild(animation);	
        crowDeath();		
        score+=100;
        scoreText.text = "Score: " + score.toString();
        createjs.Sound.play("deathSound");   
        enemyYSpeed += 1.1;
        enemyXSpeed += 1.1;
        createEnemy();//创建一个新的敌人
    }else
    {
	    score -= 10;
		
        scoreText.text = "Score: " + score.toString();      
    }
	
}
  
  
    
function updateTime()
{
    gameTime -= 1;
    if (gameTime <0&&score>1000)
    {
        // End game and clean up
        timerText.text = "You are so good";
		createjs.Sound.play("gameOver");   
        stage.removeChild(animation);
        stage.removeChild(aimSight);
		stage.removeChild(gunImage);
        clearInterval(gameTimer);
        again = new createjs.Bitmap(queue.getResult("again"));	
		again.x =450;
		again.y =-100;
		stage.addChild(again);
		createjs.Tween.get(again).to({x:460,y:500}, 1000,createjs.Ease.backOut).call(rmvmenu);
		createjs.Tween.get(timerText).wait(500).to({x:250,y:280,scaleX:2,scaleY:2}, 1500,createjs.Ease.backOut).call(rmvmenu);
		createjs.Tween.get(scoreText).wait(500).to({x:250,y:350,scaleX:2,scaleY:2}, 1500,createjs.Ease.backOut).call(rmvmenu);
		stage.removeEventListener();
		window.onmousemove = null;
    window.onmousedown = null;
	again.addEventListener("click", addGameView);
		stage.update();
		
    }
	else if(gameTime <0&&score<1000){
		timerText.text = "Just a little bit ,keep play ";
		createjs.Sound.play("gameOver");   
        stage.removeChild(animation);
        stage.removeChild(aimSight);
		stage.removeChild(gunImage);
        clearInterval(gameTimer);
		again = new createjs.Bitmap(queue.getResult("again"));	
		again.x =450;
		again.y =-100;
		stage.addChild(again);
		createjs.Tween.get(again).to({x:460,y:500}, 1000,createjs.Ease.backOut).call(rmvmenu);
		createjs.Tween.get(timerText).wait(500).to({x:250,y:280,scaleX:2,scaleY:2}, 1500,createjs.Ease.backOut).call(rmvmenu);
		createjs.Tween.get(scoreText).wait(500).to({x:250,y:350,scaleX:2,scaleY:2}, 1500,createjs.Ease.backOut).call(rmvmenu);
		stage.removeEventListener();
		window.onmousemove = null;
    window.onmousedown = null;
	again.addEventListener("click", addGameView);
		stage.update();
	
		}
    else
    {
		
        timerText.text = "Time: " + gameTime
       createjs.Sound.play("tick");
    }
}
    
    
///////////////////////////////////////////////////////
///
///
//
//



