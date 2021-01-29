import SQLite from 'react-native-sqlite-storage'

const NAME_DB = '2020087.db'
const LOCATION_DB = 'default'

let APP_DB: SQLite.SQLiteDatabase

// This class has all iterations that the app has with the SQLite database
// All the functions are promises, returning error if it doesn't succeed

// returns the database created, or creates it
const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
    if (!!APP_DB) {
        return APP_DB
    }
    //
    //SQLite.DEBUG(true)
    SQLite.enablePromise(true)

    return new Promise<SQLite.SQLiteDatabase>((resolve, reject) => {
        SQLite.openDatabase({
            name: NAME_DB,
            location: LOCATION_DB
        })
            .then(data => {
                APP_DB = data
                resolve(data)
            })
            .catch(err => {
                console.log('ERROR: > database.ts > getDB')
                console.log(err)
                reject(err)
            })
    })

}

// This function starts the database creating it and also all the tables if they don't exist
export const createTablesDB = async (): Promise<boolean> => {

    const queries: string[] = []
    //
    queries.push('create table if not exists company (' +
        ' id integer primary key, id_api integer, name text, code text unique, code_rdz text, ' +
        ' economic_sector text, subsector text, segment text, created_at real, updated_at real)')
    //
    queries.push('create table if not exists stock (' +
        ' id integer primary key, company_id integer, code text unique, created_at real, updated_at real)')
    //
    queries.push('create table if not exists wallet (' +
        ' id integer primary key, stock_id integer, dateTransaction real, quantity number, ' +
        ' price number, fees number, total number, ' +
        ' created_at real, updated_at real)')
    //
    queries.push('create table if not exists quote (' +
        ' id integer primary key, id_stock integer, code_stock text, open number, close number, ' +
        ' max number, min number, volume number, date real, dividend number, ' +
        ' coefficient number, created_at real, updated_at real)')
    //
    queries.push('create table if not exists watchlist (' +
        ' id integer primary key, id_stock integer, code text, name text, created_at real, updated_at real' +
        ')')
    //
    queries.push('create table if not exists strategy (' +
        ' id integer primary key, name text, description text, created_at real, updated_at real' +
        ')')
    //
    queries.push('create table if not exists recommendation (' +
        ' id integer primary key, id_stock integer, id_strategy integer, ' +
        ' date real, code_stock text, name text, result text, created_at real, updated_at real' +
        ')')
    //
    while (queries.length > 0) {
        const sql = queries.shift()
        //
        if (!!sql)
            await execSql(sql)
    }
    //
    return true
}

// This function drops all the tables from the database
export const dropTablesDB = async (): Promise<boolean> => {

    const queries: string[] = []
    //
    queries.push('drop table if exists company')

    queries.push('drop table if exists stock')

    queries.push('drop table if exists wallet')

    queries.push('drop table if exists watchlist')
    //
    while (queries.length > 0) {
        const sql = queries.shift()
        //
        if (!!sql)
            await execSql(sql)
    }
    //
    return true

}

// This function receives an insert sql and executes it, returning the id of the object inserted
export const insertDB = async (sql: string): Promise<number> => {
    const db = await getDB()

    return new Promise<number>((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(sql, [], (trans, results) => {
                //
                if (results.insertId > 0) {
                    resolve(results.insertId)
                } else {
                    //console.log('> Database.index > insertDB.insertId == 0')
                    resolve(0)
                }
                //
            }, (error) => {
                console.log('> Database.index > insertDB:')
                console.log(error)
                console.log(sql)
                reject(error)
            })
        })
    })
}

// This function receives an insert sql and executes it, returning the id of the object inserted
export const insertOrIgnoreDB = async (sql: string): Promise<number> => {
    const db = await getDB()

    return new Promise<number>((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                //
                if (results.insertId > 0)
                    resolve(results.insertId)
                else
                    resolve(0)
                //
            }, (err) => {
                console.log('> Database.index > insertOrIgnoreDB:')
                console.log(err)
                console.log(sql)
                reject(err)
            })
        })
    })
}

// This function receives a sql command and executes it, returning true if it succeeds
export const execSql = async (sql: string): Promise<SQLite.ResultSet> => {
    const db = await getDB()

    return new Promise<SQLite.ResultSet>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(sql, [], (trans, results) => {
                resolve(results)
                //
            }, (error) => {
                console.log('> Database.index > execSql')
                console.log(error)
                console.log(sql)
                reject(error)
            })

        })
    })
}

// This function receives the name of the table and a where clause and executes the command,
// returning an array with the result of the select
export const selectDB = async (tableName: string, where: string = '') => {
    const db = await getDB()

    const sql = `select * from ${tableName} ${where != '' ? 'where ' + where : ''}`
    //console.log(`sql: ${sql}`)

    return new Promise<Object[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(sql, [], (trans, results) => {
                let objs: Object[] = []
                for (let index = 0; index < results.rows.length; index++)
                    objs.push(results.rows.item(index))
                //
                resolve(objs)
            }, (error) => {
                console.log('> Database.index > select:')
                console.log(error)
                console.log(sql)
                reject(error)
            })
        })
    })
}

// This function receives the name of the table and an ID, returning the specific object
export const selectByIdDB = async (tableName: string, id: number) => {
    const db = await getDB()
    const sql = `select * from ${tableName} where id = ${id}`

    return new Promise<Object>((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(sql, [], (transaction, results) => {
                if (results.rows.length > 0) {
                    resolve(results.rows.item(0))
                } else {
                    resolve([])
                }
            }, (error) => {
                console.log('> Database.index > select:')
                console.log(error)
                console.log(sql)
                reject(error)
            })
        })
    })
}

// This function returns the quantity of rows in a specific table
export const countDB = async (tableName: string, where: string = ''): Promise<number> => {

    const db = await getDB()

    const sql = `select count(*) as total from ${tableName} ${where != '' ? 'where ' + where : ''}`

    return new Promise<number>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(sql, [], (trans, results) => {
                if (results.rows.item(0) && results.rows.item(0)['total']) {
                    resolve(results.rows.item(0)['total'])
                } else {
                    resolve(0)
                }
            }, (error) => {
                console.log('> Database.index > countDB:')
                console.log(error)
                console.log(sql)
                reject(error)
            })
        })
    })
}

// This function runs a custom select command and returns the result
export const CustomSelectDB = async (sql: string) => {
    const db = await getDB()

    //console.log(`CustomSelectDB sql: ${sql}`)

    return new Promise<Object[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(sql, [], (trans, results) => {
                let objs: Object[] = []
                //console.log(results)
                for (let index = 0; index < results.rows.length; index++)
                    objs.push(results.rows.item(index))
                //
                resolve(objs)
            }, (error) => {
                console.log('> Database.index > CustomSelectDB:')
                console.log(error)
                console.log(sql)
                reject(error)
            })
        })
    })
}
