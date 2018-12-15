import { TERRAIN_MAX_HEIGHT, TERRAIN_MIN_HEIGHT } from "./constants";

const placeholders = {
	towns: { placeholder: "%towns%", default: "" },
	industries: { placeholder: "%industries%", default: "" },
	author: { placeholder: "%author%", default: "" },
	steam: { placeholder: "%steam%", default: "" },
	name: { placeholder: "%name%", default: "map" },
	description: { placeholder: "%description%", default: "" },
	seed: { placeholder: "%seed%", default: "" }
};

const maplua = `
local towns = {
${placeholders.towns.placeholder}
}

local industries = {${placeholders.industries.placeholder}}

function data() return {
  authors = {
    {
      name         = '${placeholders.author.placeholder}',
      role         = 'CREATOR',
      steamProfile = '${placeholders.steam.placeholder}'
    },
    {
      name         = 'TransportFeverMapEditor',
      role         = 'GENERATOR',
      steamProfile = ''
    }
  },
  name  = _('${placeholders.name.placeholder}'),
  description = _('${placeholders.description.placeholder}'),
  minGameVersion = '10000',
  range = {${TERRAIN_MIN_HEIGHT}, ${TERRAIN_MAX_HEIGHT} },
  seed = '${placeholders.seed.placeholder}',
  tags  = {'map'},
  towns = towns,
  industries = industries
} end`;

export function create(options) {
	options = options || {};
	let newmap = maplua.replace(/%\w+%/g, function(match) {
		let key = match.replace(/\%/g, "");

		if (placeholders[key]) {
			return options[key] || placeholders[key].default;
		}
		return match;
	});
	return newmap;
}
