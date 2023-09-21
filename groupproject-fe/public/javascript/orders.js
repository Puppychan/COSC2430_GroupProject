const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// create 30 dummy orders
const dummyOrders = [
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8a"),
        status: "active",
        total_price: 100000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),

    },
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8b"),
        status: "active",
        total_price: 200000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),
    },
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8c"),
        status: "delivered",
        total_price: 300000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),
    },
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8d"),
        status: "delivered",
        total_price: 400000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),
    },
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8e"),
        status: "canceled",
        total_price: 500000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),
    },
    {
        _id: new ObjectId("5f9d88c9d13f7c2d9c3e4b8f"),
        status: "canceled",
        total_price: 600000,
        createdAt: new Date("2020-10-30T09:00:00.000Z"),
    },

]

module.exports = dummyOrders;