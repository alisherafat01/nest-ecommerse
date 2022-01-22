import * as mongoose from 'mongoose';
global.beforeEach(async () => {
  try {
    // something to be called before every e2e test (like new fresh DB,...)
  } catch (err) {}
});

global.afterEach(async () => {
  // close connections for DB,...
  //await mongoose.disconnect();
});
