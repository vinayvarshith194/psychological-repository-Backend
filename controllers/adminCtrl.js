const adminModel = require("../model/adminModel");
const { message } = require("../config/error_codes");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const FCM = require("fcm-node");

exports.safemind_login = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password, "--");

  adminModel.safemind_login(email, password, (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting Meeting Data ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      if (flag == 1) {
        res.send({
          result: "Fail",
          Message: "Email not found; create a new account to get started!",
        });
        return;
      } else if (flag == 2) {
        res.send({ result: "Fail", Message: "Incorrect password!" });
        return;
      } else {
        let token;
        try {
          //Creating jwt token
          token = jwt.sign({ Data18 }, "YWxha3VudGFtYWhlc2hAaGVtb2xpbmsuaW4=");
        } catch (err) {
          console.log(err);
          const error = new Error("Error! Something went wrong.");
          return next(error);
        }

        res.status(200).json({
          success: true,
          data: {
            Data: Data18,
            token: token,
          },
        });
        // res.send({ result: "success", data: Data18 });
        return;
      }
    }
  });
};

exports.safemind_create_account = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let university = req.body.university;
  let role = req.body.role;
  let streams = req.body.streams;
  let personal_type = req.body.personal_type;

  adminModel.safemind_create_account(
    username,
    email,
    password,
    university,
    role,
    streams,
    personal_type,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting Meeting Data ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (flag == 1) {
          res.send({
            result: "Fail",
            Message: "Email Already Exists",
          });
          return;
        } else if (flag == 2) {
          res.send({ result: "Fail", Message: "Incorrect password!" });
          return;
        } else {
          // res.send({
          //   result: "success",
          //   Message: "User Created Successfully",
          //   data: Data18,
          // });
          let token;
          try {
            //Creating jwt token
            token = jwt.sign(
              { Data18 },
              "YWxha3VudGFtYWhlc2hAaGVtb2xpbmsuaW4="
            );
          } catch (err) {
            console.log(err);
            const error = new Error("Error! Something went wrong.");
            return next(error);
          }

          res.status(200).json({
            success: true,
            data: {
              Data: Data18,
              token: token,
            },
          });
          return;
        }
      }
    }
  );
};

////group
exports.createGroup = (req, res) => {
  let group_name = req.body.group_name;
  let streams = req.body.streams;
  let class_desc = req.body.class_desc;
  let class_date = req.body.class_date;
  let class_time = req.body.class_time;
  let userid = req.body.userid;
  let university =req.body.university;
  let group_number=req.body.group_number


  adminModel.createGroup(
    group_name,
    streams,
    class_desc,
    class_date,
    class_time,
    userid,
    university,
    group_number,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting notification_display ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.status(200).json({
          success: true,
          Data18,
        });
        // res.send({ result: "success", data: Data18 });

        // const registation_token_query = "SELECT * FROM registation_token;";
        // let cntxtDtls = "Get registation_token_push_notification api";

        // dbutil.execQuery(
        //   sqldb.MySQLConPool,
        //   registation_token_query,
        //   cntxtDtls,
        //   [],
        //   function (err, results) {
        //     if (err) {
        //       console.log("Error fetching registration tokens:", err);
        //     } else {
        //       res.status(200).json({
        //         success: true,
        //         results,
        //       });
        //       // Extract registration tokens from the results
        //       // const registrationTokens = results.map(result => result.token);

        //       // const message = {
        //       //   registration_ids: registrationTokens,
        //       //   notification: {
        //       //     title: 'New Group Created',
        //       //     body: `"${group_name}",# "${purpose}" #. Check it out now`,

        //       //   },
        //       // }
        //       // fcm.send(message, function (err, response) {
        //       //   if (err) {
        //       //     console.log('Error:', err);
        //       //   } else {
        //       //     console.log('Successfully sent with response:', response);
        //       //   }
        //       // });
        //     }
        //   }
        // );

        // return;
      }
    }
  );
};
exports.Group_get = (req, res) => {
  let userid = req.body.userid;

  adminModel.Group_get(userid, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.deleteGroup = (req, res) => {
  let id = req.params.id;
  let userid = req.body.userid


  adminModel.deleteGroup(id, userid, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.Group_get_all = (req, res) => {


  adminModel.Group_get_all(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.reg_token = (req, res) => {
  let token = req.body.token;
  let userid = req.body.userid;
  adminModel.reg_token(token, userid, (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {


      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.reg_peronality_chart = (req, res) => {

  let university = req.body.university;

  adminModel.reg_peronality_chart(university, (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {


      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.safemind_post = (req, res) => {

  let post = req.body.post;
  let userid=req.body.userid;
  let currentstamp = req.body.currentstamp;
  let likes=req.body.likes;

  adminModel.safemind_post(post,userid,currentstamp,likes, (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};


exports.safemind_post_all = (req, res) => {


  adminModel.safemind_post_all(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting notification_display ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};