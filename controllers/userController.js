const { promisify } = require("util");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { error } = require("console");



exports.getAllUsers = async (req, res)=>{
    
    const usersAll = await User.find();
    try{
        res.status(200).json({
            status: "success",
            results: usersAll.length,
            data: {
                usersAll
            }
        })

    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        })
    }

}

exports.getUser = async (req, res)=>{
    try{
        const userOne = await User.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {
                userOne
            }
        })
    }catch(err){
        res.status(404).json({
            status: "fail",
            message:err
        })
    }
}