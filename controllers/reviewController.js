const Hotel = require('./../models/hotelModel')
const Review = require('./../models/reviewModel')

exports.createReview = async (req, res) =>{
    try{
     if(!req.body.hotel) req.body.hotel = req.params.hotelId;  
     if(!req.body.user) req.body.user = req.user.id;
    const reviewCreate = await Review.create(req.body);
    res.status(201).json({
        status: "success",
        message: "New review is created",
        data: {
            reviewCreate
        }
    })

    }catch(err){
        res.status(404).json({
            status: "failed",
            message:err.message
        })
    }
}

exports.getAllReview = async (req, res) =>{
    try{
    let filter = {}
    if(req.params.hotelId) filter={hotel: req.params.hotelId};
    const reviewAll = await Review.find();
    res.status(200).json({
        status: "success",
        results: reviewAll.length,
        data: {
            reviewAll
        }
    })
    }catch(err){
        res.status(404).json({
            status: "failed",
            message:err.message
        })
    }
}