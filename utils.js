function sleep(t = 300) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t);
    });
}

module.exports = {
    sleep,
};
