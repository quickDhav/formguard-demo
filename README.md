# FormGuard Demo Application 🚀

This is a companion React demonstration application for the **[formguard-js](https://github.com/your-username/formguard-js)** NPM package.

It showcases real-time validation, password strength meters, comprehensive error messaging, and form orchestration using FormGuard.js.

## 🛠️ How to Run Locally

### 1. Link or Install the Local Package

In development before publishing to the NPM registry, this demo links directly to the local package:

```bash
cd formguard-demo
npm install
```

> **Note:** The `package.json` references `"formguard-js": "file:../formguard-js"`, which mirrors the exact behavior of an installed NPM package!

### 2. Once Published on NPM

Once `formguard-js` is published on NPM, you can install it directly like any standard package:

```bash
npm install formguard-js
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the interactive demo!

## 🧪 What This Demo Tests

- ✅ **Name Input**: Minimum 3 characters, required check.
- ✅ **Email Input**: Format and RFC 5322 compliance check.
- ✅ **Phone Input**: International format and minimum 10 digits check.
- ✅ **Password Input**: Real-time strength meter (Score 0-4), uppercase, lowercase, number, special char checks.
- ✅ **Confirm Password Input**: Cross-field comparison validator.
- ✅ **Form Orchestration**: `validateForm` execution upon submission.
- ✅ **Success State**: Clear feedback upon valid submission.

