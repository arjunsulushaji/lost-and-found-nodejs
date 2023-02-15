var db = require('../config/connection')
var collection = require('../config/collection');
const { response } = require('express');
var ObjectId = require('mongodb').ObjectId

module.exports = {
    addLostThings: (item, user) => {
        return new Promise((resolve, reject) => {
            const d = new Date();
            let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
            let lostItem = {
                holderName: item.holderName,
                category: item.category,
                cardNo: item.cardNo,
                description: item.description,
                date: date,
                time: time,
                user: {
                    _id: user._id,
                    name: user.userName,
                    district: user.userDistrict,
                    phno: user.userPhno
                }
            }
            db.get().collection(collection.LOST_THINGS).insertOne(lostItem).then((response) => {
                resolve(response)
            })
        })
    },

    getLostThings: () => {
        return new Promise(async (resolve, reject) => {
            let lostItems = await db.get().collection(collection.LOST_THINGS).find().toArray()
            resolve(lostItems)
        })
    },

    addFoundThings: (item, user) => {
        return new Promise((resolve, reject) => {
            const d = new Date();
            let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
            let lostItem = {
                holderName: item.holderName,
                category: item.category,
                cardNo: item.cardNo,
                description: item.description,
                date: date,
                time: time,
                user: {
                    _id: user._id,
                    name: user.userName,
                    district: user.userDistrict,
                    phno: user.userPhno
                }
            }
            db.get().collection(collection.FOUND_THINGS).insertOne(lostItem).then((response) => {
                resolve(response)
            })
        })
    },

    getFoundThings: () => {
        return new Promise(async (resolve, reject) => {
            let foundItems = await db.get().collection(collection.FOUND_THINGS).find().toArray()
            resolve(foundItems)
        })
    },

    getPostDetails: (postId) => {
        return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(collection.LOST_THINGS).find({ _id: ObjectId(postId) }).toArray()
            resolve(details)
        })
    }
}