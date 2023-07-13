export const print = (str: string) => {
    console.log(str, "시작")
    for (let i = 0; i < 1000000000; i++) {}
    console.log(str, "끝")
}
