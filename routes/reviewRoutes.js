const express = require("express");
// sumerginame routus
const router = express.Router({mergeParams: true});
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController")


router.use(authController.protect)

router
  .route("/")
  .post(  reviewController.createReview)
  .get(
    authController.restrictTo("admin"),
    reviewController.getAllReview)
  


module.exports = router;