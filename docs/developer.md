
# Developer guide

## <a name="setup"></a> Setup your development environment

1. Make sure you have `node` installed and `npm` v7 or above.
2. Fork the `aurelia-mdc-web` repo on GitHub.
3. Clone your fork to your machine with `git clone`.
4. From the root of the project, run `npm i` to install the dependencies.

## <a name="demo-server"></a> Run demo application
From the root of the project,
```
npm start
```
After your development server is running, open a browser to url: http://localhost:8080

## <a name="deploy"></a> Deploy demo application
From the root of the project,
```
npm run deploy # Builds and deploy the demo application
```

## <a name="lint"></a> Linting
From the root of the project,
```
npm run lint # Lints typescript using eslint
```

## <a name="build"></a> Build release
From the root of the project,
```
npm run build # Builds Aurelia MDC inside of /packages/**/dist
```

## <a name="code-style"></a> Code Style
We follow
* [eslint rules](https://github.com/aurelia-ui-toolkits/aurelia-mdc-web/blob/master/.eslintrc.js)
