const cron = require('node-cron');
const TimeRecord = require('../models/TimeRecord');
const UserSettings = require('../models/UserSettings');
const emailService = require('../services/emailService');

// Docelowo: '0 16 * * 5' - W każdy piątek o 16:00
// Testowo: '* * * * *' - Co minutę
const schedule = process.env.NODE_ENV === 'development' ? '* * * * *' : '0 16 * * 5';

const startCron = () => {
    console.log(`[CRON] Harmonogram raportów tygodniowych zainicjowany (${schedule})`);

    cron.schedule(schedule, async () => {
        console.log("[CRON] Rozpoczynam generowanie raportów tygodniowych...");

        try {
            const users = await UserSettings.find({ notifyWeekly: true });

            // Szukamy wpisów z ostatnich 7 dni
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            for (const user of users) {
                if (!user.email) continue;

                // Tu powinniśmy mieć logikę parowania START/STOP na konkretne zadania, 
                // ale w uproszczeniu pobieramy same rekordy
                const records = await TimeRecord.find({
                    userId: user.userId,
                    timestamp: { $gte: oneWeekAgo }
                });

                if (records.length === 0) continue;

                // Prosta agregacja do celów testowych - liczymy akcje START jako "aktywny dzień" 
                // i rzucamy przykładowe 8h (w pełnej wersji tutaj byłaby dokładna kalkulacja czasu ze START/STOP)
                const startRecords = records.filter(r => r.actionType === 'START');
                const totalHours = startRecords.length * 8; // Zastępcze założenie 8h na każdy START

                const days = startRecords.map(r => ({
                    date: r.timestamp.toLocaleDateString(),
                    hours: 8
                }));

                const summaryData = {
                    totalHours: totalHours,
                    days: days
                };

                await emailService.sendWeeklyReport(user.email, summaryData);
            }
            console.log("[CRON] Raporty tygodniowe wysłane pomyślnie.");
        } catch (error) {
            console.error("[CRON] Błąd podczas wysyłania raportów tygodniowych:", error);
        }
    });
};

module.exports = startCron;
