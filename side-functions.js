
module.exports.getDuration = function (start, end) {
    if (end < start) {
        return 0;
    } else {

        return Math.round(end - start);
    }

}; 