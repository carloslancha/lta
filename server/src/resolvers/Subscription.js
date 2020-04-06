function newAcademySubscribe(parent, args, context, info) {
	return context.prisma.$subscribe.academy({ mutation_in: ['CREATED'] }).node()
}

function arenaUpdatedSuscribe(parent, args, context, info) {
	return context.prisma.$subscribe.arena({ mutation_in: ['UPDATED'] }).node()
}
  
const newAcademy = {
	subscribe: newAcademySubscribe,
	resolve: payload => {
		return payload
	},
}

const arenaUpdated = {
	subscribe: arenaUpdatedSuscribe,
	resolve: payload => {
		return payload
	}
}

module.exports = {
	newAcademy,
	arenaUpdated,
}