const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let thisGame;

let cursors;
let bg_audio;

let player;
let japanese;
let jap_move = 'left';
let steampunk;
let pirate_f;
let p_f_move = 'left';
let pirate_m;
let p_m_move = 'left'
let girl;
let girl_move = 'top';

let rock;
let peach;
let lettuce;
let knowledge;
let pepito_book;
let book;
let potion;

let inventory = [];
let inventory_img;
let item = [];
let click_inv = 0;

let talking = 0;
let bubble;
let bubble_talk = 0;
let message;

let move_audio=0;

let showDebug = false;

function preload(){
  this.load.image("tiles", "./assets/css_sprites_1.png");
  this.load.tilemapTiledJSON("map", "./assets/game_map2.json");

  this.load.spritesheet('frenchie', './assets/french_f1.png',{ frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('items', './assets/items.png',{ frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('rock', './assets/burger.png',{ frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('japanese', './assets/japanese_f1.png',{ frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('steampunk', './assets/steampunk_m11.png',{ frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('pirate_f', './assets/pirategirl2.png',{ frameWidth: 33, frameHeight: 48 });
  this.load.spritesheet('pirate_m', './assets/pirate_m2.png',{ frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('girl', './assets/flowergirl02.png',{ frameWidth: 32, frameHeight: 48 });

  this.load.image("bubble", "./assets/bubble.png");
  this.load.image("inventory", "./assets/inventory.png");

  this.load.audio('bg_audio', 'assets/yesterbreeze.mp3');
  this.load.audio('opla', 'assets/opla.mp3');
  this.load.audio('move', 'assets/move.mp3');

  this.load.audio('steam', 'assets/steam.mp3');
  this.load.audio('pirate', 'assets/pirate.mp3');
  this.load.audio('piratef', 'assets/piratef.mp3');
  this.load.audio('jap', 'assets/jap.mp3');
  this.load.audio('girl', 'assets/girl.mp3');
}

function create(){
  thisGame = this;
  // audio
  this.sound.add('bg_audio');
  this.sound.play('bg_audio', {volume: 0.5});
  // set map and layers
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("tiles_pack", "tiles");

  const bgLayer = map.createStaticLayer("background-1", tileset, 0, 0);
  const wrdLayer1 = map.createStaticLayer("world-1", tileset, 0, 0);
  const wrdLayer2 = map.createStaticLayer("world-2", tileset, 0, 0);
  const rockLayer = map.createStaticLayer("rockcollides", tileset, 0, 0);
  const abvLayer1 = map.createStaticLayer("above-1", tileset, 0, 0);
  const abvLayer2 = map.createStaticLayer("above-2", tileset, 0, 0);
  // collisions from layers
  bgLayer.setCollisionByProperty({ collides: true });
  wrdLayer1.setCollisionByProperty({ collides: true });
  wrdLayer2.setCollisionByProperty({ collides: true });
  rockLayer.setCollisionByProperty({ collides: true });
  // above layers
  abvLayer1.setDepth(10);
  abvLayer2.setDepth(20);

  // find objects
  const spawn = map.findObject("objects", obj => obj.name === "spawn");
  const peach_item = map.findObject("objects", obj => obj.name === "peach");
  const lettuce_item = map.findObject("objects", obj => obj.name === "lettuce");
  const knowledge_item = map.findObject("objects", obj => obj.name === "knowledge");
  const rock_block = map.findObject("objects", obj => obj.name === "rock");
  const jap_spawn = map.findObject("objects", obj => obj.name === "japanese");
  const sp_spawn = map.findObject("objects", obj => obj.name === "steampunk");
  const p_f_spawn = map.findObject("objects", obj => obj.name === "pirate_f");
  const p_m_spawn = map.findObject("objects", obj => obj.name === "pirate_m");
  const girl_spawn = map.findObject("objects", obj => obj.name === "girl");

  // set sprites
  // characters
  player = this.physics.add.sprite(spawn.x, spawn.y, 'frenchie');
  japanese = this.physics.add.sprite(jap_spawn.x, jap_spawn.y, 'japanese');
  japanese.name = "japanese";
  steampunk = this.physics.add.sprite(sp_spawn.x, sp_spawn.y, 'steampunk');
  steampunk.name = "steampunk";
  pirate_f = this.physics.add.sprite(p_f_spawn.x, p_f_spawn.y, 'pirate_f');
  pirate_f.name = "pirate_f";
  pirate_m = this.physics.add.sprite(p_m_spawn.x, p_m_spawn.y, 'pirate_m');
  pirate_m.name = "pirate_m";
  girl = this.physics.add.sprite(girl_spawn.x, girl_spawn.y, 'girl');
  girl.name = "girl";
  // items
  peach = this.physics.add.sprite(peach_item.x, peach_item.y, 'items', 1);
  peach.body.moves = false;
  peach.name = 'peach';
  peach.key = 1;
  lettuce = this.physics.add.sprite(lettuce_item.x, lettuce_item.y, 'items', 6);
  lettuce.body.moves = false;
  lettuce.name = 'lettuce';
  lettuce.key = 6;
  knowledge = this.physics.add.sprite(knowledge_item.x, knowledge_item.y, 'items', 2);
  knowledge.body.moves = false;
  knowledge.name = 'knowledge';
  knowledge.key = 2;
  rock = this.physics.add.sprite(rock_block.x, rock_block.y, 'rock');
  // inventory
  inventory_img = this.add.sprite(60, 60, 'inventory');
  inventory_img.setScrollFactor(0);
  inventory_img.setDepth(30);
  inventory_img.setDisplaySize(100,100);
  inventory_img.setInteractive();
  inventory_img.on('pointerdown', () => show_inventory());

  // player
  this.anims.create({
    key: 'playerfront',
    frames: this.anims.generateFrameNumbers('frenchie', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'playerleft',
    frames: this.anims.generateFrameNumbers('frenchie', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'playerright',
    frames: this.anims.generateFrameNumbers('frenchie', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'playerback',
    frames: this.anims.generateFrameNumbers('frenchie', { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1
  });
  // japanese
  this.anims.create({
    key: 'japleft',
    frames: this.anims.generateFrameNumbers('japanese', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'japright',
    frames: this.anims.generateFrameNumbers('japanese', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'japstop',
    frames: this.anims.generateFrameNumbers('japanese', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });
  // pirate f
  this.anims.create({
    key: 'pfleft',
    frames: this.anims.generateFrameNumbers('pirate_f', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'pfright',
    frames: this.anims.generateFrameNumbers('pirate_f', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'pfstop',
    frames: this.anims.generateFrameNumbers('pirate_f', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });
  // pirate m
  this.anims.create({
    key: 'pmleft',
    frames: this.anims.generateFrameNumbers('pirate_m', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'pmright',
    frames: this.anims.generateFrameNumbers('pirate_m', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'pmstop',
    frames: this.anims.generateFrameNumbers('pirate_m', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });
  // girl
  this.anims.create({
    key: 'girltop',
    frames: this.anims.generateFrameNumbers('girl', { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'girlbottom',
    frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'girlstop',
    frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });

  // set collisions
  // player / layer
  this.physics.add.collider(player, bgLayer);
  this.physics.add.collider(player, wrdLayer1);
  this.physics.add.collider(player, wrdLayer2);
  this.physics.add.collider(girl, bgLayer);
  this.physics.add.collider(girl, wrdLayer1);
  this.physics.add.collider(girl, wrdLayer2);
  this.physics.add.collider(girl, pirate_f);
  // player / items
  this.physics.add.collider(player, peach, pick, null, this);
  this.physics.add.collider(player, lettuce, pick, null, this);
  this.physics.add.collider(player, knowledge, pick, null, this);
  // player / rock
  this.physics.add.collider(player, rock, move, null, this);
  // rock / layer
  this.physics.add.collider(rock, rockLayer);
  // player / pnj
  this.physics.add.collider(player, japanese, talk, null, this);
  this.physics.add.collider(player, steampunk, talk, null, this);
  this.physics.add.collider(player, pirate_f, talk, null, this);
  this.physics.add.collider(player, pirate_m, talk, null, this);
  this.physics.add.collider(player, girl, talk, null, this);

  // cursors
  cursors = this.input.keyboard.createCursorKeys();

  // set camera
  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  const debugGraphics = this.add.graphics().setAlpha(0.75);

  // debug
  if(showDebug == true){
    bgLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    wrdLayer1.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    wrdLayer2.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  }
}

function update(){
  // player speed
  const speed = 150;

  player.body.setVelocity(0);
  rock.body.setVelocity(0);
  japanese.body.setVelocity(0);

  // player
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    player.anims.play('playerleft', true);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
    player.anims.play('playerright', true);
  } else if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    player.anims.play('playerback', true);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    player.anims.play('playerfront', true);
  } else {
    player.anims.stop();
  }
  // japanese
  if(jap_move==='left'){
    if(japanese.param !== 'stop') {
      japanese.body.moves = true;
      japanese.body.setVelocityX(-20);
      japanese.anims.play('japleft', true);
    }
    else {
      japanese.anims.play('japstop', true);
    }
    setTimeout(function(){
      jap_move = 'right';
    },2500)
  }
  else if(jap_move==='right'){
    if(japanese.param !== 'stop') {
      japanese.body.moves = true;
      japanese.body.setVelocityX(20);
      japanese.anims.play('japright', true);
    }
    else {
      japanese.anims.play('japstop', true);
    }
    setTimeout(function(){
      jap_move = 'left';
    },2500)
  }
  // pirate f
  if(p_f_move==='left'){
    if(pirate_f.param !== 'stop') {
      pirate_f.body.moves = true;
      pirate_f.body.setVelocityX(-40);
      pirate_f.anims.play('pfleft', true);
    }
    else {
      pirate_f.anims.play('pfstop', true);
    }
    setTimeout(function(){
      p_f_move = 'right';
    },2500)
  }
  else if(p_f_move==='right'){
    if(pirate_f.param !== 'stop') {
      pirate_f.body.moves = true;
      pirate_f.body.setVelocityX(40);
      pirate_f.anims.play('pfright', true);
    }
    else {
      pirate_f.anims.play('pfstop', true);
    }
    setTimeout(function(){
      p_f_move = 'left';
    },2500)
  }
  // pirate m
  if(p_m_move==='left'){
    if(pirate_m.param !== 'stop') {
      pirate_m.body.moves = true;
      pirate_m.body.setVelocityX(-40);
      pirate_m.anims.play('pmleft', true);
    }
    else {
      pirate_m.anims.play('pmstop', true);
    }
    setTimeout(function(){
      p_m_move = 'right';
    },2500)
  }
  else if(p_m_move==='right'){
    if(pirate_m.param !== 'stop') {
      pirate_m.body.moves = true;
      pirate_m.body.setVelocityX(40);
      pirate_m.anims.play('pmright', true);
    }
    else {
      pirate_m.anims.play('pmstop', true);
    }
    setTimeout(function(){
      p_m_move = 'left';
    },2500)
  }
  // girl
  if(girl_move==='top'){
    if(girl.param !== 'stop') {
      girl.body.moves = true;
      girl.body.setVelocityY(-20);
      girl.anims.play('girltop', true);
    }
    else {
      girl.anims.play('girlstop', true);
    }
    setTimeout(function(){
      girl_move = 'bottom';
    },5500)
  }
  else if(girl_move==='bottom'){
    if(girl.param !== 'stop') {
      girl.body.moves = true;
      girl.body.setVelocityY(20);
      girl.anims.play('girlbottom', true);
    }
    else {
      girl.anims.play('girlstop', true);
    }
    setTimeout(function(){
      girl_move = 'top';
    },5500)
  }
  if(player.quest1==2){
    girl.body.moves = true;
    this.physics.moveToObject(girl, player, 0, 1000);
  }
  else if(player.quest1==3){
    girl.body.moves = false;
  }

  // diagonal speed
  rock.body.velocity.normalize().scale(10);
  player.body.velocity.normalize().scale(speed);
}

function show_inventory(){
  if(click_inv==0){
    click_inv = 1;
    inventory_img = thisGame.add.sprite(500, 725, 'bubble');
    inventory_img.setScrollFactor(0);
    inventory_img.setDepth(30);

    let width = 0;
    let i = 0;
    if(inventory.length > 0){
      inventory.forEach(function(items){
        if(Number.isInteger(items)){
          item[i] = thisGame.add.sprite(width+40, 700, 'items', items);
          width+=item[i].width*2;
          item[i].setDisplaySize(60,60);
          item[i].setScrollFactor(0);
          item[i].setDepth(40);
          i++;
        }
      });
    }
  }
  else {
    click_inv = 0;
    inventory_img.destroy();
    if(item != undefined){
      item.forEach(function(items){
        items.destroy();
      });
    }
  }
}

function move(){
  if(move_audio==0){
    // audio
    this.sound.add('move');
    this.sound.play('move');
    move_audio++;
  }
}

function talk(player, pnj){
  let text;
  pnj.body.moves = false;
  pnj.anims.stop();
  pnj.param = 'stop';

  if (cursors.space.isDown) {
    if(talking==0){
      if(pnj.name=='japanese'){
        text = 'Mireille\n\nHi sweetie, you should talk to the scientist up there, he seems... upset!';
      }
      else if(pnj.name=='steampunk'){
        if(inventory.includes('Dr. Pepito\'s book') == false && player.quest2!=3){
          text = 'Dr. Pepito\n\nOh shit shit, a pirate stole my book! You! Mercenary.. go and take it for me!\nHe must be at the beach.';
          player.quest2 = 1;
        }
        else {
          if(player.quest2==2 ){
            text = 'Dr. Pepito\n\nMy book!! You saved my life! Let me give you a Super Potion..\nOk ok move on!';
            player.quest2 = 3;

            potion = thisGame.physics.add.sprite(0, 0, 'items');
            potion.name = 'potion';
            potion.key = 16;
            inventory.push(potion.name);
            inventory.push(potion.key);
            potion.destroy();
            inventory.forEach(function(items){
              if(items==pepito_book.name){
                inventory = arrayRemove(inventory, items);
              }
              if(items==pepito_book.key){
                inventory = arrayRemove(inventory, items);
              }
            });
          }
          else {
            text = 'Dr. Pepito\n\n...';
          }
        }
      }
      else if(pnj.name=='pirate_f'){
        if(!player.quest1 || player.quest1==1) {
          player.quest1 = 1;
          text = 'Monica\n\nOh my god! my little sister Kiki just ran straight into the forest!\ni can\'t go there.. A Big Burger block the way!\nI am vegan so i won\'t touch it.. can you help me to bring her back?';
        }
        else if(player.quest1==2){
          text = 'Monica\n\nYou are a good person.';
          player.quest1 = 3;
        }
        else {
          text = 'Monica\n\nHi dude!';
        }
      }
      else if(pnj.name=='pirate_m'){
        if(player.quest2==1){
          text = 'Leonard\n\nWho do you think i am?!!\n.. Ok ok you can take it, i don\'t like to read to be fair, take those two books.\n( check your inventory )';
          player.quest2 = 2;

          pepito_book = thisGame.physics.add.sprite(0, 0, 'items');
          book = thisGame.physics.add.sprite(0, 0, 'items');
          pepito_book.name = 'Dr. Pepito\'s book';
          book.name = 'book';
          pepito_book.key = 4;
          book.key = 9;
          inventory.push(pepito_book.name);
          inventory.push(pepito_book.key);
          inventory.push(book.name);
          inventory.push(book.key);
          pepito_book.destroy();
          book.destroy();
        }
        else {
          text = 'Leonard\n\nOh Jamming tututuluu';
        }
      }
      else if(pnj.name=='girl'){
        if(player.quest1==1){
          text = 'Kiki\n\nLalala, i am freeeee LALALAA.. WHAT AGAIN ?!! NOOO i don\'t want to go home!!!';
          player.quest1 = 2;
        }
        else {
          text = 'Kiki\n\nMy name is Kiki. i wish i was a wich..';
        }
      }

      if(bubble_talk==0){
        // audio
        if(pnj.name=='japanese'){
          this.sound.add('jap');
          this.sound.play('jap');
        }
        else if(pnj.name=='steampunk'){
          this.sound.add('steam');
          this.sound.play('steam');
        }
        else if(pnj.name=='pirate_f'){
          this.sound.add('piratef');
          this.sound.play('piratef', {volume: 4});
        }
        else if(pnj.name=='pirate_m'){
          this.sound.add('pirate');
          this.sound.play('pirate');
        }
        else if(pnj.name=='girl'){
          this.sound.add('girl');
          this.sound.play('girl');
        }

        player.body.moves = false;

        bubble_talk = 1;
        // bubble
        bubble = this.add.sprite(500, 725, 'bubble');
        bubble.setScrollFactor(0);
        bubble.setDepth(50);
        message = this.add.text(0, 655, text, {
          font: "18px monospace",
          fill: "#ffffff",
          padding: { x: 20, y: 10 }
        })
        .setShadow(6, 6, 'rgba(0,0,0,0.5)', 5)
        .setScrollFactor(0)
        .setDepth(60);
      }
      else {
        if(bubble != undefined){
          player.body.moves = true;
          bubble.destroy();
          message.destroy();
          bubble_talk = 0;
        }
      }
    }
    talking++;
  }
  else{
    talking=0;
  }
}

function pick(player, obj){
  // audio
  this.sound.add('opla');
  this.sound.play('opla');
  if(inventory.includes(obj.name) == false){
    inventory.push(obj.name);
    inventory.push(obj.key);
    obj.destroy();
  }
}

function arrayRemove(array, value) {
  return array.filter(function(ele){
    return ele != value;
  });
}
