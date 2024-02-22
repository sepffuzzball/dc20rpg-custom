import { runHealthThresholdsCheck } from "./resources.mjs";

export async function getSelectedTokens() {
  if (canvas.activeLayer === canvas.tokens) return canvas.activeLayer.placeables.filter(p => p.controlled === true);
}

export function updateActorHp(actor, updateData) {
  if (updateData.system && updateData.system.resources && updateData.system.resources.health) {
    const newHealth = updateData.system.resources.health;
    const actorsHealth = actor.system.resources.health;
    const maxHp = actorsHealth.max;
    const currentHp = actorsHealth.current;
    const tempHp = actorsHealth.temp || 0;

    // When value (temporary + current hp) was changed
    if (newHealth.value !== undefined) {
      const newValue = newHealth.value;
      const oldValue = actorsHealth.value;
  
      if (newValue >= oldValue) {
        const newCurrentHp = Math.min(newValue - tempHp, maxHp);
        const newTempHp = newValue - newCurrentHp > 0 ? newValue - newCurrentHp : null;
        newHealth.current = newCurrentHp;
        newHealth.temp = newTempHp;
        newHealth.value = newCurrentHp + newTempHp;
      }
  
      else {
        const valueDif = oldValue - newValue;
        const remainingTempHp = tempHp - valueDif;
        if (remainingTempHp <= 0) { // It is a negative value we want to subtract from currentHp
          newHealth.temp = null;
          newHealth.current = currentHp + remainingTempHp; 
          newHealth.value = currentHp + remainingTempHp;
        }
        else {
          newHealth.temp = remainingTempHp;
          newHealth.value = currentHp + remainingTempHp;
        }
      }
    }

    // When only temporary HP was changed
    else if (newHealth.temp !== undefined) {
      newHealth.value = newHealth.temp + currentHp;
    }

    // When only current HP was changed
    else if (newHealth.current !== undefined) {
      newHealth.current = newHealth.current >= maxHp ? maxHp : newHealth.current;
      newHealth.value = newHealth.current + tempHp;
    }

    if (newHealth.current !== undefined) {
      const tresholdData = runHealthThresholdsCheck(currentHp, newHealth.current, maxHp, actor);
      foundry.utils.mergeObject(updateData, tresholdData)
    }
    updateData.system.resources.health = newHealth;
  }
  return updateData;
}

/**
 * Called when new actor is being created, makes simple pre-configuration on actor's prototype token depending on its type.
 */
export function preConfigurePrototype(actor) {
  const prototypeToken = actor.prototypeToken;
  prototypeToken.displayBars = 20;
  prototypeToken.displayName = 20;
  if (actor.type === "character") {
    prototypeToken.actorLink = true;
    prototypeToken.disposition = 1;
  }
  actor.update({['prototypeToken'] : prototypeToken});
}