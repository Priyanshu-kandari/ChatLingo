import userModel from "../models/User.model.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = req.user;

    const recommendedUsers = await userModel.find({
      _id: {
        $ne: currentUser._id,
        $nin: currentUser.friends || []
      },
      isOnboarded: true,
    })
    .select("-password")
    .limit(20);

    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error("Error in getRecommendedUsers", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req,res) => {
    try{
        const user = await userModel.findById(req.user._id).populate("friends","fullname bio profilPic nativeLanguage learningLanguage Location")
        res.status(200).json(user.friends)

    }catch(err){
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}