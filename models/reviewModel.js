// sukurti atsiliepimu modeli, kuriame yra review, rating, createdAt, hotel, user

const mongoose = require("mongoose")


const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        // validacija
        required: [true, "Review should not be empty"],  
    },
    rating:{
        type: Number,
        required: [true, "Rating should not be empty"], 
        min: 1,
        max:5
    },
    hotel:{
        // referincinimo metu
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required:[true, 'must have a hotel']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        default: "User"
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    }


})

// kad nereiktu populate deti
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:"hotel",
        select:"name"
    }).populate({
        path:"user",
        select:"name"
    })
    next()
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;