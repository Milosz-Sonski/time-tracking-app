const TimeRecord = require('../models/TimeRecord');

// Logika rejestracji
exports.registerEvent = async (req, res) => {
    try {
        const { userId, actionType, workMode } = req.body;

        // Szukanie ostatniego wpisu dla walidacji
        const lastEntry = await TimeRecord.findOne({ userId: userId || "65955a8e1234567890abcdef" }).sort({ timestamp: -1 });

        if (lastEntry) {
            if (lastEntry.actionType === 'START' && actionType === 'START') {
                return res.status(400).json({ message: "Praca już trwa." });
            }
            if (lastEntry.actionType === 'STOP' && actionType === 'STOP') {
                return res.status(400).json({ message: "Praca została już zakończona." });
            }
        }

        const newRecord = new TimeRecord({
            userId: userId || "65955a8e1234567890abcdef",
            actionType: actionType,
            workMode: workMode || 'STACJONARNA',
            metadata: {
                ipAddress: req.ip || "::1",
                deviceInfo: req.headers['user-agent'] || "Unknown"
            }
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error("Błąd zapisu:", error);
        res.status(500).json({ message: "Błąd serwera", error: error.message });
    }
};

// Logika historii
exports.getHistory = async (req, res) => {
    try {
        const history = await TimeRecord.find({ userId: req.params.userId }).sort({ timestamp: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania" });
    }
};

// Logika statystyk
exports.getStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await TimeRecord.find({ userId }).sort({ timestamp: 1 });

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const day = now.getDay() || 7;
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - day + 1);

        let todayMs = 0;
        let weekMs = 0;
        let currentStart = null;
        let isActive = false;
        let lastStartTimestamp = null;

        for (const record of records) {
            if (record.actionType === 'START') {
                currentStart = new Date(record.timestamp);
                isActive = true;
                lastStartTimestamp = record.timestamp;
            } else if (record.actionType === 'STOP' && currentStart) {
                const stopTime = new Date(record.timestamp);
                const diffMs = stopTime - currentStart;

                if (currentStart >= startOfToday) todayMs += diffMs;
                if (currentStart >= startOfWeek) weekMs += diffMs;

                currentStart = null;
                isActive = false;
            }
        }

        res.json({ todayMs, weekMs, isActive, lastStartTimestamp });
    } catch (error) {
        console.error("Błąd pobierania statystyk:", error);
        res.status(500).json({ message: "Błąd pobierania statystyk" });
    }
};

// Funkcja usuwająca całą historię danego użytkownika
exports.clearHistory = async (req, res) => {
    try {
        await TimeRecord.deleteMany({ userId: req.params.userId });
        res.json({ message: "Wyczyszczono." });
    } catch (error) {
        res.status(500).json({ message: "Błąd usuwania" });
    }
};

const UserSettings = require('../models/UserSettings');
const emailService = require('../services/emailService');

exports.getSettings = async (req, res) => {
    try {
        let settings = await UserSettings.findOne({ userId: req.params.userId });
        if (!settings) {
            settings = new UserSettings({ userId: req.params.userId });
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania ustawień" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { userId, email, notifyMail, notifyPush, notifyWeekly, name, position } = req.body;
        const settings = await UserSettings.findOneAndUpdate(
            { userId },
            { email, notifyMail, notifyPush, notifyWeekly, name, position },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Błąd zapisywania ustawień" });
    }
};

exports.saveTimesheet = async (req, res) => {
    try {
        const { userId, entries } = req.body;
        // In a real app we'd save the timesheet array to the DB

        // Let's trigger an email if enabled
        const settings = await UserSettings.findOne({ userId });
        if (settings && settings.notifyMail && settings.email) {
            await emailService.sendConfirmationEmail(settings.email, entries);
        }
        res.status(200).json({ message: "Timesheet zapisany" });
    } catch (error) {
        res.status(500).json({ message: "Błąd zapisywania arkusza" });
    }
};