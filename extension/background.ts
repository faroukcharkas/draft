export {}

console.log("background.ts")

chrome.commands.onCommand.addListener((command) => {
  if (command === "test") {
    console.log(`test command!`)
  }
})