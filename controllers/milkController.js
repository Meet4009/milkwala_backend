const Milk = require('../models/milkModels');
const Customer = require('../models/customerModels');
const { calculateSalesSummary, getMonthDateRange } = require('../utils/milkDataUtils');


exports.create = async (req, res) => {
    try {
        const { id } = req.params;
        const { date = Date.now(), quantity = 1, price = 50 } = req.body;
        const customer = await Customer.findOne({ customerID: id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const totalAmount = quantity * price;

        const milk = new Milk({
            customerID: customer.id,
            buyerID: id,
            date,
            quantity,
            price,
            totalAmount
        });
        await milk.save();
        res.status(201).json({ message: "Milk Data Add ", milk });

    }
    catch (error) {
        console.error("Error in creating milk:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const milk = await Milk.findOne({ _id: id });

        if (!milk) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        const updatedData = {
            date: req.body.date || milk.date,
            quantity: req.body.quantity || milk.quantity,
            price: req.body.price || milk.price,
            totalAmount: req.body.totalAmount || milk.totalAmount
        };

        const updatedMilk = await Milk.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: "Milk data updated", updatedMilk });
    }
    catch (error) {
        console.error("Error in updating milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const milk = await Milk.findOne({ _id: id });

        if (!milk) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        await Milk.findByIdAndDelete(id);
        res.status(200).json({ message: "Milk data deleted" });
    }
    catch (error) {
        console.error("Error in deleting milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


// Find daily milk data by buyer ID
exports.find = async (req, res) => {
    try {
        const { id } = req.params;

        const milkData = await Milk.find({
            buyerID: id,
            date: {
                $gte: new Date(new Date().setHours(0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59))
            }
        });

        if (!milkData.length) {
            return res.status(200).json({ message: "Milk data not found" });
        }

        const summary = calculateSalesSummary(milkData);

        res.status(200).json({
            message: "Milk data found",
            milkData,
            ...summary
        });
    } catch (error) {
        console.error("Error in finding milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get monthly milk data by buyer ID
exports.getMonthlyMilkDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const { startOfMonth, endOfMonth } = getMonthDateRange(month);

        const milkData = await Milk.find({
            buyerID: id,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!milkData.length) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        res.status(200).json({ message: "Milk data found", milkData });
    } catch (error) {
        console.error("Error in getting monthly milk data by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get monthly sales summary by buyer ID
exports.getMonthlySalesSummaryByID = async (req, res) => {
    try {
        const { id } = req.params;
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const { startOfMonth, endOfMonth } = getMonthDateRange(month);

        const milkData = await Milk.find({
            buyerID: id,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!milkData.length) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        const summary = calculateSalesSummary(milkData);

        res.status(200).json({
            message: "Milk data found",
            ...summary
        });
    } catch (error) {
        console.error("Error in getting monthly sales summary by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get monthly milk data for all buyers
exports.getMonthlyMilkData = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const { startOfMonth, endOfMonth } = getMonthDateRange(month);

        const milkData = await Milk.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!milkData.length) {
            return res.status(200).json({ message: "Milk data not found" });
        }

        res.status(200).json({
            message: "Milk data found",
            milkData
        });
    } catch (error) {
        console.error("Error in getting monthly milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get monthly sales summary for all buyers
exports.getMonthlySalesSummary = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const { startOfMonth, endOfMonth } = getMonthDateRange(month);

        const milkData = await Milk.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!milkData.length) {
            return res.status(200).json({ message: "Milk data not found" });
        }

        const summary = calculateSalesSummary(milkData);

        res.status(200).json({
            message: "Milk data found",
            ...summary
        });
    } catch (error) {
        console.error("Error in getting monthly sales summary:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
