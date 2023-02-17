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
    },

    getLostThing: (user) => {
        // console.log(user);
        return new Promise(async (resolve, reject) => {
            let lostThings = await db.get().collection(collection.LOST_THINGS).find({ "user._id": user._id }).toArray()
            resolve(lostThings)
        })
    },

    getFoundThing: (user) => {
        return new Promise(async (resolve, reject) => {
            let foundThings = await db.get().collection(collection.FOUND_THINGS).find({ "user._id": user._id }).toArray()
            resolve(foundThings)
        })
    },

    deleteLostPost: (postId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.LOST_THINGS).remove({ _id: ObjectId(postId) }).then(() => {
                resolve(true)
            })
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
            }).then(()=>{
                resolve(response)
            })
        })
    },

    getLostPost: (postId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.LOST_THINGS).findOne({ _id: ObjectId(postId) }).then((post) => {
                resolve(post)
            })
        })
    },

    editLostPost: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.LOST_THINGS).updateOne({ _id: ObjectId(details.id) }, {
                $set: {
                    holderName: details.holderName,
                    category: details.category,
                    cardNo: details.cardNo,
                    description: details.description
                }
            }).then(()=>{
                resolve(response)
            })
        })
    }
}