import { createChatMessage, rollItemToChat } from "../../chat/chat.mjs";
import { createVariableRollDialog } from "../../dialogs/variable-attribute-picker.mjs";
import { DC20RPG } from "../config.mjs";
import { respectUsageCost } from "./costManipulator.mjs";
import { getLabelFromKey } from "../utils.mjs";

//======================================
//          Roll From Formula          =
//======================================
/** @see handleRollFromFormula */
export function rollFromFormula(formula, label, actor, sendToChat) {
  const dataset = {
    roll: formula,
    label: label
  }
  return handleRollFromFormula(actor, dataset, sendToChat)
}

/**
 * Creates new Roll instance from given formula for given actor.
 * Sends it to chat if needed. Returns created roll.
 * 
 * @param {string}      formula     Formula of that roll 
 * @param {DC20RpgActor}actor       Actor which rollData will be used for that roll
 * @param {boolean}     sendToChat  Determines roll should be send to chat as a message
 * @param {boolean}     customLabel If provided will set label of chat roll to value
 * @returns {Roll}  Created roll
 */
export function handleRollFromFormula(actor, dataset, sendToChat) {
  const rollData = actor.getRollData();
  let roll = new Roll(dataset.roll, rollData);
  roll.evaluate({async: false})

  if (sendToChat) {
    const customLabel = dataset.label ? `${dataset.label}` : `${actor.name} : Roll Result`;
    const templateData = {
      label: customLabel,
      image: actor.img,
      roll: roll,
      ...rollData
    }
    const templateSource = "systems/dc20rpg/templates/chat/formula-chat-message.hbs";
    createChatMessage(actor, templateData, templateSource, [roll]);
  }
  return roll;
}

//===================================
//          Roll From Item          =
//===================================
/**
 * Creates new Roll instance for item's rollFormula. Returns that roll.
 * Also creates new Roll instace for every other formula added to that item in "system.formulas".
 * Those rolls are not returned by that method but are shown in chat message.
 * 
 * @param {DC20RpgActor}actor       Actor which is a speaker for that roll
 * @param {DC20RpgItem} item        Item which rollData will be used for that roll
 * @param {boolean}     sendToChat  Determines if roll should be send to chat as a message
 * @returns {Roll}  Created roll
 */
export async function handleRollFromItem(actor, dataset, sendToChat) {
  const item = actor.items.get(dataset.itemId);
  if (!item) return null;

  let evaulatedData;
  if (dataset.configuredRoll) evaulatedData = await handleConfiguredRoll(actor, item);
  else evaulatedData = await handleStandardRoll(actor, item);

  if (!evaulatedData) return null;
  if (sendToChat) rollItemToChat(evaulatedData, item, actor);
  return evaulatedData.roll;
}

export function handleConfiguredRoll(actor, item) {
  const rollMenu = item.flags.rollMenu;
  // Handle cost usage if roll is not free
  const costsSubracted = rollMenu.freeRoll ? true : respectUsageCost(actor, item);
  
  // Calculate if should be done with advantage or disadvantage
  const disLevel = rollMenu.dis ? rollMenu.disLevel : 0
  const advLevel = rollMenu.adv ? rollMenu.advLevel : 0
  const rollLevel = advLevel - disLevel;

  return costsSubracted ? _rollItem(actor, item, rollLevel, rollMenu.versatileRoll) : null;
}

export function handleStandardRoll(actor, item) {
  const costsSubracted = respectUsageCost(actor, item);
  return costsSubracted ? _rollItem(actor, item, 0, false) : null;
}

async function _rollItem(actor, item, rollLevel, versatileRoll) {
  const rollData = await item.getRollData();
  const actionType = item.system.actionType;

  if (actionType === "tradeSkill") return _rollTradeSkill(actor, item.system.tradeSkillKey);

  const preparedData = {
    ..._prepareDataForActionType(actionType, actor, item, rollData, rollLevel, versatileRoll),
    ...rollData
  }
  const winningRoll = _extractAndMarkWinningCoreRoll(preparedData.rolls, rollLevel);
  return {
    data: preparedData,
    roll: winningRoll,
    notTradeSkill: true
  };
}

function _prepareDataForActionType(actionType, actor, item, rollData, rollLevel, versatileRoll) {
  switch (actionType) {
    case "dynamic": 
    case "save":
      return {
        rolls: _evaulateItemRolls(actionType, item, rollData, rollLevel, versatileRoll),
        save: _prepareSave(item),
        outcome: _prepareOutcomeDescriptions(item)
      }

    case "attack":
    case "healing":
    case "other":
      return {
        rolls: _evaulateItemRolls(actionType, item, rollData, rollLevel, versatileRoll),
        outcome: _prepareOutcomeDescriptions(item)
      }

    case "check":
    case "contest":
      return {
        rolls: _evaulateCheckRoll(item, actor, rollData),
        check: _prepareContestedCheck(item),
        outcome: _prepareOutcomeDescriptions(item)
      }
  }
}

function _evaulateItemRolls(actionType, item, rollData, rollLevel, versatileRoll) {
  let coreRolls = _prepareCoreRolls(actionType, item, rollData, rollLevel);
  let formulaRolls = _prepareFormulaRolls(item, rollData, versatileRoll);
  let rolls = [...coreRolls, ...formulaRolls];
  
  // Evaulating all rolls
  if (rolls) rolls.forEach(roll => roll.evaluate({async: false}));
  return rolls;
}

function _evaulateCheckRoll(item, actor, rollData) {
  const checkKey = item.system.check.checkKey;
  let modifier;
  switch (checkKey) {
    case "att":
      modifier = actor.system.attackMod.value.martial;
      break;

    case "spe":
      modifier = actor.system.attackMod.value.spell;
      break;

    case "mar": 
      const acrModifier = actor.system.skills.acr.modifier;
      const athModifier = actor.system.skills.ath.modifier;
      modifier = acrModifier >= athModifier ? acrModifier : athModifier;
      break;

    default:
      modifier = actor.system.skills[checkKey].modifier;
      break;
  }

  const checkFormula = `d20 + ${modifier}`;
  let skillRoll = new Roll(checkFormula, rollData);
  skillRoll.coreFormula = true;
  skillRoll.label = getLabelFromKey(checkKey, DC20RPG.checks)
  skillRoll.evaluate({async: false});
  return [skillRoll];
}

function _prepareCoreRolls(actionType, item, rollData, rollLevel) {
  let coreRolls = [];

  const coreFormula = item.system.coreFormula.formula;
  if (coreFormula && !["save", "check", "contest"].includes(actionType)) { // we want to skip core role for saves, skill checks and contest rolls
    // We want to create core rolls for every level of advanage/disadvantage
    for (let i = 0; i < Math.abs(rollLevel) + 1; i++) {
      let coreRoll = new Roll(coreFormula, rollData);
      coreRoll.coreFormula = true;
      coreRoll.label = getLabelFromKey(actionType, DC20RPG.actionTypes) + " Roll";
      coreRolls.push(coreRoll);
    }
  }

  return coreRolls;
}

function _prepareFormulaRolls(item, rollData, versatileRoll) {
  const formulas = item.system.formulas;
  if (formulas) {
    let damageRolls = [];
    let healingRolls = [];
    let otherRolls = [];

    for (let formula of Object.values(formulas)) {
      // Check if roll should be versatile if so check if given formula has versatile formula created
      let isVerstaile = versatileRoll ? formula.versatile : false;
      let rollFormula = isVerstaile ? formula.versatileFormula : formula.formula;
      let roll = new Roll(rollFormula, rollData);
      roll.coreFormula = false;
      roll.label = isVerstaile ? "(Versatile) " : "";
      
      switch (formula.category) {
        case "damage":
          let damageType = getLabelFromKey(formula.type, DC20RPG.damageTypes);
          roll.label += "Damage Roll - " + damageType;
          roll.type = damageType;
          damageRolls.push(roll);
          break;
        case "healing":
          let healingType = getLabelFromKey(formula.type, DC20RPG.healingTypes);
          roll.label += "Healing Roll - " + healingType;
          roll.type = healingType;
          healingRolls.push(roll);
          break;
        case "other":
          roll.label += "Other Roll";
          otherRolls.push(roll);
          break;
      }
    }
    return [...damageRolls, ...healingRolls, ...otherRolls];
  }
  return [];
}

function _prepareSave(item) {
  const type = item.system.save.type;
  return {
    dc: item.system.save.dc,
    type: type,
    label: getLabelFromKey(type, DC20RPG.saveTypes) + " Save"
  };
}

function _prepareOutcomeDescriptions(item) {
  return {
    success: item.system.outcome.success,
    fail: item.system.outcome.fail,
    heavy: item.system.outcome.heavy,
    brutal: item.system.outcome.brutal
  }
}

function _prepareContestedCheck(item) {
  const checkKey = item.system.check.checkKey;
  const contestedKey = item.system.check.contestedKey;
  return {
    skill: checkKey,
    contested: contestedKey,
    actionType: item.system.actionType,
    checkLabel: getLabelFromKey(checkKey, DC20RPG.checks) + " Check",
    contestedLabel: getLabelFromKey(contestedKey, DC20RPG.checks) + " Check"
  }
}

function _extractAndMarkWinningCoreRoll(rolls, rollLevel) {
  let coreRolls = _extractCoreRolls(rolls);
  if (!coreRolls) return null;

  let bestRoll = {};
  let bestTotal;

  if (coreRolls.length === 1) bestRoll = coreRolls[0];
  
  if (rollLevel < 0) {
    bestTotal = 999;
    coreRolls.forEach(coreRoll => {
      if (coreRoll._total < bestTotal) {
        bestRoll = coreRoll;
        bestTotal = coreRoll._total;
      }
    });
  }
  if (rollLevel > 0) {
    bestTotal = -999;
    coreRolls.forEach(coreRoll => {
      if (coreRoll._total > bestTotal) {
        bestRoll = coreRoll;
        bestTotal = coreRoll._total;
      }
    });
  }

  bestRoll.winner = true;
  return bestRoll;
}

function _extractCoreRolls(rolls) {
  if (!rolls) return null;
  let coreRolls = [];
  rolls.forEach(roll => {
    if (roll.coreFormula) coreRolls.push(roll);
  });
  return coreRolls;
}

function _rollTradeSkill(actor, tradeSkillKey) {
  const tradeSkill = actor.system.tradeSkills[tradeSkillKey];
  const dataset = {
    mastery: tradeSkill.skillMastery,
    bonus: tradeSkill.bonus,
    label: getLabelFromKey(tradeSkillKey, DC20RPG.tradeSkills) + " Check"
  }
  createVariableRollDialog(dataset, actor);

  return {
    notTradeSkill: false,
    roll: null
  }
}