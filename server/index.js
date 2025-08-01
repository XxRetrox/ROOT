import express from "express";
import cors from "cors";
import env from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cookieParser from "cookie-parser";

const pgSession = connectPgSimple(session);
const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://notetable.netlify.app",
    "https://keeper-tr1n.onrender.com",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

env.config();
const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {},
});

app.set("trust proxy", 1);

app.use(
  session({
    name: "sid",
    store: new pgSession({
      pool: db,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 17280000,
      sameSite: "none",
    },
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (!req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use((req, res, next) => {
  // This will run on every request *after* session middleware has run
  console.log(
    "After session middleware, req.session:",
    JSON.stringify(req.session)
  );
  if (req.session && req.session.userId) {
    console.log(
      "userId found in session after middleware:",
      req.session.userId
    );
  } else {
    console.log("userId NOT found in session after middleware.");
  }
  next();
});
const port = 5000;

const saltRounds = Number(process.env.SALTROUNDS);

async function testDbConnection() {
  try {
    const client = await db.connect(); // Try to get a client from the pool
    console.log("Successfully connected to PostgreSQL!");
    client.release(); // Release the client back to the pool
    return true;
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
    return false;
  }
}

// How to use it (you can call this in your server's startup)
testDbConnection().then((isConnected) => {
  if (!isConnected) {
    console.log(
      "Database connection failed at startup. Application may not function correctly."
    );
    // You might want to exit the process or take other actions here
  }
});

app.get("/test-cookie", (req, res) => {
  res.cookie("testcookie", "123abc", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 5, // 5 minutes
  });
  res.status(200).json({ message: "Cookie should be set" });
});

app.post("/api/register", async (req, res) => {
  var { email_1, password } = req.body;

  const email = email_1.trim();

  try {
    const hashedPass = await bcrypt.hash(password, saltRounds);
    try {
      console.log("Attempting to register user with email:", email);
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
        [email, hashedPass]
      );
      console.log("User registered successfully:", result.rows[0]);
      return res
        .status(201)
        .json({ message: "Registration successful", user: result.rows[0].id });
    } catch (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ errMessage: "This email already has an account with us" });
      }
      console.error("nothin was inserted:", error);
    }
  } catch (error) {
    console.error("Error hashing password:", error);
  }
});

app.post("/api/login", async (req, res) => {
  var { email_1, password } = req.body;

  const email = email_1.trim();

  try {
    console.log("Geting user INFO for: ", email);
    const result = await db.query(
      "SELECT password, id FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "This email doesn't have an account with us" });
    } else {
      try {
        const storedPassword = result.rows[0].password;
        const isValid = await bcrypt.compare(password, storedPassword);
        if (isValid) {
          req.session.userId = result.rows[0].id;
          req.session.username = email;
          console.log("Login successful", req.session.userId);
          req.session.touch();
          req.session.save((err) => {
            if (err) {
              console.error("Error saving session:", err);
              return res
                .status(500)
                .json({ message: "Failed to save session" });
            }

            res.cookie("debug-session", "test", {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });
            console.log("Session saved, sending response");
            console.log("Response headers:", res.getHeaders());
            console.log(
              "Set-Cookie Header (manual):",
              res.getHeader("Set-Cookie")
            );

            // If save is successful, then send the response
            return res.status(200).json({
              message: "Login successful",
              user: result.rows[0].id,
            });
          });
        } else {
          return res.status(401).json({ message: "incorrect password" });
        }
      } catch (error) {
        console.error("Error comparing passwords", error);
        return res.status(400).json({ message: "Error comparing passwords" });
      }
    }
  } catch (error) {
    console.error("network failure", error);
    return res.status(500).json({ message: "Unable to connect to postgres" });
  }
});

app.post("/api/postnote", async (req, res) => {
  var { user_id, title, content } = req.body;

  var title1 = title.trim();
  var content1 = content.trim();

  if (title1 === "") {
    title1 = "Untitled";
  }

  try {
    console.log("Posting notes:", user_id, title, content);
    const result = await db.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING note_id, title, content, created_at",
      [user_id, title1, content1]
    );
    console.log("Post successful:", result.rows[0].note_id);
    return res.status(201).json({
      note_id: result.rows[0].note_id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      created_at: result.rows[0].created_at,
    });
  } catch (error) {
    if (error.code === 23502) {
      return res
        .status(404)
        .json({ message: "The note content can not be left empty" });
    }
    console.error("Error handling post note:", error);
  }
});

app.delete("/api/keeper/:note_id", async (req, res) => {
  var note_id = req.params.note_id;
  console.log(note_id);

  try {
    console.log("Attempting to delete note with:", note_id);
    const result = await db.query("DELETE FROM notes WHERE note_id = $1", [
      note_id,
    ]);
    console.log("Delete Successful");
    return res.status(200).json({ message: "Succeessful" });
  } catch (error) {
    console.error("Delete action failed:", error);
  }
});

app.get("/api/keeper/:user_id", async (req, res) => {
  console.log(req.session);
  console.log(req.session.userId);
  if (req.session.userId) {
    const { user_id } = req.params;

    try {
      console.log("Getting user's notes:", user_id);
      const result = await db.query(
        "SELECT note_id, title, content, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
      );
      console.log("query successful");
      console.log(result.rows);
      return res.status(200).json({
        message: "notes retrived successfully",
        notes: result.rows,
        is_logged: true,
      });
    } catch (error) {
      console.error("Failed to retrive notes:", error);
    }
  } else {
    res.status(401).json({ is_logged: false });
  }
});

app.get("/api/check-auth", (req, res) => {
  console.log("Checking auth for session:", req.session);
  if (req.session && req.session.userId) {
    return res.status(200).json({
      is_logged: true,
      userId: req.session.userId,
    });
  } else {
    // No valid session, user is not logged in
    return res.status(401).json({
      is_logged: false,
      message: "Not authenticated or session expired",
    });
  }
});

app.post("/api/log-out", (req, res) => {
  console.log("Logging out user");
  req.session.destroy((error) => {
    if (error) {
      console.log("Error login out:", error);
    } else {
      res.clearCookie("connect.sid", { path: "/" });
      console.log("Logged out successful");
      console.log(req.session);
      return res.status(200).json({ msg: "Logged out successful" });
    }
  });
});

app.patch("/api/update-note/:note_id", async (req, res) => {
  var note_id = req.params.note_id;
  var { title, content } = req.body;
  console.log(note_id);

  console.log(req.session);
  console.log(req.session.userId);

  if (req.session && req.session.userId) {
    try {
      console.log("Attempting to update note with:", note_id);
      const result = await db.query(
        "UPDATE notes SET title = $1, content = $2 WHERE note_id = $3",
        [title, content, note_id]
      );
      console.log("Update Successful");
      return res.status(200).json({ message: "Note Updated" });
    } catch (error) {
      console.error("Update action failed:", error);
    }
  } else {
    res.status(401).json({ is_logged: false });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
