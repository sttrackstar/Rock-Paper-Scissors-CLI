import chalk from 'chalk';
import { select } from '@inquirer/prompts';

export async function showMainMenu(gameState) {
    const action = await select({
        message: "Main Menu",
        choices: [
            { name: "Start Game", value: "start" },
            { name: "See Stats", value: "stats" },
            { name: "Reset Stats", value: "reset" },
            { name: "Quit", value: "quit" },
        ]
    });

    switch (action) {
        case "start":
            await startGame(gameState);
            break;
        case "stats":
            showStats(gameState);
            await select({
                message: 'Select "Back" to return to the main menu',
                choices: [{ name: "Back", value: "back" }],
            });
            await showMainMenu(gameState);
            break;
        case "reset":
            resetGame(gameState);
            console.log(chalk.blue("Stats have been reset."));
            await showMainMenu(gameState);
            break;
        case "quit":
            console.log("Goodbye!");
            process.exit(0);
    }
}

export async function startGame(gameState) {
    const choices = ["rock", "paper", "scissors"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    const userChoice = await select({
        message: "Choose your weapon",
        choices: choices.map((choice) => ({
            name: choice,
            value: choice,
        }))
    });

    const result = determineWinner(userChoice, computerChoice);
    updateStats(gameState, result);

    console.log(chalk.blue('Computer chose: ${computerChoice}'));

    if (result === "win") {
        console.log(chalk.green("You win!"));
    } else if (result === "lose") {
        console.log(chalk.red("You lose!"));
    } else {
        console.log(chalk.yellow("It's a tie!"));
    }

    await showMainMenu(gameState);
}

export function determineWinner(userChoice, computerChoice) {
    const winMap = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };
    
    if (userChoice === computerChoice) return "tie";
    return winMap[userChoice] === computerChoice ? "win" : "lose";
}

export function updateStats(result, gameState) {
    if(result === "win") {
        gameState.stats.wins += 1;
    }
    else if(result === "lose"){
        gameState.stats.losses += 1;
    }
    else if (result === "tie"){
        gameState.stats.ties += 1;
    }
    
}

export function showStats(gameState) {
    console.log(chalk.blue("Game Statistics:"));
    console.log(chalk.green(`Wins: ${gameState.stats.wins}`));
    console.log(chalk.red(`Losses: ${gameState.stats.losses}`));
    console.log(chalk.yellow(`Ties: ${gameState.stats.ties}`));
}

export function resetGame(gameState) {
    gameState.stats = { 
        wins: 0, 
        losses: 0, 
        ties: 0 
    };
}