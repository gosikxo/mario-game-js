const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65660cf381ce62656ceb'
const databaseId = '656f2b3f244dbb47c899'
const collectionId = '656f2b564d2af2c3bd51'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)

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
        })
    }).catch(error => {
        console.log(error)
    })
    event.preventDefault()
}

function showDisplay () {
    const modalElement = document.getElementById('modal')
    modalElement.classList.add('hidden')
}

showDisplay()

//Kaboom game
function startGame () {
    kaboom({
        global: true,
        fullscreen: true,
        scale: 2,
    })

    //Speed indentifiers
    const moveSpeed = 120
    const jumpForce = 360
    const bigJumpForce = 550
    let currentJumpForce = jumpForce
    const fallDeath = 400
    const enemyDeath = 20

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
    loadSpirte('blue-block', 'fVscIbn.png')
    loadSprite('blue-brick', '3e5YRQd.png')
    loadSprite('blue-steel', 'gqVoI2b.png')
    loadSprite('blue-evil-shroom', 'SvV4ueD.png')
    loadSprite('blue-surprise', 'RMqCc1G.png')

}

startGame()
