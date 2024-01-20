const setupApp = require('../app');

const app = setupApp();

const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


module.exports = app;