const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65660cf381ce62656ceb'
const databaseId = '656f2b3f244dbb47c899'
const collectionId = '656f2b564d2af2c3bd51'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)

async function isLoggeddIn () {
    return account.get().then(response => {
        if (response) {
            return true
        }
        return false
    }).catch(error => console.log(error))
}

async function getUserId () {
    return account.get().then(response => {
        return response.$id
    }
    ).catch(error => console.log(error))
}

function displayUsername () {
    account.get().then(response => {
        document.getElementById('username').textContent = response.name
    }).catch(error => console.log(error))
}

function updateScore (score) {
    const currentHighScore = document.getElementById('highscore').textContent
    if (Number(score) > Number(currentHighScore)) {
        getUserId().then(userId => {
            databases.updateDocument(databaseId, collectionId, userId, {
                'userId': userId,
                'highScore': score
            }).then(() => {
                showScore()
            }).then(error => console.log(error))
        })
    }
}

function showScore () {
    getUserId().then(userId => {
        console.log(userId)
        databases.listDocuments(databaseId, collectionId, [
            Query.equal('userId', userId)
        ]).then(response => {
            document.getElementById('highscore').textContent = response.documents[0].highScore
        }).catch(error => console.log(error))
    }
    ).catch(error => console.log(error))
}

document.addEventListener('DOMContentLoaded', () => {
    displayUsername()
    showScore()

})

function generateUUID () {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function register (event) {
    account.create(
        ID.unique(),
        event.target.elements['register-email'].value,
        event.target.elements['register-password'].value,
        event.target.elements['register-username'].value,
    ).then(response => {
        databases.createDocument(databaseId, collectionId, generateUUID(), {
            'userId': response.$id,
            'highScore': 0
        }
        )
        account.createEmailSession(
            event.target.elements['register-email'].value,
            event.target.elements['register-password'].value,
        ).then(() => {
            showDisplay()
            displayUsername()
            showScore()
        })
    }).catch(error => {
        console.log(error)
    })
    event.preventDefault()
}

function login (event) {
    account.createEmailSession(
        event.target.elements['login-email'].value,
        event.target.elements['login-password'].value,
    ).then(() => {
        alert('You have been logged in')
        showDisplay()
        displayUsername()
        showScore()
        client.subscribe('account', (response) => {
            console.log(response)
        })
    }).catch(error => {
        alert('Wrong email or password')
        console.log(error)
    })
    event.preventDefault()
}

function logout () {
    account.deleteSessions().then(() => {
        alert('You have been logged out')
        console.log('You have been logged out')
        showDisplay()
        document.getElementById('highscore').textContent = ''
    }).catch(error => console.log(error))
}

function toggleModal (event) {
    const registerForm = document.getElementById('register-form')
    const loginForm = document.getElementById('login-form')
    const loginButton = document.getElementById('login-button')
    const registerButton = document.getElementById('register-button')

    if (event.srcElement.id === 'register-button') {
        registerForm.classList.remove('hidden')
        loginForm.classList.add('hidden')
        loginButton.classList.add('not-active')
        registerButton.classList.remove('not-active')
    }

    if (event.srcElement.id === 'login-button') {
        registerForm.classList.add('hidden')
        loginForm.classList.remove('hidden')
        loginButton.classList.remove('not-active')
        registerButton.classList.add('not-active')
    }
}

function showDisplay () {
    const modalElement = document.getElementById('modal')
    modalElement.classList.add('hidden')
    isLoggeddIn().then(isLogin => {
        if (isLogin) {
            const modalElement = document.getElementById('modal')
            modalElement.classList.add('hidden')
            document.getElementById('logout-button').classList.remove('hidden')
            document.getElementById('highscore-tag').classList.remove('hidden')
            startGame()
        } else {
            const modalElement = document.getElementById('modal')
            modalElement.classList.remove('hidden')
            document.getElementById('logout-button').classList.add('hidden')
            document.getElementById('highscore-tag').classList.add('hidden')
            document.getElementById('username').textContent = ''
            const canvas = document.querySelector('canvas')
            if (canvas) canvas.remove()
        }
    }).catch(error => console.log(error))
}

showDisplay()

//Kaboom game
function startGame () {
    kaboom({
        global: true,
        fullscreen: true,
        scale: 2,
        clearColor: [0, 0, 0, 1]
    })

    //Speed indentifiers
    const moveSpeed = 120
    const jumpForce = 360
    const bigJumpForce = 550
    let currentJumpForce = jumpForce
    const fallDeath = 400
    const ENEMY_SPEED = 20

    //Game logic
    let isJumping = true

    //Load sprites
    loadRoot('https://i.imgur.com/')
    loadSprite('coin', 'wbKxhcd.png')
    loadSprite('evil-shroom', 'KPO3fR9.png')
    loadSprite('brick', 'pogC9x5.png')
    loadSprite('block', 'M6rwarW.png')
    loadSprite('mario', 'Wb1qfhK.png')
    loadSprite('mushroom', '0wMd92p.png')
    loadSprite('surprise', 'gesQ1KP.png')
    loadSprite('unboxed', 'bdrLpi6.png')
    loadSprite('pipe-top-left', 'ReTPiWY.png')
    loadSprite('pipe-top-right', 'hj2GK4n.png')
    loadSprite('pipe-bottom-left', 'c1cYSbt.png')
    loadSprite('pipe-bottom-right', 'nqQ79eI.png')
    loadSprite('blue-block', 'fVscIbn.png')
    loadSprite('blue-brick', '3e5YRQd.png')
    loadSprite('blue-steel', 'gqVoI2b.png')
    loadSprite('blue-evil-shroom', 'SvV4ueD.png')
    loadSprite('blue-surprise', 'RMqCc1G.png')

    scene("game", ({ level, score }) => {
        layers(["bg", "obj", "ui"], "obj")

        const map = [[
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '      %   =*=%=                       ', ,
            '                                      ',
            '                             -+       ',
            '                   ^     ^   ()       ',
            '===============================   ====',
        ],
        [
            '£                                              £',
            '£                                              £',
            '£                                              £',
            '£                                              £',
            '£                                              £',
            '£      @@@@@@                         x x      £',
            '£                                   x x x      £',
            '£                                 x x x x  x -+£',
            '£                  z     z      x x x x x  x ()£',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
        ],
        ]

        const levelCfg = {
            width: 20,
            height: 20,
            '=': [sprite('block'), solid()],
            '$': [sprite('coin'), 'coin'],
            '%': [sprite('surprise'), solid(), 'coin-surprise'],
            '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
            '}': [sprite('unboxed'), solid()],
            '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
            ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
            '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
            '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
            '^': [sprite('evil-shroom'), solid(), 'dangerous'],
            '#': [sprite('mushroom'), solid(), 'mushroom', body()],
            '!': [sprite('blue-block'), solid(), scale(0.5)],
            '£': [sprite('blue-brick'), solid(), scale(0.5)],
            'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
            '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
            'x': [sprite('blue-steel'), solid(), scale(0.5)],

        }

        const gameLevel = addLevel(map[level], levelCfg)

        const scoreLabel = add([
            text(score),
            pos(30, 6),
            layer('ui'),
            {
                value: score,
            }
        ])

        add([text('level ' + parseInt(level + 1)), pos(40, 6)])

        const player = add([
            sprite('mario'),
            solid(),
            pos(30, 0),
            body(),
            big(),
            origin('bot')
        ])

        function big () {
            let timer = 0
            let isBig = false
            return {
                update () {
                    if (isBig) {
                        currentJumpForce = bigJumpForce
                        timer -= dt()
                        if (timer <= 0) {
                            this.smallify()
                        }
                    }
                },
                isBig () {
                    return isBig
                },
                smallify () {
                    this.scale = vec2(1)
                    currentJumpForce = jumpForce
                    timer = 0
                    isBig = false
                },
                biggify (time) {
                    this.scale = vec2(2)
                    timer = time
                    isBig = true
                }
            }
        }

        player.on("headbump", (obj) => {
            if (obj.is('coin-surprise')) {
                gameLevel.spawn('$', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('}', obj.gridPos.sub(0, 0))
            }
            if (obj.is('mushroom-surprise')) {
                gameLevel.spawn('#', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('}', obj.gridPos.sub(0, 0))
            }
        })

        action('mushroom', (m) => {
            m.move(20, 0)
        })

        player.collides('mushroom', (m) => {
            destroy(m)
            player.biggify(6)
            currentJumpForce = bigJumpForce
        })

        player.action(() => {
            camPos(player.pos)
            if (player.pos.y >= fallDeath) {
                go('lose', { score: scoreLabel.value })
            }
        })

        player.collides('pipe', () => {
            keyPress('down', () => {
                go('game', {
                    level: (level + 1) % map.length,
                    score: scoreLabel.value
                })
            })
        })

        player.collides('coin', (c) => {
            destroy(c)
            scoreLabel.value++
            scoreLabel.text = scoreLabel.value
        })

        action('dangerous', (d) => {
            d.move(-ENEMY_SPEED, 0)
        })

        player.collides('dangerous', (d) => {
            if (isJumping) {
                destroy(d)
            } else {
                go('lose', { score: scoreLabel.value })
            }
        })

        keyDown('left', () => {
            player.move(-moveSpeed, 0)
        })

        keyDown('right', () => {
            player.move(moveSpeed, 0)
        })

        player.action(() => {
            if (player.grounded()) {
                isJumping = false
            }
        })

        keyPress('space', () => {
            if (player.grounded()) {
                isJumping = true
                player.jump(currentJumpForce)
            }
        })

        scene('lose', ({ score }) => {
            add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
            updateScore(score)
        })
    })

    start("game", { level: 0, score: 0 })

}



