/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export async function preloadHandlebarsTemplates() {
  return loadTemplates([

    // Actor partials.
    "systems/dc20rpg/templates/actor/parts/actor-header.hbs",
    "systems/dc20rpg/templates/actor/parts/actor-skills.hbs",
    "systems/dc20rpg/templates/actor/parts/actor-features.hbs",
    "systems/dc20rpg/templates/actor/parts/actor-items.hbs",
    "systems/dc20rpg/templates/actor/parts/actor-spells.hbs",
    "systems/dc20rpg/templates/actor/parts/actor-effects.hbs",

    // Item partials.
    "systems/dc20rpg/templates/item/parts/item-description.hbs",
    
    "systems/dc20rpg/templates/item/parts/item-header.hbs",
    "systems/dc20rpg/templates/item/parts/header-parts/item-header-action.hbs",

    "systems/dc20rpg/templates/item/parts/item-action.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-core-roll.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-target.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-hit.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-save.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-skill.hbs",
    "systems/dc20rpg/templates/item/parts/action-parts/item-action-formulas.hbs",

    // Chat partials.
    "systems/dc20rpg/templates/chat/parts/dice-roll.hbs",
    "systems/dc20rpg/templates/chat/parts/check-button.hbs",
    "systems/dc20rpg/templates/chat/parts/save-button.hbs"
  ]);
};
