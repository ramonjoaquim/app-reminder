import moment from 'moment';
import _  from 'lodash';
const AppDAO = require('./dao').default;
const ipc = window.require('electron').ipcRenderer;
class Crud {
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
      this.dao.run(sql2);
      return this.dao.run(sql);
  }

  insert(reminder) {
    let paramString = "?";
    delete reminder.disableCheckBox;
    delete reminder.open;
    delete reminder.messageReminder;
    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    //console.log('insert into reminder VALUES ('+paramString+')', Object.values(reminder));
    
    let retorno = this.dao.run('insert into reminder VALUES (null,'+paramString+')', Object.values(reminder));
    return retorno;
  }

  _insertReminderSchedule(reminder) {
    let paramString = "?";
    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    //console.log('insert into reminder VALUES ('+paramString+')', Object.values(reminder));
    return this.dao.run('insert into reminder_schedule VALUES (null,'+paramString+')', Object.values(reminder));
  }

  delete(id) {
      return this.dao.run(
          `DELETE FROM reminder WHERE id = ?`,
          [id]
      );
  }

  deleteShedule(id) {
    return this.dao.run(
        `DELETE FROM reminder_schedule WHERE id = ?`,
        [id]
    );
  }

  deleteSheduleByReminderId(id) {
    return this.dao.run(
        `DELETE FROM reminder_schedule WHERE id_reminder = ?`,
        [id]
    );
  }

  getAll() {
      return this.dao.all(`SELECT * FROM reminder`);
  }

  getShedule() {
    return this.dao.all(`SELECT * FROM reminder_schedule order by date asc`);
  }

  getNextReminder() {
    return this.dao.all(`SELECT r.title, r.message_notification, strftime('%d/%m/%Y %H:%M',s.date) as date FROM reminder_schedule s join reminder r on r.id = s.id_reminder order by s.date asc limit 1`);
  }

  getSheduleDate() {
    return this.dao.all(`SELECT r.title, s.date FROM reminder_schedule s join reminder r on r.id = s.id_reminder order by s.date asc`);
  }

  dropSchedulePast() {
    return this.dao.run(`DELETE FROM reminder_schedule where date < DateTime('Now', 'localtime')`);
  }

  dropAllReminder() {
    return this.dao.run(`DELETE FROM reminder where id <> 'drop'`);
  }

  dropAllSheduler() {
    return this.dao.run(`DELETE FROM reminder_schedule where id <> 'drop'`);
  }

  getReminderById(id) {
    return this.dao.all(
      `SELECT * FROM reminder WHERE id = ?`,
      [id]
  );
  }

  async _setReminderToDay(showPrompt) {
    await this.dropSchedulePast();
        
    let reminderOfDay = await this.dao.all(
      `SELECT DateTime('Now', 'localtime') as now,
              id,
              title,
              startAt, 
              endAt,
              timeStartAt, 
              timeEndAt, 
              interval 
              FROM reminder 
              WHERE DATE('now', 'localtime') BETWEEN  startAt AND endAt
              and (strftime('%H:%M', DateTime('Now', 'localtime')) >= timeStartAt AND strftime('%H:%M', DateTime('Now', 'localtime')) <= timeEndAt)
              `);

    var startDate;
    var endDate;

    var minhaDataFinal;

    console.log("ta chamando a função assincrona")
    console.log(reminderOfDay);

    
    
    reminderOfDay.forEach(element => {
      startDate = moment(`${moment(element.now).format('yyyy-MM-DD')} ${element.timeStartAt}`);
      endDate = moment(`${moment(element.now).format('yyyy-MM-DD')} ${element.timeEndAt}`);

      var objInsert = {
        id_reminder: element.id,
        date       : moment(`${element.startAt} ${element.timeStartAt}`).format('yyyy-MM-DD HH:mm')
      };
      this._insertReminderSchedule(objInsert);

      while (true) {
        
      if (this._getHour(element.interval) !== '00') {
        minhaDataFinal = moment(startDate, 'HH:mm').add(this._getHour(element.interval), 'hour');
      }

      if (this._getMinutes(element.interval) !== '00') {
        minhaDataFinal = moment(startDate, 'HH:mm').add(this._getMinutes(element.interval), 'minutes');
      }

      if (minhaDataFinal <= endDate) {
        objInsert = {
          id_reminder: element.id,
          date       :moment(minhaDataFinal).format('yyyy-MM-DD HH:mm')
        };
        this._insertReminderSchedule(objInsert);
        startDate = minhaDataFinal;
      } else {
        break;
      }
    }

    });

    if (showPrompt) {
      ipc.send('show-prompt', { title: 'Date of remiders on this day', data: JSON.stringify(await this.getSheduleDate(), null, '\t') });
    }
  }

  _getHour(time) {
    return time.split(":")[0]
  }

  _getMinutes(time) {
    return time.split(":")[1]
  }

}

ipc.on('init-db',  () => {
  let dao = new AppDAO();
  let c = new Crud(dao);
  c.createTable().then(() => {
    console.log('db is created...')
  })
  .catch((err) => {
    console.log('Error: ')
    console.log(JSON.stringify(err))
  });
});

ipc.on('set-reminders-off-day',  (_event, args) => {
  let dao = new AppDAO();
  let c = new Crud(dao);
  c._setReminderToDay(args);
});

ipc.on('next-reminder', async (_event) => {
  let dao = new AppDAO();
  let c = new Crud(dao);
  let data = await c.getNextReminder();
  let message = `${data[0].title} -> ${data[0].message_notification} às ${data[0].date}`;
  ipc.send('show-popUp', { title:'Next reminder', data: message });
});

ipc.on('get-schedule', async () => {
  let dao = new AppDAO();
  let c = new Crud(dao);
  var now = moment(new Date()).format('YYYY-MM-DD HH:mm');
  var day = moment(new Date()).day();
  
  await c.getShedule().then((data) => {
    data.forEach(element => {
      if (element.date === now) {
        c.getReminderById(element.id_reminder).then((reminder) => {
          if (_.first(reminder).allDays === 1) {
            ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
            c.deleteShedule(element.id).then(() => {
              data.splice(element, 1);
            });
            
            return;
          } else {
            if (_.first(reminder).checkBoxSun === 1 && day === 0) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxMon === 1 && day === 1) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxTue === 1 && day === 2) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxWed === 1 && day === 3) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxThu === 1 && day === 4) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxFri === 1 && day === 5) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }

            if (_.first(reminder).checkBoxSat === 1 && day === 6) {
              ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
              c.deleteShedule(element.id).then(() => {
                data.splice(element, 1);
              });
              return;
            }
          }
        });
      }
    });
  });

  await c.dropSchedulePast();
});

export default Crud;