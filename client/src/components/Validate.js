const validateInputs = () => {
    validationErrors = {};
    if (isNaN(bid) || bid <= 0) {
      setErrorMessage("Bid amount must be a positive number.");
      return false;
    }
    if (!username.trim()) {
      validationErrors.username = "username is required"
      return false;
    }

    return true;
  };

  module.exports = validateInputs;