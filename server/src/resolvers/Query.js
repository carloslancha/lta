const { getById } = require('../utils')

function academy(parent, args, context, info) {
	return context.prisma.academy({id: args.id})
}

function academies(parent, args, context, info) {
	return context.prisma.academies()
}

function arena(parent, args, context, info) {
	return context.prisma.arena({id: args.id})
}

function arenas(parent, args, context, info) {
	return context.prisma.arenas()
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
	
function match(parent, args, context, info) {
	return context.prisma.match({id: args.id})
}
	
function player(parent, args, context, info) {
	return context.prisma.player({id: args.id})
}

function players(parent, args, context, info) {
	return context.prisma.players()
}

function poule(parent, args, context, info) {
	return context.prisma.poule({id: args.id})
}

function poules(parent, args, context, info) {
	return context.prisma.poules()
}

function rank(parent, args, context, info) {
	return context.prisma.rank({id: args.id})
}

function ranks(parent, args, context, info) {
	return context.prisma.ranks()
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
	arena,
	arenas,
	clan,
	clans,
	form,
	forms,
	match,
	player,
	players,
	poule,
	poules,
	rank,
	ranks,
	school,
	schools,
	tournament,
	tournaments,
}