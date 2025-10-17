# GoDeeper Legal Documents

This folder contains the legal documents for the GoDeeper app:
- Privacy Policy
- Terms of Service

## Hosting on GitHub Pages

To host these documents for your app:

1. **Create a new GitHub repository** (e.g., `godeeper-legal`)

2. **Push these HTML files** to the repository:
   ```bash
   cd docs/legal
   git init
   git add .
   git commit -m "Add legal documents"
   git remote add origin https://github.com/YOUR_USERNAME/godeeper-legal.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

4. **Your documents will be available at**:
   - https://YOUR_USERNAME.github.io/godeeper-legal/
   - https://YOUR_USERNAME.github.io/godeeper-legal/privacy-policy.html
   - https://YOUR_USERNAME.github.io/godeeper-legal/terms-of-service.html

5. **Update the app** with these URLs in:
   - `src/components/auth/AuthScreen.tsx` - Footer links
   - `src/app/(tabs)/settings.tsx` - Legal links in preferences tab

## Alternative: Use a Custom Domain

If you have a domain (e.g., godeeper.app), you can:
1. Add a CNAME file to this directory with your domain
2. Configure DNS with your provider
3. URLs become:
   - https://godeeper.app/privacy-policy.html
   - https://godeeper.app/terms-of-service.html

## Updating Documents

When you update the legal documents:
1. Update the "Last Updated" date
2. Commit and push changes
3. GitHub Pages will automatically rebuild (takes 1-5 minutes)

## Important Notes

- These documents are templates and should be reviewed by a lawyer
- Update contact email addresses before publishing
- Ensure all features mentioned match your actual app implementation
- Review privacy practices with your actual data handling

