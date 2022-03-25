const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const nodemailer = require("nodemailer");

async function GetAllUsers(page = 1,size=15,user){
  const offset = helper.getOffset(page, size);
  const rows = await db.query(
    `select * from users LIMIT ?,?`, 
    [offset, size]
  );
  const data = helper.emptyOrRows(rows);
  return data
}
async function AddUsers(Users) {
   
    const result = await db.query(`INSERT INTO users (first_name,last_name,guid,role,email,password,createdAt,updatedAt,status) VALUES (?,? ,MID(UUID(),1,36),'user', ?,md5(?),SYSDATE(),SYSDATE(),1)`, [Users.first_name, Users.last_name, Users.email, Users.password]);
   
    let id = "0";
    if (result.affectedRows) {
        id = result.insertId;
        //qry = `INSERT INTO user_logs (table_type,log_type,added_by,table_id,time ) VALUES ('settings','created','` + settings.created_by + `','` + id + `',SYSDATE())`;
        //const resultUserLogs = await db.query(qry);
    }

    return { id };
}
async function UserLogin(Users) {
    var qry = `select * from users where email='` + Users.email + `' and password=md5('` + Users.password + `') and status=1`;
    //return qry;
    const rows = await db.query(qry);
    const data = helper.emptyOrRows(rows);
    return data;
}
async function ResetPassword(Users) {
    var qry = `select * from users where email='`+Users.email+`' and guid='` + Users.guid+`'`;
    const rows = await db.query(qry);
    if (rows.length > 0) {
        qry = `UPDATE users SET password=md5('` + Users.new_password + `')  WHERE id=` + rows[0].id;
        const result = await db.query(qry);
        let message = 'Error in updating ';
        if (result.affectedRows) {
            message = helper.GetSettingValue('reset-password-success-message');
        }
        return { message };
    }
    else {
        let message = helper.GetSettingValue('Reset-password-invalid-email');
        return message;
    }
   
}
async function ChangePassword(Users) {
    var qry = `select password,email from users where password=md5('` + Users.old_password + `') and id=` + Users.id;
    //return qry;
    const rows = await db.query(qry);
    //return rows[0]['email'];
    try {
        if (rows.length > 0) {
            qry = `UPDATE users SET password=md5('` + Users.new_password + `')  WHERE id=` + Users.id;

            const result = await db.query(qry);
            let message = 'Error in updating ';
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'testmail9181@gmail.com',
                    pass: 'Pak_9381'
                }
            });
            // send email
            
            await transporter.sendMail({
                from: 'testmail9181@gmail.com',
                to: rows[0]['email'],
                
              ///  subject: helper.GetSettingValue('email_pwdchng_subject') ,
              //  messsage=helper.GetSettingValue('email_pwdchng_subject'),
                subject:'Your password has been changed recently',
                html: 'Just to inform you that your password has been changed recently.<br>Team<br>Oxford Policy Management Pakistan Ltd'
                
            });
            if (result.affectedRows) {
                message = 'Password updated successfully';
            }
            return { message };
        }
        else {
            return helper.GetSettingValue('change-password-invalid-user');
        }
    } catch (xp) {
        return xp.message;
    }
}
async function ForgotPassword(Users) {
    var qry = `select * from users where email='` + Users.email + `'`;
    const rows = await db.query(qry);
    if (rows.length > 0) {
        // create transporter object with smtp server details
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'testmail9181@gmail.com',
                pass: 'Pak_9381'
            }
        });
        // send email
        await transporter.sendMail({
            from: 'testmail9181@gmail.com',
            to: Users.email,
            subject: 'Forgot Password Email Link',
            html: 'Please click on the link below, to reset your password <a href="http://localhost:4200/pages/reset-password?email=' + rows[0].email + '&guid=' + rows[0].guid +'" >Reset your password</a>'
        });
        return rows[0]
    }
    else {
        return helper.GetSettingValue('forget-password-user-not-found');;
    }
}
async function GetUsersById(id,user){
    const rows = await db.query(
      `SELECT * FROM users WHERE id=?`, 
    [id]
    );
    //const data = helper.emptyOrRows(rows);
    return rows[0]
}
async function DeleteUsers(id, settings) {
  const result = await db.query(
    `DELETE FROM users WHERE id=?`, 
    [id]
  );

  let message = 'Error in deleting ';

  if (result.affectedRows) {
    message = 'Deleted successfully';
    //qry=`INSERT INTO user_logs (table_type,log_type,added_by,table_id,time ) VALUES ('settings','deleted','`+settings.updated_by+`','`+id+`',SYSDATE())`;
    //const resultUserLogs = await db.query(qry);
  }

  return {message};
}
async function SearchUsers(keyword='',user){
    //return `SELECT * FROM users where first_name like '%` + keyword + `%' OR last_name like '%` + keyword + `%' OR email like '%` + keyword + `%'`;
    const rows = await db.query(
    `SELECT * FROM users where first_name like '%`+ keyword +`%' OR last_name like '%`+keyword+`%' OR email like '%`+ keyword +`%' OR role like '%`+ keyword +`%' OR status like '%`+ keyword +`%' ` 
    );
    
  const data = helper.emptyOrRows(rows);
  return data
}


async function ToggleUser(id,users){
    const result = await db.query(
      `UPDATE users SET status= if (status='0','1','0')  where id= ` + id + ``, 
    );
      let message = 'Error in updating ';
      if (result.affectedRows) {
      message = 'Toggle successfully';     
    }
    return {message};
  }

  async function ToggleUserRole(id,users){
    const result = await db.query(
        `UPDATE users SET role= if (role='0','1','0')  where id= ` + id + ``,  
    );
      let message = 'Error in updating ';
      if (result.affectedRows) {
      message = 'Toggle successfully';     
    }
    return {message};
  }


async function UpdateUser(id, Users) {
   
    const result = await db.query(`update users set first_name=? ,last_name=?,updatedAt=SYSDATE() where id=` + id + ``, [Users.first_name, Users.last_name]);
  //  var qry = `UPDATE users
   // SET first_name='`+ Users.first_name + `', last_name='` + Users.last_name + `', updatedAt=SYSDATE()  WHERE id=` + id + ``;
    //return qry;
   // const result = await db.query(qry);
  //  let message = 'Error in updating ';
    return helper.GetSettingValue('email_user_name');;
    if (result.affectedRows) {
       let  message = helper.GetSettingValue('email_user_name');;
    }
    return message;
}
module.exports = {
    GetAllUsers,
    AddUsers,
    DeleteUsers,
    SearchUsers,
    GetUsersById,
    ToggleUser,
    ToggleUserRole,
    UserLogin,
    ChangePassword,
    ForgotPassword,
    ResetPassword,
    UpdateUser
}
