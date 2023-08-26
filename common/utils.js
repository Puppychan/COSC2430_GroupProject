// reusable functions for other projects
const getParameterByPath = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const formatCurrencyVND = (number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formatter.format(number);
}
module.exports = {
    getParameterByPath,
    formatCurrencyVND
}
