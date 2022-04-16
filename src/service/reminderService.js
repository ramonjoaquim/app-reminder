  /* eslint no-console: ["error", { allow: ["info", "error"] }] */

import moment from 'moment';
import _  from 'lodash';
import DataBaseInitializer from '../repository/dataBaseInitializer';
import ReminderRepository from "../repository/reminderRepository";

const ipc = window.require('electron').ipcRenderer;

class ReminderService {

  constructor() {
    this.repository = new ReminderRepository();
  }

  insert(reminder) {
    let paramString = "?";
    delete reminder.disableCheckBox;
    delete reminder.open;
    delete reminder.messageReminder;

    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    let retorno = this.repository.run('insert into reminder VALUES (null,'+paramString+')', Object.values(reminder));
    return retorno;
  }

  insertSettings(reminder) {
    let paramString = "?";

    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    let retorno = this.repository.run('insert into reminder_setting VALUES (null,'+paramString+')', Object.values(reminder));
    return retorno;
  }

  updateSettings(id, value) {
    return this.repository.run(
      `UPDATE reminder_setting set disable_notification = ${value} WHERE id = ?`,
      [id]
  );
  }

  _insertReminderSchedule(reminder) {
    let paramString = "?";
    for (var i = 0; i < Object.keys(reminder).length -1 ; i ++) paramString += ",?";  
    return this.repository.run('insert into reminder_schedule VALUES (null,'+paramString+')', Object.values(reminder));
  }

  delete(id) {
    return this.repository.run(
        `DELETE FROM reminder WHERE id = ?`,
        [id]
    );
  }

  deleteShedule(id) {
    return this.repository.run(
        `DELETE FROM reminder_schedule WHERE id = ?`,
        [id]
    );
  }

  deleteSheduleByReminderId(id) {
    return this.repository.run(
        `DELETE FROM reminder_schedule WHERE id_reminder = ?`,
        [id]
    );
  }

  getAll() {
      return this.repository.all(`SELECT * FROM reminder`);
  }

  getShedule() {
    return this.repository.all(`SELECT * FROM reminder_schedule order by date asc`);
  }

  getNextReminder() {
    return this.repository.all(`SELECT r.title, r.message_notification, strftime('%d/%m/%Y %H:%M',s.date) as date FROM reminder_schedule s join reminder r on r.id = s.id_reminder order by s.date asc limit 1`);
  }

  getSheduleDate() {
    return this.repository.all(`SELECT r.title, s.date FROM reminder_schedule s join reminder r on r.id = s.id_reminder order by s.date asc`);
  }

  dropSchedulePast() {
    return this.repository.run(`DELETE FROM reminder_schedule where date < DateTime('Now', 'localtime')`);
  }

  dropAllReminder() {
    return this.repository.run(`DELETE FROM reminder where id <> 'drop'`);
  }

  dropAllSheduler() {
    return this.repository.run(`DELETE FROM reminder_schedule where id <> 'drop'`);
  }

  getReminderById(id) {
    return this.repository.all(
      `SELECT * FROM reminder WHERE id = ?`,
      [id]
    );
  }

  getSettings() {
    return this.repository.all(
      `SELECT * FROM reminder_setting`
    );
  }

  _getHour(time) {
    return time.split(":")[0]
  }

  _getMinutes(time) {
    return time.split(":")[1]
  }

  async _setReminderToDay(showPrompt) {
    await this.dropSchedulePast();
        
    let reminderOfDay = await this.repository.all(
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
  
}


ipc.on('init-db',  () => {
  let dao = new ReminderRepository();
  let c = new DataBaseInitializer(dao);
  c.createTable().then(() => {
    console.info('db is created...')
  })
  .catch((err) => {
    console.error(JSON.stringify(err))
  });
});

ipc.on('set-reminders-off-day',  (_event, args) => {
  let service = new ReminderService()
  service._setReminderToDay(args);
});

ipc.on('next-reminder', async (_event) => {
  let service = new ReminderService();
  let data = await service.getNextReminder();
  if (data && data.length) {
    let message = `${data[0].title} -> ${data[0].message_notification} às ${data[0].date}`;
    ipc.send('show-popUp', { title:'Next reminder', data: message });

  }
});

async function sendNotificationIsActived() {
  let service = new ReminderService();
  return _.first(await service.getSettings()).disable_notification;
}

async function _sendNotification(reminder, element, c , data) {
  if (await sendNotificationIsActived()) {
    ipc.send('notification', _.first(reminder).title, _.first(reminder).message_notification);
  }
  c.deleteShedule(element.id).then(() => {
    data.splice(element, 1);
  });
}

ipc.on('get-schedule', async () => {
  let c = new ReminderService();
  var now = moment(new Date()).format('YYYY-MM-DD HH:mm');
  var day = moment(new Date()).day();
  
  await c.getShedule().then((data) => {
    data.forEach(element => {
      if (element.date === now) {
        c.getReminderById(element.id_reminder).then((reminder) => {
          if (_.first(reminder).allDays === 1) {
            _sendNotification(reminder, element, c, data);
            return;
          } else {
            if (_.first(reminder).checkBoxSun === 1 && day === 0) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxMon === 1 && day === 1) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxTue === 1 && day === 2) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxWed === 1 && day === 3) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxThu === 1 && day === 4) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxFri === 1 && day === 5) {
              _sendNotification(reminder, element, c, data);
              return;
            }

            if (_.first(reminder).checkBoxSat === 1 && day === 6) {
              _sendNotification(reminder, element, c, data);
              return;
            }
          }
        });
      }
    });
  });

  await c.dropSchedulePast();
});

export default ReminderService;