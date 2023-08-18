import fs from 'fs';
import { parse } from 'csv-parse';
import { Database } from '../src/database.js';
import { randomUUID } from 'node:crypto';

const csvPath = new URL('../task.csv', import.meta.url);
const database = new Database();

fs.createReadStream(csvPath).pipe(parse({ delimiter: ",", from_line: 2 })).on("data", (row)=> {
    row.reduce((title, description) => {
        const tasks = {
            id: randomUUID(),
            title,
            description,
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: null
        }
        database.insert('tasks', tasks);
    })
}).on("end", () => {
    console.log("finished");
}).on("error", (err) => {
    console.log(err.message);
});