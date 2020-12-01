(function () {
    // 整数货币化
    function intCurrency(num) {
        var reg = new RegExp("^[\\d]+[\\d|.]+$", 'g')
        if (!reg.test(num)) {
            return "只能为整数或小数！";
        }
        var numString = parseInt(num).toString();
        var len = numString.length;
        if (len < 3) {
            return num;
        }
        var n = len % 3;
        if (n > 0) {
            return numString.slice(0, n) + "," + numString.slice(n, len).match(/\d{3}/g).join(",");
        } else {
            return numString.slice(n, len).match(/\d{3}/g).join(",");
        }
    }
    console.group("------------整数货币化")
    console.log(intCurrency("abs"))
    console.log(intCurrency("0"))
    console.log(intCurrency("10"))
    console.log(intCurrency("100"))
    console.log(intCurrency("1000"))
    console.log(intCurrency("10000"))
    console.log(intCurrency("100000"))
    console.log(intCurrency("1000000"))
    console.log(intCurrency("10000000"))
    console.log(intCurrency("100000000"))
    console.log(intCurrency("1000000000"))
    console.log(intCurrency("1000000000.0"))
    console.log(intCurrency("1000000000.00"))
    console.log(intCurrency("1000000000.000"))
}());
// 正整数或小数 /^[0-9]+(\.[0-9]+)?$/g
// 正、负整数或小数，也可不输入正负 /^(\+|-)?\d+(\.\d+)?$/g
(function () {
    // 整数部分
    function intCurrency(num) {
        if (num === undefined) {
            return '';
        }
        var len = num.length;
        if (len < 3) {
            return num;
        }
        var n = len % 3;
        if (n > 0) {
            return num.slice(0, n) + "," + num.slice(n, len).match(/\d{3}/g).join(",");
        } else {
            return num.slice(n, len).match(/\d{3}/g).join(",");
        }
    }
    // 小数部分
    function decimalCurrency(num) {
        if (num === undefined) {
            return '';
        }
        var len = num.length; // 小数部分长度
        if (len < 3) { // 小于三位数
            return num;
        }
        var n = len % 3;
        if (n > 0) { // 位数不是3的倍数
            return num.slice(0, len - n).match(/\d{3}/g).join(',') + ',' + num.slice(len - n);
        } else {
            return num.slice(0, len - n).match(/\d{3}/g).join(',')
        }
    }

    function currency(num) {
        var integerPart; // 整数部分
        var decmialPart; // 小数部分
        num = num.toString();
        if (num.includes(".")) {
            integerPart = num.split('.')[0];
            decmialPart = num.split('.')[1];
        } else {
            integerPart = num;
        }
        return intCurrency(integerPart) + (decmialPart !== undefined ? ('.' + decimalCurrency(decmialPart)) : '');
    }
    console.group("------------整数或小数货币化")
    console.log(currency("0"))
    console.log(currency("10"))
    console.log(currency("100"))
    console.log(currency("1000"))
    console.log(currency("10000"))
    console.log(currency("100000"))
    console.log(currency("1000000"))
    console.log(currency("10000000"))
    console.log(currency("100000000"))
    console.log(currency("1000000000"))
    console.log(currency("1000000000.0"))
    console.log(currency("1000000000.00"))
    console.log(currency("1000000000.000"))
    console.log(currency("1000000000.0000"))
    console.log(currency("1000000000.00000"))
}());
(function () {
    // 直接使用正则
    function currency(num) {
        num = parseInt(num);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    console.group("------------取整数，正则货币化1")
    console.log(currency("0"))
    console.log(currency("10"))
    console.log(currency("100"))
    console.log(currency("1000"))
    console.log(currency("10000"))
    console.log(currency("100000"))
    console.log(currency("1000000"))
    console.log(currency("10000000"))
    console.log(currency("100000000"))
    console.log(currency("1000000000"))
    console.log(currency("1000000000.0"))
    console.log(currency("1000000000.00"))
    console.log(currency("1000000000.000"))
    console.log(currency("1000000000.0000"))
    console.log(currency("1000000000.00000"))
}());
(function () {
    // 直接使用正则
    function currency(num) {
        num = parseInt(num);
        return num.toString().replace(/(?=(\B)(\d{3})+$)/g, ',');
    }
    console.group("------------取整数，正则货币化2")
    console.log(currency("0"))
    console.log(currency("10"))
    console.log(currency("100"))
    console.log(currency("1000"))
    console.log(currency("10000"))
    console.log(currency("100000"))
    console.log(currency("1000000"))
    console.log(currency("10000000"))
    console.log(currency("100000000"))
    console.log(currency("1000000000"))
    console.log(currency("1000000000.0"))
    console.log(currency("1000000000.00"))
    console.log(currency("1000000000.000"))
    console.log(currency("1000000000.0000"))
    console.log(currency("1000000000.00000"))
}());