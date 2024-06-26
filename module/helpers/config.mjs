export const DC20RPG = {};

/***********************/
/****  TRANSLATION  ****/
/***********************/

DC20RPG.trnAttributes  = {
  "mig": "DC20RPG.AttributeMig",
  "agi": "DC20RPG.AttributeAgi",
  "int": "DC20RPG.AttributeInt",
  "cha": "DC20RPG.AttributeCha"
};

DC20RPG.trnSkills = {
  "awa": "DC20RPG.SkillAwa",

  "ath": "DC20RPG.SkillAth",
  "inm": "DC20RPG.SkillInm",

  "acr": "DC20RPG.SkillAcr",
  "tri": "DC20RPG.SkillTri",
  "ste": "DC20RPG.SkillSte",

  "inv": "DC20RPG.SkillInv",
  "med": "DC20RPG.SkillMed",
  "sur": "DC20RPG.SkillSur",

  "ani": "DC20RPG.SkillAni",
  "ins": "DC20RPG.SkillIns",
  "inf": "DC20RPG.SkillInf",

  "nat": "DC20RPG.SkillNat",
  "his": "DC20RPG.SkillHis",
  "arc": "DC20RPG.SkillArc",
  "rel": "DC20RPG.SkillRel",
  "occ": "DC20RPG.SkillOcc",

  "alc": "DC20RPG.SkillAlc",
  "bla": "DC20RPG.SkillBla",
  "bre": "DC20RPG.SkillBre",
  "cap": "DC20RPG.SkillCap",
  "car": "DC20RPG.SkillCar",
  "coo": "DC20RPG.SkillCoo",
  "cry": "DC20RPG.SkillCry",
  "dis": "DC20RPG.SkillDis",
  "gam": "DC20RPG.SkillGam",
  "gla": "DC20RPG.SkillGla",
  "her": "DC20RPG.SkillHer",
  "ill": "DC20RPG.SkillIll",
  "jew": "DC20RPG.SkillJew",
  "loc": "DC20RPG.SkillLoc",
  "lea": "DC20RPG.SkillLea",
  "mas": "DC20RPG.SkillMas",
  "mus": "DC20RPG.SkillMus",
  "scu": "DC20RPG.SkillScu",
  "the": "DC20RPG.SkillThe",
  "tin": "DC20RPG.SkillTin",
  "wea": "DC20RPG.SkillWea",
  "veh": "DC20RPG.SkillVeh"
};

DC20RPG.trnLanguages = {
  "com": "DC20RPG.LangCom",
  "hum": "DC20RPG.LangHum",
  "dwa": "DC20RPG.LangDwa",
  "elv": "DC20RPG.LangElv",
  "gno": "DC20RPG.LangGno",
  "hal": "DC20RPG.LangHal",
  "gia": "DC20RPG.LangGia",
  "dra": "DC20RPG.LangDra",
  "orc": "DC20RPG.LangOrc",
  "fey": "DC20RPG.LangFey",
  "ele": "DC20RPG.LangEle",
  "cel": "DC20RPG.LangCel",
  "fie": "DC20RPG.LangFie",
  "dee": "DC20RPG.LangDee"
}

DC20RPG.trnReductions = {
    "corrosion": "DC20RPG.Corrosion",
    "cold": "DC20RPG.Cold",
    "fire": "DC20RPG.Fire",
    "radiant": "DC20RPG.Radiant",
    "lightning": "DC20RPG.Lightning",
    "poison": "DC20RPG.Poison",
    "psychic": "DC20RPG.Psychic",
    "sonic": "DC20RPG.Sonic",
    "umbral": "DC20RPG.Umbral",
    "piercing": "DC20RPG.Piercing",
    "slashing": "DC20RPG.Slashing",
    "bludgeoning": "DC20RPG.Bludgeoning",
    "true": "DC20RPG.True"
}



/*************************/
/****  CONFIGURATION  ****/
/*************************/

DC20RPG.combatMastryLevels = {
  "novice": "Novice",
  "trained": "Trained",
  "expert": "Expert",
  "master": "Master",
  "grandmaster": "Grandmaster"
};

DC20RPG.attributes = {
  "mig": "Might",
  "agi": "Agility",
  "int": "Inteligence",
  "cha": "Charisma"
};

DC20RPG.attributesWithPrime = {
  "prime": "Prime",
  ...DC20RPG.attributes
}

DC20RPG.saveTypes = {
  "phy": "Physical",
  "men": "Mental",
  ...DC20RPG.attributes
}

DC20RPG.dcCalculationTypes = {
  "spell": "Spellcasting",
  "martial": "Martial",
  "flat": "Flat",
  ...DC20RPG.attributes
}

DC20RPG.skills = {
  "awa": "Awareness",

  "ath": "Athletics",
  "inm": "Intimidation",

  "acr": "Acrobatics",
  "tri": "Trickery",
  "ste": "Stealth",

  "inv": "Investigation",
  "med": "Medicine",
  "sur": "Survival",

  "ani": "Animal",
  "ins": "Insight",
  "inf": "Influence",

  "nat": "Nature",
  "his": "History",
  "arc": "Arcana",
  "rel": "Religion",
  "occ": "Occultism"
}

DC20RPG.tradeSkills = {
  "alc": "Alchemy",
  "bla": "Blacksmithing",
  "bre": "Brewing",
  "cap": "Carpentry",
  "car": "Carving",
  "coo": "Cooking",
  "dis": "Disguise",
  "dra": "Drawing/Painting",
  "enc": "Encription/Encoding",
  "for": "Forgery",
  "gam": "Gaming Kit",
  "gla": "Glassblower",
  "hea": "Healer Kit",
  "her": "Herbalism",
  "jew": "Jeweler",
  "lea": "Leatherworker/Tailor",
  "loc": "Lockpicking",
  "mas": "Masonry",
  "mus": "Musician",
  "nav": "Navigation/Cartography",
  "per": "Performance",
  "pil": "Piloting",
  "poi": "Poisons",
  "pot": "Pottery",
  "scu": "Sculpting",
  "tin": "Tinkering"
}

DC20RPG.checks = {
  "att": "Attack Check",
  "spe": "Spell Check",
  "mar": "Martial Check",

  "awa": "Awareness Check",

  "ath": "Athletics Check",
  "inm": "Intimidation Check",

  "acr": "Acrobatics Check",
  "tri": "Trickery Check",
  "ste": "Stealth Check",

  "inv": "Investigation Check",
  "med": "Medicine Check",
  "sur": "Survival Check",

  "ani": "Animal Check",
  "ins": "Insight Check",
  "inf": "Influence Check",

  "nat": "Nature Check",
  "his": "History Check",
  "arc": "Arcana Check",
  "rel": "Religion Check",
  "occ": "Occultism Check"
}

DC20RPG.contests = {
  "phy": "Physical Save",
  "men": "Mental Save",
  "mig": "Might Save",
  "agi": "Agility Save",
  "int": "Inteligence Save",
  "cha": "Charisma Save",
  ...DC20RPG.checks
}

DC20RPG.sizes = {
  "tiny": "Tiny",
  "small": "Small",
  "medium": "Medium",
  "large": "Large",
  "huge": "Huge",
  "gargantuan": "Gargantuan"
}

DC20RPG.weaponCategories = {
  "axe": "Axe",
  "bow": "Bow",
  "chained": "Chained",
  "crossbow": "Crossbow",
  "hammer": "Hammer",
  "pick": "Pick",
  "spear": "Spear",
  "special": "Special",
  "staff": "Staff",
  "sword": "Sword",
  "fist": "Fist",
  "whip": "Whip"
}

DC20RPG.rarities = {
  "common": "Common",
  "uncommon": "Uncommon",
  "rare": "Rare",
  "veryRare": "Very Rare",
  "legendary": "Legendary"
}

DC20RPG.weaponTypes = {
  "light": "Light Weapon",
  "heavy": "Heavy Weapon"
}

DC20RPG.equipmentTypes = {
  "light": "Light Armor",
  "heavy": "Heavy Armor",
  "lshield": "Light Shield",
  "hshield": "Heavy Shield",
  "clothing": "Clothing",
  "trinket": "Trinket"
}

DC20RPG.consumableTypes = {
  "ammunition": "Ammunition",
  "food": "Food",
  "poison": "Poison",
  "potion": "Potion",
  "ammunition": "Ammunition",
  "rod": "Rod",
  "scroll": "Scroll",
  "wand": "Wand",
  "trinket": "Trinket"
}

DC20RPG.featureSourceTypes = {
  "class": "Class",
  "subclass": "Subclass",
  "talent": "Talent",
  "ancestry": "Ancestry",
  "background": "Background",
  "monster": "Monster Feature",
  "other": "Other"
}

DC20RPG.techniqueTypes = {
  "maneuver": "Maneuver",
  "technique": "Technique"
}

DC20RPG.spellTypes = {
  "cantrip": "Cantrip",
  "spell": "Spell",
  "ritual": "Ritual"
}

DC20RPG.spellLists = {
  "arcane": "Arcane",
  "divine": "Divine",
  "primal": "Primal"
}

DC20RPG.magicSchools = {
  "astromancy": "Astromancy",
  "chronomancy": "Chronomancy",
  "conjuration": "Conjuration",
  "destruction": "Destruction",
  "divination": "Divination",
  "enchantment": "Enchantment",
  "illusion": "Illusion",
  "necromancy": "Necromancy",
  "protection": "Protection",
  "restoration": "Restoration",
  "transmutation": "Transmutation"
}

DC20RPG.components = {
  "verbal": "Verbal",
  "somatic": "Somatic",
  "material": "Material"
}

DC20RPG.spellTags = {
  "fire": "Fire",
  "water": "Water",
  "gravity": "Gravity"
}

DC20RPG.invidualTargets = {
  "self": "Self",
  "ally": "Ally",
  "enemy": "Enemy",
  "creature": "Creature",
  "object": "Object",
  "space": "Space"
}

DC20RPG.areaTypes = {
  "arc": "Arc",
  "aura": "Aura",
  "cone": "Cone",
  "cube": "Cube",
  "cylinder": "Cylinder",
  "line": "Line",
  "radius": "Radius",
  "sphere": "Sphere",
  "wall": "Wall",
}

DC20RPG.durations = {
  "instantaneous": "Instantaneous",
  "continuous": "Continuous",
  "concentration": "Concentration"
}

DC20RPG.attackTypes = {
  "attack": "Attack",
  "spell": "Spell"
}

DC20RPG.timeUnits = {
  "turns": "Turns",
  "rounds": "Rounds",
  "minutes": "Minutes",
  "hours": "Hours",
  "days": "Days",
  "months": "Months",
  "years": "Years",
  "permanent": "Permanent",
  "untilCanceled": "Until Canceled"
}

DC20RPG.restTypes = {
  "quick": "Quick Rest",
  "short": "Short Rest",
  "long": "Long Rest",
  "full": "Full Rest"
}

DC20RPG.resetTypes = {
  ...DC20RPG.restTypes,
  "round": "Round End",
  "combat": "Combat End",
}

DC20RPG.chargesResets = {
  ...DC20RPG.resetTypes,
  "day": "Daily",
  "charges": "Charges"
}

DC20RPG.actionTypes = {
  "dynamic": "Dynamic Attack Save",
  "attack": "Attack",
  "check": "Check",
  "save": "Save",
  "contest": "Contest",
  "other": "Other"
}

DC20RPG.damageTypes = {
  "corrosion": "Corrosion",
  "bludgeoning": "Bludgeoning",
  "cold": "Cold",
  "fire": "Fire",
  "radiant": "Radiant",
  "lightning": "Lightning",
  "piercing": "Piercing",
  "poison": "Poison",
  "psychic": "Psychic",
  "slashing": "Slashing",
  "sonic": "Sonic",
  "umbral": "Umbral",
  "true": "True"
}

DC20RPG.healingTypes = {
  "heal": "Health",
  "temporary": "Temporary",
  "max": "Max Health"
}

DC20RPG.currencyTypes = {
  "pp": "PP",
  "gp": "GP",
  "sp": "SP",
  "cp": "CP"
}

DC20RPG.properties = {
  "agiDis": "Agi Check DisADV",
  "ammo": "Ammunition",
  "attunement": "Attunement",
  "concealable": "Concealable",
  "finesee": "Finesee",
  "focus": "Focus",
  "reach": "Reach",
  "requirement": "Requirement",
  "reload": "Reload",
  "special": "Special",
  "thrown": "Thrown",
  "twoHanded": "Two Handed",
  "versatile": "Versatile",
  "speedPenalty": "Speed Penalty",
  "sturdy": "Sturdy",
  "maxAgiLimit": "Max Agility Limit",
  "damageReduction": "Damage Reduction",
  "dense": "Dense",
  "mobile": "Mobile",
  "impact": "Impact",
  "threatening": "Threatening",
  "reinforced": "Reinforced",
  "mounted": "Mounted",
  "unwieldy": "Unwieldy"
}

DC20RPG.inventoryTypes = {
  "weapon": "Weapon",
  "equipment": "Equipment",
  "consumable": "Consumable",
  "tool": "Tool",
  "loot": "Loot"
}

DC20RPG.spellsTypes = {
  "spell": "Spell"
}

DC20RPG.techniquesTypes = {
  "technique": "Technique"
}

DC20RPG.featuresTypes = {
  "feature": "Feature"
}

DC20RPG.allItemTypes = {
  ...DC20RPG.inventoryTypes,
  ...DC20RPG.spellsTypes,
  ...DC20RPG.techniquesTypes,
  ...DC20RPG.featuresTypes,
  "class": "Class",
  "subclass": "Subclass",
  "ancestry": "Ancestry",
  "background": "Background"
}

DC20RPG.physicalDefenceFormulasLabels = {
  "standard": "Standard",
  "berserker": "Berserker Defense",
  "patient": "Patient Defense",
  "custom": "Custom Formula",
  "flat": "Flat",
  "standardMaxAgi": "Max Agility Limit"
}

DC20RPG.physicalDefenceFormulas = {
  "standard": "8 + @combatMastery + @agi + @defences.physical.armorBonus",
  "berserker": "8 + @combatMastery + max(@mig, @agi) + 2",
  "patient": "8 + @combatMastery + @agi + 2",
  "standardMaxAgi": "8 + @combatMastery + min(@agi, (@prime - 2)) + @defences.physical.armorBonus",
}

DC20RPG.mysticalDefenceFormulasLabels = {
  "standard": "Standard Formula",
  "custom": "Custom Formula",
  "patient": "Patient Defense",
  "flat": "Flat"
}

DC20RPG.mysticalDefenceFormulas = {
  "standard": "8 + @combatMastery + @int + @cha",
  "patient": "8 + @combatMastery + @int + @cha + 2"
}

DC20RPG.masteries = {
  "lightWeapon": "Light Weapon",
  "heavyWeapon": "Heavy Weapon",
  "lightShield": "Light Shield",
  "heavyShield": "Heavy Shield",
  "lightArmor": "Light Armor",
  "heavyArmor": "Heavy Armor",
  "spellcasting": "Spellcasting"
}

DC20RPG.defences = {
  "mystical": "Mystical",
  "physical": "Physical"
}

DC20RPG.conditions = {
  "charmed": "Charmed",
  "burning": "Burning",
  "bleeding": "Bleeding",
  "poisoned": "Poisoned",
  "taunted": "Taunted",
  "deafened": "Deafened",
  "blinded": "Blinded",
  "intimidated": "Intimidated",
  "rattled": "Rattled",
  "frightened": "Frightened",
  "slowed": "Slowed",
  "grapple": "Grapple",
  "exposed": "Exposed",
  "hindered": "Hindered",
  "restrained": "Restrained",
  "prone": "Prone",
  "incapacitated": "Incapacitated",
  "stunned": "Stunned",
  "paralyzed": "Paralyzed",
  "unconscious": "Unconscious",
  "petrified": "Petrified",
  "surprised": "Surprised",
  "doomed": "Doomed",
  "exhaustion": "Exhaustion",
  "impared": "Impared",
  "dazed": "Dazed"
}