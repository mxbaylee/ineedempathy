# 🤪 Baylee's Open Source Template

This template allows you to build TypeScript React applications that compile to
gh-pages easily!

# 💫 Using this template

Clone the template

```
git clone git@github.com:mxbaylee/github-page-template.git PROJECT_NAME
cd PROJECT_NAME
```

Update the port

```
npm run reroll-port
npm pkg set 'homepage'='/'$(basename "$PWD")
```

Update git

```
rm -rf .git
git init
git add --all
git commit -m '🥳 Initial commit'
git remote add origin PROJECT_ORIGIN
git push
```

Initial deploy

```
npm install
npm run deploy
```


# 💻 Logistically

🤖 To run

```
npm install
npm start
```

📦 To deploy

```
npm run deploy
```
