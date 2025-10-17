#!/bin/bash
# Deploy legal documents to GitHub Pages

echo "📄 Deploying legal documents to GitHub Pages..."

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "✅ gh-pages branch exists"
else
  echo "Creating gh-pages branch..."
  git checkout --orphan gh-pages
  git reset --hard
  git commit --allow-empty -m "Initialize gh-pages"
  git push origin gh-pages
  git checkout main
fi

# Create temporary directory
mkdir -p .gh-pages-temp
cp docs/legal/*.html .gh-pages-temp/
cp docs/legal/index.html .gh-pages-temp/ 2>/dev/null || echo "<html><head><meta http-equiv='refresh' content='0;url=privacy-policy.html'></head></html>" > .gh-pages-temp/index.html

# Switch to gh-pages and deploy
git checkout gh-pages
cp -r .gh-pages-temp/* .
git add *.html
git commit -m "Update legal documents"
git push origin gh-pages
git checkout main
rm -rf .gh-pages-temp

echo "✅ Legal documents deployed!"
echo "📍 Your documents will be available at:"
echo "   https://gjw411.github.io/loved-up-clean/privacy-policy.html"
echo "   https://gjw411.github.io/loved-up-clean/terms-of-service.html"
