const nodemailer = require('nodemailer');

// Automatycznie tworzymy konto testowe Ethereal przy starcie
let transporter = null;

async function getTransporter() {
    if (transporter) return transporter;

    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log("[EMAIL] Utworzono konto testowe Ethereal:");
        console.log("  User:", testAccount.user);
        console.log("  Pass:", testAccount.pass);

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        return transporter;
    } catch (error) {
        console.error("[EMAIL] Błąd tworzenia konta testowego:", error);
        return null;
    }
}

exports.sendConfirmationEmail = async (toEmail, timesheetEntries) => {
    try {
        const transport = await getTransporter();
        if (!transport) return;

        const totalHours = timesheetEntries.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
        const date = timesheetEntries[0]?.date || new Date().toLocaleDateString();

        const htmlContent = `
            <h2>Potwierdzenie rejestracji czasu pracy</h2>
            <p>Twój arkusz za dzień <strong>${date}</strong> został zapisany w systemie.</p>
            <p>Łączna liczba zaraportowanych godzin: <strong>${totalHours}h</strong></p>
            <h3>Zadania:</h3>
            <ul>
                ${timesheetEntries.map(e => `<li>${e.department} - ${e.task} (${e.hours}h)</li>`).join('')}
            </ul>
        `;

        const info = await transport.sendMail({
            from: '"Time Tracking App" <no-reply@timetracking.local>',
            to: toEmail,
            subject: `Potwierdzenie zapisu arkusza - ${date}`,
            html: htmlContent
        });

        console.log("Email confirmation sent. Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
};

exports.sendWeeklyReport = async (toEmail, summaryData) => {
    try {
        const transport = await getTransporter();
        if (!transport) return;

        const htmlContent = `
            <h2>Tygodniowe Podsumowanie Czasu Pracy</h2>
            <p>Oto Twoje podsumowanie z ostatnich 7 dni:</p>
            <p>Łączna liczba godzin: <strong>${summaryData.totalHours}h</strong></p>
            <h3>Rozbicie na dni:</h3>
            <ul>
                ${summaryData.days.map(d => `<li>${d.date}: ${d.hours}h</li>`).join('')}
            </ul>
        `;

        const info = await transport.sendMail({
            from: '"Time Tracking App" <no-reply@timetracking.local>',
            to: toEmail,
            subject: "Twój tygodniowy raport czasu pracy",
            html: htmlContent
        });

        console.log("Weekly report sent. Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending weekly report email:", error);
    }
};
