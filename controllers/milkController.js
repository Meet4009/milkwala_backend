const Milk = require('../models/milkModels');
const Customer = require('../models/customerModels');
const { message } = require('../middlewares/validation');


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

exports.find = async (req, res) => {
    try {
        const { id } = req.params;
        const milk = await Milk.findOne
            ({
                buyerID: id,
                date: {
                    $gte: new Date(new Date().setHours(0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59))
                }
            });

        if (milk.length === 0) {
            return res.status(200).json({ message: "Milk data not found" });
        }
        const totalEntries = milkData.length;
        const totalquantity = milkData.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = milkData.reduce((total, item) => total + item.totalAmount, 0);
        const averagePrice = totalAmount / totalquantity;


        res.status(200).json({
            message: "Milk data found",
            milk,
            totalEntries,
            totalquantity,
            totalAmount,
            averagePrice
        });
    }
    catch (error) {
        console.error("Error in finding milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.getMonthlyMilkDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const today = new Date();
        const currentMonth = today.getMonth(); // 0-based index (Jan = 0)

        const currentYear = today.getFullYear();
        let startOfMonth, endOfMonth;

        if (month - 1 > currentMonth) { // Previous year data
            startOfMonth = new Date(currentYear - 1, month - 1, 1);
            endOfMonth = new Date(currentYear - 1, month, 0, 23, 59, 59, 999);
        } else {    // Current year data
            startOfMonth = new Date(currentYear, month - 1, 1);
            endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
        }

        const milkData = await Milk.find({
            date: { $gte: startOfMonth, $lte: endOfMonth },
            buyerID: id
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

exports.getMonthlySalesSummaryByID = async (req, res) => {
    try {
        const { id } = req.params;
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const today = new Date();
        const currentMonth = today.getMonth(); // 0-based index (Jan = 0)

        const currentYear = today.getFullYear();
        let startOfMonth, endOfMonth;

        if (month - 1 > currentMonth) { // Previous year data
            startOfMonth = new Date(currentYear - 1, month - 1, 1);
            endOfMonth = new Date(currentYear - 1, month, 0, 23, 59, 59, 999);
        } else {    // Current year data
            startOfMonth = new Date(currentYear, month - 1, 1);
            endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
        }

        const milkData = await Milk.find({
            date: { $gte: startOfMonth, $lte: endOfMonth },
            buyerID: id
        });

        if (!milkData.length) {
            return res.status(404).json({ message: "Milk data not found" });
        }
        const totalEntries = milkData.length;
        const totalquantity = milkData.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = milkData.reduce((total, item) => total + item.totalAmount, 0);
        const averagePrice = totalAmount / totalquantity;

        res.status(200).json({
            message: "Milk data found",
            totalEntries,
            totalquantity,
            totalAmount,
            averagePrice
        });
    } catch (error) {
        console.error("Error in getting monthly sales summary by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getMonthlyMilkData = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const today = new Date();
        const currentMonth = today.getMonth(); // 0-based index (Jan = 0)
        const currentYear = today.getFullYear();

        let startOfMonth, endOfMonth;

        if (month - 1 > currentMonth) {             // Previous year data
            startOfMonth = new Date(currentYear - 1, month - 1, 1);
            endOfMonth = new Date(currentYear - 1, month, 0, 23, 59, 59, 999);
        } else {                                    // Current year data
            startOfMonth = new Date(currentYear, month - 1, 1);
            endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
        }

        const milkData = await Milk.find({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            },
        });

        if (milkData.length === 0) {
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
}

exports.getMonthlySalesSummary = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value. Please provide a month between 1 and 12." });
        }

        const today = new Date();
        const currentMonth = today.getMonth(); // 0-based index (Jan = 0)
        const currentYear = today.getFullYear();

        let startOfMonth, endOfMonth;

        if (month - 1 > currentMonth) {             // Previous year data
            startOfMonth = new Date(currentYear - 1, month - 1, 1);
            endOfMonth = new Date(currentYear - 1, month, 0, 23, 59, 59, 999);
        } else {                                    // Current year data
            startOfMonth = new Date(currentYear, month - 1, 1);
            endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
        }

        const milkData = await Milk.find({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            },
        });

        if (milkData.length === 0) {
            return res.status(200).json({ message: "Milk data not found" });
        }
        const totalEntries = milkData.length;
        const totalquantity = milkData.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = milkData.reduce((total, item) => total + item.totalAmount, 0);
        const averagePrice = totalAmount / totalquantity;

        res.status(200).json({
            message: "Milk data found",
            totalEntries,
            totalquantity,
            totalAmount,
            averagePrice
        });
    } catch (error) {
        console.error("Error in getting monthly sales summary:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
