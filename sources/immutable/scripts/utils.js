// Rand from Kenzo Kit by icw82
const rand = (first, second) => {
    let min;
    let max;

    // Если первым аргументом передан массив
    if (first instanceof Array)
        return first[ rand(0, first.length - 1) ];

    // Если аргументов нет — выдавать случайно true/false
    if (typeof first !== 'number')
        return !Math.round(Math.random());

    // Если аргумент только один — задаёт разряд случайного числа
    if (typeof second !== 'number') {
        var depth = Math.floor(Math.abs(first));

        if (depth >= 16)
            throw new Error('Нельзя задать число более чем в 16 знаков');

        if (depth === 0)
            return 0;

        if (depth === 1)
            min = 0;
        else
            min = Math.pow(10, depth - 1);

        return rand(min, Math.pow(10, depth) - 1);

    }

    // Если два аргумента
    min = first;
    max = second + 1;

    return Math.floor( Math.random() * (max - min) ) + min;

};

const getRandObject = () => ({
    id: rand() ? rand(10) : rand(10).toString(),
    name: rand([
        'Авдотья', 'Агафия', 'Иоанна', 'Лукия', 'Макария', 'Миропия',
        'Патрикия', 'Агап', 'Анастасий', 'Викентий', 'Герасим', 'Евдоким',
        'Ефрем', 'Исаакий', 'Зиновий', 'Лаврентий', 'Макарий', 'Никодим',
        'Орест', 'Пахом', 'Устин', 'Федот', 'Фома',
    ]),
    url: 'example.org',
});

/**
 * Возвращает Promise, отрабатывающий через заданное количество миллисекунд.
 * @param {number} ms Количество миллисекунд
 * @returns {Promise}
 */
const sleep = async ms => await new Promise(r => setTimeout(r, ms));
