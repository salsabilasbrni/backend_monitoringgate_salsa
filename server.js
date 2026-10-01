require("dotenv").config();

const express = require("express");
const cors = require("cors");

// const db = require("./config/db");

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-supabase", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("*")
            .limit(1);

        if (error) {
            console.error("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        res.json({
            success: true,
            message: "Supabase berhasil terhubung",
            data: data
        });

    } catch (err) {
        console.error("Error:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Backend Running");
});

// =======================
// POST DATA DARI ESP32
// =======================
// app.post("/api/sensor", (req, res) => {

//     const {

//         readerInVoltage,
//         readerInCurrent,

//         scannerInVoltage,
//         scannerInCurrent,

//         readerOutVoltage,
//         readerOutCurrent,

//         scannerOutVoltage,
//         scannerOutCurrent,

//         motorVoltage,
//         motorCurrent,
//         motorPower,

//         motorCounter,

//         temperature,
//         humidity

//     } = req.body;

//     const sql = `
//         INSERT INTO sensor_data (

//             reader_in_voltage,
//             reader_in_current,

//             scanner_in_voltage,
//             scanner_in_current,

//             reader_out_voltage,
//             reader_out_current,

//             scanner_out_voltage,
//             scanner_out_current,

//             motor_voltage,
//             motor_current,
//             motor_power,

//             motor_counter,

//             temperature,
//             humidity

//         )

//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(

//         sql,

//         [

//             readerInVoltage,
//             readerInCurrent,

//             scannerInVoltage,
//             scannerInCurrent,

//             readerOutVoltage,
//             readerOutCurrent,

//             scannerOutVoltage,
//             scannerOutCurrent,

//             motorVoltage,
//             motorCurrent,
//             motorPower,

//             motorCounter,

//             temperature,
//             humidity

//         ],

//         (err) => {

//             if (err) {

//                 console.log(err);

//                 return res.status(500).json({
//                     message: "Gagal menyimpan data"
//                 });

//             }

//             res.json({
//                 message: "Data berhasil disimpan"
//             });

//         }

//     );

// });

// =======================
// POST DATA DARI ESP32
// =======================

app.post("/api/sensor", async (req, res) => {

    try {

        const {
            readerInVoltage,
            readerInCurrent,

            scannerInVoltage,
            scannerInCurrent,

            readerOutVoltage,
            readerOutCurrent,

            scannerOutVoltage,
            scannerOutCurrent,

            motorVoltage,
            motorCurrent,
            motorPower,

            motorCounter,

            temperature,
            humidity,

            responseTime

        } = req.body;


        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .insert([{

                reader_in_voltage: readerInVoltage,
                reader_in_current: readerInCurrent,

                scanner_in_voltage: scannerInVoltage,
                scanner_in_current: scannerInCurrent,

                reader_out_voltage: readerOutVoltage,
                reader_out_current: readerOutCurrent,

                scanner_out_voltage: scannerOutVoltage,
                scanner_out_current: scannerOutCurrent,

                motor_voltage: motorVoltage,
                motor_current: motorCurrent,

                temperature: temperature,
                humidity: humidity,

                motor_counter: motorCounter,

                response_time: responseTime

            }])
            .select();


        if (error) {

            console.log("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                message: "Gagal menyimpan data ke Supabase",
                error: error.message
            });

        }


        res.json({
            success: true,
            message: "Data berhasil disimpan ke Supabase",
            data: data
        });


    } catch (err) {

        console.log("Server Error:", err);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
            error: err.message
        });

    }

});pinp

const axios = require("axios");

const ESP32_IP = "192.168.208.137";

app.post("/api/reset", async (req, res) => {

    try {

        const { relay } = req.body;

        const response = await axios.get(
            `http://${ESP32_IP}/reset?relay=${relay}`
        );

        res.json({
            success: true,
            message: response.data
        });

    } catch (err) {

        console.log(err.message);

        res.status(500).json({
            success: false,
            message: "Reset gagal"
        });

    }

});

// ================================
// UPDATE RESPONSE TIME
// ================================
app.post("/api/sensor/:id/response-time", async (req, res) => {

    try {

        const { id } = req.params;
        const { responseTime } = req.body;

        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .update({
                response_time: responseTime
            })
            .eq("id", id)
            .select();

        if (error) {

            console.log("Update Response Time Error:", error);

            return res.status(500).json({
                success: false,
                message: "Gagal update response time",
                error: error.message
            });

        }

        res.json({
            success: true,
            message: "Response time berhasil disimpan",
            data: data
        });

    } catch (err) {

        console.log("Server Error:", err);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
            error: err.message
        });

    }

});

// =======================
// GET DATA TERBARU
// =======================
// supabase
app.get("/api/sensor/latest", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// app.get("/api/sensor/latest", (req, res) => {

//     const sql = `
//         SELECT *
//         FROM sensor_data
//         ORDER BY id DESC
//         LIMIT 1
//     `;

//     db.query(sql, (err, result) => {

//         if (err)
//             return res.status(500).json(err);

//         if (result.length === 0)
//             return res.json({});

//         res.json(result[0]);

//     });

// });

// =======================
// GET HISTORY
// =======================
//supabase
app.get("/api/sensor/history", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// app.get("/api/sensor/history", (req, res) => {

//     const sql = `
//         SELECT *
//         FROM sensor_data
//         ORDER BY id DESC
//         LIMIT 20
//     `;

//     db.query(sql, (err, result) => {

//         if (err) {
//             return res.status(500).json(err);
//         }

//         res.json(result.reverse());

//     });

// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

// // =======================
// // GET ALL DATA
// // =======================

// app.get("/api/sensor/all", (req, res) => {

//     const sql = `
//         SELECT *
//         FROM sensor_data
//         ORDER BY id DESC
//     `;

//     db.query(sql, (err, result) => {

//         if (err) {
//             return res.status(500).json(err);
//         }

//         res.json(result);

//     });

// });

// =======================
// GET ALL DATA
// =======================

app.get("/api/sensor/all", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {

            console.error("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                error: error.message
            });

        }

        res.json(data);

    } catch (err) {

        console.error("Server Error:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// =======================

// GET REPORT STATISTICS
// =======================
//supabase
app.get("/api/report", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select(`
                reader_in_voltage,
                scanner_in_voltage,
                reader_out_voltage,
                scanner_out_voltage,
                motor_voltage,
                motor_current,
                motor_counter,
                created_at
            `);

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.json({
                totalRecords: 0,
                avgReaderIn: 0,
                avgScannerIn: 0,
                avgReaderOut: 0,
                avgScannerOut: 0,
                avgMotorVoltage: 0,
                maxMotorCurrent: 0,
                motorCounter: 0,
                lastUpdate: null
            });
        }

        const avg = (field) =>
            data.reduce((sum, item) =>
                sum + (Number(item[field]) || 0), 0
            ) / data.length;

        const max = (field) =>
            Math.max(...data.map(item =>
                Number(item[field]) || 0
            ));

        const latest = data.reduce((latest, item) =>
            new Date(item.created_at) > new Date(latest.created_at)
                ? item
                : latest
        );

        res.json({
            totalRecords: data.length,

            avgReaderIn: avg("reader_in_voltage"),
            avgScannerIn: avg("scanner_in_voltage"),
            avgReaderOut: avg("reader_out_voltage"),
            avgScannerOut: avg("scanner_out_voltage"),
            avgMotorVoltage: avg("motor_voltage"),

            maxMotorCurrent: max("motor_current"),

            motorCounter: max("motor_counter"),

            lastUpdate: latest.created_at
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// app.get("/api/report", (req, res) => {

//     const sql = `
//         SELECT

//             COUNT(*) AS totalRecords,

//             AVG(reader_in_voltage) AS avgReaderIn,

//             AVG(scanner_in_voltage) AS avgScannerIn,

//             AVG(reader_out_voltage) AS avgReaderOut,

//             AVG(scanner_out_voltage) AS avgScannerOut,

//             AVG(motor_voltage) AS avgMotorVoltage,

//             MAX(motor_current) AS maxMotorCurrent,

//             MAX(motor_counter) AS motorCounter,

//             MAX(created_at) AS lastUpdate

//         FROM sensor_data
//     `;

//     db.query(sql, (err, result) => {

//         if (err) {
//             return res.status(500).json(err);
//         }

//         res.json(result[0]);

//     });

// });

// ===============================
// GET SENDING STATUS
// ===============================
app.get("/api/device/sending-status", async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("device_control")
            .select("sending_enabled")
            .eq("id", 1)
            .single();

        if (error) {
            console.log("Get sending status error:", error);

            return res.status(500).json({
                success: false,
                message: "Gagal mengambil status sending"
            });
        }

        res.json({
            success: true,
            sendingEnabled: data.sending_enabled
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });

    }
});

// ===============================
// STOP SENDING
// ===============================
app.post("/api/device/sending/stop", async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("device_control")
            .update({
                sending_enabled: false,
                updated_at: new Date().toISOString()
            })
            .eq("id", 1)
            .select();

        if (error) {
            console.log("Stop sending error:", error);

            return res.status(500).json({
                success: false,
                message: "Gagal menghentikan sending"
            });
        }

        res.json({
            success: true,
            message: "Sending berhasil dihentikan",
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });

    }
});

// ===============================
// START SENDING
// ===============================
app.post("/api/device/sending/start", async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("device_control")
            .update({
                sending_enabled: true,
                updated_at: new Date().toISOString()
            })
            .eq("id", 1)
            .select();

        if (error) {
            console.log("Start sending error:", error);

            return res.status(500).json({
                success: false,
                message: "Gagal mengaktifkan sending"
            });
        }

        res.json({
            success: true,
            message: "Sending berhasil diaktifkan",
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });

    }
});

// =======================
// DEVICE INFORMATION
// =======================

app.get("/api/device", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("created_at")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        const lastSeen = new Date(data.created_at);
        const now = new Date();

        const diff =
            (now.getTime() - lastSeen.getTime()) / 1000;

        res.json({

            deviceId: "-",

            status:
                diff < 10 ? "Online" : "Offline",

            lastSeen: data.created_at,

            database: "Connected",

            firmware: "v1.0.0",

            ip: "192.168.1.xxx",

            wifi: "-58 dBm",

            mac: "XX:XX:XX:XX:XX:XX"

        });

    } catch (err) {

        console.error("Device Error:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// app.get("/api/device", (req, res) => {

//     const sql = `
//         SELECT *
//         FROM sensor_data
//         ORDER BY created_at DESC
//         LIMIT 1
//     `;

//     db.query(sql, (err, result) => {

//         if (err) {
//             return res.status(500).json(err);
//         }

//         if (result.length === 0) {
//             return res.json({});
//         }

//         const last = result[0];

//         const lastSeen = new Date(last.created_at);
//         const now = new Date();

//         const diff =
//             (now.getTime() - lastSeen.getTime()) / 1000;

//         res.json({

//             deviceId: last.device_id,

//             status:
//                 diff < 10 ? "Online" : "Offline",

//             lastSeen: last.created_at,

//             database: "Connected",

//             firmware: "v1.0.0",

//             ip: "192.168.1.xxx",

//             wifi: "-58 dBm",

//             mac: "XX:XX:XX:XX:XX:XX"

//         });

//     });

// });

// app.get("/api/export/csv", (req, res) => {

//     const sql = `
//         SELECT *
//         FROM sensor_data
//         ORDER BY id DESC
//     `;

//     db.query(sql, (err, result) => {

//         if (err)
//             return res.status(500).json(err);

//         res.json(result);

//     });

// });

app.get("/api/export/csv", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("monitoring_reset_gate")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});