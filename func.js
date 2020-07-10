"use strict";

const fs = require("fs");

module.exports = {
  statusMsg: function (status) {
    const obj = {
      status,
    };
    return JSON.stringify(obj);
  },
  makeid: (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  checkId: (dbFile, id) => {

    let db = fs.readFileSync("db/" + dbFile + ".json");
    let dbData = JSON.parse(db);

    for (const x in dbData) {
      if (dbData[x] && dbData[x].id === id) {
        return false;
      }
    }
    return true;
  },
  getJson: function (dbFile) {
    try {
      let db = fs.readFileSync("db/" + dbFile + ".json");
      let data = JSON.parse(db);
      return data;
    } catch (err) {
      return false;
    }
    // whatever
  },
  updateDb: function (dbFile, data) {
    try {
      const json = JSON.stringify(data);
      fs.writeFileSync("db/" + dbFile + ".json", json);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  },
  appendJson: function (dbFile, data) {
    try {
      let db = fs.readFileSync("db/" + dbFile + ".json");
      let dbData = JSON.parse(db);
      for (const x in dbData) {
        if ((dbFile === "user")) {
          if (data.user === dbData[x].user) {
            return 400;
          }
        }
      }
      dbData.push(data);
      const json = JSON.stringify(dbData);
      fs.writeFileSync("db/" + dbFile + ".json", json);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  },
};
