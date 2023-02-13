var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId

module.exports = {
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let respone = {}
            userPass = userData.userPass.toString()
            userData.userPass = await bcrypt.hash(userPass,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
                // console.log(userData);
                respone.user = userData
                respone.status = true
                resolve(respone)
            })
        })
    }
}