Database = require('arangojs')
const db = new Database()
const collection = db.collection('firstCol')
db.useBasicAuth('root','admin') //Mudar para autenticação do Docker
db.useDatabase('mydb') //Mudar para o bando de dados do docker

exports.addRoom = async dados => {
    const sala = {
        nome_sala : dados.sala
    }
    await collection.save(sala).then(
    meta => console.log('Document saved:', meta._rev),
    err => console.error('Failed to save document:', err))
}

