import mssql, { pool } from "mssql";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import lodash from "lodash";
import { event } from "../models/event.interface";
import { sqlconfig } from "../config/sql.config";

export class eventService {
  async createEvent(event: event) {
    let pool = await mssql.connect(sqlconfig);
    let eventId = v4();

    let result = await (
      await pool
        .request()
        .input("event_id", mssql.VarChar, eventId)
        .input("description", mssql.VarChar, event.description)
        .input("destination", mssql.VarChar, event.destination)
        .input("duration", mssql.VarChar, event.duration)
        .input("price", mssql.Float, event.price)
        .input("tour_type", mssql.VarChar, event.tour_type)
        .execute("createEvent")
    ).rowsAffected;

    if (result[0] == 1) {
      return {
        message: "Event created successfully",
      };
    } else {
      return {
        message: "Error creating event",
      };
    }
  }

  async fetchAllEvents() {
    let pool = await mssql.connect(sqlconfig);
    let result = (await pool.query(`SELECT * FROM events`)).recordset;

    if (result.length == 0) {
      return {
        message: "No events found",
      };
    } else {
      return {
        events: result,
      };
    }
  }
}
