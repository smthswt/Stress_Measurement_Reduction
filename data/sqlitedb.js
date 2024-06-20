// import SQLite from 'react-native-sqlite-storage';
//
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
//
// const database_name = "LoginDB.db";
// const database_version = "1.0";
// const database_displayname = "SQLite Login Database";
// const database_size = 200000;
//
// export const getDBConnection = async () => {
//     return SQLite.openDatabase(
//         database_name,
//         database_version,
//         database_displayname,
//         database_size
//     );
// };
//
// export const createTable = async (db) => {
//     const query = `CREATE TABLE IF NOT EXISTS Users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT NOT NULL,
//       password TEXT NOT NULL
//   );`;
//
//     await db.executeSql(query);
// };
//
// export const saveUserCredentials = async (db, username, password) => {
//     const query = `INSERT INTO Users (username, password) VALUES (?, ?);`;
//     await db.executeSql(query, [username, password]);
// };
//
// export const getUserCredentials = async (db) => {
//     const query = `SELECT username, password FROM Users LIMIT 1;`;
//     const results = await db.executeSql(query);
//
//     if (results[0].rows.length > 0) {
//         const row = results[0].rows.item(0);
//         return { username: row.username, password: row.password };
//     }
//
//     return null;
// };
//
// export const deleteUserCredentials = async (db) => {
//     const query = `DELETE FROM Users;`;
//     await db.executeSql(query);
// };
