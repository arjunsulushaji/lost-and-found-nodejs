var db = require('../config/connection')
var collection = require('../config/collection');
const { response } = require('express');
var ObjectId = require('mongodb').ObjectId

module.exports = {

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
    },

    getFoundThing: (user) => {
        return new Promise(async (resolve, reject) => {
            let foundThings = await db.get().collection(collection.FOUND_THINGS).find({ "user._id": user._id }).toArray()
            resolve(foundThings)
        })
    },

    deleteFoundPost: (postId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FOUND_THINGS).remove({ _id: ObjectId(postId) }).then(() => {
                resolve(true)
            })
        })
    },

    getFoundPost: (postId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.FOUND_THINGS).findOne({ _id: ObjectId(postId) }).then((post) => {
                resolve(post)
            })
        })
    },

    editFoundPost: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.FOUND_THINGS).updateOne({ _id: ObjectId(details.id) }, {
                $set: {
                    holderName: details.holderName,
                    category: details.category,
                    cardNo: details.cardNo,
                    description: details.description
                }
            }).then(() => {
                resolve(response)
            })
        })
    },

    getUserItem: (details) => {
        let cardNumbers = [
            aadharno = details.aadharNo,
            panno = details.panNo,
            driving = details.drivingLicenseNo
        ]
        return new Promise(async (resolve, reject) => {
            let items = await db.get().collection(collection.FOUND_THINGS).find({ cardNo: { $in: cardNumbers } }).toArray()
            resolve(items)
        })
    }
}