const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65660cf381ce62656ceb'
const databaseId = '656f2b3f244dbb47c899'
const collectionId = '656f2b564d2af2c3bd51'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)

function register (event) {
    account.create(
        ID.unique(),
        event.target.elements['register-email'].value,
        event.target.elements['register-password'].value,
        event.target.elements['register-username'].value,
    ).then(response => {
        console.log(response)
        databases.createDocument(databaseId, collectionId, {
            'userId': response.$id,
            'username': event.target.elements['register-username'].value,
            'email': event.target.elements['register-email'].value,
            'password': event.target.elements['register-password'].value,
            'score': 0,
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })

        account.createEmailSession(
            event.target.elements['register-email'].value,
            event.target.elements['register-password'].value,
        )
    }).catch(error => {
        console.log(error)
    })
    event.preventDefault()
}

