require('dotenv').config();
const {MongoClient, ObjectId} = require("mongodb");
const Excel = require("exceljs");
const moment = require("moment");
const {getFieldsInCollection, getModel, getFieldArrayInCollection} = require("../utils/ModelFields");
const {isDate, chunk, isArray} = require("lodash");
const url = process.env.DATABASE_URI
const xlsx = require('node-xlsx');
const {handlerResERROR, handlerResSUCCESS} = require("../utils");
const {isValidObjectId} = require("mongoose");


const insertToCollection = async (name, data) => {
  const Modal = getModel(name);
  if (!Modal) return null
  const fieldIsArray = getFieldArrayInCollection(name)
  const proZero = data.splice(0, 1)
  const properties = proZero[0];
  const chuckItems = chunk(data, 200);
  return Promise.all(chuckItems.map(items => {
    return Promise.all(items.map(async item => {
      try {
        if (!item?.length) return null;
        const newData = {}
        const dataErr = properties.map((nameField, idx) => {
          try {
            if (fieldIsArray.includes(nameField)) {
              if (nameField === 'acast')
                newData[`${nameField}`] = JSON.parse(item[idx])
              else
                newData[`${nameField}`] = item[idx] ? JSON.parse(item[idx]) : []
            } else newData[`${nameField}`] = item[idx]
          } catch (e) {
            return {nameField, idx, item, Modal}
          }
        })
        // if (dataErr.filter(x => x).length) console.log(dataErr);
        if (name === 'recipes') {
          newData.tags = [...newData.tags].filter(x => x).map(e => ObjectId(e))
        }

        let update
        if (item[0]) update = await Modal.findOneAndUpdate({_id: item[0]}, {$set: newData})
        if (!item[0] || !update) {
          const newDoc = new Modal(newData);
          await newDoc.save()
        }
        return null
      } catch (e) {
        console.log(e)
        return {messages: "ERROR: collection => " + name + " => " + e.message}
      }
    }))
  }))
}

const importDatabase = async (req, res) => {
  try {
    const dataSheets = xlsx.parse(`import_export_database/import-database-${moment().format('YYYY-MM-DD_hh.mm')}`);
    const errors = await Promise.all(dataSheets.map(async (data, index) => {
      return insertToCollection(data.name, data.data)
    }))
    const dataError = errors?.flat()?.flat()?.filter(e => e);
    if (dataError?.length) return res.status(400).send(handlerResERROR({
      message: "Import error!",
      data: [...dataError].map(e => JSON.stringify(e)),
      code: "E_REQUEST"
    }));
    return res.status(200).send(handlerResSUCCESS({message: "Import successful !"}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Import error!", code: "E_REQUEST"}));
  }
}

const exportDatabase = async (req, res) => {
  try {
    const fileNameExcel = `import_export_database/backup-export-${moment().format('DD-MM-YYYYThh.mm.ss')}.xlsx`
    MongoClient.connect(url, async function (err, dbClient) {
      if (err) throw err;
      const db = dbClient.db(process.env.DATABASE_NAME);
      const collectionsName = (await db.collections()).map(col => col.namespace.split('.')[1])
      const colsNameExport = req?.body?.collections || []
      let workbook = new Excel.Workbook()
      await Promise.all(collectionsName.map(async (colName) => {
        if(colsNameExport?.length && !colsNameExport.includes(colName)) return
        let workSheet = workbook.addWorksheet(colName)
        const cols = [...getFieldsInCollection(colName)]
        cols.unshift('_id')

        workSheet.columns = cols.map((name) => ({key: name, type: 'string', width: 32}))
        const headers = {}
        cols.map((name) => {
          headers[`${name}`] = name;
        })
        workSheet.addRow(headers)
        const dataCollection = await db.collection(colName).find({}).toArray()
        dataCollection.forEach((doc => {
          const data = {};
          cols.forEach((name) => {
            if (isDate(doc[`${name}`])) data[`${name}`] = moment(doc[`${name}`]).format();
            else if (name === 'acast' || isArray(doc[`${name}`])) data[`${name}`] = JSON.stringify(doc[`${name}`])
            else if (name === "_id" || isValidObjectId(doc[`${name}`])) data[`${name}`] = doc[`${name}`]?.toString()
            else
              data[`${name}`] = doc[`${name}`];
          })
          workSheet.addRow(data)
        }))
        return {
          name: colName, data: dataCollection
        }
      }))
      await workbook.xlsx.writeFile(fileNameExcel)
      await dbClient.close();
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=" + fileNameExcel);
      res.download(fileNameExcel)
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Export error!", code: "E_REQUEST"}));
  }
}
const getCollections = async (req, res) => {
  try {
    MongoClient.connect(url, async function (err, dbClient) {
      if (err) throw err;
      const db = dbClient.db(process.env.DATABASE_NAME);
      const collectionsName = (await db.collections()).map(col => col.namespace.split('.')[1])
      await dbClient.close()
      return res.status(200).send(handlerResSUCCESS({data: collectionsName}))
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Get collection!", code: "E_REQUEST"}));
  }
}
module.exports = {
  importDatabase,
  exportDatabase,
  getCollections
}
