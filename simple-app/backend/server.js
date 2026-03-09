const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const tenantId = "common";
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"]
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = decoded;
      next();
    }
  );
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the public Express backend!"
  });
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user?.preferred_username || "user"}, this is protected data from the backend.`
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});