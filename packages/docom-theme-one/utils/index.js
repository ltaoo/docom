/**
 * 
 * @param {number} num 
 * @return {string}
 */
export function paddingZero(num) {
    return num < 10 ? `0${num}` : String(num);
}

export function format(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = paddingZero(d.getMonth() + 1);
    const day = paddingZero(d.getDate());

    return `${year}/${month}/${day}`;
}