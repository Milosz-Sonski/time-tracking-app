import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  ListItem, ListItemIcon, ListItemText, Switch, Slider, 
  Button, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Container, TextField, Grid, MenuItem, Tabs, Tab, IconButton, Alert, Snackbar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  PlayArrow, Stop, DarkMode, TextFields, History, Settings, 
  DeleteForever, PictureAsPdf, Assignment, Person, Notifications, Dashboard as DashboardIcon, Translate, AddCircle, Delete, Mail, NotificationsActive, EventNote, DeleteSweep, CalendarMonth, Info
} from '@mui/icons-material';
import axios from 'axios';

// POPRAWIONE IMPORTY DLA PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const drawerWidth = 280;

// Funkcja pomocnicza do czyszczenia polskich znaków (zapobiega krzakom w PDF)
const replacePolishChars = (text) => {
  return text
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/Ą/g, 'A').replace(/Ć/g, 'C').replace(/Ę/g, 'E')
    .replace(/Ł/g, 'L').replace(/Ń/g, 'N').replace(/Ó/g, 'O')
    .replace(/Ś/g, 'S').replace(/Ź/g, 'Z').replace(/Ż/g, 'Z');
};

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
    }
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
    }
  }
};

const Dashboard = ({ darkMode, setDarkMode, fontSize, setFontSize }) => {
  const [lang, setLang] = useState('PL');
  const t = translations[lang];
  const [view, setView] = useState('MAIN'); 
  const [tabIndex, setTabIndex] = useState(0);
  const [status, setStatus] = useState('OFFLINE');
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({ name: "Milosz", position: "Inzynier Systemu" });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskList, setTaskList] = useState([{ id: Date.now(), department: '', task: '', hours: 0, location: '' }]);
  const [totalHours, setTotalHours] = useState(0);
  const [savedTasks, setSavedTasks] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialog, setDialog] = useState({ open: false, type: '', title: '', desc: '' });

  const testUserId = "65955a8e1234567890abcdef";

  useEffect(() => {
    const sum = taskList.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
    setTotalHours(sum);
  }, [taskList]);

  useEffect(() => {
    setTaskList([{ id: Date.now(), department: '', task: '', hours: 0, location: t.biuro }]);
  }, [lang, t.biuro]);

  const loadDataFromDB = useCallback(async () => {
    try {
      const res = await axios.get(`/api/time/history/${testUserId}`);
      setHistory(res.data);
      if (res.data.length > 0) {
        setStatus(res.data[0].actionType === 'START' ? 'W PRACY' : 'ZAKONCZONO');
      }
    } catch (err) { console.error(err); }
  }, [testUserId]);

  useEffect(() => { loadDataFromDB(); }, [loadDataFromDB]);

  // NAPRAWIONA FUNKCJA GENEROWANIA PDF
  const handleGeneratePDF = () => {
    if (savedTasks.length === 0) {
      setSnackbar({ open: true, message: t.pdf_error, severity: 'warning' });
      return;
    }

    try {
      const doc = jsPDF();
      const tableColumn = [
        replacePolishChars(lang === 'PL' ? "Data" : "Date"),
        replacePolishChars(lang === 'PL' ? "Dzial" : "Department"),
        replacePolishChars(lang === 'PL' ? "Zadanie" : "Task"),
        replacePolishChars(lang === 'PL' ? "Godziny" : "Hours"),
        replacePolishChars(lang === 'PL' ? "Lokalizacja" : "Location")
      ];
      
      const tableRows = savedTasks.map(task => [
        task.date,
        replacePolishChars(task.department),
        replacePolishChars(task.task),
        `${task.hours}h`,
        replacePolishChars(task.location)
      ]);

      doc.setFontSize(18);
      doc.text(replacePolishChars(t.raport), 14, 20);
      doc.setFontSize(11);
      doc.text(replacePolishChars(`${lang === 'PL' ? 'Pracownik' : 'Employee'}: ${profile.name} (${profile.position})`), 14, 30);
      doc.text(replacePolishChars(`${lang === 'PL' ? 'Wygenerowano' : 'Generated'}: ${new Date().toLocaleString()}`), 14, 36);

      // BEZPIECZNE WYWOLANIE autoTable JAKO FUNKCJI
      autoTable(doc, { 
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { 
            fillColor: darkMode ? [44, 44, 44] : [211, 47, 47],
            textColor: [255, 255, 255]
        },
        styles: { fontSize: 9 }
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

  const handleSaveTimesheet = () => {
    if (isHolidaySelected) { setSnackbar({ open: true, message: t.holiday_err, severity: 'error' }); return; }
    if (totalHours > 8) { setSnackbar({ open: true, message: t.limit_err, severity: 'error' }); return; }

    const newEntries = [];
    let hasDuplicate = false;

    taskList.filter(e => e.hours > 0).forEach(e => {
      const isDuplicate = savedTasks.some(saved => 
        saved.department === e.department && saved.task === e.task && saved.date === selectedDate
      );
      if (isDuplicate) hasDuplicate = true;
      else newEntries.push({ ...e, date: selectedDate, timestamp: new Date().toLocaleTimeString() });
    });

    if (hasDuplicate) setSnackbar({ open: true, message: t.duplicate_err, severity: 'warning' });

    if (newEntries.length > 0) {
      setSavedTasks(prev => [...newEntries, ...prev]);
      setTaskList([{ id: Date.now(), department: '', task: '', hours: 0, location: t.biuro }]);
      setSnackbar({ open: true, message: t.save_success, severity: 'success' });
    }
  };

  const handleOpenDialog = (type) => {
    const config = type === 'SESSION' 
      ? { title: t.session_clear, desc: t.session_clear_desc }
      : { title: t.wymaz, desc: t.history_clear_desc };
    setDialog({ open: true, type, ...config });
  };

  const handleConfirmDialog = async () => {
    if (dialog.type === 'SESSION') setSavedTasks([]);
    else {
      try {
        await axios.delete(`/api/time/clear/${testUserId}`);
        setHistory([]); setStatus('OFFLINE');
      } catch (error) { console.error(error); }
    }
    setDialog({ ...dialog, open: false });
  };

  const handleUpdateTask = (id, field, value) => {
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
              <Grid item xs={12} md={6}><TextField fullWidth label="Imie" value={profile.name} onChange={(e)=>setProfile({...profile, name: e.target.value})} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Stanowisko" value={profile.position} /></Grid>
              <Grid item xs={12}><Button variant="contained">Zapisz Zmiany</Button></Grid>
            </Grid>
          )}
          {tabIndex === 1 && (
            <List>
              <ListItem><ListItemIcon><Mail color="primary" /></ListItemIcon><ListItemText primary={t.notify_mail} secondary={t.notify_mail_desc} /><Switch defaultChecked /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><NotificationsActive color="primary" /></ListItemIcon><ListItemText primary={t.notify_push} secondary={t.notify_push_desc} /><Switch /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><EventNote color="primary" /></ListItemIcon><ListItemText primary={t.notify_summary} secondary={t.notify_summary_desc} /><Switch defaultChecked /></ListItem>
            </List>
          )}
        </Box>
      </Paper>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => setView('MAIN')}>Back</Button>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zPrefix: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t.title} v1.8</Typography>
          <Chip label={status} color={status === 'W PRACY' ? 'success' : 'default'} size="small" />
        </Toolbar>
      </AppBar>

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
            <ListItem button onClick={() => handleOpenDialog('HISTORY')} sx={{ color: 'error.main' }}><ListItemIcon><DeleteForever color="error" /></ListItemIcon><ListItemText primary={t.wymaz} /></ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        <Container maxWidth="xl">
          {view === 'MAIN' && (
            <>
              <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#333' : '#fffde7', borderLeft: '10px solid #fbc02d' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t.pulpit}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" color="success" onClick={() => axios.post('/api/time/register', {userId: testUserId, actionType: 'START'}).then(loadDataFromDB)} disabled={status === 'W PRACY'}>{t.start}</Button>
                  <Button variant="contained" color="error" onClick={() => axios.post('/api/time/register', {userId: testUserId, actionType: 'STOP'}).then(loadDataFromDB)} disabled={status !== 'W PRACY'}>{t.stop}</Button>
                </Box>
              </Paper>
              <TableContainer component={Paper}><Table size="small">
                <TableHead><TableRow sx={{ bgcolor: 'action.hover' }}><TableCell>Action</TableCell><TableCell>Server Time</TableCell></TableRow></TableHead>
                <TableBody>{history.map((row) => (<TableRow key={row._id}><TableCell>{row.actionType}</TableCell><TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell></TableRow>))}</TableBody>
              </Table></TableContainer>
            </>
          )}

          {view === 'TIMESHEET' && (
            <>
              <Paper elevation={3} sx={{ p: 4, borderTop: '10px solid #d32f2f', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{t.arkusz}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <CalendarMonth color="primary" />
                  <TextField type="date" label={t.data_wyboru} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
                </Box>
                {isHolidaySelected && <Alert severity="error" sx={{ mb: 2, fontWeight: 'bold' }}>{t.holiday_warning}</Alert>}
                {!isHolidaySelected && isWeekend() && <Alert severity="info" icon={<Info />} sx={{ mb: 2, fontWeight: 'bold' }}>{t.weekend_info}</Alert>}
                {totalHours > 8 ? <Alert severity="error" sx={{ mb: 2 }}>{t.limit_err}</Alert> : <Alert severity="info" sx={{ mb: 2 }}>{t.limit_ok} {totalHours}/8h</Alert>}
                
                {taskList.map((entry) => (
                  <Grid container spacing={2} key={entry.id} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid item xs={12} md={4}>
                      <TextField select fullWidth label={t.dzial} value={entry.department} onChange={(e) => handleUpdateTask(entry.id, 'department', e.target.value)}>
                        {Object.keys(t.departmentsData).map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField select fullWidth label={t.zadanie} value={entry.task} disabled={!entry.department} onChange={(e) => handleUpdateTask(entry.id, 'task', e.target.value)}>
                        {entry.department && [...t.departmentsData[entry.department], ...t.commonTasks].map((tn) => <MenuItem key={tn} value={tn}>{tn}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={4} md={1.5}><TextField fullWidth type="number" label={t.godziny} value={entry.hours} onChange={(e) => handleUpdateTask(entry.id, 'hours', e.target.value)} /></Grid>
                    <Grid item xs={4} md={2}>
                      <TextField select fullWidth label="Location" value={entry.location} onChange={(e)=>handleUpdateTask(entry.id, 'location', e.target.value)}>
                        <MenuItem value={t.biuro}>{t.biuro}</MenuItem><MenuItem value={t.zdalnie}>{t.zdalnie}</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={4} md={1.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton color="error" onClick={() => handleRemoveTask(entry.id)} disabled={taskList.length === 1}><Delete /></IconButton>
                      {totalHours < 8 && <IconButton color="primary" onClick={() => { setTaskList([...taskList, { id: Date.now(), department: '', task: '', hours: 0, location: t.biuro }]) }}><AddCircle /></IconButton>}
                    </Grid>
                  </Grid>
                ))}
                <Button variant="contained" fullWidth size="large" sx={{ mt: 2, bgcolor: '#d32f2f' }} disabled={totalHours > 8 || totalHours === 0 || isHolidaySelected} onClick={handleSaveTimesheet}>{t.zapisz}</Button>
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
                        <TableCell>{row.task}</TableCell>
                        <TableCell><Chip label={row.hours + "h"} size="small" color="primary" variant="outlined" /></TableCell>
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