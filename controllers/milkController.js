const Milk = require('../models/milkModels');
const Customer = require('../models/customerModels');
const { message } = require('../middlewares/validation');

// Create milk
exports.createMilkData = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity = 1, price = 50 } = req.body;
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const totalAmount = quantity * price;

        const milk = new Milk({
            customerID: id,
            buyerID: customer.customerID,
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
// Get All MIlk data
exports.getAllMilkData = async (req, res) => {
    try {
        const milk = await Milk.find({});

        if (!milk) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        res.status(200).json({ message: "Milk data found", milk });
    }
    catch (error) {
        console.error("Error in getting all milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// Get milk data by buyer ID
exports.getMilkDataByBuyerID = async (req, res) => {
    try {
        const { id } = req.params;
        const milk = await Milk.find({ buyerID: id });

        if (milk.length === 0) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        res.status(200).json({ message: "Milk data found", milk });
    }
    catch (error) {
        console.error("Error in getting milk data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


// monthly sales

exports.getMilkDataByMonth = async (req, res) => {

    try {

        const { id } = req.params;
        // const milk = await Milk.find({ buyerID: id });

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of this month
        console.log(startOfMonth);

        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999); // End of this month
        console.log(endOfMonth);

        const milkData = await Milk.find({
            date: {
                $gte: startOfMonth, // Greater than or equal to start of month
                $lte: endOfMonth    // Less than or equal to end of month
            }, buyerID: id
        });

        if (milkData.length === 0) {
            return res.status(404).json({ message: "Milk data not found" });
        }

        const totalEntries = milkData.length;
        const totalquantity = milkData.length;





        res.status(200).json({ message: "Milk data found", totalEntries, totalquantity })

    } catch (error) {
        console.error("Error in getting milk data by month:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


// Get milk data by customer ID
