"use strict";

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { PrismaClient } = require("@prisma/client");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const jwtVerifier = require("./jwtVerifier");

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const start = function (options) {
  return new Promise(function (resolve, reject) {
    process.on("unhandledRejection", (reason, p) => {
      console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    });

    if (!options.port) {
      reject(new Error("no port specificed"));
    }

    const app = express();

    app.use(function (error, request, response, next) {
      console.log(error);
      reject(new Error("something went wrong" + error));
      response.status(500).send("something went wrong");
    });

    const prisma = new PrismaClient();
    const typeDefs = fs.readFileSync(path.resolve(__dirname, 'prisma/schema.graphql'), 'utf8');

    const resolvers = {
      Query: {
        users(_, { id }) {
          let where = {};
          if (id) {
            where = { id: id };
          }
          return prisma.user.findMany({
            where: { AND: [where, { deleted: null }] },
          });
        },
        async login(_, { email, password }) {
          const user = await prisma.user.findUnique({
            where: { email: email },
          });
          if (!user) {
            throw new Error("No such user found");
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error("Invalid password");
          }
          return user;
        },
        async apartments(_, { id, nBathrooms, nBedrooms }) {
          let where = {};
          if (id) {
            where = { id: id };
          } else if (nBathrooms) {
            where = { nBathrooms: nBathrooms };
          } else if (nBedrooms) {
            where = { nBedrooms: nBedrooms };
          }
          const apartmentsResult = await prisma.apartment.findMany({
            where: { AND: [where, { deleted: null }] },
            include: {
              user: true,
            },
          });
          return apartmentsResult;
        },
        async apartmentsGeoLoc(_, { currLatitude, currLongitude, distanceKm }) {
          const queryStr = `SELECT *,  
            (SQRT(POW(69.1 * (a.latitude -  ${currLatitude}), 2) + POW(69.1 * (${currLongitude} - a.longitude) * COS(a.latitude / 57.3), 2)) * 1.60934) AS distance 
            FROM apartment a 
            WHERE 
            SQRT(POW(69.1 * (a.latitude -  ${currLatitude}), 2) + POW(69.1 * (${currLongitude} - a.longitude) * COS(a.latitude / 57.3), 2))*1.60934 <= ${distanceKm} 
            AND 
            a.deleted IS NULL 
            ORDER BY  
            SQRT(POW(69.1 * (a.latitude -  ${currLatitude}), 2) + POW(69.1 * (${currLongitude} - a.longitude) * COS(a.latitude / 57.3), 2))*1.60934  
            ;`;
          const apartmentsResult = await prisma.$queryRaw(queryStr);

          const replaceMap = {
            user_id: "userId",
            n_bedrooms: "nBedrooms",
            n_bathrooms: "nBathrooms",
            area_m2: "areaM2",
            avail_from: "availableFrom",
          };

          const apartmentsResultObj = replaceKeyInObjectArray(
            apartmentsResult,
            replaceMap
          );
          return apartmentsResultObj;
        },
        /*
        async apartmentsGeoLocJS(_, { currLatitude, currLongitude, distanceKm }) {

          const apartmentsResult = await prisma.apartment.findMany({
            where: { AND: [{distanceKm: distance(currLatitude, currLongitude, latitude, longitude)}, { deleted: null }] },
            include: {
              user: true,
              apartment: true,
            }
          });
          return apartmentsResult;
        },
        */
        async favorites(_, { userId, apartmentId }) {
          let where = {};
          if (userId) {
            where = { userId: userId };
          } else if (apartmentId) {
            where = { apartmentId: apartmentId };
          } 
          const favoritesResult = await prisma.favorite.findMany({
            where: { AND: [where, { deleted: null }] },
            include: {
              user: true,
              apartment: true,
            }
          });
          return favoritesResult;
        }
      },

      Mutation: {
        register(_, { email, firstName, lastName, password }) {
          let hashed = bcrypt.hashSync(password, saltRounds);
          return prisma.user.create({
            data: {
              email: email,
              firstName: firstName,
              lastName: lastName,
              password: hashed,
            }
          });
        },
        createApartment(
          _,
          {
            userId,
            title,
            description,
            city,
            nBedrooms,
            nBathrooms,
            areaM2,
            monthlyRentEUR,
            latitude,
            longitude,
            availableFrom,
          }
        ) {
          return prisma.apartment.create({
            data: {
              userId: userId,
              title: title,
              description: description,
              city: city,
              nBedrooms: nBedrooms,
              nBathrooms: nBathrooms,
              areaM2: areaM2,
              monthlyRentEUR: monthlyRentEUR,
              latitude: latitude,
              longitude: longitude,
              availableFrom: availableFrom,
            },
          });
        },
        async markAsFavorite(_, {userId, apartmentId}){
          const upsFavorite = await prisma.favorite.upsert({
            /* where: { AND:[{userId:userId}, {apartmentId:apartmentId}] }, */

            where:  { userId_apartmentId: {userId:userId, apartmentId:apartmentId}},
            update: { /*updatedAt:Date().toISOString(),*/ deleted:null },
            create: { userId:userId, apartmentId:apartmentId },
          })
          return upsFavorite;
        }
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    app.use(
      "/graphql",
      ensureAuthenticated,
      graphqlHTTP({
        schema: schema,
        graphiql: true
      })
    );

    const server = app.listen(options.port, function () {
      resolve(server);
    });
  });
};

function ensureAuthenticated(request, response, next) {
  return jwtVerifier(request, response, next);
}

const replaceKeyInObjectArray = (a, r) =>
  a.map((o) =>
    Object.keys(o)
      .map((key) => ({ [r[key] || key]: o[key] }))
      .reduce((a, b) => Object.assign({}, a, b))
  );

function distance(lat1, lon1, lat2, lon2, unit = "K") {
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
  }
  else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
  }
}

module.exports = Object.assign({}, { start });
