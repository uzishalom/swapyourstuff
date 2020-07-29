export const yesOption = "Yes";
export const noOption = "No";

export const swapTitles = {
    swapped: "Swapped",
    notSwapped: "Not Swapped"

}

export const hasImageOptions = [
    { value: yesOption, title: "Has Image" },
    { value: noOption, title: "Without Image" },
];

export const swappedOptions = [
    { value: noOption, title: swapTitles.notSwapped },
    { value: yesOption, title: swapTitles.swapped },
];

export default {
    yesOption,
    noOption,
    hasImageOptions,
    swappedOptions,
}

