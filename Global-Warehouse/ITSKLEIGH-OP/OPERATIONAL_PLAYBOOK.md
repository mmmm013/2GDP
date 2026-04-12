# 📘 ITSKLEIGH / 2KLEIGH.COM OPERATIONAL PLAYBOOK
**Version:** BIC-1.0 (Best In Class)
**Last Updated:** January 13, 2026

## 1. BRANDING HIERARCHY (The "Two-Tier" Rule)
* **Tier 1 (Corporate):** G Putnam Music, LLC (GPM). Must appear at the top of the interface (Logo). This is the legal entity for tax/liability.
* **Tier 2 (Product):** KLEIGH. The vocalist brand. Represented by the "Morning High Energy" stream and the QR Code.
* **Rule:** Never remove the GPM Logo; it anchors the S-Corp ownership.

## 2. COMMERCE & FINANCE
* **Model:** Sponsorship (Not Subscription).
* **Call to Action:** "Sponsor CUBs".
* **Gateway:** Stripe.
* **Reporting:** All revenue from this site must be tagged "KLEIGH_PROJECT" in the Monthly Financial Report (Run on the 3rd Wednesday of every month).

## 3. ASSET MANAGEMENT ("The Mirror Rule")
* **Storage:** All source files (images, audio) reside in `Global-Warehouse`.
* **Deployment:** Assets are moved to `public/` in the codebase for deployment.
* **Sync:** If you add a file to `Global-Warehouse`, you must update this Playbook or the Manifest in "SB".

## 4. DEPLOYMENT PROTOCOL
1.  **Code Change:** Make edits in `components/Hero.tsx`.
2.  **Visual Check:** Ensure Logo and QR are in `public/`.
3.  **Command:** `git add . && git commit -m "update message" && git push origin main`
4.  **Verification:** Check 2kleigh.com for Logo, Audio, and Stripe Link.

## 5. EMERGENCY ROLLBACK
If the site breaks:
1.  Go to Vercel Dashboard.
2.  Click "Deployments".
3.  Find the last Green deployment.
4.  Click the three dots (...) -> "Redeploy" or "Promote to Production".
