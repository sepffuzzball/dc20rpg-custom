import { DC20RPG } from "../helpers/config.mjs";
import * as items from "../helpers/items.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class DC20RpgItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dc20rpg", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".item-sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/dc20rpg/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    context.config = DC20RPG;
    context.system = this.item.system;
    context.flags = this.item.flags;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    if (this.item.type === "weapon") this._prepareWeaponInfo(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.activable').click(ev => items.activateStatusOrProperty(ev, this.item));

    html.find('.add-formula').click(ev => items.addFormula(ev, this.item));
    html.find('.change-versatile-formula').click(ev => items.changeVersatileFormula(ev, this.item));
    html.find('.remove-formula').click(ev => items.removeFormula(ev, this.item));
    
    if (!this.isEditable) return;
  }

  _prepareWeaponInfo(context) {
    const system = context.system;

    system.rollModifier = this.item.getRollModifier();
    system.damageFormula = this.item.getFormulas("damage");
    system.healingFormula = this.item.getFormulas("healing");
  }
}
