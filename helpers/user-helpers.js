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
        return new Promise(async (resolve, reject) => {
            let respone = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ userEmail: userData.email})
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
    },

    getUserData: (userData) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).findOne({ userEmail: userData.userEmail }).then((data) => {
                resolve(data)
            })
        })
    },

    editUserProfile: (userData) => {
        // console.log(userData);
        return new Promise(async (resolve, reject) => {
            //userPass = userData.userPass.toString()
            //userData.userPass = await bcrypt.hash(userPass, 10)
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userData.id) }, {
                $set: {
                    _id: ObjectId(userData.id),
                    userName: userData.userName,
                    //userEmail: userData.userEmail,
                    //userPass: userData.userPass,
                    userDistrict: userData.userDistrict,
                    userPhno: userData.userPhno,
                    aadharNo: userData.aadharNo,
                    panNo: userData.panNo,
                    drivingLicenseNo: userData.drivingLicenseNo
                }
            }).then((response) => {
                resolve(response)
            })
        })
    }
}