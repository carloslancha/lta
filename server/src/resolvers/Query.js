const { getById } = require('../utils')

function academy(parent, args, context, info) {
	return context.prisma.academy({id: args.id})
}

function academies(parent, args, context, info) {
	return context.prisma.academies()
}

function clan(parent, args, context, info) {
	return context.prisma.clan({id: args.id})
}

function clans(parent, args, context, info) {
	return context.prisma.clans()
}

function form(parent, args, context, info) {
	return context.prisma.form({id: args.id})
}

function forms(parent, args, context, info) {
	return context.prisma.forms()
}
	
function player(parent, args, context, info) {
	return context.prisma.player({id: args.id})
}

function players(parent, args, context, info) {
	return context.prisma.players()
}

function school(parent, args, context, info) {
	return context.prisma.school({id: args.id})
}

function schools(parent, args, context, info) {
	return context.prisma.schools()
}

function tournament(parent, args, context, info) {
	return context.prisma.tournament({id: args.id})
}

function tournaments(parent, args, context, info) {
	return context.prisma.tournaments()
}


module.exports = {
	academies,
	academy,
	clan,
	clans,
	form,
	forms,
	player,
	players,
	school,
	schools,
	tournament,
	tournaments,
}