var params = new URLSearchParams(window.location.search)

var width = 800;
var height = 600;
var messages = [
    {
        name: "伊東マコト",
        msg: "貴様のお誕生日は沢山の\nマコトの犠牲の上に成り立っています。\nおめでとう。",
    },
    {
        name: "エリシア",
        msg: "お誕生日ﾆｬ\nおめでﾆｬ-とうございﾆｬます！\nﾆｬ(*ΦωΦ)ฅ",
    },
    {
        name: "まきこ",
        msg: "チャナさんおたおめ〜！\nいつもいっぱいおはなししてくれて\n嬉しいよ〜すき！",
    },
    {
        name: "香蘭",
        msg: "お誕生日おめでとう！\n素敵な一年を！",
    },
    {
        name: "𝔫𝔢𝔴𝔟𝔦𝔢",
        msg: "神が生まれた日\n(ネットの)海の向こう側から\nお誕生日おめでとうございます！",
    },
    {
        name: "ぷりん",
        msg: "ちゃやまさるお\n誕生日おめでとう( ᐡ.  ̫ .ᐡ )\nまた旅行いこうね♡",
    },
    {
        name: "すーぎの",
        msg: "ちゃなしへ\n4歳のお誕生日圧倒的におめでとう！\nまた一つ大人になったね！",
    },
    {
        name: "たにこう",
        msg: "お誕生日メッセージかぁ…\n何がいいかな、どんなのにしようか、\nえっ！もうカメラ回ってるの！？\n待って待っ",
    },
]

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var nameText;
var livingEnemies = [];
var watari;


// makoto
var aliensRow = params.get('row') ? params.get('row') : 3;
var aliensCol = params.get('col') ? params.get('col') : 15;
// var aliensRow = 1;
// var aliensCol = 1;
var enemyFiresSpeed = 360;
// var enemyFiresInterval = 500;
// var enemyFiresInterval = 3000;



// sounds
var bgm;
var fx;
var ending;

document.querySelector('.msg_num').innerText = messages.length;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'makovader', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    // images
    game.load.image('bullet', 'img/tsuno.png');
    // game.load.image('enemyBullet', 'img/invaders/enemy-bullet.png');
    game.load.image('enemyBullet', 'img/unko.png');
    // game.load.spritesheet('invader', '../assets/games/invaders/invader32x32x4.png', 32, 32);
    game.load.image('invader', 'img/makoto.png');
    // game.load.image('ship', '../assets/games/invaders/player.png');
    game.load.image('ship', 'img/chana.png');
    game.load.spritesheet('kaboom', 'img/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'img/sora.png');
    game.load.image('background', 'img/invaders/background2.png');
    game.load.image('heart', 'img/heart.png');
    game.load.image('watari', 'img/watari.png');



    //sounds
    game.load.audio('bgm', 'audio/watari_birthday.mp3');
    game.load.audio('ending', 'audio/ending.mp3');

    game.load.audio('sfx', 'audio/saku.mp3');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);



    watari = game.add.group();
    watari.enableBody = true;
    watari.physicsBodyType = Phaser.Physics.ARCADE;
    watari.createMultiple(30, 'watari');
    watari.setAll('anchor.x', 0.5);
    watari.setAll('anchor.y', 1);
    watari.setAll('outOfBoundsKill', true);
    watari.setAll('checkWorldBounds', true);



    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, {
        font: '34px Arial',
        fill: '#000'
    });

    //  Lives
    lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '40px Arial',
        fill: '#ec008c',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 500,
        maxLines: 4,
        fontWeight: 'bold',
    });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    nameText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '30px Arial',
        fill: '#ec008c',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 500,
        maxLines: 4,
        fontWeight: 'bold',
    });
    nameText.anchor.setTo(0.5, 0.5);
    nameText.visible = false;

    for (var i = 0; i < 3; i++) {
        var ship = lives.create(game.world.width - 100 + (40 * i), 20, 'heart');
        ship.anchor.setTo(0.5, 0.5);
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    // sounds
    bgm = game.add.audio('bgm');
    ending = game.add.audio('ending');


    game.sound.setDecodedCallback(bgm, startBgm, this);


    fx = game.add.audio('sfx');
    fx.allowMultiple = true;
    fx.addMarker('playerFire', 0, 0.749);
}

function startBgm() {

    // sounds.shift();
    ending.stop();
    bgm.loopFull(0.4);
    // bgm.play("", 0, 0.4, true);
    // bgm.onLoop.add(hasLooped, this);
}

function startEnding() {
    bgm.stop();
    ending.loopFull(0.2);
}

function createAliens() {

    for (var y = 0; y < aliensRow; y++) {
        for (var x = 0; x < aliensCol; x++) {
            var alien = aliens.create(x * 40, y * 65, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [0, 1, 2, 3], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 50;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to({
        x: 200
    }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function setupInvader(invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (player.alive) {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown && player.body.x > 0) {
            player.body.velocity.x = -200;
        } else if (cursors.right.isDown && player.body.x < width - player.body.width) {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown) {
            fireBullet();
        }

        if (game.time.now > firingTimer) {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        game.physics.arcade.overlap(watari, player, enemyHitsPlayer, null, this);
    }

}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler(bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0) {
        score += 1000;
        scoreText.text = scoreString + score;

        // enemyBullets.callAll('kill', this);
        enemyBullets.callAll('kill');
        watari.callAll('kill');
        const randIndex = randRange(0, messages.length - 1);
        stateText.text = messages[randIndex].msg;
        stateText.visible = true;
        nameText.text = messages[randIndex].name;
        nameText.y = stateText.bottom + 30;
        nameText.visible = true;

        startEnding();

        //the "click to restart" handler
        game.input.onTap.addOnce(restart, this);
    }

}

function enemyHitsPlayer(player, bullet) {

    bullet.kill();

    if (bullet.key == 'watari') {
        lives.callAll('kill');
    } else {
        live = lives.getFirstAlive();

        if (live) {
            live.kill();
        }
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1) {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text = " GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart, this);
    }

}

function enemyFires() {

    //  Grab the first bullet we can from the pool
    const isWatari = randRange(1, 5) == 1 ? true : false;
    // const isWatari = true;
    enemyBullet = isWatari ? watari.getFirstExists(false) : enemyBullets.getFirstExists(false);

    livingEnemies.length = 0;

    aliens.forEachAlive(function (alien) {

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0) {

        var random = game.rnd.integerInRange(0, livingEnemies.length - 1);

        // randomly select one of them
        var shooter = livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        //moveToObject(出発地点、目的地、速度)
        const speed = isWatari ? randRange(200 ,700) : enemyFiresSpeed;
        game.physics.arcade.moveToObject(enemyBullet, player, speed);
        // 敵の弾の間隔
        // firingTimer = game.time.now + enemyFiresInterval;
        firingTimer = game.time.now + randRange(250, 500);
    }

}

function fireBullet() {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            //  And fire it
            bullet.reset(player.x, player.y);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 250;
            fx.play('playerFire');
        }
    }

}

function resetBullet(bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart() {

    //  A new level starts
    score = 0;
    bullets.callAll('kill');

    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;
    nameText.visible = false;

    startBgm();

}

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);