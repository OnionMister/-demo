const isValid = function (brackets) {
    if (brackets.length % 2 === 1) {
        return false;
    }
    const arr = [];
    let t = '';
    for (let i = 0; i < brackets.length; i++) {
        if (brackets[i] === '(' || brackets[i] === '[' || brackets[i] === '{') {
            arr.push(brackets[i]);
        } else if (brackets[i] === ')' || brackets[i] === ']' || brackets[i] === '}') {
            if (brackets[i] === 0) {
                return false;
            }
            t = arr[arr.length - 1];
            if ((t === '(' && brackets[i] === ')') || (t === '[' && brackets[i] === ']') || (t === '{' && brackets[i] === '}')) {
                arr.pop();
            } else {
                return false;
            }
        }
    }
    return arr.length === 0
}
console.log(isValid('[]'));
console.log(isValid('()[]{}'));
console.log(isValid('()[]'));
console.log(isValid("([}}])"));
console.log(isValid('{(])[]}'));