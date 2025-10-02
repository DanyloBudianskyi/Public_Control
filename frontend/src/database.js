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
                photoBase64 text not null,
                synced integer default 0,
                latitude real,
                longitude real
            );`
        )
        console.log("Table created")
    }catch(error){
        console.log("Error: ", error)
    }
}

export const insertReport = async (description, category, photoBase64, latitude, longitude) => {
    if(!description || !category || !photoBase64){
        return
    }
    const database = await openDatabase()
    try{
        const result = await database.runAsync(
            `insert into reports (description, category, photoBase64, synced ,latitude, longitude) values (?, ?, ?, 0, ?, ?)`,
            [description,
            category,
            photoBase64,
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

export const fetchUnsyncedReports = async () => {
    const db = await openDatabase();
    try {
        const rows = await db.getAllAsync(`SELECT * FROM reports WHERE synced = 0`);
        return rows;
    } catch (error) {
        console.log("Error fetching unsynced reports:", error);
        return [];
    }
};

export const markReportAsSynced = async (id) => {
    const db = await openDatabase();
    try {
        await db.runAsync(`UPDATE reports SET synced = 1 WHERE id = ?`, [id]);
        console.log("Report marked as synced:", id);
    } catch (error) {
        console.log("Error marking report as synced:", error);
    }
};