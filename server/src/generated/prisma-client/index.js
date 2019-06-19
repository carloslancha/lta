"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Academy",
    embedded: false
  },
  {
    name: "Clan",
    embedded: false
  },
  {
    name: "Form",
    embedded: false
  },
  {
    name: "Player",
    embedded: false
  },
  {
    name: "School",
    embedded: false
  },
  {
    name: "Tournament",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/carlos-lancha-d5132f/test1/dev`
});
exports.prisma = new exports.Prisma();
