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
        const user = await userModel.findById(req.user._id).populate("friends","fullname bio profilePic nativeLanguage learningLanguage location")
        res.status(200).json(user.friends)

    }catch(err){
        console.error("Error in getMyFriends controller", err.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};

// SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
  try {
    const myID = req.user._id;
    const { id: recipientId } = req.params;

    if (myID.equals(recipientId)) {
      return res.status(400).json({
        message: "You can't send friend request to yourself"
      });
    }

    const recipient = await userModel.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.some(id => id.equals(myID))) {
      return res.status(400).json({
        message: "You are already friends with this recipient"
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myID, recipient: recipientId },
        { sender: recipientId, recipient: myID }
      ],
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user"
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myID,
      recipient: recipientId
    });

    res.status(201).json(friendRequest);

  } catch (err) {
    console.log("error in sendFriendRequest Controller", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestID } = req.params;

    const friendRequest = await FriendRequest.findById(requestID);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (!friendRequest.recipient.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not authorized to accept this request."
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: "Request already handled"
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await userModel.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    });

    await userModel.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    });

    res.status(200).json({ message: "Friend request accepted" });

  } catch (err) {
    console.log("error in acceptFriendRequest controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res) => {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status:"pending"
        }).populate("sender", "fullname profilePic nativeLanguage learningLanguage")
        
        const acceptedRequests = await FriendRequest.find({
            recipient: req.user._id,
            status:"accepted"
        }).populate("recipient", "fullname profilePic")

        res.status(200).json({incomingRequests, acceptedRequests})

    }catch(err){
        console.error("error in getFriendRequests contoller", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getOutgoingFriendRequests = async (req,res) => {
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status:"pending"
        }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage")
        res.status(200).json(outgoingRequests)
    }catch(err){
        console.error("error in getOutgoingFriendRequests controller", err);
        res.status(500).json({message: "Internal server error"})
    }  
}