export default function handleCodeLib(text) {
    let m2 = (/([(\s=){}."])/gi);
    return text.split(m2);
}
