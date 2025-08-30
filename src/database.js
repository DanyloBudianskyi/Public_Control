import * as SQLite from "expo-sqlite"

export const openDatabase = async () => {
    return await SQLite.openDatabaseAsync('reports.db')
}

export const createTable = async () => {
    const database = await openDatabase()
    try{
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            create table if not exists reports(
                id integer primary key autoincrement,
                description text not null,
                category text not null,
                date text not null,
                time text not null,
                photoUri text not null
            );`
        )
        console.log("Table created")
    }catch(error){
        console.log("Error: ", error)
    }
}

export const insertReport = async (description, category, date, time, photoUri) => {
    if(!description || !category || !date || !time || !photoUri){
        return
    }
    const database = await openDatabase()
    try{
        const result = await database.runAsync(
            `insert into reports (description, category, date, time, photoUri) values (?, ?, ?, ?, ?)`,
            [description,
            category,
            date,
            time,
            photoUri]
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