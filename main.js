let gameName = "Guess Word"
document.title = gameName
document.querySelector("h1").innerHTML = gameName
document.querySelector("footer").innerHTML = `${gameName} Game Created By Me`

// Setting Game Options
let numberofTries = 6
let numbetofLetters = 6
let currentTry = 1
let numberOfHints = 2

// Manage Words
let wordToGuess = ""
const words = ["Python","JQuery","Kotlin","Asmbly","Tailer","Create","Please","Master"]
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
let messageArea = document.querySelector(".message")

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints
const getHintButton = document.querySelector(".hint")
getHintButton.addEventListener("click", getHint)

function generateInput() {

    const inputContainer = document.querySelector(".inputs")

    for (let i = 1; i <= numberofTries; i++) {

        const tryDiv = document.createElement("div")
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span>Try ${i}</span>`

        if (i != 1) tryDiv.classList.add("disabled-inputs")

        // Create Inputs
        for (let j = 1; j <= numbetofLetters; j++) {

            const input = document.createElement("input")
            input.type = "text"
            input.id = `guess-${i}-letter-${j}`
            input.setAttribute("max-length","1")
            tryDiv.appendChild(input)
        }

        inputContainer.appendChild(tryDiv)
    }

    // Focus On First Input In First Try Element
    inputContainer.children[0].children[1].focus()

    // Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input")
    inputsInDisabledDiv.forEach( (input) => (input.disabled = true))

    const inputs = document.querySelectorAll("input")
    inputs.forEach( (input, index) => {

        // Convert Inputs Value To UpperCase
        input.addEventListener("input", function () {

            this.value = this.value.toUpperCase();

            const nextInput = inputs[index + 1]
            if (nextInput) nextInput.focus();
        })

        input.addEventListener("keydown", function (event) {

            const currentIndex = Array.from(inputs).indexOf(event.target) // or this

            if (event.key === "ArrowRight") {

                const nextInput = currentIndex + 1
                if (nextInput < inputs.length) inputs[nextInput].focus()
            }

            if (event.key === "ArrowLeft") {

                const previousInput = currentIndex - 1
                if (previousInput >= 0) inputs[previousInput].focus()
            }
        })
    })
}

const guessButton = document.querySelector(".check")
guessButton.addEventListener("click", handleGuesses)

function handleGuesses() {

    let successGuess = true

    for (let i = 1; i <= numbetofLetters; i++) {

        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        const letter = inputField.value.toLowerCase()
        const actualLetter = wordToGuess[i - 1]

        // Game Logic
        if (letter === actualLetter) {

            // Letter Is Correct and In Place
            inputField.classList.add("yes-in-place")

        } else if (wordToGuess.includes(letter) && letter !== "") {

            // Letter Is Correct and not In Place
            inputField.classList.add("not-in-place")
            successGuess = false

        } else {

            inputField.classList.add("no")
            successGuess = false
        }
    }

    // Check if user win or lose
    if (successGuess) {

        messageArea.innerHTML = `You Win. The Word is <span>${wordToGuess}</span>`
        if (numberOfHints === 2) {

            messageArea.innerHTML = `<p> Congratz You Didn't Use Hints</p>`
        }

        // Add Disabled Class on All Try Inputs
        let allTries = document.querySelectorAll(".inputs > div")
        allTries.forEach( (tryDiv) => tryDiv.classList.add("disabled-inputs"))

        // Disable Guess Button
        guessButton.disabled = true
        getHintButton.disabled = true

    } else {

        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs")
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
        currentTryInputs.forEach( (input) => (input.disabled = true))
        
        currentTry++

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
        nextTryInputs.forEach( (input) => (input.disabled = false))

        let element = document.querySelector(`.try-${currentTry}`)
        if (element) {

            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs")
            element.children[1].focus()

        } else {

            guessButton.disabled = true
            getHintButton.disabled = true
            messageArea.innerHTML = `You Lose The Word is <span> ${wordToGuess} </span>`
        }
    }
}

function getHint() {

    if (numberOfHints > 0) {

        numberOfHints--
        document.querySelector(".hint span").innerHTML = numberOfHints
    }

    if (numberOfHints === 0) {

        getHintButton.disabled = true
    }

    // Select Empty inputs
    const enabledInputs = document.querySelectorAll("input:not([disabled])")

    // Select Empty Input
    const emptyEnabledInputs = Array.from(enabledInputs).filter( (input) => input.value === "")

    if (emptyEnabledInputs.length > 0) {

        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length)
        const randomInput = emptyEnabledInputs[randomIndex]
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput)

        if (indexToFill !== -1) {

            randomInput.value = wordToGuess[indexToFill].toUpperCase()
        }
    }
}

function handleBackspace(event) {

    if (event.key === "Backspace") {

        const inputs = document.querySelectorAll("input:not([disabled])")
        const currentIndex = Array.from(inputs).indexOf(document.activeElement)

        if (currentIndex > 0) {

            const currentInput = inputs[currentIndex]
            const prevInput = inputs[currentIndex - 1]
            currentInput.value = ""
            prevInput.value = ""
            prevInput.focus()
        }
    }
}

document.addEventListener("keydown", handleBackspace)

window.onload = function() {

    generateInput()
}