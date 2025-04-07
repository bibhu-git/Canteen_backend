import PaymentModel from '../model/PaymentModel.js';
import userModel from '../model/UserModel.js';
import PaymentHistoryModel from '../model/PaymentHistoryModel.js';

export const submitPaymentStatusRequest = async (req, res) => {
  try {
    const { amount, transactionId, userId } = req.body;
    const image_filename = `${req.file.filename}`;
    if (!amount || !transactionId || !userId || !image_filename) {
      return res.json({ success: false, error: "Required field is missing!" });
    }
    const user = await userModel.findOne({ _id: userId });

    const newRequest = new PaymentModel({
      name: user.name,
      canteenNo: user.canteenNo,
      amount,
      transactionId,
      image: image_filename
    });

    await newRequest.save();
    return res.json({ success: true, message: "Payment request submitted." });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getAllPaymentRequests = async (req, res) => {
  try {
    const requests = await PaymentModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const updatePaymentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await PaymentModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Payment request not found" });
    }

    if (status === 'Accepted') {
      const user = await userModel.findOne({ canteenNo: updated.canteenNo }, { totalAmount: 1 });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const pendingAmount = user.totalAmount;
      const payAmount = updated.amount;

      if (pendingAmount < payAmount) {
        return res.status(400).json({ success: false, error: "Payment exceeds pending amount" });
      }

      const leftAmount = pendingAmount - payAmount;

      await userModel.findOneAndUpdate(
        { canteenNo: updated.canteenNo },
        { totalAmount: leftAmount }
      );
      const paymentHistory = new PaymentHistoryModel({
        canteenNo: updated.canteenNo,
        amount: payAmount,
        mode: "Online",
      });
      await paymentHistory.save();
    }

    return res.json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const pendingAmount = async (req, res) => {
  try {
    const { canteenNo, amountPaid, paymentDate } = req.query;
    if (!canteenNo) {
      return res.json({ success: false, error: "Required field is missing!" });
    }
    const user = await userModel.findOne({ canteenNo }, { totalAmount: 1 });
    if (!user) {
      return res.json({ success: false, error: "User not found" });
    }
    const totalAmount = user.totalAmount;
    res.json({ success: true, totalAmount: totalAmount });
  } catch (error) {
    return res.json({ success: false, error: "Internal Server error!" });
  }
}


export const cashPayment = async (req, res) => {
  try {
    const { canteenNo, amountPaid, paymentDate } = req.body;
    
    if (!canteenNo || !amountPaid || !paymentDate) {
      return res.status(400).json({ success: false, error: "Required field is missing!" });
    }

    const user = await userModel.findOne({ canteenNo });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found!" });
    }

    const pendingAmount = user.totalAmount;
    if (pendingAmount < amountPaid) {
      return res.status(400).json({ success: false, error: "Payment exceeds pending amount" });
    }

    const leftAmount = pendingAmount - amountPaid;

    await userModel.findOneAndUpdate(
      { canteenNo },
      { totalAmount: leftAmount }
    );

    // Add payment history
    const paymentHistory = new PaymentHistoryModel({
      canteenNo,
      amount: amountPaid,
      mode: "Cash",
      date: paymentDate, // Ensure paymentDate is a valid Date string
      createdAt: new Date()
    });

    await paymentHistory.save();

    return res.status(200).json({ success: true, message: "Payment successful" });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Internal server error!" });
  }
};
