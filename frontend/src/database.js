import * as SQLite from "expo-sqlite"

let database = null;

export const openDatabase = async () => {
    if (!database) {
        database = await SQLite.openDatabaseAsync("reports.db");
    }
    return database;
};

export const createTable = async () => {
    const database = await openDatabase()
    try{
        await database.execAsync(`PRAGMA journal_mode = WAL;`)
        await database.execAsync(`
                create table if not exists reports(
                id integer primary key autoincrement,
                description text not null,
                category text not null,
                date text not null,
                time text not null,
                photoUri text not null,
                latitude real,
                longitude real
            );`
        )
        console.log("Table created")
    }catch(error){
        console.log("Error: ", error)
    }
}

export const insertReport = async (description, category, date, time, photoUri, latitude, longitude) => {
    if(!description || !category || !date || !time || !photoUri){
        return
    }
    const database = await openDatabase()
    try{
        const result = await database.runAsync(
            `insert into reports (description, category, date, time, photoUri, latitude, longitude) values (?, ?, ?, ?, ?, ?, ?)`,
            [description,
            category,
            date,
            time,
            photoUri,
            latitude,
            longitude]
        )
        console.log("Inserted report id: ", result.lastInsertRowId)
    }catch(error){
        console.log("Error: ", error)
    }
}

export const fetchReports = async () => {
    const database = await openDatabase()
    try{
        const allRows = await database.getAllAsync(`select * from reports`)
        return allRows
    }catch(error){
        console.log("Error: ", error)
        return []
    }
}

export  const fetchReportsByDate = async (date) => {
    if (!date) {
        return [];
    }
    const database = await openDatabase();
    try {
        return await database.getAllAsync(`select * from reports where date = ?`, [date]);
    } catch (error) {
        return [];
    }
}