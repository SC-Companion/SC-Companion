const fs = require("fs");
const path = require("path");

const sessionDir = path.join(__dirname, "../sessions");
const sessionPath = path.join(sessionDir, "session.json");

// Créer le répertoire sessions s'il n'existe pas
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

function readSession() {
  // Vérifier si le fichier de session existe
  if (!fs.existsSync(sessionPath)) {
    // Créer un fichier de session par défaut
    const defaultSession = { loggedIn: false, user: null };
    writeSession(defaultSession);
    return defaultSession;
  }

  const raw = fs.readFileSync(sessionPath, "utf8");
  return JSON.parse(raw);
}

function writeSession(session) {
  fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
}

exports.login = (user) => {
  writeSession({ loggedIn: true, user });
};

exports.logout = () => {
  writeSession({ loggedIn: false, user: null });
};

exports.isLoggedIn = () => readSession().loggedIn;
exports.getUser = () => readSession().user;
