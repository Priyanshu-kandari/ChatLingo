import userModel from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

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

export const sendFriendRequest = async(req,res) => {
    try{
        const myID = req.user.id;
        const {id: recipentId } = req.params;

        //prevent sending req to yourself
        if(myID === recipentId) return res.status(400).json({
            message: "you can't send friend request to yourself"
        })

        const reciptent = await userModel.findById(recipentId);
        if(!reciptent) return res.status(404).json({message: "Recipient not found"});

        if(reciptent.friends.includes(myID)){
            return res.status(400).json({message: "You are already friends with this recipitent"})
        }

        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender: myID, recipient: recipentId},
                {sender: recipentId, recipient:myID}
            ],
        });

        if(existingRequest){
            return res
            .status(400)
            .json({message: "A friend request already exists between you and this user"})
        }

        const friendRequest = await FriendRequest.create({
            sender: myID,
            recipentId: recipentId
        })

        res.status(201).json(friendRequest)

    }catch(err){
        console.log("error in sendFriendRequest Controller", err.message);
        res.status(500).json({message:"Internal server error"})
    }
}