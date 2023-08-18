import { Database } from "./database.js";
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { search } = request.query; 
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null);
            return response.setHeader('Content-type', 'application/json').end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { title, description } = request.body;

            if(!title || !description) {
                return response.writeHead(400).end('Title and description are required');
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: null
            };

            database.insert('tasks', task);
            return response.writeHead(201).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params;
            
            const tasks = database.select('tasks', null);

            if(tasks.filter(task => task.id === id).length === 0) {
                return response.writeHead(404).end('Task not found!');
            }

            database.delete('tasks', id);

            return response.writeHead(204).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params;
            const { title, description } = request.body;
            
            const tasks = database.select('tasks', null);

            if(tasks.filter(task => task.id === id).length === 0) {
                return response.writeHead(404).end('Task not found!');
            }

            database.update('tasks', id, { title, description }, false);

            return response.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params;
            
            const tasks = database.select('tasks', null);

            if(tasks.filter(task => task.id === id).length === 0) {
                return response.writeHead(404).end('Task not found!');
            }

            database.update('tasks', id, null, true);

            return response.writeHead(204).end();
        }
    }
];