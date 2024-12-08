const { message } = require("../config/error_codes");

/////////////////////////////safemind


exports.safemind_login = (email, password, callback) => {
  // console.log(email,password,"+")
  let cntxtDtls = "Get safemind_login api";
  QRY_TO_EXEC = `SELECT * FROM safemind_login where email=?`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [email],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(0, null, 1);
          return;
        } else {
          QRY_TO_EXEC = `SELECT * FROM safemind_login where email=? and password=? and status = 1;`;
          dbutil.execQuery(
            sqldb.MySQLConPool,
            QRY_TO_EXEC,
            cntxtDtls,
            [email, password],
            function (err, results1) {
              console.log(results1,"res")
              if (results1 == 0) {
                callback(err, null, 2);
                return;
              } else {
                exec = `select * from safemind_login where id=${results1[0].id}`;
                dbutil.execQuery(
                  sqldb.MySQLConPool,
                  exec,
                  cntxtDtls,
                  [],
                  function (err, results1811) {
                    console.log(results1);
                    callback(err, results1);
                    return;
                  }
                );
              }
            }
          );
        }
      }
    }
  );
};



exports.safemind_create_account = (
  username,
    email,
    password,
    university,
    role,
    streams,
    personal_type,
  // referralCode,
  callback
) => {
  let cntxtDtls = "Get safemind_create_account api";
  QRY_TO_EXEC = `SELECT * FROM safemind_login where email="${email}";`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [email, username],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length > 0) {
          callback(0, null, 1);
          return;
        } else {
          // console.log(email);

          QRY_TO_EXEC = `insert into safemind_login (name,email,password,university,role,streams,personal_type,status) 
          values("${username}","${email}","${password}","${university}","${role}","${streams}","${personal_type}","1");`;
          dbutil.execQuery(
            sqldb.MySQLConPool,
            QRY_TO_EXEC,
            cntxtDtls,
            [],
            function (err, results1) {
              console.log(results1, "^^^^");
              QRY_TO_EXEC = `select * from safemind_login where id=?;`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                QRY_TO_EXEC,
                cntxtDtls,
                [results1.insertId],
                function (err, results18) {
                  console.log(results18);
                  callback(err, results18);
                  return;
                }
              );
            }
          );
        }
      }
    }
  );
};


////

exports.createGroup = (   group_name,streams,class_desc,class_date,class_time,userid,university,group_number, callback) => {
  let cntxtDtls = "Get createGroup api";
  let current_timestamp = moment().format("yyyy/MM/DD-HH:mm:ss");
  QRY_TO_EXEC = `insert into safemind_groupchat_create(groupd_name,streams,class_desc,class_date,class_time,userid,university,group_number,currenttimestamp) values(?,?,?,?,?,?,?,?,?);`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [group_name,streams,class_desc,class_date,class_time,userid,university,group_number,current_timestamp],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        console.log(results, ",,,,,,,,");
        callback(err, results);
        return;
      }
    }
  );
};



exports.Group_get = (userid, callback) => {
  let cntxtDtls = "Get Group_get api";
  QRY_TO_EXEC = `SELECT DISTINCT safemind_groupchat_create.*,safemind_login.role,safemind_login.name
  FROM safemind_groupchat_create 
  JOIN safemind_login ON safemind_groupchat_create.userid = safemind_login.name
  WHERE safemind_groupchat_create.userid="${userid}"`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [userid],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        console.log(results, ",,,,,,,,");
        callback(err, results);
        return;
      }
    }
  );
};


exports.deleteGroup = (id, userid, callback) => {
  let cntxtDtls = "Get deleteGroup api";
  QRY_TO_EXEC = `DELETE FROM safemind_groupchat_create WHERE id = "${id}" and userid="${userid}";`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [id, userid],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        console.log(results, ",,,,,,,,");
        callback(err, results);
        return;
      }
    }
  );
};


exports.Group_get_all = (callback) => {
  let cntxtDtls = "Get Group_get_all api";
  QRY_TO_EXEC = `SELECT DISTINCT safemind_groupchat_create.*,safemind_login.role,safemind_login.name
  FROM safemind_groupchat_create
  JOIN safemind_login  ON safemind_groupchat_create.userid = safemind_login.name order by id desc`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        console.log(results, ",,,,,,,,");
        callback(err, results);
        return;
      }
    }
  );
};


exports.reg_token = (token, userid, callback) => {
  let cntxtDtls = "Get reg_token api";
  let q1 = `SELECT * FROM safemin_registation_token where userid=${userid}`
  dbutil.execQuery(
    sqldb.MySQLConPool,
    q1,
    cntxtDtls,
    [],
    function (err, results1) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results1.length == 0) {
          QRY_TO_EXEC = `insert into safemin_registation_token (token,userid) value ("${token}","${userid}")`;
          // let val = [selected_role_id, selected_name, message, logged_user_id]
          dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, [],
            function (err, results) {
              if (err) {
                callback(err, 0);
                return;
              } else {
                console.log(results, ",,,,,,,,");
                callback(err, results);
                return;
              }
            }
          );
        }
        else {
          QRY_TO_EXEC = `update safemin_registation_token set token="${token}" where userid=${userid};`;
          // let val = [selected_role_id, selected_name, message, logged_user_id]
          dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, [],
            function (err, results) {
              if (err) {
                callback(err, 0);
                return;
              } else {
                console.log(results, ",,,,,,,,");
                callback(err, results);
                return;
              }
            }
          );
        }

      }
    }
  );

};


exports.reg_peronality_chart = (university, callback) => {
  let cntxtDtls = "Get reg_peronality_chart api";
  let q1 = `select * from safemind_login where university="${university}"`
  dbutil.execQuery(
    sqldb.MySQLConPool,
    q1,
    cntxtDtls,
    [university],
    function (err, results1) {
      if (err) {
        callback(err, 0);
        return;
      } else {

        callback(err, results1);
        return;
      }

    }
  )
}


exports.safemind_post = (post,userid,currentstamp,likes, callback) => {
  let cntxtDtls = "Get safemind_post api";
  let q1 = `insert into safemind_posts (post,userid,currentstamp,likes) value ("${post}","${userid}","${currentstamp}","${likes}")`
  dbutil.execQuery(
    sqldb.MySQLConPool,
    q1,
    cntxtDtls,
    [post,userid,currentstamp,likes],
    function (err, results1) {
      if (err) {
        callback(err, 0);
        return;
      } else {

        callback(err, results1);
        return;
      }

    }
  )
}



exports.safemind_post_all = ( callback) => {
  let cntxtDtls = "Get safemind_post_all api";
  let q1 = `SELECT * FROM safemind_posts;`
  dbutil.execQuery(
    sqldb.MySQLConPool,
    q1,
    cntxtDtls,
    [],
    function (err, results1) {
      if (err) {
        callback(err, 0);
        return;
      } else {

        callback(err, results1);
        return;
      }

    }
  )
}