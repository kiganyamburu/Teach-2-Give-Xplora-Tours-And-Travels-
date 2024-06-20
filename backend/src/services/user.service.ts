import mssql, { pool } from "mssql";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import lodash from "lodash";
import { user } from "../models/user.interface";
import { sqlconfig } from "../config/sql.config";

export class userService {
  async registerUser(user: user) {
    let pool = await mssql.connect(sqlconfig);

    let user_id = v4();
    let hashedPassword = bcrypt.hashSync(user.password, 6);

    let emailExist = (
      await pool.query(`SELECT * FROM users WHERE email = '${user.email}`)
    ).recordset;

    if (!lodash.isEmpty(emailExist)) {
      return {
        error: "Email already exists",
      };
    }

    let result = (
      await pool
        .request()
        .input("user_id", mssql.VarChar, user_id)
        .input("username", mssql.VarChar, user.username)
        .input("email", mssql.VarChar, user.email)
        .input("password", mssql.VarChar, hashedPassword)
        .execute("registerUser")
    ).rowsAffected;

    if (result[0] == 1) {
      return {
        message: "User registered successfully",
      };
    } else {
      return {
        error: "User not registered",
      };
    }
  }
  async fetchAllUsers() {
    let pool = await mssql.connect(sqlconfig);
    let result = (await pool.query(`SELECT * FROM users`)).recordset;

    if (result.length == 0) {
      return {
        message: "No users found",
      };
    } else {
      return {
        users: result,
      };
    }
  }
  async fetchSingleUser(user_id: string) {
    let user = await (
      await pool.query(`SELECT * FROM users WHERE id = '${user_id}'`)
    ).recordset;

    console.log(user);

    if (!user[0].id) {
      return {
        error: "User not found",
      };
    } else {
      return {
        user: user[0],
      };
    }
  }
  async switchRoles(user_id: string) {
    let response = await this.fetchSingleUser(user_id);

    if (response.user.id) {
      let response = (
        await pool.query(
          `UPDATE users SET role = 'admin' WHERE role = 'user' AND id = '${user_id}'`
        )
      ).rowsAffected;

      if (response[0] < 1) {
        return {
          error: "Unable to changed user role",
        };
      } else {
        return {
          message: "User role changed successfully",
        };
      }
    } else {
      return {
        error: "User not found",
      };
    }
  }

  async updateUserDetails(user: user) {
    let pool = await mssql.connect(sqlconfig);

    let userExists = await (
      await pool
        .request()
        .query(`SELECT * FROM users WHERE user_id ='${user.user_id}'`)
    ).recordset;

    console.log(userExists);

    if (!lodash.isEmpty(userExists)) {
      return {
        error: "user not found",
      };
    } else {
      let result = (
        await pool
          .request()
          .input("user_id", userExists[0].user_id)
          .input("username", user.username)
          .input("email", user.email)
          .input("password", user.password)
          .execute("updateUserDetails")
      ).rowsAffected;

      if (result[0] < 1) {
        return {
          error: "Unable to update user details",
        };
      } else {
        return {
          message: "User details updated successfully",
        };
      }
    }
  }
}
