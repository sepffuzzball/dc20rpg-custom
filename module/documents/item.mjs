import { evaluateDicelessFormula } from "../helpers/rolls.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class DC20RpgItem extends Item {

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  prepareDerivedData() {

    if (['weapon', 'equipment', 'consumable', 'feature', 'technique', 'spell'].includes(this.type)) {
      this._prepareCoreRoll();
      this._prepareMaxChargesAmount();
      this._prepareDC();
      this._prepareDCForEnhancements();
    }
    if (this.type === "weapon") this._prepareTableName("Weapons");
    if (this.type === "equipment") this._prepareTableName("Equipment");
    if (this.type === "consumable") this._prepareTableName("Consumables");
    if (this.type === "tool") this._prepareTableName("Tools");
    if (this.type === "loot") this._prepareTableName("Loot");
    if (this.type === "feature") this._prepareTableName("Features");
    if (this.type === "technique") this._prepareTableName("Techniques");
    if (this.type === "spell") this._prepareTableName("Spells");
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  async getRollData() {
    const systemData = foundry.utils.deepClone(this.system)
 
    // Grab the item's system data.
    let rollData = {
      ...systemData,
      rollBonus: systemData.attackFormula?.rollBonus
    }

    const actor = await this.actor;
    // If present, add the actor's roll data.
    if (actor) {
      rollData = {...rollData, ...actor.getRollData()};
    }

    return rollData;
  }

//=========================================
//=           Prepare Item Data           =
//=========================================
  async _prepareCoreRoll() {
    const system = this.system;
    const attackFormula = system.attackFormula;
    
    // Prepare formula
    if (attackFormula.overriden) {
      attackFormula.formula = attackFormula.overridenFormula;
    } else {
      let calculationFormula = "d20";

      // determine if it is a spell or attack check
      if (attackFormula.checkType === "attack") {
        if (system.attackFormula.combatMastery) calculationFormula += " + @attack";
        else calculationFormula += " + @attackNoCM";
      }
      else if (attackFormula.checkType === "spell") calculationFormula += " + @spell";

      if (system.attackFormula.rollBonus) calculationFormula +=  " + @rollBonus";
      attackFormula.formula = calculationFormula;
    }

    // Calculate roll modifier for formula
    const rollData = await this.getRollData();
    attackFormula.rollModifier = attackFormula.formula ? evaluateDicelessFormula(attackFormula.formula, rollData).total : 0;
  }

  async _prepareDCForEnhancements() {
    const enhancements = this.system.enhancements;
    if (!enhancements) return;

    const actor = await this.actor;
    for (const enh of Object.values(enhancements)) {
      if (enh.modifications.overrideSave) {
        const save = enh.modifications.save;
        if (save.calculationKey === "flat") continue;
        if (actor) save.dc = this._calculateSaveDC(save, actor);
        else save.dc = null;
      }
    }
  }

  async _prepareDC() {
    const save = this.system.save;
    if (save.calculationKey === "flat") return;

    const actor = await this.actor;
    if (!actor) {
      save.dc = null;
      return;
    }
    
    save.dc = this._calculateSaveDC(save, actor);
  }

  _calculateSaveDC(save, actor) {
    const saveDC = actor.system.saveDC;
    switch (save.calculationKey) {
      case "martial":
        return saveDC.value.martial;
      case "spell":
        return saveDC.value.spell; 
      default:
        let dc = 8;
        const key = save.calculationKey;
        dc += actor.system.attributes[key].value;
        if (save.addMastery) dc += actor.system.details.combatMastery;
        return dc;
    }
  }

  async _prepareMaxChargesAmount() {
    const charges = this.system.costs.charges;
    const rollData = await this.getRollData();
    charges.max = charges.maxChargesFormula ? evaluateDicelessFormula(charges.maxChargesFormula, rollData).total : null;    
  }

  _prepareTableName(fallbackName) {
    let tableName = this.system.tableName;
    if (!tableName || tableName.trim() === "") this.system.tableName = fallbackName;
  }
}
