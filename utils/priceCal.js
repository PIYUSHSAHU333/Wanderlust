
 function priceCal(checkIn, checkOut, pricepernight){
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);

    const diff = checkOutTime - checkInTime;
    const diffInDay = diff / (1000 * 60 * 60 * 24)
    if (diffInDay <= 0) {
        return pricepernight;
    }
    const price = diffInDay * pricepernight;
    return price;
}

module.exports = priceCal;