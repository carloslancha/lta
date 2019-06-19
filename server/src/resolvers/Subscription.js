function newAcademySubscribe(parent, args, context, info) {
	return context.prisma.$subscribe.academy({ mutation_in: ['CREATED'] }).node()
}
  
const newAcademy = {
	subscribe: newAcademySubscribe,
	resolve: payload => {
		return payload
	},
}

module.exports = {
	newAcademy,
}