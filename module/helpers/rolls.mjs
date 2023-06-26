import { DC20RpgActor } from "../documents/actor.mjs";
import { DC20RPG } from "./config.mjs";
import { capitalize, getLabelFromKey } from "./utils.mjs";

/**
 * Calls rollFromFormula for selected tokens.
 */
export function rollForTokens(event, type) {
  event.preventDefault();
  const dataset = event.currentTarget.dataset;
  const selectedTokens = canvas.tokens.controlled;
  if (selectedTokens.length === 0) return;

  selectedTokens.forEach(token => {
    let actor = token.document._actor;
    if (type === "save") _rollSave(actor, dataset);
    if (type === "check") _rollSkill(actor, dataset);
  })
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
export async function rollFromFormula(formula, actor, sendToChat, customLabel) {
  const rollData = actor.getRollData();
  let roll = new Roll(formula, rollData);
  roll.evaluate({async: false})

  if (sendToChat) {
    let label = customLabel ? customLabel : `${actor.name} : Roll Result`;
    let baseTemplateData = _templateDataFormActor(actor, label, roll);
    const templateSource = "systems/dc20rpg/templates/chat/formula-chat-message.hbs";
    let renderedTemplate = await _renderChatTemplate(templateSource, rollData, baseTemplateData);
    _createChatMessage(renderedTemplate, [roll], actor);
  }

  return roll;
}

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
export async function rollItem(actor, item, sendToChat) {
  const rollData = item.getRollData();
  const actionType = item.system.actionType;
  
  let preparedData = {};
  if (["dynamic", "attack", "healing", "save", "other"].includes(actionType)) {
    preparedData.rolls = _prepareFormulas(item, rollData);
  }
  if (["dynamic", "save"].includes(actionType)) {
    preparedData.save = _prepareSavesData(item);
  }
  if (["skill", "contest"].includes(actionType)) {
    preparedData.skillCheck = _prepareSkillChecksData(item);
    preparedData.rolls = _prepareSkillCheckFormula(item, actor, rollData);
  }
  
  if (sendToChat) {
    let baseTemplateData = _templateDataFormItem(item);
    preparedData = {...preparedData, ...baseTemplateData}
    const templateSource = "systems/dc20rpg/templates/chat/item-chat-message.hbs";
    let renderedTemplate = await _renderChatTemplate(templateSource, rollData, preparedData);
    _createChatMessage(renderedTemplate, preparedData.rolls, actor);
  }
  
  return _extractCoreRoll(preparedData.rolls);
}

function _prepareFormulas(item, rollData) {
  let rolls = [];

  // Creating roll from core formula
  const coreFromula = item.system.rollFormula.formula;
  const actionType = item.system.actionType;
  if (coreFromula && !["save", "skill", "contest"].includes(actionType)) { // we want to skip core role for saves, skill checks and contest rolls
    let coreRoll = new Roll(coreFromula, rollData);
    coreRoll.coreFromula = true;
    coreRoll.label = getLabelFromKey(actionType, DC20RPG.actionTypes) + " Roll";
    rolls.push(coreRoll);
  }

  // Creating rolls from other formulas
  const formulas = item.system.formulas;
  if (formulas) {
    let damageRolls = [];
    let healingRolls = [];
    let otherRolls = [];

    for (let formula of Object.values(formulas)) {
      let isVerstaile = formula.versatile;
      let rollFormula = isVerstaile ? formula.versatileFormula : formula.formula;
      let roll = new Roll(rollFormula, rollData);
      roll.coreFromula = false;
      roll.label = isVerstaile ? "(Versatile) " : "";
      
      switch (formula.category) {
        case "damage":
          roll.label += "Damage Roll - " + capitalize(formula.type);
          damageRolls.push(roll);
          break;
        case "healing":
          roll.label += "Healing Roll - " + capitalize(formula.type);
          healingRolls.push(roll);
          break;
        case "other":
          roll.label += "Other Roll";
          otherRolls.push(roll);
          break;
      }
    }
    rolls.push(...damageRolls, ...healingRolls, ...otherRolls);
  }
  
  // Evaulating all rolls
  if (rolls) rolls.forEach(roll => roll.evaluate({async: false}));
  return rolls;
}

function _prepareSkillCheckFormula(item, actor, rollData) {
  let skillKey = item.system.skill;
  let modifier;
  if (skillKey === "mar") {
    let acrModifier = actor.system.skills.acr.value;
    let athModifier = actor.system.skills.ath.value;
    modifier = acrModifier >= athModifier ? acrModifier : athModifier;
  } else {
    modifier = actor.system.skills[skillKey].value;
  }

  let skillCheckFormula = `d20 + ${modifier}`;
  let skillRoll = new Roll(skillCheckFormula, rollData);
  skillRoll.coreFromula = true;
  skillRoll.label = getLabelFromKey(skillKey, DC20RPG.skillsWithMartialSkill)
  skillRoll.evaluate({async: false});
  return [skillRoll];
}

function _prepareSkillChecksData(item) {
  let skillKey = item.system.skill;
  let contestedKey = item.system.contestedSkill;
  return {
    skill: skillKey,
    contested: contestedKey,
    actionType: item.system.actionType,
    skillLabel: getLabelFromKey(skillKey, DC20RPG.skillsWithMartialSkill) + " Check",
    contestedLabel: getLabelFromKey(contestedKey, DC20RPG.skillsWithMartialSkill) + " Check"
  }
}

function _prepareSavesData(item) {
  let type = item.system.save.type;
  return {
    dc: item.system.save.dc,
    type: type,
    label: getLabelFromKey(type, DC20RPG.saveTypes) + " Save"
  };
}

function _templateDataFormItem(item) {
  let description = item.system.statuses.identified ? item.system.description : "<b>Unidentified</b>";
  return {
    image: item.img,
    label: item.name,
    description: description
  } 
}

function _templateDataFormActor(actor, label, roll) {
  return {
    label: label,
    image: actor.img,
    roll: roll
  } 
}

async function _renderChatTemplate(templateSource, rollData, preparedData) {
  const config = DC20RPG;
  let templateData = {
    ...rollData, 
    ...preparedData,
    config: config
  }
  return await renderTemplate(templateSource, templateData);
}

function _createChatMessage(renderedTemplate, rolls, actor) {
  const rollMode = game.settings.get('core', 'rollMode');
  const speaker = ChatMessage.getSpeaker({ actor: actor });
  console.info(rolls);
  ChatMessage.create({
    speaker: speaker,
    rollMode: rollMode,
    content: renderedTemplate,
    rolls: rolls,
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL
  });
}

function _extractCoreRoll(rolls) {
  if (!rolls) return null;
  rolls.forEach(roll => {
    if (roll.coreFromula) return roll.rollFormula;
  });
  return null;
}

function _rollSave(actor, dataset) {
  let modifier = "";
  if (dataset.save === "menSave") {
    modifier = actor.system.details.menSave;
  } 
  else if (dataset.save === "phiSave") {
    modifier = actor.system.details.phiSave;
  } 
  else {
    let attribute = actor.system.attributes[dataset.save]
    modifier = attribute.save;
  }
  let label = getLabelFromKey(dataset.save, DC20RPG.saveTypes) + " Save";
  let formula = `d20 + ${modifier}`;
  rollFromFormula(formula, actor, true, label);
}

function _rollSkill(actor, dataset) {
  let modifier = "";
  let label = "";
  if (dataset.key === "mar") {
    let acr = actor.system.skills.acr;
    let ath = actor.system.skills.ath;
    
    let isAcrHigher =  acr.value > ath.value;
    modifier = isAcrHigher ? acr.value : ath.value;

    let labelKey = isAcrHigher ? "acr" : "ath";
    label += "Martial (" + getLabelFromKey(labelKey, DC20RPG.skills) + ")";
  } else {
    let attribute = actor.system.skills[dataset.key]
    modifier = attribute.value;
    label += getLabelFromKey(dataset.key, DC20RPG.skills);
  }
  label += " Check";
  let formula = `d20 + ${modifier}`;
  rollFromFormula(formula, actor, true, label);
}