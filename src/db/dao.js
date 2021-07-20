const sqlite3 = window.require('sqlite3');
const Promise = window.require('bluebird');
const remote = window.require('electron').remote;   
const ipc = window.require('electron').ipcRenderer;  
class AppDAO {
    constructor() {
        this.db = new sqlite3.Database(remote.getGlobal('PATH_DB').value, (err) => {
            if (err) {
              ipc.send('dialog-error', 'Could not connect to database.');
            }
        });
    }
 
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            })
        })
    }
 
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
 
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }
}
 
export default AppDAO;