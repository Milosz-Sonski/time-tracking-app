import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemIcon, ListItemText, Switch, Slider,
  Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Container, TextField, Grid, MenuItem, Menu, Tabs, Tab, IconButton, Alert, Snackbar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
  DarkMode, TextFields, Settings,
  PictureAsPdf, Assignment, Person, Notifications, Dashboard as DashboardIcon, Translate, AddCircle, Delete, Mail, NotificationsActive, EventNote, DeleteSweep, CalendarMonth, Info, Logout
} from '@mui/icons-material';
import axios from 'axios';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

// POPRAWIONE IMPORTY DLA PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const drawerWidth = 280;
const holidays = [
  "2026-01-01", "2026-01-06", "2026-04-05", "2026-04-06", "2026-05-01", "2026-05-03", "2026-05-24", "2026-06-04", "2026-08-15", "2026-11-01", "2026-11-11", "2026-12-25", "2026-12-26",
  "2027-01-01", "2027-01-06", "2027-03-28", "2027-03-29", "2027-05-01", "2027-05-03", "2027-05-16", "2027-05-27", "2027-08-15", "2027-11-01", "2027-11-11", "2027-12-25", "2027-12-26",
  "2028-01-01", "2028-01-06", "2028-04-16", "2028-04-17", "2028-05-01", "2028-05-03", "2028-06-04", "2028-06-15", "2028-08-15", "2028-11-01", "2028-11-11", "2028-12-25", "2028-12-26"
];

const translations = {
  PL: {
    title: "System Ewidencji", pulpit: "Pulpit Sterowniczy", arkusz: "Arkusz Zadań",
    ustawienia: "Ustawienia", raport: "Raport PDF", wymaz: "Wyczyść Historię",
    dostepnosc: "DOSTĘPNOŚĆ", czcionka: "Czcionka", tryb: "Tryb ciemny", jezyk: "Język (PL/EN)",
    start: "START PRACY", stop: "STOP PRACY", biuro: "Biuro", zdalnie: "Zdalnie",
    zapisz: "ZAPISZ ARKUSZ", dzial: "Dział Firmowy", zadanie: "Zadanie", profil: "Profil",
    powiadomienia: "Powiadomienia", godziny: "Godziny", dodaj: "Dodaj kolejne zadanie",
    limit_ok: "Suma godzin: ", limit_err: "Błąd: Przekroczono limit 8 godzin!",
    holiday_err: "Nie można raportować pracy w dni ustawowo wolne!",
    holiday_warning: "Wybrana data to święto. Raportowanie jest zablokowane.",
    weekend_info: "Wybrana data to weekend. Pamiętaj o rozliczeniu nadgodzin zgodnie z prawem pracy.",
    duplicate_err: "To zadanie zostało już zaraportowane dla tej daty!",
    save_success: "Arkusz zapisany pomyślnie!", cancel: "Anuluj", confirm: "Potwierdź",
    session_title: "Zapisane zadania w tej sesji", session_clear: "Wyczyść sesję",
    session_clear_desc: "Czy na pewno chcesz usunąć wszystkie zadania z obecnego podglądu?",
    history_clear_desc: "Czy na pewno chcesz trwale usunąć historię START/STOP z bazy danych?",
    data_wyboru: "Data raportu", pdf_error: "Brak zadań do wygenerowania raportu!",
    notify_mail: "E-mail", notify_mail_desc: "Wysyłaj potwierdzenia rejestracji na e-mail",
    notify_push: "Przypomnienia (Push)", notify_push_desc: "Alerty w przeglądarce o statusie pracy",
    notify_summary: "Raporty tygodniowe", notify_summary_desc: "Zbiorcze podsumowanie godzin na koniec tygodnia",
    commonTasks: ['Obiad', 'Czas wolny', 'Inne'],
    departmentsData: {
      'Marketing': ['Kampania Social Media', 'Analiza rynku', 'SEO', 'Copywriting', 'E-mail Marketing'],
      'Sprzedaż': ['Pozyskiwanie leadów', 'Spotkania', 'Kontrakty', 'Cold Calling', 'Prezentacja oferty'],
      'Finanse/Księgowość': ['Fakturowanie', 'Wydatki', 'Audyt', 'Rozliczanie delegacji', 'Bilans roczny'],
      'Zasoby Ludzkie (HR)': ['Rekrutacja', 'Onboarding', 'Szkolenia', 'Administracja płacowa', 'Integracja'],
      'IT': ['Programowanie', 'Wsparcie techniczne', 'Sieci', 'Testowanie', 'Zarzadzanie bazami danych']
    },
    tryb_pracy: "Tryb pracy",
    modes: {
      stacjonarna: "Praca Stacjonarna",
      zadaniowa: "Praca Zadaniowa",
      zdalna: "Praca Zdalna",
      zmianowa: "Praca Zmianowa",
      nocna: "Pora Nocna"
    },
    zadaniowa_info: "Tryb zadaniowy - rozliczanie na podstawie wykonanych zadań, bez ewidencji godzin.",
    mode_change_err: "Nie można zmienić rodzaju pracy w trakcie trwania obecnego!",
    dept_locked: "Dział został już wybrany!",
    reset_time: "Zresetuj Czas",
    reset_time_desc: "Czy na pewno chcesz wyzerować swój czas pracy? Spowoduje to całkowite usunięcie logów START/STOP z poniższej tabeli (nie wpływa to na arkusz zadań).",
    czas_dzisiaj: "Czas pracy dzisiaj",
    w_tym_tygodniu: "W tym tygodniu",
    biezacy_status: "Bieżący status",
    w_pracy: "🟢 W trakcie pracy",
    gotowy: "⚪ Gotowy do pracy",
    pusty_tytul: "Twój dzień pracy jeszcze się nie zaczął",
    pusty_opis: "Kliknij zielony przycisk START PRACY powyżej, aby rozpocząć rejestrację czasu.",
    app_name_full: "Aplikacja do ewidencji czasu pracy",
    wyloguj: "Wyloguj się",
    email_label: "E-mail do raportów",
    imie_label: "Imię",
    stanowisko_label: "Stanowisko",
    zapisz_zmiany: "Zapisz Zmiany",
    wroc: "Wróć"
  },
  EN: {
    title: "Time Tracking", pulpit: "Control Dashboard", arkusz: "Task Timesheet",
    ustawienia: "Settings", raport: "PDF Report", wymaz: "Clear History",
    dostepnosc: "ACCESSIBILITY", czcionka: "Font Size", tryb: "Dark Mode", jezyk: "Language (PL/EN)",
    start: "START WORK", stop: "STOP WORK", biuro: "Office", zdalnie: "Remote",
    zapisz: "SAVE TIMESHEET", dzial: "Department", zadanie: "Task", profil: "Profile",
    powiadomienia: "Notifications", godziny: "Hours", dodaj: "Add another task",
    limit_ok: "Total hours: ", limit_err: "Error: 8-hour limit exceeded!",
    holiday_err: "Work cannot be reported on public holidays!",
    holiday_warning: "Selected date is a holiday. Reporting is disabled.",
    weekend_info: "Selected date is a weekend. Remember to settle overtime according to labor law.",
    duplicate_err: "This task has already been reported for this date!",
    save_success: "Timesheet saved successfully!", cancel: "Cancel", confirm: "Confirm",
    session_title: "Saved tasks in this session", session_clear: "Clear session",
    session_clear_desc: "Are you sure you want to remove all tasks from the current view?",
    history_clear_desc: "Are you sure you want to permanently delete START/STOP history from the database?",
    data_wyboru: "Report date", pdf_error: "No tasks to generate report!",
    notify_mail: "E-mail Notifications", notify_mail_desc: "Send registration confirmations to email",
    notify_push: "Push Reminders", notify_push_desc: "Browser alerts about work status",
    notify_summary: "Weekly Reports", notify_summary_desc: "Summary of hours at the end of the week",
    commonTasks: ['Lunch', 'Break', 'Other'],
    departmentsData: {
      'Marketing': ['Social Media Campaign', 'Market Analysis', 'SEO', 'Copywriting', 'E-mail Marketing'],
      'Sales': ['Leads', 'Meetings', 'Contracts', 'Cold Calling', 'Product Presentation'],
      'Finance/Accounting': ['Invoicing', 'Expenses', 'Audit', 'Travel Settlement', 'Annual Balance'],
      'Human Resources (HR)': ['Recruitment', 'Onboarding', 'Training', 'Payroll Admin', 'Integration'],
      'IT': ['Software Development', 'Tech Support', 'Network', 'QA Testing', 'DB Management']
    },
    tryb_pracy: "Work Mode",
    modes: {
      stacjonarna: "On-site Work",
      zadaniowa: "Task-based Work",
      zdalna: "Remote Work",
      zmianowa: "Shift Work",
      nocna: "Night Shift"
    },
    zadaniowa_info: "Task-based mode - accounting based on completed tasks, no hour tracking.",
    mode_change_err: "Cannot change work mode while currently working!",
    dept_locked: "Department has already been selected!",
    reset_time: "Reset Time",
    reset_time_desc: "Are you sure you want to reset your work time? This will completely remove START/STOP logs from the table below (does not affect the task timesheet).",
    czas_dzisiaj: "Worked today",
    w_tym_tygodniu: "This week",
    biezacy_status: "Current status",
    w_pracy: "🟢 Currently working",
    gotowy: "⚪ Ready to work",
    pusty_tytul: "Your workday hasn't started yet",
    pusty_opis: "Click the green START WORK button above to begin tracking time.",
    app_name_full: "Time Tracking Application",
    wyloguj: "Log out",
    email_label: "Report E-mail",
    imie_label: "Name",
    stanowisko_label: "Position",
    zapisz_zmiany: "Save Changes",
    wroc: "Back"
  }
};

const Dashboard = ({ darkMode, setDarkMode, fontSize, setFontSize }) => {
  const [lang, setLang] = useState('PL');
  const t = translations[lang];
  const [view, setView] = useState('MAIN');
  const [tabIndex, setTabIndex] = useState(0);
  const [status, setStatus] = useState('OFFLINE');
  const [selectedMode, setSelectedMode] = useState('STACJONARNA');
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({ name: "Milosz", position: "Inzynier Systemu", email: "" });
  const [settings, setSettings] = useState({ notifyMail: true, notifyPush: false, notifyWeekly: true });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const [stats, setStats] = useState({ todayMs: 0, weekMs: 0, isActive: false, lastStartTimestamp: null });
  const [liveMs, setLiveMs] = useState(0);

  const formatMs = (totalMs) => {
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes < 10 ? '0' + minutes : minutes}m`;
  };

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskList, setTaskList] = useState([{ id: Date.now(), department: '', task: '', hours: 0, location: '' }]);
  const [totalHours, setTotalHours] = useState(0);
  const [savedTasks, setSavedTasks] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialog, setDialog] = useState({ open: false, type: '', title: '', desc: '' });

  const { user, logout } = useKindeAuth();
  const userId = user?.id || "fallbackId";
  useEffect(() => {
    const sum = taskList.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
    setTotalHours(sum);
  }, [taskList]);

  useEffect(() => {
    setTaskList([{ id: Date.now(), department: '', task: '', hours: 0, location: t.biuro }]);
  }, [lang, t.biuro]);

  const loadDataFromDB = useCallback(async () => {
    try {
      const res = await axios.get(`/api/time/history/${userId}`);
      setHistory(res.data);
      if (res.data.length > 0) {
        setStatus(res.data[0].actionType === 'START' ? 'W PRACY' : 'ZAKONCZONO');
      }

      const settingsRes = await axios.get(`/api/time/settings/${userId}`);
      if (settingsRes.data) {
        setSettings({
          notifyMail: settingsRes.data.notifyMail,
          notifyPush: settingsRes.data.notifyPush,
          notifyWeekly: settingsRes.data.notifyWeekly
        });
        setProfile({
          name: settingsRes.data.name || "Milosz",
          position: settingsRes.data.position || "Inzynier Systemu",
          email: settingsRes.data.email || ""
        });
      }

      const statsRes = await axios.get(`/api/time/stats/${userId}`);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) { console.error(err); }
  }, [userId]);

  useEffect(() => { loadDataFromDB(); }, [loadDataFromDB]);

  useEffect(() => {
    let interval = null;
    if (stats.isActive && stats.lastStartTimestamp) {
      setLiveMs(Date.now() - new Date(stats.lastStartTimestamp).getTime());
      interval = setInterval(() => {
        setLiveMs(Date.now() - new Date(stats.lastStartTimestamp).getTime());
      }, 10000);
    } else {
      setLiveMs(0);
    }
    return () => clearInterval(interval);
  }, [stats.isActive, stats.lastStartTimestamp]);

  // PUSH: Przypomnienie o rozpoczęciu pracy (co 5 minut sprawdza, czy po 9:00 i nie pracujesz)
  useEffect(() => {
    if (!settings.notifyPush || Notification.permission !== 'granted') return;

    const checkStartReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0=niedz, 6=sob

      // Tylko w dni robocze, po godzinie 9:00, jeśli nie pracujesz
      if (day >= 1 && day <= 5 && hour >= 9 && !stats.isActive) {
        new Notification('⏰ Przypomnienie - Time Tracker', {
          body: 'Nie zapomnij włączyć rejestracji czasu pracy!',
          icon: '/logo.png',
          tag: 'start-reminder' // zapobiega duplikatom
        });
      }
    };

    // Sprawdź od razu, potem co 5 minut
    const timeout = setTimeout(checkStartReminder, 10000); // pierwsze po 10s
    const interval = setInterval(checkStartReminder, 5 * 60 * 1000); // potem co 5 min

    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [settings.notifyPush, stats.isActive]);

  // PUSH: Przypomnienie po 8 godzinach pracy
  useEffect(() => {
    if (!settings.notifyPush || !stats.isActive || !stats.lastStartTimestamp) return;
    if (Notification.permission !== 'granted') return;

    const startTime = new Date(stats.lastStartTimestamp).getTime();
    const eightHoursMs = 8 * 60 * 60 * 1000;
    const elapsed = Date.now() - startTime;
    const remaining = eightHoursMs - elapsed;

    if (remaining <= 0) {
      // Już minęło 8h — powiadom od razu
      new Notification('🛑 8 godzin pracy!', {
        body: 'Pracujesz już 8 godzin. Czas zakończyć pracę!',
        icon: '/logo.png',
        tag: '8h-reminder'
      });
      return;
    }

    // Ustaw timer na moment, gdy minie 8h
    const timer = setTimeout(() => {
      new Notification('🛑 8 godzin pracy!', {
        body: 'Pracujesz już 8 godzin. Czas zakończyć pracę!',
        icon: '/logo.png',
        tag: '8h-reminder'
      });
    }, remaining);

    return () => clearTimeout(timer);
  }, [settings.notifyPush, stats.isActive, stats.lastStartTimestamp]);

  // NAPRAWIONA FUNKCJA GENEROWANIA PDF (Z POLSKIMI ZNAKAMI)
  const handleGeneratePDF = async () => {
    if (savedTasks.length === 0) {
      setSnackbar({ open: true, message: t.pdf_error, severity: 'warning' });
      return;
    }

    try {
      setSnackbar({ open: true, message: lang === 'PL' ? "Pobieranie czcionek i generowanie..." : "Downloading fonts & generating...", severity: 'info' });
      const doc = new jsPDF();

      try {
        const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf');
        const buffer = await response.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Font = window.btoa(binary);

        doc.addFileToVFS('Roboto-Regular.ttf', base64Font);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');
      } catch (fontErr) {
        console.warn("Could not load custom font", fontErr);
      }

      const tableColumn = [
        lang === 'PL' ? "Data" : "Date",
        lang === 'PL' ? "Dział" : "Department",
        lang === 'PL' ? "Zadanie" : "Task",
        lang === 'PL' ? "Godziny" : "Hours",
        lang === 'PL' ? "Lokalizacja" : "Location"
      ];

      const tableRows = savedTasks.map(task => [
        task.date,
        task.department,
        task.task === t.commonTasks[2] && task.taskDescription ? `${task.task} - ${task.taskDescription}` : task.task,
        task.workMode === 'ZADANIOWA' ? '-' : `${task.hours}h`,
        task.location
      ]);

      doc.setFontSize(18);
      doc.text(t.raport, 14, 20);
      doc.setFontSize(11);
      doc.text(`${lang === 'PL' ? 'Pracownik' : 'Employee'}: ${profile.name} (${profile.position})`, 14, 30);
      doc.text(`${lang === 'PL' ? 'Wygenerowano' : 'Generated'}: ${new Date().toLocaleString()}`, 14, 36);

      // BEZPIECZNE WYWOLANIE autoTable JAKO FUNKCJI
      autoTable(doc, {
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: darkMode ? [44, 44, 44] : [211, 47, 47],
          textColor: [255, 255, 255],
          fontStyle: 'normal'
        },
        styles: { fontSize: 9, font: 'Roboto' }
      });

      doc.save(`Raport_Pracy_${profile.name}_${new Date().toLocaleDateString()}.pdf`);
      setSnackbar({ open: true, message: lang === 'PL' ? "Pobrano PDF!" : "PDF Downloaded!", severity: 'success' });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      setSnackbar({ open: true, message: "Error generating PDF", severity: 'error' });
    }
  };

  const isHolidaySelected = holidays.includes(selectedDate);
  const isWeekend = () => {
    const day = new Date(selectedDate).getDay();
    return day === 0 || day === 6;
  };

  const handleSaveSettings = async () => {
    try {
      await axios.post('/api/time/settings', {
        userId: userId,
        name: profile.name,
        position: profile.position,
        email: profile.email,
        ...settings
      });
      setSnackbar({ open: true, message: "Zapisano ustawienia", severity: 'success' });

      // Jeśli włączono Push, poproś o uprawnienia
      if (settings.notifyPush && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Błąd zapisu ustawień", severity: 'error' });
    }
  };

  const handleSaveTimesheet = async () => {
    if (isHolidaySelected) { setSnackbar({ open: true, message: t.holiday_err, severity: 'error' }); return; }
    if (selectedMode !== 'ZADANIOWA' && totalHours > 8) { setSnackbar({ open: true, message: t.limit_err, severity: 'error' }); return; }

    const newEntries = [];
    let hasDuplicate = false;

    taskList.filter(e => selectedMode === 'ZADANIOWA' ? (e.department && e.task) : e.hours > 0).forEach(e => {
      const isDuplicate = savedTasks.some(saved =>
        saved.department === e.department && saved.task === e.task && saved.date === selectedDate
      );
      if (isDuplicate) hasDuplicate = true;
      else newEntries.push({
        ...e,
        date: selectedDate,
        timestamp: new Date().toLocaleTimeString(),
        workMode: selectedMode,
        location: selectedMode === 'ZDALNA' ? t.zdalnie : t.biuro
      });
    });

    if (hasDuplicate) setSnackbar({ open: true, message: t.duplicate_err, severity: 'warning' });

    if (newEntries.length > 0) {
      setSavedTasks(prev => [...newEntries, ...prev]);
      setTaskList([{ id: Date.now(), department: '', task: '', taskDescription: '', hours: 0, location: t.biuro }]);

      try {
        await axios.post('/api/time/timesheet', { userId: userId, entries: newEntries });
      } catch (e) {
        console.error("Failed to sync timesheet", e);
      }

      setSnackbar({ open: true, message: t.save_success, severity: 'success' });
    }
  };

  const handleOpenDialog = (type) => {
    let config = {};
    if (type === 'SESSION') config = { title: t.session_clear, desc: t.session_clear_desc };
    else if (type === 'HISTORY') config = { title: t.wymaz, desc: t.history_clear_desc };
    else if (type === 'RESET_TIME') config = { title: t.reset_time, desc: t.reset_time_desc };

    setDialog({ open: true, type, ...config });
  };

  const handleConfirmDialog = async () => {
    if (dialog.type === 'SESSION') setSavedTasks([]);
    else {
      try {
        await axios.delete(`/api/time/clear/${userId}`);
        setHistory([]);
        setStatus('OFFLINE');
        if (dialog.type === 'RESET_TIME') {
          setStats({ todayMs: 0, weekMs: 0, isActive: false, lastStartTimestamp: null });
          setLiveMs(0);
        }
      } catch (error) { console.error(error); }
    }
    setDialog({ ...dialog, open: false });
  };

  const handleUpdateTask = (id, field, value) => {
    if (field === 'department') {
      let establishedDept = null;
      if (savedTasks.length > 0) {
        establishedDept = savedTasks[0].department;
      } else {
        const otherTask = taskList.find(t => t.id !== id && t.department);
        if (otherTask) establishedDept = otherTask.department;
      }

      if (establishedDept && value !== establishedDept) {
        setSnackbar({ open: true, message: t.dept_locked, severity: 'warning' });
        return;
      }
    }

    setTaskList(taskList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveTask = (id) => {
    if (taskList.length > 1) setTaskList(taskList.filter(item => item.id !== id));
  };

  const renderSettings = () => (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>{t.ustawienia}</Typography>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Person />} label={t.profil} />
          <Tab icon={<Notifications />} label={t.powiadomienia} />
        </Tabs>
        <Box sx={{ p: 4 }}>
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField fullWidth label={t.email_label} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label={t.imie_label} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label={t.stanowisko_label} value={profile.position} onChange={(e) => setProfile({ ...profile, position: e.target.value })} /></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={handleSaveSettings}>{t.zapisz_zmiany}</Button></Grid>
            </Grid>
          )}
          {tabIndex === 1 && (
            <List>
              <ListItem><ListItemIcon><Mail color="primary" /></ListItemIcon><ListItemText primary={t.notify_mail} secondary={t.notify_mail_desc} /><Switch checked={settings.notifyMail} onChange={(e) => setSettings({ ...settings, notifyMail: e.target.checked })} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><NotificationsActive color="primary" /></ListItemIcon><ListItemText primary={t.notify_push} secondary={t.notify_push_desc} /><Switch checked={settings.notifyPush} onChange={(e) => setSettings({ ...settings, notifyPush: e.target.checked })} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><EventNote color="primary" /></ListItemIcon><ListItemText primary={t.notify_summary} secondary={t.notify_summary_desc} /><Switch checked={settings.notifyWeekly} onChange={(e) => setSettings({ ...settings, notifyWeekly: e.target.checked })} /></ListItem>
              <ListItem sx={{ justifyContent: 'center', mt: 2 }}><Button variant="contained" onClick={handleSaveSettings}>{t.zapisz_zmiany}</Button></ListItem>
            </List>
          )}
        </Box>
      </Paper>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => setView('MAIN')}>{t.wroc}</Button>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: darkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(25, 118, 210, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}>
              {t.app_name_full}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Chip label={status === 'W PRACY' ? t.w_pracy : t.gotowy} color={status === 'W PRACY' ? 'success' : 'default'} sx={{ fontWeight: 'bold' }} />
            <Box
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, color: 'white',
                cursor: 'pointer', p: 0.5, px: 1.5, borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(1.05)' }
              }}
            >
              <Person />
              <Typography variant="body2" fontWeight="medium">{profile.name || "Użytkownik"}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, borderRadius: 2, minWidth: 220, bgcolor: darkMode ? '#1e1e1e' : '#fff' }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t.powiadomienia.toUpperCase()}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Mail fontSize="small" color="primary" /> E-mail</Typography>
            <Chip size="small" label={settings.notifyMail ? 'ON' : 'OFF'} color={settings.notifyMail ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><NotificationsActive fontSize="small" color="primary" /> Push</Typography>
            <Chip size="small" label={settings.notifyPush ? 'ON' : 'OFF'} color={settings.notifyPush ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EventNote fontSize="small" color="primary" /> Raport</Typography>
            <Chip size="small" label={settings.notifyWeekly ? 'ON' : 'OFF'} color={settings.notifyWeekly ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => { setUserMenuAnchor(null); setView('SETTINGS'); }} sx={{ py: 1.5 }}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          <ListItemText>{t.ustawienia}</ListItemText>
        </MenuItem>
      </Menu>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>{t.dostepnosc}</Typography>
          <ListItem><ListItemIcon><Translate /></ListItemIcon><ListItemText primary={t.jezyk} /><Switch checked={lang === 'EN'} onChange={() => setLang(lang === 'PL' ? 'EN' : 'PL')} /></ListItem>
          <ListItem><ListItemIcon><DarkMode /></ListItemIcon><ListItemText primary={t.tryb} /><Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} /></ListItem>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}><ListItemIcon><TextFields /></ListItemIcon><ListItemText primary={t.czcionka} /></Box>
            <Slider value={fontSize} min={12} max={22} onChange={(e, v) => setFontSize(v)} />
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem button onClick={() => setView('MAIN')} selected={view === 'MAIN'}><ListItemIcon><DashboardIcon /></ListItemIcon><ListItemText primary={t.pulpit} /></ListItem>
            <ListItem button onClick={() => setView('TIMESHEET')} selected={view === 'TIMESHEET'}><ListItemIcon><Assignment /></ListItemIcon><ListItemText primary={t.arkusz} /></ListItem>
            <ListItem button onClick={() => setView('SETTINGS')} selected={view === 'SETTINGS'}><ListItemIcon><Settings /></ListItemIcon><ListItemText primary={t.ustawienia} /></ListItem>
            <ListItem button onClick={handleGeneratePDF}><ListItemIcon><PictureAsPdf color="primary" /></ListItemIcon><ListItemText primary={t.raport} /></ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem button onClick={logout}><ListItemIcon><Logout /></ListItemIcon><ListItemText primary={t.wyloguj} /></ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1, p: 3, minHeight: '100vh',
        backgroundColor: darkMode ? '#0a0a0a' : '#f5f7fa',
        backgroundImage: darkMode
          ? 'radial-gradient(circle at 15% 50%, rgba(25, 118, 210, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(211, 47, 47, 0.08), transparent 25%)'
          : 'radial-gradient(circle at 15% 50%, rgba(25, 118, 210, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(211, 47, 47, 0.05), transparent 25%)',
      }}>
        <Toolbar />
        <Container maxWidth={false} sx={{ maxWidth: '1600px', px: { xs: 2, md: 4 } }}>
          {view === 'MAIN' && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fff', border: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.1)' } }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }}><Assignment /></Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">{t.czas_dzisiaj}</Typography>
                      <Typography variant="h5" fontWeight="bold">{formatMs(stats.todayMs + liveMs)}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fff', border: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.1)' } }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0' }}><EventNote /></Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">{t.w_tym_tygodniu}</Typography>
                      <Typography variant="h5" fontWeight="bold">{formatMs(stats.weekMs + liveMs)}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fff', border: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.1)' } }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: status === 'W PRACY' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)', color: status === 'W PRACY' ? '#2e7d32' : '#ed6c02' }}><NotificationsActive /></Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">{t.biezacy_status}</Typography>
                      <Typography variant="h6" fontWeight="bold" color={status === 'W PRACY' ? 'success.main' : 'text.primary'}>
                        {status === 'W PRACY' ? t.w_pracy : t.gotowy}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: darkMode ? 'rgba(51, 51, 51, 0.6)' : 'rgba(255, 253, 231, 0.8)', borderLeft: '10px solid #fbc02d', borderRadius: 3, backdropFilter: 'blur(10px)' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>{t.pulpit}</Typography>
                <TextField
                  select
                  label={t.tryb_pracy}
                  value={selectedMode}
                  onChange={(e) => {
                    if (status === 'W PRACY') {
                      setSnackbar({ open: true, message: t.mode_change_err, severity: 'error' });
                    } else {
                      setSelectedMode(e.target.value);
                    }
                  }}
                  sx={{ minWidth: 250, mb: 4, display: 'block' }}
                  size="small"
                >
                  <MenuItem value="STACJONARNA">{t.modes.stacjonarna}</MenuItem>
                  <MenuItem value="ZADANIOWA">{t.modes.zadaniowa}</MenuItem>
                  <MenuItem value="ZDALNA">{t.modes.zdalna}</MenuItem>
                  <MenuItem value="ZMIANOWA">{t.modes.zmianowa}</MenuItem>
                  <MenuItem value="NOCNA">{t.modes.nocna}</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => axios.post('/api/time/register', { userId: userId, actionType: 'START', workMode: selectedMode }).then(loadDataFromDB).catch(e => setSnackbar({ open: true, message: e.response?.data?.message || 'Błąd serwera', severity: 'error' }))}
                    disabled={status === 'W PRACY'}
                  >
                    {t.start}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                    onClick={() => axios.post('/api/time/register', {
                      userId: userId,
                      actionType: 'STOP',
                      workMode: selectedMode
                    }).then(loadDataFromDB).catch(e => setSnackbar({ open: true, message: e.response?.data?.message || 'Błąd serwera', severity: 'error' }))}
                    disabled={status !== 'W PRACY'}
                  >
                    {t.stop}
                  </Button>

                  <Button
                    variant="text"
                    color="warning"
                    sx={{ fontWeight: 'bold', ml: 'auto', px: 3 }}
                    onClick={() => handleOpenDialog('RESET_TIME')}
                    startIcon={<DeleteSweep />}
                  >
                    {t.reset_time}
                  </Button>
                </Box>
              </Paper>
              <TableContainer component={Paper}><Table size="small">
                <TableHead><TableRow sx={{ bgcolor: 'action.hover' }}><TableCell>Action</TableCell><TableCell>Server Time</TableCell><TableCell>Mode</TableCell></TableRow></TableHead>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', mb: 2 }}>
                            <DashboardIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                          </Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>{t.pusty_tytul}</Typography>
                          <Typography variant="body1" color="text.secondary">{t.pusty_opis}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell>
                          {/* Jeśli tu masz --- to znaczy, że row.actionType jest puste */}
                          <Chip
                            label={row.actionType || '---'}
                            color={row.actionType === 'START' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              row.workMode === 'STACJONARNA' ? t.modes.stacjonarna :
                                row.workMode === 'ZADANIOWA' ? t.modes.zadaniowa :
                                  row.workMode === 'ZDALNA' ? t.modes.zdalna :
                                    row.workMode === 'ZMIANOWA' ? t.modes.zmianowa :
                                      row.workMode === 'NOCNA' ? t.modes.nocna : '---'
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    )))}
                </TableBody>
              </Table></TableContainer>
            </>
          )}

          {view === 'TIMESHEET' && (
            <>
              <Paper elevation={3} sx={{ p: 4, borderTop: '10px solid #d32f2f', mb: 4, width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>{t.arkusz}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <CalendarMonth color="primary" />
                  <TextField type="date" label={t.data_wyboru} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
                </Box>
                {isHolidaySelected && <Alert severity="error" sx={{ mb: 2, fontWeight: 'bold' }}>{t.holiday_warning}</Alert>}
                {!isHolidaySelected && isWeekend() && <Alert severity="info" icon={<Info />} sx={{ mb: 2, fontWeight: 'bold' }}>{t.weekend_info}</Alert>}

                <Alert severity="success" sx={{ mb: 2 }}>{t.tryb_pracy}: <strong>{t.modes[selectedMode.toLowerCase()]}</strong></Alert>

                {selectedMode === 'ZADANIOWA' ? (
                  <Alert severity="info" sx={{ mb: 2 }}>{t.zadaniowa_info}</Alert>
                ) : (
                  totalHours > 8 ? <Alert severity="error" sx={{ mb: 2 }}>{t.limit_err}</Alert> : <Alert severity="info" sx={{ mb: 2 }}>{t.limit_ok} {totalHours}/8h</Alert>
                )}

                {taskList.map((entry) => (
                  <Box key={entry.id} sx={{ display: 'flex', gap: 2, width: '100%', mb: 2, alignItems: 'center' }}>
                    {/* DZIAŁ - Rozszerzone (flex 4) */}
                    <Box sx={{ flex: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label={t.dzial}
                        value={entry.department}
                        onChange={(e) => handleUpdateTask(entry.id, 'department', e.target.value)}
                      >
                        {Object.keys(t.departmentsData).map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                      </TextField>
                    </Box>

                    {/* ZADANIE - Rozszerzone (flex 4 lub 5) */}
                    <Box sx={{ flex: selectedMode === 'ZADANIOWA' ? 5 : 4, display: 'flex', gap: 1 }}>
                      <TextField
                        select
                        fullWidth
                        label={t.zadanie}
                        value={entry.task}
                        disabled={!entry.department}
                        onChange={(e) => handleUpdateTask(entry.id, 'task', e.target.value)}
                        sx={{ flex: 1 }}
                      >
                        {entry.department && [...(t.departmentsData[entry.department] || []), ...t.commonTasks].map((tn) => <MenuItem key={tn} value={tn}>{tn}</MenuItem>)}
                      </TextField>

                      {entry.task === t.commonTasks[2] && (
                        <TextField
                          fullWidth
                          label={lang === 'PL' ? "Opis zadania (Inne)" : "Task description (Other)"}
                          value={entry.taskDescription || ''}
                          onChange={(e) => handleUpdateTask(entry.id, 'taskDescription', e.target.value)}
                          sx={{ flex: 1 }}
                        />
                      )}
                    </Box>

                    {/* GODZINY - Zwężone (flex 1) */}
                    {selectedMode !== 'ZADANIOWA' && (
                      <Box sx={{ flex: 1, minWidth: '80px' }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="H"
                          value={entry.hours}
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 0) {
                              handleUpdateTask(entry.id, 'hours', val);
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* AKCJE - flex 1 */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '80px' }}>
                      <IconButton color="error" onClick={() => handleRemoveTask(entry.id)} disabled={taskList.length === 1} size="small"><Delete /></IconButton>
                      {(selectedMode === 'ZADANIOWA' || totalHours < 8) && <IconButton color="primary" onClick={() => { setTaskList([...taskList, { id: Date.now(), department: '', task: '', taskDescription: '', hours: 0, location: t.biuro }]) }} size="small"><AddCircle /></IconButton>}
                    </Box>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, bgcolor: '#d32f2f' }}
                  disabled={
                    isHolidaySelected ||
                    (selectedMode !== 'ZADANIOWA' && (totalHours > 8 || totalHours === 0)) ||
                    (selectedMode === 'ZADANIOWA' && taskList.filter(t => t.department && t.task).length === 0)
                  }
                  onClick={handleSaveTimesheet}
                >
                  {t.zapisz}
                </Button>
              </Paper>
              {savedTasks.length > 0 && (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{t.session_title}</Typography>
                    <IconButton size="small" onClick={() => handleOpenDialog('SESSION')} sx={{ color: 'white' }}><DeleteSweep /></IconButton>
                  </Box>
                  <Table size="small">
                    <TableHead><TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell><strong>Data</strong></TableCell>
                      <TableCell><strong>{t.dzial}</strong></TableCell>
                      <TableCell><strong>{t.zadanie}</strong></TableCell>
                      <TableCell><strong>{t.godziny}</strong></TableCell>
                      <TableCell align="right"><strong>Log Time</strong></TableCell>
                    </TableRow></TableHead>
                    <TableBody>{savedTasks.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.task === t.commonTasks[2] && row.taskDescription ? `${row.task} - ${row.taskDescription}` : row.task}</TableCell>
                        <TableCell>
                          {row.workMode === 'ZADANIOWA' ? (
                            <Chip label="-" size="small" color="default" variant="outlined" />
                          ) : (
                            <Chip label={row.hours + "h"} size="small" color="primary" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{row.timestamp}</TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
          {view === 'SETTINGS' && renderSettings()}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent><DialogContentText>{dialog.desc}</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>{t.cancel}</Button>
          <Button onClick={handleConfirmDialog} color="error" autoFocus>{t.confirm}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;