function checkEmail(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function checkName(name){
    const regex = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]){3,20}$/;
    return regex.test(name);
}

module.exports = {
    checkEmail,
    checkName
}