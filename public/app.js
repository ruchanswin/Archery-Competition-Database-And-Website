const inputType = document.querySelector("#inputType");
const inputOption = document.querySelector("#inputOption");

if (inputType instanceof HTMLSelectElement && inputOption instanceof HTMLSelectElement) {
  const optionsByInputType = {
    choose1: ["1.1", "1.2"],
    choose2: ["2.1", "2.2"],
  };

  inputType.addEventListener("change", () => {
    inputOption.replaceChildren();
    const choices = optionsByInputType[inputType.value] ?? [];

    if (choices.length === 0) {
      inputOption.add(new Option("Choose an input type first", ""));
      inputOption.disabled = true;
      return;
    }

    inputOption.add(new Option("Choose an option", ""));
    for (const choice of choices) {
      inputOption.add(new Option(choice, choice));
    }
    inputOption.disabled = false;
  });
}
