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
        { upTo: 100000, rate: 0.077 },
        { upTo: 175000, rate: 0.083 },
        { upTo: 250000, rate: 0.95 },
      ],
    },
    USDT: {
      min: 50000,
      max: 250000,
      tiers: [
        { upTo: 100000, rate: 0.062 },
        { upTo: 175000, rate: 0.066 },
        { upTo: 250000, rate: 0.069 },
      ],
    },
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
      updateWarningMessage(); // Update the warning when an option is selected
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
  document
    .getElementById("crypto-input")
    .addEventListener("input", calculateConversion);

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
