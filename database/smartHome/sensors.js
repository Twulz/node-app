let dbUtils = require('../utils/utils');

/* Converts an array of JSON sensor data into values that can be inserted */
function sensorType_JSONtoValueString(data) {

  let values = '';

  for (let i = 0; i < data.length; i++) {
    if (i != 0) values += ",";
    values += "(\"";
    values += data[i].name + "\"";
    values += ")";
  }
  return values;

}

/* Converts an array of JSON sensor data into values that can be inserted */
function sensor_JSONtoValueString(data) {

  let values = '';

  for (let i = 0; i < data.length; i++) {
    if (i != 0) values += ",";
    values += "(\"";
    values += data[i].name + "\",";
    values += data[i].sensor_type_id;
    values += ")";
  }

  return values;

}

module.exports = {

  destroySensorDatabase() {

    let q_dropTableSensorData = 'DROP TABLE IF EXISTS sensor_data;';
    let q_dropTableSensor = 'DROP TABLE IF EXISTS sensor;';
    let q_dropTableSensorType = 'DROP TABLE IF EXISTS sensor_type;';

    return dbUtils.runQuery(q_dropTableSensorData + q_dropTableSensor + q_dropTableSensorType)
      .then(result => {
        console.log('---destroySensorDatabase Drop Success');
        return result;
      })
      .catch(error => new Error(error));

  },

  initSensorDatabase(data) {

    let q_createSensorTypeTable = `
      CREATE TABLE IF NOT EXISTS sensor_type (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      );`;
    let q_createSensorTable = `
      CREATE TABLE IF NOT EXISTS sensor (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        sensor_type_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(id)
      );`;
    let q_createSensorDataTable = `
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INT NOT NULL AUTO_INCREMENT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sensor_id INT NOT NULL,
        value DECIMAL(12,6) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (sensor_id) REFERENCES sensor(id)
      );`;

    let q_insertSensorType = `INSERT INTO sensor_type (name) VALUES `;
    let q_insertSensor = `INSERT INTO sensor (name, sensor_type_id) VALUES `;

    let insertSensorTypeQuery = '';
    let insertSensorQuery = '';

    if (data && data.sensor_type) insertSensorTypeQuery = q_insertSensorType + sensorType_JSONtoValueString(data.sensor_type);
    if (data && data.sensor) insertSensorQuery = q_insertSensor + sensor_JSONtoValueString(data.sensor);

    return dbUtils.runQuery(q_createSensorTypeTable + q_createSensorTable + q_createSensorDataTable)
      .then(result => {
        console.log('---initSensorDatabase Create Success');
        return (data && data.sensor_type) ? dbUtils.runQuery(insertSensorTypeQuery) : result;
      })
      .then(result => {
        console.log('---initSensorDatabase Insert Sensor Type Success');
        return (data && data.sensor) ? dbUtils.runQuery(insertSensorQuery) : result;
      })
      .then(result => {
        console.log('---initSensorDatabase Insert Sensor Success');
        return result;
      })
      .catch((error) => new Error(error));

  },

  insertSensorType(name) {

    let query = `INSERT INTO sensor_type (name) VALUES('` + name + `');`;

    return dbUtils.runQuery(query)
      .then(() => 'Success')
      .catch(error => new Error(error));

  },

  insertSensor(name, sensor_type_id) {

    let query = `INSERT INTO sensor (name, sensor_type_id) VALUES('` + name + `', ` + sensor_type_id + `);`;

    return dbUtils.runQuery(query)
      .then(() => 'Success')
      .catch(error => new Error(error));

  },

  insertSensorData(sensor_id, value) {

    let query = `INSERT INTO sensor_data (sensor_id, value) VALUES (` + sensor_id + ',' + value + ');';

    return dbUtils.runQuery(query)
      .then(() => 'Success')
      .catch(error => new Error(error));

  },

}