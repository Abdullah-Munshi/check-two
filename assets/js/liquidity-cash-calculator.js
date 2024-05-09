if (document.getElementById("calc-outer-box") !== null) {
  const dropdownPairs = {
    XSGD: "SGD",
    USDT: "USD",
    // Add more pairs as needed
  };

  const rateThresholds = {
    XSGD: {
      min: 50000,
      max: 250000,
      tiers: [
        { upTo: 100000, rate: 1.04 },
        { upTo: 175000, rate: 1.045 },
        { upTo: 250000, rate: 1.5 },
      ],
    },
    USDT: {
      min: 50000,
      max: 250000,
      tiers: [
        { upTo: 100000, rate: 1.01 },
        { upTo: 175000, rate: 1.013 },
        { upTo: 250000, rate: 1.015 },
      ],
    },
  };

  const calculateStrings = {
    beforeCalcStr: "ENTER THE AMOUNT YOU WANT TO EXCHANGE",
    afterCalcStr: "You will earn %amount% in this trade",
  };

  class ABSelect {
    constructor(dropdownId, displayId) {
      this.dropdown = document.getElementById(dropdownId);
      this.displayElement = document.getElementById(displayId);
      this.dropdownOptions = this.dropdown.querySelectorAll("li");
      this.dropdownIsOpen = false;
      this._init();
    }

    _init() {
      this.updateDisplay(this.dropdownOptions[0]);

      this.displayElement.addEventListener("click", () => {
        this.toggleDropdown();
      });

      this.dropdownOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
          this.updateDisplay(event.currentTarget);
          if (this.callback) {
            this.callback(event.currentTarget.getAttribute("data-val"));
          }
          this.toggleDropdown();
        });
      });

      document.addEventListener("click", (event) => {
        this.closeDropdownOnOutsideClick(event);
      });
    }

    toggleDropdown() {
      this.dropdown.classList.toggle("active");
      this.dropdownIsOpen = !this.dropdownIsOpen;
    }

    updateDisplay(selectedOption) {
      this.displayElement.innerHTML = selectedOption.innerHTML;
      this.displayElement.setAttribute(
        "data-val",
        selectedOption.getAttribute("data-val")
      );
      updateWarningMessage();
      calculateConversion();
    }

    closeDropdownOnOutsideClick(event) {
      if (
        !this.dropdown.contains(event.target) &&
        !this.displayElement.contains(event.target) &&
        this.dropdownIsOpen
      ) {
        this.toggleDropdown();
      }
    }
  }
  function updateSubtractionDisplay() {
    const cryptoInput = document.getElementById("crypto-input");
    const currencyInput = document.getElementById("currency-input");
    const subtractDisplay = document.getElementById("reward");

    let cryptoInputValue = parseFloat(cryptoInput.value) || 0;
    let currencyInputValue = parseFloat(currencyInput.value) || 0;

    if (cryptoInputValue > 0 && currencyInputValue > 0) {
      let difference = currencyInputValue - cryptoInputValue;
      subtractDisplay.textContent = `${calculateStrings.afterCalcStr.replace(
        "%amount%",
        difference.toFixed(2)
      )}`;
    } else {
      subtractDisplay.textContent = calculateStrings.beforeCalcStr;
    }
  }

  function connectDropdowns(dropdown1, dropdown2, mapping) {
    dropdown1.callback = pairingHandler(dropdown2, mapping);
    dropdown2.callback = pairingHandler(dropdown1, invertMapping(mapping));
  }

  function pairingHandler(dropdown, mapping) {
    return function (selectedVal) {
      const matchedValue = mapping[selectedVal];
      if (!matchedValue) return;
      const matchedOption = Array.from(dropdown.dropdownOptions).find(
        (option) => option.getAttribute("data-val") === matchedValue
      );
      if (matchedOption) {
        dropdown.updateDisplay(matchedOption);
      }
    };
  }

  function invertMapping(mapping) {
    const reversed = {};
    for (const key in mapping) {
      reversed[mapping[key]] = key;
    }
    return reversed;
  }

  const cryptoDropdown = new ABSelect("csm-dropdown", "csm-display");
  const currencyDropdown = new ABSelect("csm-dropdown2", "csm-display2");
  connectDropdowns(cryptoDropdown, currencyDropdown, dropdownPairs);

  function updateWarningMessage() {
    const inputVal = document.getElementById("crypto-input").value;
    const cryptoType = document
      .getElementById("csm-display")
      .getAttribute("data-val");
    const warningElement = document.getElementById("crypto-input-warning");
    const conversionDetails = rateThresholds[cryptoType];
    const cryptoName = document
      .getElementById("csm-display")
      .textContent.trim()
      .split(" ")[0];

    if (inputVal === "") {
      warningElement.textContent = "";
      return;
    }

    let amount = parseFloat(inputVal);
    if (isNaN(amount)) {
      warningElement.textContent = "Please enter a valid number.";
      return;
    }

    if (amount < conversionDetails.min) {
      warningElement.textContent = `Min is ${conversionDetails.min} ${cryptoName}.`;
      document.getElementById("currency-input").value = "";
      return;
    } else if (amount > conversionDetails.max) {
      warningElement.textContent = `Max is ${conversionDetails.max} ${cryptoName}.`;
      document.getElementById("currency-input").value = "";
      return;
    } else {
      warningElement.textContent = "";
    }
  }

  function calculateConversion() {
    const cryptoVal = document.getElementById("crypto-input").value;
    const cryptoType = document
      .getElementById("csm-display")
      .getAttribute("data-val");
    const conversionDetails = rateThresholds[cryptoType];
    updateSubtractionDisplay();
    if (!conversionDetails || isNaN(cryptoVal) || cryptoVal === "") {
      updateWarningMessage(); // also handles invalid input
      document.getElementById("currency-input").value = "";
      return;
    }

    let amount = parseFloat(cryptoVal);

    // Check for amount within valid range then calculate conversion
    if (amount >= conversionDetails.min && amount <= conversionDetails.max) {
      let rate =
        conversionDetails.tiers[conversionDetails.tiers.length - 1].rate; // Default to last tier rate
      // Find the correct tier based on the amount and set rate
      for (let tier of conversionDetails.tiers) {
        if (amount <= tier.upTo) {
          rate = tier.rate;
          break;
        }
      }

      const convertedValue = amount * rate;
      document.getElementById("currency-input").value =
        convertedValue.toFixed(0);
    }

    // Update the warning message regardless of whether conversion took place
    updateWarningMessage();
  }

  // Attach the calculateConversion function to the input event of the crypto input
  document.getElementById("crypto-input").addEventListener("input", () => {
    calculateConversion();
    updateSubtractionDisplay();
  });

  // Initialize the calculator with a default conversion
  calculateConversion();

  // Script for Calculate Exchange Ui
  const calcOuterBox = document.getElementById("calc-outer-box");
  const calcForm = document.getElementById("calculator-box");
  const exchangeBtn = document.getElementById("exchange");
  const backtoexchage = document.getElementById("backtoexchage");

  calcForm.addEventListener("submit", (event) => {
    event.preventDefault();
    $(calcOuterBox).addClass("submitted");
    setTimeout(() => {
      $(calcOuterBox).removeClass("goback");
    }, 100);
  });

  backtoexchage.addEventListener("click", (e) => {
    e.preventDefault();
    $(calcOuterBox).addClass("goback");
    setTimeout(() => {
      $(calcOuterBox).removeClass("submitted");
    }, 100);
  });
}
