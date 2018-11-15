const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
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

let cursors;

let player;
let item;
let mani;
let sensei;

let accessinv = 0;
let inv;
let bginv;
let tmp;
let inventory = [];

let talking = 0;

let move = true;
let left = true;
let right = false;

let showDebug = false;

function preload(){
  this.load.image("tiles", "test.png");
  this.load.tilemapTiledJSON("map", "test.json");
  this.load.spritesheet('toto', 'toto.png',{ frameWidth: 24, frameHeight: 24 });
  this.load.spritesheet('move', 'move.png',{ frameWidth: 16, frameHeight: 22 });
  this.load.spritesheet('mani', 'mani.png',{ frameWidth: 24, frameHeight: 24 });
  this.load.spritesheet('sensei', 'sensei.png',{ frameWidth: 16, frameHeight: 23 });
  this.load.image('inv', "inv.png");
  this.load.image('bginv', "carre.png");
  //this.load.image('move', 'move.png');
}

function create(){
  const map = this.make.tilemap({ key: "map" });

  const tileset = map.addTilesetImage("test", "tiles");

  const waterLayer = map.createStaticLayer("Water", tileset, 0, 0);
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
  const movable = map.findObject("Objects", obj => obj.name === "Flower");
  const mani2 = map.findObject("Objects", obj => obj.name === "Herbs Bag");
  const sensei2 = map.findObject("Objects", obj => obj.name === "Gem");
  inv = this.add.sprite(50, 50, 'inv');
  inv.setDisplaySize(50,50);
  //inv.inputEnabled = true;
  //inv.events.onInputDown.add(goinv, this);
  inv.setInteractive();
  inv.on('pointerdown', () => goinv(this));

  worldLayer.setCollisionByProperty({ collides: true });
  waterLayer.setCollisionByProperty({ collides: true });
  //movable.setCollisionByProperty({ collides: true });
  aboveLayer.setDepth(10);

  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");


    //inv.input.enableDrag();


  //PNJ
    item = this.physics.add.sprite(movable.x, movable.y, 'move');

  //MOVE
    mani = this.physics.add.sprite(mani2.x, mani2.y, 'mani');

  //PICK
    sensei = this.physics.add.sprite(sensei2.x, sensei2.y, 'sensei');
    sensei.body.moves = false;
    sensei.name = 'sensei';
    console.log(sensei)
    //item.immovable = true;
    //item.body.moves = false;


    //item.enableBody = true;

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    //map.createFromObjects('Objects', 6, 'Flower', 0, true, false, coins);

  const debugGraphics = this.add.graphics().setAlpha(0.75);

  if(showDebug == true){
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    waterLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  }

  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "toto");
  //player.enableBody = true;
  this.physics.add.collider(player, worldLayer);
  this.physics.add.collider(player, waterLayer);
    //this.physics.add.collider(player, item,);
  this.physics.add.collider(player, item, test, null, this);

  this.physics.add.collider(player, mani, testmove, null, this);

  this.physics.add.collider(player, sensei, testpick, null, this);
//  if(talking==0){item.body.moves = true;}
  // movable = this.physics.add.group();
  // movable.enableBody = true;
  // map.createFromObjects('Objects', 8, 'Flower', 0, true, false, movable);
  // this.physics.add.collider(player, movable);
  // console.log(movable);

  cursors = this.input.keyboard.createCursorKeys();

  //key1 = cursors.addKey(this.input.keyboard.ONE);
  // key1 = new Key('KeyI');
  // key1.isDown.add(goinv, this);

  // var emitter = new Phaser.Events.EventEmitter();
  // emitter.repeat(Phaser.Timer.SECOND * 2, null, move, this);
  //this.time.events.repeat(Phaser.Timer.SECOND * 2, null, move, this);
  // let thisArg;
  // var timer = this.time.addEvent({
  //   delay: 500,                // ms
  //   callback: move,
  //   //args: [],
  //   callbackScope: thisArg,
  //   loop: true
  // });
}

function update(time, delta){
  const speed = 100;

  player.body.setVelocity(0);
  item.body.setVelocity(0);
  mani.body.setVelocity(0);
//  sensei.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(100);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(100);
  }
  // setTimeout(function(){
  //   if(left==true){
  //     console.log('go R')
  //     left = false;
  //     right = true;
  //   }
  // }, 1000)
  // setTimeout(function(){
  //   if(right==true){
  //     console.log('go L')
  //     left = true;
  //     right = false;
  //   }
  // }, 2000)

  if(left==true){
    item.body.setVelocityX(-20);
    setTimeout(function(){
      left = false;
      right = true;
    },2500)
  }
  else if(right==true){
    item.body.setVelocityX(20);
    setTimeout(function(){
      left = true;
      right = false;
    },2500)
  }
  // setTimeout(function(){
  //   item.body.setVelocityX(-20);
  // }, 100)
  // setTimeout(function(){
  //   item.body.setVelocityX(20);
  // }, 100)

  player.body.velocity.normalize().scale(speed);
  item.body.velocity.normalize().scale(20);
  // if(move==true){
  //   item.body.moves = true;
  // }
  // else {
  //   item.body.moves = false;
  // }
}

function goinv(game){
  //console.log('inv');
  //console.log(inventory);
  if(accessinv==0){
    accessinv = 1;
    bginv = game.add.sprite(200, 200, 'bginv');
    bginv.setDisplaySize(200,200);

    let width = 0;
    inventory.forEach(function(items){
      console.log(items);
      tmp = game.physics.add.sprite(210+width, 210, items);
      width+=tmp.width;
    });
  }
  else {
    accessinv = 0;
    bginv.destroy();
    if(tmp != undefined){
      tmp.destroy();
    }
  }
  // inv = this.add.sprite(200, 200, 'inv');
  // inv.inputEnabled = true;
}

function testpick(player, obj){
  if (cursors.space.isDown) {
    if(inventory.includes(obj.name) == false){
      inventory.push(obj.name);
      obj.destroy();
    }
  }
  //console.log(obj.name);

}

function testmove(player,mani){
  console.log('move');
}

function test(player, item){
  item.body.moves = false;
  move=false;
  //console.log(item);
  if (cursors.space.isDown) {
    if(talking==0){
      if(inventory.includes('sensei') == true){
        console.log('ok');
      }
      else {
        console.log('go take Sensei');
      }
    }
    talking++;
  }
  else{
    talking=0;
  }


  // function callback(player, item){
  //   move=true;
  // }
}
