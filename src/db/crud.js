class Crud {
  constructor(dao) {
      this.dao = dao
  }

  createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS reminder (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        title               VARCHAR(250) NOT NULL,
        message_notification VARCHAR(250) NOT NULL,
        startAt             DATE NOT NULL,
        endAt               DATE NOT NULL, 
        timeStartAt         TIME NOT NULL,
        timeEndAt           TIME NOT NULL,
        interval            TIME NOT NULL,
        allDays             BOLLEAN default false,
        checkBoxMon         BOLLEAN default false,
        checkBoxTue         BOLLEAN default false,
        checkBoxWed         BOLLEAN default false,
        checkBoxThu         BOLLEAN default false,
        checkBoxFri         BOLLEAN default false,
        checkBoxSat         BOLLEAN default false,
        checkBoxSun         BOLLEAN default false
      )`
      return this.dao.run(sql);
  }

  insert(reminder) {
    let paramString = "?";
    delete reminder.disableCheckBox;
    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    //console.log('insert into reminder VALUES ('+paramString+')', Object.values(reminder));
    
    return this.dao.run('insert into reminder VALUES (null,'+paramString+')', Object.values(reminder));
  }

  delete(id) {
      return this.dao.run(
          `DELETE FROM reminder WHERE id = ?`,
          [id]
      );
  }

  getAll() {
      return this.dao.all(`SELECT * FROM reminder`);
  }

  getWhere(where) {
    return this.dao.run(
      `SELECT FROM reminder WHERE = ?`,
      [where]
  );
  }
}

export default Crud;