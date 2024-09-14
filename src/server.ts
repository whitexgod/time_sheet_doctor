import express, { Application, Request, Response, NextFunction } from "express";
import connectDatabase from "./db/connect";
import path from "path";
import { recordModel } from "./model/recordModel";
import convertUtcToTimeZone from "./helper/convertToTimeZone";
import config from "./config/config";
import ExcelJS from "exceljs";
import fs from "fs";

connectDatabase();

const server: Application = express();
server.use(express.json()); // Middleware to parse JSON

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views")); // Directory where your EJS files are located

// Serve static files from the "public" directory
server.use(express.static(path.join(__dirname, "public")));

server.get("/", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "record", "record.html"),
    "utf8",
    (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
        return;
      }

      // Replace placeholder with actual API URL
      const modifiedData = data.replace(/<%= apiUrl %>/g, config.API_URL!);
      res.send(modifiedData);
    }
  );
});

server.get("/record-details", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "recordList", "recordList.html"),
    "utf8",
    (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
        return;
      }

      // Replace placeholder with actual API URL
      const modifiedData = data.replace(/<%= apiUrl %>/g, config.API_URL!);
      res.send(modifiedData);
    }
  );
});

server.get("/export-data", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "export", "export.html"),
    "utf8",
    (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
        return;
      }

      // Replace placeholder with actual API URL
      const modifiedData = data.replace(/<%= apiUrl %>/g, config.API_URL!);
      res.send(modifiedData);
    }
  );
});

server.get("/api/performers", async (req, res) => {
  try {
    const performers = config.PERFORMERS;
    return res.status(200).json({ performers });
  } catch (error) {
    console.log(error);
  }
});

server.get("/api/events", async (req, res) => {
  try {
    const events = config.EVENTS;
    return res.status(200).json({ events });
  } catch (error) {
    console.log(error);
  }
});

server.get("/api/:event", async (req: Request, res: Response) => {
  try {
    const event = req.params.event.toUpperCase(); // Extract event from URL
    const date = req.query.date as string; // Extract date query parameter and cast to string

    // Define query result variable
    let queryResult;

    // Build query object
    let query: any = { event };

    // Add date filter if provided
    if (date) {
      query.date = new Date(date).toISOString().split("T")[0]; // Convert date string to Date object
    }

    // Switch case to handle different event types
    switch (event) {
      case "DRAMA":
        queryResult = await recordModel.find(query).sort({ date: -1 });
        break;

      default:
        queryResult = null;
    }

    // Send the query result as a JSON response
    res.status(200).json({ data: queryResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.post("/api/records", async (req, res) => {
  try {
    await new recordModel({
      ...req.body,
      startTime: convertUtcToTimeZone(req.body.startTime, config.TIME_ZONE),
      endTime: convertUtcToTimeZone(req.body.endTime, config.TIME_ZONE),
    }).save();

    return res.status(200).json({
      message: "Data stored successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

server.get("/export-records/:event", async (req, res) => {
  try {
    interface Record {
      event: string;
      performer: string;
      startTime: string;
      endTime: string;
      timeElapsed: number;
      date: string;
    }

    const event = req.params.event.toUpperCase(); // Extract event from URL

    // Fetch records from the database
    const records: Record[] = await recordModel.find({ event }).exec();

    if (records.length === 0) {
      // No records found for the event
      return res.status(404).send("No records found for the specified event.");
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Group records by performer
    const groupedRecords: { [performer: string]: Record[] } = records.reduce(
      (acc, record) => {
        if (!acc[record.performer]) {
          acc[record.performer] = [];
        }
        acc[record.performer].push(record);
        return acc;
      },
      {} as { [performer: string]: Record[] }
    );

    // Create a sheet for each performer
    for (const performer in groupedRecords) {
      const worksheet = workbook.addWorksheet(performer);

      // Define columns
      worksheet.columns = [
        { header: "Event", key: "event", width: 30 },
        { header: "Date", key: "date", width: 15 },
        { header: "Start Time", key: "startTime", width: 20 },
        { header: "End Time", key: "endTime", width: 20 },
        { header: "Time Elapsed (min)", key: "timeElapsed", width: 20 },
      ];

      // Add rows
      groupedRecords[performer].forEach((record) => {
        worksheet.addRow({
          event: record.event,
          date: record.date,
          startTime: record.startTime,
          endTime: record.endTime,
          timeElapsed: record.timeElapsed,
        });
      });
    }
    const date = new Date();
    const filename = `records-${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}.xlsx`;
    // Set the response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error("Error generating the Excel file:", error);
    res.status(500).send("Error generating the Excel file");
  }
});

// Start the server
const PORT = parseInt(process.env.PORT || "3000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
