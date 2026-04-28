const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runZeroBluffAudit() {
    console.log('Starting Zero-Bluff Audit v2...');
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const url = 'https://coursera-clone-ten.vercel.app';
    const auditLogs = [];
    const consoleLogs = [];
    const results = {};
    const screenshots = [];

    const log = (msg) => {
        const timestamp = new Date().toISOString();
        const formatted = `[${timestamp}] ${msg}`;
        console.log(formatted);
        auditLogs.push(formatted);
    };

    const takeScreenshot = async (page, name) => {
        const fileName = `zero_bluff_ten_${name}_${Date.now()}.png`;
        const filePath = path.join(process.cwd(), fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        log(`Screenshot taken: ${fileName}`);
        screenshots.push({ name, path: filePath, fileName });
        return filePath;
    };

    const newPage = async () => {
        const p = await browser.newPage();
        await p.setViewport({ width: 1280, height: 800 });
        p.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            consoleLogs.push({ type, text, location: p.url() });
            if (type === 'error' || type === 'warning') {
                log(`[BROWSER ${type.toUpperCase()}] ${text}`);
            }
        });
        p.on('pageerror', err => {
            consoleLogs.push({ type: 'pageerror', text: err.message, location: p.url() });
            log(`[BROWSER PAGEERROR] ${err.message}`);
        });
        return p;
    };

    try {
        log(`=== TARGET: ${url} ===`);

        // 1. Navbar Consistency
        log('Checking Navbar Consistency...');
        const page1 = await newPage();
        await page1.goto(url, { waitUntil: 'networkidle2' });
        await takeScreenshot(page1, 'navbar_consistency');
        const navbarData = await page1.evaluate(() => {
            const signIn = !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Sign in'));
            const joinFree = !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Join for Free'));
            const logo = !!document.querySelector('a[href="/"]');
            return { signIn, joinFree, logo };
        });
        results.navbar = navbarData.signIn && navbarData.joinFree && navbarData.logo;
        log(`Navbar: Sign In=${navbarData.signIn}, Join Free=${navbarData.joinFree}, Logo=${navbarData.logo}`);
        await page1.close();

        // 2. Search & Tag Filtering
        log('Testing Search & Tag Filtering...');
        const page2 = await newPage();
        await page2.goto(`${url}/search`, { waitUntil: 'networkidle2' });
        await page2.type('input[placeholder*="Search"]', 'React');
        await new Promise(r => setTimeout(r, 1000));
        
        // Click Development tag
        await page2.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Development');
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        await takeScreenshot(page2, 'search_tag_react_dev');
        const searchResults = await page2.evaluate(() => document.querySelectorAll('a.border').length);
        results.search = searchResults > 0;
        log(`Search results for React + Development: ${searchResults}`);
        await page2.close();

        // 3. Streak Tracking
        log('Testing Streak Tracking...');
        const page3 = await newPage();
        await page3.goto(`${url}/profile`, { waitUntil: 'networkidle2' });
        await page3.evaluate(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            localStorage.setItem('courseraClone_lastLoginDate', yesterday.toDateString());
            localStorage.setItem('courseraClone_userStreak', '5');
        });
        await page3.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500));
        await takeScreenshot(page3, 'streak_tracking_6days');
        const streakText = await page3.evaluate(() => document.body.innerText);
        results.streak = streakText.includes('6 Days');
        log(`Streak UI shows "6 Days": ${results.streak}`);
        await page3.close();

        // 4. Course Completion & Confetti
        log('Testing Course Completion & Confetti...');
        const page4 = await newPage();
        await page4.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await page4.evaluate(() => {
            const enrollBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enroll'));
            if (enrollBtn) enrollBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        await page4.evaluate(() => {
            const completeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Complete'));
            if (completeBtn) completeBtn.click();
        });
        await new Promise(r => setTimeout(r, 2000));
        await takeScreenshot(page4, 'course_completion_confetti');
        const completionCheck = await page4.evaluate(() => {
            const toast = document.body.innerText.includes('Great Job');
            const canvas = document.querySelectorAll('canvas').length > 0;
            return { toast, canvas };
        });
        results.completion = completionCheck.toast || completionCheck.canvas;
        log(`Completion: Toast=${completionCheck.toast}, Canvas=${completionCheck.canvas}`);
        await page4.close();

        // 5. Video Resume
        log('Testing Video Resume...');
        const page5 = await newPage();
        await page5.goto(url, { waitUntil: 'networkidle2' });
        await page5.evaluate(() => {
            localStorage.setItem('courseraClone_videoTime_NQJvZnBzD6U', '15.5');
        });
        await page5.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await page5.evaluate(() => {
            const enrollBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enroll'));
            if (enrollBtn) enrollBtn.click();
        });
        await new Promise(r => setTimeout(r, 3000));
        await takeScreenshot(page5, 'video_resume_overlay');
        const videoResumeText = await page5.evaluate(() => document.body.innerText);
        results.videoResume = videoResumeText.includes('Resume Watching') || videoResumeText.includes('0:15');
        log(`Video Resume Overlay detected: ${results.videoResume}`);
        await page5.close();

        // 6. Reminder Trigger (UI-VISIBLE PROOF)
        log('Testing Reminder Trigger (Capturing Toast)...');
        const page6 = await newPage();
        await page6.goto(url, { waitUntil: 'networkidle2' });
        await page6.evaluate(() => {
            const triggerAt = Date.now() + 3000;
            localStorage.setItem('courseraClone_activeReminders', JSON.stringify([{
                id: 'zero-bluff-rem',
                courseTitle: 'Microsoft Front-End Developer',
                triggerAt,
                type: '1hour'
            }]));
        });
        await page6.reload({ waitUntil: 'networkidle2' });
        log('Waiting for reminder trigger (5s)...');
        await new Promise(r => setTimeout(r, 4000)); // Wait for trigger + animation
        await takeScreenshot(page6, 'reminder_toast_visible');
        const reminderToastVisible = await page6.evaluate(() => {
            // Search for toast content in DOM
            return document.body.innerText.includes('Time to study') || 
                   document.body.innerText.includes('Microsoft Front-End');
        });
        results.reminder = reminderToastVisible;
        log(`Reminder Toast Visible in UI: ${reminderToastVisible}`);
        await page6.close();

        // 7. Offline Resilience
        log('Testing Offline Resilience...');
        const page7 = await newPage();
        await page7.goto(`${url}/course/microsoft-front-end`, { waitUntil: 'networkidle2' });
        await page7.setOfflineMode(true);
        try {
            await page7.reload({ waitUntil: 'domcontentloaded', timeout: 5000 });
            await takeScreenshot(page7, 'offline_resilience');
            const offlineContent = await page7.evaluate(() => document.body.innerText.length);
            results.offline = offlineContent > 100;
            log(`Offline Content Loaded: ${offlineContent} chars`);
        } catch (e) {
            log(`Offline Load Failed: ${e.message}`);
            results.offline = false;
        }
        await page7.setOfflineMode(false);
        await page7.close();

    } catch (error) {
        log(`FATAL ERROR: ${error.message}`);
        console.error(error);
    } finally {
        log('Audit Finished. Saving logs...');
        fs.writeFileSync('zero_bluff_ten_audit_logs.txt', auditLogs.join('\n'));
        fs.writeFileSync('zero_bluff_ten_console_summary.json', JSON.stringify(consoleLogs, null, 2));
        fs.writeFileSync('zero_bluff_ten_results.json', JSON.stringify(results, null, 2));
        
        const screenshotData = screenshots.map(s => `[${s.name}]: ${s.fileName}`).join('\n');
        fs.writeFileSync('zero_bluff_ten_screenshots.txt', screenshotData);
        
        console.log('Results saved to zero_bluff_ten_*.json/txt');
        await browser.close();
    }
}

runZeroBluffAudit();
