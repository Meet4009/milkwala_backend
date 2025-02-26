
// Utility function to calculate the start and end date of a given month
const getMonthDateRange = (month) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-based index

    let startOfMonth, endOfMonth;

    if (month > currentMonth) {  // Fetch previous year's data
        startOfMonth = new Date(currentYear - 1, month - 1, 1);
        endOfMonth = new Date(currentYear - 1, month, 0, 23, 59, 59, 999);
    } else {  // Fetch current year's data
        startOfMonth = new Date(currentYear, month - 1, 1);
        endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
    }

    return { startOfMonth, endOfMonth };
};

// Utility function to calculate sales summary
const calculateSalesSummary = (milkData) => {
    const totalEntries = milkData.length;
    const totalQuantity = milkData.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = milkData.reduce((total, item) => total + item.totalAmount, 0);
    const averagePrice = totalQuantity ? totalAmount / totalQuantity : 0;

    return { totalEntries, totalQuantity, totalAmount, averagePrice };
};

module.exports = { getMonthDateRange, calculateSalesSummary };