export default function Check(input){
    const regex = /^[a-zA-Z]+$/;

    return regex.test(input);
}
export function CheckWithSpecialCharacters(input){
    const regex = /^[a-zA-Z0-9@#!$%^&*()]+$/;
    return regex.test(input)
}