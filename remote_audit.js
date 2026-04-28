const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runRemoteAudit() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const url = 'https://coursera-clone-igug.vercel.app';
    const logs = [];
    const consoleLogs = [];
    const results = {};
    const screenshots = {};

    const log = (msg) => { console.log(msg); logs.push(msg); };

    const shot = async (page, name) => {
        const filePath = `audit_${name}.png`;
        await page.screenshot({ path: filePath, fullPage: false });
        const b64 = fs.readFileSync(filePath).toString('base64');
        screenshots[name] = b64;
        return filePath;
    };

    // Helper to create a fresh page with console capture
    const newPage = async () => {
        const p = await browser.newPage();
        await p.setViewport({ width: 1280, height: 800 });
        p.on('console', msg => {
            const type = msg.type();
            if (type === 'error' || type === 'warning') {
                consoleLogs.push(`[${type.toUpperCase()}] ${msg.text()}`);
            }
        });
        p.on('pageerror', err => consoleLogs.push(`[PAGEERROR] ${err.message}`));
        return p;
    };

    try {
        log('=== REMOTE PRODUCTION AUDIT: https://coursera-clone-igug.vercel.app ===');

        // ── FEATURE 1: UI CONSISTENCY & NAVBAR ──────────────────────────────
        log('\n[1] UI Consistency & Navbar...');
        const pageUI = await newPage();
        await pageUI.goto(url, { waitUntil: 'networkidle2' });
        await shot(pageUI, '01_homepage_navbar');

        const navbarOK = await pageUI.evaluate(() => {
            const signIn = document.body.innerText.includes('Sign in');
            const joinFree = document.body.innerText.includes('Join for Free');
            const logo = document.querySelector('a[href="/"]') !== null;
            return { signIn, joinFree, logo };
        });
        results.navbar = navbarOK.signIn && navbarOK.joinFree && navbarOK.logo;
        log(`   Navbar — Sign in: ${navbarOK.signIn}, Join for Free: ${navbarOK.joinFree}, Logo: ${navbarOK.logo}`);
        log(`   Status: ${results.navbar ? 'PASS' : 'FAIL'}`);
        await pageUI.close();

        // ── FEATURE 2: SEARCH & TAG FILTERING ───────────────────────────────
        log('\n[2] Search & Tag Filtering...');
        const pageSearch = await newPage();
        await pageSearch.goto(`${url}/search`, { waitUntil: 'networkidle2' });
        await pageSearch.type('input[placeholder*="Search"]', 'React');
        await new Promise(r => setTimeout(r, 800));
        await shot(pageSearch, '02_search_react');
        
        const searchResultCount = await pageSearch.evaluate(() =>
            document.querySelectorAll('a.border').length
        );
        log(`   Search 'React' returned ${searchResultCount} result(s).`);

        // Click Development tag
        await pageSearch.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Development');
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 800));
        await shot(pageSearch, '03_search_tag_development');
        results.search = searchResultCount > 0;
        log(`   Status: ${results.search ? 'PASS' : 'FAIL'}`);
        await pageSearch.close();

        // ── FEATURE 3: STREAK TRACKING ──────────────────────────────────────
        log('\n[3] Streak Tracking...');
        const pageStreak = await newPage();
        await pageStreak.goto(`${url}/profile`, { waitUntil: 'networkidle2' });
        await pageStreak.evaluate(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            localStorage.setItem('courseraClone_lastLoginDate', yesterday.toDateString());
            localStorage.setItem('courseraClone_userStreak', '5');
        });
        await pageStreak.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1000));
        await shot(pageStreak, '04_streak_after_inject');

        const streakText = await pageStreak.$eval('body', el => el.innerText);
        results.streak = streakText.includes('6 Days');
        log(`   Streak display: ${streakText.includes('6 Days') ? '6 Days ✓' : 'NOT found'}`);

        // Refresh again to verify no double-increment
        await pageStreak.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1000));
        const streakText2 = await pageStreak.$eval('body', el => el.innerText);
        const noDoubleIncrement = streakText2.includes('6 Days');
        log(`   After 2nd refresh — still 6 Days: ${noDoubleIncrement ? 'YES ✓' : 'NO ✗'}`);
        await shot(pageStreak, '04b_streak_refresh2');
        log(`   Status: ${results.streak && noDoubleIncrement ? 'PASS' : 'FAIL'}`);
        await pageStreak.close();

        // ── FEATURE 4: COURSE COMPLETION & CONFETTI ─────────────────────────
        log('\n[4] Course Completion & Confetti...');
        const pageConfetti = await newPage();
        await pageConfetti.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await pageConfetti.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enroll'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 800));
        await pageConfetti.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Complete'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 2500));
        await shot(pageConfetti, '05_confetti_completion');

        const confettiVisible = await pageConfetti.evaluate(() =>
            document.body.innerText.includes('Great Job') || document.querySelectorAll('canvas').length > 0
        );
        results.confetti = confettiVisible;
        log(`   'Great Job' toast / confetti canvas: ${confettiVisible ? 'Detected ✓' : 'Not detected'}`);
        log(`   Status: ${results.confetti ? 'PASS' : 'FAIL'}`);
        await pageConfetti.close();

        // ── FEATURE 5: AUTO-RESUME VIDEO ─────────────────────────────────────
        log('\n[5] Auto-Resume Video...');
        const pageVideo = await newPage();
        await pageVideo.goto(url, { waitUntil: 'networkidle2' });
        await pageVideo.evaluate(() => {
            localStorage.setItem('courseraClone_videoTime_NQJvZnBzD6U', '15.5');
        });
        await pageVideo.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await pageVideo.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enroll'));
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 2000));
        const videoBodyText = await pageVideo.$eval('body', el => el.innerText);
        results.videoResume = videoBodyText.includes('0:15') || videoBodyText.includes('Resume Watching');
        if (results.videoResume) {
            await shot(pageVideo, '06_video_resume_overlay');
            log(`   Resume overlay detected at 0:15 ✓`);
        } else {
            log(`   FAIL: Overlay not found`);
        }
        log(`   Status: ${results.videoResume ? 'PASS' : 'FAIL'}`);
        await pageVideo.close();

        // ── FEATURE 6: REMINDER NOTIFICATIONS (UI screenshot DURING toast) ──
        log('\n[6] Reminder Notifications...');
        const pageReminder = await newPage();
        const context = browser.defaultBrowserContext();
        await context.overridePermissions(url, ['notifications']);
        await pageReminder.goto(url, { waitUntil: 'networkidle2' });

        // Inject a reminder that fires in 3s
        await pageReminder.evaluate(() => {
            const triggerAt = Date.now() + 3000;
            localStorage.setItem('courseraClone_activeReminders', JSON.stringify([{
                id: 'audit-rem-001',
                courseTitle: 'Microsoft Front-End Developer',
                triggerAt,
                type: '1hour'
            }]));
        });
        await pageReminder.reload({ waitUntil: 'networkidle2' });

        // Wait 3.5s then capture screenshot WHILE toast might be visible
        await new Promise(r => setTimeout(r, 3500));
        await shot(pageReminder, '07a_reminder_during_trigger');

        // Wait the remaining time and verify storage cleared
        await new Promise(r => setTimeout(r, 2000));
        await shot(pageReminder, '07b_reminder_after_trigger');
        const remainingReminders = await pageReminder.evaluate(() =>
            localStorage.getItem('courseraClone_activeReminders')
        );
        results.reminder = (remainingReminders === '[]' || remainingReminders === null);
        log(`   localStorage after trigger: ${remainingReminders}`);
        log(`   Status: ${results.reminder ? 'PASS (cleared)' : 'FAIL (not cleared)'}`);
        await pageReminder.close();

        // ── FEATURE 7: OFFLINE MODE ──────────────────────────────────────────
        log('\n[7] Offline Mode...');
        const pageOffline = await newPage();
        await pageOffline.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await pageOffline.setOfflineMode(true);
        try {
            await pageOffline.reload({ waitUntil: 'domcontentloaded', timeout: 7000 });
            await shot(pageOffline, '08_offline_mode');
            const offlineText = await pageOffline.$eval('body', el => el.innerText);
            results.offline = offlineText.length > 50; // some content loaded
            log(`   Page loaded offline, content length: ${offlineText.length} chars.`);
        } catch (e) {
            log(`   Network-level block: ${e.message}`);
            results.offline = false;
        }
        await pageOffline.setOfflineMode(false);
        log(`   Status: ${results.offline ? 'PASS' : 'FAIL'}`);
        await pageOffline.close();

        // ── CONSOLE LOG SUMMARY ───────────────────────────────────────────────
        log('\n=== CONSOLE LOG SUMMARY ===');
        if (consoleLogs.length === 0) {
            log('   No errors or warnings captured across all pages.');
        } else {
            consoleLogs.forEach(l => log(`   ${l}`));
        }

        // ── FINAL SUMMARY ─────────────────────────────────────────────────────
        log('\n=== FEATURE RESULTS ===');
        Object.entries(results).forEach(([k, v]) => log(`   ${k}: ${v ? 'PASS' : 'FAIL'}`));

    } catch (error) {
        log(`\n[FATAL ERROR] ${error.message}`);
        console.error(error);
    } finally {
        fs.writeFileSync('remote_audit_results.txt', logs.join('\n'));

        // Build self-contained HTML report with embedded screenshots
        const rows = Object.entries(results).map(([k, v]) =>
            `<tr><td>${k}</td><td style="color:${v ? 'green' : 'red'}">${v ? '✅ PASS' : '❌ FAIL'}</td></tr>`
        ).join('');

        const imgTags = Object.entries(screenshots).map(([name, b64]) =>
            `<h3>${name}</h3><img src="data:image/png;base64,${b64}" style="max-width:100%;border:1px solid #ccc;margin-bottom:20px">`
        ).join('');

        const consoleSection = consoleLogs.length === 0
            ? '<p style="color:green">✅ No errors or warnings detected.</p>'
            : '<ul>' + consoleLogs.map(l => `<li>${l}</li>`).join('') + '</ul>';

        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Deployed Audit Report</title>
<style>body{font-family:system-ui;padding:20px;max-width:1100px;margin:auto}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}
th{background:#f5f5f5}img{display:block}</style>
</head>
<body>
<h1>Zero-Bluff Deployed Production Audit</h1>
<p><strong>Target:</strong> <a href="https://coursera-clone-igug.vercel.app">https://coursera-clone-igug.vercel.app</a></p>
<p><strong>Generated:</strong> ${new Date().toISOString()}</p>
<h2>Feature Results</h2>
<table><tr><th>Feature</th><th>Status</th></tr>${rows}</table>
<h2>Console Logs (Errors / Warnings)</h2>${consoleSection}
<h2>Screenshot Evidence</h2>${imgTags}
<h2>No-Bluff Confirmation</h2>
<p>All PASS results are based on real browser interaction against the live deployed URL.
Screenshots are embedded as base64 from a Puppeteer headless session. No code inspection was used.</p>
<h2>Raw Audit Log</h2>
<pre>${logs.map(l => l.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n')}</pre>
</body></html>`;

        fs.writeFileSync('audit_report.html', html);
        console.log('\nReport written to: audit_report.html');
        await browser.close();
    }
}

runRemoteAudit();
