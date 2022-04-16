  /* eslint no-console: ["error", { allow: ["info", "error"] }] */
class DataBaseInitializer {
  constructor(dao) {
      this.dao = dao
  }

  createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS reminder (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        title                VARCHAR(250) NOT NULL,
        message_notification VARCHAR(250) NOT NULL,
        startAt              DATE NOT NULL,
        endAt                DATE NOT NULL, 
        timeStartAt          TIME NOT NULL,
        timeEndAt            TIME NOT NULL,
        interval             TIME NOT NULL,
        allDays              BOLLEAN default false,
        checkBoxMon          BOLLEAN default false,
        checkBoxTue          BOLLEAN default false,
        checkBoxWed          BOLLEAN default false,
        checkBoxThu          BOLLEAN default false,
        checkBoxFri          BOLLEAN default false,
        checkBoxSat          BOLLEAN default false,
        checkBoxSun          BOLLEAN default false
      );
      `;

      const sql2 = `
      CREATE TABLE IF NOT EXISTS reminder_schedule (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        id_reminder integer NOT NULL,
        date        DATE NOT NULL,
        UNIQUE(id_reminder, date)
      );
      `;

      const sql3 = `
      CREATE TABLE IF NOT EXISTS reminder_setting (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        disable_notification  BOLLEAN default false
      );
      `;

      this.dao.run(sql2);
      this.dao.run(sql3);
      return this.dao.run(sql);
  }
}

export default DataBaseInitializer;