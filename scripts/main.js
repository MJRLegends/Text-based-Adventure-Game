var weapons = [ //Format: Name, Damage
 ["sword", 25],
 ["ak47", 50],
 ["colt", 10],
 ["p90", 45],
 ["knife", 15],
 ["machette", 40]
];

var methods = [  //Format: CommandName
 "attack",
 "defend",
 "run",
 "playerhealth",
 "enemyhealth",
 "start",
 "lookaround",
 "commands",
 "explore",
 "inventory",
 "eat",
 "move"
];
 
var enemies = [ //Format: Name, Health Multiplier
 ["goblin", 1],
 ["rat", 2],
 ["giant", 4],
 ["bear", 4]
];

var loot = [ //Format: Name, HealthRegen
 ["apple","10"],
 ["coin","0"],
 ["diamond","0"],
 ["cooked meat","5"],
 ["skull","0"],
 ["bones","0"],
 ["map","0"],
 ["compress","0"],
 ["planks","0"],
 ["logs","0"]
];

var playerInventory = [
 ["coins", "1"],
 ["apple", "6"]
]; //Format: Name, Amount

var RoomTypes = [ // Format: Name, HasCaves, HasChests, HasEnemies
	["Forest", true, true, true],
	["Hills", true, true, true],
	["River", true, true, true],
	["DarkForest", true, true, true]
]

var mapRooms = []
var health = 100; // Default: 100
var enemyHealth = 0; // Default: 0
var gameStarted = "";

var enemySpawned = false;
var eventRunning = false;
var eventType = 0;
var inCave = false;

var mapGridX = 6;
var mapGridY = 6;

var playerX = 0;
var playerY = 0;

function mainGame(){
	var input = document.getElementById("inputBox").value;
	var words = input.split(" ");
	if(gameStarted == "" && words[0] == "startMap"){
		outToConsole("Game has now been started!");
		gameStarted = "startMap";
		gererateRooms();
		for(var i = 0; i < mapRooms.length; i++){
			outToConsole("Room " + i + ":  " + mapRooms[i]);
		}
	}
	else if(gameStarted == "startRandom" || gameStarted == "startMap"){
		gameInputChecker(words);
	}
	else{
		outToConsole("Command or Method not found! Use the command 'startMap' to use the map based game!");
	}
}
	
function gameInputChecker(words){
	switch(words[0].toLowerCase())
	{
		case methods[0]: // attack
			attackEnemy(words);
			break;
		case methods[1]: // defend
			if(enemySpawned == true){
				outToConsole("Defended the enemies attack!");
			}
			else
				outToConsole("Theres nothing to run from!");
			break;
		case methods[2]: // run
			if(enemySpawned == true){
				outToConsole("Running away from enemy");
				enemySpawned= false;
				eventRunning = false;
				enemyHealth = 0;
			}
			else
				outToConsole("Theres nothing to run from!");
			break;
		case methods[3]: // playerhealth
				outToConsole("Player Health: " + health);
			break;
		case methods[4]: // enemyhealth
				outToConsole("Enemy Health: " + enemyHealth);
			break;
		case methods[6]: // lookaround
			if(eventType != 1 && eventType != 0)
			{
				eventType = 0;
				eventRunning = 0;
			}
			else
				eventHandler();
			break;
		case methods[7]: // commands
				var commands = "The following commands are enabled: ";
				for(var i = 0; i < methods.length; i++){
					if(i == methods.length -1)
						commands = commands + methods[i];
					else
						commands = commands + methods[i] + ", ";
				}
				outToConsole(commands);
			break;
		case methods[8]: // explore
			if(eventType == 2){ // Cave
				outToConsole("You walk into the cave!");
				inCave = true;
			}
			else if(eventType == 3){ // Chest
				var randomLoot = Math.floor((Math.random() * loot.length) + 0);
				outToConsole("You have found a " + loot[randomLoot] + " in the chest! This item has now been added to your inventory!");
				playerInventory[playerInventory.length] = randomLoot;
			}
			else{
				outToConsole("Theres nothing to explore");
			}
			eventRunning = false;
			eventType = 0;
			break;
		case methods[9]: // inventory
			var inventory = "Inventory: ";
			for(var i = 0; i < playerInventory.length; i++){
				if(i == playerInventory.length -1)
					inventory = inventory + playerInventory[i];
				else
					inventory = inventory + playerInventory[i] + ", ";
			}
			if(playerInventory.length == 0)
				inventory = inventory + " You have no items!";
			outToConsole(inventory);
			break;
		case methods[10]: // eat
			if(playerInventory.length > 0){
				var name = words[1];
				var found = false;
				for(var i = 0; i < playerInventory.length; i++){
					if(name.toLowerCase() == playerInventory[i][0]){
						found = true;
						var amount = playerInventory[i][1];
						for(var j = 0; j < loot.length; j++){
							if(name == loot[j][0]){
								if(loot[j][1] != "0"){
									playerInventory[i][1] = parseInt(amount) - 1;
									health = health + parseInt(loot[j][1]);
									outToConsole("Added " + loot[j][1] + " to your health!");
								}
								else
									outToConsole("You cant eat this item!");
							}
						}
					}
				}
				if(found == false)
					outToConsole("You dont have a " + name + " in your inventory!");
			}
			break;
		case methods[11]: //move
			if(gameStarted == "startMap"){
				playerMove(words);
			}
			else 
				outToConsole("Command or Method not found!");
			break;
		default:
			outToConsole("Command or Method not found!");
			break;
	}
}

function playerMove(words){
	var direction = words[1];
	
	/* Map Design
		1	2	3 	4	5	6
		7	8	9	10	11	12
		13	14	15	16	17	18
		19	20	21	22	23	24
	if(direction == "left"){
		if(playerLocation != 1 && playerLocation != 7 && playerLocation != 13 && playerLocation != 19){
			playerLocation--;
			outToConsole("Player is moving left!");
		}
		else
			outToConsole("You cant move this direction!");
	}
	else if(direction == "up"){
		if(playerLocation != 1 && playerLocation != 2 && playerLocation != 3 && playerLocation != 4 && playerLocation != 5 && playerLocation != 6){
			playerLocation = playerLocation - 6;
			outToConsole("Player is moving up!");
		}
		else
			outToConsole("You cant move this direction!");
	}
	else if(direction == "right"){
		if(playerLocation != 6 && playerLocation != 12 && playerLocation != 18 && playerLocation != 24){
			playerLocation++;
			outToConsole("Player is moving right!");
		}
		else
			outToConsole("You cant move this direction!");
	}
	else if(direction == "down"){
		if(playerLocation != 19 && playerLocation != 20 && playerLocation != 21 && playerLocation != 22 && playerLocation != 23 && playerLocation != 24){
			playerLocation = playerLocation + 6;
			outToConsole("Player is moving down!");
		}
		else
			outToConsole("You cant move this direction!");
	}
	else
		outToConsole("Unknown Direction!");*/
	
	outToConsole("Current Coords" + playerX + ", " + playerY);
	if(direction == "left"){
		playerX--;
	}
	else if(direction == "right"){
		playerX++;
	}
	else if(direction == "up"){
		playerY++;
	}
	else if(direction == "down"){
		playerY--;
	}
	else
		outToConsole("Unknown Direction!");
	outToConsole("Moved to Coords" + playerX + ", " + playerY);
}

function gererateRooms(){
	for(var i = 0; i < (mapGridX * mapGridY); i++){
		var room = Math.floor((Math.random() * RoomTypes.length) + 0);
		mapRooms[i] = RoomTypes[room][0];
	}
}


function attackEnemy(words){ // Attack function
	if(words[1] != "with")
	{
		outToConsole("Unknown method of attack!");
		return;
	}
	if(enemySpawned == true){
		var isFound = false;
		for(var i = 0; i < weapons.length; i++){
			if(weapons[i][0] == words[2].toLowerCase()){
				isFound = true;
				var damage = weapons[i][1];
				enemyHealth = enemyHealth - damage;
				health = health - randomPlayerDamage(10);
				if(enemyHealth <= 0){
					outToConsole("Attack took " + damage + " damage from the enemy. Player Health is now " + health +". and Enemy Health is now 0");
					enemySpawned= false;
					eventRunning = false;
					enemyHealth = 0;
					outToConsole("Enemy has fallen to the ground!");
				}
				else if(health <= 0){
					enemySpawned= false;
					eventRunning = false;
					outToConsole("Player has died! Game Over! Use the 'start' command to try again!");
				}
				else
					outToConsole("Attack took " + damage + " damage from the enemy. Player Health is now " + health +". and Enemy Health is now " + enemyHealth);
			}
		}
		if(isFound == false)
		{
			var weaponsList = "The following commands are enabled: ";
				for(var i = 0; i < weapons.length; i++){
					if(i == weapons.length -1)
						weaponsList = weaponsList + weapons[i][0];
					else
						weaponsList = weaponsList + weapons[i][0] + ", ";
				}
			outToConsole("Weapon not found! You can use the following weapons: " + weaponsList);
		}
	}
	else
		outToConsole("There is noting to attack!");
}

function generateEnemy(){
	if(enemySpawned == false){
		var randomEnemy = Math.floor((Math.random() * enemies.length) + 0);
		var name = enemies[randomEnemy][0];
		var multipler = enemies[randomEnemy][1];
		
		enemyHealth = (Math.floor((Math.random() * 150) + 50)) * multipler;
		outToConsole("An " + name + " has be found! It seems to have " + enemyHealth + " health!");
		enemySpawned = true;;
	}
}

function eventHandler(){ // Creates a random game event
	if(eventRunning == false){
		var done = false;
		//while(done == false){
			var currentRoom = mapRooms[(playerY*6) + playerX];
			for(var i = 0; i < RoomTypes.length; i++){
				if(RoomTypes[i][0] == currentRoom){
					var hasCaves = RoomTypes[i][1];
					var hasChests = RoomTypes[i][2];
					var hasEnemies = RoomTypes[i][3];
				}
			}
			outToConsole(hasCaves+ "," + hasChests + "," + hasEnemies);
			var random  = Math.floor((Math.random() * 3) + 1);
			eventType = random;
			switch(random){
				case 1: // Attack mode
					if(hasEnemies){
						generateEnemy();
						done = true;
					}
					break;
				case 2: // Cave
					if(hasCaves){
						outToConsole("You have found a cave! Do the 'explore' command to walk into the cave or 'lookaround' command to see what else you can find!");
						done = true;
					}
					break;
				case 3: //Chest
					if(hasChests){
						outToConsole("You have found a chest! Do the 'explore' command to look into the chest or 'lookaround' command to see what else you can find!");
						done = true;
					}
					break;
			}
		//}
		eventRunning = true;
	}
}


function outToConsole(string){ // Outputs text to the console on the web page.
	document.getElementById("console").value = (string + '/\n' + document.getElementById("console").value).replace('/', "");
}

function randomPlayerDamage(max){
	var randomNum = Math.floor((Math.random() * max) + 1);
	return randomNum;
}