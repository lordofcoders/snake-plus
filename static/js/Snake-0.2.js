//var socket = io.connect('http://localhost:8888');
		//socket.on('connect', function(){});
		(function (window) {
			window.URLS = [
				'images/block.png'
			];

			
			
			//Segment class
			window.Segment = function(image, type) {
				var that = new createjs.Bitmap(image);
				that.initialize(image);
				that.name = 'Segment';
				that.snapToPixel = true;
				that.type = type;
				that.x = 580;
				that.y = 280;
				
				that.update = function(x, y) {
					that.x = x;
					that.y = y;
				}
				
				return that;
			}
			
			//Snake class
			window.Snake = function() {
				var that = this;
				that.name = 'Snake';
				that.direction = 2
				that.velocity = 20;
				that.segments = [];
				that.size = 0;
				
				that.goLeft = function() {
					that.direction = 0;
				}
				
				that.goRight = function() {
					that.direction = 2;
				}
				
				that.goUp = function() {
					that.direction = 1;
				}
				
				that.goDown = function() {
					that.direction = 3;
				}
				
				that.update = function() {
					var tempX = that.segments[0].x;
					var tempY = that.segments[0].y;
					for(var i=1; i<that.size; i++)
					{
						var tempX2 = that.segments[i].x;
						var tempY2 = that.segments[i].y;
						that.segments[i].x = tempX;
						that.segments[i].y = tempY;
						tempX = tempX2;
						tempY = tempY2;
					}
					switch(that.direction)
					{
						case 0:
							that.segments[0].x -= that.velocity;
							
						break;
						case 1:
							that.segments[0].y -= that.velocity;
						break;
						case 2:
							that.segments[0].x += that.velocity;
						break;
						case 3:
							that.segments[0].y += that.velocity;
						break;
					}
					
					if(that.segments[0].x <= -20)
						that.segments[0].x = 1180;
					else if(that.segments[0].x >= 1200)
						that.segments[0].x = 0;
					if(that.segments[0].y <= -20)
						that.segments[0].y = 580;
					else if(that.segments[0].y >= 600)
						that.segments[0].y = 0;
				}
				
				that.addSegment = function(segment) {
					segment.type = 'segment'
					if(that.segments.length === 0)
						that.segments.push(segment);
					else
					{
						var head_x = that.segments[0].x;
						var head_y = that.segments[0].y;
						
						
						switch(that.direction)
						{
							case 0:
								segment.x = head_x - 20;
								segment.y = head_y;
							break;
							case 1:
								segment.x = head_x;
								segment.y = head_y - 20;
							break;
							case 2:
								segment.x = head_x + 20;
								segment.y = head_y;
							break;
							case 3:
								segment.x = head_x;
								segment.y = head_y + 20;
							break;
						}
						
						this.segments.unshift(segment);
					}
					
					this.size++;
				}
				
				return that;
			}
			
			window.Game = function () {
				var that = this;
				that.directionLock = true;
				that.init = function(stage, assets)
				{
					that.assets = assets;
					that.stage = stage;
					that.foods = [];
					that.score = 0;
					that.snake = new Snake();
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					that.snake.addSegment(new Segment(that.assets[0], 'segment'));
					
					for(var i=0; i< that.snake.size; i++)
					{
						that.stage.addChild(that.snake.segments[i]);
					}
					
					document.onkeydown = handleKeyUp;
					function handleKeyUp(e)
					{
						var direction = e.keyCode - 37;
						if(Math.abs(direction - that.snake.direction) != 2 && that.directionLock)
						{
							that.snake.direction = direction;
							that.directionLock = false;
						}
					}
					
					createjs.Ticker.setFPS(20);
					createjs.Ticker.addEventListener("tick", tick);
					that.spawnFood();
					function tick(e) 
					{
						that.snake.update();
						that.updatePhysics();
						that.stage.update();
						that.directionLock = true;
					}
				}

				that.updatePhysics = function()
				{
					for(var i=1; i<that.snake.size; i++)
					{
						var intersection = ndgmr.checkRectCollision(that.snake.segments[0], that.snake.segments[i])
						
						if(intersection != null)
						{
							createjs.Ticker.reset();
						}
					}
					
					for(var i=0; i<that.foods.length; i++)
					{
						var intersection = ndgmr.checkRectCollision(that.snake.segments[0], that.foods[i])
						
						if(intersection != null)
						{
							var head = that.foods.splice(i, 1);
							that.snake.addSegment(head[0]);
							that.spawnFood();
							that.score += 10;
							document.getElementById('score').innerHTML = that.score;
						}
					}
				}
				
				that.spawnFood = function()
				{
					var x = Math.floor(Math.random() * 1200);
					var excess = x % 20;
					x -= excess;
					
					var y = Math.floor(Math.random() * 600);
					excess = y % 20;
					y -= excess;
					var check = true;
					for(var i=0; i<that.snake.segments.length; i++)
					{
						if(that.snake.segments[i].x === x && that.snake.segments[i].y === y)
						{ 
							check = false;
							break;
						}
					}
					
					if(check)
					{
						var food = new Segment(that.assets[0], 'food');
						
						food.x = x;
						food.y = y;
						that.foods.push(food); 
						that.stage.addChild(food);
					}
					else
					{
						that.spawnFood();
					}
				}

				return that;
			};
			
		} (window));
		
		$(document).ready(function(){
			var assets = [];
			var cnt = 0;

			for (var i = 0; i < URLS.length; i++) 
			{
				var img = new Image();
				img.onload = function() {
					++cnt;
					if (cnt >= URLS.length) 
					{
						canvas = document.createElement('canvas');
						canvas.width = 1200;
						canvas.height = 600;
						canvas.id = 'canvas';
						document.body.appendChild(canvas);
						$('#canvas').css({
							top: Math.round($(window).innerHeight()/2 - 300)
						});
						var stage = new createjs.Stage('canvas');
						var game = new Game();
						game.init(stage, assets);
					} 
					else 
					{
						// still more images to load
					}
				};
				img.src = URLS[i];
				assets.push(img);
			}
			
		});
		
		
		
		