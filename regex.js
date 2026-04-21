function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  return typeof name === 'string' && name.length >= 3;
}

function isValidForCreate(id, users) {
    return typeof id === "number" && !users.some(user => user.id === id)
}

function isValidIdForUpdate(id, users) {
  return typeof id === "number" && users.some(user => user.id === id);
}

function validateUser(user, users, isUpdate= false) {
  const errors = [];
  
  if (!isValidName(user.name)) {
    errors.push("El nombre debe tener al menos tres caracteres");
  }
  
  if (!isValidEmail(user.email)) {
    errors.push("El correo electrónico no es válido");
  }
  
  if (isUpdate) {
    if (!isValidIdForUpdate(user.id, users)) {
      errors.push("El ID debe existir para poder actualizar");
    }
  } else {
    if (!isValidIdForCreate(user.id, users)) {
      errors.push("El ID debe ser numérico y único");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}



module.exports = {
    isValidEmail,
    isValidName,
    isValidForCreate,
    isValidIdForUpdate,
    validateUser
}