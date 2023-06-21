import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

const refs = {
    leftPlayerHealth: null,
    rightPlayerHealth: null
};

let leftPlayer;
let rightPlayer;
let winner;

// Initialize the players with their initial properties

const initPlayers = (firstFighter, secondFighter) => {
    leftPlayer = {
        ...firstFighter,
        uniqueID: `${firstFighter._id}left`,
        totalHealth: firstFighter.health,
        percentHealth: 100,
        activeBlock: false,
        canAttack: true,
        imbaAttack: {
            isBtnPressed1: false,
            isBtnPressed2: false,
            isBtnPressed3: false,
            canImbaAttack: true,
            isActive: false
        }
    };
    rightPlayer = {
        ...secondFighter,
        uniqueID: `${firstFighter._id}right`,
        totalHealth: secondFighter.health,
        percentHealth: 100,
        activeBlock: false,
        canAttack: true,
        imbaAttack: {
            isBtnPressed1: false,
            isBtnPressed2: false,
            isBtnPressed3: false,
            canImbaAttack: true,
            isActive: false
        }
    };
};

// Initialize the players` health

const initRefs = () => {
    refs.leftPlayerHealth = document.getElementById('left-fighter-indicator');
    refs.rightPlayerHealth = document.getElementById('right-fighter-indicator');
};

// Calculate the hit power of a fighter

export function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = Math.round(Math.random()) + 1;
    const hitPower = attack * criticalHitChance;
    return hitPower;
    // return hit power
}

// Calculate the block power of a fighter

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = Math.round(Math.random()) + 1;
    const blockPower = defense * dodgeChance;
    return blockPower;
    // return block power
}

// Calculate the damage inflicted by an attacker on a defender

export function getDamage(attacker, defender) {
    let damage;
    const hitPower = getHitPower(attacker);
    const opponentDefense = getBlockPower(defender);

    // Check crical damage and turn on if it is active

    if (attacker.imbaAttack.isActive) {
        // const playerToDamage = attacker._id === leftPlayer._id ? leftPlayer : rightPlayer;
        const playerToDamage = attacker.uniqueID === leftPlayer.uniqueID ? leftPlayer : rightPlayer;
        damage = 2 * attacker.attack;
        playerToDamage.imbaAttack.canImbaAttack = false;
        playerToDamage.imbaAttack.isActive = false;
        setTimeout(() => {
            playerToDamage.imbaAttack.canImbaAttack = true;
        }, 10000);
    } else {
        // Turn on default damage
        damage = hitPower - opponentDefense;
    }

    if (damage > 0) {
        // const playerToDamage = defender._id === leftPlayer._id ? leftPlayer : rightPlayer;
        const playerToDamage = defender.uniqueID === leftPlayer.uniqueID ? leftPlayer : rightPlayer;
        playerToDamage.health -= damage;
        playerToDamage.percentHealth = (playerToDamage.health / playerToDamage.totalHealth) * 100;
        // if (defender._id === leftPlayer._id) {
        if (defender.uniqueID === leftPlayer.uniqueID) {
            refs.leftPlayerHealth.style.width = `${
                playerToDamage.percentHealth > 0 ? playerToDamage.percentHealth : 0
            }%`;
        } else {
            refs.rightPlayerHealth.style.width = `${
                playerToDamage.percentHealth > 0 ? playerToDamage.percentHealth : 0
            }%`;
        }
        if (playerToDamage.health <= 0) {
            winner = attacker.name;
            return fight(attacker, playerToDamage);
        }
    }
    return damage;
}

// Set the attack cooldown for a player

const setAttackCooldown = player => {
    // const actualPlayer = player._id === leftPlayer._id ? leftPlayer : rightPlayer;
    const actualPlayer = player.uniqueID === leftPlayer.uniqueID ? leftPlayer : rightPlayer;
    actualPlayer.canAttack = true;
};

// Check if a combo attack has been triggered and execute it

const checkComboAttack = (attacker, defender) => {
    if (attacker.imbaAttack.isBtnPressed1 && attacker.imbaAttack.isBtnPressed2 && attacker.imbaAttack.isBtnPressed3) {
        if (!attacker.imbaAttack.canImbaAttack) return;
        // const playerToDamage = attacker._id === leftPlayer._id ? leftPlayer : rightPlayer;
        const playerToDamage = attacker.uniqueID === leftPlayer.uniqueID ? leftPlayer : rightPlayer;
        playerToDamage.imbaAttack.isActive = true;
        getDamage(attacker, defender);
    }
};

// Event listener for keydown events

const keydownListener = ({ code }) => {
    if (code === controls.PlayerOneAttack && !leftPlayer.activeBlock && leftPlayer.canAttack) {
        if (rightPlayer.activeBlock === true) return;
        leftPlayer.canAttack = false;
        getDamage(leftPlayer, rightPlayer);
        setTimeout(() => {
            setAttackCooldown(leftPlayer);
        }, 700);
    }
    if (code === controls.PlayerTwoAttack && !rightPlayer.activeBlock && rightPlayer.canAttack) {
        if (leftPlayer.activeBlock === true) return;
        rightPlayer.canAttack = false;
        getDamage(rightPlayer, leftPlayer);
        setTimeout(() => {
            setAttackCooldown(rightPlayer);
        }, 700);
    }

    if (code === controls.PlayerOneCriticalHitCombination[0]) {
        leftPlayer.imbaAttack.isBtnPressed1 = true;
        checkComboAttack(leftPlayer, rightPlayer);
    }

    if (code === controls.PlayerOneCriticalHitCombination[1]) {
        leftPlayer.imbaAttack.isBtnPressed2 = true;
        checkComboAttack(leftPlayer, rightPlayer);
    }

    if (code === controls.PlayerOneCriticalHitCombination[2]) {
        leftPlayer.imbaAttack.isBtnPressed3 = true;
        checkComboAttack(leftPlayer, rightPlayer);
    }

    if (code === controls.PlayerTwoCriticalHitCombination[0]) {
        rightPlayer.imbaAttack.isBtnPressed1 = true;
        checkComboAttack(rightPlayer, leftPlayer);
    }

    if (code === controls.PlayerTwoCriticalHitCombination[1]) {
        rightPlayer.imbaAttack.isBtnPressed2 = true;
        checkComboAttack(rightPlayer, leftPlayer);
    }

    if (code === controls.PlayerTwoCriticalHitCombination[2]) {
        rightPlayer.imbaAttack.isBtnPressed3 = true;
        checkComboAttack(rightPlayer, leftPlayer);
    }

    if (code === controls.PlayerOneBlock) {
        leftPlayer.activeBlock = true;
    }
    if (code === controls.PlayerTwoBlock) {
        rightPlayer.activeBlock = true;
    }
};

// Event listener for keyup events

const keyupListener = ({ code }) => {
    if (code === controls.PlayerOneBlock) {
        leftPlayer.activeBlock = false;
    }

    if (code === controls.PlayerTwoBlock) {
        rightPlayer.activeBlock = false;
    }
};

// Main fight function

export async function fight(firstFighter, secondFighter) {
    if (!refs.leftPlayerHealth || !leftPlayer) {
        initRefs();
        initPlayers(firstFighter, secondFighter);
        document.addEventListener('keydown', keydownListener);
        document.addEventListener('keyup', keyupListener);
    }

    return new Promise(resolve => {
        if (winner) {
            document.removeEventListener('keydown', keydownListener);
            document.removeEventListener('keyup', keyupListener);
            showWinnerModal(winner);
            resolve(winner);
        }
        // resolve the promise with the winner when fight is over
    });
}
