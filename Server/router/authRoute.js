const express=require("express");
const {loginController,signinController,allUser}=require("../controller/authController");
const {protect}=require("../middleware/authMiddleware");
const router=express.Router();



router.post('/login',loginController);
router.post('/register',signinController);
router.get('/',protect,allUser);
module.exports=router;