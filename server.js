/* ========================================
   Apex Studio — Express Server
   ======================================== */

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

/* --- Ensure data directory exists --- */
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/* --- Security Headers --- */
app.use(
    helmet({
        contentSecurityPolicy: false,       // Allow inline styles/scripts during dev
        crossOriginEmbedderPolicy: false,   // Allow Google Fonts
    })
);

/* --- Gzip Compression --- */
app.use(compression());

/* --- Body Parser --- */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form submissions

/* --- Static Files --- */
app.use(
    express.static(path.join(__dirname, 'public'), {
        maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
        etag: true,
    })
);

/* --- Netlify Form Simulation (Localhost Only) --- */
app.post('/', (req, res) => {
    const formName = req.body['form-name'];

    if (formName === 'contact') {
        const { name, email, phone, company, message } = req.body;
        console.log(`\n  📩  [Local Form Test] New Contact:`);
        console.log(`      Name: ${name}`);
        console.log(`      Email: ${email}`);
        console.log(`      Message: ${message}\n`);

        // Save to file like before for local records
        const filePath = path.join(DATA_DIR, 'contacts.json');
        let contacts = [];
        try {
            if (fs.existsSync(filePath)) contacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (_) { }

        contacts.push({ id: Date.now(), ...req.body, submittedAt: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

        return res.status(200).send('Form submission simulated successfully');
    }

    if (formName === 'newsletter') {
        const { email } = req.body;
        console.log(`\n  📬  [Local Form Test] New Subscriber: ${email}\n`);

        const filePath = path.join(DATA_DIR, 'subscribers.json');
        let subscribers = [];
        try {
            if (fs.existsSync(filePath)) subscribers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (_) { }

        subscribers.push({ email, subscribedAt: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

        return res.status(200).send('Subscription simulated successfully');
    }

    res.status(404).send('Unknown form');
});

/* --- Legacy API Routes (Deprecated) --- */
/*
app.post('/api/contact', (req, res) => {
    // ... legacy logic ...
    res.status(410).json({ error: 'Endpoint deprecated. submitting to /' });
});

app.post('/api/newsletter', (req, res) => {
    // ... legacy logic ...
    res.status(410).json({ error: 'Endpoint deprecated. submitting to /' });
});
*/
/* --- 404 Handler --- */
app.use((_req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

/* --- Start Server --- */
app.listen(PORT, () => {
    console.log(`\n  ✦  Apex Studio is live at http://localhost:${PORT}\n`);
});
