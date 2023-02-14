var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { use } = require('../routes/admin')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId

module.exports = {
    getUser: (userData) => {
        return new Promise((resolve, reject) => {
            let user = db.get().collection(collection.USER_COLLECTION).find({ userEmail: userData.userEmail }).toArray()
            resolve(user)
        })
    },
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let respone = {}
            userPass = userData.userPass.toString()
            userData.userPass = await bcrypt.hash(userPass, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(() => {
                // console.log(userData);
                respone.user = userData
                respone.status = true
                resolve(respone)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async(resolve, reject) => {
            let respone = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ userEmail: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.userPass).then((status) => {
                    if (status) {
                        console.log('login success......');
                        respone.user = user
                        respone.status = true
                        resolve(respone)
                    } else {
                        console.log('password incorrect.....');
                        resolve({ passwordStatus: true })
                    }
                })
            } else {
                console.log('user email dosent match');
                resolve({ emailStatus: true })
            }
        })
    }
}