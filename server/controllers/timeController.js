const TimeRecord = require('../models/TimeRecord');

exports.registerEvent = async (req, res) => {
  try {
    console.log("Odebrano dane:", req.body); // To pokaże co przysłał React

    const newRecord = new TimeRecord({
      userId: req.body.userId || "65955a8e1234567890abcdef", // Musi być poprawny format MongoDB ID!
      actionType: req.body.actionType,
      metadata: {
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
      }
    });

    await newRecord.save();
    console.log("Zapisano pomyślnie!");
    res.status(201).json({ message: "Zdarzenie zarejestrowane", data: newRecord });
  } catch (error) {
    console.error("BŁĄD WALIDACJI:", error.message);
    res.status(400).json({ message: "Błąd walidacji danych", error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // Pobiera 10 ostatnich wpisów dla danego użytkownika
    const history = await TimeRecord.find({ userId: req.params.userId })
                                    .sort({ timestamp: -1 })
                                    .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja pobierająca historię zdarzeń dla użytkownika
exports.getHistory = async (req, res) => {
  try {
    const history = await TimeRecord.find({ userId: req.params.userId })
                                    .sort({ timestamp: -1 }) // od najnowszych
                                    .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Błąd pobierania historii", error: error.message });
  }
};

// Funkcja usuwająca całą historię danego użytkownika
exports.clearHistory = async (req, res) => {
  try {
    await TimeRecord.deleteMany({ userId: req.params.userId });
    res.json({ message: "Historia została pomyślnie wyczyszczona." });
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas usuwania historii", error: error.message });
  }
};