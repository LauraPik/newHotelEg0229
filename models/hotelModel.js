const mongoose = require("mongoose")
const User = require("./userModel")


const hotelSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "A hotel must have a name"],
        unique: true,
    },
    address:{
        type:String,
        required:[true, 'must have an address'],
    },
    rankingAverage:{
        type:Number,
        default:4.5,
        min:[1, "ranking must be above 1"],
        max:[5, "ranking cannot be more than 5"]
    },
    room_price:{
        type:Number,
        required:[true, "A hotel must have a price"]
    },
    price_discount:{
        type:Number
    },
    comfort:{
        type:String,
        required:[true, 'a hotel must have  confort level'],
        enum:{
            values:["1", "2", "3", "4", "5", "6", "7"]
        }
    },
    summary:{
        type:String,
        trim: true,
        required: [true, "must have a summary"]
    },
    description:{
        type:String,
        trim: true
    },
    image_cover:{
        type:String,
        required:[true, "musta have a image cover"]
    },
    // paduoti, kas yra manager, nori, kad sudetu dokumentus// child ref
    managers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
}
)

// // managers/ ascyn funkcija turi gauti id ir pagal ji grazinti duomenis, bet reikia gauti kelis id, pre-pries issaugojimu
// hotelSchema.pre('save', async function(){
//     const managersPromises = this.managers.map(async id=> User.findById(id));
//     // as galiu paduoti kiek noriu promisu
//     this.managers = await Promise.all(managersPromises)

// })

hotelSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "hotel",
    localField: "_id"
});

const Hotel = mongoose.model('Hotel', hotelSchema)

module.exports = Hotel