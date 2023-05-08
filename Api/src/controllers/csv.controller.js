import { pool } from "../db/db.js";
import fs from "fs";
import csv from "csv-parser";

export const getCSVData = async (file, isSelfRepeated, res) => {
  //console.log(file);
  const dataWithoutDuplicate = new Set();
  const mapName = new Map();
  const mapEmail = new Map();
  const mapTelefono = new Map();
  const dataJsonToSend = []; // Contains data file like name, email, telefono using JSON format
  let dataFinalToSend = {}; //Contains datafile + cont of repeated rows 
  let repeatNumberCounted = 0;

  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (data) => {
      dataWithoutDuplicate.add(JSON.stringify(data)); //Removing duplicates
    })
    .on("end", async () => {
      let repeated = "nonRepeatedRow";
      let validPhone = "correctPhone";
      let validEmail = "correctEmail";
      
      if(dataWithoutDuplicate.size<=0){
        res.send({error:"Archivo vacio"});
        return;
      }
      const [[[id_new_csv]]] = await pool.query(
        `call sp_create_new_svc()`
      );
      //console.log("RESULT:", id_new_csv.ID)
      for (const jsonString of dataWithoutDuplicate) {
        let name = JSON.parse(jsonString).Nombre;
        let email = JSON.parse(jsonString)["Correo Electronico"];
        let telefono = JSON.parse(jsonString).Telefono;

        if(name === undefined || email === undefined || telefono === undefined){
          res.send({error:"El archivo debe contener el formato de: Nombre, correo electronico y teléfono"});
          return;
        }

        validEmail = validateEmail(email);
        validPhone = validatePhone(telefono);

        if (
          mapName.get(name) || mapEmail.get(email) || mapTelefono.get(telefono)
        ) {
          repeated = "RepeatedRow";
          repeatNumberCounted++;
        }
        let JsonData = {
          nombre:name,
          correo:email,
          telefono,
          validEmail,
          validPhone,
          repeated
        };
        repeated = "nonRepeatedRow";
        dataJsonToSend.push(JsonData);
        mapName.set(name, (mapName.get(name) || 0) + 1);
        mapEmail.set(email, (mapEmail.get(email) || 0) + 1);
        mapTelefono.set(telefono, (mapTelefono.get(telefono) || 0) + 1);

        //Adding files to new csv BD
        const [resultSet] = await pool.query(
          `call sp_insert_new_persons_csv(${id_new_csv.ID}, "${name}", "${email}", "${telefono}")`
        );
      }

      if (isSelfRepeated)
        repeatNumberCounted = contDataSelfRepeated(mapName, mapEmail, mapTelefono);
      
      dataFinalToSend={
        dataCSV:dataJsonToSend,
        peopleCounter:dataWithoutDuplicate.size,
        repeatPeople:repeatNumberCounted
      }
      console.log(dataFinalToSend)
      res.send(dataFinalToSend);      
    });
  
};

function contDataSelfRepeated(mapName, mapEmail, mapTelefono) {
  let newcont = 0;
  
  for (let valueMap of mapName.values()) {    
    if (valueMap != 1) {
      newcont += valueMap;
    }
  }
  for (let valueMap of mapEmail.values()) {
    if (valueMap != 1) {
      newcont += valueMap;
    }
  }
  for (let valueMap of mapTelefono.values()) {    
    if (valueMap != 1) {
      newcont += valueMap;
    }
  }
  return newcont;
}
function validateEmail(email) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) return "incorrectEmail";
  if (email.length > 70) return "incorrectEmail";

  if (!mailformat.test(email)) {
    return "incorrectEmail";
  }
  return "correctEmail";
}
function validatePhone(phone) {
  if (phone.length != 10) {
    return "incorrectPhone";
  }
  return "correctPhone";
}
