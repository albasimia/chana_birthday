var params = new URLSearchParams(window.location.search)

var width = 800;
var height = 600;
var messages = [{
        id: 1,
        name: "伊東マコト",
        msg: "貴様のお誕生日は沢山の\nマコトの犠牲の上に成り立っています。\nおめでとう。",
    },
    {
        id: 2,
        name: "エリシア",
        msg: "お誕生日ﾆｬ\nおめでﾆｬ-とうございﾆｬます！\nﾆｬ(*ΦωΦ)ฅ",
    },
    {
        id: 3,
        name: "まきこ",
        msg: "チャナさんおたおめ〜！\nいつもいっぱいおはなししてくれて\n嬉しいよ〜すき！",
    },
    {
        id: 4,
        name: "香蘭",
        msg: "お誕生日おめでとう！\n素敵な一年を！",
    },
    {
        id: 5,
        name: "𝔫𝔢𝔴𝔟𝔦𝔢",
        msg: "神が生まれた日\n(ネットの)海の向こう側から\nお誕生日おめでとうございます！",
    },
    {
        id: 6,
        name: "ぷりん",
        msg: "ちゃやまさる\nお誕生日おめでとう( ᐡ.  ̫ .ᐡ )\nまた旅行いこうね♡",
    },
    {
        id: 7,
        name: "すーぎの",
        msg: "ちゃなしへ\n4歳のお誕生日圧倒的におめでとう！\nまた一つ大人になったね！",
    },
    {
        id: 8,
        name: "たにこう",
        msg: "お誕生日メッセージかぁ…\n何がいいかな、どんなのにしようか、\nえっ！もうカメラ回ってるの！？\n待って待っ",
    },
    {
        id: 9,
        name: "ライコ",
        msg: "Happy birthday Chana masala!\nIf you play this game,\nit's your birthday every day,\noh my god!",
    },
    {
        id: 10,
        name: "たき",
        msg: "ちゃな誕生日おめでとう！\n楽しい事いっぱいの\n１年になりますように♡",
    },
    {
        id: 11,
        name: "260",
        msg: "ドスケベキングダムでは4歳で丁度成人！\nお酒もタバコも解禁です、おめでとう。",
    },
    {
        id: 12,
        name: "あおぱん",
        msg: "ちゃな！誕生日おめでとう！！\n今年も仲良くしてね🥺",
    },
    {
        id: 13,
        name: "ポポ",
        msg: "お誕生日おめでとう！\nケーキ作れるようになったら\nもっていくね！",
    },
    {
        id: 14,
        name: "エフォフォイ",
        msg: "お誕生日おめでとう。\n4歳になったと言うことは時間にして35040\n時間経過したということでおめでたい限り\nです。あ、でもこれを見てる時は生まれた時\n間すぎてないかな？そもそも１年は正確には\n365.242日だから正確には24×365じゃないし、\nだから閏年とかあるんだけど、\nそれも400年に3日は違ってて（以下省略",
    },
    {
        id: 15,
        name: "ｶﾀﾙｼｽﾜﾀﾘ",
        msg: "ChromeでF12キーを押してElements。",
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
var scoreTimer = 0;
var state = 'start'; // start, play, clear, gameover
var stateText;
var msgText;
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
var clearVoices;
var gameoverVoices;

// メッセージ数の表示
document.querySelector('.msg_num').innerText = messages.length;

// ハイスコアの表示
const hiscore = document.querySelector('.hiscore');
var hiscore_data = JSON.parse(localStorage.getItem('hiscore'));
if (hiscore_data) {
    hiscore.innerText = hiscore_data;
} else {
    hiscore_data = 0;
}

// 獲得済みメッセージの表示
let obtained_messages = localStorage.getItem('obtained_messages');
if (obtained_messages) {
    obtained_messages = JSON.parse(obtained_messages);
} else {
    obtained_messages = [];
}
const msg_table = document.querySelector('.msg_table tbody');
createMsgTable();


var game;
var regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
if(window.navigator.userAgent.search(regexp) !== -1){
    const caption = document.querySelector('.caption');
    caption.classList.remove('sp_only');
}else {
    game  = new Phaser.Game(width, height, Phaser.AUTO, 'makovader', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
}

function createMsgTable() {
    msg_table.textContent = null;
    messages.forEach(element => {
        if (obtained_messages.indexOf(element.id) != -1) {
            msg_table.insertAdjacentHTML('beforeend', '<tr><th>' + element.name + '</th><td>' + element.msg + '</td></tr>');
        } else {
            msg_table.insertAdjacentHTML('beforeend', '<tr><th>???</th><td>?????</td></tr>');
        }
    });
}

function preload() {

    // images
    game.load.image('bullet', 'img/tsuno.png');
    game.load.image('enemyBullet', 'img/unko.png');
    game.load.image('invader', 'img/makoto.png');
    game.load.image('ship', 'img/chana.png');
    game.load.spritesheet('kaboom', 'img/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'img/sora.png');
    game.load.image('background', 'img/invaders/background2.png');
    game.load.image('heart', 'img/heart.png');
    game.load.image('watari', 'img/watari.png');



    //sounds
    game.load.audio('bgm', 'audio/bgm.mp3');
    game.load.audio('ending', 'audio/tsuyuake.mp3');

    game.load.audio('sfx', 'audio/sfx.mp3');

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
    stateText = game.add.text(game.world.centerX, game.world.centerY, '- M A K O V A D E R -\nclick to start', {
        font: '40px Impact',
        fill: '#000',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 800,
        fontWeight: 'bold',
    });
    stateText.anchor.setTo(0.5, 0.5);


    msgText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '40px Arial',
        fill: '#ec008c',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 800,
        fontWeight: 'bold',
    });
    msgText.anchor.setTo(0.5, 0.7);
    msgText.visible = false;

    nameText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '30px Arial',
        fill: '#ec008c',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 500,
        maxLines: 4,
        fontWeight: 'bold',
    });
    nameText.anchor.setTo(0.5, 0);
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
    fx.addMarker('enemyDeath', 1, 1.023);
    fx.addMarker('playerDeath', 2.1, 1.17);
    fx.addMarker('omedetou', 3.5, 0.65);
    fx.addMarker('nice', 4.2, 0.858);
    fx.addMarker('victory', 5.1, 0.937);
    fx.addMarker('youwin', 6.1, 0.946);
    fx.addMarker('gameover', 7.1, 1.17);
    fx.addMarker('makotono', 8.3, 1.661);
    fx.addMarker('mouikkai', 10, 1.087);
    fx.addMarker('tyottotamaga', 11.1, 1.51);

    clearVoices = ['omedetou', 'nice', 'victory', 'youwin'];
    gameoverVoices = ['gameover', 'makotono', 'mouikkai', 'tyottotamaga'];

    game.input.onTap.addOnce(start, this);
}

function startBgm() {

    ending.stop();
    bgm.loopFull(0.3);
}

function startEnding() {
    bgm.stop();
    const voiceKey = clearVoices[randRange(0, clearVoices.length -1)];
    game.time.events.add(1000, function(){fx.play(voiceKey, 0, 0.8)});
    ending.loopFull(0.2);
}

function gameOver() {
    const voiceKey = gameoverVoices[randRange(0, gameoverVoices.length -1)];
    game.time.events.add(1000, function(){fx.play(voiceKey, 0, 1.5)});
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

function start() {
    stateText.visible = false;
    state = 'play';
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
        if (state == 'play') {
            if (fireButton.isDown) {
                fireBullet();
            }
            if (game.time.now > firingTimer) {
                enemyFires();
            }

            // 1秒ごとにscoreに+10
            if (game.time.now > scoreTimer) {
                score += 10;
                scoreText.text = scoreString + score;
                scoreTimer = game.time.now + 1000;
            }
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
    fx.play('enemyDeath', 0, 0.5);

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    // clear
    if (aliens.countLiving() == 0) {
        state = 'clear';
        score += lives.countLiving() * 1000;
        scoreText.text = scoreString + score;

        if (hiscore_data < score) {
            localStorage.setItem('hiscore', score);
            hiscore.innerText = score;
            hiscore_data = score;
        }

        // enemyBullets.callAll('kill', this);
        enemyBullets.callAll('kill');
        watari.callAll('kill');
        const msgIndex = params.get('msg') ? Number(params.get('msg')) : randRange(1, messages.length);
        const msg_obj = messages.find((v) => v.id == msgIndex);
        msgText.text = msg_obj.msg;
        msgText.visible = true;
        nameText.text = msg_obj.name + '\nclick to restart';
        nameText.y = msgText.bottom + 10;
        nameText.visible = true;

        if(obtained_messages.indexOf(msgIndex) == -1){
            obtained_messages.push(msgIndex)
            createMsgTable();
            localStorage.setItem('obtained_messages', JSON.stringify(obtained_messages));
        }



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

    fx.play('playerDeath', 0, 1);

    // When the player dies
    if (lives.countLiving() < 1) {
        player.kill();
        bullets.callAll('kill');
        enemyBullets.callAll('kill');
        watari.callAll('kill');

        if (hiscore_data < score) {
            localStorage.setItem('hiscore', score);
            hiscore.innerText = score;
            hiscore_data = score;
        }

        gameOver();
        stateText.text = "GAME OVER\nclick to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart, this);
        state = 'gameover';
    }

}

function enemyFires() {

    const isWatari = randRange(1, 5) == 1 ? true : false;

    //  Grab the first bullet we can from the pool
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
        const speed = isWatari ? randRange(200, 700) : enemyFiresSpeed;
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
            fx.play('playerFire', 0, 1);
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
    scoreText.text = scoreString + score;

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
    msgText.visible = false;
    nameText.visible = false;

    if (state == 'clear') {
        startBgm();
    }
    scoreTimer = game.time.now + 1000;
    state = 'play';

}

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);