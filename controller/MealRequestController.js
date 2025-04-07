import MealStatusRequest from '../model/MealRequest.js';
import userModel from '../model/UserModel.js';

export const submitMealStatusRequest = async (req, res) => {
  try {
    const { canteenNo, name, currentMealStatus, requestedMealStatus, notes } = req.body;
    console.log(canteenNo + " " + name + " " + currentMealStatus + " " + requestedMealStatus + " " + notes )
    if(!canteenNo || !name || !notes)
    {
     return res.json({success: false, error: "Required field is missing!"});
    }

    const newRequest = new MealStatusRequest({
      canteenNo,
      name,
      currentMealStatus,
      requestedMealStatus,
      notes
    });

    await newRequest.save();
    return res.json({ success: true, message: "Meal status request submitted." });
  } catch (error) {
    console.error("Error in submitMealStatusRequest:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getAllMealStatusRequests = async (req, res) => {
  try {
    const requests = await MealStatusRequest.find().sort({ createdAt: -1 });
    if(requests.length === 0)
    {
      return res.json({success: false, error: "No request found!"});
    }
    return res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error in getAllMealStatusRequests:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateMealStatusRequest = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    // Validate status
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    // Update MealStatusRequest status
    const updated = await MealStatusRequest.findByIdAndUpdate(id, { status }, { new: true });

    // Check if update was successful
    if (!updated) {
      return res.status(404).json({ success: false, error: "Meal request not found" });
    }

    // If Accepted, update user's meal status
    if (status === 'Accepted') {
      await userModel.findOneAndUpdate(
        { canteenNo: updated.canteenNo }, 
        { mealStatus: updated.requestedMealStatus }
      );
    }

    return res.json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    console.error("Error in updateMealStatusRequest:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const currentMealStatus = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, error: "User not found!" });
    }
    const responseData = {
      canteenNo: user.canteenNo,
      name: user.name,
      status: user.mealStatus
    }

    res.json({ success: true, user: responseData });
  } catch (error) {
    console.log("Error in currentMealStatus " + error);
    return res.json({ success: false, error: "Internal server error!" });

  }
}