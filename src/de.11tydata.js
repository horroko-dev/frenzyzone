module.exports = {
  locale: "de",
  eleventyComputed: {
    synergy: (data) => data.de_synergy,
    farming: (data) => data.de_farming,
    leveling: (data) => data.de_leveling,
    gear: (data) => data.de_gear,
    attributes: (data) => data.de_attributes,
    mercs: (data) => data.de_mercs,
    charms: (data) => data.de_charms,
    tips: (data) => data.de_tips,
  },
};
