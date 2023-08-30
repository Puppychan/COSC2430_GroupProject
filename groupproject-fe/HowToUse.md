# Project Structure

```js
├── README.md
├── common
│   ├── constants.js
│   ├── helpers.js - store functions that can reuse in this project only
│   └── utils.js - store functions that can reuse in other projects
├── models - name all files in this folder following format `*.model.js`
│   └── example.model.js
├── modules - name all files in this folder following format `*.module.js`
│   └── example.module.js
├── package-lock.json
├── package.json
├── public - Folder to store static files: css, images, favicon
│   ├── resources - Only store regularly used images (favicon, logo, etc)
│   └── style - Store css or styling files
└── views - Store html files as ejs format files
    ├── home
    ├── layout.ejs
    └── partials - Store reusable components
        └── head.ejs
```

- Images:

  - If images are not regularly used:
    - Host only using: [https://imgbox.com/](https://imgbox.com/)
    - Can use only free resources:
      - [https://source.unsplash.com/random](https://source.unsplash.com/random)
        `https://source.unsplash.com/random?name&1`
  - If are regularly used: add to `/public/resources/...`
- Icon:
  - Use [Font Awesome](https://fontawesome.com/)
