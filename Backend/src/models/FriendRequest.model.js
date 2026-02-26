import mongoose from "mongoose";

// Tracks sender/recipient state for friend request flows.
const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
